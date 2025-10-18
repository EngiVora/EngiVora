import type { Metadata } from "next";
import { notFound } from "next/navigation";
import OfferDetailClient from "./OfferDetailClient";

interface OfferPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Mock function to fetch offer by ID (replace with real API call)
async function getOfferById(id: string) {
  try {
    const mockOffers = [
      {
        id: "1",
        title: "20% off on select courses",
        description:
          "Expand your knowledge with our top-rated engineering courses. This exclusive offer gives you access to premium content at a significant discount.",
        longDescription: `
          <h2>About This Offer</h2>
          <p>Take advantage of our exclusive 20% discount on select engineering courses. This limited-time offer includes access to:</p>

          <ul>
            <li>Advanced Engineering Mathematics</li>
            <li>Circuit Analysis and Design</li>
            <li>Structural Engineering Fundamentals</li>
            <li>Digital Signal Processing</li>
            <li>Control Systems Engineering</li>
          </ul>

          <h3>What's Included</h3>
          <p>Each course includes:</p>
          <ul>
            <li>Video lectures from industry experts</li>
            <li>Interactive assignments and projects</li>
            <li>Certificate of completion</li>
            <li>Lifetime access to course materials</li>
            <li>Community forum access</li>
          </ul>

          <h3>How to Redeem</h3>
          <p>Simply click the "Claim Offer" button below and use the provided discount code at checkout. The discount will be automatically applied to eligible courses.</p>
        `,
        category: "courses",
        discountType: "percentage" as const,
        discountValue: 20,
        originalPrice: 299,
        discountedPrice: 239,
        savings: 60,
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCLiK0joKD2l9p83OCFHkN8OZ2R6UGDOXMq3Cn1RHx43SYJwxFly10Pt9G5cKjw98PlQVegI7P8zgWH781_jyAhsT-x5pp8J4Z4fgsdPYbAZk_XgZo8N41plbHomLP4qkg3Z2cx_dQjfPxu_dlWLa-6H2TGBwp9ihIhI76s3vtkAOOEjWrI0phHZCwIqUK1AwvLpIv57gbi8NyAxUhH6mqQJJeqLH_UuFlF4YsPN3dJ4Zq9D8V-T_t5IzOHkawmoh6XaueSotbGnMg",
        provider: "Engivora Academy",
        providerLogo: "https://via.placeholder.com/100x50",
        providerRating: 4.8,
        providerReviews: 2450,
        featured: true,
        validFrom: "2024-01-01T00:00:00Z",
        validUntil: "2024-12-31T23:59:59Z",
        couponCode: "COURSE20",
        maxUsage: 1000,
        currentUsage: 234,
        termsAndConditions: [
          "Valid for new students only",
          "Cannot be combined with other offers",
          "Discount applies to select courses only",
          "Valid until December 31, 2024",
        ],
        eligibility: [
          "Must be a registered Engivora member",
          "First-time course purchasers",
          "Valid student ID required",
        ],
        popularity: 95,
        tags: ["education", "engineering", "online learning", "certification"],
        relatedOffers: ["2", "4"],
      },
      {
        id: "2",
        title: "Free access to premium resources",
        description:
          "Get unlimited access to our library of articles, papers, and research materials for 30 days absolutely free.",
        longDescription: `
          <h2>Premium Resource Access</h2>
          <p>Unlock our entire premium resource library with this exclusive free trial. Access thousands of engineering documents, research papers, and study materials.</p>

          <h3>What You Get</h3>
          <ul>
            <li>Access to 10,000+ engineering papers</li>
            <li>Exclusive industry reports</li>
            <li>Advanced calculation tools</li>
            <li>Priority customer support</li>
          </ul>
        `,
        category: "resources",
        discountType: "free" as const,
        discountValue: 0,
        originalPrice: 49,
        discountedPrice: 0,
        savings: 49,
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuAHizWWhTVHfQ_PKQEc7h4LnLtfVjPSXwcE7atFX1yzshoGImb55qmNPaghdGl-ZKe0KJbigYLx6SJGjmvgwBJfCw9LHT2RtJpcO53Rw3GlCi4lXg-T3BUYAo9RoiUGeMTIQE4HqAjZ2x2WHarIffoyqCBGvxlt0O1nU80Y0PeF-U32IHTGzjna9Sra01aAAMXrUlz1RfuemdGvmY-XkgqqIou7mFlvXf-XPXPFjEmZeCtiu9knLx3PO-8626mBrIgwGZpzQS34-G0",
        provider: "Academic Hub",
        providerLogo: "https://via.placeholder.com/100x50",
        providerRating: 4.6,
        providerReviews: 1850,
        featured: true,
        validFrom: "2024-01-01T00:00:00Z",
        validUntil: "2024-12-31T23:59:59Z",
        couponCode: "FREEPREMIUM",
        maxUsage: 5000,
        currentUsage: 892,
        termsAndConditions: [
          "30-day free trial",
          "Credit card required for signup",
          "Cancel anytime during trial period",
        ],
        eligibility: ["New subscribers only", "Valid email address required"],
        popularity: 87,
        tags: ["resources", "research", "free trial", "premium"],
        relatedOffers: ["1", "3"],
      },
      {
        id: "3",
        title: "Exclusive discounts on lab equipment",
        description:
          "Gear up your lab with top-quality equipment at discounted prices. Professional-grade instruments at student-friendly rates.",
        longDescription: `
          <h2>Lab Equipment Sale</h2>
          <p>Equip your laboratory with professional-grade instruments at unbeatable prices. This exclusive partnership offer gives you access to premium equipment.</p>

          <h3>Available Equipment</h3>
          <ul>
            <li>Digital Multimeters</li>
            <li>Oscilloscopes</li>
            <li>Function Generators</li>
            <li>Power Supplies</li>
            <li>Measurement Tools</li>
          </ul>
        `,
        category: "equipment",
        discountType: "percentage" as const,
        discountValue: 15,
        originalPrice: 1999,
        discountedPrice: 1699,
        savings: 300,
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuAH9v1fMfK3Bopk9alh_JmBLoxOpSzZYhKaSUEr6bSIRJUDKhAjzeOwdEzzGkZUNJsto9O0r62Zzb_23zDYd_kh6tKvgfYoBYC11aDjseWuvBNLvfOva4AANnpLwbu8TUXYvUzQ2wpQR4uuzPBQadpV72KWIkguL5vrfzpXSei9YGEYRC0NxaBwWMxjluFLrDyiRCD6-lI6kh-rFXv8-IoqqFPi2jFcBMlxMcePZcE1UL8SWOZyaIOv9dO8LI9Ay_b702OqoX2noSg",
        provider: "TechLab Solutions",
        providerLogo: "https://via.placeholder.com/100x50",
        providerRating: 4.9,
        providerReviews: 3200,
        featured: true,
        validFrom: "2024-01-01T00:00:00Z",
        validUntil: "2024-11-30T23:59:59Z",
        couponCode: "LABGEAR15",
        maxUsage: 500,
        currentUsage: 156,
        termsAndConditions: [
          "Valid on select equipment only",
          "Minimum order value $500",
          "Cannot be combined with other offers",
        ],
        eligibility: [
          "Educational institutions",
          "Student ID verification required",
        ],
        popularity: 78,
        tags: ["equipment", "laboratory", "instruments", "education"],
        relatedOffers: ["4"],
      },
      {
        id: "4",
        title: "Student Software Pack",
        description:
          "Access essential engineering software for free with valid student ID. Professional tools for learning and development.",
        longDescription: `
          <h2>Student Software Bundle</h2>
          <p>Get access to industry-standard engineering software at no cost. This comprehensive package includes everything you need for your studies.</p>

          <h3>Included Software</h3>
          <ul>
            <li>MATLAB & Simulink</li>
            <li>AutoCAD</li>
            <li>SolidWorks</li>
            <li>ANSYS Student</li>
            <li>LabVIEW</li>
          </ul>
        `,
        category: "software",
        discountType: "fixed" as const,
        discountValue: 0,
        originalPrice: 599,
        discountedPrice: 0,
        savings: 599,
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuAKkjl5tAIsUCq9RwMkFg75cwsVHfe0eFNBMW2XxMBz2RCK2ttp-CzMb8oUzzdfz9leO7XML7kmRvvpaujOmJ4RXPDaKsw2WiKE7gfgpP7iDaoN1eISCoycyg3Ih7pq7-24vYYK2YXsWyr3DLS2i0rzEj0rZePsAVcbV8IbnKMxIIPLFoU7QXYZQ7q8ACePJgGX_nDTlQKMEyqgJDhMmAZFidDG8xeTn1yOgo8c5i9maqOn8cSAVvrx7Ol1j8Hnj8O5kBcf6s_iMQs",
        provider: "Software Depot",
        providerLogo: "https://via.placeholder.com/100x50",
        providerRating: 4.7,
        providerReviews: 1920,
        featured: true,
        validFrom: "2024-01-01T00:00:00Z",
        validUntil: "2024-12-31T23:59:59Z",
        couponCode: "STUDENTSOFTWARE",
        maxUsage: 10000,
        currentUsage: 5643,
        termsAndConditions: [
          "Valid student ID required",
          "Educational use only",
          "One license per student",
        ],
        eligibility: [
          "Currently enrolled students",
          "Valid .edu email address",
        ],
        popularity: 92,
        tags: ["software", "student", "engineering", "free"],
        relatedOffers: ["1", "2"],
      },
    ];

    return mockOffers.find((offer) => offer.id === id);
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
