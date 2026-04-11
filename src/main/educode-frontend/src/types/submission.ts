import type { EditorLanguage } from '@/shared/constants/languages';

export type JudgeStatus = 'PASS' | 'FAIL' | 'ERROR' | 'RUNNING' | 'PENDING' | 'NOT_SUBMITTED';

export interface ExecutionResult {
  status: JudgeStatus;
  stdout?: string | null;
  stderr?: string | null;
  compileOutput?: string | null;
  judgeStatus: string;
}

export interface RunCodeRequest {
  language: EditorLanguage;
  code: string;
  customInput?: string;
}

export interface SubmitCodeRequest {
  assignmentId: number;
  language: EditorLanguage;
  code: string;
}

export interface SubmitResult {
  submissionId: number;
  assignmentId: number;
  status: JudgeStatus;
  passedCases: number;
  totalCases: number;
  errorMessage?: string | null;
}

export interface Submission {
  submissionId: number;
  assignmentId: number;
  studentId: number;
  studentName: string;
  language: EditorLanguage;
  code: string;
  status: JudgeStatus;
  passedCases: number;
  totalCases: number;
  errorMessage?: string | null;
  submittedAt: string;
}

export interface SubmissionStatusItem {
  submissionId: number | null;
  studentId: number;
  studentName: string;
  submitted: boolean;
  status: JudgeStatus;
  resultSummary: string;
  submittedAt: string | null;
}
