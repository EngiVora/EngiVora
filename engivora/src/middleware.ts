import { NextRequest, NextResponse } from 'next/server';
import { adminAuthMiddleware } from './middleware/adminAuth';

export function middleware(request: NextRequest) {
  // Apply admin authentication middleware to admin API routes
  if (request.nextUrl.pathname.startsWith('/api/admin/')) {
    // Skip authentication for the login endpoint
    if (request.nextUrl.pathname === '/api/admin/auth/login') {
      return NextResponse.next();
    }
    
    // Apply admin authentication middleware to all other admin API routes
    return adminAuthMiddleware(request);
  }
  
  // For all other routes, continue without authentication
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all API routes that start with /api/admin/
    '/api/admin/:path*',
  ],
};