import prisma from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Globe, MapPin, Building2, Calendar } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const company = await prisma.company.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!company) {
    return <div>Company not found</div>;
  }

  return (
    <div className='container mx-auto py-8'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold text-gray-900'>{company.name}</h1>
        <Button asChild>
          <Link href='/admin/companies'>Back to Companies</Link>
        </Button>
      </div>

      <div className='grid gap-6'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Building2 className='h-5 w-5' />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <p className='text-sm font-medium text-gray-500'>Created At</p>
                <div className='flex items-center gap-2'>
                  <Calendar className='h-4 w-4 text-gray-400' />
                  <p className='text-gray-900'>
                    {format(company.createdAt, 'MMMM d, yyyy')}
                  </p>
                </div>
              </div>

              {company.website && (
                <div className='space-y-2'>
                  <p className='text-sm font-medium text-gray-500'>Website</p>
                  <div className='flex items-center gap-2'>
                    <Globe className='h-4 w-4 text-gray-400' />
                    <a
                      href={company.website}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-600 hover:text-blue-800 hover:underline'
                    >
                      {company.website}
                    </a>
                  </div>
                </div>
              )}

              {company.address && (
                <div className='space-y-2'>
                  <p className='text-sm font-medium text-gray-500'>Address</p>
                  <div className='flex items-center gap-2'>
                    <MapPin className='h-4 w-4 text-gray-400' />
                    <p className='text-gray-900'>{company.address}</p>
                  </div>
                </div>
              )}
            </div>

            {company.description && (
              <div className='space-y-2'>
                <p className='text-sm font-medium text-gray-500'>Description</p>
                <p className='text-gray-900 whitespace-pre-wrap'>
                  {company.description}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
