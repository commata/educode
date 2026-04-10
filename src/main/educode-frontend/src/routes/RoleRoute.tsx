import { Navigate, Outlet } from 'react-router-dom';
import type { Role } from '@/types/auth';
import { useAuthStore } from '@/store/authStore';

interface RoleRouteProps {
  allowedRoles: Role[];
}

export function RoleRoute({ allowedRoles }: RoleRouteProps) {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return (
      <Navigate
        to={user.role === 'EDUCATOR' ? '/educator/dashboard' : '/student/dashboard'}
        replace
      />
    );
  }

  return <Outlet />;
}
