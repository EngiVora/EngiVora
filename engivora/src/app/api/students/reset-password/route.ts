import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/db';
import { Student } from '@/models/Student';

export const runtime = 'nodejs'

// Validation schema for requesting password reset
const resetRequestSchema = z.object({
  email: z.string().email('Invalid email format'),
});

// Validation schema for resetting password
const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email format'),
  token: z.string().min(1, 'Token is required'),
  new_password: z.string().min(6, 'Password must be at least 6 characters'),
});

// In-memory storage for reset tokens (in production, use Redis or database)
const passwordResetTokens = new Map<string, { token: string; expires: Date }>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Determine which action to take based on the presence of token
    if (body.token) {
      // Reset password action
      return await resetPassword(body);
    } else {
      // Request password reset action
      return await requestPasswordReset(body);
    }
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function requestPasswordReset(body: any) {
  try {
    // Validate input
    const validatedData = resetRequestSchema.parse(body);
    
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
    
    // Find student by email
    try {
      const student = await Student.findOne({ email: validatedData.email });
      
      if (!student) {
        // For security, we don't reveal if the email exists
        return NextResponse.json({
          success: true,
          message: 'If your email is registered, you will receive password reset instructions.'
        });
      }
      
      // Generate reset token
      const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const expires = new Date(Date.now() + 3600000); // 1 hour from now
      
      // Store token (in production, use Redis or database)
      passwordResetTokens.set(validatedData.email, { token, expires });
      
      // In a real application, you would send an email with the reset link
      // For now, we'll just return the token in the response
      console.log(`Password reset token for ${validatedData.email}: ${token}`);
      
      return NextResponse.json({
        success: true,
        message: 'If your email is registered, you will receive password reset instructions.',
        // In production, remove this debug information
        debug_token: token // Remove in production
      });
    } catch (findError) {
      console.error('Error finding student:', findError);
      return NextResponse.json(
        { error: 'Database query failed', details: 'Error while finding student' },
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
    
    console.error('Password reset request error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function resetPassword(body: any) {
  try {
    // Validate input
    const validatedData = resetPasswordSchema.parse(body);
    
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
    
    // Check if token is valid
    const storedToken = passwordResetTokens.get(validatedData.email);
    if (!storedToken) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }
    
    if (storedToken.token !== validatedData.token) {
      return NextResponse.json(
        { error: 'Invalid reset token' },
        { status: 400 }
      );
    }
    
    if (storedToken.expires < new Date()) {
      passwordResetTokens.delete(validatedData.email);
      return NextResponse.json(
        { error: 'Reset token has expired' },
        { status: 400 }
      );
    }
    
    // Find student by email
    try {
      const student = await Student.findOne({ email: validatedData.email });
      
      if (!student) {
        return NextResponse.json(
          { error: 'Student not found' },
          { status: 404 }
        );
      }
      
      // Hash new password
      const saltRounds = 10;
      const new_password_hash = await bcrypt.hash(validatedData.new_password, saltRounds);
      
      // Update password
      student.password_hash = new_password_hash;
      await student.save();
      
      // Remove used token
      passwordResetTokens.delete(validatedData.email);
      
      return NextResponse.json({
        success: true,
        message: 'Password has been reset successfully'
      });
    } catch (findError) {
      console.error('Error finding student:', findError);
      return NextResponse.json(
        { error: 'Database query failed', details: 'Error while finding student' },
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
    
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { 
      message: 'Student password reset endpoint - POST method required',
      endpoints: {
        POST: '/api/students/reset-password - Request password reset or reset password',
      }
    },
    { status: 405 }
  );
}