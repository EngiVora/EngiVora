"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Copy,
  Check,
  Heart,
  Share,
  Clock,
  Users,
  Star,
  Tag,
  Gift,
  Calendar,
  ExternalLink,
  Shield,
  CheckCircle,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

interface Offer {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  category: string;
  discountType: "percentage" | "fixed" | "free" | "bogo";
  discountValue: number;
  originalPrice?: number;
  discountedPrice?: number;
  savings: number;
  image: string;
  provider: string;
  providerLogo: string;
  providerRating: number;
  providerReviews: number;
  featured: boolean;
  validFrom: string;
  validUntil: string;
  couponCode?: string;
  maxUsage?: number;
  currentUsage: number;
  termsAndConditions: string[];
  eligibility: string[];
  popularity: number;
  tags: string[];
  relatedOffers: string[];
}

interface OfferDetailClientProps {
  offer: Offer;
}

export default function OfferDetailClient({ offer }: OfferDetailClientProps) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "description" | "terms" | "reviews"
  >("description");

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleClaimOffer = () => {
    // Track offer claim
    console.log(`Claimed offer: ${offer.title}`);

    // Navigate to provider or show claim modal
    if (offer.couponCode) {
      copyToClipboard(offer.couponCode);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDiscountBadge = () => {
    if (offer.discountType === "free") {
      return (
        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
          FREE
        </span>
      );
    }
    if (offer.discountType === "percentage") {
      return (
        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
          {offer.discountValue}% OFF
        </span>
      );
    }
    return null;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      courses: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      resources: "bg-green-500/20 text-green-400 border-green-500/30",
      equipment: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      software: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    };
    return colors[category as keyof typeof colors] || colors.courses;
  };

  const usagePercentage = offer.maxUsage
    ? (offer.currentUsage / offer.maxUsage) * 100
    : 0;

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      <main className="px-6 sm:px-10 lg:px-24 xl:px-40 flex-1 py-12">
        <div className="mx-auto max-w-6xl">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link
              href="/discounts"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-sky-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Offers
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Offer Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mb-8"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={offer.providerLogo}
                      alt={offer.provider}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(offer.category)}`}
                      >
                        {offer.category.charAt(0).toUpperCase() +
                          offer.category.slice(1)}
                      </span>
                      {getDiscountBadge()}
                      {offer.featured && (
                        <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          FEATURED
                        </span>
                      )}
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-bold mb-3">
                      {offer.title}
                    </h1>
                    <p className="text-slate-400 text-lg leading-relaxed">
                      {offer.description}
                    </p>
                  </div>
                </div>

                {/* Provider Info */}
                <div className="flex items-center gap-4 p-4 bg-slate-900 border border-slate-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-400">by</span>
                    <span className="font-medium">{offer.provider}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(offer.providerRating)
                            ? "text-yellow-400 fill-current"
                            : "text-slate-600"
                        }`}
                      />
                    ))}
                    <span className="text-sm text-slate-400 ml-2">
                      {offer.providerRating} ({offer.providerReviews} reviews)
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Offer Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-8"
              >
                <div className="aspect-video rounded-xl overflow-hidden relative">
                  <Image
                    src={offer.image}
                    alt={offer.title}
                    fill
                    sizes="(min-width: 1024px) 66vw, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-white">
                        <TrendingUp className="w-5 h-5" />
                        <span className="font-semibold">
                          {offer.popularity}% popularity
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setIsLiked(!isLiked)}
                          className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                            isLiked
                              ? "bg-red-500 text-white"
                              : "bg-black/50 text-white hover:bg-red-500"
                          }`}
                        >
                          <Heart className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setShowShareModal(!showShareModal)}
                          className="p-2 rounded-full bg-black/50 text-white hover:bg-sky-500 backdrop-blur-sm transition-colors"
                        >
                          <Share className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Tab Navigation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mb-8"
              >
                <div className="flex gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg w-fit">
                  <button
                    onClick={() => setActiveTab("description")}
                    className={`px-6 py-3 rounded-md font-medium transition-colors ${
                      activeTab === "description"
                        ? "bg-sky-600 text-white"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                    }`}
                  >
                    Description
                  </button>
                  <button
                    onClick={() => setActiveTab("terms")}
                    className={`px-6 py-3 rounded-md font-medium transition-colors ${
                      activeTab === "terms"
                        ? "bg-sky-600 text-white"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                    }`}
                  >
                    Terms & Conditions
                  </button>
                  <button
                    onClick={() => setActiveTab("reviews")}
                    className={`px-6 py-3 rounded-md font-medium transition-colors ${
                      activeTab === "reviews"
                        ? "bg-sky-600 text-white"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                    }`}
                  >
                    Reviews
                  </button>
                </div>
              </motion.div>

              {/* Tab Content */}
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-8"
              >
                {activeTab === "description" && (
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div
                      className="prose prose-slate prose-invert max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: offer.longDescription,
                      }}
                    />

                    {/* Tags */}
                    <div className="mt-6 pt-6 border-t border-slate-800">
                      <h4 className="text-lg font-semibold mb-3">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {offer.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-sm"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "terms" && (
                  <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                      <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-blue-400" />
                        Terms & Conditions
                      </h4>
                      <ul className="space-y-3">
                        {offer.termsAndConditions.map((term, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-300">{term}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                      <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-green-400" />
                        Eligibility Requirements
                      </h4>
                      <ul className="space-y-3">
                        {offer.eligibility.map((requirement, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-300">
                              {requirement}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h4 className="text-lg font-semibold mb-6">
                      Customer Reviews
                    </h4>

                    {/* Review Summary */}
                    <div className="flex items-center gap-6 mb-6 pb-6 border-b border-slate-800">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-sky-400">
                          {offer.providerRating}
                        </div>
                        <div className="flex items-center justify-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(offer.providerRating)
                                  ? "text-yellow-400 fill-current"
                                  : "text-slate-600"
                              }`}
                            />
                          ))}
                        </div>
                        <div className="text-sm text-slate-400 mt-1">
                          {offer.providerReviews} reviews
                        </div>
                      </div>
                    </div>

                    {/* Sample Reviews */}
                    <div className="space-y-4">
                      <div className="p-4 bg-slate-800 rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center text-white font-bold">
                            J
                          </div>
                          <div>
                            <div className="font-medium">John D.</div>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className="w-3 h-3 text-yellow-400 fill-current"
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-slate-300 text-sm">
                          &quot;Excellent offer! The discount was applied
                          seamlessly and the quality exceeded my expectations.
                          Highly recommend!&quot;
                        </p>
                      </div>

                      <div className="p-4 bg-slate-800 rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                            S
                          </div>
                          <div>
                            <div className="font-medium">Sarah M.</div>
                            <div className="flex items-center gap-1">
                              {[...Array(4)].map((_, i) => (
                                <Star
                                  key={i}
                                  className="w-3 h-3 text-yellow-400 fill-current"
                                />
                              ))}
                              <Star className="w-3 h-3 text-slate-600" />
                            </div>
                          </div>
                        </div>
                        <p className="text-slate-300 text-sm">
                          &quot;Great value for money. The process was
                          straightforward and customer support was
                          helpful.&quot;
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Pricing Card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg"
                >
                  <div className="text-center mb-6">
                    {offer.originalPrice && offer.originalPrice > 0 ? (
                      <>
                        <div className="text-3xl font-bold text-green-400 mb-2">
                          ${offer.discountedPrice || 0}
                        </div>
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <span className="text-lg text-slate-500 line-through">
                            ${offer.originalPrice}
                          </span>
                          <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-sm font-medium">
                            Save ${offer.savings}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="text-3xl font-bold text-green-400 mb-2">
                        FREE
                      </div>
                    )}
                  </div>

                  {/* Coupon Code */}
                  {offer.couponCode && (
                    <div className="mb-6 p-4 bg-slate-800 rounded-lg">
                      <div className="text-sm text-slate-400 mb-2">
                        Coupon Code
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 bg-slate-700 px-3 py-2 rounded font-mono text-sky-400">
                          {offer.couponCode}
                        </code>
                        <button
                          onClick={() => copyToClipboard(offer.couponCode!)}
                          className="p-2 bg-sky-600 hover:bg-sky-500 rounded transition-colors"
                        >
                          {copiedCode ? (
                            <Check className="w-4 h-4 text-white" />
                          ) : (
                            <Copy className="w-4 h-4 text-white" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Usage Progress */}
                  {offer.maxUsage && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-400">Usage</span>
                        <span className="text-sm text-slate-400">
                          {offer.currentUsage}/{offer.maxUsage}
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2">
                        <div
                          className="bg-sky-500 h-2 rounded-full transition-all"
                          style={{
                            width: `${Math.min(usagePercentage, 100)}%`,
                          }}
                        />
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        {Math.round(usagePercentage)}% claimed
                      </div>
                    </div>
                  )}

                  {/* Claim Button */}
                  <button
                    onClick={handleClaimOffer}
                    className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <Gift className="w-5 h-5" />
                    Claim This Offer
                  </button>

                  {copiedCode && (
                    <div className="mt-3 p-3 bg-green-500/20 text-green-400 rounded-lg text-center text-sm">
                      ✅ Coupon code copied to clipboard!
                    </div>
                  )}
                </motion.div>

                {/* Offer Details */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-6"
                >
                  <h3 className="text-lg font-semibold mb-4">Offer Details</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Calendar className="w-4 h-4" />
                        <span>Valid From</span>
                      </div>
                      <span>{formatDate(offer.validFrom)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Clock className="w-4 h-4" />
                        <span>Valid Until</span>
                      </div>
                      <span className="text-red-400">
                        {formatDate(offer.validUntil)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Tag className="w-4 h-4" />
                        <span>Category</span>
                      </div>
                      <span className="capitalize">{offer.category}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-400">
                        <TrendingUp className="w-4 h-4" />
                        <span>Popularity</span>
                      </div>
                      <span>{offer.popularity}%</span>
                    </div>
                  </div>
                </motion.div>

                {/* Share Card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-6"
                >
                  <h3 className="text-lg font-semibold mb-4">
                    Share This Offer
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center gap-2 p-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm">
                      <ExternalLink className="w-4 h-4" />
                      Facebook
                    </button>
                    <button className="flex items-center justify-center gap-2 p-3 bg-sky-500 hover:bg-sky-600 rounded-lg transition-colors text-sm">
                      <ExternalLink className="w-4 h-4" />
                      Twitter
                    </button>
                    <button className="flex items-center justify-center gap-2 p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-sm">
                      <Copy className="w-4 h-4" />
                      Copy Link
                    </button>
                    <button className="flex items-center justify-center gap-2 p-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-sm">
                      <ExternalLink className="w-4 h-4" />
                      WhatsApp
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
