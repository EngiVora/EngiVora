import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema for discounts
const discountSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.enum(['books', 'software', 'courses', 'hardware', 'services', 'events']),
  discountType: z.enum(['percentage', 'fixed', 'bogo', 'free']),
  discountValue: z.number().min(0, 'Discount value cannot be negative'),
  originalPrice: z.number().min(0, 'Original price cannot be negative').optional(),
  discountedPrice: z.number().min(0, 'Discounted price cannot be negative').optional(),
  couponCode: z.string().optional(),
  provider: z.string().min(2, 'Provider name is required'),
  websiteUrl: z.string().url('Invalid URL'),
  imageUrl: z.string().url('Invalid image URL').optional(),
  validFrom: z.string().datetime('Invalid date format'),
  validUntil: z.string().datetime('Invalid date format'),
  termsAndConditions: z.array(z.string()).optional(),
  eligibility: z.array(z.string()).optional(),
  maxUsage: z.number().min(1, 'Max usage must be at least 1').optional(),
  featured: z.boolean().optional().default(false),
  isActive: z.boolean().optional().default(true),
});

// Mock discounts database
type Discount = {
  id: string;
  title: string;
  description: string;
  category: 'books' | 'software' | 'courses' | 'hardware' | 'services' | 'events';
  discountType: 'percentage' | 'fixed' | 'bogo' | 'free';
  discountValue: number;
  originalPrice?: number;
  discountedPrice?: number;
  couponCode?: string;
  provider: string;
  websiteUrl: string;
  imageUrl?: string;
  validFrom: string;
  validUntil: string;
  termsAndConditions: string[];
  eligibility: string[];
  maxUsage?: number;
  currentUsage: number;
  featured: boolean;
  isActive: boolean;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
};

const mockDiscounts: Discount[] = [
  {
    id: '1',
    title: '50% Off on Engineering Textbooks',
    description: 'Get massive discounts on engineering textbooks from top publishers. Perfect for students preparing for exams.',
    category: 'books',
    discountType: 'percentage',
    discountValue: 50,
    originalPrice: 2000,
    discountedPrice: 1000,
    couponCode: 'STUDENT50',
    provider: 'BookHub India',
    websiteUrl: 'https://bookhub.com/engineering',
    imageUrl: 'https://example.com/books-discount.jpg',
    validFrom: '2024-01-01T00:00:00Z',
    validUntil: '2024-03-31T23:59:59Z',
    termsAndConditions: [
      'Valid only for engineering textbooks',
      'Minimum order value ₹500',
      'Cannot be combined with other offers',
      'Valid for first-time users only'
    ],
    eligibility: [
      'Engineering students with valid ID',
      'Age limit: 18-25 years'
    ],
    maxUsage: 1000,
    currentUsage: 456,
    featured: true,
    isActive: true,
    createdBy: {
      id: 'admin1',
      name: 'Admin User',
      email: 'admin@engivora.com',
    },
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
  },
  {
    id: '2',
    title: 'Free JetBrains IDE License for Students',
    description: 'Get free access to all JetBrains IDEs including IntelliJ IDEA, PyCharm, WebStorm, and more for students.',
    category: 'software',
    discountType: 'free',
    discountValue: 100,
    originalPrice: 15000,
    discountedPrice: 0,
    provider: 'JetBrains',
    websiteUrl: 'https://jetbrains.com/student/',
    imageUrl: 'https://example.com/jetbrains-student.jpg',
    validFrom: '2024-01-01T00:00:00Z',
    validUntil: '2024-12-31T23:59:59Z',
    termsAndConditions: [
      'Valid university email required',
      'License valid for 1 year',
      'Renewable annually with proof of enrollment'
    ],
    eligibility: [
      'Currently enrolled students',
      'Valid .edu email address required'
    ],
    currentUsage: 234,
    featured: true,
    isActive: true,
    createdBy: {
      id: 'admin1',
      name: 'Admin User',
      email: 'admin@engivora.com',
    },
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-10T12:00:00Z',
  },
  {
    id: '3',
    title: '30% Off Online Coding Bootcamp',
    description: 'Learn full-stack development with industry experts. Comprehensive course covering React, Node.js, and databases.',
    category: 'courses',
    discountType: 'percentage',
    discountValue: 30,
    originalPrice: 50000,
    discountedPrice: 35000,
    couponCode: 'ENGI30',
    provider: 'CodeMaster Academy',
    websiteUrl: 'https://codemaster.com/bootcamp',
    validFrom: '2024-01-15T00:00:00Z',
    validUntil: '2024-02-29T23:59:59Z',
    termsAndConditions: [
      'Valid for new enrollments only',
      'Payment plan available',
      'Job guarantee included'
    ],
    eligibility: [
      'Basic programming knowledge required',
      'Engineering students get priority'
    ],
    maxUsage: 100,
    currentUsage: 67,
    featured: false,
    isActive: true,
    createdBy: {
      id: 'admin1',
      name: 'Admin User',
      email: 'admin@engivora.com',
    },
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z',
  },
];

// Helper function to get user from token
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getUserFromToken(_token: string) {
  return {
    id: '1',
    name: 'John Doe',
    email: 'student@example.com',
    role: 'admin',
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const discountType = searchParams.get('type');
    const featured = searchParams.get('featured') === 'true';
    const active = searchParams.get('active') === 'true';
    const search = searchParams.get('search');
    const provider = searchParams.get('provider');

    let filteredDiscounts = [...mockDiscounts];

    // Filter by category
    if (category) {
      filteredDiscounts = filteredDiscounts.filter(discount => discount.category === category);
    }

    // Filter by discount type
    if (discountType) {
      filteredDiscounts = filteredDiscounts.filter(discount => discount.discountType === discountType);
    }

    // Filter by featured
    if (featured) {
      filteredDiscounts = filteredDiscounts.filter(discount => discount.featured);
    }

    // Filter by active status
    if (active) {
      filteredDiscounts = filteredDiscounts.filter(discount => discount.isActive);
    }

    // Filter by provider
    if (provider) {
      filteredDiscounts = filteredDiscounts.filter(discount =>
        discount.provider.toLowerCase().includes(provider.toLowerCase())
      );
    }

    // Search functionality
    if (search) {
      const searchLower = search.toLowerCase();
      filteredDiscounts = filteredDiscounts.filter(discount =>
        discount.title.toLowerCase().includes(searchLower) ||
        discount.description.toLowerCase().includes(searchLower) ||
        discount.provider.toLowerCase().includes(searchLower)
      );
    }

    // Filter out expired discounts
    const now = new Date();
    filteredDiscounts = filteredDiscounts.filter(discount => 
      new Date(discount.validUntil) > now && discount.isActive
    );

    // Sort by creation date (newest first)
    filteredDiscounts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedDiscounts = filteredDiscounts.slice(startIndex, endIndex);

    const totalPages = Math.ceil(filteredDiscounts.length / limit);

    return NextResponse.json({
      success: true,
      data: paginatedDiscounts,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: filteredDiscounts.length,
        itemsPerPage: limit,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });

  } catch (error) {
    console.error('Discounts fetch error:', error);
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
    const validatedData = discountSchema.parse(body);

    // Create new discount
    const newDiscount: Discount = {
      id: (mockDiscounts.length + 1).toString(),
      ...validatedData,
      termsAndConditions: validatedData.termsAndConditions || [],
      eligibility: validatedData.eligibility || [],
      currentUsage: 0,
      createdBy: user,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockDiscounts.push(newDiscount);

    return NextResponse.json({
      success: true,
      message: 'Discount created successfully',
      data: newDiscount,
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Discount creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}