"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  User,
  Tag,
  TrendingUp,
  MessageSquare,
  Plus,
  Download,
  Upload,
  Globe,
  Lock,
  Clock
} from "lucide-react"

export function BlogManagement() {
  const [blogs, setBlogs] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedBlogs, setSelectedBlogs] = useState<string[]>([])

  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true)
      try {
        const params = new URLSearchParams()
        if (searchQuery) params.set('search', searchQuery)
        params.set('limit', '20') // Limit results for better performance
        
        const res = await fetch(`/api/blogs?${params.toString()}`)
        const data = await res.json()
        if (res.ok) setBlogs(data.data || [])
      } catch (error) {
        console.error('Failed to fetch blogs:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    // Debounce search
    const timeoutId = setTimeout(fetchBlogs, 300)
    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog: any) => {
      const matchesCategory = selectedCategory === "all" || blog.category === selectedCategory
      const matchesStatus = selectedStatus === "all" || (blog.published ? "Published" : "Draft") === selectedStatus
      return matchesCategory && matchesStatus
    })
  }, [blogs, selectedCategory, selectedStatus])

  const handleSelectBlog = (blogId: string) => {
    setSelectedBlogs(prev => 
      prev.includes(blogId) 
        ? prev.filter(id => id !== blogId)
        : [...prev, blogId]
    )
  }

  const handleSelectAll = () => {
    setSelectedBlogs(
      selectedBlogs.length === filteredBlogs.length 
        ? [] 
        : filteredBlogs.map((blog: any) => blog._id)
    )
  }

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingBlog, setEditingBlog] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleBlogAction = (blogId: string, action: string) => {
    const blog = blogs.find(b => b._id === blogId)
    switch (action) {
      case 'view':
        window.open(`/blogs/${blogId}`, '_blank')
        break
      case 'edit':
        setEditingBlog(blog)
        setShowEditModal(true)
        break
      case 'delete':
        handleDeleteBlog(blogId)
        break
      case 'publish':
        handleTogglePublish(blogId, true)
        break
      case 'unpublish':
        handleTogglePublish(blogId, false)
        break
      default:
        console.log(`Action: ${action} for blog: ${blogId}`)
    }
  }

  const handleDeleteBlog = async (blogId: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return
    
    const token = (typeof window !== 'undefined') ? (localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken')) : null
    if (!token) {
      alert('Not authenticated. Please login again.')
      return
    }
    setIsLoading(true)
    try {
      const res = await fetch(`/api/blogs/${blogId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })
      if (!res.ok) {
        const data = await res.json()
        alert(data?.error || 'Failed to delete blog')
        return
      }
      setBlogs(prev => prev.filter(blog => blog._id !== blogId))
    } catch (e) {
      alert('Network error deleting blog')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTogglePublish = async (blogId: string, published: boolean) => {
    const token = (typeof window !== 'undefined') ? (localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken')) : null
    if (!token) {
      alert('Not authenticated. Please login again.')
      return
    }
    setIsLoading(true)
    try {
      const res = await fetch(`/api/blogs/${blogId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ published })
      })
      const data = await res.json()
      if (!res.ok) {
        alert(data?.error || 'Failed to update blog')
        return
      }
      setBlogs(prev => prev.map(blog => blog._id === blogId ? data.data : blog))
    } catch (e) {
      alert('Network error updating blog')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Published": return "bg-green-100 text-green-800"
      case "Draft": return "bg-yellow-100 text-yellow-800"
      case "Scheduled": return "bg-blue-100 text-blue-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Published": return <Globe className="h-4 w-4" />
      case "Draft": return <Lock className="h-4 w-4" />
      case "Scheduled": return <Clock className="h-4 w-4" />
      default: return <Lock className="h-4 w-4" />
    }
  }

  const handleCreatePost = async () => {
    const title = prompt('Enter blog title:') || ''
    if (!title.trim()) return
    const summary = prompt('Enter a short summary (min 20 chars):') || ''
    if (summary.trim().length < 20) return
    const category = prompt('Enter category (technology|career|academic|lifestyle|news):') || 'technology'
    const content = (prompt('Enter content (min 50 chars):') || '').padEnd(50, ' .')
    const token = (typeof window !== 'undefined') ? (localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken')) : null
    if (!token) {
      alert('Not authenticated. Please login again.')
      return
    }
    try {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, summary, content, category, tags: [] })
      })
      const data = await res.json()
      if (!res.ok) {
        alert(data?.error || 'Failed to create post')
        return
      }
      setBlogs(prev => [data.data, ...prev])
    } catch (e) {
      alert('Network error creating post')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
          <p className="text-gray-600">Manage blog posts, categories, and content</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </button>
          <button 
            onClick={() => setShowCreateModal(true)} 
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-500">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Posts</p>
              <p className="text-2xl font-bold text-gray-900">{blogs.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-500">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Published</p>
              <p className="text-2xl font-bold text-gray-900">
                {blogs.filter((b: any) => b.published).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-yellow-500">
              <Lock className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Drafts</p>
              <p className="text-2xl font-bold text-gray-900">
                {blogs.filter((b: any) => !b.published).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-500">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">
                {blogs.reduce((sum: number, blog: any) => sum + (blog.views || 0), 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search blog posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                aria-label="Search blog posts"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              aria-label="Filter by category"
            >
              <option value="all">All Categories</option>
              <option value="technology">Technology</option>
              <option value="career">Career</option>
              <option value="academic">Academic</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="news">News</option>
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              aria-label="Filter by status"
            >
              <option value="all">All Status</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            {selectedBlogs.length > 0 && (
              <span className="text-sm text-gray-600">
                {selectedBlogs.length} selected
              </span>
            )}
            <button className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Blogs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedBlogs.length === filteredBlogs.length && filteredBlogs.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    aria-label="Select all blog posts"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Post
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stats
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBlogs.map((blog: any) => (
                <tr key={blog._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedBlogs.includes(blog._id)}
                      onChange={() => handleSelectBlog(blog._id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      aria-label={`Select blog post ${blog.title}`}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h3 className="text-sm font-medium text-gray-900">{blog.title}</h3>
                          {blog.featured && (
                            <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Featured
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{blog.summary}</p>
                        <div className="flex items-center mt-2 space-x-2">
                          {(blog.tags || []).map((tag: string, index: number) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              <Tag className="h-3 w-3 mr-1" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {blog.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(blog.published ? 'Published' : 'Draft')}`}>
                      {getStatusIcon(blog.published ? 'Published' : 'Draft')}
                      <span className="ml-1">{blog.published ? 'Published' : 'Draft'}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 text-gray-400 mr-1" />
                        {(blog.views || 0).toLocaleString()}
                      </div>
                      <div className="flex items-center mt-1">
                        <MessageSquare className="h-4 w-4 text-gray-400 mr-1" />
                        {0}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleBlogAction(blog._id, "view")}
                        className="text-gray-400 hover:text-gray-600"
                        aria-label="View blog post"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleBlogAction(blog._id, "edit")}
                        className="text-gray-400 hover:text-gray-600"
                        aria-label="Edit blog post"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleBlogAction(blog._id, "delete")}
                        className="text-gray-400 hover:text-red-600"
                        aria-label="Delete blog post"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button 
                        className="text-gray-400 hover:text-gray-600"
                        aria-label="More options"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination simplified to counts from API */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{filteredBlogs.length}</span> of{' '}
                <span className="font-medium">{blogs.length}</span> results
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
