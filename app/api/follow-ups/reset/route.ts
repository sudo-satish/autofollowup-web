import { resetFollowup } from '@/services/follow-up';
import redis from '@/services/redis';

export async function POST(request: Request) {
  const body = await request.json();
  const { followupId } = body;

  if (!redis.client.isOpen) {
    await redis.connect();
  }

  await resetFollowup(+followupId);

  return new Response(
    JSON.stringify({
      success: true,
      message: 'Followup reset successfully',
    }),
    {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
