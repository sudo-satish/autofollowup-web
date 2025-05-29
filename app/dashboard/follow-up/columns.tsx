'use client';

import { Button } from '@/components/ui/button';
import { deleteFollowup } from '@/services/follow-up';
import { Agent, UserClient } from '@/shared/types';
import { ColumnDef } from '@tanstack/react-table';
import { TrashIcon } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Followup = {
  id: number;
  userClient: UserClient;
  agent: Agent;
  followupDate: Date | null;
  context: string | null;
};

export const columns: ColumnDef<Followup>[] = [
  {
    accessorKey: 'userClient.name',
    header: 'Client',
  },
  {
    accessorKey: 'agent.name',
    header: 'Agent',
  },
  {
    accessorKey: 'followupDate',
    header: 'Followup Date & Time',
  },
  {
    accessorKey: 'view',
    header: 'View',
    cell: ({ row }) => {
      const router = useRouter();
      return (
        <div className='flex gap-2'>
          <Button variant='outline' size='sm' asChild>
            <Link href={`/dashboard/follow-up/${row.original.id}`}>View</Link>
          </Button>
          <Button
            variant='destructive'
            size='sm'
            className='cursor-pointer'
            onClick={async () => {
              await fetch(`/api/follow-ups`, {
                method: 'DELETE',
                body: JSON.stringify({ id: row.original.id }),
              }).then((res) => {
                if (res.ok) {
                  toast.success('Followup deleted successfully');
                  router.refresh();
                } else {
                  toast.error('Failed to delete followup');
                }
              });
            }}
          >
            <TrashIcon className='w-4 h-4' />
            Delete
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'context',
    header: 'Context',
  },
];
