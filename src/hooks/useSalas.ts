import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { ApiResponse, Page } from '../types/api';
import { SalaRequest, SalaResponse } from '../types/sala';
import { mapSpringPage } from '../lib/utils';

export const SALAS_QUERY_KEY = ['salas'];

export function useSalas(page = 0, size = 10) {
  return useQuery({
    queryKey: [...SALAS_QUERY_KEY, page, size],
    queryFn: async (): Promise<Page<SalaResponse>> => {
      const url = `/salas?page=${page}&size=${size}`;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await api.get<ApiResponse<any>>(url);
      
      return mapSpringPage<SalaResponse>(response.data.data, size);
    },
  });
}

export function useCreateSala() {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<SalaResponse>, Error, SalaRequest>({
    mutationFn: async (data) => {
        const res = await api.post<ApiResponse<SalaResponse>>('/salas', data);
        return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SALAS_QUERY_KEY }),
  });
}

export function useUpdateSala() {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<SalaResponse>, Error, { id: string; data: SalaRequest }>({
    mutationFn: async ({ id, data }) => {
        const res = await api.put<ApiResponse<SalaResponse>>(`/salas/${id}`, data);
        return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SALAS_QUERY_KEY }),
  });
}

export function useInativarSala() {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<void>, Error, string>({
    mutationFn: async (id) => {
        const res = await api.delete<ApiResponse<void>>(`/salas/${id}`);
        return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SALAS_QUERY_KEY }),
  });
}
