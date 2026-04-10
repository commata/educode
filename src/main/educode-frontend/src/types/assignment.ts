import type { Problem } from '@/types/problem';
import type { JudgeStatus } from '@/types/submission';

export interface Assignment {
  id: number;
  classroomId: number;
  classroomName: string;
  problemId: number;
  problemTitle: string;
  dueAt: string;
  createdAt: string;
  mySubmissionStatus?: JudgeStatus;
  latestSubmissionId?: number | null;
}

export interface AssignmentDetail extends Assignment {
  problem: Problem;
}

export interface CreateAssignmentRequest {
  problemId: number;
  dueAt: string;
}
