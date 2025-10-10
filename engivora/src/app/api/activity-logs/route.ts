import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/db';
import { ActivityLog } from '@/models/ActivityLog';
import jwt from 'jsonwebtoken';

// Validation schema for activity logs
const activityLogSchema = z.object({
  timestamp: z.string().datetime('Invalid timestamp format'),
  user: z.string().min(1, 'User is required'),
  email: z.string().email('Invalid email format'),
  action: z.enum(['Login', 'Create', 'Update', 'Delete', 'Download', 'Login Attempt']),
  resource: z.string().min(1, 'Resource is required'),
  ipAddress: z.string().min(7, 'IP address is required'),
  userAgent: z.string().min(1, 'User agent is required'),
  device: z.enum(['Desktop', 'Mobile', 'Tablet']),
  location: z.string().min(1, 'Location is required'),
  status: z.enum(['Success', 'Failed', 'Warning', 'Info']),
  details: z.string().min(1, 'Details are required'),
});

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const action = searchParams.get('action');
    const status = searchParams.get('status');
    const device = searchParams.get('device');
    const search = searchParams.get('search');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const query: Record<string, unknown> = {};
    if (action) query.action = action;
    if (status) query.status = status;
    if (device) query.device = device;
    if (search) {
      const s = String(search).trim();
      query.$or = [
        { user: { $regex: s, $options: 'i' } },
        { email: { $regex: s, $options: 'i' } },
        { action: { $regex: s, $options: 'i' } },
        { resource: { $regex: s, $options: 'i' } },
        { ipAddress: { $regex: s, $options: 'i' } },
        { details: { $regex: s, $options: 'i' } },
      ];
    }
    
    if (startDate || endDate) {
      const timestampQuery: { $gte?: Date; $lte?: Date } = {};
      if (startDate) {
        timestampQuery.$gte = new Date(startDate);
      }
      if (endDate) {
        timestampQuery.$lte = new Date(endDate);
      }
      query.timestamp = timestampQuery;
    }

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      ActivityLog.find(query).sort({ timestamp: -1 }).skip(skip).limit(limit),
      ActivityLog.countDocuments(query),
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
    console.error('Activity logs fetch error:', error);
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
    const validatedData = activityLogSchema.parse(body);
    await connectToDatabase();

    const created = await ActivityLog.create({
      timestamp: new Date(validatedData.timestamp),
      user: validatedData.user,
      email: validatedData.email,
      action: validatedData.action,
      resource: validatedData.resource,
      ipAddress: validatedData.ipAddress,
      userAgent: validatedData.userAgent,
      device: validatedData.device,
      location: validatedData.location,
      status: validatedData.status,
      details: validatedData.details,
    });

    return NextResponse.json({
      success: true,
      message: 'Activity log created successfully',
      data: created,
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Activity log creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}