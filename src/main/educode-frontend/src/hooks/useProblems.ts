import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createProblem, getMyProblems, getProblem } from '@/api/problems';
import { queryKeys } from '@/shared/constants/queryKeys';

export function useMyProblemsQuery() {
  return useQuery({
    queryKey: queryKeys.problems.my,
    queryFn: getMyProblems,
  });
}

export function useProblemQuery(problemId: number) {
  return useQuery({
    queryKey: queryKeys.problems.detail(problemId),
    queryFn: () => getProblem(problemId),
    enabled: Number.isFinite(problemId),
  });
}

export function useCreateProblemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProblem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.problems.my });
    },
  });
}
