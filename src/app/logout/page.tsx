'use client';

import { useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LogoutPage() {
  const { signOut } = useClerk();

  // router
  const router = useRouter();

  // logout
  useEffect(() => {
    const handleLogout = async () => {
      await signOut();
      router.push('/');
    };

    handleLogout();
  }, [signOut, router]);

  return (
    <div className="h-screen flex items-center justify-center bg-customSkyLight">
      <div className="text-center">
        {/* title */}
        <h1 className="text-xl font-semibold mb-2">Logging out...</h1>
        {/* description */}
        <p className="text-gray-600">Please wait while we sign you out.</p>
      </div>
    </div>
  );
}
