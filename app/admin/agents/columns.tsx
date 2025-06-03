'use client';

import { Agent } from '@/lib/generated/prisma';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

export const columns: ColumnDef<Agent>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    header: 'Actions',
    cell: ({ row }) => {
      return (
        <div className='flex gap-2'>
          <Link href={`/admin/agents/${row.original.id}`}>View</Link>
          <Link href={`/admin/agents/${row.original.id}/edit`}>Edit</Link>
        </div>
      );
    },
  },
];
