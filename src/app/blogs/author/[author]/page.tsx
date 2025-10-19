import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { connectToDatabase } from '@/lib/db'
import { Blog } from '@/models/Blog'
import { AuthorProfileClient } from '@/components/blogs/author-profile-client'

interface AuthorPageProps {
  params: Promise<{ author: string }>
}

async function getAuthorBlogs(authorParam: string) {
  try {
    await connectToDatabase()
    
    // Check if the parameter is a numeric ID or author name
    const isNumericId = /^\d+$/.test(authorParam)
    
    let blogs
    if (isNumericId) {
      // If it's a numeric ID, we'll use mock data for now
      // In a real app, you'd query by author ID from a users/authors table
      blogs = []
    } else {
      // If it's an author name, search by author name
      blogs = await Blog.find({
        author: { $regex: authorParam, $options: 'i' },
        isPublished: true
      })
      .sort({ createdAt: -1 })
      .limit(50)
    }
    
    return blogs
  } catch (error) {
    console.error('Error fetching author blogs:', error)
    return []
  }
}

async function getAuthorStats(authorParam: string) {
  try {
    await connectToDatabase()
    
    // Check if the parameter is a numeric ID or author name
    const isNumericId = /^\d+$/.test(authorParam)
    
    let stats
    if (isNumericId) {
      // If it's a numeric ID, return empty stats for now
      stats = [{
        totalPosts: 0,
        totalViews: 0,
        avgRating: 0,
        latestPost: null
      }]
    } else {
      // If it's an author name, aggregate by author name
      stats = await Blog.aggregate([
        {
          $match: {
            author: { $regex: authorParam, $options: 'i' },
            isPublished: true
          }
        },
        {
          $group: {
            _id: null,
            totalPosts: { $sum: 1 },
            totalViews: { $sum: '$views' },
            avgRating: { $avg: '$rating' },
            latestPost: { $max: '$createdAt' }
          }
        }
      ])
    }
    
    return stats[0] || {
      totalPosts: 0,
      totalViews: 0,
      avgRating: 0,
      latestPost: null
    }
  } catch (error) {
    console.error('Error fetching author stats:', error)
    return {
      totalPosts: 0,
      totalViews: 0,
      avgRating: 0,
      latestPost: null
    }
  }
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { author } = await params
  const decodedAuthor = decodeURIComponent(author)
  
  const title = `${decodedAuthor} - Author Profile - EngiVora`
  const description = `Read all articles and insights by ${decodedAuthor} on EngiVora. Engineering blogs, tutorials, and career guidance.`

  return {
    title,
    description,
    keywords: [
      'engineering blog',
      decodedAuthor,
      'engineering articles',
      'career guidance',
      'engivora'
    ].join(', '),
    authors: [{ name: decodedAuthor }],
    openGraph: {
      title,
      description,
      type: 'profile',
      siteName: 'EngiVora',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    alternates: {
      canonical: `/blogs/author/${author}`,
    },
  }
}

export async function generateStaticParams() {
  try {
    await connectToDatabase()
    const authors = await Blog.distinct('author')
    
    return authors.map((author) => ({
      author: encodeURIComponent(author),
    }))
  } catch (error) {
    console.error('Error generating static params for authors:', error)
    return []
  }
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { author } = await params
  const decodedAuthor = decodeURIComponent(author)
  
  const [blogs, stats] = await Promise.all([
    getAuthorBlogs(decodedAuthor),
    getAuthorStats(decodedAuthor)
  ])

  if (blogs.length === 0) {
    notFound()
  }

  return (
    <AuthorProfileClient 
      author={decodedAuthor}
      blogs={blogs}
      stats={stats}
    />
  )
}
