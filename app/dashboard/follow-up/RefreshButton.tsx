'use client';

import { Button } from '@/components/ui/button';
import { RefreshCcwIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function RefreshButton() {
  const router = useRouter();
  return (
    <Button
      variant='outline'
      size='sm'
      className='cursor-pointer'
      onClick={() => {
        router.refresh();
      }}
    >
      <RefreshCcwIcon className='w-4 h-4' /> Refresh
    </Button>
  );
}
