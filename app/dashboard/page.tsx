import { auth, clerkClient } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Unauthorized from '@/components/unauthorized';

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

  console.log(rest, user.privateMetadata);
  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
}
