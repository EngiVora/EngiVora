"use client"

import { useState } from "react"
import { 
  Users, 
  FileText, 
  Briefcase, 
  GraduationCap, 
  TrendingUp, 
  TrendingDown,
  Eye,
  MessageSquare,
  Calendar,
  DollarSign,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  LineChart
} from "lucide-react"
import { ExportReportModal } from "./export-report-modal"
import { ExportUtils } from "../../utils/export-utils"

const stats = [
  {
    name: "Total Users",
    value: "12,543",
    change: "+12%",
    changeType: "increase",
    icon: Users,
    color: "bg-blue-500"
  },
  {
    name: "Active Users",
    value: "8,234",
    change: "+8%",
    changeType: "increase",
    icon: Activity,
    color: "bg-green-500"
  },
  {
    name: "Blog Posts",
    value: "1,247",
    change: "+23%",
    changeType: "increase",
    icon: FileText,
    color: "bg-purple-500"
  },
  {
    name: "Job Listings",
    value: "456",
    change: "+5%",
    changeType: "increase",
    icon: Briefcase,
    color: "bg-orange-500"
  },
  {
    name: "Exam Updates",
    value: "89",
    change: "-2%",
    changeType: "decrease",
    icon: GraduationCap,
    color: "bg-red-500"
  },
  {
    name: "Revenue",
    value: "$24,567",
    change: "+15%",
    changeType: "increase",
    icon: DollarSign,
    color: "bg-emerald-500"
  }
]

const recentActivities = [
  {
    id: 1,
    type: "user_registration",
    message: "New user John Doe registered",
    time: "2 minutes ago",
    icon: Users,
    color: "text-blue-500"
  },
  {
    id: 2,
    type: "blog_published",
    message: "Blog post 'AI in Engineering' was published",
    time: "15 minutes ago",
    icon: FileText,
    color: "text-purple-500"
  },
  {
    id: 3,
    type: "job_posted",
    message: "New job posting from TechCorp",
    time: "1 hour ago",
    icon: Briefcase,
    color: "text-orange-500"
  },
  {
    id: 4,
    type: "exam_update",
    message: "GATE 2025 registration deadline updated",
    time: "2 hours ago",
    icon: GraduationCap,
    color: "text-red-500"
  },
  {
    id: 5,
    type: "system_alert",
    message: "High server load detected",
    time: "3 hours ago",
    icon: AlertCircle,
    color: "text-yellow-500"
  }
]

const systemStatus = [
  { name: "Server Status", status: "operational", icon: CheckCircle },
  { name: "Database", status: "operational", icon: CheckCircle },
  { name: "API Services", status: "operational", icon: CheckCircle },
  { name: "Email Service", status: "degraded", icon: AlertCircle },
  { name: "File Storage", status: "operational", icon: CheckCircle },
]

export function AdminDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("7d")
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  // Content distribution data for export
  const contentDistribution = [
    { category: "Blog Posts", percentage: 45 },
    { category: "Job Listings", percentage: 30 },
    { category: "Exam Updates", percentage: 15 },
    { category: "Discounts", percentage: 10 }
  ]

  const handleExportReport = async (format: 'csv' | 'json' | 'pdf', period: string) => {
    setIsExporting(true)
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Collect dashboard data
      const reportData = ExportUtils.collectDashboardData(
        period,
        stats,
        systemStatus,
        recentActivities,
        contentDistribution
      )
      
      // Export based on format
      switch (format) {
        case 'csv':
          ExportUtils.exportToCSV(reportData)
          break
        case 'json':
          ExportUtils.exportToJSON(reportData)
          break
        case 'pdf':
          ExportUtils.exportToPDF(reportData)
          break
      }
      
      // Close modal after successful export
      setIsExportModalOpen(false)
    } catch (error) {
      console.error('Export failed:', error)
      // You could add a toast notification here
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here&apos;s what&apos;s happening with your platform.</p>
        </div>
        <div className="flex items-center">
          <button 
            onClick={() => setIsExportModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <div className="flex items-center mt-1">
                  {stat.changeType === "increase" ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`text-sm ml-1 ${
                    stat.changeType === "increase" ? "text-green-600" : "text-red-600"
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last period</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">User Growth</h3>
            <div className="flex items-center space-x-2">
              <LineChart className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-500">Last 30 days</span>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Chart visualization would go here</p>
              <p className="text-sm text-gray-400">Integration with charting library needed</p>
            </div>
          </div>
        </div>

        {/* Content Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Content Distribution</h3>
            <div className="flex items-center space-x-2">
              <PieChart className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-500">This month</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded mr-3"></div>
                <span className="text-sm text-gray-600">Blog Posts</span>
              </div>
              <span className="text-sm font-medium">45%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded mr-3"></div>
                <span className="text-sm text-gray-600">Job Listings</span>
              </div>
              <span className="text-sm font-medium">30%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-purple-500 rounded mr-3"></div>
                <span className="text-sm text-gray-600">Exam Updates</span>
              </div>
              <span className="text-sm font-medium">15%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-orange-500 rounded mr-3"></div>
                <span className="text-sm text-gray-600">Discounts</span>
              </div>
              <span className="text-sm font-medium">10%</span>
            </div>
          </div>
        </div>
      </div>

      {/* System Status and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
          <div className="space-y-3">
            {systemStatus.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <item.icon className={`h-5 w-5 mr-3 ${
                    item.status === "operational" ? "text-green-500" : "text-yellow-500"
                  }`} />
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className={`text-sm font-medium ${
                  item.status === "operational" ? "text-green-600" : "text-yellow-600"
                }`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <activity.icon className={`h-5 w-5 mt-0.5 ${activity.color}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 text-sm text-blue-600 hover:text-blue-800">
            View all activity →
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Users className="h-6 w-6 text-blue-500 mr-3" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Add User</p>
              <p className="text-sm text-gray-500">Create new user account</p>
            </div>
          </button>
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <FileText className="h-6 w-6 text-purple-500 mr-3" />
            <div className="text-left">
              <p className="font-medium text-gray-900">New Blog Post</p>
              <p className="text-sm text-gray-500">Publish new content</p>
            </div>
          </button>
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Briefcase className="h-6 w-6 text-orange-500 mr-3" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Post Job</p>
              <p className="text-sm text-gray-500">Add new job listing</p>
            </div>
          </button>
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Calendar className="h-6 w-6 text-green-500 mr-3" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Schedule Event</p>
              <p className="text-sm text-gray-500">Create new event</p>
            </div>
          </button>
        </div>
      </div>

      {/* Export Report Modal */}
      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExportReport}
        selectedPeriod={selectedPeriod}
        isExporting={isExporting}
      />
    </div>
  )
}
