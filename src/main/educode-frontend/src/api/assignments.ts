import { apiClient } from '@/api/client';
import type {
  Assignment,
  AssignmentDetail,
  CreateAssignmentRequest,
} from '@/types/assignment';
import type { Submission, SubmissionStatusItem } from '@/types/submission';

export async function createAssignment(classroomId: number, payload: CreateAssignmentRequest) {
  const { data } = await apiClient.post<Assignment>(
    `/api/classrooms/${classroomId}/assignments`,
    payload,
  );
  return data;
}

export async function getAssignmentsByClassroom(classroomId: number) {
  const { data } = await apiClient.get<Assignment[]>(
    `/api/classrooms/${classroomId}/assignments`,
  );
  return data;
}

export async function getAssignment(assignmentId: number) {
  const { data } = await apiClient.get<AssignmentDetail>(`/api/assignments/${assignmentId}`);
  return data;
}

export async function getMyAssignments() {
  const { data } = await apiClient.get<Assignment[]>('/api/assignments/my');
  return data;
}

export async function getAssignmentSubmissionStatus(assignmentId: number) {
  const { data } = await apiClient.get<SubmissionStatusItem[]>(
    `/api/assignments/${assignmentId}/submissions-status`,
  );
  return data;
}

export async function getAssignmentSubmission(assignmentId: number, submissionId: number) {
  const { data } = await apiClient.get<Submission>(
    `/api/assignments/${assignmentId}/submissions/${submissionId}`,
  );
  return data;
}
