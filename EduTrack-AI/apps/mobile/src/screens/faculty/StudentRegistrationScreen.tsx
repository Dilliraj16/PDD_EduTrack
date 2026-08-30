import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabaseAdmin } from '../../config/supabase';
import { generateRegistrationNumber } from '../../../../../packages/shared/src/utils/idGenerator';

interface StudentRegistrationScreenProps {
    onBack: () => void;
}

export default function StudentRegistrationScreen({ onBack }: StudentRegistrationScreenProps) {
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCreateStudent = async () => {
        if (!firstName || !email || !password) {
            Alert.alert("Missing Fields", "Please fill out all fields.");
            return;
        }

        setLoading(true);

        try {
            const assignedId = generateRegistrationNumber('student');

            // Note: In client-side, this automatically logs in the newly created user.
            const { error } = await supabaseAdmin.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        first_name: firstName,
                        role: 'student',
                        registration_number: assignedId
                    }
                }
            });

            if (error) {
                Alert.alert("Error Creating Account", error.message);
            } else {
                Alert.alert("Success", `Registered student: ${firstName}.\nYour session is fully safe.`);
                setFirstName('');
                setEmail('');
                setPassword('');
            }
        } catch (error: any) {
            Alert.alert("Network Error", error.message || "Failed to create student.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView className="flex-1 bg-[#101827]" contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
            <View className="flex-row items-center mb-6 pt-4">
                <TouchableOpacity onPress={onBack} className="w-10 h-10 bg-white/5 rounded-xl border border-white/10 items-center justify-center mr-4">
                    <Ionicons name="arrow-back" size={20} color="#fff" />
                </TouchableOpacity>
                <View>
                    <Text className="text-2xl font-extrabold text-white">Student Registration</Text>
                    <Text className="text-gray-400 font-semibold text-xs mt-1">Add new students to the platform.</Text>
                </View>
            </View>

            <View className="bg-[#1a233a] p-6 rounded-[28px] border border-white/5 shadow-2xl relative overflow-hidden">
                <View className="absolute right-[-20] top-[-20] opacity-5">
                    <Ionicons name="person-add" size={150} color="#fff" />
                </View>

                <View className="mb-4 text-left w-full relative z-10">
                    <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 ml-1">Student Full Name</Text>
                    <View className="bg-[#121827] border border-white/10 flex-row items-center px-4 py-3 rounded-2xl h-14">
                        <Ionicons name="person" size={20} color="#60a5fa" />
                        <TextInput
                            value={firstName}
                            onChangeText={setFirstName}
                            placeholder="Student's Legal Name"
                            placeholderTextColor="#475569"
                            className="flex-1 text-white ml-3 font-semibold h-full"
                        />
                    </View>
                </View>

                <View className="mb-4 text-left w-full relative z-10">
                    <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 ml-1">Email Address</Text>
                    <View className="bg-[#121827] border border-white/10 flex-row items-center px-4 py-3 rounded-2xl h-14">
                        <Ionicons name="mail" size={20} color="#60a5fa" />
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            placeholder="student@example.com"
                            placeholderTextColor="#475569"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            className="flex-1 text-white ml-3 font-semibold h-full"
                        />
                    </View>
                </View>

                <View className="mb-6 text-left w-full relative z-10">
                    <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 ml-1">Temporary Password</Text>
                    <View className="bg-[#121827] border border-white/10 flex-row items-center px-4 py-3 rounded-2xl h-14">
                        <Ionicons name="key" size={20} color="#60a5fa" />
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Minimum 6 characters"
                            placeholderTextColor="#475569"
                            className="flex-1 text-white ml-3 font-semibold h-full"
                        />
                    </View>
                </View>

                <TouchableOpacity
                    onPress={handleCreateStudent}
                    disabled={loading}
                    className="bg-indigo-600 rounded-2xl py-4 flex-row justify-center items-center relative overflow-hidden shadow-lg shadow-indigo-600/30"
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <>
                            <Ionicons name="person-add" size={20} color="#fff" className="mr-2" />
                            <Text className="text-white font-extrabold text-lg ml-2">Register Student</Text>
                        </>
                    )}
                </TouchableOpacity>

            </View>
        </ScrollView>
    );
}
