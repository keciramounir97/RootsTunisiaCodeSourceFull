import { useLocation } from "react-router-dom";
import seo from "./seo-routes.json";

export type SeoConfig = typeof seo;

export const SEO_ORIGIN = String(seo.origin).replace(/\/$/, "");
export const SEO_DEFAULT_LOCALE = seo.defaultLocale as string;
export const SEO_LOCALES = seo.locales as string[];
export const SEO_RTL_LOCALES = (seo.rtlLocales || ["ar"]) as string[];

export function splitLocaleFromPath(pathname: string): {
  locale: string | null;
  path: string;
} {
  const parts = pathname.split("/").filter(Boolean);
  const first = parts[0];
  if (
    first &&
    SEO_LOCALES.includes(first) &&
    first !== SEO_DEFAULT_LOCALE
  ) {
    const rest = parts.slice(1).join("/");
    return { locale: first, path: rest ? `/${rest}` : "/" };
  }
  return { locale: null, path: pathname || "/" };
}

export function localizePath(path: string, locale: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (!locale || locale === SEO_DEFAULT_LOCALE) {
    return clean || "/";
  }
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}

export function absoluteUrl(path: string, locale = SEO_DEFAULT_LOCALE): string {
  const loc = localizePath(path, locale);
  return loc === "/" ? `${SEO_ORIGIN}/` : `${SEO_ORIGIN}${loc}`;
}

export function isRtlLocale(locale: string): boolean {
  return SEO_RTL_LOCALES.includes(locale);
}

export function useSeoPath() {
  const location = useLocation();
  return splitLocaleFromPath(location.pathname);
}

export function findSeoRoute(path: string) {
  const aliases = (seo.aliases || {}) as Record<string, string>;
  const canonical = aliases[path] || path;
  const route = (seo.routes || []).find((r: { path: string }) => r.path === canonical);
  const noindex = ((seo.noindex || []) as string[]).includes(path);
  return { route, canonical, noindex };
}
