import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export const runtime = 'nodejs'

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    // Check JWT_SECRET
    if (!JWT_SECRET || JWT_SECRET === '') {
      return NextResponse.json({ 
        error: 'Server configuration error',
        details: 'JWT_SECRET is not properly configured'
      }, { status: 500 });
    }

    // Verify the token
    const payload = jwt.verify(token, JWT_SECRET) as any;

    // Check if user has admin role
    if (payload.role !== 'admin') {
      return NextResponse.json(
        { error: 'Access denied: Admin privileges required' },
        { status: 403 }
      );
    }

    // Check if it's the specific admin user
    if (payload.sub !== 'admin-engivora' || payload.email !== 'admin@engivora.com') {
      return NextResponse.json(
        { error: 'Access denied: Invalid admin credentials' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: 'admin-engivora',
        name: 'Engivora Admin',
        email: 'admin@engivora.com',
        role: 'admin',
        department: 'Administration',
      },
      valid: true
    });

  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return NextResponse.json(
        { error: 'Token expired' },
        { status: 401 }
      );
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    console.error('Token verification error:', error);
    return NextResponse.json(
      { error: 'Token verification failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { 
      message: 'Admin token verification endpoint - POST method required',
      endpoints: {
        POST: '/api/admin/auth/verify - Verify admin token',
      }
    },
    { status: 405 }
  );
}
