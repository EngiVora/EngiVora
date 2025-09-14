'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

// Types for statistics
type StatCard = {
  title: string;
  value: number;
  icon: string;
  href: string;
};

export default function AdminDashboard() {
  const { token } = useAdminAuth();
  const [stats, setStats] = useState<StatCard[]>([
    { title: 'Total Users', value: 0, icon: '👥', href: '/admin/users' },
    { title: 'Blog Posts', value: 0, icon: '📝', href: '/admin/blogs' },
    { title: 'Job Listings', value: 0, icon: '💼', href: '/admin/jobs' },
    { title: 'Exam Notifications', value: 0, icon: '📚', href: '/admin/exams' },
  ]);
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real application, you would fetch actual statistics from your API
    const fetchStats = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data - in a real app, you would fetch this from your API
        setStats([
          { title: 'Total Users', value: 1250, icon: '👥', href: '/admin/users' },
          { title: 'Blog Posts', value: 83, icon: '📝', href: '/admin/blogs' },
          { title: 'Job Listings', value: 42, icon: '💼', href: '/admin/jobs' },
          { title: 'Exam Notifications', value: 28, icon: '📚', href: '/admin/exams' },
        ]);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to the EngiVora admin panel</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Link href={stat.href} key={index}>
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-700">{stat.title}</h2>
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <div className="flex items-end justify-between">
                <p className="text-3xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickActionButton href="/admin/blogs/new" icon="📝" label="Create Blog Post" />
          <QuickActionButton href="/admin/jobs/new" icon="💼" label="Add Job Listing" />
          <QuickActionButton href="/admin/exams/new" icon="📚" label="Add Exam" />
          <QuickActionButton href="/admin/discounts/new" icon="🏷️" label="Create Discount" />
          <QuickActionButton href="/admin/users/new" icon="👤" label="Add User" />
        </div>
      </div>
    </div>
  );
}

function QuickActionButton({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <Link href={href}>
      <div className="flex items-center p-3 rounded-md hover:bg-gray-50 border border-gray-200 transition-colors cursor-pointer">
        <span className="text-xl mr-3">{icon}</span>
        <span className="font-medium text-gray-800">{label}</span>
      </div>
    </Link>
  );
}