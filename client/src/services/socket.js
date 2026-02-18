import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    if (!this.socket) {
      this.socket = io('http://localhost:5000', {
        transports: ['websocket'],
        autoConnect: true,
      });

      this.socket.on('connect', () => {
        console.log('✅ Socket connected:', this.socket.id);
      });

      this.socket.on('disconnect', () => {
        console.log('❌ Socket disconnected');
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinContest(contestId) {
    if (this.socket) {
      this.socket.emit('joinContest', contestId);
    }
  }

  leaveContest(contestId) {
    if (this.socket) {
      this.socket.emit('leaveContest', contestId);
    }
  }

  onLeaderboardUpdate(callback) {
    if (this.socket) {
      this.socket.on('leaderboardUpdate', callback);
    }
  }

  onSubmissionUpdate(callback) {
    if (this.socket) {
      this.socket.on('submissionUpdate', callback);
    }
  }

  onContestStatusChange(callback) {
    if (this.socket) {
      this.socket.on('contestStatusChange', callback);
    }
  }

  off(event) {
    if (this.socket) {
      this.socket.off(event);
    }
  }
}

export default new SocketService();
