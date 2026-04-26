import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { ApiResponse } from '../types/api';

export interface DashboardStats {
  agendamentosHoje: number;
  examesEmEspera: number;
  backlogLaudos: number;
  laudadosHoje: number;
  canceladosHoje: number;
  historicoSemanal: {
    data: string;
    realizados: number;
    agendados: number;
  }[];
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async (): Promise<DashboardStats | null> => {
      const response = await api.get<ApiResponse<DashboardStats>>('/dashboard/me');
      return response.data ? response.data.data : null;
    },
    refetchInterval: 60000, // Atualiza a cada 1 minuto
  });
}