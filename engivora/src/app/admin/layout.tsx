"use client";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { ProtectedRoute } from "@/components/admin/protected-route";
import { AuthDebugInfo } from "@/components/admin/auth-status";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  // Check if current page is login page
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render anything during SSR to prevent hydration mismatches
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If it's login page, don't require authentication and don't show sidebar/header
  if (isLoginPage) {
    return (
      <ProtectedRoute requireAuth={false}>
        <div className="min-h-screen bg-gray-50">
          <AuthDebugInfo />
          {children}
        </div>
      </ProtectedRoute>
    );
  }

  // For all other admin pages, require authentication and show full layout
  return (
    <ProtectedRoute requireAuth={true}>
      <div className="min-h-screen bg-gray-50">
        <AuthDebugInfo />
        <AdminSidebar />
        <div className="lg:pl-64">
          <AdminHeader />
          <main className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
