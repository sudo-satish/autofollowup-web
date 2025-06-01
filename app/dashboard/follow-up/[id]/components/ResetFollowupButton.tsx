'use client';

import { Button } from '@/components/ui/button';
import { Followup } from '@/lib/generated/prisma';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function ResetFollowupButton({ followup }: { followup: Followup }) {
  const router = useRouter();
  if (followup.status === 'SCHEDULED') {
    return null;
  }

  return (
    <div className='flex justify-end'>
      <Button
        variant='outline'
        size='sm'
        className='cursor-pointer'
        onClick={() => {
          fetch('/api/follow-ups/reset', {
            method: 'POST',
            body: JSON.stringify({ followupId: followup.id }),
          }).then((res) => {
            if (res.ok) {
              router.refresh();
              toast.success('Follow-up reset');
            }
          });
        }}
      >
        Reset Follow-up
      </Button>
    </div>
  );
}
