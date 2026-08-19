import { BookOpen, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useCourseStore } from '@/store/courseStore';

const availableCourses = [
    { id: 1, code: 'CS101', name: 'Intro to Computer Science', credits: 4, faculty: 'Dr. Alan Turing' },
    { id: 2, code: 'MATH201', name: 'Advanced Calculus', credits: 3, faculty: 'Dr. Euler' },
    { id: 3, code: 'PHY105', name: 'Quantum Physics', credits: 4, faculty: 'Dr. Feynman' },
];

export default function CourseEnrollment() {
    const [enrolled, setEnrolled] = useState<(number | string)[]>([]);
    const { courses } = useCourseStore();

    const storeCourses = courses.map(c => ({
        id: c.code,
        code: c.code,
        name: c.name,
        credits: 3,
        faculty: 'Local Faculty'
    }));

    const allCourses = [...availableCourses, ...storeCourses.filter(sc => !availableCourses.some(ac => ac.code === sc.code))];

    const handleEnroll = (id: number | string) => {
        if (!enrolled.includes(id)) {
            setEnrolled([...enrolled, id]);
        }
    };

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
                    Course Enrollment
                </h1>
                <p className="text-gray-400 mt-1">Select and register for subjects required in your current semester.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allCourses.map((course) => (
                    <div key={course.id} className="glass-panel p-6 rounded-3xl border-emerald-500/20 relative group hover:-translate-y-1 transition-transform">
                        <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
                            <BookOpen className="w-16 h-16 text-emerald-400 blur-sm" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-bold font-mono">
                                    {course.code}
                                </span>
                                <span className="text-xs text-gray-400 font-medium">{course.credits} Credits</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{course.name}</h3>
                            <p className="text-sm text-gray-400 mb-6">Instructor: {course.faculty}</p>

                            <button
                                onClick={() => handleEnroll(course.id)}
                                disabled={enrolled.includes(course.id)}
                                className={`w-full py-3 rounded-xl font-medium flex items-center justify-center space-x-2 transition-all ${enrolled.includes(course.id)
                                    ? 'bg-emerald-500/20 text-emerald-400 cursor-not-allowed border border-emerald-500/30'
                                    : 'bg-white/10 hover:bg-white/20 text-white'
                                    }`}
                            >
                                {enrolled.includes(course.id) ? (
                                    <>
                                        <CheckCircle className="w-5 h-5" />
                                        <span>Enrolled</span>
                                    </>
                                ) : (
                                    <span>Enroll Now</span>
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
