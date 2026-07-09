import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { cookieStorage } from './cookieStorage';

export interface User {
    uuid_unique: string;
    username: string;
    email: string;
    registered_at: string;
    first_name: string;
    last_name: string;
    phone: string;
    whatsapp: string;
    status: boolean;
    company_id: string;
    company_name: string;
    language: string;
    created_at: string;
    updated_at: string;
    rol_id: string;
    rol_key: string;
    rol_name: string;
}

export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
    login: (data: { account: User; token: string }) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            isAuthenticated: false,
            user: null,
            token: null,
            login: (data: { account: User; token: string }) => {
                set({
                    isAuthenticated: true,
                    user: data.account,
                    token: data.token,
                });
            },
            logout: async () => {
                set({
                    isAuthenticated: false,
                    user: null,
                    token: null,
                });
                await cookieStorage.removeItem('auth');
            },
        }),
        {
            name: 'auth',
            storage: cookieStorage,
        }
    )
);
