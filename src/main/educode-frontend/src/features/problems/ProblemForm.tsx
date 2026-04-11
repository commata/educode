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
  content: '',
  timeLimit: 2000,
  memoryLimit: 256,
  testCases: [
    {
      inputData: '',
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
          label="Title"
          placeholder="Enter a problem title"
          {...register('title')}
          error={errors.title?.message}
        />
        <Textarea
          label="Problem Content (Markdown)"
          placeholder="# Describe the problem"
          className="min-h-[220px]"
          {...register('content')}
          error={errors.content?.message}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Time Limit (ms)"
            type="number"
            {...register('timeLimit')}
            error={errors.timeLimit?.message}
          />
          <Input
            label="Memory Limit (MB)"
            type="number"
            {...register('memoryLimit')}
            error={errors.memoryLimit?.message}
          />
        </div>
        <TestCaseFieldArray />
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Problem'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
