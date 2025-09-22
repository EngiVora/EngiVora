import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';

// Validation schema
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const JWT_SECRET = (process.env.JWT_SECRET || '') as Secret;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = loginSchema.parse(body);
    if (!JWT_SECRET || JWT_SECRET === '') {
      console.error('JWT_SECRET not configured');
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    await connectToDatabase();

    const userDoc = await User.findOne({ email: validatedData.email });
    if (!userDoc) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const passwordMatch = await bcrypt.compare(validatedData.password, userDoc.passwordHash);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const signOptions: SignOptions = {
      expiresIn: Number(process.env.JWT_EXPIRES_IN ?? 604800),
    };

    const token = jwt.sign({ sub: userDoc._id.toString(), role: userDoc.role }, JWT_SECRET, signOptions);

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: userDoc._id.toString(),
        name: userDoc.name,
        email: userDoc.email,
        role: userDoc.role,
        department: userDoc.department,
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
    
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { 
      message: 'Login endpoint - POST method required',
      endpoints: {
        POST: '/api/auth/login - Login user',
      }
    },
    { status: 405 }
  );
}