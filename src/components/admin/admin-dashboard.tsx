"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Users,
  FileText,
  Briefcase,
  GraduationCap,
  TrendingUp,
  TrendingDown,
  Calendar,
  Activity,
  AlertCircle,
  CheckCircle,
  BarChart3,
  PieChart,
  LineChart,
  Download,
  Plus,
} from "lucide-react";
import { ExportReportModal } from "./export-report-modal";
import { ExportUtils } from "../../utils/export-utils";
import { LazyWrapper } from "../lazy-wrapper";

const getStats = (data: any) => [
  {
    name: "Total Users",
    value: data.totalUsers.toLocaleString(),
    change: "+12%",
    changeType: "increase",
    icon: Users,
    color: "bg-blue-500",
  },
  {
    name: "Active Users",
    value: data.activeUsers.toLocaleString(),
    change: "+8%",
    changeType: "increase",
    icon: Activity,
    color: "bg-green-500",
  },
  {
    name: "Blog Posts",
    value: data.totalBlogs.toLocaleString(),
    change: "+23%",
    changeType: "increase",
    icon: FileText,
    color: "bg-purple-500",
  },
  {
    name: "Job Listings",
    value: data.totalJobs.toLocaleString(),
    change: "+5%",
    changeType: "increase",
    icon: Briefcase,
    color: "bg-orange-500",
  },
  {
    name: "Exams",
    value: data.totalExams.toLocaleString(),
    change: "-2%",
    changeType: "decrease",
    icon: GraduationCap,
    color: "bg-red-500",
  },
  {
    name: "Events",
    value: data.totalEvents.toLocaleString(),
    change: "+15%",
    changeType: "increase",
    icon: Calendar,
    color: "bg-emerald-500",
  },
];

const recentActivities = [
  {
    id: 1,
    type: "user_registration",
    message: "New user John Doe registered",
    time: "2 minutes ago",
    icon: Users,
    color: "text-blue-500",
  },
  {
    id: 2,
    type: "blog_published",
    message: "Blog post 'AI in Engineering' was published",
    time: "15 minutes ago",
    icon: FileText,
    color: "text-purple-500",
  },
  {
    id: 3,
    type: "job_posted",
    message: "New job posting from TechCorp",
    time: "1 hour ago",
    icon: Briefcase,
    color: "text-orange-500",
  },
  {
    id: 4,
    type: "exam_update",
    message: "GATE 2025 registration deadline updated",
    time: "2 hours ago",
    icon: GraduationCap,
    color: "text-red-500",
  },
  {
    id: 5,
    type: "system_alert",
    message: "High server load detected",
    time: "3 hours ago",
    icon: AlertCircle,
    color: "text-yellow-500",
  },
];

const systemStatus = [
  { name: "Server Status", status: "operational", icon: CheckCircle },
  { name: "Database", status: "operational", icon: CheckCircle },
  { name: "API Services", status: "operational", icon: CheckCircle },
  { name: "Email Service", status: "degraded", icon: AlertCircle },
  { name: "File Storage", status: "operational", icon: CheckCircle },
];

export function AdminDashboard() {
  const [selectedPeriod] = useState("7d");
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalBlogs: 0,
    totalJobs: 0,
    totalExams: 0,
    totalEvents: 0,
    recentActivities: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  // Quick Actions Modal States
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showNewBlogModal, setShowNewBlogModal] = useState(false);
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [showScheduleEventModal, setShowScheduleEventModal] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    try {
      const token =
        localStorage.getItem("adminToken") ||
        sessionStorage.getItem("adminToken");
      if (!token) return;

      // Check cache first
      const cacheKey = "dashboard-data";
      const cachedData = localStorage.getItem(cacheKey);
      const cacheTime = localStorage.getItem(`${cacheKey}-time`);
      const now = Date.now();

      // Use cached data if less than 5 minutes old
      if (cachedData && cacheTime && now - parseInt(cacheTime) < 300000) {
        setDashboardData(JSON.parse(cachedData));
        setIsLoading(false);
        return;
      }

      // Fetch only essential data with optimized queries
      const [usersRes, blogsRes, jobsRes] = await Promise.all([
        fetch("/api/students/list?limit=1", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/blogs?limit=1", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/jobs?limit=1", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const [users, blogs, jobs] = await Promise.all([
        usersRes.ok
          ? usersRes.json()
          : { data: [], pagination: { totalItems: 0 } },
        blogsRes.ok
          ? blogsRes.json()
          : { data: [], pagination: { totalItems: 0 } },
        jobsRes.ok
          ? jobsRes.json()
          : { data: [], pagination: { totalItems: 0 } },
      ]);

      const newData = {
        totalUsers: users.pagination?.totalItems || 0,
        activeUsers: Math.floor((users.pagination?.totalItems || 0) * 0.7), // Estimate
        totalBlogs: blogs.pagination?.totalItems || 0,
        totalJobs: jobs.pagination?.totalItems || 0,
        totalExams: 0, // Skip for now
        totalEvents: 0, // Skip for now
        recentActivities: [],
      };

      setDashboardData(newData);

      // Cache the data
      localStorage.setItem(cacheKey, JSON.stringify(newData));
      localStorage.setItem(`${cacheKey}-time`, now.toString());
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Memoize stats calculation for performance
  const stats = useMemo(() => getStats(dashboardData), [dashboardData]);

  // Content distribution data for export
  const contentDistribution = [
    { category: "Blog Posts", percentage: 45 },
    { category: "Job Listings", percentage: 30 },
    { category: "Exam Updates", percentage: 15 },
    { category: "Discounts", percentage: 10 },
  ];

  const handleExportReport = async (
    format: "csv" | "json" | "pdf",
    period: string,
  ) => {
    setIsExporting(true);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Collect dashboard data
      const reportData = ExportUtils.collectDashboardData(
        period,
        getStats(dashboardData),
        systemStatus,
        recentActivities,
        contentDistribution,
      );

      // Export based on format
      switch (format) {
        case "csv":
          ExportUtils.exportToCSV(reportData);
          break;
        case "json":
          ExportUtils.exportToJSON(reportData);
          break;
        case "pdf":
          ExportUtils.exportToPDF(reportData);
          break;
      }

      // Close modal after successful export
      setIsExportModalOpen(false);
    } catch (error) {
      console.error("Export failed:", error);
      // You could add a toast notification here
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-blue-100 text-lg">
              Welcome back! Here&apos;s what&apos;s happening with your
              platform.
            </p>
            <div className="flex items-center mt-3 space-x-4">
              <div className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Live Data</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full">
                <Activity className="h-4 w-4" />
                <span className="text-sm font-medium">Real-time Updates</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <Download className="h-5 w-5 mr-2 inline" />
              Export Report
            </button>
            <div className="text-right">
              <p className="text-sm text-blue-100">Last Updated</p>
              <p className="text-lg font-semibold">
                {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-100 p-6 animate-pulse"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-gray-300 w-12 h-12"></div>
                  <div className="h-4 w-4 bg-gray-300 rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-20"></div>
                  <div className="h-8 bg-gray-300 rounded w-16"></div>
                  <div className="h-3 bg-gray-300 rounded w-24"></div>
                </div>
              </div>
            ))
          : stats.map((stat) => (
              <div
                key={stat.name}
                className="group bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg hover:shadow-xl border border-gray-100 p-6 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Header with icon and trend */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3 rounded-xl ${stat.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div
                    className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      stat.changeType === "increase"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {stat.changeType === "increase" ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {stat.change}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
                    {stat.name}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500">vs last period</p>
                </div>

                {/* Decorative element */}
                <div
                  className={`mt-4 h-1 rounded-full bg-gradient-to-r ${stat.color} opacity-20 group-hover:opacity-40 transition-opacity`}
                ></div>
              </div>
            ))}
      </div>

      {/* Enhanced Charts and Analytics */}
      <LazyWrapper
        fallback={
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-200 rounded-xl h-64 animate-pulse"></div>
            <div className="bg-gray-200 rounded-xl h-64 animate-pulse"></div>
          </div>
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Growth Chart */}
          <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg border border-blue-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">User Growth</h3>
                <p className="text-sm text-gray-600">
                  Track user acquisition over time
                </p>
              </div>
              <div className="flex items-center space-x-2 bg-blue-100 px-3 py-2 rounded-full">
                <LineChart className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">
                  Last 30 days
                </span>
              </div>
            </div>
            <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <div className="text-center">
                <div className="relative">
                  <BarChart3 className="h-16 w-16 text-blue-400 mx-auto mb-4 animate-pulse" />
                  <div className="absolute inset-0 bg-blue-200 rounded-full blur-xl opacity-30"></div>
                </div>
                <p className="text-gray-600 font-medium">
                  Interactive Chart Coming Soon
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Real-time user growth visualization
                </p>
              </div>
            </div>
          </div>

          {/* Content Distribution */}
          <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-lg border border-purple-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Content Distribution
                </h3>
                <p className="text-sm text-gray-600">
                  Content breakdown by category
                </p>
              </div>
              <div className="flex items-center space-x-2 bg-purple-100 px-3 py-2 rounded-full">
                <PieChart className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-700">
                  This month
                </span>
              </div>
            </div>
            <div className="space-y-4">
              {[
                {
                  label: "Blog Posts",
                  percentage: 45,
                  color: "bg-blue-500",
                  bgColor: "bg-blue-50",
                },
                {
                  label: "Job Listings",
                  percentage: 30,
                  color: "bg-green-500",
                  bgColor: "bg-green-50",
                },
                {
                  label: "Exam Updates",
                  percentage: 15,
                  color: "bg-purple-500",
                  bgColor: "bg-purple-50",
                },
                {
                  label: "Discounts",
                  percentage: 10,
                  color: "bg-orange-500",
                  bgColor: "bg-orange-50",
                },
              ].map((item, index) => (
                <div key={index} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div
                        className={`w-4 h-4 ${item.color} rounded-full mr-3 shadow-sm`}
                      ></div>
                      <span className="text-sm font-medium text-gray-700">
                        {item.label}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">
                      {item.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out group-hover:shadow-lg`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </LazyWrapper>

      {/* Enhanced System Status and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Status */}
        <div className="bg-gradient-to-br from-white to-green-50 rounded-xl shadow-lg border border-green-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">System Status</h3>
              <p className="text-sm text-gray-600">Monitor system health</p>
            </div>
            <div className="flex items-center space-x-2 bg-green-100 px-3 py-2 rounded-full">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-700">
                All Systems
              </span>
            </div>
          </div>
          <div className="space-y-4">
            {systemStatus.map((item) => (
              <div
                key={item.name}
                className="group flex items-center justify-between p-3 rounded-lg hover:bg-white/50 transition-colors"
              >
                <div className="flex items-center">
                  <div
                    className={`p-2 rounded-lg ${
                      item.status === "operational"
                        ? "bg-green-100"
                        : "bg-yellow-100"
                    } group-hover:scale-110 transition-transform`}
                  >
                    <item.icon
                      className={`h-4 w-4 ${
                        item.status === "operational"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700 ml-3">
                    {item.name}
                  </span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.status === "operational"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg border border-blue-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Recent Activity
              </h3>
              <p className="text-sm text-gray-600">Latest platform updates</p>
            </div>
            <div className="flex items-center space-x-2 bg-blue-100 px-3 py-2 rounded-full">
              <Activity className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Live</span>
            </div>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="group flex items-start space-x-3 p-3 rounded-lg hover:bg-white/50 transition-colors"
              >
                <div
                  className={`p-2 rounded-lg ${activity.color.replace("text-", "bg-").replace("-500", "-100")} group-hover:scale-110 transition-transform`}
                >
                  <activity.icon className={`h-4 w-4 ${activity.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    {activity.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button
            className="mt-4 w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium py-2 rounded-lg hover:bg-blue-50 transition-colors"
            aria-label="View all activity"
          >
            View all activity →
          </button>
        </div>
      </div>

      {/* Enhanced Quick Actions */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
            <p className="text-sm text-gray-600">Common administrative tasks</p>
          </div>
          <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-full">
            <Plus className="h-5 w-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Actions</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: Users,
              title: "Add User",
              description: "Create new user account",
              color: "blue",
              href: "/admin/users",
            },
            {
              icon: FileText,
              title: "New Blog Post",
              description: "Publish new content",
              color: "purple",
              href: "/admin/blogs",
            },
            {
              icon: Briefcase,
              title: "Post Job",
              description: "Add new job listing",
              color: "orange",
              href: "/admin/jobs",
            },
            {
              icon: Calendar,
              title: "Schedule Event",
              description: "Create new event",
              color: "green",
              href: "/admin/events",
            },
          ].map((action, index) => (
            <button
              key={index}
              onClick={() => {
                switch (action.title) {
                  case "Add User":
                    setShowAddUserModal(true);
                    break;
                  case "New Blog Post":
                    setShowNewBlogModal(true);
                    break;
                  case "Post Job":
                    setShowPostJobModal(true);
                    break;
                  case "Schedule Event":
                    setShowScheduleEventModal(true);
                    break;
                }
              }}
              className="group flex items-center p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              aria-label={`${action.title} - ${action.description}`}
            >
              <div
                className={`p-3 rounded-xl bg-${action.color}-100 group-hover:bg-${action.color}-200 transition-colors mr-4`}
              >
                <action.icon className={`h-6 w-6 text-${action.color}-600`} />
              </div>
              <div className="text-left flex-1">
                <p className="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                  {action.title}
                </p>
                <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors">
                  {action.description}
                </p>
              </div>
              <div
                className={`w-2 h-2 rounded-full bg-${action.color}-400 group-hover:scale-125 transition-transform`}
              ></div>
            </button>
          ))}
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

      {/* Quick Action Modals */}
      <AddUserModal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
      />
      <NewBlogModal
        isOpen={showNewBlogModal}
        onClose={() => setShowNewBlogModal(false)}
      />
      <PostJobModal
        isOpen={showPostJobModal}
        onClose={() => setShowPostJobModal(false)}
      />
      <ScheduleEventModal
        isOpen={showScheduleEventModal}
        onClose={() => setShowScheduleEventModal(false)}
      />
    </div>
  );
}

// Add User Modal Component
function AddUserModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Student",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const token =
        localStorage.getItem("adminToken") ||
        sessionStorage.getItem("adminToken");
      const res = await fetch("/api/students/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      if (res.ok) {
        alert("User created successfully!");
        onClose();
        setFormData({
          name: "",
          email: "",
          role: "Student",
          password: "",
          confirmPassword: "",
        });
      } else {
        const data = await res.json();
        alert(data.error || "Failed to create user");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Network error creating user");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Add New User</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter email address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role *
            </label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Select user role"
            >
              <option value="Student">Student</option>
              <option value="Admin">Admin</option>
              <option value="Moderator">Moderator</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password *
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password *
            </label>
            <input
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Confirm password"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// New Blog Modal Component
function NewBlogModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    content: "",
    category: "technology",
    tags: "",
    published: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token =
        localStorage.getItem("adminToken") ||
        sessionStorage.getItem("adminToken");
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag),
        }),
      });

      if (res.ok) {
        alert("Blog post created successfully!");
        onClose();
        setFormData({
          title: "",
          summary: "",
          content: "",
          category: "technology",
          tags: "",
          published: false,
        });
      } else {
        const data = await res.json();
        alert(data.error || "Failed to create blog post");
      }
    } catch (error) {
      console.error("Error creating blog post:", error);
      alert("Network error creating blog post");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          Create New Blog Post
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter blog title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Summary *
            </label>
            <textarea
              required
              rows={3}
              value={formData.summary}
              onChange={(e) =>
                setFormData({ ...formData, summary: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter blog summary"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                aria-label="Select blog category"
              >
                <option value="technology">Technology</option>
                <option value="career">Career</option>
                <option value="academic">Academic</option>
                <option value="lifestyle">Lifestyle</option>
                <option value="news">News</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter tags separated by commas"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <textarea
              required
              rows={8}
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter blog content"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) =>
                setFormData({ ...formData, published: e.target.checked })
              }
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label
              htmlFor="published"
              className="ml-2 block text-sm text-gray-700"
            >
              Publish immediately
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? "Creating..." : "Create Blog Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Post Job Modal Component
function PostJobModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    type: "full-time",
    category: "software",
    location: "",
    remote: false,
    salary: { min: 0, max: 0, currency: "INR" },
    requirements: "",
    skills: "",
    experience: { min: 0, max: 0 },
    applicationDeadline: "",
    applicationLink: "",
    contactEmail: "",
    isActive: true,
    featured: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token =
        localStorage.getItem("adminToken") ||
        sessionStorage.getItem("adminToken");
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          requirements: formData.requirements
            .split("\n")
            .filter((req) => req.trim()),
          skills: formData.skills
            .split(",")
            .map((skill) => skill.trim())
            .filter((skill) => skill),
        }),
      });

      if (res.ok) {
        alert("Job posted successfully!");
        onClose();
        setFormData({
          title: "",
          company: "",
          description: "",
          type: "full-time",
          category: "software",
          location: "",
          remote: false,
          salary: { min: 0, max: 0, currency: "INR" },
          requirements: "",
          skills: "",
          experience: { min: 0, max: 0 },
          applicationDeadline: "",
          applicationLink: "",
          contactEmail: "",
          isActive: true,
          featured: false,
        });
      } else {
        const data = await res.json();
        alert(data.error || "Failed to post job");
      }
    } catch (error) {
      console.error("Error posting job:", error);
      alert("Network error posting job");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Post New Job</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Enter job title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company *
              </label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Enter company name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Enter job description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                aria-label="Select job type"
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="freelance">Freelance</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                aria-label="Select job category"
              >
                <option value="software">Software</option>
                <option value="hardware">Hardware</option>
                <option value="mechanical">Mechanical</option>
                <option value="civil">Civil</option>
                <option value="electrical">Electrical</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Enter location"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.remote}
                onChange={(e) =>
                  setFormData({ ...formData, remote: e.target.checked })
                }
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Remote Work</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Active</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) =>
                  setFormData({ ...formData, featured: e.target.checked })
                }
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Featured</span>
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? "Posting..." : "Post Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Schedule Event Modal Component
function ScheduleEventModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    organizer: "",
    maxAttendees: "",
    registrationRequired: false,
    isActive: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token =
        localStorage.getItem("adminToken") ||
        sessionStorage.getItem("adminToken");
      const res = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          maxAttendees: formData.maxAttendees
            ? parseInt(formData.maxAttendees)
            : null,
          dateTime: new Date(`${formData.date}T${formData.time}`).toISOString(),
        }),
      });

      if (res.ok) {
        alert("Event scheduled successfully!");
        onClose();
        setFormData({
          title: "",
          description: "",
          date: "",
          time: "",
          location: "",
          organizer: "",
          maxAttendees: "",
          registrationRequired: false,
          isActive: true,
        });
      } else {
        const data = await res.json();
        alert(data.error || "Failed to schedule event");
      }
    } catch (error) {
      console.error("Error scheduling event:", error);
      alert("Network error scheduling event");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          Schedule New Event
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Enter event title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Enter event description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                aria-label="Select event date"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time *
              </label>
              <input
                type="time"
                required
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                aria-label="Select event time"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Enter event location"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organizer
              </label>
              <input
                type="text"
                value={formData.organizer}
                onChange={(e) =>
                  setFormData({ ...formData, organizer: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Enter organizer name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Attendees
            </label>
            <input
              type="number"
              value={formData.maxAttendees}
              onChange={(e) =>
                setFormData({ ...formData, maxAttendees: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Enter maximum attendees"
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.registrationRequired}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    registrationRequired: e.target.checked,
                  })
                }
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">
                Registration Required
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Active</span>
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? "Scheduling..." : "Schedule Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminDashboard;
