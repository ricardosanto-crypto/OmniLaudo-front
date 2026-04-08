import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { ApiResponse } from '../types/api';
import { toast } from 'sonner';
import { MESSAGES } from '../constants/messages';

export function useModelosLaudo(codigoProcedimento?: string) {
  return useQuery({
    queryKey: ['modelos-laudo', codigoProcedimento],
    queryFn: async () => {
      const url = codigoProcedimento 
        ? `/modelos-laudo/por-procedimento/${codigoProcedimento}` 
        : '/modelos-laudo';
      const response = await api.get<ApiResponse<any[]>>(url);
      return response.data.data;
    },
  });
}

export function useFinalizarLaudo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.post(`/laudos/${id}/finalizar`),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['agendamentos'] });
        queryClient.invalidateQueries({ queryKey: ['procedimentos'] });
        toast.success(MESSAGES.SUCCESS.FINALIZED);
    },
  });
}
