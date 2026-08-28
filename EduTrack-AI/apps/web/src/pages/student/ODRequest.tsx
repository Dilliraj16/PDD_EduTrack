import { Send, FileText, UploadCloud, CheckCircle2 } from 'lucide-react';
import { useState, useRef } from 'react';

export default function ODRequest() {
    const [reason, setReason] = useState('');
    const [date, setDate] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate Supabase Storage Upload
        setTimeout(() => {
            setIsSubmitting(false);
            setSuccess(true);
            setReason('');
            setDate('');
            setFile(null);

            // Reset success after 3 seconds
            setTimeout(() => setSuccess(false), 3000);
        }, 1500);
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto pb-12">
            <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-400 t-h">
                    Request On-Duty (OD)
                </h1>
                <p className="text-slate-500 dark:text-gray-400 mt-1 font-medium text-sm">
                    Submit an official request for absence backed by PDF/proof documentation.
                </p>
            </div>

            <div className="glass-panel p-8 rounded-3xl border border-black/5 dark:border-white/5 relative overflow-hidden bg-white/60 dark:bg-black/20">
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 blur-[80px] pointer-events-none" />

                {success && (
                    <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center space-x-3 transition-all animate-in fade-in zoom-in duration-300">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        <div>
                            <p className="text-emerald-800 dark:text-emerald-300 font-bold text-sm">OD Request Submitted Successfully!</p>
                            <p className="text-emerald-600/80 dark:text-emerald-400/80 text-xs mt-0.5">Your advisor will review your attached proof shortly.</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-gray-300">Date of Absence</label>
                        <input
                            type="date"
                            required
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-3 px-4 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-gray-300">Reason for Request</label>
                        <textarea
                            required
                            rows={4}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Provide event details, competition name, or authorized reason..."
                            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-3 px-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none transition-shadow"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-gray-300">Supporting Document Proof</label>
                        <input
                            type="file"
                            accept=".pdf,image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />

                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className={`w-full border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer group ${file
                                ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-500/5'
                                : 'border-slate-300 dark:border-white/20 bg-slate-50 dark:bg-white/5 hover:border-blue-500/50'
                                }`}
                        >
                            {file ? (
                                <>
                                    <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center mb-3 text-emerald-600 dark:text-emerald-400">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <p className="text-sm font-bold text-slate-800 dark:text-white">{file.name}</p>
                                    <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB • Click to replace</p>
                                </>
                            ) : (
                                <>
                                    <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center mb-3 text-slate-500 dark:text-gray-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        <UploadCloud className="w-6 h-6" />
                                    </div>
                                    <p className="text-sm font-medium text-slate-600 dark:text-gray-300">Click to upload PDF or Image</p>
                                    <p className="text-xs text-slate-400 dark:text-gray-500 mt-1">Required for rapid faculty approval</p>
                                </>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || !file || !reason || !date}
                        className="w-full py-4 mt-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/20 transition-all hover:shadow-blue-500/40"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center space-x-2">
                                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                <span>Uploading Proof to Cloud...</span>
                            </span>
                        ) : (
                            <>
                                <Send className="w-5 h-5" />
                                <span>Submit OD Application</span>
                            </>
                        )}
                    </button>
                    {!file && <p className="text-center text-xs text-rose-500 font-medium">Please attach a supporting PDF/Image before submitting.</p>}
                </form>
            </div>
        </div>
    );
}
