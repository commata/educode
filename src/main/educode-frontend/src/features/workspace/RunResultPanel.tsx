import type { ExecutionResult } from '@/types/submission';

interface RunResultPanelProps {
  result: ExecutionResult | null;
  isRunning: boolean;
}

export function RunResultPanel({ result, isRunning }: RunResultPanelProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900">Run Result</h3>
        {isRunning ? <span className="text-sm text-blue-600">Running...</span> : null}
      </div>

      {!result ? (
        <p className="text-sm text-slate-500">Click Run to see the result.</p>
      ) : (
        <div className="space-y-4 text-sm">
          <div className="grid gap-3 md:grid-cols-2">
            <ResultCard label="status" value={result.status} />
            <ResultCard label="judge" value={result.judgeStatus} />
          </div>

          <OutputBlock title="stdout" value={result.stdout} />
          <OutputBlock title="stderr" value={result.stderr} />
          <OutputBlock title="compile output" value={result.compileOutput} />
        </div>
      )}
    </section>
  );
}

function ResultCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function OutputBlock({ title, value }: { title: string; value?: string | null }) {
  return (
    <div>
      <p className="mb-2 font-semibold text-slate-800">{title}</p>
      <pre className="min-h-[64px] overflow-x-auto rounded-xl bg-slate-950 p-3 text-xs text-slate-100">
        {value || '-'}
      </pre>
    </div>
  );
}
