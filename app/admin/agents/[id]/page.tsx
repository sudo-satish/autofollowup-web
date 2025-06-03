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
  const agent = await prisma.agent.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!agent) {
    return <div>Agent not found</div>;
  }

  return (
    <div className='container mx-auto py-8'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold text-gray-900'>{agent.name}</h1>
        <Button asChild>
          <Link href='/admin/agents'>Back to Agents</Link>
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
                    {format(agent.createdAt, 'MMMM d, yyyy')}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {agent.systemPrompt && (
            <div className='space-y-2'>
              <p className='text-sm font-medium text-gray-500'>System Prompt</p>
              <p className='text-gray-900'>{agent.systemPrompt}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
