import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import jwt, { Secret } from 'jsonwebtoken';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/db';
import { JobApplication } from '@/models/JobApplication';
import { Job } from '@/models/Job';

const JWT_SECRET = (process.env.JWT_SECRET || '') as Secret;

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

// Helper function to get user ID from token
function getUserIdFromToken(token: string): string | null {
  try {
    if (!JWT_SECRET || JWT_SECRET === '') {
      return null;
    }
    const decoded = jwt.verify(token, JWT_SECRET) as { sub: string };
    return decoded.sub;
  } catch (error) {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Skip during build
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return NextResponse.json({
        success: true,
        message: 'Application submitted successfully',
        data: {
          applicationId: 'build-placeholder',
          status: 'submitted',
        },
      }, { status: 201 });
    }

    // Get user from token
    const authHeader = request.headers.get('authorization');
    let userId: string | null = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      userId = getUserIdFromToken(token);
    }

    const body = await request.json();

    // Validate input data
    const validatedData = jobApplicationSchema.parse(body);

    // Connect to database
    await connectToDatabase();

    // Generate unique application ID
    const applicationId = `APP${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    // Get job details
    let jobTitle = 'Unknown Job';
    let company = 'Unknown Company';
    try {
      const job = await Job.findById(validatedData.jobId);
      if (job) {
        jobTitle = job.title || jobTitle;
        company = job.company || company;
      }
    } catch (error) {
      console.error('Error fetching job details:', error);
    }

    // Save application to database
    const applicationData = new JobApplication({
      userId: userId ? new mongoose.Types.ObjectId(userId) : undefined,
      jobId: validatedData.jobId,
      applicationId,
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
      submissionDate: new Date(),
      lastUpdated: new Date()
    });

    await applicationData.save();

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
    // Skip during build
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return NextResponse.json({
        success: true,
        data: []
      });
    }

    // Get user from token
    const authHeader = request.headers.get('authorization');
    let userId: string | null = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      userId = getUserIdFromToken(token);
    }

    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get('applicationId');
    const email = searchParams.get('email');
    const jobId = searchParams.get('jobId');
    const userOnly = searchParams.get('userOnly') === 'true'; // Get only current user's applications

    if (!applicationId && !email && !jobId && !userId && !userOnly) {
      return NextResponse.json({
        success: false,
        error: 'Application ID, email, job ID, or authentication required'
      }, { status: 400 });
    }

    // Connect to database
    await connectToDatabase();

    // Build query
    const query: any = {};
    
    if (applicationId) {
      query.applicationId = applicationId;
    } else if (email) {
      query['applicantInfo.email'] = email;
    } else if (jobId) {
      query.jobId = jobId;
    }
    
    // If userOnly is true or userId exists, filter by user
    if (userOnly || userId) {
      if (userId) {
        query.userId = new mongoose.Types.ObjectId(userId);
      } else {
        return NextResponse.json({
          success: false,
          error: 'Authentication required to view your applications'
        }, { status: 401 });
      }
    }

    const applications = await JobApplication.find(query)
      .sort({ submissionDate: -1 })
      .limit(50);

    // Get job details for each application
    const applicationsWithJobDetails = await Promise.all(
      applications.map(async (app) => {
        let jobTitle = 'Unknown Job';
        let company = 'Unknown Company';
        try {
          const job = await Job.findById(app.jobId);
          if (job) {
            jobTitle = job.title || jobTitle;
            company = job.company || company;
          }
        } catch (error) {
          console.error('Error fetching job details:', error);
        }

        return {
          applicationId: app.applicationId,
          jobId: app.jobId,
          jobTitle,
          company,
          status: app.status,
          submissionDate: app.submissionDate.toISOString(),
          lastUpdated: app.lastUpdated.toISOString(),
          applicantInfo: app.applicantInfo,
          applicationDetails: app.applicationDetails,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: applicationsWithJobDetails
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
