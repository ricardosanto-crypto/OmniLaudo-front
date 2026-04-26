import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { Page, ApiResponse } from '../types/api';
import { UnidadeRequest, UnidadeResponse } from '../types/unidade';
import { mapSpringPage } from '../lib/utils';

export const UNIDADES_QUERY_KEY = ['unidades'];

export function useUnidades(page = 0, size = 10) {
  return useQuery({
    queryKey: [...UNIDADES_QUERY_KEY, page, size],
    queryFn: async (): Promise<Page<UnidadeResponse>> => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await api.get<ApiResponse<any>>(`/unidades?page=${page}&size=${size}`);
      
      return mapSpringPage<UnidadeResponse>(response.data.data, size);
    },
  });
}

export function useCreateUnidade() {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<UnidadeResponse>, Error, UnidadeRequest>({
    mutationFn: async (data) => {
      const response = await api.post<ApiResponse<UnidadeResponse>>('/unidades', data);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: UNIDADES_QUERY_KEY }),
  });
}

export function useInativarUnidade() {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<void>, Error, string>({
    mutationFn: async (id) => {
      const response = await api.delete<ApiResponse<void>>(`/unidades/${id}`);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: UNIDADES_QUERY_KEY }),
  });
}

export function useUpdateUnidade() {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<UnidadeResponse>, Error, { id: string; data: UnidadeRequest }>({
    mutationFn: async ({ id, data }) => {
      const response = await api.put<ApiResponse<UnidadeResponse>>(`/unidades/${id}`, data);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: UNIDADES_QUERY_KEY }),
  });
}
