import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/db';
import { Message } from '@/models/Message';
import jwt from 'jsonwebtoken';

// Validation schema for messages
const messageSchema = z.object({
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  sender: z.string().email('Invalid sender email'),
  recipient: z.string().email('Invalid recipient email'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  type: z.enum(['Welcome', 'Announcement', 'Job Alert', 'Promotion', 'Support']),
  status: z.enum(['Read', 'Unread', 'Draft']),
  priority: z.enum(['High', 'Normal', 'Low']),
  isStarred: z.boolean().optional().default(false),
  isArchived: z.boolean().optional().default(false),
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
    const priority = searchParams.get('priority');
    const archived = searchParams.get('archived') === 'true';
    const search = searchParams.get('search');

    const query: Record<string, unknown> = {};
    if (type) query.type = type;
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (archived) query.isArchived = true;
    if (search) {
      const s = String(search).trim();
      query.$or = [
        { subject: { $regex: s, $options: 'i' } },
        { sender: { $regex: s, $options: 'i' } },
        { recipient: { $regex: s, $options: 'i' } },
        { content: { $regex: s, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      Message.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Message.countDocuments(query),
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
    console.error('Messages fetch error:', error);
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
    const validatedData = messageSchema.parse(body);
    await connectToDatabase();

    const created = await Message.create({
      subject: validatedData.subject,
      sender: validatedData.sender,
      recipient: validatedData.recipient,
      content: validatedData.content,
      type: validatedData.type,
      status: validatedData.status,
      priority: validatedData.priority,
      isStarred: validatedData.isStarred,
      isArchived: validatedData.isArchived,
    });

    return NextResponse.json({
      success: true,
      message: 'Message created successfully',
      data: created,
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Message creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}