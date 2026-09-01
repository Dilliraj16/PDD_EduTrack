import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, AlertTriangle, TrendingDown, FileText, Presentation, Sparkles } from 'lucide-react';

const ClassPerformanceTab = () => {
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
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2"><Presentation className="text-purple-500" /> Class Performance Analytics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass-panel p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <p className="text-xs text-slate-400">Class Avg</p>
                    <p className="text-3xl font-bold text-white mt-1">N/A</p>
                    <span className="text-[10px] text-slate-500 flex items-center justify-center mt-1">No classes assigned</span>
                </div>
                <div className="glass-panel p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <p className="text-xs text-slate-400">Attendance</p>
                    <p className="text-3xl font-bold text-emerald-400/50 mt-1">N/A</p>
                </div>
                <div className="glass-panel p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <p className="text-xs text-slate-400">Assignments</p>
                    <p className="text-3xl font-bold text-blue-400/50 mt-1">0</p>
                </div>
            </div>

            <div className="flex gap-4">
                <div className="flex-1 p-6 rounded-2xl bg-white/5 border border-emerald-500/10">
                    <h3 className="font-semibold text-emerald-400/50 flex items-center gap-2"><Sparkles className="inline mr-2 w-5 h-5" /> Strong Topics</h3>
                    <p className="text-slate-500 text-sm mt-2">Waiting for student submissions...</p>
                </div>
                <div className="flex-1 p-6 rounded-2xl bg-white/5 border border-rose-500/10">
                    <h3 className="font-semibold text-rose-400/50 flex items-center gap-2"><AlertTriangle className="inline mr-2 w-5 h-5" /> Weak Topics</h3>
                    <p className="text-slate-500 text-sm mt-2">Waiting for student submissions...</p>
                </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-indigo-500/20">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2"><Bot className="text-indigo-400" /> AI Class Diagnosis</h3>
                    <button onClick={handleGenerate} disabled={isLoading} className="px-4 py-2 bg-indigo-500 disabled:opacity-50 hover:bg-indigo-600 rounded-lg text-sm text-white font-medium transition-colors flex items-center gap-2">
                        <Sparkles className="w-4 h-4" /> {isLoading ? "Analyzing..." : "Generate Analysis"}
                    </button>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-xl border border-indigo-500/10">
                    <p className="text-slate-300 text-sm leading-relaxed">
                        {insight || "Click generate to stream real-time insights from EduTrack AI."}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

const AtRiskTab = () => {
    const [insights, setInsights] = useState<Record<string, string>>({});
    const [loadingIds, setLoadingIds] = useState<Record<string, boolean>>({});

    const handleInsight = async (studentId: string, attendance: string, avg: string) => {
        setLoadingIds(prev => ({ ...prev, [studentId]: true }));
        try {
            const { data, error } = await supabase.functions.invoke('expert_ai_agent', {
                body: { action: 'generate_at_risk_insight', role: 'faculty', payload: { studentId, attendance, trend: `Average is ${avg}` } }
            });
            if (error) throw error;
            setInsights(prev => ({ ...prev, [studentId]: data?.data || 'Review required.' }));
        } catch (e) {
            setInsights(prev => ({ ...prev, [studentId]: 'Error generating insight.' }));
        } finally {
            setLoadingIds(prev => ({ ...prev, [studentId]: false }));
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2"><AlertTriangle className="text-rose-500" /> Academic Support Needed</h2>

            <div className="space-y-4">
                {[] /* Fetch real array here eventually */.length === 0 ? (
                    <div className="p-8 text-center bg-white/5 rounded-2xl border border-white/10 border-dashed">
                        <AlertTriangle className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                        <h3 className="text-lg font-bold text-white">No Tracking Data Available</h3>
                        <p className="text-slate-400 text-sm mt-1 max-w-sm mx-auto">Create a class and assign students to automatically track risk factors.</p>
                    </div>
                ) : (
                    [].map((s: any) => (
                        <div key={s.id}></div>
                    ))
                )}
            </div>
        </motion.div>
    );
};

const CopilotTab = () => {
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
            setHistory(prev => [...prev, { role: 'ai', text: data?.data || 'Silent response.' }]);
        } catch (e: any) {
            setHistory(prev => [...prev, { role: 'ai', text: 'Error connecting to the EduTrack AI core.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 h-[600px] flex flex-col">
            <h2 className="text-2xl font-bold flex items-center gap-2"><Bot className="text-indigo-500" /> Faculty AI Copilot</h2>
            <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-4 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
                {history.map((msg, i) => (
                    <div key={i} className={`flex gap-3 max-w-[80%] items-start ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center border ${msg.role === 'user' ? 'bg-slate-600 border-slate-500' : 'bg-indigo-500 border-indigo-400'}`}>
                            {msg.role === 'ai' && <Bot className="w-4 h-4 text-white" />}
                        </div>
                        <div className={`p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-slate-700 text-white rounded-tr-sm' : 'bg-indigo-500/20 text-indigo-100 rounded-tl-sm'}`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex gap-3 max-w-[80%] items-start">
                        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center shrink-0 border border-indigo-400"><Bot className="w-4 h-4 text-white" /></div>
                        <div className="bg-indigo-500/20 text-indigo-100 p-3 rounded-2xl rounded-tl-sm text-sm italic">Thinking...</div>
                    </div>
                )}
                {history.length === 1 && (
                    <div className="flex flex-wrap gap-2 max-w-lg mt-4 ml-11">
                        {["Which students have attendance < 75%?", "Who missed Assignment 3?", "Show declining performance"].map((q, i) => (
                            <button key={i} onClick={() => handleSend(q)} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-xs text-slate-300 transition border border-white/5">{q}</button>
                        ))}
                    </div>
                )}
            </div>
            <div className="relative mt-2">
                <input value={message} onChange={e => setMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} type="text" placeholder="Type instructions for Copilot (e.g. Generate average scores)" className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-4 outline-none focus:border-indigo-500 text-white shadow-xl" />
                <button onClick={() => handleSend()} disabled={isLoading || !message.trim()} className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center bg-indigo-500 disabled:opacity-50 rounded-lg text-white hover:bg-indigo-600"><Sparkles className="w-5 h-5" /></button>
            </div>
        </motion.div>
    );
};

const ReportTab = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-center py-12 border-2 border-dashed border-white/10 rounded-3xl">
        <FileText className="w-20 h-20 text-rose-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white">Generate PDF Reports</h2>
        <p className="text-slate-400 max-w-sm mx-auto">EduTrack AI can aggregate a full 360-degree analytics report for any student or class into a branded PDF.</p>
        <button className="px-6 py-3 mt-6 bg-rose-500 hover:bg-rose-600 rounded-xl text-white font-medium font-bold inline-flex items-center gap-2">
            <FileText className="mr-2" /> Compile Class Report
        </button>
    </motion.div>
);

export default function FacultyAIDashboard() {
    const [activeTab, setActiveTab] = useState<'class' | 'risk' | 'copilot' | 'report'>('class');

    const tabs = [
        { id: 'class', label: 'Class Analytics', icon: Presentation, color: 'text-purple-400' },
        { id: 'risk', label: 'At-Risk Support', icon: AlertTriangle, color: 'text-rose-400' },
        { id: 'copilot', label: 'AI Copilot', icon: Bot, color: 'text-indigo-400' },
        { id: 'report', label: 'PDF Reports', icon: FileText, color: 'text-rose-400' },
    ] as const;

    return (
        <div className="h-full flex flex-col md:flex-row gap-6 max-w-7xl mx-auto p-4 md:p-0">
            <div className="md:w-64 shrink-0 flex flex-col gap-2">
                <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-purple-900/40 to-slate-900 border border-purple-500/20 shadow-lg">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center mb-3">
                        <Bot className="w-6 h-6 text-purple-400" />
                    </div>
                    <h1 className="text-xl font-black text-white tracking-tight">Faculty AI</h1>
                    <p className="text-xs text-purple-200 mt-1">Intelligent class oversight</p>
                </div>

                <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-3 mb-2">Faculty Tools</p>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === tab.id
                                ? 'bg-purple-500/15 text-white border border-purple-500/30'
                                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                                }`}
                        >
                            <tab.icon className={`w-5 h-5 ${tab.color} ${activeTab === tab.id ? 'fill-current' : ''}`} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl p-6 md:p-10 relative overflow-auto">
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
                <AnimatePresence mode="wait">
                    {activeTab === 'class' && <ClassPerformanceTab key="class" />}
                    {activeTab === 'risk' && <AtRiskTab key="risk" />}
                    {activeTab === 'copilot' && <CopilotTab key="copilot" />}
                    {activeTab === 'report' && <ReportTab key="report" />}
                </AnimatePresence>
            </div>
        </div>
    );
}
