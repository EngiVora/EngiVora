import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import { findUserById } from '@/lib/auth-db'

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/blogs',
  '/discounts',
  '/exams',
  '/jobs',
  '/work-hub',
  '/admin/login',
  '/login',
  '/signup',
  '/api/auth(.*)',
  '/api/seed(.*)',
  '/api/blogs(.*)',
  '/api/discounts(.*)',
  '/api/exams(.*)',
  '/api/jobs(.*)',
  '/api/work-hub(.*)'
]

// Check if a route is public
function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(route => {
    if (route.endsWith('(.*)')) {
      const baseRoute = route.slice(0, -4) // Remove (.*)
      return pathname.startsWith(baseRoute)
    }
    return pathname === route
  })
}

// Get token from request
function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  
  // Also check cookies as fallback
  const tokenCookie = request.cookies.get('authToken')
  return tokenCookie?.value || null
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Allow public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }
  
  // For protected routes, verify token
  const token = getTokenFromRequest(request)
  
  if (!token) {
    // Redirect to login for client-side routes
    if (!pathname.startsWith('/api')) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    // Return 401 for API routes
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }
  
  try {
    // Verify JWT token
    const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key'
    const decoded = jwt.verify(token, JWT_SECRET)
    
    // Add user info to headers for use in route handlers
    const requestHeaders = new Headers(request.headers)
    if (typeof decoded === 'object' && decoded !== null) {
      requestHeaders.set('x-user-id', decoded.sub as string)
      requestHeaders.set('x-user-role', decoded.role as string)
    }
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  } catch (error) {
    console.error('Token verification failed:', error)
    
    // Redirect to login for client-side routes
    if (!pathname.startsWith('/api')) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    // Return 401 for API routes
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
  }
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}