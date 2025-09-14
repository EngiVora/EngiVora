import { NextRequest, NextResponse } from 'next/server';

// GET all exams
export async function GET(request: NextRequest) {
  try {
    // In a real application, you would fetch exams from your database
    // For now, we'll return mock data
    const exams = [
      { id: '1', title: 'GATE 2024', organization: 'IIT Delhi', examDate: '2024-02-03', registrationDeadline: '2023-10-15', category: 'Engineering Entrance', status: 'upcoming' },
      { id: '2', title: 'ESE 2024', organization: 'UPSC', examDate: '2024-06-18', registrationDeadline: '2023-11-30', category: 'Civil Services', status: 'upcoming' },
      { id: '3', title: 'ISRO Recruitment', organization: 'ISRO', examDate: '2023-12-10', registrationDeadline: '2023-10-05', category: 'Government', status: 'upcoming' },
      { id: '4', title: 'BARC Exam', organization: 'BARC', examDate: '2023-11-15', registrationDeadline: '2023-09-30', category: 'Government', status: 'upcoming' },
      { id: '5', title: 'IES 2024', organization: 'UPSC', examDate: '2024-01-07', registrationDeadline: '2023-10-20', category: 'Engineering Services', status: 'upcoming' },
    ];

    return NextResponse.json(exams);
  } catch (error) {
    console.error('Error fetching exams:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST a new exam
export async function POST(request: NextRequest) {
  try {
    const examData = await request.json();

    // Validate required fields
    if (!examData.title || !examData.organization || !examData.examDate || !examData.registrationDeadline) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // In a real application, you would save the exam to your database
    // For now, we'll just return the exam with a mock ID
    const newExam = {
      id: Date.now().toString(),
      ...examData,
      status: examData.status || 'upcoming',
    };

    return NextResponse.json(newExam, { status: 201 });
  } catch (error) {
    console.error('Error creating exam:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}