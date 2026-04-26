import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { ApiResponse, Page } from '../types/api';
import { EquipamentoRequest, EquipamentoResponse } from '../types/equipamento';
import { mapSpringPage } from '../lib/utils';

export const EQUIP_QUERY_KEY = ['equipamentos'];

export function useEquipamentos(page = 0, size = 10, nome?: string) {
  return useQuery({
    queryKey: [...EQUIP_QUERY_KEY, page, size, nome],
    queryFn: async (): Promise<Page<EquipamentoResponse>> => {
      const url = `/equipamentos?page=${page}&size=${size}${nome ? `&nome=${nome}` : ''}`;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await api.get<ApiResponse<any>>(url);
      
      return mapSpringPage<EquipamentoResponse>(response.data.data, size);
    },
  });
}

export function useCreateEquipamento() {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<EquipamentoResponse>, Error, EquipamentoRequest>({
    mutationFn: async (data) => {
      const res = await api.post<ApiResponse<EquipamentoResponse>>('/equipamentos', data);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: EQUIP_QUERY_KEY }),
  });
}

export function useUpdateEquipamento() {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<EquipamentoResponse>, Error, { id: string; data: EquipamentoRequest }>({
    mutationFn: async ({ id, data }) => {
      const res = await api.put<ApiResponse<EquipamentoResponse>>(`/equipamentos/${id}`, data);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: EQUIP_QUERY_KEY }),
  });
}

export function useDeleteEquipamento() {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<void>, Error, string>({
    mutationFn: async (id) => {
      const res = await api.delete<ApiResponse<void>>(`/equipamentos/${id}`);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: EQUIP_QUERY_KEY }),
  });
}
