import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/db';
import { User, UserDocument } from '@/models/User';

export const runtime = 'nodejs'

// Validation schema
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const JWT_SECRET = (process.env.JWT_SECRET || '') as Secret;

export async function POST(request: NextRequest) {
  try {
    // Skip database operations during build
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return NextResponse.json({ 
        success: true,
        message: 'Build-time placeholder response',
        user: {
          id: 'build-placeholder',
          name: 'Build Placeholder',
          email: 'build@placeholder.com',
          role: 'user',
        },
        token: 'build-placeholder-token',
      });
    }

    const body = await request.json();
    
    // Validate input
    const validatedData = loginSchema.parse(body);
    
    // Check JWT_SECRET
    if (!JWT_SECRET || JWT_SECRET === '') {
      console.error('JWT_SECRET not configured');
      return NextResponse.json({ 
        error: 'Server configuration error',
        details: 'JWT_SECRET is not properly configured'
      }, { status: 500 });
    }
    
    // Connect to database - required, no fallback
    await connectToDatabase();
    
    // Find user in database
    const userDoc = await User.findOne({ email: validatedData.email });
    
    if (!userDoc) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    // Check password
    const passwordMatch = await bcrypt.compare(validatedData.password, userDoc.passwordHash);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    // Update last login
    userDoc.lastLogin = new Date();
    await userDoc.save();
    
    // Generate JWT token
    const expiresInEnv = process.env.JWT_EXPIRES_IN;
    const signOptions: SignOptions = {
      expiresIn: expiresInEnv && expiresInEnv.trim() !== '' ? (isNaN(Number(expiresInEnv)) ? expiresInEnv : Number(expiresInEnv)) : 604800,
    } as SignOptions;
    
    const token = jwt.sign({ sub: (userDoc._id as any).toString(), role: userDoc.role }, JWT_SECRET, signOptions);
    
    // Format dateOfBirth properly
    let formattedDateOfBirth = undefined;
    if (userDoc.dateOfBirth) {
      try {
        // Check if it's already a Date object
        if (userDoc.dateOfBirth instanceof Date) {
          formattedDateOfBirth = userDoc.dateOfBirth.toISOString().split('T')[0];
        } else {
          // Try to convert to Date and format
          const dateObj = new Date(userDoc.dateOfBirth);
          if (!isNaN(dateObj.getTime())) {
            formattedDateOfBirth = dateObj.toISOString().split('T')[0];
          }
        }
      } catch (dateError) {
        console.error('Error formatting date of birth:', dateError);
        // Don't set formattedDateOfBirth, it will remain undefined
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: (userDoc._id as any).toString(),
        name: userDoc.name,
        email: userDoc.email,
        role: userDoc.role,
        department: userDoc.department,
        year: userDoc.year,
        rollNumber: userDoc.rollNumber,
        dateOfBirth: formattedDateOfBirth,
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
      message: 'Enhanced Login endpoint - POST method required',
      endpoints: {
        POST: '/api/auth/enhanced-login - Login user',
      }
    },
    { status: 405 }
  );
}