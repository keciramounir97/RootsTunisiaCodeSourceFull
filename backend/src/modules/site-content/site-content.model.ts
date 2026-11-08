import { BadRequestException } from "@nestjs/common";

/**
 * Public Content Manager — content model (v1)
 *
 * pages[] -> sections[] -> fields[]
 *
 * A field's `value` is the default (all languages). `translations[locale]`
 * overrides it for one locale. An empty value means "no override": the public
 * site keeps its built-in hardcoded/i18n default.
 */

export const SITE_CONTENT_KEY = "public_content_v1";
export const SITE_CONTENT_VERSION = 1;
export const SITE_CONTENT_UPLOAD_URL_PREFIX = "/uploads/site-content/";

export type FieldType = "text" | "html" | "image" | "list";
export const FIELD_TYPES: FieldType[] = ["text", "html", "image", "list"];

export type FieldValue = string | string[];

export interface ContentField {
  key: string;
  type: FieldType;
  label: string;
  hint?: string;
  value: FieldValue;
  /** locale -> override (text/html/list only) */
  translations?: Record<string, FieldValue>;
}

export interface ContentSection {
  id: string;
  label: string;
  description?: string;
  fields: ContentField[];
}

export interface ContentPage {
  id: string;
  label: string;
  description?: string;
  path?: string;
  sections: ContentSection[];
}

export interface SiteContentDocument {
  version: number;
  updatedAt: string | null;
  updatedBy: number | null;
  pages: ContentPage[];
}

export interface PublicFieldEntry {
  type: FieldType;
  value: FieldValue;
  translations?: Record<string, FieldValue>;
}

export interface PublicSiteContent {
  version: number;
  updatedAt: string | null;
  pages: Record<string, Record<string, Record<string, PublicFieldEntry>>>;
}

/* ------------------------------------------------------------------ */
/* Default seed schema                                                 */
/* ------------------------------------------------------------------ */

const text = (key: string, label: string, hint?: string): ContentField => ({
  key,
  type: "text",
  label,
  ...(hint ? { hint } : {}),
  value: "",
});
const html = (key: string, label: string, hint?: string): ContentField => ({
  key,
  type: "html",
  label,
  ...(hint ? { hint } : {}),
  value: "",
});
const image = (key: string, label: string, hint?: string): ContentField => ({
  key,
  type: "image",
  label,
  ...(hint ? { hint } : {}),
  value: "",
});
const list = (key: string, label: string, hint?: string): ContentField => ({
  key,
  type: "list",
  label,
  ...(hint ? { hint } : {}),
  value: [],
});

const heroSection = (extra: ContentField[] = []): ContentSection => ({
  id: "hero",
  label: "Hero banner",
  description: "Top-of-page banner: eyebrow, heading, subtitle and background image.",
  fields: [
    text("eyebrow", "Eyebrow / badge"),
    text("title", "Heading"),
    text("subtitle", "Subtitle", "Leave empty to keep the built-in text."),
    image("image", "Hero image", "Recommended: landscape, at least 1600×900."),
    ...extra,
  ],
});

const introSection = (): ContentSection => ({
  id: "intro",
  label: "Introduction",
  description: "Introductory heading and rich-text body.",
  fields: [
    text("title", "Heading"),
    html("body", "Body (rich text)", "Allowed: p, br, strong, em, ul/ol/li, a, h2–h4, blockquote."),
  ],
});

export function buildDefaultPages(): ContentPage[] {
  return [
    {
      id: "home",
      label: "Home",
      path: "/",
      description: "Landing page: hero, mission banner and calls to action.",
      sections: [
        heroSection(),
        {
          id: "preserve",
          label: "Mission banner",
          description: "Dark banner under the statistics (\"Preserve your lineage\").",
          fields: [
            text("title", "Heading"),
            text("description", "Description"),
            image("image", "Background image"),
          ],
        },
        {
          id: "gallery",
          label: "Home photo strip",
          description: "Tunisian heritage stills on the home page (not Gallery des images).",
          fields: [
            image("image_1", "Photo 1"),
            image("image_2", "Photo 2"),
            image("image_3", "Photo 3"),
            image("image_4", "Photo 4"),
            image("image_5", "Photo 5"),
            image("image_6", "Photo 6"),
          ],
        },
        {
          id: "why",
          label: "Why Roots Tunisia",
          fields: [text("title", "Heading"), text("intro", "Intro")],
        },
        {
          id: "cta",
          label: "Final call to action",
          fields: [text("title", "Heading"), text("description", "Description")],
        },
      ],
    },
    {
      id: "about",
      label: "About",
      path: "/about",
      description: "Mission, methodology and history of the platform.",
      sections: [
        heroSection(),
        {
          id: "mission",
          label: "Mission",
          fields: [
            text("title", "Heading"),
            text("intro", "Intro"),
            html("body", "Body (rich text)"),
          ],
        },
        {
          id: "highlights",
          label: "Highlights",
          fields: [list("items", "Highlight bullets", "One bullet per line.")],
        },
        {
          id: "cta",
          label: "Closing call to action",
          fields: [text("title", "Heading")],
        },
      ],
    },
    {
      id: "gallery",
      label: "Gallery hub",
      path: "/gallery",
      description: "Tunisia collections hub (trees, photos, books, audio, documents).",
      sections: [heroSection(), introSection()],
    },
    {
      id: "gallery_images",
      label: "Photo archives",
      path: "/gallery/images",
      description: "Community & curated Tunisian photo archives.",
      sections: [heroSection(), introSection()],
    },
    {
      id: "gallery_trees",
      label: "Family trees gallery",
      path: "/gallery/trees",
      description: "Public Tunisian family trees.",
      sections: [heroSection(), introSection()],
    },
    {
      id: "gallery_articles",
      label: "Articles gallery",
      path: "/gallery/articles",
      description: "Essays and research notes on Tunisian heritage.",
      sections: [heroSection(), introSection()],
    },
    {
      id: "gallery_documents",
      label: "Documents gallery",
      path: "/gallery/documents",
      description: "Archival documents shared in the gallery.",
      sections: [heroSection(), introSection()],
    },
    {
      id: "library",
      label: "Library",
      path: "/library",
      description: "Digital library of books and manuscripts.",
      sections: [heroSection(), introSection()],
    },
    {
      id: "audio",
      label: "Audio",
      path: "/audio",
      description: "Oral history and audio archive.",
      sections: [heroSection(), introSection()],
    },
    {
      id: "documents",
      label: "Documents",
      path: "/documents",
      description: "Archival documents and records.",
      sections: [heroSection(), introSection()],
    },
    {
      id: "contact",
      label: "Contact",
      path: "/contact",
      description: "Contact page: hero, coordinates and form intro.",
      sections: [
        heroSection(),
        {
          id: "details",
          label: "Contact details",
          description: "Replaces the e-mail, phone and opening hours shown on the page.",
          fields: [
            text("email", "E-mail"),
            text("phone", "Phone"),
            text("hours", "Opening hours"),
            text("address", "Address"),
          ],
        },
        {
          id: "form",
          label: "Contact form",
          fields: [text("title", "Heading"), text("intro", "Intro")],
        },
      ],
    },
    {
      id: "research",
      label: "Sources & archives",
      path: "/sources",
      description: "Research guidance, sources and archives.",
      sections: [
        heroSection(),
        introSection(),
        {
          id: "tips",
          label: "Research tips",
          fields: [list("items", "Tips", "One tip per line.")],
        },
      ],
    },
    {
      id: "periods",
      label: "Historical periods",
      path: "/periods",
      description: "Tunisia historical eras timeline.",
      sections: [heroSection(), introSection()],
    },
    {
      id: "subscriptions",
      label: "Subscriptions",
      path: "/subscriptions",
      description: "Membership tiers and checkout.",
      sections: [heroSection()],
    },
    {
      id: "refund",
      label: "Refund policy",
      path: "/refund",
      sections: [heroSection()],
    },
    {
      id: "privacy",
      label: "Privacy",
      path: "/privacy",
      sections: [heroSection()],
    },
    {
      id: "terms",
      label: "Terms",
      path: "/terms",
      sections: [heroSection()],
    },
    {
      id: "cookies",
      label: "Cookies",
      path: "/cookies",
      sections: [heroSection()],
    },
  ];
}

/* ------------------------------------------------------------------ */
/* Sanitizers                                                          */
/* ------------------------------------------------------------------ */

const ID_RE = /^[A-Za-z0-9_-]{1,64}$/;
const LOCALE_RE = /^[a-z]{2,3}$/;
const MAX_PAGES = 50;
const MAX_SECTIONS = 100;
const MAX_FIELDS = 200;
const MAX_TEXT = 5000;
const MAX_HTML = 200_000;
const MAX_LIST_ITEMS = 200;
const MAX_LIST_ITEM_LEN = 2000;
export const MAX_DOCUMENT_BYTES = 2 * 1024 * 1024;

const ALLOWED_TAGS = new Set([
  "p", "br", "strong", "b", "em", "i", "u", "ul", "ol", "li",
  "a", "h2", "h3", "h4", "blockquote", "span",
]);
const VOID_TAGS = new Set(["br"]);
const DROP_WITH_CONTENT_RE =
  /<(script|style|iframe|object|embed|noscript|template)\b[\s\S]*?<\/\1\s*>/gi;

const escapeText = (value: string) =>
  value.replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escapeAttr = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const isSafeHref = (href: string) => {
  const v = href.replace(/[\u0000-\u0020]+/g, "").toLowerCase();
  if (!v) return false;
  if (v.startsWith("#") || v.startsWith("/")) return !v.startsWith("//");
  return /^(https?:|mailto:|tel:)/.test(v);
};

/** Allow-list HTML sanitizer: unknown tags removed, text escaped, only safe `a[href]` attrs kept. */
export function sanitizeHtml(input: string): string {
  const source = String(input || "").replace(DROP_WITH_CONTENT_RE, "").replace(/<!--[\s\S]*?-->/g, "");
  const tagRe = /<(\/?)([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/g;
  let out = "";
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = tagRe.exec(source))) {
    out += escapeText(source.slice(last, match.index));
    last = match.index + match[0].length;
    const closing = match[1] === "/";
    const tag = match[2].toLowerCase();
    if (!ALLOWED_TAGS.has(tag)) continue;
    if (closing) {
      if (!VOID_TAGS.has(tag)) out += `</${tag}>`;
      continue;
    }
    if (tag === "a") {
      const attrs = match[3];
      const hrefMatch = /\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/i.exec(attrs);
      const href = (hrefMatch?.[1] ?? hrefMatch?.[2] ?? hrefMatch?.[3] ?? "").trim();
      if (href && isSafeHref(href)) {
        const external = /^https?:/i.test(href);
        out += `<a href="${escapeAttr(href)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ""}>`;
      } else {
        out += "<a>";
      }
      continue;
    }
    out += `<${tag}>`;
  }
  out += escapeText(source.slice(last));
  return out;
}

export function sanitizeImageRef(value: unknown, where = "image"): string {
  const raw = typeof value === "string" ? value.trim() : "";
  if (!raw) return "";
  if (raw.length > 2048) {
    throw new BadRequestException(`Image reference too long (${where})`);
  }
  if (/^https?:\/\/[^\s]+$/i.test(raw)) return raw;
  if (/^\/uploads\/[A-Za-z0-9._\-\/]+$/.test(raw) && !raw.includes("..")) return raw;
  if (
    /^\/(heritage|assets)\/[A-Za-z0-9._\-\/]+$/.test(raw) &&
    !raw.includes("..")
  ) {
    return raw;
  }
  throw new BadRequestException(
    `Invalid image reference (${where}). Use an uploaded image, /heritage/…, /assets/…, or an http(s) URL.`,
  );
}

const cleanString = (value: unknown, max: number): string => {
  if (typeof value === "string") return value.slice(0, max);
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return "";
};

const cleanList = (value: unknown): string[] => {
  const arr = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(/\r?\n/)
      : [];
  return arr
    .map((item) => cleanString(item, MAX_LIST_ITEM_LEN).trim())
    .filter(Boolean)
    .slice(0, MAX_LIST_ITEMS);
};

export function sanitizeFieldValue(type: FieldType, value: unknown, where: string): FieldValue {
  switch (type) {
    case "text":
      return cleanString(value, MAX_TEXT);
    case "html":
      return sanitizeHtml(cleanString(value, MAX_HTML));
    case "image":
      return sanitizeImageRef(value, where);
    case "list":
      return cleanList(value);
  }
}

export const isEmptyValue = (value: FieldValue | undefined) =>
  Array.isArray(value) ? value.length === 0 : !String(value ?? "").trim();

const requireId = (value: unknown, what: string): string => {
  if (typeof value !== "string" || !ID_RE.test(value)) {
    throw new BadRequestException(
      `Invalid ${what} id "${String(value)}": use 1-64 letters, digits, "_" or "-"`,
    );
  }
  return value;
};

const cleanLabel = (value: unknown, fallback: string) =>
  cleanString(value, 200).trim() || fallback;

/** Validate + normalize an incoming `pages` array. Throws BadRequestException on bad structure. */
export function sanitizePages(input: unknown): ContentPage[] {
  if (!Array.isArray(input)) {
    throw new BadRequestException("`pages` must be an array");
  }
  if (input.length > MAX_PAGES) {
    throw new BadRequestException(`Too many pages (max ${MAX_PAGES})`);
  }
  const seenPages = new Set<string>();
  const pages = input.map((rawPage: any) => {
    const pageId = requireId(rawPage?.id, "page");
    if (seenPages.has(pageId)) throw new BadRequestException(`Duplicate page id "${pageId}"`);
    seenPages.add(pageId);
    if (!Array.isArray(rawPage.sections)) {
      throw new BadRequestException(`Page "${pageId}": \`sections\` must be an array`);
    }
    if (rawPage.sections.length > MAX_SECTIONS) {
      throw new BadRequestException(`Page "${pageId}": too many sections`);
    }
    const seenSections = new Set<string>();
    const sections = rawPage.sections.map((rawSection: any) => {
      const sectionId = requireId(rawSection?.id, `section (page ${pageId})`);
      if (seenSections.has(sectionId)) {
        throw new BadRequestException(`Duplicate section id "${pageId}.${sectionId}"`);
      }
      seenSections.add(sectionId);
      if (!Array.isArray(rawSection.fields)) {
        throw new BadRequestException(`Section "${pageId}.${sectionId}": \`fields\` must be an array`);
      }
      if (rawSection.fields.length > MAX_FIELDS) {
        throw new BadRequestException(`Section "${pageId}.${sectionId}": too many fields`);
      }
      const seenFields = new Set<string>();
      const fields = rawSection.fields.map((rawField: any) => {
        const key = requireId(rawField?.key, `field (${pageId}.${sectionId})`);
        if (seenFields.has(key)) {
          throw new BadRequestException(`Duplicate field key "${pageId}.${sectionId}.${key}"`);
        }
        seenFields.add(key);
        const type = rawField.type as FieldType;
        if (!FIELD_TYPES.includes(type)) {
          throw new BadRequestException(
            `Field "${pageId}.${sectionId}.${key}": type must be one of ${FIELD_TYPES.join(", ")}`,
          );
        }
        const where = `${pageId}.${sectionId}.${key}`;
        const field: ContentField = {
          key,
          type,
          label: cleanLabel(rawField.label, key),
          value: sanitizeFieldValue(type, rawField.value, where),
        };
        const hint = cleanString(rawField.hint, 300).trim();
        if (hint) field.hint = hint;
        if (type !== "image" && rawField.translations && typeof rawField.translations === "object") {
          const translations: Record<string, FieldValue> = {};
          for (const [locale, raw] of Object.entries(rawField.translations)) {
            if (!LOCALE_RE.test(locale)) {
              throw new BadRequestException(`Field "${where}": invalid locale "${locale}"`);
            }
            const clean = sanitizeFieldValue(type, raw, `${where}[${locale}]`);
            if (!isEmptyValue(clean)) translations[locale] = clean;
          }
          if (Object.keys(translations).length) field.translations = translations;
        }
        return field;
      });
      const section: ContentSection = {
        id: sectionId,
        label: cleanLabel(rawSection.label, sectionId),
        fields,
      };
      const description = cleanString(rawSection.description, 400).trim();
      if (description) section.description = description;
      return section;
    });
    const page: ContentPage = {
      id: pageId,
      label: cleanLabel(rawPage.label, pageId),
      sections,
    };
    const description = cleanString(rawPage.description, 400).trim();
    if (description) page.description = description;
    const pagePath = cleanString(rawPage.path, 200).trim();
    if (pagePath) page.path = pagePath;
    return page;
  });
  if (Buffer.byteLength(JSON.stringify(pages), "utf8") > MAX_DOCUMENT_BYTES) {
    throw new BadRequestException("Content too large (max 2 MB)");
  }
  return pages;
}

/* ------------------------------------------------------------------ */
/* Merge / projection helpers                                          */
/* ------------------------------------------------------------------ */

const cloneField = (field: ContentField): ContentField =>
  JSON.parse(JSON.stringify(field));

/**
 * Overlay stored values on the default schema. Default pages/sections/fields
 * always exist (labels + types come from the schema); stored custom entries
 * not present in the schema are appended.
 */
export function mergeWithDefaults(
  stored: ContentPage[] | null | undefined,
  defaults: ContentPage[] = buildDefaultPages(),
): ContentPage[] {
  const storedPages = Array.isArray(stored) ? stored : [];
  const storedPageMap = new Map(storedPages.map((p) => [p.id, p]));
  const defaultPageIds = new Set(defaults.map((p) => p.id));

  const mergeSection = (def: ContentSection | null, st: ContentSection | undefined): ContentSection => {
    const base: ContentSection = def
      ? { ...def, fields: [] }
      : { id: st!.id, label: st!.label, description: st!.description, fields: [] };
    const storedFieldMap = new Map((st?.fields || []).map((f) => [f.key, f]));
    const defFieldKeys = new Set((def?.fields || []).map((f) => f.key));
    for (const defField of def?.fields || []) {
      const field = cloneField(defField);
      const storedField = storedFieldMap.get(defField.key);
      if (storedField && storedField.type === defField.type) {
        field.value = storedField.value;
        if (storedField.translations) field.translations = storedField.translations;
      }
      base.fields.push(field);
    }
    for (const storedField of st?.fields || []) {
      if (!defFieldKeys.has(storedField.key)) base.fields.push(cloneField(storedField));
    }
    return base;
  };

  const mergePage = (def: ContentPage | null, st: ContentPage | undefined): ContentPage => {
    const base: ContentPage = def
      ? { ...def, sections: [] }
      : { id: st!.id, label: st!.label, description: st!.description, path: st!.path, sections: [] };
    const storedSectionMap = new Map((st?.sections || []).map((s) => [s.id, s]));
    const defSectionIds = new Set((def?.sections || []).map((s) => s.id));
    for (const defSection of def?.sections || []) {
      base.sections.push(mergeSection(defSection, storedSectionMap.get(defSection.id)));
    }
    for (const storedSection of st?.sections || []) {
      if (!defSectionIds.has(storedSection.id)) base.sections.push(mergeSection(null, storedSection));
    }
    return base;
  };

  const merged = defaults.map((def) => mergePage(def, storedPageMap.get(def.id)));
  for (const storedPage of storedPages) {
    if (!defaultPageIds.has(storedPage.id)) merged.push(mergePage(null, storedPage));
  }
  return merged;
}

/** Compact public projection: only fields that carry an override. */
export function toPublicContent(doc: SiteContentDocument): PublicSiteContent {
  const pages: PublicSiteContent["pages"] = {};
  for (const page of doc.pages) {
    for (const section of page.sections) {
      for (const field of section.fields) {
        const hasTranslations = field.translations && Object.keys(field.translations).length > 0;
        if (isEmptyValue(field.value) && !hasTranslations) continue;
        const entry: PublicFieldEntry = { type: field.type, value: field.value };
        if (hasTranslations) entry.translations = field.translations;
        pages[page.id] ??= {};
        pages[page.id][section.id] ??= {};
        pages[page.id][section.id][field.key] = entry;
      }
    }
  }
  return { version: doc.version, updatedAt: doc.updatedAt, pages };
}

/** All `/uploads/site-content/<file>` filenames referenced by a page list. */
export function collectUploadedFilenames(pages: ContentPage[]): Set<string> {
  const names = new Set<string>();
  for (const page of pages) {
    for (const section of page.sections) {
      for (const field of section.fields) {
        if (field.type !== "image" || typeof field.value !== "string") continue;
        const value = field.value;
        if (!value.startsWith(SITE_CONTENT_UPLOAD_URL_PREFIX)) continue;
        const name = value.slice(SITE_CONTENT_UPLOAD_URL_PREFIX.length);
        if (/^[A-Za-z0-9._-]+$/.test(name)) names.add(name);
      }
    }
  }
  return names;
}
