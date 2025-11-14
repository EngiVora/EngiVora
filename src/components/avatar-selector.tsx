"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Check, User, Users, Smile, GraduationCap } from "lucide-react";

interface AvatarSelectorProps {
  currentAvatar: string | null;
  onSelect: (avatarPath: string) => void;
  onClose: () => void;
  isOpen: boolean;
  error?: string;
  isUploading?: boolean;
}

const AVATARS = [
  {
    id: "avatar-1",
    name: "Male with Glasses",
    path: "/images/avatars/avatar-1.svg",
    description: "Young man with brown hair, glasses, and dark blue hoodie",
    icon: User,
    gradient: "from-blue-600 to-blue-800",
    color: "bg-blue-600"
  },
  {
    id: "avatar-2",
    name: "Female with Ponytail",
    path: "/images/avatars/avatar-2.svg",
    description: "Young woman with blonde ponytail, glasses, and dark purple top",
    icon: Users,
    gradient: "from-purple-600 to-pink-600",
    color: "bg-purple-600"
  },
  {
    id: "avatar-3",
    name: "Female with Bob",
    path: "/images/avatars/avatar-3.svg",
    description: "Woman with reddish-orange bob hair, yellow earrings, and dark green top",
    icon: Smile,
    gradient: "from-green-600 to-emerald-600",
    color: "bg-green-600"
  },
  {
    id: "avatar-4",
    name: "Male with Backpack",
    path: "/images/avatars/avatar-4.svg",
    description: "Young man with dark brown hair, orange jacket, and blue backpack",
    icon: GraduationCap,
    gradient: "from-orange-600 to-red-600",
    color: "bg-orange-600"
  }
];

export function AvatarSelector({ currentAvatar, onSelect, onClose, isOpen, error, isUploading }: AvatarSelectorProps) {
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(currentAvatar);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [isSelecting, setIsSelecting] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before using portal
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Sync selectedAvatar with currentAvatar when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedAvatar(currentAvatar);
      // Reset errors when modal opens to retry loading
      setImageErrors(new Set());
      setIsSelecting(false);
    }
  }, [isOpen, currentAvatar]);

  const handleSelect = (avatarPath: string) => {
    if (isSelecting || isUploading) return;
    
    try {
      setSelectedAvatar(avatarPath);
      // Don't auto-save on click, wait for Confirm button
      // This prevents multiple API calls
    } catch (error) {
      console.error('Error selecting avatar:', error);
    }
  };

  const handleConfirm = () => {
    if (!selectedAvatar || isUploading || isSelecting) return;
    
    // If the selected avatar is the same as current, just close
    if (selectedAvatar === currentAvatar) {
      onClose();
      return;
    }
    
    // Otherwise, save the new avatar
    // The parent component's onSelect will handle the async operation
    // and update isUploading state, which we use to show loading
    try {
      onSelect(selectedAvatar);
      // Note: onSelect is async and will handle closing the modal on success
      // The parent component handles the async operation and error handling
    } catch (error) {
      console.error('Error confirming avatar:', error);
      // Don't close modal on error, let user try again
    }
  };

  // Reset selecting state when upload completes or modal closes
  useEffect(() => {
    if (!isUploading && !isOpen) {
      setIsSelecting(false);
    }
  }, [isUploading, isOpen]);

  const handleImageError = (avatarId: string) => {
    setImageErrors((prev) => new Set(prev).add(avatarId));
  };

  // Don't render anything during SSR or if modal is closed
  if (!isOpen || !mounted) return null;

  // Ensure we're in the browser before using portal
  if (typeof document === 'undefined' || !document.body) return null;

  const modalContent = (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto fade-in-scale"
      >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-800">
            <h2 className="text-2xl font-bold text-slate-100">Choose Your Avatar</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Avatar Grid */}
          <div className="p-6">
            <p className="text-slate-400 mb-6 text-center">
              Select an avatar to represent yourself on Engivora
            </p>
            
            {/* Error message */}
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-sm text-red-300 text-center">{error}</p>
              </div>
            )}
            
            {/* Loading indicator */}
            {isUploading && (
              <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-sm text-blue-300 text-center">Saving avatar...</p>
              </div>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {AVATARS.map((avatar) => {
                const isSelected = selectedAvatar === avatar.path;
                const hasError = imageErrors.has(avatar.id);
                const IconComponent = avatar.icon;
                
                return (
                  <button
                    key={avatar.id}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (!isUploading && !isSelecting) {
                        handleSelect(avatar.path);
                      }
                    }}
                    disabled={isUploading || isSelecting}
                    className={`relative group rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      isSelected
                        ? "border-sky-500 ring-4 ring-sky-500/20 shadow-lg shadow-sky-500/50"
                        : "border-slate-700 hover:border-sky-400"
                    } ${isUploading || isSelecting ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:scale-105 active:scale-95"}`}
                  >
                    <div className="aspect-square relative overflow-hidden rounded-t-xl bg-slate-800 flex items-center justify-center">
                      {/* Fallback placeholder - Always visible as background */}
                      <div 
                        className="absolute inset-0 w-full h-full flex flex-col items-center justify-center"
                        style={{
                          background: avatar.id === 'avatar-1' ? 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)' :
                                     avatar.id === 'avatar-2' ? 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)' :
                                     avatar.id === 'avatar-3' ? 'linear-gradient(135deg, #16a34a 0%, #10b981 100%)' :
                                     'linear-gradient(135deg, #ea580c 0%, #dc2626 100%)',
                          zIndex: 1,
                        }}
                      >
                        <IconComponent 
                          className="w-20 h-20 text-white" 
                          style={{ 
                            filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))',
                            marginBottom: '8px',
                            opacity: hasError ? 1 : 0.3
                          }} 
                        />
                        <span 
                          className="text-white text-xs font-bold px-2 text-center"
                          style={{ 
                            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                            marginTop: '8px',
                            opacity: hasError ? 1 : 0.3
                          }}
                        >
                          {avatar.name.split(' ')[0]}
                        </span>
                      </div>
                      
                      {/* Avatar Image - Try to load SVG */}
                      {!hasError && (
                        <img
                          src={avatar.path}
                          alt={avatar.name}
                          className="w-full h-full object-contain p-3 relative z-10"
                          onError={() => {
                            console.error('Image failed to load:', avatar.id, avatar.path);
                            handleImageError(avatar.id);
                          }}
                          onLoad={() => {
                            console.log('Image loaded successfully:', avatar.id, avatar.path);
                          }}
                          loading="eager"
                        />
                      )}
                      
                      {/* Selection indicator overlay */}
                      {isSelected && (
                        <div 
                          className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
                          style={{ 
                            backgroundColor: 'rgba(14, 165, 233, 0.4)'
                          }}
                        >
                          <div 
                            className="bg-sky-500 rounded-full p-2.5 shadow-xl"
                            style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}
                          >
                            <Check className="h-7 w-7 text-white" strokeWidth={3} />
                          </div>
                        </div>
                      )}
                      
                      {/* Hover overlay */}
                      {!isSelected && (
                        <div 
                          className="absolute inset-0 pointer-events-none transition-colors duration-300 group-hover:bg-black/30 z-20"
                        />
                      )}
                    </div>
                    
                    {/* Avatar name */}
                    <div className="p-3 bg-slate-800/50">
                      <p className="text-xs font-medium text-slate-300 text-center truncate">
                        {avatar.name}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
            
            {/* Info message if images don't exist */}
            {imageErrors.size > 0 && (
              <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-sm text-yellow-300 text-center">
                  ⚠️ Some avatar images could not be loaded. Please check that files exist in <code className="bg-slate-800 px-2 py-1 rounded text-xs">public/images/avatars/</code>
                </p>
                <p className="text-xs text-yellow-400 text-center mt-2">
                  Missing: {Array.from(imageErrors).join(', ')}
                </p>
              </div>
            )}

            {/* Current selection info */}
            {selectedAvatar && (
              <div className="mt-6 p-4 bg-sky-500/10 border border-sky-500/20 rounded-lg">
                <p className="text-sm text-sky-300 text-center">
                  ✓ Avatar selected! The avatar will be saved automatically.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-800">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-6 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!selectedAvatar || isUploading || isSelecting}
            >
              {isUploading || isSelecting ? "Saving..." : selectedAvatar ? "Confirm" : "Select an Avatar"}
            </button>
          </div>
        </div>
      </div>
  );

  // Use portal to render modal outside normal DOM hierarchy to avoid DOM conflicts
  return createPortal(modalContent, document.body);
}

