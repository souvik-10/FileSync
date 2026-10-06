import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { Transfer } from '../models/Transfer.js';
import { FileModel } from '../models/File.js';
import { notifyTransferUpdate } from '../services/socketService.js';

// @desc    Initiate a file transfer to another user
// @route   POST /api/transfers
// @access  Private
export const initiateTransfer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const senderId = req.user?._id;
    const { recipientId, fileId, message } = req.body;

    if (!recipientId || !fileId) {
      res.status(400).json({ message: 'Recipient and file are required' });
      return;
    }

    const file = await FileModel.findById(fileId);
    if (!file) {
      res.status(404).json({ message: 'File not found' });
      return;
    }

    if (file.uploader.toString() !== senderId?.toString()) {
      res.status(403).json({ message: 'Not authorized to share this file' });
      return;
    }

    // Create transfer record
    const transfer = await Transfer.create({
      sender: senderId,
      recipient: recipientId,
      file: fileId,
      status: 'uploading',
      progress: 0,
      message: message || '',
    });

    const populatedTransfer = await Transfer.findById(transfer._id)
      .populate('sender', 'name email avatar')
      .populate('recipient', 'name email avatar')
      .populate('file');

    // Notify real-time status initiation
    notifyTransferUpdate(senderId.toString(), recipientId.toString(), 'transfer-initiated', populatedTransfer);

    // Simulate progress stream in asynchronous chunks
    let currentProgress = 0;
    const interval = setInterval(async () => {
      currentProgress += 25;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);

        const updated = await Transfer.findByIdAndUpdate(
          transfer._id,
          { status: 'completed', progress: 100 },
          { new: true }
        )
          .populate('sender', 'name email avatar')
          .populate('recipient', 'name email avatar')
          .populate('file');

        notifyTransferUpdate(senderId.toString(), recipientId.toString(), 'transfer-completed', updated);
      } else {
        await Transfer.findByIdAndUpdate(transfer._id, { progress: currentProgress });
        notifyTransferUpdate(senderId.toString(), recipientId.toString(), 'transfer-progress', {
          transferId: transfer._id,
          progress: currentProgress,
          status: 'uploading',
        });
      }
    }, 400);

    res.status(201).json(populatedTransfer);
  } catch (error: any) {
    console.error('[Transfer Controller] Error initiating transfer:', error);
    res.status(500).json({ message: error.message || 'Failed to initiate file transfer' });
  }
};

// @desc    Get transfer history for current user (sent and received)
// @route   GET /api/transfers
// @access  Private
export const getUserTransfers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;

    const transfers = await Transfer.find({
      $or: [{ sender: userId }, { recipient: userId }],
    })
      .populate('sender', 'name email avatar')
      .populate('recipient', 'name email avatar')
      .populate('file')
      .sort({ createdAt: -1 });

    res.json(transfers);
  } catch (error: any) {
    console.error('[Transfer Controller] Error fetching transfers:', error);
    res.status(500).json({ message: error.message || 'Error fetching transfers' });
  }
};

// @desc    Update transfer status (e.g. cancel or fail)
// @route   PATCH /api/transfers/:id/status
// @access  Private
export const updateTransferStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, errorMessage } = req.body;
    const userId = req.user?._id;

    const transfer = await Transfer.findById(id);
    if (!transfer) {
      res.status(404).json({ message: 'Transfer record not found' });
      return;
    }

    if (
      transfer.sender.toString() !== userId?.toString() &&
      transfer.recipient.toString() !== userId?.toString()
    ) {
      res.status(403).json({ message: 'Not authorized to modify this transfer' });
      return;
    }

    transfer.status = status || transfer.status;
    if (errorMessage) transfer.errorMessage = errorMessage;

    await transfer.save();

    const updatedTransfer = await Transfer.findById(id)
      .populate('sender', 'name email avatar')
      .populate('recipient', 'name email avatar')
      .populate('file');

    notifyTransferUpdate(
      transfer.sender.toString(),
      transfer.recipient.toString(),
      'transfer-status-changed',
      updatedTransfer
    );

    res.json(updatedTransfer);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error updating transfer status' });
  }
};
