# Google Search Console — Roots Tunisia

1. Add a URL-prefix property for `https://rootstunisia.com` (and a Domain property covering the host if DNS access exists).
2. Verify with the HTML tag, DNS TXT, or the already-deployed `robots.txt` / Google Analytics if present.
3. Sitemaps → Add sitemap → `sitemap.xml` (full URL: `https://rootstunisia.com/sitemap.xml`).
4. Confirm the report shows ~22 routes × 7 locales. Default-locale URLs have no prefix.
5. After the first fetch, inspect a sample URL Inspection for `/about` and `/en/about`.
6. International targeting: rely on hreflang in the sitemap; do not force a Search Console country target except for Egypt (Egypt) and Tunisia (Tunisia) if you want a geographic hint.
7. Coverage: fix 404s and redirect `www` duplicates. Mark `/admin/*` as excluded (already robots-disallowed).
8. Enhancements: watch for breadcrumb/WebSite JSON-LD emitted by SeoHead.

Do not submit sitemaps that include login, signup, payment, or API URLs.
