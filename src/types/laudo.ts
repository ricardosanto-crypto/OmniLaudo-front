export interface LaudoRequestDTO {
  agendamentoId: string;
  medicoId: string;
  achados: string;
  impressao: string;
  recomendacoes?: string;
}

export interface LaudoResponseDTO {
  id: string;
  agendamentoId: string;
  medicoId: string;
  medicoNome?: string;
  achados: string;
  impressao: string;
  recomendacoes?: string;
  status: string;
  dataCriacao: string;
  dataFinalizacao?: string;
}

export interface AssinaturaResponse {
  id: string;
  medicoId: string;
  nomeUsuario: string; // Alinhado com a UI e o DTO do Spring
  perfilUsuario: string; // Alinhado com a UI e o DTO do Spring
  dataAssinatura: string;
  tipo: string;
  notas?: string;
}
