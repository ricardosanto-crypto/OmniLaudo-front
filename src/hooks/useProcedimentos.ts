import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { ApiResponse } from '../types/api';
import { ProcedimentoRequest, ProcedimentoResponse } from '../types/procedimento';
import { toast } from 'sonner';

export const PROCEDIMENTOS_QUERY_KEY = ['procedimentos'];

/**
 * Hook para listar todos os procedimentos disponíveis
 */
export function useProcedimentos(page = 0, size = 100) {
  return useQuery({
    queryKey: [...PROCEDIMENTOS_QUERY_KEY, 'todos', page, size],
    queryFn: async (): Promise<ProcedimentoResponse[]> => {
      const response = await api.get<ApiResponse<ProcedimentoResponse[]>>('/procedimentos/todos');
      return response.data.data || [];
    },
  });
}

/**
 * Hook para buscar procedimentos filtrados por modalidade
 */
export function useProcedimentosByModalidade(modalidade?: string) {
  return useQuery({
    queryKey: [...PROCEDIMENTOS_QUERY_KEY, 'modalidade', modalidade],
    queryFn: async (): Promise<ProcedimentoResponse[]> => {
      if (!modalidade) return [];
      const response = await api.get<ApiResponse<ProcedimentoResponse[]>>(`/procedimentos/modalidade/${modalidade}`);
      return response.data.data || [];
    },
    enabled: !!modalidade,
  });
}

/**
 * Hook para buscar um procedimento específico por ID
 */
export function useProcedimentoById(id?: string) {
  return useQuery({
    queryKey: [...PROCEDIMENTOS_QUERY_KEY, 'id', id],
    queryFn: async (): Promise<ProcedimentoResponse | null> => {
      if (!id) return null;
      const response = await api.get<ApiResponse<ProcedimentoResponse>>(`/procedimentos/${id}`);
      return response.data.data || null;
    },
    enabled: !!id,
  });
}

/**
 * Hook para buscar um procedimento específico por código TUSS
 */
export function useProcedimentoByCodigo(codigo?: string) {
  return useQuery({
    queryKey: [...PROCEDIMENTOS_QUERY_KEY, 'codigo', codigo],
    queryFn: async (): Promise<ProcedimentoResponse | null> => {
      if (!codigo) return null;
      const response = await api.get<ApiResponse<ProcedimentoResponse>>(`/procedimentos/codigo/${codigo}`);
      return response.data.data || null;
    },
    enabled: !!codigo,
  });
}

/**
 * Hook para criar um novo procedimento
 */
export function useCreateProcedimento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ProcedimentoRequest) => {
      const response = await api.post<ApiResponse<ProcedimentoResponse>>('/procedimentos', data);
      return response.data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: PROCEDIMENTOS_QUERY_KEY });
      toast.success(response.message || 'Procedimento criado com sucesso');
    },
    onError: (error: unknown) => {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Erro ao criar procedimento';
      toast.error(message);
    },
  });
}

/**
 * Hook para atualizar um procedimento existente
 */
export function useUpdateProcedimento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ProcedimentoRequest }) => {
      const response = await api.put<ApiResponse<ProcedimentoResponse>>(`/procedimentos/${id}`, data);
      return response.data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: PROCEDIMENTOS_QUERY_KEY });
      toast.success(response.message || 'Procedimento atualizado com sucesso');
    },
    onError: (error: unknown) => {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Erro ao atualizar procedimento';
      toast.error(message);
    },
  });
}

/**
 * Hook para inativar/excluir um procedimento
 */
export function useDeleteProcedimento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete<ApiResponse<void>>(`/procedimentos/${id}`);
      return response.data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: PROCEDIMENTOS_QUERY_KEY });
      toast.success(response.message || 'Procedimento inativado com sucesso');
    },
    onError: (error: unknown) => {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Erro ao inativar procedimento';
      toast.error(message);
    },
  });
}
