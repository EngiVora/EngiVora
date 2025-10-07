import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Engivora - Jobs",
  description: "Discover engineering jobs, internships, and opportunities tailored for students.",
}

export default function JobsLayout({ children }: { children: React.ReactNode }) {
  return children
}


