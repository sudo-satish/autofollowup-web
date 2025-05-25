'use client';

import { Button } from '@/components/ui/button';
import { Followup } from '@/lib/generated/prisma';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function StartFollowupButton({ followup }: { followup: Followup }) {
  const router = useRouter();
  return (
    <div className='flex justify-end'>
      {followup.status === 'DRAFT' ||
        (followup.status === 'SCHEDULED' && (
          <Button
            variant='outline'
            size='sm'
            className='cursor-pointer'
            onClick={() => {
              fetch('/api/follow-ups/start', {
                method: 'POST',
                body: JSON.stringify({ followupId: followup.id }),
              }).then((res) => {
                if (res.ok) {
                  router.refresh();
                  toast.success('Follow-up started');
                }
              });
            }}
          >
            Start Follow-up
          </Button>
        ))}
    </div>
  );
}
