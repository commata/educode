import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginValues } from '@/pages/auth/authSchemas';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { useLoginMutation } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/authStore';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((state) => state.setAuth);
  const user = useAuthStore((state) => state.user);
  const [submitError, setSubmitError] = useState('');
  const loginMutation = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (user) {
      navigate(user.role === 'EDUCATOR' ? '/educator/dashboard' : '/student/dashboard', {
        replace: true,
      });
    }
  }, [navigate, user]);

  const onSubmit = async (values: LoginValues) => {
    try {
      setSubmitError('');
      const response = await loginMutation.mutateAsync(values);
      setAuth({
        accessToken: response.accessToken,
        user: response.user,
      });

      const redirectPath = location.state?.from;
      navigate(
        redirectPath ??
          (response.user.role === 'EDUCATOR'
            ? '/educator/dashboard'
            : '/student/dashboard'),
        { replace: true },
      );
    } catch (error) {
      setSubmitError((error as { message?: string }).message ?? '로그인에 실패했습니다.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-slate-900">EduCode 로그인</h1>
        <p className="mt-2 text-sm text-slate-500">
          학생과 교육자 모두 같은 로그인 화면을 사용합니다.
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="이메일"
            type="email"
            placeholder="you@example.com"
            {...register('email')}
            error={errors.email?.message}
          />
          <Input
            label="비밀번호"
            type="password"
            placeholder="비밀번호 입력"
            {...register('password')}
            error={errors.password?.message}
          />

          {submitError ? <p className="text-sm text-rose-600">{submitError}</p> : null}

          <Button type="submit" fullWidth disabled={loginMutation.isPending}>
            {loginMutation.isPending ? '로그인 중...' : '로그인'}
          </Button>
        </form>

        <p className="mt-6 text-sm text-slate-600">
          계정이 없나요?{' '}
          <Link to="/signup" className="font-semibold text-slate-900 underline">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
