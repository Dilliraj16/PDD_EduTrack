import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../config/supabase';
import { useAuthStore } from '../../store/authStore';
import { useCourseStore } from '../../store/courseStore';

interface Message {
    id: string;
    content: string;
    sender: string;
    role: string;
    isMe: boolean;
    time: string;
    attachment?: any;
}

export default function ChatScreen({ onBack }: { onBack?: () => void }) {
    const { user, role } = useAuthStore();
    const courses = useCourseStore((state) => state.courses);
    const effectiveRole = role || (user as any)?.user_metadata?.role || 'student';
    const activeCourses = courses; // Both faculty and students can view created courses directly in Subject Chat now
    const [activeSubject, setActiveSubject] = useState(activeCourses[0] || null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const scrollViewRef = useRef<ScrollView>(null);

    // Live WebSockets Message Fetcher & Subscriber
    useEffect(() => {
        if (!activeSubject?.code || !user?.id) return;
        let isMounted = true;

        async function fetchMessages() {
            if (isMounted) setIsLoading(true);

            // 1. Fetch History
            const { data, error } = await supabase
                .from('chat_messages')
                .select(`
                    id, content, attachment, created_at,
                    profiles (id, full_name, role)
                `)
                .eq('course_code', activeSubject.code)
                .order('created_at', { ascending: true });

            if (!error && data && isMounted) {
                const formatted = data.map((d: any) => ({
                    id: d.id,
                    content: d.content || '',
                    sender: d.profiles?.full_name || 'Anonymous',
                    role: d.profiles?.role || 'student',
                    isMe: d.profiles?.id === user?.id,
                    time: new Date(d.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    attachment: d.attachment
                }));
                setMessages(formatted);
            }
            if (isMounted) setIsLoading(false);
        }

        fetchMessages();

        // 2. Subscribe to Real-Time WebSockets
        const channel = supabase
            .channel(`public:chat_messages:course_code=eq.${activeSubject.code}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `course_code=eq.${activeSubject.code}` },
                async (payload) => {
                    // Fetch the profile data for the new message sender
                    const { data: profile } = await supabase.from('profiles').select('full_name, role').eq('id', payload.new.sender_id).single();

                    if (isMounted) {
                        setMessages((prev) => [...prev, {
                            id: payload.new.id,
                            content: payload.new.content || '',
                            sender: profile?.full_name || 'Anonymous',
                            role: profile?.role || 'student',
                            isMe: payload.new.sender_id === user.id,
                            time: new Date(payload.new.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            attachment: payload.new.attachment
                        }]);
                    }
                }
            )
            .subscribe();

        return () => {
            isMounted = false;
            supabase.removeChannel(channel);
        };
    }, [activeSubject?.code, user?.id]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !user || !activeSubject) return;

        const content = newMessage;
        setNewMessage(''); // optimistic clear

        // Scroll to bottom immediately
        setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);

        await supabase.from('chat_messages').insert({
            course_code: activeSubject.code,
            sender_id: user.id,
            content: content
        });
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            className="flex-1"
        >
            <View className="flex-1 px-4 pt-4">
                {/* Header */}
                <View className="flex-row items-center justify-between mb-4">
                    <View className="flex-row items-center flex-1">
                        {onBack && (
                            <TouchableOpacity onPress={onBack} className="w-10 h-10 rounded-full bg-[#1e293b] border border-white/5 items-center justify-center mr-3">
                                <Ionicons name="chevron-back" size={24} color="#94a3b8" />
                            </TouchableOpacity>
                        )}
                        <View className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/30 items-center justify-center mr-3">
                            <Ionicons name="chatbubbles" size={24} color="#2dd4bf" />
                        </View>
                        <Text className="text-white text-2xl font-bold flex-1" numberOfLines={1}>Chat</Text>
                    </View>
                    <TouchableOpacity className="p-2 rounded-full bg-[#1e293b] border border-white/5">
                        <Ionicons name="search" size={20} color="#94a3b8" />
                    </TouchableOpacity>
                </View>

                {/* Subjet Tabs */}
                {activeCourses.length > 0 && (
                    <View className="mb-4 mt-2">
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-2">
                            {activeCourses.map((grp) => {
                                const isSelected = activeSubject?.code === grp.code;
                                return (
                                    <TouchableOpacity
                                        key={grp.code}
                                        onPress={() => setActiveSubject(grp)}
                                        className={`px-4 py-2 rounded-xl border mr-2 ${isSelected ? 'bg-teal-500/20 border-teal-500/50 shadow-sm' : 'bg-[#1e293b] border-white/5'}`}
                                    >
                                        <Text className={`font-bold text-sm ${isSelected ? 'text-teal-300' : 'text-slate-400'}`}>{grp.code}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </View>
                )}

                <View className="bg-[#10172a] rounded-t-3xl border border-x-white/5 border-t-white/5 shadow-2xl flex-1 mt-2 mx-[-16px]">
                    {!activeSubject ? (
                        <View className="flex-1 items-center justify-center p-8 mt-10">
                            <Ionicons name="chatbox-outline" size={64} color="#334155" />
                            <Text className="text-white font-bold text-lg mt-4">No Groups Found</Text>
                            <Text className="text-slate-500 text-sm mt-2 text-center">You must create or inherit a subject first.</Text>
                        </View>
                    ) : (
                        <>
                            {/* Chat Header inside window */}
                            <View className="border-b border-white/5 p-4 flex-row items-center bg-[#1e293b] rounded-t-3xl">
                                <View className="w-10 h-10 bg-teal-500 rounded-xl items-center justify-center mr-3 shadow-lg">
                                    <Text className="text-white font-black">{activeSubject.code.slice(0, 2)}</Text>
                                </View>
                                <View>
                                    <Text className="text-white font-bold">{activeSubject.name}</Text>
                                    <View className="flex-row items-center mt-0.5">
                                        <View className="w-2 h-2 rounded-full bg-emerald-400 mr-1.5" />
                                        <Text className="text-emerald-400 text-xs font-bold">Live Network</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Message Area */}
                            <ScrollView
                                ref={scrollViewRef}
                                className="flex-1 p-4"
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingBottom: 20 }}
                                onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                            >
                                {isLoading ? (
                                    <View className="flex-1 items-center justify-center mt-20">
                                        <ActivityIndicator size="large" color="#2dd4bf" />
                                        <Text className="text-slate-400 mt-4 text-sm font-medium">Connecting to Room Data...</Text>
                                    </View>
                                ) : messages.length === 0 ? (
                                    <View className="flex-1 items-center justify-center mt-20 opacity-50">
                                        <Ionicons name="chatbubbles-outline" size={48} color="#94a3b8" />
                                        <Text className="text-slate-400 font-medium mt-4 text-center">No messages yet. Start the conversation!</Text>
                                    </View>
                                ) : (
                                    messages.map((msg, index) => (
                                        <View key={msg.id} className={`flex-row mb-4 ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                                            {!msg.isMe && (
                                                <View className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden mr-2 mt-1">
                                                    <Image source={{ uri: `https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.sender}` }} className="w-full h-full" />
                                                </View>
                                            )}
                                            <View className={`max-w-[80%] ${msg.isMe ? 'items-end' : 'items-start'}`}>
                                                {!msg.isMe && (
                                                    <View className="flex-row items-center mb-1">
                                                        <Text className="text-slate-300 font-bold text-xs">{msg.sender}</Text>
                                                        {msg.role === 'faculty' && (
                                                            <View className="bg-purple-500/20 border border-purple-500/30 px-1.5 py-0.5 rounded ml-2">
                                                                <Text className="text-purple-300 text-[8px] font-bold uppercase">{msg.role}</Text>
                                                            </View>
                                                        )}
                                                        <Text className="text-slate-500 text-[10px] ml-2 font-medium">{msg.time}</Text>
                                                    </View>
                                                )}
                                                <View
                                                    className={`p-3 rounded-2xl ${msg.isMe
                                                        ? 'bg-teal-600 rounded-tr-sm'
                                                        : 'bg-[#1e293b] border border-white/5 rounded-tl-sm'
                                                        }`}
                                                >
                                                    {msg.content ? (
                                                        <Text className="text-white text-sm">{msg.content}</Text>
                                                    ) : null}
                                                </View>
                                                {msg.isMe && (
                                                    <View className="flex-row items-center mt-1">
                                                        <Text className="text-slate-500 text-[10px] font-medium mr-1">{msg.time}</Text>
                                                        <Ionicons name="checkmark-done" size={12} color="#2dd4bf" />
                                                    </View>
                                                )}
                                            </View>
                                        </View>
                                    ))
                                )}
                            </ScrollView>

                            {/* Input Area */}
                            <View className="flex-row items-center bg-[#1e293b] p-2 mb-24 lg:mb-4 mx-4 rounded-full border border-white/10">
                                <TouchableOpacity className="p-2 ml-1">
                                    <Ionicons name="attach" size={24} color="#94a3b8" />
                                </TouchableOpacity>
                                <TextInput
                                    value={newMessage}
                                    onChangeText={setNewMessage}
                                    onSubmitEditing={handleSendMessage}
                                    className="flex-1 text-white px-2 py-2 font-medium"
                                    placeholder={`Message ${activeSubject.code}...`}
                                    placeholderTextColor="#64748b"
                                />
                                <TouchableOpacity
                                    onPress={handleSendMessage}
                                    disabled={!newMessage.trim()}
                                    className={`p-2.5 mr-1 rounded-full ${newMessage.trim() ? 'bg-teal-500' : 'bg-slate-700'}`}
                                >
                                    <Ionicons name="send" size={18} color={newMessage.trim() ? 'white' : '#94a3b8'} className="ml-1" />
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}
