import { apiClient } from '@/api/client';
import type {
  ExecutionResult,
  RunCodeRequest,
  Submission,
  SubmitResult,
  SubmitCodeRequest,
} from '@/types/submission';

interface BackendRunResponse {
  stdout?: string | null;
  stderr?: string | null;
  compileOutput?: string | null;
  judgeStatus: string;
  mappedStatus: ExecutionResult['status'];
}

interface BackendSubmitResponse {
  submissionId: number;
  status: SubmitResult['status'];
  passedCases: number;
  totalCases: number;
  errorMessage?: string | null;
}

interface BackendSubmissionSummary {
  submissionId: number;
  assignmentId: number;
  problemTitle: string;
  classroomName: string;
  status: Submission['status'];
  passedCases: number;
  totalCases: number;
  submittedAt: string;
}

interface BackendSubmissionDetail {
  submissionId: number;
  assignmentId: number;
  studentId: number;
  studentName: string;
  classroomName: string;
  problemTitle: string;
  language: Submission['language'];
  code: string;
  status: Submission['status'];
  passedCases: number;
  totalCases: number;
  errorMessage?: string | null;
  submittedAt: string;
}

function toExecutionResult(payload: BackendRunResponse): ExecutionResult {
  return {
    status: payload.mappedStatus,
    stdout: payload.stdout,
    stderr: payload.stderr,
    compileOutput: payload.compileOutput,
    judgeStatus: payload.judgeStatus,
  };
}

function toSubmission(payload: BackendSubmissionSummary | BackendSubmissionDetail): Submission {
  return {
    submissionId: payload.submissionId,
    assignmentId: payload.assignmentId,
    studentId: 'studentId' in payload ? payload.studentId : 0,
    studentName: 'studentName' in payload ? payload.studentName : '',
    language: ('language' in payload ? payload.language : 'python') as Submission['language'],
    code: 'code' in payload ? payload.code : '',
    status: payload.status,
    passedCases: payload.passedCases,
    totalCases: payload.totalCases,
    errorMessage: 'errorMessage' in payload ? payload.errorMessage : null,
    submittedAt: payload.submittedAt,
  };
}

export async function runCode(payload: RunCodeRequest) {
  const { data } = await apiClient.post<BackendRunResponse>('/api/submissions/run', payload);
  return toExecutionResult(data);
}

export async function submitCode(payload: SubmitCodeRequest) {
  const { data } = await apiClient.post<BackendSubmitResponse>('/api/submissions/submit', payload);
  return {
    submissionId: data.submissionId,
    assignmentId: payload.assignmentId,
    status: data.status,
    passedCases: data.passedCases,
    totalCases: data.totalCases,
    errorMessage: data.errorMessage,
  } satisfies SubmitResult;
}

export async function getMySubmissions() {
  const { data } = await apiClient.get<BackendSubmissionSummary[]>('/api/submissions/my');
  return data.map(toSubmission);
}

export async function getSubmission(submissionId: number) {
  const { data } = await apiClient.get<BackendSubmissionDetail>(`/api/submissions/${submissionId}`);
  return toSubmission(data);
}
