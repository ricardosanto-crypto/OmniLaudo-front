import { Page } from './api';

export interface ProcedimentoRequest {
  codigo: string;
  nome: string;
  descricao?: string;
  modalidadeId: string;
  duracaoEstimadaMinutos?: number;
  ativo?: boolean;
}

export interface ProcedimentoResponse {
  id: string;
  codigo: string;
  nome: string;
  descricao?: string;
  modalidadeId: string;
  modalidadeSigla: string;
  duracaoEstimadaMinutos: number;
  ativo: boolean;
  criadoEm?: string;
  atualizadoEm?: string;
}

export type ProcedimentoPage = Page<ProcedimentoResponse>;
