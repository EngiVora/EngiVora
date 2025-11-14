"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface UseAdminAuthReturn {
  user: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  checkAuth: () => boolean;
}

export function useAdminAuth(): UseAdminAuthReturn {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check if user is authenticated
  const checkAuth = useCallback((): boolean => {
    if (typeof window === "undefined") return false;

    const token =
      localStorage.getItem("adminToken") ||
      sessionStorage.getItem("adminToken");
    return !!token;
  }, []);

  // Initialize authentication state
  useEffect(() => {
    if (typeof window === "undefined") return;

    const token =
      localStorage.getItem("adminToken") ||
      sessionStorage.getItem("adminToken");

    if (token) {
      // In a real app, you'd validate the token with your backend
      // For now, we'll simulate a successful token validation
      try {
        // Mock user data - in real app, decode token or fetch user info
        const mockUser: AdminUser = {
          id: "admin-1",
          email: "admin@engivora.com",
          name: "Admin User",
          role: "admin",
        };
        setUser(mockUser);
      } catch (error) {
        // Invalid token, remove it
        localStorage.removeItem("adminToken");
        sessionStorage.removeItem("adminToken");
        setUser(null);
      }
    }

    setIsLoading(false);
  }, []);

  // Login function
  const login = useCallback(
    async (
      email: string,
      password: string,
    ): Promise<{ success: boolean; error?: string }> => {
      setIsLoading(true);

      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          return {
            success: false,
            error:
              errorData.error || `Login failed with status ${response.status}`,
          };
        }

        const data = await response.json();

        if (data.token) {
          // Store token
          localStorage.setItem("adminToken", data.token);

          // Set user data
          const userData: AdminUser = {
            id: data.user?.id || "admin-1",
            email: data.user?.email || email,
            name: data.user?.name || "Admin User",
            role: data.user?.role || "admin",
          };

          setUser(userData);

          return { success: true };
        } else {
          return {
            success: false,
            error: data.error || "Login failed - no token received",
          };
        }
      } catch (error) {
        console.error("Login error:", error);
        return {
          success: false,
          error: "Network error. Please try again.",
        };
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  // Logout function
  const logout = useCallback(async () => {
    try {
      // Call logout API to clear server-side tokens/cookies
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Logout API error:", error);
      // Continue with client-side cleanup even if API fails
    }

    // Remove tokens from client storage
    localStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminToken");

    // Clear user state
    setUser(null);

    // Redirect to login
    router.push("/admin/login");
  }, [router]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    checkAuth,
  };
}
