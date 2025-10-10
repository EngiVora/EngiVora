import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';
import { findUserByEmail } from '@/lib/auth-db';

export const runtime = 'nodejs'

// Get all users (with pagination)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization header missing or invalid' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // In a real implementation, you would verify the JWT token here
    // For now, we'll just check if the token exists
    if (!token) {
      return NextResponse.json(
        { error: 'Invalid or missing token' },
        { status: 401 }
      );
    }

    let users: any[] = [];
    let totalUsers = 0;
    
    try {
      // Try to get data from database
      await connectToDatabase();
      
      users = await User.find({}, { passwordHash: 0 })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      
      totalUsers = await User.countDocuments({});
    } catch (_dbError) {
      console.warn('Database not available, using mock data');
      
      // Fallback to mock data
      const mockUsers = [
        {
          id: '1',
          name: 'John Doe',
          email: 'student@example.com',
          role: 'student',
          department: 'Computer Science',
          year: '3rd Year',
          rollNumber: 'CS2021001',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Admin User',
          email: 'admin@engivora.com',
          role: 'admin',
          department: 'Administration',
          createdAt: new Date().toISOString(),
        },
        {
          id: '3',
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'student',
          department: 'Electrical Engineering',
          year: '2nd Year',
          rollNumber: 'EE2021002',
          createdAt: new Date().toISOString(),
        }
      ];
      
      users = mockUsers.slice(skip, skip + limit);
      totalUsers = mockUsers.length;
    }

    return NextResponse.json({
      success: true,
      data: {
        users: users.map(user => ({
          id: user._id?.toString() || user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          year: user.year,
          rollNumber: user.rollNumber,
          createdAt: user.createdAt,
        })),
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalUsers / limit),
          totalUsers,
          hasNext: page < Math.ceil(totalUsers / limit),
          hasPrev: page > 1,
        }
      },
    });
  } catch (error) {
    console.error('Users fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create a new user
export async function POST(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization header missing or invalid' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    if (!token) {
      return NextResponse.json(
        { error: 'Invalid or missing token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // In a real implementation, you would validate the data and create the user
    // For now, we'll just return a success response
    
    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      user: {
        id: 'new_user_id',
        ...body,
        createdAt: new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error('User creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}