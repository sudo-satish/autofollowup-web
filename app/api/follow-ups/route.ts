import prisma from '@/lib/prisma';
import { createFollowup, deleteFollowup } from '@/services/follow-up';
import { ForbiddenError, sendErrorResponse } from '@/utils/errors';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: Request) {
  // For example, fetch data from your DB here
  const agents = await prisma.followup.findMany();
  return new Response(JSON.stringify(agents), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(request: Request) {
  // Parse the request body
  const body = await request.json();
  const { agent, client, context, dateTime } = body;

  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    return sendErrorResponse(new ForbiddenError('User not found'));
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      clerkId: clerkUserId,
    },
  });

  try {
    const followup = await createFollowup({
      agent,
      client,
      context,
      dateTime,
      user,
    });

    return new Response(JSON.stringify(followup), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return sendErrorResponse(error as Error);
  }
}

export async function DELETE(request: Request) {
  const body = await request.json();
  const { id } = body;

  const followup = await deleteFollowup(id);

  return new Response(JSON.stringify(followup), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
