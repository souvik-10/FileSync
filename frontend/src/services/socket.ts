import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initSocket = (userId?: string): Socket => {
  if (!socket) {
    socket = io(window.location.origin, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    socket.on('connect', () => {
      console.log('[Socket] Connected to server, ID:', socket?.id);
      if (userId) {
        socket?.emit('join-user-room', userId);
      }
    });

    socket.on('disconnect', () => {
      console.log('[Socket] Disconnected from server');
    });
  }

  if (userId && socket.connected) {
    socket.emit('join-user-room', userId);
  }

  return socket;
};

export const getSocket = (): Socket | null => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
