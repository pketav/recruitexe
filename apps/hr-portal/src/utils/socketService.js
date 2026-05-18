import { io } from 'socket.io-client';

let socket = null;
let messageHandlers = [];
let typingHandlers = [];
let readReceiptHandlers = [];
let connectionHandlers = [];
let notificationHandlers = []; // Add notification handlers
let userStatusHandlers = []; // Add user status handlers
let reactionHandlers = []; // Add reaction handlers
let deleteHandlers = []; // Add delete handlers

// Configuration
 // Your backend URL

// Get userId from localStorage
const getUserIdFromToken = () => {
  try {
    const token = localStorage?.getItem('authToken');
    const tokenDecodablePart = token?.split('.')[1];
    const decoded = JSON.parse(atob(tokenDecodablePart));
    return decoded?.Id;
  } catch (err) {
    console.error('Error decoding token:', err);
    return null;
  }
};

console.log("token",getUserIdFromToken())

export const initSocket = () => {
  const userId = getUserIdFromToken();

  if (!userId) {
    console.error('Cannot initialize socket: No user ID found');
    return null;
  }

  if (socket) {
    socket.disconnect();
  }

  // Initialize socket connection
  socket = io(`${process.env.NEXT_PUBLIC_CHAT_SOCKET_URL}`, {
    transports: ["websocket"],
    auth: {
      token: localStorage.getItem('authToken'),
      // userId: userId
    },
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  console.log('Socket initialized:', socket);

  // Connection events
  socket.on('connect', () => {
    console.log('✅ Socket connected');
    connectionHandlers.forEach(handler => handler('connected'));
  });

  socket.on('disconnect', () => {
    console.log('❌ Socket disconnected');
    connectionHandlers.forEach(handler => handler('disconnected'));
  });

  socket.on('connect_error', (error) => {
    console.error('🔴 Socket connection error:', error);
    connectionHandlers.forEach(handler => handler('error', error));
  });

  socket.on('error', (error) => {
    console.error('🔴 Socket error:', error);
  });

  // Message events
  socket.on('message:received', (data) => {
    console.log('📨 Real-time message received:', data);
    messageHandlers.forEach(handler => handler('received', data));
  });

  socket.on('message:sent', (data) => {
    console.log('✅ Message sent confirmation:', data);
    messageHandlers.forEach(handler => handler('sent', data));
  });

  socket.on('message:failed', (data) => {
    console.log('❌ Message failed:', data);
    messageHandlers.forEach(handler => handler('failed', data));
  });

  socket.on('message:read', (data) => {
    console.log('👁️ Message read receipt:', data);
    readReceiptHandlers.forEach(handler => handler(data));
  });

  // Message notification event (for messages when not in room)
  socket.on('message:notification', (data) => {
    console.log('🔔 Message notification received:', data);
    notificationHandlers.forEach(handler => handler(data));
  });

  // Typing events - Updated to match backend
  socket.on('typing:update', (data) => {
    console.log('⌨️ Typing update received:', data);
    // data = { userId, conversationId, isTyping: true/false }
    typingHandlers.forEach(handler => {
      if (data.isTyping) {
        handler('start', data);
      } else {
        handler('stop', data);
      }
    });
  });

  // Keep old events for backward compatibility
  socket.on('typing:start', (data) => {
    console.log('⌨️ User started typing (legacy):', data);
    typingHandlers.forEach(handler => handler('start', data));
  });

  socket.on('typing:stop', (data) => {
    console.log('⏹️ User stopped typing (legacy):', data);
    typingHandlers.forEach(handler => handler('stop', data));
  });

  // User presence events
  socket.on('user:status', (data) => {
    console.log('👤 User status changed:', data);
    userStatusHandlers.forEach(handler => handler(data));
  });

  socket.on('user:online', (data) => {
    console.log('🟢 User came online:', data);
    userStatusHandlers.forEach(handler => handler({ ...data, status: 'online' }));
  });

  socket.on('user:offline', (data) => {
    console.log('🔴 User went offline:', data);
    userStatusHandlers.forEach(handler => handler({ ...data, status: 'offline' }));
  });

  // Room events
  socket.on('room:joined', (data) => {
    console.log('🏠 Joined room:', data);
  });

  socket.on('room:left', (data) => {
    console.log('🚪 Left room:', data);
  });

  // Message delivery status
  socket.on('message:delivered', (data) => {
    console.log('📬 Message delivered:', data);
    messageHandlers.forEach(handler => handler('delivered', data));
  });

  // Message read status
  socket.on('message:read_status', (data) => {
    console.log('👁️ Message read status:', data);
    readReceiptHandlers.forEach(handler => handler(data));
  });

  // Reaction events
  socket.on('message:reactionUpdated', (data) => {
    console.log('😊 Reaction updated:', data);
    reactionHandlers.forEach(handler => handler('updated', data));
  });

  socket.on('message:reactionSuccess', (data) => {
    console.log('✅ Reaction success:', data);
    reactionHandlers.forEach(handler => handler('success', data));
  });

  socket.on('message:reactionRemoved', (data) => {
    console.log('🗑️ Reaction removed:', data);
    reactionHandlers.forEach(handler => handler('removed', data));
  });

  socket.on('message:removeReactionSuccess', (data) => {
    console.log('✅ Reaction removed successfully:', data);
    reactionHandlers.forEach(handler => handler('removeSuccess', data));
  });

  socket.on('message:reactionNotification', (data) => {
    console.log('🔔 Reaction notification:', data);
    notificationHandlers.forEach(handler => handler(data));
  });

  // Delete events
  socket.on('message:deleted', (data) => {
    console.log('🗑️ Message deleted:', data);
    deleteHandlers.forEach(handler => handler('deleted', data));
  });

  socket.on('message:deleteForMeSuccess', (data) => {
    console.log('✅ Message deleted for me:', data);
    deleteHandlers.forEach(handler => handler('deleteForMeSuccess', data));
  });

  socket.on('message:deleteForEveryoneSuccess', (data) => {
    console.log('✅ Message deleted for everyone:', data);
    deleteHandlers.forEach(handler => handler('deleteForEveryoneSuccess', data));
  });

  socket.on('message:deletedForEveryone', (data) => {
    console.log('🗑️ Message deleted for everyone:', data);
    deleteHandlers.forEach(handler => handler('deletedForEveryone', data));
  });

  socket.on('message:updated', (data) => {
    console.log('✏️ Message updated:', data);
    messageHandlers.forEach(handler => handler('updated', data));
  });

  return socket;
};

export const getSocket = () => {
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    // Clean up event listeners
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }

  // Clear handlers
  messageHandlers = [];
  typingHandlers = [];
  readReceiptHandlers = [];
  connectionHandlers = [];
  notificationHandlers = [];
  userStatusHandlers = [];
  reactionHandlers = [];
  deleteHandlers = [];
};

// Event handler registration
export const onMessage = (handler) => {
  if (!messageHandlers.includes(handler)) {
    messageHandlers.push(handler);
  }

  // Return unsubscribe function
  return () => {
    messageHandlers = messageHandlers.filter(h => h !== handler);
  };
};

export const onTyping = (handler) => {
  if (!typingHandlers.includes(handler)) {
    typingHandlers.push(handler);
  }

  return () => {
    typingHandlers = typingHandlers.filter(h => h !== handler);
  };
};

export const onReadReceipt = (handler) => {
  if (!readReceiptHandlers.includes(handler)) {
    readReceiptHandlers.push(handler);
  }

  return () => {
    readReceiptHandlers = readReceiptHandlers.filter(h => h !== handler);
  };
};

export const onConnection = (handler) => {
  if (!connectionHandlers.includes(handler)) {
    connectionHandlers.push(handler);
  }

  return () => {
    connectionHandlers = connectionHandlers.filter(h => h !== handler);
  };
};

// Notification handler registration
export const onNotification = (handler) => {
  if (!notificationHandlers.includes(handler)) {
    notificationHandlers.push(handler);
  }

  return () => {
    notificationHandlers = notificationHandlers.filter(h => h !== handler);
  };
};

// User status handler registration
export const onUserStatus = (handler) => {
  if (!userStatusHandlers.includes(handler)) {
    userStatusHandlers.push(handler);
  }

  return () => {
    userStatusHandlers = userStatusHandlers.filter(h => h !== handler);
  };
};

// Room management
export const joinRoom = (conversationId) => {
  if (socket && socket.connected) {
    socket.emit('room:join', conversationId);
    console.log('🏠 Joining room:', conversationId);
  } else {
    console.error('❌ Socket not connected - cannot join room');
  }
};

export const leaveRoom = (conversationId) => {
  if (socket && socket.connected) {
    socket.emit('room:leave', conversationId);
    console.log('🚪 Leaving room:', conversationId);
  } else {
    console.error('❌ Socket not connected - cannot leave room');
  }
};

// Message operations
export const sendMessage = (data) => {
  if (socket && socket.connected) {
    socket.emit('message:send', data);
    console.log('📤 Sending message:', data);
    return true;
  } else {
    console.error('❌ Socket not connected - cannot send message');
    return false;
  }
};

export const markMessageAsRead = (conversationId, messageId) => {
  if (socket && socket.connected) {
    socket.emit('message:read', { conversationId, messageId });
    console.log('👁️ Marking message as read:', { conversationId, messageId });
  } else {
    console.error('❌ Socket not connected - cannot mark as read');
  }
};

// Typing indicators - Updated to match backend expectations
export const startTyping = (conversationId) => {
  if (socket && socket.connected) {
    socket.emit('typing:start', { conversationId });
    console.log('⌨️ Started typing in:', conversationId);
  }
};

export const stopTyping = (conversationId) => {
  if (socket && socket.connected) {
    socket.emit('typing:stop', { conversationId });
    console.log('⏹️ Stopped typing in:', conversationId);
  }
};

// Room update (for unread count refresh)
export const updateRoom = (conversationId) => {
  if (socket && socket.connected) {
    socket.emit('room:update', { conversationId });
    console.log('🔄 Updating room:', conversationId);
  }
};

// Utility functions
export const isSocketConnected = () => {
  return socket && socket.connected;
};

export const getSocketId = () => {
  return socket ? socket.id : null;
};

export const getCurrentUserId = () => {
  return getUserIdFromToken();
};

// Reaction handler registration
export const onReaction = (handler) => {
  if (!reactionHandlers.includes(handler)) {
    reactionHandlers.push(handler);
  }

  return () => {
    reactionHandlers = reactionHandlers.filter(h => h !== handler);
  };
};

// Delete handler registration
export const onDelete = (handler) => {
  if (!deleteHandlers.includes(handler)) {
    deleteHandlers.push(handler);
  }

  return () => {
    deleteHandlers = deleteHandlers.filter(h => h !== handler);
  };
};

// Reaction operations
export const reactToMessage = (messageId, emoji) => {
  if (socket && socket.connected) {
    socket.emit('message:react', { messageId, emoji });
    console.log('😊 Reacting to message:', { messageId, emoji });
    return true;
  } else {
    console.error('❌ Socket not connected - cannot react to message');
    return false;
  }
};

export const removeReaction = (messageId) => {
  if (socket && socket.connected) {
    socket.emit('message:removeReaction', { messageId });
    console.log('🗑️ Removing reaction from message:', messageId);
    return true;
  } else {
    console.error('❌ Socket not connected - cannot remove reaction');
    return false;
  }
};

// Delete message operations
export const deleteMessage = (conversationId, messageId, forBoth = false) => {
  if (socket && socket.connected) {
    socket.emit('message:delete', { conversationId, messageId, forBoth });
    console.log('🗑️ Deleting message:', { conversationId, messageId, forBoth });
    return true;
  } else {
    console.error('❌ Socket not connected - cannot delete message');
    return false;
  }
};

// Update message operation
export const updateMessage = (messageId, newContent, newContentType = 'text', fileInfo = {}) => {
  if (socket && socket.connected) {
    socket.emit('message:update', {
      messageId,
      newContent,
      newContentType,
      ...fileInfo
    });
    console.log('✏️ Updating message:', { messageId, newContent });
    return true;
  } else {
    console.error('❌ Socket not connected - cannot update message');
    return false;
  }
};
