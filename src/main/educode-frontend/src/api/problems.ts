import { apiClient } from '@/api/client';
import type {
  CreateProblemRequest,
  Problem,
  UpdateProblemRequest,
} from '@/types/problem';

interface BackendTestCase {
  id?: number;
  inputData: string;
  expectedOutput: string;
  isHidden: boolean;
}

interface BackendProblem {
  id: number;
  title: string;
  content: string;
  timeLimit: number;
  memoryLimit: number;
  educatorId: number;
  createdAt: string;
  testCases: BackendTestCase[];
}

interface BackendProblemRequest {
  title: string;
  content: string;
  timeLimit: number;
  memoryLimit: number;
  testCases: BackendTestCase[];
}

function toFrontendProblem(payload: BackendProblem): Problem {
  return {
    id: payload.id,
    title: payload.title,
    descriptionMarkdown: payload.content,
    timeLimitMs: payload.timeLimit,
    memoryLimitMb: payload.memoryLimit,
    createdAt: payload.createdAt,
    updatedAt: payload.createdAt,
    testCases: payload.testCases.map((testCase) => ({
      input: testCase.inputData,
      expectedOutput: testCase.expectedOutput,
      isHidden: testCase.isHidden,
    })),
  };
}

export async function createProblem(payload: CreateProblemRequest) {
  const { data } = await apiClient.post<BackendProblem, { data: BackendProblem }, BackendProblemRequest>(
    '/api/problems',
    payload,
  );
  return toFrontendProblem(data);
}

export async function getMyProblems() {
  const { data } = await apiClient.get<BackendProblem[]>('/api/problems/my');
  return data.map(toFrontendProblem);
}

export async function getProblem(problemId: number) {
  const { data } = await apiClient.get<BackendProblem>(`/api/problems/${problemId}`);
  return toFrontendProblem(data);
}

export async function updateProblem(problemId: number, payload: UpdateProblemRequest) {
  const { data } = await apiClient.patch<BackendProblem, { data: BackendProblem }, BackendProblemRequest>(
    `/api/problems/${problemId}`,
    payload,
  );
  return toFrontendProblem(data);
}

export async function deleteProblem(problemId: number) {
  await apiClient.delete(`/api/problems/${problemId}`);
}
