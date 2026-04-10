import { useNavigate } from 'react-router-dom';
import { ProblemForm } from '@/features/problems/ProblemForm';
import { useCreateProblemMutation } from '@/hooks/useProblems';
import type { ProblemFormValues } from '@/features/problems/problemSchemas';
import { ErrorState } from '@/shared/ui/ErrorState';

export function ProblemCreatePage() {
  const navigate = useNavigate();
  const createProblemMutation = useCreateProblemMutation();

  const handleSubmit = async (values: ProblemFormValues) => {
    const created = await createProblemMutation.mutateAsync(values);
    navigate('/educator/dashboard', {
      replace: true,
      state: { createdProblemId: created.id },
    });
  };

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm text-slate-500">문제 생성</p>
        <h1 className="text-2xl font-bold text-slate-900">새 문제 만들기</h1>
        <p className="mt-2 text-sm text-slate-600">
          공개 테스트는 학생의 좌측 패널 예제로 노출되고, 비공개 테스트는 채점용으로만 사용됩니다.
        </p>
      </section>

      {createProblemMutation.isError ? (
        <ErrorState
          message={
            (createProblemMutation.error as { message?: string })?.message ||
            '문제 생성에 실패했습니다.'
          }
        />
      ) : null}

      <ProblemForm
        onSubmit={handleSubmit}
        isSubmitting={createProblemMutation.isPending}
      />
    </div>
  );
}
