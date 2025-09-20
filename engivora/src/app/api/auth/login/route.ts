import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Mock user database (replace with actual database)
const mockUsers = [
  {
    id: '1',
    email: 'student@example.com',
    password: 'password123', // In production, this should be hashed
    name: 'John Doe',
    role: 'student',
    department: 'Computer Science',
  },
  {
    id: '2',
    email: 'admin@engivora.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
    department: 'Administration',
  },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = loginSchema.parse(body);
    
    // Find user (replace with actual database query)
    const user = mockUsers.find(
      (u) => u.email === validatedData.email && u.password === validatedData.password
    );
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    // Create user session data (exclude password)
    const { password, ...userWithoutPassword } = user;
    
    // In production, create JWT token here
    const token = `mock_token_${user.id}_${Date.now()}`;
    
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: userWithoutPassword,
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