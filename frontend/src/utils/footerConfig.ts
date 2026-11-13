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
import type { PublicSiteContent } from "../hooks/useSiteContent";

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

export interface ResolvedSocialLink extends SocialLink {
  resolvedHref: string;
}

export interface FooterConfig {
  socialLinks: SocialLink[];
  location: string;
  email: string;
  phone: string;
  whatsapp: string;
  brandTagline?: string;
  brandTaglineTranslations?: Record<string, string>;
  updatedAt?: number;
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

export const PLATFORM_CARD_STYLES: Record<SocialIconType, string> = {
  whatsapp:
    "bg-emerald-500/5 hover:bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400",
  facebook:
    "bg-blue-500/5 hover:bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400",
  instagram:
    "bg-pink-500/5 hover:bg-pink-500/10 border-pink-500/20 text-pink-600 dark:text-pink-400",
  youtube:
    "bg-red-500/5 hover:bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400",
  twitter:
    "bg-sky-500/5 hover:bg-sky-500/10 border-sky-500/20 text-sky-600 dark:text-sky-400",
  linkedin:
    "bg-indigo-500/5 hover:bg-indigo-500/10 border-indigo-500/20 text-indigo-600 dark:text-indigo-400",
  telegram:
    "bg-cyan-500/5 hover:bg-cyan-500/10 border-cyan-500/20 text-cyan-600 dark:text-cyan-400",
  tiktok:
    "bg-amber-500/5 hover:bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400",
};

const PLATFORM_LABELS: Record<SocialIconType, Record<string, string>> = {
  whatsapp: {
    fr: "WhatsApp Officiel",
    en: "Official WhatsApp",
    ar: "واتساب الرسمي",
    es: "WhatsApp Oficial",
    it: "WhatsApp Ufficiale",
    mt: "WhatsApp Uffiċjali",
  },
  facebook: {
    fr: "Facebook Officiel",
    en: "Official Facebook",
    ar: "فيسبوك الرسمي",
    es: "Facebook Oficial",
    it: "Facebook Ufficiale",
    mt: "Facebook Uffiċjali",
  },
  instagram: {
    fr: "Instagram Roots",
    en: "Instagram Roots",
    ar: "جذور تونس على إنستغرام",
    es: "Instagram Roots",
    it: "Instagram Roots",
    mt: "Instagram Roots",
  },
  youtube: {
    fr: "YouTube Officiel",
    en: "Official YouTube",
    ar: "يوتيوب الرسمي",
    es: "YouTube Oficial",
    it: "YouTube Ufficiale",
    mt: "YouTube Uffiċjali",
  },
  twitter: {
    fr: "Twitter / X Officiel",
    en: "Official Twitter / X",
    ar: "منصة X الرسمية",
    es: "Twitter / X Oficial",
    it: "Twitter / X Ufficiale",
    mt: "Twitter / X Uffiċjali",
  },
  linkedin: {
    fr: "LinkedIn Officiel",
    en: "Official LinkedIn",
    ar: "لينكدإن الرسمي",
    es: "LinkedIn Oficial",
    it: "LinkedIn Ufficiale",
    mt: "LinkedIn Uffiċjali",
  },
  telegram: {
    fr: "Telegram Officiel",
    en: "Official Telegram",
    ar: "تيليغرام الرسمي",
    es: "Telegram Oficial",
    it: "Telegram Ufficiale",
    mt: "Telegram Uffiċjali",
  },
  tiktok: {
    fr: "TikTok Officiel",
    en: "Official TikTok",
    ar: "تيك توك الرسمي",
    es: "TikTok Oficial",
    it: "TikTok Ufficiale",
    mt: "TikTok Uffiċjali",
  },
};

export const DEFAULT_FOOTER_CONFIG: FooterConfig = {
  socialLinks: [
    { id: "wa", icon: "whatsapp", url: "https://wa.me/21692225533", enabled: true },
    { id: "fb", icon: "facebook", url: "https://facebook.com", enabled: true },
    { id: "ig", icon: "instagram", url: "https://instagram.com", enabled: true },
    { id: "yt", icon: "youtube", url: "https://youtube.com", enabled: false },
  ],
  location: "",
  email: "contact@rootstunisia.com",
  phone: "",
  whatsapp: "",
  brandTagline: "",
  brandTaglineTranslations: {},
};

function sanitizeTranslationsMap(raw: unknown): Record<string, string> | undefined {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return undefined;
  const cleaned: Record<string, string> = {};
  for (const [loc, val] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof val !== "string") continue;
    const trimmed = val.trim();
    if (!trimmed) continue;
    const short = loc.toLowerCase().split("-")[0];
    if (short) cleaned[short] = trimmed;
  }
  return Object.keys(cleaned).length > 0 ? cleaned : undefined;
}

function sanitizeSocialLink(raw: any, idx: number): SocialLink | null {
  if (!raw || typeof raw !== "object" || !VALID_ICONS.has(raw.icon)) return null;
  return {
    id: String(raw.id || `link-${idx}-${raw.icon}`),
    icon: raw.icon,
    url: String(raw.url || ""),
    enabled: Boolean(raw.enabled),
  };
}

export function normalizeFooterConfig(value: Partial<FooterConfig> | null): FooterConfig {
  const socialLinks = Array.isArray(value?.socialLinks)
    ? value.socialLinks
        .map((link, idx) => sanitizeSocialLink(link, idx))
        .filter((link): link is SocialLink => Boolean(link))
    : DEFAULT_FOOTER_CONFIG.socialLinks;

  const updatedAt =
    typeof value?.updatedAt === "number" && Number.isFinite(value.updatedAt)
      ? value.updatedAt
      : undefined;

  const brandTagline =
    typeof value?.brandTagline === "string" ? value.brandTagline.trim() : "";
  const brandTaglineTranslations =
    sanitizeTranslationsMap(value?.brandTaglineTranslations) ?? {};

  return {
    ...DEFAULT_FOOTER_CONFIG,
    ...value,
    socialLinks,
    brandTagline,
    brandTaglineTranslations,
    ...(updatedAt !== undefined ? { updatedAt } : {}),
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

export function saveFooterConfig(cfg: FooterConfig): FooterConfig {
  const stamped: FooterConfig = {
    ...normalizeFooterConfig(cfg),
    updatedAt: Date.now(),
  };
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(FOOTER_STORAGE_KEY, JSON.stringify(stamped));
  }
  try {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("roots_footer_updated", { detail: stamped }));
    }
  } catch {
    // Ignore custom event dispatch errors in headless test envs
  }
  return stamped;
}

export function resolveSocialHref(icon: SocialIconType, rawUrl: string): string {
  const trimmed = String(rawUrl || "").trim();
  if (!trimmed || /^https?:\/\/?$/i.test(trimmed)) return "";

  const compact = trimmed.replace(/[\u0000-\u0020]+/g, "").toLowerCase();
  if (/^(?:javascript|vbscript|data):/i.test(compact)) return "";

  if (icon === "whatsapp") {
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    if (/^wa\.me\//i.test(trimmed)) return `https://${trimmed}`;
    const digits = trimmed.replace(/[^\d]/g, "");
    if (digits.length >= 6) return `https://wa.me/${digits}`;
  }

  if (/^(?:https?:\/\/|mailto:|tel:)/i.test(trimmed)) return trimmed;
  return `https://${trimmed.replace(/^\/+/, "")}`;
}

export function getActiveSocialLinks(config: FooterConfig): ResolvedSocialLink[] {
  return (config.socialLinks || [])
    .filter((link) => link.enabled)
    .map((link) => ({
      ...link,
      resolvedHref: resolveSocialHref(link.icon, link.url),
    }))
    .filter((link): link is ResolvedSocialLink => Boolean(link.resolvedHref));
}

export function getPlatformLabel(
  icon: SocialIconType,
  locale: string,
  overrides?: Partial<Record<SocialIconType, string>>,
): string {
  const override = overrides?.[icon]?.trim();
  if (override) return override;
  const clean = (locale || "fr").toLowerCase().split("-")[0];
  return PLATFORM_LABELS[icon]?.[clean] || PLATFORM_LABELS[icon]?.en || icon;
}

export function parseSocialLinksPayload(
  raw: unknown,
): { links: SocialLink[]; updatedAt?: number } | null {
  if (!raw) return null;
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    const arr = Array.isArray(parsed)
      ? parsed
      : parsed && typeof parsed === "object" && Array.isArray((parsed as any).links)
        ? (parsed as any).links
        : null;
    if (!arr) return null;
    const links = arr
      .map((item: any, idx: number) => sanitizeSocialLink(item, idx))
      .filter((item: SocialLink | null): item is SocialLink => Boolean(item));
    const updatedAt =
      parsed &&
      !Array.isArray(parsed) &&
      typeof (parsed as any).updatedAt === "number" &&
      Number.isFinite((parsed as any).updatedAt)
        ? (parsed as any).updatedAt
        : undefined;
    return { links, updatedAt };
  } catch {
    return null;
  }
}

export function parseSocialLinksJson(raw: unknown): SocialLink[] | null {
  return parseSocialLinksPayload(raw)?.links ?? null;
}

function readGlobalSiteField(
  sec: Record<string, { value?: unknown; translations?: Record<string, unknown> }>,
  key: string,
  cleanLocale: string,
): string | undefined {
  const entry = sec[key];
  if (!entry) return undefined;
  const localized = entry.translations?.[cleanLocale];
  if (typeof localized === "string" && localized.trim()) return localized.trim();
  return typeof entry.value === "string" ? entry.value.trim() : undefined;
}

export function mergeFooterConfigWithSiteContent(
  localConfig: FooterConfig,
  siteContent: PublicSiteContent | null | undefined,
  locale = "fr",
): FooterConfig {
  const normalizedLocal = normalizeFooterConfig(localConfig);
  const sec = siteContent?.pages?.footer?.config;
  if (!sec || typeof sec !== "object") return normalizedLocal;

  const cleanLocale = (locale || "fr").toLowerCase().split("-")[0];
  const srvPayload = parseSocialLinksPayload(sec.socialLinksJson?.value);
  const localTs = normalizedLocal.updatedAt ?? 0;
  const srvTs = srvPayload?.updatedAt ?? 0;

  // Prefer a newer local snapshot so live admin toggles in the active browser win
  // immediately before async server persistence settles, while newer remote saves win elsewhere.
  if (localTs > srvTs) {
    return normalizedLocal;
  }

  const srvLocation = readGlobalSiteField(sec, "location", cleanLocale);
  const srvEmail = readGlobalSiteField(sec, "email", cleanLocale);
  const srvPhone = readGlobalSiteField(sec, "phone", cleanLocale);
  const srvWhatsapp = readGlobalSiteField(sec, "whatsapp", cleanLocale);
  const srvTaglineEntry = sec.brandTagline;
  const srvBrandTagline =
    typeof srvTaglineEntry?.value === "string" ? srvTaglineEntry.value.trim() : undefined;
  const srvBrandTaglineTranslations = sanitizeTranslationsMap(srvTaglineEntry?.translations);

  // When socialLinksJson carries an updatedAt timestamp, omitted server fields mean cleared values.
  const hasVersionedSocial = Boolean(srvPayload && typeof srvPayload.updatedAt === "number");

  return {
    socialLinks: srvPayload ? srvPayload.links : normalizedLocal.socialLinks,
    location: hasVersionedSocial ? (srvLocation ?? "") : (srvLocation ?? normalizedLocal.location),
    email: hasVersionedSocial ? (srvEmail ?? "") : (srvEmail ?? normalizedLocal.email),
    phone: hasVersionedSocial ? (srvPhone ?? "") : (srvPhone ?? normalizedLocal.phone),
    whatsapp: hasVersionedSocial ? (srvWhatsapp ?? "") : (srvWhatsapp ?? normalizedLocal.whatsapp),
    brandTagline: hasVersionedSocial
      ? (srvBrandTagline ?? "")
      : (srvBrandTagline ?? normalizedLocal.brandTagline ?? ""),
    brandTaglineTranslations: hasVersionedSocial
      ? (srvBrandTaglineTranslations ?? {})
      : (srvBrandTaglineTranslations ?? normalizedLocal.brandTaglineTranslations ?? {}),
    updatedAt: srvPayload?.updatedAt ?? normalizedLocal.updatedAt,
  };
}
