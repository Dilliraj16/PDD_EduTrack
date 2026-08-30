import { supabase } from '@/lib/supabase';

export const AuthService = {
    async loginWithEmail(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        // Fetch profile role after login to populate zustand store appropriately
        const profile = await this.getUserProfile(data.user.id);
        return { user: data.user, role: profile?.role || 'student' };
    },

    async loginWithGoogle() {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
        });
        if (error) throw error;
        return data;
    },

    async logout() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    async getUserProfile(userId: string) {
        // Note: Assuming a generalized 'profiles' or role-lookup pattern
        // In our schema, we determine role by checking which table the user exists in.
        const { data: student } = await supabase.from('students').select('*').eq('id', userId).single();
        if (student) return { ...student, role: 'student' };

        const { data: faculty } = await supabase.from('faculty').select('*').eq('id', userId).single();
        if (faculty) return { ...faculty, role: 'faculty' };

        return null;
    }
};
