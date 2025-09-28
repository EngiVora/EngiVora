import { NextResponse } from 'next/server';

// Function to check if real email service is configured
function getEmailServiceStatus() {
  const emailService = process.env.EMAIL_SERVICE;
  const emailUser = process.env.EMAIL_USER;
  const emailAppPassword = process.env.EMAIL_APP_PASSWORD;
  
  // Check if we have a valid email service configuration
  const isConfigured = !!(emailService && emailUser && emailAppPassword) || 
                      !!(emailService && process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
  
  if (isConfigured) {
    return {
      configured: true,
      service: emailService || 'smtp',
      mode: 'production'
    };
  }
  
  return {
    configured: false,
    service: 'none',
    mode: 'mock'
  };
}

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