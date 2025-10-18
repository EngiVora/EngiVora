import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    // In a real implementation, you would invalidate the JWT token here
    // For now, we'll just return a success response
    return NextResponse.json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { 
      message: 'Logout endpoint - POST method required',
      endpoints: {
        POST: '/api/auth/logout - Logout user',
      }
    },
    { status: 405 }
  );
}