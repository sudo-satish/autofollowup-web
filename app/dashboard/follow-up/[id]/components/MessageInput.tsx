'use client';

import { useState } from 'react';

export const MessageInput = () => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(input);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        className=''
        placeholder='Say something...'
        value={input}
        onChange={handleInputChange}
      />
    </form>
  );
};
