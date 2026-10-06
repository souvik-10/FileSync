import React, { useState, useRef } from 'react';
import { uploadFileApi } from '../services/api';
import { FileItem } from '../types';
import { UploadCloud, X, FileText, Tag, Loader2, CheckCircle2 } from 'lucide-react';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (file: FileItem) => void;
}

export const FileUploadModal: React.FC<FileUploadModalProps> = ({ isOpen, onClose, onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [tags, setTags] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError('');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    try {
      setIsUploading(true);
      setError('');
      setProgress(0);

      const formData = new FormData();
      formData.append('file', file);
      if (tags.trim()) {
        formData.append('tags', tags);
      }

      const res = await uploadFileApi(formData, (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percent);
        }
      });

      onUploadSuccess(res.data);
      setFile(null);
      setTags('');
      setProgress(0);
      onClose();
    } catch (err: any) {
      console.error('[UploadModal] Upload error:', err);
      setError(err.response?.data?.message || 'Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg glass-panel rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-800 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          disabled={isUploading}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-slate-100 mb-1 flex items-center gap-2">
          <UploadCloud className="w-5 h-5 text-indigo-400" />
          <span>Upload File</span>
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          Upload documents, media, or archives to your secure FileSync cloud storage.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Dropzone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              isDragOver
                ? 'border-indigo-500 bg-indigo-500/10'
                : file
                ? 'border-emerald-500/50 bg-emerald-500/5'
                : 'border-slate-800 hover:border-slate-700 bg-slate-900/50'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
            />

            {file ? (
              <div className="flex items-center justify-center space-x-3 text-emerald-400">
                <FileText className="w-8 h-8" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-slate-200 truncate max-w-[220px]">{file.name}</p>
                  <p className="text-xs text-slate-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <UploadCloud className="w-10 h-10 text-indigo-400/80 mb-3" />
                <p className="text-sm font-medium text-slate-200">
                  Click to browse or drag & drop your file
                </p>
                <p className="text-xs text-slate-500 mt-1">Supports PDF, DOCX, TXT, PNG, JPG, ZIP (Up to 100MB)</p>
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-indigo-400" />
              <span>Tags (comma separated)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. project, finance, draft"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              disabled={isUploading}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Upload Progress Bar */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium text-slate-300">
                <span>Uploading...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full gradient-btn transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="px-4 py-2 rounded-lg bg-slate-800 text-sm font-medium text-slate-300 hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!file || isUploading}
              className="gradient-btn px-5 py-2 rounded-lg text-sm font-semibold text-white flex items-center space-x-2 disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Start Upload</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
