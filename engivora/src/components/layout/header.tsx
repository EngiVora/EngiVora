"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, X, Menu, LogOut } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { SocialLinks } from "@/components/ui/social-links";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Exams", href: "/exams" },
  { name: "Jobs", href: "/jobs" },
  { name: "Blogs", href: "/blogs" },
  { name: "Discounts", href: "/discounts" },
  { name: "Events", href: "/events" },
];

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Check authentication status on component mount and when storage changes
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        // Check localStorage first
        const token = localStorage.getItem("authToken");
        const userStr = localStorage.getItem("user");

        if (token && userStr) {
          setIsLoggedIn(true);
          return;
        }

        // Check sessionStorage as fallback
        const sessionToken = sessionStorage.getItem("authToken");
        const sessionUser = sessionStorage.getItem("user");

        if (sessionToken && sessionUser) {
          setIsLoggedIn(true);
          return;
        }

        // If no auth data found
        setIsLoggedIn(false);
      } catch (err) {
        console.error("Error checking auth status:", err);
        setIsLoggedIn(false);
      }
    };

    // Check on mount
    checkAuthStatus();

    // Listen for storage changes (in case user logs in/out in another tab)
    const handleStorageChange = () => {
      checkAuthStatus();
    };

    window.addEventListener("storage", handleStorageChange);
    
    // Also listen for custom event that might be dispatched on login/logout
    const handleAuthChange = () => {
      checkAuthStatus();
    };
    
    window.addEventListener("authStateChange", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authStateChange", handleAuthChange);
    };
  }, []);

  // Handle search functionality
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
        setSearchResults([]);
      }
    };

    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      searchInputRef.current?.focus();
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchOpen]);

  // Handle mobile menu close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(searchQuery)}`,
        );
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data.results || []);
        }
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleLogout = async () => {
    try {
      // Call the logout API endpoint
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      // Remove auth data from both localStorage and sessionStorage
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("user");

      // Update state
      setIsLoggedIn(false);
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event("authStateChange"));

      // Close mobile menu if open
      setIsMobileMenuOpen(false);

      // Redirect to home page
      window.location.href = "/";
    }
  };

  const handleSearchToggle = () => {
    // Focus on the search input instead of expanding
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleSearchClear = () => {
    setSearchQuery("");
    setSearchResults([]);
    searchInputRef.current?.focus();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results page
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full glass-panel accent-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Left: Logo */}
            <Link href="/" className="flex items-center space-x-2 text-slate-100">
              <Logo size="md" />
              <span className="text-xl font-bold">Engivora</span>
            </Link>

            {/* Mobile menu button - visible only on small screens */}
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-slate-300 hover:bg-slate-800 hover:text-sky-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500"
              onClick={toggleMobileMenu}
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>

            {/* Center: Navigation - hidden on mobile, visible on md and above */}
            <nav className="hidden md:flex items-center gap-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="nav-link text-slate-300 hover:text-sky-400"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Right: Connect + Auth + Search + ThemeToggle */}
            <div className="hidden md:flex items-center gap-3">
              {/* Fixed search bar - no expansion */}
              <div ref={searchContainerRef} className="relative">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-48 pl-10 pr-10 py-2 bg-slate-800 text-slate-100 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm"
                      data-fdprocessedid-ignore="true"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={handleSearchClear}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Connect with Us - Hidden on small screens */}
              <div className="hidden lg:flex items-center gap-3">
                <span className="text-sm font-medium text-slate-400">
                  Connect:
                </span>
                <SocialLinks variant="header" />
              </div>
              
              {!isLoggedIn ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/signup"
                    className="inline-flex h-9 items-center justify-center rounded-full px-4 bg-sky-600 text-white text-sm font-semibold hover:bg-sky-500 transition-all duration-200 neon-ring shadow-lg shadow-sky-500/20 hover:shadow-sky-500/30"
                  >
                    Sign Up
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex h-9 items-center justify-center rounded-full px-4 bg-slate-800 text-slate-100 text-sm font-semibold ring-1 ring-inset ring-slate-700 hover:bg-slate-700 transition-all duration-200 shadow-lg hover:shadow-slate-500/10"
                  >
                    Sign In
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    href="/profile"
                    className="text-sm font-semibold text-slate-300 hover:text-sky-400 transition-colors"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center text-sm font-semibold text-slate-300 hover:text-sky-400 transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    <span className="hidden lg:inline">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu - visible only on small screens */}
      {isMobileMenuOpen && (
        <div ref={mobileMenuRef} className="md:hidden fixed inset-x-0 top-16 z-50 bg-slate-900/95 backdrop-blur-lg border-b border-slate-800">
          <div className="space-y-1 px-4 pb-4 pt-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block rounded-md px-3 py-3 text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-sky-400"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Extended mobile search */}
            <div className="pt-2 pb-3">
              <div ref={searchContainerRef} className="relative">
                <form onSubmit={handleSearchSubmit}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-10 py-2 bg-slate-800 text-slate-100 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm"
                      data-fdprocessedid-ignore="true"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={handleSearchClear}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-700">
              <div className="flex flex-col gap-2">
                {!isLoggedIn ? (
                  <div className="flex flex-col gap-3">
                    <Link
                      href="/signup"
                      className="inline-flex h-11 items-center justify-center rounded-full px-4 bg-sky-600 text-white text-sm font-semibold hover:bg-sky-500 transition-all duration-200 neon-ring shadow-lg shadow-sky-500/20 hover:shadow-sky-500/30"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                    <Link
                      href="/login"
                      className="inline-flex h-11 items-center justify-center rounded-full px-4 bg-slate-800 text-slate-100 text-sm font-semibold ring-1 ring-inset ring-slate-700 hover:bg-slate-700 transition-all duration-200 shadow-lg hover:shadow-slate-500/10"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/profile"
                      className="text-sm font-medium text-slate-300 hover:text-sky-400 transition-colors py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="inline-flex items-center text-left text-sm font-semibold text-slate-300 hover:text-sky-400 transition-colors py-2"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
                <div className="pt-2">
                  <span className="text-sm font-medium text-slate-400">
                    Connect:
                  </span>
                  <div className="pt-1">
                    <SocialLinks variant="header" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}