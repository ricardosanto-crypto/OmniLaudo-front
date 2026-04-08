import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AGENDAMENTOS_KEY } from './useAgendamentos';

export interface UploadDicomPayload {
  accessionNumber: string;
  patientId: string;
  patientName: string;
  examType?: string;
  modality?: string;
  description?: string;
  file: File;
}

const mockModalityBaseUrl = import.meta.env.VITE_MOCK_MODALITY_URL || 'http://localhost:8081/api/v1';

async function uploadDicomToMockModality(data: UploadDicomPayload) {
  const formData = new FormData();
  formData.append('accession_number', data.accessionNumber);
  formData.append('patient_id', data.patientId.toString());
  formData.append('patient_name', data.patientName);

  if (data.examType) {
    formData.append('exam_type', data.examType);
  }
  if (data.modality) {
    formData.append('modality', data.modality);
  }
  if (data.description) {
    formData.append('description', data.description);
  }

  formData.append('file', data.file);

  const response = await axios.post(`${mockModalityBaseUrl}/exams/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}

export function useUploadDicom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadDicomToMockModality,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AGENDAMENTOS_KEY });
      toast.success('Upload de DICOM enviado com sucesso.');
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Erro desconhecido ao enviar DICOM.';
      toast.error(`Falha no upload: ${message}`);
    },
  });
}
