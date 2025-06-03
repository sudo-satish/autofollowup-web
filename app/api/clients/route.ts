import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  // For example, fetch data from your DB here
  const agents = await prisma.client.findMany();
  return new Response(JSON.stringify(agents), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(request: Request) {
  // Parse the request body
  const body = await request.json();
  const { name, phone, countryCode, companyId } = body;

  const client = await prisma.client.create({
    data: {
      name,
      phone,
      countryCode,
      companyId,
    },
  });

  // e.g. Insert new user into your DB
  const newUser = { id: client.id, name, phone, countryCode, companyId };

  return new Response(JSON.stringify(newUser), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
}
