"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, ArrowLeft, Clock, Eye, Heart, Filter } from "lucide-react";

interface Author {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

interface Blog {
  id: string;
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

interface BlogCategoryClientProps {
  category: string;
}

export default function BlogCategoryClient({
  category,
}: BlogCategoryClientProps) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 9,
    hasNext: false,
    hasPrev: false,
  });

  const categoryInfo = {
    technology: {
      title: "Technology",
      description:
        "Explore the latest technological advances, innovations, and trends shaping the future of engineering.",
      icon: "💻",
      color: "blue",
    },
    career: {
      title: "Career",
      description:
        "Professional development, job search strategies, and career advancement tips for engineers.",
      icon: "🚀",
      color: "green",
    },
    academic: {
      title: "Academic",
      description:
        "Study guides, research insights, and academic resources for engineering students.",
      icon: "📚",
      color: "purple",
    },
    lifestyle: {
      title: "Lifestyle",
      description:
        "Work-life balance, wellness, and personal development for engineering professionals.",
      icon: "🌱",
      color: "pink",
    },
    news: {
      title: "News",
      description:
        "Latest news and updates from the engineering industry and academia.",
      icon: "📰",
      color: "orange",
    },
  };

  const currentCategory = categoryInfo[category as keyof typeof categoryInfo];

  // Generate mock blog data filtered by category
  const generateMockBlogs = (): Blog[] => {
    const allBlogs = [
      {
        id: "1",
        title: "The Future of Engineering: Trends and Innovations",
        slug: "future-of-engineering-trends-innovations",
        summary:
          "Explore the emerging trends and innovations shaping the future of engineering, from AI and robotics to sustainable technologies.",
        category: "technology",
        tags: ["AI", "Future Tech", "Innovation", "Sustainability"],
        author: {
          id: "1",
          name: "Dr. Anya Sharma",
          email: "anya.sharma@engivora.com",
          avatar:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuAQH2T-U3EJFPoNgvpZesWbKFpcd0ZviQAiuAAXZ44awW7nVaxfA-0C07apDiIhXO7tFvlVOryALSZfFo-lHY1Y3XbBcgRPzj5ykTk6ZbZBA2PyQFktuivTFdq-nVk5UNUDRjxhQ6XNsNE8AH8-SHNGlYXPQoe4d5gAC7BKgK29eZvcojsf3jisD5ZSQgh8FHnFpHbRPRQ5sZcFQgGuHiYAj6BS0yu0bT8Y4k2OKqipf2VRZfn790A16s1wxn6O2bf8dympSkwc2Qc",
        },
        featured: true,
        published: true,
        views: 1250,
        likes: 89,
        readTime: "8 min read",
        publishedAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-20T15:30:00Z",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuAM2R9kE0qcg7_hHLAZXCfH_Tvh-TI6-usLUJjHNoWpYxZySmxzNOClDeEAywLvLItOAb3U1bDLnXwogGxZQelSU7Ri_ASP0EZjXoXYFoZPP_DIepczx07liojLkJYivHa4O9QBLB5iewgkJJxVlxi0diVPEMTqbwF7BdSa0Adq3LWIoSXU36tchdc0tXNnqSIx5oIus98gAaplRdOJ2qgrKyLlgTeejw-VWKAfHDrvbkTBveOi_ZWoPj1pzwhWj48L8jGcTErsPuo",
      },
      {
        id: "2",
        title: "Mastering Engineering Interviews: Tips and Strategies",
        slug: "mastering-engineering-interviews-tips-strategies",
        summary:
          "Ace your engineering interviews with expert tips and strategies, including common questions, preparation techniques, and follow-up advice.",
        category: "career",
        tags: [
          "Interviews",
          "Career Tips",
          "Job Search",
          "Professional Development",
        ],
        author: {
          id: "2",
          name: "Ethan Carter",
          email: "ethan.carter@engivora.com",
          avatar:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuA0vvKTNYw6JqrZIUX-5vsKMkrNYHedkd0oWVkwEmSN3dJcUUVRZzPIuTfETfeeV793L4tWpPjpxQyCIFXKrX55Tk3If1U1n5YKGoDpe_g3fZzpVpEkt8ew6EMvYJnIO-T8m8rVJLYM6x3dUKHt8Z9Dw6-OAD5owkRqLehipWsNX9qYlgy3CK7Hvk7_nVbgdysBv88xlCEIcQAOnp4xRY9Cdk-xqOyQHogGxy46i_YVwEJ9V9Z4Be0VCl2NaMyROiw8FB59NspvCZw",
        },
        featured: true,
        published: true,
        views: 980,
        likes: 67,
        readTime: "6 min read",
        publishedAt: "2024-01-10T08:30:00Z",
        updatedAt: "2024-01-10T08:30:00Z",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBx8jPX4p2Z0x0TOI7gGFRTZsMD4gY2PdsUyCPRyQrlqW-wwDmKMkIlRM-H_pXaKn_A3OJsabnVntUrVBiYEeunowE99LUUeuIJMW1p3v6fN34WEkLXHYWSAeZFiTBdlx802s2NuZdVuw54lGYJTtdS6nr9zBn_ZF_w4osZgbgnqHR2PP8eolniIDMuHrDTI810fbHHFp7jdMl0k0MbZ9JwGE0mLGO4WgQUPOgMRSAXWwX3Bd_ndeoJFr0yuH8-k5veNPjAIX04ork",
      },
      {
        id: "3",
        title: "Building Your Engineering Portfolio: Projects and Experiences",
        slug: "building-engineering-portfolio-projects-experiences",
        summary:
          "Learn how to build a strong engineering portfolio with impactful projects that showcase your skills and attract employers.",
        category: "career",
        tags: [
          "Portfolio",
          "Career Development",
          "Projects",
          "Professional Growth",
        ],
        author: {
          id: "1",
          name: "Dr. Anya Sharma",
          email: "anya.sharma@engivora.com",
          avatar:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuAQH2T-U3EJFPoNgvpZesWbKFpcd0ZviQAiuAAXZ44awW7nVaxfA-0C07apDiIhXO7tFvlVOryALSZfFo-lHY1Y3XbBcgRPzj5ykTk6ZbZBA2PyQFktuivTFdq-nVk5UNUDRjxhQ6XNsNE8AH8-SHNGlYXPQoe4d5gAC7BKgK29eZvcojsf3jisD5ZSQgh8FHnFpHbRPRQ5sZcFQgGuHiYAj6BS0yu0bT8Y4k2OKqipf2VRZfn790A16s1wxn6O2bf8dympSkwc2Qc",
        },
        featured: false,
        published: true,
        views: 750,
        likes: 45,
        readTime: "5 min read",
        publishedAt: "2024-01-08T14:15:00Z",
        updatedAt: "2024-01-08T14:15:00Z",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuC89Jwy3WaNxRBUQGonAzRjURd0j_lrh6coI5TuaTU_HfbJs3Rryhcx5H4pCoPByXtwkSJa_SorEoCEq5QxvK6l_sMrz0Ctzge8WGVyodeYene5tUT_PEdGqu4bhm5-u_AopmRonSAhO6XSD3IpG9bM7EgKGPwBWMy8M5RIL5fcU97B7muy0L_hT-tw83iPLgNppYQtshmyfBV4w5cI9LkuYGcla_0syf1I8Ws4ToLAI2aLzO5T0NMPxNcqpqi44CbMvKVParWPVqA",
      },
      {
        id: "6",
        title: "Emerging Technologies in Civil Engineering",
        slug: "emerging-technologies-civil-engineering",
        summary:
          "Explore the latest technological innovations transforming the civil engineering industry.",
        category: "technology",
        tags: ["Civil Engineering", "Innovation", "Construction Tech"],
        author: {
          id: "2",
          name: "Ethan Carter",
          email: "ethan.carter@engivora.com",
          avatar:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuA0vvKTNYw6JqrZIUX-5vsKMkrNYHedkd0oWVkwEmSN3dJcUUVRZzPIuTfETfeeV793L4tWpPjpxQyCIFXKrX55Tk3If1U1n5YKGoDpe_g3fZzpVpEkt8ew6EMvYJnIO-T8m8rVJLYM6x3dUKHt8Z9Dw6-OAD5owkRqLehipWsNX9qYlgy3CK7Hvk7_nVbgdysBv88xlCEIcQAOnp4xRY9Cdk-xqOyQHogGxy46i_YVwEJ9V9Z4Be0VCl2NaMyROiw8FB59NspvCZw",
        },
        featured: false,
        published: true,
        views: 430,
        likes: 22,
        readTime: "6 min read",
        publishedAt: "2024-01-01T16:30:00Z",
        updatedAt: "2024-01-01T16:30:00Z",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuAM2R9kE0qcg7_hHLAZXCfH_Tvh-TI6-usLUJjHNoWpYxZySmxzNOClDeEAywLvLItOAb3U1bDLnXwogGxZQelSU7Ri_ASP0EZjXoXYFoZPP_DIepczx07liojLkJYivHa4O9QBLB5iewgkJJxVlxi0diVPEMTqbwF7BdSa0Adq3LWIoSXU36tchdc0tXNnqSIx5oIus98gAaplRdOJ2qgrKyLlgTeejw-VWKAfHDrvbkTBveOi_ZWoPj1pzwhWj48L8jGcTErsPuo",
      },
      {
        id: "7",
        title: "Machine Learning in Structural Engineering",
        slug: "machine-learning-structural-engineering",
        summary:
          "How machine learning is revolutionizing structural analysis and design in civil engineering.",
        category: "technology",
        tags: ["Machine Learning", "Structural Engineering", "AI"],
        author: {
          id: "1",
          name: "Dr. Anya Sharma",
          email: "anya.sharma@engivora.com",
          avatar:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuAQH2T-U3EJFPoNgvpZesWbKFpcd0ZviQAiuAAXZ44awW7nVaxfA-0C07apDiIhXO7tFvlVOryALSZfFo-lHY1Y3XbBcgRPzj5ykTk6ZbZBA2PyQFktuivTFdq-nVk5UNUDRjxhQ6XNsNE8AH8-SHNGlYXPQoe4d5gAC7BKgK29eZvcojsf3jisD5ZSQgh8FHnFpHbRPRQ5sZcFQgGuHiYAj6BS0yu0bT8Y4k2OKqipf2VRZfn790A16s1wxn6O2bf8dympSkwc2Qc",
        },
        featured: false,
        published: true,
        views: 680,
        likes: 34,
        readTime: "7 min read",
        publishedAt: "2024-01-12T09:15:00Z",
        updatedAt: "2024-01-12T09:15:00Z",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuAM2R9kE0qcg7_hHLAZXCfH_Tvh-TI6-usLUJjHNoWpYxZySmxzNOClDeEAywLvLItOAb3U1bDLnXwogGxZQelSU7Ri_ASP0EZjXoXYFoZPP_DIepczx07liojLkJYivHa4O9QBLB5iewgkJJxVlxi0diVPEMTqbwF7BdSa0Adq3LWIoSXU36tchdc0tXNnqSIx5oIus98gAaplRdOJ2qgrKyLlgTeejw-VWKAfHDrvbkTBveOi_ZWoPj1pzwhWj48L8jGcTErsPuo",
      },
      {
        id: "8",
        title: "Engineering Leadership: From Technical Expert to Team Lead",
        slug: "engineering-leadership-technical-expert-team-lead",
        summary:
          "Transition from individual contributor to engineering leader with these essential leadership skills and strategies.",
        category: "career",
        tags: ["Leadership", "Management", "Career Growth", "Team Building"],
        author: {
          id: "2",
          name: "Ethan Carter",
          email: "ethan.carter@engivora.com",
          avatar:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuA0vvKTNYw6JqrZIUX-5vsKMkrNYHedkd0oWVkwEmSN3dJcUUVRZzPIuTfETfeeV793L4tWpPjpxQyCIFXKrX55Tk3If1U1n5YKGoDpe_g3fZzpVpEkt8ew6EMvYJnIO-T8m8rVJLYM6x3dUKHt8Z9Dw6-OAD5owkRqLehipWsNX9qYlgy3CK7Hvk7_nVbgdysBv88xlCEIcQAOnp4xRY9Cdk-xqOyQHogGxy46i_YVwEJ9V9Z4Be0VCl2NaMyROiw8FB59NspvCZw",
        },
        featured: false,
        published: true,
        views: 540,
        likes: 31,
        readTime: "8 min read",
        publishedAt: "2024-01-06T13:20:00Z",
        updatedAt: "2024-01-06T13:20:00Z",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBx8jPX4p2Z0x0TOI7gGFRTZsMD4gY2PdsUyCPRyQrlqW-wwDmKMkIlRM-H_pXaKn_A3OJsabnVntUrVBiYEeunowE99LUUeuIJMW1p3v6fN34WEkLXHYWSAeZFiTBdlx802s2NuZdVuw54lGYJTtdS6nr9zBn_ZF_w4osZgbgnqHR2PP8eolniIDMuHrDTI810fbHHFp7jdMl0k0MbZ9JwGE0mLGO4WgQUPOgMRSAXWwX3Bd_ndeoJFr0yuH8-k5veNPjAIX04ork",
      },
    ];

    return allBlogs.filter((blog) => blog.category === category);
  };

  // Fetch blogs for the specific category
  const fetchBlogs = async (page = 1, search = "") => {
    setLoading(true);
    try {
      let filteredBlogs = generateMockBlogs();

      if (search) {
        filteredBlogs = filteredBlogs.filter(
          (blog) =>
            blog.title.toLowerCase().includes(search.toLowerCase()) ||
            blog.summary.toLowerCase().includes(search.toLowerCase()) ||
            blog.tags.some((tag) =>
              tag.toLowerCase().includes(search.toLowerCase()),
            ),
        );
      }

      // Simulate pagination
      const itemsPerPage = 9;
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedBlogs = filteredBlogs.slice(startIndex, endIndex);

      setBlogs(paginatedBlogs);
      setPagination({
        currentPage: page,
        totalPages: Math.ceil(filteredBlogs.length / itemsPerPage),
        totalItems: filteredBlogs.length,
        itemsPerPage,
        hasNext: endIndex < filteredBlogs.length,
        hasPrev: page > 1,
      });
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(currentPage, searchQuery);
  }, [currentPage, searchQuery, category]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBlogs(1, searchQuery);
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
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      <main className="px-6 sm:px-10 lg:px-24 xl:px-40 flex-1 py-12">
        <div className="mx-auto max-w-7xl">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-sky-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to All Blogs
            </Link>
          </motion.div>

          {/* Category Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center mb-16"
          >
            <div className="mb-4">
              <span className="text-6xl mb-4 block">
                {currentCategory?.icon}
              </span>
              <span
                className={`inline-block px-4 py-2 rounded-full text-sm font-medium border ${getCategoryColor(category)}`}
              >
                {currentCategory?.title}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              {currentCategory?.title} Articles
            </h1>

            <p className="text-slate-400 text-lg leading-relaxed max-w-3xl mx-auto mb-8">
              {currentCategory?.description}
            </p>

            {/* Search Bar */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onSubmit={handleSearch}
              className="max-w-md mx-auto relative"
            >
              <input
                type="text"
                placeholder={`Search ${currentCategory?.title.toLowerCase()} articles...`}
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
          </motion.div>

          {/* Results Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center gap-2 text-slate-400">
              <Filter className="w-4 h-4" />
              <span>
                {pagination.totalItems} {currentCategory?.title.toLowerCase()}{" "}
                articles found
              </span>
            </div>
          </motion.div>

          {/* Blog Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(9)].map((_, i) => (
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center py-12"
            >
              <div className="mb-4 text-slate-400">
                <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No articles found</h3>
              <p className="text-slate-400 mb-6">
                {searchQuery
                  ? `No ${currentCategory?.title.toLowerCase()} articles match "${searchQuery}".`
                  : `No ${currentCategory?.title.toLowerCase()} articles are available yet.`}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="px-6 py-2 bg-sky-600 hover:bg-sky-700 rounded-lg font-medium transition-colors"
                >
                  Clear Search
                </button>
              )}
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog, index) => (
                <Link
                  key={blog.id}
                  href={`/blogs/${blog.slug}`}
                  className="block"
                >
                  <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden hover:border-sky-500/50 hover:shadow-xl hover:shadow-sky-500/10 transition-all duration-300 group cursor-pointer h-full flex flex-col"
                  >
                    <div className="aspect-video overflow-hidden relative">
                      <Image
                        src={blog.image}
                        alt={blog.title}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {blog.featured && (
                        <div className="absolute top-4 left-4">
                          <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-2 py-1 rounded-full text-xs font-medium">
                            Featured
                          </span>
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

                      <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3 flex-grow">
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

                      <div className="mt-auto pt-4 border-t border-slate-800">
                        <div className="flex flex-wrap gap-2">
                          {blog.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-slate-800 text-slate-400 rounded text-xs"
                            >
                              #{tag}
                            </span>
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
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-center justify-center mt-12 gap-4"
            >
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={!pagination.hasPrev}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>

              <div className="flex items-center gap-2">
                {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                  const pageNum =
                    Math.max(
                      1,
                      Math.min(pagination.totalPages - 4, currentPage - 2),
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
                })}
              </div>

              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={!pagination.hasNext}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
              >
                Next
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </button>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
