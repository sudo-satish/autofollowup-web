import { auth, clerkClient } from '@clerk/nextjs/server';

export const getClerkClient = async () => {
  const client = await clerkClient();
  return client;
};

export const getUser = async () => {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) {
    redirectToSignIn();
  }
  const client = await getClerkClient();
  const user = await client.users.getUser(userId!);
  return user;
};

export const getUserMetadata = async () => {
  const user = await getUser();
  return user.privateMetadata as { role: string };
};

export const createOrganisation = async ({ name }: { name: string }) => {
  const client = await getClerkClient();
  const organisation = await client.organizations.createOrganization({
    name,
  });
  return organisation;
};

export const createUser = async ({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) => {
  const client = await getClerkClient();
  const user = await client.users.createUser({
    firstName: name,
    emailAddress: [email],
    password: password,
  });
  return user;
};

export const updateUser = async (
  clerkId: string,
  {
    externalId,
  }: {
    externalId: string;
  }
) => {
  const client = await getClerkClient();
  const user = await client.users.updateUser(clerkId, {
    externalId,
  });
  return user;
};

export const createOrganisationMembership = async (
  clerkId: string,
  {
    organizationId,
    role,
  }: {
    organizationId: string;
    role: 'org:admin' | 'org:member';
  }
) => {
  const client = await getClerkClient();
  const membership = await client.organizations.createOrganizationMembership({
    organizationId,
    userId: clerkId,
    role,
  });
  return membership;
};
