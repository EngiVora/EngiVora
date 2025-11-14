"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { EnhancedImage } from "@/components/enhanced-image";
import {
  Copy,
  Check,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Gift,
  Tag,
  Clock,
  Users,
  Share,
  Heart,
  Download,
  ShoppingCart,
  BookOpen,
  Zap,
  Percent,
  ArrowRight,
  Star,
  Calendar,
  DollarSign,
  Sparkles,
} from "lucide-react";

interface FeaturedOffer {
  id: string;
  title: string;
  description: string;
  category: "courses" | "resources" | "equipment" | "software";
  discountType: "percentage" | "fixed" | "free" | "bogo";
  originalPrice?: number;
  discountedPrice?: number;
  discountValue: number;
  image: string;
  ctaText: string;
  ctaAction: string;
  provider: string;
  featured: boolean;
  validUntil: string;
  termsAndConditions?: string[];
  popularity: number;
}

interface CouponCode {
  id: string;
  code: string;
  title: string;
  description: string;
  discountValue: number;
  discountType: "percentage" | "fixed";
  category: string;
  provider: string;
  image: string;
  validUntil: string;
  usageCount: number;
  maxUsage?: number;
  isActive: boolean;
}

interface AffiliateLink {
  id: string;
  title: string;
  description: string;
  cashbackPercent: number;
  provider: string;
  category: string;
  image: string;
  url: string;
  rating: number;
  features: string[];
  isNew: boolean;
}

interface ReferralProgram {
  id: string;
  title: string;
  description: string;
  reward: string;
  rewardType: "course" | "discount" | "cash" | "credits";
  rewardValue: string;
  image: string;
  totalReferrals: number;
  userReferrals: number;
  referralLink: string;
}

export default function DiscountsClient() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
  const [showShareModal, setShowShareModal] = useState<string | null>(null);
  const [likedOffers, setLikedOffers] = useState<Set<string>>(new Set());
  const [userReferralLink, setUserReferralLink] = useState("");
  const [loading, setLoading] = useState(true);
  const [featuredOffers, setFeaturedOffers] = useState<FeaturedOffer[]>([]);
  const [couponCodes, setCouponCodes] = useState<CouponCode[]>([]);
  const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLink[]>([]);
  const [referralProgram, setReferralProgram] = useState<ReferralProgram | null>(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch discounts from API with showAll parameter to get all active discounts
        const response = await fetch('/api/discounts?showAll=true');
        const data = await response.json();
        
        if (data.success) {
          // Transform API data to match existing structure
          const transformedOffers = data.data.map((discount: any) => ({
            id: discount._id,
            title: discount.title,
            description: discount.description,
            category: discount.category || "courses",
            discountType: discount.discountType || "percentage",
            discountValue: discount.discountValue || 0,
            originalPrice: discount.originalPrice,
            discountedPrice: discount.discountedPrice,
            image: discount.imageUrl || "/images/discount-placeholder.svg",
            ctaText: "View Details",
            ctaAction: `/discounts/offers/${discount._id}`,
            provider: discount.provider,
            featured: discount.featured || false,
            validUntil: discount.validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            popularity: 80, // Default popularity
          }));
          
          setFeaturedOffers(transformedOffers);
          
          // Set coupon codes from the same data
          const coupons = data.data.filter((d: any) => d.code).map((discount: any) => ({
            id: discount._id,
            code: discount.code,
            title: discount.title,
            description: discount.description,
            discountValue: discount.discountValue || 0,
            discountType: discount.discountType || "percentage",
            category: discount.category || "general",
            provider: discount.provider,
            image: discount.imageUrl || "/images/discount-placeholder.svg",
            validUntil: discount.validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            usageCount: 0, // Default usage count
            maxUsage: discount.maxUsage,
            isActive: discount.active !== undefined ? discount.active : true,
          }));
          
          setCouponCodes(coupons);
        }
      } catch (error) {
        console.error("Failed to fetch discounts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Set affiliate links (using mock data for now)
    setAffiliateLinks([
          {
            id: "1",
            title: "Shop electronics with 10% cashback",
            description:
              "Click the link to activate your discount on electronics and gadgets.",
            cashbackPercent: 10,
            provider: "TechMart",
            category: "electronics",
            image:
              "https://lh3.googleusercontent.com/aida-public/AB6AXuCpo3pfNYLNrFStJeXvHEXelM6GBJ3QdfzmcEY7NoY0Hk-xNOxEXkEylh5en4QIAfIqIaocZArxQqAdYtfMedXuLcoOutLx6yztXWUYLmDt7iqVRSyuHZ1F56EIyAlOzG0pT1QV5GP_tXEk6ys6424hu7VpLnU3CMIXiohmK26RrCl79pn5ur_dET1NH6QkTbYinKhA5N_MoF2jq1P1e3DE06u-Uu79atlxcK0SRY3zHKDI9acwirbhTZtO9XzNw2f-2KHCbj8anGc",
            url: "https://partner.techmart.com/engivora",
            rating: 4.8,
            features: ["Free shipping", "30-day returns", "Warranty included"],
            isNew: false,
          },
          {
            id: "2",
            title: "Get 5% off on study materials",
            description:
              "Access the offer through our partner link for study guides and materials.",
            cashbackPercent: 5,
            provider: "StudyHub",
            category: "education",
            image:
              "https://lh3.googleusercontent.com/aida-public/AB6AXuA8QX9rvX50oz5GHUn0qv8v8Fry6Db2DqMcB03IX6v1phjPUs9_5PtWUPMC7t2lPsZsDj6HsV6-A-E-zXsHyZa-MYpPrpPbOcdWnYzXS5WMxHgMsoiS3r8s9MjyspZ6ECAdfWCTqxXX96Q1FKnkoaTXcoJ_N-P1LOVML-MUytlO3e6Byz1p4HmwofL9aU3ZGyYzxUvKDoqnl6XZPMV5dFttFerjEPYH0H1pVN37xlW3ZyjZ7-bvOlPPfrA494s6FTxu1ZLnj9ICUYs",
            url: "https://studyhub.com/ref/engivora",
            rating: 4.6,
            features: ["Digital downloads", "24/7 support", "Mobile access"],
            isNew: true,
          },
        ]);
        
        // Set referral program (using mock data for now)
        setReferralProgram({
          id: "1",
          title: "Refer a friend and get a free course!",
          description:
            "Share your referral link and earn rewards for every new member you bring to Engivora.",
          reward: "Free Course Access",
          rewardType: "course",
          rewardValue: "Worth $299",
          image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCwhFhgmjgHDJC9CSJvJZcJnhNcirAl2C70dlu_Ki5kJ5ErSXvnryTI6PaRtutcPjMOlSaUVp_ogZBTweS9s-NLI2L7MC3sY39SxMPRB6gjUuxVFmt8-Ei3UBZLXKFTpcRL7o2qAUbK5h3dn282NaUp1HnFgTQ3NoJrmJr5qrrYbEFM9qJv1ppKuCTU-R7gU4rr-R0r1W7M23jyQOSSJ-RnYEGsaJsS_J1f8o3H49Kusvp5zJO1hTP9-8Ru752YfM1iejo784DrR9M",
          totalReferrals: 15420,
          userReferrals: 3,
          referralLink: "https://engivora.com/ref/user123",
        });
  }, []);

  useEffect(() => {
    // Generate user referral link
    setUserReferralLink(
      `https://engivora.com/ref/${Math.random().toString(36).substr(2, 9)}`,
    );
  }, []);

  const copyToClipboard = async (text: string, type: "code" | "link") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(type === "code" ? text : "referral-link");
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleOfferAction = (offer: FeaturedOffer) => {
    // Track click analytics
    console.log(`Clicked on offer: ${offer.title}`);

    // Navigate to the public discount detail page
    window.location.href = `/discounts/offers/${offer.id}`;
  };

  const handleAffiliateClick = (link: AffiliateLink) => {
    // Track affiliate click
    console.log(`Affiliate click: ${link.provider}`);
    window.open(link.url, "_blank");
  };

  const handleShare = (offerId: string) => {
    setShowShareModal(showShareModal === offerId ? null : offerId);
  };

  const handleLike = (offerId: string) => {
    setLikedOffers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(offerId)) {
        newSet.delete(offerId);
      } else {
        newSet.add(offerId);
      }
      return newSet;
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDiscountBadge = (offer: FeaturedOffer) => {
    if (offer.discountType === "free") {
      return (
        <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
          FREE
        </span>
      );
    }
    if (offer.discountType === "percentage") {
      return (
        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
          {offer.discountValue}% OFF
        </span>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      <main className="flex-1 px-6 md:px-10 lg:px-20 xl:px-40 py-12">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-16 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-extrabold tracking-tighter sm:text-5xl mb-4"
            >
              Discounts & Offers
            </motion.h1>
            <p className="max-w-2xl mx-auto text-lg text-slate-400">
              Exclusive deals and savings for Engivora members.
            </p>
            <div className="flex items-center justify-center gap-4 mt-6">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Gift className="w-4 h-4" />
                <span>{featuredOffers.length} Featured Offers</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Tag className="w-4 h-4" />
                <span>{couponCodes.length} Active Coupons</span>
              </div>
            </div>
          </div>

          {/* Show loading indicator within the main content area to avoid hydration mismatch */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
            </div>
          ) : (
            <>
              {/* Featured Offers */}
              <section className="mb-16">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold tracking-tight">
                    Featured Offers
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setCurrentOfferIndex(Math.max(0, currentOfferIndex - 1))
                      }
                      disabled={currentOfferIndex === 0}
                      className="p-2 rounded-full bg-slate-800 text-slate-300 hover:bg-sky-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-110"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() =>
                        setCurrentOfferIndex(
                          Math.min(
                            featuredOffers.length - 1,
                            currentOfferIndex + 1,
                          ),
                        )
                      }
                      disabled={currentOfferIndex >= featuredOffers.length - 1}
                      className="p-2 rounded-full bg-slate-800 text-slate-300 hover:bg-sky-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-110"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="relative overflow-hidden">
                  <motion.div
                    className="flex gap-6 transition-transform duration-500 ease-in-out"
                    style={{
                      transform: `translateX(-${currentOfferIndex * 100}%)`,
                      width: `${featuredOffers.length * 100}%`,
                    }}
                  >
                    {featuredOffers.map((offer, index) => (
                      <motion.div
                        key={offer.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="flex-shrink-0 w-full sm:w-80 group relative"
                      >
                        <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-sky-500/20 hover:-translate-y-1 group">
                          {/* Enhanced Image */}
                          <div className="relative w-full h-48 overflow-hidden">
                            <EnhancedImage
                              src={offer.image}
                              alt={offer.title}
                              type="discount"
                              fill
                              sizes="(max-width: 640px) 100vw, 320px"
                              className="transition-transform duration-500 group-hover:scale-110"
                              overlayGradient={true}
                              showPattern={true}
                              featured={offer.featured}
                            />
                            {/* Gradient overlay for text readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
                            
                            {/* Badges */}
                            <div className="absolute top-4 left-4 flex gap-2 z-20">
                              {getDiscountBadge(offer)}
                              {offer.featured && (
                                <span className="bg-yellow-500/90 backdrop-blur-sm text-black px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg animate-pulse">
                                  <Sparkles className="w-3 h-3" />
                                  FEATURED
                                </span>
                              )}
                            </div>
                            {/* Actions */}
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleLike(offer.id);
                                }}
                                className={`p-2 rounded-full backdrop-blur-md transition-all transform hover:scale-110 ${
                                  likedOffers.has(offer.id)
                                    ? "bg-red-500 text-white shadow-lg"
                                    : "bg-black/60 text-white hover:bg-red-500"
                                }`}
                              >
                                <Heart className={`w-4 h-4 ${likedOffers.has(offer.id) ? 'fill-current' : ''}`} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleShare(offer.id);
                                }}
                                className="p-2 rounded-full bg-black/60 text-white hover:bg-sky-500 backdrop-blur-md transition-all transform hover:scale-110"
                              >
                                <Share className="w-4 h-4" />
                              </button>
                            </div>
                            {/* Popularity indicator with animation */}
                            <div className="absolute bottom-4 left-4 bg-gradient-to-r from-orange-500/90 to-red-500/90 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-bold text-white shadow-lg flex items-center gap-1.5 z-20">
                              <span className="animate-pulse">🔥</span>
                              <span>{offer.popularity}% popular</span>
                            </div>
                            
                            {/* Animated sparkle effects for featured items */}
                            {offer.featured && (
                              <div className="absolute inset-0 pointer-events-none z-10">
                                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-ping opacity-75" style={{ animationDelay: '0s' }} />
                                <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-ping opacity-75" style={{ animationDelay: '0.5s' }} />
                                <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping opacity-75" style={{ animationDelay: '1s' }} />
                                <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-yellow-300 rounded-full animate-ping opacity-75" style={{ animationDelay: '1.5s' }} />
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="p-6">
                            <div className="mb-3">
                              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                <span className="text-xs font-medium text-sky-400 uppercase tracking-wide">
                                  {offer.category}
                                </span>
                                <div className="flex items-center gap-1 text-xs text-slate-400">
                                  <Clock className="w-3 h-3" />
                                  <span className="truncate">Valid until {formatDate(offer.validUntil)}</span>
                                </div>
                              </div>
                              <h3 className="text-lg font-bold mb-2 group-hover:text-sky-400 transition-colors line-clamp-2">
                                {offer.title}
                              </h3>
                              <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">
                                {offer.description}
                              </p>
                            </div>

                            {/* Pricing */}
                            {offer.originalPrice && (
                              <div className="flex flex-wrap items-center gap-2 mb-4">
                                <span className="text-xl font-bold text-green-400">
                                  ${offer.discountedPrice || 0}
                                </span>
                                {offer.originalPrice > 0 && (
                                  <span className="text-sm text-slate-500 line-through">
                                    ${offer.originalPrice}
                                  </span>
                                )}
                                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded whitespace-nowrap">
                                  Save $
                                  {(offer.originalPrice || 0) -
                                    (offer.discountedPrice || 0)}
                                </span>
                              </div>
                            )}

                            {/* Provider */}
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-xs text-slate-400 truncate">
                                by {offer.provider}
                              </span>
                            </div>

                            {/* CTA Button */}
                            <button
                              onClick={() => handleOfferAction(offer)}
                              className="w-full bg-sky-600 hover:bg-sky-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-2"
                            >
                              {offer.ctaText}
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>

                {/* Offer indicators */}
                <div className="flex justify-center mt-6 gap-2">
                  {featuredOffers.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentOfferIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentOfferIndex ? "bg-sky-500" : "bg-slate-600"
                      }`}
                    />
                  ))}
                </div>
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Coupon Codes */}
                <section>
                  <div className="flex items-center gap-3 mb-8">
                    <h2 className="text-3xl font-bold tracking-tight">
                      Coupon Codes
                    </h2>
                    <Tag className="w-6 h-6 text-sky-400" />
                  </div>
                  <div className="space-y-6">
                    {couponCodes.map((coupon, index) => (
                      <motion.div
                        key={coupon.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="group bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-sky-500/20 hover:border-slate-700"
                      >
                        <div className="flex items-center gap-6">
                          {/* Enhanced Image */}
                          <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 group">
                            <EnhancedImage
                              src={coupon.image}
                              alt={coupon.title}
                              type="discount"
                              fill
                              sizes="96px"
                              className="object-cover group-hover:scale-110 transition-transform duration-300"
                              overlayGradient={false}
                              showPattern={false}
                              featured={false}
                            />
                            {/* Discount badge overlay */}
                            <div className="absolute top-1 right-1 z-10">
                              <div className="bg-green-500/90 backdrop-blur-sm rounded-full px-1.5 py-0.5 text-xs font-bold text-white shadow-lg">
                                {coupon.discountValue}%
                              </div>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-lg font-bold mb-1 group-hover:text-sky-400 transition-colors">
                                  {coupon.title}
                                </h3>
                                <p className="text-slate-400 text-sm mb-2">
                                  {coupon.description}
                                </p>
                              </div>
                              <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-medium">
                                {coupon.discountValue}% OFF
                              </span>
                            </div>

                            {/* Code and Stats */}
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-2">
                                <span className="text-slate-400 text-sm">
                                  Code:
                                </span>
                                <code className="bg-slate-800 px-2 py-1 rounded text-sky-400 font-mono text-sm">
                                  {coupon.code}
                                </code>
                              </div>
                              <div className="text-xs text-slate-500">
                                {coupon.usageCount}/{coupon.maxUsage} used
                              </div>
                            </div>

                            {/* Usage Progress */}
                            <div className="mb-4">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-slate-400">
                                  Usage
                                </span>
                                <span className="text-xs text-slate-400">
                                  {Math.round(
                                    (coupon.usageCount / (coupon.maxUsage || 1)) *
                                      100,
                                  )}
                                  %
                                </span>
                              </div>
                              <div className="w-full bg-slate-800 rounded-full h-1.5">
                                <div
                                  className="bg-sky-500 h-1.5 rounded-full transition-all"
                                  style={{
                                    width: `${Math.min((coupon.usageCount / (coupon.maxUsage || 1)) * 100, 100)}%`,
                                  }}
                                />
                              </div>
                            </div>

                            {/* Copy Button */}
                            <button
                              onClick={() => copyToClipboard(coupon.code, "code")}
                              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg transition-colors"
                            >
                              {copiedCode === coupon.code ? (
                                <>
                                  <Check className="w-4 h-4 text-green-400" />
                                  <span className="text-green-400">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-4 h-4" />
                                  <span>Copy Code</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>

                {/* Affiliate Links */}
                <section>
                  <div className="flex items-center gap-3 mb-8">
                    <h2 className="text-3xl font-bold tracking-tight">
                      Affiliate Links
                    </h2>
                    <ExternalLink className="w-6 h-6 text-sky-400" />
                  </div>
                  <div className="space-y-6">
                    {affiliateLinks.map((link, index) => (
                      <motion.div
                        key={link.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="group bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-sky-500/20 hover:border-slate-700"
                      >
                        <div className="flex items-center gap-6">
                          {/* Enhanced Image */}
                          <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 group">
                            <EnhancedImage
                              src={link.image}
                              alt={link.title}
                              type="discount"
                              fill
                              sizes="96px"
                              className="object-cover group-hover:scale-110 transition-transform duration-300"
                              overlayGradient={false}
                              showPattern={false}
                              featured={link.isNew}
                            />
                            {link.isNew && (
                              <div className="absolute top-1 right-1 z-10">
                                <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse flex items-center gap-1">
                                  <Sparkles className="w-2.5 h-2.5" />
                                  NEW
                                </span>
                              </div>
                            )}
                            {/* Cashback badge */}
                            <div className="absolute bottom-1 left-1 z-10">
                              <div className="bg-sky-500/90 backdrop-blur-sm rounded-full px-1.5 py-0.5 text-xs font-bold text-white shadow-lg">
                                {link.cashbackPercent}%
                              </div>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-lg font-bold mb-1 group-hover:text-sky-400 transition-colors">
                                  {link.title}
                                </h3>
                                <p className="text-slate-400 text-sm mb-2">
                                  {link.description}
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center gap-1 mb-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-3 h-3 ${
                                        i < Math.floor(link.rating)
                                          ? "text-yellow-400 fill-current"
                                          : "text-slate-600"
                                      }`}
                                    />
                                  ))}
                                  <span className="text-xs text-slate-400 ml-1">
                                    ({link.rating})
                                  </span>
                                </div>
                                <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-medium">
                                  {link.cashbackPercent}% Cashback
                                </span>
                              </div>
                            </div>

                            {/* Features */}
                            <div className="flex items-center gap-2 mb-3">
                              {link.features.map((feature, i) => (
                                <span
                                  key={i}
                                  className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-xs"
                                >
                                  {feature}
                                </span>
                              ))}
                            </div>

                            {/* Provider and CTA */}
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-slate-400">
                                by {link.provider}
                              </span>
                              <button
                                onClick={() => handleAffiliateClick(link)}
                                className="flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white px-4 py-2 rounded-lg transition-colors"
                              >
                                <span>Visit Store</span>
                                <ArrowRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Referral Program */}
              {referralProgram && (
                <section className="mt-16">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex items-center justify-center gap-3 mb-8">
                      <h2 className="text-3xl font-bold tracking-tight text-center">
                        Referral Program
                      </h2>
                      <Users className="w-6 h-6 text-sky-400" />
                    </div>

                    <div className="bg-gradient-to-br from-sky-600 to-blue-700 rounded-2xl p-8 shadow-2xl">
                      <div className="grid md:grid-cols-2 gap-8 items-center">
                        {/* Enhanced Image */}
                        <div className="relative h-64 md:h-48 rounded-xl overflow-hidden group">
                          <EnhancedImage
                            src={referralProgram.image}
                            alt={referralProgram.title}
                            type="discount"
                            fill
                            sizes="(min-width: 768px) 50vw, 100vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            overlayGradient={true}
                            showPattern={true}
                            featured={true}
                          />
                          {/* Gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-r from-sky-600/40 to-blue-700/40 pointer-events-none" />
                          
                          {/* Animated sparkle effects */}
                          <div className="absolute inset-0 pointer-events-none z-10">
                            <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-yellow-300 rounded-full animate-ping opacity-75" style={{ animationDelay: '0s' }} />
                            <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-yellow-200 rounded-full animate-ping opacity-75" style={{ animationDelay: '0.5s' }} />
                            <div className="absolute bottom-1/4 left-1/3 w-2.5 h-2.5 bg-yellow-300 rounded-full animate-ping opacity-75" style={{ animationDelay: '1s' }} />
                            <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-yellow-200 rounded-full animate-ping opacity-75" style={{ animationDelay: '1.5s' }} />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="text-white">
                          <div className="mb-6">
                            <h3 className="text-2xl md:text-3xl font-bold mb-3">
                              {referralProgram.title}
                            </h3>
                            <p className="text-sky-100 leading-relaxed mb-4">
                              {referralProgram.description}
                            </p>

                            {/* Reward Info */}
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sky-100">Your Reward</span>
                                <span className="text-yellow-300 font-bold">
                                  {referralProgram.rewardValue}
                                </span>
                              </div>
                              <div className="text-xl font-bold">
                                {referralProgram.reward}
                              </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4 mb-6">
                              <div className="text-center">
                                <div className="text-2xl font-bold">
                                  {referralProgram.userReferrals}
                                </div>
                                <div className="text-xs text-sky-200">
                                  Your Referrals
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold">
                                  {Math.round(referralProgram.totalReferrals / 1000)}
                                  K+
                                </div>
                                <div className="text-xs text-sky-200">
                                  Total Referrals
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold">$299</div>
                                <div className="text-xs text-sky-200">
                                  Reward Value
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Referral Link */}
                          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4">
                            <label className="block text-sm font-medium mb-2">
                              Your Referral Link
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={userReferralLink}
                                readOnly
                                className="flex-1 bg-white/10 border border-white/20 rounded px-3 py-2 text-sm text-white placeholder-sky-200"
                              />
                              <button
                                onClick={() =>
                                  copyToClipboard(userReferralLink, "link")
                                }
                                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded transition-colors flex items-center gap-2"
                              >
                                {copiedCode === "referral-link" ? (
                                  <Check className="w-4 h-4" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </div>

                          {/* CTA Button */}
                          <button className="w-full bg-white text-sky-700 font-bold py-3 px-6 rounded-xl hover:bg-sky-5 transition-colors">
                            Share Your Link & Earn Rewards
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </section>
              )}
            </>
          )}

          {/* Share Modal */}
          <AnimatePresence>
            {showShareModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                onClick={() => setShowShareModal(null)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-slate-900 rounded-xl p-6 max-w-md w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-lg font-bold mb-4">Share this offer</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center gap-2 p-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                      <ExternalLink className="w-4 h-4" />
                      <span>Facebook</span>
                    </button>
                    <button className="flex items-center gap-2 p-3 bg-sky-500 hover:bg-sky-600 rounded-lg transition-colors">
                      <ExternalLink className="w-4 h-4" />
                      <span>Twitter</span>
                    </button>
                    <button className="flex items-center gap-2 p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
                      <Copy className="w-4 h-4" />
                      <span>Copy Link</span>
                    </button>
                    <button className="flex items-center gap-2 p-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors">
                      <ExternalLink className="w-4 h-4" />
                      <span>WhatsApp</span>
                    </button>
                  </div>
                  <button
                    onClick={() => setShowShareModal(null)}
                    className="w-full mt-4 p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}