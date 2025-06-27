import prisma from '@/lib/prisma';
import { CollapsibleContext } from '@/components/collapsible-context';
import { StartFollowupButton } from './components/StartFollowupButton';
import { formatDateTime } from '@/utils/date-time';
import { ResetFollowupButton } from './components/ResetFollowupButton';
import { Messages } from './components/Messages';
import { AutoModeSwitch } from './components/AutoModeSwitch';
import { MessageInput } from './components/MessageInput';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const followup = await prisma.followup.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      client: true,
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
    <>
      <div className='max-w-4xl mx-auto p-6 space-y-8'>
        {/* Header Section */}
        <div className='bg-white rounded-lg shadow-md p-6'>
          <div className='flex items-center justify-between mb-4'>
            <h1 className='text-2xl font-bold text-gray-800'>
              {followup.client.name}
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

            <div className='flex gap-12'>
              <div className='text-gray-600'>
                <h2 className='text-sm font-semibold text-gray-500 mb-1'>
                  Follow-up Date
                </h2>
                <p className='text-gray-700'>
                  {formatDateTime(followup.followupDate ?? new Date())}
                </p>
              </div>
              <div className='text-gray-600'>
                <h2 className='text-sm font-semibold text-gray-500 mb-1'>
                  Auto Mode
                </h2>
                <p className='text-gray-700'>
                  <AutoModeSwitch followup={followup} />
                </p>
              </div>
            </div>
            <StartFollowupButton followup={followup} />
            <ResetFollowupButton followup={followup} />
          </div>
        </div>

        {/* Messages Section */}
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h2 className='text-xl font-semibold text-gray-800 mb-4'>Messages</h2>
          <div className='mb-20'>
            <Messages followupId={followup.id} />
          </div>
          <div className='fixed bottom-0 left-[16rem] right-0 max-w-4xl mx-auto px-6 pb-6'>
            <MessageInput followup={followup} />
          </div>
        </div>
      </div>
    </>
  );
}
