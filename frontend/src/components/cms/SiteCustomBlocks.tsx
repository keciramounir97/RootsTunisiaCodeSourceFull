import { useMemo } from "react";
import { useSiteContent } from "../../hooks/useSiteContent";

interface SiteCustomBlocksProps {
  pageId: string;
  fallbackPageId?: string;
  className?: string;
}

const DROP_BLOCKS_RE =
  /<(script|style|iframe|object|embed|noscript|template)\b[\s\S]*?<\/\1\s*>/gi;

/**
 * Defense-in-depth client sanitizer complementing the backend sanitizer.
 * Strips dangerous tags, event attributes, and unsafe URLs before rendering GrapesJS markup.
 */
export function sanitizeClientBuilderHtml(rawHtml: string): string {
  const cleaned = String(rawHtml || "").replace(DROP_BLOCKS_RE, "").trim();
  if (!cleaned) return "";

  if (typeof DOMParser === "undefined") {
    return cleaned
      .replace(/\son[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
      .replace(/(?:javascript|vbscript):/gi, "blocked:");
  }

  const doc = new DOMParser().parseFromString(cleaned, "text/html");
  doc
    .querySelectorAll("script, style, iframe, object, embed, link[rel='import'], meta")
    .forEach((el) => el.remove());

  doc.body.querySelectorAll("*").forEach((el) => {
    for (const attr of Array.from(el.attributes)) {
      const name = attr.name.toLowerCase();
      const val = attr.value.trim();
      if (name.startsWith("on")) {
        el.removeAttribute(attr.name);
        continue;
      }
      if (name === "href" || name === "src") {
        const compact = val.replace(/[\u0000-\u0020]+/g, "").toLowerCase();
        const safe =
          compact.startsWith("/") && !compact.startsWith("//")
            ? true
            : compact.startsWith("#")
              ? true
              : /^(https?:|mailto:|tel:)/.test(compact);
        if (!safe) {
          el.removeAttribute(attr.name);
        }
      }
      if (name === "style" && /expression\s*\(|javascript:|vbscript:|behavior:/i.test(val)) {
        el.removeAttribute("style");
      }
    }
  });

  return doc.body.innerHTML;
}

/**
 * Scope GrapesJS stylesheet rules to a specific container attribute so rules never leak globally.
 */
export function scopeBuilderCss(rawCss: string, scopeSelector: string): string {
  const input = String(rawCss || "")
    .replace(/<\/?style\b[^>]*>/gi, "")
    .replace(/<\/?script\b[^>]*>/gi, "")
    .replace(/@import\b[^;]*(;|$)/gi, "")
    .replace(/expression\s*\(|javascript:|vbscript:/gi, "blocked:")
    .trim();
  if (!input) return "";

  const prefixSelectors = (selectorList: string): string =>
    selectorList
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((sel) => {
        if (/^(?:html|body|:root|\*)$/i.test(sel)) {
          return sel === "*" ? `${scopeSelector} *` : scopeSelector;
        }
        const normalized = sel.replace(/^(?:html|body|:root)\b\s*/i, "");
        if (!normalized) return scopeSelector;
        if (normalized.startsWith(scopeSelector)) return normalized;
        return `${scopeSelector} ${normalized}`;
      })
      .join(", ");

  const walkBlock = (cssChunk: string): string => {
    let out = "";
    let i = 0;
    const len = cssChunk.length;

    while (i < len) {
      const openIdx = cssChunk.indexOf("{", i);
      if (openIdx === -1) break;
      const header = cssChunk.slice(i, openIdx).trim();

      // Match balanced braces for rule body or nested @media/@supports rule
      let depth = 1;
      let j = openIdx + 1;
      while (j < len && depth > 0) {
        if (cssChunk[j] === "{") depth++;
        else if (cssChunk[j] === "}") depth--;
        j++;
      }
      const body = cssChunk.slice(openIdx + 1, j - 1);
      i = j;

      if (!header) continue;
      if (/^@(?:keyframes|-webkit-keyframes|font-face)/i.test(header)) {
        out += `${header} {${body}}\n`;
      } else if (header.startsWith("@")) {
        out += `${header} {\n${walkBlock(body)}}\n`;
      } else {
        const scoped = prefixSelectors(header);
        if (scoped) out += `${scoped} {${body}}\n`;
      }
    }
    return out.trim();
  };

  return walkBlock(input);
}

/**
 * Renders live GrapesJS-designed custom sections persisted via `/admin/*-content`,
 * `/admin/legal-content`, or `/admin/footer-settings` on the corresponding public route.
 */
export default function SiteCustomBlocks({
  pageId,
  fallbackPageId,
  className = "",
}: SiteCustomBlocksProps) {
  const { getText } = useSiteContent();

  const rawHtml =
    getText(pageId, "grapes_builder", "html") ??
    (fallbackPageId ? getText(fallbackPageId, "grapes_builder", "html") : undefined) ??
    "";
  const rawCss =
    getText(pageId, "grapes_builder", "css") ??
    (fallbackPageId ? getText(fallbackPageId, "grapes_builder", "css") : undefined) ??
    "";

  const safeHtml = useMemo(() => sanitizeClientBuilderHtml(rawHtml), [rawHtml]);
  const safeAttrId = useMemo(
    () => pageId.replace(/[^A-Za-z0-9_-]/g, "") || "page",
    [pageId],
  );
  const scopedCss = useMemo(
    () => scopeBuilderCss(rawCss, `[data-rt-gjs-scope="${safeAttrId}"]`),
    [rawCss, safeAttrId],
  );

  if (!safeHtml) return null;

  return (
    <section
      data-rt-gjs-scope={safeAttrId}
      className={`rt-grapes-live w-full ${className}`.trim()}
    >
      {scopedCss ? <style>{scopedCss}</style> : null}
      <div dangerouslySetInnerHTML={{ __html: safeHtml }} />
    </section>
  );
}

