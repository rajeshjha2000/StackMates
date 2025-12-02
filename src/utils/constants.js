<<<<<<< HEAD
// Configuration - All values loaded from environment variables
export const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
export const APP_NAME = import.meta.env.VITE_APP_NAME || "StackMates";
export const APP_DESCRIPTION = import.meta.env.VITE_APP_DESCRIPTION || "Connect to other developers";
export const RAZORPAY_THEME_COLOR = import.meta.env.VITE_RAZORPAY_THEME_COLOR || "#F37254";

// Default profile image
export const DEFAULT_PROFILE_IMAGE = "https://geographyandyou.com/images/user-profile.png";

// Helper function to get proxied image URL for external images (like Instagram)
// This bypasses CORS and hotlinking restrictions by fetching through our backend
export const getProxiedImageUrl = (imageUrl) => {
    if (!imageUrl) return DEFAULT_PROFILE_IMAGE;

    // Don't proxy already working URLs or local URLs
    const trustedDomains = [
        "geographyandyou.com",
        "i.imgur.com",
        "cloudinary.com",
        "githubusercontent.com",
    ];

    const isTrusted = trustedDomains.some(domain => imageUrl.includes(domain));
    if (isTrusted) return imageUrl;

    // Proxy external URLs through our backend
    return `${BASE_URL}/image-proxy?url=${encodeURIComponent(imageUrl)}`;
};
=======
const membershipAmount = {
  silver: 300,
  gold: 700,
};

module.exports = { membershipAmount };
>>>>>>> feebcf102950eeb7a8b17237c51f6d8cd0bb174a
