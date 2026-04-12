import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '../services/api';
import { AGENDAMENTOS_KEY } from './useAgendamentos';

export interface UploadDicomPayload {
  accessionNumber: string;
  patientId: string;
  patientName: string;
  examType?: string;
  modality?: string;
  description?: string;
  files: File[];
}

/**
 * TEMPORÁRIO PARA TESTES: Envia os arquivos DICOM para o proxy no OmniLaudo-api,
 * que por sua vez encaminha diretamente para o servidor Orthanc.
 */
async function uploadDicomToProxy(data: UploadDicomPayload) {
  const formData = new FormData();
  
  // O endpoint no DicomProxyControle espera @RequestPart("files") Flux<FilePart>
  data.files.forEach(file => {
    formData.append('files', file);
  });

  const response = await api.post('/dicom/proxy/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}

export function useUploadDicom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadDicomToProxy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AGENDAMENTOS_KEY });
      toast.success('Upload DICOM (Proxy Orthanc) enviado com sucesso. Aguarde a sincronização (~30s).');
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Erro desconhecido ao enviar DICOM.';
      toast.error(`Falha no upload via proxy: ${message}`);
    },
  });
}
