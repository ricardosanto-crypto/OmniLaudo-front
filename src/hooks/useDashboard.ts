import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { ApiResponse } from '../types/api';
import { kpiData, throughputData, filaModalidadeData, statusUnidadesData, alertasData, eventosData } from '../pages/Dashboard/mockData';

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
  // New endpoint data structures (mocked for now)
  kpis: typeof kpiData;
  throughput: typeof throughputData;
  filaModalidade: typeof filaModalidadeData;
  statusUnidades: typeof statusUnidadesData;
  alertas: typeof alertasData;
  eventos: typeof eventosData;
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async (): Promise<DashboardStats | null> => {
      try {
        const response = await api.get<ApiResponse<DashboardStats>>('/dashboard/me');
        const data = response.data ? response.data.data : null;
        
        if (data) {
          // Merge with mock data for the new dashboard fields until backend is ready
          return {
            ...data,
            kpis: kpiData,
            throughput: throughputData,
            filaModalidade: filaModalidadeData,
            statusUnidades: statusUnidadesData,
            alertas: alertasData,
            eventos: eventosData,
          };
        }
        return null;
      } catch (error) {
        console.warn("Failed to fetch dashboard stats from API, returning full mock data");
        // Fallback to full mock if API fails
        return {
          agendamentosHoje: 1248,
          examesEmEspera: 42,
          backlogLaudos: 315,
          laudadosHoje: 180,
          canceladosHoje: 24,
          historicoSemanal: [],
          kpis: kpiData,
          throughput: throughputData,
          filaModalidade: filaModalidadeData,
          statusUnidades: statusUnidadesData,
          alertas: alertasData,
          eventos: eventosData,
        };
      }
    },
    refetchInterval: 60000, // Atualiza a cada 1 minuto
  });
}