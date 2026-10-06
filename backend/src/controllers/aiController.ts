import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { FileModel } from '../models/File.js';
import { AIAnalysis } from '../models/AIAnalysis.js';
import { Transfer } from '../models/Transfer.js';
import {
  readFileContentSnippet,
  summarizeFileContent,
  generateContentInsights,
  answerContextualQuery,
} from '../services/geminiService.js';

// Helper check permission for file
const checkFileAccess = async (fileId: string, userId: string): Promise<boolean> => {
  const file = await FileModel.findById(fileId);
  if (!file) return false;
  if (file.uploader.toString() === userId) return true;
  const hasTransfer = await Transfer.exists({ file: file._id, recipient: userId });
  return Boolean(hasTransfer);
};

// @desc    Summarize file with Gemini AI
// @route   POST /api/ai/summarize
// @access  Private
export const summarizeFile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { fileId } = req.body;
    const userId = req.user?._id;

    if (!fileId) {
      res.status(400).json({ message: 'fileId is required' });
      return;
    }

    const hasAccess = await checkFileAccess(fileId, userId!.toString());
    if (!hasAccess) {
      res.status(403).json({ message: 'Access denied to this file' });
      return;
    }

    const file = await FileModel.findById(fileId);
    if (!file) {
      res.status(404).json({ message: 'File not found' });
      return;
    }

    const fileSnippet = readFileContentSnippet(file.path);
    const summaryText = await summarizeFileContent(file.originalName, file.mimeType, fileSnippet);

    const record = await AIAnalysis.create({
      file: file._id,
      user: userId,
      type: 'summarize',
      summary: summaryText,
    });

    res.json({
      _id: record._id,
      fileId: file._id,
      summary: summaryText,
      createdAt: record.createdAt,
    });
  } catch (error: any) {
    console.error('[AI Controller] Summarize error:', error);
    res.status(500).json({ message: error.message || 'Error generating AI summary' });
  }
};

// @desc    Generate insights for file with Gemini AI
// @route   POST /api/ai/insights
// @access  Private
export const getFileInsights = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { fileId } = req.body;
    const userId = req.user?._id;

    if (!fileId) {
      res.status(400).json({ message: 'fileId is required' });
      return;
    }

    const hasAccess = await checkFileAccess(fileId, userId!.toString());
    if (!hasAccess) {
      res.status(403).json({ message: 'Access denied to this file' });
      return;
    }

    const file = await FileModel.findById(fileId);
    if (!file) {
      res.status(404).json({ message: 'File not found' });
      return;
    }

    const fileSnippet = readFileContentSnippet(file.path);
    const insightsList = await generateContentInsights(file.originalName, file.mimeType, fileSnippet);

    const record = await AIAnalysis.create({
      file: file._id,
      user: userId,
      type: 'insights',
      insights: insightsList,
    });

    res.json({
      _id: record._id,
      fileId: file._id,
      insights: insightsList,
      createdAt: record.createdAt,
    });
  } catch (error: any) {
    console.error('[AI Controller] Insights error:', error);
    res.status(500).json({ message: error.message || 'Error generating AI insights' });
  }
};

// @desc    Ask contextual query about file with Gemini AI
// @route   POST /api/ai/query
// @access  Private
export const queryFile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { fileId, prompt } = req.body;
    const userId = req.user?._id;

    if (!fileId || !prompt) {
      res.status(400).json({ message: 'fileId and prompt are required' });
      return;
    }

    const hasAccess = await checkFileAccess(fileId, userId!.toString());
    if (!hasAccess) {
      res.status(403).json({ message: 'Access denied to this file' });
      return;
    }

    const file = await FileModel.findById(fileId);
    if (!file) {
      res.status(404).json({ message: 'File not found' });
      return;
    }

    const fileSnippet = readFileContentSnippet(file.path);
    const responseText = await answerContextualQuery(file.originalName, file.mimeType, fileSnippet, prompt);

    const record = await AIAnalysis.create({
      file: file._id,
      user: userId,
      type: 'query',
      queryPrompt: prompt,
      response: responseText,
    });

    res.json({
      _id: record._id,
      fileId: file._id,
      queryPrompt: prompt,
      response: responseText,
      createdAt: record.createdAt,
    });
  } catch (error: any) {
    console.error('[AI Controller] Query error:', error);
    res.status(500).json({ message: error.message || 'Error processing AI query' });
  }
};

// @desc    Get AI analysis history for a file
// @route   GET /api/ai/history/:fileId
// @access  Private
export const getFileAnalysisHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { fileId } = req.params;
    const userId = req.user?._id;

    const hasAccess = await checkFileAccess(fileId, userId!.toString());
    if (!hasAccess) {
      res.status(403).json({ message: 'Access denied to this file history' });
      return;
    }

    const history = await AIAnalysis.find({ file: fileId }).sort({ createdAt: -1 });

    res.json(history);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching AI analysis history' });
  }
};
