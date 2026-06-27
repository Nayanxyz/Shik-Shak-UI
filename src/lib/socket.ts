import { io, Socket } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5500'

let socket: Socket | null = null

export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, {
  path: '/socket.io/',
  transports: ['websocket', 'polling'],
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  randomizationFactor: 0.5,
  autoConnect: false,
});
    
    // Prevent duplicate connections on StrictMode remounts
    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
  }
  
  // Ensure connected before returning
  if (!socket.connected) {
    socket.connect();
  }
  
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect()
    socket.removeAllListeners()
    socket = null
  }
}

export function isSocketConnected(): boolean {
  return socket !== null && socket.connected
}