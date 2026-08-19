import React, { useState } from 'react';
import { FileText, Plus, Calendar, Clock, BookOpen, Users, CheckCircle2 } from 'lucide-react';

interface Assignment {
    id: string;
    title: string;
    course: string;
    dueDate: string;
    dueTime: string;
    submittedCount: number;
    totalStudents: number;
}

const MOCK_ASSIGNMENTS: Assignment[] = [
    { id: '1', title: 'Socket Programming Client/Server', course: 'Computer Networks', dueDate: '2026-08-15', dueTime: '23:59', submittedCount: 45, totalStudents: 60 },
    { id: '2', title: 'TCP Congestion Control Analysis', course: 'Computer Networks', dueDate: '2026-08-20', dueTime: '17:00', submittedCount: 12, totalStudents: 60 }
];

export default function FacultyAssignments() {
    const [assignments, setAssignments] = useState<Assignment[]>(MOCK_ASSIGNMENTS);
    const [isCreating, setIsCreating] = useState(false);
    const [title, setTitle] = useState('');
    const [course, setCourse] = useState('Computer Networks');
    const [dueDate, setDueDate] = useState('');
    const [dueTime, setDueTime] = useState('');
    const [description, setDescription] = useState('');

    const handleCreateAssignment = (e: React.FormEvent) => {
        e.preventDefault();
        const newAssignment: Assignment = {
            id: Math.random().toString(),
            title,
            course,
            dueDate,
            dueTime,
            submittedCount: 0,
            totalStudents: 60
        };
        setAssignments([newAssignment, ...assignments]);
        setIsCreating(false);
        setTitle('');
        setDueDate('');
        setDueTime('');
        setDescription('');
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
                        Assignments Management
                    </h1>
                    <p className="t-muted mt-1">Create and manage assignments for your classes.</p>
                </div>
                <button
                    onClick={() => setIsCreating(!isCreating)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium px-6 py-2.5 rounded-xl shadow-lg transition-transform hover:-translate-y-1 flex items-center gap-2"
                >
                    {isCreating ? <FileText className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    {isCreating ? 'View Assignments' : 'Create Assignment'}
                </button>
            </div>

            {isCreating ? (
                <div className="glass-panel p-8 rounded-3xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[100px] pointer-events-none" />
                    <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2 relative z-10 t-h">
                        <Plus className="w-6 h-6 text-purple-400" />
                        Create New Assignment
                    </h2>

                    <form onSubmit={handleCreateAssignment} className="space-y-6 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-gray-300">Assignment Title</label>
                                <input
                                    type="text"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Midterm Project Phase 1"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-gray-300">Target Course</label>
                                <select
                                    value={course}
                                    onChange={(e) => setCourse(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all [&>option]:bg-gray-900"
                                >
                                    <option>Computer Networks</option>
                                    <option>Artificial Intelligence</option>
                                    <option>Database Systems</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-gray-300 flex items-center gap-2"><Calendar className="w-4 h-4 text-emerald-400" /> Due Date</label>
                                <input
                                    type="date"
                                    required
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white [color-scheme:dark] focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-gray-300 flex items-center gap-2"><Clock className="w-4 h-4 text-blue-400" /> Due Time</label>
                                <input
                                    type="time"
                                    required
                                    value={dueTime}
                                    onChange={(e) => setDueTime(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white [color-scheme:dark] focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 flex items-center gap-2"><BookOpen className="w-4 h-4 text-pink-400" /> Instructions / Description</label>
                            <textarea
                                rows={4}
                                required
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe the requirements..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all resize-none"
                            />
                        </div>

                        <div className="flex justify-end pt-4">
                            <button type="submit" className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 hover:bg-emerald-500/30 font-medium px-8 py-3 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(16,185,129,0.25)] flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5" />
                                Publish Assignment
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {assignments.map(assignment => (
                        <div key={assignment.id} className="glass-panel p-6 rounded-3xl hover:shadow-lg transition-all group relative overflow-hidden hover:border-purple-500/30">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <FileText className="w-24 h-24 text-purple-400" />
                            </div>
                            <div className="relative z-10 space-y-4">
                                <div className="space-y-1">
                                    <span className="text-xs font-semibold text-purple-300 bg-purple-500/20 px-2.5 py-1 rounded-lg border border-purple-500/30">{assignment.course}</span>
                                    <h3 className="text-xl font-bold t-h leading-tight mt-3">{assignment.title}</h3>
                                </div>

                                <div className="flex flex-col gap-3 pt-3 border-t border-white/10">
                                    <div className="flex items-center text-sm text-gray-300 gap-2 font-medium">
                                        <div className="p-1.5 rounded-md bg-emerald-500/20 border border-emerald-500/30">
                                            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                                        </div>
                                        <span>{assignment.dueDate} at {assignment.dueTime}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-300 gap-2 font-medium">
                                        <div className="p-1.5 rounded-md bg-blue-500/20 border border-blue-500/30">
                                            <Users className="w-3.5 h-3.5 text-blue-400" />
                                        </div>
                                        <span>{assignment.submittedCount} / {assignment.totalStudents} Submitted</span>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full bg-gray-800 rounded-full h-2 mt-4 overflow-hidden border border-white/5">
                                    <div
                                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000"
                                        style={{ width: `${(assignment.submittedCount / assignment.totalStudents) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
