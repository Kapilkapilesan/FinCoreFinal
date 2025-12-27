import React from 'react';
import { Building2, TrendingUp, Users } from 'lucide-react';
import { BranchStats as BranchStatsType } from '../../types/branch.types';
import { colors } from '../../themes/colors';

interface BranchStatsProps {
    stats: BranchStatsType;
}

export function BranchStats({ stats }: BranchStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Branches */}
            <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.primary[50] }}>
                        <Building2 className="w-5 h-5" style={{ color: colors.primary[600] }} />
                    </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">Total Branches</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBranches}</p>
            </div>

            {/* Active Branches */}
            <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.success[100] }}>
                        <TrendingUp className="w-5 h-5" style={{ color: colors.success[600] }} />
                    </div>
                    <span className="text-xs font-medium text-gray-600">
                        {stats.totalBranches > 0 ? ((stats.activeBranches / stats.totalBranches) * 100).toFixed(0) : 0}%
                    </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">Active Branches</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeBranches}</p>
            </div>

            {/* Total Customers */}
            <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-purple-600" />
                    </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
            </div>

            {/* Total Loans */}
            <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-orange-600" />
                    </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">Total Loans</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalLoans}</p>
            </div>
        </div>
    );
}
