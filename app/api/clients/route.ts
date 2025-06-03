import { Prisma } from '@/lib/generated/prisma';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  // For example, fetch data from your DB here
  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get('companyId');
  const where: Prisma.ClientWhereInput = {};

  if (companyId) {
    where.companyId = +companyId;
  }

  const agents = await prisma.client.findMany({
    where,
  });
  return new Response(JSON.stringify(agents), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(request: Request) {
  // Parse the request body
  const body = await request.json();
  const { name, mobileNumber, countryCode, companyId } = body;

  console.log(body);

  const client = await prisma.client.create({
    data: {
      name,
      phone: mobileNumber,
      countryCode,
      companyId,
    },
  });

  // e.g. Insert new user into your DB
  const newUser = {
    id: client.id,
    name,
    phone: mobileNumber,
    countryCode,
    companyId,
  };

  return new Response(JSON.stringify(newUser), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
}
