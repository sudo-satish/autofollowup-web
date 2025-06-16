import { getUserMetadata } from '@/services/clerk';
import { auth } from '@clerk/nextjs/server';
import LandingPage from './landing-page';

export default async function Home() {
  const { orgRole } = await auth();
  const userMetadata = await getUserMetadata();

  return (
    <LandingPage
      orgRole={orgRole || ''}
      userMetadata={userMetadata || { role: '' }}
    />
  );
}
