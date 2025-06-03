import prisma from '@/lib/prisma';
import {
  createOrganisationMembership,
  createUser,
  updateUser,
} from '@/services/clerk';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  console.log(body);

  const company = await prisma.company.findUnique({
    where: {
      id: body.companyId,
    },
  });

  if (!company) {
    return NextResponse.json({ message: 'Company not found' }, { status: 404 });
  }

  const clerkUser = await createUser({
    name: body.name,
    email: body.email,
    password: body.password,
  });
  const user = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      companyId: body.companyId,
      clerkId: clerkUser.id,
    },
  });

  await updateUser(clerkUser.id, {
    externalId: user.id.toString(),
  });

  await createOrganisationMembership(clerkUser.id, {
    organizationId: company.clerkId,
    role: 'org:admin',
  });

  return NextResponse.json({ message: 'User created successfully' });
};
