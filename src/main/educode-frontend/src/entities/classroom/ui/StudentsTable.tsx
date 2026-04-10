import type { ClassroomStudent } from '@/types/classroom';
import { DataTable } from '@/shared/ui/DataTable';
import { Button } from '@/shared/ui/Button';
import { formatDateTime } from '@/shared/lib/date';

interface StudentsTableProps {
  students: ClassroomStudent[];
  canManage: boolean;
  onRemove: (studentId: number) => void;
}

export function StudentsTable({ students, canManage, onRemove }: StudentsTableProps) {
  return (
    <DataTable
      data={students}
      emptyTitle="참여 학생이 없습니다"
      emptyDescription="학생이 초대 코드로 참여하면 이 목록에 표시됩니다."
      columns={[
        {
          key: 'name',
          header: '이름',
          render: (student) => student.name,
        },
        {
          key: 'email',
          header: '이메일',
          render: (student) => student.email,
        },
        {
          key: 'joinedAt',
          header: '참여일',
          render: (student) => formatDateTime(student.joinedAt),
        },
        {
          key: 'action',
          header: '관리',
          render: (student) =>
            canManage ? (
              <Button variant="danger" onClick={() => onRemove(student.id)}>
                강제 퇴장
              </Button>
            ) : (
              '-'
            ),
        },
      ]}
    />
  );
}
