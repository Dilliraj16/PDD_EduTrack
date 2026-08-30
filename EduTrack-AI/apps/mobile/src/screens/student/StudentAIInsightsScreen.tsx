import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Bot, LineChart, Presentation, ListChecks, Sparkles } from 'lucide-react-native';
import { supabase } from '../../config/supabase';

const PERFORMANCE_TAB = () => {
    const [insight, setInsight] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleInsight = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase.functions.invoke('expert_ai_agent', {
                body: { action: 'generate_performance_insight', payload: { average: '74%', attendance: '82%' } }
            });
            if (error) throw error;
            setInsight(data?.data || 'Keep up the good work! Focus on your core modules to improve.');
        } catch (e) {
            setInsight('AI network currently unavailable.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View className="space-y-6">
            <View className="flex-row items-center space-x-2">
                <LineChart className="text-indigo-500" size={24} />
                <Text className="text-xl font-bold text-white">AI Performance Analysis</Text>
            </View>

            <View className="flex-row space-x-4">
                <View className="flex-1 p-4 rounded-2xl bg-white/5 border border-white/10 items-center">
                    <Text className="text-xs text-slate-400">Average</Text>
                    <Text className="text-3xl font-bold text-emerald-400 mt-2">74%</Text>
                </View>
                <View className="flex-1 p-4 rounded-2xl bg-white/5 border border-white/10 items-center">
                    <Text className="text-xs text-slate-400">Attendance</Text>
                    <Text className="text-3xl font-bold text-blue-400 mt-2">82%</Text>
                </View>
            </View>

            <View className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                <View className="flex-row items-center justify-between border-b border-indigo-500/10 pb-3 mb-3">
                    <View className="flex-row items-center space-x-2">
                        <Bot className="text-indigo-400" size={20} />
                        <Text className="font-semibold text-white">AI Insight</Text>
                    </View>
                </View>
                <Text className="text-slate-300 text-sm leading-6 mb-4">
                    {insight || "Your DBMS performance is strong (85%). However, your Network Security score has dropped from 78% to 64%. Recent results indicate TLS and X.509 are topics that need additional practice."}
                </Text>
                <TouchableOpacity onPress={handleInsight} disabled={isLoading} className={`py-3 rounded-xl items-center flex-row justify-center space-x-2 ${isLoading ? 'bg-indigo-500/50' : 'bg-indigo-500'}`}>
                    {isLoading ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-semibold flex items-center"><Sparkles size={16} color="#fff" /> Generate Custom Insight</Text>}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const PLAN_TAB = () => {
    const [priority, setPriority] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [planData, setPlanData] = useState<any>(null);

    const handleGenerate = async () => {
        if (!priority) return;
        setIsGenerating(true);
        try {
            const { data, error } = await supabase.functions.invoke('expert_ai_agent', {
                body: { action: 'generate_study_plan', payload: { priority, hours: '2 Hrs / Day', examDate: 'Next Week' } }
            });
            if (error) throw error;
            const cleanText = data?.data?.replace(/```json/g, '').replace(/```/g, '').trim() || "[]";
            setPlanData(JSON.parse(cleanText));
        } catch (e) {
            console.error(e);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <View className="space-y-6 flex-1">
            <View className="flex-row items-center space-x-2">
                <ListChecks className="text-emerald-500" size={24} />
                <Text className="text-xl font-bold text-white">7-Day Study Plan</Text>
            </View>
            <View className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-4">
                <TextInput
                    value={priority}
                    onChangeText={setPriority}
                    placeholder="Target Exam (e.g. Finals)"
                    placeholderTextColor="#94a3b8"
                    className="bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white"
                />
                <TouchableOpacity onPress={handleGenerate} disabled={isGenerating || !priority} className={`py-4 rounded-xl flex-row items-center justify-center space-x-2 ${isGenerating ? 'bg-indigo-500/50' : 'bg-indigo-500'}`}>
                    {isGenerating ? <ActivityIndicator color="#fff" /> : <Sparkles color="#fff" size={20} />}
                    <Text className="text-white font-bold text-base">{isGenerating ? 'Generating...' : 'Generate Plan'}</Text>
                </TouchableOpacity>
            </View>

            {planData && (
                <View className="mt-4 space-y-4">
                    {planData.map((d: any, i: number) => (
                        <View key={i} className="mb-2">
                            <Text className="text-indigo-400 font-bold mb-2 uppercase">{d.title || d.day || `Day ${i + 1}`}</Text>
                            {(d.tasks || (d.task ? [d.task] : [])).map((t: string, ti: number) => (
                                <View key={ti} className="p-4 bg-white/5 border border-white/10 rounded-xl mb-2 flex-row justify-between items-center">
                                    <View className="flex-1 mr-4">
                                        <Text className="text-emerald-400 text-xs font-bold mb-1">TASK {ti + 1}</Text>
                                        <Text className="text-slate-200">{t}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
};

const QUIZ_TAB = () => {
    const [topic, setTopic] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [quizData, setQuizData] = useState<any>(null);

    const handleGenerate = async () => {
        if (!topic) return;
        setIsGenerating(true);
        try {
            const { data, error } = await supabase.functions.invoke('expert_ai_agent', {
                body: { action: 'generate_quiz', payload: { subject: 'General', topic, difficulty: 'Medium', questions: 5 } }
            });
            if (error) throw error;
            const cleanText = data?.data?.replace(/```json/g, '').replace(/```/g, '').trim() || "[]";
            setQuizData(JSON.parse(cleanText));
        } catch (e) {
            console.error(e);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <View className="space-y-6">
            <View className="flex-row items-center space-x-2">
                <Presentation className="text-orange-500" size={24} />
                <Text className="text-xl font-bold text-white">Quiz Generator</Text>
            </View>
            <View className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-4">
                <TextInput
                    value={topic}
                    onChangeText={setTopic}
                    placeholder="Topic (e.g. SQL Injections)"
                    placeholderTextColor="#94a3b8"
                    className="bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white"
                />
                <TouchableOpacity onPress={handleGenerate} disabled={isGenerating || !topic} className={`py-4 rounded-xl flex-row items-center justify-center space-x-2 ${isGenerating ? 'bg-indigo-500/50' : 'bg-indigo-500'}`}>
                    {isGenerating ? <ActivityIndicator color="#fff" /> : <Sparkles color="#fff" size={20} />}
                    <Text className="text-white font-bold text-base">{isGenerating ? 'Drafting Questions...' : 'Generate Practice Quiz'}</Text>
                </TouchableOpacity>
            </View>

            {quizData && (
                <View className="mt-4 space-y-4">
                    {quizData.map((q: any, i: number) => (
                        <View key={i} className="p-4 bg-white/5 rounded-xl border border-white/10">
                            <Text className="text-slate-200 font-bold mb-3">{i + 1}. {q.question}</Text>
                            {q.options.map((opt: string, optIdx: number) => (
                                <View key={optIdx} className={`p-3 rounded-lg border mb-2 ${q.correctOption === optIdx ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-white/10'}`}>
                                    <Text className={q.correctOption === optIdx ? 'text-emerald-400 font-bold' : 'text-slate-400'}>{opt}</Text>
                                </View>
                            ))}
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
};

export default function StudentAIInsightsScreen() {
    const [activeTab, setActiveTab] = useState<'performance' | 'plan' | 'quiz'>('performance');

    return (
        <View className="flex-1 bg-slate-900">
            {/* Header Area */}
            <View className="px-6 pt-12 pb-6 bg-slate-900 border-b border-white/5">
                <View className="flex-row items-center space-x-3">
                    <View className="w-12 h-12 bg-indigo-500/20 rounded-xl items-center justify-center border border-indigo-500/30">
                        <Bot className="text-indigo-400" size={24} />
                    </View>
                    <View>
                        <Text className="text-2xl font-black text-white">EduTrack AI</Text>
                        <Text className="text-indigo-300 text-xs">Student Workspace Mode</Text>
                    </View>
                </View>

                {/* Tab Navigation Segmented Control */}
                <View className="flex-row mt-6 bg-white/5 p-1 rounded-xl">
                    <TouchableOpacity
                        onPress={() => setActiveTab('performance')}
                        className={`flex-1 py-3 rounded-lg items-center ${activeTab === 'performance' ? 'bg-indigo-500' : ''}`}
                    >
                        <Text className={activeTab === 'performance' ? 'text-white font-bold' : 'text-slate-400'}>Analytics</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setActiveTab('plan')}
                        className={`flex-1 py-3 rounded-lg items-center ${activeTab === 'plan' ? 'bg-indigo-500' : ''}`}
                    >
                        <Text className={activeTab === 'plan' ? 'text-white font-bold' : 'text-slate-400'}>Plan</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setActiveTab('quiz')}
                        className={`flex-1 py-3 rounded-lg items-center ${activeTab === 'quiz' ? 'bg-indigo-500' : ''}`}
                    >
                        <Text className={activeTab === 'quiz' ? 'text-white font-bold' : 'text-slate-400'}>Quiz</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
                {activeTab === 'performance' && <PERFORMANCE_TAB />}
                {activeTab === 'plan' && <PLAN_TAB />}
                {activeTab === 'quiz' && <QUIZ_TAB />}
                <View className="h-10" />
            </ScrollView>
        </View>
    );
}
