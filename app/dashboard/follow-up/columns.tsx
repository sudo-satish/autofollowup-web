'use client';

import { Button } from '@/components/ui/button';
import { Agent } from '@/shared/types';
import { ColumnDef } from '@tanstack/react-table';
import { TrashIcon } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { ContextDialog } from './ContextDialog';
import { formatDateTime } from '@/utils/date-time';
import { Client } from '@/lib/generated/prisma';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Followup = {
  id: number;
  client: Client;
  agent: Agent;
  followupDate: Date | null;
  context: string | null;
};

export const columns: ColumnDef<Followup>[] = [
  {
    accessorKey: 'client.name',
    header: 'Client',
  },
  {
    accessorKey: 'agent.name',
    header: 'Agent',
  },
  {
    accessorKey: 'followupDate',
    header: 'Followup Date & Time',
    cell: ({ row }) => {
      return (
        <div>{formatDateTime(row.original.followupDate ?? new Date())}</div>
      );
    },
  },

  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    header: 'Context',
    cell: ({ row }) => {
      return <ContextDialog context={row.original.context ?? ''} />;
    },
  },
  {
    accessorKey: 'view',
    header: 'Actions',
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
];
