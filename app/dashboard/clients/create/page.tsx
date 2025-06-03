import PageLayout from '@/components/page-layout';
import { ClientForm } from '../clients-form';
import PageHeader from '@/components/page-header';
import { getUserCompanyId } from '@/services/clerk';

export default async function Page() {
  const companyId = await getUserCompanyId();

  return (
    <PageLayout>
      <PageHeader
        rightMenu={[]}
        leftMenu={[]}
        title='Create Client'
        showBackButton={true}
        backButtonHref='/dashboard/clients'
      />
      <ClientForm companyId={companyId} />
    </PageLayout>
  );
}
