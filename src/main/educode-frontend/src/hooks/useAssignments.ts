import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createAssignment,
  getAssignment,
  getAssignmentSubmission,
  getAssignmentSubmissionStatus,
  getAssignmentsByClassroom,
  getMyAssignments,
} from '@/api/assignments';
import { queryKeys } from '@/shared/constants/queryKeys';

export function useMyAssignmentsQuery() {
  return useQuery({
    queryKey: queryKeys.assignments.my,
    queryFn: getMyAssignments,
  });
}

export function useAssignmentQuery(assignmentId: number) {
  return useQuery({
    queryKey: queryKeys.assignments.detail(assignmentId),
    queryFn: () => getAssignment(assignmentId),
    enabled: Number.isFinite(assignmentId),
  });
}

export function useAssignmentsByClassroomQuery(classroomId: number) {
  return useQuery({
    queryKey: queryKeys.assignments.byClassroom(classroomId),
    queryFn: () => getAssignmentsByClassroom(classroomId),
    enabled: Number.isFinite(classroomId),
  });
}

export function useClassroomAssignmentsAggregate(classroomIds: number[]) {
  return useQueries({
    queries: classroomIds.map((classroomId) => ({
      queryKey: queryKeys.assignments.byClassroom(classroomId),
      queryFn: () => getAssignmentsByClassroom(classroomId),
      enabled: classroomId > 0,
    })),
    combine: (results) => {
      const data = results.flatMap((result) => result.data ?? []);
      return {
        data,
        isLoading: results.some((result) => result.isLoading),
        isError: results.some((result) => result.isError),
      };
    },
  });
}

export function useCreateAssignmentMutation(classroomId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Parameters<typeof createAssignment>[1]) =>
      createAssignment(classroomId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.assignments.byClassroom(classroomId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.assignments.my });
    },
  });
}

export function useAssignmentSubmissionStatusQuery(assignmentId: number) {
  return useQuery({
    queryKey: queryKeys.assignments.status(assignmentId),
    queryFn: () => getAssignmentSubmissionStatus(assignmentId),
    enabled: Number.isFinite(assignmentId),
  });
}

export function useAssignmentSubmissionQuery(assignmentId: number, submissionId: number | null) {
  return useQuery({
    queryKey: [...queryKeys.assignments.status(assignmentId), submissionId],
    queryFn: () => getAssignmentSubmission(assignmentId, submissionId as number),
    enabled: Number.isFinite(assignmentId) && Boolean(submissionId),
  });
}
