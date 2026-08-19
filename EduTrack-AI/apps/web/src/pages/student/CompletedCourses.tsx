import { useState, useEffect } from 'react';
import { Award, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface CourseRecord {
    series: string;
    name: string;
    grade: string;
    status: string;
}

export default function CompletedCourses() {
    const [completedCourses, setCompletedCourses] = useState<CourseRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        async function fetchGrades() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Fetch the grades assigned to this specific student
            const { data: grades } = await supabase
                .from('course_results')
                .select('*')
                .eq('student_id', user.id);

            // Fetch the entire master courses list for name mapping
            const { data: courses } = await supabase.from('courses').select('*');

            if (grades && courses && isMounted) {
                // Filter out grades that are completely empty/unassigned
                const assignedGrades = grades.filter(g => g.grade && g.grade.trim() !== '');

                const mappedGrades = assignedGrades.map(g => {
                    const c = courses.find(course => course.code === g.course_code);
                    return {
                        series: g.course_code,
                        name: c?.name || 'Unknown Course',
                        grade: g.grade,
                        status: g.status || 'PASS'
                    };
                });
                setCompletedCourses(mappedGrades);
            }
            if (isMounted) setIsLoading(false);
        }

        fetchGrades();
        return () => { isMounted = false; };
    }, []);

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-12">
            <div className="mb-8 p-8 rounded-3xl bg-gradient-to-br from-emerald-50 dark:from-emerald-900/40 via-white dark:via-emerald-900/20 to-slate-50 dark:to-transparent border border-emerald-100 dark:border-white/10 relative overflow-hidden shadow-sm">
                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[150%] bg-emerald-500/10 blur-[80px] pointer-events-none mix-blend-multiply dark:mix-blend-screen" />

                <div className="relative z-10 flex items-center space-x-4 mb-3">
                    <Award className="w-10 h-10 text-emerald-500 dark:text-emerald-400" />
                    <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        Completed Courses
                    </h1>
                </div>
                <p className="text-slate-600 dark:text-gray-400 max-w-2xl text-base relative z-10 font-medium">
                    Review your completed courses and academic performance history securely sourced from official faculty records.
                </p>
            </div>

            <div className="glass-panel p-6 rounded-3xl relative overflow-hidden group bg-white/60 dark:bg-black/20 min-h-[200px]">
                {isLoading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-transparent z-20">
                        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-3" />
                        <p className="text-slate-500 dark:text-gray-400 font-medium animate-pulse text-sm">Syncing Transcripts...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto relative z-10">
                        {completedCourses.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-8 text-center">
                                <Award className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3" />
                                <h3 className="font-bold text-slate-700 dark:text-slate-300">No Grades Recorded Yet</h3>
                                <p className="text-sm text-slate-500 mt-1 max-w-xs">Your faculty has not published any official grades to your transcript.</p>
                            </div>
                        ) : (
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-black/5 dark:border-white/10 uppercase text-[10px] tracking-wider text-slate-500 dark:text-gray-400">
                                        <th className="pb-3 font-semibold">Course Code</th>
                                        <th className="pb-3 font-semibold">Subject Name</th>
                                        <th className="pb-3 font-semibold text-center mt-2">Grade</th>
                                        <th className="pb-3 font-semibold">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-black/5 dark:divide-white/5">
                                    {completedCourses.map((course, idx) => (
                                        <tr key={idx} className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                            <td className="py-4 text-slate-500 dark:text-gray-400 font-mono text-xs">{course.series}</td>
                                            <td className="py-4 font-medium text-slate-900 dark:text-gray-100">{course.name}</td>
                                            <td className="py-4 font-bold text-slate-700 dark:text-gray-300 text-center text-lg">{course.grade}</td>
                                            <td className="py-4">
                                                <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${course.status.toUpperCase() === 'PASS'
                                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                                                    }`}>
                                                    {course.status.toUpperCase()}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
