import { supabase } from '../../../config/supabase';

export const authService = {
    // Mobile implementations matching the Web flow logic

    signInWithPin: async (email: string) => {
        // Note: Simulated for now matching Web's 'Secret PIN' flow, which validates
        // against user profile data or a secure RPC call.
        return await supabase.auth.signInWithOtp({
            email,
        });
    },

    signInWithPassword: async (email: string, password: string) => {
        return await supabase.auth.signInWithPassword({
            email,
            password,
        });
    },

    signUp: async (email: string, password: string, fullName: string, role: string, pin: string) => {
        // Matches Web logic: Creating Auth User then assigning role and Secret PIN in public profiles
        return await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    role: role,
                    secret_pin: pin, // Should be hashed via edge function in prod
                }
            }
        });
    },

    signOut: async () => {
        return await supabase.auth.signOut();
    },

    getSession: async () => {
        return await supabase.auth.getSession();
    },
};
