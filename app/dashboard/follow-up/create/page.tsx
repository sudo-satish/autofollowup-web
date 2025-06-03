import PageLayout from '@/components/page-layout';
import { FollowUpForm } from './follow-up-form';
import PageHeader from '@/components/page-header';
import { getUserCompanyId } from '@/services/clerk';

export default async function Page() {
  const companyId = await getUserCompanyId();

  return (
    <PageLayout>
      <PageHeader
        rightMenu={[]}
        leftMenu={[]}
        title='Create Follow Up'
        showBackButton={true}
        backButtonHref='/dashboard/follow-up'
      />
      <FollowUpForm companyId={companyId} />
    </PageLayout>
  );
}
