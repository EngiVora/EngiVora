import { NextRequest, NextResponse } from 'next/server';
import jwt, { Secret } from 'jsonwebtoken';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/db';
import { Project } from '@/models/Project';

const JWT_SECRET = (process.env.JWT_SECRET || '') as Secret;

// Helper function to get user ID from token
function getUserIdFromToken(token: string): string | null {
  try {
    if (!JWT_SECRET || JWT_SECRET === '') {
      return null;
    }
    const decoded = jwt.verify(token, JWT_SECRET) as { sub: string };
    return decoded.sub;
  } catch (error) {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    // Skip during build
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return NextResponse.json({
        success: true,
        data: []
      });
    }

    // Get user from token
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }
    
    const token = authHeader.substring(7);
    const userId = getUserIdFromToken(token);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Connect to database
    await connectToDatabase();

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Get projects where user is owner or member
    const projects = await Project.find({
      $or: [
        { 'owner.userId': userObjectId },
        { 'members.userId': userObjectId }
      ]
    })
    .sort({ updatedAt: -1 })
    .limit(50)
    .lean();

    // Format projects for response
    const formattedProjects = projects.map((project: any) => ({
      id: project._id.toString(),
      title: project.title,
      description: project.description,
      category: project.category,
      status: project.status,
      progress: project.progress,
      role: project.owner.userId.toString() === userId ? 'owner' : 
            project.members.find((m: any) => m.userId.toString() === userId)?.role || 'member',
      joinedAt: project.owner.userId.toString() === userId 
        ? project.createdAt 
        : project.members.find((m: any) => m.userId.toString() === userId)?.joinedAt,
      teamSize: project.teamSize,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      data: formattedProjects
    });
    
  } catch (error) {
    console.error('My projects fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

