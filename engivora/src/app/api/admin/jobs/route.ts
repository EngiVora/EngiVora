import { NextRequest, NextResponse } from 'next/server';

// GET all jobs
export async function GET(request: NextRequest) {
  try {
    // In a real application, you would fetch jobs from your database
    // For now, we'll return mock data
    const jobs = [
      { id: '1', title: 'Software Engineer', company: 'TechCorp', location: 'Bangalore', type: 'Full-time', postedDate: '2023-09-15', status: 'active' },
      { id: '2', title: 'Data Scientist', company: 'DataInsights', location: 'Remote', type: 'Contract', postedDate: '2023-09-10', status: 'active' },
      { id: '3', title: 'Frontend Developer', company: 'WebSolutions', location: 'Mumbai', type: 'Full-time', postedDate: '2023-08-28', status: 'active' },
      { id: '4', title: 'DevOps Engineer', company: 'CloudTech', location: 'Hyderabad', type: 'Full-time', postedDate: '2023-08-15', status: 'expired' },
      { id: '5', title: 'Product Manager', company: 'InnovateCo', location: 'Delhi', type: 'Full-time', postedDate: '2023-09-05', status: 'draft' },
    ];

    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST a new job
export async function POST(request: NextRequest) {
  try {
    const jobData = await request.json();

    // Validate required fields
    if (!jobData.title || !jobData.company || !jobData.location || !jobData.type || !jobData.description) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // In a real application, you would save the job to your database
    // For now, we'll just return the job with a mock ID
    const newJob = {
      id: Date.now().toString(),
      ...jobData,
      postedDate: new Date().toISOString().split('T')[0],
    };

    return NextResponse.json(newJob, { status: 201 });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}