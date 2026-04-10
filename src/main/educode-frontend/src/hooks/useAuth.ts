import { useMutation, useQuery } from '@tanstack/react-query';
import { getMe, login, signup, updateMe } from '@/api/auth';
import { queryKeys } from '@/shared/constants/queryKeys';
import { useAuthStore } from '@/store/authStore';

export function useMeQuery() {
  const token = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: getMe,
    enabled: Boolean(token),
  });
}

export function useLoginMutation() {
  return useMutation({
    mutationFn: login,
  });
}

export function useSignupMutation() {
  return useMutation({
    mutationFn: signup,
  });
}

export function useUpdateMeMutation() {
  return useMutation({
    mutationFn: updateMe,
  });
}
