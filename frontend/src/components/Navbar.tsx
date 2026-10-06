import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTransfers } from '../context/TransferContext';
import { FolderSync, LogOut, ArrowUpRight, Radio } from 'lucide-react';

interface NavbarProps {
  onOpenUpload: () => void;
  onOpenTransfers: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenUpload, onOpenTransfers }) => {
  const { user, logout } = useAuth();
  const { transfers } = useTransfers();

  const activeTransfers = transfers.filter((t) => t.status === 'uploading' || t.status === 'pending');

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
      {/* Brand Logo */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl gradient-btn flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <FolderSync className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
            File<span className="gradient-text">Sync</span>
          </span>
          <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            Real-Time SaaS
          </span>
        </div>
      </div>

      {/* Center Actions */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenUpload}
          className="gradient-btn px-4 py-2 rounded-lg text-sm font-semibold text-white flex items-center space-x-2 shadow-md hover:scale-[1.02] transition-transform active:scale-[0.98]"
        >
          <ArrowUpRight className="w-4 h-4" />
          <span>Upload File</span>
        </button>

        <button
          onClick={onOpenTransfers}
          className="relative px-3.5 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-sm font-medium text-slate-200 border border-slate-700/60 flex items-center space-x-2 transition-colors"
        >
          <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="hidden md:inline">Transfers</span>
          {activeTransfers.length > 0 && (
            <span className="ml-1 bg-indigo-500 text-white text-xs font-extrabold px-1.5 py-0.5 rounded-full">
              {activeTransfers.length}
            </span>
          )}
        </button>
      </div>

      {/* Right User Profile */}
      <div className="flex items-center space-x-4">
        {user && (
          <div className="flex items-center space-x-3 pl-3 border-l border-slate-800">
            <img
              src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
              alt={user.name}
              className="w-9 h-9 rounded-full bg-slate-800 border border-indigo-500/30 object-cover"
            />
            <div className="hidden lg:block text-left">
              <p className="text-sm font-semibold text-slate-200 leading-tight">{user.name}</p>
              <p className="text-xs text-slate-400 truncate max-w-[140px]">{user.email}</p>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
