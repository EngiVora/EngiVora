"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAdminAuth } from "@/hooks/useAdminAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requireAuth = true,
  redirectTo = "/admin/login"
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, checkAuth } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || isLoading) return;

    const isAuthRequired = requireAuth;
    const userIsAuthenticated = checkAuth();

    // If authentication is required but user is not authenticated
    if (isAuthRequired && !userIsAuthenticated) {
      // Don't redirect if already on login page
      if (pathname !== "/admin/login") {
        router.replace(redirectTo);
        return;
      }
    }

    // If user is authenticated and trying to access login page
    if (userIsAuthenticated && pathname === "/admin/login") {
      router.replace("/admin/dashboard");
      return;
    }
  }, [isClient, isLoading, isAuthenticated, pathname, requireAuth, redirectTo, router, checkAuth]);

  // Show loading state during SSR and initial client render
  if (!isClient || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    // Show loading state while redirecting
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated but trying to access login page
  if (isAuthenticated && pathname === "/admin/login") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  // Render children if all checks pass
  return <>{children}</>;
}

// Higher-order component version
export function withProtectedRoute<P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<ProtectedRouteProps, 'children'> = {}
) {
  return function ProtectedComponent(props: P) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}
