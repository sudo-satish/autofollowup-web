import { Socket } from 'socket.io';
import redis from './redis';

export const bindSocketEvents = (socket: Socket) => {
  socket.on('generate-whatsapp-qr-code', (data: { companyId: string }) => {
    //   redis.publish('generate-whatsapp-qr-code', JSON.stringify(data));
  });
  redis.subscribe('whatsapp-qr-code-generated', (message) => {
    socket.emit('whatsapp-qr-code-generated', message);
  });
};
