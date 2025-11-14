"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function useClientTheme() {
  const { theme, setTheme, resolvedTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Return default values during SSR to prevent hydration mismatch
  if (!mounted) {
    return {
      theme: "dark" as const,
      setTheme,
      resolvedTheme: "dark" as const,
      systemTheme: "dark" as const,
      mounted: false,
      isDark: true,
      toggleTheme: () => {},
    };
  }

  const activeTheme = (theme === "system" ? resolvedTheme : theme) || "dark";
  const isDark = activeTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return {
    theme,
    setTheme,
    resolvedTheme,
    systemTheme,
    mounted,
    isDark,
    toggleTheme,
  };
}
