"use client"

import Link from "next/link"
import Image from "next/image"
import { Search } from "lucide-react"
import { Logo } from "@/components/ui/logo"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Exams", href: "/exams" },
  { name: "Jobs", href: "/jobs" },
  { name: "Blogs", href: "/blogs" },
  { name: "Discounts", href: "/discounts" },
  { name: "Work Hub", href: "/work-hub" },
]

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center space-x-2 text-foreground">
            <Logo size="md" />
            <span className="text-xl font-bold">Engivora</span>
          </Link>

          {/* Center: Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right: Auth + Search + Avatar */}
          <div className="flex items-center gap-4">
            <Link
              href="/signup"
              className="hidden sm:inline-flex h-9 items-center justify-center rounded-md px-4 bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              Sign Up
            </Link>
            <Link
              href="/login"
              className="inline-flex h-9 items-center justify-center rounded-md px-4 bg-white text-foreground text-sm font-semibold ring-1 ring-inset ring-gray-300 hover:bg-secondary transition-colors"
            >
              Login
            </Link>
            <button
              type="button"
              aria-label="Search"
              title="Search"
              className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-primary transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>
            <Link href="/profile" className="inline-flex" aria-label="Open profile">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHxk_X3fqMqiWTv_ZoKF2PnnpB5Y5zAi9bqXeIB8kPBtl2tyaDXqSJvjcI17HjT4MCz9RfzXbFkeIkjPl_qIV4N5RWQoNO3sPAxOFOIeIxgnQOEUoK1e8x2uLLMAKjbufp4vFoLiMh7eZgeZbOee-mkxqw9FpxxvMxeZoK4B9H0AvQroAHmB6u1h6r-k-1iys666WQe5Qpbb-OFgpKEhE33Yxp_rMWvf8mkjNZw9GsIF-fPU3FFjwhE3goud5jHjVfvM4QXxQE-YI"
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full ring-2 ring-white shadow"
              />
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
