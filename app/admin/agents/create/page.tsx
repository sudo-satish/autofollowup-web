import PageLayout from '@/components/page-layout';
import PageHeader from '@/components/page-header';
import CreateUserForm from './agent-form';
import CreateAgentForm from './agent-form';

export default async function Page() {
  return (
    <PageLayout>
      <PageHeader
        rightMenu={[]}
        leftMenu={[]}
        title='Create User'
        showBackButton={true}
        backButtonHref='/admin/users'
      />
      <CreateAgentForm
        defaultValues={{
          name: '',
          systemPrompt: '',
        }}
      />
    </PageLayout>
  );
}
