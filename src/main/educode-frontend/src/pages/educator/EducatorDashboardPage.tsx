import { useMemo, useState } from 'react';
import { ClassroomCard } from '@/entities/classroom/ui/ClassroomCard';
import { useClassroomAssignmentsAggregate, useCreateAssignmentMutation } from '@/hooks/useAssignments';
import { useCreateClassroomMutation, useMyClassroomsQuery } from '@/hooks/useClassrooms';
import { useMyProblemsQuery } from '@/hooks/useProblems';
import { EmptyState } from '@/shared/ui/EmptyState';
import { ErrorState } from '@/shared/ui/ErrorState';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { Button } from '@/shared/ui/Button';
import { Modal } from '@/shared/ui/Modal';
import { ClassroomCreateForm, type ClassroomCreateValues } from '@/features/classrooms/ClassroomCreateForm';
import { AssignmentDistributeForm, type AssignmentDistributeValues } from '@/features/assignments/AssignmentDistributeForm';
import { Link } from 'react-router-dom';
import { formatDateTime } from '@/shared/lib/date';

export function EducatorDashboardPage() {
  const [isClassroomModalOpen, setClassroomModalOpen] = useState(false);
  const [selectedClassroomId, setSelectedClassroomId] = useState<number | null>(null);
  const [actionError, setActionError] = useState('');

  const classroomsQuery = useMyClassroomsQuery();
  const problemsQuery = useMyProblemsQuery();
  const createClassroomMutation = useCreateClassroomMutation();

  const classroomIds = useMemo(
    () => classroomsQuery.data?.map((classroom) => classroom.id) ?? [],
    [classroomsQuery.data],
  );

  const assignmentsAggregate = useClassroomAssignmentsAggregate(classroomIds);

  const createAssignmentMutation = useCreateAssignmentMutation(selectedClassroomId ?? 0);

  if (classroomsQuery.isLoading || problemsQuery.isLoading || assignmentsAggregate.isLoading) {
    return <LoadingSpinner />;
  }

  if (classroomsQuery.isError || problemsQuery.isError || assignmentsAggregate.isError) {
    return (
      <ErrorState
        message={
          (classroomsQuery.error as { message?: string })?.message ||
          (problemsQuery.error as { message?: string })?.message ||
          '선생님 대시보드를 불러오지 못했습니다.'
        }
      />
    );
  }

  const handleCreateClassroom = async (values: ClassroomCreateValues) => {
    try {
      setActionError('');
      await createClassroomMutation.mutateAsync(values);
      setClassroomModalOpen(false);
    } catch (error) {
      setActionError((error as { message?: string }).message ?? '학습방 생성에 실패했습니다.');
    }
  };

  const handleDistributeAssignment = async (values: AssignmentDistributeValues) => {
    if (!selectedClassroomId) return;
    try {
      setActionError('');
      await createAssignmentMutation.mutateAsync({
        problemId: values.problemId,
        dueAt: new Date(values.dueAt).toISOString(),
      });
      setSelectedClassroomId(null);
    } catch (error) {
      setActionError((error as { message?: string }).message ?? '과제 배포에 실패했습니다.');
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-slate-900 p-6 text-white">
        <h1 className="text-2xl font-bold">선생님 대시보드</h1>
        <p className="mt-2 text-sm text-slate-300">
          학습방 운영, 문제 생성, 과제 배포와 제출 현황 확인을 한 화면에서 처리합니다.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => setClassroomModalOpen(true)}>
            학습방 생성
          </Button>
          <Link to="/problems/new">
            <Button>문제 생성</Button>
          </Link>
        </div>
      </section>

      {actionError ? <ErrorState message={actionError} /> : null}

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">운영 중인 학습방</h2>
        </div>
        {classroomsQuery.data?.length ? (
          <div className="grid gap-4 xl:grid-cols-3">
            {classroomsQuery.data.map((classroom) => (
              <div key={classroom.id} className="space-y-3">
                <ClassroomCard classroom={classroom} />
                <Button
                  variant="secondary"
                  onClick={() => setSelectedClassroomId(classroom.id)}
                >
                  이 학습방에 과제 배포
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="운영 중인 학습방이 없습니다"
            description="먼저 학습방을 생성해 학생들을 초대하세요."
            action={
              <Button onClick={() => setClassroomModalOpen(true)}>학습방 생성</Button>
            }
          />
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-semibold text-slate-900">배포된 과제 목록</h2>
        {assignmentsAggregate.data.length ? (
          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3">학습방</th>
                  <th className="px-4 py-3">과제명</th>
                  <th className="px-4 py-3">마감일</th>
                  <th className="px-4 py-3">액션</th>
                </tr>
              </thead>
              <tbody>
                {assignmentsAggregate.data.map((assignment) => (
                  <tr key={assignment.id} className="border-t border-slate-200">
                    <td className="px-4 py-3">{assignment.classroomName}</td>
                    <td className="px-4 py-3">{assignment.problemTitle}</td>
                    <td className="px-4 py-3">{formatDateTime(assignment.dueAt)}</td>
                    <td className="px-4 py-3">
                      <Link to={`/assignments/${assignment.id}/status`}>
                        <Button variant="secondary">제출 현황 바로가기</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-4">
            <EmptyState
              title="배포된 과제가 없습니다"
              description="문제를 만든 뒤 학습방에 과제를 배포해보세요."
            />
          </div>
        )}
      </section>

      <Modal
        isOpen={isClassroomModalOpen}
        title="학습방 생성"
        onClose={() => setClassroomModalOpen(false)}
        footer={null}
        widthClassName="max-w-lg"
      >
        <ClassroomCreateForm
          onSubmit={handleCreateClassroom}
          isSubmitting={createClassroomMutation.isPending}
        />
      </Modal>

      <Modal
        isOpen={Boolean(selectedClassroomId)}
        title="과제 배포"
        onClose={() => setSelectedClassroomId(null)}
        footer={null}
        widthClassName="max-w-lg"
      >
        <AssignmentDistributeForm
          problems={problemsQuery.data ?? []}
          onSubmit={handleDistributeAssignment}
          isSubmitting={createAssignmentMutation.isPending}
        />
      </Modal>
    </div>
  );
}
