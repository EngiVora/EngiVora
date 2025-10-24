import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/db';
import { Job } from '@/models/Job';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

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
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Authorization token required', status: 401 };
  }

  const token = authHeader.substring(7);
  if (!JWT_SECRET) {
    return { error: 'Server configuration error', status: 500 };
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { role?: string };
    if (payload.role !== 'admin') {
      return { error: 'Admin access required', status: 403 };
    }
    return { user: payload };
  } catch (error) {
    return { error: 'Invalid token', status: 401 };
  }
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
    
    await connectToDatabase();
    
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

    await connectToDatabase();
    
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
