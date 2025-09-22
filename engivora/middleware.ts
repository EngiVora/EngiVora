import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/blogs',
  '/discounts', 
  '/exams',
  '/jobs',
  '/work-hub',
  '/api/blogs(.*)',
  '/api/discounts(.*)',
  '/api/exams(.*)',
  '/api/jobs(.*)',
  '/api/work-hub(.*)'
]);

export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};