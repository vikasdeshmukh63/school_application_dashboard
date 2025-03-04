import { auth } from '@clerk/nextjs/server';

export async function getUserRole() {
  const { sessionClaims } = await auth();
  return (sessionClaims?.metaData as { role?: string })?.role;
}
