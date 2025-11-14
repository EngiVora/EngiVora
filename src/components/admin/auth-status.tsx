"use client";

import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { Shield, User, Lock, CheckCircle, XCircle, RefreshCw } from "lucide-react";

export function AuthStatus() {
  const { user, isAuthenticated, isLoading, logout, checkAuth } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    const authStatus = checkAuth();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
    console.log("Auth check result:", authStatus);
  };

  const handleGoToLogin = () => {
    router.push("/admin/login");
  };

  const handleGoToDashboard = () => {
    router.push("/admin/dashboard");
  };

  const getAuthStatusIcon = () => {
    if (isLoading) {
      return <RefreshCw className="h-4 w-4 animate-spin text-yellow-500" />;
    }
    return isAuthenticated ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  const getAuthStatusText = () => {
    if (isLoading) return "Checking...";
    return isAuthenticated ? "Authenticated" : "Not authenticated";
  };

  const getAuthStatusColor = () => {
    if (isLoading) return "bg-yellow-50 border-yellow-200";
    return isAuthenticated ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200";
  };

  return (
    <div className={`fixed bottom-4 right-4 p-4 rounded-lg border-2 shadow-lg z-50 ${getAuthStatusColor()}`}>
      <div className="flex items-center space-x-2 mb-3">
        <Shield className="h-5 w-5 text-gray-600" />
        <h3 className="font-semibold text-gray-800">Auth Status</h3>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
        >
          <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center space-x-2">
          {getAuthStatusIcon()}
          <span className="font-medium">{getAuthStatusText()}</span>
        </div>

        <div className="flex items-center space-x-2">
          <User className="h-4 w-4 text-gray-500" />
          <span>{user?.name || "No user"}</span>
        </div>

        <div className="flex items-center space-x-2">
          <Lock className="h-4 w-4 text-gray-500" />
          <span className="truncate max-w-32">{user?.email || "No email"}</span>
        </div>

        <div className="text-xs text-gray-600">
          <strong>Current path:</strong> {pathname}
        </div>

        <div className="text-xs text-gray-600">
          <strong>Tokens:</strong>
          <div className="mt-1">
            localStorage: {typeof window !== "undefined" ?
              (localStorage.getItem("adminToken") ? "✓" : "✗") : "N/A"}
          </div>
          <div>
            sessionStorage: {typeof window !== "undefined" ?
              (sessionStorage.getItem("adminToken") ? "✓" : "✗") : "N/A"}
          </div>
        </div>

        <div className="flex space-x-2 mt-3">
          {!isAuthenticated ? (
            <button
              onClick={handleGoToLogin}
              className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
            >
              Login
            </button>
          ) : (
            <>
              <button
                onClick={handleGoToDashboard}
                className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
              >
                Dashboard
              </button>
              <button
                onClick={logout}
                className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Debug component for development
export function AuthDebugInfo() {
  const { user, isAuthenticated, isLoading } = useAdminAuth();
  const pathname = usePathname();

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 p-3 bg-gray-900 text-white text-xs rounded shadow-lg z-50 max-w-xs">
      <div className="font-bold mb-2">🔧 Auth Debug</div>
      <div className="space-y-1">
        <div>Path: {pathname}</div>
        <div>Loading: {isLoading ? "true" : "false"}</div>
        <div>Authenticated: {isAuthenticated ? "true" : "false"}</div>
        <div>User ID: {user?.id || "null"}</div>
        <div>User Role: {user?.role || "null"}</div>
        <div>
          LocalStorage Token: {
            typeof window !== "undefined"
              ? localStorage.getItem("adminToken") ? "present" : "missing"
              : "N/A"
          }
        </div>
      </div>
    </div>
  );
}
