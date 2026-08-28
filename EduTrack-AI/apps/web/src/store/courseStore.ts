import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

export interface Course {
    id: string; // fallback mapping ID (we use course code)
    name: string;
    code: string;
    faculty_id?: string;
}

export interface StudentGrade {
    id: string; // uuid
    name: string;
    roll_no: string;
    grade: string;
    status?: string;
}

interface CourseState {
    courses: Course[];
    activeStudents: StudentGrade[];
    isLoading: boolean;

    fetchCourses: () => Promise<void>;
    fetchCoursesForFaculty: () => Promise<void>;
    fetchStudentsForCourse: (courseCode: string) => Promise<void>;
    addCourse: (course: Course) => Promise<void>;
    updateGrade: (courseCode: string, studentId: string, grade: string) => Promise<void>;
}

export const useCourseStore = create<CourseState>((set) => ({
    courses: [],
    activeStudents: [],
    isLoading: false,

    fetchCourses: async () => {
        const { data, error } = await supabase.from('courses').select('code, name, faculty_id');
        if (!error && data) {
            const mapped = data.map((c: any) => ({
                id: c.code,
                name: c.name,
                code: c.code,
                faculty_id: c.faculty_id
            }));
            set({ courses: mapped });
        }
    },

    addCourse: async (course) => {
        const { error } = await supabase.from('courses').insert({
            code: course.code,
            name: course.name,
            faculty_id: course.faculty_id
        });

        if (!error) {
            set((state) => ({
                courses: [...state.courses, course]
            }));
        }
    },

    fetchCoursesForFaculty: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: dbCourses, error } = await supabase
            .from('courses')
            .select('*')
            .eq('faculty_id', user.id);

        if (!error && dbCourses) {
            const mapped = dbCourses.map((c: any) => ({
                id: c.code,
                name: c.name,
                code: c.code,
                faculty_id: c.faculty_id
            }));
            set({ courses: mapped });
        }
    },

    fetchStudentsForCourse: async (courseCode: string) => {
        set({ isLoading: true, activeStudents: [] });

        // 1. Get all students (for the polished demo, we assume all students are enrollable/gradable)
        const { data: students } = await supabase.from('profiles').select('*').eq('role', 'student');

        // 2. Get existing grades for THIS course
        const { data: grades } = await supabase.from('course_results').select('*').eq('course_code', courseCode);

        if (students) {
            const mappedStudents: StudentGrade[] = students.map((s: any) => {
                const existingGrade = grades?.find(g => g.student_id === s.id);
                return {
                    id: s.id,
                    name: s.full_name || 'Student',
                    roll_no: s.roll_number || 'N/A',
                    grade: existingGrade?.grade || '',
                    status: existingGrade?.status || ''
                };
            });
            set({ activeStudents: mappedStudents, isLoading: false });
        } else {
            set({ isLoading: false });
        }
    },

    updateGrade: async (courseCode, studentId, grade) => {
        const status = grade === 'F' || grade === 'AB' ? 'FAIL' : (grade ? 'PASS' : 'PENDING');

        // Optimistic UI update
        set((state) => ({
            activeStudents: state.activeStudents.map(s =>
                s.id === studentId ? { ...s, grade, status } : s
            )
        }));

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Upsert securely to DB
        await supabase.from('course_results').upsert({
            course_code: courseCode,
            student_id: studentId,
            faculty_id: user.id,
            grade: grade,
            status: status
        }, { onConflict: 'course_code, student_id' });
    }
}));
