import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/db';
import { User, UserDocument } from '@/models/User';

export const runtime = 'nodejs'

// Validation schema
const signupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  department: z.string().optional(),
  year: z.string().optional(),
  rollNumber: z.string().optional(),
  dateOfBirth: z.string().optional(),
  mobileNumber: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = signupSchema.parse(body);
    
    // Connect to database - required, no fallback
    await connectToDatabase();
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: validatedData.email });
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }
    
    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(validatedData.password, saltRounds);
    
    // Create new user in database
    const newUser = new User({
      name: validatedData.name,
      email: validatedData.email,
      passwordHash,
      department: validatedData.department,
      year: validatedData.year,
      rollNumber: validatedData.rollNumber,
      dateOfBirth: validatedData.dateOfBirth ? new Date(validatedData.dateOfBirth) : undefined,
      mobileNumber: validatedData.mobileNumber,
      role: 'student', // Default role for new users
    });
    
    const savedUser = await newUser.save();
    
    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: (savedUser._id as any).toString(),
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
        department: savedUser.department,
        year: savedUser.year,
        rollNumber: savedUser.rollNumber,
        dateOfBirth: savedUser.dateOfBirth,
        mobileNumber: savedUser.mobileNumber,
        profilePicture: savedUser.profilePicture,
      },
    });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { 
      message: 'Enhanced Signup endpoint - POST method required',
      endpoints: {
        POST: '/api/auth/enhanced-signup - Create new user account',
      }
    },
    { status: 405 }
  );
}