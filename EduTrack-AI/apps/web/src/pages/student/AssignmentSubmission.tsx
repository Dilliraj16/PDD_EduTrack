import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle, Clock, X, FileCheck, Check, Search, Download } from 'lucide-react';

const MOCK_ASSIGNMENTS = [
    { id: '1', course: 'Computer Networks', title: 'TCP/IP Flow Control Analysis', due: 'Tomorrow, 11:59 PM', status: 'pending', description: 'Analyze the congestion control algorithms implemented in modern TCP stacks. Provide PCAP file traces if possible.' },
    { id: '2', course: 'Software Engineering', title: 'Sprint 1 Architecture Doc', due: 'Fri, 05:00 PM', status: 'pending', description: 'Submit the final IEEE format architecture document including Mermaid diagrams of the CI/CD pipeline.' },
    { id: '3', course: 'Data Structures', title: 'B-Tree Implementation', due: 'Last Week', status: 'graded', score: '95/100', feedback: 'Excellent time complexity handling on node splits.' }
];

export default function AssignmentSubmission() {
    const [activeTab, setActiveTab] = useState<'pending' | 'graded'>('pending');
    const [selectedAssignment, setSelectedAssignment] = useState(MOCK_ASSIGNMENTS[0]);
    const [dragActive, setDragActive] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const filtered = MOCK_ASSIGNMENTS.filter(a => a.status === activeTab);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
        else if (e.type === "dragleave") setDragActive(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setUploadedFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setUploadedFile(e.target.files[0]);
        }
    };

    const handleSimulatedUpload = () => {
        if (!uploadedFile) return;
        setUploading(true);
        // Simulate Supabase Storage Upload
        setTimeout(() => {
            setUploading(false);
            setSubmitted(true);
        }, 1500);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)]">
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                        Assignments & Storage
                    </h1>
                    <p className="text-gray-400 mt-1">Manage and upload documents securely.</p>
                </div>
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 shrink-0">
                    <button
                        onClick={() => { setActiveTab('pending'); setSubmitted(false); setUploadedFile(null); setSelectedAssignment(MOCK_ASSIGNMENTS[0]); }}
                        className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'pending' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        Pending Needs
                    </button>
                    <button
                        onClick={() => { setActiveTab('graded'); setSelectedAssignment(MOCK_ASSIGNMENTS.find(a => a.status === 'graded') || MOCK_ASSIGNMENTS[0]); }}
                        className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'graded' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        Graded & Feedback
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
                {/* Left Side: List */}
                <div className="lg:w-1/3 flex flex-col glass-panel rounded-3xl border border-white/5 overflow-hidden">
                    <div className="p-4 border-b border-white/5 bg-black/20">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search assignments..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-purple-500/50 text-white"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
                        {filtered.map(assignment => (
                            <div
                                key={assignment.id}
                                onClick={() => { setSelectedAssignment(assignment); setSubmitted(false); setUploadedFile(null); }}
                                className={`p-4 rounded-2xl cursor-pointer transition-all ${selectedAssignment.id === assignment.id
                                        ? 'bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30'
                                        : 'bg-white/5 border border-white/5 hover:bg-white/10'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] uppercase tracking-wider font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                                        {assignment.course}
                                    </span>
                                    {assignment.status === 'pending' ? (
                                        <Clock className="w-4 h-4 text-orange-400" />
                                    ) : (
                                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                                    )}
                                </div>
                                <h3 className={`font-bold text-[15px] ${selectedAssignment.id === assignment.id ? 'text-white' : 'text-gray-300'}`}>
                                    {assignment.title}
                                </h3>
                                <p className="text-xs text-gray-500 mt-2">Due: {assignment.due}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side: Details & Dropzone */}
                <div className="lg:w-2/3 glass-panel rounded-3xl border border-white/5 relative overflow-hidden flex flex-col">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-[80px] pointer-events-none" />

                    {selectedAssignment && (
                        <div className="flex-1 flex flex-col p-8 relative z-10">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/20">
                                        <FileText className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold tracking-tight text-white mb-1">{selectedAssignment.title}</h2>
                                        <p className="text-sm text-gray-400 font-medium">Course: {selectedAssignment.course}</p>
                                    </div>
                                </div>
                                <div className="mt-6 p-5 rounded-2xl bg-black/20 border border-white/10 backdrop-blur-md">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Instructions</h4>
                                    <p className="text-[15px] text-gray-300 leading-relaxed">
                                        {selectedAssignment.description}
                                    </p>

                                    {selectedAssignment.status === 'graded' && (
                                        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                                            <div>
                                                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-500 mb-1">Faculty Feedback</h4>
                                                <p className="text-sm text-emerald-50/80">{selectedAssignment.feedback}</p>
                                            </div>
                                            <div className="text-right ml-4">
                                                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Final Score</h4>
                                                <p className="text-2xl font-black font-mono text-emerald-400">{selectedAssignment.score}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Dropzone Area for Pending */}
                            {selectedAssignment.status === 'pending' && (
                                <div className="flex-1 flex flex-col mt-8">
                                    <h4 className="text-sm font-semibold mb-4 text-white">Upload Submission (Supabase Cloud)</h4>

                                    {submitted ? (
                                        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-emerald-500/50 rounded-3xl bg-emerald-500/5 p-8 transition-all">
                                            <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6">
                                                <Check className="w-10 h-10 text-emerald-400" />
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-2">Submission Successful!</h3>
                                            <p className="text-sm text-gray-400 text-center max-w-md">
                                                Your file <strong>{uploadedFile?.name}</strong> has been securely uploaded to the Assignment storage bucket.
                                            </p>
                                        </div>
                                    ) : (
                                        <div
                                            onDragEnter={handleDrag}
                                            onDragLeave={handleDrag}
                                            onDragOver={handleDrag}
                                            onDrop={handleDrop}
                                            onClick={() => !uploadedFile && fileInputRef.current?.click()}
                                            className={`flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-3xl p-8 transition-all duration-300 ${dragActive
                                                    ? 'border-purple-500 bg-purple-500/10 shadow-[0_0_30px_rgba(168,85,247,0.2)]'
                                                    : uploadedFile
                                                        ? 'border-white/20 bg-white/5'
                                                        : 'border-white/10 bg-black/20 hover:bg-white/5 hover:border-white/30 cursor-pointer'
                                                }`}
                                        >
                                            <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileSelect} />

                                            {uploadedFile ? (
                                                <div className="w-full flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                                                            <FileCheck className="w-6 h-6 text-purple-400" />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-white max-w-[200px] md:max-w-md truncate">{uploadedFile.name}</p>
                                                            <p className="text-xs text-gray-400">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setUploadedFile(null); }}
                                                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                                                    >
                                                        <X className="w-4 h-4 text-white" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-all duration-300 ${dragActive ? 'bg-purple-500 text-white scale-110 shadow-lg shadow-purple-500/40' : 'bg-white/5 text-gray-400'}`}>
                                                        <UploadCloud className="w-10 h-10" />
                                                    </div>
                                                    <h3 className="font-bold text-lg text-white mb-2">Drag & Drop your file here</h3>
                                                    <p className="text-sm text-gray-400 mb-6 font-medium">Supports PDF, DOCX, ZIP up to 50MB</p>
                                                    <span className="px-6 py-2.5 bg-white/10 rounded-xl font-medium text-sm text-white border border-white/10">
                                                        Browse Files
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    {uploadedFile && !submitted && (
                                        <div className="flex justify-end mt-6">
                                            <button
                                                onClick={handleSimulatedUpload}
                                                disabled={uploading}
                                                className={`px-8 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2 ${uploading
                                                        ? 'bg-purple-600/50 text-white/50 cursor-not-allowed'
                                                        : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-purple-500/25 cursor-pointer'
                                                    }`}
                                            >
                                                {uploading ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                        Uploading to Cloud...
                                                    </>
                                                ) : 'Upload Assignment'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
