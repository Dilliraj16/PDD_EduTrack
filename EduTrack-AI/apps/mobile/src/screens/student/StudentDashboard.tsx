import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../config/supabase';
import { useAuthStore } from '../../store/authStore';
import { useCourseStore } from '../../store/courseStore';
import ODRequestScreen from './ODRequestScreen';
import AssignmentScreen from './AssignmentScreen';
import ProfileScreen from '../common/ProfileScreen';
import GoalsScreen from './GoalsScreen';
import TimetableScreen from '../common/TimetableScreen';
import EnrollmentScreen from './EnrollmentScreen';
import CoursesScreen from './CoursesScreen';
import ChatScreen from '../common/ChatScreen';
import NotificationsScreen from '../common/NotificationsScreen';
import Sidebar from '../../components/Sidebar';
import StudentAIInsightsScreen from './StudentAIInsightsScreen';

export default function StudentDashboard() {
    const { user } = useAuthStore();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [profileData, setProfileData] = useState<any>(null);
    const [currentTab, setCurrentTab] = useState<string>('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const fetchCourses = useCourseStore(state => state.fetchCourses);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        fetchCourses();
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user?.id) return;
            const { data, error } = await supabase
                .from('students')
                .select('*')
                .eq('id', user.id)
                .single();
            if (data && !error) {
                setProfileData(data);
            }
        };
        fetchProfile();
    }, [user?.id]);

    const timeStr = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const dateStr = currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

    return (
        <View className="flex-1 bg-[#101827]">
            {currentTab === 'dashboard' && (
                <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
                    {/* Top Navigation Bar */}
                    <View className="flex-row justify-between items-center mb-6 pt-4">
                        <TouchableOpacity className="p-2" onPress={() => setIsSidebarOpen(true)}>
                            <Ionicons name="menu" size={28} color="#64748b" />
                        </TouchableOpacity>
                        <View className="flex-row gap-4">
                            <TouchableOpacity className="w-10 h-10 rounded-full bg-[#1e293b] border border-white/5 items-center justify-center">
                                <Ionicons name="sunny-outline" size={20} color="#fbbf24" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setCurrentTab('notifications')}
                                className="w-10 h-10 rounded-full bg-[#1e293b] border border-white/5 items-center justify-center">
                                <Ionicons name="notifications-outline" size={20} color="#94a3b8" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setCurrentTab('profile')}
                                className="w-10 h-10 rounded-full bg-[#1e293b] border border-white/5 items-center justify-center">
                                <Ionicons name="settings-outline" size={20} color="#94a3b8" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Welcome Banner Card */}
                    <View className="bg-[#1a233a] p-6 rounded-[28px] mb-6 shadow-2xl relative overflow-hidden">
                        <Text className="text-3xl font-extrabold text-white mb-4 tracking-tight">
                            Welcome back, {profileData?.first_name || user?.email?.split('@')[0] || 'Student'}!
                        </Text>

                        <View className="flex-row flex-wrap gap-2 mb-6">
                            <View className="bg-blue-900/40 border border-blue-500/30 px-3 py-1.5 rounded-lg">
                                <Text className="text-blue-300 font-bold text-xs tracking-wider">
                                    Reg: {profileData?.enrollment_number || 'N/A'}
                                </Text>
                            </View>
                            {profileData?.current_semester && (
                                <View className="bg-purple-900/40 border border-purple-500/30 px-3 py-1.5 rounded-lg">
                                    <Text className="text-purple-300 font-bold text-xs tracking-wider">
                                        Sem: {profileData?.current_semester}
                                    </Text>
                                </View>
                            )}
                            <View className="bg-emerald-900/30 border border-emerald-500/30 px-3 py-1.5 rounded-lg">
                                <Text className="text-emerald-400 font-bold text-xs tracking-wider">Excellent Attendance (89%)</Text>
                            </View>
                        </View>

                        {/* Date / Time */}
                        <View className="flex-row items-center justify-between bg-black/20 rounded-2xl p-4 mb-4 border border-white/5">
                            <View className="flex-row items-center flex-1">
                                <Ionicons name="time-outline" size={20} color="#38bdf8" />
                                <Text className="text-white font-bold ml-3 text-sm">{timeStr}</Text>
                            </View>
                            <View className="w-[1px] h-full bg-white/10 mx-4" />
                            <View className="flex-row items-center flex-1">
                                <Ionicons name="calendar-outline" size={20} color="#94a3b8" />
                                <Text className="text-blue-200 font-bold ml-3 text-xs flex-wrap">{dateStr}</Text>
                            </View>
                        </View>

                        {/* Priority */}
                        <View className="bg-amber-900/30 border border-amber-600/30 px-4 py-3 rounded-2xl flex-row items-center">
                            <View className="bg-amber-500/20 p-2 rounded-full mr-3">
                                <Ionicons name="checkmark-done" size={16} color="#f59e0b" />
                            </View>
                            <View>
                                <Text className="text-amber-500 font-bold text-[10px] tracking-widest uppercase">Today's Priority</Text>
                                <Text className="text-white font-bold text-sm mt-0.5">CS101 Term Paper due by 11:59 PM</Text>
                            </View>
                        </View>
                    </View>

                    {/* Stacked KPI Cards */}
                    <View className="flex-col gap-4 mb-6">

                        <View className="bg-[#1a233a] p-5 rounded-[24px] flex-row justify-between items-center border border-white/5">
                            <View>
                                <Text className="text-gray-400 font-bold text-sm mb-2">Current CGPA</Text>
                                <Text className="text-white font-extrabold text-3xl">9.1</Text>
                            </View>
                            <View className="w-12 h-12 rounded-2xl bg-purple-900/40 items-center justify-center border border-purple-500/20">
                                <Ionicons name="ribbon-outline" size={24} color="#d8b4fe" />
                            </View>
                        </View>

                        <View className="bg-[#1a233a] p-5 rounded-[24px] flex-row justify-between items-center border border-white/5">
                            <View>
                                <Text className="text-gray-400 font-bold text-sm mb-2">Overall Attendance</Text>
                                <Text className="text-white font-extrabold text-3xl">89%</Text>
                            </View>
                            <View className="w-12 h-12 rounded-2xl bg-emerald-900/30 items-center justify-center border border-emerald-500/20">
                                <Ionicons name="scan-outline" size={24} color="#6ee7b7" />
                            </View>
                        </View>

                        <View className="bg-[#1a233a] p-5 rounded-[24px] flex-row justify-between items-center border border-white/5">
                            <View>
                                <Text className="text-gray-400 font-bold text-sm mb-2">Enrolled Subjects</Text>
                                <Text className="text-white font-extrabold text-3xl">6</Text>
                            </View>
                            <View className="w-12 h-12 rounded-2xl bg-blue-900/40 items-center justify-center border border-blue-500/20">
                                <Ionicons name="book-outline" size={24} color="#93c5fd" />
                            </View>
                        </View>

                        <View className="bg-[#1a233a] p-5 rounded-[24px] flex-row justify-between items-center border border-white/5">
                            <View>
                                <Text className="text-gray-400 font-bold text-sm mb-2">Pending Assignments</Text>
                                <Text className="text-white font-extrabold text-3xl">3</Text>
                            </View>
                            <View className="w-12 h-12 rounded-2xl bg-rose-900/30 items-center justify-center border border-rose-500/20">
                                <Ionicons name="trending-up-outline" size={24} color="#fda4af" />
                            </View>
                        </View>
                    </View>
                </ScrollView>
            )}

            {currentTab === 'od-request' && (
                <View className="flex-1 pb-[80px]">
                    <ODRequestScreen onBack={() => setCurrentTab('dashboard')} />
                </View>
            )}

            {currentTab === 'assignments' && (
                <View className="flex-1 pb-[80px]">
                    <AssignmentScreen onBack={() => setCurrentTab('dashboard')} />
                </View>
            )}

            {currentTab === 'profile' && (
                <View className="flex-1 pb-[80px]">
                    <ProfileScreen onBack={() => setCurrentTab('dashboard')} />
                </View>
            )}

            {currentTab === 'goals' && (
                <View className="flex-1 pb-[80px]">
                    <GoalsScreen onBack={() => setCurrentTab('dashboard')} />
                </View>
            )}

            {currentTab === 'timetable' && (
                <View className="flex-1 pb-[80px]">
                    <TimetableScreen onBack={() => setCurrentTab('dashboard')} />
                </View>
            )}

            {currentTab === 'enrollment' && (
                <View className="flex-1 pb-[80px]">
                    <EnrollmentScreen onBack={() => setCurrentTab('dashboard')} />
                </View>
            )}

            {currentTab === 'courses' && (
                <View className="flex-1 pb-[80px]">
                    <CoursesScreen onBack={() => setCurrentTab('dashboard')} />
                </View>
            )}

            {currentTab === 'chat' && (
                <View className="flex-1 pb-[80px]">
                    <ChatScreen onBack={() => setCurrentTab('dashboard')} />
                </View>
            )}

            {currentTab === 'notifications' && (
                <View className="flex-1 pb-[80px]">
                    <NotificationsScreen onBack={() => setCurrentTab('dashboard')} />
                </View>
            )}

            {currentTab === 'ai-insights' && (
                <View className="flex-1 pb-[80px]">
                    <StudentAIInsightsScreen />
                </View>
            )}

            {/* Bottom Tab Bar */}
            <View className="absolute bottom-0 left-0 right-0 h-20 bg-[#1a233a] border-t border-white/5 flex-row items-center justify-around px-4 pb-2">
                <TouchableOpacity
                    className="items-center justify-center p-2"
                    onPress={() => setCurrentTab('dashboard')}
                >
                    <Ionicons
                        name={currentTab === 'dashboard' ? 'home' : 'home-outline'}
                        size={24}
                        color={currentTab === 'dashboard' ? '#38bdf8' : '#64748b'}
                    />
                    <Text className={`text-[10px] mt-1 font-bold ${currentTab === 'dashboard' ? 'text-[#38bdf8]' : 'text-gray-500'}`}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="items-center justify-center p-2"
                    onPress={() => setCurrentTab('assignments')}
                >
                    <Ionicons
                        name={currentTab === 'assignments' ? 'document-text' : 'document-text-outline'}
                        size={24}
                        color={currentTab === 'assignments' ? '#38bdf8' : '#64748b'}
                    />
                    <Text className={`text-[10px] mt-1 font-bold ${currentTab === 'assignments' ? 'text-[#38bdf8]' : 'text-gray-500'}`}>Assignments</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="items-center justify-center p-2"
                    onPress={() => setCurrentTab('od-request')}
                >
                    <Ionicons
                        name={currentTab === 'od-request' ? 'mail' : 'mail-outline'}
                        size={24}
                        color={currentTab === 'od-request' ? '#38bdf8' : '#64748b'}
                    />
                    <Text className={`text-[10px] mt-1 font-bold ${currentTab === 'od-request' ? 'text-[#38bdf8]' : 'text-gray-500'}`}>OD Request</Text>
                </TouchableOpacity>
            </View>

            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                activeTab={currentTab}
                setActiveTab={setCurrentTab}
            />
        </View>
    );
}
