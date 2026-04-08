// src/constants/messages.ts
export const MESSAGES = {
  ERROR: {
    GENERIC: "Ocorreu um erro inesperado. Tente novamente.",
    NETWORK: "Sem conexão com o servidor. Verifique sua internet.",
    UNAUTHORIZED: "Sessão expirada. Por favor, faça login novamente.",
    FORBIDDEN: "Você não tem permissão para realizar esta ação.",
    VALIDATION: "Existem erros de preenchimento no formulário.",
  },
  SUCCESS: {
    GENERIC: "Operação realizada com sucesso!",
    SAVED: "Dados salvos com sucesso.",
    DELETED: "Registro removido com sucesso.",
    FINALIZED: "Exame finalizado e assinado digitalmente!",
    TEMPLATE_APPLIED: "Modelo de laudo aplicado com sucesso!",
  },
  AUTH: {
    INVALID_CREDENTIALS: "E-mail ou senha incorretos.",
  },
  // Chaves específicas que batem com o seu back-end
  CLINIC: {
    EQUIPMENT_UNAVAILABLE: "O equipamento selecionado está em manutenção.",
    SCHEDULE_CONFLICT: "Já existe um exame agendado para este horário.",
  }
};
