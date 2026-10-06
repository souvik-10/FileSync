import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTransfers } from '../context/TransferContext';
import { getFilesApi } from '../services/api';
import { FileItem } from '../types';

import { Navbar } from '../components/Navbar';
import { ToastContainer } from '../components/ToastContainer';
import { FileManager } from '../components/FileManager';
import { FileUploadModal } from '../components/FileUploadModal';
import { FileShareModal } from '../components/FileShareModal';
import { TransferDrawer } from '../components/TransferDrawer';
import { GeminiWorkspaceModal } from '../components/GeminiWorkspaceModal';

import { HardDrive, Share2, Sparkles, RefreshCw } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { refetchTransfers } = useTransfers();

  const [files, setFiles] = useState<FileItem[]>([]);
  const [loadingFiles, setLoadingFiles] = useState<boolean>(true);

  // Modal states
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isTransferDrawerOpen, setIsTransferDrawerOpen] = useState<boolean>(false);
  const [shareFileTarget, setShareFileTarget] = useState<FileItem | null>(null);
  const [geminiFileTarget, setGeminiFileTarget] = useState<FileItem | null>(null);

  const fetchFiles = useCallback(async () => {
    try {
      setLoadingFiles(true);
      const res = await getFilesApi();
      setFiles(res.data);
    } catch (err) {
      console.error('[Dashboard] Error fetching files:', err);
    } finally {
      setLoadingFiles(false);
    }
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleUploadSuccess = (newFile: FileItem) => {
    setFiles((prev) => [newFile, ...prev]);
  };

  const handleShareInitiated = () => {
    refetchTransfers();
    setIsTransferDrawerOpen(true);
  };

  // Stats calculation
  const totalSizeBytes = files.reduce((acc, curr) => acc + (curr.size || 0), 0);
  const usedStorageMB = (totalSizeBytes / (1024 * 1024)).toFixed(2);
  const totalUploaded = files.filter((f) => f.uploader?._id === user?._id).length;
  const totalReceived = files.filter((f) => f.uploader?._id !== user?._id).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Toast Notifications */}
      <ToastContainer />

      {/* Top Navbar */}
      <Navbar
        onOpenUpload={() => setIsUploadModalOpen(true)}
        onOpenTransfers={() => setIsTransferDrawerOpen(true)}
      />

      {/* Main Dashboard Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Welcome & Stats Banner */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-2 border-b border-slate-800/80">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>Welcome back, {user?.name.split(' ')[0]}</span>
              <span className="text-xl">👋</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Manage your cloud files, perform real-time user-to-user transfers, and query Gemini AI.
            </p>
          </div>

          <button
            onClick={() => {
              fetchFiles();
              refetchTransfers();
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition-colors flex items-center space-x-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync Refresh</span>
          </button>
        </div>

        {/* Overview Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Storage */}
          <div className="glass-card p-5 rounded-2xl flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0">
              <HardDrive className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Used Storage</p>
              <h3 className="text-xl font-extrabold text-slate-100 mt-0.5">{usedStorageMB} MB</h3>
              <p className="text-[11px] text-slate-500">{files.length} total files</p>
            </div>
          </div>

          {/* Card 2: Uploads */}
          <div className="glass-card p-5 rounded-2xl flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">My Uploads</p>
              <h3 className="text-xl font-extrabold text-slate-100 mt-0.5">{totalUploaded}</h3>
              <p className="text-[11px] text-slate-500">Files created by you</p>
            </div>
          </div>

          {/* Card 3: Received */}
          <div className="glass-card p-5 rounded-2xl flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <Share2 className="w-6 h-6 rotate-180" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Received Files</p>
              <h3 className="text-xl font-extrabold text-slate-100 mt-0.5">{totalReceived}</h3>
              <p className="text-[11px] text-slate-500">Transferred via FileSync</p>
            </div>
          </div>

          {/* Card 4: Gemini AI */}
          <div className="glass-card p-5 rounded-2xl flex items-center space-x-4 border-indigo-500/30">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Gemini AI</p>
              <h3 className="text-xl font-extrabold text-slate-100 mt-0.5">Active</h3>
              <p className="text-[11px] text-slate-400">Summaries & Q&A</p>
            </div>
          </div>
        </div>

        {/* File Manager Component */}
        <div className="pt-2">
          <FileManager
            files={files}
            loading={loadingFiles}
            onRefresh={fetchFiles}
            onShareFile={(file) => setShareFileTarget(file)}
            onOpenGemini={(file) => setGeminiFileTarget(file)}
          />
        </div>
      </main>

      {/* Modals & Drawers */}
      <FileUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />

      <FileShareModal
        file={shareFileTarget}
        isOpen={Boolean(shareFileTarget)}
        onClose={() => setShareFileTarget(null)}
        onShareInitiated={handleShareInitiated}
      />

      <TransferDrawer
        isOpen={isTransferDrawerOpen}
        onClose={() => setIsTransferDrawerOpen(false)}
      />

      <GeminiWorkspaceModal
        file={geminiFileTarget}
        isOpen={Boolean(geminiFileTarget)}
        onClose={() => setGeminiFileTarget(null)}
      />
    </div>
  );
};
