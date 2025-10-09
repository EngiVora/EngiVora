import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/jwt-utils';

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Authorization header missing or invalid' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    const verificationResult = await verifyAdminToken(token);
    
    if (!verificationResult.success) {
      return NextResponse.json(
        { success: false, error: verificationResult.error },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: verificationResult.user,
    });
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { 
      message: 'Token verification endpoint - POST method required',
      endpoints: {
        POST: '/api/auth/verify-token - Verify admin token',
      }
    },
    { status: 405 }
  );
}