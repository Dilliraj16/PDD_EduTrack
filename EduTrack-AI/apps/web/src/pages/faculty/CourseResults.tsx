import { useState, useEffect } from 'react';
import { Award, Search, CheckCircle2, ChevronDown, Loader2 } from 'lucide-react';
import { useCourseStore } from '@/store/courseStore';

export default function CourseResults() {
    const { courses: COURSES, activeStudents, isLoading, fetchCoursesForFaculty, fetchStudentsForCourse, updateGrade } = useCourseStore();

    const [selectedCourse, setSelectedCourse] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch initial courses for the faculty
    useEffect(() => {
        fetchCoursesForFaculty();
    }, [fetchCoursesForFaculty]);

    // Set the default selected course once courses load
    useEffect(() => {
        if (COURSES.length > 0 && !selectedCourse) {
            setSelectedCourse(COURSES[0].code);
        }
    }, [COURSES, selectedCourse]);

    // Fetch students specifically for the selected course
    useEffect(() => {
        if (selectedCourse) {
            fetchStudentsForCourse(selectedCourse);
        }
    }, [selectedCourse, fetchStudentsForCourse]);

    const handleGradeChange = (id: string, newGrade: string) => {
        if (!selectedCourse) return;
        updateGrade(selectedCourse, id, newGrade);
    };

    const handleSave = () => {
        setIsSaving(true);
        // We simulate saving delay for UX since updateGrade already persists optimistically under the hood
        setTimeout(() => {
            setIsSaving(false);
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 3000);
        }, 1200);
    };

    const filteredStudents = activeStudents.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.roll_no.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center gap-3">
                    <Award className="w-8 h-8 text-indigo-500" />
                    Course Results Entry
                </h1>
                <p className="text-slate-500 dark:text-gray-400 mt-1">
                    Evaluate and assign grades for students in your enrolled courses.
                </p>
            </div>

            {/* Course Selector & Search */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-panel p-4 rounded-2xl flex items-center justify-between border-slate-200 dark:border-white/10 relative group hover:bg-slate-50 dark:hover:bg-white/5 transition">
                    <div className="w-full">
                        <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-1">Selected Course</p>
                        {COURSES.length === 0 ? (
                            <p className="text-sm text-slate-500 font-medium">Fetching active subjects...</p>
                        ) : (
                            <select
                                value={selectedCourse}
                                onChange={(e) => setSelectedCourse(e.target.value)}
                                className="w-full bg-transparent text-lg font-bold text-slate-800 dark:text-white focus:outline-none appearance-none cursor-pointer"
                            >
                                {COURSES.map(course => (
                                    <option key={course.id} value={course.code} className="text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                                        {course.name} ({course.code})
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                    <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors pointer-events-none" />
                </div>

                <div className="glass-panel p-4 rounded-2xl border-slate-200 dark:border-white/10 flex items-center">
                    <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
                    <input
                        type="text"
                        placeholder="Search student by name or roll number..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent border-none text-slate-800 dark:text-white focus:outline-none placeholder:text-slate-400"
                    />
                </div>
            </div>

            {/* Grading Table */}
            <div className="glass-panel rounded-3xl overflow-hidden relative border-slate-200 dark:border-white/10 shadow-xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] pointer-events-none" />

                <div className="overflow-x-auto min-h-[300px] relative">
                    {isLoading ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 dark:bg-black/20 backdrop-blur-sm z-20">
                            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
                            <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Syncing Database...</p>
                        </div>
                    ) : null}

                    {COURSES.length === 0 && !isLoading ? (
                        <div className="flex flex-col items-center justify-center p-12 h-64 text-slate-500">
                            <Award className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-4" />
                            <p className="text-lg font-bold text-slate-700 dark:text-slate-300">No Courses Initialized</p>
                            <p className="text-sm">Please create a subject first before assigning grades.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left relative z-10 border-collapse">
                            <thead>
                                <tr className="bg-slate-100/50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 text-sm">
                                    <th className="p-4 font-semibold px-6">Student info</th>
                                    <th className="p-4 font-semibold">Roll Number</th>
                                    <th className="p-4 font-semibold text-center w-1/3">Grade Assigned</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                                {filteredStudents.length === 0 && !isLoading ? (
                                    <tr>
                                        <td colSpan={3} className="p-12 text-center text-slate-500 font-medium">
                                            No registered students found in the database.
                                        </td>
                                    </tr>
                                ) : null}
                                {filteredStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                        <td className="p-4 px-6">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30">
                                                    {student.name.charAt(0)}
                                                </div>
                                                <h3 className="font-bold text-slate-800 dark:text-gray-100">{student.name}</h3>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="px-3 py-1 bg-slate-100 dark:bg-black/40 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-medium font-mono border border-slate-200 dark:border-white/10">
                                                {student.roll_no}
                                            </span>
                                        </td>
                                        <td className="p-4 flex justify-center">
                                            <div className="relative group">
                                                <select
                                                    value={student.grade || ''}
                                                    onChange={(e) => handleGradeChange(student.id, e.target.value)}
                                                    className={`appearance-none outline-none font-bold text-center pl-4 pr-10 py-2 rounded-xl transition-all cursor-pointer shadow-sm border ${student.grade
                                                        ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30'
                                                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-gray-200 border-slate-200 dark:border-white/10 hover:border-indigo-400'
                                                        }`}
                                                    style={{ colorScheme: 'light dark' }}
                                                >
                                                    <option value="" disabled className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium">Select Grade</option>
                                                    <option value="S" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium">S - Outstanding</option>
                                                    <option value="A+" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium">A+ - Excellent</option>
                                                    <option value="A" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium">A - Very Good</option>
                                                    <option value="B+" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium">B+ - Good</option>
                                                    <option value="B" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium">B - Above Average</option>
                                                    <option value="C" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium">C - Average</option>
                                                    <option value="D" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium">D - Pass</option>
                                                    <option value="F" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium">F - Fail</option>
                                                    <option value="AB" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium">AB - Absent</option>
                                                </select>
                                                <ChevronDown className={`w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${student.grade ? 'text-emerald-500' : 'text-slate-400 group-hover:text-indigo-500'}`} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Footer actions */}
                <div className="p-6 bg-slate-50 dark:bg-black/20 border-t border-slate-200 dark:border-white/10 flex items-center justify-between relative z-10">
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                        {activeStudents.filter(s => s.grade).length} / {activeStudents.length} Graded Students
                    </p>

                    <button
                        onClick={handleSave}
                        disabled={isSaving || isSaved || COURSES.length === 0}
                        className={`font-semibold px-8 py-3 rounded-xl shadow-lg transition-all flex items-center gap-2 ${isSaved
                            ? 'bg-emerald-500 text-white cursor-default'
                            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white hover:-translate-y-0.5'
                            } ${(isSaving || COURSES.length === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isSaved && <CheckCircle2 className="w-5 h-5" />}
                        {isSaving ? 'Syncing to Database...' : isSaved ? 'Results Published Secured' : 'Publish to Database'}
                    </button>
                </div>
            </div>
        </div>
    );
}
