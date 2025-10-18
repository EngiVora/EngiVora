import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';

export const runtime = 'nodejs'

// Validation schema
const adminLoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

const JWT_SECRET = (process.env.JWT_SECRET || '') as Secret;

// Hardcoded admin credentials for security
const ADMIN_CREDENTIALS = {
  email: 'admin@engivora.com',
  password: 'EngivoraAdmin@5678',
  name: 'Engivora Admin',
  role: 'admin',
  department: 'Administration'
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = adminLoginSchema.parse(body);
    
    // Check JWT_SECRET
    if (!JWT_SECRET || JWT_SECRET === '') {
      console.error('JWT_SECRET not configured');
      return NextResponse.json({ 
        error: 'Server configuration error',
        details: 'JWT_SECRET is not properly configured'
      }, { status: 500 });
    }
    
    // Verify admin credentials
    if (validatedData.email !== ADMIN_CREDENTIALS.email) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    if (validatedData.password !== ADMIN_CREDENTIALS.password) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const expiresInEnv = process.env.JWT_EXPIRES_IN;
    const signOptions: SignOptions = {
      expiresIn: expiresInEnv && expiresInEnv.trim() !== '' ? (isNaN(Number(expiresInEnv)) ? expiresInEnv : Number(expiresInEnv)) : 604800,
    } as SignOptions;

    const token = jwt.sign({ 
      sub: 'admin-engivora', 
      role: ADMIN_CREDENTIALS.role,
      email: ADMIN_CREDENTIALS.email
    }, JWT_SECRET, signOptions);

    return NextResponse.json({
      success: true,
      message: 'Admin login successful',
      user: {
        id: 'admin-engivora',
        name: ADMIN_CREDENTIALS.name,
        email: ADMIN_CREDENTIALS.email,
        role: ADMIN_CREDENTIALS.role,
        department: ADMIN_CREDENTIALS.department,
      },
      token,
    });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { 
      message: 'Admin login endpoint - POST method required',
      endpoints: {
        POST: '/api/admin/auth/login - Admin login',
      }
    },
    { status: 405 }
  );
}
