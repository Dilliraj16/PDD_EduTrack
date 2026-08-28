import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../config/supabase';
import { useAuthStore } from '../store/authStore';
import { generateRegistrationNumber } from '../utils/idGenerator';

const STATIC_PASSWORD = 'EduTrack@SimpleLog1n!';

const KeyboardWrapper = Platform.OS === 'web' ? View : KeyboardAvoidingView as any;

export default function LoginScreen() {
    const [action, setAction] = useState<'login' | 'create'>('login');
    const [role, setRole] = useState<'student' | 'faculty'>('student');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const login = useAuthStore((state) => state.login);

    const handleAction = async () => {
        setLoading(true);
        setErrorMsg("");

        try {
            if (action === 'create') {
                const assignedId = generateRegistrationNumber(role);
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password: password || STATIC_PASSWORD,
                    options: { data: { first_name: firstName, role: role, registration_number: assignedId } }
                });

                if (error) {
                    setErrorMsg(error.message);
                    setLoading(false);
                    return;
                }
                if (data.session) login({ id: data.session.user.id, email: data.session.user.email!, name: firstName }, role);
                else setErrorMsg("Check your inbox to verify your email, or enable auto-confirm in Supabase!");
            } else {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password: password || STATIC_PASSWORD,
                });
                if (error) {
                    setErrorMsg(error.message);
                    setLoading(false);
                    return;
                }
                if (data.session) {
                    const meta = data.session.user.user_metadata;
                    login({ id: data.session.user.id, email: data.session.user.email!, name: meta.first_name || email.split('@')[0] }, meta.role || role);
                }
            }
        } catch (err: any) {
            setErrorMsg(err.message || "Network error");
        }
        setLoading(false);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#0b1221' }}>
            <KeyboardWrapper
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1, width: '100%' }}
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 }}>
                    <View className="bg-[#121b2f] border border-white/5 w-full max-w-sm rounded-[32px] p-6 shadow-2xl relative my-8">

                        {/* Header Icon */}
                        <View className="items-center mb-6">
                            <View className="bg-white/5 p-4 rounded-3xl border border-white/10 mb-4 items-center justify-center">
                                <Ionicons name="sparkles" size={28} color="#ffffff" />
                            </View>
                            <Text className="text-3xl font-extrabold text-white mb-2 tracking-tight">EduTrack</Text>
                            <Text className="text-gray-400 font-semibold text-sm">Enterprise Smart Campus</Text>
                        </View>

                        {/* Top Action Tabs */}
                        <View className="flex-row bg-[#080d19] rounded-2xl p-1 mb-6 border border-white/5 relative overflow-hidden">
                            <TouchableOpacity
                                onPress={() => setAction('login')}
                                className={`flex-1 py-3 items-center justify-center rounded-xl ${action === 'login' ? 'bg-[#1b253b] shadow-lg' : 'bg-transparent'}`}
                            >
                                <Text className={`font-bold ${action === 'login' ? 'text-white' : 'text-gray-500'}`}>Log in</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setAction('create')}
                                className={`flex-1 py-3 items-center justify-center rounded-xl ${action === 'create' ? 'bg-[#1b253b] shadow-lg' : 'bg-transparent'}`}
                            >
                                <Text className={`font-bold ${action === 'create' ? 'text-white' : 'text-gray-500'}`}>Create Account</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Role Tabs */}
                        <View className="flex-row gap-4 mb-6">
                            <TouchableOpacity
                                onPress={() => setRole('student')}
                                className={`flex-1 py-3 rounded-2xl flex-row items-center justify-center ${role === 'student' ? 'bg-[#0f2942] border border-[#1d4ed8]' : 'bg-white/5 border border-white/5'}`}
                            >
                                <Ionicons name="person-outline" size={16} color={role === 'student' ? '#60a5fa' : '#94a3b8'} />
                                <Text className={`ml-2 font-bold ${role === 'student' ? 'text-[#60a5fa]' : 'text-gray-400'}`}>Student</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setRole('faculty')}
                                className={`flex-1 py-3 rounded-2xl flex-row items-center justify-center ${role === 'faculty' ? 'bg-[#0f2942] border border-[#1d4ed8]' : 'bg-white/5 border border-white/5'}`}
                            >
                                <Ionicons name="book-outline" size={16} color={role === 'faculty' ? '#60a5fa' : '#94a3b8'} />
                                <Text className={`ml-2 font-bold ${role === 'faculty' ? 'text-[#60a5fa]' : 'text-gray-400'}`}>Faculty</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Inputs */}
                        <View className="mb-4">
                            {action === 'create' && (
                                <View className="flex-row items-center bg-[#0a0f1c] border border-white/10 rounded-2xl px-4 py-1 mb-4 h-14">
                                    <Ionicons name="person-outline" size={20} color="#64748b" />
                                    <TextInput
                                        className="flex-1 text-white ml-3 font-semibold h-full"
                                        placeholder="First Name"
                                        placeholderTextColor="#64748b"
                                        value={firstName}
                                        onChangeText={setFirstName}
                                    />
                                </View>
                            )}
                            <View className="flex-row items-center bg-[#0a0f1c] border border-white/10 rounded-2xl px-4 py-1 mb-4 h-14">
                                <Ionicons name="mail-outline" size={20} color="#64748b" />
                                <TextInput
                                    className="flex-1 text-white ml-3 font-semibold h-full"
                                    placeholder="Email Address"
                                    placeholderTextColor="#64748b"
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize="none"
                                />
                            </View>
                            <View className="flex-row items-center bg-[#0a0f1c] border border-white/10 rounded-2xl px-4 py-1 mb-2 h-14">
                                <Ionicons name="key-outline" size={20} color="#64748b" />
                                <TextInput
                                    className="flex-1 text-white ml-3 font-semibold h-full"
                                    placeholder="Password"
                                    placeholderTextColor="#64748b"
                                    secureTextEntry
                                    value={password}
                                    onChangeText={setPassword}
                                />
                            </View>
                        </View>

                        {errorMsg !== "" && (
                            <Text className="text-red-400 text-sm text-center mb-4 px-2">{errorMsg}</Text>
                        )}

                        {/* Action Button */}
                        <TouchableOpacity
                            className="bg-violet-600 py-4 rounded-2xl flex-row justify-center items-center mt-2 shadow-lg shadow-violet-600/30 active:scale-95 transition-transform"
                            onPress={handleAction}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <>
                                    <Text className="text-white font-extrabold text-lg mr-2 tracking-wide text-center">
                                        {action === 'login' ? 'Log in to Portal' : 'Create Account'}
                                    </Text>
                                    <Ionicons name="arrow-forward" size={20} color="#ffffff" />
                                </>
                            )}
                        </TouchableOpacity>

                    </View>
                </ScrollView>
            </KeyboardWrapper>
        </SafeAreaView>
    );
}
