import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const agent = await prisma.agent.findUnique({
    where: { id: parseInt(id) },
  });

  return new Response(JSON.stringify(agent), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const body = await request.json();
  const { name, systemPrompt } = body;

  const updatedAgent = await prisma.agent.update({
    where: { id: parseInt(id) },
    data: { name, systemPrompt },
  });

  return new Response(JSON.stringify(updatedAgent), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
