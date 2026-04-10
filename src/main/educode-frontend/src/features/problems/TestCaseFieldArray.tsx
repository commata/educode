import { useFieldArray, useFormContext } from 'react-hook-form';
import type { ProblemFormValues } from '@/features/problems/problemSchemas';
import { Button } from '@/shared/ui/Button';
import { Textarea } from '@/shared/ui/Input';

export function TestCaseFieldArray() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<ProblemFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'testCases',
  });

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900">테스트케이스</h3>
        <Button
          type="button"
          variant="secondary"
          onClick={() =>
            append({
              input: '',
              expectedOutput: '',
              isHidden: false,
            })
          }
        >
          테스트케이스 추가
        </Button>
      </div>

      {fields.map((field, index) => {
        const error = errors.testCases?.[index];
        return (
          <div key={field.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-800">케이스 #{index + 1}</p>
              {fields.length > 1 ? (
                <Button type="button" variant="danger" onClick={() => remove(index)}>
                  삭제
                </Button>
              ) : null}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Textarea
                label="입력값"
                {...register(`testCases.${index}.input`)}
                error={error?.input?.message}
              />
              <Textarea
                label="예상 출력값"
                {...register(`testCases.${index}.expectedOutput`)}
                error={error?.expectedOutput?.message}
              />
            </div>
            <label className="mt-4 flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" {...register(`testCases.${index}.isHidden`)} />
              비공개 테스트로 설정
            </label>
          </div>
        );
      })}
    </section>
  );
}
