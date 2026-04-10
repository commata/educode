import { apiClient } from '@/api/client';
import type {
  ExecutionResult,
  RunCodeRequest,
  Submission,
  SubmitCodeRequest,
} from '@/types/submission';

export async function runCode(payload: RunCodeRequest) {
  const { data } = await apiClient.post<ExecutionResult>('/api/submissions/run', payload);
  return data;
}

export async function submitCode(payload: SubmitCodeRequest) {
  const { data } = await apiClient.post<Submission>('/api/submissions/submit', payload);
  return data;
}

export async function getMySubmissions() {
  const { data } = await apiClient.get<Submission[]>('/api/submissions/my');
  return data;
}

export async function getSubmission(submissionId: number) {
  const { data } = await apiClient.get<Submission>(`/api/submissions/${submissionId}`);
  return data;
}
