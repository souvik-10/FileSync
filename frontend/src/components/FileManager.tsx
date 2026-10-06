import React, { useState } from 'react';
import { FileItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { downloadFileApi, deleteFileApi } from '../services/api';
import {
  FileText,
  Search,
  Download,
  Share2,
  Sparkles,
  Trash2,
  Tag,
  Grid,
  List,
  User,
  ShieldCheck,
  FileCode,
  FileSpreadsheet,
  FileImage,
  FileArchive,
} from 'lucide-react';

interface FileManagerProps {
  files: FileItem[];
  loading: boolean;
  onRefresh: () => void;
  onShareFile: (file: FileItem) => void;
  onOpenGemini: (file: FileItem) => void;
}

export const FileManager: React.FC<FileManagerProps> = ({
  files,
  loading,
  onRefresh,
  onShareFile,
  onOpenGemini,
}) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'uploads' | 'received'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filter files
  const filteredFiles = files.filter((file) => {
    const matchesSearch =
      file.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.tags?.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const isUploader = file.uploader?._id === user?._id;

    if (activeFilter === 'uploads') return matchesSearch && isUploader;
    if (activeFilter === 'received') return matchesSearch && !isUploader;
    return matchesSearch;
  });

  const handleDownload = async (file: FileItem) => {
    try {
      const response = await downloadFileApi(file._id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.originalName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('[FileManager] Download failed:', err);
      alert('Failed to download file.');
    }
  };

  const handleDelete = async (fileId: string) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;
    try {
      setDeletingId(fileId);
      await deleteFileApi(fileId);
      onRefresh();
    } catch (err) {
      console.error('[FileManager] Delete failed:', err);
      alert('Failed to delete file.');
    } finally {
      setDeletingId(null);
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('image')) return <FileImage className="w-6 h-6 text-emerald-400" />;
    if (mimeType.includes('json') || mimeType.includes('javascript') || mimeType.includes('html'))
      return <FileCode className="w-6 h-6 text-amber-400" />;
    if (mimeType.includes('zip') || mimeType.includes('tar') || mimeType.includes('compressed'))
      return <FileArchive className="w-6 h-6 text-purple-400" />;
    if (mimeType.includes('csv') || mimeType.includes('excel') || mimeType.includes('sheet'))
      return <FileSpreadsheet className="w-6 h-6 text-cyan-400" />;
    return <FileText className="w-6 h-6 text-indigo-400" />;
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Header Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by file name or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center space-x-2">
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeFilter === 'all'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Files ({files.length})
            </button>
            <button
              onClick={() => setActiveFilter('uploads')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeFilter === 'uploads'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              My Uploads
            </button>
            <button
              onClick={() => setActiveFilter('received')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeFilter === 'received'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Received
            </button>
          </div>

          {/* Toggle View Mode */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-slate-400 hover:text-slate-100 ${
                viewMode === 'grid' ? 'bg-slate-800 text-indigo-400' : ''
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-slate-400 hover:text-slate-100 ${
                viewMode === 'table' ? 'bg-slate-800 text-indigo-400' : ''
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Files Display */}
      {loading ? (
        <div className="text-center py-20 text-slate-400 text-sm">
          Loading files directory...
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="text-center py-24 glass-panel rounded-2xl border border-dashed border-slate-800">
          <FileText className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-300">No Files Found</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Upload files or share files with contacts to view them here.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFiles.map((file) => {
            const isUploader = file.uploader?._id === user?._id;

            return (
              <div
                key={file._id}
                className="glass-card p-5 rounded-2xl flex flex-col justify-between space-y-4 group"
              >
                {/* File Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                      {getFileIcon(file.mimeType)}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-slate-100 truncate group-hover:text-indigo-300 transition-colors">
                        {file.originalName}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB •{' '}
                        {new Date(file.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* File Meta Tags & Checksum badge */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>{isUploader ? 'Uploaded by You' : `Shared by ${file.uploader?.name}`}</span>
                  </div>

                  {file.checksum && (
                    <div className="flex items-center space-x-1.5 text-[10px] text-emerald-400/80 bg-emerald-500/5 px-2 py-1 rounded-md border border-emerald-500/10 truncate font-mono">
                      <ShieldCheck className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">SHA256: {file.checksum.substring(0, 16)}...</span>
                    </div>
                  )}

                  {file.tags && file.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {file.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded-md flex items-center gap-1 border border-slate-700/50"
                        >
                          <Tag className="w-2.5 h-2.5 text-indigo-400" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Toolbar */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleDownload(file)}
                      title="Download File"
                      className="p-2 rounded-lg bg-slate-800/80 hover:bg-indigo-600 text-slate-300 hover:text-white transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    {isUploader && (
                      <button
                        onClick={() => onShareFile(file)}
                        title="Share Real-Time"
                        className="p-2 rounded-lg bg-slate-800/80 hover:bg-violet-600 text-slate-300 hover:text-white transition-colors"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => onOpenGemini(file)}
                      title="Gemini AI Analysis"
                      className="px-2.5 py-2 rounded-lg bg-gradient-to-r from-indigo-500/20 to-purple-500/20 hover:from-indigo-500 hover:to-purple-500 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-semibold flex items-center space-x-1 transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      <span>AI Hub</span>
                    </button>
                  </div>

                  {isUploader && (
                    <button
                      onClick={() => handleDelete(file._id)}
                      disabled={deletingId === file._id}
                      title="Delete File"
                      className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">File Name</th>
                  <th className="p-4">Owner</th>
                  <th className="p-4">Size</th>
                  <th className="p-4">Uploaded Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredFiles.map((file) => {
                  const isUploader = file.uploader?._id === user?._id;
                  return (
                    <tr key={file._id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-semibold text-slate-100 flex items-center space-x-3">
                        {getFileIcon(file.mimeType)}
                        <span className="truncate max-w-[200px]">{file.originalName}</span>
                      </td>
                      <td className="p-4 text-slate-400">
                        {isUploader ? 'You' : file.uploader?.name}
                      </td>
                      <td className="p-4 text-slate-400">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </td>
                      <td className="p-4 text-slate-400">
                        {new Date(file.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handleDownload(file)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        {isUploader && (
                          <button
                            onClick={() => onShareFile(file)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-violet-600 text-slate-300 hover:text-white"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => onOpenGemini(file)}
                          className="px-2 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500 text-indigo-300 hover:text-white font-semibold"
                        >
                          AI
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
