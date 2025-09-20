import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema for profile updates
const profileUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  department: z.string().min(2, 'Department is required').optional(),
  year: z.string().optional(),
  rollNumber: z.string().optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  skills: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
});

// Mock user database (replace with actual database)
const mockUsers = [
  {
    id: '1',
    email: 'student@example.com',
    name: 'John Doe',
    role: 'student',
    department: 'Computer Science',
    year: '3rd Year',
    rollNumber: 'CS2021001',
    bio: 'Passionate about AI and Machine Learning',
    skills: ['JavaScript', 'Python', 'React'],
    interests: ['AI', 'Web Development', 'Robotics'],
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
  },
];

// Helper function to get user from token
function getUserFromToken(token: string) {
  // In production, verify JWT token here
  const userId = token.split('_')[2]; // Extract user ID from mock token
  return mockUsers.find(user => user.id === userId);
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }
    
    const token = authHeader.substring(7);
    const user = getUserFromToken(token);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid token or user not found' },
        { status: 401 }
      );
    }
    
    return NextResponse.json({
      success: true,
      user,
    });
    
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }
    
    const token = authHeader.substring(7);
    const user = getUserFromToken(token);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid token or user not found' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    
    // Validate input
    const validatedData = profileUpdateSchema.parse(body);
    
    // Update user profile
    Object.assign(user, {
      ...validatedData,
      updatedAt: new Date().toISOString(),
    });
    
    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user,
    });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}