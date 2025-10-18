import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/db';

// Validation schema for job applications
const jobApplicationSchema = z.object({
  jobId: z.string().min(1, 'Job ID is required'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').optional(),
  resumeUrl: z.string().url('Invalid resume URL').optional(),
  coverLetter: z.string().min(10, 'Cover letter must be at least 10 characters').optional(),
  linkedinProfile: z.string().url('Invalid LinkedIn URL').optional(),
  portfolioUrl: z.string().url('Invalid portfolio URL').optional(),
  expectedSalary: z.string().optional(),
  availableStartDate: z.string().optional(),
  workAuthorization: z.enum(['citizen', 'permanent_resident', 'visa_required', 'other']).optional(),
  relocateWilling: z.boolean().optional(),
  remoteWork: z.boolean().optional(),
  additionalInfo: z.string().max(1000, 'Additional info must not exceed 1000 characters').optional()
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input data
    const validatedData = jobApplicationSchema.parse(body);

    // Connect to database
    await connectToDatabase();

    // Generate unique application ID
    const applicationId = `APP${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    // Mock application data save (in real app, save to database)
    const applicationData = {
      applicationId,
      jobId: validatedData.jobId,
      applicantInfo: {
        fullName: validatedData.fullName,
        email: validatedData.email,
        phone: validatedData.phone,
        linkedinProfile: validatedData.linkedinProfile,
        portfolioUrl: validatedData.portfolioUrl
      },
      applicationDetails: {
        resumeUrl: validatedData.resumeUrl,
        coverLetter: validatedData.coverLetter,
        expectedSalary: validatedData.expectedSalary,
        availableStartDate: validatedData.availableStartDate,
        workAuthorization: validatedData.workAuthorization,
        relocateWilling: validatedData.relocateWilling,
        remoteWork: validatedData.remoteWork,
        additionalInfo: validatedData.additionalInfo
      },
      status: 'submitted',
      submissionDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };

    // Simulate database save delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In real app, you would also:
    // 1. Send confirmation email to applicant
    // 2. Notify hiring managers
    // 3. Store resume file if uploaded
    // 4. Update job application count

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully',
      data: {
        applicationId,
        status: 'submitted',
        submissionDate: applicationData.submissionDate,
        nextSteps: [
          'Your application has been received and is under review',
          'HR team will review your application within 5-7 business days',
          'If selected, you will be contacted for next steps',
          'You can track your application status using the application ID'
        ],
        trackingUrl: `${process.env.NEXT_PUBLIC_APP_URL}/jobs/applications/${applicationId}`
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Job application error:', error);

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
      message: 'Failed to submit application. Please try again.'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get('applicationId');
    const email = searchParams.get('email');
    const jobId = searchParams.get('jobId');

    if (!applicationId && !email && !jobId) {
      return NextResponse.json({
        success: false,
        error: 'Application ID, email, or job ID is required'
      }, { status: 400 });
    }

    // Connect to database
    await connectToDatabase();

    // Mock application status check
    const mockApplications = [
      {
        applicationId: applicationId || 'APP1234567890',
        jobId: jobId || 'software-engineer',
        jobTitle: 'Software Engineer',
        company: 'Tech Solutions Inc',
        status: 'under_review',
        submissionDate: '2024-07-15T10:30:00Z',
        lastUpdated: '2024-07-18T14:20:00Z',
        timeline: [
          {
            status: 'submitted',
            date: '2024-07-15T10:30:00Z',
            description: 'Application submitted successfully'
          },
          {
            status: 'under_review',
            date: '2024-07-16T09:15:00Z',
            description: 'Application is being reviewed by HR team'
          }
        ]
      }
    ];

    // Filter applications based on query parameters
    let filteredApplications = mockApplications;

    if (applicationId) {
      filteredApplications = mockApplications.filter(app => app.applicationId === applicationId);
    } else if (email) {
      // In real app, filter by email from database
      filteredApplications = mockApplications;
    } else if (jobId) {
      filteredApplications = mockApplications.filter(app => app.jobId === jobId);
    }

    return NextResponse.json({
      success: true,
      data: filteredApplications
    });

  } catch (error) {
    console.error('Application fetch error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

// PUT endpoint for updating application status (admin use)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { applicationId, status, notes } = body;

    if (!applicationId || !status) {
      return NextResponse.json({
        success: false,
        error: 'Application ID and status are required'
      }, { status: 400 });
    }

    const validStatuses = ['submitted', 'under_review', 'shortlisted', 'interview_scheduled', 'rejected', 'hired'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid status value'
      }, { status: 400 });
    }

    // Connect to database
    await connectToDatabase();

    // Mock status update
    const updatedApplication = {
      applicationId,
      status,
      lastUpdated: new Date().toISOString(),
      notes: notes || '',
      updatedBy: 'system' // In real app, get from authenticated user
    };

    // In real app, you would:
    // 1. Update database record
    // 2. Send notification email to applicant
    // 3. Log the status change

    return NextResponse.json({
      success: true,
      message: 'Application status updated successfully',
      data: updatedApplication
    });

  } catch (error) {
    console.error('Application update error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
