// Espelha o DTO java: com.omnilaudo.api.dto.unidade.UnidadeRequestDTO
export interface UnidadeRequest {
  nome: string;
  cnpj?: string;
  cep?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  telefone?: string;
}

// Espelha o DTO java: com.omnilaudo.api.dto.unidade.UnidadeResponseDTO
export interface UnidadeResponse {
  id: string;
  nome: string;
  cnpj: string | null;
  cep: string | null;
  logradouro: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  cidade: string | null;
  estado: string | null;
  telefone: string | null;
  ativo: boolean;
  criadoEm: string;
}
