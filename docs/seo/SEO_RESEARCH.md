# Roots Tunisia — SEO research

## Search intent
Primary: "Tunisia genealogy, Tunisian family tree, Kairouan nasab, Carthage ancestry, état civil Tunisie".
Audience: Tunisian families in 24 governorates, the Italian and Maltese historical communities, and the Tunisian diaspora.

## Information architecture
Default locale unprefixed (`fr`). Other locales: `/{locale}{path}`.
Every indexable URL has:
- unique title/description in `seo-routes.json`
- canonical
- hreflang for fr, en, ar, es, it, mt, eo plus x-default
- lastmod / changefreq / priority in the XML sitemap

## Technical
- SPA: Google indexes the Vite-built HTML shell + crawler-rendered routes. Submit `https://rootstunisia.com/sitemap.xml`.
- robots.txt allows public pages; disallows `/admin/`, `/api/`, login/signup/reset.
- 301 `www` → bare origin.
- Open Graph / Twitter tags updated by SeoHead on client navigation.

## Content opportunities (do not copy other Roots brands)
Write original landing copy around the keywords above. One cluster per public collection (trees, books, articles, audio). Avoid doorway pages.

## Measurement
Search Console property for https://rootstunisia.com. Weekly impressions for brand + genealogy queries. Track Core Web Vitals after cache headers ship.
