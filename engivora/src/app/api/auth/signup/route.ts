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
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = signupSchema.parse(body);
    
    // Connect to database
    try {
      await connectToDatabase();
    } catch (dbConnectionError) {
      console.error('Database connection error:', dbConnectionError);
      return NextResponse.json(
        { error: 'Database connection failed', details: 'Unable to connect to the database' },
        { status: 500 }
      );
    }
    
    // Check if user already exists
    try {
      const existingUser = await User.findOne({ email: validatedData.email });
      
      if (existingUser) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 409 }
        );
      }
    } catch (userCheckError) {
      console.error('Error checking existing user:', userCheckError);
      return NextResponse.json(
        { error: 'Database query failed', details: 'Error while checking existing user' },
        { status: 500 }
      );
    }
    
    // Hash password
    let passwordHash: string;
    try {
      const saltRounds = 10;
      passwordHash = await bcrypt.hash(validatedData.password, saltRounds);
    } catch (hashError) {
      console.error('Password hashing error:', hashError);
      return NextResponse.json(
        { error: 'Password processing failed', details: 'Error while hashing password' },
        { status: 500 }
      );
    }
    
    // Create new user in database
    try {
      const newUser = new User({
        name: validatedData.name,
        email: validatedData.email,
        passwordHash,
        department: validatedData.department,
        year: validatedData.year,
        rollNumber: validatedData.rollNumber,
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
          profilePicture: savedUser.profilePicture,
        },
      });
    } catch (saveError) {
      console.error('Error saving user:', saveError);
      return NextResponse.json(
        { error: 'User creation failed', details: 'Error while saving user to database' },
        { status: 500 }
      );
    }
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Unexpected signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: 'An unexpected error occurred' },
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
      }
    },
    { status: 405 }
  );
}