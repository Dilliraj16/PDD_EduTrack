import { useState, useEffect } from 'react';
import { Reorder } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import { BookOpen, Target, CalendarDays, Award, TrendingUp, Clock, Calendar, CheckCircle2, GripVertical } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const cgpaData = [
    { semester: 'Sem 1', cgpa: 8.2 },
    { semester: 'Sem 2', cgpa: 8.5 },
    { semester: 'Sem 3', cgpa: 8.7 },
    { semester: 'Sem 4', cgpa: 8.9 },
    { semester: 'Sem 5', cgpa: 9.1 },
];

const attendanceData = [
    { subject: 'CS101', percentage: 95 },
    { subject: 'MATH201', percentage: 88 },
    { subject: 'PHY105', percentage: 76 },
    { subject: 'ENG102', percentage: 100 },
];

const STATS = [
    { id: 'stat_cgpa', title: 'Current CGPA', value: '9.1', icon: Award, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { id: 'stat_att', title: 'Overall Attendance', value: '89%', icon: Target, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { id: 'stat_subj', title: 'Enrolled Subjects', value: '6', icon: BookOpen, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { id: 'stat_assign', title: 'Pending Assignments', value: '3', icon: TrendingUp, color: 'text-rose-400', bg: 'bg-rose-500/10' },
];

export default function StudentDashboard() {
    const { user } = useAuthStore();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [profile, setProfile] = useState<any>(null);

    // We group the dashboard into 4 logical rows for neat, bug-free dragging
    const initialRows = [
        'header_row',
        'stats_row',
        'charts_row',
        'bottom_row'
    ];

    const [rows, setRows] = useState(initialRows);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user?.id) return;
            const { data } = await supabase
                .from('students')
                .select('*')
                .eq('id', user.id)
                .single();
            if (data) {
                setProfile(data);
            }
        };
        fetchProfile();
    }, [user?.id]);

    const timeStr = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const dateStr = currentTime.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const renderHeaderRow = () => (
        <div className="glass-panel p-6 rounded-3xl relative overflow-hidden flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 group">
            <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-[100px] mix-blend-screen group-hover:scale-110 transition-transform duration-700 pointer-events-none" />
            <div className="absolute top-6 right-6 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                <button
                    onClick={() => setRows(initialRows)}
                    className="px-3 py-1 bg-white/10 hover:bg-white/20 text-xs font-semibold rounded-lg transition-colors border border-white/10 mr-2 text-slate-800 dark:text-gray-200 pointer-events-auto shadow-sm"
                >
                    Reset Layout
                </button>
                <div className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-white/10 transition-colors">
                    <GripVertical className="w-5 h-5 text-slate-400 dark:text-gray-500" />
                </div>
            </div>
            <div className="relative z-10 space-y-2">
                <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight t-h pr-8">
                    Welcome back, {profile?.first_name || user?.name || 'Student'}!
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 font-mono font-bold rounded-lg border border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                        Reg: {profile?.enrollment_number || 'N/A'}
                    </span>
                    {profile?.current_semester && (
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 font-mono font-bold rounded-lg border border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                            Sem: {profile.current_semester}
                        </span>
                    )}
                    <span className="text-emerald-400 font-medium px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg shadow-sm">
                        Excellent Attendance (89%)
                    </span>
                </div>
            </div>
            <div className="relative z-10 flex flex-col items-start lg:items-end space-y-3 lg:pr-10">
                <div className="flex items-center space-x-4 bg-white/60 dark:bg-black/20 px-4 py-2 rounded-2xl border border-white/60 dark:border-white/5 backdrop-blur-md">
                    <div className="flex items-center space-x-2 text-cyan-600 dark:text-cyan-400">
                        <Clock className="w-5 h-5 animate-pulse" />
                        <span className="font-mono font-bold tracking-wider text-slate-800 dark:text-white">{timeStr}</span>
                    </div>
                    <div className="w-px h-5 bg-slate-300 dark:bg-white/20" />
                    <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-300">
                        <Calendar className="w-5 h-5" />
                        <span className="font-medium text-sm">{dateStr}</span>
                    </div>
                </div>
                <div className="bg-gradient-to-r from-orange-500/20 to-rose-500/20 border border-orange-500/30 px-5 py-2.5 rounded-2xl shadow-lg flex items-center space-x-3 w-full lg:w-auto transform hover:scale-[1.02] transition-transform">
                    <div className="w-8 h-8 rounded-full bg-orange-500/30 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-orange-300" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-orange-200/80 font-bold uppercase tracking-wider">Today's Priority</span>
                        <span className="text-sm text-white font-medium">CS101 Term Paper due by 11:59 PM</span>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderStatsRow = () => (
        <div className="relative group">
            <div className="absolute -top-3 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20 bg-slate-100 dark:bg-black/40 backdrop-blur-md p-1 rounded-lg border border-slate-200 dark:border-white/5 cursor-grab active:cursor-grabbing">
                <GripVertical className="w-5 h-5 text-slate-400 dark:text-gray-400" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {STATS.map((stat, idx) => (
                    <div key={idx} className="glass-panel p-6 rounded-2xl relative overflow-hidden hover:-translate-y-1 transition-transform border border-transparent dark:border-white/5">
                        <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl ${stat.bg} transition-transform`} />
                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <span className="t-muted text-sm font-medium">{stat.title}</span>
                            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold font-mono relative z-10 t-h">{stat.value}</h3>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderChartsRow = () => (
        <div className="relative group">
            <div className="absolute -top-3 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20 bg-slate-100 dark:bg-black/40 backdrop-blur-md p-1 rounded-lg border border-slate-200 dark:border-white/5 cursor-grab active:cursor-grabbing">
                <GripVertical className="w-5 h-5 text-slate-400 dark:text-gray-400" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chart */}
                <div className="lg:col-span-2 glass-panel rounded-3xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[100px] pointer-events-none" />
                    <h2 className="text-xl font-bold mb-6 flex items-center text-slate-900 dark:text-white">
                        <TrendingUp className="w-5 h-5 text-purple-400 mr-2" />
                        CGPA Progression
                    </h2>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={cgpaData}>
                                <defs>
                                    <linearGradient id="colorCgpa" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#00d2ff" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#00d2ff" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="semester" stroke="#475569" tick={{ fill: '#94a3b8' }} axisLine={false} />
                                <YAxis stroke="#475569" tick={{ fill: '#94a3b8' }} domain={[0, 10]} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                    itemStyle={{ color: '#00d2ff' }}
                                />
                                <Area type="monotone" dataKey="cgpa" stroke="#00d2ff" strokeWidth={3} fillOpacity={1} fill="url(#colorCgpa)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Attendance Insights */}
                <div className="col-span-1 glass-panel rounded-3xl p-6 flex flex-col">
                    <h2 className="text-xl font-bold mb-6 flex items-center text-slate-900 dark:text-white">
                        <Target className="w-5 h-5 text-emerald-400 mr-2" />
                        Subject Attendance
                    </h2>
                    <div className="flex-1 space-y-4">
                        {attendanceData.map((item) => (
                            <div key={item.subject}>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="font-medium text-slate-700 dark:text-gray-300">{item.subject}</span>
                                    <span className={`${item.percentage < 80 ? 'text-rose-400' : 'text-emerald-400'}`}>{item.percentage}%</span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-white/10 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full ${item.percentage < 80 ? 'bg-rose-500' : 'bg-gradient-to-r from-emerald-400 to-cyan-400'}`}
                                        style={{ width: `${item.percentage}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-3 rounded-xl bg-slate-200 dark:bg-white/5 hover:bg-slate-300 dark:hover:bg-white/10 transition-colors text-sm font-medium border border-slate-300 dark:border-white/10 text-slate-800 dark:text-white pointer-events-auto">
                        View Subject Details
                    </button>
                </div>
            </div>
        </div>
    );

    const renderBottomRow = () => (
        <div className="relative group">
            <div className="absolute -top-3 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20 bg-slate-100 dark:bg-black/40 backdrop-blur-md p-1 rounded-lg border border-slate-200 dark:border-white/5 cursor-grab active:cursor-grabbing">
                <GripVertical className="w-5 h-5 text-slate-400 dark:text-gray-400" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel rounded-3xl p-6 relative overflow-hidden group/timetable border border-slate-100 dark:border-white/5 hover:-translate-y-1 transition-transform h-full">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[50px] pointer-events-none group-hover/timetable:scale-150 transition-transform" />
                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <h2 className="text-xl font-bold flex items-center text-slate-900 dark:text-white">
                            <CalendarDays className="w-5 h-5 text-blue-400 mr-2" />
                            Today's Timetable
                        </h2>
                    </div>
                    <div className="space-y-3 relative z-10">
                        <div className="p-4 bg-slate-100 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/5 flex justify-between items-center transition-colors hover:bg-slate-200 dark:hover:bg-white/10">
                            <div>
                                <p className="font-semibold text-slate-900 dark:text-white">Advanced Mathematics</p>
                                <p className="text-xs text-slate-500 dark:text-gray-400">Dr. Sarah Connor • Block A-101</p>
                            </div>
                            <span className="text-slate-400 dark:text-gray-400 font-mono text-sm line-through opacity-70">09:00 AM</span>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-blue-900/40 to-blue-500/10 rounded-2xl border border-blue-500/30 flex justify-between items-center relative overflow-hidden transform scale-[1.02] shadow-[0_0_20px_rgba(59,130,246,0.15)]">
                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500 shadow-[0_0_10px_#3b82f6]" />
                            <div className="pl-2">
                                <p className="font-bold text-slate-900 dark:text-white">Data Structures</p>
                                <p className="text-xs text-slate-600 dark:text-gray-300">Prof. Alan Turing • Lab 3</p>
                                <span className="text-[10px] uppercase tracking-wider text-blue-400 font-bold animate-pulse mt-1.5 block">Live Now</span>
                            </div>
                            <span className="text-blue-400 font-mono text-sm font-bold">10:45 AM</span>
                        </div>
                        <div className="p-4 bg-slate-100 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/5 flex justify-between items-center transition-colors hover:bg-slate-200 dark:hover:bg-white/10">
                            <div>
                                <p className="font-semibold text-slate-700 dark:text-gray-300">Computer Networks</p>
                                <p className="text-xs text-slate-500 dark:text-gray-500">Dr. John Smith • Block B-204</p>
                            </div>
                            <span className="text-slate-500 dark:text-gray-400 font-mono text-sm">01:00 PM</span>
                        </div>
                    </div>
                </div>
                <div className="glass-panel rounded-3xl p-6 relative overflow-hidden group/fees border border-slate-100 dark:border-white/5 hover:-translate-y-1 transition-transform h-full">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[50px] pointer-events-none group-hover/fees:scale-150 transition-transform" />
                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <h2 className="text-xl font-bold flex items-center text-slate-900 dark:text-white">
                            <Award className="w-5 h-5 text-emerald-400 mr-2" />
                            Fee Status
                        </h2>
                    </div>
                    <div className="flex flex-col items-center justify-center pb-8 relative z-10">
                        <div className="w-32 h-32 rounded-full border-8 border-slate-100 dark:border-white/5 flex items-center justify-center mb-5 relative shadow-[inset_0_0_20px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                            <div className="absolute inset-0 border-8 border-emerald-400 rounded-full border-r-transparent border-b-transparent -rotate-45" style={{ filter: 'drop-shadow(0 0 8px rgba(52, 211, 153, 0.6))' }} />
                            <div className="flex flex-col items-center">
                                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">100<span className="text-lg text-emerald-400">%</span></span>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-emerald-500 dark:text-emerald-400">Semester 5 Cleared</h3>
                        <p className="text-sm text-slate-500 dark:text-gray-400 text-center mt-2 px-8">All tuition and hostel fees have been successfully processed for the current academic session.</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderRow = (id: string) => {
        switch (id) {
            case 'header_row': return renderHeaderRow();
            case 'stats_row': return renderStatsRow();
            case 'charts_row': return renderChartsRow();
            case 'bottom_row': return renderBottomRow();
            default: return null;
        }
    };

    return (
        <Reorder.Group
            axis="y"
            values={rows}
            onReorder={setRows}
            className="flex flex-col gap-6 w-full pb-12"
        >
            {rows.map(row => (
                <Reorder.Item
                    key={row}
                    value={row}
                    className="w-full relative"
                >
                    {renderRow(row)}
                </Reorder.Item>
            ))}
        </Reorder.Group>
    );
}
