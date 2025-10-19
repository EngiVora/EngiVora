import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Exam } from '@/models/Exam';

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
    
    const query: Record<string, unknown> = { isActive: true };
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

    // Add required fields if missing
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);
    
    // Ensure required fields are present
    const examData = {
      ...body,
      registrationStartDate: body.registrationStartDate || now,
      registrationEndDate: body.registrationEndDate || thirtyDaysFromNow,
    };

    // Create exam with any data provided (no validation)
    const created = await Exam.create(examData);

    return NextResponse.json({
      success: true,
      message: 'Exam created successfully',
      data: created,
    }, { status: 201 });

  } catch (error) {
    console.error('Exam creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}