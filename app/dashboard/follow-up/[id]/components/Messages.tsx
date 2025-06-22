'use client';

import { Message } from '@/lib/generated/prisma';
import { formatDateTime } from '@/utils/date-time';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const Messages = ({ followupId }: { followupId: number }) => {
  const fetchMessages = async () => {
    const response = await fetch(`/api/messages?followupId=${followupId}`);
    const data = await response.json();
    setMessages(data);
  };

  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    fetchMessages();
    // const interval = setInterval(() => {
    //   fetchMessages();
    // }, 5000);

    // return () => clearInterval(interval);
  }, []);

  return (
    <div className='space-y-6 p-4 max-w-4xl mx-auto'>
      {messages.map((message, index) => (
        <motion.div
          key={message.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className={`flex ${
            message.role === 'assistant' ? 'justify-start' : 'justify-end'
          }`}
        >
          <div
            className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
              message.role === 'assistant'
                ? 'bg-white border border-gray-100'
                : 'bg-blue-50 border border-blue-100'
            }`}
          >
            <p
              className={`text-gray-800 leading-relaxed ${
                message.role === 'assistant' ? 'text-left' : 'text-right'
              }`}
            >
              {message.content}
            </p>
            <div className='mt-2 flex items-center gap-2'>
              {message.role === 'assistant' ? (
                <p className='text-gray-500 text-xs flex items-center gap-2'>
                  <span className='font-medium text-blue-600'>
                    {message.role}
                  </span>
                  <span className='text-gray-400'>•</span>
                  <span>{formatDateTime(message.createdAt)}</span>
                </p>
              ) : (
                <p className='text-gray-500 text-xs flex items-center gap-2 ml-auto'>
                  <span>{formatDateTime(message.createdAt)}</span>
                  <span className='text-gray-400'>•</span>
                  <span className='font-medium text-blue-600'>
                    {message.role}
                  </span>
                </p>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
