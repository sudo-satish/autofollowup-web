import { auth, clerkClient } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Unauthorized from '@/components/unauthorized';
import prisma from '@/lib/prisma';
import WhatsappQRCode from './components/WhatsappQRCode';
import { SocketProvider } from '@/components/socket';

export default async function Page() {
  const { userId, has, ...rest } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  const isSuperAdmin = user.privateMetadata.role === 'super_admin';

  if (isSuperAdmin) {
    return <Unauthorized />;
  }

  const company = await prisma.company.findFirst({
    where: {
      clerkId: rest.orgId!,
    },
    include: {
      WhatsappConnection: true,
    },
  });

  const whatsappConnection = await prisma.whatsappConnection.findFirst({
    where: {
      companyId: company?.id,
    },
  });

  return (
    <div>
      <h1>Dashboard</h1>

      {!whatsappConnection && company?.id && (
        <SocketProvider>
          <WhatsappQRCode companyId={company.id.toString()} />
        </SocketProvider>
      )}
    </div>
  );
}
