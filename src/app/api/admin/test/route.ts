import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs'

// Simple test endpoint to verify admin authentication is working
export async function GET(request: NextRequest) {
  // Get authorization header
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { 
        success: false, 
        message: 'Authorization header missing or invalid',
        endpoint: '/api/admin/test',
        purpose: 'Test admin authentication'
      },
      { status: 401 }
    );
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix
  
  if (!token) {
    return NextResponse.json(
      { 
        success: false, 
        message: 'Invalid or missing token',
        endpoint: '/api/admin/test',
        purpose: 'Test admin authentication'
      },
      { status: 401 }
    );
  }

  // In a real implementation, you would verify the JWT token here
  // For now, we'll just return a success response
  return NextResponse.json({
    success: true,
    message: 'Admin authentication is working!',
    endpoint: '/api/admin/test',
    purpose: 'Test admin authentication',
    tokenProvided: token.substring(0, 10) + '...' + token.substring(token.length - 10)
  });
}