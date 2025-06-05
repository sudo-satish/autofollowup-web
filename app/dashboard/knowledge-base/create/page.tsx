import PageLayout from '@/components/page-layout';
import { KnowledgeBaseForm } from './knowledge-base-form';
import PageHeader from '@/components/page-header';
import { getUserCompanyId } from '@/services/clerk';

export default async function Page() {
  const companyId = await getUserCompanyId();

  return (
    <PageLayout>
      <PageHeader
        rightMenu={[]}
        leftMenu={[]}
        title='Create Knowledge Base'
        showBackButton={true}
        backButtonHref='/dashboard/knowledge-base'
      />
      <KnowledgeBaseForm companyId={companyId} />
    </PageLayout>
  );
}
