"use client"

import dynamic from 'next/dynamic'
import React, { ComponentType } from 'react'

// Lazy load heavy components
export const LazyJobManagement = dynamic(() => import('./admin/job-management').then(mod => ({ default: mod.JobManagement })), {
  loading: () => <div className="animate-pulse bg-gray-200 rounded h-64" />,
  ssr: false
})

export const LazyBlogManagement = dynamic(() => import('./admin/blog-management').then(mod => ({ default: mod.BlogManagement })), {
  loading: () => <div className="animate-pulse bg-gray-200 rounded h-64" />,
  ssr: false
})

export const LazyUserManagement = dynamic(() => import('./admin/user-management').then(mod => ({ default: mod.UserManagement })), {
  loading: () => <div className="animate-pulse bg-gray-200 rounded h-64" />,
  ssr: false
})

export const LazyAdminDashboard = dynamic(() => import('./admin/admin-dashboard').then(mod => ({ default: mod.AdminDashboard })), {
  loading: () => <div className="animate-pulse bg-gray-200 rounded h-96" />,
  ssr: false
})

// Lazy load charts and heavy visualizations
// export const LazyCharts = dynamic(() => import('./charts/chart-container'), {
//   loading: () => <div className="animate-pulse bg-gray-200 rounded h-48" />,
//   ssr: false
// })

// Lazy load modals
// export const LazyJobModal = dynamic(() => import('./modals/job-modal'), {
//   loading: () => <div className="animate-pulse bg-gray-200 rounded h-32" />,
//   ssr: false
// })

// export const LazyBlogModal = dynamic(() => import('./modals/blog-modal'), {
//   loading: () => <div className="animate-pulse bg-gray-200 rounded h-32" />,
//   ssr: false
// })

// Lazy load forms
// export const LazyContactForm = dynamic(() => import('./forms/contact-form'), {
//   loading: () => <div className="animate-pulse bg-gray-200 rounded h-48" />,
//   ssr: false
// })

// export const LazySearchForm = dynamic(() => import('./forms/search-form'), {
//   loading: () => <div className="animate-pulse bg-gray-200 rounded h-24" />,
//   ssr: false
// })

// Utility function for creating lazy components with custom loading
export function createLazyComponent<T extends object>(
  importFunc: () => Promise<{ default: ComponentType<T> }>,
  fallback?: ComponentType
) {
  return dynamic(importFunc, {
    loading: fallback ? () => React.createElement(fallback) : () => <div className="animate-pulse bg-gray-200 rounded h-32" />,
    ssr: false
  })
}

// Preload critical components
export function preloadComponents() {
  if (typeof window !== 'undefined') {
    // Preload admin components when user is likely to access them
    const adminComponents = [
      () => import('./admin/admin-dashboard'),
      () => import('./admin/job-management'),
      () => import('./admin/user-management')
    ]
    
    // Preload after initial page load
    setTimeout(() => {
      adminComponents.forEach(importFunc => {
        importFunc().catch(() => {
          // Silently fail preloading
        })
      })
    }, 2000)
  }
}
