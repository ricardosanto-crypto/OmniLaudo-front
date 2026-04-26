// Espelha o DTO java: com.omnilaudo.api.dto.unidade.UnidadeRequestDTO
export interface UnidadeRequest {
  nome: string;
  cnpj?: string;
  endereco?: string;
  telefone?: string;
}

// Espelha o DTO java: com.omnilaudo.api.dto.unidade.UnidadeResponseDTO
export interface UnidadeResponse {
  id: string;
  nome: string;
  cnpj: string | null;
  endereco: string | null;
  telefone: string | null;
  ativo: boolean;
  criadoEm: string;
}
