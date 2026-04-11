import type { JudgeStatus } from '@/types/submission';

export interface Assignment {
  id: number;
  classroomId: number;
  classroomName: string;
  problemId: number;
  problemTitle: string;
  deadline: string;
  createdAt: string;
  mySubmissionStatus?: JudgeStatus;
  latestSubmissionId?: number | null;
}

export interface VisibleTestCase {
  input: string;
  expectedOutput: string;
}

export interface AssignmentDetail {
  id: number;
  classroomId: number;
  classroomName: string;
  problemId: number;
  problemTitle: string;
  descriptionMarkdown: string;
  timeLimitMs: number;
  memoryLimitMb: number;
  deadline: string;
  visibleTestCases: VisibleTestCase[];
}

export interface CreateAssignmentRequest {
  problemId: number;
  deadline: string;
}