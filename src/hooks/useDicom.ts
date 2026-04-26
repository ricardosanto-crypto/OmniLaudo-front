import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

// 1. Busca qual EstudoDicom pertence a este Agendamento
export function useEstudoByAgendamento(agendamentoId: string | undefined) {
  return useQuery({
    queryKey: ['estudo-dicom', agendamentoId],
    queryFn: async () => {
      if (!agendamentoId) return null;
      // Nota: Ajuste esta rota caso o seu backend retorne o estudo de forma diferente
      const response = await api.get(`/dicom/estudos/por-agendamento/${agendamentoId}`);
      return response.data.data; // Retorna o EstudoDicomResponseDTO
    },
    enabled: !!agendamentoId,
  });
}

export interface OrthancSeries {
  id: string;
  descricao: string;
  modalidade: string;
  totalImagens: number;
  instancias: string[];
  previewUrl: string;
}

interface OrthancSerieResponse {
  ID: string;
  Instances: string[];
  MainDicomTags: {
    SeriesDescription?: string;
    Modality?: string;
  };
}

// 2. Busca as Séries de um Estudo direto do Orthanc (via nosso Proxy)
export function useOrthancSeries(idOrthanc: string | undefined) {
  return useQuery<OrthancSeries[]>({
    queryKey: ['orthanc-series', idOrthanc],
    queryFn: async () => {
      if (!idOrthanc) return [];
      const response = await api.get<OrthancSerieResponse[]>(`/dicom/proxy/estudo/${idOrthanc}/series`);
      
      const seriesOrthanc = response.data;
      
      return seriesOrthanc.map((serie, index) => {
        const middleInstanceIndex = Math.floor((serie.Instances?.length || 0) / 2);
        const previewInstanceId = serie.Instances?.[middleInstanceIndex];

        return {
          id: serie.ID,
          descricao: serie.MainDicomTags?.SeriesDescription || `Série ${index + 1}`,
          modalidade: serie.MainDicomTags?.Modality || 'UN',
          totalImagens: serie.Instances?.length || 0,
          instancias: serie.Instances || [],
          previewUrl: `${api.defaults.baseURL}/dicom/proxy/instancia/${previewInstanceId}/preview`,
        };
      });
    },
    enabled: !!idOrthanc,
  });
}
