// Espelha o enum java: com.omnilaudo.api.util.enums.Role
export type Role = 'SUPERADMIN' | 'SUPORTE' | 'ADMIN' | 'MEDICO' | 'TECNOLOGO' | 'ATENDENTE';

export interface AuthUser {
    id: string;
    nome: string;
    email: string;
    roles: Role[];
    unidadesIds: string[];
}

// Espelha o DTO java: com.omnilaudo.api.dto.usuario.TokenResponseDTO
export interface TokenResponse {
    token: string;
    tipo: string;
}