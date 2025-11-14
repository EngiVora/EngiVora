import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Student } from '@/models/Student';

export const runtime = 'nodejs';

export async function GET() {
  try {
    // Connect to database
    await connectToDatabase();
    
    // Get all students (excluding password hashes for security)
    const students = await Student.find({}, { password_hash: 0 }).sort({ createdAt: -1 }).limit(20);
    
    return NextResponse.json({
      success: true,
      message: 'Students retrieved successfully',
      count: students.length,
      students: students.map(student => ({
        student_id: student.student_id,
        full_name: student.full_name,
        email: student.email,
        signup_date: student.signup_date,
        last_login: student.last_login,
        courses_enrolled: student.courses_enrolled,
        createdAt: student.createdAt,
        updatedAt: student.updatedAt,
      })),
    });
  } catch (error) {
    console.error('Error retrieving students:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to retrieve students',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}