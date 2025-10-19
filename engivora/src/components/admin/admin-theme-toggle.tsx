"use client";

import { Moon, Sun } from "lucide-react";
import { useClientTheme } from "@/hooks/use-client-theme";

export function AdminThemeToggle() {
  const { mounted, isDark, toggleTheme } = useClientTheme();

  // Don't render anything on the server to prevent hydration mismatch
  if (!mounted) {
    return (
      <button
        className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
        aria-label="Loading theme toggle"
        disabled
      >
        <div className="h-5 w-5" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
