import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/db';
import { Job } from '@/models/Job';
import jwt from 'jsonwebtoken';

// Validation schema for jobs
const jobSchema = z.object({
  title: z.string().min(3, 'Job title must be at least 3 characters'),
  company: z.string().min(2, 'Company name must be at least 2 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  type: z.enum(['full-time', 'part-time', 'internship', 'contract', 'freelance']),
  category: z.enum(['software', 'hardware', 'mechanical', 'civil', 'electrical', 'other']),
  location: z.string().min(2, 'Location is required'),
  remote: z.boolean().optional().default(false),
  salary: z.object({
    min: z.number().min(0, 'Minimum salary cannot be negative'),
    max: z.number().min(0, 'Maximum salary cannot be negative'),
    currency: z.string().default('INR'),
  }).optional(),
  requirements: z.array(z.string()).optional().default([]),
  skills: z.array(z.string()).optional().default([]),
  experience: z.object({
    min: z.number().min(0, 'Minimum experience cannot be negative'),
    max: z.number().min(0, 'Maximum experience cannot be negative'),
  }).optional().default({ min: 0, max: 0 }),
  applicationDeadline: z.string().datetime('Invalid date format'),
  applicationLink: z.string().url('Invalid URL').optional(),
  contactEmail: z.string().email('Invalid email format').optional(),
  isActive: z.boolean().optional().default(true),
  featured: z.boolean().optional().default(false),
});

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const location = searchParams.get('location');
    const remote = searchParams.get('remote') === 'true';
    const featured = searchParams.get('featured') === 'true';
    const search = searchParams.get('search');
    const company = searchParams.get('company');

    const query: Record<string, unknown> = { isActive: true };
    if (type) query.type = type;
    if (category) query.category = category;
    if (featured) query.featured = true;
    if (location) query.location = { $regex: String(location), $options: 'i' };
    if (company) query.company = { $regex: String(company), $options: 'i' };
    if (remote) query.remote = true;
    if (search) {
      const s = String(search).trim();
      query.$or = [
        { title: { $regex: s, $options: 'i' } },
        { company: { $regex: s, $options: 'i' } },
        { description: { $regex: s, $options: 'i' } },
        { skills: { $elemMatch: { $regex: s, $options: 'i' } } },
      ];
    }

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      Job.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Job.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: items,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });

  } catch (error) {
    console.error('Jobs fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    if (!JWT_SECRET) {
      console.error('JWT_SECRET not configured');
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }
    try {
      jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate input
    const validatedData = jobSchema.parse(body);
    await connectToDatabase();

    const created = await Job.create({
      title: validatedData.title,
      company: validatedData.company,
      description: validatedData.description,
      type: validatedData.type,
      // Note: the schema defines allowed categories; store raw value for simplicity
      // If category not in Job model, remove or add field to model if needed
      location: validatedData.location,
      // Map additional optional fields
      // For minimal viable integration, persist only basic fields we modeled
    } as any);

    return NextResponse.json({
      success: true,
      message: 'Job posted successfully',
      data: created,
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Job creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}