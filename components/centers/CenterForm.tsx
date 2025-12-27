import React, { useState, useEffect } from 'react';
import { CenterFormData, ScheduleItem } from '../../types/center.types';
import { Branch } from '../../types/branch.types';
import { Staff } from '../../types/staff.types';
import { branchService } from '../../services/branch.service';
import { API_BASE_URL, getHeaders } from '../../services/api.config';
import { X, Plus, Trash2, Loader2 } from 'lucide-react';

interface CenterFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CenterFormData) => void;
    initialData?: CenterFormData | null;
}

export function CenterForm({ isOpen, onClose, onSubmit, initialData }: CenterFormProps) {
    const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [staffList, setStaffList] = useState<Staff[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [currentUserRole, setCurrentUserRole] = useState<string>('');

    // Load user role
    useEffect(() => {
        const storedRolesStr = localStorage.getItem('roles');
        if (storedRolesStr) {
            try {
                const userRoles = JSON.parse(storedRolesStr);
                if (Array.isArray(userRoles) && userRoles.length > 0) {
                    const roles = userRoles.map((r: any) => r.name);
                    if (roles.includes('field_officer')) {
                        setCurrentUserRole('field_officer');
                    } else if (roles.includes('super_admin')) {
                        setCurrentUserRole('super_admin');
                    } else if (roles.includes('admin')) {
                        setCurrentUserRole('admin');
                    } else {
                        setCurrentUserRole(roles[0]);
                    }
                }
            } catch (e) {
                console.error("Error parsing roles", e);
            }
        }
    }, []);

    // Load form data only when opened and wait for it
    useEffect(() => {
        // Load user role from localStorage
        const storedRolesStr = localStorage.getItem('roles');
        if (storedRolesStr) {
            try {
                const userRoles = JSON.parse(storedRolesStr);
                if (Array.isArray(userRoles) && userRoles.length > 0) {
                    // Just take the first one or prioritize field_officer for this logic
                    const roles = userRoles.map(r => r.name);
                    if (roles.includes('field_officer')) {
                        setCurrentUserRole('field_officer');
                    } else if (roles.includes('super_admin')) {
                        setCurrentUserRole('super_admin');
                    } else if (roles.includes('admin')) {
                        setCurrentUserRole('admin');
                    } else {
                        setCurrentUserRole(roles[0]);
                    }
                }
            } catch (e) {
                console.error("Error parsing roles", e);
            }
        }

        const loadFormData = async () => {
            if (!isOpen) return;

            setIsLoadingData(true);
            try {
                // Fetch branches and field officers in parallel
                const [branchesData, fieldOfficersResponse] = await Promise.all([
                    branchService.getBranches(),
                    fetch(`${API_BASE_URL}/staffs/by-role/field_officer`, {
                        headers: getHeaders()
                    }).then(res => res.json())
                ]);

                setBranches(branchesData || []);

                // Handle varied API response structures for field officers
                if (fieldOfficersResponse?.data) {
                    setStaffList(fieldOfficersResponse.data);
                } else if (Array.isArray(fieldOfficersResponse)) {
                    setStaffList(fieldOfficersResponse);
                }

            } catch (error) {
                console.error('Failed to load form data:', error);
            } finally {
                setIsLoadingData(false);
            }
        };

        loadFormData();
    }, [isOpen]);

    // Handle initial data for schedules
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setSchedules(initialData.open_days || []);
            } else {
                setSchedules([]);
            }
        }
    }, [isOpen, initialData]);

    const handleAddSchedule = () => {
        // Default to today's date for new schedules
        const today = new Date().toISOString().split('T')[0];
        setSchedules([...schedules, { day: '', date: today, time: '10:00' }]);
    };

    const handleRemoveSchedule = (index: number) => {
        setSchedules(schedules.filter((_, i) => i !== index));
    };

    const handleScheduleChange = (index: number, field: keyof ScheduleItem, value: string) => {
        const newSchedules = [...schedules];

        if (field === 'date') {
            // When date changes, automatically update the day name
            const dateObj = new Date(value);
            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
            newSchedules[index] = { ...newSchedules[index], [field]: value, day: dayName };
        } else {
            newSchedules[index] = { ...newSchedules[index], [field]: value };
        }

        setSchedules(newSchedules);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const data: CenterFormData = {
            CSU_id: formData.get('CSU_id') as string,
            center_name: formData.get('center_name') as string,
            branch_id: formData.get('branch_id') as string,
            staff_id: (formData.get('contactPerson') as string) || null,
            address: formData.get('address') as string,
            location: formData.get('locationType') as string,
            status: (formData.get('status') as 'active' | 'inactive') || 'active',
            open_days: schedules,
            meetingTime: schedules.length > 0 ? schedules[0].time : undefined,
        };

        onSubmit(data);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between z-10">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {initialData ? 'Edit Center' : 'Create New Center'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                    >
                        <X size={24} />
                    </button>
                </div>

                {isLoadingData ? (
                    <div className="p-20 flex flex-col items-center justify-center space-y-4">
                        <Loader2 size={40} className="animate-spin text-blue-600" />
                        <p className="text-gray-500 font-medium">Loading form details...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* CSU ID Hidden or Commented as per user's manual edit */}
                            {/* 
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    CSU ID <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="CSU_id"
                                    required
                                    defaultValue={initialData?.CSU_id}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="e.g. C001"
                                />
                            </div> 
                            */}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Center Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="center_name"
                                    required
                                    defaultValue={initialData?.center_name}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="Enter center name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Branch <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="branch_id"
                                    required
                                    defaultValue={initialData?.branch_id}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                                >
                                    <option value="">Select Branch</option>
                                    {branches.map((branch) => (
                                        <option key={branch.id} value={branch.id}>
                                            {branch.branch_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Location Type <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="locationType"
                                    required
                                    defaultValue={initialData?.location}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="e.g. Urban, Rural"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Address <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="address"
                                required
                                defaultValue={initialData?.address}
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                                placeholder="Full address of the center"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {currentUserRole !== 'field_officer' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Field Officer <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="contactPerson"
                                        defaultValue={initialData?.staff_id || ""}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                                        required
                                    >
                                        <option value="">Select Officer</option>
                                        {staffList.map((staff) => (
                                            <option key={staff.staff_id} value={staff.staff_id}>
                                                {staff.full_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    defaultValue={initialData?.status || 'active'}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                            <div className="flex items-center justify-between mb-3">
                                <label className="block text-sm font-medium text-gray-700">
                                    Meeting Schedules
                                </label>
                                <button
                                    type="button"
                                    onClick={handleAddSchedule}
                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                                >
                                    <Plus size={16} /> Add Schedule
                                </button>
                            </div>

                            <div className="space-y-3">
                                {schedules.map((schedule, idx) => (
                                    <div key={idx} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center animate-in fade-in slide-in-from-top-1 duration-200 bg-white p-3 rounded-lg border border-gray-200">
                                        <div className="flex-1 w-full sm:w-auto">
                                            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Meeting Date</label>
                                            <input
                                                type="date"
                                                value={schedule.date || ''}
                                                onChange={(e) => handleScheduleChange(idx, 'date', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>

                                        <div className="w-full sm:w-32">
                                            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Day</label>
                                            <input
                                                type="text"
                                                value={schedule.day}
                                                readOnly
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 outline-none font-medium cursor-default"
                                            />
                                        </div>

                                        <div className="w-full sm:w-32">
                                            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Time</label>
                                            <input
                                                type="time"
                                                value={schedule.time}
                                                onChange={(e) => handleScheduleChange(idx, 'time', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>

                                        <div className="pt-5 sm:pt-0">
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveSchedule(idx)}
                                                className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                                title="Remove schedule"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {schedules.length === 0 && (
                                    <div className="text-center py-4 text-gray-500 text-sm italic bg-white rounded border border-dashed border-gray-300">
                                        No meeting schedules configured
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-100 flex gap-3 justify-end">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-sm transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors flex items-center gap-2"
                            >
                                {initialData ? 'Update Center' : 'Create Center'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
