import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  problemFormSchema,
  type ProblemFormValues,
} from '@/features/problems/problemSchemas';
import { Input, Textarea } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { TestCaseFieldArray } from '@/features/problems/TestCaseFieldArray';

interface ProblemFormProps {
  defaultValues?: ProblemFormValues;
  onSubmit: (values: ProblemFormValues) => void;
  isSubmitting?: boolean;
}

const initialValues: ProblemFormValues = {
  title: '',
  descriptionMarkdown: '',
  timeLimitMs: 2000,
  memoryLimitMb: 256,
  testCases: [
    {
      input: '',
      expectedOutput: '',
      isHidden: false,
    },
  ],
};

export function ProblemForm({
  defaultValues = initialValues,
  onSubmit,
  isSubmitting = false,
}: ProblemFormProps) {
  const methods = useForm<ProblemFormValues>({
    resolver: zodResolver(problemFormSchema),
    defaultValues,
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = methods;

  return (
    <FormProvider {...methods}>
      <form
        className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          label="문제 제목"
          placeholder="예: 두 수의 합"
          {...register('title')}
          error={errors.title?.message}
        />
        <Textarea
          label="문제 본문 (Markdown)"
          placeholder="# 문제 설명"
          className="min-h-[220px]"
          {...register('descriptionMarkdown')}
          error={errors.descriptionMarkdown?.message}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="제한시간 (ms)"
            type="number"
            {...register('timeLimitMs')}
            error={errors.timeLimitMs?.message}
          />
          <Input
            label="메모리 제한 (MB)"
            type="number"
            {...register('memoryLimitMb')}
            error={errors.memoryLimitMb?.message}
          />
        </div>
        <TestCaseFieldArray />
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? '생성 중...' : '문제 생성'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
