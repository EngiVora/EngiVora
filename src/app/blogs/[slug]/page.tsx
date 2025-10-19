import type { Metadata } from "next"
import { notFound } from "next/navigation"
import BlogDetailClient from "./BlogDetailClient"

interface BlogPageProps {
  params: Promise<{
    slug: string
  }>
}

// Mock function to fetch blog by slug (replace with real API call)
async function getBlogBySlug(slug: string) {
  try {
    // In production, replace with actual API call
    const mockBlogs = [
      {
        id: '1',
        title: 'The Future of Engineering: Trends and Innovations',
        slug: 'future-of-engineering-trends-innovations',
        summary: 'Explore the emerging trends and innovations shaping the future of engineering, from AI and robotics to sustainable technologies.',
        content: `
          <h2>Introduction</h2>
          <p>The field of engineering is rapidly evolving, driven by technological advancements and changing global needs. As we look toward the future, several key trends are emerging that will shape how engineers approach problem-solving and innovation.</p>

          <h2>Artificial Intelligence and Machine Learning</h2>
          <p>AI and ML are revolutionizing engineering practices across all disciplines. From predictive maintenance in manufacturing to autonomous systems in transportation, these technologies are enabling engineers to create smarter, more efficient solutions.</p>

          <p>Key applications include:</p>
          <ul>
            <li>Predictive analytics for equipment maintenance</li>
            <li>Automated design optimization</li>
            <li>Quality control and defect detection</li>
            <li>Smart grid management</li>
          </ul>

          <h2>Sustainable Engineering Practices</h2>
          <p>With growing environmental concerns, sustainability has become a core consideration in engineering design. Engineers are now focusing on:</p>

          <ul>
            <li>Renewable energy systems</li>
            <li>Green building technologies</li>
            <li>Waste reduction and recycling</li>
            <li>Carbon footprint minimization</li>
          </ul>

          <h2>Digital Twin Technology</h2>
          <p>Digital twins are virtual replicas of physical systems that allow engineers to simulate, predict, and optimize performance. This technology is transforming industries by enabling:</p>

          <ul>
            <li>Real-time monitoring and analysis</li>
            <li>Predictive maintenance scheduling</li>
            <li>Design validation before physical implementation</li>
            <li>Performance optimization</li>
          </ul>

          <h2>Internet of Things (IoT)</h2>
          <p>IoT is creating interconnected ecosystems where devices communicate and share data. This connectivity is enabling new levels of automation and intelligence in engineering systems.</p>

          <h2>Conclusion</h2>
          <p>The future of engineering is bright, with emerging technologies opening new possibilities for innovation and problem-solving. Engineers who embrace these trends and continuously adapt their skills will be well-positioned to lead the transformation of their industries.</p>
        `,
        category: 'technology',
        tags: ['AI', 'Future Tech', 'Innovation', 'Sustainability'],
        author: {
          id: '1',
          name: 'Dr. Anya Sharma',
          email: 'anya.sharma@engivora.com',
          bio: 'Dr. Anya Sharma is a leading expert in sustainable engineering with over 15 years of experience in renewable energy systems.',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQH2T-U3EJFPoNgvpZesWbKFpcd0ZviQAiuAAXZ44awW7nVaxfA-0C07apDiIhXO7tFvlVOryALSZfFo-lHY1Y3XbBcgRPzj5ykTk6ZbZBA2PyQFktuivTFdq-nVk5UNUDRjxhQ6XNsNE8AH8-SHNGlYXPQoe4d5gAC7BKgK29eZvcojsf3jisD5ZSQgh8FHnFpHbRPRQ5sZcFQgGuHiYAj6BS0yu0bT8Y4k2OKqipf2VRZfn790A16s1wxn6O2bf8dympSkwc2Qc'
        },
        featured: true,
        published: true,
        views: 1250,
        likes: 89,
        readTime: '8 min read',
        publishedAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-20T15:30:00Z',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAM2R9kE0qcg7_hHLAZXCfH_Tvh-TI6-usLUJjHNoWpYxZySmxzNOClDeEAywLvLItOAb3U1bDLnXwogGxZQelSU7Ri_ASP0EZjXoXYFoZPP_DIepczx07liojLkJYivHa4O9QBLB5iewgkJJxVlxi0diVPEMTqbwF7BdSa0Adq3LWIoSXU36tchdc0tXNnqSIx5oIus98gAaplRdOJ2qgrKyLlgTeejw-VWKAfHDrvbkTBveOi_ZWoPj1pzwhWj48L8jGcTErsPuo'
      },
      {
        id: '2',
        title: 'Mastering Engineering Interviews: Tips and Strategies',
        slug: 'mastering-engineering-interviews-tips-strategies',
        summary: 'Ace your engineering interviews with expert tips and strategies, including common questions, preparation techniques, and follow-up advice.',
        content: `
          <h2>Preparing for Success</h2>
          <p>Engineering interviews can be challenging, but with proper preparation and the right mindset, you can excel. This comprehensive guide covers everything you need to know to ace your next engineering interview.</p>

          <h2>Technical Preparation</h2>
          <p>Technical skills are the foundation of any engineering role. Focus on:</p>

          <ul>
            <li>Reviewing fundamental concepts in your engineering discipline</li>
            <li>Practicing problem-solving with real-world scenarios</li>
            <li>Staying updated with industry trends and technologies</li>
            <li>Preparing for coding challenges if applicable</li>
          </ul>

          <h2>Common Interview Questions</h2>
          <p>Be prepared to answer questions about:</p>
          <ul>
            <li>Your technical background and experience</li>
            <li>Problem-solving approach and methodology</li>
            <li>Project management and teamwork skills</li>
            <li>Specific technical challenges you've overcome</li>
          </ul>

          <h2>Behavioral Questions</h2>
          <p>Use the STAR method (Situation, Task, Action, Result) to structure your responses to behavioral questions about leadership, conflict resolution, and teamwork.</p>

          <h2>Following Up</h2>
          <p>After the interview, send a thoughtful thank-you email within 24 hours, reiterating your interest and highlighting key points from your conversation.</p>
        `,
        category: 'career',
        tags: ['Interviews', 'Career Tips', 'Job Search', 'Professional Development'],
        author: {
          id: '2',
          name: 'Ethan Carter',
          email: 'ethan.carter@engivora.com',
          bio: 'Ethan Carter is a career counselor specializing in engineering careers and AI/Machine Learning roles.',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0vvKTNYw6JqrZIUX-5vsKMkrNYHedkd0oWVkwEmSN3dJcUUVRZzPIuTfETfeeV793L4tWpPjpxQyCIFXKrX55Tk3If1U1n5YKGoDpe_g3fZzpVpEkt8ew6EMvYJnIO-T8m8rVJLYM6x3dUKHt8Z9Dw6-OAD5owkRqLehipWsNX9qYlgy3CK7Hvk7_nVbgdysBv88xlCEIcQAOnp4xRY9Cdk-xqOyQHogGxy46i_YVwEJ9V9Z4Be0VCl2NaMyROiw8FB59NspvCZw'
        },
        featured: true,
        published: true,
        views: 980,
        likes: 67,
        readTime: '6 min read',
        publishedAt: '2024-01-10T08:30:00Z',
        updatedAt: '2024-01-10T08:30:00Z',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBx8jPX4p2Z0x0TOI7gGFRTZsMD4gY2PdsUyCPRyQrlqW-wwDmKMkIlRM-H_pXaKn_A3OJsabnVntUrVBiYEeunowE99LUUeuIJMW1p3v6fN34WEkLXHYWSAeZFiTBdlx802s2NuZdVuw54lGYJTtdS6nr9zBn_ZF_w4osZgbgnqHR2PP8eolniIDMuHrDTI810fbHHFp7jdMl0k0MbZ9JwGE0mLGO4WgQUPOgMRSAXWwX3Bd_ndeoJFr0yuH8-k5veNPjAIX04ork'
      },
      {
        id: '3',
        title: 'Building Your Engineering Portfolio: Projects and Experiences',
        slug: 'building-engineering-portfolio-projects-experiences',
        summary: 'Learn how to build a strong engineering portfolio with impactful projects that showcase your skills and attract employers.',
        content: `
          <h2>The Importance of a Strong Portfolio</h2>
          <p>Your engineering portfolio is more than just a collection of projects—it's a powerful tool that demonstrates your skills, creativity, and problem-solving abilities to potential employers and collaborators.</p>

          <h2>Selecting the Right Projects</h2>
          <p>Choose projects that showcase different aspects of your engineering expertise:</p>

          <ul>
            <li>Technical depth and complexity</li>
            <li>Real-world problem solving</li>
            <li>Innovation and creativity</li>
            <li>Collaboration and teamwork</li>
          </ul>

          <h2>Documentation Best Practices</h2>
          <p>Each project should include:</p>
          <ul>
            <li>Clear problem statement and objectives</li>
            <li>Technical approach and methodology</li>
            <li>Results and impact</li>
            <li>Lessons learned and future improvements</li>
            <li>Visual aids (diagrams, charts, photos)</li>
          </ul>

          <h2>Digital Presentation</h2>
          <p>Create an online portfolio using platforms like GitHub, personal websites, or professional portfolios. Ensure your portfolio is:</p>

          <ul>
            <li>Easy to navigate</li>
            <li>Mobile-friendly</li>
            <li>Regularly updated</li>
            <li>Linked to your professional profiles</li>
          </ul>
        `,
        category: 'career',
        tags: ['Portfolio', 'Career Development', 'Projects', 'Professional Growth'],
        author: {
          id: '1',
          name: 'Dr. Anya Sharma',
          email: 'anya.sharma@engivora.com',
          bio: 'Dr. Anya Sharma is a leading expert in sustainable engineering with over 15 years of experience in renewable energy systems.',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQH2T-U3EJFPoNgvpZesWbKFpcd0ZviQAiuAAXZ44awW7nVaxfA-0C07apDiIhXO7tFvlVOryALSZfFo-lHY1Y3XbBcgRPzj5ykTk6ZbZBA2PyQFktuivTFdq-nVk5UNUDRjxhQ6XNsNE8AH8-SHNGlYXPQoe4d5gAC7BKgK29eZvcojsf3jisD5ZSQgh8FHnFpHbRPRQ5sZcFQgGuHiYAj6BS0yu0bT8Y4k2OKqipf2VRZfn790A16s1wxn6O2bf8dympSkwc2Qc'
        },
        featured: false,
        published: true,
        views: 750,
        likes: 45,
        readTime: '5 min read',
        publishedAt: '2024-01-08T14:15:00Z',
        updatedAt: '2024-01-08T14:15:00Z',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC89Jwy3WaNxRBUQGonAzRjURd0j_lrh6coI5TuaTU_HfbJs3Rryhcx5H4pCoPByXtwkSJa_SorEoCEq5QxvK6l_sMrz0Ctzge8WGVyodeYene5tUT_PEdGqu4bhm5-u_AopmRonSAhO6XSD3IpG9bM7EgKGPwBWMy8M5RIL5fcU97B7muy0L_hT-tw83iPLgNppYQtshmyfBV4w5cI9LkuYGcla_0syf1I8Ws4ToLAI2aLzO5T0NMPxNcqpqi44CbMvKVParWPVqA'
      }
    ]

    return mockBlogs.find(blog => blog.slug === slug)
  } catch (error) {
    console.error('Error fetching blog:', error)
    return null
  }
}

// Get related blogs (mock implementation)
async function getRelatedBlogs(currentId: string, category: string, tags: string[]) {
  const mockRelatedBlogs = [
    {
      id: '4',
      title: 'The Importance of Networking in Engineering',
      slug: 'importance-networking-engineering',
      summary: 'Discover the significance of networking in the engineering field and how to build meaningful professional relationships.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFEwnsAwPmVuqHMVjCt_O4AqmkzRSo2NhmC8Q5EJKJ6e9Vp24PDNUPjVsyp-ErxW7SmWHibCtbTLn4kHVSVsrmVJ3zFA0NIIup80Cv93q3w4Q0s_ZSNPPJfguUT0nvdN28vGT5iEflqNmQryrM724OaW1NTx8tj1QJMjHrRXLu98JOOHJNB8iYDmVqJF5M651Y7gKZ_ILQZfUmSTLUNe4UQLiRLgRyR8pGQgascxKHQDni-7iQBQRqu7aN-fZ7nmWbhxh60PKi-ss',
      readTime: '4 min read',
      publishedAt: '2024-01-05T09:20:00Z'
    },
    {
      id: '5',
      title: 'Remote Work Best Practices for Engineers',
      slug: 'remote-work-best-practices-engineers',
      summary: 'Essential tips and strategies for engineering professionals working remotely in the modern workplace.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJwQMRV7MxmvnZhYBZQoU4ct1bgtCsQxkoD5ldMS9VSVjPCL8GPdkd98XHyQN8rli_-BXAUVXkEQ_5xXeEDYDST7UGilJMH77Mvxs0VvxKZ7TzX2EJcMqSbF2nhQ1MPWPVKnLg4c6FaKvx4GE4QpaTM1Jsu7BNeckw5mROPkWAQFPLXtgpcdTHYDWWGcAJCTrcHKHLbTjlsLKOxjnIPmj399_zVzrDI3ve3ZKpNUwz0Gsdas8qOzfFNKv9qScH4Uz3lW9DuegVfL8',
      readTime: '7 min read',
      publishedAt: '2024-01-03T11:45:00Z'
    },
    {
      id: '6',
      title: 'Emerging Technologies in Civil Engineering',
      slug: 'emerging-technologies-civil-engineering',
      summary: 'Explore the latest technological innovations transforming the civil engineering industry.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAM2R9kE0qcg7_hHLAZXCfH_Tvh-TI6-usLUJjHNoWpYxZySmxzNOClDeEAywLvLItOAb3U1bDLnXwogGxZQelSU7Ri_ASP0EZjXoXYFoZPP_DIepczx07liojLkJYivHa4O9QBLB5iewgkJJxVlxi0diVPEMTqbwF7BdSa0Adq3LWIoSXU36tchdc0tXNnqSIx5oIus98gAaplRdOJ2qgrKyLlgTeejw-VWKAfHDrvbkTBveOi_ZWoPj1pzwhWj48L8jGcTErsPuo',
      readTime: '6 min read',
      publishedAt: '2024-01-01T16:30:00Z'
    }
  ]

  return mockRelatedBlogs.filter(blog => blog.id !== currentId).slice(0, 3)
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params
  const blog = await getBlogBySlug(slug)

  if (!blog) {
    return {
      title: 'Blog Not Found - Engivora',
      description: 'The requested blog post could not be found.'
    }
  }

  return {
    title: `${blog.title} - Engivora Blog`,
    description: blog.summary,
    keywords: blog.tags.join(', '),
    authors: [{ name: blog.author.name }],
    openGraph: {
      title: blog.title,
      description: blog.summary,
      images: [blog.image],
      type: 'article',
      publishedTime: blog.publishedAt,
      modifiedTime: blog.updatedAt,
      authors: [blog.author.name]
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.summary,
      images: [blog.image]
    }
  }
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params
  const blog = await getBlogBySlug(slug)

  if (!blog) {
    notFound()
  }

  const relatedBlogs = await getRelatedBlogs(blog.id, blog.category, blog.tags)

  return <BlogDetailClient blog={blog} relatedBlogs={relatedBlogs} />
}
