import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema for jobs
const jobSchema = z.object({
  title: z.string().min(3, 'Job title must be at least 3 characters'),
  company: z.string().min(2, 'Company name must be at least 2 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  type: z.enum(['full-time', 'part-time', 'internship', 'contract', 'freelance']),
  category: z.enum(['software', 'hardware', 'mechanical', 'civil', 'electrical', 'other']),
  location: z.string().min(2, 'Location is required'),
  remote: z.boolean().optional().default(false),
  salary: z.object({
    min: z.number().min(0, 'Minimum salary cannot be negative'),
    max: z.number().min(0, 'Maximum salary cannot be negative'),
    currency: z.string().default('INR'),
  }).optional(),
  requirements: z.array(z.string()),
  skills: z.array(z.string()),
  experience: z.object({
    min: z.number().min(0, 'Minimum experience cannot be negative'),
    max: z.number().min(0, 'Maximum experience cannot be negative'),
  }),
  applicationDeadline: z.string().datetime('Invalid date format'),
  applicationLink: z.string().url('Invalid URL').optional(),
  contactEmail: z.string().email('Invalid email format').optional(),
  isActive: z.boolean().optional().default(true),
  featured: z.boolean().optional().default(false),
});

// Mock jobs database
type Job = {
  id: string;
  title: string;
  company: string;
  description: string;
  type: 'full-time' | 'part-time' | 'internship' | 'contract' | 'freelance';
  category: 'software' | 'hardware' | 'mechanical' | 'civil' | 'electrical' | 'other';
  location: string;
  remote: boolean;
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  requirements: string[];
  skills: string[];
  experience: {
    min: number;
    max: number;
  };
  applicationDeadline: string;
  applicationLink?: string;
  contactEmail?: string;
  isActive: boolean;
  featured: boolean;
  totalApplications: number;
  postedBy: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
};

const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Software Engineer - Frontend',
    company: 'TechCorp India',
    description: 'Join our dynamic team to build next-generation web applications using React, TypeScript, and modern development practices.',
    type: 'full-time',
    category: 'software',
    location: 'Bangalore, India',
    remote: true,
    salary: {
      min: 800000,
      max: 1200000,
      currency: 'INR',
    },
    requirements: [
      'Bachelor\'s degree in Computer Science or related field',
      '2+ years of frontend development experience',
      'Strong knowledge of React and TypeScript',
      'Experience with modern build tools and deployment'
    ],
    skills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'Git'],
    experience: { min: 2, max: 5 },
    applicationDeadline: '2024-03-01T23:59:59Z',
    applicationLink: 'https://techcorp.com/careers/frontend-engineer',
    contactEmail: 'hr@techcorp.com',
    isActive: true,
    featured: true,
    totalApplications: 156,
    postedBy: {
      id: 'hr1',
      name: 'HR Team',
      email: 'hr@techcorp.com',
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
  },
  {
    id: '2',
    title: 'Data Science Intern',
    company: 'Analytics Plus',
    description: 'Exciting internship opportunity to work on machine learning projects and data analysis for real-world business problems.',
    type: 'internship',
    category: 'software',
    location: 'Mumbai, India',
    remote: false,
    salary: {
      min: 25000,
      max: 35000,
      currency: 'INR',
    },
    requirements: [
      'Currently pursuing degree in Data Science, Computer Science, or Statistics',
      'Knowledge of Python and data analysis libraries',
      'Understanding of machine learning concepts',
      'Strong analytical and problem-solving skills'
    ],
    skills: ['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'SQL'],
    experience: { min: 0, max: 1 },
    applicationDeadline: '2024-02-28T23:59:59Z',
    applicationLink: 'https://analyticsplus.com/internships',
    contactEmail: 'internships@analyticsplus.com',
    isActive: true,
    featured: false,
    totalApplications: 89,
    postedBy: {
      id: 'hr2',
      name: 'Analytics Plus HR',
      email: 'hr@analyticsplus.com',
    },
    createdAt: '2024-01-10T08:30:00Z',
    updatedAt: '2024-01-10T08:30:00Z',
  },
  {
    id: '3',
    title: 'Mechanical Design Engineer',
    company: 'AutoTech Solutions',
    description: 'Design and develop automotive components using CAD software and collaborate with cross-functional teams.',
    type: 'full-time',
    category: 'mechanical',
    location: 'Chennai, India',
    remote: false,
    salary: {
      min: 600000,
      max: 900000,
      currency: 'INR',
    },
    requirements: [
      'Bachelor\'s degree in Mechanical Engineering',
      '1-3 years of design experience',
      'Proficiency in CAD software (SolidWorks, AutoCAD)',
      'Knowledge of manufacturing processes'
    ],
    skills: ['SolidWorks', 'AutoCAD', 'ANSYS', 'Manufacturing', 'Product Design'],
    experience: { min: 1, max: 3 },
    applicationDeadline: '2024-03-15T23:59:59Z',
    contactEmail: 'careers@autotech.com',
    isActive: true,
    featured: true,
    totalApplications: 67,
    postedBy: {
      id: 'hr3',
      name: 'AutoTech HR',
      email: 'hr@autotech.com',
    },
    createdAt: '2024-01-08T14:20:00Z',
    updatedAt: '2024-01-18T16:45:00Z',
  },
];

// Helper function to get user from token
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getUserFromToken(_token: string) {
  return {
    id: '1',
    name: 'John Doe',
    email: 'student@example.com',
    role: 'user',
  };
}

export async function GET(request: NextRequest) {
  try {
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

    let filteredJobs = [...mockJobs];

    // Filter by type
    if (type) {
      filteredJobs = filteredJobs.filter(job => job.type === type);
    }

    // Filter by category
    if (category) {
      filteredJobs = filteredJobs.filter(job => job.category === category);
    }

    // Filter by location
    if (location) {
      filteredJobs = filteredJobs.filter(job => 
        job.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Filter by remote
    if (remote) {
      filteredJobs = filteredJobs.filter(job => job.remote);
    }

    // Filter by featured
    if (featured) {
      filteredJobs = filteredJobs.filter(job => job.featured);
    }

    // Filter by company
    if (company) {
      filteredJobs = filteredJobs.filter(job =>
        job.company.toLowerCase().includes(company.toLowerCase())
      );
    }

    // Search functionality
    if (search) {
      const searchLower = search.toLowerCase();
      filteredJobs = filteredJobs.filter(job =>
        job.title.toLowerCase().includes(searchLower) ||
        job.company.toLowerCase().includes(searchLower) ||
        job.description.toLowerCase().includes(searchLower) ||
        job.skills.some(skill => skill.toLowerCase().includes(searchLower))
      );
    }

    // Filter active jobs only
    filteredJobs = filteredJobs.filter(job => job.isActive);

    // Sort by creation date (newest first)
    filteredJobs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

    const totalPages = Math.ceil(filteredJobs.length / limit);

    return NextResponse.json({
      success: true,
      data: paginatedJobs,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: filteredJobs.length,
        itemsPerPage: limit,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });

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
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const user = getUserFromToken(token);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate input
    const validatedData = jobSchema.parse(body);

    // Create new job posting
    const newJob: Job = {
      id: (mockJobs.length + 1).toString(),
      ...validatedData,
      totalApplications: 0,
      postedBy: user,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockJobs.push(newJob);

    return NextResponse.json({
      success: true,
      message: 'Job posted successfully',
      data: newJob,
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Job creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}