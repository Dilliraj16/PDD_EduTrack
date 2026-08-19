import React, { useState } from 'react';
import { Bell, CheckCircle, Info, AlertTriangle, CreditCard, MessageSquare, BookOpen, Clock, X, CheckCircle2 } from 'lucide-react';

const MOCK_NOTIFICATIONS = [
    { id: '1', category: 'assignment', type: 'info', title: 'New Assignment Posted', message: 'Prof. Alan Turing posted a new assignment in "Data Structures": B-Tree Implementation.', time: '10 mins ago', read: false },
    { id: '2', category: 'fee', type: 'alert', title: 'Fee Due Reminder', message: 'Hostel Maintenance Fee of $150 is due in 3 days. Please clear it via the Finance portal.', time: '2 hours ago', read: false },
    { id: '3', category: 'chat', type: 'info', title: 'New Mention', message: 'Dr. Sarah Connor mentioned you in "Advanced Mathematics" chat: "@Alex, please check the matrix inversion step."', time: '5 hours ago', read: true },
    { id: '4', category: 'exam', type: 'alert', title: 'Exam Schedule Published', message: 'Mid-term practical schedules for CS dept have been released on the portal.', time: 'Yesterday', read: true },
    { id: '5', category: 'system', type: 'success', title: 'Profile Approved', message: 'Your administrative profile verification was completed successfully.', time: '2 days ago', read: true },
];

export default function Notifications() {
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
    const [filter, setFilter] = useState<'all' | 'unread' | 'assignment' | 'fee' | 'chat'>('all');

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const deleteNotification = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const toggleRead = (id: string) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: !n.read } : n));
    };

    const getIcon = (category: string, type: string) => {
        if (category === 'fee') return <CreditCard className="w-6 h-6 text-orange-400" />;
        if (category === 'chat') return <MessageSquare className="w-6 h-6 text-cyan-400" />;
        if (category === 'assignment') return <BookOpen className="w-6 h-6 text-blue-400" />;
        if (category === 'exam') return <Clock className="w-6 h-6 text-purple-400" />;
        if (type === 'success') return <CheckCircle className="w-6 h-6 text-emerald-400" />;
        if (type === 'alert') return <AlertTriangle className="w-6 h-6 text-red-400" />;
        return <Info className="w-6 h-6 text-gray-400" />;
    };

    const getBgTheme = (type: string, read: boolean) => {
        if (read) return 'bg-white/5 border-white/5 opacity-75';
        switch (type) {
            case 'success': return 'bg-emerald-500/10 border-emerald-500/30';
            case 'alert': return 'bg-orange-500/10 border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.1)]';
            default: return 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]';
        }
    };

    const filtered = notifications.filter(n => {
        if (filter === 'all') return true;
        if (filter === 'unread') return !n.read;
        return n.category === filter;
    });

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="space-y-6 max-w-5xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 flex items-center tracking-tight">
                        <Bell className="mr-3 w-8 h-8 text-blue-400" />
                        Notification Center
                    </h1>
                    <p className="text-gray-400 mt-2 ml-1">You have <strong className="text-white">{unreadCount} unread</strong> alerts.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={markAllRead}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-medium transition-colors flex items-center border border-white/10"
                    >
                        <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-400" />
                        Mark all as read
                    </button>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide shrink-0">
                {(['all', 'unread', 'assignment', 'fee', 'chat'] as const).map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-5 py-2 rounded-xl text-sm font-semibold capitalize transition-all whitespace-nowrap ${filter === f
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                                : 'bg-black/20 text-gray-400 hover:bg-white/10 border border-white/5'
                            }`}
                    >
                        {f === 'all' ? 'All Alerts' : f}
                    </button>
                ))}
            </div>

            {/* Notification Stream */}
            <div className="flex-1 overflow-y-auto space-y-4 pb-12 scrollbar-hide">
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 glass-panel rounded-3xl border-white/5 h-64">
                        <CheckCircle2 className="w-16 h-16 text-emerald-400/50 mb-4" />
                        <h3 className="text-xl font-bold text-gray-300">You're all caught up!</h3>
                        <p className="text-gray-500 text-sm mt-2">No notifications found for this filter.</p>
                    </div>
                ) : (
                    filtered.map((notif) => (
                        <div
                            key={notif.id}
                            onClick={() => toggleRead(notif.id)}
                            className={`glass-panel p-5 rounded-2xl border flex items-start gap-5 cursor-pointer transition-all duration-300 relative overflow-hidden group ${getBgTheme(notif.type, notif.read)} hover:-translate-y-0.5`}
                        >
                            {/* Unread indicator */}
                            {!notif.read && (
                                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 shadow-[0_0_10px_#3b82f6]" />
                            )}

                            <div className={`mt-1 p-3 rounded-full shrink-0 ${notif.read ? 'bg-black/20' : 'bg-black/40 shadow-inner'}`}>
                                {getIcon(notif.category, notif.type)}
                            </div>

                            <div className="flex-1 pr-8">
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className={`font-bold text-lg ${notif.read ? 'text-gray-300' : 'text-white'}`}>
                                        {notif.title}
                                    </h3>
                                    <span className="text-xs font-semibold text-gray-500 bg-black/20 px-3 py-1 rounded-full whitespace-nowrap">
                                        {notif.time}
                                    </span>
                                </div>
                                <p className={`leading-relaxed ${notif.read ? 'text-gray-400' : 'text-gray-200'}`}>
                                    {notif.message}
                                </p>
                            </div>

                            {/* Delete specific notification */}
                            <button
                                onClick={(e) => deleteNotification(notif.id, e)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
                            >
                                <X className="w-4 h-4 text-red-400" />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
