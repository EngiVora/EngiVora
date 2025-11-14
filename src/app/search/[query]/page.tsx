import { Metadata } from 'next'
import { connectToDatabase } from '@/lib/db'
import { Job } from '@/models/Job'
import { Blog } from '@/models/Blog'
import { Event } from '@/models/Event'
import { Exam } from '@/models/Exam'
import { SearchResultsClient } from '@/components/search/search-results-client'

interface SearchPageProps {
  params: Promise<{ query: string }>
  searchParams: Promise<{ type?: string; page?: string }>
}

interface SearchResults {
  jobs: any[]
  blogs: any[]
  events: any[]
  exams: any[]
  totalResults: number
}

async function searchContent(query: string, type?: string): Promise<SearchResults> {
  try {
    await connectToDatabase()
    
    const searchRegex = new RegExp(query, 'i')
    const results: SearchResults = {
      jobs: [],
      blogs: [],
      events: [],
      exams: [],
      totalResults: 0
    }

    // Search jobs
    if (!type || type === 'jobs') {
      const jobs = await Job.find({
        $or: [
          { title: searchRegex },
          { company: searchRegex },
          { description: searchRegex },
          { location: searchRegex },
          { skills: { $in: [searchRegex] } }
        ],
        isActive: true
      })
      .limit(20)
      .sort({ createdAt: -1 })
      
      results.jobs = jobs
    }

    // Search blogs
    if (!type || type === 'blogs') {
      const blogs = await Blog.find({
        $or: [
          { title: searchRegex },
          { summary: searchRegex },
          { content: searchRegex },
          { tags: { $in: [searchRegex] } }
        ],
        isPublished: true
      })
      .limit(20)
      .sort({ createdAt: -1 })
      
      results.blogs = blogs
    }

    // Search events
    if (!type || type === 'events') {
      const events = await Event.find({
        $or: [
          { title: searchRegex },
          { description: searchRegex },
          { organizer: searchRegex },
          { location: searchRegex },
          { tags: { $in: [searchRegex] } }
        ],
        isActive: true
      })
      .limit(20)
      .sort({ startDate: 1 })
      
      results.events = events
    }

    // Search exams
    if (!type || type === 'exams') {
      const exams = await Exam.find({
        $or: [
          { title: searchRegex },
          { description: searchRegex },
          { conductingBody: searchRegex },
          { category: searchRegex }
        ],
        isActive: true
      })
      .limit(20)
      .sort({ date: 1 })
      
      results.exams = exams
    }

    results.totalResults = results.jobs.length + results.blogs.length + results.events.length + results.exams.length

    return results
  } catch (error) {
    console.error('Search error:', error)
    return {
      jobs: [],
      blogs: [],
      events: [],
      exams: [],
      totalResults: 0
    }
  }
}

export async function generateMetadata({ params, searchParams }: SearchPageProps): Promise<Metadata> {
  const { query } = await params
  const { type } = await searchParams
  
  const decodedQuery = decodeURIComponent(query)
  const title = type 
    ? `Search Results for "${decodedQuery}" in ${type} - EngiVora`
    : `Search Results for "${decodedQuery}" - EngiVora`

  const description = `Find ${type || 'all'} related to "${decodedQuery}" on EngiVora. Discover jobs, blogs, events, and exams.`

  return {
    title,
    description,
    keywords: [
      'search',
      'engineering',
      decodedQuery,
      type || 'jobs blogs events exams',
      'engivora'
    ].join(', '),
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'EngiVora',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    alternates: {
      canonical: `/search/${query}${type ? `?type=${type}` : ''}`,
    },
  }
}

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
  const { query } = await params
  const { type, page } = await searchParams
  
  const decodedQuery = decodeURIComponent(query)
  const currentPage = parseInt(page || '1')
  
  const results = await searchContent(decodedQuery, type)

  return (
    <SearchResultsClient 
      query={decodedQuery}
      results={results}
      type={type}
      currentPage={currentPage}
    />
  )
}
