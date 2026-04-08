import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { ApiResponse } from '../types/api';
import { EquipamentoRequest, EquipamentoPage } from '../types/equipamento';
import { toast } from 'sonner';
import { MESSAGES } from '../constants/messages';

export const EQUIP_QUERY_KEY = ['equipamentos'];

export function useEquipamentos(page = 0, size = 10, nome?: string) {
  return useQuery({
    queryKey: [...EQUIP_QUERY_KEY, page, size, nome],
    queryFn: async () => {
      const url = `/equipamentos?page=${page}&size=${size}${nome ? `&nome=${nome}` : ''}`;
      const response = await api.get<ApiResponse<EquipamentoPage>>(url);
      return response.data.data;
    },
  });
}

export function useCreateEquipamento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: EquipamentoRequest) => api.post('/equipamentos', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EQUIP_QUERY_KEY });
      toast.success(MESSAGES.SUCCESS.SAVED);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Erro ao criar equipamento';
      toast.error(message);
    },
  });
}

export function useUpdateEquipamento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: EquipamentoRequest }) => 
      api.put(`/equipamentos/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EQUIP_QUERY_KEY });
      toast.success(MESSAGES.SUCCESS.SAVED);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Erro ao salvar equipamento';
      toast.error(message);
    },
  });
}
