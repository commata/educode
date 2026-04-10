import { Link } from 'react-router-dom';
import type { Classroom } from '@/types/classroom';
import { Button } from '@/shared/ui/Button';
import { formatDate } from '@/shared/lib/date';

export function ClassroomCard({ classroom }: { classroom: Classroom }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">{classroom.name}</h3>
      <p className="mt-2 text-sm text-slate-600">{classroom.description}</p>
      <div className="mt-4 text-sm text-slate-500">
        <p>담당 선생님: {classroom.educatorName}</p>
        <p>생성일: {formatDate(classroom.createdAt)}</p>
      </div>
      <div className="mt-5">
        <Link to={`/classrooms/${classroom.id}`}>
          <Button>학습방 입장</Button>
        </Link>
      </div>
    </article>
  );
}
