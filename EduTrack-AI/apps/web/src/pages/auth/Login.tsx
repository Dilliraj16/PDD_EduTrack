import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, UserPlus, ArrowRight, ShieldCheck, Sparkles, Key, BookOpen } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { generateRegistrationNumber } from '@shared/utils/idGenerator';
import { supabase } from '@/lib/supabase';

const STATIC_PASSWORD = 'EduTrack@SimpleLog1n!';

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [authStep, setAuthStep] = useState<'credentials' | 'success'>('credentials');
    const [role, setRole] = useState<'student' | 'faculty'>('student');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");

        try {
            if (!isLogin) {
                // SIGN UP FLOW
                const assignedId = generateRegistrationNumber(role);
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password: password || STATIC_PASSWORD,
                    options: {
                        data: {
                            first_name: firstName,
                            role: role,
                            registration_number: assignedId
                        }
                    }
                });

                if (error) {
                    setErrorMsg(error.message);
                    setLoading(false);
                    return;
                }

                if (data.session) {
                    triggerSuccess(data.session.user);
                } else {
                    setErrorMsg("Authentication requires email verification. Check your inbox or allow bypassing in Supabase.");
                    setLoading(false);
                }

            } else {
                // SIGN IN FLOW
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password: password || STATIC_PASSWORD,
                });

                if (error) {
                    setErrorMsg(error.message);
                    setLoading(false);
                    return;
                }

                if (data.session) {
                    triggerSuccess(data.session.user);
                }
            }
        } catch (err: any) {
            setErrorMsg(err.message || 'Network error during login. Please check connection.');
            setLoading(false);
        }
    };



    const triggerSuccess = (supabaseUser: any) => {
        setAuthStep('success');

        setTimeout(() => {
            const userName = supabaseUser?.user_metadata?.first_name || firstName || email.split('@')[0] || 'User';
            const userRole = supabaseUser?.user_metadata?.role || role;

            login({ id: supabaseUser?.id || 'sys-auth-id', email: supabaseUser?.email || email, name: userName }, userRole);

            navigate('/dashboard');
        }, 2000);
    };

    // Derived styles for interactive role segment control
    const roleStyles = {
        student: { active: 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]' },
        faculty: { active: 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]' }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 bg-[#030712] overflow-hidden selection:bg-purple-500/30">
            {/* Anti-Gravity Ambient Orbs */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[140px] pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[140px] pointer-events-none animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
            <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-lg z-10 relative"
            >
                {/* Premium Glassmorphism Container */}
                <div className="backdrop-blur-3xl bg-white/[0.03] border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.6)] rounded-[2.5rem] p-8 sm:p-10 relative overflow-hidden">
                    {/* Top Edge Highlight */}
                    <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-blue-400/50 to-transparent opacity-50" />

                    {/* Branding */}
                    <div className="flex flex-col items-center justify-center mb-10 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center mb-4 border border-white/[0.05] shadow-inner relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <Sparkles className="w-8 h-8 text-white relative z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 drop-shadow-sm">
                            EduTrack
                        </h1>
                        <p className="text-gray-400 mt-2 text-sm font-medium tracking-wide">Enterprise Smart Campus</p>
                    </div>

                    <AnimatePresence mode="wait">
                        {authStep === 'credentials' && (
                            <motion.div
                                key="credentials"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                {/* Login / Sign Up Tabs */}
                                <div className="flex p-1 bg-black/40 rounded-2xl mb-8 border border-white/5 relative">
                                    <button onClick={() => { setIsLogin(true); setErrorMsg(""); }} className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 z-10 ${isLogin ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                                        Log in
                                    </button>
                                    <button onClick={() => { setIsLogin(false); setErrorMsg(""); setRole('faculty'); }} className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 z-10 ${!isLogin ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                                        Create Account
                                    </button>
                                    {/* Animated Pill Background */}
                                    <motion.div
                                        className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white/10 rounded-xl border border-white/10 shadow-sm"
                                        initial={false}
                                        animate={{ left: isLogin ? '4px' : 'calc(50%)' }}
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                </div>

                                {/* Role Selector */}
                                <div className="flex gap-3 mb-8">
                                    {['student', 'faculty'].map((r) => (
                                        <button
                                            key={r}
                                            onClick={() => {
                                                setRole(r as any);
                                                if (r === 'student') setIsLogin(true); // Students cannot create accounts
                                            }}
                                            className={`flex-1 py-3 px-4 rounded-2xl border transition-all duration-300 flex items-center justify-center gap-2 font-medium capitalize text-sm
                                                ${role === r ? roleStyles[r as keyof typeof roleStyles].active : 'border-white/5 bg-white/[0.02] text-gray-400 hover:bg-white/[0.05] hover:border-white/10 hover:text-gray-200'}
                                            `}
                                        >
                                            {r === 'student' ? <User className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                                            {r}
                                        </button>
                                    ))}
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <AnimatePresence mode='wait'>
                                        {!isLogin && (
                                            <motion.div initial={{ opacity: 0, height: 0, filter: 'blur(10px)' }} animate={{ opacity: 1, height: 'auto', filter: 'blur(0px)' }} exit={{ opacity: 0, height: 0, filter: 'blur(10px)' }} className="space-y-4">
                                                <div className="relative group">
                                                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                                        <UserPlus className="h-5 w-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                                                    </div>
                                                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required={!isLogin} className="w-full bg-black/20 border border-white/5 text-white placeholder:text-gray-600 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-black/40 transition-all shadow-inner" placeholder="Full Legal Name" />
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                                        </div>
                                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-black/20 border border-white/5 text-white placeholder:text-gray-600 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-black/40 transition-all shadow-inner" placeholder="Email Address" />
                                    </div>

                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                            <Key className="h-5 w-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                                        </div>
                                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-black/20 border border-white/5 text-white placeholder:text-gray-600 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-black/40 transition-all shadow-inner" placeholder="Password" />
                                    </div>


                                    <AnimatePresence>
                                        {errorMsg && (
                                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-rose-400 text-sm font-medium text-center py-2 px-4 bg-rose-500/10 rounded-xl border border-rose-500/20 overflow-hidden">
                                                {errorMsg}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <button disabled={loading} type="submit" className="w-full relative group overflow-hidden rounded-2xl mt-4">
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-90 group-hover:opacity-100 transition-opacity" />
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                                        <div className="relative flex items-center justify-center gap-2 py-4 text-white font-semibold shadow-lg">
                                            {loading ? 'Processing...' : (isLogin ? 'Log in to Portal' : 'Create Account')}
                                            {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                                        </div>
                                    </button>
                                </form>
                            </motion.div>
                        )}

                        {authStep === 'success' && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center py-10"
                            >
                                <div className="relative mb-8">
                                    <div className="absolute inset-0 bg-emerald-500/30 rounded-full blur-xl animate-pulse" />
                                    <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center relative z-10 backdrop-blur-xl">
                                        <ShieldCheck className="w-10 h-10 text-emerald-400" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold tracking-tight text-white mb-3">Authentication Validated</h3>
                                <p className="text-gray-400 font-medium text-sm">Preparing local environment...</p>

                                <div className="mt-8 flex gap-1">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
