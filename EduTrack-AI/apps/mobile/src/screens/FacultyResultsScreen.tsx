import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Alert, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCourseStore } from '../store/courseStore';

export default function FacultyResultsScreen({ onBack }: { onBack: () => void }) {
    const courses = useCourseStore(state => state.courses);
    const [activeIndex, setActiveIndex] = useState(0);
    const activeCourse = courses.length > 0 ? courses[activeIndex] : null;

    const mockStudents = [
        { id: '1', name: 'John Doe', reg: 'CS1023' },
        { id: '2', name: 'Jane Smith', reg: 'CS1024' },
        { id: '3', name: 'Alice Walker', reg: 'CS1025' }
    ];

    const [grades, setGrades] = useState<Record<string, string>>({});

    const cycleCourse = () => {
        if (courses.length > 1) {
            setActiveIndex(prev => (prev + 1) % courses.length);
        }
    };

    const handlePublish = () => {
        Alert.alert("Success", "Grades published to the secure student portal!");
    };

    return (
        <SafeAreaView className="flex-1 bg-[#101827]">
            <View className="flex-row items-center justify-between p-4 border-b border-white/5">
                <View className="flex-row items-center">
                    <TouchableOpacity onPress={onBack} className="mr-4 p-2 rounded-full bg-white/5 border border-white/10">
                        <Ionicons name="arrow-back" size={20} color="#fff" />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-white">Course Results</Text>
                </View>
            </View>

            <ScrollView className="p-4" contentContainerStyle={{ paddingBottom: 100 }}>
                <View className="mb-6 flex-row items-center">
                    <Ionicons name="ribbon-outline" size={28} color="#a855f7" className="mr-2" />
                    <View className="ml-3">
                        <Text className="text-2xl font-extrabold text-[#d8b4fe] mb-1">Course Results Entry</Text>
                        <Text className="text-gray-400 font-semibold text-xs">Evaluate and assign grades for students in your enrolled courses.</Text>
                    </View>
                </View>

                {/* Filters Row */}
                <View className="flex-row gap-3 mb-6 z-10 w-full">
                    <TouchableOpacity onPress={cycleCourse} className="flex-1 bg-[#1a233a] rounded-xl p-3 border border-indigo-500/30 flex-row justify-between items-center">
                        <View>
                            <Text className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Selected Course</Text>
                            <Text className="text-slate-200 font-bold text-xs">
                                {activeCourse ? activeCourse.code : 'No Active Course'}
                            </Text>
                        </View>
                        <Ionicons name="swap-horizontal" size={16} color="#94a3b8" />
                    </TouchableOpacity>

                    <View className="flex-1 bg-[#1a233a] rounded-xl p-3 border border-white/5 flex-row items-center">
                        <Ionicons name="search" size={16} color="#94a3b8" />
                        <Text className="text-slate-500 text-xs ml-2 flex-1">Search student...</Text>
                    </View>
                </View>

                {/* Content Area */}
                <View className="bg-[#1a233a] rounded-[24px] border border-white/5 overflow-hidden shadow-2xl relative">
                    {!activeCourse ? (
                        <View className="p-12 items-center justify-center min-h-[300px]">
                            <Ionicons name="ribbon-outline" size={64} color="#334155" />
                            <Text className="text-white font-bold text-lg mt-4">No Courses Initialized</Text>
                            <Text className="text-slate-500 text-sm mt-2 text-center">Please create a subject first before assigning grades.</Text>
                        </View>
                    ) : (
                        <View>
                            <Text className="text-xs font-bold text-slate-400 p-4 border-b border-white/5 tracking-widest uppercase">
                                Grading Roster: {activeCourse.name}
                            </Text>
                            {mockStudents.map((student, idx) => (
                                <View key={student.id} className={`flex-row items-center justify-between p-4 ${idx !== mockStudents.length - 1 ? 'border-b border-white/5' : ''}`}>
                                    <View className="flex-row items-center">
                                        <View className="w-10 h-10 rounded-full bg-indigo-900/40 border border-indigo-500/20 items-center justify-center mr-4">
                                            <Text className="text-indigo-300 font-bold uppercase">{student.name.charAt(0)}</Text>
                                        </View>
                                        <View>
                                            <Text className="text-white font-bold text-base">{student.name}</Text>
                                            <Text className="text-gray-500 text-xs font-mono">{student.reg}</Text>
                                        </View>
                                    </View>
                                    <View className="flex-row items-center">
                                        <TextInput
                                            value={grades[student.id] || ''}
                                            onChangeText={(val) => setGrades(prev => ({ ...prev, [student.id]: val }))}
                                            className="bg-[#0f172a] border border-white/10 text-white rounded-xl px-4 py-3 w-20 text-center font-bold"
                                            placeholder="--"
                                            placeholderTextColor="#475569"
                                            keyboardType="numeric"
                                            maxLength={3}
                                        />
                                        <Text className="text-gray-500 ml-2 font-bold text-xs">/ 100</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Bottom Action Bar */}
                    <View className="bg-[#1e293b] p-4 flex-row justify-between items-center border-t border-white/5">
                        <Text className="text-slate-400 font-bold text-xs">{Object.keys(grades).filter(k => grades[k]).length} / {mockStudents.length} Graded</Text>
                        <TouchableOpacity onPress={handlePublish} className="bg-purple-900/60 border border-purple-500/30 px-6 py-2.5 rounded-xl flex-row items-center">
                            <Ionicons name="cloud-upload-outline" size={16} color="#d8b4fe" />
                            <Text className="text-purple-300 font-bold text-sm ml-2">Publish Grades</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
