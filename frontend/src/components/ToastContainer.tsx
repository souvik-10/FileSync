import React from 'react';
import { useTransfers } from '../context/TransferContext';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useTransfers();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col space-y-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start p-4 rounded-xl border shadow-xl transition-all duration-300 transform translate-y-0 glass-panel ${
              isSuccess
                ? 'border-emerald-500/40 bg-emerald-950/80 text-emerald-100'
                : isError
                ? 'border-rose-500/40 bg-rose-950/80 text-rose-100'
                : isWarning
                ? 'border-amber-500/40 bg-amber-950/80 text-amber-100'
                : 'border-indigo-500/40 bg-slate-900/90 text-indigo-100'
            }`}
          >
            <div className="flex-shrink-0 mr-3 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {isError && <XCircle className="w-5 h-5 text-rose-400" />}
              {isWarning && <AlertCircle className="w-5 h-5 text-amber-400" />}
              {!isSuccess && !isError && !isWarning && <Info className="w-5 h-5 text-indigo-400" />}
            </div>
            <div className="flex-1 pr-2">
              <h4 className="text-sm font-semibold leading-tight">{toast.title}</h4>
              <p className="text-xs mt-1 text-slate-300 leading-snug">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-100 transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
