import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

export class WebSocketService {
  private socket: Socket | null = null;
  private token: string | null = null;

  connect(token: string) {
    if (this.socket) {
      return;
    }

    this.token = token;
    this.socket = io(SOCKET_URL, {
      auth: {
        token,
      },
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.token = null;
    }
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
