import type { ElementType } from "react";
import {
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Linkedin,
  MessageCircle,
  Send,
  Music,
} from "lucide-react";

export const FOOTER_STORAGE_KEY = "RootsTunisia_footer_settings";

export type SocialIconType =
  | "facebook"
  | "instagram"
  | "youtube"
  | "twitter"
  | "linkedin"
  | "whatsapp"
  | "telegram"
  | "tiktok";

export interface SocialLink {
  id: string;
  icon: SocialIconType;
  url: string;
  enabled: boolean;
}

export interface FooterConfig {
  socialLinks: SocialLink[];
  location: string;
  email: string;
  phone: string;
  whatsapp: string;
}

export const ICON_OPTIONS: { value: SocialIconType; label: string }[] = [
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "twitter", label: "Twitter / X" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "telegram", label: "Telegram" },
  { value: "tiktok", label: "TikTok" },
];

export const VALID_ICONS = new Set(ICON_OPTIONS.map((item) => item.value));

export const ICON_MAP: Record<SocialIconType, ElementType> = {
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  twitter: Twitter,
  linkedin: Linkedin,
  whatsapp: MessageCircle,
  telegram: Send,
  tiktok: Music,
};

export const DEFAULT_FOOTER_CONFIG: FooterConfig = {
  socialLinks: [
    { id: "fb", icon: "facebook", url: "https://facebook.com", enabled: true },
    { id: "ig", icon: "instagram", url: "https://instagram.com", enabled: true },
    { id: "yt", icon: "youtube", url: "https://youtube.com", enabled: true },
  ],
  location: "Avenue Habib Bourguiba, 1000 Tunis, Tunisie",
  email: "contact@rootstunisia.com",
  phone: "+216 71 234 567",
  whatsapp: "+216 71 234 567",
};

export function normalizeFooterConfig(value: Partial<FooterConfig> | null): FooterConfig {
  const socialLinks = Array.isArray(value?.socialLinks)
    ? value.socialLinks
        .filter((link) => VALID_ICONS.has(link.icon))
        .map((link) => ({
          id: String(link.id || `link-${Date.now()}`),
          icon: link.icon,
          url: String(link.url || ""),
          enabled: Boolean(link.enabled),
        }))
    : DEFAULT_FOOTER_CONFIG.socialLinks;

  return {
    ...DEFAULT_FOOTER_CONFIG,
    ...value,
    socialLinks,
  };
}

export function loadFooterConfig(): FooterConfig {
  if (typeof localStorage === "undefined") return DEFAULT_FOOTER_CONFIG;
  try {
    const raw = localStorage.getItem(FOOTER_STORAGE_KEY);
    if (raw) return normalizeFooterConfig(JSON.parse(raw));
  } catch {
    // Keep the public footer available even if saved settings are malformed.
  }
  return DEFAULT_FOOTER_CONFIG;
}

export function saveFooterConfig(cfg: FooterConfig) {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(FOOTER_STORAGE_KEY, JSON.stringify(cfg));
  }
}

