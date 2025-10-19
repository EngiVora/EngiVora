import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Define the profile type
interface TestProfile {
  name?: string;
  skills?: string[];
  interests?: string[];
  updatedAt: string;
}

// Mock database for testing
const testProfileData: Record<string, TestProfile> = {};

const testProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  skills: z.array(z.string().min(1, 'Skill cannot be empty')).max(20, 'Maximum 20 skills allowed').optional(),
  interests: z.array(z.string().min(1, 'Interest cannot be empty')).max(20, 'Maximum 20 interests allowed').optional(),
});

// GET /api/test-profile - Get test profile
export async function GET(req: NextRequest) {
  try {
    // Extract user ID from request headers (set by middleware)
    const userId = req.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const profile = testProfileData[userId] || {};
    
    return NextResponse.json({
      success: true,
      profile
    });
  } catch (error) {
    console.error('Test profile fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/test-profile - Update test profile
export async function PUT(req: NextRequest) {
  try {
    // Extract user ID from request headers (set by middleware)
    const userId = req.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    console.log('Received profile data:', body);
    
    // Validate the request body
    const validatedData = testProfileSchema.parse(body);
    console.log('Validated data:', validatedData);
    
    // Store the profile data
    testProfileData[userId] = {
      ...validatedData,
      updatedAt: new Date().toISOString()
    };
    
    return NextResponse.json({
      success: true,
      message: 'Test profile updated successfully',
      profile: testProfileData[userId]
    });
  } catch (error) {
    console.error('Test profile update error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}