import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { items } from './sidebar-menu-items';
import Unauthorized from '@/components/unauthorized';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();

  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  const isSuperAdmin = user.privateMetadata.role === 'super_admin';

  if (!isSuperAdmin) {
    return <Unauthorized />;
  }
  return (
    <SidebarProvider>
      <AppSidebar items={items} />
      <main className='w-full p-5'>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
