import React, { useState } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

const courses = [
    { id: 1, name: 'Data Structures & Algorithms', code: 'CS301' },
    { id: 2, name: 'Database Management', code: 'CS302' },
    { id: 3, name: 'Software Engineering', code: 'CS303' },
];

export default function FacultyDashboard() {
    const [odStatuses, setOdStatuses] = useState<Record<number, 'approved' | 'rejected'>>({});
    const [selectedProof, setSelectedProof] = useState<string | null>(null);

    const handleOD = (id: number, status: 'approved' | 'rejected') => {
        setOdStatuses(prev => ({ ...prev, [id]: status }));
    };

    return (
        <ScrollView className="flex-1 bg-[#0f172a]" contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
            {/* Header Profile */}
            <View className="mb-6 bg-white/5 p-5 rounded-3xl border border-white/10 relative overflow-hidden">
                <Text className="text-3xl font-extrabold text-white mb-2">Faculty Command Center</Text>
                <Text className="text-slate-400 mt-1 mb-4">Manage your classes, assignments, and monitor student progress easily.</Text>

                <View className="flex-row items-center bg-indigo-500/20 px-4 py-2 rounded-xl flex-row items-center border border-indigo-500/30 self-start">
                    <Ionicons name="shield-checkmark" size={16} color="#a855f7" />
                    <Text className="text-indigo-300 font-bold text-xs ml-2 uppercase">Faculty Authorized</Text>
                </View>
            </View>

            {/* Stats Grid */}
            <View className="flex-row flex-wrap justify-between mb-6">
                {[
                    { title: 'Total Students', value: '450', icon: 'people', c: '#a855f7', bg: 'bg-purple-500/10' },
                    { title: 'Pending Evals', value: '34', icon: 'clipboard', c: '#fb7185', bg: 'bg-rose-500/10' },
                    { title: 'Subjects', value: '4', icon: 'book', c: '#60a5fa', bg: 'bg-blue-500/10' },
                    { title: 'Attendance', value: '88%', icon: 'trending-up', c: '#34d399', bg: 'bg-emerald-500/10' }
                ].map((s, i) => (
                    <View key={i} className={`w-[48%] mb-4 p-4 rounded-2xl ${s.bg} border border-white/5 flex-col justify-between`}>
                        <View className="flex-row justify-between items-center mb-2">
                            <Text className="text-gray-400 text-[10px] font-bold uppercase">{s.title}</Text>
                            <Ionicons name={s.icon as any} size={18} color={s.c} />
                        </View>
                        <Text className="text-3xl font-extrabold text-white mt-1 leading-tight">{s.value}</Text>
                    </View>
                ))}
            </View>

            {/* Courses Matrix */}
            <View className="bg-white/5 rounded-3xl p-5 border border-white/10 mb-6">
                <View className="flex-row items-center mb-4">
                    <Ionicons name="book-outline" size={24} color="#6366f1" />
                    <Text className="text-xl font-bold text-white ml-2">My Scheduled Classes</Text>
                </View>
                {courses.map(course => (
                    <View key={course.id} className="p-4 rounded-2xl border border-white/5 flex-row items-center mb-3 bg-black/20">
                        <View className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center border border-indigo-500/30">
                            <Text className="text-indigo-400 font-bold text-lg">{course.code.substring(0, 2)}</Text>
                        </View>
                        <View className="ml-4 flex-1">
                            <Text className="font-bold text-white text-base">{course.name}</Text>
                            <Text className="text-xs text-gray-400 font-mono mt-1">{course.code}</Text>
                        </View>
                    </View>
                ))}
            </View>

            {/* Quick Actions */}
            <View className="bg-white/5 rounded-3xl p-5 border border-white/10 mb-6">
                <View className="flex-row items-center mb-4">
                    <Ionicons name="flash-outline" size={24} color="#06b6d4" />
                    <Text className="text-xl font-bold text-white ml-2">Quick Actions</Text>
                </View>
                <View className="flex-row justify-between">
                    <TouchableOpacity className="flex-1 mr-2 flex-col items-center justify-center py-6 px-4 rounded-2xl bg-white/5 border border-white/5">
                        <Ionicons name="checkmark-done" size={28} color="#06b6d4" className="mb-2" />
                        <Text className="text-xs font-bold text-white mt-3 text-center">Mark Attendance</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-1 ml-2 flex-col items-center justify-center py-6 px-4 rounded-2xl bg-white/5 border border-white/5">
                        <Ionicons name="document-text" size={28} color="#a855f7" className="mb-2" />
                        <Text className="text-xs font-bold text-white mt-3 text-center">Add Assignment</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* OD Requests */}
            <View className="bg-white/5 rounded-3xl p-5 border border-white/10 mb-6">
                <View className="flex-row items-center mb-4">
                    <Ionicons name="document-outline" size={24} color="#3b82f6" />
                    <Text className="text-xl font-bold text-white ml-2">Pending OD Requests</Text>
                </View>

                {[
                    { id: 1, name: 'Dilli Raj', reason: 'Hackathon Participation', date: 'Oct 24, 2026', proof: 'hackathon_pass.pdf' },
                    { id: 2, name: 'John Doe', reason: 'Medical Leave', date: 'Oct 25, 2026', proof: 'doctor_note.png' }
                ].map((od) => (
                    <View key={od.id} className={`p-5 rounded-2xl border mb-3 flex-col ${odStatuses[od.id] ? 'bg-black/10 border-white/5 opacity-50' : 'bg-white/5 border-white/10'}`}>
                        <View className="flex-row justify-between items-start mb-3">
                            <View>
                                <Text className="font-bold text-white text-lg">{od.name}</Text>
                                <Text className="text-xs text-gray-400 font-medium mt-1">{od.date}</Text>
                            </View>
                            {odStatuses[od.id] === 'approved' ? (
                                <View className="px-3 py-1 bg-emerald-500/10 rounded-md">
                                    <Text className="text-emerald-400 text-[10px] font-bold uppercase">Approved</Text>
                                </View>
                            ) : odStatuses[od.id] === 'rejected' ? (
                                <View className="px-3 py-1 bg-rose-500/10 rounded-md">
                                    <Text className="text-rose-400 text-[10px] font-bold uppercase">Rejected</Text>
                                </View>
                            ) : (
                                <View className="px-3 py-1 bg-amber-500/10 rounded-md">
                                    <Text className="text-amber-400 text-[10px] font-bold uppercase">Pending</Text>
                                </View>
                            )}
                        </View>
                        <Text className="text-sm text-gray-300 mb-4">{od.reason}</Text>

                        <View className="flex-row items-center justify-between">
                            <TouchableOpacity onPress={() => setSelectedProof(od.proof)} className="flex-row items-center">
                                <Ionicons name="document-attach" size={16} color="#3b82f6" />
                                <Text className="text-xs font-bold text-blue-400 ml-1">View {od.proof}</Text>
                            </TouchableOpacity>

                            {!odStatuses[od.id] && (
                                <View className="flex-row space-x-2">
                                    <TouchableOpacity onPress={() => handleOD(od.id, 'approved')} className="p-2 rounded-xl bg-emerald-500/10 mr-2 border border-emerald-500/20">
                                        <Ionicons name="checkmark" size={20} color="#34d399" />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleOD(od.id, 'rejected')} className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
                                        <Ionicons name="close" size={20} color="#fb7185" />
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}
