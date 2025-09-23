import { NextResponse } from 'next/server'
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/blogs',
  '/discounts',
  '/exams',
  '/jobs',
  '/work-hub',
  '/admin/login',
  // Public API routes
  '/api/auth(.*)',
  '/api/seed(.*)',
  '/api/blogs(.*)',
  '/api/discounts(.*)',
  '/api/exams(.*)',
  '/api/jobs(.*)',
  '/api/work-hub(.*)'
])

// Gracefully disable Clerk middleware if not configured
const hasClerkKeys = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && !!process.env.CLERK_SECRET_KEY

const middlewareWhenClerkDisabled = () => NextResponse.next()

export default hasClerkKeys
  ? clerkMiddleware((auth, req) => {
      if (isPublicRoute(req)) return
    })
  : middlewareWhenClerkDisabled

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};