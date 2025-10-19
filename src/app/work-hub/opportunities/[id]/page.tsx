import type { Metadata } from "next";
import OpportunityDetailClient from "./OpportunityDetailClient";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  // In a real app, you'd fetch the opportunity data here
  return {
    title: `Opportunity Details - EngiVora Work Hub`,
    description: `View opportunity details and apply`,
  };
}

export default async function OpportunityDetailPage({ params }: Props) {
  const { id } = await params;
  return <OpportunityDetailClient opportunityId={id} />;
}
