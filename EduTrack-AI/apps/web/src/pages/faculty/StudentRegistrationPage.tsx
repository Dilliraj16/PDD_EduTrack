import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Mail, Key, Sparkles, ShieldCheck } from 'lucide-react';
import { generateRegistrationNumber } from '@shared/utils/idGenerator';
import { supabaseAdmin } from '@/lib/supabase';

export default function StudentRegistration() {
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");
        setSuccessMsg("");

        try {
            const assignedId = generateRegistrationNumber('student');

            // Note: Standard Supabase client signUp will auto-login the new user. 
            // In a real production system, this should be an Admin API call or Edge Function.
            const { error } = await supabaseAdmin.auth.signUp({
                email,
                password: password,
                options: {
                    data: {
                        first_name: firstName,
                        role: 'student',
                        registration_number: assignedId
                    }
                }
            });

            if (error) {
                setErrorMsg(error.message);
            } else {
                setSuccessMsg(`Successfully registered student: ${firstName}.`);
                setFirstName('');
                setEmail('');
                setPassword('');
            }
        } catch (err: any) {
            setErrorMsg(err.message || 'Error creating student account.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-6">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                    <UserPlus className="w-8 h-8 text-blue-400" />
                    Student Registration
                </h1>
                <p className="text-gray-400 mt-2">Onboard new students to the EduTrack platform.</p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#16213e] rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden"
            >
                {/* Decorative background styling */}
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                    <UserPlus className="w-48 h-48 text-white" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10 max-w-md">

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Full Name</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <Sparkles className="h-5 w-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                            </div>
                            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="w-full bg-black/30 border border-white/5 text-white placeholder:text-gray-600 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-black/50 transition-all shadow-inner" placeholder="Student's Legal Name" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                            </div>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-black/30 border border-white/5 text-white placeholder:text-gray-600 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-black/50 transition-all shadow-inner" placeholder="student@example.com" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Temporary Password</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <Key className="h-5 w-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                            </div>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-black/30 border border-white/5 text-white placeholder:text-gray-600 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-black/50 transition-all shadow-inner" placeholder="Minimum 6 characters" />
                        </div>
                    </div>

                    <AnimatePresence>
                        {errorMsg && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-rose-400 text-sm font-medium py-3 px-4 bg-rose-500/10 rounded-xl border border-rose-500/20">
                                {errorMsg}
                            </motion.div>
                        )}
                        {successMsg && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex items-center gap-2 text-emerald-400 text-sm font-medium py-3 px-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                                <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                                {successMsg}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button disabled={loading} type="submit" className="w-full relative group overflow-hidden rounded-2xl mt-4">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-90 group-hover:opacity-100 transition-opacity" />
                        <div className="relative flex items-center justify-center gap-2 py-4 text-white font-semibold">
                            {loading ? 'Registering...' : 'Register Student'}
                        </div>
                    </button>

                    <p className="text-xs text-gray-500 text-center mt-4">
                        Note: Creating an account may refresh your session depending on Auth configuration.
                    </p>
                </form>
            </motion.div>
        </div>
    );
}
