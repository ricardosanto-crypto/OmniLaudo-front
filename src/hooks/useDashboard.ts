import { useQuery } from '@tanstack/react-query';


interface DashboardStats {
  pacientes: number;
  agendamentosHoje: number;
  examesPendentes: number;
  laudosFinalizados: number;
}

interface ChartData {
  name: string;
  exames: number;
}

interface PieData {
  name: string;
  value: number;
  color: string;
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async (): Promise<DashboardStats> => {
      // TODO: Substituir por endpoint real quando disponível
      // const response = await api.get<ApiResponse<DashboardStats>>('/dashboard/stats');
      // return response.data.data;

      // Dados simulados por enquanto
      return {
        pacientes: 1247,
        agendamentosHoje: 23,
        examesPendentes: 8,
        laudosFinalizados: 156
      };
    },
    refetchInterval: 30000, // Atualiza a cada 30 segundos
  });
}

export function useChartData() {
  return useQuery({
    queryKey: ['dashboard-chart'],
    queryFn: async (): Promise<ChartData[]> => {
      // TODO: Substituir por endpoint real
      return [
        { name: 'Jan', exames: 45 },
        { name: 'Fev', exames: 52 },
        { name: 'Mar', exames: 48 },
        { name: 'Abr', exames: 61 },
        { name: 'Mai', exames: 55 },
        { name: 'Jun', exames: 67 }
      ];
    },
  });
}

export function usePieData() {
  return useQuery({
    queryKey: ['dashboard-pie'],
    queryFn: async (): Promise<PieData[]> => {
      // TODO: Substituir por endpoint real
      return [
        { name: 'Ressonância', value: 35, color: '#3B82F6' },
        { name: 'Tomografia', value: 28, color: '#10B981' },
        { name: 'Ultrassom', value: 22, color: '#F59E0B' },
        { name: 'Raio-X', value: 15, color: '#EF4444' }
      ];
    },
  });
}