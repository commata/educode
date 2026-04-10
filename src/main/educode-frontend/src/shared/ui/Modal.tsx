import type { PropsWithChildren, ReactNode } from 'react';
import { Button } from '@/shared/ui/Button';

interface ModalProps extends PropsWithChildren {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  footer?: ReactNode;
  widthClassName?: string;
}

export function Modal({
  isOpen,
  title,
  onClose,
  footer,
  widthClassName = 'max-w-3xl',
  children,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className={`w-full ${widthClassName} rounded-2xl bg-white shadow-xl`}>
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <Button variant="ghost" onClick={onClose}>
            닫기
          </Button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">{children}</div>
        <div className="flex justify-end gap-2 border-t border-slate-200 px-6 py-4">
          {footer ?? (
            <Button variant="secondary" onClick={onClose}>
              확인
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
