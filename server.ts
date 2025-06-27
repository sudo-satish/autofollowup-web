import 'dotenv/config';
import { createServer } from 'node:http';
import next from 'next';
import { Server } from 'socket.io';
import { parse } from 'url';
import { bindSocketEvents } from './services/socketio';
import redis from './services/redis';
import Message from './mongo/models/message';
import connectDB from './mongo/db';
import { onWhatsappMessage } from './services/follow-up';
import prisma from './lib/prisma';

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

redis.connect().then(() => {
  console.log('Connected to Redis');
});

connectDB();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
    transports: ['websocket', 'polling'],
    allowEIO3: true,
    path: '/api/socket',
  });

  redis.subscribe('whatsapp.message_create', async (message) => {
    try {
      if (message) {
        // console.log('whatsapp.message_create', message);
        const messageData = JSON.parse(message);
        const messageDoc = await Message.create({ message: messageData });
        await onWhatsappMessage(messageData);
      }
    } catch (error) {
      console.error('whatsapp-message-created', error);
    }
  });

  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('generate-whatsapp-qr-code', (data: { companyId: string }) => {
      redis.publish('generate-whatsapp-qr-code', JSON.stringify(data));
    });

    redis.subscribe('whatsapp:qr', (message) => {
      socket.emit('whatsapp-qr-code-generated', JSON.parse(message));
    });

    redis.subscribe('whatsapp:ready', (message) => {
      socket.emit('whatsapp-qr-code-connected', JSON.parse(message));
    });

    redis.subscribe('whatsapp.disconnected', async (message) => {
      socket.emit('whatsapp-qr-code-disconnected', JSON.parse(message));
    });

    // bindSocketEvents(socket);

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    socket.on('test', () => {
      console.log('test');
    });
  });

  httpServer.once('error', (err) => {
    console.error(err);
    process.exit(1);
  });
  httpServer.listen(port);

  console.log(
    `> Server listening at http://localhost:${port} as ${
      dev ? 'development' : process.env.NODE_ENV
    }`
  );
});
