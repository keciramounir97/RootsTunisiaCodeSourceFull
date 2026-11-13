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

// One-time client cleanup of legacy hardcoded fake likes and old mock article cache
if (typeof window !== "undefined") {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;
      if (k.startsWith(`${STORAGE_PREFIX}likes_gallery_article_`) || k.startsWith(`${STORAGE_PREFIX}comments_gallery_article_`)) {
        keysToRemove.push(k);
        continue;
      }
      if (k.startsWith(`${STORAGE_PREFIX}likes_`)) {
        const val = localStorage.getItem(k);
        if (
          val &&
          (val.includes('"count":24') ||
            val.includes('"count":18') ||
            val.includes('"count":25') ||
            val.includes('"count":15') ||
            val.includes('"count":14') ||
            val.includes('"count":12') ||
            val.includes('"count":10'))
        ) {
          keysToRemove.push(k);
        }
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  } catch {
    // ignore
  }
}

const FRONTEND_ASSET_RE = /^(?:\/assets\/|\/src\/assets\/|\/heritage\/|\/favicon)/i;

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
  // Vite-bundled / public frontend assets must stay on the SPA origin.
  if (FRONTEND_ASSET_RE.test(clean) || clean.startsWith("./") || clean.startsWith("../")) {
    return clean;
  }
  const root = (apiRoot || getApiRoot()).replace(/\/+$/, "");
  if (clean.startsWith("/uploads/")) {
    return `${root}${clean}`;
  }
  if (clean.startsWith("uploads/")) {
    return `${root}/${clean}`;
  }
  if (clean.startsWith("/api/")) {
    return `${root}${clean}`;
  }
  if (clean.startsWith("/")) {
    return `${root}${clean}`;
  }
  // Bare filenames from gallery seeds historically lived under /uploads or /uploads/gallery.
  if (/\.(jpe?g|png|gif|webp|avif|svg)(?:[?#].*)?$/i.test(clean)) {
    return `${root}/uploads/gallery/${clean.replace(/^\/+/, "")}`;
  }
  return `${root}/uploads/${clean}`;
}

/** Prefer durable API image stream for numeric gallery rows; fall back to path resolution. */
export function resolveGalleryItemUrl(
  item: {
    id?: string | number | null;
    image_path?: string | null;
    imagePath?: string | null;
    image_url?: string | null;
    imageUrl?: string | null;
    url?: string | null;
    file_path?: string | null;
  } | null | undefined,
  apiRoot?: string,
  fallback: string = ""
): string {
  if (!item) return fallback;
  const root = (apiRoot || getApiRoot()).replace(/\/+$/, "");
  const numericId = Number(item.id);
  if (Number.isFinite(numericId) && numericId > 0 && String(item.id).match(/^\d+$/)) {
    return `${root}/api/gallery/${numericId}/image`;
  }
  return resolveAnyMediaUrl(
    item.image_path || item.imagePath || item.image_url || item.imageUrl || item.file_path || item.url,
    root,
    fallback
  );
}

/** Alternate candidates when the primary gallery URL fails (legacy paths, API stream, etc.). */
export function galleryImageFallbackCandidates(
  primary: string,
  item?: {
    id?: string | number | null;
    image_path?: string | null;
    imagePath?: string | null;
    image_url?: string | null;
    imageUrl?: string | null;
    url?: string | null;
    file_path?: string | null;
  } | null,
  apiRoot?: string,
  fallback: string = ""
): string[] {
  const root = (apiRoot || getApiRoot()).replace(/\/+$/, "");
  const out: string[] = [];
  const push = (value?: string | null) => {
    const v = String(value || "").trim();
    if (!v || out.includes(v)) return;
    out.push(v);
  };

  push(primary);

  const rawPath = String(
    item?.image_path || item?.imagePath || item?.image_url || item?.imageUrl || item?.file_path || item?.url || ""
  ).trim();
  if (rawPath) {
    push(resolveAnyMediaUrl(rawPath, root, ""));
    const base = rawPath.split(/[\\/]/).pop() || "";
    if (base) {
      push(`${root}/uploads/gallery/${base}`);
      push(`${root}/uploads/${base}`);
    }
  }

  const numericId = Number(item?.id);
  if (Number.isFinite(numericId) && numericId > 0 && String(item?.id).match(/^\d+$/)) {
    push(`${root}/api/gallery/${numericId}/image`);
  }

  push(fallback);
  return out.filter(Boolean);
}

/** Get cached or default social likes (defaults strictly to 0) */
export function getSocialLikes(mediaKey: string, defaultLikes: number = 0): { count: number; isLiked: boolean } {
  if (typeof window === "undefined") return { count: Math.max(0, defaultLikes), isLiked: false };
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}likes_${mediaKey}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        count: typeof parsed.count === "number" ? Math.max(0, parsed.count) : Math.max(0, defaultLikes),
        isLiked: Boolean(parsed.isLiked),
      };
    }
  } catch {
    // fallback
  }
  return { count: Math.max(0, defaultLikes), isLiked: false };
}

/** Batch fetch live counts from the MySQL database */
export async function fetchBatchSocialCounts(
  mediaKeys: string[]
): Promise<Record<string, { likes: number; comments: number; isLiked: boolean }>> {
  if (!Array.isArray(mediaKeys) || mediaKeys.length === 0) return {};
  try {
    const filtered = mediaKeys.filter(Boolean);
    const { data } = await api.get(`/social/counts?keys=${encodeURIComponent(filtered.join(","))}`);
    if (data && typeof data === "object") {
      // Store in local storage for instant render next visit
      if (typeof window !== "undefined") {
        for (const [key, val] of Object.entries(data as Record<string, any>)) {
          try {
            localStorage.setItem(
              `${STORAGE_PREFIX}likes_${key}`,
              JSON.stringify({ count: val.likes, isLiked: val.isLiked })
            );
          } catch {
            // ignore
          }
        }
      }
      return data;
    }
  } catch {
    // backend unavailable, fallback gracefully
  }
  return {};
}

/** Toggle social like: sends request to server if online, and records in database */
export async function toggleSocialLike(
  mediaKey: string,
  currentLikes: number = 0,
  apiPath?: string,
  entityType = "tree",
  entityId?: number
): Promise<{ count: number; isLiked: boolean }> {
  try {
    const res = await api.post("/social/likes", { mediaKey, entityType, entityId });
    if (res?.data && typeof res.data.likesCount === "number") {
      const result = { count: Math.max(0, res.data.likesCount), isLiked: Boolean(res.data.liked) };
      if (typeof window !== "undefined") {
        localStorage.setItem(`${STORAGE_PREFIX}likes_${mediaKey}`, JSON.stringify(result));
      }
      return result;
    }
  } catch {
    // fallback to local toggle if offline or custom path provided
  }

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

/** Get cached or default comments */
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

/** Fetch live comments from database */
export async function fetchSocialComments(mediaKey: string): Promise<SocialComment[]> {
  if (!mediaKey) return [];
  try {
    const { data } = await api.get(`/social/interactions?mediaKey=${encodeURIComponent(mediaKey)}`);
    if (data?.comments && Array.isArray(data.comments)) {
      const mapped = data.comments.map((c: any) => ({
        id: c.id,
        userName: c.userName || "Member",
        text: c.content,
        createdAt: c.createdAt || new Date().toISOString(),
      }));
      if (typeof window !== "undefined") {
        localStorage.setItem(`${STORAGE_PREFIX}comments_${mediaKey}`, JSON.stringify(mapped));
      }
      return mapped;
    }
  } catch {
    // fallback to cached
  }
  return getSocialComments(mediaKey);
}

/** Add comment to database with authenticated user account */
export async function addSocialComment(
  mediaKey: string,
  text: string,
  userName: string = "Member",
  apiPath?: string,
  entityType = "tree",
  entityId?: number
): Promise<SocialComment[]> {
  const trimmed = text.trim();
  if (!trimmed) return getSocialComments(mediaKey);

  try {
    const res = await api.post("/social/comments", {
      mediaKey,
      content: trimmed,
      entityType,
      entityId,
    });
    if (res?.data?.comment) {
      const newComment: SocialComment = {
        id: res.data.comment.id,
        userName: res.data.comment.userName || userName,
        text: res.data.comment.content,
        createdAt: res.data.comment.createdAt || new Date().toISOString(),
      };
      const existing = getSocialComments(mediaKey);
      const updated = [newComment, ...existing.filter((x) => String(x.id) !== String(newComment.id))];
      if (typeof window !== "undefined") {
        localStorage.setItem(`${STORAGE_PREFIX}comments_${mediaKey}`, JSON.stringify(updated));
      }
      return updated;
    }
  } catch {
    // fallback
  }

  const fallbackComment: SocialComment = {
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
      stored.unshift(fallbackComment);
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
  if (kind === "trees") return;
  try {
    const raw = localStorage.getItem(UPLOADS_STORAGE_KEY);
    const store = raw ? JSON.parse(raw) : {};
    const list = Array.isArray(store[kind]) ? store[kind] : [];
    const filtered = list.filter((x: any) => x.id !== item.id && x.title !== item.title);
    filtered.unshift({
      ...item,
      isUserUpload: true,
      uploadedAt: new Date().toISOString(),
    });
    store[kind] = filtered.slice(0, 100);
    localStorage.setItem(UPLOADS_STORAGE_KEY, JSON.stringify(store));
    window.dispatchEvent(new CustomEvent("roots:uploads-changed", { detail: { kind, item } }));
  } catch {
    // ignore
  }
}

export function getTrackedUploads(kind: "images" | "books" | "audios" | "documents" | "trees" | "articles"): any[] {
  if (typeof window === "undefined") return [];
  if (kind === "trees") {
    try {
      for (const k of [UPLOADS_STORAGE_KEY, "roots_admin_uploads", "roots_custom_uploads", "roots_uploads", "roots_gallery_uploads"]) {
        const raw = localStorage.getItem(k);
        if (!raw) continue;
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed) && "trees" in parsed) {
          delete parsed.trees;
          localStorage.setItem(k, JSON.stringify(parsed));
        }
      }
      localStorage.removeItem("roots_uploaded_trees");
      localStorage.removeItem("roots_trees_uploads");
    } catch {
      // ignore
    }
    return [];
  }
  const results: any[] = [];
  const seenIds = new Set<string>();

  const checkAndAdd = (item: any) => {
    if (!item) return;
    const key = String(item.id || item.title || item.name || "");
    if (!key || seenIds.has(key)) return;
    seenIds.add(key);
    results.push(item);
  };

  const keysToCheck = [
    UPLOADS_STORAGE_KEY,
    "roots_custom_uploads",
    "roots_uploads",
    "roots_admin_uploads",
    "roots_gallery_uploads",
    `roots_uploaded_${kind}`,
    `roots_${kind}_uploads`,
  ];

  for (const k of keysToCheck) {
    try {
      const raw = localStorage.getItem(k);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          parsed.forEach(checkAndAdd);
        } else if (parsed && typeof parsed === "object") {
          if (Array.isArray(parsed[kind])) {
            parsed[kind].forEach(checkAndAdd);
          }
        }
      }
    } catch {
      // ignore
    }
  }

  return results;
}

export function removeTrackedUpload(
  kind: "images" | "books" | "audios" | "documents" | "trees" | "articles",
  id: string | number
): void {
  if (typeof window === "undefined") return;
  const targetId = String(id);
  const keysToCheck = [
    UPLOADS_STORAGE_KEY,
    "roots_custom_uploads",
    "roots_uploads",
    "roots_admin_uploads",
    "roots_gallery_uploads",
    `roots_uploaded_${kind}`,
    `roots_${kind}_uploads`,
  ];
  for (const k of keysToCheck) {
    try {
      const raw = localStorage.getItem(k);
      if (!raw) continue;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const filtered = parsed.filter((item: any) => String(item?.id || "") !== targetId);
        localStorage.setItem(k, JSON.stringify(filtered));
      } else if (parsed && typeof parsed === "object") {
        if (Array.isArray(parsed[kind])) {
          parsed[kind] = parsed[kind].filter((item: any) => String(item?.id || "") !== targetId);
          localStorage.setItem(k, JSON.stringify(parsed));
        }
      }
    } catch {
      // ignore
    }
  }
}
