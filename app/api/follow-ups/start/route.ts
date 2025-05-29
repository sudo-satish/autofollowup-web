import { initateAgentConversation } from '@/services/follow-up';

export async function POST(request: Request) {
  const body = await request.json();
  const { followupId } = body;

  await initateAgentConversation(+followupId);

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
