import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MOCK_NOTIFICATIONS = [
    { id: '1', category: 'assignment', type: 'info', title: 'New Assignment Posted', message: 'Prof. Alan Turing posted a new assignment in "Data Structures": B-Tree Implementation.', time: '10 mins ago', read: false },
    { id: '2', category: 'fee', type: 'alert', title: 'Fee Due Reminder', message: 'Hostel Maintenance Fee of $150 is due in 3 days. Please clear it via the Finance portal.', time: '2 hours ago', read: false },
    { id: '3', category: 'chat', type: 'info', title: 'New Mention', message: 'Dr. Sarah Connor mentioned you in "Advanced Mathematics" chat: "@Alex, please check the matrix inversion step."', time: '5 hours ago', read: true },
    { id: '4', category: 'exam', type: 'alert', title: 'Exam Schedule Published', message: 'Mid-term practical schedules for CS dept have been released on the portal.', time: 'Yesterday', read: true },
    { id: '5', category: 'system', type: 'success', title: 'Profile Approved', message: 'Your administrative profile verification was completed successfully.', time: '2 days ago', read: true },
];

export default function NotificationsScreen({ onBack }: { onBack?: () => void }) {
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
    const [filter, setFilter] = useState<'all' | 'unread' | 'assignment' | 'fee' | 'chat'>('all');

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const deleteNotification = (id: string) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const toggleRead = (id: string) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: !n.read } : n));
    };

    const getIcon = (category: string, type: string) => {
        if (category === 'fee') return <Ionicons name="card-outline" size={24} color="#fb923c" />;
        if (category === 'chat') return <Ionicons name="chatbubble-ellipses-outline" size={24} color="#22d3ee" />;
        if (category === 'assignment') return <Ionicons name="book-outline" size={24} color="#60a5fa" />;
        if (category === 'exam') return <Ionicons name="time-outline" size={24} color="#c084fc" />;
        if (type === 'success') return <Ionicons name="checkmark-circle-outline" size={24} color="#34d399" />;
        if (type === 'alert') return <Ionicons name="warning-outline" size={24} color="#f87171" />;
        return <Ionicons name="information-circle-outline" size={24} color="#9ca3af" />;
    };

    const getBgTheme = (type: string, read: boolean) => {
        if (read) return 'bg-white/5 border-white/5 opacity-75';
        switch (type) {
            case 'success': return 'bg-emerald-500/10 border-emerald-500/30';
            case 'alert': return 'bg-orange-500/10 border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.1)]';
            default: return 'bg-blue-500/10 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]';
        }
    };

    const filtered = notifications.filter(n => {
        if (filter === 'all') return true;
        if (filter === 'unread') return !n.read;
        return n.category === filter;
    });

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <ScrollView className="flex-1 bg-[#101827] px-4 pt-4 pb-12">
            <View className="flex-row items-center justify-between mb-4 mt-2">
                <View className="flex-row items-center flex-1">
                    {onBack && (
                        <TouchableOpacity onPress={onBack} className="w-10 h-10 rounded-full bg-[#1e293b] border border-white/5 items-center justify-center mr-3">
                            <Ionicons name="chevron-back" size={24} color="#94a3b8" />
                        </TouchableOpacity>
                    )}
                    <Ionicons name="notifications" size={28} color="#60a5fa" />
                    <Text className="text-white text-2xl font-bold ml-2">Notifications</Text>
                </View>
                <TouchableOpacity
                    onPress={markAllRead}
                    className="px-3 py-2 bg-white/5 rounded-xl flex-row items-center border border-white/10"
                >
                    <Ionicons name="checkmark-done" size={16} color="#34d399" />
                    <Text className="text-white text-xs font-bold ml-2">Mark All Read</Text>
                </TouchableOpacity>
            </View>

            <Text className="text-gray-400 mb-4 ml-1">You have <Text className="text-white font-bold">{unreadCount} unread</Text> alerts.</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                {(['all', 'unread', 'assignment', 'fee', 'chat'] as const).map(f => (
                    <TouchableOpacity
                        key={f}
                        onPress={() => setFilter(f)}
                        className={`px-4 py-2 rounded-xl mr-2 flex-row items-center justify-center ${filter === f ? 'bg-blue-600' : 'bg-[#1e293b] border border-white/5'}`}
                    >
                        <Text className={`capitalize font-bold text-sm ${filter === f ? 'text-white' : 'text-gray-400'}`}>
                            {f === 'all' ? 'All Alerts' : f}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <View className="space-y-4 pb-20">
                {filtered.length === 0 ? (
                    <View className="items-center justify-center p-12 bg-[#1e293b] rounded-3xl border border-white/5 mt-4">
                        <Ionicons name="checkmark-circle-outline" size={64} color="rgba(52, 211, 153, 0.5)" />
                        <Text className="text-white font-bold text-xl mt-4">You're all caught up!</Text>
                        <Text className="text-gray-500 text-sm mt-2">No notifications found.</Text>
                    </View>
                ) : (
                    filtered.map((notif) => (
                        <TouchableOpacity
                            key={notif.id}
                            onPress={() => toggleRead(notif.id)}
                            className={`p-4 rounded-2xl border flex-row overflow-hidden ${getBgTheme(notif.type, notif.read)}`}
                        >
                            {!notif.read && (
                                <View className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                            )}
                            <View className={`w-12 h-12 rounded-full items-center justify-center mr-4 mt-1 ${notif.read ? 'bg-black/20' : 'bg-black/40'}`}>
                                {getIcon(notif.category, notif.type)}
                            </View>
                            <View className="flex-1">
                                <View className="flex-row items-center justify-between mb-1">
                                    <Text className={`font-bold text-base flex-1 ${notif.read ? 'text-gray-400' : 'text-white'}`} numberOfLines={1}>{notif.title}</Text>
                                    <Text className="text-[10px] font-bold text-gray-400 bg-black/20 px-2 py-1 rounded-full ml-2">{notif.time}</Text>
                                </View>
                                <Text className={`text-sm leading-relaxed ${notif.read ? 'text-gray-500' : 'text-gray-300'}`}>{notif.message}</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => deleteNotification(notif.id)}
                                className="ml-2 mt-1 justify-center items-center"
                            >
                                <Ionicons name="close" size={20} color="#f87171" className="opacity-50" />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    ))
                )}
            </View>
        </ScrollView>
    );
}
