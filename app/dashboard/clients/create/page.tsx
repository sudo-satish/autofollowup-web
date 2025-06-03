import PageLayout from '@/components/page-layout';
import { ClientForm } from '../clients-form';
import PageHeader from '@/components/page-header';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export default async function Page() {
  const { orgId } = await auth();

  if (!orgId) {
    return <div>No organization found</div>;
  }

  const company = await prisma.company.findUnique({
    where: {
      clerkId: orgId,
    },
  });

  if (!company) {
    return <div>No company found</div>;
  }

  return (
    <PageLayout>
      <PageHeader
        rightMenu={[]}
        leftMenu={[]}
        title='Create Client'
        showBackButton={true}
        backButtonHref='/dashboard/clients'
      />
      <ClientForm companyId={company.id} />
    </PageLayout>
  );
}
