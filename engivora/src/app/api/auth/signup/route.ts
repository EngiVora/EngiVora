import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { 
  findUserByEmail, 
  addUser, 
  verificationTokens, 
  sendVerificationEmail,
  type User 
} from '@/lib/auth-db';

// Validation schema
const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string(),
  department: z.string().min(2, 'Department is required'),
  year: z.string().optional(),
  rollNumber: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});



export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = signupSchema.parse(body);
    
    // Check if user already exists
    const existingUser = findUserByEmail(validatedData.email);
    
    if (existingUser) {
      if (!existingUser.emailVerified) {
        return NextResponse.json(
          { 
            error: 'Email already registered but not verified. Please check your email for verification link.',
            requiresVerification: true
          },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }
    
    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(validatedData.password, saltRounds);
    
    // Generate email verification token
    const verificationToken = randomUUID();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    // Create new user
    const userId = randomUUID();
    const newUser: User = {
      id: userId,
      name: validatedData.name,
      email: validatedData.email,
      password: hashedPassword,
      department: validatedData.department,
      year: validatedData.year,
      rollNumber: validatedData.rollNumber,
      role: 'student',
      emailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires.toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Add to mock database
    addUser(newUser);
    
    // Store verification token
    verificationTokens.set(verificationToken, {
      userId: newUser.id,
      email: newUser.email,
      expires: verificationExpires,
    });
    
    // Send verification email
    try {
      await sendVerificationEmail(newUser.email, verificationToken, newUser.name);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Don't fail registration if email fails
    }
    
    // Create user session data (exclude sensitive fields)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, emailVerificationToken: __, ...userWithoutSensitiveData } = newUser;
    
    return NextResponse.json({
      success: true,
      message: 'Account created successfully! Please check your email to verify your account.',
      user: userWithoutSensitiveData,
      requiresEmailVerification: true,
    }, { status: 201 });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { 
      message: 'Signup endpoint - POST method required',
      endpoints: {
        POST: '/api/auth/signup - Create new user account',
      },
      schema: {
        name: 'string (min 2 characters)',
        email: 'string (valid email)',
        password: 'string (min 6 characters, must contain uppercase, lowercase, and number)',
        confirmPassword: 'string (must match password)',
        department: 'string (min 2 characters)',
        year: 'string (optional)',
        rollNumber: 'string (optional)',
      }
    },
    { status: 405 }
  );
}