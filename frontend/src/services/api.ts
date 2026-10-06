import axios from 'axios';
import { AuthResponse, FileItem, TransferItem, User } from '../types';

const API = axios.create({
  baseURL: '/api',
});

// Request interceptor to attach JWT token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('filesync_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const loginApi = (data: { email: string; password: string }) =>
  API.post<AuthResponse>('/auth/login', data);

export const registerApi = (data: { name: string; email: string; password: string }) =>
  API.post<AuthResponse>('/auth/register', data);

export const getMeApi = () => API.get<User>('/auth/me');

export const getUsersApi = () => API.get<User[]>('/auth/users');

// File endpoints
export const uploadFileApi = (formData: FormData, onUploadProgress?: (progressEvent: any) => void) =>
  API.post<FileItem>('/files/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  });

export const getFilesApi = () => API.get<FileItem[]>('/files');

export const getFileByIdApi = (id: string) => API.get<FileItem>(`/files/${id}`);

export const downloadFileApi = (id: string) =>
  API.get(`/files/${id}/download`, { responseType: 'blob' });

export const deleteFileApi = (id: string) => API.delete(`/files/${id}`);

// Transfer endpoints
export const initiateTransferApi = (data: { recipientId: string; fileId: string; message?: string }) =>
  API.post<TransferItem>('/transfers', data);

export const getTransfersApi = () => API.get<TransferItem[]>('/transfers');

export const updateTransferStatusApi = (id: string, status: string, errorMessage?: string) =>
  API.patch<TransferItem>(`/transfers/${id}/status`, { status, errorMessage });

// AI endpoints
export const summarizeFileApi = (fileId: string) =>
  API.post<{ summary: string; fileId: string }>('/ai/summarize', { fileId });

export const getFileInsightsApi = (fileId: string) =>
  API.post<{ insights: string[]; fileId: string }>('/ai/insights', { fileId });

export const queryFileApi = (fileId: string, prompt: string) =>
  API.post<{ queryPrompt: string; response: string; fileId: string }>('/ai/query', { fileId, prompt });

export const getAIHistoryApi = (fileId: string) => API.get(`/ai/history/${fileId}`);
