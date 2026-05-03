import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { ApiResponse, Page } from '../types/api';
import { ModalidadeRequest, ModalidadeResponse } from '../types/modalidade';
import { mapSpringPage } from '../lib/utils';

export const MODALIDADES_QUERY_KEY = ['modalidades'];

export function useModalidades(page = 0, size = 100) {
  return useQuery({
    queryKey: [...MODALIDADES_QUERY_KEY, page, size],
    queryFn: async (): Promise<Page<ModalidadeResponse>> => {
      const url = `/modalidades?page=${page}&size=${size}`;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await api.get<ApiResponse<any>>(url);
      return mapSpringPage<ModalidadeResponse>(response.data.data, size);
    },
  });
}

export function useCreateModalidade() {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<ModalidadeResponse>, Error, ModalidadeRequest>({
    mutationFn: async (data) => {
      const res = await api.post<ApiResponse<ModalidadeResponse>>('/modalidades', data);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: MODALIDADES_QUERY_KEY }),
  });
}

export function useUpdateModalidade() {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<ModalidadeResponse>, Error, { id: string; data: ModalidadeRequest }>({
    mutationFn: async ({ id, data }) => {
      const res = await api.put<ApiResponse<ModalidadeResponse>>(`/modalidades/${id}`, data);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: MODALIDADES_QUERY_KEY }),
  });
}

export function useInativarModalidade() {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<void>, Error, string>({
    mutationFn: async (id) => {
      const res = await api.delete<ApiResponse<void>>(`/modalidades/${id}`);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: MODALIDADES_QUERY_KEY }),
  });
}
