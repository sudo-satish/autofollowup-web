'use client';

import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { KnowledgeBase } from '@/lib/generated/prisma';

export const columns: ColumnDef<KnowledgeBase>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => {
      return new Date(row.getValue('createdAt')).toLocaleDateString();
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const knowledgeBase = row.original;
      return (
        <Button asChild variant='ghost' size='sm'>
          <Link href={`/dashboard/knowledge-base/${knowledgeBase.id}`}>
            View
          </Link>
        </Button>
      );
    },
  },
];
