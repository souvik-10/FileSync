import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';

let io: Server | null = null;

export const initSocketServer = (httpServer: HttpServer): Server => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);

    // Join user room for targeted notifications
    socket.on('join-user-room', (userId: string) => {
      if (userId) {
        const roomName = `user:${userId}`;
        socket.join(roomName);
        console.log(`[Socket.io] Socket ${socket.id} joined room ${roomName}`);
      }
    });

    // Handle client sending direct live transfer message/status
    socket.on('send-transfer-message', (data: { transferId: string; recipientId: string; message: string; senderName: string }) => {
      if (data.recipientId) {
        io?.to(`user:${data.recipientId}`).emit('receive-transfer-message', data);
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.io] Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error('Socket.io has not been initialized!');
  }
  return io;
};

// Helper function to emit real-time transfer updates to sender & recipient
export const notifyTransferUpdate = (
  senderId: string,
  recipientId: string,
  event: string,
  payload: any
): void => {
  if (!io) return;
  io.to(`user:${senderId}`).emit(event, payload);
  io.to(`user:${recipientId}`).emit(event, payload);
};
