import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';

export default function ProfileScreen({ onBack }: { onBack?: () => void }) {
    const { user, role } = useAuthStore();
    const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'appearance' | 'privacy'>('profile');

    // Form States
    const [firstName, setFirstName] = useState(user?.name?.split(' ')[0] || '');
    const [lastName, setLastName] = useState(user?.name?.split(' ').slice(1).join(' ') || '');
    const [bio, setBio] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    // Theme State
    const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark');

    const handleSave = () => {
        setIsEditing(false);
        Alert.alert("Profile Updated", "Your profile details have been securely saved!");
    };

    const renderProfileTab = () => (
        <View className="space-y-4">
            {/* Avatar Section */}
            <View className="items-center mb-8 mt-2">
                <View className="w-24 h-24 rounded-full bg-[#1e293b] border-4 border-[#334155] items-center justify-center relative shadow-xl shadow-black/50">
                    <Text className="text-4xl text-slate-400 font-bold uppercase">{firstName.charAt(0) || 'U'}</Text>
                    {isEditing && (
                        <TouchableOpacity className="absolute -bottom-1 -right-1 bg-blue-500 w-8 h-8 rounded-full items-center justify-center border-2 border-[#101827]">
                            <Ionicons name="camera" size={14} color="white" />
                        </TouchableOpacity>
                    )}
                </View>
                <Text className="text-white text-xl font-bold mt-4">{user?.email || 'student@edutrack.edu'}</Text>
                <Text className="text-slate-400 text-sm font-semibold mt-1 uppercase tracking-widest">{role || 'Student'} Account</Text>
            </View>

            {/* Form Fields */}
            <View className="space-y-4">
                <View className="flex-row gap-4">
                    <View className="flex-1">
                        <Text className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-2 ml-1">First Name</Text>
                        <TextInput
                            className={`w-full text-white px-4 py-4 rounded-xl border font-semibold ${isEditing ? 'bg-[#1e293b] border-indigo-500/50 focus:border-indigo-400' : 'bg-[#0f172a] border-white/5 opacity-80'}`}
                            placeholder="First Name"
                            placeholderTextColor="#475569"
                            value={firstName}
                            onChangeText={setFirstName}
                            editable={isEditing}
                        />
                    </View>
                    <View className="flex-1">
                        <Text className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-2 ml-1">Last Name</Text>
                        <TextInput
                            className={`w-full text-white px-4 py-4 rounded-xl border font-semibold ${isEditing ? 'bg-[#1e293b] border-indigo-500/50 focus:border-indigo-400' : 'bg-[#0f172a] border-white/5 opacity-80'}`}
                            placeholder="Last Name"
                            placeholderTextColor="#475569"
                            value={lastName}
                            onChangeText={setLastName}
                            editable={isEditing}
                        />
                    </View>
                </View>

                <View>
                    <Text className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-2 ml-1 mt-4">Biography</Text>
                    <TextInput
                        className={`w-full text-white px-4 py-4 rounded-xl border font-semibold ${isEditing ? 'bg-[#1e293b] border-indigo-500/50 focus:border-indigo-400' : 'bg-[#0f172a] border-white/5 opacity-80'}`}
                        placeholder="Tell us about yourself..."
                        placeholderTextColor="#475569"
                        value={bio}
                        onChangeText={setBio}
                        editable={isEditing}
                        multiline
                        textAlignVertical="top"
                        numberOfLines={4}
                        style={{ height: 100 }}
                    />
                </View>
            </View>

            {/* Save Button */}
            {isEditing ? (
                <TouchableOpacity onPress={handleSave} className="w-full bg-emerald-600 rounded-xl py-4 flex-row items-center justify-center mt-6 shadow-lg shadow-emerald-500/30">
                    <Ionicons name="checkmark-circle" size={20} color="white" />
                    <Text className="text-white font-bold text-base ml-2 tracking-wide">Save Profile Changes</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity onPress={() => setIsEditing(true)} className="w-full bg-blue-600 rounded-xl py-4 flex-row items-center justify-center mt-6 shadow-lg shadow-blue-500/30">
                    <Ionicons name="pencil" size={20} color="white" />
                    <Text className="text-white font-bold text-base ml-2 tracking-wide">Edit Profile</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    const renderSecurityTab = () => (
        <View className="space-y-6">
            <View className="bg-[#1e293b] p-6 rounded-[24px] border border-white/5 mt-2">
                <View className="flex-row items-center mb-4">
                    <Ionicons name="lock-closed" size={24} color="#34d399" />
                    <Text className="text-white font-bold tracking-tight text-xl ml-2">Multi-Factor Auth</Text>
                </View>
                <Text className="text-sm text-gray-400 mb-6 leading-relaxed">Enhance your account security by requiring a second verification method upon login.</Text>

                <View className="flex-row items-center justify-between p-4 bg-[#0f172a] rounded-xl border border-white/5">
                    <View className="flex-1 pr-2">
                        <Text className="font-bold text-gray-200">Authenticator App</Text>
                        <Text className="text-xs text-gray-500 mt-1">Google Authenticator, Authy, etc.</Text>
                    </View>
                    <TouchableOpacity className="px-4 py-2 bg-emerald-500/20 rounded-lg">
                        <Text className="text-emerald-400 text-xs font-bold">Enable 2FA</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View className="bg-[#1e293b] p-6 rounded-[24px] border border-white/5 mt-4">
                <View className="flex-row items-center mb-4">
                    <Ionicons name="phone-portrait" size={24} color="#60a5fa" />
                    <Text className="text-white font-bold tracking-tight text-xl ml-2">Active Devices</Text>
                </View>

                <View className="space-y-3">
                    <View className="flex-row items-center justify-between p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl relative overflow-hidden">
                        <View className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
                        <View className="flex-1 pr-2 ml-2">
                            <Text className="font-bold text-gray-200 text-sm">Windows PC - Chrome</Text>
                            <Text className="text-xs text-blue-400 mt-1">Current Session • Just now</Text>
                        </View>
                    </View>
                    <View className="flex-row items-center justify-between p-4 bg-[#0f172a] border border-white/5 rounded-xl mt-3">
                        <View className="flex-1 pr-2">
                            <Text className="font-bold text-gray-400 text-sm">iPhone 14 Pro - Native</Text>
                            <Text className="text-xs text-gray-500 mt-1">Delhi, IN • 2 hours ago</Text>
                        </View>
                        <TouchableOpacity>
                            <Text className="text-red-400 text-xs font-medium">Revoke</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );

    const renderAppearanceTab = () => (
        <View className="space-y-6">
            <View className="bg-[#1e293b] p-6 rounded-[24px] border border-white/5 mt-2">
                <View className="flex-row items-center mb-6">
                    <Ionicons name="color-palette" size={24} color="#a78bfa" />
                    <Text className="text-white font-bold tracking-tight text-xl ml-2">Theme Preferences</Text>
                </View>

                <View className="flex-row gap-3 mb-8">
                    {['dark', 'light', 'system'].map((t) => (
                        <TouchableOpacity
                            key={t}
                            onPress={() => setTheme(t as any)}
                            className={`flex-1 py-4 items-center rounded-xl border ${theme === t ? 'bg-indigo-600 border-indigo-400 shadow-md shadow-indigo-500/30' : 'bg-[#0f172a] border-white/5'}`}
                        >
                            <Ionicons
                                name={t === 'dark' ? 'moon' : t === 'light' ? 'sunny' : 'desktop-outline'}
                                size={20}
                                color={theme === t ? 'white' : '#64748b'}
                                className="mb-2"
                            />
                            <Text className={`text-[10px] font-bold uppercase tracking-widest ${theme === t ? 'text-white' : 'text-slate-400'}`}>{t}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text className="font-bold text-gray-300 mb-4">Animations</Text>
                <TouchableOpacity className="flex-row items-center p-4 bg-[#0f172a] border border-white/5 rounded-xl">
                    <View className="w-5 h-5 rounded border border-gray-600 bg-indigo-500 mr-3 items-center justify-center">
                        <Ionicons name="checkmark" size={14} color="white" />
                    </View>
                    <View className="flex-1">
                        <Text className="font-medium text-sm text-gray-200">Hardware Acceleration</Text>
                        <Text className="text-[10px] text-gray-500 mt-1">Disabling this optimizes performance on low-end devices.</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderPrivacyTab = () => (
        <View className="space-y-6">
            <View className="bg-[#1e293b] p-6 rounded-[24px] border border-white/5 mt-2">
                <View className="flex-row items-center mb-4">
                    <Ionicons name="server" size={24} color="#c084fc" />
                    <Text className="text-white font-bold tracking-tight text-xl ml-2">Data Portability</Text>
                </View>
                <Text className="text-sm text-gray-400 mb-6 leading-relaxed">EduTrack respects your complete ownership over your generated academic and personal payloads.</Text>
                <TouchableOpacity className="px-5 py-3 bg-white/10 rounded-xl items-center border border-white/10">
                    <Text className="text-white text-sm font-bold">Export My History (JSON)</Text>
                </TouchableOpacity>
            </View>

            <View className="bg-red-900/10 p-6 rounded-[24px] border border-red-500/20 mt-4">
                <View className="flex-row items-center mb-2">
                    <Ionicons name="warning" size={24} color="#f87171" />
                    <Text className="text-red-400 font-bold tracking-tight text-xl ml-2">Danger Zone</Text>
                </View>
                <Text className="text-sm text-gray-400 mb-6 leading-relaxed">Permanently purge your account, historical activity logs, and settings parameters.</Text>
                <TouchableOpacity className="px-5 py-3 bg-red-600 rounded-xl items-center shadow-lg shadow-red-500/20">
                    <Text className="text-white text-sm font-bold">Delete Account</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View className="flex-1 bg-[#101827]">
            {/* Header */}
            <View className="px-4 pt-16 pb-4 border-b border-white/5 bg-[#101827]">
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        {onBack && (
                            <TouchableOpacity onPress={onBack} className="w-10 h-10 rounded-full bg-[#1e293b] border border-white/5 items-center justify-center mr-3">
                                <Ionicons name="chevron-back" size={24} color="#94a3b8" />
                            </TouchableOpacity>
                        )}
                        <View>
                            <Text className="text-white text-2xl font-bold">Settings</Text>
                            <Text className="text-gray-400 text-xs mt-1">Manage your identity and preferences</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Horizontal Tabs */}
            <View className="border-b border-white/5 bg-[#101827]">
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-2">
                    {[
                        { id: 'profile', icon: 'person-outline', label: 'Profile' },
                        { id: 'security', icon: 'lock-closed-outline', label: 'Security' },
                        { id: 'appearance', icon: 'color-palette-outline', label: 'Appearance' },
                        { id: 'privacy', icon: 'shield-checkmark-outline', label: 'Privacy' }
                    ].map(tab => (
                        <TouchableOpacity
                            key={tab.id}
                            onPress={() => setActiveTab(tab.id as typeof activeTab)}
                            className={`flex-row items-center px-4 py-4 border-b-2 mr-2 ${activeTab === tab.id ? 'border-blue-500' : 'border-transparent'}`}
                        >
                            <Ionicons name={tab.icon as any} size={18} color={activeTab === tab.id ? '#60a5fa' : '#94a3b8'} className="mr-2" />
                            <Text className={`font-bold ml-2 text-sm ${activeTab === tab.id ? 'text-blue-400' : 'text-slate-400'}`}>{tab.label}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView className="flex-1 px-4 pt-6 pb-20 bg-[#101827]">
                {activeTab === 'profile' && renderProfileTab()}
                {activeTab === 'security' && renderSecurityTab()}
                {activeTab === 'appearance' && renderAppearanceTab()}
                {activeTab === 'privacy' && renderPrivacyTab()}
                <View className="h-32" />
            </ScrollView>
        </View>
    );
}

