import type { SubmissionStatusItem } from '@/types/submission';
import { DataTable } from '@/shared/ui/DataTable';
import { Button } from '@/shared/ui/Button';
import { StatusBadge } from '@/shared/ui/Badge';
import { formatDateTime } from '@/shared/lib/date';

interface SubmissionStatusTableProps {
  items: SubmissionStatusItem[];
  onOpenCode: (submissionId: number) => void;
}

export function SubmissionStatusTable({
  items,
  onOpenCode,
}: SubmissionStatusTableProps) {
  return (
    <DataTable
      data={items}
      emptyTitle="제출 데이터가 없습니다"
      emptyDescription="학생이 제출하면 이 테이블에 결과가 표시됩니다."
      columns={[
        {
          key: 'studentName',
          header: '이름',
          render: (item) => item.studentName,
        },
        {
          key: 'status',
          header: '상태',
          render: (item) => <StatusBadge status={item.status} />,
        },
        {
          key: 'submittedAt',
          header: '제출일시',
          render: (item) => formatDateTime(item.submittedAt),
        },
        {
          key: 'resultSummary',
          header: '결과',
          render: (item) => item.resultSummary,
        },
        {
          key: 'action',
          header: '액션',
          render: (item) =>
            item.submissionId ? (
              <Button variant="secondary" onClick={() => onOpenCode(item.submissionId as number)}>
                코드보기
              </Button>
            ) : (
              '-'
            ),
        },
      ]}
    />
  );
}
