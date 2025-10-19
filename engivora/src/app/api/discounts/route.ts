import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Discount } from '@/models/Discount';

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

    const query: Record<string, unknown> = { active: true };
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
    // Remove authentication check to allow public access
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
      expiresAt: body.expiresAt || thirtyDaysFromNow,
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