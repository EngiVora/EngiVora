import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Exam } from '@/models/Exam';
import { Blog } from '@/models/Blog';
import { Job } from '@/models/Job';
import { Event } from '@/models/Event';

// Dummy data for exams
const dummyExams = [
  {
    title: "Calculus II Exam",
    organization: "State University",
    date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    category: "mathematics",
    description: "Comprehensive exam covering integration techniques, series, and differential equations.",
    type: "entrance",
    applicationFee: 500,
    eligibility: ["B.Sc Mathematics", "Engineering Students"],
    syllabus: ["Integration", "Differential Equations", "Series and Sequences"],
    examCenters: ["Delhi", "Mumbai", "Bangalore"],
    officialWebsite: "https://stateuniversity.edu",
    isActive: true,
    registrationStartDate: new Date(),
    registrationEndDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=200&fit=crop"
  },
  {
    title: "Materials Science",
    organization: "University of Engineering",
    date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    category: "engineering",
    description: "Exam covering properties of materials, crystal structures, and material testing.",
    type: "competitive",
    applicationFee: 750,
    eligibility: ["B.Tech Students", "M.Tech Students"],
    syllabus: ["Crystal Structures", "Phase Diagrams", "Mechanical Properties"],
    examCenters: ["Chennai", "Hyderabad", "Pune"],
    officialWebsite: "https://enguniversity.edu",
    isActive: true,
    registrationStartDate: new Date(),
    registrationEndDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    imageUrl: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=400&h=200&fit=crop"
  }
];

// Dummy data for blogs
const dummyBlogs = [
  {
    title: "The Future of AI in Engineering",
    slug: "future-of-ai-in-engineering",
    summary: "Exploring how artificial intelligence is transforming the engineering landscape.",
    content: "Artificial Intelligence is revolutionizing the way engineers approach problem-solving...",
    category: "technology",
    tags: ["AI", "Machine Learning", "Engineering"],
    featured: true,
    published: true,
    views: 1250,
    likes: 42,
    imageUrl: "https://images.unsplash.com/photo-1677442135722-5f11e06a4e6d?w=400&h=200&fit=crop"
  },
  {
    title: "Career Paths in Renewable Energy",
    slug: "career-paths-renewable-energy",
    summary: "Exploring opportunities in the growing renewable energy sector.",
    content: "The renewable energy sector is experiencing unprecedented growth...",
    category: "career",
    tags: ["Renewable Energy", "Career", "Sustainability"],
    featured: false,
    published: true,
    views: 890,
    likes: 28,
    imageUrl: "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=400&h=200&fit=crop"
  }
];

// Dummy data for jobs
const dummyJobs = [
  {
    title: "Software Engineer Intern",
    company: "Tech Solutions Inc",
    location: "Remote",
    type: "internship",
    category: "software",
    description: "Join our team as a software engineering intern and work on cutting-edge projects.",
    remote: true,
    salary: { min: 25000, max: 30000, currency: "INR" },
    requirements: ["Pursuing B.Tech in CS/IT", "Knowledge of JavaScript"],
    skills: ["JavaScript", "React", "Node.js"],
    experience: { min: 0, max: 0 },
    applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    applicationLink: "https://techsolutions.com/apply",
    contactEmail: "careers@techsolutions.com",
    isActive: true,
    featured: true,
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=200&fit=crop"
  },
  {
    id: "mechanical-engineer",
    title: "Mechanical Engineer",
    company: "BuildWell Construction",
    location: "Los Angeles, CA",
    type: "full-time",
    category: "mechanical",
    description: "Design and oversee installation of mechanical systems for large construction projects.",
    remote: false,
    salary: { min: 80000, max: 100000, currency: "USD" },
    requirements: ["Bachelor's in Mechanical Engineering", "3+ years experience"],
    skills: ["AutoCAD", "SolidWorks", "Project Management"],
    experience: { min: 3, max: 5 },
    applicationDeadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    applicationLink: "https://buildwellconstruction.com/apply",
    contactEmail: "hr@buildwellconstruction.com",
    isActive: true,
    featured: false,
    imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=200&fit=crop"
  }
];

// Dummy data for events
const dummyEvents = [
  {
    title: "Intro to Quantum Computing",
    description: "Learn the fundamentals of quantum computing and its applications in modern technology.",
    type: "Webinar",
    status: "Upcoming",
    startDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    startTime: "14:00",
    endTime: "16:00",
    location: "Online",
    isOnline: true,
    maxAttendees: 500,
    registeredAttendees: 120,
    price: 0,
    organizer: "Quantum Research Institute",
    category: "Education",
    tags: ["Quantum Computing", "Technology", "Webinar"],
    featured: true,
    imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=200&fit=crop",
    requirements: "Basic understanding of computer science",
    agenda: ["Introduction to Quantum Bits", "Quantum Algorithms", "Applications in Industry"]
  },
  {
    title: "Robotics & Automation Workshop",
    description: "Hands-on workshop covering modern robotics and automation techniques.",
    type: "Workshop",
    status: "Scheduled",
    startDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
    startTime: "10:00",
    endTime: "17:00",
    location: "MIT Campus",
    isOnline: false,
    maxAttendees: 100,
    registeredAttendees: 45,
    price: 1500,
    organizer: "MIT Robotics Lab",
    category: "Education",
    tags: ["Robotics", "Automation", "Workshop"],
    featured: false,
    imageUrl: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=400&h=200&fit=crop",
    requirements: "Laptop with Python installed",
    agenda: ["Introduction to Robotics", "Programming Robots", "Hands-on Projects"]
  }
];

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    
    // Return all dummy data if no type specified
    if (!type) {
      return NextResponse.json({
        success: true,
        data: {
          exams: dummyExams,
          blogs: dummyBlogs,
          jobs: dummyJobs,
          events: dummyEvents
        }
      });
    }
    
    // Return specific type of dummy data
    switch (type) {
      case 'exams':
        return NextResponse.json({
          success: true,
          data: dummyExams
        });
      case 'blogs':
        return NextResponse.json({
          success: true,
          data: dummyBlogs
        });
      case 'jobs':
        return NextResponse.json({
          success: true,
          data: dummyJobs
        });
      case 'events':
        return NextResponse.json({
          success: true,
          data: dummyEvents
        });
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid type parameter. Use exams, blogs, jobs, or events.'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Dummy data fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    
    if (!type) {
      return NextResponse.json({
        success: false,
        error: 'Type parameter is required. Use exams, blogs, jobs, or events.'
      }, { status: 400 });
    }
    
    // Insert all dummy data for the specified type
    switch (type) {
      case 'exams':
        const createdExams = await Exam.insertMany(dummyExams);
        return NextResponse.json({
          success: true,
          message: 'Dummy exams created successfully',
          data: createdExams
        });
      case 'blogs':
        const createdBlogs = await Blog.insertMany(dummyBlogs);
        return NextResponse.json({
          success: true,
          message: 'Dummy blogs created successfully',
          data: createdBlogs
        });
      case 'jobs':
        const createdJobs = await Job.insertMany(dummyJobs);
        return NextResponse.json({
          success: true,
          message: 'Dummy jobs created successfully',
          data: createdJobs
        });
      case 'events':
        const createdEvents = await Event.insertMany(dummyEvents);
        return NextResponse.json({
          success: true,
          message: 'Dummy events created successfully',
          data: createdEvents
        });
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid type parameter. Use exams, blogs, jobs, or events.'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Dummy data creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}