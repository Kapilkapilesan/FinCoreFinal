import React, { useState } from 'react';
import { Menu, Bell, Search, User, LogOut, ChevronDown, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface HeaderProps {
    user: {
        name: string;
        role: string;
        branch?: string;
    };
    onLogout: () => void;
    onToggleSidebar: () => void;
}

export function Header({ user, onLogout, onToggleSidebar }: HeaderProps) {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [userStatus, setUserStatus] = useState<'office_work' | 'on_field' | 'logout'>('office_work');
    const { isDarkMode, toggleTheme } = useTheme();
    const [notifications] = useState([
        { id: 1, message: '3 loans pending approval', type: 'warning', time: '10 min ago' },
        { id: 2, message: 'New collection completed', type: 'success', time: '1 hour ago' },
        { id: 3, message: 'Payment reversal requested', type: 'alert', time: '2 hours ago' }
    ]);
    const [showNotifications, setShowNotifications] = useState(false);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'office_work':
                return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
            case 'on_field':
                return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
            case 'logout':
                return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
            default:
                return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'office_work':
                return 'Office Work';
            case 'on_field':
                return 'On Field';
            case 'logout':
                return 'Logged Out';
            default:
                return status;
        }
    };

    return (
        <header className="bg-white dark:bg-gray-800 h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700 transition-colors">
            {/* Left Section */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onToggleSidebar}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors lg:hidden"
                >
                    <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>

                {/* Search Bar */}
                <div className="relative hidden md:block">
                    <Search className="w-5 h-5 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search customers, loans, contracts..."
                        className="pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-transparent dark:border-gray-700 rounded-xl w-80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-800 focus:border-blue-200 dark:focus:border-blue-600 transition-all text-sm text-gray-900 dark:text-gray-100"
                    />
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
                {/* Date & Time */}
                <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-900 rounded-xl">
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                </div>

                {/* Dark Mode Toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                    title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                    {isDarkMode ? (
                        <Sun className="w-5 h-5 text-yellow-500" />
                    ) : (
                        <Moon className="w-5 h-5 text-gray-600" />
                    )}
                </button>

                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors relative"
                    >
                        <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        {notifications.length > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-800"></span>
                        )}
                    </button>

                    {/* Notifications Dropdown */}
                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 z-50">
                            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                                <h3 className="text-gray-900 dark:text-gray-100 font-semibold tracking-tight">Notifications</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-0.5">{notifications.length} unread</p>
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                {notifications.map(notif => (
                                    <div
                                        key={notif.id}
                                        className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-50 dark:border-gray-700 cursor-pointer transition-colors"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`w-2 h-2 rounded-full mt-2 ${notif.type === 'warning' ? 'bg-yellow-500' :
                                                    notif.type === 'success' ? 'bg-green-500' :
                                                        'bg-red-500'
                                                }`}></div>
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-900 dark:text-gray-100 font-medium leading-relaxed">{notif.message}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">{notif.time}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-3 text-center border-t border-gray-100 dark:border-gray-700">
                                <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold">
                                    View all notifications
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* User Menu */}
                <div className="relative">
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center gap-3 pl-2 pr-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                    >
                        <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        <div className="hidden md:block text-left">
                            <p className="text-sm text-gray-900 dark:text-gray-100 font-semibold tracking-tight">{user.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{user.role}</p>
                        </div>
                        <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400 hidden md:block" />
                    </button>

                    {/* User Dropdown */}
                    {showUserMenu && (
                        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 z-50">
                            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                                <p className="text-gray-900 dark:text-gray-100 font-semibold tracking-tight">{user.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-0.5">{user.role}</p>
                                {user.branch && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">Branch: {user.branch}</p>
                                )}
                                <div className="mt-3">
                                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Work Status</label>
                                    <select
                                        value={userStatus}
                                        onChange={(e) => setUserStatus(e.target.value as any)}
                                        className={`w-full px-3 py-1.5 rounded-lg text-xs font-medium ${getStatusColor(userStatus)} border-0 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    >
                                        <option value="office_work">Office Work</option>
                                        <option value="on_field">On Field</option>
                                    </select>
                                </div>
                            </div>
                            <div className="p-2">
                                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors font-medium">
                                    <User className="w-4 h-4" />
                                    <span className="text-sm">Profile Settings</span>
                                </button>
                                <button
                                    onClick={onLogout}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors mt-1 font-medium"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span className="text-sm">Logout</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
