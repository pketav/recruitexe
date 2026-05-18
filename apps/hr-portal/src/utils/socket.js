import { io } from "socket.io-client";

// Use the environment variable for the WebSocket URL
const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;

// Initialize the Socket.IO client
const socket = io(socketUrl, {
  transports: ["websocket"], // Use WebSocket transport explicitly
  autoConnect: true,         // Automatically connect
  path: "/socket.io/",       // Socket.IO default path
});

// Export the socket instance
export default socket;
