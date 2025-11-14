"use client"

import { useState } from "react"
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Eye, 
  MousePointer, 
  Clock,
  BarChart3,
  PieChart,
  LineChart,
  Download
} from "lucide-react"
import { AnalyticsExportModal } from "./analytics-export-modal"
import { AnalyticsExportUtils } from "../../utils/analytics-export-utils"

const analyticsData = {
  overview: {
    totalUsers: 12543,
    activeUsers: 8234,
    pageViews: 456789,
    sessions: 234567,
    bounceRate: 42.5,
    avgSessionDuration: "3:24"
  },
  userGrowth: [
    { month: "Jan", users: 1200, growth: 5.2 },
    { month: "Feb", users: 1350, growth: 12.5 },
    { month: "Mar", users: 1420, growth: 5.2 },
    { month: "Apr", users: 1580, growth: 11.3 },
    { month: "May", users: 1720, growth: 8.9 },
    { month: "Jun", users: 1890, growth: 9.9 }
  ],
  topPages: [
    { page: "/", views: 45678, uniqueViews: 23456 },
    { page: "/blogs", views: 23456, uniqueViews: 18900 },
    { page: "/jobs", views: 18900, uniqueViews: 15600 },
    { page: "/exams", views: 15600, uniqueViews: 12300 },
    { page: "/profile", views: 12300, uniqueViews: 9800 }
  ],
  trafficSources: [
    { source: "Direct", percentage: 45, visitors: 11250 },
    { source: "Google", percentage: 30, visitors: 7500 },
    { source: "Social Media", percentage: 15, visitors: 3750 },
    { source: "Referrals", percentage: 10, visitors: 2500 }
  ],
  deviceBreakdown: [
    { device: "Desktop", percentage: 60, users: 15000 },
    { device: "Mobile", percentage: 35, users: 8750 },
    { device: "Tablet", percentage: 5, users: 1250 }
  ]
}

export function AnalyticsDashboard() {
  const [_selectedPeriod, setSelectedPeriod] = useState("30d")
  const [_selectedMetric, _setSelectedMetric] = useState("users")
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  // Mock real-time activity data
  const realTimeActivity = [
    {
      type: "user_registration",
      message: "User registered: john.doe@example.com",
      timestamp: "2 seconds ago"
    },
    {
      type: "page_view",
      message: "Blog post viewed: 'AI in Engineering'",
      timestamp: "5 seconds ago"
    },
    {
      type: "job_application",
      message: "Job application submitted: TechCorp",
      timestamp: "12 seconds ago"
    }
  ]

  const handleExportAnalytics = async (format: 'csv' | 'json' | 'pdf', period: string) => {
    setIsExporting(true)
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Collect analytics data
      const reportData = AnalyticsExportUtils.collectAnalyticsData(
        period,
        analyticsData,
        realTimeActivity
      )
      
      // Export based on format
      switch (format) {
        case 'csv':
          AnalyticsExportUtils.exportToCSV(reportData)
          break
        case 'json':
          AnalyticsExportUtils.exportToJSON(reportData)
          break
        case 'pdf':
          AnalyticsExportUtils.exportToPDF(reportData)
          break
      }
      
      // Close modal after successful export
      setIsExportModalOpen(false)
    } catch (error) {
      console.error('Analytics export failed:', error)
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
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive insights into your platform performance</p>
        </div>
        <div className="flex items-center">
          <button 
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            aria-label="Export analytics data"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-500">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.totalUsers.toLocaleString()}</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600 ml-1">+12.5%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-500">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.activeUsers.toLocaleString()}</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600 ml-1">+8.3%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-500">
              <Eye className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Page Views</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.pageViews.toLocaleString()}</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600 ml-1">+15.2%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-orange-500">
              <MousePointer className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Sessions</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.sessions.toLocaleString()}</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600 ml-1">+9.7%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-red-500">
              <TrendingDown className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Bounce Rate</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.bounceRate}%</p>
              <div className="flex items-center mt-1">
                <TrendingDown className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-600 ml-1">-2.1%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-indigo-500">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg. Duration</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.avgSessionDuration}</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600 ml-1">+5.3%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">User Growth</h3>
            <div className="flex items-center space-x-2">
              <LineChart className="h-5 w-5 text-gray-400" aria-hidden="true" />
              <span className="text-sm text-gray-500">Last 6 months</span>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">User growth chart would be displayed here</p>
              <p className="text-sm text-gray-400">Integration with charting library needed</p>
            </div>
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Traffic Sources</h3>
            <div className="flex items-center space-x-2">
              <PieChart className="h-5 w-5 text-gray-400" aria-hidden="true" />
              <span className="text-sm text-gray-500">This month</span>
            </div>
          </div>
          <div className="space-y-4">
            {analyticsData.trafficSources.map((source, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded mr-3 ${
                    index === 0 ? 'bg-blue-500' :
                    index === 1 ? 'bg-green-500' :
                    index === 2 ? 'bg-purple-500' : 'bg-orange-500'
                  }`}></div>
                  <span className="text-sm text-gray-600">{source.source}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium">{source.percentage}%</span>
                  <p className="text-xs text-gray-500">{source.visitors.toLocaleString()} visitors</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Pages and Device Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Top Pages</h3>
            <button className="text-sm text-blue-600 hover:text-blue-800" aria-label="View all top pages">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {analyticsData.topPages.map((page, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{page.page}</p>
                  <p className="text-xs text-gray-500">{page.uniqueViews.toLocaleString()} unique views</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{page.views.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">total views</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Device Breakdown</h3>
            <div className="flex items-center space-x-2">
              <PieChart className="h-5 w-5 text-gray-400" aria-hidden="true" />
              <span className="text-sm text-gray-500">This month</span>
            </div>
          </div>
          <div className="space-y-4">
            {analyticsData.deviceBreakdown.map((device, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded mr-3 ${
                    index === 0 ? 'bg-blue-500' :
                    index === 1 ? 'bg-green-500' : 'bg-purple-500'
                  }`}></div>
                  <span className="text-sm text-gray-600">{device.device}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium">{device.percentage}%</span>
                  <p className="text-xs text-gray-500">{device.users.toLocaleString()} users</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Real-time Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Real-time Activity</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-500">Live</span>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-900">User registered: john.doe@example.com</span>
            </div>
            <span className="text-xs text-gray-500">2 seconds ago</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-900">Blog post viewed: &quot;AI in Engineering&quot;</span>
            </div>
            <span className="text-xs text-gray-500">5 seconds ago</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-900">Job application submitted: TechCorp</span>
            </div>
            <span className="text-xs text-gray-500">12 seconds ago</span>
          </div>
        </div>
      </div>

      {/* Analytics Export Modal */}
      <AnalyticsExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExportAnalytics}
        selectedPeriod={_selectedPeriod}
        isExporting={isExporting}
      />
    </div>
  )
}
