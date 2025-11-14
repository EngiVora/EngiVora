"use client"

import { useEffect } from 'react'
import { registerServiceWorker } from '@/utils/service-worker'

export function ServiceWorkerRegistration() {
  useEffect(() => {
    // Register service worker
    registerServiceWorker()
  }, [])

  return null
}
