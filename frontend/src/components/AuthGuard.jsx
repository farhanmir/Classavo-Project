'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';

export default function AuthGuard({ children, requireAuth = true, requiredRole = null }) {
  const router = useRouter();
  const { user, isAuthenticated, hasInitialized } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wait for auth initialization to complete
    if (!hasInitialized) {
      return;
    }

    // Check authentication status
    if (requireAuth && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    // Check role requirement
    if (requiredRole && isAuthenticated) {
      if (user?.profile?.role !== requiredRole) {
        router.push('/');
        return;
      }
    }

    setIsLoading(false);
  }, [hasInitialized, isAuthenticated, user, requireAuth, requiredRole, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}
