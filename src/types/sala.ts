import { Page } from './api';

export interface SalaRequest {
  nome: string;
  unidadeId: string;
}

export interface SalaResponse {
  id: string;
  nome: string;
  unidadeId: string;
  unidadeNome: string;
  ativo: boolean;
}

export type SalaPage = Page<SalaResponse>;
