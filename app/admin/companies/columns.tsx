'use client';

import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

export type Company = {
  id: number;
  name: string;
  address: string | null;
  website: string | null;
  description: string | null;
};

export const columns: ColumnDef<Company>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'clerkId',
    header: 'Clerk ID',
  },
  {
    accessorKey: 'address',
    header: 'Address',
  },
  {
    header: 'Actions',
    cell: ({ row }) => {
      return <Link href={`/admin/companies/${row.original.id}`}>View</Link>;
    },
  },
];
