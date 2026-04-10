import type { Submission } from '@/types/submission';
import { Modal } from '@/shared/ui/Modal';
import { StatusBadge } from '@/shared/ui/Badge';

interface SubmitResultModalProps {
  isOpen: boolean;
  submission: Submission | null;
  onClose: () => void;
}

export function SubmitResultModal({
  isOpen,
  submission,
  onClose,
}: SubmitResultModalProps) {
  return (
    <Modal isOpen={isOpen} title="제출 결과" onClose={onClose}>
      {!submission ? (
        <p className="text-sm text-slate-500">제출 결과가 없습니다.</p>
      ) : (
        <div className="space-y-4 text-sm">
          <div className="flex items-center gap-3">
            <StatusBadge status={submission.status} />
            <span className="text-slate-700">
              {submission.passedCount} / {submission.totalCount} 케이스 통과
            </span>
          </div>
          <ResultSection title="stdout" value={submission.stdout} />
          <ResultSection title="stderr" value={submission.stderr} />
          <ResultSection title="compile error" value={submission.compileError} />
          <ResultSection title="system error log" value={submission.systemErrorLog} />
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
