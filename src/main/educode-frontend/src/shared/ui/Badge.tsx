import type { JudgeStatus } from '@/types/submission';

const STATUS_CLASS_MAP: Record<JudgeStatus, string> = {
  PASS: 'bg-emerald-100 text-emerald-700',
  FAIL: 'bg-amber-100 text-amber-700',
  ERROR: 'bg-rose-100 text-rose-700',
  RUNNING: 'bg-blue-100 text-blue-700',
  PENDING: 'bg-slate-100 text-slate-700',
  NOT_SUBMITTED: 'bg-slate-100 text-slate-700',
};

export function StatusBadge({ status }: { status: JudgeStatus }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_CLASS_MAP[status]}`}>
      {status}
    </span>
  );
}
