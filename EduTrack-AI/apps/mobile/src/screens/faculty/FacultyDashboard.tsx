import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, BackHandler, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Sidebar from '../../components/Sidebar';
import ProfileScreen from '../common/ProfileScreen';
import { useCourseStore } from '../../store/courseStore';
import { supabase } from '../../config/supabase';

// Faculty specific screens
import CreateCourseScreen from './CreateCourseScreen';
import AttendanceScreen from './AttendanceScreen';
import FacultyResultsScreen from './ResultsScreen';
import StudentRegistrationScreen from './StudentRegistrationScreen';
import FacultyAIInsightsScreen from './FacultyAIInsightsScreen';
// Reused screens
import ChatScreen from '../common/ChatScreen';
import TimetableScreen from '../common/TimetableScreen';
import FacultyAssignmentsScreen from './AssignmentScreen';
import NotificationsScreen from '../common/NotificationsScreen';

export default function FacultyDashboard() {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [tabHistory, setTabHistory] = useState<string[]>(['dashboard']);
    const fetchCourses = useCourseStore(state => state.fetchCourses);

    const [odRequests, setOdRequests] = useState<any[]>([]);
    const [totalStudents, setTotalStudents] = useState<number>(0);

    const fetchOdRequests = async () => {
        const { data } = await supabase
            .from('od_requests')
            .select('*, profiles:student_id(full_name)')
            .eq('status', 'pending');

        if (data) setOdRequests(data);
    };

    const fetchStudentsCount = async () => {
        const { count, error } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('role', 'student');
        if (!error && count !== null) {
            setTotalStudents(count);
        }
    };

    // Centralized Navigation Handler
    const navigateTo = (tab: string) => {
        if (tab !== activeTab) {
            setTabHistory(prev => [...prev, tab]);
            setActiveTab(tab);
        }
    };

    const handleBack = () => {
        if (tabHistory.length > 1) {
            const newHistory = [...tabHistory];
            newHistory.pop();
            const previousTab = newHistory[newHistory.length - 1];
            setTabHistory(newHistory);
            setActiveTab(previousTab);
            return true;
        }
        return false;
    };

    React.useEffect(() => {
        fetchCourses();
        fetchOdRequests();
        fetchStudentsCount();
    }, []);

    React.useEffect(() => {
        const subscription = BackHandler.addEventListener('hardwareBackPress', handleBack);
        return () => subscription.remove();
    }, [tabHistory]);


    // Rendering Faculty Command Center
    const renderDashboardOverview = () => (
        <ScrollView className="flex-1 bg-[#101827]" contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
            <View className="flex-row justify-between items-center mb-6 pt-4">
                <TouchableOpacity className="p-2" onPress={() => setSidebarOpen(true)}>
                    <Ionicons name="menu" size={28} color="#64748b" />
                </TouchableOpacity>
                <View className="flex-row gap-4">
                    <TouchableOpacity
                        onPress={() => navigateTo('notifications')}
                        className="w-10 h-10 rounded-full bg-[#1e293b] border border-white/5 items-center justify-center">
                        <Ionicons name="notifications-outline" size={20} color="#94a3b8" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Welcome Banner Card */}
            <View className="bg-[#1a233a] p-6 rounded-[28px] mb-6 shadow-2xl relative overflow-hidden">
                <Text className="text-3xl font-extrabold text-white mb-2 tracking-tight">Faculty Command Center</Text>
                <Text className="text-gray-400 font-semibold text-sm mb-4">Manage your classes, assignments, and monitor student progress easily.</Text>
                <View className="bg-indigo-900/40 border border-indigo-500/30 px-3 py-1.5 rounded-lg flex-row items-center self-start">
                    <Ionicons name="grid" size={14} color="#a5b4fc" />
                    <Text className="text-indigo-300 font-bold text-xs tracking-wider ml-2">Desktop widgets are fully reorderable</Text>
                </View>
            </View>

            {/* Stacked KPI Cards */}
            <View className="flex-col gap-4 mb-6">
                <View className="bg-[#1a233a] p-5 rounded-[24px] flex-row justify-between items-center border border-white/10 shadow-lg relative overflow-hidden">
                    <View className="absolute right-[-20] top-[-20] opacity-5">
                        <Ionicons name="people" size={100} color="#fff" />
                    </View>
                    <View>
                        <Text className="text-gray-400 font-bold text-xs mb-2 tracking-widest">Total Students</Text>
                        <Text className="text-white font-extrabold text-3xl">{totalStudents}</Text>
                    </View>
                    <View className="w-12 h-12 rounded-2xl bg-indigo-900/40 items-center justify-center border border-indigo-500/20">
                        <Ionicons name="people-outline" size={24} color="#a5b4fc" />
                    </View>
                </View>

                <View className="bg-[#1a233a] p-5 rounded-[24px] flex-row justify-between items-center border border-white/10 shadow-lg relative overflow-hidden">
                    <View className="absolute right-[-20] top-[-20] opacity-5">
                        <Ionicons name="document-text" size={100} color="#fff" />
                    </View>
                    <View>
                        <Text className="text-gray-400 font-bold text-xs mb-2 tracking-widest">Pending Evaluations</Text>
                        <Text className="text-white font-extrabold text-3xl">34</Text>
                    </View>
                    <View className="w-12 h-12 rounded-2xl bg-rose-900/40 items-center justify-center border border-rose-500/20">
                        <Ionicons name="clipboard-outline" size={24} color="#fda4af" />
                    </View>
                </View>

                <View className="bg-[#1a233a] p-5 rounded-[24px] flex-row justify-between items-center border border-white/10 shadow-lg relative overflow-hidden">
                    <View className="absolute right-[-20] top-[-20] opacity-5">
                        <Ionicons name="book" size={100} color="#fff" />
                    </View>
                    <View>
                        <Text className="text-gray-400 font-bold text-xs mb-2 tracking-widest">Subjects Taught</Text>
                        <Text className="text-white font-extrabold text-3xl">4</Text>
                    </View>
                    <View className="w-12 h-12 rounded-2xl bg-blue-900/40 items-center justify-center border border-blue-500/20">
                        <Ionicons name="book-outline" size={24} color="#93c5fd" />
                    </View>
                </View>

                <View className="bg-[#1a233a] p-5 rounded-[24px] flex-row justify-between items-center border border-white/10 shadow-lg relative overflow-hidden">
                    <View className="absolute right-[-20] top-[-20] opacity-5">
                        <Ionicons name="stats-chart" size={100} color="#fff" />
                    </View>
                    <View>
                        <Text className="text-gray-400 font-bold text-xs mb-2 tracking-widest">Avg Class Attendance</Text>
                        <Text className="text-white font-extrabold text-3xl">88%</Text>
                    </View>
                    <View className="w-12 h-12 rounded-2xl bg-emerald-900/40 items-center justify-center border border-emerald-500/20">
                        <Ionicons name="trending-up" size={24} color="#34d399" />
                    </View>
                </View>
            </View>

            {/* Quick Actions */}
            <Text className="text-xl font-extrabold text-white mb-4 tracking-tight px-2 flex-row"><Ionicons name="flash-outline" size={20} color="#38bdf8" /> Quick Actions</Text>
            <View className="flex-col gap-4 mb-8">
                <TouchableOpacity onPress={() => navigateTo('attendance')} className="bg-[#1e293b] py-5 px-6 rounded-[20px] flex-row items-center justify-between border border-white/5 shadow-lg active:scale-95 transition-transform">
                    <View className="flex-row items-center">
                        <Ionicons name="clipboard-outline" size={24} color="#94a3b8" />
                        <Text className="text-white font-bold text-base ml-4">Mark Attendance</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigateTo('assignments')} className="bg-[#1e293b] py-5 px-6 rounded-[20px] flex-row items-center justify-between border border-white/5 shadow-lg active:scale-95 transition-transform">
                    <View className="flex-row items-center">
                        <Ionicons name="book-outline" size={24} color="#94a3b8" />
                        <Text className="text-white font-bold text-base ml-4">Add Assignment</Text>
                    </View>
                </TouchableOpacity>
            </View>

            {/* Pending OD Requests - Condensed List */}
            <Text className="text-xl font-extrabold text-white mb-4 tracking-tight px-2 flex-row"><Ionicons name="document-text-outline" size={20} color="#38bdf8" /> Pending OD Requests</Text>

            <View className="bg-[#1e293b] rounded-[24px] overflow-hidden mb-6 border border-white/10">
                {odRequests.length === 0 ? (
                    <View className="p-8 items-center justify-center">
                        <Ionicons name="checkmark-circle-outline" size={48} color="#34d399" />
                        <Text className="text-gray-400 mt-4 font-bold">All requests cleared!</Text>
                    </View>
                ) : (
                    odRequests.map((req, idx) => (
                        <View key={req.id} className={`p-4 ${idx !== odRequests.length - 1 ? 'border-b border-white/5' : ''}`}>
                            <View className="flex-row justify-between items-start mb-2">
                                <View>
                                    <Text className="text-white font-bold text-base">{req.profiles?.full_name || 'Student'}</Text>
                                    <Text className="text-gray-500 text-xs mt-1">{new Date(req.created_at).toLocaleDateString()}</Text>
                                </View>
                                <View className="bg-amber-500/10 px-2 py-1 rounded">
                                    <Text className="text-amber-500 text-[10px] font-bold">PENDING</Text>
                                </View>
                            </View>
                            <Text className="text-gray-300 text-sm mb-3" numberOfLines={2}>{req.reason}</Text>
                            <View className="flex-row justify-between items-center">
                                <TouchableOpacity onPress={() => Alert.alert("Document Viewer", `Opening ${req.file_url}...`)} className="flex-row items-center">
                                    <Ionicons name="document-attach-outline" size={14} color="#60a5fa" />
                                    <Text className="text-blue-400 text-xs font-bold ml-1">View {req.file_url || 'Proof'}</Text>
                                </TouchableOpacity>
                                <View className="flex-row gap-2">
                                    <TouchableOpacity onPress={async () => {
                                        await supabase.from('od_requests').update({ status: 'approved' }).eq('id', req.id);
                                        fetchOdRequests();
                                    }} className="w-8 h-8 rounded-lg bg-emerald-500/10 items-center justify-center border border-emerald-500/20">
                                        <Ionicons name="checkmark" size={16} color="#34d399" />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={async () => {
                                        await supabase.from('od_requests').update({ status: 'rejected' }).eq('id', req.id);
                                        fetchOdRequests();
                                    }} className="w-8 h-8 rounded-lg bg-rose-500/10 items-center justify-center border border-rose-500/20">
                                        <Ionicons name="close" size={16} color="#fda4af" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    ))
                )}
            </View>
        </ScrollView>
    );

    return (
        <View className="flex-1 bg-[#101827]">
            {activeTab === 'dashboard' && renderDashboardOverview()}
            {activeTab === 'create-course' && <CreateCourseScreen onBack={handleBack} />}
            {activeTab === 'attendance' && <AttendanceScreen onBack={handleBack} />}
            {activeTab === 'assignments' && <FacultyAssignmentsScreen onBack={handleBack} />}
            {activeTab === 'timetable' && <TimetableScreen onBack={handleBack} />}
            {activeTab === 'chat' && <ChatScreen onBack={handleBack} />}
            {activeTab === 'profile' && <ProfileScreen onBack={handleBack} />}
            {activeTab === 'results' && <FacultyResultsScreen onBack={handleBack} />}
            {activeTab === 'student-reg' && <StudentRegistrationScreen onBack={handleBack} />}
            {activeTab === 'ai-insights' && <FacultyAIInsightsScreen />}
            {activeTab === 'notifications' && <NotificationsScreen onBack={handleBack} />}

            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setSidebarOpen(false)}
                activeTab={activeTab}
                setActiveTab={navigateTo}
            />
        </View>
    );
}
