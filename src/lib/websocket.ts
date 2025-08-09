import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

export class WebSocketService {
  private socket: Socket | null = null;
  private token: string | null = null;

  private getSocket(): Socket {
    if (!this.socket) {
      throw new Error('Socket not initialized');
    }
    return this.socket;
  }

  connect(token: string) {
    // Disconnect existing socket if any
    this.disconnect();

    this.token = token;
    this.socket = io(SOCKET_URL, {
      auth: {
        token,
      },
      transports: ['websocket'],
      reconnectionAttempts: 3,
      reconnectionDelay: 1000,
    });

    // Set up event listeners
    if (this.socket) {
      this.socket.on('connect', () => {
        console.log('Connected to WebSocket server');
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from WebSocket server');
      });

      this.socket.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error);
        this.disconnect();
      });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }
    this.token = null;
  }

  onFileStatusUpdate(callback: (data: { fileId: string; status: string; error?: string }) => void) {
    if (!this.socket) return;
    this.socket.on('fileStatus', callback);
  }

  removeFileStatusListener() {
    if (!this.socket) return;
    this.socket.off('fileStatus');
  }
}

export const webSocketService = new WebSocketService();
