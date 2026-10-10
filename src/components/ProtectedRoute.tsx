'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  allowedRoles = ['admin', 'staff', 'super_admin'],
  redirectTo = '/admin/login'
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If not loading and no user, redirect to login
    if (!loading && !user) {
      router.push(redirectTo);
      return;
    }

    // If user exists but doesn't have required role, redirect
    if (!loading && user && allowedRoles.length > 0) {
      if (!allowedRoles.includes(user.role)) {
        // Redirect based on user role
        if (user.role === 'landlord') {
          router.push('/landlord/dashboard');
        } else {
          router.push('/');
        }
      }
    }
  }, [user, loading, router, allowedRoles, redirectTo]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#f58c55] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  // Show redirecting message if no user
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#f58c55] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-700">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-50">
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-red-700 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-[#f58c55] hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // Render children if user is authenticated and authorized
  return <>{children}</>;
}