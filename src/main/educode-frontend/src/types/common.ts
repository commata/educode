export interface ApiErrorResponse {
  message: string;
  status?: number;
  fieldErrors?: Record<string, string>;
}

export interface ApiResponse<T> {
  success: boolean;
  code: string;
  message: string;
  data: T;
}

export interface ApiListResponse<T> {
  items: T[];
}
