import { NextRequest, NextResponse } from 'next/server';

// Mock data for utility endpoints

// Updates ticker data
const mockUpdates = [
  {
    id: '1',
    message: 'NEW: GATE 2025 Registration Open',
    type: 'exam',
    priority: 'high',
    isActive: true,
    createdAt: '2024-01-20T10:00:00Z',
  },
  {
    id: '2',
    message: 'Internship at TechCorp | Deadline: 25th Dec',
    type: 'job',
    priority: 'medium',
    isActive: true,
    createdAt: '2024-01-19T15:30:00Z',
  },
  {
    id: '3',
    message: '50% OFF on Engineering Textbooks',
    type: 'discount',
    priority: 'medium',
    isActive: true,
    createdAt: '2024-01-18T12:15:00Z',
  },
  {
    id: '4',
    message: 'Webinar: AI in Modern Engineering',
    type: 'event',
    priority: 'low',
    isActive: true,
    createdAt: '2024-01-17T09:45:00Z',
  },
];

// Events data
const mockEvents = [
  {
    id: '1',
    title: 'Intro to Quantum Computing',
    type: 'webinar',
    date: '2025-01-15T15:00:00Z',
    duration: 120, // minutes
    description: 'Learn the fundamentals of quantum computing and its applications in engineering',
    speaker: 'Dr. Raj Patel',
    registrationUrl: 'https://example.com/quantum-webinar',
    maxParticipants: 500,
    currentParticipants: 234,
    isActive: true,
    createdAt: '2024-01-01T10:00:00Z',
  },
  {
    id: '2',
    title: 'Robotics & Automation Workshop',
    type: 'workshop',
    date: '2025-01-22T10:00:00Z',
    duration: 480, // minutes (8 hours)
    description: 'Hands-on workshop on robotics programming and automation systems',
    speaker: 'Prof. Sarah Johnson',
    registrationUrl: 'https://example.com/robotics-workshop',
    maxParticipants: 50,
    currentParticipants: 43,
    isActive: true,
    createdAt: '2024-01-02T11:00:00Z',
  },
  {
    id: '3',
    title: 'National Hackathon 2025',
    type: 'competition',
    date: '2025-02-05T09:00:00Z',
    duration: 2880, // minutes (48 hours)
    description: '48-hour coding competition with prizes worth ₹5 lakhs',
    speaker: 'Multiple Judges',
    registrationUrl: 'https://example.com/hackathon-2025',
    maxParticipants: 1000,
    currentParticipants: 678,
    isActive: true,
    createdAt: '2024-01-03T12:00:00Z',
  },
  {
    id: '4',
    title: 'Alumni Networking Night',
    type: 'meetup',
    date: '2025-02-18T18:00:00Z',
    duration: 240, // minutes (4 hours)
    description: 'Connect with alumni working in top tech companies',
    speaker: 'Various Alumni',
    registrationUrl: 'https://example.com/alumni-networking',
    maxParticipants: 200,
    currentParticipants: 156,
    isActive: true,
    createdAt: '2024-01-04T13:00:00Z',
  },
];

// Poll data
const mockPolls = [
  {
    id: '1',
    question: 'What\'s your biggest challenge as an engineering student?',
    options: [
      {
        id: 'opt1',
        text: 'Time Management',
        votes: 145,
      },
      {
        id: 'opt2',
        text: 'Tough Coursework',
        votes: 98,
      },
      {
        id: 'opt3',
        text: 'Finding Internships',
        votes: 203,
      },
      {
        id: 'opt4',
        text: 'Other',
        votes: 67,
      },
    ],
    totalVotes: 513,
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    expiresAt: '2024-03-15T23:59:59Z',
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    switch (type) {
      case 'updates':
        return NextResponse.json({
          success: true,
          data: mockUpdates.filter(update => update.isActive),
        });

      case 'events':
        const limit = parseInt(searchParams.get('limit') || '10');
        const upcoming = searchParams.get('upcoming') === 'true';
        
        let filteredEvents = [...mockEvents];
        
        if (upcoming) {
          const now = new Date();
          filteredEvents = filteredEvents.filter(event => 
            new Date(event.date) > now && event.isActive
          );
        }
        
        // Sort by date (upcoming first)
        filteredEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        return NextResponse.json({
          success: true,
          data: filteredEvents.slice(0, limit),
        });

      case 'polls':
        const activePolls = mockPolls.filter(poll => {
          const now = new Date();
          return poll.isActive && new Date(poll.expiresAt) > now;
        });
        
        return NextResponse.json({
          success: true,
          data: activePolls,
        });

      default:
        return NextResponse.json({
          success: true,
          message: 'Utility API endpoints',
          endpoints: {
            'GET /api/utils?type=updates': 'Get latest updates for ticker',
            'GET /api/utils?type=events&upcoming=true&limit=4': 'Get upcoming events',
            'GET /api/utils?type=polls': 'Get active polls',
            'POST /api/utils/poll': 'Submit poll vote',
          },
        });
    }

  } catch (error) {
    console.error('Utils fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'vote') {
      const body = await request.json();
      const { pollId, optionId } = body;

      if (!pollId || !optionId) {
        return NextResponse.json(
          { error: 'Poll ID and option ID are required' },
          { status: 400 }
        );
      }

      const poll = mockPolls.find(p => p.id === pollId);
      
      if (!poll) {
        return NextResponse.json(
          { error: 'Poll not found' },
          { status: 404 }
        );
      }

      if (!poll.isActive || new Date(poll.expiresAt) < new Date()) {
        return NextResponse.json(
          { error: 'Poll is no longer active' },
          { status: 400 }
        );
      }

      const option = poll.options.find(opt => opt.id === optionId);
      
      if (!option) {
        return NextResponse.json(
          { error: 'Invalid option' },
          { status: 400 }
        );
      }

      // Increment vote count
      option.votes++;
      poll.totalVotes++;

      return NextResponse.json({
        success: true,
        message: 'Vote recorded successfully',
        data: poll,
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Utils POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}