import React, { useState, useEffect } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Platform, UIManager, LayoutAnimation } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../config/supabase';
import { useAuthStore } from '../../store/authStore';

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

export default function ODRequestScreen({ onBack }: { onBack?: () => void }) {
    const { user } = useAuthStore();
    const [reason, setReason] = useState('');
    const [date, setDate] = useState('');
    const [requests, setRequests] = useState<any[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [file, setFile] = useState<{ name: string, size: number } | null>(null);

    const [formVisible, setFormVisible] = useState(false);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        if (!user?.id) return;
        const { data, error } = await supabase
            .from('od_requests')
            .select('*')
            .eq('student_id', user.id)
            .order('created_at', { ascending: false });

        if (!error && data) {
            setRequests(data);
        }
        setLoading(false);
    };

    const submitRequest = async () => {
        if (!reason.trim() || !date.trim() || !file || !user?.id) return;
        setSubmitting(true);
        // Include date in reason since DB schema lacks explicit date column
        const finalReason = `[Absence Date: ${date}] ${reason}`;

        const { error } = await supabase
            .from('od_requests')
            .insert([{ student_id: user.id, reason: finalReason, status: 'pending', file_url: file.name }]);

        setSubmitting(false);
        if (!error) {
            setReason('');
            setDate('');
            setFile(null);
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setFormVisible(false); // Close form
            fetchRequests(); // refresh list
        } else {
            alert('Error submitting OD Request');
        }
    };

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['application/pdf', 'image/*'],
                copyToCacheDirectory: true,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const doc = result.assets[0];
                const sizeMb = doc.size ? parseFloat((doc.size / (1024 * 1024)).toFixed(2)) : 0;
                setFile({ name: doc.name, size: sizeMb });
            }
        } catch (error) {
            console.error("Error picking document: ", error);
        }
    };

    const toggleForm = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setFormVisible(!formVisible);
    };

    return (
        <ScrollView className="flex-1 bg-[#101827]" contentContainerStyle={{ padding: 16 }}>
            {/* Header Mirroring Web */}
            <View className="mb-6 flex-row justify-between items-center">
                <View className="flex-row items-center flex-1 pr-4">
                    {onBack && (
                        <TouchableOpacity onPress={onBack} className="w-10 h-10 rounded-full bg-[#1e293b] border border-white/5 items-center justify-center mr-3">
                            <Ionicons name="chevron-back" size={24} color="#94a3b8" />
                        </TouchableOpacity>
                    )}
                    <View>
                        <Text className="text-3xl font-extrabold text-[#38bdf8] tracking-tight mb-1">
                            Request OD
                        </Text>
                        <Text className="text-gray-400 font-medium">Submit official absence backed by proof.</Text>
                    </View>
                </View>
                {!formVisible && (
                    <TouchableOpacity
                        className="bg-blue-600 w-10 h-10 rounded-full items-center justify-center shadow-lg shadow-blue-600/30"
                        onPress={toggleForm}
                    >
                        <Ionicons name="add" size={24} color="white" />
                    </TouchableOpacity>
                )}
            </View>

            {formVisible && (
                <View className="bg-[#1a233a] p-5 rounded-[24px] mb-8 border border-white/5 shadow-2xl">
                    <View className="flex-row justify-between items-center mb-5">
                        <Text className="text-lg font-bold text-white">New Application</Text>
                        <TouchableOpacity onPress={toggleForm} className="bg-white/10 rounded-full w-8 h-8 items-center justify-center">
                            <Ionicons name="close" size={18} color="white" />
                        </TouchableOpacity>
                    </View>

                    <View className="mb-4">
                        <Text className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-2">Date of Absence</Text>
                        <TextInput
                            className="bg-black/20 text-white p-4 rounded-xl border border-white/10"
                            placeholder="YYYY-MM-DD or Event Date"
                            placeholderTextColor="#64748b"
                            value={date}
                            onChangeText={setDate}
                        />
                    </View>

                    <View className="mb-4">
                        <Text className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-2">Reason for Request</Text>
                        <TextInput
                            className="bg-black/20 text-white p-4 rounded-xl border border-white/10 h-24"
                            placeholder="Provide event details, competition name..."
                            placeholderTextColor="#64748b"
                            value={reason}
                            onChangeText={setReason}
                            multiline
                            textAlignVertical="top"
                        />
                    </View>

                    <View className="mb-6">
                        <Text className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-2">Supporting Document Proof</Text>

                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={pickDocument}
                            className={`border-2 border-dashed rounded-2xl p-6 items-center justify-center ${file ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/20 bg-black/20'
                                }`}
                        >
                            {file ? (
                                <View className="w-full flex-row items-center justify-between">
                                    <View className="flex-row items-center flex-1">
                                        <View className="w-10 h-10 rounded-full bg-emerald-500/20 items-center justify-center mr-3">
                                            <Ionicons name="document-text" size={20} color="#10b981" />
                                        </View>
                                        <View className="flex-1">
                                            <Text className="font-semibold text-white text-sm" numberOfLines={1}>{file.name}</Text>
                                            <Text className="text-xs text-emerald-400 mt-0.5">{file.size} MB • Tap to replace</Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity onPress={() => setFile(null)} className="w-8 h-8 rounded-full bg-white/10 items-center justify-center">
                                        <Ionicons name="close" size={16} color="white" />
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <>
                                    <View className="w-12 h-12 rounded-full bg-white/5 items-center justify-center mb-3">
                                        <Ionicons name="cloud-upload" size={24} color="#94a3b8" />
                                    </View>
                                    <Text className="font-bold text-white mb-1 text-sm">Tap to upload PDF or Image</Text>
                                    <Text className="text-xs text-gray-500">Required for faculty approval</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        className={`p-4 rounded-xl flex-row justify-center items-center shadow-lg ${!reason.trim() || !date.trim() || !file || submitting
                            ? 'bg-blue-600/50'
                            : 'bg-[#2563eb]'
                            }`}
                        onPress={submitRequest}
                        disabled={submitting || !reason.trim() || !date.trim() || !file}
                    >
                        {submitting ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <>
                                <Ionicons name="send" size={18} color="white" />
                                <Text className="text-white font-bold ml-2">Submit OD Application</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            )}

            <View className="flex-row items-center mb-4">
                <Text className="text-lg font-bold text-white">Your Past Applications</Text>
                <View className="bg-white/10 rounded-full px-2 py-1 ml-3">
                    <Text className="text-white text-[10px] font-bold">{requests.length}</Text>
                </View>
            </View>

            {loading ? (
                <View className="items-center py-10">
                    <ActivityIndicator color="#38bdf8" size="large" />
                </View>
            ) : requests.length === 0 ? (
                <View className="items-center justify-center py-10 bg-black/20 rounded-[24px] border border-white/5">
                    <Ionicons name="document-text-outline" size={48} color="#475569" />
                    <Text className="text-gray-500 mt-4 font-bold">No OD applications filed.</Text>
                </View>
            ) : (
                requests.map(req => (
                    <View key={req.id} className="bg-[#1a233a] p-4 rounded-[20px] mb-3 border border-white/5 shadow-md">
                        <View className="flex-row justify-between items-start mb-2">
                            <Text className="text-white font-bold flex-1 pr-3 lh-relaxed" numberOfLines={2}>{req.reason}</Text>
                            <View className={`px-3 py-1 rounded-full ${req.status === 'pending' ? 'bg-amber-500/20 border border-amber-500/30' :
                                req.status === 'approved' ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-rose-500/20 border border-rose-500/30'
                                }`}>
                                <Text className={`text-[10px] font-bold uppercase tracking-wider ${req.status === 'pending' ? 'text-amber-500' :
                                    req.status === 'approved' ? 'text-emerald-400' : 'text-rose-400'
                                    }`}>{req.status}</Text>
                            </View>
                        </View>

                        <View className="flex-row items-center border-t border-white/5 pt-3 mt-1">
                            <Ionicons name="calendar-outline" size={14} color="#64748b" />
                            <Text className="text-gray-400 text-xs ml-2 font-medium">
                                Submitted: {new Date(req.created_at).toLocaleDateString()}
                            </Text>
                        </View>
                    </View>
                ))
            )}
        </ScrollView>
    );
}
