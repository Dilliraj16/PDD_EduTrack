import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Bot, AlertTriangle, TrendingDown, FileText, Presentation, Sparkles } from 'lucide-react-native';

import { supabase } from '../../config/supabase';

const CLASS_ANALYTICS_TAB = () => {
    const [insight, setInsight] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase.functions.invoke('expert_ai_agent', {
                body: { action: 'generate_class_analytics', role: 'faculty', payload: { average: '68%', attendance: '84%', weakTopics: 'TLS Handshake, Certificate Validation' } }
            });
            if (error) throw error;
            setInsight(data?.data);
        } catch (e) {
            setInsight("Error communicating with AI engine.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View className="space-y-6">
            <View className="flex-row justify-between items-center px-1">
                <View className="flex-row items-center space-x-2">
                    <Presentation className="text-purple-500" size={24} />
                    <Text className="text-xl font-bold text-white">Class Analytics</Text>
                </View>
                <TouchableOpacity onPress={handleGenerate} disabled={isLoading} className="bg-indigo-500 px-3 py-2 rounded-lg flex-row items-center space-x-1">
                    <Sparkles color="#fff" size={12} />
                    <Text className="text-white text-xs font-bold">{isLoading ? "Running" : "Insights"}</Text>
                </TouchableOpacity>
            </View>

            {insight && (
                <View className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-xl mt-2">
                    <Text className="text-indigo-200 text-sm leading-6">{insight}</Text>
                </View>
            )}

            <View className="flex-row space-x-4">
                <View className="flex-1 p-4 rounded-2xl bg-white/5 border border-white/10 items-center">
                    <Text className="text-xs text-slate-400">Class Avg</Text>
                    <Text className="text-3xl font-bold text-white mt-2">68%</Text>
                    <View className="flex-row items-center mt-1">
                        <TrendingDown className="text-rose-400" size={12} />
                        <Text className="text-[10px] text-rose-400 ml-1">-8%</Text>
                    </View>
                </View>
                <View className="flex-1 p-4 rounded-2xl bg-white/5 border border-white/10 items-center">
                    <Text className="text-xs text-slate-400">Attendance</Text>
                    <Text className="text-3xl font-bold text-emerald-400 mt-2">84%</Text>
                </View>
            </View>

            <View className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <View className="flex-row items-center space-x-2 border-b border-emerald-500/10 pb-3 mb-3">
                    <Sparkles className="text-emerald-400" size={20} />
                    <Text className="font-semibold text-white">Strong Topics</Text>
                </View>
                <Text className="text-slate-300 text-sm leading-6">• Cryptography Basics{'\n'}• Symmetric Keys</Text>
            </View>
            <View className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                <View className="flex-row items-center space-x-2 border-b border-rose-500/10 pb-3 mb-3">
                    <AlertTriangle className="text-rose-400" size={20} />
                    <Text className="font-semibold text-white">Weak Topics</Text>
                </View>
                <Text className="text-slate-300 text-sm leading-6">• TLS Handshake{'\n'}• Certificate Validation</Text>
            </View>
        </View>
    );
};

const RISK_TAB = () => {
    const [insights, setInsights] = useState<Record<string, string>>({});
    const [loadingIds, setLoadingIds] = useState<Record<string, boolean>>({});

    const handleInsight = async (studentId: string, attendance: string, avg: string) => {
        setLoadingIds(prev => ({ ...prev, [studentId]: true }));
        try {
            const { data, error } = await supabase.functions.invoke('expert_ai_agent', {
                body: { action: 'generate_at_risk_insight', role: 'faculty', payload: { studentId, attendance, trend: `Avg is ${avg}` } }
            });
            if (error) throw error;
            setInsights(prev => ({ ...prev, [studentId]: data?.data || 'Unknown' }));
        } catch (e) {
            setInsights(prev => ({ ...prev, [studentId]: 'Error connecting' }));
        } finally {
            setLoadingIds(prev => ({ ...prev, [studentId]: false }));
        }
    };

    return (
        <View className="space-y-6">
            <View className="flex-row items-center space-x-2 mb-2">
                <AlertTriangle className="text-rose-500" size={24} />
                <Text className="text-xl font-bold text-white">At-Risk Support Needed</Text>
            </View>
            {[
                { id: 'ST1021', name: 'Student A', att: '68%', avg: '51%' },
                { id: 'ST1022', name: 'Student B', att: '73%', avg: '59%' }
            ].map((s) => (
                <View key={s.id} className="p-5 rounded-2xl bg-white/5 border border-white/10 mb-4">
                    <View className="flex-row justify-between items-center mb-3">
                        <Text className="text-lg font-bold text-white">{s.name} ({s.id})</Text>
                        <TouchableOpacity onPress={() => handleInsight(s.id, s.att, s.avg)} disabled={loadingIds[s.id]} className="px-2 py-1 bg-indigo-500 rounded">
                            <Text className="text-[10px] font-bold text-white uppercase">{loadingIds[s.id] ? "Analyzing" : "Ask AI"}</Text>
                        </TouchableOpacity>
                    </View>
                    <View className="flex-row justify-between text-slate-400 mb-4 px-1">
                        <Text className="text-slate-400 text-xs">Att: <Text className="text-white font-bold">{s.att}</Text></Text>
                        <Text className="text-slate-400 text-xs">Avg: <Text className="text-white font-bold">{s.avg}</Text></Text>
                        <Text className="text-slate-400 text-xs">Trend: <Text className="text-rose-400 font-bold">Declining</Text></Text>
                    </View>
                    {insights[s.id] && (
                        <View className="mt-2 bg-indigo-500/10 p-3 rounded-xl border border-indigo-500/20">
                            <Text className="text-xs text-indigo-300 leading-5">AI Note: {insights[s.id]}</Text>
                        </View>
                    )}
                </View>
            ))}
        </View>
    );
};

const COPILOT_TAB = () => {
    const [message, setMessage] = useState('');
    const [history, setHistory] = useState([
        { role: 'ai', text: 'Hello Faculty! Ask me questions about class performance, topics, or attendance trends...' }
    ]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async (forcedMsg?: string) => {
        const userMsg = forcedMsg || message.trim();
        if (!userMsg) return;
        setMessage('');
        setHistory(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsLoading(true);
        try {
            const { data, error } = await supabase.functions.invoke('expert_ai_agent', {
                body: { action: 'copilot_query', role: 'faculty', payload: { message: userMsg } }
            });
            if (error) throw error;
            setHistory(prev => [...prev, { role: 'ai', text: data?.data || 'No response.' }]);
        } catch {
            setHistory(prev => [...prev, { role: 'ai', text: 'Connection failed.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View className="space-y-4 flex-1 h-[500px]">
            <View className="flex-row items-center space-x-2 mb-2">
                <Bot className="text-indigo-500" size={24} />
                <Text className="text-xl font-bold text-white">AI Copilot</Text>
            </View>

            <ScrollView className="flex-1 bg-white/5 rounded-2xl border border-white/10 p-4 mb-4" contentContainerStyle={{ flexGrow: 1, justifyContent: history.length === 1 ? 'center' : 'flex-start' }}>
                {history.map((msg, i) => (
                    <View key={i} className={`mb-4 flex-row ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <View className={`p-3 rounded-2xl max-w-[85%] ${msg.role === 'user' ? 'bg-slate-700' : 'bg-indigo-500/20'}`}>
                            <Text className={msg.role === 'user' ? 'text-white' : 'text-indigo-100'}>{msg.text}</Text>
                        </View>
                    </View>
                ))}
                {isLoading && (
                    <View className="mb-4 flex-row justify-start">
                        <View className="p-3 rounded-2xl bg-indigo-500/20 max-w-[85%]">
                            <Text className="text-indigo-100 italic">Thinking...</Text>
                        </View>
                    </View>
                )}
            </ScrollView>

            <View className="flex-row items-center space-x-3 bg-slate-900 border border-white/10 rounded-xl px-4 py-3">
                <TextInput
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Instructions for Copilot..."
                    placeholderTextColor="#64748b"
                    className="flex-1 text-white py-1"
                />
                <TouchableOpacity onPress={() => handleSend()} disabled={isLoading || !message.trim()} className={`w-8 h-8 rounded-lg items-center justify-center ${!message.trim() || isLoading ? 'bg-slate-700' : 'bg-indigo-500'}`}>
                    <Sparkles color="#fff" size={16} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default function FacultyAIInsightsScreen() {
    const [activeTab, setActiveTab] = useState<'class' | 'risk' | 'copilot'>('class');

    return (
        <View className="flex-1 bg-slate-900">
            {/* Header Area */}
            <View className="px-6 pt-12 pb-6 bg-slate-900 border-b border-white/5">
                <View className="flex-row items-center space-x-3">
                    <View className="w-12 h-12 bg-purple-500/20 rounded-xl items-center justify-center border border-purple-500/30">
                        <Bot className="text-purple-400" size={24} />
                    </View>
                    <View>
                        <Text className="text-2xl font-black text-white">Faculty AI</Text>
                        <Text className="text-purple-300 text-xs">Intelligent Class Oversight</Text>
                    </View>
                </View>

                {/* Tab Navigation Segmented Control */}
                <View className="flex-row mt-6 bg-white/5 p-1 rounded-xl">
                    <TouchableOpacity
                        onPress={() => setActiveTab('class')}
                        className={`flex-1 py-3 rounded-lg items-center ${activeTab === 'class' ? 'bg-purple-500' : ''}`}
                    >
                        <Text className={activeTab === 'class' ? 'text-white font-bold' : 'text-slate-400'}>Analytics</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setActiveTab('risk')}
                        className={`flex-1 py-3 rounded-lg items-center ${activeTab === 'risk' ? 'bg-purple-500' : ''}`}
                    >
                        <Text className={activeTab === 'risk' ? 'text-white font-bold' : 'text-slate-400'}>At-Risk</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setActiveTab('copilot')}
                        className={`flex-1 py-3 rounded-lg items-center ${activeTab === 'copilot' ? 'bg-purple-500' : ''}`}
                    >
                        <Text className={activeTab === 'copilot' ? 'text-white font-bold' : 'text-slate-400'}>Copilot</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                {activeTab === 'class' && <CLASS_ANALYTICS_TAB />}
                {activeTab === 'risk' && <RISK_TAB />}
                {activeTab === 'copilot' && <COPILOT_TAB />}
            </ScrollView>
        </View>
    );
}
