import prisma from '@/lib/prisma';
import { CollapsibleContext } from '@/components/collapsible-context';
import { StartFollowupButton } from './StartFollowupButton';

export default async function Page({ params }: { params: { id: string } }) {
  const followup = await prisma.followup.findUnique({
    where: {
      id: parseInt(params.id),
    },
    include: {
      userClient: true,
      agent: true,
      messages: {
        where: {
          role: {
            not: 'system',
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  });

  if (!followup) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-xl text-gray-600'>Follow Up not found</div>
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto p-6 space-y-8'>
      {/* Header Section */}
      <div className='bg-white rounded-lg shadow-md p-6'>
        <div className='flex items-center justify-between mb-4'>
          <h1 className='text-2xl font-bold text-gray-800'>
            {followup.userClient.name}
          </h1>
          <span className='px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium'>
            {followup.agent.name}
          </span>
          <span className='px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium'>
            {followup.status}
          </span>
        </div>
        <div className='space-y-4'>
          <CollapsibleContext context={followup.context ?? ''} />
          <div className='text-gray-600'>
            <h2 className='text-sm font-semibold text-gray-500 mb-1'>
              Follow-up Date
            </h2>
            <p className='text-gray-700'>
              {followup.followupDate?.toLocaleString()}
            </p>
          </div>
          <StartFollowupButton followup={followup} />
        </div>
      </div>

      {/* Messages Section */}
      <div className='bg-white rounded-lg shadow-md p-6'>
        <h2 className='text-xl font-semibold text-gray-800 mb-4'>Messages</h2>
        <div className='space-y-4'>
          {followup.messages.map((message) => (
            <div
              key={message.id}
              className='p-4 bg-gray-50 rounded-lg border border-gray-100'
            >
              <p className='text-gray-700'>
                {message.role}: {message.createdAt.toLocaleString()}
              </p>
              <p className='text-gray-700'>{message.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
