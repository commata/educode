import { useParams } from 'react-router-dom';
import { StudentsTable } from '@/entities/classroom/ui/StudentsTable';
import { useAssignmentsByClassroomQuery } from '@/hooks/useAssignments';
import {
  useClassroomQuery,
  useClassroomStudentsQuery,
  useRemoveStudentMutation,
} from '@/hooks/useClassrooms';
import { useAuthStore } from '@/store/authStore';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { ErrorState } from '@/shared/ui/ErrorState';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Button } from '@/shared/ui/Button';
import { Link } from 'react-router-dom';
import { formatDateTime } from '@/shared/lib/date';

export function ClassroomDetailPage() {
  const params = useParams();
  const classroomId = Number(params.classroomId);
  const user = useAuthStore((state) => state.user);

  const classroomQuery = useClassroomQuery(classroomId);
  const studentsQuery = useClassroomStudentsQuery(classroomId);
  const assignmentsQuery = useAssignmentsByClassroomQuery(classroomId);
  const removeStudentMutation = useRemoveStudentMutation(classroomId);

  if (classroomQuery.isLoading || studentsQuery.isLoading || assignmentsQuery.isLoading) {
    return <LoadingSpinner />;
  }

  if (classroomQuery.isError || studentsQuery.isError || assignmentsQuery.isError) {
    return (
      <ErrorState
        message={
          (classroomQuery.error as { message?: string })?.message ||
          (studentsQuery.error as { message?: string })?.message ||
          '학습방 정보를 불러오지 못했습니다.'
        }
      />
    );
  }

  const classroom = classroomQuery.data;
  const canManageStudents = user?.role === 'EDUCATOR';

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">학습방 상세</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">{classroom?.name}</h1>
        <p className="mt-3 text-sm text-slate-600">{classroom?.description}</p>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <InfoCard label="담당 선생님" value={classroom?.educatorName ?? '-'} />
          <InfoCard label="초대 코드" value={classroom?.inviteCode ?? '-'} />
          <InfoCard label="생성일" value={formatDateTime(classroom?.createdAt)} />
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-slate-900">학생 목록</h2>
        <StudentsTable
          students={studentsQuery.data ?? []}
          canManage={canManageStudents}
          onRemove={(studentId) => removeStudentMutation.mutate(studentId)}
        />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-semibold text-slate-900">과제 목록</h2>
        {assignmentsQuery.data?.length ? (
          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3">과제명</th>
                  <th className="px-4 py-3">마감일</th>
                  <th className="px-4 py-3">액션</th>
                </tr>
              </thead>
              <tbody>
                {assignmentsQuery.data.map((assignment) => (
                  <tr key={assignment.id} className="border-t border-slate-200">
                    <td className="px-4 py-3">{assignment.problemTitle}</td>
                    <td className="px-4 py-3">{formatDateTime(assignment.deadline)}</td>
                    <td className="px-4 py-3">
                      {user?.role === 'EDUCATOR' ? (
                        <Link to={`/assignments/${assignment.id}/status`}>
                          <Button variant="secondary">제출 현황</Button>
                        </Link>
                      ) : (
                        <Link to={`/assignments/${assignment.id}/workspace`}>
                          <Button>코딩하러 가기</Button>
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-4">
            <EmptyState
              title="등록된 과제가 없습니다"
              description="선생님이 과제를 배포하면 이 영역에 표시됩니다."
            />
          </div>
        )}
      </section>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 font-semibold text-slate-900">{value}</p>
    </div>
  );
}
