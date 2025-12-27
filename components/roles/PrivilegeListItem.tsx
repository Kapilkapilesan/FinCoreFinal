import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Privilege } from '../../types/role.types';

interface PrivilegeListItemProps {
    privilege: Privilege;
    onEdit: (privilege: Privilege) => void;
    onDelete: (id: string) => void;
}

export function PrivilegeListItem({ privilege, onEdit, onDelete }: PrivilegeListItemProps) {
    return (
        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50 hover:shadow-md transition-all group">
            <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    {privilege.display_name || privilege.name}
                </p>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-[9px] font-mono text-blue-500/70 dark:text-blue-400/50 uppercase tracking-tighter">
                        {privilege.name}
                    </span>
                    {privilege.is_core && (
                        <span className="text-[8px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded font-black uppercase tracking-tighter ring-1 ring-red-600/20">
                            Core
                        </span>
                    )}
                    {privilege.module && (
                        <span className="text-[8px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-black uppercase tracking-tighter">
                            {privilege.module}
                        </span>
                    )}
                </div>
                {privilege.description && (
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed italic">
                        {privilege.description}
                    </p>
                )}
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={() => onEdit(privilege)}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                    <Edit size={14} />
                </button>
                <button
                    onClick={() => onDelete(privilege.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                    <Trash2 size={14} />
                </button>
            </div>
        </div>
    );
}
