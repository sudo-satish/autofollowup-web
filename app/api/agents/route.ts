import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  // For example, fetch data from your DB here
  const agents = await prisma.agent.findMany();
  return new Response(JSON.stringify(agents), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(request: Request) {
  // Parse the request body
  const body = await request.json();
  const { name, systemPrompt } = body;

  // e.g. Insert new user into your DB
  const newAgent = await prisma.agent.create({
    data: {
      name,
      systemPrompt,
    },
  });

  return new Response(JSON.stringify(newAgent), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, name, systemPrompt } = body;

  const updatedAgent = await prisma.agent.update({
    where: { id },
    data: { name, systemPrompt },
  });

  return new Response(JSON.stringify(updatedAgent), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
