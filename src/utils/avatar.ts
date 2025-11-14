/**
 * Utility functions for generating user avatars with initials
 * Uses EngiVora logo blue gradient background
 */

/**
 * Get user initials from name
 * @param name - User's full name
 * @returns Initials (1-2 characters)
 */
export function getInitials(name: string | null | undefined): string {
  if (!name || name.trim().length === 0) {
    return 'U';
  }

  const parts = name.trim().split(/\s+/);
  
  if (parts.length === 1) {
    // Single name - return first letter
    return parts[0].charAt(0).toUpperCase();
  }
  
  // Multiple names - return first letter of first and last name
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/**
 * Get EngiVora blue gradient background style
 * Based on the logo colors: darker blue (#004080) to lighter blue (#007bff)
 * @returns CSS gradient string
 */
export function getEngiVoraGradient(): string {
  // EngiVora logo blue gradient: from darker blue to lighter blue
  return 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)';
}

/**
 * Get background color for avatar based on user name
 * Uses a consistent color based on the name hash
 * @param name - User's name
 * @returns CSS gradient string
 */
export function getAvatarBackground(name: string | null | undefined): string {
  // Use EngiVora blue gradient for all users
  return getEngiVoraGradient();
}

