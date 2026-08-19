import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    LogOut, LayoutDashboard, Calendar, FileText, Bell,
    MessageSquare, Settings as SettingsIcon, BookOpen, FileCheck,
    ClipboardList, BrainCircuit, Sun, Moon, Menu, X, Zap, Award, PlusCircle
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { useEffect, useState } from 'react';

export default function DashboardLayout() {
    const { user, role, logout } = useAuthStore();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { toggleTheme, initializeRealtimeSync } = useThemeStore();

    useEffect(() => {
        if (user?.id) initializeRealtimeSync(user.id);
    }, [user?.id, initializeRealtimeSync]);

    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => { logout(); navigate('/login'); };

    const getNavItems = () => {
        if (role === 'student') return [
            { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
            { icon: BrainCircuit, label: 'Goals & Progress', path: '/dashboard/ai-insights' },
            { icon: Calendar, label: 'Timetable', path: '/dashboard/timetable' },
            { icon: BookOpen, label: 'Enrollment', path: '/dashboard/enrollment' },
            { icon: Award, label: 'Completed Courses', path: '/dashboard/completed-courses' },
            { icon: FileText, label: 'Assignments', path: '/dashboard/assignments' },
            { icon: FileCheck, label: 'OD Request', path: '/dashboard/od-request' },
            { icon: MessageSquare, label: 'Subject Chat', path: '/dashboard/chat' }
        ];
        if (role === 'faculty') return [
            { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
            { icon: PlusCircle, label: 'Create Course', path: '/dashboard/create-course' },
            { icon: Calendar, label: 'Timetable', path: '/dashboard/timetable' },
            { icon: ClipboardList, label: 'Attendance', path: '/dashboard/attendance' },
            { icon: FileText, label: 'Assignments', path: '/dashboard/assignments' },
            { icon: Award, label: 'Course Results', path: '/dashboard/course-results' },
            { icon: MessageSquare, label: 'Subject Chat', path: '/dashboard/chat' }
        ];

        return [{ icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' }];
    };

    const navItems = getNavItems();

    const roleColors: Record<string, string> = {
        student: 'text-cyan-400',
        faculty: 'text-purple-400',
    };
    const roleColor = roleColors[role || ''] || 'text-blue-400';

    return (
        <div className="flex h-screen overflow-hidden" style={{ background: 'var(--page-bg)', color: 'var(--text-sub)' }}>

            {/* ── Mobile backdrop ── */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 md:hidden"
                    style={{ background: 'rgba(10,16,32,0.7)', backdropFilter: 'blur(4px)' }}
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* ═══════════════════════════════════════
                SIDEBAR — always dark navy (#16213e)
            ═══════════════════════════════════════ */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 flex flex-col
                w-64
                md:relative md:translate-x-0
                transform transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:flex
            `}
                style={{ background: 'var(--sidebar-bg)', borderRight: '1px solid rgba(255,255,255,0.06)' }}
            >
                {/* Logo */}
                <div className="flex items-center justify-between px-6 py-5 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-white font-bold text-base tracking-tight">EduTrack <span className="text-indigo-400">AI</span></span>
                    </div>
                    <button className="md:hidden p-1 rounded-lg hover:bg-white/10 transition" onClick={() => setIsMobileMenuOpen(false)}>
                        <X className="w-5 h-5 text-white/60" />
                    </button>
                </div>

                {/* Nav section label */}
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/25 px-6 mb-2 mt-2">Menu</p>

                {/* Nav */}
                <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto scrollbar-hide">
                    {navItems.map((item, i) => {
                        const active = location.pathname === item.path;
                        return (
                            <button
                                key={i}
                                onClick={() => { navigate(item.path); setIsMobileMenuOpen(false); }}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${active
                                    ? 'nav-pill-active'
                                    : 'text-white/55 hover:text-white hover:bg-white/8'
                                    }`}
                            >
                                <item.icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-white/40'}`} />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>

                {/* User profile bottom */}
                <div className="shrink-0 p-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                    <div className="flex items-center gap-3 mb-3 p-2 rounded-xl hover:bg-white/5 transition cursor-default">
                        <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-indigo-500/50 shrink-0">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} alt="avatar" />
                        </div>
                        <div className="overflow-hidden flex-1">
                            <p className="text-xs font-semibold text-white truncate">{user?.email?.split('@')[0]}</p>
                            <p className={`text-[11px] capitalize font-bold ${roleColor}`}>{role}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all text-red-400 hover:bg-red-500/15 border border-red-500/20 hover:border-red-500/40"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* ═══════════════════════════════════════
                MAIN CONTENT — vibrant light area
            ═══════════════════════════════════════ */}
            <main className="flex-1 flex flex-col overflow-hidden" style={{ background: 'var(--page-bg)' }}>

                {/* Top Header */}
                <header
                    className="h-14 flex items-center justify-between shrink-0 px-4 md:px-6"
                    style={{ background: 'var(--card-bg)', borderBottom: '1px solid var(--card-border)', boxShadow: '0 1px 0 var(--card-border)' }}
                >
                    {/* Mobile hamburger */}
                    <button
                        className="md:hidden p-2 rounded-xl transition hover:bg-slate-100 dark:hover:bg-white/10"
                        onClick={() => setIsMobileMenuOpen(true)}
                    >
                        <Menu className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                    </button>

                    {/* Breadcrumb */}
                    <p className="hidden md:block text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>
                        {navItems.find(n => n.path === location.pathname)?.label ?? 'Dashboard'}
                    </p>

                    <div className="flex-1" />

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => toggleTheme(user?.id)}
                            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                            style={{ background: 'var(--card-border)', border: '1px solid var(--card-border)' }}
                        >
                            <Sun className="w-4 h-4 text-amber-500 hidden dark:block" />
                            <Moon className="w-4 h-4 block dark:hidden" style={{ color: 'var(--text-muted)' }} />
                        </button>
                        <button
                            onClick={() => navigate('/dashboard/notifications')}
                            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                            style={{ background: 'var(--card-border)', border: '1px solid var(--card-border)' }}
                        >
                            <Bell className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                        </button>
                        <button
                            onClick={() => navigate('/dashboard/settings')}
                            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                            style={{ background: 'var(--card-border)', border: '1px solid var(--card-border)' }}
                        >
                            <SettingsIcon className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                        </button>
                    </div>
                </header>

                {/* Page content */}
                <div className="flex-1 overflow-auto p-4 md:p-7">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
