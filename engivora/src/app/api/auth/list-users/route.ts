import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await connectToDatabase();
    
    // Get all users (excluding password hashes for security)
    const users = await User.find({}, { passwordHash: 0 }).sort({ createdAt: -1 }).limit(50);
    
    return NextResponse.json({
      success: true,
      message: 'Users retrieved successfully',
      count: users.length,
      users: users.map(user => ({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        year: user.year,
        rollNumber: user.rollNumber,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })),
    });
    
  } catch (error) {
    console.error('Error retrieving users:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to retrieve users',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}