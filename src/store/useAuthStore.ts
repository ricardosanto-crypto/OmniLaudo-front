import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthUser } from '../types/auth';

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
                // Opcional: limpar outros caches, como o do TanStack Query, 
                // mas faremos isso em nível de componente/rota.
            },

            hasRole: (role) => {
                const { user } = get();
                return user?.roles.includes(role) ?? false;
            },
        }),
        {
            name: '@omnilaudo/auth', // Chave no localStorage
            // Apenas persista token e user. 'isAuthenticated' é derivado, mas o Zustand 
            // gerencia bem isso na reidratação.
        }
    )
);