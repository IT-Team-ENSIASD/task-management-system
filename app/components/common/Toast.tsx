import React, { useEffect } from 'react';
import { BellIcon, CheckCircle2Icon, XIcon, ClockIcon } from '../icons';

export interface ToastProps {
  id: string;
  title: string;
  message: string;
  type?: 'assignment' | 'completion' | 'reminder' | 'due_soon';
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ id, title, message, type = 'assignment', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), 5000);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  const Icon = type === 'completion' ? CheckCircle2Icon : BellIcon;
  const colorClass = type === 'completion' ? 'bg-emerald-500' : 
                    type === 'reminder' ? 'bg-amber-500' : 'bg-slate-900';

  return (
    <div className="flex w-[320px] animate-in slide-in-from-right fade-in duration-300 gap-3 rounded-[22px] border border-slate-200 bg-white p-4 shadow-[0_20px_40px_rgba(15,23,42,0.12)]">
      <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${colorClass} text-white`}>
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0 pr-2">
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="mt-0.5 text-xs text-slate-500 line-clamp-2">{message}</p>
      </div>
      <button 
        onClick={() => onClose(id)} 
        className="grid h-6 w-6 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
      >
        <XIcon size={12} />
      </button>
    </div>
  );
};

export const ToastContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
      {children}
    </div>
  );
};
