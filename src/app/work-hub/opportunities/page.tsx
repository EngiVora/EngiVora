import type { Metadata } from "next"
import OpportunitiesClient from "./OpportunitiesClient"

export const metadata: Metadata = {
  title: "Opportunities - EngiVora Work Hub",
  description: "Browse all available engineering opportunities including internships, research positions, volunteer work, competitions, and hackathons.",
}

export default function OpportunitiesPage() {
  return <OpportunitiesClient />
}
