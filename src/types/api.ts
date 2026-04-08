// Espelha a classe java: com.omnilaudo.api.payload.ApiResponse.CampoErro
export interface CampoErro {
    campo: string;
    erro: string;
}

// Espelha a classe java: com.omnilaudo.api.payload.ApiResponse<T>
export interface ApiResponse<T = void> {
    data: T | null;
    message: string;
    type: 'success' | 'warn' | 'error';
    erros: CampoErro[] | null;
}