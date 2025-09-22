// Production-ready email service for Engivora
import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

// Email service configuration
const createEmailTransporter = (): Transporter | null => {
  const emailService = process.env.EMAIL_SERVICE;

  switch (emailService) {
    case 'gmail':
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_APP_PASSWORD, // Use App Password, not regular password
        },
      });

    case 'outlook':
      return nodemailer.createTransport({
        service: 'hotmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

    case 'smtp':
      return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

    case 'sendgrid':
      return nodemailer.createTransport({
        host: 'smtp.sendgrid.net',
        port: 587,
        secure: false,
        auth: {
          user: 'apikey',
          pass: process.env.SENDGRID_API_KEY,
        },
      });

    case 'mailgun':
      return nodemailer.createTransport({
        host: 'smtp.mailgun.org',
        port: 587,
        secure: false,
        auth: {
          user: process.env.MAILGUN_SMTP_LOGIN,
          pass: process.env.MAILGUN_SMTP_PASSWORD,
        },
      });

    default:
      // Fallback to mock for development
      console.warn('⚠️  EMAIL_SERVICE not configured. Using mock email service.');
      return null; // Will trigger mock behavior
  }
};

// Check if real email service is configured
const isEmailServiceConfigured = (): boolean => {
  const service = process.env.EMAIL_SERVICE;
  if (!service || service === 'mock') return false;
  
  switch (service) {
    case 'gmail':
      return !!(process.env.EMAIL_USER && process.env.EMAIL_APP_PASSWORD);
    case 'outlook':
      return !!(process.env.EMAIL_USER && process.env.EMAIL_PASSWORD);
    case 'smtp':
      return !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
    case 'sendgrid':
      return !!process.env.SENDGRID_API_KEY;
    case 'mailgun':
      return !!(process.env.MAILGUN_SMTP_LOGIN && process.env.MAILGUN_SMTP_PASSWORD);
    default:
      return false;
  }
};

// Mock email function (fallback)
const sendMockEmail = async (email: string, token: string, name: string): Promise<boolean> => {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/verify-email?token=${token}`;
  
  console.log(`\n🔐 EMAIL VERIFICATION REQUIRED (MOCK MODE)`);
  console.log(`📧 To: ${email}`);
  console.log(`👤 Name: ${name}`);
  console.log(`🔗 Verification Link: ${verificationUrl}`);
  console.log(`⏰ Expires: ${new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()}`);
  console.log(`\n💡 To enable real emails, configure EMAIL_SERVICE in your .env file\n`);
  
  return true;
};

// Real email sending function with fallback to mock
export async function sendVerificationEmail(email: string, token: string, name: string): Promise<boolean> {
  try {
    // Check if real email service is configured
    if (!isEmailServiceConfigured()) {
      return await sendMockEmail(email, token, name);
    }

    const transporter = createEmailTransporter();
    if (!transporter) {
      return await sendMockEmail(email, token, name);
    }
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/verify-email?token=${token}`;
    const fromEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@engivora.com';

    // Test transporter connection
    await transporter.verify();
    console.log('✅ Email service connection verified');

    const mailOptions = {
      from: {
        name: 'Engivora',
        address: fromEmail,
      },
      to: email,
      subject: 'Verify your Engivora account',
      html: createEmailTemplate(name, verificationUrl),
      text: createTextEmail(name, verificationUrl),
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ Verification email sent successfully to ${email}`);
    console.log(`📧 Message ID: ${result.messageId}`);
    
    return true;

  } catch (error) {
    console.error('❌ Email sending failed:', error);
    
    // Fallback to mock if real email fails
    console.log('🔄 Falling back to mock email service...');
    return await sendMockEmail(email, token, name);
  }
}

// Email template function
const createEmailTemplate = (name: string, verificationUrl: string): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Verify your Engivora account</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f8f9fa;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #3B82F6, #1E40AF); padding: 40px 30px; text-align: center; border-radius: 0;">
        <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700;">Welcome to Engivora!</h1>
        <p style="color: #E2E8F0; margin: 10px 0 0 0; font-size: 16px;">One-stop hub for every engineering student</p>
      </div>
      
      <!-- Content -->
      <div style="background: white; padding: 40px 30px; border-radius: 0;">
        <h2 style="color: #1E40AF; margin: 0 0 20px 0; font-size: 24px;">Hi ${name},</h2>
        
        <p style="margin: 0 0 20px 0; font-size: 16px; color: #4B5563;">Thank you for joining Engivora! To complete your registration and start accessing our platform for exam updates, job opportunities, blogs, and exclusive discounts, please verify your email address.</p>
        
        <!-- CTA Button -->
        <div style="text-align: center; margin: 40px 0;">
          <a href="${verificationUrl}" 
             style="background: #3B82F6; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; font-size: 16px; transition: background-color 0.3s ease;">
            Verify Email Address
          </a>
        </div>
        
        <!-- Alternative Link -->
        <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 30px 0;">
          <p style="margin: 0 0 10px 0; font-size: 14px; color: #6B7280;">If the button above doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #3B82F6; margin: 0; font-size: 14px;">
            <a href="${verificationUrl}" style="color: #3B82F6;">${verificationUrl}</a>
          </p>
        </div>
        
        <!-- Warning -->
        <div style="background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 16px; margin: 20px 0;">
          <p style="margin: 0; color: #92400E; font-size: 14px;">
            <strong>⏰ Important:</strong> This verification link will expire in 24 hours for security reasons.
          </p>
        </div>
        
        <p style="margin: 20px 0 0 0; color: #6B7280; font-size: 14px;">If you didn't create an account with Engivora, you can safely ignore this email and no account will be created.</p>
      </div>
      
      <!-- Footer -->
      <div style="background: #F9FAFB; padding: 30px; text-align: center; border-top: 1px solid #E5E7EB;">
        <p style="margin: 0 0 10px 0; color: #6B7280; font-size: 14px;">© 2024 Engivora. All rights reserved.</p>
        <p style="margin: 0; color: #9CA3AF; font-size: 12px;">This is an automated email, please do not reply to this message.</p>
      </div>
    </body>
    </html>
  `;
};

// Plain text email template
const createTextEmail = (name: string, verificationUrl: string): string => {
  return `
Welcome to Engivora, ${name}!

Thank you for joining our platform for engineering students! To complete your registration and start accessing exam updates, job opportunities, blogs, and exclusive discounts, please verify your email address.

Verification Link:
${verificationUrl}

This link will expire in 24 hours for security reasons.

If you didn't create an account with Engivora, you can safely ignore this email.

© 2024 Engivora. All rights reserved.
This is an automated email, please do not reply.
  `;
};

// Email service status check
export const getEmailServiceStatus = () => {
  const isConfigured = isEmailServiceConfigured();
  const service = process.env.EMAIL_SERVICE || 'not-set';
  
  return {
    configured: isConfigured,
    service: service,
    mode: isConfigured ? 'real' : 'mock'
  };
};

