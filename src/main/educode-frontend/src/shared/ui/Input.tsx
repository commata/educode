import {
  forwardRef,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';
import { cn } from '@/shared/lib/cn';

interface BaseFieldProps {
  label: string;
  error?: string;
}

type InputProps = BaseFieldProps & InputHTMLAttributes<HTMLInputElement>;
type TextareaProps = BaseFieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
        <input
          ref={ref}
          className={cn(
            'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-900',
            error && 'border-rose-500',
            className,
          )}
          {...props}
        />
        {error ? <span className="mt-1 block text-xs text-rose-600">{error}</span> : null}
      </label>
    );
  },
);

Input.displayName = 'Input';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
        <textarea
          ref={ref}
          className={cn(
            'min-h-[120px] w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-900',
            error && 'border-rose-500',
            className,
          )}
          {...props}
        />
        {error ? <span className="mt-1 block text-xs text-rose-600">{error}</span> : null}
      </label>
    );
  },
);

Textarea.displayName = 'Textarea';