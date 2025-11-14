"use client";

import Image from "next/image";
import { useState } from "react";
import { 
  Gift, 
  BookOpen, 
  GraduationCap, 
  Sparkles,
  Zap,
  Star,
  TrendingUp
} from "lucide-react";

interface EnhancedImageProps {
  src: string;
  alt: string;
  type?: "discount" | "blog" | "exam";
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  overlayGradient?: boolean;
  showPattern?: boolean;
  featured?: boolean;
}

export function EnhancedImage({
  src,
  alt,
  type = "blog",
  className = "",
  fill = false,
  width,
  height,
  sizes,
  overlayGradient = true,
  showPattern = true,
  featured = false,
}: EnhancedImageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Get icon based on type
  const getIcon = () => {
    switch (type) {
      case "discount":
        return <Gift className="w-16 h-16 text-yellow-400" />;
      case "blog":
        return <BookOpen className="w-16 h-16 text-blue-400" />;
      case "exam":
        return <GraduationCap className="w-16 h-16 text-green-400" />;
      default:
        return <Sparkles className="w-16 h-16 text-purple-400" />;
    }
  };

  // Get gradient based on type
  const getGradient = () => {
    switch (type) {
      case "discount":
        return "from-yellow-500/30 via-orange-500/20 to-red-500/30";
      case "blog":
        return "from-blue-500/30 via-purple-500/20 to-pink-500/30";
      case "exam":
        return "from-green-500/30 via-teal-500/20 to-cyan-500/30";
      default:
        return "from-purple-500/30 via-pink-500/20 to-blue-500/30";
    }
  };

  // Fallback placeholder
  const placeholder = (
    <div className={`absolute inset-0 bg-gradient-to-br ${getGradient()} flex items-center justify-center ${className}`}>
      <div className="relative z-10 text-center">
        {getIcon()}
        <div className="mt-4 text-white/80 text-sm font-medium">{alt}</div>
      </div>
      {showPattern && (
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }} />
        </div>
      )}
      {featured && (
        <div className="absolute top-4 right-4 z-20">
          <div className="bg-yellow-400/90 backdrop-blur-sm rounded-full p-2 animate-pulse">
            <Star className="w-4 h-4 text-yellow-900 fill-yellow-900" />
          </div>
        </div>
      )}
    </div>
  );

  // Check if image is invalid or placeholder
  if (imageError || !src || src.includes("placeholder") || src === "/images/discount-placeholder.svg" || src === "/images/exam-placeholder.svg") {
    return placeholder;
  }

  return (
    <div className="relative overflow-hidden">
      {/* Loading shimmer */}
      {imageLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-[length:200%_100%] animate-shimmer" />
      )}
      
      {/* Actual image */}
      {fill ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className={`object-cover transition-all duration-500 ${imageLoading ? "opacity-0" : "opacity-100"} ${className}`}
          onError={() => setImageError(true)}
          onLoad={() => setImageLoading(false)}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          className={`object-cover transition-all duration-500 ${imageLoading ? "opacity-0" : "opacity-100"} ${className}`}
          onError={() => setImageError(true)}
          onLoad={() => setImageLoading(false)}
        />
      )}

      {/* Gradient overlay */}
      {overlayGradient && (
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300`} />
      )}

      {/* Animated pattern overlay */}
      {showPattern && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.1) 75%, rgba(255,255,255,0.1)),
                                linear-gradient(-45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.1) 75%, rgba(255,255,255,0.1))`,
              backgroundSize: '20px 20px'
            }}
          />
        </div>
      )}

      {/* Shine effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </div>

      {/* Featured badge */}
      {featured && !imageError && (
        <div className="absolute top-4 right-4 z-20">
          <div className="bg-yellow-400/90 backdrop-blur-sm rounded-full p-2 shadow-lg animate-pulse">
            <Star className="w-4 h-4 text-yellow-900 fill-yellow-900" />
          </div>
        </div>
      )}

      {/* Sparkle effect */}
      {featured && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-yellow-400 rounded-full animate-ping" style={{ animationDelay: '0s' }} />
          <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-yellow-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-yellow-400 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
        </div>
      )}
    </div>
  );
}

