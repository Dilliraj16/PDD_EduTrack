import { useState } from 'react';
import { Monitor, AlertTriangle, ShieldCheck, Database, Plus } from 'lucide-react';
import { useCourseStore } from '@/store/courseStore';

export default function AdminDashboard() {
    const { addCourse } = useCourseStore();
    const [newCourseName, setNewCourseName] = useState('');
    const [newCourseCode, setNewCourseCode] = useState('');

    const handleCreateCourse = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCourseName.trim() || !newCourseCode.trim()) return;

        addCourse({
            id: Date.now().toString(),
            name: newCourseName,
            code: newCourseCode.toUpperCase(),
            activeUsers: 0
        });

        // Reset form
        setNewCourseName('');
        setNewCourseCode('');
    };

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-orange-400">
                    System Administration
                </h1>
                <p className="text-gray-400 mt-1">Manage global campus settings, users, and platform integrity.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: 'System Uptime', value: '99.9%', icon: Monitor, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                    { title: 'Total Users', value: '4,520', icon: ShieldCheck, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                    { title: 'Active Sessions', value: '1,204', icon: Database, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                    { title: 'Security Alerts', value: '0', icon: AlertTriangle, color: 'text-gray-400', bg: 'bg-gray-500/10' },
                ].map((stat, i) => (
                    <div key={i} className="glass-panel p-6 rounded-2xl relative border-red-500/20 shadow-[0_0_15px_rgba(255,0,85,0.1)]">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-gray-400 text-sm font-medium">{stat.title}</span>
                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        </div>
                        <h3 className="text-3xl font-bold font-mono">{stat.value}</h3>
                    </div>
                ))}
            </div>

            <div className="mt-8 glass-panel p-6 rounded-3xl border-white/5">
                <h2 className="text-xl font-bold mb-4">Latest System Logs</h2>
                <div className="space-y-2 font-mono text-sm">
                    <div className="p-3 bg-white/5 rounded text-emerald-400">[OK] Database backup completed successfully @04:00 AM</div>
                    <div className="p-3 bg-white/5 rounded text-gray-300">[INFO] 45 new students registered via batch script</div>
                    <div className="p-3 bg-white/5 rounded text-rose-400">[WARN] Failed login attempt detected from unknown IP</div>
                </div>
            </div>

            <div className="mt-8 glass-panel p-6 rounded-3xl border-white/5 bg-gradient-to-br from-blue-500/5 to-purple-500/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] pointer-events-none" />

                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-blue-500" />
                    Quick Action: Create New Course
                </h2>
                <p className="text-sm text-gray-400 mb-6">Create a new course. This will automatically setup a new Subject Chat group for faculty and students.</p>

                <form onSubmit={handleCreateCourse} className="flex flex-col md:flex-row gap-4 relative z-10">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Course Name (e.g. Artificial Intelligence)"
                            value={newCourseName}
                            onChange={(e) => setNewCourseName(e.target.value)}
                            className="w-full bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        />
                    </div>
                    <div className="w-full md:w-48">
                        <input
                            type="text"
                            placeholder="Course Code (CS501)"
                            value={newCourseCode}
                            onChange={(e) => setNewCourseCode(e.target.value)}
                            className="w-full bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 uppercase"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!newCourseName.trim() || !newCourseCode.trim()}
                        className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-lg"
                    >
                        Create & Connect Setup
                    </button>
                </form>
            </div>
        </div>
    );
}
