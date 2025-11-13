"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
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
  Clock,
  X
} from "lucide-react";

export function BlogManagement() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedBlogs, setSelectedBlogs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any>(null);
  const router = useRouter();

  // Form states
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [category, setCategory] = useState("technology");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState("draft");
  // Add image state
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Add image upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // For now, we'll just show a preview - in a real app, you would upload to a service
    // and get back a URL to store in the database
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      // In a real implementation, you would upload the file to a service here
      // and set the imageUrl to the returned URL
    };
    reader.readAsDataURL(file);
  };

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      // Get admin token from localStorage or sessionStorage
      const token = typeof window !== 'undefined' 
        ? (localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken'))
        : null
      
      if (!token) {
        // Redirect to login page if no token
        router.push('/admin/login')
        return
      }

      const params = new URLSearchParams()
      if (searchQuery) params.set('search', searchQuery)
      params.set('limit', '100') // Get more results
      params.set('_t', Date.now().toString()) // Cache-busting timestamp
      
      const res = await fetch(`/api/admin/blogs?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        },
        cache: 'no-store', // Disable caching
      })
      const data = await res.json()
      if (res.ok) {
        // Transform data to match expected format
        const transformedBlogs = data.data.map((blog: any) => ({
          _id: blog.blog_id,
          title: blog.title,
          content: blog.content,
          summary: blog.summary || blog.content.substring(0, 100) + '...',
          category: blog.category || 'technology', // Use category from API if available
          tags: blog.tags || [],
          published: blog.status === 'published',
          featured: blog.featured || false,
          views: blog.views || 0,
          createdAt: blog.createdAt,
          updatedAt: blog.updatedAt,
          source: blog.source || 'admin', // Track the source of the blog
          imageUrl: blog.imageUrl || null
        }))
        setBlogs(transformedBlogs || [])
      } else {
        console.error('Failed to fetch blogs:', data.error)
        // If unauthorized, redirect to login
        if (res.status === 401) {
          router.push('/admin/login')
        }
      }
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(fetchBlogs, 300)
    return () => clearTimeout(timeoutId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, router])

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog: any) => {
      const matchesCategory =
        selectedCategory === "all" || blog.category === selectedCategory;
      const matchesStatus =
        selectedStatus === "all" ||
        (blog.published ? "Published" : "Draft") === selectedStatus;
      return matchesCategory && matchesStatus;
    });
  }, [blogs, selectedCategory, selectedStatus]);

  const handleSelectBlog = (blogId: string) => {
    setSelectedBlogs((prev) =>
      prev.includes(blogId)
        ? prev.filter((id) => id !== blogId)
        : [...prev, blogId],
    );
  };

  const handleSelectAll = () => {
    setSelectedBlogs(
      selectedBlogs.length === filteredBlogs.length
        ? []
        : filteredBlogs.map((blog: any) => blog._id),
    );
  };

  const handleBlogAction = (blogId: string, action: string) => {
    const blog = blogs.find((b) => b._id === blogId);
    switch (action) {
      case 'view':
        // For now, we'll just log since there's no public view for admin blogs
        console.log('View blog:', blogId)
        break
      case 'edit':
        setEditingBlog(blog)
        // Populate form fields
        setTitle(blog.title)
        setContent(blog.content)
        setSummary(blog.summary || blog.content.substring(0, 100) + '...')
        setCategory(blog.category || 'technology')
        setTags(blog.tags?.join(', ') || '')
        setStatus(blog.published ? 'published' : 'draft')
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
        console.log(`Action: ${action} for blog: ${blogId}`);
    }
  };

  const handleDeleteBlog = async (blogId: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return
    
    const token = typeof window !== 'undefined' 
      ? (localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken'))
      : null
    
    if (!token) {
      router.push('/admin/login')
      return
    }
    
    setIsLoading(true)
    try {
      const res = await fetch(`/api/admin/blogs/${blogId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })
      
      if (!res.ok) {
        const data = await res.json()
        alert(data?.error || 'Failed to delete blog')
        // If unauthorized, redirect to login
        if (res.status === 401) {
          router.push('/admin/login')
        }
        return
      }
      
      // Refetch blogs from database to ensure data consistency
      await fetchBlogs()
      
      alert('Blog deleted successfully')
    } catch (e) {
      console.error('Error deleting blog:', e)
      alert('Network error deleting blog')
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePublish = async (blogId: string, shouldPublish: boolean) => {
    const token = typeof window !== 'undefined' 
      ? (localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken'))
      : null
    
    if (!token) {
      router.push('/admin/login')
      return
    }
    
    setIsLoading(true)
    try {
      const blog = blogs.find(b => b._id === blogId)
      if (!blog) return
      
      const res = await fetch(`/api/admin/blogs/${blogId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: blog.title,
          content: blog.content,
          tags: blog.tags,
          status: shouldPublish ? 'published' : 'draft'
        })
      })
      
      const data = await res.json()
      if (!res.ok) {
        alert(data?.error || 'Failed to update blog')
        // If unauthorized, redirect to login
        if (res.status === 401) {
          router.push('/admin/login')
        }
        return
      }
      
      // Refetch blogs from database to ensure data consistency
      await fetchBlogs()
      
      alert(`Blog ${shouldPublish ? 'published' : 'unpublished'} successfully`)
    } catch (e) {
      console.error('Error updating blog:', e)
      alert('Network error updating blog')
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBlog = async () => {
    const token = typeof window !== 'undefined' 
      ? (localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken'))
      : null
    
    if (!token) {
      router.push('/admin/login')
      return
    }
    
    // Validate form
    if (!title.trim()) {
      alert('Title is required')
      return
    }
    
    if (!content.trim()) {
      alert('Content is required')
      return
    }
    
    setIsLoading(true)
    try {
      const res = await fetch('/api/admin/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          content,
          tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          status,
          // Add imageUrl to the request
          imageUrl: imagePreview || imageUrl
        })
      })
      
      const data = await res.json()
      if (!res.ok) {
        alert(data?.error || 'Failed to create post')
        // If unauthorized, redirect to login
        if (res.status === 401) {
          router.push('/admin/login')
        }
        return
      }
      
      // Close modal and reset form
      setShowCreateModal(false)
      setTitle("")
      setContent("")
      setSummary("")
      setCategory("technology")
      setTags("")
      setStatus("draft")
      setImageUrl("")
      setImagePreview(null)
      
      // Refetch blogs from database to ensure data consistency
      await fetchBlogs()
      
      alert('Blog created successfully')
    } catch (e) {
      console.error('Error creating blog:', e)
      alert('Network error creating post')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateBlog = async () => {
    if (!editingBlog) return
    
    const token = typeof window !== 'undefined' 
      ? (localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken'))
      : null
    
    if (!token) {
      router.push('/admin/login')
      return
    }
    
    // Validate form
    if (!title.trim()) {
      alert('Title is required')
      return
    }
    
    if (!content.trim()) {
      alert('Content is required')
      return
    }
    
    setIsLoading(true)
    try {
      const res = await fetch(`/api/admin/blogs/${editingBlog._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          content,
          tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          status,
          // Add imageUrl to the request
          imageUrl: imagePreview || imageUrl || editingBlog.imageUrl
        })
      })
      
      const data = await res.json()
      if (!res.ok) {
        alert(data?.error || 'Failed to update post')
        // If unauthorized, redirect to login
        if (res.status === 401) {
          router.push('/admin/login')
        }
        return
      }
      
      // Close modal and reset
      setShowEditModal(false)
      setEditingBlog(null)
      setImagePreview(null)
      
      // Refetch blogs from database to ensure data consistency
      await fetchBlogs()
      
      alert('Blog updated successfully')
    } catch (e) {
      console.error('Error updating blog:', e)
      alert('Network error updating post')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "published": 
        return "bg-green-100 text-green-800"
      case "draft": 
        return "bg-yellow-100 text-yellow-800"
      case "archived":
        return "bg-gray-100 text-gray-800"
      default: 
        return "bg-gray-100 text-gray-800"
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "published": 
        return <Globe className="h-4 w-4" />
      case "draft": 
        return <Lock className="h-4 w-4" />
      case "archived":
        return <Lock className="h-4 w-4" />
      default: 
        return <Lock className="h-4 w-4" />
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
          <p className="text-gray-600">
            Manage blog posts, categories, and content
          </p>
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
                {blogs
                  .reduce(
                    (sum: number, blog: any) => sum + (blog.views || 0),
                    0,
                  )
                  .toLocaleString()}
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
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
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
                    checked={
                      selectedBlogs.length === filteredBlogs.length &&
                      filteredBlogs.length > 0
                    }
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
                          <h3 className="text-sm font-medium text-gray-900">
                            {blog.title}
                          </h3>
                          {blog.featured && (
                            <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Featured
                            </span>
                          )}
                          {blog.source === 'main' && (
                            <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              From Main Site
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {blog.summary}
                        </p>
                        <div className="flex items-center mt-2 space-x-2">
                          {(blog.tags || []).map(
                            (tag: string, index: number) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                              >
                                <Tag className="h-3 w-3 mr-1" />
                                {tag}
                              </span>
                            ),
                          )}
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
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(blog.published ? 'published' : 'draft')}`}>
                      {getStatusIcon(blog.published ? 'published' : 'draft')}
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
                      {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : 'N/A'}
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
        {filteredBlogs.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No blogs found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new blog post.</p>
            <div className="mt-6">
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </button>
            </div>
          </div>
        )}
        {/* Pagination simplified to counts from API */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">{filteredBlogs.length}</span> of{" "}
                <span className="font-medium">{blogs.length}</span> results
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Create Blog Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Create New Blog Post</h3>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="Enter blog title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={10}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="Enter blog content"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Summary</label>
                <input
                  type="text"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="Enter a brief summary"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="technology">Technology</option>
                  <option value="career">Career</option>
                  <option value="academic">Academic</option>
                  <option value="lifestyle">Lifestyle</option>
                  <option value="news">News</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Tags</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="Enter tags separated by commas"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Image</label>
                <div className="mt-1 flex items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                  />
                </div>
                {imagePreview && (
                  <div className="mt-2">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="h-32 w-32 object-cover rounded-md border"
                    />
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateBlog}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? "Creating..." : "Create Post"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Blog Modal */}
      {showEditModal && editingBlog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Edit Blog Post</h3>
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="Enter blog title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={10}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="Enter blog content"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Summary</label>
                <input
                  type="text"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="Enter a brief summary"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="technology">Technology</option>
                  <option value="career">Career</option>
                  <option value="academic">Academic</option>
                  <option value="lifestyle">Lifestyle</option>
                  <option value="news">News</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Tags</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="Enter tags separated by commas"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Image</label>
                <div className="mt-1 flex items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                  />
                </div>
                {imagePreview && (
                  <div className="mt-2">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="h-32 w-32 object-cover rounded-md border"
                    />
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateBlog}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? "Updating..." : "Update Post"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BlogManagement;