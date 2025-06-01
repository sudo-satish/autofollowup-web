'use client';

import { Followup } from '@/lib/generated/prisma';
import { useState } from 'react';

export const MessageInput = ({ followup }: { followup: Followup }) => {
  const [input, setInput] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (followup.isAutoMode) {
      return;
    }
    if (!input.trim()) {
      return;
    }
    await fetch(`/api/follow-ups/${followup.id}/message`, {
      method: 'POST',
      body: JSON.stringify({ message: input }),
    });
    setInput('');
    console.log(input, followup);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };
  return (
    <form onSubmit={handleSubmit} className='w-full max-w-2xl mx-auto'>
      <div className='relative group flex items-center'>
        <input
          className='w-full px-6 py-4 text-lg bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 
          focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 
          transition-all duration-300 ease-in-out shadow-sm
          placeholder:text-gray-400 dark:placeholder:text-gray-500
          hover:border-gray-300 dark:hover:border-gray-600
          focus:outline-none focus:shadow-lg
          transform hover:scale-[1.01] focus:scale-[1.02] pr-16'
          placeholder='Say something...'
          value={input}
          onChange={handleInputChange}
        />
        <button
          type='submit'
          className='absolute right-3 p-2 rounded-xl bg-blue-500 hover:bg-blue-600 
          text-white transition-all duration-300 ease-in-out
          hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
          disabled:hover:scale-100 disabled:hover:bg-blue-500
          focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 cursor-pointer'
          disabled={!input.trim() || followup.isAutoMode}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='currentColor'
            className='w-5 h-5 transform rotate-45'
          >
            <path d='M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z' />
          </svg>
        </button>
        <div
          className='absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-blue-500/0 
          group-hover:from-blue-500/5 group-hover:via-blue-500/10 group-hover:to-blue-500/5 
          transition-all duration-500 ease-in-out pointer-events-none'
        />
      </div>
    </form>
  );
};
