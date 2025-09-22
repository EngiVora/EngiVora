import { NextRequest, NextResponse } from 'next/server';
import { sendVerificationEmail } from '@/lib/auth-db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = body;

    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required' },
        { status: 400 }
      );
    }

    // Generate a test token
    const testToken = 'test-token-' + Date.now();
    
    // Send test verification email
    const success = await sendVerificationEmail(email, testToken, name);

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Test verification email sent successfully!',
        testToken,
        note: success ? 'Check your email inbox (or spam folder)' : 'Check server console for verification link'
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to send test email' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Email test endpoint',
    usage: {
      method: 'POST',
      body: {
        email: 'your-email@example.com',
        name: 'Your Name'
      }
    },
    example: 'curl -X POST http://localhost:3000/api/auth/test-email -H "Content-Type: application/json" -d \'{"email":"test@example.com","name":"Test User"}\''
  });
}