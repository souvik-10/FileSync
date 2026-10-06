import React from 'react';
import { useTransfers } from '../context/TransferContext';
import { useAuth } from '../context/AuthContext';
import { Radio, X, ArrowUpRight, ArrowDownLeft, CheckCircle2, Clock, AlertTriangle, FileText } from 'lucide-react';

interface TransferDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TransferDrawer: React.FC<TransferDrawerProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { transfers, loadingTransfers } = useTransfers();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center space-x-2.5">
            <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
            <h3 className="text-lg font-bold text-slate-100">Live Transfer Tracker</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {loadingTransfers ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              Loading transfer activities...
            </div>
          ) : transfers.length === 0 ? (
            <div className="text-center py-16 px-4">
              <Radio className="w-12 h-12 text-slate-700 mx-auto mb-3" />
              <h4 className="text-sm font-semibold text-slate-300">No Transfers Yet</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Share files with other registered users to watch real-time transfer progress live.
              </p>
            </div>
          ) : (
            transfers.map((item) => {
              const isSender = item.sender?._id === user?._id;
              const isCompleted = item.status === 'completed';
              const isUploading = item.status === 'uploading' || item.status === 'pending';
              const isFailed = item.status === 'failed' || item.status === 'cancelled';

              return (
                <div
                  key={item._id}
                  className="p-4 rounded-xl border border-slate-800/80 bg-slate-950/40 space-y-3 hover:border-slate-700/80 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isSender ? 'bg-indigo-500/10 text-indigo-400' : 'bg-emerald-500/10 text-emerald-400'
                        }`}
                      >
                        {isSender ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <h5 className="text-sm font-semibold text-slate-200 truncate">
                            {item.file?.originalName || 'Shared File'}
                          </h5>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {isSender ? `To: ${item.recipient?.name}` : `From: ${item.sender?.name}`}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        isCompleted
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : isUploading
                          ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 animate-pulse'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {isCompleted && <CheckCircle2 className="w-3 h-3" />}
                      {isUploading && <Clock className="w-3 h-3" />}
                      {isFailed && <AlertTriangle className="w-3 h-3" />}
                      <span className="capitalize">{item.status}</span>
                    </span>
                  </div>

                  {/* Message note if present */}
                  {item.message && (
                    <p className="text-xs text-slate-300 bg-slate-900/80 p-2 rounded-lg border border-slate-800/50 italic">
                      "{item.message}"
                    </p>
                  )}

                  {/* Live Progress Bar */}
                  {isUploading && (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between text-[11px] font-medium text-slate-400">
                        <span>Real-Time Status</span>
                        <span>{item.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-300"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="text-[10px] text-slate-500 text-right pt-1">
                    {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
