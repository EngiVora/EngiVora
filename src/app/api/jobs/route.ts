import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Job } from '@/models/Job';

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
    const jobData = {
      ...body,
      isActive: body.isActive !== undefined ? body.isActive : true, // Default to active
    };

    // Create job with any data provided (no validation)
    const created = await Job.create(jobData);

    return NextResponse.json({
      success: true,
      message: 'Job posted successfully',
      data: created,
    }, { status: 201 });

  } catch (error) {
    console.error('Job creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}