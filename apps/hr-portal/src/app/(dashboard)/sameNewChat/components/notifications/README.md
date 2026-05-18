# 🔔 React Notification System

A comprehensive, reusable notification system for React applications with real-time chat integration, browser notifications, online status tracking, and more.

## 📋 Features

- ✅ **Real-time Notifications** - Socket.io integration for instant notifications
- ✅ **Browser Notifications** - Native desktop notifications with permission handling
- ✅ **Online/Offline Status** - Real-time user presence tracking
- ✅ **Typing Indicators** - Live typing status for chat applications
- ✅ **Snackbar Notifications** - Beautiful in-app notification toasts
- ✅ **Notification Panel** - Full notification history and management
- ✅ **Auto Chat Refresh** - Automatic chat list updates on new messages
- ✅ **Customizable** - Easy to style and configure
- ✅ **TypeScript Ready** - Full TypeScript support (optional)
- ✅ **Mobile Responsive** - Works perfectly on all devices

## 🚀 Quick Start

### 1. Wrap your app with NotificationManager

```jsx
import { NotificationManager } from './components/notifications'

function App() {
  return (
    <NotificationManager>
      <YourAppContent />
    </NotificationManager>
  )
}
```

### 2. Add notification button to your header

```jsx
import { NotificationButton } from './components/notifications'

function Header() {
  return (
    <AppBar>
      <Toolbar>
        <Typography variant="h6">My App</Typography>
        <NotificationButton />
      </Toolbar>
    </AppBar>
  )
}
```

### 3. Use notifications anywhere in your app

```jsx
import { useNotifications } from './components/notifications'

function MyComponent() {
  const { showSuccess, showError, unreadCount } = useNotifications()

  const handleSuccess = () => {
    showSuccess('Operation completed successfully!')
  }

  const handleError = () => {
    showError('Something went wrong!', 'Error')
  }

  return (
    <div>
      <p>Unread notifications: {unreadCount}</p>
      <button onClick={handleSuccess}>Show Success</button>
      <button onClick={handleError}>Show Error</button>
    </div>
  )
}
```

## 📚 Components

### NotificationManager
The main provider component that wraps your entire app.

```jsx
<NotificationManager 
  defaultSettings={{
    browserNotifications: true,
    soundNotifications: true,
    showSnackbar: true,
    maxNotifications: 50
  }}
  position={{ vertical: 'top', horizontal: 'right' }}
>
  <App />
</NotificationManager>
```

### NotificationButton
A button component that shows notification count and opens the notification panel.

```jsx
<NotificationButton 
  size="medium"           // 'small' | 'medium' | 'large'
  color="inherit"         // MUI color prop
  animated={true}         // Enable/disable animations
  showPanel={true}        // Show/hide notification panel on click
/>
```

### NotificationDisplay
Handles the display of snackbar notifications and notification panel.

```jsx
<NotificationDisplay 
  showPanel={isOpen}
  onTogglePanel={setIsOpen}
  position={{ vertical: 'top', horizontal: 'right' }}
/>
```

## 🎣 Hook API

### useNotifications()

```jsx
const {
  // State
  notifications,              // Array of all notifications
  onlineUsers,               // Set of online user IDs
  showNotificationSnackbar,   // Current snackbar state
  latestNotification,        // Most recent notification
  notificationSettings,      // Current settings
  
  // Getters
  unreadCount,              // Total unread notifications
  getUnreadCount,           // Function to get unread count
  getConversationUnreadCount, // Get unread count for specific conversation
  isUserOnline,             // Check if user is online
  
  // Quick notification methods
  showSuccess,              // Show success notification
  showError,                // Show error notification
  showInfo,                 // Show info notification
  showWarning,              // Show warning notification
  
  // Advanced methods
  addNotification,          // Add custom notification
  markNotificationAsRead,   // Mark specific notification as read
  markAllAsRead,           // Mark all notifications as read
  clearAllNotifications,   // Clear all notifications
  clearNotification,       // Clear specific notification
  markConversationNotificationsAsRead, // Mark conversation notifications as read
  updateSettings,          // Update notification settings
  
  // UI Control
  closeSnackbar,           // Close current snackbar
} = useNotifications()
```

## 🔧 Configuration

### Notification Settings

```jsx
const settings = {
  browserNotifications: true,    // Enable browser notifications
  soundNotifications: true,      // Enable notification sounds
  showSnackbar: true,           // Show snackbar notifications
  maxNotifications: 50          // Maximum notifications to keep
}

// Update settings
updateSettings(settings)
```

### Custom Notification

```jsx
addNotification({
  id: 'custom-123',             // Optional: custom ID
  type: 'message',              // 'message' | 'status' | 'custom' | 'success' | 'error' | 'info' | 'warning'
  title: 'New Message',         // Notification title
  message: 'Hello from John!',  // Notification content
  senderName: 'John Doe',       // Sender name
  senderAvatar: '/avatar.jpg',  // Sender avatar URL
  conversationId: 'conv-123',   // Associated conversation ID
  timestamp: new Date().toISOString(), // Custom timestamp
  isRead: false                 // Read status
})
```

## 🎨 Styling

### CSS Classes Available

```css
/* Notification animations */
.notification-pulse { /* Pulsing animation */ }
.notification-shake { /* Shake animation */ }
.online-pulse { /* Online indicator pulse */ }
.unread-badge { /* Unread count badge */ }

/* Typing indicator */
.typing-indicator { /* Typing indicator container */ }
.typing-dot { /* Individual typing dots */ }

/* Status classes */
.status-online { color: #4caf50; }
.status-offline { color: #f44336; }
.status-typing { color: #ff9800; }
```

### Custom Styling

```jsx
// Custom theme for Material-UI components
const theme = createTheme({
  // Your custom theme
})

<ThemeProvider theme={theme}>
  <NotificationManager>
    <App />
  </NotificationManager>
</ThemeProvider>
```

## 🔔 Browser Notifications

The system automatically requests notification permission and shows native browser notifications when:

1. User grants permission
2. Browser notifications are enabled in settings
3. New messages/notifications arrive

### Permission Handling

```jsx
// Permission is automatically requested, but you can also manually request
if (Notification.permission === 'default') {
  Notification.requestPermission().then(permission => {
    // Handle the permission result if custom UI needs it
  })
}
```

## 🌐 Socket Integration

The notification system automatically integrates with your socket service. Make sure your socket service includes these events:

```javascript
// Required socket events
socket.on('message:notification', (data) => {
  // Handled automatically by NotificationProvider
})

socket.on('user:status', (data) => {
  // Handled automatically for online/offline status
})

socket.on('typing:start', (data) => {
  // Handled automatically for typing indicators
})

socket.on('typing:stop', (data) => {
  // Handled automatically for typing indicators
})
```

## 📱 Mobile Support

The notification system is fully responsive and includes:

- Touch-friendly notification panel
- Responsive breakpoints
- Mobile-optimized animations
- Proper viewport handling

## 🎯 Events

The system dispatches custom events that you can listen to:

```jsx
// Listen for new notifications
window.addEventListener('newNotification', (event) => {
  const notification = event.detail
  // Handle the notification payload
})

// Listen for conversation open requests
window.addEventListener('openConversation', (event) => {
  const { conversationId, notification } = event.detail
  // Handle opening the conversation
})
```

## 🔊 Sound Notifications

Add a notification sound file to your public folder:

```
public/
  └── notification-sound.mp3
```

The system will automatically play this sound when `soundNotifications` is enabled.

## 🚫 Troubleshooting

### Notifications not showing?
1. Check if NotificationManager wraps your app
2. Verify socket connection is working
3. Check browser notification permissions
4. Ensure notification settings are correct

### Socket events not working?
1. Verify socket service is properly configured
2. Check that required event listeners are set up
3. Ensure user authentication is working

### Styling issues?
1. Check if Material-UI theme is properly configured
2. Verify CSS classes are not being overridden
3. Ensure responsive breakpoints are working

## 📄 License

MIT License - feel free to use in your projects!

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## 📞 Support

If you need help integrating this notification system, please create an issue with your specific use case.
