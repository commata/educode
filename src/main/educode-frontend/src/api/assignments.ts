import { apiClient } from '@/api/client';
import type {
  Assignment,
  AssignmentDetail,
  CreateAssignmentRequest,
} from '@/types/assignment';
import type { Submission, SubmissionStatusItem } from '@/types/submission';

interface BackendAssignment {
  id?: number;
  assignmentId?: number;
  classroomId: number;
  classroomName?: string;
  problemId: number;
  problemTitle: string;
  deadline: string;
  createdAt?: string;
  submitted?: boolean;
  lastSubmissionStatus?: string | null;
  lastSubmittedAt?: string | null;
}

interface BackendAssignmentDetail {
  assignmentId: number;
  classroomId: number;
  classroomName: string;
  problemId: number;
  problemTitle: string;
  problemContent: string;
  timeLimit: number;
  memoryLimit: number;
  deadline: string;
  visibleTestCases: Array<{
    inputData: string;
    expectedOutput: string;
  }>;
}

interface BackendSubmissionStatusItem {
  studentId: number;
  studentName: string;
  submitted: boolean;
  status: SubmissionStatusItem['status'] | null;
  lastSubmittedAt: string | null;
}

function toAssignment(payload: BackendAssignment): Assignment {
  return {
    id: payload.id ?? payload.assignmentId ?? 0,
    classroomId: payload.classroomId,
    classroomName: payload.classroomName ?? '',
    problemId: payload.problemId,
    problemTitle: payload.problemTitle,
    deadline: payload.deadline,
    createdAt: payload.createdAt ?? '',
    mySubmissionStatus: payload.lastSubmissionStatus as Assignment['mySubmissionStatus'],
    latestSubmissionId: null,
  };
}

function toAssignmentDetail(payload: BackendAssignmentDetail): AssignmentDetail {
  return {
    id: payload.assignmentId,
    classroomId: payload.classroomId,
    classroomName: payload.classroomName,
    problemId: payload.problemId,
    problemTitle: payload.problemTitle,
    descriptionMarkdown: payload.problemContent,
    timeLimitMs: payload.timeLimit,
    memoryLimitMb: payload.memoryLimit,
    deadline: payload.deadline,
    visibleTestCases: payload.visibleTestCases.map((item) => ({
      input: item.inputData,
      expectedOutput: item.expectedOutput,
    })),
  };
}

function toSubmissionStatusItem(
  payload: BackendSubmissionStatusItem,
): SubmissionStatusItem {
  const status = payload.submitted && payload.status ? payload.status : 'NOT_SUBMITTED';

  return {
    submissionId: null,
    studentId: payload.studentId,
    studentName: payload.studentName,
    submitted: payload.submitted,
    status,
    resultSummary: payload.submitted ? status : 'NOT_SUBMITTED',
    submittedAt: payload.lastSubmittedAt,
  };
}

export async function createAssignment(
  classroomId: number,
  payload: CreateAssignmentRequest,
) {
  const { data } = await apiClient.post<BackendAssignment>(
    `/api/classrooms/${classroomId}/assignments`,
    payload,
  );
  return toAssignment(data);
}

export async function getAssignmentsByClassroom(classroomId: number) {
  const { data } = await apiClient.get<BackendAssignment[]>(
    `/api/classrooms/${classroomId}/assignments`,
  );
  return data.map(toAssignment);
}

export async function getAssignment(assignmentId: number) {
  const { data } = await apiClient.get<BackendAssignmentDetail>(
    `/api/assignments/${assignmentId}`,
  );
  return toAssignmentDetail(data);
}

export async function getMyAssignments() {
  const { data } = await apiClient.get<BackendAssignment[]>('/api/assignments/my');
  return data.map(toAssignment);
}

export async function getAssignmentSubmissionStatus(assignmentId: number) {
  const { data } = await apiClient.get<BackendSubmissionStatusItem[]>(
    `/api/assignments/${assignmentId}/submissions-status`,
  );
  return data.map(toSubmissionStatusItem);
}

export async function getAssignmentSubmission(
  assignmentId: number,
  submissionId: number,
) {
  const { data } = await apiClient.get<Submission>(
    `/api/assignments/${assignmentId}/submissions/${submissionId}`,
  );
  return data;
}
