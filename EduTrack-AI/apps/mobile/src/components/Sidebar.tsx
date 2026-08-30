import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions, StyleSheet, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store/authStore';

const { width, height } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.75;

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const STUDENT_MENU = [
    { id: 'dashboard', label: 'Dashboard', icon: 'grid-outline' },
    { id: 'goals', label: 'Goals & Progress', icon: 'trending-up-outline' },
    { id: 'timetable', label: 'Timetable', icon: 'calendar-outline' },
    { id: 'enrollment', label: 'Enrollment', icon: 'book-outline' },
    { id: 'courses', label: 'Completed Courses', icon: 'ribbon-outline' },
    { id: 'assignments', label: 'Assignments', icon: 'document-text-outline' },
    { id: 'od-request', label: 'OD Request', icon: 'checkbox-outline' },
    { id: 'chat', label: 'Subject Chat', icon: 'chatbubbles-outline' },
    { id: 'sep1', separator: true },
    { id: 'ai-insights', label: '🤖 AI Mode', icon: 'hardware-chip-outline' },
];

const FACULTY_MENU = [
    { id: 'dashboard', label: 'Dashboard', icon: 'grid-outline' },
    { id: 'student-reg', label: 'Student Reg', icon: 'person-add-outline' },
    { id: 'create-course', label: 'Create Course', icon: 'add-circle-outline' },
    { id: 'timetable', label: 'Timetable', icon: 'calendar-outline' },
    { id: 'attendance', label: 'Attendance', icon: 'checkbox-outline' },
    { id: 'assignments', label: 'Assignments', icon: 'document-text-outline' },
    { id: 'results', label: 'Course Results', icon: 'ribbon-outline' },
    { id: 'chat', label: 'Subject Chat', icon: 'chatbubbles-outline' },
    { id: 'sep2', separator: true },
    { id: 'ai-insights', label: '🤖 AI Mode', icon: 'hardware-chip-outline' },
];

export default function Sidebar({ isOpen, onClose, activeTab, setActiveTab }: SidebarProps) {
    const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
    const overlayOpacity = useRef(new Animated.Value(0)).current;
    const { user, role, logout } = useAuthStore();

    useEffect(() => {
        if (isOpen) {
            Animated.parallel([
                Animated.spring(translateX, {
                    toValue: 0,
                    useNativeDriver: true,
                    bounciness: 0,
                }),
                Animated.timing(overlayOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(translateX, {
                    toValue: -DRAWER_WIDTH,
                    duration: 250,
                    useNativeDriver: true,
                }),
                Animated.timing(overlayOpacity, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [isOpen]);

    const handleMenuPress = (tabId: string) => {
        setActiveTab(tabId);
        onClose();
    };

    const userRole = role || (user as any)?.user_metadata?.role || (user as any)?.role || 'student';
    const activeMenu = userRole === 'faculty' ? FACULTY_MENU : STUDENT_MENU;

    return (
        <View style={[StyleSheet.absoluteFill, { pointerEvents: isOpen ? 'auto' : 'none', zIndex: 100 }]}>
            {/* Overlay backdrop */}
            <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.6)', opacity: overlayOpacity }]}>
                <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />
            </Animated.View>

            {/* Sidebar Panel */}
            <Animated.View
                style={[
                    styles.drawer,
                    { transform: [{ translateX }] }
                ]}
            >
                <View className="flex-row items-center justify-between p-6 pt-12 border-b border-white/5">
                    <View className="flex-row items-center">
                        <View className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 items-center justify-center mr-3">
                            <Ionicons name="flash" size={20} color="#a855f7" />
                        </View>
                        <Text className="text-white text-xl font-bold">EduTrack <Text className="text-purple-400">AI</Text></Text>
                    </View>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name="close" size={24} color="#94a3b8" />
                    </TouchableOpacity>
                </View>

                <ScrollView className="flex-1 px-4 py-4" showsVerticalScrollIndicator={false}>
                    <Text className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-4 px-2">Menu</Text>

                    {activeMenu.map((item) => {
                        if (item.separator) {
                            return <View key={item.id} className="w-full h-px bg-white/10 my-2" />;
                        }
                        const isActive = activeTab === item.id;
                        return (
                            <TouchableOpacity
                                key={item.id}
                                onPress={() => handleMenuPress(item.id)}
                                className={`flex-row items-center px-4 py-3.5 mb-1 rounded-xl ${isActive ? 'bg-purple-500/20' : ''}`}
                                style={isActive ? { borderWidth: 1, borderColor: 'rgba(168, 85, 247, 0.3)' } : {}}
                            >
                                <Ionicons name={item.icon as any} size={20} color={isActive ? '#d8b4fe' : '#94a3b8'} />
                                <Text className={`ml-4 font-semibold ${isActive ? 'text-purple-100' : 'text-slate-400'}`}>
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}

                    <View className="w-full h-px bg-white/5 my-4" />

                    <TouchableOpacity
                        onPress={() => handleMenuPress('profile')}
                        className={`flex-row items-center px-4 py-3.5 mb-1 rounded-xl ${activeTab === 'profile' ? 'bg-purple-500/20 border border-purple-500/30' : ''}`}
                    >
                        <View className="w-8 h-8 rounded-full bg-slate-700 items-center justify-center border border-slate-600">
                            <Text className="text-white font-bold text-xs">{user?.name ? user.name[0].toUpperCase() : 'S'}</Text>
                        </View>
                        <Text className="ml-3 font-semibold text-slate-300">Profile</Text>
                    </TouchableOpacity>

                </ScrollView>

                <View className="p-6 border-t border-white/5">
                    <TouchableOpacity onPress={logout} className="flex-row items-center px-4 py-3 bg-red-500/10 rounded-xl border border-red-500/20">
                        <Ionicons name="log-out-outline" size={20} color="#f87171" />
                        <Text className="text-red-400 font-semibold ml-3">Log Out</Text>
                    </TouchableOpacity>
                </View>

            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    drawer: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: DRAWER_WIDTH,
        backgroundColor: '#0f172a', // Matching standard dark theme
        borderRightWidth: 1,
        borderRightColor: 'rgba(255,255,255,0.05)',
    }
});
