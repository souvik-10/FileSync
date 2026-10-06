import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

const getGeminiClient = (): GoogleGenAI | null => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    console.warn('[Gemini Service] GEMINI_API_KEY is not configured in backend environment variables.');
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

// Helper to extract text from file path if text/code/json/md file
export const readFileContentSnippet = (filePath: string, maxBytes: number = 50000): string => {
  try {
    if (!fs.existsSync(filePath)) {
      return '';
    }
    const buffer = Buffer.alloc(maxBytes);
    const fd = fs.openSync(filePath, 'r');
    const bytesRead = fs.readSync(fd, buffer, 0, maxBytes, 0);
    fs.closeSync(fd);
    return buffer.toString('utf-8', 0, bytesRead);
  } catch (error) {
    console.error('[Gemini Service] Error reading file snippet:', error);
    return '';
  }
};

export const summarizeFileContent = async (fileName: string, mimeType: string, contentText: string): Promise<string> => {
  const client = getGeminiClient();
  if (!client) {
    return `[Local Analysis Summary for ${fileName}]\nThis file "${fileName}" (${mimeType}) has been registered in FileSync. Configure GEMINI_API_KEY on server to enable AI-powered deep summaries.`;
  }

  try {
    const prompt = `You are FileSync AI. Provide a concise, clear, and professional summary for the following file named "${fileName}" (Type: ${mimeType}):\n\nContent:\n${contentText.substring(0, 8000)}`;
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || `Summary generated for ${fileName}.`;
  } catch (error: any) {
    console.error('[Gemini Service] Summarize error:', error);
    return `Unable to summarize file via Gemini API: ${error.message || 'API error'}`;
  }
};

export const generateContentInsights = async (fileName: string, mimeType: string, contentText: string): Promise<string[]> => {
  const client = getGeminiClient();
  if (!client) {
    return [
      `Key File Property: Name is "${fileName}" (${mimeType}).`,
      `Storage Verification: Integrity hash confirmed upon upload.`,
      `Productivity Tip: Configure GEMINI_API_KEY in server/.env for automated AI insight extraction.`,
    ];
  }

  try {
    const prompt = `You are FileSync AI. Analyze the file named "${fileName}" (Type: ${mimeType}) and extract 4-6 key structured insights, bullet points, or action items.\n\nContent:\n${contentText.substring(0, 8000)}`;
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const rawText = response.text || '';
    const lines = rawText
      .split('\n')
      .map((l) => l.replace(/^[-*•\d.]+\s*/, '').trim())
      .filter((l) => l.length > 5);

    return lines.length > 0 ? lines : [rawText];
  } catch (error: any) {
    console.error('[Gemini Service] Insights error:', error);
    return [`Error generating insights via Gemini: ${error.message || 'API error'}`];
  }
};

export const answerContextualQuery = async (fileName: string, mimeType: string, contentText: string, userQuery: string): Promise<string> => {
  const client = getGeminiClient();
  if (!client) {
    return `[FileSync Local Response] You asked: "${userQuery}". To get contextual AI responses using Google Gemini, please set GEMINI_API_KEY in backend environment.`;
  }

  try {
    const prompt = `You are FileSync AI assistant. Based on the file "${fileName}" (${mimeType}), answer the user's question directly and concisely.\n\nFile Content Context:\n${contentText.substring(0, 8000)}\n\nUser Question: ${userQuery}`;
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || 'No response generated.';
  } catch (error: any) {
    console.error('[Gemini Service] Query error:', error);
    return `Gemini API query error: ${error.message || 'API call failed'}`;
  }
};
