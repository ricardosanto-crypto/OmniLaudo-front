import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { ProcedimentoResponse } from '../types/procedimento';
import { toast } from 'sonner';

export const PROCEDIMENTOS_QUERY_KEY = ['procedimentos'];

// Dados mockados para modalidades enquanto o backend não retorna dados
const PROCEDIMENTOS_MOCK: Record<string, ProcedimentoResponse[]> = {
  MRI: [
    { id: '1', codigo: '32010094', nome: 'Ressonância Magnética de Crânio', modalidade: 'MRI', ativo: true, duracaoEstimadaMinutos: 30 },
    { id: '2', codigo: '32010108', nome: 'Ressonância Magnética de Coluna Cervical', modalidade: 'MRI', ativo: true, duracaoEstimadaMinutos: 35 },
    { id: '3', codigo: '32010116', nome: 'Ressonância Magnética de Coluna Torácica', modalidade: 'MRI', ativo: true, duracaoEstimadaMinutos: 35 },
  ],
  CT: [
    { id: '4', codigo: '32010213', nome: 'Tomografia Computadorizada de Crânio', modalidade: 'CT', ativo: true, duracaoEstimadaMinutos: 10 },
    { id: '5', codigo: '32010221', nome: 'Tomografia Computadorizada de Tórax', modalidade: 'CT', ativo: true, duracaoEstimadaMinutos: 15 },
  ],
  US: [
    { id: '6', codigo: '40010014', nome: 'Ultrassom de Abdômen Total', modalidade: 'US', ativo: true, duracaoEstimadaMinutos: 20 },
    { id: '7', codigo: '40010022', nome: 'Ultrassom de Pelve', modalidade: 'US', ativo: true, duracaoEstimadaMinutos: 15 },
    { id: '8', codigo: '40010030', nome: 'Ultrassom de Mama', modalidade: 'US', ativo: true, duracaoEstimadaMinutos: 25 },
  ],
  RX: [
    { id: '9', codigo: '31010011', nome: 'Radiografia de Tórax', modalidade: 'RX', ativo: true, duracaoEstimadaMinutos: 5 },
    { id: '10', codigo: '31010038', nome: 'Radiografia de Coluna Lombar', modalidade: 'RX', ativo: true, duracaoEstimadaMinutos: 10 },
  ],
  MG: [
    { id: '11', codigo: '33010010', nome: 'Mamografia Bilateral', modalidade: 'MG', ativo: true, duracaoEstimadaMinutos: 15 },
  ],
  DX: [
    { id: '12', codigo: '29010017', nome: 'Radiografia Digital', modalidade: 'DX', ativo: true, duracaoEstimadaMinutos: 5 },
  ],
};

/**
 * Hook para listar todos os procedimentos disponíveis
 */
export function useProcedimentos() {
  return useQuery({
    queryKey: [...PROCEDIMENTOS_QUERY_KEY, 'todos'],
    queryFn: async () => {
      try {
        const response = await api.get<ProcedimentoResponse[]>('/procedimentos/todos');
        return Array.isArray(response.data) ? response.data : [];
      } catch (error: any) {
        console.warn('Erro ao carregar procedimentos da API, usando dados mockados:', error);
        // Retorna todos os procedimentos mockados
        return Object.values(PROCEDIMENTOS_MOCK).flat();
      }
    },
    retry: 1,
  });
}

/**
 * Hook para buscar procedimentos filtrados por modalidade
 * @param modalidade - Modalidade desejada (MRI, CT, RX, US, MG, DX)
 */
export function useProcedimentosByModalidade(modalidade?: string) {
  return useQuery({
    queryKey: [...PROCEDIMENTOS_QUERY_KEY, 'modalidade', modalidade],
    queryFn: async () => {
      if (!modalidade) return [];
      try {
        const response = await api.get<ProcedimentoResponse[]>(`/procedimentos/modalidade/${modalidade}`);
        return Array.isArray(response.data) ? response.data : [];
      } catch (error: any) {
        console.warn(`Erro ao carregar procedimentos da modalidade ${modalidade}, usando dados mockados:`, error);
        // Retorna procedimentos mockados para a modalidade
        return PROCEDIMENTOS_MOCK[modalidade] || [];
      }
    },
    enabled: !!modalidade,
    retry: 1,
  });
}

/**
 * Hook para buscar um procedimento específico por ID
 * @param id - ID do procedimento
 */
export function useProcedimentoById(id?: string) {
  return useQuery({
    queryKey: [...PROCEDIMENTOS_QUERY_KEY, 'id', id],
    queryFn: async () => {
      if (!id) return null;
      try {
        const response = await api.get<ProcedimentoResponse>(`/procedimentos/${id}`);
        return response.data;
      } catch (error: any) {
        console.error(`Erro ao carregar procedimento ${id}:`, error);
        return null;
      }
    },
    enabled: !!id,
    retry: 0,
  });
}

/**
 * Hook para buscar um procedimento específico por código TUSS
 * @param codigo - Código TUSS do procedimento
 */
export function useProcedimentoByCodigo(codigo?: string) {
  return useQuery({
    queryKey: [...PROCEDIMENTOS_QUERY_KEY, 'codigo', codigo],
    queryFn: async () => {
      if (!codigo) return null;
      try {
        const response = await api.get<ProcedimentoResponse>(`/procedimentos/codigo/${codigo}`);
        return response.data;
      } catch (error: any) {
        console.error(`Erro ao carregar procedimento ${codigo}:`, error);
        return null;
      }
    },
    enabled: !!codigo,
    retry: 0,
  });
}
