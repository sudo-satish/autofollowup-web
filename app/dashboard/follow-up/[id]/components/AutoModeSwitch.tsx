'use client';

import { Switch } from '@/components/ui/switch';
import { Followup } from '@/lib/generated/prisma';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const AutoModeSwitch = ({ followup }: { followup: Followup }) => {
  const router = useRouter();

  const [isActive, setIsActive] = useState(followup.isAutoMode);

  return (
    <Switch
      id='auto-mode'
      className='cursor-pointer'
      checked={isActive}
      onCheckedChange={async (checked) => {
        setIsActive(checked);
        await fetch(`/api/follow-ups/${followup.id}`, {
          method: 'PUT',
          body: JSON.stringify({ isAutoMode: checked }),
        });

        router.refresh();
      }}
    />
  );
};
