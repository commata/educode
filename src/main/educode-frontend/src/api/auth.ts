import { apiClient } from '@/api/client';
import type {
  AuthResponse,
  LoginRequest,
  SignupRequest,
  UpdateMeRequest,
  User,
} from '@/types/auth';

interface BackendAuthResponse {
  userId: number;
  email: string;
  name: string;
  role: User['role'];
  accessToken: string;
}

function toAuthResponse(payload: BackendAuthResponse): AuthResponse {
  return {
    accessToken: payload.accessToken,
    user: {
      id: payload.userId,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    },
  };
}

export async function signup(payload: SignupRequest) {
  const { data } = await apiClient.post<BackendAuthResponse>('/api/auth/signup', payload);
  return toAuthResponse(data);
}

export async function login(payload: LoginRequest) {
  const { data } = await apiClient.post<BackendAuthResponse>('/api/auth/login', payload);
  return toAuthResponse(data);
}

export async function getMe() {
  const { data } = await apiClient.get<User>('/api/users/me');
  return data;
}

export async function updateMe(payload: UpdateMeRequest) {
  const { data } = await apiClient.patch<User>('/api/users/me', payload);
  return data;
}
