import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { TransferItem } from '../types';
import { getTransfersApi } from '../services/api';
import { getSocket } from '../services/socket';
import { useAuth } from './AuthContext';

interface ToastNotice {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
}

interface TransferContextType {
  transfers: TransferItem[];
  loadingTransfers: boolean;
  toasts: ToastNotice[];
  refetchTransfers: () => Promise<void>;
  addToast: (type: 'info' | 'success' | 'warning' | 'error', title: string, message: string) => void;
  removeToast: (id: string) => void;
}

const TransferContext = createContext<TransferContextType | undefined>(undefined);

export const TransferProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [transfers, setTransfers] = useState<TransferItem[]>([]);
  const [loadingTransfers, setLoadingTransfers] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastNotice[]>([]);

  const addToast = useCallback((type: 'info' | 'success' | 'warning' | 'error', title: string, message: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, title, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const refetchTransfers = useCallback(async () => {
    if (!user) return;
    try {
      setLoadingTransfers(true);
      const res = await getTransfersApi();
      setTransfers(res.data);
    } catch (error) {
      console.error('[TransferContext] Failed to load transfers:', error);
    } finally {
      setLoadingTransfers(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setTransfers([]);
      return;
    }

    refetchTransfers();

    const socket = getSocket();
    if (!socket) return;

    const handleTransferInitiated = (newTransfer: TransferItem) => {
      setTransfers((prev) => [newTransfer, ...prev.filter((t) => t._id !== newTransfer._id)]);
      const isRecipient = newTransfer.recipient?._id === user._id;
      addToast(
        'info',
        isRecipient ? 'Incoming File Transfer' : 'File Transfer Initiated',
        isRecipient
          ? `${newTransfer.sender?.name} is sending you "${newTransfer.file?.originalName}"`
          : `Sending "${newTransfer.file?.originalName}" to ${newTransfer.recipient?.name}`
      );
    };

    const handleTransferProgress = (data: { transferId: string; progress: number; status: string }) => {
      setTransfers((prev) =>
        prev.map((t) => (t._id === data.transferId ? { ...t, progress: data.progress, status: data.status as any } : t))
      );
    };

    const handleTransferCompleted = (updatedTransfer: TransferItem) => {
      setTransfers((prev) =>
        prev.map((t) => (t._id === updatedTransfer._id ? updatedTransfer : t))
      );
      const isRecipient = updatedTransfer.recipient?._id === user._id;
      addToast(
        'success',
        'Transfer Complete',
        isRecipient
          ? `Received "${updatedTransfer.file?.originalName}" from ${updatedTransfer.sender?.name}`
          : `Successfully sent "${updatedTransfer.file?.originalName}" to ${updatedTransfer.recipient?.name}`
      );
    };

    const handleTransferStatusChanged = (updatedTransfer: TransferItem) => {
      setTransfers((prev) =>
        prev.map((t) => (t._id === updatedTransfer._id ? updatedTransfer : t))
      );
    };

    socket.on('transfer-initiated', handleTransferInitiated);
    socket.on('transfer-progress', handleTransferProgress);
    socket.on('transfer-completed', handleTransferCompleted);
    socket.on('transfer-status-changed', handleTransferStatusChanged);

    return () => {
      socket.off('transfer-initiated', handleTransferInitiated);
      socket.off('transfer-progress', handleTransferProgress);
      socket.off('transfer-completed', handleTransferCompleted);
      socket.off('transfer-status-changed', handleTransferStatusChanged);
    };
  }, [user, refetchTransfers, addToast]);

  return (
    <TransferContext.Provider
      value={{
        transfers,
        loadingTransfers,
        toasts,
        refetchTransfers,
        addToast,
        removeToast,
      }}
    >
      {children}
    </TransferContext.Provider>
  );
};

export const useTransfers = () => {
  const context = useContext(TransferContext);
  if (!context) {
    throw new Error('useTransfers must be used within a TransferProvider');
  }
  return context;
};
