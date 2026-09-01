import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, LineChart, CalendarDays, Presentation, ListChecks, MessageCircle, Sparkles } from 'lucide-react';

// ----------------------------------------------------
// TAB COMPONENTS
// ----------------------------------------------------

const PerformanceTab = () => {
    const [insight, setInsight] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleInsight = async () => {
        setIsLoading(true);
        try {
            const { data } = await supabase.functions.invoke('expert_ai_agent', {
                body: { action: 'generate_performance_insight', payload: { average: '74%', attendance: '82%' } }
            });
            setInsight(data?.data || 'Keep up the good work! Focus on your core modules to improve.');
        } catch (e) {
            setInsight('Unable to reach AI right now. Keep pushing forward!');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2"><LineChart className="text-indigo-500" /> AI Performance Analysis</h2>
            <div className="grid grid-cols-2 gap-4">
                <div className="glass-panel p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <p className="text-sm text-slate-400">Overall Average</p>
                    <p className="text-4xl font-bold text-emerald-400/50 mt-2">N/A</p>
                </div>
                <div className="glass-panel p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <p className="text-sm text-slate-400">Attendance</p>
                    <p className="text-4xl font-bold text-blue-400/50 mt-2">N/A</p>
                </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-indigo-500/20">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2"><Bot className="text-indigo-400" /> AI Insight</h3>
                    <button onClick={handleInsight} disabled={isLoading} className="px-4 py-2 bg-indigo-500 disabled:opacity-50 hover:bg-indigo-600 rounded-lg text-sm text-white font-medium transition-colors flex items-center gap-2">
                        <Sparkles className="w-4 h-4" /> {isLoading ? "Analyzing..." : "Generate Custom Insight"}
                    </button>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-xl border border-indigo-500/10">
                    <p className="text-slate-300 text-sm leading-relaxed">
                        {insight || "No previous performance data available. Click Generate to let AI analyze your blank state, or complete a course assignment to start tracking."}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

const StudyPlanTab = () => {
    const [priority, setPriority] = useState('');
    const [hours, setHours] = useState('2 Hrs / Day');
    const [isGenerating, setIsGenerating] = useState(false);
    const [planData, setPlanData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!priority) return;
        setIsGenerating(true);
        setError(null);
        try {
            const { data, error: invokeError } = await supabase.functions.invoke('expert_ai_agent', {
                body: { action: 'generate_study_plan', payload: { priority, hours, examDate: 'Next Week' } }
            });
            if (invokeError) throw invokeError;
            const cleanText = data?.data?.replace(/```json/g, '').replace(/```/g, '').trim() || "[]";
            setPlanData(JSON.parse(cleanText));
        } catch (e: any) {
            setError(e.message || "Failed to generate plan");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2"><ListChecks className="text-emerald-500" /> Personalized Study Plan</h2>
            <div className="flex gap-4">
                <input value={priority} onChange={e => setPriority(e.target.value)} type="text" placeholder="Priority Subject (e.g. Network Security)" className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 text-white" />
                <select value={hours} onChange={e => setHours(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-white focus:border-indigo-500">
                    <option value="2 Hrs / Day">2 Hrs / Day</option>
                    <option value="3 Hrs / Day">3 Hrs / Day</option>
                </select>
                <button onClick={handleGenerate} disabled={isGenerating || !priority} className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 rounded-xl text-white font-medium font-bold flex items-center gap-2">
                    <Sparkles className="w-5 h-5" /> {isGenerating ? "Generating..." : "Generate"}
                </button>
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <div className="space-y-3 mt-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
                <h3 className="font-semibold text-slate-300 mb-2">🎯 YOUR AI STUDY PLAN</h3>
                {(!planData || planData.length === 0) ? (
                    <div className="p-8 text-center bg-white/5 rounded-2xl border border-white/10 border-dashed mt-4">
                        <ListChecks className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                        <h3 className="text-lg font-bold text-white">No Active Study Plan</h3>
                        <p className="text-slate-400 text-sm mt-1 max-w-sm mx-auto">Input your priority above and click Generate to build a dynamic schedule.</p>
                    </div>
                ) : (
                    planData.map((d: any, i: number) => (
                        <div key={i} className="mb-4 mt-4">
                            <span className="font-bold text-indigo-400 text-sm uppercase tracking-wide block mb-2">{d.title || d.day || `Day ${i + 1}`}</span>
                            {(d.tasks || (d.task ? [d.task] : [])).map((tString: string, tIdx: number) => (
                                <div key={tIdx} className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10 mb-2">
                                    <div>
                                        <span className="font-bold text-indigo-400/50 mr-3 text-xs w-12 inline-block">TASK {tIdx + 1}</span>
                                        <span className="text-sm text-slate-200">{tString}</span>
                                    </div>
                                    <button className="text-xs px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full hover:bg-emerald-500/40">Start</button>
                                </div>
                            ))}
                        </div>
                    ))
                )}
            </div>
        </motion.div>
    );
};

const QuizTab = () => {
    const [subject, setSubject] = useState('');
    const [topic, setTopic] = useState('');
    const [difficulty, setDifficulty] = useState('Medium Difficulty');
    const [questions, setQuestions] = useState('10 Questions');

    const [isGenerating, setIsGenerating] = useState(false);
    const [quizData, setQuizData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!subject || !topic) return;
        setIsGenerating(true);
        setError(null);
        try {
            const { data, error: invokeError } = await supabase.functions.invoke('expert_ai_agent', {
                body: {
                    action: 'generate_quiz',
                    payload: { subject, topic, difficulty, questions: parseInt(questions) }
                }
            });
            if (invokeError) throw invokeError;

            const rawText = data?.data || '';
            const cleanText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
            setQuizData(JSON.parse(cleanText));
        } catch (e: any) {
            setError(e.message || "Failed to generate quiz");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2"><Presentation className="text-orange-500" /> AI Quiz Generator</h2>
            <div className="grid grid-cols-2 gap-4">
                <input value={subject} onChange={(e) => setSubject(e.target.value)} type="text" placeholder="Subject (e.g. DBMS)" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 text-white" />
                <input value={topic} onChange={(e) => setTopic(e.target.value)} type="text" placeholder="Topic (e.g. Normalization)" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 text-white" />
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-white focus:border-indigo-500">
                    <option value="Medium Difficulty">Medium Difficulty</option><option value="Hard Difficulty">Hard Difficulty</option>
                </select>
                <select value={questions} onChange={(e) => setQuestions(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-white focus:border-indigo-500">
                    <option value="10 Questions">10 Questions</option><option value="20 Questions">20 Questions</option>
                </select>
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button onClick={handleGenerate} disabled={isGenerating || !subject || !topic} className="w-full py-4 bg-indigo-500 disabled:opacity-50 hover:bg-indigo-600 rounded-xl text-white font-medium font-bold flex items-center justify-center gap-2">
                <Sparkles /> {isGenerating ? "Generating..." : "Generate Practice Quiz"}
            </button>

            {quizData && (
                <div className="mt-8 space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
                    <h3 className="font-bold text-lg text-emerald-400">Generated Quiz</h3>
                    {quizData.map((q: any, i: number) => (
                        <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/10">
                            <p className="font-medium text-slate-200 mb-3">{i + 1}. {q.question}</p>
                            <div className="space-y-2">
                                {q.options.map((opt: string, optIdx: number) => (
                                    <div key={optIdx} className={`p-2 rounded-lg text-sm border ${q.correctOption === optIdx ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-200' : 'border-white/10 text-slate-400'}`}>
                                        {opt}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

const ExamPrepTab = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-2"><CalendarDays className="text-red-500" /> Exam Preparation</h2>
        <div className="p-12 text-center border-2 border-dashed border-white/10 rounded-3xl">
            <CalendarDays className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-300">Set your target exam date</h3>
            <p className="text-sm text-slate-500 mt-2">EduTrack AI will dynamically balance your preparation modules.</p>
        </div>
    </motion.div>
);

const ChatTab = () => {
    const [message, setMessage] = useState('');
    const [history, setHistory] = useState([
        { role: 'ai', text: 'Hello! Ask me any academic questions related to your current courses.' }
    ]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (!message.trim()) return;
        const userMsg = message.trim();
        setMessage('');
        setHistory(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsLoading(true);
        try {
            const { data, error } = await supabase.functions.invoke('expert_ai_agent', {
                body: { action: 'chat', payload: { message: userMsg } }
            });
            if (error) throw error;
            setHistory(prev => [...prev, { role: 'ai', text: data?.data || 'Silence is golden... but not helpful right now.' }]);
        } catch (e: any) {
            setHistory(prev => [...prev, { role: 'ai', text: 'Error connecting to the EduTrack AI core.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 h-[600px] flex flex-col">
            <h2 className="text-2xl font-bold flex items-center gap-2"><MessageCircle className="text-cyan-500" /> Ask EduTrack AI</h2>
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
                        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center shrink-0 border border-indigo-400">
                            <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-indigo-500/20 text-indigo-100 p-3 rounded-2xl rounded-tl-sm text-sm italic">
                            Thinking...
                        </div>
                    </div>
                )}
            </div>
            <div className="relative">
                <input value={message} onChange={e => setMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} type="text" placeholder="Type your academic question..." className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-3 outline-none focus:border-indigo-500 text-white" />
                <button onClick={handleSend} disabled={isLoading || !message.trim()} className="absolute right-2 top-2 p-1.5 bg-indigo-500 disabled:opacity-50 rounded-lg text-white hover:bg-indigo-600 transition-colors">
                    <Sparkles className="w-5 h-5" />
                </button>
            </div>
        </motion.div>
    );
};

// ----------------------------------------------------
// MAIN LAYOUT
// ----------------------------------------------------

export default function StudentAIDashboard() {
    const [activeTab, setActiveTab] = useState<'performance' | 'plan' | 'quiz' | 'exam' | 'chat'>('performance');

    const tabs = [
        { id: 'performance', label: 'Performance', icon: LineChart, color: 'text-indigo-400' },
        { id: 'plan', label: 'Study Plan', icon: ListChecks, color: 'text-emerald-400' },
        { id: 'quiz', label: 'Practice Quiz', icon: Presentation, color: 'text-orange-400' },
        { id: 'exam', label: 'Exam Prep', icon: CalendarDays, color: 'text-red-400' },
        { id: 'chat', label: 'Ask AI', icon: MessageCircle, color: 'text-cyan-400' },
    ] as const;

    return (
        <div className="h-full flex flex-col md:flex-row gap-6 max-w-7xl mx-auto p-4 md:p-0">
            {/* Sidebar Navigation for AI Tools */}
            <div className="md:w-64 shrink-0 flex flex-col gap-2">
                <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/20 shadow-lg">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-3">
                        <Bot className="w-6 h-6 text-indigo-400" />
                    </div>
                    <h1 className="text-xl font-black text-white tracking-tight">EduTrack AI</h1>
                    <p className="text-xs text-indigo-200 mt-1">Your intelligent academic assistant</p>
                </div>

                <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-3 mb-2">AI Workspace</p>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === tab.id
                                ? 'bg-indigo-500/15 text-white border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.1)]'
                                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'
                                }`}
                        >
                            <tab.icon className={`w-5 h-5 ${tab.color} ${activeTab === tab.id ? 'fill-current' : ''}`} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content Workspace */}
            <div className="flex-1 bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl p-6 md:p-10 overflow-auto relative">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

                <AnimatePresence mode="wait">
                    {activeTab === 'performance' && <PerformanceTab key="performance" />}
                    {activeTab === 'plan' && <StudyPlanTab key="plan" />}
                    {activeTab === 'quiz' && <QuizTab key="quiz" />}
                    {activeTab === 'exam' && <ExamPrepTab key="exam" />}
                    {activeTab === 'chat' && <ChatTab key="chat" />}
                </AnimatePresence>
            </div>
        </div>
    );
}
