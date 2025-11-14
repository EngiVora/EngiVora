import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Discount } from '@/models/Discount';
import jwt from 'jsonwebtoken';

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
    const showAll = searchParams.get('showAll') === 'true'; // New parameter to show all discounts

    const query: Record<string, unknown> = {};
    
    // Only filter by active status if not showing all discounts
    if (!showAll) {
      query.active = true;
    }
    
    if (category) query.category = category;
    if (discountType) query.discountType = discountType;
    if (featured) query.featured = true;
    if (active) query.active = true;
    if (provider) query.provider = { $regex: String(provider), $options: 'i' };
    if (search) {
      const s = String(search).trim();
      query.$or = [
        { code: { $regex: s, $options: 'i' } },
        { title: { $regex: s, $options: 'i' } },
        { description: { $regex: s, $options: 'i' } },
      ];
    }

    // Only apply date filtering if not showing all discounts
    if (!showAll) {
      const now = new Date();
      query.$and = [
        { validFrom: { $lte: now } },
        { validUntil: { $gte: now } }
      ];
    }

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
    // Check if user is authenticated as admin
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
    
    let userId = '';
    try {
      const payload = jwt.verify(token, JWT_SECRET) as { sub: string, role: string };
      if (payload.role !== 'admin') {
        return NextResponse.json(
          { error: 'Admin access required' },
          { status: 403 }
        );
      }
      userId = payload.sub;
    } catch (jwtError) {
      console.error('JWT verification error:', jwtError);
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Ensure required fields are present
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);
    
    const discountData = {
      ...body,
      active: body.active !== undefined ? body.active : true, // Default to active
      validFrom: body.validFrom || now,
      validUntil: body.validUntil || thirtyDaysFromNow,
      percentage: body.percentage || body.discountValue || 0,
      expiresAt: body.expiresAt || body.validUntil || thirtyDaysFromNow,
    };

    // Create discount with any data provided (no validation)
    const created = await Discount.create(discountData);

    return NextResponse.json({
      success: true,
      message: 'Discount created successfully',
      data: created,
    }, { status: 201 });

  } catch (error) {
    console.error('Discount creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}