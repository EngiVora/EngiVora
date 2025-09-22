import { NextResponse } from 'next/server';
import { getEmailServiceStatus } from '@/lib/email-service';

export async function GET() {
  try {
    const status = getEmailServiceStatus();
    
    return NextResponse.json({
      success: true,
      emailService: {
        ...status,
        configured: status.configured,
        message: status.configured 
          ? `✅ Real email service (${status.service}) is configured and ready`
          : '⚠️ Using mock email service. Configure EMAIL_SERVICE environment variable for real emails.'
      },
      instructions: status.configured 
        ? 'Email verification emails will be sent to users\' actual email addresses.'
        : 'Email verification links will be displayed in the server console.',
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        EMAIL_SERVICE: process.env.EMAIL_SERVICE || 'not-set',
        EMAIL_USER: process.env.EMAIL_USER ? 'configured' : 'not-set',
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'not-set'
      }
    });

  } catch (error) {
    console.error('Email service status check failed:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to check email service status',
        emailService: {
          configured: false,
          service: 'error',
          mode: 'mock'
        }
      },
      { status: 500 }
    );
  }
}