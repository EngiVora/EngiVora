import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import jwt, { Secret } from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';

const JWT_SECRET = (process.env.JWT_SECRET || '') as Secret;

// Validation schema for profile updates
const profileUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  department: z.string().min(2, 'Department is required').optional(),
  year: z.string().optional(),
  rollNumber: z.string().optional(),
  dateOfBirth: z.string().optional(),
  mobileNumber: z.string().optional(),
  // profilePicture can be a string path (like "/images/avatars/avatar-1.svg") or null
  profilePicture: z.union([z.string().min(1), z.null()]).optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  skills: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
});

// Helper function to get user from token
async function getUserFromToken(token: string) {
  try {
    if (!JWT_SECRET || JWT_SECRET === '') {
      throw new Error('JWT_SECRET not configured');
    }
    
    const decoded = jwt.verify(token, JWT_SECRET) as { sub: string; role: string };
    await connectToDatabase();
    const user = await User.findById(decoded.sub);
    return user;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    // Skip during build
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return NextResponse.json({ 
        success: true,
        user: {
          id: 'build-placeholder',
          name: 'Build Placeholder',
          email: 'build@placeholder.com',
          role: 'student',
        },
      });
    }

    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }
    
    const token = authHeader.substring(7);
    const userDoc = await getUserFromToken(token);
    
    if (!userDoc) {
      return NextResponse.json(
        { error: 'Invalid token or user not found' },
        { status: 401 }
      );
    }

    // Avatars are now generated from user initials, no need to assign

    // Format dateOfBirth properly
    let formattedDateOfBirth = undefined;
    if (userDoc.dateOfBirth) {
      try {
        if (userDoc.dateOfBirth instanceof Date) {
          formattedDateOfBirth = userDoc.dateOfBirth.toISOString().split('T')[0];
        } else {
          const dateObj = new Date(userDoc.dateOfBirth);
          if (!isNaN(dateObj.getTime())) {
            formattedDateOfBirth = dateObj.toISOString().split('T')[0];
          }
        }
      } catch (dateError) {
        console.error('Error formatting date of birth:', dateError);
      }
    }
    
    const user = {
      id: (userDoc._id as any).toString(),
      name: userDoc.name,
      email: userDoc.email,
      role: userDoc.role,
      department: userDoc.department,
      year: userDoc.year,
      rollNumber: userDoc.rollNumber,
      dateOfBirth: formattedDateOfBirth,
      mobileNumber: userDoc.mobileNumber,
      profilePicture: userDoc.profilePicture,
      imageUrl: userDoc.imageUrl,
    };
    
    return NextResponse.json({
      success: true,
      user,
    });
    
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Skip during build
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return NextResponse.json({
        success: true,
        message: 'Profile updated successfully',
        user: {
          id: 'build-placeholder',
          name: 'Build Placeholder',
          email: 'build@placeholder.com',
        },
      });
    }

    // Ensure database connection
    try {
      await connectToDatabase();
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        { error: 'Database connection failed. Please try again later.' },
        { status: 503 }
      );
    }

    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }
    
    const token = authHeader.substring(7);
    const userDoc = await getUserFromToken(token);
    
    if (!userDoc) {
      return NextResponse.json(
        { error: 'Invalid token or user not found' },
        { status: 401 }
      );
    }
    
    // Parse request body with error handling
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    // Validate input
    let validatedData;
    try {
      validatedData = profileUpdateSchema.parse(body);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        console.error('Validation error:', validationError.errors);
        return NextResponse.json(
          { error: 'Validation failed', details: validationError.errors },
          { status: 400 }
        );
      }
      throw validationError;
    }
    
    // Update user profile in database
    try {
      if (validatedData.name !== undefined) userDoc.name = validatedData.name;
      if (validatedData.department !== undefined) userDoc.department = validatedData.department;
      if (validatedData.year !== undefined) userDoc.year = validatedData.year;
      if (validatedData.rollNumber !== undefined) userDoc.rollNumber = validatedData.rollNumber;
      if (validatedData.mobileNumber !== undefined) userDoc.mobileNumber = validatedData.mobileNumber;
      
      // Handle profilePicture - can be string path or null
      if (validatedData.profilePicture !== undefined) {
        userDoc.profilePicture = validatedData.profilePicture === null ? null : String(validatedData.profilePicture);
      }
      
      if (validatedData.dateOfBirth !== undefined && validatedData.dateOfBirth !== null && validatedData.dateOfBirth !== '') {
        userDoc.dateOfBirth = new Date(validatedData.dateOfBirth);
      }
      
      // Save with better error handling
      await userDoc.save();
    } catch (saveError: any) {
      console.error('Database save error:', saveError);
      
      // Handle Mongoose validation errors
      if (saveError.name === 'ValidationError') {
        const validationErrors = Object.values(saveError.errors || {}).map((err: any) => ({
          field: err.path,
          message: err.message
        }));
        return NextResponse.json(
          { error: 'Validation failed', details: validationErrors },
          { status: 400 }
        );
      }
      
      // Handle duplicate key errors
      if (saveError.code === 11000) {
        return NextResponse.json(
          { error: 'Duplicate entry. This value already exists.' },
          { status: 409 }
        );
      }
      
      // Re-throw to be caught by outer catch
      throw saveError;
    }
    
    // Format dateOfBirth for response
    let formattedDateOfBirth = undefined;
    if (userDoc.dateOfBirth) {
      try {
        if (userDoc.dateOfBirth instanceof Date) {
          formattedDateOfBirth = userDoc.dateOfBirth.toISOString().split('T')[0];
        } else {
          const dateObj = new Date(userDoc.dateOfBirth);
          if (!isNaN(dateObj.getTime())) {
            formattedDateOfBirth = dateObj.toISOString().split('T')[0];
          }
        }
      } catch (dateError) {
        console.error('Error formatting date of birth:', dateError);
      }
    }
    
    const updatedUser = {
      id: (userDoc._id as any).toString(),
      name: userDoc.name,
      email: userDoc.email,
      role: userDoc.role,
      department: userDoc.department,
      year: userDoc.year,
      rollNumber: userDoc.rollNumber,
      dateOfBirth: formattedDateOfBirth,
      mobileNumber: userDoc.mobileNumber,
      profilePicture: userDoc.profilePicture,
      imageUrl: userDoc.imageUrl,
    };
    
    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    });
    
  } catch (error: any) {
    // Zod validation errors are already handled above
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    // Log detailed error information
    console.error('Profile update error:', {
      message: error?.message,
      stack: error?.stack,
      name: error?.name,
      code: error?.code,
      errors: error?.errors
    });
    
    // Return more specific error message if available
    const errorMessage = error?.message || 'Internal server error';
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error?.stack : undefined
      },
      { status: 500 }
    );
  }
}