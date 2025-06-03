import prisma from '@/lib/prisma';
import { createOrganisation } from '@/services/clerk';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  const { name, address, website, description } = await req.json();

  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  const organisation = await createOrganisation({ name });

  const company = await prisma.company.create({
    data: { name, address, website, description, clerkId: organisation.id },
  });

  return NextResponse.json(company);
};

export const GET = async (req: NextRequest) => {
  const companies = await prisma.company.findMany();
  return NextResponse.json(companies);
};
