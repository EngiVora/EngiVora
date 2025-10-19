"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import {
  Heart,
  BookmarkPlus,
  Share2,
  Eye,
  Clock,
  ArrowLeft,
  Twitter,
  Facebook,
  Linkedin,
  Copy,
  Check
} from "lucide-react"

interface Author {
  id: string
  name: string
  email: string
  bio: string
  avatar: string
}

interface Blog {
  id: string
  title: string
  slug: string
  summary: string
  content: string
  category: string
  tags: string[]
  author: Author
  featured: boolean
  published: boolean
  views: number
  likes: number
  readTime: string
  publishedAt: string
  updatedAt: string
  image: string
}

interface RelatedBlog {
  id: string
  title: string
  slug: string
  summary: string
  image: string
  readTime: string
  publishedAt: string
}

interface BlogDetailClientProps {
  blog: Blog
  relatedBlogs: RelatedBlog[]
}

export default function BlogDetailClient({ blog, relatedBlogs }: BlogDetailClientProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [copied, setCopied] = useState(false)
  const [readingProgress, setReadingProgress] = useState(0)

  const { scrollYProgress } = useScroll()
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

  useEffect(() => {
    const updateReadingProgress = () => {
      const scrolled = window.scrollY
      const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrolled / maxScrollTop) * 100
      setReadingProgress(progress)
    }

    window.addEventListener('scroll', updateReadingProgress)
    return () => window.removeEventListener('scroll', updateReadingProgress)
  }, [])

  const handleLike = async () => {
    try {
      // In production, make API call to like/unlike the blog
      setIsLiked(!isLiked)
    } catch (error) {
      console.error('Error liking blog:', error)
    }
  }

  const handleBookmark = async () => {
    try {
      // In production, make API call to bookmark/unbookmark the blog
      setIsBookmarked(!isBookmarked)
    } catch (error) {
      console.error('Error bookmarking blog:', error)
    }
  }

  const handleShare = (platform: string) => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    const text = `Check out this article: ${blog.title}`

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`)
        break
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)
        break
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`)
        break
      case 'copy':
        navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        break
    }
    setShowShareMenu(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      technology: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      career: 'bg-green-500/20 text-green-400 border-green-500/30',
      academic: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      lifestyle: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      news: 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    }
    return colors[category as keyof typeof colors] || colors.technology
  }

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-sky-500 z-50 origin-left"
        style={{ width: progressWidth }}
      />

      {/* Back Button */}
      <div className="fixed top-6 left-6 z-40">
        <Link
          href="/blogs"
          className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-sm text-slate-300 hover:text-white px-4 py-2 rounded-full transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blogs
        </Link>
      </div>

      {/* Social Actions */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleLike}
          className={`p-3 rounded-full backdrop-blur-sm transition-colors ${
            isLiked
              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
              : 'bg-slate-900/80 text-slate-400 hover:text-red-400'
          }`}
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleBookmark}
          className={`p-3 rounded-full backdrop-blur-sm transition-colors ${
            isBookmarked
              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
              : 'bg-slate-900/80 text-slate-400 hover:text-yellow-400'
          }`}
        >
          <BookmarkPlus className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
        </motion.button>

        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="p-3 rounded-full bg-slate-900/80 text-slate-400 hover:text-sky-400 backdrop-blur-sm transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </motion.button>

          {showShareMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 10 }}
              className="absolute right-full mr-3 top-0 bg-slate-900/95 backdrop-blur-sm border border-slate-700 rounded-lg p-2 flex flex-col gap-1"
            >
              <button
                onClick={() => handleShare('twitter')}
                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-sky-400 hover:bg-slate-800 rounded transition-colors"
              >
                <Twitter className="w-4 h-4" />
                Twitter
              </button>
              <button
                onClick={() => handleShare('facebook')}
                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-blue-400 hover:bg-slate-800 rounded transition-colors"
              >
                <Facebook className="w-4 h-4" />
                Facebook
              </button>
              <button
                onClick={() => handleShare('linkedin')}
                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-blue-600 hover:bg-slate-800 rounded transition-colors"
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </button>
              <button
                onClick={() => handleShare('copy')}
                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-green-400 hover:bg-slate-800 rounded transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </motion.div>
          )}
        </div>
      </div>

      <main className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-6">
          {/* Article Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            {/* Category Badge */}
            <div className="mb-4">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(blog.category)}`}>
                {blog.category.charAt(0).toUpperCase() + blog.category.slice(1)}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              {blog.title}
            </h1>

            {/* Summary */}
            <p className="text-xl text-slate-400 leading-relaxed mb-8">
              {blog.summary}
            </p>

            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-6 text-slate-400">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={blog.author.avatar}
                    alt={blog.author.name}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-slate-200 font-medium">{blog.author.name}</p>
                  <p className="text-sm">{formatDate(blog.publishedAt)}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {blog.readTime}
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {blog.views.toLocaleString()} views
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  {blog.likes} likes
                </div>
              </div>
            </div>
          </motion.div>

          {/* Featured Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12 rounded-xl overflow-hidden"
          >
            <Image
              src={blog.image}
              alt={blog.title}
              width={800}
              height={400}
              className="w-full h-96 object-cover"
            />
          </motion.div>

          {/* Article Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="prose prose-slate prose-invert prose-lg max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-12"
          >
            <h3 className="text-lg font-semibold mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blogs?tag=${encodeURIComponent(tag)}`}
                  className="px-3 py-1 bg-sky-900/40 text-sky-300 rounded-full text-sm hover:bg-sky-800/50 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Author Bio */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-12"
          >
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={blog.author.avatar}
                  alt={blog.author.name}
                  width={64}
                  height={64}
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{blog.author.name}</h3>
                <p className="text-slate-400 leading-relaxed">{blog.author.bio}</p>
                <Link
                  href={`/blogs/author/${encodeURIComponent(blog.author.name)}`}
                  className="inline-flex items-center text-sky-400 hover:text-sky-300 font-medium mt-3"
                >
                  View all posts by {blog.author.name} →
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Related Articles */}
          {relatedBlogs.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedBlogs.map((relatedBlog) => (
                  <Link
                    key={relatedBlog.id}
                    href={`/blogs/${relatedBlog.slug}`}
                    className="group bg-slate-900 border border-slate-800 rounded-lg overflow-hidden hover:border-slate-700 transition-colors"
                  >
                    <div className="aspect-video overflow-hidden">
                      <Image
                        src={relatedBlog.image}
                        alt={relatedBlog.title}
                        width={400}
                        height={200}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-2 group-hover:text-sky-400 transition-colors line-clamp-2">
                        {relatedBlog.title}
                      </h3>
                      <p className="text-slate-400 text-sm mb-3 line-clamp-2">
                        {relatedBlog.summary}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>{relatedBlog.readTime}</span>
                        <span>{formatDate(relatedBlog.publishedAt)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.section>
          )}
        </div>
      </main>
    </div>
  )
}
