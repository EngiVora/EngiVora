import { NextRequest, NextResponse } from 'next/server';

// GET all users
export async function GET(request: NextRequest) {
  try {
    // In a real application, you would fetch users from your database
    // For now, we'll return mock data
    const users = [
      { id: '1', name: 'John Doe', email: 'john@example.com', role: 'user', createdAt: '2023-05-10' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'user', createdAt: '2023-06-15' },
      { id: '3', name: 'Admin User', email: 'admin@engivora.com', role: 'admin', createdAt: '2023-01-01' },
      { id: '4', name: 'Mike Johnson', email: 'mike@example.com', role: 'user', createdAt: '2023-07-22' },
      { id: '5', name: 'Sarah Williams', email: 'sarah@example.com', role: 'user', createdAt: '2023-08-30' },
    ];

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST a new user
export async function POST(request: NextRequest) {
  try {
    const userData = await request.json();

    // Validate required fields
    if (!userData.name || !userData.email || !userData.password) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      return NextResponse.json(
        { message: 'Invalid email address' },
        { status: 400 }
      );
    }

    // In a real application, you would:
    // 1. Check if the user already exists
    // 2. Hash the password
    // 3. Save the user to your database
    
    // For now, we'll just return the user with a mock ID
    const newUser = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      role: userData.role || 'user',
      createdAt: new Date().toISOString().split('T')[0],
    };

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}