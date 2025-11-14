"use client";

import { useState } from "react";
import {
  Search,
  MoreVertical,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Ban,
  Unlock,
  RefreshCw,
  Settings,
} from "lucide-react";

const mockSecurityEvents = [
  {
    id: 1,
    timestamp: "2024-01-15 10:30:15",
    type: "Failed Login",
    severity: "Medium",
    user: "john.doe@example.com",
    ipAddress: "192.168.1.100",
    location: "New York, US",
    description: "Multiple failed login attempts detected",
    status: "Active",
    blocked: false,
  },
  {
    id: 2,
    timestamp: "2024-01-15 10:25:42",
    type: "Suspicious Activity",
    severity: "High",
    user: "unknown@example.com",
    ipAddress: "203.0.113.1",
    location: "Unknown",
    description: "Unusual data access pattern detected",
    status: "Investigated",
    blocked: true,
  },
  {
    id: 3,
    timestamp: "2024-01-15 10:20:18",
    type: "Password Reset",
    severity: "Low",
    user: "jane.smith@example.com",
    ipAddress: "192.168.1.101",
    location: "San Francisco, US",
    description: "Password reset requested from new device",
    status: "Resolved",
    blocked: false,
  },
  {
    id: 4,
    timestamp: "2024-01-15 10:15:33",
    type: "Data Export",
    severity: "Medium",
    user: "admin@engivora.com",
    ipAddress: "192.168.1.102",
    location: "Chicago, US",
    description: "Large data export initiated",
    status: "Active",
    blocked: false,
  },
  {
    id: 5,
    timestamp: "2024-01-15 10:10:55",
    type: "API Abuse",
    severity: "High",
    user: "api@external.com",
    ipAddress: "198.51.100.1",
    location: "Unknown",
    description: "Excessive API requests detected",
    status: "Blocked",
    blocked: true,
  },
];

const mockBlockedIPs = [
  {
    id: 1,
    ipAddress: "203.0.113.1",
    reason: "Multiple failed login attempts",
    blockedAt: "2024-01-15 10:25:42",
    blockedBy: "System",
    status: "Active",
  },
  {
    id: 2,
    ipAddress: "198.51.100.1",
    reason: "API abuse and rate limiting violations",
    blockedAt: "2024-01-15 10:10:55",
    blockedBy: "Admin",
    status: "Active",
  },
  {
    id: 3,
    ipAddress: "192.0.2.1",
    reason: "Suspicious scanning activity",
    blockedAt: "2024-01-14 15:30:12",
    blockedBy: "System",
    status: "Expired",
  },
];

const mockSecuritySettings = {
  twoFactorAuth: {
    enabled: true,
    requiredForAdmins: true,
    requiredForUsers: false,
  },
  passwordPolicy: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    maxAge: 90,
  },
  sessionManagement: {
    timeout: 30,
    maxConcurrentSessions: 3,
    requireReauthForSensitive: true,
  },
  ipWhitelist: {
    enabled: false,
    allowedIPs: [],
  },
};

export function SecurityManagement() {
  const [securityEvents, setSecurityEvents] = useState(mockSecurityEvents);
  const [blockedIPs, setBlockedIPs] = useState(mockBlockedIPs);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedSeverity, setSelectedSeverity] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [activeTab, setActiveTab] = useState("events");

  const filteredEvents = securityEvents.filter((event) => {
    const matchesSearch =
      event.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.ipAddress.includes(searchQuery) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || event.type === selectedType;
    const matchesSeverity =
      selectedSeverity === "all" || event.severity === selectedSeverity;
    const matchesStatus =
      selectedStatus === "all" || event.status === selectedStatus;

    return matchesSearch && matchesType && matchesSeverity && matchesStatus;
  });

  const handleSecurityAction = (eventId: number, action: string) => {
    console.log(`Action: ${action} for event: ${eventId}`);

    if (action === "block") {
      setSecurityEvents((prev) =>
        prev.map((event) =>
          event.id === eventId
            ? { ...event, blocked: true, status: "Blocked" }
            : event,
        ),
      );
    } else if (action === "unblock") {
      setSecurityEvents((prev) =>
        prev.map((event) =>
          event.id === eventId
            ? { ...event, blocked: false, status: "Resolved" }
            : event,
        ),
      );
    } else if (action === "investigate") {
      setSecurityEvents((prev) =>
        prev.map((event) =>
          event.id === eventId ? { ...event, status: "Investigated" } : event,
        ),
      );
    }
  };

  const handleIPAction = (ipId: number, action: string) => {
    console.log(`Action: ${action} for IP: ${ipId}`);

    if (action === "unblock") {
      setBlockedIPs((prev) =>
        prev.map((ip) => (ip.id === ipId ? { ...ip, status: "Expired" } : ip)),
      );
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-red-100 text-red-800";
      case "Investigated":
        return "bg-yellow-100 text-yellow-800";
      case "Resolved":
        return "bg-green-100 text-green-800";
      case "Blocked":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "High":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "Medium":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "Low":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Security Management
          </h1>
          <p className="text-gray-600">
            Monitor security events and manage access controls
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </button>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-red-500">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">High Severity</p>
              <p className="text-2xl font-bold text-gray-900">
                {securityEvents.filter((e) => e.severity === "High").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-yellow-500">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Medium Severity
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {securityEvents.filter((e) => e.severity === "Medium").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-red-500">
              <Ban className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Blocked IPs</p>
              <p className="text-2xl font-bold text-gray-900">
                {blockedIPs.filter((ip) => ip.status === "Active").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-500">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-gray-900">
                {securityEvents.filter((e) => e.status === "Resolved").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("events")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "events"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <AlertTriangle className="h-4 w-4 inline mr-2" />
              Security Events
            </button>
            <button
              onClick={() => setActiveTab("blocked-ips")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "blocked-ips"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Ban className="h-4 w-4 inline mr-2" />
              Blocked IPs
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "settings"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Settings className="h-4 w-4 inline mr-2" />
              Security Settings
            </button>
          </nav>
        </div>
      </div>

      {/* Security Events Tab */}
      {activeTab === "events" && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search security events..."
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
                  <option value="Failed Login">Failed Login</option>
                  <option value="Suspicious Activity">
                    Suspicious Activity
                  </option>
                  <option value="Password Reset">Password Reset</option>
                  <option value="Data Export">Data Export</option>
                  <option value="API Abuse">API Abuse</option>
                </select>
                <select
                  value={selectedSeverity}
                  onChange={(e) => setSelectedSeverity(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Severity</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Investigated">Investigated</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Blocked">Blocked</option>
                </select>
              </div>
            </div>
          </div>

          {/* Security Events Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Severity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      IP Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEvents.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-gray-400 mr-2" />
                          {event.timestamp}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {event.type}
                          </div>
                          <div className="text-sm text-gray-500">
                            {event.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getSeverityIcon(event.severity)}
                          <span
                            className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(event.severity)}`}
                          >
                            {event.severity}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {event.user}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                        {event.ipAddress}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(event.status)}`}
                        >
                          {event.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() =>
                              handleSecurityAction(event.id, "investigate")
                            }
                            className="text-gray-400 hover:text-gray-600"
                            title="Investigate"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {event.blocked ? (
                            <button
                              onClick={() =>
                                handleSecurityAction(event.id, "unblock")
                              }
                              className="text-gray-400 hover:text-gray-600"
                              title="Unblock"
                            >
                              <Unlock className="h-4 w-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                handleSecurityAction(event.id, "block")
                              }
                              className="text-gray-400 hover:text-gray-600"
                              title="Block"
                            >
                              <Ban className="h-4 w-4" />
                            </button>
                          )}
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
          </div>
        </div>
      )}

      {/* Blocked IPs Tab */}
      {activeTab === "blocked-ips" && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      IP Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reason
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Blocked At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Blocked By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {blockedIPs.map((ip) => (
                    <tr key={ip.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                        {ip.ipAddress}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {ip.reason}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {ip.blockedAt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {ip.blockedBy}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ip.status)}`}
                        >
                          {ip.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          {ip.status === "Active" && (
                            <button
                              onClick={() => handleIPAction(ip.id, "unblock")}
                              className="text-gray-400 hover:text-gray-600"
                              title="Unblock IP"
                            >
                              <Unlock className="h-4 w-4" />
                            </button>
                          )}
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
          </div>
        </div>
      )}

      {/* Security Settings Tab */}
      {activeTab === "settings" && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Security Settings
            </h3>
            <div className="space-y-6">
              {/* Two-Factor Authentication */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3">
                  Two-Factor Authentication
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Enable 2FA</span>
                    <input
                      type="checkbox"
                      checked={mockSecuritySettings.twoFactorAuth.enabled}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Required for Admins
                    </span>
                    <input
                      type="checkbox"
                      checked={
                        mockSecuritySettings.twoFactorAuth.requiredForAdmins
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Required for Users
                    </span>
                    <input
                      type="checkbox"
                      checked={
                        mockSecuritySettings.twoFactorAuth.requiredForUsers
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Password Policy */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3">
                  Password Policy
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Minimum Length
                    </label>
                    <input
                      type="number"
                      value={mockSecuritySettings.passwordPolicy.minLength}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Max Age (days)
                    </label>
                    <input
                      type="number"
                      value={mockSecuritySettings.passwordPolicy.maxAge}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={
                        mockSecuritySettings.passwordPolicy.requireUppercase
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      Require uppercase letters
                    </span>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={
                        mockSecuritySettings.passwordPolicy.requireLowercase
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      Require lowercase letters
                    </span>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={
                        mockSecuritySettings.passwordPolicy.requireNumbers
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      Require numbers
                    </span>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={
                        mockSecuritySettings.passwordPolicy.requireSpecialChars
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      Require special characters
                    </span>
                  </div>
                </div>
              </div>

              {/* Session Management */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3">
                  Session Management
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Session Timeout (minutes)
                    </label>
                    <input
                      type="number"
                      value={mockSecuritySettings.sessionManagement.timeout}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Max Concurrent Sessions
                    </label>
                    <input
                      type="number"
                      value={
                        mockSecuritySettings.sessionManagement
                          .maxConcurrentSessions
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={
                        mockSecuritySettings.sessionManagement
                          .requireReauthForSensitive
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      Require re-authentication for sensitive operations
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
