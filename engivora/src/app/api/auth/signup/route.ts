import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema
const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  department: z.string().min(2, 'Department is required'),
  year: z.string().optional(),
  rollNumber: z.string().optional(),
});

// Mock user database (replace with actual database)
const mockUsers: Array<{
  id: string;
  email: string;
  password: string;
  name: string;
  role: string;
  department: string;
  year?: string;
  rollNumber?: string;
  createdAt: string;
}> = [
  {
    id: '1',
    email: 'student@example.com',
    password: 'password123',
    name: 'John Doe',
    role: 'student',
    department: 'Computer Science',
    year: '3rd Year',
    rollNumber: 'CS2021001',
    createdAt: new Date().toISOString(),
  },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = signupSchema.parse(body);
    
    // Check if user already exists
    const existingUser = mockUsers.find(
      (u) => u.email === validatedData.email
    );
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }
    
    // Create new user
    const newUser = {
      id: (mockUsers.length + 1).toString(),
      ...validatedData,
      role: 'student',
      createdAt: new Date().toISOString(),
    };
    
    // Add to mock database
    mockUsers.push(newUser);
    
    // Create user session data (exclude password)
    const { password, ...userWithoutPassword } = newUser;
    
    // In production, create JWT token here
    const token = `mock_token_${newUser.id}_${Date.now()}`;
    
    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: userWithoutPassword,
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
      }
    },
    { status: 405 }
  );
}