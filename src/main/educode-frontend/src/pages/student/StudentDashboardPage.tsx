import { useState } from 'react';
import { AssignmentCard } from '@/entities/assignment/ui/AssignmentCard';
import { ClassroomCard } from '@/entities/classroom/ui/ClassroomCard';
import { useJoinClassroomMutation, useMyClassroomsQuery } from '@/hooks/useClassrooms';
import { useMyAssignmentsQuery } from '@/hooks/useAssignments';
import { EmptyState } from '@/shared/ui/EmptyState';
import { ErrorState } from '@/shared/ui/ErrorState';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';

export function StudentDashboardPage() {
  const [inviteCode, setInviteCode] = useState('');
  const [joinError, setJoinError] = useState('');
  const classroomsQuery = useMyClassroomsQuery();
  const assignmentsQuery = useMyAssignmentsQuery();
  const joinMutation = useJoinClassroomMutation();

  if (classroomsQuery.isLoading || assignmentsQuery.isLoading) {
    return <LoadingSpinner />;
  }

  if (classroomsQuery.isError || assignmentsQuery.isError) {
    return (
      <ErrorState
        message={
          (classroomsQuery.error as { message?: string })?.message ||
          (assignmentsQuery.error as { message?: string })?.message ||
          '학생 대시보드를 불러오지 못했습니다.'
        }
      />
    );
  }

  const onJoin = async () => {
    try {
      setJoinError('');
      await joinMutation.mutateAsync({ inviteCode });
      setInviteCode('');
    } catch (error) {
      setJoinError((error as { message?: string }).message ?? '학습방 참여에 실패했습니다.');
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-slate-900 p-6 text-white">
        <h1 className="text-2xl font-bold">학생 대시보드</h1>
        <p className="mt-2 text-sm text-slate-300">
          참여 중인 학습방과 진행 중인 과제를 한 번에 확인하세요.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-900">초대 코드로 학습방 참여</h2>
        <div className="mt-4 flex flex-col gap-3 md:flex-row">
          <div className="flex-1">
            <Input
              label="초대 코드"
              value={inviteCode}
              onChange={(event) => setInviteCode(event.target.value)}
            />
          </div>
          <div className="flex items-end">
            <Button onClick={onJoin} disabled={!inviteCode || joinMutation.isPending}>
              {joinMutation.isPending ? '참여 중...' : '참여하기'}
            </Button>
          </div>
        </div>
        {joinError ? <p className="mt-2 text-sm text-rose-600">{joinError}</p> : null}
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">진행 중인 과제</h2>
        </div>
        {assignmentsQuery.data?.length ? (
          <div className="grid gap-4 xl:grid-cols-2">
            {assignmentsQuery.data.map((assignment) => (
              <AssignmentCard key={assignment.id} assignment={assignment} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="진행 중인 과제가 없습니다"
            description="선생님이 과제를 배포하면 이 영역에 표시됩니다."
          />
        )}
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">참여 중인 학습방</h2>
        </div>
        {classroomsQuery.data?.length ? (
          <div className="grid gap-4 xl:grid-cols-3">
            {classroomsQuery.data.map((classroom) => (
              <ClassroomCard key={classroom.id} classroom={classroom} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="참여 중인 학습방이 없습니다"
            description="초대 코드로 학습방에 참여해보세요."
          />
        )}
      </section>
    </div>
  );
}
