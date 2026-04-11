import { Link } from 'react-router-dom';
import type { Assignment } from '@/types/assignment';
import { Button } from '@/shared/ui/Button';
import { StatusBadge } from '@/shared/ui/Badge';
import { formatDate } from '@/shared/lib/date';

export function AssignmentCard({ assignment }: { assignment: Assignment }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{assignment.classroomName}</p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900">{assignment.problemTitle}</h3>
        </div>
        <StatusBadge status={assignment.mySubmissionStatus ?? 'NOT_SUBMITTED'} />
      </div>
      <p className="mt-4 text-sm text-slate-600">Deadline: {formatDate(assignment.deadline)}</p>
      <div className="mt-5 flex gap-2">
        <Link to={`/assignments/${assignment.id}/workspace`}>
          <Button>Open Workspace</Button>
        </Link>
        <Link to={`/classrooms/${assignment.classroomId}`}>
          <Button variant="secondary">View Classroom</Button>
        </Link>
      </div>
    </article>
  );
}
