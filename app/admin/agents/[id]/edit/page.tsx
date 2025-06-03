import prisma from '@/lib/prisma';
import CreateAgentForm from '../../create/agent-form';

export default async function EditAgentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const agent = await prisma.agent.findUnique({
    where: { id: parseInt(id) },
  });

  if (!agent) {
    return <div>Agent not found</div>;
  }

  return <CreateAgentForm defaultValues={agent} isEdit />;
}
