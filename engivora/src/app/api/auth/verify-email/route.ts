import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { 
  findUserByEmail, 
  findUserById,
  updateUser,
  verificationTokens, 
  sendVerificationEmail 
} from '@/lib/auth-db';



export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      );
    }

    // Check if token exists and is valid
    const tokenData = verificationTokens.get(token);
    
    if (!tokenData) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    // Check if token has expired
    if (new Date() > tokenData.expires) {
      verificationTokens.delete(token);
      return NextResponse.json(
        { error: 'Verification token has expired' },
        { status: 400 }
      );
    }

    // Find and update user
    const user = findUserById(tokenData.userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update user email verification status
    const updated = updateUser(tokenData.userId, {
      emailVerified: true,
      emailVerificationToken: undefined,
      emailVerificationExpires: undefined,
    });

    if (!updated) {
      return NextResponse.json(
        { error: 'Failed to update user' },
        { status: 500 }
      );
    }

    // Remove token from storage
    verificationTokens.delete(token);

    // Return success response with redirect
    return NextResponse.redirect(
      new URL('/login?verified=true', request.url)
    );

  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = findUserByEmail(email);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: 'Email is already verified' },
        { status: 400 }
      );
    }

    // Generate new verification token
    const verificationToken = randomUUID();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Update user with new token
    const updated = updateUser(user.id, {
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires.toISOString(),
    });

    if (!updated) {
      return NextResponse.json(
        { error: 'Failed to update verification token' },
        { status: 500 }
      );
    }

    // Store verification token
    verificationTokens.set(verificationToken, {
      userId: user.id,
      email: user.email,
      expires: verificationExpires,
    });

    // Resend verification email (mock)
    await sendVerificationEmail(email, verificationToken, user.name);

    return NextResponse.json({
      success: true,
      message: 'Verification email sent successfully',
    });

  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}