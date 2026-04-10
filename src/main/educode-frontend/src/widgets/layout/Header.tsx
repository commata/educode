import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui/Button';
import { useAuthStore } from '@/store/authStore';

export function Header() {
  const navigate = useNavigate();
  const { user, clearAuth } = useAuthStore();

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <button
        className="text-xl font-bold text-slate-900"
        onClick={() => navigate(user?.role === 'EDUCATOR' ? '/educator/dashboard' : '/student/dashboard')}
      >
        EduCode
      </button>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
          <p className="text-xs text-slate-500">{user?.role}</p>
        </div>
        <Button
          variant="secondary"
          onClick={() => {
            clearAuth();
            navigate('/login', { replace: true });
          }}
        >
          로그아웃
        </Button>
      </div>
    </header>
  );
}
