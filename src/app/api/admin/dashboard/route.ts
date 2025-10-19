import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';
import { findUserById } from '@/lib/auth-db';
import jwt from 'jsonwebtoken';

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
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
    
    // Verify JWT token
    const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { sub: string; role: string };
      
      // Check if user has admin role
      if (decoded.role !== 'admin') {
        return NextResponse.json(
          { error: 'Admin access required' },
          { status: 403 }
        );
      }
    } catch (jwtError) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Get dashboard statistics
    let totalUsers = 0;
    let totalAdmins = 0;
    let recentUsers: any[] = [];
    
    try {
      // Try to get data from database
      await connectToDatabase();
      
      totalUsers = await User.countDocuments({});
      totalAdmins = await User.countDocuments({ role: 'admin' });
      
      // Get 5 most recent users
      const users = await User.find({}, { passwordHash: 0 })
        .sort({ createdAt: -1 })
        .limit(5);
      
      recentUsers = users.map(user => ({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        createdAt: user.createdAt,
      }));
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
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Admin User',
          email: 'admin@engivora.com',
          role: 'admin',
          department: 'Administration',
          createdAt: new Date().toISOString(),
        }
      ];
      
      totalUsers = mockUsers.length;
      totalAdmins = mockUsers.filter(user => user.role === 'admin').length;
      recentUsers = mockUsers.slice(0, 5);
    }

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalAdmins,
          totalStudents: totalUsers - totalAdmins,
        },
        recentUsers,
      },
    });
  } catch (error) {
    console.error('Dashboard data error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}