import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SubmissionStatusTable } from '@/entities/submission/ui/SubmissionStatusTable';
import {
  useAssignmentQuery,
  useAssignmentSubmissionQuery,
  useAssignmentSubmissionStatusQuery,
} from '@/hooks/useAssignments';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { ErrorState } from '@/shared/ui/ErrorState';
import { SubmissionCodeModal } from '@/features/submissions/SubmissionCodeModal';
import type { JudgeStatus } from '@/types/submission';

type FilterKey = 'ALL' | 'NOT_SUBMITTED' | 'WRONG_ANSWER';

export function AssignmentStatusPage() {
  const params = useParams();
  const assignmentId = Number(params.assignmentId);

  const [filter, setFilter] = useState<FilterKey>('ALL');
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<number | null>(null);

  const assignmentQuery = useAssignmentQuery(assignmentId);
  const statusQuery = useAssignmentSubmissionStatusQuery(assignmentId);
  const submissionQuery = useAssignmentSubmissionQuery(assignmentId, selectedSubmissionId);

  const filteredItems = useMemo(() => {
    const items = statusQuery.data ?? [];
    if (filter === 'NOT_SUBMITTED') {
      return items.filter((item) => item.status === 'NOT_SUBMITTED');
    }
    if (filter === 'WRONG_ANSWER') {
      return items.filter((item) => item.status === 'FAIL' || item.status === 'ERROR');
    }
    return items;
  }, [filter, statusQuery.data]);

  if (assignmentQuery.isLoading || statusQuery.isLoading) {
    return <LoadingSpinner label="제출 현황을 불러오는 중..." />;
  }

  if (assignmentQuery.isError || statusQuery.isError || !assignmentQuery.data) {
    return (
      <ErrorState
        message={
          (assignmentQuery.error as { message?: string })?.message ||
          (statusQuery.error as { message?: string })?.message ||
          '제출 현황을 불러오지 못했습니다.'
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <p className="text-sm text-slate-500">선생님 제출 현황판</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          {assignmentQuery.data.problemTitle}
        </h1>
        <div className="mt-4 flex flex-wrap gap-2">
          <FilterButton
            active={filter === 'ALL'}
            onClick={() => setFilter('ALL')}
            label="전체"
          />
          <FilterButton
            active={filter === 'NOT_SUBMITTED'}
            onClick={() => setFilter('NOT_SUBMITTED')}
            label="미제출자만"
          />
          <FilterButton
            active={filter === 'WRONG_ANSWER'}
            onClick={() => setFilter('WRONG_ANSWER')}
            label="오답자만"
          />
        </div>
      </section>

      <SubmissionStatusTable
        items={filteredItems}
        onOpenCode={(submissionId) => setSelectedSubmissionId(submissionId)}
      />

      <SubmissionCodeModal
        isOpen={Boolean(selectedSubmissionId)}
        submission={submissionQuery.data ?? null}
        isLoading={submissionQuery.isLoading}
        onClose={() => setSelectedSubmissionId(null)}
      />
    </div>
  );
}

function FilterButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`rounded-xl px-4 py-2 text-sm font-medium ${
        active
          ? 'bg-slate-900 text-white'
          : 'bg-white text-slate-700 ring-1 ring-slate-300'
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
