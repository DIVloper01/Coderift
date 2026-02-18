import { Server } from 'socket.io';

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Make io globally accessible
  global.io = io;

  io.on('connection', (socket) => {
    console.log(`✅ Socket connected: ${socket.id}`);

    // Join contest room
    socket.on('joinContest', (contestId) => {
      socket.join(`contest-${contestId}`);
      console.log(`User ${socket.id} joined contest ${contestId}`);
    });

    // Leave contest room
    socket.on('leaveContest', (contestId) => {
      socket.leave(`contest-${contestId}`);
      console.log(`User ${socket.id} left contest ${contestId}`);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`❌ Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};
