import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { ApiResponse } from '../types/api';
import { AgendamentoRequest, AgendamentoPage } from '../types/agendamento';
import { toast } from 'sonner';
import { MESSAGES } from '../constants/messages';

export const AGENDAMENTOS_KEY = ['agendamentos'];

export function useAgendamentos(page = 0, size = 10) {
  return useQuery({
    queryKey: [...AGENDAMENTOS_KEY, page, size],
    queryFn: async () => {
      const response = await api.get<ApiResponse<AgendamentoPage>>(`/agendamentos?page=${page}&size=${size}`);
      return response.data.data;
    },
  });
}

export function useCreateAgendamento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AgendamentoRequest) => api.post('/agendamentos', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AGENDAMENTOS_KEY });
      toast.success(MESSAGES.SUCCESS.SAVED);
    },
  });
}

// Muta para mudar status (Check-in, Iniciar, etc)
export function useUpdateAgendamentoStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      // Ajuste o endpoint conforme a necessidade do seu Controller (ex: PATCH ou PUT)
      const response = await api.patch(`/agendamentos/${id}/status`, { status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AGENDAMENTOS_KEY });
      toast.success(MESSAGES.SUCCESS.GENERIC);
    },
  });
}
