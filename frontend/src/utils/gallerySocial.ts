import { api } from "../api/client";
import { getApiRoot } from "../api/helpers";

export interface SocialComment {
  id: string | number;
  userName: string;
  text: string;
  createdAt: string;
}

const STORAGE_PREFIX = "roots_social_";
const UPLOADS_STORAGE_KEY = "roots_custom_uploads_v2";

export function resolveAnyMediaUrl(
  url: string | undefined | null,
  apiRoot?: string,
  fallback: string = ""
): string {
  const clean = String(url || "").trim();
  if (!clean) return fallback;
  if (/^(https?:)?\/\//i.test(clean) || clean.startsWith("data:") || clean.startsWith("blob:")) {
    return clean;
  }
  const root = (apiRoot || getApiRoot()).replace(/\/+$/, "");
  if (clean.startsWith("/uploads/")) {
    return `${root}${clean}`;
  }
  if (clean.startsWith("uploads/")) {
    return `${root}/${clean}`;
  }
  if (clean.startsWith("/")) {
    return `${root}${clean}`;
  }
  return `${root}/uploads/${clean}`;
}

export function getSocialLikes(mediaKey: string, defaultLikes: number = 0): { count: number; isLiked: boolean } {
  if (typeof window === "undefined") return { count: defaultLikes, isLiked: false };
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}likes_${mediaKey}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        count: typeof parsed.count === "number" ? parsed.count : defaultLikes,
        isLiked: Boolean(parsed.isLiked),
      };
    }
  } catch {
    // fallback
  }
  return { count: defaultLikes, isLiked: false };
}

export async function toggleSocialLike(
  mediaKey: string,
  currentLikes: number,
  apiPath?: string
): Promise<{ count: number; isLiked: boolean }> {
  const current = getSocialLikes(mediaKey, currentLikes);
  const nextIsLiked = !current.isLiked;
  const nextCount = nextIsLiked ? current.count + 1 : Math.max(0, current.count - 1);

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(
        `${STORAGE_PREFIX}likes_${mediaKey}`,
        JSON.stringify({ count: nextCount, isLiked: nextIsLiked })
      );
    } catch {
      // storage unavailable
    }
  }

  if (apiPath) {
    try {
      await api.post(apiPath);
    } catch {
      // ignore
    }
  }

  return { count: nextCount, isLiked: nextIsLiked };
}

export function getSocialComments(mediaKey: string, defaultComments: SocialComment[] = []): SocialComment[] {
  if (typeof window === "undefined") return defaultComments;
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}comments_${mediaKey}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return [...defaultComments, ...parsed];
      }
    }
  } catch {
    // fallback
  }
  return defaultComments;
}

export async function addSocialComment(
  mediaKey: string,
  text: string,
  userName: string = "Member",
  apiPath?: string
): Promise<SocialComment[]> {
  const trimmed = text.trim();
  if (!trimmed) return getSocialComments(mediaKey);

  const newComment: SocialComment = {
    id: `c_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    userName: userName || "Member",
    text: trimmed,
    createdAt: new Date().toISOString(),
  };

  let stored: SocialComment[] = [];
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(`${STORAGE_PREFIX}comments_${mediaKey}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) stored = parsed;
      }
      stored.unshift(newComment);
      localStorage.setItem(`${STORAGE_PREFIX}comments_${mediaKey}`, JSON.stringify(stored));
    } catch {
      // storage unavailable
    }
  }

  if (apiPath) {
    try {
      await api.post(apiPath, { text: trimmed, comment: trimmed });
    } catch {
      // ignore
    }
  }

  return stored;
}

export function recordAdminUpload(
  kind: "images" | "books" | "audios" | "documents" | "trees" | "articles",
  item: any
) {
  if (typeof window === "undefined" || !item) return;
  try {
    const raw = localStorage.getItem(UPLOADS_STORAGE_KEY);
    const store = raw ? JSON.parse(raw) : {};
    const list = Array.isArray(store[kind]) ? store[kind] : [];
    // Deduplicate by id or title
    const filtered = list.filter((x: any) => x.id !== item.id && x.title !== item.title);
    filtered.unshift({
      ...item,
      isUserUpload: true,
      uploadedAt: new Date().toISOString(),
    });
    store[kind] = filtered.slice(0, 50);
    localStorage.setItem(UPLOADS_STORAGE_KEY, JSON.stringify(store));
    window.dispatchEvent(new CustomEvent("roots:uploads-changed", { detail: { kind, item } }));
  } catch {
    // ignore
  }
}

export function getTrackedUploads(kind: "images" | "books" | "audios" | "documents" | "trees" | "articles"): any[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(UPLOADS_STORAGE_KEY);
    if (!raw) return [];
    const store = JSON.parse(raw);
    return Array.isArray(store[kind]) ? store[kind] : [];
  } catch {
    return [];
  }
}

