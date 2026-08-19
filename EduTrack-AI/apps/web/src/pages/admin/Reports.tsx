import { Download, FileText, BarChart } from 'lucide-react';

export default function Reports() {
    const reports = [
        { name: 'Global Attendance Summaries', ext: 'PDF', icon: FileText, color: 'text-red-400', bg: 'bg-red-400/20' },
        { name: 'Semester Faculty Feedback', ext: 'CSV', icon: BarChart, color: 'text-blue-400', bg: 'bg-blue-400/20' },
        { name: 'University Financial Extract', ext: 'XLSX', icon: Download, color: 'text-emerald-400', bg: 'bg-emerald-400/20' }
    ];

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-orange-400">
                    System Reports & Extracts
                </h1>
                <p className="text-gray-400 mt-1">Generate and download centralized metrics for EduTrack administration.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reports.map((r, i) => (
                    <div key={i} className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-all cursor-pointer group">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${r.bg}`}>
                            <r.icon className={`w-8 h-8 ${r.color}`} />
                        </div>
                        <h3 className="font-bold text-white text-lg mb-2">{r.name}</h3>
                        <p className="text-xs text-gray-500 font-mono mb-4">FORMAT: {r.ext}</p>

                        <button className="px-6 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors w-full">
                            Generate Report
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
