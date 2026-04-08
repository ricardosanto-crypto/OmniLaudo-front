import axios, { InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { handleApiError } from './errorHandler';

export const api = axios.create({
    // Use a variável de ambiente do Vite, fazendo fallback pro seu Spring Boot local
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor de Requisição: Injeta o JWT
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = useAuthStore.getState().token;

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);


// Interceptor de Resposta: Tratamento centralizado de erros e JWT expirado
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Delegamos todo o feedback visual para o manipulador padronizado
        handleApiError(error);

        // Se for 401, desloga no store
        if (error.response?.status === 401) {
            useAuthStore.getState().logout();
        }

        return Promise.reject(error);
    }
);