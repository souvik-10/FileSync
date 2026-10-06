export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt?: string;
}

export interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  token: string;
}

export interface FileItem {
  _id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  uploader: User;
  checksum?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export type TransferStatus = 'pending' | 'uploading' | 'completed' | 'failed' | 'cancelled';

export interface TransferItem {
  _id: string;
  sender: User;
  recipient: User;
  file: FileItem;
  status: TransferStatus;
  progress: number;
  message?: string;
  errorMessage?: string;
  sharedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface AIAnalysisItem {
  _id: string;
  file: string;
  user: string;
  type: 'summarize' | 'insights' | 'query';
  summary?: string;
  insights?: string[];
  queryPrompt?: string;
  response?: string;
  createdAt: string;
}
