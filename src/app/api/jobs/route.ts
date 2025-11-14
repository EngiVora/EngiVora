import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Job } from '@/models/Job';

export async function GET(request: NextRequest) {
  try {
    // Try to connect to database, but handle gracefully if not configured
    try {
      await connectToDatabase();
    } catch (dbError) {
      console.log('Database not available, returning empty jobs list');
      // Return empty results if database is not configured
      return NextResponse.json({
        success: true,
        data: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: 10,
          hasNext: false,
          hasPrev: false,
        },
        message: 'Database not configured. Please set MONGODB_URI in your environment.',
      });
    }

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

    const response = NextResponse.json({
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

    // Add cache control headers to prevent stale data
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;

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

    // Try to connect to database, return error if not configured
    try {
      await connectToDatabase();
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        { 
          error: 'Database not configured',
          message: 'Cannot create job. Please set MONGODB_URI in your environment to enable job creation.',
          details: dbError instanceof Error ? dbError.message : 'Unknown database error'
        },
        { status: 503 }
      );
    }

    // Ensure required fields are present
    const jobData = {
      title: body.title,
      company: body.company || "Unknown Company",
      location: body.location || "Remote",
      type: body.type || "full-time",
      category: body.category || "software",
      description: body.description || "",
      remote: body.remote !== undefined ? body.remote : false,
      salary: body.salary || { min: 0, max: 0, currency: "INR" },
      requirements: body.requirements || [],
      skills: body.skills || [],
      experience: body.experience || { min: 0, max: 0 },
      applicationDeadline: body.applicationDeadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      applicationLink: body.applicationLink || "",
      contactEmail: body.contactEmail || "",
      isActive: body.isActive !== undefined ? body.isActive : true,
      featured: body.featured !== undefined ? body.featured : false,
      // Add image URL
      imageUrl: body.imageUrl || "/images/company-placeholder.svg"
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