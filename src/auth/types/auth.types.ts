// Tipos y enums para autenticación y roles

export const UserRole = {
  SUPER_USER: 1,
  SUPERVISOR: 2,
  ASESOR: 3,
  VIEWER: 4,
} as const;
export type UserRole = typeof UserRole[keyof typeof UserRole];

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  access_expires_at: number;
  refresh_expires_at: number;
}

export interface User {
  id: string;
  login: string;
  full_name: string;
  user_identify: number;
  profile_id: UserRole;
  email: string;
  menu: any[]; // Ajustar tipo cuando el backend lo defina
}

export interface LoginResponse extends User {
  auth: AuthTokens;
}
