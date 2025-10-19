import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Remove all authentication checks to allow public access
export function middleware(request: NextRequest) {
  // Allow access to all routes without authentication
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
}
