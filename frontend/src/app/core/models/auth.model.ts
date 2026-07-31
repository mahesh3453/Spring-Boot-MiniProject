export interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'FACULTY' | 'STUDENT';
  avatarUrl?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface LoginResponse {
  token: string;
  user: User;
}
