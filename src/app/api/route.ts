import { NextResponse } from 'next/server';

export async function GET() {
  const apiDocumentation = {
    title: 'Engivora API Documentation',
    version: '1.0.0',
    description: 'Comprehensive API endpoints for the Engivora platform',
    baseUrl: '/api',
    endpoints: {
      authentication: {
        'POST /auth/login': {
          description: 'Authenticate user and get access token',
          body: {
            email: 'string (required)',
            password: 'string (required, min 6 chars)',
          },
          response: {
            success: 'boolean',
            message: 'string',
            user: 'object',
            token: 'string',
          },
        },
        'POST /auth/signup': {
          description: 'Create new user account',
          body: {
            name: 'string (required, min 2 chars)',
            email: 'string (required, valid email)',
            password: 'string (required, min 6 chars)',
            department: 'string (required)',
            year: 'string (optional)',
            rollNumber: 'string (optional)',
          },
          response: {
            success: 'boolean',
            message: 'string',
            user: 'object',
            token: 'string',
          },
        },
        'GET /auth/profile': {
          description: 'Get user profile (requires authentication)',
          headers: {
            Authorization: 'Bearer <token>',
          },
          response: {
            success: 'boolean',
            user: 'object',
          },
        },
        'PUT /auth/profile': {
          description: 'Update user profile (requires authentication)',
          headers: {
            Authorization: 'Bearer <token>',
          },
          body: {
            name: 'string (optional)',
            department: 'string (optional)',
            year: 'string (optional)',
            rollNumber: 'string (optional)',
            bio: 'string (optional)',
            skills: 'array of strings (optional)',
            interests: 'array of strings (optional)',
          },
          response: {
            success: 'boolean',
            message: 'string',
            user: 'object',
          },
        },
      },
      blogs: {
        'GET /blogs': {
          description: 'Get paginated list of blog posts',
          queryParams: {
            page: 'number (default: 1)',
            limit: 'number (default: 10)',
            category: 'string (technology|career|academic|lifestyle|news)',
            featured: 'boolean',
            search: 'string',
          },
          response: {
            success: 'boolean',
            data: 'array of blog objects',
            pagination: 'object',
          },
        },
        'POST /blogs': {
          description: 'Create new blog post (requires authentication)',
          headers: {
            Authorization: 'Bearer <token>',
          },
          body: {
            title: 'string (required, min 5 chars)',
            content: 'string (required, min 50 chars)',
            summary: 'string (required, min 20 chars)',
            category: 'string (required)',
            tags: 'array of strings (optional)',
            featured: 'boolean (optional)',
            published: 'boolean (optional)',
          },
          response: {
            success: 'boolean',
            message: 'string',
            data: 'blog object',
          },
        },
        'GET /blogs/[id]': {
          description: 'Get specific blog post by ID',
          response: {
            success: 'boolean',
            data: 'blog object',
          },
        },
        'PUT /blogs/[id]': {
          description: 'Update blog post (requires authentication & ownership)',
          headers: {
            Authorization: 'Bearer <token>',
          },
          body: 'Partial blog object',
          response: {
            success: 'boolean',
            message: 'string',
            data: 'blog object',
          },
        },
        'DELETE /blogs/[id]': {
          description: 'Delete blog post (requires authentication & ownership)',
          headers: {
            Authorization: 'Bearer <token>',
          },
          response: {
            success: 'boolean',
            message: 'string',
          },
        },
      },
      exams: {
        'GET /exams': {
          description: 'Get paginated list of exams',
          queryParams: {
            page: 'number (default: 1)',
            limit: 'number (default: 10)',
            type: 'string (entrance|competitive|certification|placement)',
            category: 'string (engineering|medical|management|law|general)',
            active: 'boolean',
            upcoming: 'boolean',
            search: 'string',
          },
          response: {
            success: 'boolean',
            data: 'array of exam objects',
            pagination: 'object',
          },
        },
        'POST /exams': {
          description: 'Create new exam (requires admin authentication)',
          headers: {
            Authorization: 'Bearer <token>',
          },
          body: {
            name: 'string (required)',
            description: 'string (required)',
            type: 'string (required)',
            category: 'string (required)',
            examDate: 'string (required, ISO datetime)',
            registrationStartDate: 'string (required, ISO datetime)',
            registrationEndDate: 'string (required, ISO datetime)',
            applicationFee: 'number (required)',
            eligibility: 'array of strings (required)',
            syllabus: 'array of strings (optional)',
            examCenters: 'array of strings (optional)',
            officialWebsite: 'string (optional, valid URL)',
            isActive: 'boolean (optional)',
          },
          response: {
            success: 'boolean',
            message: 'string',
            data: 'exam object',
          },
        },
      },
      jobs: {
        'GET /jobs': {
          description: 'Get paginated list of job postings',
          queryParams: {
            page: 'number (default: 1)',
            limit: 'number (default: 10)',
            type: 'string (full-time|part-time|internship|contract|freelance)',
            category: 'string (software|hardware|mechanical|civil|electrical|other)',
            location: 'string',
            remote: 'boolean',
            featured: 'boolean',
            search: 'string',
            company: 'string',
          },
          response: {
            success: 'boolean',
            data: 'array of job objects',
            pagination: 'object',
          },
        },
        'POST /jobs': {
          description: 'Create new job posting (requires authentication)',
          headers: {
            Authorization: 'Bearer <token>',
          },
          body: {
            title: 'string (required)',
            company: 'string (required)',
            description: 'string (required)',
            type: 'string (required)',
            category: 'string (required)',
            location: 'string (required)',
            remote: 'boolean (optional)',
            salary: 'object (optional)',
            requirements: 'array of strings (required)',
            skills: 'array of strings (required)',
            experience: 'object (required)',
            applicationDeadline: 'string (required, ISO datetime)',
            applicationLink: 'string (optional, valid URL)',
            contactEmail: 'string (optional, valid email)',
            isActive: 'boolean (optional)',
            featured: 'boolean (optional)',
          },
          response: {
            success: 'boolean',
            message: 'string',
            data: 'job object',
          },
        },
      },
      discounts: {
        'GET /discounts': {
          description: 'Get paginated list of discounts',
          queryParams: {
            page: 'number (default: 1)',
            limit: 'number (default: 10)',
            category: 'string (books|software|courses|hardware|services|events)',
            type: 'string (percentage|fixed|bogo|free)',
            featured: 'boolean',
            active: 'boolean',
            search: 'string',
            provider: 'string',
          },
          response: {
            success: 'boolean',
            data: 'array of discount objects',
            pagination: 'object',
          },
        },
        'POST /discounts': {
          description: 'Create new discount (requires admin authentication)',
          headers: {
            Authorization: 'Bearer <token>',
          },
          body: {
            title: 'string (required)',
            description: 'string (required)',
            category: 'string (required)',
            discountType: 'string (required)',
            discountValue: 'number (required)',
            originalPrice: 'number (optional)',
            discountedPrice: 'number (optional)',
            couponCode: 'string (optional)',
            provider: 'string (required)',
            websiteUrl: 'string (required, valid URL)',
            imageUrl: 'string (optional, valid URL)',
            validFrom: 'string (required, ISO datetime)',
            validUntil: 'string (required, ISO datetime)',
            termsAndConditions: 'array of strings (optional)',
            eligibility: 'array of strings (optional)',
            maxUsage: 'number (optional)',
            featured: 'boolean (optional)',
            isActive: 'boolean (optional)',
          },
          response: {
            success: 'boolean',
            message: 'string',
            data: 'discount object',
          },
        },
      },
      workHub: {
        'GET /work-hub/projects': {
          description: 'Get paginated list of projects',
          queryParams: {
            page: 'number (default: 1)',
            limit: 'number (default: 10)',
            category: 'string (web|mobile|ai-ml|robotics|iot|blockchain|gaming|other)',
            difficulty: 'string (beginner|intermediate|advanced)',
            status: 'string (planning|in-progress|completed|on-hold)',
            featured: 'boolean',
            recruiting: 'boolean (looking for members)',
            search: 'string',
            tech: 'string (technology filter)',
            user: 'string (user ID filter)',
          },
          response: {
            success: 'boolean',
            data: 'array of project objects',
            pagination: 'object',
          },
        },
        'POST /work-hub/projects': {
          description: 'Create new project (requires authentication)',
          headers: {
            Authorization: 'Bearer <token>',
          },
          body: {
            title: 'string (required)',
            description: 'string (required)',
            category: 'string (required)',
            techStack: 'array of strings (required)',
            difficulty: 'string (required)',
            duration: 'object (required)',
            teamSize: 'object (required)',
            requirements: 'array of strings (required)',
            goals: 'array of strings (required)',
            resources: 'array of objects (optional)',
            tags: 'array of strings (optional)',
            isPublic: 'boolean (optional)',
            lookingForMembers: 'boolean (optional)',
            featured: 'boolean (optional)',
          },
          response: {
            success: 'boolean',
            message: 'string',
            data: 'project object',
          },
        },
      },
      utils: {
        'GET /utils?type=updates': {
          description: 'Get latest updates for ticker',
          response: {
            success: 'boolean',
            data: 'array of update objects',
          },
        },
        'GET /utils?type=events': {
          description: 'Get events (with optional filters)',
          queryParams: {
            upcoming: 'boolean',
            limit: 'number',
          },
          response: {
            success: 'boolean',
            data: 'array of event objects',
          },
        },
        'GET /utils?type=polls': {
          description: 'Get active polls',
          response: {
            success: 'boolean',
            data: 'array of poll objects',
          },
        },
        'POST /utils?action=vote': {
          description: 'Submit poll vote',
          body: {
            pollId: 'string (required)',
            optionId: 'string (required)',
          },
          response: {
            success: 'boolean',
            message: 'string',
            data: 'poll object',
          },
        },
      },
    },
    responseFormat: {
      success: {
        success: true,
        data: '/* response data */',
        message: '/* optional success message */',
        pagination: '/* for paginated endpoints */',
      },
      error: {
        success: false,
        error: 'Error message',
        details: '/* optional error details */',
      },
    },
    authentication: {
      type: 'Bearer Token',
      header: 'Authorization: Bearer <token>',
      note: 'Include the Authorization header for protected endpoints',
    },
    notes: [
      'All timestamps are in ISO 8601 format',
      'Pagination is 1-indexed',
      'Mock data is used for demonstration purposes',
      'In production, implement proper database storage and JWT authentication',
      'Validate and sanitize all input data',
      'Implement rate limiting and proper error handling',
    ],
  };

  return NextResponse.json(apiDocumentation, { 
    headers: {
      'Content-Type': 'application/json',
    },
  });
}