import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema for opportunities
const opportunitySchema = z.object({
  title: z.string().min(3, 'Opportunity title must be at least 3 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  type: z.enum(['internship', 'research', 'volunteer', 'competition', 'hackathon', 'job']),
  organization: z.string().min(2, 'Organization name must be at least 2 characters'),
  location: z.string().min(2, 'Location must be at least 2 characters'),
  duration: z.string().min(1, 'Duration is required'),
  startDate: z.string(),
  endDate: z.string().optional(),
  deadline: z.string(),
  compensation: z.string().optional(),
  requirements: z.array(z.string()),
  responsibilities: z.array(z.string()),
  benefits: z.array(z.string()),
  skills: z.array(z.string()),
  applicationProcess: z.array(z.string()),
  contactEmail: z.string().email('Valid email is required'),
  contactPerson: z.string().min(2, 'Contact person name is required'),
  maxApplicants: z.number().positive().optional(),
  featured: z.boolean().optional().default(false),
  status: z.enum(['open', 'closed', 'upcoming']).optional().default('open'),
  imageUrl: z.string().url().optional(),
});

// Mock opportunities database
type Opportunity = {
  id: string;
  title: string;
  description: string;
  type: 'internship' | 'research' | 'volunteer' | 'competition' | 'hackathon' | 'job';
  organization: string;
  location: string;
  duration: string;
  startDate: string;
  endDate?: string;
  deadline: string;
  compensation?: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  skills: string[];
  applicationProcess: string[];
  contactEmail: string;
  contactPerson: string;
  likes: number;
  views: number;
  applicants: number;
  maxApplicants?: number;
  featured: boolean;
  status: 'open' | 'closed' | 'upcoming';
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
  applications: Array<{
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    message: string;
    status: 'pending' | 'accepted' | 'rejected';
    appliedAt: string;
  }>;
};

const mockOpportunities: Opportunity[] = [
  {
    id: '1',
    title: 'Internship: Robotics and Automation',
    description: 'Gain hands-on experience in robotics and automation by working on real-world projects with industry experts. This internship program offers comprehensive exposure to cutting-edge robotics technologies, automation systems, and collaborative robotics applications.',
    type: 'internship',
    organization: 'TechBot Industries',
    location: 'San Francisco, CA',
    duration: '3 months',
    startDate: '2024-06-01',
    endDate: '2024-08-30',
    deadline: '2024-04-15',
    compensation: '$2,500/month + benefits',
    requirements: [
      'Currently enrolled in Engineering, Computer Science, or related field',
      'Basic understanding of robotics and automation concepts',
      'Programming experience in Python or C++',
      'Strong problem-solving and analytical skills',
      'Excellent communication and teamwork abilities',
      'GPA of 3.0 or higher',
    ],
    responsibilities: [
      'Assist in designing and testing robotic systems',
      'Collaborate on automation projects for manufacturing processes',
      'Participate in research and development activities',
      'Document project progress and technical findings',
      'Present work to team members and stakeholders',
      'Support maintenance and troubleshooting of existing systems',
    ],
    benefits: [
      'Mentorship from senior engineers and robotics experts',
      'Access to state-of-the-art robotics lab and equipment',
      'Professional development workshops and training sessions',
      'Networking opportunities with industry professionals',
      'Potential for full-time offer upon successful completion',
      'Certificate of completion and recommendation letter',
    ],
    skills: ['Python', 'C++', 'ROS', 'CAD', 'Control Systems', 'Machine Learning'],
    applicationProcess: [
      'Submit online application with resume and cover letter',
      'Complete technical assessment (programming and robotics fundamentals)',
      'Participate in virtual interview with hiring team',
      'Final interview with department head and team members',
      'Reference check and background verification',
    ],
    contactEmail: 'internships@techbot.com',
    contactPerson: 'Dr. Jennifer Martinez, Internship Coordinator',
    likes: 156,
    views: 892,
    applicants: 45,
    maxApplicants: 8,
    featured: true,
    status: 'open',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXJTVYo-zRR3-Bs3RdhOPwaDIkDjnUejgkfksENmmJnANZn18Tst0et15DWm39341f4S-Af3w3JOjmG6OLXZRlVUZYamxD6E6yu8-_oMS1Xyl_LAmOUnRr23-H8Uf1s_R1r5CGuOVJRB2Mgu8BQxqpqZ02qEiGcATJTUOdpIYXZTTdMe2m1rjKq_17L_2yNNenI0MRozjNNRos1PrQhPL4Lj3P7ysg7W6aC4u4uctYVThXJ4vt_75xck3FgwynVIjnH3KoMlFm7xY',
    applications: [],
  },
  {
    id: '2',
    title: 'Research Assistant: AI in Engineering',
    description: 'Assist in research projects focused on applying artificial intelligence techniques to solve engineering challenges. This position offers the opportunity to work on cutting-edge research at the intersection of AI and engineering, contributing to publications and conferences.',
    type: 'research',
    organization: 'University Engineering Research Lab',
    location: 'Boston, MA',
    duration: '1 year (renewable)',
    startDate: '2024-09-01',
    deadline: '2024-05-01',
    compensation: '$1,800/month',
    requirements: [
      'Bachelor\'s degree in Engineering, Computer Science, or Mathematics',
      'Strong background in machine learning and AI concepts',
      'Experience with Python, TensorFlow, or PyTorch',
      'Excellent written and verbal communication skills',
      'Previous research experience preferred',
      'Interest in interdisciplinary research',
    ],
    responsibilities: [
      'Conduct literature reviews on AI applications in engineering',
      'Develop and implement machine learning models',
      'Collect, process, and analyze research data',
      'Assist in writing research papers and grant proposals',
      'Present findings at research meetings and conferences',
      'Mentor undergraduate students on related projects',
    ],
    benefits: [
      'Opportunity to contribute to high-impact research publications',
      'Access to advanced computing resources and AI frameworks',
      'Collaboration with leading researchers in the field',
      'Professional development in research methodologies',
      'Potential pathway to PhD program',
      'Conference travel funding for paper presentations',
    ],
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'Data Analysis', 'Research Methods'],
    applicationProcess: [
      'Submit application with CV, transcript, and research statement',
      'Provide two academic references',
      'Complete technical interview with research team',
      'Present previous research work or relevant projects',
      'Final meeting with principal investigator',
    ],
    contactEmail: 'research@university.edu',
    contactPerson: 'Prof. David Chen, Principal Investigator',
    likes: 89,
    views: 445,
    applicants: 23,
    maxApplicants: 3,
    featured: true,
    status: 'open',
    createdAt: '2024-01-10T14:00:00Z',
    updatedAt: '2024-01-22T09:15:00Z',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGDS8qv5m9nCzESb39k3qt8KBVm3csZRtSbk_xms8nvDHqVtBvGmv5xTu3BvLMkmG6iMEWmHZuLyYx2FBBBSfKSHPsQpkuysJYoMLgcPpaFPIINyXi_bR6V4fI0CJazCyDl0k0x_xfq8ZbnHChPZUZ_9nVQr5At8Ib2w8LQu-4va-8lQiRvZc6WEpKy0nVynIprYXWvJwJoc8JQZNE52yr30e3DaRh_amM3osbYbJIv1CcBRaHarXILDp_nADlYIzUPizuLcuVL8I',
    applications: [],
  },
  {
    id: '3',
    title: 'Engineering Outreach Program',
    description: 'Inspire the next generation of engineers by volunteering in outreach programs and workshops for students. Join our mission to promote STEM education and engineering careers among K-12 students through hands-on activities.',
    type: 'volunteer',
    organization: 'Engineers Without Borders - Local Chapter',
    location: 'Various schools in Metro Area',
    duration: 'Ongoing (4 hours/month minimum)',
    startDate: '2024-02-01',
    deadline: 'Open enrollment',
    requirements: [
      'Bachelor\'s degree in Engineering or related field',
      'Passion for education and working with young people',
      'Excellent communication and presentation skills',
      'Patience and enthusiasm for teaching',
      'Background check clearance for working with minors',
      'Weekend availability preferred',
    ],
    responsibilities: [
      'Conduct engaging engineering workshops for students',
      'Assist with STEM fair judging and mentoring',
      'Develop educational materials and activities',
      'Represent engineering profession at career fairs',
      'Support after-school and summer STEM programs',
      'Collaborate with teachers and school administrators',
    ],
    benefits: [
      'Make meaningful impact on students\' lives and career choices',
      'Develop teaching and presentation skills',
      'Networking with other engineering professionals',
      'Community service hours for professional development',
      'Training workshops on effective STEM education',
      'Recognition awards and volunteer appreciation events',
    ],
    skills: ['Public Speaking', 'Teaching', 'STEM Education', 'Workshop Development'],
    applicationProcess: [
      'Complete volunteer application and background check',
      'Attend volunteer orientation and training session',
      'Shadow experienced volunteers on initial visits',
      'Commit to minimum volunteer hour requirements',
    ],
    contactEmail: 'volunteer@ewb-local.org',
    contactPerson: 'Sarah Johnson, Outreach Coordinator',
    likes: 67,
    views: 334,
    applicants: 12,
    featured: false,
    status: 'open',
    createdAt: '2024-01-05T11:00:00Z',
    updatedAt: '2024-01-18T16:20:00Z',
    applications: [],
  },
  {
    id: '4',
    title: 'Annual Design Challenge',
    description: 'Showcase your skills and compete with peers in our annual engineering design competition. This year\'s challenge focuses on sustainable transportation solutions for urban environments.',
    type: 'competition',
    organization: 'National Engineering Society',
    location: 'Hybrid (Online + Finals in Chicago)',
    duration: '6 weeks + Finals weekend',
    startDate: '2024-03-15',
    endDate: '2024-05-15',
    deadline: '2024-03-01',
    compensation: '$50,000 total prize pool',
    requirements: [
      'Teams of 3-5 members (students or recent graduates)',
      'At least one team member in engineering or design field',
      'Access to design software and prototyping resources',
      'Commitment to full competition timeline',
      'Willingness to present solution at finals',
    ],
    responsibilities: [
      'Research and analyze urban transportation challenges',
      'Develop innovative and feasible design solutions',
      'Create detailed technical documentation',
      'Build functional prototype or detailed simulation',
      'Prepare and deliver final presentation to judges',
      'Collaborate effectively within team structure',
    ],
    benefits: [
      'Cash prizes: $25K first place, $15K second, $10K third',
      'Mentorship from industry leaders and investors',
      'Networking opportunities with engineering professionals',
      'Portfolio-worthy project for career advancement',
      'Potential startup incubation and funding opportunities',
      'Recognition in engineering publications and conferences',
    ],
    skills: ['Design Thinking', 'Prototyping', 'Team Collaboration', 'Presentation'],
    applicationProcess: [
      'Register team and submit initial concept proposal',
      'Pass preliminary screening round',
      'Participate in virtual mentor matching session',
      'Submit milestone deliverables throughout competition',
      'Qualify for finals through judging rounds',
    ],
    contactEmail: 'competition@nes.org',
    contactPerson: 'Mark Thompson, Competition Director',
    likes: 203,
    views: 1156,
    applicants: 78,
    maxApplicants: 50,
    featured: true,
    status: 'open',
    createdAt: '2024-01-20T09:00:00Z',
    updatedAt: '2024-01-25T14:45:00Z',
    applications: [],
  },
  {
    id: '5',
    title: 'Innovate for Good Hackathon',
    description: 'Collaborate with a team to build innovative solutions for social and environmental problems. This 48-hour hackathon brings together engineers, designers, and social innovators to tackle pressing global challenges.',
    type: 'hackathon',
    organization: 'Global Innovation Foundation',
    location: 'Seattle, WA + Virtual participation',
    duration: '48 hours',
    startDate: '2024-04-12',
    endDate: '2024-04-14',
    deadline: '2024-04-01',
    requirements: [
      'No specific qualifications required - all backgrounds welcome',
      'Enthusiasm for social impact and innovation',
      'Ability to work intensively in team environment',
      'Laptop and necessary development tools',
      'Commitment to full event participation',
    ],
    responsibilities: [
      'Form or join a diverse, multidisciplinary team',
      'Identify and define social/environmental problem to solve',
      'Develop functional prototype or proof of concept',
      'Create presentation showcasing solution impact',
      'Pitch final solution to panel of expert judges',
      'Network with other participants and mentors',
    ],
    benefits: [
      'Win prizes up to $10,000 for winning solutions',
      'Access to expert mentors from tech and social sectors',
      'Free meals, snacks, and networking events',
      'Potential follow-up funding and incubation opportunities',
      'Certificate of participation and networking connections',
      'Media coverage and recognition for winning teams',
    ],
    skills: ['Programming', 'Design', 'Problem Solving', 'Teamwork'],
    applicationProcess: [
      'Register online with brief background information',
      'Indicate areas of interest and expertise',
      'Attend pre-event networking and team formation',
      'Participate in opening ceremonies and challenge presentation',
    ],
    contactEmail: 'hackathon@globalinnovation.org',
    contactPerson: 'Lisa Park, Event Coordinator',
    likes: 145,
    views: 728,
    applicants: 156,
    maxApplicants: 200,
    featured: true,
    status: 'open',
    createdAt: '2024-01-12T13:30:00Z',
    updatedAt: '2024-01-24T10:15:00Z',
    applications: [],
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
    const status = searchParams.get('status');
    const location = searchParams.get('location');
    const featured = searchParams.get('featured') === 'true';
    const search = searchParams.get('search');
    const organization = searchParams.get('organization');

    let filteredOpportunities = [...mockOpportunities];

    // Filter by type
    if (type && type !== 'all') {
      filteredOpportunities = filteredOpportunities.filter(opp => opp.type === type);
    }

    // Filter by status
    if (status && status !== 'all') {
      filteredOpportunities = filteredOpportunities.filter(opp => opp.status === status);
    }

    // Filter by location
    if (location) {
      filteredOpportunities = filteredOpportunities.filter(opp =>
        opp.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Filter by featured
    if (featured) {
      filteredOpportunities = filteredOpportunities.filter(opp => opp.featured);
    }

    // Filter by organization
    if (organization) {
      filteredOpportunities = filteredOpportunities.filter(opp =>
        opp.organization.toLowerCase().includes(organization.toLowerCase())
      );
    }

    // Search functionality
    if (search) {
      const searchLower = search.toLowerCase();
      filteredOpportunities = filteredOpportunities.filter(opp =>
        opp.title.toLowerCase().includes(searchLower) ||
        opp.description.toLowerCase().includes(searchLower) ||
        opp.organization.toLowerCase().includes(searchLower) ||
        opp.location.toLowerCase().includes(searchLower) ||
        opp.skills.some(skill => skill.toLowerCase().includes(searchLower))
      );
    }

    // Sort by creation date (newest first), then by featured
    filteredOpportunities.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedOpportunities = filteredOpportunities.slice(startIndex, endIndex);

    const totalPages = Math.ceil(filteredOpportunities.length / limit);

    return NextResponse.json({
      success: true,
      data: paginatedOpportunities,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: filteredOpportunities.length,
        itemsPerPage: limit,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });

  } catch (error) {
    console.error('Opportunities fetch error:', error);
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
    const validatedData = opportunitySchema.parse(body);

    // Create new opportunity
    const newOpportunity: Opportunity = {
      id: (mockOpportunities.length + 1).toString(),
      ...validatedData,
      likes: 0,
      views: 0,
      applicants: 0,
      applications: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockOpportunities.push(newOpportunity);

    return NextResponse.json({
      success: true,
      message: 'Opportunity created successfully',
      data: newOpportunity,
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Opportunity creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
