import React from 'react';
import { Permission } from '../../types/staff.types';

interface RolePermissionsTableProps {
    roles: string[];
    permissions: Permission[];
}

export function RolePermissionsTable({ roles, permissions }: RolePermissionsTableProps) {
    return (
        <div className="p-6">
            <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Available Roles</h3>
                <div className="flex flex-wrap gap-2">
                    {roles.map((role: any) => (
                        <button
                            key={role.id || role}
                            className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-sm font-medium"
                        >
                            {role.display_name || role}
                        </button>
                    ))}
                </div>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
                    <div className="grid grid-cols-5 gap-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                        <div className="col-span-1">Module</div>
                        <div className="col-span-1 text-center">View</div>
                        <div className="col-span-1 text-center">Create</div>
                        <div className="col-span-1 text-center">Edit</div>
                        <div className="col-span-1 text-center">Delete</div>
                    </div>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    {permissions.map((perm, index) => (
                        <div key={index} className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <div className="grid grid-cols-5 gap-4 items-center">
                                <div className="col-span-1">
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{perm.module}</p>
                                </div>
                                <div className="col-span-1 flex justify-center">
                                    <input
                                        type="checkbox"
                                        checked={perm.view}
                                        readOnly
                                        className="w-4 h-4 text-blue-600 rounded border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="col-span-1 flex justify-center">
                                    <input
                                        type="checkbox"
                                        checked={perm.create}
                                        readOnly
                                        className="w-4 h-4 text-blue-600 rounded border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="col-span-1 flex justify-center">
                                    <input
                                        type="checkbox"
                                        checked={perm.edit}
                                        readOnly
                                        className="w-4 h-4 text-blue-600 rounded border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="col-span-1 flex justify-center">
                                    <input
                                        type="checkbox"
                                        checked={perm.delete}
                                        readOnly
                                        className="w-4 h-4 text-blue-600 rounded border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-4 flex justify-end">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    Save Permissions
                </button>
            </div>
        </div>
    );
}
