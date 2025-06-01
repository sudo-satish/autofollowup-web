import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const followupId = request.nextUrl.searchParams.get('followupId');
  const messages = await prisma.message.findMany({
    where: {
      followupId: parseInt(followupId!),
      role: {
        not: 'system',
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  return NextResponse.json(messages);
}
