import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { ApiResponse } from '../types/api';
import { PacienteRequest, PacientePage } from '../types/paciente';
import { toast } from 'sonner';
import { MESSAGES } from '../constants/messages';

export const PACIENTES_QUERY_KEY = ['pacientes'];

export function usePacientes(page = 0, size = 10, nome?: string) {
  return useQuery({
    queryKey: [...PACIENTES_QUERY_KEY, page, size, nome],
    queryFn: async () => {
      const url = `/pacientes?page=${page}&size=${size}${nome ? `&nome=${nome}` : ''}`;
      const response = await api.get<ApiResponse<PacientePage>>(url);
      return response.data.data;
    },
  });
}

export function useCreatePaciente() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PacienteRequest) => api.post('/pacientes', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PACIENTES_QUERY_KEY });
      toast.success(MESSAGES.SUCCESS.SAVED);
    },
  });
}
