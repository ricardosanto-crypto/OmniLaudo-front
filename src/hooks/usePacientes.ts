import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { ApiResponse, Page } from '../types/api';
import { PacienteRequest, PacienteResponse } from '../types/paciente';
import { mapSpringPage } from '../lib/utils';

export const PACIENTES_QUERY_KEY = ['pacientes'];

export function usePacientes(page = 0, size = 10, nome?: string) {
  return useQuery({
    queryKey: [...PACIENTES_QUERY_KEY, page, size, nome],
    queryFn: async (): Promise<Page<PacienteResponse>> => {
      const url = `/pacientes?page=${page}&size=${size}${nome ? `&nome=${nome}` : ''}`;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await api.get<ApiResponse<any>>(url);
      
      // Um único utilitário resolve a paginação!
      return mapSpringPage<PacienteResponse>(response.data.data, size);
    },
  });
}

export function useCreatePaciente() {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<PacienteResponse>, Error, PacienteRequest>({
    mutationFn: async (data) => {
      const res = await api.post<ApiResponse<PacienteResponse>>('/pacientes', data);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PACIENTES_QUERY_KEY }),
  });
}

export function useUpdatePaciente() {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<PacienteResponse>, Error, { id: string; data: PacienteRequest }>({
    mutationFn: async ({ id, data }) => {
      const res = await api.put<ApiResponse<PacienteResponse>>(`/pacientes/${id}`, data);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PACIENTES_QUERY_KEY }),
  });
}

export function useDeletePaciente() {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<void>, Error, string>({
    mutationFn: async (id) => {
      const res = await api.delete<ApiResponse<void>>(`/pacientes/${id}`);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PACIENTES_QUERY_KEY }),
  });
}
