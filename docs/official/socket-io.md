# Socket.IO Documentation

**Repository Version:** ^4.8.0  
**Official Documentation:** https://socket.io  
**Last Updated:** April 2026

## Overview

Socket.IO is a real-time bidirectional event-based communication library. It enables real-time messaging between web clients and servers with features like automatic reconnection, binary support, multiplexing through namespaces, and room-based broadcasting.

### Core Philosophy

Socket.IO abstracts WebSocket complexity while providing fallbacks for environments where WebSockets aren't supported. It prioritizes reliability and ease of use over raw performance, making real-time features accessible without deep networking knowledge.

### Why Socket.IO?

- **Real-Time Bidirectional**: Instant data flow between client and server
- **Automatic Reconnection**: Handles connection drops gracefully
- **Binary Support**: Send blobs, buffers, and files
- **Room Broadcasting**: Target specific groups of clients
- **Namespace Multiplexing**: Separate concerns with socket namespaces
- **Fallback Transport**: Works even when WebSockets are blocked

---

## Installation

### Package Installation

```bash
# Server
pnpm add socket.io

# Client
pnpm add socket.io-client

# Types (if needed separately)
pnpm add -D @types/socket.io
```

### Repository Setup

In `pnpm-workspace.yaml`:

```yaml
catalog:
  socket.io: '^4.8.0'
  'socket.io-client': '^4.8.0'
```

In package `package.json`:

```json
{
  "dependencies": {
    "socket.io-client": "catalog:"
  },
  "devDependencies": {
    "@types/socket.io": "catalog:"
  }
}
```

---

## Server Setup

### Basic Server

```typescript
// server/socket.ts
import { Server } from 'socket.io';
import { createServer } from 'http';
import express from 'express';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
  // Ping configuration
  pingTimeout: 60000,
  pingInterval: 25000,
  // Transport options
  transports: ['websocket', 'polling'],
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Handle disconnection
  socket.on('disconnect', (reason) => {
    console.log('User disconnected:', socket.id, reason);
  });
});

httpServer.listen(3001, () => {
  console.log('Socket.IO server running on port 3001');
});
```

### Next.js Integration

```typescript
// app/api/socket/route.ts
import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  if ((global as any).io) {
    return NextResponse.json({ success: true, status: 'already-running' });
  }
  
  const res = await fetch('http://localhost:3001');
  
  return NextResponse.json({ success: true });
}

// Alternative: Custom server approach
// server.ts (run separately)
import next from 'next';
import { createServer } from 'http';
import { Server } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(handle);
  const io = new Server(server);
  
  io.on('connection', (socket) => {
    console.log('Connected:', socket.id);
  });
  
  server.listen(3000);
});
```

---

## Client Setup

### React Hook

```typescript
// hooks/useSocket.ts
'use client';

import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

export function useSocket(url: string) {
  const socketRef = useRef<Socket | null>(null);
  
  useEffect(() => {
    const socket = io(url, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    
    socketRef.current = socket;
    
    return () => {
      socket.disconnect();
    };
  }, [url]);
  
  const emit = useCallback((event: string, data: any) => {
    socketRef.current?.emit(event, data);
  }, []);
  
  const on = useCallback((event: string, callback: (data: any) => void) => {
    socketRef.current?.on(event, callback);
    return () => {
      socketRef.current?.off(event, callback);
    };
  }, []);
  
  return { socket: socketRef.current, emit, on };
}
```

### Component Usage

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useSocket } from '@/hooks/useSocket';

export function ChatRoom({ roomId }: { roomId: string }) {
  const { emit, on } = useSocket('http://localhost:3001');
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  
  useEffect(() => {
    // Join room
    emit('join-room', roomId);
    
    // Listen for messages
    const unsubscribe = on('message', (msg: string) => {
      setMessages((prev) => [...prev, msg]);
    });
    
    return () => {
      emit('leave-room', roomId);
      unsubscribe();
    };
  }, [roomId, emit, on]);
  
  const sendMessage = () => {
    emit('send-message', { roomId, message: input });
    setInput('');
  };
  
  return (
    <div>
      {messages.map((msg, i) => (
        <div key={i}>{msg}</div>
      ))}
      <input 
        value={input} 
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
```

---

## Events

### Basic Events

```typescript
// Server
io.on('connection', (socket) => {
  // Emit to specific client
  socket.emit('welcome', 'Hello, client!');
  
  // Broadcast to all except sender
  socket.broadcast.emit('new-user', 'A user joined');
  
  // Listen for events
  socket.on('message', (data) => {
    console.log('Received:', data);
  });
  
  // Acknowledgment pattern
  socket.on('compute', (data, callback) => {
    const result = data * 2;
    callback(result);
  });
});

// Client
socket.emit('message', 'Hello server!');

socket.on('welcome', (data) => {
  console.log(data);
});

// With acknowledgment
socket.emit('compute', 5, (result: number) => {
  console.log('Result:', result); // 10
});
```

### Typed Events

```typescript
// types/socket.ts
interface ServerToClientEvents {
  message: (data: { id: string; text: string; user: string }) => void;
  userJoined: (user: { id: string; name: string }) => void;
  userLeft: (userId: string) => void;
  typing: (userId: string) => void;
}

interface ClientToServerEvents {
  sendMessage: (text: string) => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
  typing: (roomId: string) => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  userId: string;
  userName: string;
}

// Server with types
import { Server, Socket } from 'socket.io';

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(server);

io.on('connection', (socket) => {
  socket.on('sendMessage', (text) => {
    io.emit('message', {
      id: crypto.randomUUID(),
      text,
      user: socket.data.userName,
    });
  });
});

// Client with types
import { io, Socket } from 'socket.io-client';

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(url);
```

---

## Rooms

### Room Management

```typescript
io.on('connection', (socket) => {
  // Join room
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
    
    // Notify room members
    socket.to(roomId).emit('user-joined', socket.id);
  });
  
  // Leave room
  socket.on('leave-room', (roomId) => {
    socket.leave(roomId);
    socket.to(roomId).emit('user-left', socket.id);
  });
  
  // Send to room
  socket.on('room-message', ({ roomId, message }) => {
    io.to(roomId).emit('message', {
      from: socket.id,
      text: message,
    });
  });
  
  // Get rooms
  console.log(socket.rooms); // Set of room IDs
});

// Room utilities
io.to('room1').emit('event', 'data');           // To specific room
io.except('room1').emit('event', 'data');      // To all except room
io.in('room1').in('room2').emit('event', 'data'); // Multiple rooms
```

### Dynamic Rooms

```typescript
// Chat application example
io.on('connection', (socket) => {
  socket.on('create-room', async (roomName, callback) => {
    const roomId = generateRoomId();
    await socket.join(roomId);
    
    // Store room metadata
    rooms.set(roomId, {
      name: roomName,
      createdBy: socket.id,
      createdAt: new Date(),
    });
    
    callback({ success: true, roomId });
  });
  
  socket.on('list-rooms', (callback) => {
    const roomList = Array.from(rooms.entries()).map(([id, meta]) => ({
      id,
      ...meta,
      userCount: io.sockets.adapter.rooms.get(id)?.size || 0,
    }));
    callback(roomList);
  });
});
```

---

## Namespaces

### Namespace Definition

```typescript
// Main namespace (default)
io.on('connection', (socket) => {
  // General connections
});

// Admin namespace
const adminNamespace = io.of('/admin');

adminNamespace.use((socket, next) => {
  // Admin authentication middleware
  if (socket.handshake.auth.token === 'admin-secret') {
    next();
  } else {
    next(new Error('Unauthorized'));
  }
});

adminNamespace.on('connection', (socket) => {
  console.log('Admin connected:', socket.id);
  
  socket.on('broadcast', (message) => {
    io.emit('admin-message', message);
  });
});

// Chat namespace
const chatNamespace = io.of('/chat');

chatNamespace.on('connection', (socket) => {
  socket.on('private-message', ({ to, message }) => {
    chatNamespace.to(to).emit('private-message', {
      from: socket.id,
      message,
    });
  });
});

// Client connection to namespace
const adminSocket = io('/admin', { auth: { token: 'admin-secret' } });
const chatSocket = io('/chat');
```

---

## Middleware

### Authentication Middleware

```typescript
// Server middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    return next(new Error('Authentication required'));
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.data.userId = decoded.userId;
    socket.data.userName = decoded.name;
    next();
  } catch (err) {
    next(new Error('Invalid token'));
  }
});

// Namespace-specific middleware
adminNamespace.use(async (socket, next) => {
  const user = await db.user.findById(socket.data.userId);
  
  if (user?.role !== 'admin') {
    return next(new Error('Admin access required'));
  }
  
  next();
});
```

### Rate Limiting Middleware

```typescript
import { RateLimiterMemory } from 'rate-limiter-flexible';

const rateLimiter = new RateLimiterMemory({
  keyPrefix: 'socket_limit',
  points: 10,
  duration: 1,
});

io.use(async (socket, next) => {
  try {
    await rateLimiter.consume(socket.handshake.address);
    next();
  } catch {
    next(new Error('Too many requests'));
  }
});
```

---

## Advanced Features

### Binary Data

```typescript
// Sending files
socket.on('upload', (file: ArrayBuffer, callback) => {
  // Save file
  fs.writeFileSync('upload.png', Buffer.from(file));
  callback({ success: true });
});

// Client
const file = await fetch('image.png').then(r => r.arrayBuffer());
socket.emit('upload', file, (response) => {
  console.log(response);
});

// Streaming
const stream = fs.createReadStream('large-file.zip');
stream.pipe(socket);
```

### Volatile Events

```typescript
// Volatile events (dropped if client can't receive)
setInterval(() => {
  socket.volatile.emit('position', { x, y });
}, 100);

// Useful for real-time updates where old data is irrelevant
```

### Compression

```typescript
const io = new Server(server, {
  perMessageDeflate: {
    threshold: 1024, // Compress messages > 1KB
  },
});
```

---

## Best Practices

### Connection Management

```typescript
io.on('connection', (socket) => {
  // Set connection metadata
  socket.data.connectedAt = new Date();
  
  // Heartbeat check
  const interval = setInterval(() => {
    if (socket.disconnected) {
      clearInterval(interval);
      return;
    }
    socket.emit('ping');
  }, 30000);
  
  // Cleanup on disconnect
  socket.on('disconnect', () => {
    clearInterval(interval);
    cleanupUserResources(socket.id);
  });
});
```

### Error Handling

```typescript
socket.on('error', (error) => {
  console.error('Socket error:', error);
});

// Event error handling
socket.on('action', async (data, callback) => {
  try {
    const result = await performAction(data);
    callback({ success: true, data: result });
  } catch (error) {
    callback({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});
```

### Scaling with Redis

```typescript
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

const pubClient = createClient({ url: 'redis://localhost:6379' });
const subClient = pubClient.duplicate();

io.adapter(createAdapter(pubClient, subClient));
```

---

## Resources

- **Official Docs**: https://socket.io/docs
- **GitHub**: https://github.com/socketio/socket.io
- **Examples**: https://github.com/socketio/socket.io/tree/main/examples

---

## Version Notes

- **v4.8.x**: Current stable
- Repository uses catalog version `^4.8.0`
