import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useAssignmentQuery } from '@/hooks/useAssignments';
import { useRunCodeMutation, useSubmitCodeMutation } from '@/hooks/useSubmissions';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';
import { ErrorState } from '@/shared/ui/ErrorState';
import {
  DEFAULT_CODE_BY_LANGUAGE,
  LANGUAGE_OPTIONS,
  type EditorLanguage,
} from '@/shared/constants/languages';
import { MonacoCodeEditor } from '@/features/workspace/MonacoCodeEditor';
import { RunResultPanel } from '@/features/workspace/RunResultPanel';
import { SubmitResultModal } from '@/features/workspace/SubmitResultModal';
import { Button } from '@/shared/ui/Button';
import { formatDateTime } from '@/shared/lib/date';
import type { ExecutionResult, SubmitResult } from '@/types/submission';

export function AssignmentWorkspacePage() {
  const params = useParams();
  const assignmentId = Number(params.assignmentId);

  const assignmentQuery = useAssignmentQuery(assignmentId);
  const runMutation = useRunCodeMutation();
  const submitMutation = useSubmitCodeMutation();

  const [language, setLanguage] = useState<EditorLanguage>('python');
  const [sourceCode, setSourceCode] = useState(DEFAULT_CODE_BY_LANGUAGE.python);
  const [customInput, setCustomInput] = useState('');
  const [runResult, setRunResult] = useState<ExecutionResult | null>(null);
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);
  const [isSubmitModalOpen, setSubmitModalOpen] = useState(false);
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    setSourceCode(DEFAULT_CODE_BY_LANGUAGE[language]);
  }, [language]);

  const publicExamples = useMemo(
    () => assignmentQuery.data?.visibleTestCases ?? [],
    [assignmentQuery.data],
  );

  if (assignmentQuery.isLoading) {
    return <LoadingSpinner label="과제 정보를 불러오는 중..." />;
  }

  if (assignmentQuery.isError || !assignmentQuery.data) {
    return (
      <ErrorState
        message={
          (assignmentQuery.error as { message?: string })?.message ||
          '과제 정보를 불러오지 못했습니다.'
        }
      />
    );
  }

  const assignment = assignmentQuery.data;

  const handleRun = async () => {
    try {
      setActionError('');
      const result = await runMutation.mutateAsync({
        language,
        code: sourceCode,
        customInput,
      });
      setRunResult(result);
    } catch (error) {
      setActionError((error as { message?: string }).message ?? '코드 실행에 실패했습니다.');
    }
  };

  const handleSubmit = async () => {
    try {
      setActionError('');
      const result = await submitMutation.mutateAsync({
        assignmentId: assignment.id,
        language,
        code: sourceCode,
      });
      setSubmitResult(result);
      setSubmitModalOpen(true);
    } catch (error) {
      setActionError((error as { message?: string }).message ?? '제출에 실패했습니다.');
    }
  };

  return (
    <div className="space-y-4">
      <section className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4">
        <div>
          <Link to={`/classrooms/${assignment.classroomId}`} className="text-sm text-slate-500 underline">
            뒤로가기
          </Link>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">{assignment.problemTitle}</h1>
          <p className="mt-1 text-sm text-slate-500">
            마감일: {formatDateTime(assignment.deadline)}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleRun} disabled={runMutation.isPending}>
            {runMutation.isPending ? '실행 중...' : 'Run'}
          </Button>
          <Button onClick={handleSubmit} disabled={submitMutation.isPending}>
            {submitMutation.isPending ? '제출 중...' : 'Submit'}
          </Button>
        </div>
      </section>

      {actionError ? <ErrorState message={actionError} /> : null}

      <div className="grid gap-4 xl:grid-cols-[420px_minmax(0,1fr)]">
        <aside className="space-y-4">
          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-semibold text-slate-900">문제 설명</h2>
            <div className="prose mt-4 max-w-none text-sm text-slate-700">
             <ReactMarkdown>{assignment.descriptionMarkdown}</ReactMarkdown>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-semibold text-slate-900">제한 사항</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>시간 제한: {assignment.timeLimitMs} ms</li>
              <li>메모리 제한: {assignment.memoryLimitMb} MB</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-semibold text-slate-900">예제 입력 / 출력</h2>
            {publicExamples.length ? (
              <div className="mt-4 space-y-4">
                {publicExamples.map((example, index) => (
                  <div key={`${example.input}-${index}`} className="rounded-xl bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-800">예제 #{index + 1}</p>
                    <div className="mt-3">
                      <p className="mb-1 text-xs font-semibold text-slate-600">입력</p>
                      <pre className="overflow-x-auto rounded-lg bg-slate-950 p-3 text-xs text-slate-100">
                        {example.input}
                      </pre>
                    </div>
                    <div className="mt-3">
                      <p className="mb-1 text-xs font-semibold text-slate-600">출력</p>
                      <pre className="overflow-x-auto rounded-lg bg-slate-950 p-3 text-xs text-slate-100">
                        {example.expectedOutput}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-500">공개 예제가 없습니다.</p>
            )}
          </section>
        </aside>

        <section className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">언어 선택</span>
                <select
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
                  value={language}
                  onChange={(event) => setLanguage(event.target.value as EditorLanguage)}
                >
                  {LANGUAGE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={handleRun} disabled={runMutation.isPending}>
                  {runMutation.isPending ? '실행 중...' : 'Run'}
                </Button>
                <Button onClick={handleSubmit} disabled={submitMutation.isPending}>
                  {submitMutation.isPending ? '제출 중...' : 'Submit'}
                </Button>
              </div>
            </div>
            <MonacoCodeEditor language={language} value={sourceCode} onChange={setSourceCode} />
          </div>

          <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
            <section className="rounded-2xl border border-slate-200 bg-white p-4">
              <h3 className="text-base font-semibold text-slate-900">커스텀 입력</h3>
              <textarea
                className="mt-3 min-h-[240px] w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
                value={customInput}
                onChange={(event) => setCustomInput(event.target.value)}
                placeholder="직접 입력값을 넣고 Run 해보세요."
              />
            </section>
            <RunResultPanel result={runResult} isRunning={runMutation.isPending} />
          </div>
        </section>
      </div>

      <SubmitResultModal
        isOpen={isSubmitModalOpen}
        submission={submitResult}
        onClose={() => setSubmitModalOpen(false)}
      />
    </div>
  );
}
