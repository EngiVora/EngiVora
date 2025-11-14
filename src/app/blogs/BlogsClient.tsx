"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { EnhancedImage } from "@/components/enhanced-image";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Heart,
  Clock,
  Sparkles,
  TrendingUp,
} from "lucide-react";

interface Author {
  id: string;
  name: string;
  email: string;
  bio?: string;
  avatar: string;
}

interface Blog {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  tags: string[];
  author: Author;
  featured: boolean;
  published: boolean;
  views: number;
  likes: number;
  readTime?: string;
  publishedAt: string;
  updatedAt: string;
  image: string;
}

export default function BlogsClient() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [featuredBlogs, setFeaturedBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 6,
    hasNext: false,
    hasPrev: false,
  });

  const categories = ["technology", "career", "academic", "lifestyle", "news"];
  const trendingTags = [
    "AI",
    "Robotics",
    "Sustainability",
    "Career",
    "Portfolio",
    "Innovation",
    "Remote Work",
    "Interview Tips",
  ];

  // Mock authors data
  const topAuthors = [
    {
      id: "1",
      name: "Dr. Anya Sharma",
      specialty: "Sustainable Engineering",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAQH2T-U3EJFPoNgvpZesWbKFpcd0ZviQAiuAAXZ44awW7nVaxfA-0C07apDiIhXO7tFvlVOryALSZfFo-lHY1Y3XbBcgRPzj5ykTk6ZbZBA2PyQFktuivTFdq-nVk5UNUDRjxhQ6XNsNE8AH8-SHNGlYXPQoe4d5gAC7BKgK29eZvcojsf3jisD5ZSQgh8FHnFpHbRPRQ5sZcFQgGuHiYAj6BS0yu0bT8Y4k2OKqipf2VRZfn790A16s1wxn6O2bf8dympSkwc2Qc",
    },
    {
      id: "2",
      name: "Ethan Carter",
      specialty: "AI & Machine Learning",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA0vvKTNYw6JqrZIUX-5vsKMkrNYHedkd0oWVkwEmSN3dJcUUVRZzPIuTfETfeeV793L4tWpPjpxQyCIFXKrX55Tk3If1U1n5YKGoDpe_g3fZzpVpEkt8ew6EMvYJnIO-T8m8rVJLYM6x3dUKHt8Z9Dw6-OAD5owkRqLehipWsNX9qYlgy3CK7Hvk7_nVbgdysBv88xlCEIcQAOnp4xRY9Cdk-xqOyQHogGxy46i_YVwEJ9V9Z4Be0VCl2NaMyROiw8FB59NspvCZw",
    },
  ];

  // Fetch blogs with filtering and pagination
  const fetchBlogs = useCallback(
    async (page = 1, search = "", category = "", tag = "") => {
      setLoading(true);
      try {
        // Fetch blogs from API
        const queryParams = new URLSearchParams();
        if (page) queryParams.append('page', page.toString());
        if (search) queryParams.append('search', search);
        if (category) queryParams.append('category', category);
        if (tag) queryParams.append('tag', tag);
        queryParams.append('_t', Date.now().toString()); // Cache-busting timestamp

        const response = await fetch(`/api/blogs?${queryParams.toString()}`, {
          cache: 'no-store', // Disable caching
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
          },
        });
        const result = await response.json();

        if (result.success) {
          // Transform data to match expected format
          const transformedBlogs = result.data.map((blog: any) => {
            // Generate slug from title if slug is missing
            let slug = blog.slug;
            if (!slug && blog.title) {
              slug = blog.title
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .trim()
                .replace(/\s+/g, '-')
                .substring(0, 80);
            }
            // Fallback to ID if slug is still missing
            if (!slug && blog._id) {
              slug = blog._id.toString();
            }
            
            return {
              _id: blog._id,
              title: blog.title,
              slug: slug || 'untitled',
              summary: blog.summary,
              category: blog.category,
              tags: blog.tags,
              author: {
                id: blog.authorId || "1",
                name: "Admin",
                email: "admin@engivora.com",
                avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAQH2T-U3EJFPoNgvpZesWbKFpcd0ZviQAiuAAXZ44awW7nVaxfA-0C07apDiIhXO7tFvlVOryALSZfFo-lHY1Y3XbBcgRPzj5ykTk6ZbZBA2PyQFktuivTFdq-nVk5UNUDRjxhQ6XNsNE8AH8-SHNGlYXPQoe4d5gAC7BKgK29eZvcojsf3jisD5ZSQgh8FHnFpHbRPRQ5sZcFQgGuHiYAj6BS0yu0bT8Y4k2OKqipf2VRZfn790A16s1wxn6O2bf8dympSkwc2Qc"
              },
              featured: blog.featured,
              published: blog.published,
              views: blog.views,
              likes: blog.likes,
              readTime: `${Math.ceil(blog.content.length / 1000)} min read`,
              publishedAt: blog.createdAt,
              updatedAt: blog.updatedAt,
              image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAM2R9kE0qcg7_hHLAZXCfH_Tvh-TI6-usLUJjHNoWpYxZySmxzNOClDeEAywLvLItOAb3U1bDLnXwogGxZQelSU7Ri_ASP0EZjXoXYFoZPP_DIepczx07liojLkJYivHa4O9QBLB5iewgkJJxVlxi0diVPEMTqbwF7BdSa0Adq3LWIoSXU36tchdc0tXNnqSIx5oIus98gAaplRdOJ2qgrKyLlgTeejw-VWKAfHDrvbkTBveOi_ZWoPj1pzwhWj48L8jGcTErsPuo"
            };
          });

          setBlogs(transformedBlogs);
          setFeaturedBlogs(transformedBlogs.filter((blog: any) => blog.featured).slice(0, 2));
          setPagination({
            currentPage: result.pagination.currentPage,
            totalPages: result.pagination.totalPages,
            totalItems: result.pagination.totalItems,
            itemsPerPage: result.pagination.itemsPerPage,
            hasNext: result.pagination.hasNext,
            hasPrev: result.pagination.hasPrev,
          });
        } else {
          console.error("Failed to fetch blogs:", result.error);
          // Fallback to mock data if API fails
          setBlogs([]);
          setFeaturedBlogs([]);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
        // Fallback to mock data if API fails
        setBlogs([]);
        setFeaturedBlogs([]);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchBlogs(currentPage, searchQuery, selectedCategory, selectedTag);
  }, [currentPage, searchQuery, selectedCategory, selectedTag, fetchBlogs]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBlogs(1, searchQuery, selectedCategory, selectedTag);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category === selectedCategory ? "" : category);
    setCurrentPage(1);
  };

  const handleTagFilter = (tag: string) => {
    setSelectedTag(tag === selectedTag ? "" : tag);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedTag("");
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      technology: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      career: "bg-green-500/20 text-green-400 border-green-500/30",
      academic: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      lifestyle: "bg-pink-500/20 text-pink-400 border-pink-500/30",
      news: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    };
    return colors[category as keyof typeof colors] || colors.technology;
  };

  return (
    <div className="bg-slate-950 text-slate-100">
      <main className="px-6 sm:px-10 lg:px-24 xl:px-40 flex-1 py-12">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold leading-tight tracking-tighter mb-2"
            >
              Engivora Blogs
            </motion.h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              Stay updated with the latest insights and articles for engineering
              students.
            </p>

            {/* Search Bar */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              onSubmit={handleSearch}
              className="max-w-md mx-auto relative"
            >
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 bg-slate-900 border border-slate-700 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-sky-600 hover:bg-sky-700 px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
              >
                Search
              </button>
            </motion.form>

            {/* Filter Options */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 flex flex-wrap justify-center gap-4"
            >
              {/* Category Filters */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryFilter(category)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? "bg-sky-600 text-white"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>

              {(selectedCategory || selectedTag) && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-1 bg-red-600/20 text-red-400 border border-red-500/30 rounded-full text-sm font-medium hover:bg-red-600/30 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </motion.div>
          </div>

          <div className="grid grid-cols-12 gap-8">
            {/* Main Content */}
            <section className="col-span-12 lg:col-span-8 space-y-8">
              {/* Featured Articles */}
              {featuredBlogs.length > 0 && (
                <>
                  <h3 className="text-2xl font-bold leading-tight tracking-tighter mb-4">
                    Featured Articles
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {featuredBlogs.map((blog) => (
                      <Link
                        key={blog._id}
                        href={`/blogs/${blog.slug}`}
                        className="block"
                      >
                        <motion.article
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                          className="flex flex-col bg-slate-900 border border-slate-800 rounded-lg shadow-lg overflow-hidden group transition-all duration-300 hover:shadow-sky-500/20 hover:-translate-y-1 hover:border-sky-500/50 cursor-pointer h-full"
                        >
                          <div className="w-full h-48 overflow-hidden relative group">
                            <EnhancedImage
                              src={blog.image}
                              alt={blog.title}
                              type="blog"
                              fill
                              sizes="(min-width: 768px) 50vw, 100vw"
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                              overlayGradient={true}
                              showPattern={true}
                              featured={blog.featured}
                            />
                            {/* Gradient overlay for text readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none" />
                            
                            <div className="absolute top-4 left-4 z-20">
                              <span
                                className={`px-3 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md shadow-lg ${getCategoryColor(blog.category)}`}
                              >
                                {blog.category.charAt(0).toUpperCase() +
                                  blog.category.slice(1)}
                              </span>
                            </div>
                            
                            {/* Featured badge */}
                            {blog.featured && (
                              <div className="absolute top-4 right-4 z-20">
                                <div className="bg-gradient-to-r from-yellow-400/90 to-orange-400/90 backdrop-blur-md rounded-full px-3 py-1.5 text-xs font-bold text-black shadow-lg flex items-center gap-1.5 animate-pulse">
                                  <Sparkles className="w-3 h-3" />
                                  FEATURED
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="p-6 flex flex-col flex-grow">
                            <h3 className="text-lg font-bold leading-tight mb-2 group-hover:text-sky-400 transition-colors">
                              {blog.title}
                            </h3>
                            <p className="text-slate-400 text-sm leading-relaxed mb-4 flex-grow">
                              {blog.summary}
                            </p>

                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-2">
                                <Image
                                  src={blog.author.avatar}
                                  alt={blog.author.name}
                                  width={24}
                                  height={24}
                                  className="rounded-full"
                                />
                                <span className="text-sm text-slate-400">
                                  {blog.author.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 text-xs text-slate-500">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {blog.readTime}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Eye className="w-3 h-3" />
                                  {blog.views}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Heart className="w-3 h-3" />
                                  {blog.likes}
                                </span>
                              </div>
                            </div>

                            <span className="inline-flex items-center font-bold text-sky-400 text-sm group-hover:underline">
                              Read More <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                            </span>
                          </div>
                        </motion.article>
                      </Link>
                    ))}
                  </div>
                </>
              )}

              {/* Blog Listing */}
              <div className="mt-12">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold leading-tight tracking-tighter">
                    {selectedCategory || selectedTag
                      ? "Filtered Results"
                      : "Latest Posts"}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Filter className="w-4 h-4" />
                    {pagination.totalItems} articles found
                  </div>
                </div>

                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="bg-slate-900 border border-slate-800 rounded-lg p-6 animate-pulse"
                      >
                        <div className="aspect-video bg-slate-800 rounded mb-4"></div>
                        <div className="h-4 bg-slate-800 rounded mb-2"></div>
                        <div className="h-3 bg-slate-800 rounded mb-4 w-3/4"></div>
                        <div className="flex gap-2">
                          <div className="h-3 bg-slate-800 rounded w-16"></div>
                          <div className="h-3 bg-slate-800 rounded w-20"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : blogs.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="mb-4 text-slate-400">
                      <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      No articles found
                    </h3>
                    <p className="text-slate-400 mb-6">
                      Try adjusting your search terms or filters.
                    </p>
                    <button
                      onClick={clearFilters}
                      className="px-6 py-2 bg-sky-600 hover:bg-sky-700 rounded-lg font-medium transition-colors"
                    >
                      Clear All Filters
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {blogs.map((blog, index) => (
                        <Link
                          key={blog._id}
                          href={`/blogs/${blog.slug}`}
                          className="block"
                        >
                          <motion.article
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden hover:border-sky-500/50 hover:shadow-xl hover:shadow-sky-500/10 transition-all duration-300 group cursor-pointer h-full flex flex-col"
                          >
                          <div className="aspect-video overflow-hidden relative group">
                            <EnhancedImage
                              src={blog.image}
                              alt={blog.title}
                              type="blog"
                              fill
                              sizes="(min-width: 768px) 50vw, 100vw"
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                              overlayGradient={true}
                              showPattern={true}
                              featured={blog.featured}
                            />
                            {/* Gradient overlay for text readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none" />
                            
                            {/* Category badge */}
                            <div className="absolute top-4 left-4 z-20">
                              <span
                                className={`px-3 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md shadow-lg ${getCategoryColor(blog.category)}`}
                              >
                                {blog.category.charAt(0).toUpperCase() +
                                  blog.category.slice(1)}
                              </span>
                            </div>
                            
                            {/* Featured badge */}
                            {blog.featured && (
                              <div className="absolute top-4 right-4 z-20">
                                <div className="bg-gradient-to-r from-yellow-400/90 to-orange-400/90 backdrop-blur-md rounded-full px-3 py-1.5 text-xs font-bold text-black shadow-lg flex items-center gap-1.5 animate-pulse">
                                  <Sparkles className="w-3 h-3" />
                                  FEATURED
                                </div>
                              </div>
                            )}
                            
                            {/* View count badge */}
                            <div className="absolute bottom-4 left-4 z-20">
                              <div className="bg-black/70 backdrop-blur-md rounded-full px-3 py-1.5 text-xs font-medium text-white shadow-lg flex items-center gap-1.5">
                                <Eye className="w-3 h-3" />
                                <span>{blog.views || 0}</span>
                              </div>
                            </div>
                            
                            {/* Trending indicator for popular blogs */}
                            {blog.views > 1000 && (
                              <div className="absolute bottom-4 right-4 z-20">
                                <div className="bg-gradient-to-r from-red-500/90 to-orange-500/90 backdrop-blur-md rounded-full px-3 py-1.5 text-xs font-bold text-white shadow-lg flex items-center gap-1.5">
                                  <TrendingUp className="w-3 h-3" />
                                  <span>TRENDING</span>
                                </div>
                              </div>
                            )}
                            
                            {/* Animated sparkle effects for featured blogs */}
                            {blog.featured && (
                              <div className="absolute inset-0 pointer-events-none z-10">
                                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-75" style={{ animationDelay: '0s' }} />
                                <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-purple-300 rounded-full animate-ping opacity-75" style={{ animationDelay: '0.5s' }} />
                                <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-pink-400 rounded-full animate-ping opacity-75" style={{ animationDelay: '1s' }} />
                                <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-blue-300 rounded-full animate-ping opacity-75" style={{ animationDelay: '1.5s' }} />
                              </div>
                            )}
                          </div>

                            <div className="p-6 flex flex-col flex-grow">
                              <div className="flex items-center gap-2 mb-3">
                                <Image
                                  src={blog.author.avatar}
                                  alt={blog.author.name}
                                  width={20}
                                  height={20}
                                  className="rounded-full"
                                />
                                <span className="text-sm text-slate-400">
                                  {blog.author.name}
                                </span>
                                <span className="text-slate-600">•</span>
                                <span className="text-sm text-slate-400">
                                  {formatDate(blog.publishedAt)}
                                </span>
                              </div>

                              <h3 className="text-lg font-bold leading-tight mb-3 group-hover:text-sky-400 transition-colors line-clamp-2">
                                {blog.title}
                              </h3>

                              <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-2 flex-grow">
                                {blog.summary}
                              </p>

                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4 text-xs text-slate-500">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {blog.readTime}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Eye className="w-3 h-3" />
                                    {blog.views}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Heart className="w-3 h-3" />
                                    {blog.likes}
                                  </span>
                                </div>

                                <span className="text-sky-400 group-hover:text-sky-300 font-medium text-sm transition-colors inline-flex items-center gap-1">
                                  Read More
                                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </span>
                              </div>

                              <div className="mt-auto pt-4 border-t border-slate-800" onClick={(e) => e.stopPropagation()}>
                                <div className="flex flex-wrap gap-2">
                                  {blog.tags.slice(0, 3).map((tag) => (
                                    <button
                                      key={tag}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleTagFilter(tag);
                                      }}
                                      className={`px-2 py-1 rounded text-xs transition-colors ${
                                        selectedTag === tag
                                          ? "bg-sky-600/20 text-sky-400"
                                          : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                                      }`}
                                    >
                                      #{tag}
                                    </button>
                                  ))}
                                  {blog.tags.length > 3 && (
                                    <span className="px-2 py-1 text-xs text-slate-500">
                                      +{blog.tags.length - 3} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.article>
                        </Link>
                      ))}
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center justify-center mt-12 gap-4"
                      >
                        <button
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={!pagination.hasPrev}
                          className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          Previous
                        </button>

                        <div className="flex items-center gap-2">
                          {[...Array(Math.min(5, pagination.totalPages))].map(
                            (_, i) => {
                              const pageNum =
                                Math.max(
                                  1,
                                  Math.min(
                                    pagination.totalPages - 4,
                                    currentPage - 2,
                                  ),
                                ) + i;
                              return (
                                <button
                                  key={pageNum}
                                  onClick={() => setCurrentPage(pageNum)}
                                  className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                                    pageNum === currentPage
                                      ? "bg-sky-600 text-white"
                                      : "bg-slate-900 border border-slate-800 hover:bg-slate-800"
                                  }`}
                                >
                                  {pageNum}
                                </button>
                              );
                            },
                          )}
                        </div>

                        <button
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={!pagination.hasNext}
                          className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
                        >
                          Next
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </motion.div>
                    )}
                  </>
                )}
              </div>
            </section>

            {/* Sidebar */}
            <aside className="col-span-12 lg:col-span-4">
              <div className="sticky top-24 space-y-8">
                {/* Top Authors */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-slate-900 border border-slate-800 p-6 rounded-lg shadow-lg"
                >
                  <h3 className="text-xl font-bold mb-4">Top Authors</h3>
                  <div className="space-y-6">
                    {topAuthors.map((author) => (
                      <Link
                        key={author.id}
                        href={`/blogs/author/${author.id}`}
                        className="flex items-center gap-4 group"
                      >
                        <div className="w-16 h-16 rounded-full overflow-hidden shadow-md shrink-0">
                          <Image
                            src={author.avatar}
                            alt={author.name}
                            width={64}
                            height={64}
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-bold group-hover:text-sky-400 transition-colors">
                            {author.name}
                          </h4>
                          <p className="text-slate-400 text-sm">
                            {author.specialty}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>

                {/* Trending Topics */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-slate-900 border border-slate-800 p-6 rounded-lg shadow-lg"
                >
                  <h3 className="text-xl font-bold mb-4">Trending Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    {trendingTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleTagFilter(tag)}
                        className={`text-sm font-medium px-3 py-1 rounded-full transition-colors ${
                          selectedTag === tag
                            ? "bg-sky-600 text-white"
                            : "bg-sky-900/40 text-sky-300 hover:bg-sky-800/50"
                        }`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}