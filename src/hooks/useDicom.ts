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

// 2. Busca as Séries de um Estudo direto do Orthanc (via nosso Proxy)
export function useOrthancSeries(idOrthanc: string | undefined) {
  return useQuery({
    queryKey: ['orthanc-series', idOrthanc],
    queryFn: async () => {
      if (!idOrthanc) return [];
      const response = await api.get(`/dicom/proxy/estudo/${idOrthanc}/series`);
      
      // O Orthanc retorna um array de objetos contendo as Séries e suas Instâncias (Imagens)
      // Vamos mapear isso para o formato que a nossa Sidebar espera
      const seriesOrthanc = response.data;
      
      return seriesOrthanc.map((serie: any, index: number) => {
        // Pega a imagem do meio da série para ser o Thumbnail (Preview)
        const middleInstanceIndex = Math.floor(serie.Instances.length / 2);
        const previewInstanceId = serie.Instances[middleInstanceIndex];

        return {
          id: serie.ID, // ID da série no Orthanc
          descricao: serie.MainDicomTags.SeriesDescription || `Série ${index + 1}`,
          modalidade: serie.MainDicomTags.Modality || 'UN',
          totalImagens: serie.Instances.length,
          instancias: serie.Instances, // Lista de IDs das imagens dessa série
          previewUrl: `${api.defaults.baseURL}/dicom/proxy/instancia/${previewInstanceId}/preview`,
        };
      });
    },
    enabled: !!idOrthanc,
  });
}
