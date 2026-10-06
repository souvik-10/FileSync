import React, { useState, useEffect } from 'react';
import { getUsersApi, initiateTransferApi } from '../services/api';
import { FileItem, User } from '../types';
import { Share2, X, Send, UserCheck, MessageSquare, Loader2 } from 'lucide-react';

interface FileShareModalProps {
  file: FileItem | null;
  isOpen: boolean;
  onClose: () => void;
  onShareInitiated: () => void;
}

export const FileShareModal: React.FC<FileShareModalProps> = ({ file, isOpen, onClose, onShareInitiated }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedRecipientId, setSelectedRecipientId] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      const fetchUsers = async () => {
        try {
          setLoadingUsers(true);
          const res = await getUsersApi();
          setUsers(res.data);
          if (res.data.length > 0) {
            setSelectedRecipientId(res.data[0]._id);
          }
        } catch (err) {
          console.error('[ShareModal] Failed to load users:', err);
          setError('Could not load user contacts');
        } finally {
          setLoadingUsers(false);
        }
      };
      fetchUsers();
    }
  }, [isOpen]);

  if (!isOpen || !file) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecipientId) {
      setError('Please select a recipient');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      await initiateTransferApi({
        fileId: file._id,
        recipientId: selectedRecipientId,
        message,
      });

      onShareInitiated();
      setMessage('');
      onClose();
    } catch (err: any) {
      console.error('[ShareModal] Transfer initiate failed:', err);
      setError(err.response?.data?.message || 'Failed to initiate transfer');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg glass-panel rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-800 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-slate-100 mb-1 flex items-center gap-2">
          <Share2 className="w-5 h-5 text-violet-400" />
          <span>Real-Time Share File</span>
        </h3>
        <p className="text-xs text-slate-400 mb-5">
          Share <span className="font-semibold text-indigo-300">"{file.originalName}"</span> directly with another user via live transfer.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Recipient Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Select Recipient User</span>
            </label>

            {loadingUsers ? (
              <div className="p-3 text-xs text-slate-400 flex items-center gap-2 bg-slate-900 rounded-lg">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Loading available users...</span>
              </div>
            ) : users.length === 0 ? (
              <div className="p-3 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                No other registered users found. Register another account in a new tab to test real-time cross-user file transfer!
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1">
                {users.map((u) => {
                  const isSelected = selectedRecipientId === u._id;
                  return (
                    <div
                      key={u._id}
                      onClick={() => setSelectedRecipientId(u._id)}
                      className={`flex items-center space-x-3 p-2.5 rounded-xl cursor-pointer border transition-all ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-500/15'
                          : 'border-slate-800 hover:border-slate-700 bg-slate-900/60'
                      }`}
                    >
                      <img
                        src={u.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.name)}`}
                        alt={u.name}
                        className="w-8 h-8 rounded-full bg-slate-800 object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-200 truncate">{u.name}</p>
                        <p className="text-xs text-slate-400 truncate">{u.email}</p>
                      </div>
                      {isSelected && (
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 shadow-md shadow-indigo-500/50" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Transfer Message */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
              <span>Optional Transfer Note</span>
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Here is the requested project file for review..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-slate-800 text-sm font-medium text-slate-300 hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedRecipientId || isSubmitting || users.length === 0}
              className="gradient-btn px-5 py-2 rounded-lg text-sm font-semibold text-white flex items-center space-x-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Initiating...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Transfer</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
