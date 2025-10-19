import type { Metadata } from "next";
import ProjectDetailClient from "./ProjectDetailClient";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  // In a real app, you'd fetch the project data here
  return {
    title: `Project Details - EngiVora Work Hub`,
    description: `View project details and join the team`,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  return <ProjectDetailClient projectId={id} />;
}
