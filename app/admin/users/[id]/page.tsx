import prisma from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Globe, Calendar, User } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      company: true,
    },
  });

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className='container mx-auto py-8'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold text-gray-900'>{user.name}</h1>
        <Button asChild>
          <Link href='/admin/users'>Back to Users</Link>
        </Button>
      </div>

      <div className='grid gap-6'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <User className='h-5 w-5' />
              User Information
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <p className='text-sm font-medium text-gray-500'>Created At</p>
                <div className='flex items-center gap-2'>
                  <Calendar className='h-4 w-4 text-gray-400' />
                  <p className='text-gray-900'>
                    {format(user.createdAt, 'MMMM d, yyyy')}
                  </p>
                </div>
              </div>

              {user.email && (
                <div className='space-y-2'>
                  <p className='text-sm font-medium text-gray-500'>Email</p>
                  <div className='flex items-center gap-2'>
                    <Globe className='h-4 w-4 text-gray-400' />
                    <a
                      href={user.email}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-600 hover:text-blue-800 hover:underline'
                    >
                      {user.email}
                    </a>
                  </div>
                </div>
              )}

              {user.company && (
                <div className='space-y-2'>
                  <p className='text-sm font-medium text-gray-500'>Company</p>
                  <p className='text-gray-900'>{user.company.name}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
