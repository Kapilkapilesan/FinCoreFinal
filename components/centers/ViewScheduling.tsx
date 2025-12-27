'use client'

import React, { useState, useEffect } from 'react';
import { Search, Plus, Users } from 'lucide-react';
import { Center, CenterFormData, TemporaryAssignment } from '../../types/center.types';
import { CenterForm } from './CenterForm';
import { CenterTable } from './CenterTable';
import { centerService } from '../../services/center.service';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function ViewScheduling() {
    const [centers, setCenters] = useState<Center[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch centers on mount
    useEffect(() => {
        loadCenters();
    }, []);

    const loadCenters = async () => {
        try {
            setIsLoading(true);
            const data = await centerService.getCenters();
            setCenters(data);
        } catch (err: any) {
            console.error('Failed to load centers:', err);
            // Fallback for demo purposes if API fails, or show error
            // setError(err.message || 'Failed to load centers'); 
            setError(err.message || 'Failed to load centers. Please check your connection.');
        } finally {
            setIsLoading(false);
        }
    };

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingCenter, setEditingCenter] = useState<Center | null>(null);

    const handleCreateCenter = async (centerData: CenterFormData) => {
        try {
            if (editingCenter) {
                const updatedCenter = await centerService.updateCenter(editingCenter.id, centerData);
                setCenters(centers.map(c => c.id === updatedCenter.id ? updatedCenter : c));
                toast.success('Center updated successfully!');
            } else {
                const newCenter = await centerService.createCenter(centerData);
                setCenters([...centers, newCenter]);
                toast.success('Center created successfully!');
            }
            setIsCreateModalOpen(false);
            setEditingCenter(null);
        } catch (err: any) {
            console.error('Failed to save center:', err);
            const errorMessage = err.errors ?
                Object.values(err.errors).flat().join(', ') :
                err.message || 'Failed to save center';
            toast.error(errorMessage);
        }
    };

    const handleEdit = (centerId: string) => {
        const center = centers.find(c => c.id === centerId);
        if (center) {
            setEditingCenter(center);
            setIsCreateModalOpen(true);
        }
    };

    const [temporaryAssignments] = useState<TemporaryAssignment[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('temporaryAssignments');
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDay, setSelectedDay] = useState('');

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const filteredCenters = centers.filter(center => {
        const matchesSearch = center.center_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            center.CSU_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(center.branch_id).toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDay = !selectedDay || (center.open_days && center.open_days.some(s => s.day === selectedDay));
        return matchesSearch && matchesDay;
    });

    const getTemporaryAssignment = (centerId: string) => {
        const today = new Date().toISOString().split('T')[0];
        return temporaryAssignments.find(assignment =>
            assignment.centerId === centerId &&
            assignment.date === today
        );
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-red-600">
                <p>{error}</p>
                <button
                    onClick={loadCenters}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Center Scheduling</h1>
                    <p className="text-sm text-gray-500 mt-1">View and manage center meeting schedules</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
                >
                    <Plus className="w-4 h-4" />
                    Create Center
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[300px]">
                        <div className="relative">
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search centers by name, number, or branch..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="min-w-[200px]">
                        <select
                            value={selectedDay}
                            onChange={(e) => setSelectedDay(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">All Days</option>
                            {daysOfWeek.map(day => (
                                <option key={day} value={day}>{day}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Centers List */}
            <CenterTable
                centers={filteredCenters}
                totalCenters={centers.length}
                getTemporaryAssignment={getTemporaryAssignment}
                onEdit={handleEdit}
                onViewSchedule={(id) => console.log('View schedule:', id)}
            />

            {filteredCenters.length === 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No centers found</h3>
                    <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
                </div>
            )}

            {/* Create Center Modal */}
            <CenterForm
                isOpen={isCreateModalOpen}
                onClose={() => {
                    setIsCreateModalOpen(false);
                    setEditingCenter(null);
                }}
                initialData={editingCenter}
                onSubmit={handleCreateCenter}
            />
        </div>
    );
}
