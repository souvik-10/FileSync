import { Response } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { FileModel } from '../models/File.js';
import { Transfer } from '../models/Transfer.js';

// Calculate file SHA-256 checksum
const getChecksum = (filePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);
    stream.on('data', (data) => hash.update(data));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', (err) => reject(err));
  });
};

// @desc    Upload file
// @route   POST /api/files/upload
// @access  Private
export const uploadFile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const filePath = req.file.path;
    const checksum = await getChecksum(filePath);

    const tags = req.body.tags ? String(req.body.tags).split(',').map((t) => t.trim()).filter(Boolean) : [];

    const newFile = await FileModel.create({
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      path: filePath,
      uploader: req.user._id,
      checksum,
      tags,
    });

    const populatedFile = await FileModel.findById(newFile._id).populate('uploader', 'name email avatar');

    res.status(201).json(populatedFile);
  } catch (error: any) {
    console.error('[File Controller] Upload error:', error);
    res.status(500).json({ message: error.message || 'Error uploading file' });
  }
};

// @desc    Get all files accessible by current user
// @route   GET /api/files
// @access  Private
export const getUserFiles = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const userId = req.user._id;

    // Files uploaded by user
    const uploadedFiles = await FileModel.find({ uploader: userId })
      .populate('uploader', 'name email avatar')
      .sort({ createdAt: -1 });

    // Files received via transfer
    const receivedTransfers = await Transfer.find({ recipient: userId, status: 'completed' })
      .populate({
        path: 'file',
        populate: { path: 'uploader', select: 'name email avatar' },
      })
      .populate('sender', 'name email avatar')
      .sort({ createdAt: -1 });

    const receivedFiles = receivedTransfers.map((t) => t.file).filter(Boolean);

    // Merge and deduplicate by _id
    const fileMap = new Map();
    uploadedFiles.forEach((f) => fileMap.set(f._id.toString(), f));
    receivedFiles.forEach((f: any) => {
      if (f && f._id) fileMap.set(f._id.toString(), f);
    });

    const allFiles = Array.from(fileMap.values());

    res.json(allFiles);
  } catch (error: any) {
    console.error('[File Controller] Fetch files error:', error);
    res.status(500).json({ message: error.message || 'Error retrieving files' });
  }
};

// @desc    Get single file details
// @route   GET /api/files/:id
// @access  Private
export const getFileById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    const file = await FileModel.findById(id).populate('uploader', 'name email avatar');

    if (!file) {
      res.status(404).json({ message: 'File not found' });
      return;
    }

    // Check permissions: uploader or recipient of a transfer
    const isUploader = file.uploader._id.toString() === userId?.toString();
    const isRecipient = await Transfer.exists({ file: file._id, recipient: userId });

    if (!isUploader && !isRecipient) {
      res.status(403).json({ message: 'Access denied to this file' });
      return;
    }

    res.json(file);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching file details' });
  }
};

// @desc    Download file
// @route   GET /api/files/:id/download
// @access  Private
export const downloadFile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    const file = await FileModel.findById(id);

    if (!file) {
      res.status(404).json({ message: 'File not found' });
      return;
    }

    // Check permissions: uploader or recipient of a transfer
    const isUploader = file.uploader.toString() === userId?.toString();
    const isRecipient = await Transfer.exists({ file: file._id, recipient: userId });

    if (!isUploader && !isRecipient) {
      res.status(403).json({ message: 'Not authorized to download this file' });
      return;
    }

    if (!fs.existsSync(file.path)) {
      res.status(404).json({ message: 'File binary not found on server disk' });
      return;
    }

    res.setHeader('Content-Type', file.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(file.originalName)}"`);

    const fileStream = fs.createReadStream(file.path);
    fileStream.pipe(res);
  } catch (error: any) {
    console.error('[File Controller] Download error:', error);
    res.status(500).json({ message: error.message || 'Error downloading file' });
  }
};

// @desc    Delete file
// @route   DELETE /api/files/:id
// @access  Private
export const deleteFile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    const file = await FileModel.findById(id);

    if (!file) {
      res.status(404).json({ message: 'File not found' });
      return;
    }

    if (file.uploader.toString() !== userId?.toString()) {
      res.status(403).json({ message: 'Only the uploader can delete this file' });
      return;
    }

    // Delete file from filesystem if exists
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    // Delete associated transfers and AI analysis records
    await Transfer.deleteMany({ file: file._id });
    await FileModel.findByIdAndDelete(id);

    res.json({ message: 'File deleted successfully' });
  } catch (error: any) {
    console.error('[File Controller] Delete file error:', error);
    res.status(500).json({ message: error.message || 'Error deleting file' });
  }
};
