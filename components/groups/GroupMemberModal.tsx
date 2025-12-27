'use client'

import React from 'react';
import { X, UserPlus } from 'lucide-react';
import { Group, GroupMember } from '../../types/group.types';

interface GroupMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    group: Group | null;
}

export function GroupMemberModal({ isOpen, onClose, group }: GroupMemberModalProps) {
    if (!isOpen || !group) return null;

    const members = group.members || [];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">{group.group_name}</h2>
                            <p className="text-sm text-gray-600 mt-1">
                                {members.length} {members.length === 1 ? 'Member' : 'Members'}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {group.customers && group.customers.length > 0 ? (
                        <div className="space-y-3">
                            {group.customers.map((customer) => (
                                <div
                                    key={customer.id}
                                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-100">
                                            <span className="text-white text-base font-bold">
                                                {customer.full_name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{customer.full_name}</p>
                                            <p className="text-xs text-gray-500 font-mono uppercase">{customer.customer_code}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold capitalize ${customer.status === 'active'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                                }`}
                                        >
                                            {customer.status || 'Active'}
                                        </span>
                                        <p className="text-[10px] text-gray-400 mt-1 uppercase font-semibold">
                                            {customer.city} • {customer.district}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : members.length > 0 ? (
                        <div className="space-y-3">
                            {members.map((member) => (
                                <div
                                    key={member.id}
                                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                            <span className="text-white text-sm font-semibold">
                                                {member.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{member.name}</p>
                                            <p className="text-sm text-gray-600">{member.customer_id}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span
                                            className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium capitalize ${member.status === 'active'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-700'
                                                }`}
                                        >
                                            {member.status}
                                        </span>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Joined {new Date(member.joined_date).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No members in this group yet.</p>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-gray-200 flex gap-3 justify-end bg-gray-50">
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm flex items-center gap-2"
                        onClick={() => alert('Add member functionality coming soon!')}
                    >
                        <UserPlus className="w-4 h-4" />
                        Add Member
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-white transition-colors font-medium text-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
