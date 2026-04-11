import type { SubmitResult } from '@/types/submission';
import { Modal } from '@/shared/ui/Modal';
import { StatusBadge } from '@/shared/ui/Badge';

interface SubmitResultModalProps {
  isOpen: boolean;
  submission: SubmitResult | null;
  onClose: () => void;
}

export function SubmitResultModal({
  isOpen,
  submission,
  onClose,
}: SubmitResultModalProps) {
  return (
    <Modal isOpen={isOpen} title="Submit Result" onClose={onClose}>
      {!submission ? (
        <p className="text-sm text-slate-500">No submission result available.</p>
      ) : (
        <div className="space-y-4 text-sm">
          <div className="flex items-center gap-3">
            <StatusBadge status={submission.status} />
            <span className="text-slate-700">
              {submission.passedCases} / {submission.totalCases} cases passed
            </span>
          </div>
          <ResultSection title="error" value={submission.errorMessage} />
        </div>
      )}
    </Modal>
  );
}

function ResultSection({
  title,
  value,
}: {
  title: string;
  value?: string | null;
}) {
  return (
    <div>
      <p className="mb-2 font-semibold text-slate-800">{title}</p>
      <pre className="min-h-[64px] overflow-x-auto rounded-xl bg-slate-950 p-3 text-xs text-slate-100">
        {value || '-'}
      </pre>
    </div>
  );
}
