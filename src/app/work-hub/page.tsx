 

import type { Metadata } from "next"
import WorkHubClient from "./WorkHubClient"

export const metadata: Metadata = {
  title: "Engivora - Work Hub",
  description: "Explore projects and opportunities to enhance your engineering skills.",
}

export default function WorkHubPage() {
  return <WorkHubClient />
}


