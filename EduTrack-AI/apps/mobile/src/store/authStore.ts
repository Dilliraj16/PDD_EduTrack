import { create } from 'zustand';

interface AuthState {
    user: { id: string; email: string; name?: string } | null;
    role: 'student' | 'faculty' | null;
    login: (user: { id: string; email: string; name?: string }, role: 'student' | 'faculty') => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    role: null,
    login: (user, role) => set({ user, role }),
    logout: () => set({ user: null, role: null }),
}));
