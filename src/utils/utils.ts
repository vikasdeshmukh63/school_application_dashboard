import { auth } from '@clerk/nextjs/server';

export async function getUserRole() {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  return role;
}

export async function getUserId() {
  const { userId } = await auth();
  return userId;
}
