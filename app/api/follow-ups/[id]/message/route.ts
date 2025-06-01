import prisma from '@/lib/prisma';
import { sendMessage } from '@/services/twillio';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const body = await request.json();
  const { message } = body;

  const followup = await prisma.followup.update({
    where: { id: parseInt(id) },
    data: { messages: { create: { content: message, role: 'assistant' } } },
  });

  if (!followup.conversationSid) {
    return new Response(
      JSON.stringify({ error: 'Conversation SID not found' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  await sendMessage({
    message: message,
    conversationSid: followup.conversationSid,
  });

  return new Response(JSON.stringify(followup), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
