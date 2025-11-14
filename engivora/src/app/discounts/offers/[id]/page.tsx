import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connectToDatabase } from "@/lib/db";
import { Discount } from "@/models/Discount";
import OfferDetailClient from "./OfferDetailClient";

interface OfferPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Fetch offer by ID from database
async function getOfferById(id: string) {
  try {
    await connectToDatabase();
    
    // Next.js 15 automatically decodes URL parameters, so id is already decoded
    // Try to find by ID first
    let discount = await Discount.findById(id);

    // If not found by ID, try to find by code (in case ID is actually a code)
    if (!discount) {
      discount = await Discount.findOne({ code: id });
    }

    // If still not found, try case-insensitive code search
    if (!discount) {
      // Escape special regex characters
      const escapedId = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      discount = await Discount.findOne({ 
        code: { $regex: new RegExp(`^${escapedId}$`, 'i') } 
      });
    }

    if (!discount) {
      console.error(`Discount not found with id: ${id}`);
      return null;
    }

    // Transform database model to match OfferDetailClient interface
    return {
      id: discount._id.toString(),
      title: discount.title,
      description: discount.description || discount.title,
      longDescription: discount.description ? `
        <h2>About This Offer</h2>
        <p>${discount.description}</p>
        ${discount.termsAndConditions && discount.termsAndConditions.length > 0 ? `
        <h3>Terms and Conditions</h3>
        <ul>
          ${discount.termsAndConditions.map((term: string) => `<li>${term}</li>`).join('')}
        </ul>
        ` : ''}
        ${discount.eligibility && discount.eligibility.length > 0 ? `
        <h3>Eligibility</h3>
        <ul>
          ${discount.eligibility.map((el: string) => `<li>${el}</li>`).join('')}
        </ul>
        ` : ''}
      ` : '<p>No additional details available.</p>',
      category: discount.category || "general",
      discountType: discount.discountType || "percentage",
      discountValue: discount.discountValue || 0,
      originalPrice: discount.originalPrice,
      discountedPrice: discount.discountedPrice,
      savings: (discount.originalPrice || 0) - (discount.discountedPrice || 0),
      image: discount.imageUrl || "/images/discount-placeholder.svg",
      provider: discount.provider,
      providerLogo: discount.imageUrl || "/images/discount-placeholder.svg",
      providerRating: 4.5,
      providerReviews: 100,
      featured: discount.featured || false,
      validFrom: discount.validFrom ? new Date(discount.validFrom).toISOString() : new Date().toISOString(),
      validUntil: discount.validUntil ? new Date(discount.validUntil).toISOString() : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      couponCode: discount.code,
      maxUsage: discount.maxUsage,
      currentUsage: 0,
      termsAndConditions: discount.termsAndConditions || [],
      eligibility: discount.eligibility || [],
      popularity: 80,
      tags: discount.category ? [discount.category] : [],
      relatedOffers: [],
    };
  } catch (error) {
    console.error("Error fetching offer:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: OfferPageProps): Promise<Metadata> {
  const { id } = await params;
  const offer = await getOfferById(id);

  if (!offer) {
    return {
      title: "Offer Not Found - Engivora",
      description: "The requested offer could not be found.",
    };
  }

  return {
    title: `${offer.title} - Engivora Offers`,
    description: offer.description,
    keywords: offer.tags.join(", "),
    openGraph: {
      title: offer.title,
      description: offer.description,
      images: [offer.image],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: offer.title,
      description: offer.description,
      images: [offer.image],
    },
  };
}

export default async function OfferPage({ params }: OfferPageProps) {
  const { id } = await params;
  const offer = await getOfferById(id);

  if (!offer) {
    notFound();
  }

  return <OfferDetailClient offer={offer} />;
}
