import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/db';
import { Discount } from '@/models/Discount';
import jwt from 'jsonwebtoken';

// Validation schema for discounts
const discountSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.enum(['books', 'software', 'courses', 'hardware', 'services', 'events']),
  discountType: z.enum(['percentage', 'fixed', 'bogo', 'free']),
  discountValue: z.number().min(0, 'Discount value cannot be negative'),
  originalPrice: z.number().min(0, 'Original price cannot be negative').optional(),
  discountedPrice: z.number().min(0, 'Discounted price cannot be negative').optional(),
  couponCode: z.string().optional(),
  provider: z.string().min(2, 'Provider name is required'),
  websiteUrl: z.string().url('Invalid URL'),
  imageUrl: z.string().url('Invalid image URL').optional(),
  validFrom: z.string().datetime('Invalid date format'),
  validUntil: z.string().datetime('Invalid date format'),
  termsAndConditions: z.array(z.string()).optional(),
  eligibility: z.array(z.string()).optional(),
  maxUsage: z.number().min(1, 'Max usage must be at least 1').optional(),
  featured: z.boolean().optional().default(false),
  isActive: z.boolean().optional().default(true),
});

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const discountType = searchParams.get('type');
    const featured = searchParams.get('featured') === 'true';
    const active = searchParams.get('active') === 'true';
    const search = searchParams.get('search');
    const provider = searchParams.get('provider');

    const query: Record<string, unknown> = {};
    if (category) query.category = category;
    if (discountType) query.discountType = discountType;
    if (featured) query.featured = true;
    if (active) query.active = true;
    if (provider) query.provider = { $regex: String(provider), $options: 'i' };
    if (search) {
      const s = String(search).trim();
      query.$or = [
        { code: { $regex: s, $options: 'i' } },
        { description: { $regex: s, $options: 'i' } },
      ];
    }

    const now = new Date();
    query.$and = [
      { $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }] },
    ];

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      Discount.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Discount.countDocuments(query),
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
    console.error('Discounts fetch error:', error);
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
      const payload = jwt.verify(token, JWT_SECRET) as { role?: string };
      if (payload.role !== 'admin') {
        return NextResponse.json(
          { error: 'Admin access required' },
          { status: 403 }
        );
      }
    } catch {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate input
    const validatedData = discountSchema.parse(body);
    await connectToDatabase();

    const created = await Discount.create({
      code: validatedData.couponCode || `DISC-${Date.now()}`,
      description: validatedData.description,
      percentage: validatedData.discountType === 'percentage' ? validatedData.discountValue : 0,
      expiresAt: new Date(validatedData.validUntil),
      active: validatedData.isActive ?? true,
    } as any);

    return NextResponse.json({
      success: true,
      message: 'Discount created successfully',
      data: created,
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Discount creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}