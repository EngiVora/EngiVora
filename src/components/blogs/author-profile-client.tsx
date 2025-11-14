"use client"

import { useState } from 'react'
import { Calendar, Eye, Heart, MessageCircle, Share2, BookOpen, TrendingUp, Award } from 'lucide-react'
import { OptimizedImage } from '@/components/optimized-image'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

interface Blog {
  _id: string
  title: string
  summary: string
  content: string
  author: string
  category: string
  tags: string[]
  image: string
  views: number
  likes: number
  comments: number
  rating: number
  createdAt: string
  updatedAt: string
}

interface AuthorStats {
  totalPosts: number
  totalViews: number
  avgRating: number
  latestPost: string | null
}

interface AuthorProfileClientProps {
  author: string
  blogs: Blog[]
  stats: AuthorStats
}

export function AuthorProfileClient({ author, blogs, stats }: AuthorProfileClientProps) {
  const [sortBy, setSortBy] = useState<'date' | 'views' | 'rating'>('date')
  const [showShareModal, setShowShareModal] = useState(false)

  const sortedBlogs = [...blogs].sort((a, b) => {
    switch (sortBy) {
      case 'views':
        return b.views - a.views
      case 'rating':
        return (b.rating || 0) - (a.rating || 0)
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${author} - Author Profile`,
        text: `Check out ${author}'s articles on EngiVora`,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      setShowShareModal(true)
      setTimeout(() => setShowShareModal(false), 2000)
    }
  }

  const getPopularTags = () => {
    const tagCounts: { [key: string]: number } = {}
    blogs.forEach(blog => {
      blog.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      })
    })
    
    return Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count }))
  }

  const getTopCategories = () => {
    const categoryCounts: { [key: string]: number } = {}
    blogs.forEach(blog => {
      categoryCounts[blog.category] = (categoryCounts[blog.category] || 0) + 1
    })
    
    return Object.entries(categoryCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([category, count]) => ({ category, count }))
  }

  const popularTags = getPopularTags()
  const topCategories = getTopCategories()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Author Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">
                  {author.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{author}</h1>
              <p className="text-gray-600 mb-4">Engineering Blog Author</p>
              
              <div className="flex flex-wrap items-center gap-6 mb-4">
                <div className="flex items-center text-gray-600">
                  <BookOpen className="w-5 h-5 mr-2" />
                  <span>{stats.totalPosts} Articles</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Eye className="w-5 h-5 mr-2" />
                  <span>{stats.totalViews.toLocaleString()} Views</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Award className="w-5 h-5 mr-2" />
                  <span>{stats.avgRating.toFixed(1)} Avg Rating</span>
                </div>
                {stats.latestPost && (
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-5 h-5 mr-2" />
                    <span>Latest: {formatDistanceToNow(new Date(stats.latestPost), { addSuffix: true })}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Share Profile
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  Follow Author
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalPosts}</div>
            <div className="text-gray-600">Total Articles</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</div>
            <div className="text-gray-600">Total Views</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.avgRating.toFixed(1)}</div>
            <div className="text-gray-600">Average Rating</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {Math.round(stats.totalViews / Math.max(stats.totalPosts, 1))}
            </div>
            <div className="text-gray-600">Avg Views/Post</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sort Options */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Articles by {author}</h2>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Sort articles by"
                  >
                    <option value="date">Date</option>
                    <option value="views">Views</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Articles List */}
            <div className="space-y-6">
              {sortedBlogs.map((blog) => (
                <Link
                  key={blog._id}
                  href={`/blogs/${blog._id}`}
                  className="block bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="md:flex">
                    <div className="md:w-1/3">
                      <div className="h-48 md:h-full">
                        {blog.image ? (
                          <OptimizedImage
                            src={blog.image}
                            alt={blog.title}
                            width={400}
                            height={300}
                            className="w-full h-full object-cover"
                            fallbackSrc="/images/blog-placeholder.svg"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                            <BookOpen className="w-12 h-12 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="md:w-2/3 p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {blog.category}
                        </span>
                        <span className="text-gray-500 text-sm">
                          {formatDate(blog.createdAt)}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                        {blog.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {blog.summary}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {blog.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            <span>{blog.views}</span>
                          </div>
                          <div className="flex items-center">
                            <Heart className="w-4 h-4 mr-1" />
                            <span>{blog.likes}</span>
                          </div>
                          <div className="flex items-center">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            <span>{blog.comments}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Popular Tags */}
            {popularTags.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map(({ tag, count }) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      #{tag} ({count})
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Top Categories */}
            {topCategories.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Top Categories</h3>
                <div className="space-y-3">
                  {topCategories.map(({ category, count }) => (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-gray-700">{category}</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Author Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">About the Author</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Member since:</span>
                  <span className="text-gray-900">
                    {formatDistanceToNow(new Date(blogs[blogs.length - 1]?.createdAt || new Date()), { addSuffix: true })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Writing frequency:</span>
                  <span className="text-gray-900">
                    {Math.round(stats.totalPosts / Math.max((Date.now() - new Date(blogs[blogs.length - 1]?.createdAt || new Date()).getTime()) / (1000 * 60 * 60 * 24 * 30), 1))} posts/month
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Engagement rate:</span>
                  <span className="text-gray-900">
                    {((stats.totalViews / Math.max(stats.totalPosts, 1)) / 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-2">Link Copied!</h3>
            <p className="text-gray-600">Author profile link has been copied to your clipboard.</p>
            <button
              onClick={() => setShowShareModal(false)}
              className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
