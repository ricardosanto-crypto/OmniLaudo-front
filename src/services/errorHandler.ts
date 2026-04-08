// src/services/errorHandler.ts
import { toast } from "sonner";
import { ApiResponse } from "../types/api";
import { MESSAGES } from "../constants/messages";

export function handleApiError(error: any) {
  // 1. Erro de Rede (Server Down / Offline)
  if (!error.response) {
    toast.error(MESSAGES.ERROR.NETWORK);
    return;
  }

  const responseData = error.response.data as ApiResponse<any>;
  const status = error.response.status;

  // 2. Erros de Validação (HTTP 400) - O padrão que o SGP usa muito bem
  if (status === 400 && responseData.erros) {
    responseData.erros.forEach((err) => {
      // Mostra cada erro de campo vindo do Java (@Valid)
      toast.error(`${err.campo}: ${err.erro}`, {
        icon: "⚠️",
      });
    });
    return;
  }

  // 3. Erros de Negócio (Mensagem vinda do back-end)
  if (responseData.message) {
    const type = responseData.type || 'error';
    toast[type === 'warn' ? 'warning' : 'error'](responseData.message);
    return;
  }

  // 4. Fallback por Status Code
  switch (status) {
    case 401: toast.error(MESSAGES.ERROR.UNAUTHORIZED); break;
    case 403: toast.error(MESSAGES.ERROR.FORBIDDEN); break;
    case 500: toast.error("Erro interno no servidor. Avise o suporte."); break;
    default: toast.error(MESSAGES.ERROR.GENERIC);
  }
}
