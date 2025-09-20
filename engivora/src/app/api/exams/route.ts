import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema for exams
const examSchema = z.object({
  name: z.string().min(3, 'Exam name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  type: z.enum(['entrance', 'competitive', 'certification', 'placement']),
  category: z.enum(['engineering', 'medical', 'management', 'law', 'general']),
  examDate: z.string().datetime('Invalid date format'),
  registrationStartDate: z.string().datetime('Invalid date format'),
  registrationEndDate: z.string().datetime('Invalid date format'),
  applicationFee: z.number().min(0, 'Fee cannot be negative'),
  eligibility: z.array(z.string()),
  syllabus: z.array(z.string()).optional(),
  examCenters: z.array(z.string()).optional(),
  officialWebsite: z.string().url('Invalid URL').optional(),
  isActive: z.boolean().optional().default(true),
});

// Mock exam database
type Exam = {
  id: string;
  name: string;
  description: string;
  type: 'entrance' | 'competitive' | 'certification' | 'placement';
  category: 'engineering' | 'medical' | 'management' | 'law' | 'general';
  examDate: string;
  registrationStartDate: string;
  registrationEndDate: string;
  applicationFee: number;
  eligibility: string[];
  syllabus: string[];
  examCenters: string[];
  officialWebsite?: string;
  isActive: boolean;
  totalApplications: number;
  createdAt: string;
  updatedAt: string;
};

const mockExams: Exam[] = [
  {
    id: '1',
    name: 'GATE 2025',
    description: 'Graduate Aptitude Test in Engineering for admission to M.Tech and Ph.D programs',
    type: 'entrance',
    category: 'engineering',
    examDate: '2025-02-01T09:00:00Z',
    registrationStartDate: '2024-08-01T00:00:00Z',
    registrationEndDate: '2024-10-15T23:59:59Z',
    applicationFee: 1800,
    eligibility: [
      'Bachelor\'s degree in Engineering/Technology',
      'Final year students are eligible',
      'Minimum 60% marks (55% for SC/ST)'
    ],
    syllabus: [
      'Engineering Mathematics',
      'General Aptitude',
      'Subject-specific topics'
    ],
    examCenters: [
      'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad'
    ],
    officialWebsite: 'https://gate.iisc.ac.in',
    isActive: true,
    totalApplications: 850000,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'JEE Advanced 2024',
    description: 'Joint Entrance Examination for admission to IITs and other premier engineering institutes',
    type: 'entrance',
    category: 'engineering',
    examDate: '2024-05-26T09:00:00Z',
    registrationStartDate: '2024-04-30T10:00:00Z',
    registrationEndDate: '2024-05-09T17:00:00Z',
    applicationFee: 2800,
    eligibility: [
      'Qualified in JEE Main 2024',
      'Top 2,50,000 candidates from JEE Main',
      'Maximum 2 attempts allowed'
    ],
    syllabus: [
      'Physics',
      'Chemistry', 
      'Mathematics'
    ],
    examCenters: [
      'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Pune'
    ],
    officialWebsite: 'https://jeeadv.ac.in',
    isActive: true,
    totalApplications: 245000,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-20T14:15:00Z',
  },
  {
    id: '3',
    name: 'UPSC ESE 2024',
    description: 'Engineering Services Examination for recruitment to Group A services',
    type: 'competitive',
    category: 'engineering',
    examDate: '2024-06-16T09:00:00Z',
    registrationStartDate: '2024-02-28T10:00:00Z',
    registrationEndDate: '2024-03-28T18:00:00Z',
    applicationFee: 200,
    eligibility: [
      'Bachelor\'s degree in Engineering',
      'Age limit: 21-30 years',
      'Indian citizenship required'
    ],
    syllabus: [
      'General Studies',
      'Engineering Aptitude',
      'Specific Engineering Subjects'
    ],
    examCenters: [
      'Delhi', 'Mumbai', 'Kolkata', 'Chennai', 'Ahmedabad', 'Bangalore'
    ],
    officialWebsite: 'https://upsc.gov.in',
    isActive: true,
    totalApplications: 45000,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-18T16:45:00Z',
  },
];

// Helper function to check authentication
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getUserFromToken(_token: string) {
  return {
    id: '1',
    name: 'John Doe',
    email: 'student@example.com',
    role: 'admin', // For demo purposes
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const isActive = searchParams.get('active') === 'true';
    const search = searchParams.get('search');
    const upcoming = searchParams.get('upcoming') === 'true';

    let filteredExams = [...mockExams];

    // Filter by type
    if (type) {
      filteredExams = filteredExams.filter(exam => exam.type === type);
    }

    // Filter by category
    if (category) {
      filteredExams = filteredExams.filter(exam => exam.category === category);
    }

    // Filter by active status
    if (isActive) {
      filteredExams = filteredExams.filter(exam => exam.isActive);
    }

    // Filter upcoming exams
    if (upcoming) {
      const now = new Date();
      filteredExams = filteredExams.filter(exam => new Date(exam.examDate) > now);
    }

    // Search functionality
    if (search) {
      const searchLower = search.toLowerCase();
      filteredExams = filteredExams.filter(exam =>
        exam.name.toLowerCase().includes(searchLower) ||
        exam.description.toLowerCase().includes(searchLower)
      );
    }

    // Sort by exam date (upcoming first)
    filteredExams.sort((a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime());

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedExams = filteredExams.slice(startIndex, endIndex);

    const totalPages = Math.ceil(filteredExams.length / limit);

    return NextResponse.json({
      success: true,
      data: paginatedExams,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: filteredExams.length,
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
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const user = getUserFromToken(token);

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate input
    const validatedData = examSchema.parse(body);

    // Create new exam
    const newExam: Exam = {
      id: (mockExams.length + 1).toString(),
      ...validatedData,
      syllabus: validatedData.syllabus || [],
      examCenters: validatedData.examCenters || [],
      totalApplications: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockExams.push(newExam);

    return NextResponse.json({
      success: true,
      message: 'Exam created successfully',
      data: newExam,
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Exam creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}