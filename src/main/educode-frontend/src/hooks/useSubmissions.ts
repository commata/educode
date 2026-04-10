import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getMySubmissions, getSubmission, runCode, submitCode } from '@/api/submissions';
import { queryKeys } from '@/shared/constants/queryKeys';

export function useRunCodeMutation() {
  return useMutation({
    mutationFn: runCode,
  });
}

export function useSubmitCodeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitCode,
    onSuccess: (submission) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assignments.my });
      queryClient.invalidateQueries({
        queryKey: queryKeys.assignments.detail(submission.assignmentId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.assignments.status(submission.assignmentId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.submissions.my });
    },
  });
}

export function useMySubmissionsQuery() {
  return useQuery({
    queryKey: queryKeys.submissions.my,
    queryFn: getMySubmissions,
  });
}

export function useSubmissionQuery(submissionId: number) {
  return useQuery({
    queryKey: queryKeys.submissions.detail(submissionId),
    queryFn: () => getSubmission(submissionId),
    enabled: Number.isFinite(submissionId),
  });
}
