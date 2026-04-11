import axios from 'axios';
import { camelizeKeys, snakeCaseKeys } from '@/shared/lib/case';
import { useAuthStore } from '@/store/authStore';
import type { ApiErrorResponse, ApiResponse } from '@/types/common';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.data && !(config.data instanceof FormData)) {
    config.data = snakeCaseKeys(config.data);
  }

  if (config.params) {
    config.params = snakeCaseKeys(config.params);
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    const payload = camelizeKeys(response.data) as ApiResponse<unknown> | unknown;

    if (
      payload &&
      typeof payload === 'object' &&
      'success' in payload &&
      'data' in payload
    ) {
      response.data = (payload as ApiResponse<unknown>).data;
    } else {
      response.data = payload;
    }

    return response;
  },
  (error) => {
    const status = error.response?.status as number | undefined;
    const responseData = camelizeKeys(error.response?.data) as
      | ApiResponse<Record<string, string> | null>
      | undefined;

    const message =
      responseData?.message ??
      (status ? `요청 실패 (${status})` : '서버에 연결할 수 없습니다. 백엔드 실행과 API 주소를 확인하세요.');

    if (status === 401) {
      useAuthStore.getState().clearAuth();
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }

    const normalizedError: ApiErrorResponse = {
      message,
      status,
      fieldErrors: responseData?.data ?? undefined,
    };

    return Promise.reject(normalizedError);
  },
);