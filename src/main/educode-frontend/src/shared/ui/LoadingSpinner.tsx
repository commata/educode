export function LoadingSpinner({ label = '불러오는 중...' }: { label?: string }) {
  return (
    <div className="flex min-h-[180px] flex-col items-center justify-center gap-3">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-700" />
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  );
}
