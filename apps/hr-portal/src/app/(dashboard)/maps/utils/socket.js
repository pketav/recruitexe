// src/app/(dashboard)/maps/utils/socket.js

import { io } from "socket.io-client";

// Use the environment variable for the WebSocket URL
const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'https://your-tracking-socket-server.com';

// Initialize the Socket.IO client
const socket = io(socketUrl, {
  transports: ["websocket"], // Use WebSocket transport explicitly
  autoConnect: false,        // Don't connect automatically - we'll connect when needed
  path: "/socket.io/",       // Socket.IO default path
  reconnectionAttempts: 5,   // Try to reconnect 5 times
  reconnectionDelay: 1000,   // Start with 1 second delay
  reconnectionDelayMax: 5000, // Maximum delay between reconnections
  timeout: 20000             // Connection timeout
});

// Add event listeners and logging
socket.on('connect', () => {
  console.log('Connected to tracking WebSocket server!');
});

socket.on('connect_error', (err) => {
  console.error('Socket connection error:', err.message);
});

socket.on('disconnect', (reason) => {
  console.log('Disconnected from WebSocket server:', reason);
});

// Export the socket instance
export default socket;
