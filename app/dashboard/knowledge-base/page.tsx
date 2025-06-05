import { Button } from '@/components/ui/button';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { KnowledgeBaseType } from '@/lib/generated/prisma';
import { PlusCircle } from 'lucide-react';

export default async function Page() {
  const data = await prisma.knowledgeBase.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div>
      <div className='container mx-auto py-10'>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-3xl font-bold'>Knowledge Base</h1>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          <Card className='hover:shadow-lg transition-shadow border-dashed border-2 border-gray-200 hover:border-gray-300'>
            <Link
              href='/dashboard/knowledge-base/create'
              className='block h-full'
            >
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-gray-600'>
                  <PlusCircle className='w-6 h-6' />
                  Add Knowledge Base
                </CardTitle>
                <CardDescription>
                  Create a new knowledge base entry
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-gray-500'>
                  Add documents, links, or other resources to your knowledge
                  base
                </p>
              </CardContent>
            </Link>
          </Card>
          {data.map((item) => (
            <Card key={item.id} className='hover:shadow-lg transition-shadow'>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>
                  <div className='flex items-center gap-2'>
                    <span className='text-xs bg-gray-100 px-2 py-1 rounded'>
                      {item.type}
                    </span>
                    <span>
                      Created on {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-gray-600 line-clamp-3'>
                  {item.content}
                </p>
                {item.url && (
                  <a
                    href={item.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-sm text-blue-600 hover:underline mt-2 block'
                  >
                    View Resource
                  </a>
                )}
              </CardContent>
              <CardFooter>
                <Button asChild variant='ghost' className='w-full'>
                  <Link href={`/dashboard/knowledge-base/${item.id}`}>
                    View Details
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
