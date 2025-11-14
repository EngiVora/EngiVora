import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import jwt from 'jsonwebtoken';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAdminAuth = () => {
      // Only run on client-side
      if (typeof window === 'undefined') {
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
        
        if (!token) {
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        // Decode the JWT token
        const decoded = jwt.decode(token) as { sub: string; email: string; name: string; role: string } | null;
        
        if (!decoded || decoded.role !== 'admin') {
          setIsAdmin(false);
          // Remove invalid token
          localStorage.removeItem('adminToken');
          sessionStorage.removeItem('adminToken');
          setLoading(false);
          return;
        }

        // Set user data
        setUser({
          id: decoded.sub,
          email: decoded.email,
          name: decoded.name,
          role: decoded.role,
        });
        
        setIsAdmin(true);
      } catch (error) {
        console.error('Admin auth check failed:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminAuth();
  }, [router, pathname]);

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adminToken');
      sessionStorage.removeItem('adminToken');
    }
    setIsAdmin(false);
    setUser(null);
    
    // Remove cookie by setting it to expire
    document.cookie = "adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    
    router.push('/admin/login');
  };

  return { isAdmin, user, loading, logout };
}