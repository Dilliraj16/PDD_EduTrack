import { useState } from 'react';
import { UserCheck, CheckCircle2, XCircle } from 'lucide-react';

const DUMMY_STUDENTS = [
    { id: 1, name: 'John Doe', roll_no: 'CS1023', present: true },
    { id: 2, name: 'Jane Smith', roll_no: 'CS1024', present: true },
    { id: 3, name: 'Alice Walker', roll_no: 'CS1025', present: false },
    { id: 4, name: 'Bob Richards', roll_no: 'CS1026', present: null } // un-marked
];

export default function MarkAttendance() {
    const [students, setStudents] = useState(DUMMY_STUDENTS);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const toggleStatus = (id: number, status: boolean) => {
        setStudents(students.map(s => s.id === id ? { ...s, present: status } : s));
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                    Mark Attendance
                </h1>
                <p className="text-slate-500 dark:text-gray-400 mt-1">Computer Networks - Fall 2026 Batch - CS Section A</p>
            </div>

            <div className="glass-panel rounded-3xl overflow-hidden relative">
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/10 blur-[100px] pointer-events-none" />

                <div className="p-6 border-b border-[var(--card-border)] bg-[var(--card-bg)] flex justify-between items-center z-10 relative">
                    <h2 className="text-xl font-semibold flex items-center space-x-2 t-h">
                        <UserCheck className="w-5 h-5 text-purple-500" />
                        <span>Student Roster</span>
                    </h2>
                    <div className="bg-white/10 dark:bg-white/10 bg-slate-200 px-4 py-2 rounded-xl text-sm font-medium t-h">
                        {students.filter(s => s.present).length} Present / {students.length} Total
                    </div>
                </div>

                <div className="divide-y divide-[var(--card-border)] relative z-10 w-full">
                    {students.map((student) => (
                        <div key={student.id} className="p-4 px-6 flex items-center justify-between hover:bg-[var(--card-border)] transition-colors">
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-white/10 flex items-center justify-center font-bold text-blue-600 dark:text-gray-300">
                                    {student.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-semibold t-h">{student.name}</h3>
                                    <p className="text-xs t-muted">{student.roll_no}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => toggleStatus(student.id, true)}
                                    className={`p-2 rounded-xl border flex items-center justify-center transition-all ${student.present === true
                                        ? 'bg-emerald-500 border-emerald-400 text-white shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                                        : 'border-white/10 text-gray-400 hover:border-emerald-500/50 hover:text-emerald-400'
                                        }`}
                                >
                                    <CheckCircle2 className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => toggleStatus(student.id, false)}
                                    className={`p-2 rounded-xl border flex items-center justify-center transition-all ${student.present === false
                                        ? 'bg-red-500 border-red-400 text-white shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                                        : 'border-white/10 text-gray-400 hover:border-red-500/50 hover:text-red-400'
                                        }`}
                                >
                                    <XCircle className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-6 bg-[var(--card-border)]/50 border-t border-[var(--card-border)] flex justify-end relative z-10">
                    <button
                        onClick={() => {
                            setIsVerifying(true);
                            setTimeout(() => {
                                setIsVerifying(false);
                                setIsSubmitted(true);
                                setTimeout(() => setIsSubmitted(false), 3000);
                            }, 800);
                        }}
                        disabled={isVerifying || isSubmitted}
                        className={`font-medium px-8 py-3 rounded-xl shadow-lg transition-all ${isSubmitted
                            ? 'bg-emerald-500 text-white cursor-default'
                            : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white hover:-translate-y-1'
                            } ${isVerifying ? 'opacity-80 cursor-wait' : ''}`}
                    >
                        {isVerifying ? 'Saving...' : isSubmitted ? 'Attendance Marked!' : 'Submit Roster Updates'}
                    </button>
                </div>
            </div>
        </div>
    );
}
