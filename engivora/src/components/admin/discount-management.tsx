"use client"

import { useState, useEffect, useCallback } from "react"
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  Percent,
  Tag,
  Users,
  Plus,
  Download,
  Upload,
  Globe,
  Lock,
  Clock,
  Star,
  TrendingUp,
  DollarSign,
  Target,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { cachedFetch, debounce } from "@/utils/api-cache"

interface Discount {
  _id: string
  code: string
  title: string
  description: string
  category: string
  discountType: string
  discountValue: number
  originalPrice: number
  discountedPrice: number
  provider: string
  websiteUrl: string
  imageUrl: string
  validFrom: string
  validUntil: string
  termsAndConditions: string[]
  eligibility: string[]
  maxUsage: number
  featured: boolean
  active: boolean
  percentage: number
  createdAt: string
  updatedAt: string
}

export function DiscountManagement() {
  const [discounts, setDiscounts] = useState<Discount[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedDiscounts, setSelectedDiscounts] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null)

  const itemsPerPage = 10

  const fetchDiscounts = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.set('search', searchQuery)
      if (selectedType !== "all") params.set('type', selectedType)
      if (selectedStatus !== "all") params.set('active', selectedStatus === "Active" ? "true" : "false")
      params.set('limit', itemsPerPage.toString())
      params.set('page', currentPage.toString())
      
      const token = typeof window !== 'undefined' ? 
        (localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken')) : null
      
      const res = await cachedFetch(`/api/discounts?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }, 300000) // 5 minutes cache
      
      const data = await res.json()
      if (res.ok) {
        setDiscounts(data.data || [])
        setTotalPages(data.pagination?.totalPages || 1)
      }
    } catch (error) {
      console.error('Failed to fetch discounts:', error)
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery, selectedType, selectedStatus, currentPage])

  const debouncedFetchDiscounts = useCallback(
    debounce(fetchDiscounts, 300),
    [fetchDiscounts]
  )

  useEffect(() => {
    debouncedFetchDiscounts()
  }, [debouncedFetchDiscounts])

  const handleCreateDiscount = async (discountData: any) => {
    const token = typeof window !== 'undefined' ? 
      (localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken')) : null
    
    if (!token) {
      alert('Not authenticated. Please login again.')
      return
    }
    
    setIsLoading(true)
    try {
      const res = await fetch('/api/discounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(discountData)
      })
      
      const data = await res.json()
      if (!res.ok) {
        alert(data?.error || 'Failed to create discount')
        return
      }
      
      setDiscounts(prev => [data.data, ...prev])
      setShowCreateModal(false)
    } catch (error) {
      console.error('Error creating discount:', error)
      alert('Network error creating discount')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditDiscount = async (discountId: string, discountData: any) => {
    const token = typeof window !== 'undefined' ? 
      (localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken')) : null
    
    if (!token) {
      alert('Not authenticated. Please login again.')
      return
    }
    
    setIsLoading(true)
    try {
      const res = await fetch(`/api/discounts/${discountId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(discountData)
      })
      
      const data = await res.json()
      if (!res.ok) {
        alert(data?.error || 'Failed to update discount')
        return
      }
      
      setDiscounts(prev => prev.map(discount => discount._id === discountId ? data.data : discount))
      setShowEditModal(false)
      setEditingDiscount(null)
    } catch (error) {
      console.error('Error updating discount:', error)
      alert('Network error updating discount')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteDiscount = async (discountId: string) => {
    if (!confirm('Are you sure you want to delete this discount?')) return
    
    const token = typeof window !== 'undefined' ? 
      (localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken')) : null
    
    if (!token) {
      alert('Not authenticated. Please login again.')
      return
    }
    
    setIsLoading(true)
    try {
      const res = await fetch(`/api/discounts/${discountId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })
      
      if (!res.ok) {
        const data = await res.json()
        alert(data?.error || 'Failed to delete discount')
        return
      }
      
      setDiscounts(prev => prev.filter(discount => discount._id !== discountId))
    } catch (error) {
      console.error('Error deleting discount:', error)
      alert('Network error deleting discount')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredDiscounts = discounts.filter(discount => {
    const matchesSearch = discount.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         discount.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         discount.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === "all" || discount.discountType === selectedType
    const matchesStatus = selectedStatus === "all" || (discount.active ? "Active" : "Inactive") === selectedStatus
    
    return matchesSearch && matchesType && matchesStatus
  })

  const handleSelectDiscount = (discountId: string) => {
    setSelectedDiscounts(prev => 
      prev.includes(discountId) 
        ? prev.filter(id => id !== discountId)
        : [...prev, discountId]
    )
  }

  const handleSelectAll = () => {
    setSelectedDiscounts(
      selectedDiscounts.length === filteredDiscounts.length 
        ? [] 
        : filteredDiscounts.map(discount => discount._id)
    )
  }

  const handleDiscountAction = (discountId: string, action: string) => {
    const discount = discounts.find(d => d._id === discountId)
    switch (action) {
      case 'view':
        // Navigate to discount details or open in new tab
        window.open(`/discounts/${discountId}`, '_blank')
        break
      case 'edit':
        setEditingDiscount(discount || null)
        setShowEditModal(true)
        break
      case 'delete':
        handleDeleteDiscount(discountId)
        break
      default:
        console.log(`Action: ${action} for discount: ${discountId}`)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800"
      case "Inactive": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active": return <CheckCircle className="h-4 w-4" />
      case "Inactive": return <AlertCircle className="h-4 w-4" />
      default: return <Lock className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "percentage": return "bg-blue-100 text-blue-800"
      case "fixed": return "bg-green-100 text-green-800"
      case "bogo": return "bg-purple-100 text-purple-800"
      case "free": return "bg-orange-100 text-orange-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const isActive = (discount: Discount) => {
    const now = new Date()
    const start = new Date(discount.validFrom)
    const end = new Date(discount.validUntil)
    return now >= start && now <= end && discount.active
  }

  const isExpired = (discount: Discount) => {
    const now = new Date()
    const end = new Date(discount.validUntil)
    return now > end
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Discount Management</h1>
          <p className="text-gray-600">Manage discount codes, coupons, and promotional offers</p>
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
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Create Discount
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-500">
              <Percent className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Discounts</p>
              <p className="text-2xl font-bold text-gray-900">{discounts.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-500">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">
                {discounts.filter(d => d.active).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-500">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Usage</p>
              <p className="text-2xl font-bold text-gray-900">
                {discounts.reduce((sum, d) => sum + (d.maxUsage || 0), 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-orange-500">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg. Discount</p>
              <p className="text-2xl font-bold text-gray-900">
                {discounts.length > 0 
                  ? Math.round(discounts.reduce((sum, d) => sum + d.discountValue, 0) / discounts.length) + '%' 
                  : '0%'}
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
                placeholder="Search discounts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Types</option>
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
              <option value="bogo">Buy One Get One</option>
              <option value="free">Free</option>
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            {selectedDiscounts.length > 0 && (
              <span className="text-sm text-gray-600">
                {selectedDiscounts.length} selected
              </span>
            )}
            <button className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Discounts Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedDiscounts.length === filteredDiscounts.length && filteredDiscounts.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Discount Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Validity
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 w-4 bg-gray-300 rounded"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-6 bg-gray-300 rounded w-20"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-6 bg-gray-300 rounded w-16"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-300 rounded w-24"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-300 rounded w-24"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <div className="h-4 w-4 bg-gray-300 rounded"></div>
                        <div className="h-4 w-4 bg-gray-300 rounded"></div>
                        <div className="h-4 w-4 bg-gray-300 rounded"></div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : filteredDiscounts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No discounts found
                  </td>
                </tr>
              ) : (
                filteredDiscounts.map((discount) => (
                  <tr key={discount._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedDiscounts.includes(discount._id)}
                        onChange={() => handleSelectDiscount(discount._id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h3 className="text-sm font-medium text-gray-900">{discount.title}</h3>
                            {discount.featured && (
                              <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                <Star className="h-3 w-3 mr-1" />
                                Featured
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{discount.description}</p>
                          <div className="flex items-center mt-2 space-x-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              <Tag className="h-3 w-3 mr-1" />
                              {discount.code}
                            </span>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {discount.provider}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(discount.discountType)}`}>
                        {discount.discountType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="font-medium">
                          {discount.discountType === "percentage" ? `${discount.discountValue}%` : `₹${discount.discountValue}`}
                        </div>
                        {discount.originalPrice > 0 && (
                          <div className="text-xs text-gray-500">
                            Original: ₹{discount.originalPrice}
                          </div>
                        )}
                        {discount.discountedPrice > 0 && (
                          <div className="text-xs text-gray-500">
                            Discounted: ₹{discount.discountedPrice}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(discount.active ? 'Active' : 'Inactive')}`}>
                        {getStatusIcon(discount.active ? 'Active' : 'Inactive')}
                        <span className="ml-1">{discount.active ? 'Active' : 'Inactive'}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                          {new Date(discount.validFrom).toLocaleDateString()}
                        </div>
                        <div className="flex items-center mt-1">
                          <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                          {new Date(discount.validUntil).toLocaleDateString()}
                        </div>
                        {isActive(discount) && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                            Active Now
                          </span>
                        )}
                        {isExpired(discount) && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mt-1">
                            Expired
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleDiscountAction(discount._id, "view")}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDiscountAction(discount._id, "edit")}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDiscountAction(discount._id, "delete")}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{filteredDiscounts.length}</span> of{' '}
                <span className="font-medium">{discounts.length}</span> results
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1 || isLoading}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages || isLoading}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Create Discount Modal */}
      {showCreateModal && (
        <DiscountModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateDiscount}
          isLoading={isLoading}
        />
      )}

      {/* Edit Discount Modal */}
      {showEditModal && editingDiscount && (
        <DiscountModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false)
            setEditingDiscount(null)
          }}
          onSubmit={(data) => handleEditDiscount(editingDiscount._id, data)}
          discount={editingDiscount}
          isLoading={isLoading}
        />
      )}
    </div>
  )
}

// Discount Modal Component
function DiscountModal({ isOpen, onClose, onSubmit, discount, isLoading }: {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  discount?: Discount | null
  isLoading: boolean
}) {
  const [formData, setFormData] = useState({
    title: discount?.title || '',
    description: discount?.description || '',
    category: discount?.category || 'courses',
    discountType: discount?.discountType || 'percentage',
    discountValue: discount?.discountValue || 0,
    originalPrice: discount?.originalPrice || 0,
    discountedPrice: discount?.discountedPrice || 0,
    couponCode: discount?.code || '',
    provider: discount?.provider || '',
    websiteUrl: discount?.websiteUrl || '',
    imageUrl: discount?.imageUrl || '',
    validFrom: discount?.validFrom ? new Date(discount.validFrom).toISOString().slice(0, 16) : '',
    validUntil: discount?.validUntil ? new Date(discount.validUntil).toISOString().slice(0, 16) : '',
    termsAndConditions: discount?.termsAndConditions?.join('\n') || '',
    eligibility: discount?.eligibility?.join('\n') || '',
    maxUsage: discount?.maxUsage || 100,
    featured: discount?.featured || false,
    isActive: discount?.active ?? true,
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters'
    }
    
    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters'
    }
    
    // Provider validation
    if (!formData.provider.trim()) {
      newErrors.provider = 'Provider is required'
    } else if (formData.provider.trim().length < 2) {
      newErrors.provider = 'Provider must be at least 2 characters'
    }
    
    // Website URL validation
    if (!formData.websiteUrl.trim()) {
      newErrors.websiteUrl = 'Website URL is required'
    } else if (!/^https?:\/\/.+$/.test(formData.websiteUrl)) {
      newErrors.websiteUrl = 'Invalid URL format'
    }
    
    // Date validation
    if (!formData.validFrom) {
      newErrors.validFrom = 'Valid from date is required'
    }
    
    if (!formData.validUntil) {
      newErrors.validUntil = 'Valid until date is required'
    }
    
    if (formData.validFrom && formData.validUntil && new Date(formData.validFrom) >= new Date(formData.validUntil)) {
      newErrors.validFrom = 'Valid from date must be before valid until date'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      // Convert multiline text to arrays
      const termsArray = formData.termsAndConditions.split('\n').filter(item => item.trim() !== '')
      const eligibilityArray = formData.eligibility.split('\n').filter(item => item.trim() !== '')
      
      const submitData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        discountType: formData.discountType,
        discountValue: formData.discountValue,
        originalPrice: formData.originalPrice,
        discountedPrice: formData.discountedPrice,
        couponCode: formData.couponCode,
        provider: formData.provider,
        websiteUrl: formData.websiteUrl,
        imageUrl: formData.imageUrl,
        validFrom: formData.validFrom,
        validUntil: formData.validUntil,
        termsAndConditions: termsArray,
        eligibility: eligibilityArray,
        maxUsage: formData.maxUsage,
        featured: formData.featured,
        isActive: formData.isActive,
      }
      
      onSubmit(submitData)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">{discount ? 'Edit Discount' : 'Create New Discount'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => {
                  setFormData({...formData, title: e.target.value})
                  if (errors.title) setErrors({...errors, title: ''})
                }}
                className={`mt-1 block w-full border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2`}
                placeholder="Enter discount title (min 3 characters)"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Coupon Code</label>
              <input
                type="text"
                value={formData.couponCode}
                onChange={(e) => setFormData({...formData, couponCode: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Enter coupon code"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description *</label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => {
                setFormData({...formData, description: e.target.value})
                if (errors.description) setErrors({...errors, description: ''})
              }}
              className={`mt-1 block w-full border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2`}
              placeholder="Enter discount description (min 10 characters)"
            />
            <div className="flex justify-between mt-1">
              <span className="text-sm text-gray-500">Characters: {formData.description.length}/10 minimum</span>
              {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="books">Books</option>
                <option value="software">Software</option>
                <option value="courses">Courses</option>
                <option value="hardware">Hardware</option>
                <option value="services">Services</option>
                <option value="events">Events</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Discount Type *</label>
              <select
                value={formData.discountType}
                onChange={(e) => setFormData({...formData, discountType: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
                <option value="bogo">Buy One Get One</option>
                <option value="free">Free</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Discount Value</label>
              <input
                type="number"
                min="0"
                value={formData.discountValue}
                onChange={(e) => setFormData({...formData, discountValue: Number(e.target.value)})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Enter discount value"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Original Price (₹)</label>
              <input
                type="number"
                min="0"
                value={formData.originalPrice}
                onChange={(e) => setFormData({...formData, originalPrice: Number(e.target.value)})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Enter original price"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Discounted Price (₹)</label>
              <input
                type="number"
                min="0"
                value={formData.discountedPrice}
                onChange={(e) => setFormData({...formData, discountedPrice: Number(e.target.value)})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Enter discounted price"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Max Usage</label>
              <input
                type="number"
                min="1"
                value={formData.maxUsage}
                onChange={(e) => setFormData({...formData, maxUsage: Number(e.target.value)})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Enter max usage"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Provider *</label>
              <input
                type="text"
                required
                value={formData.provider}
                onChange={(e) => {
                  setFormData({...formData, provider: e.target.value})
                  if (errors.provider) setErrors({...errors, provider: ''})
                }}
                className={`mt-1 block w-full border ${errors.provider ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2`}
                placeholder="Enter provider name (min 2 characters)"
              />
              {errors.provider && <p className="mt-1 text-sm text-red-600">{errors.provider}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Website URL *</label>
              <input
                type="url"
                required
                value={formData.websiteUrl}
                onChange={(e) => {
                  setFormData({...formData, websiteUrl: e.target.value})
                  if (errors.websiteUrl) setErrors({...errors, websiteUrl: ''})
                }}
                className={`mt-1 block w-full border ${errors.websiteUrl ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2`}
                placeholder="https://example.com"
              />
              {errors.websiteUrl && <p className="mt-1 text-sm text-red-600">{errors.websiteUrl}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Valid From *</label>
              <input
                type="datetime-local"
                required
                value={formData.validFrom}
                onChange={(e) => {
                  setFormData({...formData, validFrom: e.target.value})
                  if (errors.validFrom) setErrors({...errors, validFrom: ''})
                }}
                className={`mt-1 block w-full border ${errors.validFrom ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2`}
              />
              {errors.validFrom && <p className="mt-1 text-sm text-red-600">{errors.validFrom}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Valid Until *</label>
              <input
                type="datetime-local"
                required
                value={formData.validUntil}
                onChange={(e) => {
                  setFormData({...formData, validUntil: e.target.value})
                  if (errors.validUntil) setErrors({...errors, validUntil: ''})
                }}
                className={`mt-1 block w-full border ${errors.validUntil ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2`}
              />
              {errors.validUntil && <p className="mt-1 text-sm text-red-600">{errors.validUntil}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Terms & Conditions (one per line)</label>
            <textarea
              rows={3}
              value={formData.termsAndConditions}
              onChange={(e) => setFormData({...formData, termsAndConditions: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Enter terms and conditions, one per line"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Eligibility Criteria (one per line)</label>
            <textarea
              rows={2}
              value={formData.eligibility}
              onChange={(e) => setFormData({...formData, eligibility: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Enter eligibility criteria, one per line"
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                className="mr-2"
              />
              Featured
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                className="mr-2"
              />
              Active
            </label>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : (discount ? 'Update Discount' : 'Create Discount')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}