import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/db';
import { Student } from '@/models/Student';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';

export const runtime = 'nodejs'

// Validation schema
const signupSchema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  courses_enrolled: z.array(z.string()).optional(),
});

const JWT_SECRET = (process.env.JWT_SECRET || '') as Secret;

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
    
    // Check if student already exists
    try {
      const existingStudent = await Student.findOne({ email: validatedData.email });
      
      if (existingStudent) {
        return NextResponse.json(
          { error: 'Student with this email already exists' },
          { status: 409 }
        );
      }
    } catch (studentCheckError) {
      console.error('Error checking existing student:', studentCheckError);
      return NextResponse.json(
        { error: 'Database query failed', details: 'Error while checking existing student' },
        { status: 500 }
      );
    }
    
    // Generate unique student ID
    const student_id = `STU${Date.now()}${Math.floor(Math.random() * 1000)}`;
    
    // Hash password
    let password_hash: string;
    try {
      const saltRounds = 10;
      password_hash = await bcrypt.hash(validatedData.password, saltRounds);
    } catch (hashError) {
      console.error('Password hashing error:', hashError);
      return NextResponse.json(
        { error: 'Password processing failed', details: 'Error while hashing password' },
        { status: 500 }
      );
    }
    
    // Create new student in database
    try {
      const newStudent = new Student({
        student_id,
        full_name: validatedData.full_name,
        email: validatedData.email,
        password_hash,
        signup_date: new Date(),
        last_login: new Date(),
        courses_enrolled: validatedData.courses_enrolled || [],
      });
      
      const savedStudent = await newStudent.save();
      
      // Generate JWT token
      if (!JWT_SECRET || JWT_SECRET === '') {
        console.error('JWT_SECRET not configured');
        return NextResponse.json({ 
          error: 'Server configuration error',
          details: 'JWT_SECRET is not properly configured'
        }, { status: 500 });
      }

      const expiresInEnv = process.env.JWT_EXPIRES_IN;
      const signOptions: SignOptions = {
        expiresIn: expiresInEnv && expiresInEnv.trim() !== '' ? (isNaN(Number(expiresInEnv)) ? expiresInEnv : Number(expiresInEnv)) : 604800,
      } as SignOptions;

      const token = jwt.sign({ sub: savedStudent._id.toString(), role: 'student' }, JWT_SECRET, signOptions);
      
      return NextResponse.json({
        success: true,
        message: 'Account created successfully',
        student: {
          student_id: savedStudent.student_id,
          full_name: savedStudent.full_name,
          email: savedStudent.email,
          signup_date: savedStudent.signup_date,
          courses_enrolled: savedStudent.courses_enrolled,
        },
        token,
      });
    } catch (saveError) {
      console.error('Error saving student:', saveError);
      return NextResponse.json(
        { error: 'Student creation failed', details: 'Error while saving student to database' },
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
      message: 'Student signup endpoint - POST method required',
      endpoints: {
        POST: '/api/students/signup - Create new student account',
      }
    },
    { status: 405 }
  );
}