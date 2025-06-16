'use client';

import { SocketContext, SocketProvider } from '@/components/socket';
import { useContext, useEffect } from 'react';

const SocketTest = () => {
  const socket = useContext(SocketContext);

  useEffect(() => {
    socket?.on('connect', () => {
      console.log('connected');
    });
  }, [socket]);

  return (
    <div>
      <div>Test Socket {socket?.id}</div>
      <button onClick={() => socket?.emit('test')}>Test</button>
    </div>
  );
};

export default function TestSocket() {
  return (
    <SocketProvider>
      <SocketTest />
    </SocketProvider>
  );
}
