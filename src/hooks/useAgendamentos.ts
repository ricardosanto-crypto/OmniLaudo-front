import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { ApiResponse, Page } from '../types/api';
import { AgendamentoRequest, AgendamentoResponse } from '../types/agendamento';
import { mapSpringPage } from '../lib/utils';

export const AGENDAMENTOS_KEY = ['agendamentos'];

export function useAgendamentos(page = 0, size = 10) {
  return useQuery({
    queryKey: [...AGENDAMENTOS_KEY, page, size],
    queryFn: async (): Promise<Page<AgendamentoResponse>> => {
      const url = `/agendamentos?page=${page}&size=${size}`;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await api.get<ApiResponse<any>>(url);
      
      return mapSpringPage<AgendamentoResponse>(response.data.data, size);
    },
    refetchInterval: 10000, 
  });
}

export function useCreateAgendamento() {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<AgendamentoResponse>, Error, AgendamentoRequest>({
    mutationFn: async (data) => {
        const res = await api.post<ApiResponse<AgendamentoResponse>>('/agendamentos', data);
        return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: AGENDAMENTOS_KEY }),
  });
}

export function useUpdateAgendamentoStatus() {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<void>, Error, { id: string; status: string }>({
    mutationFn: async ({ id, status }) => {
      const res = await api.patch<ApiResponse<void>>(`/agendamentos/${id}/status`, { status });
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: AGENDAMENTOS_KEY }),
  });
}

export function useAgendamentoById(id: string | undefined) {
  return useQuery({
    queryKey: [...AGENDAMENTOS_KEY, id],
    queryFn: async (): Promise<AgendamentoResponse | null> => {
      if (!id) return null;
      const response = await api.get<ApiResponse<AgendamentoResponse>>(`/agendamentos/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
}
