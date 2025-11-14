import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/db';
import { Student } from '@/models/Student';

export const runtime = 'nodejs'

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
    
    // Check JWT_SECRET
    if (!JWT_SECRET || JWT_SECRET === '') {
      console.error('JWT_SECRET not configured');
      return NextResponse.json({ 
        error: 'Server configuration error',
        details: 'JWT_SECRET is not properly configured'
      }, { status: 500 });
    }
    
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
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
      }
      
      // Check password
      const passwordMatch = await bcrypt.compare(validatedData.password, student.password_hash);
      if (!passwordMatch) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
      }
      
      // Update last login
      student.last_login = new Date();
      await student.save();

      // Generate JWT token
      const expiresInEnv = process.env.JWT_EXPIRES_IN;
      const signOptions: SignOptions = {
        expiresIn: expiresInEnv && expiresInEnv.trim() !== '' ? (isNaN(Number(expiresInEnv)) ? expiresInEnv : Number(expiresInEnv)) : 604800,
      } as SignOptions;

      const token = jwt.sign({ sub: student._id.toString(), role: 'student' }, JWT_SECRET, signOptions);

      return NextResponse.json({
        success: true,
        message: 'Login successful',
        student: {
          student_id: student.student_id,
          full_name: student.full_name,
          email: student.email,
          signup_date: student.signup_date,
          last_login: student.last_login,
          courses_enrolled: student.courses_enrolled,
        },
        token,
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
      message: 'Student login endpoint - POST method required',
      endpoints: {
        POST: '/api/students/login - Login student',
      }
    },
    { status: 405 }
  );
}