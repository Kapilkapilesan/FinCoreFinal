import React from 'react';
import { Check } from 'lucide-react';
import { Permission, Privilege } from '../../types/role.types';
import { authService } from '../../services/auth.service';

interface PermissionsTableProps {
    permissions: Permission[];
    availablePrivileges: Privilege[];
    onChange?: (moduleIndex: number, privilegeName: string, value: boolean) => void;
    readOnly?: boolean;
}

export function PermissionsTable({ permissions, availablePrivileges, onChange, readOnly = false }: PermissionsTableProps) {
    return (
        <div className="relative overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-700/50 bg-white dark:bg-gray-800/50">
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 dark:bg-gray-900/30">
                            <th className="sticky left-0 z-10 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 border-r border-gray-100 dark:border-gray-700/50">
                                Module
                            </th>
                            {availablePrivileges.map(priv => (
                                <th key={priv.id} className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center min-w-[100px]">
                                    {priv.name}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                        {permissions.map((perm, modIdx) => (
                            <tr key={perm.module} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/20 transition-colors">
                                <td className="sticky left-0 z-10 bg-white dark:bg-gray-800 px-6 py-4 text-sm font-bold text-gray-700 dark:text-gray-200 border-r border-gray-100 dark:border-gray-700/50">
                                    {perm.module}
                                </td>
                                {availablePrivileges.map(priv => {
                                    const isChecked = perm.permissions[priv.name] || false;
                                    const userHasPermission = authService.hasModulePermission(perm.module, priv.name);
                                    const isUnauthorizedAssignment = isChecked && !userHasPermission;

                                    return (
                                        <td key={priv.id} className="px-6 py-4 text-center">
                                            {readOnly ? (
                                                <div className={`mx-auto w-5 h-5 rounded-full flex items-center justify-center transition-all ${isChecked
                                                    ? isUnauthorizedAssignment ? 'bg-red-500 text-white' : 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                                    : 'bg-gray-100 dark:bg-gray-700 text-transparent'
                                                    }`}>
                                                    <Check size={12} strokeWidth={4} />
                                                </div>
                                            ) : (
                                                <label className={`relative flex items-center justify-center cursor-pointer group ${!userHasPermission ? 'cursor-not-allowed' : ''}`}>
                                                    <input
                                                        type="checkbox"
                                                        checked={isChecked}
                                                        onChange={(e) => {
                                                            // Permit checking ONLY if user has permission
                                                            // ALWAYS permit unchecking (to fix unauthorized template fills)
                                                            if (userHasPermission || !e.target.checked) {
                                                                onChange?.(modIdx, priv.name, e.target.checked);
                                                            }
                                                        }}
                                                        disabled={!userHasPermission && !isChecked}
                                                        className="peer sr-only"
                                                    />
                                                    <div className={`w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center group-hover:scale-110 active:scale-95
                                                        ${isUnauthorizedAssignment
                                                            ? 'border-red-500 bg-red-500/10'
                                                            : 'border-gray-200 dark:border-gray-700 peer-checked:border-blue-600 peer-checked:bg-blue-600'}
                                                    `}>
                                                        <Check className={`w-4 h-4 text-white transition-opacity ${isChecked ? 'opacity-100' : 'opacity-0'}`} strokeWidth={3} />
                                                    </div>
                                                    {isUnauthorizedAssignment && (
                                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                                                            <div className="w-0.5 h-1.5 bg-white rounded-full" />
                                                        </div>
                                                    )}
                                                    {!userHasPermission && (
                                                        <div className="absolute top-full mt-2 hidden group-hover:block z-50">
                                                            <div className="bg-red-600 text-[8px] text-white font-black px-2 py-1 rounded whitespace-nowrap uppercase tracking-widest shadow-xl">
                                                                Unauthorized: You cannot grant this permission
                                                            </div>
                                                        </div>
                                                    )}
                                                </label>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
