import { create } from 'zustand';
import { supabase } from '../config/supabase';

export interface Course {
    code: string;
    name: string;
    faculty_id?: string;
    faculty_name?: string;
}

interface CourseState {
    courses: Course[];
    fetchCourses: () => Promise<void>;
    addCourse: (course: Course) => Promise<boolean>;
}

export const useCourseStore = create<CourseState>((set, get) => ({
    courses: [],

    fetchCourses: async () => {
        const { data, error } = await supabase.from('courses').select('code, name, faculty_id');
        if (!error && data) {
            const facultyIds = [...new Set(data.map((c: any) => c.faculty_id).filter(Boolean))];
            const profilesDict: Record<string, string> = {};

            if (facultyIds.length > 0) {
                const { data: profs } = await supabase.from('profiles').select('id, full_name').in('id', facultyIds);
                if (profs) {
                    profs.forEach((p: any) => {
                        profilesDict[p.id] = p.full_name;
                    });
                }
            }

            const mapped = data.map((c: any) => ({
                code: c.code,
                name: c.name,
                faculty_id: c.faculty_id,
                faculty_name: c.faculty_id && profilesDict[c.faculty_id] ? profilesDict[c.faculty_id] : 'Unknown Faculty'
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
            // Update local state proactively
            set((state) => ({
                courses: [...state.courses, course],
            }));
            return true;
        }
        return false;
    },
}));
