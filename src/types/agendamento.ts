import { Page } from './unidade';

export type StatusAgendamento = 'AGENDADO' | 'EM_ATENDIMENTO' | 'EXECUTANDO' | 'REALIZADO' | 'CANCELADO';

export interface AgendamentoRequest {
  pacienteId: string;
  equipamentoId: string;
  dataHoraAgendada: string; // ISO 8601
  procedimentoNome: string;
  procedimentoCodigo: string;
  duracaoEstimadaMinutos?: number;
  medicoId?: string;
  pedidoMedicoId?: string;
}

export interface AgendamentoResponse {
  id: string;
  pacienteId: string;
  pacienteNome: string;
  equipamentoId: string;
  equipamentoNome: string;
  equipamentoModalidade: string;
  status: StatusAgendamento;
  procedimentoNome: string;
  procedimentoCodigo: string;
  dataHoraAgendada: string;
  duracaoEstimadaMinutos: number;
  accessionNumber: string; // Gerado pelo Back para o DICOM
}

export type AgendamentoPage = Page<AgendamentoResponse>;
