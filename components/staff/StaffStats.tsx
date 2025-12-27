import React from 'react';
import { Users, UserCheck, Shield } from 'lucide-react';
import { StaffStats } from '../../types/staff.types';

interface StaffStatsProps {
    stats: StaffStats;
}

export function StaffStatsCard({ stats }: StaffStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalUsers}</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                        <UserCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        {stats.totalUsers > 0 ? ((stats.activeUsers / stats.totalUsers) * 100).toFixed(0) : 0}%
                    </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Active Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.activeUsers}</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">User Roles</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalRoles}</p>
            </div>
        </div>
    );
}
