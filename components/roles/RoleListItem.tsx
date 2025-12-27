import React from 'react';
import { Shield, Edit, Trash2, Users } from 'lucide-react';
import { Role } from '../../types/role.types';

interface RoleListItemProps {
    role: Role;
    isActive: boolean;
    onClick: () => void;
    onEdit: (role: Role) => void;
    onDelete: (id: string) => void;
}

export function RoleListItem({ role, isActive, onClick, onEdit, onDelete }: RoleListItemProps) {
    return (
        <div
            onClick={onClick}
            className={`w-full text-left p-5 rounded-3xl border transition-all cursor-pointer relative group ${isActive
                ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 ring-4 ring-blue-500/5'
                : 'border-gray-100 dark:border-gray-700/50 bg-white dark:bg-gray-800/50 hover:border-blue-300 dark:hover:border-blue-700'
                }`}
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${isActive ? 'bg-blue-600 text-white' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'}`}>
                        <Shield size={18} />
                    </div>
                    <div>
                        <span className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            {role.display_name || role.name}
                            {role.is_system && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" title="System Role" />}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={(e) => { e.stopPropagation(); onEdit(role); }}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                    >
                        <Edit size={14} />
                    </button>
                    {!role.is_system && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete(role.id); }}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                        >
                            <Trash2 size={14} />
                        </button>
                    )}
                </div>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">
                {role.description}
            </p>

            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-gray-500">
                <Users size={12} className="text-blue-500/50" />
                <span>{role.userCount} Active Users</span>
            </div>
        </div>
    );
}
