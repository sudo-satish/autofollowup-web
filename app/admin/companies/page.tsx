import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import PageLayout from '@/components/page-layout';
import PageHeader from '@/components/page-header';
import { DataTable } from '@/components/data-table';
import { columns } from './columns';
import prisma from '@/lib/prisma';

export default async function CompanyPage() {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) {
    redirectToSignIn();
  }

  const companies = await prisma.company.findMany();

  return (
    <PageLayout>
      <PageHeader
        rightMenu={[
          <Button asChild>
            <Link href='/admin/companies/create'>Create Company</Link>
          </Button>,
        ]}
        leftMenu={[]}
        title='Companies'
        showBackButton={false}
        backButtonHref='/dashboard'
      />
      <DataTable columns={columns} data={companies} />
    </PageLayout>
  );
}
