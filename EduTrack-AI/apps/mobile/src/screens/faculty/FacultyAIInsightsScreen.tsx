import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Bot, AlertTriangle, TrendingDown, FileText, Presentation, Sparkles, ArrowLeft, Home } from 'lucide-react-native';

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
                    <Text className="text-3xl font-bold text-white mt-2">N/A</Text>
                    <View className="flex-row items-center mt-1">
                        <Text className="text-[10px] text-slate-500 ml-1">No Classes</Text>
                    </View>
                </View>
                <View className="flex-1 p-4 rounded-2xl bg-white/5 border border-white/10 items-center">
                    <Text className="text-xs text-slate-400">Attendance</Text>
                    <Text className="text-3xl font-bold text-emerald-400/50 mt-2">N/A</Text>
                </View>
            </View>

            <View className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <View className="flex-row items-center space-x-2 border-b border-emerald-500/10 pb-3 mb-3">
                    <Sparkles className="text-emerald-400/50" size={20} />
                    <Text className="font-semibold text-white/50">Strong Topics</Text>
                </View>
                <Text className="text-slate-500 text-sm leading-6">Waiting for data...</Text>
            </View>
            <View className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                <View className="flex-row items-center space-x-2 border-b border-rose-500/10 pb-3 mb-3">
                    <AlertTriangle className="text-rose-400/50" size={20} />
                    <Text className="font-semibold text-white/50">Weak Topics</Text>
                </View>
                <Text className="text-slate-500 text-sm leading-6">Waiting for data...</Text>
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
            {[] /* Replace with query in future */.length === 0 ? (
                <View className="p-8 items-center bg-white/5 rounded-2xl border border-white/10 mt-4 border-dashed">
                    <AlertTriangle className="text-slate-500 mb-3" size={32} />
                    <Text className="text-lg font-bold text-white mb-1">No Tracking Data</Text>
                    <Text className="text-slate-400 text-xs text-center leading-5 px-4">Create a class & assign students to automatically track risk data.</Text>
                </View>
            ) : (
                [].map((s: any) => (
                    <View key={s.id}></View>
                ))
            )}
        </View>
    );
};



export default function FacultyAIInsightsScreen({ onBack }: { onBack?: () => void }) {
    const [activeTab, setActiveTab] = useState<'class' | 'risk'>('class');

    return (
        <View className="flex-1 bg-slate-900">
            {/* Header Area */}
            <View className="px-6 pt-12 pb-6 bg-slate-900 border-b border-white/5">
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center space-x-3">
                        <View className="w-12 h-12 bg-purple-500/20 rounded-xl items-center justify-center border border-purple-500/30">
                            <Bot className="text-purple-400" size={24} />
                        </View>
                        <View>
                            <Text className="text-2xl font-black text-white">Faculty AI</Text>
                            <Text className="text-purple-300 text-xs">Intelligent Class Oversight</Text>
                        </View>
                    </View>

                    <View className="flex-row space-x-2">
                        {onBack && (
                            <TouchableOpacity onPress={onBack} className="w-10 h-10 bg-white/5 rounded-xl border border-white/10 items-center justify-center">
                                <ArrowLeft size={18} color="#fff" />
                            </TouchableOpacity>
                        )}
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
                </View>
            </View>

            <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                {activeTab === 'class' && <CLASS_ANALYTICS_TAB />}
                {activeTab === 'risk' && <RISK_TAB />}
            </ScrollView>
        </View>
    );
}
