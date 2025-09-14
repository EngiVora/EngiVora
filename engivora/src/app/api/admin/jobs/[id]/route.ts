import { NextRequest, NextResponse } from 'next/server';

// Mock database for demonstration
const mockJobs = [
  { id: '1', title: 'Software Engineer', company: 'TechCorp', location: 'Bangalore', type: 'Full-time', description: 'We are looking for a skilled software engineer...', postedDate: '2023-09-15', status: 'active' },
  { id: '2', title: 'Data Scientist', company: 'DataInsights', location: 'Remote', type: 'Contract', description: 'Join our data science team...', postedDate: '2023-09-10', status: 'active' },
  { id: '3', title: 'Frontend Developer', company: 'WebSolutions', location: 'Mumbai', type: 'Full-time', description: 'Frontend developer with React experience...', postedDate: '2023-08-28', status: 'active' },
  { id: '4', title: 'DevOps Engineer', company: 'CloudTech', location: 'Hyderabad', type: 'Full-time', description: 'Looking for DevOps engineer with AWS experience...', postedDate: '2023-08-15', status: 'expired' },
  { id: '5', title: 'Product Manager', company: 'InnovateCo', location: 'Delhi', type: 'Full-time', description: 'Experienced product manager needed...', postedDate: '2023-09-05', status: 'draft' },
];

// GET a specific job by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    
    // In a real application, you would fetch the job from your database
    // For now, we'll use our mock data
    const job = mockJobs.find(job => job.id === id);
    
    if (!job) {
      return NextResponse.json(
        { message: 'Job not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(job);
  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT (update) a specific job by ID
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const jobData = await request.json();
    
    // Validate required fields
    if (!jobData.title || !jobData.company || !jobData.location || !jobData.type || !jobData.description) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // In a real application, you would update the job in your database
    // For now, we'll just return the updated job
    const updatedJob = {
      id,
      ...jobData,
      // Preserve the original posted date if not provided
      postedDate: jobData.postedDate || new Date().toISOString().split('T')[0],
    };
    
    return NextResponse.json(updatedJob);
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE a specific job by ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    
    // In a real application, you would delete the job from your database
    // For now, we'll just return a success message
    
    return NextResponse.json(
      { message: `Job with ID ${id} deleted successfully` }
    );
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}