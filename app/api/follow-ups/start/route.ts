import prisma from '@/lib/prisma';
import { initateAgentConversation } from '@/services/follow-up';
import redis from '@/services/redis';

export async function POST(request: Request) {
  const body = await request.json();
  const { followupId } = body;

  if (!redis.client.isOpen) {
    await redis.connect();
  }

  await initateAgentConversation(+followupId);

  await prisma.followup.update({
    where: { id: followupId },
    data: {
      status: 'IN_PROGRESS',
    },
  });

  return new Response(
    JSON.stringify({
      success: true,
      message: 'Followup started successfully',
    }),
    {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
