import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/db';
import { Event } from '@/models/Event';
import jwt from 'jsonwebtoken';

// Validation schema for events
const eventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  type: z.enum(['Career Fair', 'Workshop', 'Conference', 'Webinar', 'Hackathon']),
  status: z.enum(['Upcoming', 'Live', 'Completed', 'Scheduled', 'Cancelled']),
  startDate: z.string().datetime('Invalid start date format'),
  endDate: z.string().datetime('Invalid end date format'),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid start time format (HH:MM)'),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid end time format (HH:MM)'),
  location: z.string().min(2, 'Location is required'),
  isOnline: z.boolean().optional().default(false),
  maxAttendees: z.number().min(1, 'Maximum attendees must be at least 1'),
  price: z.number().min(0, 'Price cannot be negative').optional().default(0),
  organizer: z.string().min(2, 'Organizer is required'),
  category: z.enum(['Career', 'Education', 'Conference', 'Webinar', 'Competition']),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional().default(false),
  imageUrl: z.string().url('Invalid image URL').optional(),
  requirements: z.string().optional(),
  agenda: z.array(z.string()).optional(),
});

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured') === 'true';
    const search = searchParams.get('search');
    const upcoming = searchParams.get('upcoming') === 'true';

    const query: Record<string, unknown> = {};
    if (type) query.type = type;
    if (status) query.status = status;
    if (category) query.category = category;
    if (featured) query.featured = true;
    if (upcoming) query.startDate = { $gt: new Date() };
    if (search) {
      const s = String(search).trim();
      query.$or = [
        { title: { $regex: s, $options: 'i' } },
        { description: { $regex: s, $options: 'i' } },
        { organizer: { $regex: s, $options: 'i' } },
        { tags: { $elemMatch: { $regex: s, $options: 'i' } } },
      ];
    }

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      Event.find(query).sort({ startDate: 1 }).skip(skip).limit(limit),
      Event.countDocuments(query),
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
    console.error('Events fetch error:', error);
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
    const validatedData = eventSchema.parse(body);
    await connectToDatabase();

    const created = await Event.create({
      title: validatedData.title,
      description: validatedData.description,
      type: validatedData.type,
      status: validatedData.status,
      startDate: new Date(validatedData.startDate),
      endDate: new Date(validatedData.endDate),
      startTime: validatedData.startTime,
      endTime: validatedData.endTime,
      location: validatedData.location,
      isOnline: validatedData.isOnline,
      maxAttendees: validatedData.maxAttendees,
      registeredAttendees: 0,
      price: validatedData.price,
      organizer: validatedData.organizer,
      category: validatedData.category,
      tags: validatedData.tags || [],
      featured: validatedData.featured,
      imageUrl: validatedData.imageUrl,
      requirements: validatedData.requirements,
      agenda: validatedData.agenda || [],
    });

    return NextResponse.json({
      success: true,
      message: 'Event created successfully',
      data: created,
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Event creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}