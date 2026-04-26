import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { ApiResponse } from '../types/api';
import { LaudoRequestDTO, LaudoResponseDTO, AssinaturaResponse } from '../types/laudo';

export function useModelosLaudo(codigoProcedimento?: string) {
  return useQuery({
    queryKey: ['modelos-laudo', codigoProcedimento],
    queryFn: async () => {
      const url = codigoProcedimento 
        ? `/modelos-laudo/por-procedimento/${codigoProcedimento}` 
        : '/modelos-laudo';
      const response = await api.get<ApiResponse<unknown[]>>(url);
      return response.data.data;
    },
  });
}

export function useLaudoByAgendamento(agendamentoId: string | undefined) {
  return useQuery({
    queryKey: ['laudo', agendamentoId],
    queryFn: async (): Promise<LaudoResponseDTO | null> => {
      if (!agendamentoId) return null;
      const res = await api.get<ApiResponse<LaudoResponseDTO>>(`/laudos/por-agendamento/${agendamentoId}`);
      return res.data.data;
    },
    enabled: !!agendamentoId,
  });
}

export function useAssinaturas(agendamentoId: string | undefined) {
  return useQuery({
    queryKey: ['assinaturas', agendamentoId],
    queryFn: async (): Promise<AssinaturaResponse[]> => {
      if (!agendamentoId) return [];
      const res = await api.get<ApiResponse<AssinaturaResponse[]>>(`/laudos/assinaturas/${agendamentoId}`);
      return res.data.data || [];
    },
    enabled: !!agendamentoId,
  });
}

export function useSalvarLaudo() {
  const qc = useQueryClient();
  return useMutation<ApiResponse<LaudoResponseDTO>, Error, LaudoRequestDTO>({
    mutationFn: async (data) => {
      const res = await api.post<ApiResponse<LaudoResponseDTO>>('/laudos/salvar', data);
      return res.data;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['laudo', vars.agendamentoId] });
    },
  });
}

export function useFinalizarLaudo() {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<LaudoResponseDTO>, Error, string>({
    mutationFn: async (id) => {
      const res = await api.post<ApiResponse<LaudoResponseDTO>>(`/laudos/${id}/finalizar`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['laudo'] });
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] });
      queryClient.invalidateQueries({ queryKey: ['assinaturas'] });
    },
  });
}

export function useAssinarTecnica() {
  const qc = useQueryClient();
  return useMutation<ApiResponse<LaudoResponseDTO>, Error, string>({
    mutationFn: async (laudoId) => {
      const response = await api.post<ApiResponse<LaudoResponseDTO>>(`/laudos/${laudoId}/assinar-tecnica`);
      return response.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['laudo'] });
      qc.invalidateQueries({ queryKey: ['assinaturas'] });
    },
  });
}

export function useHomologar() {
  const qc = useQueryClient();
  return useMutation<ApiResponse<LaudoResponseDTO>, Error, string>({
    mutationFn: async (laudoId) => {
      const response = await api.post<ApiResponse<LaudoResponseDTO>>(`/laudos/${laudoId}/homologar`);
      return response.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['laudo'] });
      qc.invalidateQueries({ queryKey: ['agendamentos'] });
      qc.invalidateQueries({ queryKey: ['assinaturas'] });
    },
  });
}
