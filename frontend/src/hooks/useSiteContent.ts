import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import { useTranslation } from "../context/TranslationContext";
import { resolveSiteImageUrl } from "./useSiteImages";

/**
 * Public Content Manager — public consumer hook.
 *
 * Fetches GET /site-content ONCE per page load (shared module cache + in-flight
 * de-duplication) and exposes locale-aware getters. Every getter returns
 * `undefined` when no override exists so callers keep their hardcoded default:
 *
 *   const { getText, getImage } = useSiteContent();
 *   const title = getText("home", "hero", "title") ?? t("hero_title");
 */

export type SiteContentFieldType =
  | "text"
  | "html"
  | "image"
  | "list"
  | "builder_html"
  | "css"
  | "json";
export type SiteContentValue = string | string[];

export interface PublicFieldEntry {
  type: SiteContentFieldType;
  value: SiteContentValue;
  translations?: Record<string, SiteContentValue>;
}

export interface PublicSiteContent {
  version: number;
  updatedAt: string | null;
  pages: Record<string, Record<string, Record<string, PublicFieldEntry>>>;
}

const EMPTY_CONTENT: PublicSiteContent = { version: 1, updatedAt: null, pages: {} };

let cache: PublicSiteContent | null = null;
let inflight: Promise<PublicSiteContent> | null = null;
const listeners = new Set<(content: PublicSiteContent) => void>();

const isEmpty = (value: SiteContentValue | undefined) =>
  value === undefined ||
  (Array.isArray(value) ? value.length === 0 : !String(value).trim());

async function load(): Promise<PublicSiteContent> {
  const res = await api.get("/site-content");
  const payload = (res.data?.data ?? res.data) as Partial<PublicSiteContent> | undefined;
  return payload && typeof payload === "object" && payload.pages
    ? (payload as PublicSiteContent)
    : EMPTY_CONTENT;
}

function fetchOnce(): Promise<PublicSiteContent> {
  if (cache) return Promise.resolve(cache);
  if (!inflight) {
    inflight = load()
      .then((content) => {
        cache = content;
        listeners.forEach((fn) => fn(content));
        return content;
      })
      .catch(() => EMPTY_CONTENT) // site keeps hardcoded defaults; next mount retries
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

/** Drop the cache (e.g. after the admin saved) and notify mounted consumers. */
export async function refreshSiteContent(): Promise<PublicSiteContent> {
  cache = null;
  inflight = null;
  const content = await fetchOnce();
  return content;
}

export function resolveEntry(
  content: PublicSiteContent,
  page: string,
  section: string,
  key: string,
  locale: string,
): SiteContentValue | undefined {
  const entry = content.pages?.[page]?.[section]?.[key];
  if (!entry) return undefined;
  const translated = entry.type === "image" ? undefined : entry.translations?.[locale];
  if (!isEmpty(translated)) return translated;
  return isEmpty(entry.value) ? undefined : entry.value;
}

export function useSiteContent() {
  const { locale } = useTranslation();
  const [content, setContent] = useState<PublicSiteContent>(cache ?? EMPTY_CONTENT);
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    let active = true;
    const onUpdate = (next: PublicSiteContent) => {
      if (active) setContent(next);
    };
    listeners.add(onUpdate);
    if (cache) {
      setContent(cache);
      setLoading(false);
    } else {
      void fetchOnce().then((next) => {
        if (!active) return;
        setContent(next);
        setLoading(false);
      });
    }
    return () => {
      active = false;
      listeners.delete(onUpdate);
    };
  }, []);

  const getText = useCallback(
    (page: string, section: string, key: string): string | undefined => {
      const value = resolveEntry(content, page, section, key, locale);
      return typeof value === "string" ? value : undefined;
    },
    [content, locale],
  );

  /** Sanitized server-side; render with dangerouslySetInnerHTML. */
  const getHtml = getText;

  const getImage = useCallback(
    (page: string, section: string, key: string): string | undefined => {
      const value = resolveEntry(content, page, section, key, locale);
      const url = typeof value === "string" ? resolveSiteImageUrl(value) : "";
      return url || undefined;
    },
    [content, locale],
  );

  const getList = useCallback(
    (page: string, section: string, key: string): string[] | undefined => {
      const value = resolveEntry(content, page, section, key, locale);
      return Array.isArray(value) ? value : undefined;
    },
    [content, locale],
  );

  return useMemo(
    () => ({ content, loading, getText, getHtml, getImage, getList }),
    [content, loading, getText, getHtml, getImage, getList],
  );
}
