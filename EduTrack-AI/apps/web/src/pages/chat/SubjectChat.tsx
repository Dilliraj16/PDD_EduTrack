import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Paperclip, Search, Users, MoreVertical, Hash, Image as ImageIcon, FileText, Smile, Download, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useCourseStore } from '@/store/courseStore';

interface Attachment {
    type: 'image' | 'file';
    url: string;
    name: string;
    size?: string;
}

interface Message {
    id: string;
    content: string;
    sender: string;
    role: string;
    isMe: boolean;
    time: string;
    attachment?: Attachment;
}

export default function SubjectChat() {
    const { courses } = useCourseStore();
    const [activeSubject, setActiveSubject] = useState(courses[0] || null);

    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initial course resolution & auth setup
    useEffect(() => {
        if (!activeSubject && courses.length > 0) setActiveSubject(courses[0]);
        supabase.auth.getUser().then(({ data }) => setCurrentUser(data.user));
    }, [courses, activeSubject]);

    // Live WebSockets Message Fetcher & Subscriber
    useEffect(() => {
        if (!activeSubject?.code || !currentUser?.id) return;
        let isMounted = true;

        async function fetchMessages() {
            if (isMounted) setIsLoading(true);
            // 1. Fetch History
            const { data, error } = await supabase
                .from('chat_messages')
                .select(`
                    id, content, attachment, created_at,
                    profiles (id, full_name, role)
                `)
                .eq('course_code', activeSubject.code)
                .order('created_at', { ascending: true });

            if (!error && data && isMounted) {
                const formatted = data.map((d: any) => ({
                    id: d.id,
                    content: d.content || '',
                    sender: d.profiles?.full_name || 'Anonymous',
                    role: d.profiles?.role || 'student',
                    isMe: d.profiles?.id === currentUser.id,
                    time: new Date(d.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    attachment: d.attachment
                }));
                setMessages(formatted);
            }
            if (isMounted) setIsLoading(false);
        }

        fetchMessages();

        // 2. Subscribe to Real-Time WebSockets
        const channel = supabase
            .channel(`public:chat_messages:course_code=eq.${activeSubject.code}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `course_code=eq.${activeSubject.code}` },
                async (payload) => {
                    // Fetch the profile data for the new message sender (since Postgres changes payload doesn't auto-join)
                    const { data: profile } = await supabase.from('profiles').select('full_name, role').eq('id', payload.new.sender_id).single();

                    if (isMounted) {
                        setMessages((prev) => [...prev, {
                            id: payload.new.id,
                            content: payload.new.content || '',
                            sender: profile?.full_name || 'Anonymous',
                            role: profile?.role || 'student',
                            isMe: payload.new.sender_id === currentUser.id,
                            time: new Date(payload.new.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            attachment: payload.new.attachment
                        }]);
                    }
                }
            )
            .subscribe();

        return () => {
            isMounted = false;
            supabase.removeChannel(channel);
        };
    }, [activeSubject?.code, currentUser?.id]);

    // Auto-scroll to latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'file') => {
        const file = e.target.files?.[0];
        if (!file || !currentUser || !activeSubject) return;

        // Note: For a true production build, we would push this file to the Supabase Storage Bucket first!
        // To keep the demo fast, we'll simulate an attachment mapping.
        const url = URL.createObjectURL(file);
        const sizeMB = (file.size / (1024 * 1024)).toFixed(2) + ' MB';

        await supabase.from('chat_messages').insert({
            course_code: activeSubject.code,
            sender_id: currentUser.id,
            content: '',
            attachment: { type, url, name: file.name, size: sizeMB }
        });
        e.target.value = '';
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !currentUser || !activeSubject) return;

        const content = newMessage;
        setNewMessage(''); // optimistic clear

        await supabase.from('chat_messages').insert({
            course_code: activeSubject.code,
            sender_id: currentUser.id,
            content: content
        });
    };

    if (!activeSubject) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] glass-panel rounded-3xl">
                <MessageSquare className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
                <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">No Groups Found</h3>
                <p className="text-slate-500">You must create or inherit a subject first.</p>
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-8rem)] glass-panel rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm relative">

            {/* Left Sidebar: Subjects List */}
            <div className="w-80 border-r border-slate-200 dark:border-white/5 flex flex-col bg-white/40 dark:bg-black/20 backdrop-blur-xl z-20">
                <div className="p-6 border-b border-slate-200 dark:border-white/5">
                    <h2 className="text-xl font-bold flex items-center mb-4 text-slate-800 dark:text-white">
                        <MessageSquare className="w-5 h-5 text-indigo-500 mr-2" />
                        Discussion Groups
                    </h2>
                    <div className="relative border border-slate-200 shadow-sm dark:border-white/10 rounded-xl overflow-hidden">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Connect to..."
                            className="w-full bg-white dark:bg-white/5 py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-900 dark:text-white placeholder-slate-400 transition-all font-medium"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {courses.map((subject) => (
                        <button
                            key={subject.code}
                            onClick={() => setActiveSubject(subject)}
                            className={`w-full text-left p-4 rounded-2xl transition-all duration-300 flex items-center ${activeSubject.code === subject.code
                                ? 'bg-gradient-to-r from-indigo-500/10 dark:from-indigo-500/20 to-purple-500/10 dark:to-purple-500/20 border border-indigo-200 dark:border-indigo-500/30 shadow-sm relative'
                                : 'hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent'
                                }`}
                        >
                            {activeSubject.code === subject.code && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full shadow-[0_0_10px_#6366f1]" />
                            )}
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center mr-3 shrink-0">
                                <Hash className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className={`font-bold truncate ${activeSubject.code === subject.code ? 'text-indigo-900 dark:text-white' : 'text-slate-600 dark:text-gray-300'}`}>
                                    {subject.name}
                                </p>
                                <p className="text-xs text-slate-500 font-mono font-medium">{subject.code}</p>
                            </div>
                            {activeSubject.code === subject.code && (
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Right Main Content: Chat Window */}
            <div className="flex-1 flex flex-col relative bg-transparent z-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

                {/* Chat Header */}
                <div className="h-20 border-b border-slate-200 dark:border-white/5 flex items-center justify-between px-8 bg-white/60 dark:bg-black/10 backdrop-blur-md z-10 shrink-0">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg text-white font-bold text-lg bg-indigo-500 shadow-indigo-500/30">
                            {activeSubject.code.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">{activeSubject.name}</h3>
                            <p className="text-sm text-emerald-500 dark:text-emerald-400 font-medium flex items-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2 animate-pulse" />
                                Live Network Active
                            </p>
                        </div>
                    </div>
                </div>

                {/* Chat Messages Area */}
                <div className="flex-1 overflow-y-auto p-8 space-y-6 z-10">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-full">
                            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-3" />
                            <p className="text-slate-500 font-medium">Connecting to Room Data...</p>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full opacity-50">
                            <MessageSquare className="w-12 h-12 text-slate-400 mb-2" />
                            <p className="text-slate-500 font-medium">No messages yet. Start the conversation!</p>
                        </div>
                    ) : (
                        messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                                {!msg.isMe && (
                                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden border border-slate-300 dark:border-white/10 shrink-0 mr-4 mt-1">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.sender}`} alt={msg.sender} />
                                    </div>
                                )}
                                <div className={`max-w-[70%] ${msg.isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                                    {!msg.isMe && (
                                        <div className="flex items-center space-x-2 mb-1 pl-1">
                                            <span className="text-sm font-bold text-slate-700 dark:text-gray-200">{msg.sender}</span>
                                            <span className={`text-[9px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider ${msg.role === 'faculty' ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30' : 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-gray-400'
                                                }`}>
                                                {msg.role}
                                            </span>
                                            <span className="text-[11px] text-slate-400 font-medium">{msg.time}</span>
                                        </div>
                                    )}
                                    <div className={`p-3 rounded-2xl relative shadow-sm max-w-sm overflow-hidden ${msg.isMe
                                        ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-tr-sm shadow-indigo-500/20 border border-transparent'
                                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-gray-100 rounded-tl-sm border border-slate-200 dark:border-white/5 backdrop-blur-md'
                                        }`}>
                                        {msg.attachment && msg.attachment.type === 'image' && (
                                            <div className="mb-2 -mx-1 -mt-1 overflow-hidden rounded-xl">
                                                <img src={msg.attachment.url} alt="attachment" className="w-full h-auto object-cover max-h-64" />
                                            </div>
                                        )}
                                        {msg.attachment && msg.attachment.type === 'file' && (
                                            <div className={`mb-2 p-3 rounded-xl flex items-center gap-3 ${msg.isMe ? 'bg-white/10' : 'bg-slate-100 dark:bg-black/20'}`}>
                                                <div className="w-10 h-10 rounded-lg bg-rose-400/20 text-rose-500 flex items-center justify-center shrink-0">
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1 overflow-hidden">
                                                    <p className="text-sm font-bold truncate">{msg.attachment.name}</p>
                                                    <p className="text-xs opacity-70 font-medium">{msg.attachment.size}</p>
                                                </div>
                                                <button className="w-8 h-8 rounded-full hover:bg-black/10 flex items-center justify-center transition-colors">
                                                    <Download className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                        {msg.content && <p className="text-[15px] leading-relaxed px-1 whitespace-pre-wrap">{msg.content}</p>}
                                    </div>
                                    {msg.isMe && (
                                        <div className="flex items-center space-x-2 mt-1 pr-1">
                                            <span className="text-[11px] text-slate-400 font-medium">{msg.time}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="h-24 px-8 py-4 border-t border-slate-200 dark:border-white/5 bg-slate-50/80 dark:bg-black/10 backdrop-blur-xl z-10 shrink-0">
                    <form onSubmit={handleSendMessage} className="h-14 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl flex items-center px-2 pr-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-indigo-500/50 transition-all">
                        <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => handleFileUpload(e, 'file')} accept=".pdf,.doc,.docx,.txt" />
                        <input type="file" ref={imageInputRef} className="hidden" onChange={(e) => handleFileUpload(e, 'image')} accept="image/*" />

                        <button type="button" onClick={() => fileInputRef.current?.click()} className="w-10 h-10 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-indigo-500 transition-colors shrink-0">
                            <Paperclip className="w-5 h-5" />
                        </button>
                        <button type="button" onClick={() => imageInputRef.current?.click()} className="w-10 h-10 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-indigo-500 transition-colors shrink-0">
                            <ImageIcon className="w-5 h-5" />
                        </button>

                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder={`Message the ${activeSubject.code} network...`}
                            className="flex-1 bg-transparent border-none text-slate-900 dark:text-white px-4 focus:outline-none placeholder-slate-400 font-medium text-[15px]"
                        />

                        <button type="button" className="w-10 h-10 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-amber-500 transition-colors shrink-0 mr-1">
                            <Smile className="w-5 h-5" />
                        </button>
                        <button
                            type="submit"
                            disabled={!newMessage.trim()}
                            className="w-10 h-10 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center justify-center text-white transition-all shadow-md"
                        >
                            <Send className="w-4 h-4 ml-0.5" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
