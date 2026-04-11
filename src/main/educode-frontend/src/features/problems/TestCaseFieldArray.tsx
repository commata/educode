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
        <h3 className="text-base font-semibold text-slate-900">Test Cases</h3>
        <Button
          type="button"
          variant="secondary"
          onClick={() =>
            append({
              inputData: '',
              expectedOutput: '',
              isHidden: false,
            })
          }
        >
          Add Test Case
        </Button>
      </div>

      {fields.map((field, index) => {
        const error = errors.testCases?.[index];
        return (
          <div key={field.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-800">Case #{index + 1}</p>
              {fields.length > 1 ? (
                <Button type="button" variant="danger" onClick={() => remove(index)}>
                  Remove
                </Button>
              ) : null}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Textarea
                label="Input"
                {...register(`testCases.${index}.inputData`)}
                error={error?.inputData?.message}
              />
              <Textarea
                label="Expected Output"
                {...register(`testCases.${index}.expectedOutput`)}
                error={error?.expectedOutput?.message}
              />
            </div>
            <label className="mt-4 flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" {...register(`testCases.${index}.isHidden`)} />
              Hidden test case
            </label>
          </div>
        );
      })}
    </section>
  );
}
