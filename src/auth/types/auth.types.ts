// Tipos y enums para autenticación y roles
import type { MenuItem } from '../constants/menuByRole';

export const UserRole = {
  SUPER_USER: 1,
  SUPERVISOR: 3,
  ASESOR: 4,
  VIEWER: 5,
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
  menu: MenuItem[];
}

export interface LoginResponse extends User {
  auth: AuthTokens;
}
