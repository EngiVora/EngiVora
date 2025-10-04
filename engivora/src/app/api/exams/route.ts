import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/db';
import { Exam } from '@/models/Exam';
import jwt from 'jsonwebtoken';

// Validation schema for exams
const examSchema = z.object({
  name: z.string().min(3, 'Exam name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  type: z.enum(['entrance', 'competitive', 'certification', 'placement']),
  category: z.enum(['engineering', 'medical', 'management', 'law', 'general']),
  examDate: z.string().datetime('Invalid date format'),
  registrationStartDate: z.string().datetime('Invalid date format'),
  registrationEndDate: z.string().datetime('Invalid date format'),
  applicationFee: z.number().min(0, 'Fee cannot be negative'),
  eligibility: z.array(z.string()),
  syllabus: z.array(z.string()).optional(),
  examCenters: z.array(z.string()).optional(),
  officialWebsite: z.string().url('Invalid URL').optional(),
  isActive: z.boolean().optional().default(true),
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
    const isActive = searchParams.get('active') === 'true';
    const search = searchParams.get('search');
    const upcoming = searchParams.get('upcoming') === 'true';
    
    const query: Record<string, unknown> = {};
    if (type) query.type = type;
    if (category) query.category = category;
    if (isActive) query.isActive = true;
    if (upcoming) query.examDate = { $gt: new Date() };
    if (search) {
      const s = String(search).trim();
      query.$or = [
        { title: { $regex: s, $options: 'i' } },
        { description: { $regex: s, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      Exam.find(query).sort({ date: 1 }).skip(skip).limit(limit),
      Exam.countDocuments(query),
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
    console.error('Exam fetch error:', error);
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
      return NextResponse.json({ 
        error: 'Server configuration error',
        details: 'JWT_SECRET is not properly configured'
      }, { status: 500 });
    }
    
    try {
      const payload = jwt.verify(token, JWT_SECRET) as { role?: string };
      if (payload.role !== 'admin') {
        return NextResponse.json(
          { error: 'Admin access required' },
          { status: 403 }
        );
      }
    } catch (jwtError) {
      console.error('JWT verification error:', jwtError);
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate input
    const validatedData = examSchema.parse(body);
    await connectToDatabase();

    // Create exam with proper field mapping
    const created = await Exam.create({
      title: validatedData.name,
      organization: 'Admin',
      date: new Date(validatedData.examDate),
      category: validatedData.category,
      description: validatedData.description,
    });

    return NextResponse.json({
      success: true,
      message: 'Exam created successfully',
      data: created,
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Exam creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}