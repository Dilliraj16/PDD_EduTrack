import { supabase } from '@/lib/supabase';

export const StudentService = {
    async getDashboardStats(studentId: string) {
        const [cgpaRes, attendanceRes, enrollmentsRes] = await Promise.all([
            supabase.from('cgpa').select('cumulative_cgpa').eq('student_id', studentId).single(),
            supabase.from('attendance').select('*', { count: 'exact' }).eq('student_id', studentId),
            supabase.from('enrollments').select('subject_id').eq('student_id', studentId)
        ]);

        return {
            cgpa: cgpaRes.data?.cumulative_cgpa || 0,
            totalAttendance: attendanceRes.count || 0,
            enrolledSubjects: enrollmentsRes.data?.length || 0,
        };
    },

    async submitAssignment(assignmentId: string, studentId: string, fileUrl: string) {
        const { data, error } = await supabase
            .from('assignment_submissions')
            .upsert({ assignment_id: assignmentId, student_id: studentId, file_url: fileUrl })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async requestOD(studentId: string, reason: string, date: string, fileUrl?: string) {
        // Expanding our schema logic safely assuming an od_requests table exists
        const { data, error } = await supabase
            .from('od_requests')
            .insert({ student_id: studentId, reason, date_requested: date, attachment_url: fileUrl })
            .select()
            .single();

        if (error) throw error;
        return data;
    }
};
