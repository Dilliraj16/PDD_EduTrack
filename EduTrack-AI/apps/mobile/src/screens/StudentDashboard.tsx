import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity, Modal, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { supabase } from '../config/supabase';

const { width } = Dimensions.get('window');

const cgpaData = {
    labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5'],
    datasets: [{ data: [8.2, 8.5, 8.7, 8.9, 9.1] }]
};

const attendanceData = [
    { subject: 'CS101', percentage: 95 },
    { subject: 'MATH201', percentage: 88 },
    { subject: 'PHY105', percentage: 76 },
    { subject: 'ENG102', percentage: 100 },
];

export default function StudentDashboard() {
    const [currentTime, setCurrentTime] = useState(new Date());

    // Profile Settings State
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [biography, setBiography] = useState('');
    const [isLoadingProfile, setIsLoadingProfile] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');
    const [userId, setUserId] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        if (!isSettingsOpen) return;

        const fetchProfile = async () => {
            setIsLoadingProfile(true);
            try {
                const { data: authData } = await supabase.auth.getUser();
                const sessionUser = authData?.user;
                if (!sessionUser) return;

                setUserId(sessionUser.id);

                const meta = sessionUser.user_metadata || {};
                const role = meta.role || 'students';
                setUserRole(role);
                setBiography(meta.biography || '');

                const table = role === 'faculty' ? 'faculty' : role === 'admin' ? 'admins' : 'students';

                const { data, error } = await supabase
                    .from(table)
                    .select('first_name, last_name')
                    .eq('id', sessionUser.id)
                    .single();

                if (data && !error) {
                    setFirstName(data.first_name || '');
                    setLastName(data.last_name || '');
                }
            } catch (error) {
                console.error("Error fetching profile", error);
            } finally {
                setIsLoadingProfile(false);
            }
        };
        fetchProfile();
    }, [isSettingsOpen]);

    const handleSaveProfile = async () => {
        if (!userId || !userRole) return;
        setIsSaving(true);
        setSaveMessage('');

        try {
            const table = userRole === 'faculty' ? 'faculty' : userRole === 'admin' ? 'admins' : 'students';

            const { error: dbError } = await supabase
                .from(table)
                .update({ first_name: firstName, last_name: lastName })
                .eq('id', userId);

            if (dbError) throw dbError;

            const { error: authError } = await supabase.auth.updateUser({
                data: { biography: biography }
            });

            if (authError) throw authError;

            setSaveMessage('Profile saved successfully!');
            setTimeout(() => {
                setSaveMessage('');
                setIsSettingsOpen(false);
            }, 2000);
        } catch (error) {
            console.error("Error saving profile", error);
            setSaveMessage('Failed to save profile.');
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const timeStr = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <ScrollView className="flex-1 bg-[#0f172a]" contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
            {/* Header Profile */}
            <View className="mb-6 mt-12 bg-white/5 p-5 rounded-3xl border border-white/10 relative overflow-hidden">
                <View className="flex-row justify-between items-start mb-2">
                    <Text className="text-3xl font-extrabold text-white">Welcome, Student!</Text>
                    <TouchableOpacity onPress={() => setIsSettingsOpen(true)} className="p-2 bg-blue-500/10 rounded-full border border-blue-500/20">
                        <Ionicons name="settings-outline" size={22} color="#3b82f6" />
                    </TouchableOpacity>
                </View>
                <View className="flex-row flex-wrap gap-2 mb-4">
                    <View className="bg-blue-500/20 border border-blue-500/30 px-3 py-1 rounded-lg">
                        <Text className="text-blue-300 font-bold text-xs">STD-2026-CS-0154</Text>
                    </View>
                    <View className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg">
                        <Text className="text-emerald-400 font-bold text-xs">Excellent Attendance</Text>
                    </View>
                </View>

                <View className="flex-row items-center justify-between mt-2 pt-4 border-t border-white/10">
                    <View className="flex-row items-center">
                        <Ionicons name="time-outline" size={20} color="#38bdf8" />
                        <Text className="text-cyan-400 font-bold ml-2">{timeStr}</Text>
                    </View>
                    <TouchableOpacity className="bg-orange-500/20 border border-orange-500/30 px-4 py-2 rounded-xl flex-row items-center">
                        <Ionicons name="warning" size={16} color="#fb923c" />
                        <Text className="text-orange-300 font-bold text-xs ml-2">1 Priority Due</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Stats Grid */}
            <View className="flex-row flex-wrap justify-between mb-6">
                {[
                    { title: 'CGPA', val: '9.1', icon: 'ribbon', c: '#a855f7', bg: 'bg-purple-500/10' },
                    { title: 'Attendance', val: '89%', icon: 'checkmark-circle', c: '#34d399', bg: 'bg-emerald-500/10' },
                    { title: 'Enrolled', val: '6', icon: 'book', c: '#3b82f6', bg: 'bg-blue-500/10' },
                    { title: 'Pending', val: '3', icon: 'document', c: '#f43f5e', bg: 'bg-rose-500/10' }
                ].map((s, i) => (
                    <View key={i} className={`w-[48%] mb-4 p-4 rounded-2xl ${s.bg} border border-white/5 flex-col justify-between`}>
                        <View className="flex-row justify-between items-center mb-2">
                            <Text className="text-gray-400 text-xs font-bold uppercase">{s.title}</Text>
                            <Ionicons name={s.icon as any} size={18} color={s.c} />
                        </View>
                        <Text className="text-2xl font-bold text-white mt-1">{s.val}</Text>
                    </View>
                ))}
            </View>

            {/* Chart Section */}
            <View className="bg-white/5 rounded-3xl p-5 border border-white/10 mb-6">
                <View className="flex-row items-center mb-4">
                    <Ionicons name="trending-up" size={24} color="#a855f7" />
                    <Text className="text-xl font-bold text-white ml-2">CGPA Progression</Text>
                </View>
                <LineChart
                    data={cgpaData}
                    width={width - 72}
                    height={220}
                    yAxisLabel=""
                    yAxisSuffix=""
                    chartConfig={{
                        backgroundColor: 'transparent',
                        backgroundGradientFrom: '#0f172a',
                        backgroundGradientTo: '#0f172a',
                        decimalPlaces: 1,
                        color: (opacity = 1) => `rgba(0, 210, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(148, 163, 184, ${opacity})`,
                        style: { borderRadius: 16 },
                        propsForDots: { r: '4', strokeWidth: '2', stroke: '#00d2ff' }
                    }}
                    bezier
                    style={{ marginVertical: 8, borderRadius: 16, marginLeft: -20 }}
                />
            </View>

            {/* Timetable Widget */}
            <View className="bg-white/5 rounded-3xl p-5 border border-white/10 mb-6">
                <View className="flex-row items-center mb-4">
                    <Ionicons name="calendar-outline" size={24} color="#3b82f6" />
                    <Text className="text-xl font-bold text-white ml-2">Today's Schedule</Text>
                </View>

                <View className="bg-blue-500/20 border-l-4 border-blue-500 p-4 rounded-xl mb-3 flex-row justify-between items-center">
                    <View>
                        <Text className="text-white font-bold text-lg">Data Structures</Text>
                        <Text className="text-gray-400 text-xs mt-1">Prof. Alan Turing • Lab 3</Text>
                        <Text className="text-blue-400 text-[10px] font-bold uppercase mt-1">Live Now</Text>
                    </View>
                    <Text className="text-blue-400 font-bold">10:45 AM</Text>
                </View>

                <View className="bg-white/5 p-4 rounded-xl border border-white/5 flex-row justify-between items-center">
                    <View>
                        <Text className="text-gray-300 font-bold text-lg">Computer Networks</Text>
                        <Text className="text-gray-500 text-xs mt-1">Dr. John Smith • Block B</Text>
                    </View>
                    <Text className="text-gray-400 font-bold">01:00 PM</Text>
                </View>
            </View>

            {/* Settings Modal */}
            <Modal visible={isSettingsOpen} animationType="slide" transparent={true}>
                <View className="flex-1 justify-end bg-black/60">
                    <View className="bg-[#0f172a] p-6 rounded-t-3xl border-t border-white/10 min-h-[500px]">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-2xl font-extrabold text-white">Edit Profile</Text>
                            <TouchableOpacity onPress={() => setIsSettingsOpen(false)} className="p-2 bg-white/5 rounded-full border border-white/10">
                                <Ionicons name="close" size={20} color="#94a3b8" />
                            </TouchableOpacity>
                        </View>

                        {isLoadingProfile ? (
                            <View className="flex-1 justify-center items-center">
                                <ActivityIndicator size="large" color="#3b82f6" />
                            </View>
                        ) : (
                            <View className="w-full h-full flex flex-col justify-start">
                                <View className="flex-row items-center w-full mb-4">
                                    <View className="flex-1 pr-2">
                                        <Text className="text-xs text-gray-400 font-bold mb-1 ml-1 uppercase">First Name</Text>
                                        <TextInput
                                            className="bg-black/20 text-white p-4 rounded-xl border border-white/10 font-bold"
                                            value={firstName}
                                            onChangeText={setFirstName}
                                            placeholder="First Name"
                                            placeholderTextColor="#94a3b8"
                                        />
                                    </View>
                                    <View className="flex-1 pl-2">
                                        <Text className="text-xs text-gray-400 font-bold mb-1 ml-1 uppercase">Last Name</Text>
                                        <TextInput
                                            className="bg-black/20 text-white p-4 rounded-xl border border-white/10 font-bold"
                                            value={lastName}
                                            onChangeText={setLastName}
                                            placeholder="Last Name"
                                            placeholderTextColor="#94a3b8"
                                        />
                                    </View>
                                </View>

                                <View className="mb-6 w-full">
                                    <Text className="text-xs text-gray-400 font-bold mb-1 ml-1 uppercase">Biography</Text>
                                    <TextInput
                                        className="bg-black/20 text-white p-4 rounded-xl border border-white/10 min-h-[100px] font-bold"
                                        value={biography}
                                        onChangeText={setBiography}
                                        placeholder="Add a short bio..."
                                        placeholderTextColor="#94a3b8"
                                        multiline
                                        textAlignVertical="top"
                                    />
                                </View>

                                {saveMessage ? (
                                    <Text className={`text-center mb-4 font-bold ${saveMessage.includes('Failed') ? 'text-rose-400' : 'text-emerald-400'}`}>
                                        {saveMessage}
                                    </Text>
                                ) : null}

                                <TouchableOpacity
                                    onPress={handleSaveProfile}
                                    disabled={isSaving}
                                    className={`p-4 rounded-2xl items-center shadow-lg w-full ${isSaving ? 'bg-blue-500/50' : 'bg-blue-600 shadow-blue-500/20'}`}
                                >
                                    {isSaving ? (
                                        <ActivityIndicator color="#ffffff" />
                                    ) : (
                                        <Text className="text-white font-bold text-lg">Save Changes</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>
            </Modal>

        </ScrollView>
    );
}
