'use client';

import { SocketContext } from '@/components/socket';
import { useContext, useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2, XCircle, Smartphone } from 'lucide-react';
import WhatsappMessageThread from './WhatsappMessageThread';

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export default function WhatsappQRCode({ companyId }: { companyId: string }) {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const socket = useContext(SocketContext);

  useEffect(() => {
    if (!socket) return;

    setStatus('connecting');

    socket.on('connect', () => {
      setError(null);
      socket.emit('generate-whatsapp-qr-code', { companyId });
    });

    socket.on('whatsapp-qr-code-generated', (message) => {
      console.log('whatsapp-qr-code-generated', message.qr);
      setQrCode(message.qr);
    });

    socket.on('whatsapp-qr-code-connected', (message) => {
      console.log('whatsapp-qr-code-connected', message);
      setStatus('connected');
      setQrCode(null); // Clear QR code when connected
    });

    socket.on('whatsapp-message-created', (message) => {
      console.log('whatsapp-message-created', message);
      setMessages((prev) => [...prev, message]);
    });

    socket.on('whatsapp-qr-code-disconnected', (message) => {
      console.log('whatsapp-qr-code-disconnected', message);
      setStatus('disconnected');
    });

    socket.on('disconnect', () => {
      console.log('disconnected');
      setStatus('disconnected');
    });

    socket.on('error', (err) => {
      console.error('Socket error:', err);
      setStatus('error');
      setError('Connection error occurred');
    });

    return () => {
      socket.disconnect();
    };
  }, [companyId, socket]);

  const getStatusColor = (status: ConnectionStatus) => {
    switch (status) {
      case 'connected':
        return 'text-green-500';
      case 'connecting':
        return 'text-yellow-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: ConnectionStatus) => {
    switch (status) {
      case 'connected':
        return <CheckCircle2 className='w-5 h-5' />;
      case 'connecting':
        return <Loader2 className='w-5 h-5 animate-spin' />;
      case 'error':
        return <XCircle className='w-5 h-5' />;
      default:
        return <Smartphone className='w-5 h-5' />;
    }
  };

  return (
    <div className='max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-xl font-semibold text-gray-800'>
          WhatsApp Connection
        </h2>
        <div className={`flex items-center gap-2 ${getStatusColor(status)}`}>
          {getStatusIcon(status)}
          <span className='capitalize'>{status}</span>
        </div>
      </div>

      <AnimatePresence mode='wait'>
        {error ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className='p-4 bg-red-50 text-red-600 rounded-md mb-4'
          >
            {error}
          </motion.div>
        ) : null}

        {status === 'connected' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='flex flex-col'
          >
            <div className='mb-4 p-4 bg-green-50 text-green-700 rounded-lg flex items-center gap-2'>
              <CheckCircle2 className='w-5 h-5' />
              <span>WhatsApp Connected Successfully</span>
            </div>
            <div className='flex-1 min-h-[400px] max-h-[600px] overflow-y-auto'>
              <WhatsappMessageThread messages={messages} />
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className='flex flex-col items-center'
          >
            {status === 'connecting' && !qrCode ? (
              <div className='flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg w-full'>
                <Loader2 className='w-8 h-8 animate-spin text-gray-400 mb-4' />
                <p className='text-gray-600'>Generating QR code...</p>
              </div>
            ) : qrCode ? (
              <div className='flex flex-col items-center w-full'>
                <div className='p-4 bg-white rounded-lg shadow-sm mb-4'>
                  <QRCode
                    value={qrCode}
                    size={256}
                    className='w-full h-full'
                    level='H'
                  />
                </div>
                <p className='text-sm text-gray-600 text-center'>
                  Scan this QR code with your WhatsApp to connect
                </p>
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg w-full'>
                <Smartphone className='w-8 h-8 text-gray-400 mb-4' />
                <p className='text-gray-600'>Waiting to connect...</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
