import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { ApiResponse } from '../types/api';
import { SalaRequest, SalaPage } from '../types/sala';
import { toast } from 'sonner';
import { MESSAGES } from '../constants/messages';

export const SALAS_QUERY_KEY = ['salas'];

export function useSalas(page = 0, size = 10) {
  return useQuery({
    queryKey: [...SALAS_QUERY_KEY, page, size],
    queryFn: async () => {
      const response = await api.get<ApiResponse<SalaPage>>(`/salas?page=${page}&size=${size}`);
      return response.data.data;
    },
  });
}

export function useCreateSala() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SalaRequest) => api.post('/salas', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SALAS_QUERY_KEY });
      toast.success(MESSAGES.SUCCESS.SAVED);
    },
  });
}

// Hook para Editar (PUT)
export function useUpdateSala() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SalaRequest }) => api.put(`/salas/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SALAS_QUERY_KEY });
      toast.success(MESSAGES.SUCCESS.SAVED);
    },
  });
}

// Hook para Inativar (DELETE)
export function useInativarSala() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/salas/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SALAS_QUERY_KEY });
      toast.success(MESSAGES.SUCCESS.DELETED);
    },
  });
}
