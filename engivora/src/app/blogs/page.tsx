import type { Metadata } from "next"
import React from "react"
import BlogsClient from "./BlogsClient"

export const metadata: Metadata = {
  title: "Engivora - Blogs",
  description: "Insights and articles for engineering students: trends, guides, and tips.",
}

export default function BlogsPage() {
  return <BlogsClient />
}


