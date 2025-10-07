"use client"

import Link from "next/link"
import { Search } from "lucide-react"
import { Logo } from "@/components/ui/logo"
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { isClerkConfigured, MockSignedIn, MockSignedOut, MockUserButton } from '@/lib/clerk-utils'
import { ThemeToggle } from "@/components/ui/theme-toggle"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Exams", href: "/exams" },
  { name: "Jobs", href: "/jobs" },
  { name: "Blogs", href: "/blogs" },
  { name: "Discounts", href: "/discounts" },
  { name: "Work Hub", href: "/work-hub" },
]

export function Header() {
  const clerkEnabled = isClerkConfigured()
  
  // Use appropriate components based on Clerk configuration
  const SignedInComponent = clerkEnabled ? SignedIn : MockSignedIn
  const SignedOutComponent = clerkEnabled ? SignedOut : MockSignedOut
  const UserButtonComponent = clerkEnabled ? UserButton : MockUserButton
  return (
    <header className="sticky top-0 z-50 w-full glass-panel accent-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center space-x-2 text-slate-100">
            <Logo size="md" />
            <span className="text-xl font-bold">Engivora</span>
          </Link>

          {/* Center: Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href} className="nav-link text-slate-300 hover:text-sky-400">
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right: Auth + Search + UserButton */}
          <div className="flex items-center gap-4">
            <SignedOutComponent>
              <Link
                href="/sign-up"
                className="hidden sm:inline-flex h-9 items-center justify-center rounded-full px-4 bg-sky-600 text-white text-sm font-semibold hover:bg-sky-500 transition-colors neon-ring"
              >
                Sign Up
              </Link>
              <Link
                href="/sign-in"
                className="inline-flex h-9 items-center justify-center rounded-full px-4 bg-slate-800 text-slate-100 text-sm font-semibold ring-1 ring-inset ring-slate-700 hover:bg-slate-700 transition-colors"
              >
                Sign In
              </Link>
            </SignedOutComponent>
            
            <SignedInComponent>
              <Link href="/profile" className="text-sm font-medium text-slate-300 hover:text-sky-400 transition-colors">
                Profile
              </Link>
            </SignedInComponent>
            
            <button
              type="button"
              aria-label="Search"
              title="Search"
              className="flex h-9 w-9 items-center justify-center rounded-full text-slate-300 hover:bg-slate-800 hover:text-sky-400 transition-colors neon-ring"
            >
              <Search className="h-5 w-5" />
            </button>

            <ThemeToggle />
            
            <SignedInComponent>
              {clerkEnabled && (
                <UserButtonComponent 
                  appearance={{
                    elements: {
                      avatarBox: "h-9 w-9",
                      userButtonPopoverCard: "shadow-lg border border-slate-800 bg-slate-900 text-slate-100",
                    }
                  }}
                  afterSignOutUrl="/"
                />
              )}
            </SignedInComponent>
          </div>
        </div>
      </div>
    </header>
  )
}
