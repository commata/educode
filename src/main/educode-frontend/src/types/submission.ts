import type { EditorLanguage } from '@/shared/constants/languages';

export type JudgeStatus = 'PASS' | 'FAIL' | 'ERROR' | 'RUNNING' | 'PENDING' | 'NOT_SUBMITTED';

export interface ExecutionResult {
  status: JudgeStatus;
  passedCount: number;
  totalCount: number;
  stdout?: string | null;
  stderr?: string | null;
  compileError?: string | null;
  systemErrorLog?: string | null;
  timeMs?: number | null;
  memoryKb?: number | null;
}

export interface RunCodeRequest {
  assignmentId: number;
  language: EditorLanguage;
  sourceCode: string;
  customInput: string;
}

export interface SubmitCodeRequest {
  assignmentId: number;
  language: EditorLanguage;
  sourceCode: string;
}

export interface Submission {
  id: number;
  assignmentId: number;
  studentId: number;
  studentName: string;
  language: EditorLanguage;
  sourceCode: string;
  status: JudgeStatus;
  passedCount: number;
  totalCount: number;
  stdout?: string | null;
  stderr?: string | null;
  compileError?: string | null;
  systemErrorLog?: string | null;
  submittedAt: string;
}

export interface SubmissionStatusItem {
  submissionId: number | null;
  studentId: number;
  studentName: string;
  status: JudgeStatus;
  resultSummary: string;
  submittedAt: string | null;
}
