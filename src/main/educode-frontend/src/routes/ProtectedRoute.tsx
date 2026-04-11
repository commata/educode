import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useMeQuery } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/authStore';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';

export function ProtectedRoute() {
  const location = useLocation();
  const token = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const { data, isLoading, isError } = useMeQuery();

  useEffect(() => {
    if (data && (!user || user.id !== data.id)) {
      setUser(data);
    }
  }, [data, user, setUser]);

  useEffect(() => {
    if (isError) {
      clearAuth();
    }
  }, [isError, clearAuth]);

  if (!token) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (isLoading) {
    return <LoadingSpinner label="사용자 정보를 확인하는 중..." />;
  }

  if (isError) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}