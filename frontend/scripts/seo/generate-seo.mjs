#!/usr/bin/env node
/**
 * Build-time SEO generator for Roots sites.
 * Reads src/seo/seo-routes.json and writes sitemap.xml + robots.txt.
 *
 *   node scripts/seo/generate-seo.mjs
 *   node scripts/seo/generate-seo.mjs --public   # also write frontend/public/
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const frontendRoot = resolve(here, "../..");
const jsonPath = join(frontendRoot, "src/seo/seo-routes.json");
const writePublic = process.argv.includes("--public");
const today = new Date().toISOString().slice(0, 10);

const seo = JSON.parse(readFileSync(jsonPath, "utf8").replace(/^\uFEFF/, ""));
const origin = String(seo.origin).replace(/\/$/, "");
const locales = seo.locales;
const defaultLocale = seo.defaultLocale;
const aliases = seo.aliases || {};
const noindex = new Set(seo.noindex || []);

function localizePath(path, locale) {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (!locale || locale === defaultLocale) return clean === "" ? "/" : clean;
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}

function absolute(path, locale) {
  const loc = localizePath(path, locale);
  return loc === "/" ? `${origin}/` : `${origin}${loc}`;
}

const indexable = (seo.routes || []).filter(
  (r) => r.path && !noindex.has(r.path) && !aliases[r.path],
);

function xhtmlLinks(path) {
  const links = locales
    .map(
      (locale) =>
        `    <xhtml:link rel="alternate" hreflang="${locale}" href="${absolute(path, locale)}"/>`,
    )
    .join("\n");
  return `${links}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${absolute(path, defaultLocale)}"/>`;
}

const urls = [];
for (const route of indexable) {
  for (const locale of locales) {
    urls.push(`  <url>
    <loc>${absolute(route.path, locale)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq || "weekly"}</changefreq>
    <priority>${Number(route.priority ?? 0.5).toFixed(1)}</priority>
${xhtmlLinks(route.path)}
  </url>`);
  }
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>
`;

const robots = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /login
Disallow: /signup
Disallow: /resetpassword

Sitemap: ${origin}/sitemap.xml
`;

function writePair(dir) {
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "sitemap.xml"), sitemap, "utf8");
  writeFileSync(join(dir, "robots.txt"), robots, "utf8");
}

const distDir = join(frontendRoot, "dist");
if (existsSync(distDir) || !writePublic) {
  writePair(distDir);
}
if (writePublic) {
  writePair(join(frontendRoot, "public"));
}

console.log(
  `SEO written: ${indexable.length} routes × ${locales.length} locales = ${urls.length} sitemap URLs → ${origin}/sitemap.xml`,
);
