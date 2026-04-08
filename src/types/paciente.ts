import { Page } from './unidade';

export interface PacienteRequest {
  nome: string;
  sobrenome: string;
  dataNascimento: string; // Formato YYYY-MM-DD
  genero: string;
  documento: string; // CPF/RG
  email?: string;
  telefone?: string;
  seguroSaude?: string;
  numeroCarteiraSeguro?: string;
}

export interface PacienteResponse extends PacienteRequest {
  id: string;
  ativo: boolean;
}

export type PacientePage = Page<PacienteResponse>;
