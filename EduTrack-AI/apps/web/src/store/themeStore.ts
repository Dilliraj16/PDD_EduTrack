import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

interface ThemeState {
    theme: 'light' | 'dark' | 'system';
    setTheme: (theme: 'light' | 'dark' | 'system', userId?: string) => void;
    toggleTheme: (userId?: string) => void;
    initializeRealtimeSync: (userId: string) => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
    theme: (localStorage.getItem('app-theme') as 'light' | 'dark' | 'system') || 'system',

    setTheme: async (newTheme, userId) => {
        // Optimistically apply locally
        set({ theme: newTheme });
        localStorage.setItem('app-theme', newTheme);

        // Dom class binding
        const isDark = newTheme === 'dark' || (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        document.documentElement.classList.toggle('dark', isDark);

        // Sync to Supabase Master Table if logged in
        if (userId) {
            try {
                const { error } = await supabase.from('theme_preferences').upsert({ user_id: userId, app_theme: newTheme });
                if (error) console.error('Error syncing theme:', error);
            } catch (e) {
                console.warn('Realtime sync skipped while DB is dormant.');
            }
        }
    },

    toggleTheme: (userId) => {
        const current = get().theme;
        const next = current === 'dark' ? 'light' : 'dark';
        get().setTheme(next, userId);
    },

    initializeRealtimeSync: async (userId) => {
        // Fetch initial theme from settings
        const { data } = await supabase.from('theme_preferences').select('app_theme').eq('user_id', userId).single();
        if (data && data.app_theme && data.app_theme !== get().theme) {
            get().setTheme(data.app_theme as 'light' | 'dark' | 'system');
        }

        // Binds to Supabase Realtime so Mobile app toggles hit the DB, and Web instantly reacts
        supabase
            .channel('theme_sync')
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'theme_preferences', filter: `user_id=eq.${userId}` },
                (payload) => {
                    const newTheme = payload.new.app_theme;
                    if (newTheme !== get().theme) {
                        get().setTheme(newTheme); // Sync local state without hitting DB again
                    }
                }
            )
            .subscribe((_status, err) => {
                if (err) console.warn('Supabase Realtime offline: Database container dormant.');
            });
    }
}));

// Initial boot check
const initial = localStorage.getItem('app-theme') as 'light' | 'dark' | 'system' || 'system';
const isDark = initial === 'dark' || (initial === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
document.documentElement.classList.toggle('dark', isDark);
