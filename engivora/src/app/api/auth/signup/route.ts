import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';

// Validation schema
const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string(),
  department: z.string().min(2, 'Department is required'),
  year: z.string().optional(),
  rollNumber: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const JWT_SECRET = (process.env.JWT_SECRET || '') as Secret;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = signupSchema.parse(body);
    if (!JWT_SECRET || JWT_SECRET === '') {
      console.error('JWT_SECRET not configured');
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(validatedData.password, 10);

    const created = await User.create({
      name: validatedData.name,
      email: validatedData.email,
      passwordHash,
      role: 'student',
      department: validatedData.department,
      year: validatedData.year,
      rollNumber: validatedData.rollNumber,
    });

    const signOptions: SignOptions = {
      expiresIn: Number(process.env.JWT_EXPIRES_IN ?? 604800),
    };

    const token = jwt.sign({ sub: created._id.toString(), role: created.role }, JWT_SECRET, signOptions);

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: created._id.toString(),
        name: created.name,
        email: created.email,
        role: created.role,
        department: created.department,
        year: created.year,
        rollNumber: created.rollNumber,
        createdAt: created.createdAt,
        updatedAt: created.updatedAt,
      },
      token,
    }, { status: 201 });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { 
      message: 'Signup endpoint - POST method required',
      endpoints: {
        POST: '/api/auth/signup - Create new user account',
      },
      schema: {
        name: 'string (min 2 characters)',
        email: 'string (valid email)',
        password: 'string (min 6 characters, must contain uppercase, lowercase, and number)',
        confirmPassword: 'string (must match password)',
        department: 'string (min 2 characters)',
        year: 'string (optional)',
        rollNumber: 'string (optional)',
      }
    },
    { status: 405 }
  );
}