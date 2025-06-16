'use client';

import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Check, CheckCheck } from 'lucide-react';

interface Message {
  _data: {
    body: string;
    fromMe: boolean;
    notifyName: string;
    t: number;
    id: {
      _serialized: string;
    };
    ack: number;
  };
  fromMe: boolean;
  body: string;
  timestamp: number;
}

interface WhatsappMessageThreadProps {
  messages: Message[];
}

export default function WhatsappMessageThread({
  messages,
}: WhatsappMessageThreadProps) {
  return (
    <div className='flex flex-col space-y-4 p-4 bg-gray-50 rounded-lg'>
      {messages.map((message, index) => (
        <motion.div
          key={message._data.id._serialized}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`flex ${message.fromMe ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[70%] rounded-lg p-3 ${
              message.fromMe
                ? 'bg-green-100 text-gray-800'
                : 'bg-white text-gray-800'
            }`}
          >
            <div className='flex items-center gap-2 mb-1'>
              <span className='text-sm font-medium'>
                {message.fromMe ? 'You' : message._data.notifyName}
              </span>
              <span className='text-xs text-gray-500'>
                {format(message.timestamp * 1000, 'HH:mm')}
              </span>
            </div>
            <p className='text-sm'>{message.body}</p>
            {message.fromMe && (
              <div className='flex justify-end mt-1'>
                {message._data.ack === 3 ? (
                  <CheckCheck className='w-4 h-4 text-blue-500' />
                ) : (
                  <Check className='w-4 h-4 text-gray-400' />
                )}
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
