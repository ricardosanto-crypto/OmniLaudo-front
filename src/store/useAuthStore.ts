import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthUser } from '../types/auth';
import { queryClient } from '../lib/queryClient';

interface AuthState {
    token: string | null;
    user: AuthUser | null;
    isAuthenticated: boolean;
    login: (token: string, user: AuthUser) => void;
    logout: () => void;
    hasRole: (role: AuthUser['roles'][number]) => boolean;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            token: null,
            user: null,
            isAuthenticated: false,

            login: (token: string, user: AuthUser) => {
                set({ token, user, isAuthenticated: true });
            },

            logout: () => {
                set({ token: null, user: null, isAuthenticated: false });
                queryClient.clear();
            },

            hasRole: (role) => {
                const { user } = get();
                return user?.roles.includes(role) ?? false;
            },
        }),
        {
            name: '@omnilaudo/auth', // Chave no localStorage
            partialize: (state) => ({ token: state.token, user: state.user }),
            onRehydrateStorage: () => (state, error) => {
                if (error) {
                    console.error('Erro ao reidratar auth storage:', error);
                    return;
                }
                if (state?.token && state.user) {
                    state.isAuthenticated = true;
                }
            },
        }
    )
);