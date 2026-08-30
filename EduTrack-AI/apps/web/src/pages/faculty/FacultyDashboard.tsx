import { Users, FileStack, ClipboardCheck, TrendingUp, BookOpen, Check, FileText, X, GripHorizontal } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Reorder } from 'framer-motion';
import { useCourseStore } from '@/store/courseStore';
import { supabase } from '@/lib/supabase';

export default function FacultyDashboard() {
    const navigate = useNavigate();
    const { courses } = useCourseStore();

    const [odStatuses, setOdStatuses] = useState<Record<number, 'approved' | 'rejected'>>({});
    const [selectedProof, setSelectedProof] = useState<string | null>(null);

    // Draggable layout state
    const [layout, setLayout] = useState(['stats', 'courses', 'actions_and_od']);

    const [totalStudents, setTotalStudents] = useState<number>(0);

    useEffect(() => {
        const fetchStudentsCount = async () => {
            const { count, error } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .eq('role', 'student');
            if (!error && count !== null) {
                setTotalStudents(count);
            }
        };
        fetchStudentsCount();
    }, []);

    const handleOD = (id: number, status: 'approved' | 'rejected') => {
        if (!odStatuses[id]) {
            setOdStatuses(prev => ({ ...prev, [id]: status }));
        }
    };

    const renderStats = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
                { title: 'Total Students', value: totalStudents.toString(), icon: Users, color: 'text-purple-400', glow: 'bg-purple-500/20' },
                { title: 'Pending Evaluations', value: '34', icon: ClipboardCheck, color: 'text-rose-400', glow: 'bg-rose-500/20', link: '/dashboard/assignments' },
                { title: 'Subjects Taught', value: '4', icon: BookOpen, color: 'text-blue-400', glow: 'bg-blue-500/20' },
                { title: 'Avg Class Attendance', value: '88%', icon: TrendingUp, color: 'text-emerald-400', glow: 'bg-emerald-500/20' },
            ].map((stat, i) => (
                <div
                    key={i}
                    onClick={() => stat.link && navigate(stat.link)}
                    className={`glass-panel p-6 rounded-3xl relative overflow-hidden group ${stat.link ? 'cursor-pointer hover:border-white/20 transition-all hover:-translate-y-1' : ''}`}
                >
                    <div className={`absolute -bottom-10 -right-10 w-32 h-32 blur-3xl rounded-full ${stat.glow} group-hover:scale-150 transition-transform duration-500`} />
                    <div className="flex items-start justify-between relative z-10">
                        <div>
                            <p className="text-sm font-medium mb-1 t-muted">{stat.title}</p>
                            <h3 className="text-4xl font-bold font-mono t-h">{stat.value}</h3>
                        </div>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 ${stat.color}`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderCourses = () => (
        <div className="glass-panel p-6 rounded-3xl relative overflow-hidden border-slate-200 dark:border-white/10 shadow-sm">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] pointer-events-none" />
            <h2 className="text-xl font-bold mb-6 flex items-center t-h">
                <BookOpen className="w-5 h-5 text-indigo-500 mr-2" />
                My Scheduled Classes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
                {courses.map(course => (
                    <div key={course.id} className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20 flex items-center gap-4 group cursor-default transition-all hover:border-indigo-500/30">
                        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center font-bold text-lg group-hover:bg-indigo-500 group-hover:text-white transition-colors border border-indigo-200 dark:border-indigo-500/30">
                            {course.code.substring(0, 2)}
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 dark:text-gray-100 leading-tight">{course.name}</h3>
                            <p className="text-xs text-slate-500 dark:text-gray-400 font-mono mt-1 pr-2">{course.code}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderActionsAndOD = () => (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions Array */}
            <div className="glass-panel p-6 rounded-3xl border-slate-200 dark:border-white/10">
                <h2 className="text-xl font-bold mb-6 flex items-center t-h">
                    <FileStack className="w-5 h-5 text-cyan-500 mr-2" />
                    Quick Actions
                </h2>
                <div className="grid grid-cols-1 gap-4">
                    <button
                        onClick={() => navigate('/dashboard/attendance')}
                        className="flex items-center p-6 rounded-2xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 transition-all group"
                    >
                        <ClipboardCheck className="w-8 h-8 text-slate-400 dark:text-gray-400 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 mr-4 transition-colors" />
                        <span className="text-sm font-bold text-slate-800 dark:text-white">Mark Attendance</span>
                    </button>
                    <button
                        onClick={() => navigate('/dashboard/assignments')}
                        className="flex items-center p-6 rounded-2xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 transition-all group"
                    >
                        <BookOpen className="w-8 h-8 text-slate-400 dark:text-gray-400 group-hover:text-purple-500 dark:group-hover:text-purple-400 mr-4 transition-colors" />
                        <span className="text-sm font-bold text-slate-800 dark:text-white">Add Assignment</span>
                    </button>
                </div>
            </div>

            {/* OD Requests Feed */}
            <div className="glass-panel p-6 rounded-3xl lg:col-span-2 border-slate-200 dark:border-white/10">
                <h2 className="text-xl font-bold mb-6 flex items-center t-h">
                    <FileText className="w-5 h-5 text-blue-500 mr-2" />
                    Pending OD Requests
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                    {[
                        { id: 1, name: 'Dilli Raj', reason: 'Hackathon Participation', date: 'Oct 24, 2026', proof: 'hackathon_pass.pdf' },
                        { id: 2, name: 'John Doe', reason: 'Medical Leave', date: 'Oct 25, 2026', proof: 'doctor_note.png' }
                    ].map((od) => (
                        <div key={od.id} className={`p-5 rounded-xl border transition-all ${odStatuses[od.id] ? 'bg-slate-50 dark:bg-black/10 border-slate-200 dark:border-white/5 opacity-50' : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-blue-500/30'}`}>
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <p className="font-bold text-slate-800 dark:text-white">{od.name}</p>
                                    <p className="text-xs text-slate-500 font-medium">{od.date}</p>
                                </div>
                                {odStatuses[od.id] === 'approved' ? (
                                    <span className="px-2 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold rounded-md uppercase tracking-wider">
                                        Approved
                                    </span>
                                ) : odStatuses[od.id] === 'rejected' ? (
                                    <span className="px-2 py-1 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-bold rounded-md uppercase tracking-wider">
                                        Rejected
                                    </span>
                                ) : (
                                    <span className="px-2 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold rounded-md uppercase tracking-wider">
                                        Pending
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-slate-600 dark:text-gray-300 mb-4">{od.reason}</p>

                            <div className="flex items-center justify-between mt-auto">
                                <button
                                    onClick={(e) => { e.preventDefault(); setSelectedProof(od.proof); }}
                                    className="flex items-center text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer bg-transparent border-none p-0"
                                >
                                    <FileText className="w-3 h-3 mr-1" /> View {od.proof}
                                </button>

                                {!odStatuses[od.id] && (
                                    <div className="flex space-x-2">
                                        <button onClick={() => handleOD(od.id, 'approved')} className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 transition-colors">
                                            <Check className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleOD(od.id, 'rejected')} className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 transition-colors">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6 pb-12">
            <div className="mb-2">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
                    Faculty Command Center
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your classes, assignments, and monitor student progress easily.</p>
                <div className="mt-3 inline-flex items-center text-xs font-bold bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-lg border border-indigo-100 dark:border-indigo-500/20 shadow-sm">
                    <GripHorizontal className="w-3 h-3 mr-1.5 opacity-70" /> Desktop widgets are fully reorderable
                </div>
            </div>

            <Reorder.Group axis="y" values={layout} onReorder={setLayout} className="space-y-6 flex flex-col w-full">
                {layout.map((id) => (
                    <Reorder.Item key={id} value={id} className="cursor-grab active:cursor-grabbing relative">
                        {id === 'stats' && renderStats()}
                        {id === 'courses' && renderCourses()}
                        {id === 'actions_and_od' && renderActionsAndOD()}
                    </Reorder.Item>
                ))}
            </Reorder.Group>

            {/* Proof Modal */}
            {selectedProof && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
                    <div className="bg-white dark:bg-[#1a1a24] rounded-3xl p-6 w-full max-w-2xl shadow-2xl border border-slate-200 dark:border-white/10 relative transform transition-all shadow-indigo-500/10">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold t-h flex items-center">
                                <FileText className="w-5 h-5 mr-2 text-indigo-500" />
                                Document Preview
                            </h3>
                            <button
                                onClick={() => setSelectedProof(null)}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                            </button>
                        </div>

                        {/* Mock PDF Viewer Frame */}
                        <div className="w-full aspect-[4/3] bg-slate-50 dark:bg-black/40 rounded-2xl border border-slate-200 dark:border-white/5 flex flex-col items-center justify-center overflow-hidden relative group">

                            {/* Fake Toolbar */}
                            <div className="absolute top-0 left-0 right-0 h-12 bg-slate-200/50 dark:bg-white/5 border-b border-slate-200 dark:border-white/5 flex items-center px-4 justify-between backdrop-blur-md">
                                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{selectedProof}</span>
                                <div className="flex space-x-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                                </div>
                            </div>

                            {/* Empty State / Preview Content */}
                            <div className="text-center mt-8">
                                <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-500/20">
                                    <FileStack className="w-10 h-10 text-indigo-500 dark:text-indigo-400 opacity-80" />
                                </div>
                                <p className="text-slate-700 dark:text-slate-300 font-medium">Original file content would render here</p>
                                <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">({selectedProof})</p>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setSelectedProof(null)}
                                className="px-6 py-2.5 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-800 dark:text-white rounded-xl font-bold transition-all text-sm"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
