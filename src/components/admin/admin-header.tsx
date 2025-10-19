"use client";

import { useState } from "react";
import { Bell, Search, User, Settings, LogOut } from "lucide-react";
import { AdminThemeToggle } from "./admin-theme-toggle";

export function AdminHeader() {
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications] = useState([
    {
      id: 1,
      message: "New user registration",
      time: "2 min ago",
      unread: true,
    },
    { 
      id: 2, 
      message: "Blog post published", 
      time: "1 hour ago", 
      unread: true 
    },
    {
      id: 3,
      message: "System backup completed",
      time: "3 hours ago",
      unread: false,
    },
  ]);

  // No authentication needed - admin panel is open access
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Search */}
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users, content, settings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Theme toggle */}
          <AdminThemeToggle />

          {/* Notifications */}
          <div className="relative">
            <button
              className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 relative"
              aria-label="View notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              className="flex items-center space-x-3 p-2 text-gray-700 hover:bg-gray-100 rounded-md"
              aria-label="User profile menu"
            >
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-gray-500">admin@engivora.com</p>
              </div>
            </button>
          </div>

          {/* Quick actions */}
          <div className="flex items-center space-x-2">
            <button
              className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
              aria-label="Settings"
            >
              <Settings className="h-5 w-5" />
            </button>
            <button
              className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
              aria-label="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}