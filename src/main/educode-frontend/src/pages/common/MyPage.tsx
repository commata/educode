import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMeQuery, useUpdateMeMutation } from '@/hooks/useAuth';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { ErrorState } from '@/shared/ui/ErrorState';
import { useAuthStore } from '@/store/authStore';

interface ProfileFormValues {
  name: string;
}

export function MyPage() {
  const meQuery = useMeQuery();
  const updateMeMutation = useUpdateMeMutation();
  const setUser = useAuthStore((state) => state.setUser);
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
  } = useForm<ProfileFormValues>({
    defaultValues: {
      name: '',
    },
  });

  useEffect(() => {
    if (meQuery.data) {
      reset({ name: meQuery.data.name });
    }
  }, [meQuery.data, reset]);

  if (meQuery.isLoading) {
    return <LoadingSpinner label="내 정보를 불러오는 중..." />;
  }

  if (meQuery.isError || !meQuery.data) {
    return (
      <ErrorState
        message={(meQuery.error as { message?: string })?.message || '내 정보를 불러오지 못했습니다.'}
      />
    );
  }

  const handleSave = async (values: ProfileFormValues) => {
    const updated = await updateMeMutation.mutateAsync(values);
    setUser(updated);
    setSuccessMessage('회원 정보를 저장했습니다.');
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <section>
        <p className="text-sm text-slate-500">마이페이지</p>
        <h1 className="text-2xl font-bold text-slate-900">내 정보 관리</h1>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <InfoCard label="이메일" value={meQuery.data.email} />
          <InfoCard label="역할" value={meQuery.data.role} />
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(handleSave)}>
          <Input label="이름" {...register('name')} />
          {successMessage ? <p className="text-sm text-emerald-600">{successMessage}</p> : null}
          <div className="flex justify-end">
            <Button type="submit" disabled={updateMeMutation.isPending}>
              {updateMeMutation.isPending ? '저장 중...' : '저장'}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 font-semibold text-slate-900">{value}</p>
    </div>
  );
}
