import React, { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { User } from '../../types/staff.types';
import { staffService } from '../../services/staff.service';
import { StaffDetailsModal } from './StaffDetailsModal';

interface StaffTableProps {
    users: User[];
    onEdit: (user: User) => void;
    onDelete: (userId: string) => void;
}

export function StaffTable({ users, onEdit, onDelete }: StaffTableProps) {
    const [selectedStaff, setSelectedStaff] = useState<any>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [loadingDetails, setLoadingDetails] = useState(false);

    const handleNameClick = async (user: User) => {
        // Check if this user has a staffId (meaning they're a staff member)
        if (user.staffId) {
            setLoadingDetails(true);
            try {
                const staffDetails = await staffService.getStaffDetails(user.staffId);
                if (staffDetails) {
                    setSelectedStaff(staffDetails);
                    setShowDetailsModal(true);
                }
            } catch (error) {
                console.error('Failed to load staff details', error);
            } finally {
                setLoadingDetails(false);
            }
        }
    };

    return (
        <div>
            <div className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 px-6 py-3">
                <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                    <div className="col-span-3">Name</div>
                    <div className="col-span-3">Email</div>
                    <div className="col-span-2">Role</div>
                    <div className="col-span-2">Branch</div>
                    <div className="col-span-1">Status</div>
                    <div className="col-span-1">Actions</div>
                </div>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {users.map((user) => {
                    const isStaff = !!user.staffId; // Check if user has a staffId

                    return (
                        <div key={user.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <div className="grid grid-cols-12 gap-4 items-center">
                                <div className="col-span-3 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <span className="text-white text-sm font-semibold">{user.name.charAt(0)}</span>
                                    </div>
                                    {isStaff ? (
                                        <button
                                            onClick={() => handleNameClick(user)}
                                            disabled={loadingDetails}
                                            className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 truncate text-left underline decoration-dotted hover:decoration-solid transition-all disabled:opacity-50"
                                        >
                                            {loadingDetails ? 'Loading...' : user.name}
                                        </button>
                                    ) : (
                                        <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{user.name}</p>
                                    )}
                                </div>
                                <div className="col-span-3">
                                    <p className="text-sm text-gray-700 dark:text-gray-300">{user.email}</p>
                                </div>
                                <div className="col-span-2">
                                    <span className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs font-medium">
                                        {user.role}
                                    </span>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm text-gray-700 dark:text-gray-300">{user.branch}</p>
                                </div>
                                <div className="col-span-1">
                                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${user.status === 'Active'
                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                        : 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300'
                                        }`}>
                                        {user.status}
                                    </span>
                                </div>
                                <div className="col-span-1 flex items-center gap-2">
                                    <button
                                        onClick={() => onEdit(user)}
                                        className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded text-blue-600 dark:text-blue-400"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(user.id)}
                                        className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/30 rounded text-red-600 dark:text-red-400"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Pagination */}
            <div className="bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 px-6 py-3">
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Showing <span className="font-medium">{users.length}</span> of <span className="font-medium">{users.length}</span> users
                    </p>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 disabled:opacity-50">
                            Previous
                        </button>
                        <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
                            1
                        </button>
                        <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 disabled:opacity-50">
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Staff Details Modal */}
            {showDetailsModal && selectedStaff && (
                <StaffDetailsModal
                    staff={selectedStaff}
                    onClose={() => {
                        setShowDetailsModal(false);
                        setSelectedStaff(null);
                    }}
                />
            )}
        </div>
    );
}
