import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Problem } from '@/types/problem';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';

const schema = z.object({
  problemId: z.coerce.number().min(1, '문제를 선택하세요.'),
  dueAt: z.string().min(1, '마감기한을 선택하세요.'),
});

export type AssignmentDistributeValues = z.infer<typeof schema>;

export function AssignmentDistributeForm({
  problems,
  onSubmit,
  isSubmitting,
}: {
  problems: Problem[];
  onSubmit: (values: AssignmentDistributeValues) => void;
  isSubmitting: boolean;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AssignmentDistributeValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      problemId: problems[0]?.id ?? 0,
      dueAt: '',
    },
  });

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">문제 선택</span>
        <select
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
          {...register('problemId')}
        >
          <option value="">문제를 선택하세요</option>
          {problems.map((problem) => (
            <option key={problem.id} value={problem.id}>
              {problem.title}
            </option>
          ))}
        </select>
        {errors.problemId ? (
          <span className="mt-1 block text-xs text-rose-600">{errors.problemId.message}</span>
        ) : null}
      </label>
      <Input
        label="마감기한"
        type="datetime-local"
        {...register('dueAt')}
        error={errors.dueAt?.message}
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? '배포 중...' : '과제 배포'}
        </Button>
      </div>
    </form>
  );
}
