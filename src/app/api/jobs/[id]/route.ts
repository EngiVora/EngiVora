import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/db';
import { Job } from '@/models/Job';
import { verifyAdminToken } from '@/lib/jwt-utils';

// Validation schema for job updates
const jobUpdateSchema = z.object({
  title: z.string().min(3, 'Job title must be at least 3 characters').optional(),
  company: z.string().min(2, 'Company name must be at least 2 characters').optional(),
  description: z.string().min(50, 'Description must be at least 50 characters').optional(),
  type: z.enum(['full-time', 'part-time', 'internship', 'contract', 'freelance']).optional(),
  category: z.enum(['software', 'hardware', 'mechanical', 'civil', 'electrical', 'other']).optional(),
  location: z.string().min(2, 'Location is required').optional(),
  remote: z.boolean().optional(),
  salary: z.object({
    min: z.number().min(0, 'Minimum salary cannot be negative'),
    max: z.number().min(0, 'Maximum salary cannot be negative'),
    currency: z.string().default('INR'),
  }).optional(),
  requirements: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
  experience: z.object({
    min: z.number().min(0, 'Minimum experience cannot be negative'),
    max: z.number().min(0, 'Maximum experience cannot be negative'),
  }).optional(),
  applicationDeadline: z.string().datetime('Invalid date format').optional(),
  applicationLink: z.string().url('Invalid URL').optional(),
  contactEmail: z.string().email('Invalid email format').optional(),
  isActive: z.boolean().optional(),
  featured: z.boolean().optional(),
});

async function verifyAdmin(request: NextRequest) {
  // Try to get token from Authorization header first
  let token: string | null = null;
  const authHeader = request.headers.get('authorization');
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else {
    // Fallback to cookies from request
    try {
      // NextRequest has a cookies property in Next.js 13+
      token = request.cookies.get('adminToken')?.value || null;
    } catch (error) {
      // If that fails, parse cookie header manually
      const cookieHeader = request.headers.get('cookie');
      if (cookieHeader) {
        const cookieMap = cookieHeader.split(';').reduce((acc, cookie) => {
          const [key, value] = cookie.trim().split('=');
          if (key && value) {
            acc[key] = decodeURIComponent(value);
          }
          return acc;
        }, {} as Record<string, string>);
        token = cookieMap['adminToken'] || null;
      }
    }
  }
  
  if (!token) {
    console.error('No token found in request');
    return { error: 'Authorization token required', status: 401 };
  }

  console.log('Token found, verifying...', { tokenLength: token.length, tokenPrefix: token.substring(0, 20) });
  
  const verificationResult = await verifyAdminToken(token);
  
  if (!verificationResult.success) {
    console.error('Token verification failed:', verificationResult.error);
    // Provide more helpful error message
    let errorMessage = verificationResult.error || 'Invalid token';
    if (errorMessage.includes('Invalid token') || errorMessage.includes('JsonWebTokenError')) {
      errorMessage = 'Your session has expired or is invalid. Please log out and log back in.';
    }
    return { 
      error: errorMessage, 
      status: 401 
    };
  }

  console.log('Token verified successfully for user:', verificationResult.user?.email);
  return { user: verificationResult.user };
}

// GET /api/jobs/[id] - Get specific job
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    await connectToDatabase();
    const job = await Job.findById(params.id);
    
    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: job,
    });

  } catch (error) {
    console.error('Job fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/jobs/[id] - Update job
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    // Verify admin authentication
    const authResult = await verifyAdmin(request);
    if ('error' in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const body = await request.json();
    const validatedData = jobUpdateSchema.parse(body);
    
    // Try to connect to database, handle gracefully if not configured
    try {
      await connectToDatabase();
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        { 
          error: 'Database not configured',
          message: 'Cannot update job. Please set MONGODB_URI in your environment.',
          details: dbError instanceof Error ? dbError.message : 'Unknown database error'
        },
        { status: 503 }
      );
    }
    
    const updatedJob = await Job.findByIdAndUpdate(
      params.id,
      validatedData,
      { new: true, runValidators: true }
    );

    if (!updatedJob) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Job updated successfully',
      data: updatedJob,
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Job update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/jobs/[id] - Delete job
export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  try {
    // Verify admin authentication
    const authResult = await verifyAdmin(request);
    if ('error' in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    // Try to connect to database, handle gracefully if not configured
    try {
      await connectToDatabase();
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        { 
          error: 'Database not configured',
          message: 'Cannot delete job. Please set MONGODB_URI in your environment.',
          details: dbError instanceof Error ? dbError.message : 'Unknown database error'
        },
        { status: 503 }
      );
    }
    
    const deletedJob = await Job.findByIdAndDelete(params.id);

    if (!deletedJob) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Job deleted successfully',
    });

  } catch (error) {
    console.error('Job deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
