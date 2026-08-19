import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, ChevronRight, AlertCircle } from 'lucide-react';

const MOCK_SCHEDULE = {
    'Monday': [
        { id: 1, subject: 'Advanced Mathematics', faculty: 'Dr. Sarah Connor', room: 'Block A - 101', type: 'Lecture', start: '09:00', end: '10:30' },
        { id: 2, subject: 'Data Structures', faculty: 'Prof. Alan Turing', room: 'Lab 3', type: 'Practical', start: '10:45', end: '12:15' },
        { id: 3, subject: 'Computer Networks', faculty: 'Dr. John Smith', room: 'Block B - 204', type: 'Lecture', start: '13:00', end: '14:30' }
    ],
    'Tuesday': [
        { id: 4, subject: 'Operating Systems', faculty: 'Prof. Linus Torvalds', room: 'Block A - 302', type: 'Lecture', start: '09:00', end: '11:00' },
        { id: 5, subject: 'Database Management', faculty: 'Dr. E.F. Codd', room: 'Lab 1', type: 'Practical', start: '11:15', end: '13:15' }
    ],
    'Wednesday': [
        { id: 6, subject: 'Software Engineering', faculty: 'Dr. Grace Hopper', room: 'Block B - 105', type: 'Lecture', start: '10:00', end: '12:00' },
        { id: 7, subject: 'Cloud Computing', faculty: 'Prof. Jeff Bezos', room: 'Block C - 401', type: 'Lecture', start: '13:30', end: '15:30' }
    ],
    'Thursday': [
        { id: 9, subject: 'Artificial Intelligence', faculty: 'Dr. Alan Newell', room: 'Block A - 201', type: 'Lecture', start: '09:00', end: '10:30' },
        { id: 10, subject: 'Machine Learning', faculty: 'Prof. Geoffrey Hinton', room: 'Lab 2', type: 'Practical', start: '11:00', end: '13:00' },
        { id: 11, subject: 'Pattern Recognition', faculty: 'Dr. Yann LeCun', room: 'Block C - 102', type: 'Lecture', start: '14:00', end: '15:30' }
    ],
    'Friday': [
        { id: 8, subject: 'Cyber Security', faculty: 'Dr. Kevin Mitnick', room: 'Lab 4', type: 'Practical', start: '09:00', end: '12:00' }
    ],
    'Saturday': [
        { id: 12, subject: 'Web Development Workshop', faculty: 'Prof. Tim Berners-Lee', room: 'Lab 1', type: 'Practical', start: '09:00', end: '12:00' },
        { id: 13, subject: 'Soft Skills Training', faculty: 'Dr. Brené Brown', room: 'Auditorium', type: 'Lecture', start: '13:00', end: '15:00' }
    ]
};

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function Timetable() {
    const defaultDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const [selectedDay, setSelectedDay] = useState(DAYS.includes(defaultDay) ? defaultDay : 'Monday');
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000); // Check every minute
        return () => clearInterval(timer);
    }, []);

    const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

    const getStatus = (start: string, end: string, day: string) => {
        if (day !== defaultDay) return 'upcoming'; // If viewing future or past day

        const [startHr, startMin] = start.split(':').map(Number);
        const [endHr, endMin] = end.split(':').map(Number);
        const startTotal = startHr * 60 + startMin;
        const endTotal = endHr * 60 + endMin;

        if (currentMinutes >= startTotal && currentMinutes <= endTotal) return 'current';
        if (currentMinutes > endTotal) return 'completed';
        return 'upcoming';
    };

    const schedule = MOCK_SCHEDULE[selectedDay as keyof typeof MOCK_SCHEDULE] || [];

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 glass-panel p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px]" />
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500">
                        Academic Timetable
                    </h1>
                    <p className="t-muted mt-1 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Semester 5 • Computer Science Engineering
                    </p>
                </div>
                <div className="bg-white/80 dark:bg-white/5 dark:glass-panel px-4 py-2 rounded-xl flex items-center gap-3 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-mono text-lg tracking-wider font-semibold">
                        {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            </header>

            {/* Day Selector */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {DAYS.map((day) => {
                    const isToday = day === defaultDay;
                    const isSelected = day === selectedDay;
                    return (
                        <button
                            key={day}
                            onClick={() => setSelectedDay(day)}
                            className={`px-6 py-3 rounded-xl whitespace-nowrap font-medium transition-all duration-300 flex items-center gap-2
                                ${isSelected
                                    ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/25'
                                    : 'bg-white dark:bg-white/5 text-slate-600 dark:text-gray-400 hover:text-[#0f1728] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/8 shadow-sm dark:shadow-none'
                                }`}
                        >
                            {day}
                            {isToday && <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-blue-400'}`} />}
                        </button>
                    );
                })}
            </div>

            {/* Timetable View */}
            <div className="space-y-4">
                {schedule.length === 0 ? (
                    <div className="glass-panel p-12 rounded-2xl flex flex-col items-center justify-center border border-[var(--card-border)]">
                        <AlertCircle className="w-12 h-12 mb-4 opacity-50 t-muted" />
                        <h3 className="text-lg font-medium t-h">No Classes Scheduled</h3>
                        <p className="t-sub">You have a free day today. Enjoy!</p>
                    </div>
                ) : (
                    schedule.map((session) => {
                        const status = getStatus(session.start, session.end, selectedDay);
                        const isCurrent = status === 'current';
                        const isCompleted = status === 'completed';

                        return (
                            <div
                                key={session.id}
                                className={`relative rounded-2xl p-6 transition-all duration-500 overflow-hidden
                                        ${isCurrent
                                        ? 'border-2 border-indigo-500 shadow-[0_0_30px_rgba(79,70,229,0.15)] bg-gradient-to-r from-[rgba(79,70,229,0.08)] to-transparent scale-[1.01]'
                                        : 'border border-[var(--card-border)] bg-[var(--card-bg)] hover:bg-[var(--card-border)]'
                                    }
                                    ${isCompleted ? 'opacity-60' : ''}
                                `}
                            >
                                {isCurrent && (
                                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 shadow-[0_0_10px_#3b82f6]" />
                                )}

                                <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between relative z-10">

                                    {/* Left: Time block */}
                                    <div className="flex items-center md:w-48 shrink-0 gap-4">
                                        <div className={`p-3 rounded-xl ${isCurrent ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-800 text-gray-400'} border border-white/5`}>
                                            <Clock className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className={`text-lg font-bold ${isCurrent ? 'text-white' : 't-h'}`}>
                                                {session.start}
                                            </div>
                                            <div className="text-sm t-muted">{session.end}</div>
                                        </div>
                                    </div>

                                    {/* Center: Details */}
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center gap-3">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold
                                                ${session.type === 'Lecture' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'}
                                            `}>
                                                {session.type}
                                            </span>
                                            {isCurrent && (
                                                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center gap-1.5 text-xs font-semibold animate-pulse">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" /> ONGOING
                                                </span>
                                            )}
                                            {isCompleted && (
                                                <span className="text-xs font-medium text-gray-500">COMPLETED</span>
                                            )}
                                        </div>
                                        <h2 className={`text-xl font-bold tracking-tight ${isCurrent ? 'text-white' : 't-h'}`}>
                                            {session.subject}
                                        </h2>

                                        <div className="flex flex-wrap gap-4 text-sm mt-2">
                                            <div className="flex items-center gap-1.5 t-muted">
                                                <User className="w-4 h-4" />
                                                <span>{session.faculty}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 t-muted">
                                                <MapPin className="w-4 h-4" />
                                                <span>{session.room}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Actions */}
                                    <div className="flex justify-end hidden md:flex shrink-0">
                                        <button className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors
                                            ${isCurrent ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-white/5 hover:bg-white/10 text-gray-300'}
                                        `}>
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
