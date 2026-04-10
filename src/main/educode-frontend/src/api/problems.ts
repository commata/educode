import { apiClient } from '@/api/client';
import type {
  CreateProblemRequest,
  Problem,
  UpdateProblemRequest,
} from '@/types/problem';

export async function createProblem(payload: CreateProblemRequest) {
  const { data } = await apiClient.post<Problem>('/api/problems', payload);
  return data;
}

export async function getMyProblems() {
  const { data } = await apiClient.get<Problem[]>('/api/problems/my');
  return data;
}

export async function getProblem(problemId: number) {
  const { data } = await apiClient.get<Problem>(`/api/problems/${problemId}`);
  return data;
}

export async function updateProblem(problemId: number, payload: UpdateProblemRequest) {
  const { data } = await apiClient.patch<Problem>(`/api/problems/${problemId}`, payload);
  return data;
}

export async function deleteProblem(problemId: number) {
  await apiClient.delete(`/api/problems/${problemId}`);
}
