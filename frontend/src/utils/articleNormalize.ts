export type ArticleVisibility = "public" | "community" | "private";

export interface ArticleComment {
  id: number | string;
  userId: string;
  userName: string;
  text: string;
  likes?: number;
  createdAt: string;
}

export interface NormalizedArticle {
  id: number | string;
  title: string;
  category: string;
  content: string;
  userId: string;
  userName: string;
  images: string[];
  videos: string[];
  comments: ArticleComment[];
  createdAt: string;
  likes: number;
  isLiked: boolean;
  visibility: ArticleVisibility;
}

export const ARTICLE_CATEGORIES = [
  { id: "civil-registry", labelKey: "articles_cat_civil", fallback: "Civil registry" },
  { id: "ottoman-sijillat", labelKey: "articles_cat_sijillat", fallback: "Ottoman sijillat" },
  { id: "habous", labelKey: "articles_cat_habous", fallback: "Habous & waqf" },
  { id: "kairouan", labelKey: "articles_cat_kairouan", fallback: "Kairouan & nasab" },
  { id: "governorates", labelKey: "articles_cat_governorates", fallback: "Governorates" },
  { id: "oral-history", labelKey: "articles_cat_oral", fallback: "Oral history" },
  { id: "photographs", labelKey: "articles_cat_photos", fallback: "Photographs" },
] as const;

export function parseMediaList(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((item) => String(item || "").trim()).filter(Boolean);
  }
  if (typeof value === "object") {
    const item = value as Record<string, unknown>;
    const url = item.url || item.src || item.path || item.image_path;
    return url ? [String(url).trim()] : [];
  }
  const raw = String(value || "").trim();
  if (!raw) return [];
  try {
    return parseMediaList(JSON.parse(raw));
  } catch {
    return raw
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
}

export function parseComments(value: unknown): ArticleComment[] {
  if (!value) return [];
  if (Array.isArray(value)) return value as ArticleComment[];
  try {
    const parsed = JSON.parse(String(value));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function resolveMediaUrl(url: string, apiRoot: string, fallback: string) {
  const clean = String(url || "").trim();
  if (!clean) return fallback;
  if (/^(https?:)?\/\//i.test(clean) || clean.startsWith("data:") || clean.startsWith("blob:")) {
    return clean;
  }
  if (clean.startsWith("/uploads/")) return `${apiRoot}${clean}`;
  return clean;
}

export function extractArticleList(data: unknown): any[] {
  const payload = data as any;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.articles)) return payload.articles;
  if (Array.isArray(payload)) return payload;
  return [];
}

export function normalizeArticle(
  item: any,
  apiRoot: string,
  fallbackName = "Member",
  fallbackImage = "",
): NormalizedArticle {
  const author = item?.author && typeof item.author === "object" ? item.author : null;
  const userName =
    item?.userName ||
    item?.user_name ||
    item?.author_name ||
    author?.full_name ||
    author?.fullName ||
    (typeof item?.author === "string" ? item.author : "") ||
    fallbackName;
  const images = parseMediaList(item?.images).map((url) =>
    resolveMediaUrl(url, apiRoot, fallbackImage),
  );
  const videos = parseMediaList(item?.videos).map((url) =>
    resolveMediaUrl(url, apiRoot, fallbackImage),
  );

  return {
    id: item?.id || Date.now(),
    title: item?.title || "",
    category: item?.category || "",
    content: item?.content || item?.body || "",
    userId: String(item?.userId || item?.user_id || item?.author_id || "user"),
    userName,
    images,
    videos,
    comments: parseComments(item?.comments),
    createdAt: item?.createdAt || item?.created_at || new Date().toISOString(),
    likes: Number(item?.likes || 0),
    isLiked: Boolean(item?.isLiked),
    visibility: item?.visibility || (item?.is_public === false ? "private" : "public"),
  };
}

export function formatTimeAgo(
  dateString: string,
  t: (key: string, fallback?: string) => string,
) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (Number.isNaN(date.getTime())) return "";
  if (minutes < 60) return `${Math.max(1, minutes)}${t("minutes_ago_suffix", "m ago")}`;
  if (hours < 24) return `${hours}${t("hours_ago_suffix", "h ago")}`;
  if (days < 7) return `${days}${t("days_ago_suffix", "d ago")}`;
  return date.toLocaleDateString();
}
