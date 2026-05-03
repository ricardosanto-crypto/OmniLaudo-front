import { Page } from './api';

export interface ModalidadeRequest {
  sigla: string;
  nome: string;
  corHex?: string;
}

export interface ModalidadeResponse {
  id: string;
  sigla: string;
  nome: string;
  corHex?: string;
  ativo: boolean;
}

export type ModalidadePage = Page<ModalidadeResponse>;
