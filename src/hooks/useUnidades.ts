import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { ApiResponse } from '../types/api';
import { Page, UnidadeRequest, UnidadeResponse } from '../types/unidade';
import { toast } from 'sonner';
import { MESSAGES } from '../constants/messages';

// Chave de cache primária para invalidação cirúrgica
export const UNIDADES_QUERY_KEY = ['unidades'];

// Hook para Listagem (GET)
export function useUnidades(page = 0, size = 10) {
  return useQuery({
    queryKey: [...UNIDADES_QUERY_KEY, page, size],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Page<UnidadeResponse>>>(`/unidades?page=${page}&size=${size}`);
      // Retornamos apenas o payload útil (o Page<T>), o TanStack Query gerencia o resto.
      return response.data.data; 
    },
  });
}

// Hook para Criação (POST)
export function useCreateUnidade() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<UnidadeResponse>, ApiResponse<null>, UnidadeRequest>({
    mutationFn: async (data) => {
      const response = await api.post<ApiResponse<UnidadeResponse>>('/unidades', data);
      return response.data;
    },
    onSuccess: () => {
      // Quando cria com sucesso, invalida o cache da listagem para atualizar a tabela
      queryClient.invalidateQueries({ queryKey: UNIDADES_QUERY_KEY });
      toast.success(MESSAGES.SUCCESS.SAVED);
    },
  });
}

// Hook para Inativação/Soft Delete (DELETE)
export function useInativarUnidade() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<void>, ApiResponse<null>, string>({
    mutationFn: async (id) => {
      const response = await api.delete<ApiResponse<void>>(`/unidades/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: UNIDADES_QUERY_KEY });
      toast.success(MESSAGES.SUCCESS.DELETED);
    },
  });
}

// Hook para Atualização (PUT)
export function useUpdateUnidade() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<UnidadeResponse>, ApiResponse<null>, { id: string; data: UnidadeRequest }>({
    mutationFn: async ({ id, data }) => {
      const response = await api.put<ApiResponse<UnidadeResponse>>(`/unidades/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      // Invalida a listagem para atualizar a tabela na mesma hora, sem reload
      queryClient.invalidateQueries({ queryKey: UNIDADES_QUERY_KEY });
      toast.success(MESSAGES.SUCCESS.SAVED);
    },
  });
}
