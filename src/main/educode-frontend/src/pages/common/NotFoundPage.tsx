import { Link } from 'react-router-dom';
import { Button } from '@/shared/ui/Button';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-4">
      <p className="text-sm text-slate-500">404</p>
      <h1 className="text-3xl font-bold text-slate-900">페이지를 찾을 수 없습니다</h1>
      <Link to="/login">
        <Button>로그인 화면으로 이동</Button>
      </Link>
    </div>
  );
}
