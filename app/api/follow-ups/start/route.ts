import { invokeAgent, generateFollowupMessages } from '@/services/agent';
import { startFollowup } from '@/services/follow-up';

export async function POST(request: Request) {
  // Parse the request body
  const body = await request.json();
  const { followupId } = body;

  //   const followup = await startFollowup(followupId);

  const followup = await generateFollowupMessages(followupId);
  const message = await invokeAgent(followup);

  return new Response(JSON.stringify(message), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
}
