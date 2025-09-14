import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// This is a placeholder for your actual user authentication logic
// In a real application, you would connect to your database and verify credentials
const ADMIN_EMAIL = 'admin@engivora.com';
const ADMIN_PASSWORD = 'admin#123'; // In production, use hashed passwords
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Use environment variable in production

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if credentials match admin credentials
    // In a real application, you would query your database and check hashed passwords
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: 'admin-id',
        email,
        role: 'admin',
      },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    // Return success response with token
    return NextResponse.json({
      message: 'Login successful',
      token,
      user: {
        id: 'admin-id',
        email,
        role: 'admin',
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}