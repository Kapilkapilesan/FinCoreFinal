import React from 'react';
import { Users, UserCheck, Shield, Activity } from 'lucide-react';
import { CustomerStats as CustomerStatsType } from '../../types/customer.types';

interface CustomerStatsProps {
    stats: CustomerStatsType;
    pendingRequestsCount?: number;
}

export function CustomerStatsCard({ stats, pendingRequestsCount = 0 }: CustomerStatsProps) {
    const { totalCustomers, activeCustomers, customersWithLoans, newThisMonth } = stats;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Customers */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded">
                        +{newThisMonth} this month
                    </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalCustomers}</p>
            </div>

            {/* Active Customers */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                        <UserCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        {totalCustomers > 0 ? ((activeCustomers / totalCustomers) * 100).toFixed(0) : 0}%
                    </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Active Customers</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{activeCustomers}</p>
            </div>

            {/* With Active Loans */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        {totalCustomers > 0 ? ((customersWithLoans / totalCustomers) * 100).toFixed(0) : 0}%
                    </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">With Active Loans</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{customersWithLoans}</p>
            </div>

            {/* Pending Requests */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                        <Activity className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    {pendingRequestsCount > 0 && (
                        <span className="text-xs font-medium text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30 px-2 py-1 rounded">
                            Action needed
                        </span>
                    )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Pending Requests</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{pendingRequestsCount}</p>
            </div>
        </div>
    );
}
