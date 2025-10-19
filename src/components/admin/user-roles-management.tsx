"use client"

import { useState } from "react"
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Edit,
  Trash2,
  Plus,
  Shield,
  User,
  Users,
  Crown,
  Settings,
  Download,
  Upload,
  CheckCircle,
  Lock,
  Unlock
} from "lucide-react"

const mockRoles = [
  {
    id: 1,
    name: "Super Admin",
    description: "Full system access with all permissions",
    permissions: [
      "user.create", "user.read", "user.update", "user.delete",
      "role.create", "role.read", "role.update", "role.delete",
      "system.read", "system.update", "system.delete",
      "analytics.read", "logs.read", "settings.update"
    ],
    userCount: 2,
    isSystem: true,
    isActive: true,
    createdAt: "2024-01-01",
    lastModified: "2024-01-10"
  },
  {
    id: 2,
    name: "Admin",
    description: "Administrative access with most permissions",
    permissions: [
      "user.create", "user.read", "user.update", "user.delete",
      "role.read", "role.update",
      "system.read", "analytics.read", "logs.read", "settings.update"
    ],
    userCount: 5,
    isSystem: false,
    isActive: true,
    createdAt: "2024-01-01",
    lastModified: "2024-01-08"
  },
  {
    id: 3,
    name: "Moderator",
    description: "Content moderation and user management",
    permissions: [
      "user.read", "user.update",
      "content.read", "content.update", "content.delete",
      "reports.read", "reports.update"
    ],
    userCount: 8,
    isSystem: false,
    isActive: true,
    createdAt: "2024-01-02",
    lastModified: "2024-01-05"
  },
  {
    id: 4,
    name: "Editor",
    description: "Content creation and editing permissions",
    permissions: [
      "content.create", "content.read", "content.update",
      "media.upload", "media.read"
    ],
    userCount: 12,
    isSystem: false,
    isActive: true,
    createdAt: "2024-01-03",
    lastModified: "2024-01-12"
  },
  {
    id: 5,
    name: "Viewer",
    description: "Read-only access to most content",
    permissions: [
      "content.read", "analytics.read", "reports.read"
    ],
    userCount: 25,
    isSystem: false,
    isActive: true,
    createdAt: "2024-01-04",
    lastModified: "2024-01-15"
  },
  {
    id: 6,
    name: "Guest",
    description: "Limited access for temporary users",
    permissions: [
      "content.read"
    ],
    userCount: 0,
    isSystem: false,
    isActive: false,
    createdAt: "2024-01-05",
    lastModified: "2024-01-14"
  }
]

const mockPermissions = [
  { id: "user.create", name: "Create Users", category: "User Management" },
  { id: "user.read", name: "View Users", category: "User Management" },
  { id: "user.update", name: "Edit Users", category: "User Management" },
  { id: "user.delete", name: "Delete Users", category: "User Management" },
  { id: "role.create", name: "Create Roles", category: "Role Management" },
  { id: "role.read", name: "View Roles", category: "Role Management" },
  { id: "role.update", name: "Edit Roles", category: "Role Management" },
  { id: "role.delete", name: "Delete Roles", category: "Role Management" },
  { id: "content.create", name: "Create Content", category: "Content Management" },
  { id: "content.read", name: "View Content", category: "Content Management" },
  { id: "content.update", name: "Edit Content", category: "Content Management" },
  { id: "content.delete", name: "Delete Content", category: "Content Management" },
  { id: "system.read", name: "View System Info", category: "System" },
  { id: "system.update", name: "Update System", category: "System" },
  { id: "system.delete", name: "Delete System Data", category: "System" },
  { id: "analytics.read", name: "View Analytics", category: "Analytics" },
  { id: "logs.read", name: "View Logs", category: "Logs" },
  { id: "settings.update", name: "Update Settings", category: "Settings" },
  { id: "media.upload", name: "Upload Media", category: "Media" },
  { id: "media.read", name: "View Media", category: "Media" },
  { id: "reports.read", name: "View Reports", category: "Reports" },
  { id: "reports.update", name: "Update Reports", category: "Reports" }
]

export function UserRolesManagement() {
  const [roles, setRoles] = useState(mockRoles)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedRoles, setSelectedRoles] = useState<number[]>([])
  const [activeTab, setActiveTab] = useState("roles")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingRole, setEditingRole] = useState<typeof mockRoles[0] | null>(null)

  const filteredRoles = roles.filter(role => {
    const matchesSearch = role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         role.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === "all" || 
                         (selectedStatus === "active" && role.isActive) ||
                         (selectedStatus === "inactive" && !role.isActive)
    const matchesType = selectedType === "all" || 
                       (selectedType === "system" && role.isSystem) ||
                       (selectedType === "custom" && !role.isSystem)
    
    return matchesSearch && matchesStatus && matchesType
  })

  const handleSelectRole = (roleId: number) => {
    setSelectedRoles(prev => 
      prev.includes(roleId) 
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    )
  }

  const handleSelectAll = () => {
    setSelectedRoles(
      selectedRoles.length === filteredRoles.length 
        ? [] 
        : filteredRoles.map(role => role.id)
    )
  }

  const handleRoleAction = (roleId: number, action: string) => {
    console.log(`Action: ${action} for role: ${roleId}`)
    
    if (action === "toggle-status") {
      setRoles(prev => prev.map(role => 
        role.id === roleId ? { ...role, isActive: !role.isActive } : role
      ))
    } else if (action === "edit") {
      const role = roles.find(r => r.id === roleId)
      if (role) {
        setEditingRole(role)
        setShowCreateModal(true)
      }
    } else if (action === "delete") {
      setRoles(prev => prev.filter(role => role.id !== roleId))
    }
  }

  const getStatusColor = (isActive: boolean) => {
    return isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
  }

  const getTypeColor = (isSystem: boolean) => {
    return isSystem ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
  }

  const getRoleIcon = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case "super admin": return <Crown className="h-4 w-4" />
      case "admin": return <Shield className="h-4 w-4" />
      case "moderator": return <Users className="h-4 w-4" />
      case "editor": return <Edit className="h-4 w-4" />
      case "viewer": return <Eye className="h-4 w-4" />
      case "guest": return <User className="h-4 w-4" />
      default: return <Settings className="h-4 w-4" />
    }
  }

  const getPermissionCategories = () => {
    return [...new Set(mockPermissions.map(p => p.category))]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Roles Management</h1>
          <p className="text-gray-600">Manage user roles and permissions</p>
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
            New Role
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-500">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Roles</p>
              <p className="text-2xl font-bold text-gray-900">{roles.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-500">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Roles</p>
              <p className="text-2xl font-bold text-gray-900">
                {roles.filter(r => r.isActive).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-500">
              <Crown className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">System Roles</p>
              <p className="text-2xl font-bold text-gray-900">
                {roles.filter(r => r.isSystem).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-yellow-500">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {roles.reduce((sum, role) => sum + role.userCount, 0)}
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
              onClick={() => setActiveTab("roles")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "roles"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Shield className="h-4 w-4 inline mr-2" />
              Roles
            </button>
            <button
              onClick={() => setActiveTab("permissions")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "permissions"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Settings className="h-4 w-4 inline mr-2" />
              Permissions
            </button>
          </nav>
        </div>
      </div>

      {/* Roles Tab */}
      {activeTab === "roles" && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search roles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="system">System Roles</option>
                  <option value="custom">Custom Roles</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                {selectedRoles.length > 0 && (
                  <span className="text-sm text-gray-600">
                    {selectedRoles.length} selected
                  </span>
                )}
                <button className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </button>
              </div>
            </div>
          </div>

          {/* Roles Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedRoles.length === filteredRoles.length && filteredRoles.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Users
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Permissions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Modified
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRoles.map((role) => (
                    <tr key={role.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedRoles.includes(role.id)}
                          onChange={() => handleSelectRole(role.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            {getRoleIcon(role.name)}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{role.name}</div>
                            <div className="text-sm text-gray-500">{role.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(role.isSystem)}`}>
                          {role.isSystem ? "System" : "Custom"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(role.isActive)}`}>
                          {role.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {role.userCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {role.permissions.length}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(role.lastModified).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleRoleAction(role.id, "view")}
                            className="text-gray-400 hover:text-gray-600"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleRoleAction(role.id, "edit")}
                            className="text-gray-400 hover:text-gray-600"
                            title="Edit Role"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleRoleAction(role.id, "toggle-status")}
                            className={`hover:text-gray-600 ${
                              role.isActive ? "text-green-400" : "text-red-400"
                            }`}
                            title={role.isActive ? "Deactivate" : "Activate"}
                          >
                            {role.isActive ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                          </button>
                          {!role.isSystem && (
                            <button
                              onClick={() => handleRoleAction(role.id, "delete")}
                              className="text-gray-400 hover:text-red-600"
                              title="Delete Role"
                            >
                              <Trash2 className="h-4 w-4" />
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

      {/* Permissions Tab */}
      {activeTab === "permissions" && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Available Permissions</h3>
            <div className="space-y-6">
              {getPermissionCategories().map(category => (
                <div key={category}>
                  <h4 className="font-medium text-gray-700 mb-3">{category}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {mockPermissions
                      .filter(p => p.category === category)
                      .map(permission => (
                        <div key={permission.id} className="flex items-center p-3 border border-gray-200 rounded-md">
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">{permission.name}</div>
                            <div className="text-xs text-gray-500">{permission.id}</div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Role Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingRole ? "Edit Role" : "Create New Role"}
              </h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
                  <input
                    type="text"
                    defaultValue={editingRole?.name || ""}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter role name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    defaultValue={editingRole?.description || ""}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter role description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                  <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md p-3">
                    {getPermissionCategories().map(category => (
                      <div key={category} className="mb-3">
                        <h5 className="font-medium text-gray-700 text-sm mb-2">{category}</h5>
                        <div className="space-y-1">
                          {mockPermissions
                            .filter(p => p.category === category)
                            .map(permission => (
                              <label key={permission.id} className="flex items-center">
                                <input
                                  type="checkbox"
                                  defaultChecked={editingRole?.permissions?.includes(permission.id) || false}
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">{permission.name}</span>
                              </label>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false)
                      setEditingRole(null)
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {editingRole ? "Update Role" : "Create Role"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
