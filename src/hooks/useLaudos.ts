import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { ApiResponse } from '../types/api';
import { toast } from 'sonner';

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

export function useLaudoByAgendamento(agendamentoId: string | undefined) {
  return useQuery({
    queryKey: ['laudo', agendamentoId],
    queryFn: async () => {
      if (!agendamentoId) return null;
      const res = await api.get(`/laudos/por-agendamento/${agendamentoId}`);
      return res.data.data;
    },
    enabled: !!agendamentoId,
  });
}

export function useAssinaturas(agendamentoId: string | undefined) {
  return useQuery({
    queryKey: ['assinaturas', agendamentoId],
    queryFn: async () => {
      if (!agendamentoId) return [];
      const res = await api.get(`/laudos/assinaturas/${agendamentoId}`);
      return res.data.data || [];
    },
    enabled: !!agendamentoId,
  });
}

export function useSalvarLaudo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { agendamentoId: string; medicoId: string; achados: string; impressao: string; recomendacoes?: string }) => {
      const res = await api.post('/laudos/salvar', data);
      return res.data;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['laudo', vars.agendamentoId] });
    },
  });
}

export function useFinalizarLaudo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.post(`/laudos/${id}/finalizar`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['laudo'] });
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] });
      queryClient.invalidateQueries({ queryKey: ['assinaturas'] });
    },
  });
}

export function useAssinarTecnica() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (laudoId: string) => api.post(`/laudos/${laudoId}/assinar-tecnica`),
    onSuccess: (response: any) => {
      qc.invalidateQueries({ queryKey: ['laudo'] });
      qc.invalidateQueries({ queryKey: ['assinaturas'] });
      toast.success(response.data?.message || 'Assinatura técnica registrada!');
    },
  });
}

export function useHomologar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (laudoId: string) => api.post(`/laudos/${laudoId}/homologar`),
    onSuccess: (response: any) => {
      qc.invalidateQueries({ queryKey: ['laudo'] });
      qc.invalidateQueries({ queryKey: ['agendamentos'] });
      qc.invalidateQueries({ queryKey: ['assinaturas'] });
      toast.success(response.data?.message || 'Laudo homologado e assinado com sucesso!');
    },
  });
}

