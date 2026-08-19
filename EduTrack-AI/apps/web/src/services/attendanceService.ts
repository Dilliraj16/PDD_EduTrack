import { supabase } from '@/lib/supabase';

export const AttendanceService = {
    async markBulkAttendance(subjectId: string, facultyId: string, date: string, records: { student_id: string, status: string }[]) {
        // Formatting data for bulk upsert
        const payload = records.map(req => ({
            subject_id: subjectId,
            student_id: req.student_id,
            date: date,
            status: req.status,
            recorded_by: facultyId
        }));

        const { data, error } = await supabase
            .from('attendance')
            .upsert(payload, { onConflict: 'student_id,subject_id,date' })
            .select();

        if (error) throw error;
        return data;
    },

    async getStudentAttendanceAnalytics(studentId: string) {
        const { data, error } = await supabase
            .from('attendance')
            .select('status, subject_id')
            .eq('student_id', studentId);

        if (error) throw error;
        return data;
    }
};
