import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/db';
import jwt from 'jsonwebtoken';

// Validation schema for exam registration
const registrationSchema = z.object({
  examId: z.string().min(1, 'Exam ID is required'),
  personalInfo: z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    dateOfBirth: z.string().min(1, 'Date of birth is required'),
    gender: z.enum(['Male', 'Female', 'Other'], {
      errorMap: () => ({ message: 'Please select a valid gender' })
    })
  }),
  address: z.object({
    address: z.string().min(10, 'Address must be at least 10 characters'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    pincode: z.string().min(5, 'Valid pincode is required')
  }),
  education: z.object({
    qualification: z.string().min(1, 'Qualification is required'),
    institution: z.string().min(2, 'Institution name is required'),
    passingYear: z.string().min(4, 'Passing year is required'),
    percentage: z.string().min(1, 'Percentage/CGPA is required')
  }),
  examPreferences: z.object({
    examCenter: z.string().min(1, 'Exam center selection is required'),
    language: z.string().min(1, 'Language selection is required')
  }),
  documents: z.object({
    photo: z.boolean().default(false),
    signature: z.boolean().default(false),
    qualification: z.boolean().default(false),
    identity: z.boolean().default(false)
  }).optional()
});

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate input data
    const validatedData = registrationSchema.parse(body);

    // Connect to database
    await connectToDatabase();

    // Generate unique registration ID
    const registrationId = `REG${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    // In a real application, you would:
    // 1. Save registration data to database
    // 2. Upload and process documents
    // 3. Send confirmation emails
    // 4. Generate payment links if needed

    // Mock registration data save
    const registrationData = {
      registrationId,
      examId: validatedData.examId,
      personalInfo: validatedData.personalInfo,
      address: validatedData.address,
      education: validatedData.education,
      examPreferences: validatedData.examPreferences,
      status: 'pending',
      registrationDate: new Date().toISOString(),
      paymentStatus: 'pending'
    };

    // Simulate database save delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
      success: true,
      message: 'Registration submitted successfully',
      data: {
        registrationId,
        status: 'pending',
        nextSteps: [
          'Complete payment within 48 hours',
          'Upload required documents',
          'Wait for verification confirmation',
          'Download admit card once approved'
        ],
        paymentLink: `https://payment.example.com/exam-registration/${registrationId}`,
        trackingUrl: `https://portal.example.com/track/${registrationId}`
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to process registration. Please try again.'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const registrationId = searchParams.get('registrationId');
    const email = searchParams.get('email');

    if (!registrationId && !email) {
      return NextResponse.json({
        success: false,
        error: 'Registration ID or email is required'
      }, { status: 400 });
    }

    // In a real application, you would fetch from database
    // Mock registration status check
    const mockRegistration = {
      registrationId: registrationId || 'REG1234567890',
      examId: 'thermo',
      examTitle: 'Thermodynamics Exam',
      candidateName: 'John Doe',
      status: 'confirmed',
      paymentStatus: 'completed',
      examDate: '2024-07-20',
      examCenter: 'New Delhi',
      admitCardUrl: registrationId ? `https://portal.example.com/admit-card/${registrationId}` : null
    };

    return NextResponse.json({
      success: true,
      data: mockRegistration
    });

  } catch (error) {
    console.error('Registration fetch error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

// PUT endpoint for updating registration
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { registrationId, updates } = body;

    if (!registrationId) {
      return NextResponse.json({
        success: false,
        error: 'Registration ID is required'
      }, { status: 400 });
    }

    // In a real application, you would:
    // 1. Validate user authorization
    // 2. Update database records
    // 3. Send notification emails if needed

    return NextResponse.json({
      success: true,
      message: 'Registration updated successfully',
      data: {
        registrationId,
        updatedFields: Object.keys(updates),
        lastModified: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Registration update error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
