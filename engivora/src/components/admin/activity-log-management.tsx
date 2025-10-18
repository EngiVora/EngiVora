"use client"

import { useState } from "react"
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Download,
  User,
  Activity,
  Clock,
  MapPin,
  Monitor,
  Smartphone,
  Globe,
  AlertTriangle,
  CheckCircle,
  Info,
  XCircle
} from "lucide-react"

const mockActivityLogs = [
  {
    id: 1,
    timestamp: "2024-01-15 10:30:15",
    user: "John Doe",
    email: "john.doe@example.com",
    action: "Login",
    resource: "Admin Dashboard",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    device: "Desktop",
    location: "New York, US",
    status: "Success",
    details: "User logged in successfully"
  },
  {
    id: 2,
    timestamp: "2024-01-15 10:25:42",
    user: "Jane Smith",
    email: "jane.smith@example.com",
    action: "Create",
    resource: "Blog Post",
    ipAddress: "192.168.1.101",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    device: "Desktop",
    location: "San Francisco, US",
    status: "Success",
    details: "Created new blog post: 'Getting Started with React'"
  },
  {
    id: 3,
    timestamp: "2024-01-15 10:20:18",
    user: "Mike Johnson",
    email: "mike.johnson@example.com",
    action: "Update",
    resource: "User Profile",
    ipAddress: "192.168.1.102",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15",
    device: "Mobile",
    location: "Chicago, US",
    status: "Success",
    details: "Updated profile information"
  },
  {
    id: 4,
    timestamp: "2024-01-15 10:15:33",
    user: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    action: "Delete",
    resource: "Exam",
    ipAddress: "192.168.1.103",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    device: "Desktop",
    location: "Boston, US",
    status: "Failed",
    details: "Failed to delete exam: Insufficient permissions"
  },
  {
    id: 5,
    timestamp: "2024-01-15 10:10:55",
    user: "David Brown",
    email: "david.brown@example.com",
    action: "Download",
    resource: "Course Material",
    ipAddress: "192.168.1.104",
    userAgent: "Mozilla/5.0 (Android 11; Mobile; rv:68.0) Gecko/68.0 Firefox/88.0",
    device: "Mobile",
    location: "Miami, US",
    status: "Success",
    details: "Downloaded PDF: 'Advanced JavaScript Concepts'"
  },
  {
    id: 6,
    timestamp: "2024-01-15 10:05:27",
    user: "Anonymous",
    email: "unknown@example.com",
    action: "Login Attempt",
    resource: "Admin Dashboard",
    ipAddress: "203.0.113.1",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    device: "Desktop",
    location: "Unknown",
    status: "Failed",
    details: "Failed login attempt with invalid credentials"
  }
]

export function ActivityLogManagement() {
  const [logs] = useState(mockActivityLogs)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAction, setSelectedAction] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedDevice, setSelectedDevice] = useState("all")
  const [dateRange, setDateRange] = useState("today")

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.ipAddress.includes(searchQuery)
    const matchesAction = selectedAction === "all" || log.action === selectedAction
    const matchesStatus = selectedStatus === "all" || log.status === selectedStatus
    const matchesDevice = selectedDevice === "all" || log.device === selectedDevice
    
    return matchesSearch && matchesAction && matchesStatus && matchesDevice
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Success": return "bg-green-100 text-green-800"
      case "Failed": return "bg-red-100 text-red-800"
      case "Warning": return "bg-yellow-100 text-yellow-800"
      case "Info": return "bg-blue-100 text-blue-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Success": return <CheckCircle className="h-4 w-4 text-green-500" />
      case "Failed": return <XCircle className="h-4 w-4 text-red-500" />
      case "Warning": return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "Info": return <Info className="h-4 w-4 text-blue-500" />
      default: return <Info className="h-4 w-4 text-gray-500" />
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case "Login": return "bg-blue-100 text-blue-800"
      case "Create": return "bg-green-100 text-green-800"
      case "Update": return "bg-yellow-100 text-yellow-800"
      case "Delete": return "bg-red-100 text-red-800"
      case "Download": return "bg-purple-100 text-purple-800"
      case "Login Attempt": return "bg-orange-100 text-orange-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case "Desktop": return <Monitor className="h-4 w-4" />
      case "Mobile": return <Smartphone className="h-4 w-4" />
      case "Tablet": return <Monitor className="h-4 w-4" />
      default: return <Globe className="h-4 w-4" />
    }
  }

  const getUniqueActions = () => {
    return [...new Set(logs.map(log => log.action))]
  }

  const getUniqueDevices = () => {
    return [...new Set(logs.map(log => log.device))]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activity Log</h1>
          <p className="text-gray-600">Monitor user activities and system events</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            aria-label="Export activity logs"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-500">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Activities</p>
              <p className="text-2xl font-bold text-gray-900">{logs.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-500">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Successful</p>
              <p className="text-2xl font-bold text-gray-900">
                {logs.filter(l => l.status === "Success").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-red-500">
              <XCircle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Failed</p>
              <p className="text-2xl font-bold text-gray-900">
                {logs.filter(l => l.status === "Failed").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-500">
              <User className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Unique Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(logs.map(l => l.email)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              aria-label="Filter by action type"
            >
              <option value="all">All Actions</option>
              {getUniqueActions().map(action => (
                <option key={action} value={action}>{action}</option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              aria-label="Filter by status"
            >
              <option value="all">All Status</option>
              <option value="Success">Success</option>
              <option value="Failed">Failed</option>
              <option value="Warning">Warning</option>
              <option value="Info">Info</option>
            </select>
            <select
              value={selectedDevice}
              onChange={(e) => setSelectedDevice(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              aria-label="Filter by device type"
            >
              <option value="all">All Devices</option>
              {getUniqueDevices().map(device => (
                <option key={device} value={device}>{device}</option>
              ))}
            </select>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              aria-label="Filter by date range"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="all">All Time</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              aria-label="Show more filter options"
            >
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Activity Logs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resource
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Device
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP Address
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-2" />
                      {log.timestamp}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{log.user}</div>
                        <div className="text-sm text-gray-500">{log.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getActionColor(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.resource}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(log.status)}
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(log.status)}`}>
                        {log.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getDeviceIcon(log.device)}
                      <span className="ml-2 text-sm text-gray-900">{log.device}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{log.location}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                    {log.ipAddress}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => console.log(`View details for log: ${log.id}`)}
                        className="text-gray-400 hover:text-gray-600"
                        aria-label={`View details for ${log.user} activity`}
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        className="text-gray-400 hover:text-gray-600"
                        aria-label={`More actions for ${log.user} activity`}
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
        
        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button 
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              aria-label="Go to previous page"
            >
              Previous
            </button>
            <button 
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              aria-label="Go to next page"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredLogs.length}</span> of{' '}
                <span className="font-medium">{filteredLogs.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button 
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  aria-label="Go to previous page"
                >
                  Previous
                </button>
                <button 
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                  aria-label="Page 1"
                  aria-current="page"
                >
                  1
                </button>
                <button 
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  aria-label="Go to next page"
                >
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
