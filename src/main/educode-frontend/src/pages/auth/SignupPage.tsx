import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../../shared/ui/Button';
import { Input } from '../../shared/ui/Input';
import { signupSchema, type SignupValues } from './authSchemas';
import { useSignupMutation } from '../../hooks/useAuth';

export function SignupPage() {
  const navigate = useNavigate();
  const signupMutation = useSignupMutation();
  const [submitError, setSubmitError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'STUDENT',
    },
  });

  const onSubmit = async (values: SignupValues) => {
    try {
      setSubmitError('');
      await signupMutation.mutateAsync(values);
      navigate('/login', { replace: true });
    } catch (error) {
      setSubmitError((error as { message?: string }).message ?? '회원가입에 실패했습니다.');
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center px-4">
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold text-slate-900">회원가입</h1>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="이름"
            placeholder="이름을 입력하세요"
            autoComplete="name"
            {...register('name')}
            error={errors.name?.message}
          />

          <Input
            label="이메일"
            type="email"
            placeholder="example@email.com"
            autoComplete="email"
            {...register('email')}
            error={errors.email?.message}
          />

          <Input
            label="비밀번호"
            type="password"
            placeholder="비밀번호를 입력하세요"
            autoComplete="new-password"
            {...register('password')}
            error={errors.password?.message}
          />

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">역할</span>
            <select
              {...register('role')}
              className="h-11 w-full rounded-xl border border-slate-300 px-3 outline-none focus:border-slate-500"
            >
              <option value="STUDENT">학생</option>
              <option value="EDUCATOR">교육자</option>
            </select>
          </label>

          {submitError ? <p className="text-sm text-red-600">{submitError}</p> : null}

          <Button
            type="submit"
            fullWidth
            disabled={signupMutation.isPending || isSubmitting}
          >
            {signupMutation.isPending ? '가입 중...' : '회원가입'}
          </Button>
        </form>
      </div>
    </div>
  );
}