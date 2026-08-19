import { useState } from 'react';
import { Camera, Shield, Moon, Sun, Monitor, HardDrive, Edit3, Lock, Trash2, Smartphone } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';

export default function Settings() {
    const { user, role } = useAuthStore();
    const { theme, setTheme } = useThemeStore();
    const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'appearance' | 'privacy'>('profile');

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-gray-500">
                    Account Settings
                </h1>
                <p className="text-gray-400 mt-1">Manage your identity, security preferences, and system appearance.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Fixed sidebar navigation for settings */}
                <aside className="w-full md:w-64 space-y-2">
                    <button onClick={() => setActiveTab('profile')} className={`w-full text-left flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'profile' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                        <Edit3 className="w-5 h-5" /> <span>Profile</span>
                    </button>
                    <button onClick={() => setActiveTab('security')} className={`w-full text-left flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'security' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                        <Lock className="w-5 h-5" /> <span>Security & Devices</span>
                    </button>
                    <button onClick={() => setActiveTab('appearance')} className={`w-full text-left flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'appearance' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                        <Monitor className="w-5 h-5" /> <span>Appearance</span>
                    </button>
                    <button onClick={() => setActiveTab('privacy')} className={`w-full text-left flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'privacy' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                        <Shield className="w-5 h-5" /> <span>Privacy & Data</span>
                    </button>
                </aside>

                <main className="flex-1 space-y-6">
                    {activeTab === 'profile' && (
                        <div className="glass-panel p-8 rounded-3xl border border-white/10 animate-in fade-in zoom-in-95 duration-300">
                            <h2 className="text-xl font-bold mb-6 flex items-center"><Edit3 className="mr-3 w-5 h-5 text-blue-400" /> Public Profile</h2>

                            <div className="flex items-center space-x-6 mb-8">
                                <div className="relative group">
                                    <div className="w-24 h-24 rounded-full bg-gray-700 overflow-hidden border-2 border-white/20">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} alt="Avatar" className="w-full h-full object-cover" />
                                    </div>
                                    <button className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full border-2 border-[#0f172a] shadow-lg group-hover:scale-110 transition-transform">
                                        <Camera className="w-4 h-4 text-white" />
                                    </button>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{user?.email?.split('@')[0]}</h3>
                                    <p className="text-gray-400 text-sm capitalize">{role} Account</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs text-gray-400 uppercase tracking-wide">First Name</label>
                                        <input type="text" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/50 outline-none" defaultValue="EduTrack" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs text-gray-400 uppercase tracking-wide">Last Name</label>
                                        <input type="text" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/50 outline-none" defaultValue="User" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-400 uppercase tracking-wide">Biography</label>
                                    <textarea className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none min-h-[100px]" defaultValue="EduTrack User Profile." />
                                </div>
                                <div className="pt-4 flex justify-end">
                                    <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors shadow-lg shadow-blue-500/20">Save Changes</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                            <div className="glass-panel p-8 rounded-3xl border border-white/10">
                                <h2 className="text-xl font-bold mb-6 flex items-center"><Lock className="mr-3 w-5 h-5 text-emerald-400" /> Multi-Factor Authentication</h2>
                                <p className="text-sm text-gray-400 mb-6">Enhance your account security by requiring a second verification method upon login.</p>

                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                                    <div>
                                        <p className="font-bold text-gray-200">Authenticator App</p>
                                        <p className="text-xs text-gray-500">Google Authenticator, Authy, etc.</p>
                                    </div>
                                    <button className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm font-medium hover:bg-emerald-500/30 transition-colors">Enable 2FA</button>
                                </div>
                            </div>

                            <div className="glass-panel p-8 rounded-3xl border border-white/10">
                                <h2 className="text-xl font-bold mb-6 flex items-center"><Smartphone className="mr-3 w-5 h-5 text-blue-400" /> Active Devices</h2>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl relative overflow-hidden">
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
                                        <div>
                                            <p className="font-bold text-gray-200 text-sm">Windows PC - Chrome</p>
                                            <p className="text-xs text-blue-400 mt-1">Current Session • Last active: Just now</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl">
                                        <div>
                                            <p className="font-bold text-gray-400 text-sm">iPhone 14 Pro - Native App</p>
                                            <p className="text-xs text-gray-500 mt-1">Delhi, IN • Last active: 2 hours ago</p>
                                        </div>
                                        <button className="text-red-400 hover:text-red-300 text-xs font-medium">Revoke</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'appearance' && (
                        <div className="glass-panel p-8 rounded-3xl border border-white/10 animate-in fade-in zoom-in-95 duration-300">
                            <h2 className="text-xl font-bold mb-6 flex items-center"><Monitor className="mr-3 w-5 h-5 text-indigo-400" /> Theme Preferences</h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                <button onClick={() => setTheme('dark', user?.id)} className={`p-4 rounded-xl flex items-center justify-center space-x-3 transition-colors ${theme === 'dark' ? 'border-2 border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300' : 'border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-600 dark:text-gray-400'}`}>
                                    <Moon className="w-5 h-5" /> <span>Dark Mode</span>
                                </button>
                                <button onClick={() => setTheme('light', user?.id)} className={`p-4 rounded-xl flex items-center justify-center space-x-3 transition-colors ${theme === 'light' ? 'border-2 border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300' : 'border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-600 dark:text-gray-400'}`}>
                                    <Sun className="w-5 h-5" /> <span>Light Mode</span>
                                </button>
                                <button onClick={() => setTheme('system', user?.id)} className={`p-4 rounded-xl flex items-center justify-center space-x-3 transition-colors ${theme === 'system' ? 'border-2 border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300' : 'border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-600 dark:text-gray-400'}`}>
                                    <Monitor className="w-5 h-5" /> <span>System Default</span>
                                </button>
                            </div>

                            <h3 className="font-bold text-gray-300 mb-4">Animations</h3>
                            <label className="flex items-center space-x-3 cursor-pointer p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors">
                                <input type="checkbox" className="w-5 h-5 rounded border-gray-600 bg-black/20 text-indigo-500 focus:ring-0" defaultChecked />
                                <div>
                                    <p className="font-medium text-sm text-gray-200">Enable Hardware Acceleration Transitions</p>
                                    <p className="text-xs text-gray-500 mt-0.5">Disabling this optimizes performance on low-end devices.</p>
                                </div>
                            </label>
                        </div>
                    )}

                    {activeTab === 'privacy' && (
                        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                            <div className="glass-panel p-8 rounded-3xl border border-white/10">
                                <h2 className="text-xl font-bold mb-6 flex items-center"><HardDrive className="mr-3 w-5 h-5 text-purple-400" /> Data Portability</h2>
                                <p className="text-sm text-gray-400 mb-6">EduTrack AI respects your complete ownership over your generated academic and personal payloads.</p>

                                <button className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl font-medium transition-colors w-full sm:w-auto text-sm">
                                    Export My History (JSON)
                                </button>
                            </div>

                            <div className="glass-panel p-8 rounded-3xl border border-red-500/20 bg-red-500/5">
                                <h2 className="text-xl font-bold mb-2 flex items-center text-red-400"><Trash2 className="mr-3 w-5 h-5" /> Danger Zone</h2>
                                <p className="text-sm text-gray-400 mb-6">Permanently purge your account, historical activity logs, and settings parameters.</p>
                                <button className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-medium transition-colors w-full sm:w-auto text-sm shadow-lg shadow-red-500/20">
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
