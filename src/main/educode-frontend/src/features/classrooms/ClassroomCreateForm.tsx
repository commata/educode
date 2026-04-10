import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input, Textarea } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';

const schema = z.object({
  name: z.string().min(1, '학습방 이름을 입력하세요.'),
  description: z.string().min(5, '설명을 5자 이상 입력하세요.'),
});

export type ClassroomCreateValues = z.infer<typeof schema>;

export function ClassroomCreateForm({
  onSubmit,
  isSubmitting,
}: {
  onSubmit: (values: ClassroomCreateValues) => void;
  isSubmitting: boolean;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClassroomCreateValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <Input label="학습방 이름" {...register('name')} error={errors.name?.message} />
      <Textarea
        label="설명"
        {...register('description')}
        error={errors.description?.message}
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? '생성 중...' : '학습방 생성'}
        </Button>
      </div>
    </form>
  );
}
