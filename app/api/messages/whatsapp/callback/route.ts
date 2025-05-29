import {
  getFollowupByConversationSid,
  onUserMessage,
} from '@/services/follow-up';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const body = searchParams.get('Body');
  const eventType = searchParams.get('EventType');
  const conversationSid = searchParams.get('ConversationSid');

  if (eventType === 'onMessageAdded' && body && conversationSid) {
    const followup = await getFollowupByConversationSid(conversationSid);
    if (followup) {
      await onUserMessage(followup.id, body);
    }
  }

  return new Response('OK', { status: 200 });
}
