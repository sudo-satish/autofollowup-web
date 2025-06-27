import prisma from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const body = await request.json();
  const { isAutoMode } = body;

  const followup = await prisma.followup.update({
    where: { id: parseInt(id) },
    data: { isAutoMode },
  });

  return new Response(JSON.stringify(followup), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
