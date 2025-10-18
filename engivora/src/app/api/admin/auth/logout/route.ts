import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    // Admin logout - just return success
    // Token invalidation is handled client-side by removing from storage
    return NextResponse.json({
      success: true,
      message: 'Admin logout successful'
    });
    
  } catch (error) {
    console.error('Admin logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { 
      message: 'Admin logout endpoint - POST method required',
      endpoints: {
        POST: '/api/admin/auth/logout - Admin logout',
      }
    },
    { status: 405 }
  );
}
