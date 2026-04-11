import { useEffect, useState } from 'react';
import type { Submission } from '@/types/submission';
import { Modal } from '@/shared/ui/Modal';
import { Button } from '@/shared/ui/Button';

interface SubmissionCodeModalProps {
  isOpen: boolean;
  submission: Submission | null;
  isLoading: boolean;
  onClose: () => void;
}

export function SubmissionCodeModal({
  isOpen,
  submission,
  isLoading,
  onClose,
}: SubmissionCodeModalProps) {
  const [tab, setTab] = useState<'code' | 'error'>('code');

  useEffect(() => {
    if (isOpen) {
      setTab('code');
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} title="학생 제출 상세" onClose={onClose}>
      {isLoading ? (
        <p className="text-sm text-slate-500">제출 상세를 불러오는 중...</p>
      ) : !submission ? (
        <p className="text-sm text-slate-500">선택된 제출이 없습니다.</p>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant={tab === 'code' ? 'primary' : 'secondary'}
              onClick={() => setTab('code')}
            >
              제출 코드
            </Button>
            <Button
              variant={tab === 'error' ? 'primary' : 'secondary'}
              onClick={() => setTab('error')}
            >
              시스템 에러 로그
            </Button>
          </div>

          {tab === 'code' ? (
            <pre className="max-h-[50vh] overflow-auto rounded-xl bg-slate-950 p-4 text-xs text-slate-100">
              {submission.code}
            </pre>
          ) : (
            <pre className="max-h-[50vh] overflow-auto rounded-xl bg-slate-950 p-4 text-xs text-slate-100">
              {submission.errorMessage || '-'}
            </pre>
          )}
        </div>
      )}
    </Modal>
  );
}
