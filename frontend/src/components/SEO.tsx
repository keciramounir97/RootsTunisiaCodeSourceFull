import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string | string[];
  ogImage?: string;
  ogType?: string;
  canonical?: string;
  jsonLd?: Record<string, any>;
}

export default function SEO({
  title,
  description,
  keywords,
  ogImage = "/og-image.png",
  ogType = "website",
  canonical,
  jsonLd,
}: SEOProps) {
  useEffect(() => {
    // 1. Update Title
    if (title) {
      document.title = `${title} | Roots Tunisia`;
    }

    // Helper to get or create meta tag
    const updateMeta = (name: string, content: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let el = document.head.querySelector(selector);
      if (!el) {
        el = document.createElement("meta");
        if (isProperty) {
          el.setAttribute("property", name);
        } else {
          el.setAttribute("name", name);
        }
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    // 2. Update meta tags
    if (description) {
      updateMeta("description", description);
      updateMeta("og:description", description, true);
      updateMeta("twitter:description", description);
    }

    if (title) {
      updateMeta("og:title", title, true);
      updateMeta("twitter:title", title);
    }

    if (keywords) {
      const keywordStr = Array.isArray(keywords) ? keywords.join(", ") : keywords;
      updateMeta("keywords", keywordStr);
    }

    if (ogImage) {
      // Ensure image URL is absolute
      const absoluteImage = ogImage.startsWith("http")
        ? ogImage
        : `${window.location.origin}${ogImage}`;
      updateMeta("og:image", absoluteImage, true);
      updateMeta("twitter:image", absoluteImage);
    }

    updateMeta("og:type", ogType, true);

    // 3. Update Canonical Link
    const canonicalUrl = canonical || window.location.href;
    let linkEl: HTMLLinkElement | null = document.head.querySelector('link[rel="canonical"]');
    if (!linkEl) {
      linkEl = document.createElement("link");
      linkEl.setAttribute("rel", "canonical");
      document.head.appendChild(linkEl);
    }
    linkEl.setAttribute("href", canonicalUrl);

    // 4. Update JSON-LD
    let scriptEl = document.getElementById("jsonLd-seo") as HTMLScriptElement | null;
    if (jsonLd) {
      if (!scriptEl) {
        scriptEl = document.createElement("script");
        scriptEl.id = "jsonLd-seo";
        scriptEl.type = "application/ld+json";
        document.head.appendChild(scriptEl);
      }
      scriptEl.text = JSON.stringify(jsonLd);
    } else if (scriptEl) {
      scriptEl.remove();
    }
  }, [title, description, keywords, ogImage, ogType, canonical, jsonLd]);

  return null;
}
