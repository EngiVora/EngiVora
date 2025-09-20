import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema for projects
const projectSchema = z.object({
  title: z.string().min(3, 'Project title must be at least 3 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  category: z.enum(['web', 'mobile', 'ai-ml', 'robotics', 'iot', 'blockchain', 'gaming', 'other']),
  techStack: z.array(z.string()),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  duration: z.object({
    estimate: z.number().min(1, 'Duration estimate must be at least 1 day'),
    unit: z.enum(['days', 'weeks', 'months']),
  }),
  teamSize: z.object({
    min: z.number().min(1, 'Minimum team size must be at least 1'),
    max: z.number().min(1, 'Maximum team size must be at least 1'),
  }),
  requirements: z.array(z.string()),
  goals: z.array(z.string()),
  resources: z.array(z.object({
    title: z.string(),
    url: z.string().url('Invalid URL'),
    type: z.enum(['documentation', 'tutorial', 'repository', 'tool', 'other']),
  })).optional(),
  tags: z.array(z.string()).optional(),
  isPublic: z.boolean().optional().default(true),
  lookingForMembers: z.boolean().optional().default(false),
  featured: z.boolean().optional().default(false),
});

// Mock projects database
type Project = {
  id: string;
  title: string;
  description: string;
  category: 'web' | 'mobile' | 'ai-ml' | 'robotics' | 'iot' | 'blockchain' | 'gaming' | 'other';
  techStack: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: {
    estimate: number;
    unit: 'days' | 'weeks' | 'months';
  };
  teamSize: {
    min: number;
    max: number;
    current: number;
  };
  requirements: string[];
  goals: string[];
  resources: Array<{
    title: string;
    url: string;
    type: 'documentation' | 'tutorial' | 'repository' | 'tool' | 'other';
  }>;
  tags: string[];
  isPublic: boolean;
  lookingForMembers: boolean;
  featured: boolean;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  progress: number; // 0-100
  owner: {
    id: string;
    name: string;
    email: string;
  };
  members: Array<{
    id: string;
    name: string;
    email: string;
    role: 'owner' | 'lead' | 'member';
    joinedAt: string;
  }>;
  applications: Array<{
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    message: string;
    status: 'pending' | 'accepted' | 'rejected';
    appliedAt: string;
  }>;
  likes: number;
  views: number;
  createdAt: string;
  updatedAt: string;
};

const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Smart Campus Management System',
    description: 'A comprehensive web application for managing campus facilities, student services, and administrative tasks. Features include room booking, event management, and student portal.',
    category: 'web',
    techStack: ['React', 'Node.js', 'MongoDB', 'Express', 'TypeScript'],
    difficulty: 'intermediate',
    duration: { estimate: 3, unit: 'months' },
    teamSize: { min: 4, max: 6, current: 3 },
    requirements: [
      'Experience with React and Node.js',
      'Basic understanding of databases',
      'Familiarity with REST APIs',
      'Good communication skills'
    ],
    goals: [
      'Create user-friendly interface for students and staff',
      'Implement real-time notifications',
      'Develop admin dashboard for campus management',
      'Ensure scalable and secure architecture'
    ],
    resources: [
      {
        title: 'React Documentation',
        url: 'https://react.dev',
        type: 'documentation'
      },
      {
        title: 'Node.js Best Practices',
        url: 'https://github.com/goldbergyoni/nodebestpractices',
        type: 'repository'
      }
    ],
    tags: ['campus', 'management', 'fullstack', 'real-time'],
    isPublic: true,
    lookingForMembers: true,
    featured: true,
    status: 'in-progress',
    progress: 35,
    owner: {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
    },
    members: [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'owner',
        joinedAt: '2024-01-01T10:00:00Z',
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'lead',
        joinedAt: '2024-01-05T14:30:00Z',
      },
      {
        id: '3',
        name: 'Mike Johnson',
        email: 'mike@example.com',
        role: 'member',
        joinedAt: '2024-01-10T09:15:00Z',
      },
    ],
    applications: [
      {
        id: 'app1',
        userId: '4',
        userName: 'Sarah Wilson',
        userEmail: 'sarah@example.com',
        message: 'I have 2 years of experience with React and would love to contribute to the frontend development.',
        status: 'pending',
        appliedAt: '2024-01-15T16:20:00Z',
      }
    ],
    likes: 89,
    views: 456,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-15T12:30:00Z',
  },
  {
    id: '2',
    title: 'AI-Powered Study Assistant',
    description: 'Develop an intelligent study companion that helps students with personalized learning paths, quiz generation, and progress tracking using machine learning.',
    category: 'ai-ml',
    techStack: ['Python', 'TensorFlow', 'FastAPI', 'React', 'PostgreSQL'],
    difficulty: 'advanced',
    duration: { estimate: 4, unit: 'months' },
    teamSize: { min: 3, max: 5, current: 2 },
    requirements: [
      'Strong Python programming skills',
      'Experience with machine learning frameworks',
      'Knowledge of NLP concepts',
      'Familiarity with REST API development'
    ],
    goals: [
      'Implement personalized learning algorithms',
      'Create intelligent quiz generation system',
      'Develop progress tracking and analytics',
      'Build responsive web interface'
    ],
    resources: [
      {
        title: 'TensorFlow Documentation',
        url: 'https://tensorflow.org/learn',
        type: 'documentation'
      },
      {
        title: 'NLP with Python',
        url: 'https://github.com/nltk/nltk',
        type: 'repository'
      }
    ],
    tags: ['ai', 'ml', 'education', 'nlp', 'study'],
    isPublic: true,
    lookingForMembers: true,
    featured: true,
    status: 'planning',
    progress: 15,
    owner: {
      id: '2',
      name: 'Alice Chen',
      email: 'alice@example.com',
    },
    members: [
      {
        id: '2',
        name: 'Alice Chen',
        email: 'alice@example.com',
        role: 'owner',
        joinedAt: '2024-01-08T11:00:00Z',
      },
      {
        id: '5',
        name: 'David Park',
        email: 'david@example.com',
        role: 'member',
        joinedAt: '2024-01-12T15:45:00Z',
      },
    ],
    applications: [],
    likes: 67,
    views: 234,
    createdAt: '2024-01-08T11:00:00Z',
    updatedAt: '2024-01-12T15:45:00Z',
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
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const status = searchParams.get('status');
    const featured = searchParams.get('featured') === 'true';
    const lookingForMembers = searchParams.get('recruiting') === 'true';
    const search = searchParams.get('search');
    const tech = searchParams.get('tech');
    const userId = searchParams.get('user');

    let filteredProjects = [...mockProjects];

    // Filter by category
    if (category) {
      filteredProjects = filteredProjects.filter(project => project.category === category);
    }

    // Filter by difficulty
    if (difficulty) {
      filteredProjects = filteredProjects.filter(project => project.difficulty === difficulty);
    }

    // Filter by status
    if (status) {
      filteredProjects = filteredProjects.filter(project => project.status === status);
    }

    // Filter by featured
    if (featured) {
      filteredProjects = filteredProjects.filter(project => project.featured);
    }

    // Filter by looking for members
    if (lookingForMembers) {
      filteredProjects = filteredProjects.filter(project => project.lookingForMembers);
    }

    // Filter by technology
    if (tech) {
      filteredProjects = filteredProjects.filter(project =>
        project.techStack.some(technology => 
          technology.toLowerCase().includes(tech.toLowerCase())
        )
      );
    }

    // Filter by user (projects owned or participated by user)
    if (userId) {
      filteredProjects = filteredProjects.filter(project =>
        project.owner.id === userId ||
        project.members.some(member => member.id === userId)
      );
    }

    // Search functionality
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProjects = filteredProjects.filter(project =>
        project.title.toLowerCase().includes(searchLower) ||
        project.description.toLowerCase().includes(searchLower) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
        project.techStack.some(tech => tech.toLowerCase().includes(searchLower))
      );
    }

    // Filter public projects only (unless user is requesting their own projects)
    if (!userId) {
      filteredProjects = filteredProjects.filter(project => project.isPublic);
    }

    // Sort by creation date (newest first)
    filteredProjects.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProjects = filteredProjects.slice(startIndex, endIndex);

    const totalPages = Math.ceil(filteredProjects.length / limit);

    return NextResponse.json({
      success: true,
      data: paginatedProjects,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: filteredProjects.length,
        itemsPerPage: limit,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });

  } catch (error) {
    console.error('Projects fetch error:', error);
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
    const validatedData = projectSchema.parse(body);

    // Create new project
    const newProject: Project = {
      id: (mockProjects.length + 1).toString(),
      ...validatedData,
      resources: validatedData.resources || [],
      tags: validatedData.tags || [],
      teamSize: {
        ...validatedData.teamSize,
        current: 1, // Owner counts as first member
      },
      status: 'planning',
      progress: 0,
      owner: user,
      members: [
        {
          id: user.id,
          name: user.name,
          email: user.email,
          role: 'owner',
          joinedAt: new Date().toISOString(),
        },
      ],
      applications: [],
      likes: 0,
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockProjects.push(newProject);

    return NextResponse.json({
      success: true,
      message: 'Project created successfully',
      data: newProject,
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Project creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}