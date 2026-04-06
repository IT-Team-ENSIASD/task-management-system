import type React from 'react';
import { useEffect } from 'react';
import { Button } from './Button';
import { XIcon } from '../icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  widthClassName?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  widthClassName = 'max-w-2xl',
}) => {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    globalThis.addEventListener('keydown', handleEsc);
    return () => globalThis.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <dialog open className="fixed inset-0 z-50 m-0 flex h-full w-full items-center justify-center bg-transparent p-4 sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px]"
        aria-label="Close modal"
        onClick={onClose}
      />

      <div className={`relative w-full ${widthClassName} overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_30px_60px_rgba(15,23,42,0.18)]`}>
        <div className="flex items-start justify-between gap-4 border-b border-slate-200/70 px-5 py-5 md:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Task action</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{title}</h3>
            {description && <p className="mt-2 text-sm text-slate-500">{description}</p>}
          </div>

          <Button type="button" variant="ghost" size="sm" className="rounded-full px-3" onClick={onClose}>
            <XIcon size={16} />
          </Button>
        </div>

        <div className="px-5 py-5 md:px-6">{children}</div>

        {footer && <div className="border-t border-slate-200/70 bg-slate-50/70 px-5 py-4 md:px-6">{footer}</div>}
      </div>
    </dialog>
  );
};