import { create } from 'zustand';
import { supabase } from '../config/supabase';

export interface Course {
    code: string;
    name: string;
}

interface CourseState {
    courses: Course[];
    fetchCourses: () => Promise<void>;
    addCourse: (course: Course) => Promise<boolean>;
}

export const useCourseStore = create<CourseState>((set, get) => ({
    courses: [],

    fetchCourses: async () => {
        const { data, error } = await supabase.from('courses').select('code, name');
        if (!error && data) {
            set({ courses: data });
        }
    },

    addCourse: async (course) => {
        const { error } = await supabase.from('courses').insert({
            code: course.code,
            name: course.name
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
