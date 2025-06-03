import { Button } from '@/components/ui/button';
import { getUserMetadata } from '@/services/clerk';
import { SignedOut, UserButton } from '@clerk/nextjs';
import { SignedIn } from '@clerk/nextjs';
import { SignInButton } from '@clerk/nextjs';
import { useAuth } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function Home() {
  const { userId, orgRole } = await auth();
  const userMetadata = await getUserMetadata();

  console.log(userMetadata, orgRole);

  return (
    <div className='grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]'>
      Auth Follow Up
      <div>
        <SignedOut>
          <SignInButton>
            <Button>Sign In</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />

          {orgRole === 'org:admin' && <Link href='/dashboard'>Dashboard</Link>}
          {userMetadata.role === 'super_admin' && (
            <Link href='/admin' className='text-blue-500 hover:underline'>
              Admin
            </Link>
          )}
        </SignedIn>
      </div>
    </div>
  );
}
