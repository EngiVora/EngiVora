"use client"

import { useState } from "react"
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

interface Discount {
  id: number
  title: string
  code: string
  description: string
  type: string
  value: number
  minAmount: number
  maxDiscount: number
  status: string
  startDate: string
  endDate: string
  usageLimit: number
  usedCount: number
  applicableTo: string
  categories: string[]
  featured: boolean
  conditions: string
}

const mockDiscounts: Discount[] = [
  {
    id: 1,
    title: "Student Premium Access",
    code: "STUDENT50",
    description: "50% off on premium features for students",
    type: "Percentage",
    value: 50,
    minAmount: 0,
    maxDiscount: 1000,
    status: "Active",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    usageLimit: 1000,
    usedCount: 234,
    applicableTo: "All Users",
    categories: ["Premium", "Student"],
    featured: true,
    conditions: "Valid student ID required"
  },
  {
    id: 2,
    title: "New User Welcome",
    code: "WELCOME20",
    description: "20% off for new users on first purchase",
    type: "Percentage",
    value: 20,
    minAmount: 100,
    maxDiscount: 500,
    status: "Active",
    startDate: "2024-01-15",
    endDate: "2024-06-30",
    usageLimit: 500,
    usedCount: 89,
    applicableTo: "New Users",
    categories: ["Welcome", "New User"],
    featured: false,
    conditions: "First purchase only"
  },
  {
    id: 3,
    title: "Bulk Purchase Discount",
    code: "BULK100",
    description: "Flat ₹100 off on orders above ₹500",
    type: "Fixed",
    value: 100,
    minAmount: 500,
    maxDiscount: 100,
    status: "Active",
    startDate: "2024-02-01",
    endDate: "2024-03-31",
    usageLimit: 200,
    usedCount: 45,
    applicableTo: "All Users",
    categories: ["Bulk", "Purchase"],
    featured: false,
    conditions: "Minimum order value ₹500"
  },
  {
    id: 4,
    title: "Exam Prep Special",
    code: "EXAM30",
    description: "30% off on exam preparation materials",
    type: "Percentage",
    value: 30,
    minAmount: 200,
    maxDiscount: 300,
    status: "Scheduled",
    startDate: "2024-03-01",
    endDate: "2024-04-30",
    usageLimit: 300,
    usedCount: 0,
    applicableTo: "Students",
    categories: ["Exam", "Education"],
    featured: true,
    conditions: "Valid exam registration required"
  },
  {
    id: 5,
    title: "Referral Bonus",
    code: "REFER25",
    description: "₹25 credit for each successful referral",
    type: "Fixed",
    value: 25,
    minAmount: 0,
    maxDiscount: 25,
    status: "Expired",
    startDate: "2023-12-01",
    endDate: "2023-12-31",
    usageLimit: 1000,
    usedCount: 156,
    applicableTo: "All Users",
    categories: ["Referral", "Credit"],
    featured: false,
    conditions: "Referral must make a purchase"
  }
]

export function DiscountManagement() {
  const [discounts, setDiscounts] = useState(mockDiscounts)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedDiscounts, setSelectedDiscounts] = useState<number[]>([])

  const filteredDiscounts = discounts.filter(discount => {
    const matchesSearch = discount.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         discount.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         discount.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === "all" || discount.type === selectedType
    const matchesStatus = selectedStatus === "all" || discount.status === selectedStatus
    
    return matchesSearch && matchesType && matchesStatus
  })

  const handleSelectDiscount = (discountId: number) => {
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
        : filteredDiscounts.map(discount => discount.id)
    )
  }

  const handleDiscountAction = (discountId: number, action: string) => {
    console.log(`Action: ${action} for discount: ${discountId}`)
    // Implement discount actions here
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800"
      case "Scheduled": return "bg-blue-100 text-blue-800"
      case "Expired": return "bg-red-100 text-red-800"
      case "Paused": return "bg-yellow-100 text-yellow-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active": return <CheckCircle className="h-4 w-4" />
      case "Scheduled": return <Clock className="h-4 w-4" />
      case "Expired": return <AlertCircle className="h-4 w-4" />
      case "Paused": return <Lock className="h-4 w-4" />
      default: return <Lock className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Percentage": return "bg-blue-100 text-blue-800"
      case "Fixed": return "bg-green-100 text-green-800"
      case "Free Shipping": return "bg-purple-100 text-purple-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const isActive = (discount: Discount) => {
    const now = new Date()
    const start = new Date(discount.startDate)
    const end = new Date(discount.endDate)
    return now >= start && now <= end && discount.status === "Active"
  }

  const isExpired = (discount: Discount) => {
    const now = new Date()
    const end = new Date(discount.endDate)
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
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
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
                {discounts.filter(d => d.status === "Active").length}
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
                {discounts.reduce((sum, d) => sum + d.usedCount, 0)}
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
              <p className="text-sm font-medium text-gray-600">Total Savings</p>
              <p className="text-2xl font-bold text-gray-900">₹12,450</p>
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
              <option value="Percentage">Percentage</option>
              <option value="Fixed">Fixed Amount</option>
              <option value="Free Shipping">Free Shipping</option>
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Expired">Expired</option>
              <option value="Paused">Paused</option>
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
                  Usage
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
              {filteredDiscounts.map((discount) => (
                <tr key={discount.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedDiscounts.includes(discount.id)}
                      onChange={() => handleSelectDiscount(discount.id)}
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
                          {discount.categories.map((category, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {category}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(discount.type)}`}>
                      {discount.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="font-medium">
                        {discount.type === "Percentage" ? `${discount.value}%` : `₹${discount.value}`}
                      </div>
                      {discount.minAmount > 0 && (
                        <div className="text-xs text-gray-500">
                          Min: ₹{discount.minAmount}
                        </div>
                      )}
                      {discount.maxDiscount > 0 && (
                        <div className="text-xs text-gray-500">
                          Max: ₹{discount.maxDiscount}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(discount.status)}`}>
                      {getStatusIcon(discount.status)}
                      <span className="ml-1">{discount.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-gray-400 mr-1" />
                        {discount.usedCount} / {discount.usageLimit}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(discount.usedCount / discount.usageLimit) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                        {new Date(discount.startDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center mt-1">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                        {new Date(discount.endDate).toLocaleDateString()}
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
                        onClick={() => handleDiscountAction(discount.id, "view")}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDiscountAction(discount.id, "edit")}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDiscountAction(discount.id, "analytics")}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <TrendingUp className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDiscountAction(discount.id, "delete")}
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
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredDiscounts.length}</span> of{' '}
                <span className="font-medium">{filteredDiscounts.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  Previous
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  1
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

