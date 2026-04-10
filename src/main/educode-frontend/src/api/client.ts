import axios from 'axios';
import { camelizeKeys, snakeCaseKeys } from '@/shared/lib/case';
import { useAuthStore } from '@/store/authStore';
import type { ApiErrorResponse, ApiResponse } from '@/types/common';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
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
      error.message ??
      '요청 처리 중 오류가 발생했습니다.';

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
