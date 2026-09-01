import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Alert, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../config/supabase';

export default function FacultyAssignmentsScreen({ onBack }: { onBack: () => void }) {
    const [viewMode, setViewMode] = useState<'list' | 'create'>('create');
    const [assignments, setAssignments] = useState<any[]>([]);

    useEffect(() => {
        if (viewMode === 'list') {
            fetchAssignments();
        }
    }, [viewMode]);

    const fetchAssignments = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data } = await supabase.from('assignments').select('*').eq('faculty_id', user.id).order('created_at', { ascending: false });
        if (data) {
            setAssignments(data);
        }
    };

    // Form States
    const [title, setTitle] = useState('');
    const [course, setCourse] = useState('Computer Networks');
    const [dueDate, setDueDate] = useState('');
    const [dueTime, setDueTime] = useState('');
    const [instructions, setInstructions] = useState('');

    const handleCreateAssignment = async () => {
        if (!title.trim()) {
            Alert.alert("Error", "Please provide an assignment title.");
            return;
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase.from('assignments').insert({
            faculty_id: user.id,
            course: course,
            title: title,
            due_date: dueDate || 'TBD',
            due_time: dueTime || '--:--',
            instructions: instructions
        });

        if (error) {
            Alert.alert("Error", "Could not publish assignment. Check DB schema.");
            return;
        }
        Alert.alert("Assignment Created", "Your new assignment has been broadcasted to all students in the portal.");

        // Reset Form
        setTitle('');
        setDueDate('');
        setDueTime('');
        setInstructions('');
        setViewMode('list');
    };

    return (
        <SafeAreaView className="flex-1 bg-[#101827]">
            {/* Native Top Bar */}
            <View className="flex-row items-center justify-between p-4 border-b border-white/5">
                <View className="flex-row items-center">
                    <TouchableOpacity onPress={onBack} className="mr-4 p-2 rounded-full bg-white/5 border border-white/10">
                        <Ionicons name="arrow-back" size={20} color="#fff" />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-white">Assignments</Text>
                </View>
                <TouchableOpacity className="p-2">
                    <Ionicons name="filter-outline" size={24} color="#94a3b8" />
                </TouchableOpacity>
            </View>

            <ScrollView className="p-4" contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
                {/* Header Container matching Screenshot */}
                <View className="flex-row justify-between items-center mb-6">
                    <View className="flex-1">
                        <Text className="text-3xl font-extrabold text-white mb-1 shadow-sm tracking-tight text-fuchsia-400">Assignments Management</Text>
                        <Text className="text-gray-400 font-semibold text-sm">Create and manage assignments for your classes.</Text>
                    </View>
                    {viewMode === 'create' ? (
                        <TouchableOpacity onPress={() => setViewMode('list')} className="bg-gradient-to-r from-fuchsia-600 to-pink-600 py-2.5 px-5 rounded-xl flex-row items-center justify-center shadow-lg shadow-pink-500/30 self-start mt-2">
                            <Ionicons name="document-text" size={16} color="#fff" />
                            <Text className="text-white font-bold ml-2 text-sm tracking-wide">View Assignments</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={() => setViewMode('create')} className="bg-gradient-to-r from-fuchsia-600 to-pink-600 py-2.5 px-5 rounded-xl flex-row items-center justify-center shadow-lg shadow-pink-500/30 self-start mt-2">
                            <Ionicons name="add" size={18} color="#fff" />
                            <Text className="text-white font-bold ml-2 text-sm tracking-wide">New Assignment</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {viewMode === 'list' && (
                    <View className="flex-col gap-4 mt-4">
                        {assignments.length === 0 ? (
                            <View className="p-12 items-center justify-center border border-dashed border-white/10 rounded-[24px] bg-white/5">
                                <Ionicons name="document-text-outline" size={48} color="rgba(255,255,255,0.2)" />
                                <Text className="text-white font-bold text-lg mt-4">No Assignments</Text>
                                <Text className="text-gray-500 text-sm mt-2 text-center">Tap 'New Assignment' to create your first class assignment.</Text>
                            </View>
                        ) : (
                            assignments.map((item) => (
                                <View key={item.id} className="bg-[#1a233a] p-5 rounded-[24px] border border-white/5 shadow-2xl relative overflow-hidden">
                                    <Ionicons name="document-text" size={100} color="rgba(255,255,255,0.02)" style={{ position: 'absolute', right: -20, top: -20 }} />
                                    <View className="bg-purple-900/30 border border-purple-500/30 px-3 py-1 rounded-full self-start mb-3">
                                        <Text className="text-purple-300 text-[10px] font-bold tracking-widest uppercase">{item.course}</Text>
                                    </View>
                                    <Text className="text-xl font-bold text-white mb-6 w-3/4 leading-6">{item.title}</Text>

                                    <View className="flex-col gap-3">
                                        <View className="flex-row items-center">
                                            <View className="w-8 h-8 rounded-lg bg-emerald-500/10 items-center justify-center mr-3">
                                                <Ionicons name="calendar-outline" size={16} color="#34d399" />
                                            </View>
                                            <Text className="text-emerald-400 font-bold text-xs">{item.due_date} at {item.due_time}</Text>
                                        </View>
                                        <View className="flex-row items-center">
                                            <View className="w-8 h-8 rounded-lg bg-blue-500/10 items-center justify-center mr-3">
                                                <Ionicons name="people-outline" size={16} color="#60a5fa" />
                                            </View>
                                            <Text className="text-blue-300 font-bold text-xs">{item.submitted || '0 / 60'} Submitted</Text>
                                        </View>
                                    </View>

                                    <View className="w-full bg-white/5 h-1.5 rounded-full mt-5 overflow-hidden">
                                        <View className={`bg-gradient-to-r from-fuchsia-500 to-blue-500 h-full w-[0%]`} />
                                    </View>
                                </View>
                            ))
                        )}
                    </View>
                )}

                {viewMode === 'create' && (
                    <View className="bg-[#1a233a] border border-white/5 rounded-[24px] p-6 relative mt-2 shadow-2xl">
                        <View className="flex-row items-center mb-6">
                            <Ionicons name="add" size={24} color="#c084fc" />
                            <Text className="text-xl font-extrabold text-white ml-2 tracking-wide">Create New Assignment</Text>
                        </View>

                        <View className="flex-col md:flex-row gap-4 mb-4">
                            {/* Assignment Title */}
                            <View className="flex-1">
                                <Text className="text-gray-400 font-bold text-xs mb-2">Assignment Title</Text>
                                <View className="bg-[#0f172a] border border-white/5 rounded-xl px-4 py-3 h-[52px] justify-center">
                                    <TextInput
                                        value={title}
                                        onChangeText={setTitle}
                                        className="text-white font-medium flex-1 h-full"
                                        placeholder="e.g. Midterm Project Phase 1"
                                        placeholderTextColor="#475569"
                                    />
                                </View>
                            </View>

                            {/* Target Course */}
                            <View className="flex-1">
                                <Text className="text-gray-400 font-bold text-xs mb-2">Target Course</Text>
                                <TouchableOpacity className="bg-[#0f172a] border border-white/5 rounded-xl px-4 py-3 h-[52px] flex-row justify-between items-center">
                                    <Text className="text-white font-medium">{course}</Text>
                                    <Ionicons name="chevron-down" size={16} color="#94a3b8" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View className="flex-row gap-4 mb-5">
                            {/* Due Date */}
                            <View className="flex-1">
                                <Text className="text-[#34d399] flex-row items-center font-bold text-xs mb-2">
                                    <Ionicons name="calendar-outline" size={12} /> Due Date
                                </Text>
                                <View className="bg-[#0f172a] border border-white/5 rounded-xl px-4 py-3 h-[52px] flex-row items-center justify-between">
                                    <TextInput
                                        value={dueDate}
                                        onChangeText={setDueDate}
                                        className="text-white font-medium flex-1 h-full"
                                        placeholder="dd-mm-yyyy"
                                        placeholderTextColor="#475569"
                                    />
                                    <Ionicons name="calendar-outline" size={16} color="#64748b" />
                                </View>
                            </View>

                            {/* Due Time */}
                            <View className="flex-1">
                                <Text className="text-[#60a5fa] flex-row items-center font-bold text-xs mb-2">
                                    <Ionicons name="time-outline" size={12} /> Due Time
                                </Text>
                                <View className="bg-[#0f172a] border border-white/5 rounded-xl px-4 py-3 h-[52px] flex-row items-center justify-between">
                                    <TextInput
                                        value={dueTime}
                                        onChangeText={setDueTime}
                                        className="text-white font-medium flex-1 h-full"
                                        placeholder="--:--"
                                        placeholderTextColor="#475569"
                                    />
                                    <Ionicons name="time-outline" size={16} color="#64748b" />
                                </View>
                            </View>
                        </View>

                        <View className="mb-6">
                            <Text className="text-[#f472b6] flex-row items-center font-bold text-xs mb-2">
                                <Ionicons name="book-outline" size={12} /> Instructions / Description
                            </Text>
                            <TextInput
                                value={instructions}
                                onChangeText={setInstructions}
                                className="bg-[#0f172a] border border-white/5 rounded-xl p-4 text-white font-medium h-32"
                                placeholder="Describe the requirements..."
                                placeholderTextColor="#475569"
                                multiline
                                textAlignVertical="top"
                            />
                        </View>

                        <TouchableOpacity onPress={handleCreateAssignment} className="self-end bg-[#064e3b]/30 border border-[#34d399]/50 px-6 py-3.5 rounded-xl flex-row items-center">
                            <Ionicons name="checkmark-circle-outline" size={18} color="#34d399" />
                            <Text className="text-[#34d399] font-bold ml-2 text-sm tracking-wide">Publish Assignment</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
