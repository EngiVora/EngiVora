'use client';

import { ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { AdminAuthProvider, useAdminAuth } from '@/contexts/AdminAuthContext';

// Admin layout wrapper that includes the AdminAuthProvider
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminAuthProvider>
      <ProtectedAdminLayout>{children}</ProtectedAdminLayout>
    </AdminAuthProvider>
  );
}

// Protected layout that checks authentication
function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Skip redirect for login page
    if (pathname === '/admin/login') {
      return;
    }

    // Redirect to login if not authenticated and not loading
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login page directly without the admin layout
  if (!isAuthenticated && pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Show admin layout with sidebar for authenticated users
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="flex">
          {/* Sidebar */}
          <aside className="w-64 bg-gray-800 text-white min-h-screen p-4">
            <div className="mb-8">
              <h1 className="text-2xl font-bold">EngiVora Admin</h1>
              <p className="text-gray-400 text-sm mt-1">{user?.email}</p>
            </div>
            
            <nav>
              <ul className="space-y-2">
                <NavItem href="/admin" label="Dashboard" icon="📊" />
                <NavItem href="/admin/blogs" label="Blogs" icon="📝" />
                <NavItem href="/admin/jobs" label="Jobs" icon="💼" />
                <NavItem href="/admin/exams" label="Exams" icon="📚" />
                <NavItem href="/admin/discounts" label="Discounts" icon="🏷️" />
                <NavItem href="/admin/users" label="Users" icon="👥" />
                <NavItem href="/admin/settings" label="Settings" icon="⚙️" />
              </ul>
            </nav>
            
            <div className="mt-auto pt-8">
              <LogoutButton />
            </div>
          </aside>
          
          {/* Main content */}
          <main className="flex-1 p-8">
            {children}
          </main>
        </div>
      </div>
    );
  }

  // Fallback empty state while redirecting
  return null;
}

// Navigation item component
function NavItem({ href, label, icon }: { href: string; label: string; icon: string }) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);
  
  return (
    <li>
      <Link 
        href={href}
        className={`flex items-center px-4 py-2 rounded-md transition-colors ${isActive ? 'bg-blue-700 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
      >
        <span className="mr-3">{icon}</span>
        {label}
      </Link>
    </li>
  );
}

// Logout button component
function LogoutButton() {
  const { logout } = useAdminAuth();
  
  return (
    <button 
      onClick={logout}
      className="flex items-center w-full px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-md transition-colors"
    >
      <span className="mr-3">🚪</span>
      Logout
    </button>
  );
}