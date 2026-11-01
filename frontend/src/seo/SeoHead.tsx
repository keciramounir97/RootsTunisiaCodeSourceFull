import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import seo from "../seo/seo-routes.json";
import {
  SEO_DEFAULT_LOCALE,
  SEO_LOCALES,
  SEO_ORIGIN,
  absoluteUrl,
  findSeoRoute,
  isRtlLocale,
  splitLocaleFromPath,
} from "../seo/localeRouting";

type LocaleMap = Record<string, string>;

function pick(map: LocaleMap | undefined, locale: string): string {
  if (!map) return "";
  return map[locale] || map[SEO_DEFAULT_LOCALE] || Object.values(map)[0] || "";
}

function upsert(
  selector: string,
  create: () => HTMLElement,
  apply: (el: HTMLElement) => void,
) {
  let el = document.head.querySelector(selector) as HTMLElement | null;
  if (!el) {
    el = create();
    el.setAttribute("data-seo", "managed");
    document.head.appendChild(el);
  }
  apply(el);
}

export default function SeoHead() {
  const location = useLocation();
  const { locale: prefixLocale, path } = splitLocaleFromPath(location.pathname);
  const locale = prefixLocale || SEO_DEFAULT_LOCALE;
  const { route, canonical, noindex } = findSeoRoute(path);

  useEffect(() => {
    const title = pick(route?.title as LocaleMap | undefined, locale) || seo.siteName;
    const description =
      pick(route?.description as LocaleMap | undefined, locale) || "";
    const canonicalHref = absoluteUrl(canonical, locale);
    const robots = noindex || !route ? "noindex,follow" : "index,follow";

    document.title = title;
    document.documentElement.lang = locale;
    document.documentElement.dir = isRtlLocale(locale) ? "rtl" : "ltr";

    upsert('meta[name="description"]', () => {
      const m = document.createElement("meta");
      m.setAttribute("name", "description");
      return m;
    }, (el) => el.setAttribute("content", description));

    upsert('meta[name="robots"]', () => {
      const m = document.createElement("meta");
      m.setAttribute("name", "robots");
      return m;
    }, (el) => el.setAttribute("content", robots));

    upsert('link[rel="canonical"]', () => {
      const l = document.createElement("link");
      l.setAttribute("rel", "canonical");
      return l;
    }, (el) => el.setAttribute("href", canonicalHref));

    document.head
      .querySelectorAll('link[rel="alternate"][data-seo="managed"]')
      .forEach((n) => n.remove());
    for (const loc of SEO_LOCALES) {
      const link = document.createElement("link");
      link.setAttribute("rel", "alternate");
      link.setAttribute("hreflang", loc);
      link.setAttribute("href", absoluteUrl(canonical, loc));
      link.setAttribute("data-seo", "managed");
      document.head.appendChild(link);
    }
    const xDefault = document.createElement("link");
    xDefault.setAttribute("rel", "alternate");
    xDefault.setAttribute("hreflang", "x-default");
    xDefault.setAttribute("href", absoluteUrl(canonical, SEO_DEFAULT_LOCALE));
    xDefault.setAttribute("data-seo", "managed");
    document.head.appendChild(xDefault);

    const og = [
      ["og:title", title],
      ["og:description", description],
      ["og:url", canonicalHref],
      ["og:type", path === "/" ? "website" : "article"],
      ["og:site_name", seo.siteName],
      ["og:image", `${SEO_ORIGIN}${seo.ogImage || "/og-image.png"}`],
      ["og:locale", locale],
    ];
    for (const [property, content] of og) {
      upsert(`meta[property="${property}"]`, () => {
        const m = document.createElement("meta");
        m.setAttribute("property", property);
        return m;
      }, (el) => el.setAttribute("content", content));
    }

    const jsonLd =
      path === "/"
        ? {
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                name: seo.siteName,
                url: `${SEO_ORIGIN}/`,
                logo: `${SEO_ORIGIN}${(seo.organization as { logo?: string })?.logo || "/logo-512.png"}`,
                email: (seo.organization as { email?: string })?.email,
              },
              {
                "@type": "WebSite",
                name: seo.siteName,
                url: `${SEO_ORIGIN}/`,
                inLanguage: SEO_LOCALES,
              },
            ],
          }
        : {
            "@context": "https://schema.org",
            "@type": route?.schemaType || "WebPage",
            name: title,
            description,
            url: canonicalHref,
          };

    upsert('script[type="application/ld+json"][data-seo="managed"]', () => {
      const s = document.createElement("script");
      s.setAttribute("type", "application/ld+json");
      return s;
    }, (el) => {
      el.textContent = JSON.stringify(jsonLd);
    });
  }, [canonical, locale, noindex, path, route]);

  return null;
}
