'use client';

import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

export type User = {
  id: number;
  name: string;
  companyId?: number;
  company?: {
    name: string;
  };
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'company.name',
    header: 'Company',
    cell: ({ row }) => {
      return (
        <Link href={`/admin/companies/${row.original.companyId}`}>
          {row.original.company?.name}
        </Link>
      );
    },
  },
  {
    header: 'Actions',
    cell: ({ row }) => {
      return <Link href={`/admin/users/${row.original.id}`}>View</Link>;
    },
  },
];
