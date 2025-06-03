import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import PageLayout from '@/components/page-layout';
import PageHeader from '@/components/page-header';
import { DataTable } from '@/components/data-table';
import { columns, User } from './columns';
import prisma from '@/lib/prisma';

export default async function CompanyPage() {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) {
    redirectToSignIn();
  }

  const users = await prisma.user.findMany({
    include: {
      company: true,
    },
  });

  return (
    <PageLayout>
      <PageHeader
        rightMenu={[
          <Button asChild>
            <Link href='/admin/users/create'>Create User</Link>
          </Button>,
        ]}
        leftMenu={[]}
        title='Users'
        showBackButton={false}
        backButtonHref='/dashboard'
      />
      <DataTable columns={columns} data={users as User[]} />
    </PageLayout>
  );
}
