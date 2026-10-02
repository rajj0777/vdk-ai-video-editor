import React, { useEffect } from 'react';

export interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'info' | 'error';
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#191b26]/95 backdrop-blur-xl border border-[#272935] shadow-2xl text-xs text-[#e1e1f1] animate-in slide-in-from-bottom-2 fade-in"
        >
          <span
            className={`material-symbols-outlined text-[18px] ${
              toast.type === 'success'
                ? 'text-[#4cd7f6]'
                : toast.type === 'error'
                ? 'text-[#ffb4ab]'
                : 'text-[#c0c1ff]'
            }`}
          >
            {toast.type === 'success'
              ? 'check_circle'
              : toast.type === 'error'
              ? 'error'
              : 'info'}
          </span>
          <span className="font-medium">{toast.text}</span>
          <button
            onClick={() => onDismiss(toast.id)}
            className="ml-auto text-[#c7c4d7] hover:text-[#e1e1f1] p-0.5"
          >
            <span className="material-symbols-outlined text-[14px]">close</span>
          </button>
        </div>
      ))}
    </div>
  );
};
