import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema for login
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Mock admin users (in production, this would be a database)
const mockAdminUsers = [
  {
    id: 'admin_1',
    email: 'admin@engivora.com',
    name: 'Admin User',
    role: 'admin',
    department: 'Administration',
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
  },
];

// Mock valid credentials (in production, passwords should be hashed)
const validCredentials = {
  'admin@engivora.com': 'admin123',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = loginSchema.parse(body);
    
    const { email, password } = validatedData;
    
    // Check if credentials are valid
    const isValidCredentials = validCredentials[email as keyof typeof validCredentials] === password;
    
    if (!isValidCredentials) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    // Find user
    const user = mockAdminUsers.find(u => u.email === email);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Create mock token (in production, use JWT)
    const token = `mock_token_${user.id}_${Date.now()}`;
    
    return NextResponse.json({
      success: true,
      token,
      user,
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