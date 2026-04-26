import { toast } from "sonner";
import { ApiResponse, CampoErro } from "../types/api";
import { MESSAGES } from "../constants/messages";
import { UseFormSetError, FieldValues, Path } from "react-hook-form";

// Classe customizada para "furar" o bloqueio do Axios e chegar no formulário
export class FormValidationError extends Error {
  public erros: CampoErro[];
  constructor(erros: CampoErro[]) {
    super("Erro de validação");
    this.erros = erros;
  }
}

interface ApiErrorResponse {
  response?: {
    data: ApiResponse<unknown>;
    status: number;
  };
}

export function handleApiError(error: unknown) {
  const apiError = error as ApiErrorResponse;

  // 1. Erro de Rede (Server Down / Offline)
  if (!apiError.response) {
    toast.error(MESSAGES.ERROR.NETWORK);
    return;
  }

  const responseData = apiError.response.data;
  const status = apiError.response.status;

  // 2. Erros de Validação (HTTP 400 com payload do @Valid do Java)
  if (status === 400 && responseData.erros && responseData.erros.length > 0) {
    // Interrompe o fluxo normal jogando um erro que o Helper abaixo vai capturar.
    // Isso EVITA a chuva de toasts na tela.
    throw new FormValidationError(responseData.erros);
  }

  // 3. Erros de Negócio (RegraNegocioException)
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

// Helper para ser usado dentro do onSubmit dos componentes UI
export function applyFormErrors<T extends FieldValues>(error: unknown, setError: UseFormSetError<T>) {
  if (error instanceof FormValidationError) {
    error.erros.forEach((err) => {
      // Injeta o erro diretamente no campo do React Hook Form
      setError(err.campo as Path<T>, { type: "server", message: err.erro });
    });
    toast.warning(MESSAGES.ERROR.VALIDATION);
  } else {
    // Se não for erro de form, deixa o handleApiError comum se virar.
    handleApiError(error);
  }
}
