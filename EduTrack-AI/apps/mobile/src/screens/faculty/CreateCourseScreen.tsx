import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCourseStore } from '../../store/courseStore';

export default function CreateCourseScreen({ onBack }: { onBack: () => void }) {
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const addCourse = useCourseStore(state => state.addCourse);

    const [isLoading, setIsLoading] = useState(false);

    const handleCreate = async () => {
        if (!name.trim() || !code.trim()) {
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }
        setIsLoading(true);
        const success = await addCourse({ name: name.trim(), code: code.trim().toUpperCase() });
        setIsLoading(false);

        if (success) {
            Alert.alert("Success", "Course & Chat Group Created Successfully!");
            setName('');
            setCode('');
        } else {
            Alert.alert("Error", "Failed to create the course. Check your connection or permissions.");
        }
    };
    return (
        <SafeAreaView className="flex-1 bg-[#101827]">
            <View className="flex-row items-center justify-between p-4 border-b border-white/5">
                <View className="flex-row items-center">
                    <TouchableOpacity onPress={onBack} className="mr-4 p-2 rounded-full bg-white/5 border border-white/10">
                        <Ionicons name="arrow-back" size={20} color="#fff" />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-white">Create Course</Text>
                </View>
            </View>

            <ScrollView className="p-4">
                <View className="bg-indigo-900/20 border border-indigo-500/20 rounded-[24px] p-6 mb-6">
                    <View className="flex-row items-center mb-2">
                        <Ionicons name="book-outline" size={24} color="#a5b4fc" />
                        <Text className="text-2xl font-bold text-white pl-3">Create New Subject</Text>
                    </View>
                    <Text className="text-indigo-200/60 text-sm leading-5 mt-2">
                        Initialize a new course curriculum. This will automatically set up the required grading modules and broadcast a real-time Subject Chat group across the platform.
                    </Text>
                </View>

                <View className="bg-[#1a233a] rounded-3xl p-6 border border-white/5">
                    <View className="mb-4">
                        <Text className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-2 flex-row items-center">
                            <Ionicons name="layers-outline" size={14} /> Subject Name
                        </Text>
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            className="bg-[#0f172a] border border-white/10 text-white rounded-2xl px-4 py-4 text-base font-semibold"
                            placeholder="e.g. Artificial Intelligence"
                            placeholderTextColor="#475569"
                        />
                    </View>

                    <View className="mb-8">
                        <Text className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-2 flex-row items-center">
                            <Ionicons name="add" size={14} /> Course Code
                        </Text>
                        <TextInput
                            value={code}
                            onChangeText={setCode}
                            className="bg-[#0f172a] border border-white/10 text-white rounded-2xl px-4 py-4 text-base font-semibold uppercase"
                            placeholder="E.G. CS501"
                            placeholderTextColor="#475569"
                            autoCapitalize="characters"
                        />
                    </View>

                    <View className="border-t border-white/5 pt-6 items-end">
                        <TouchableOpacity onPress={handleCreate} className="bg-[#1e293b] border border-white/10 px-6 py-3.5 rounded-xl flex-row items-center">
                            <Ionicons name="book-outline" size={18} color="#94a3b8" />
                            <Text className="text-gray-300 font-bold ml-2">Create & Broadcast</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
