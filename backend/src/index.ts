import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import cors from 'cors';
import path from 'path';

import { connectDB } from './config/db.js';
import { initSocketServer } from './services/socketService.js';

import authRoutes from './routes/authRoutes.js';
import fileRoutes from './routes/fileRoutes.js';
import transferRoutes from './routes/transferRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Connect to MongoDB
connectDB();

// Initialize Socket.io Server
initSocketServer(server);

// Configure Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check API Route
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    system: 'FileSync API Platform',
    timestamp: new Date().toISOString(),
  });
});

// Register Core Resource API Routes
app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/transfers', transferRoutes);
app.use('/api/ai', aiRoutes);

// Serve uploads statically if authorized or for preview
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// 404 Route Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'Resource route not found' });
});

// Centralized Error Handling Middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Global Backend Error]:', err);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`🚀 FileSync Server running on http://localhost:${PORT}`);
  console.log(`⚡ Real-Time Socket.io enabled`);
  console.log(`===================================================`);
});

export default app;
