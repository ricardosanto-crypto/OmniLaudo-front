import { Page } from './api';

export interface ProcedimentoRequest {
  codigo: string;
  nome: string;
  descricao?: string;
  modalidade: string; // MRI, CT, RX, US, MG, DX
  duracaoEstimadaMinutos?: number;
  ativo?: boolean;
}

export interface ProcedimentoResponse extends ProcedimentoRequest {
  id: string;
  ativo: boolean;
  duracaoEstimadaMinutos: number;
}

export type ProcedimentoPage = Page<ProcedimentoResponse>;
