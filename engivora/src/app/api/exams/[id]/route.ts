import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Exam } from '@/models/Exam';
import { verifyAdminToken } from '@/lib/jwt-utils';

// Helper function to verify admin authentication
async function verifyAdmin(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Authorization header missing or invalid', status: 401 };
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix

  const verificationResult = await verifyAdminToken(token);
  
  if (!verificationResult.success) {
    return { error: verificationResult.error, status: 401 };
  }

  return { user: verificationResult.user };
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  try {
    // Verify admin authentication
    const authResult = await verifyAdmin(request);
    if ('error' in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    await connectToDatabase();
    
    const deletedExam = await Exam.findByIdAndDelete(params.id);

    if (!deletedExam) {
      return NextResponse.json(
        { error: 'Exam not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Exam deleted successfully',
    });

  } catch (error) {
    console.error('Exam deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}