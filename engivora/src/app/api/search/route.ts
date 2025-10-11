import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from '@/lib/db'
import { Job } from '@/models/Job'
import { Blog } from '@/models/Blog'
import { Event } from '@/models/Event'
import { Exam } from '@/models/Exam'

interface SearchResult {
  title: string
  description: string
  url: string
  type: 'exam' | 'job' | 'blog' | 'event'
  date?: string
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')?.toLowerCase().trim()

    if (!query) {
      return NextResponse.json({ results: [] })
    }

    await connectToDatabase()

    const results: SearchResult[] = []

    // Search in parallel across all collections
    const [jobs, blogs, events, exams] = await Promise.all([
      // Search Jobs
      Job.find({
        isActive: true,
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { company: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { skills: { $elemMatch: { $regex: query, $options: 'i' } } },
        ]
      }).limit(20).lean(),

      // Search Blogs
      Blog.find({
        published: true,
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { summary: { $regex: query, $options: 'i' } },
          { tags: { $elemMatch: { $regex: query, $options: 'i' } } },
        ]
      }).limit(20).lean(),

      // Search Events
      Event.find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { organizer: { $regex: query, $options: 'i' } },
          { tags: { $elemMatch: { $regex: query, $options: 'i' } } },
        ]
      }).limit(20).lean(),

      // Search Exams
      Exam.find({
        isActive: true,
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { organization: { $regex: query, $options: 'i' } },
        ]
      }).limit(20).lean(),
    ])

    // Transform and add jobs
    jobs.forEach((job: any) => {
      results.push({
        title: job.title,
        description: job.description || `${job.type} position at ${job.company}`,
        url: `/jobs`,
        type: 'job',
        date: job.createdAt ? new Date(job.createdAt).toLocaleDateString() : undefined
      })
    })

    // Transform and add blogs
    blogs.forEach((blog: any) => {
      results.push({
        title: blog.title,
        description: blog.summary || blog.content?.substring(0, 150) + '...',
        url: `/blogs`,
        type: 'blog',
        date: blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : undefined
      })
    })

    // Transform and add events
    events.forEach((event: any) => {
      results.push({
        title: event.title,
        description: event.description,
        url: `/events`,
        type: 'event',
        date: event.startDate ? new Date(event.startDate).toLocaleDateString() : undefined
      })
    })

    // Transform and add exams
    exams.forEach((exam: any) => {
      results.push({
        title: exam.title,
        description: exam.description || `Exam conducted by ${exam.organization}`,
        url: `/exams`,
        type: 'exam',
        date: exam.date ? new Date(exam.date).toLocaleDateString() : undefined
      })
    })

    // Sort results by relevance (title matches first, then description matches)
    results.sort((a, b) => {
      const aTitle = a.title.toLowerCase().includes(query)
      const bTitle = b.title.toLowerCase().includes(query)
      
      if (aTitle && !bTitle) return -1
      if (!aTitle && bTitle) return 1
      return 0
    })

    // Limit results to 8 for the dropdown
    const limitedResults = results.slice(0, 8)

    return NextResponse.json({ 
      results: limitedResults,
      total: results.length,
      query 
    })

  } catch (error) {
    console.error('Search API error:', error)
    
    // Fallback to mock data if database is not available
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const mockResults = getMockSearchResults(query)
    
    return NextResponse.json({ 
      results: mockResults.slice(0, 8),
      total: mockResults.length,
      query: query
    })
  }
}

// Fallback mock data function
function getMockSearchResults(query: string): SearchResult[] {
  const mockData = {
    exams: [
      {
        title: "GATE 2025 Registration",
        description: "Graduate Aptitude Test in Engineering registration is now open for all branches",
        url: "/exams",
        date: "Dec 25, 2024"
      },
      {
        title: "JEE Advanced 2025",
        description: "Joint Entrance Examination Advanced for IIT admissions",
        url: "/exams",
        date: "May 15, 2025"
      }
    ],
    jobs: [
      {
        title: "Software Engineer - Google",
        description: "Full-time software engineering position at Google for new graduates",
        url: "/jobs",
        date: "Posted 2 days ago"
      },
      {
        title: "Data Scientist - Microsoft",
        description: "Entry-level data scientist role focusing on machine learning",
        url: "/jobs",
        date: "Posted 1 week ago"
      }
    ],
    blogs: [
      {
        title: "Getting Started with Machine Learning",
        description: "A comprehensive guide for engineering students to start their ML journey",
        url: "/blogs",
        date: "Dec 10, 2024"
      }
    ],
    events: [
      {
        title: "Engineering Career Fair 2025",
        description: "Annual career fair connecting students with top tech companies",
        url: "/events",
        date: "March 15, 2025"
      }
    ]
  }

  const results: SearchResult[] = []
  const lowerQuery = query.toLowerCase()

  Object.entries(mockData).forEach(([type, items]) => {
    items.forEach((item) => {
      const titleMatch = item.title.toLowerCase().includes(lowerQuery)
      const descriptionMatch = item.description.toLowerCase().includes(lowerQuery)
      
      if (titleMatch || descriptionMatch) {
        results.push({
          title: item.title,
          description: item.description,
          url: item.url,
          type: type.slice(0, -1) as SearchResult['type'],
          date: item.date
        })
      }
    })
  })

  return results
}