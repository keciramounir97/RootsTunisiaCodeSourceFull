# Roots network overhaul — October 2026

This plan covers the five Roots websites. It is identical in every workspace so any contributor can see the whole programme; the site-specific facts are in the table below. Status is tracked in each workspace's `docs/CHANGELOG_OVERHAUL.md`.

## Owner decisions (2026-10-01)

| Topic | Decision |
| --- | --- |
| Git | Work happens on the local branch `overhaul/2026-10-01` in every repo. Pre-existing uncommitted work was committed first as a "baseline snapshot". Nothing is pushed until the owner says so. Roots Western Sahara was initialised as a local git repo (no remote). |
| Marketing plans | One plan per brand, written in LaTeX and delivered as `.tex`, `.pdf` and `.docx` in `docs/marketing/`. |
| Tooling | Tectonic (LaTeX), Pandoc, autocannon, Playwright Chromium, sharp and svgo are installed outside the repos (see "Tooling"). |
| SEO depth | Full: language-prefixed URLs with hreflang, build-time static HTML for every public page and language, sitemap + robots generated at build time. |
| Western Sahara languages | Arabic, Spanish, French, English (Italian, Maltese and Esperanto inherited from Tunisia are removed). |
| Western Sahara imagery | Neutral, non-Tunisian placeholders until the owner supplies real photographs. |
| Repo hygiene | Maghreb's deleted `.gitignore` restored; Tunisia's `backend/.env` untracked (credentials remain in history and must be rotated). |

## Site facts

| Site | Workspace folder | Canonical origin | API origin | Default locale | Locales | Local DB | Local API port | Local web port |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Roots Abraham | `AbrahamRoots-full-code-source-main/AbrahamRoots-full-code-source-main` | `https://rootsabraham.com` | `https://api.rootsabraham.com` | fr | fr, en, ar, he | `rootsabraham` | 5101 | 5171 |
| Roots Egypt | `RootsEgypt-full-SourceCode-main/RootsEgypt-full-SourceCode-main` | `https://rootsegypt.org` | `https://api.rootsegypt.org` | en | en, fr, ar, es | `rootsegypt` | 5102 | 5172 |
| Roots Maghreb | `RootsMaghrebCodeSource-main/RootsMaghrebCodeSource-main` | `https://rootsmaghreb.com` | `https://server.rootsmaghreb.com` | en | en, fr, ar, es | `rootsmaghreb` | 5103 | 5173 |
| Roots Tunisia | `RootsTunisiaCodeSourceFull` | `https://rootstunisia.com` | `https://server.rootstunisia.com` | fr | fr, en, ar, es, it, mt, eo | `rootstunisiadb` | 5104 | 5174 |
| Roots Western Sahara | `RootsWesternSahara` | `https://rootswesternsahara.com` | `https://server.rootswesternsahara.com` | fr | fr, en, ar, es | `rootswesternsahara` | 5105 | 5175 |

Canonical host is the bare domain for every site. As of 2026-10-01 Abraham, Egypt and Maghreb answer on both `www` and the bare domain without redirecting (duplicate content), `https://www.rootstunisia.com` fails TLS (its certificate does not cover `www`), and `rootswesternsahara.com` does not resolve yet. Hosting should 301-redirect `www` to the bare domain.

## Global constraints

1. **No pushes.** Contributors never run `git push`. Sub-agents do not commit; the orchestrator reviews and commits by path. Never run `git add -A` while other work is in progress.
2. **Each site keeps its own identity.** Palette, typography, layout language, imagery and copy stay site-specific. Data/behaviour logic may be ported between sites; visual components and content may not be copied across brands.
3. **Never touch production data.** Several `backend/.env` files point at remote production databases. Every local run must override the database with environment variables pointing at local MySQL (`root` / `636363` at `127.0.0.1:3306`) and must point SMTP at `127.0.0.1:2525` so no real e-mail is sent. See "Running a backend locally".
4. **No new runtime dependencies** unless unavoidable; dev/test tooling lives outside the repos.
5. **Every user-visible string goes through the site's translation function** and has a value in every supported locale.
6. **Western Sahara content is neutral** on the territory's political status: describe places, families, tribes, archives and history; do not assert sovereignty claims for any party.
7. **Definition of done for any code change:** frontend `npx tsc --noEmit -p tsconfig.json` clean (or no new errors where a site has an agreed legacy baseline), `npx vite build` succeeds, backend `npx tsc --noEmit -p tsconfig.json` clean, the changed pages verified in a real browser (desktop 1440px and mobile 375px, light and dark, LTR and RTL where relevant) with no console errors.

## Tooling

| Tool | Location |
| --- | --- |
| Tectonic 0.17 (LaTeX) | `C:\Users\mounir\AppData\Local\roots-tools\tectonic\tectonic.exe` |
| Pandoc 3.12 | `C:\Users\mounir\AppData\Local\Pandoc\pandoc.exe` |
| autocannon 8, Playwright 1.63 (+Chromium), sharp, svgo | `C:\Users\mounir\AppData\Local\roots-tools\node\node_modules` |
| MySQL 26.7 client | `C:\Program Files\MySQL\MySQL Server 26.7\bin\mysql.exe` |

## Running a backend locally (safe mode)

Set these variables in the shell before `node dist/main.js` (after `npm run build`) or `npx nest start`. Values in the process environment win over `.env` / `.env.production` because `dotenv` never overrides existing variables.

```powershell
$env:NODE_ENV = "production"            # realistic for load tests; use "development" for debugging
$env:PORT = "<local API port>"
$env:DB_HOST = "127.0.0.1"; $env:DB_PORT = "3306"
$env:DB_USER = "root"; $env:DB_PASSWORD = "636363"
$env:DB_NAME = "<local DB>"; $env:DB_DATABASE = "<local DB>"
$env:DATABASE_URL = "mysql://root:636363@127.0.0.1:3306/<local DB>"
$env:SMTP_HOST = "127.0.0.1"; $env:SMTP_PORT = "2525"; $env:SMTP_SECURE = "false"; $env:SMTP_ENABLED = "false"
$env:CORS_ORIGIN = "http://localhost:<local web port>,http://127.0.0.1:<local web port>"
$env:CORS_STRICT = "false"
$env:RATE_LIMIT_MAX = "1000000"; $env:RATE_LIMIT_AUTH_MAX = "1000000"   # load tests only
```

Frontend against the local API: `$env:VITE_API_URL = "http://localhost:<local API port>"; npx vite --port <local web port> --strictPort`.

## Workstreams

1. **Index and audit** — `docs/CODEBASE_INDEX.md` and `docs/AUDIT_REPORT.md` per site.
2. **Correctness** — fix runtime crashes and type errors, wrong domains/brand/env values, broken routes, Maghreb's mobile logo.
3. **Complete Tunisia and Western Sahara** — replace static mock pages (Audio, Library, Research, Sources & Archives, Periods, gallery sub-pages, genealogy gallery) with the API-driven behaviour of their Maghreb lineage, add the Articles pages (`/articles`, `/gallery/articles`, admin Articles) and admin Tier Features, all rendered with each site's own design primitives. Western Sahara additionally gets its own history, regions, sources, brand facts and imagery placeholders.
4. **Translations** — Tunisia: every page fully translated in all 7 locales, enforced by an audit script. Western Sahara: 4 locales, all Tunisia-specific copy replaced.
5. **Performance** — images (WebP, right-sized, lazy below the fold, explicit dimensions), route-level code splitting, heavy libraries split per route, per-locale translation loading, backend query/payload/caching/index tuning, before/after load tests.
6. **Visual polish** — spacing rhythm, type scale, contrast (WCAG AA), focus/hover states, responsive behaviour down to 360px, RTL correctness, dark-mode contrast, loading/empty/error states. No cross-brand borrowing.
7. **Language and theme contexts** — written review (`docs/CONTEXTS_REVIEW.md`) plus the safe fixes listed in "Contexts spec".
8. **SEO** — research per site (`docs/seo/SEO_RESEARCH.md`), implementation per "SEO and i18n routing spec", Search Console guide.
9. **Marketing plans** — `docs/marketing/` per brand.
10. **Verification and change report** — repeated builds, tests, browser QA, load tests; `docs/CHANGELOG_OVERHAUL.md` lists every change with its commit.

## SEO and i18n routing spec

### URL scheme

- Canonical URLs use the bare domain, no trailing slash except the root: `https://rootstunisia.com/gallery`.
- The default locale is unprefixed; every other locale is prefixed: `/{locale}{path}` (for example `/ar/gallery`, `/en`).
- `?lang=xx` is accepted as an alias: it switches the locale and replaces the URL with the prefixed form.
- An unprefixed URL keeps the visitor's stored language preference for humans; crawlers (no storage) get the default locale, which is what the canonical/hreflang tags declare.

### Single source of truth: `frontend/src/seo/seo-routes.json`

```json
{
  "siteName": "Roots Tunisia",
  "origin": "https://rootstunisia.com",
  "defaultLocale": "fr",
  "locales": ["fr", "en", "ar", "es", "it", "mt", "eo"],
  "rtlLocales": ["ar"],
  "ogImage": "/og-image.jpg",
  "organization": { "email": "contact@...", "logo": "/logo-512.png", "sameAs": [] },
  "routes": [
    {
      "path": "/gallery",
      "priority": 0.8,
      "changefreq": "weekly",
      "schemaType": "CollectionPage",
      "title": { "fr": "...", "en": "..." },
      "description": { "fr": "...", "en": "..." },
      "h1": { "fr": "...", "en": "..." },
      "intro": { "fr": "...", "en": "..." }
    }
  ],
  "aliases": { "/sources": "/archives" },
  "noindex": ["/login", "/signup", "/admin"]
}
```

Rules: titles 30–60 characters and unique per URL; descriptions 120–160 characters; every locale filled; only routes that exist in `App.tsx` and render public content are listed. Alias routes (for example `/sources` → `/archives`, or `/library` when it renders the same component as `/gallery`) emit a canonical to their target and are excluded from the sitemap.

### Runtime (frontend)

1. `src/i18n/localeRouting.ts` — `splitLocaleFromPath(pathname)` returns `{ locale: string | null, path: string }`; `localizePath(path, locale)` returns the prefixed path (no prefix for the default locale).
2. Translation provider — initial locale order: URL prefix → `?lang` → stored preference → default. When the URL carries a prefix, it wins on every navigation. Sets `<html lang dir>` synchronously on change.
3. `App.tsx` — strips the locale prefix before route matching (`<Routes location={{ ...location, pathname: path }}>`) and uses the stripped path for the admin/WhatsApp checks. Existing route definitions stay unchanged.
4. Language menu — switching language navigates to `localizePath(currentPath, newLocale)` (keeps query and hash) and persists the preference.
5. Route-driven SEO head — one component mounted once in `App` reads `seo-routes.json` for the current path and locale and manages: `<title>`, meta description, robots (`noindex,follow` for non-indexable routes), canonical, `link[rel=alternate][hreflang]` for every locale plus `x-default`, `og:title/description/url/image/locale/locale:alternate/site_name/type`, Twitter card, and JSON-LD (`Organization` + `WebSite` on home, `BreadcrumbList` + `WebPage`/`CollectionPage` elsewhere). Tags carry `data-seo="managed"` so nothing is duplicated. Absolute URLs always use `origin` from the JSON, never `window.location.origin`. Existing per-page SEO components either delegate to it or are removed.

### Build (frontend)

1. `scripts/seo/generate-seo.mjs`, run by `npm run build` through a `postbuild` script:
   - writes `dist/sitemap.xml`: one `<url>` per indexable route × locale, each with `xhtml:link rel="alternate"` for every locale and `x-default`, `lastmod` = build date;
   - writes `dist/robots.txt`: allow all, disallow `/admin/` and `/api/`, `Sitemap:` line with the absolute sitemap URL;
   - writes a static HTML file for every indexable route × locale (`dist/index.html` for the default-locale home, `dist/{locale}/index.html`, `dist/{prefix}{path}/index.html`) derived from the built `dist/index.html`, with the localized head described above and, inside `#root`, a lightweight branded shell containing the page H1, intro paragraph and links to the other main pages. React replaces it on mount.
   - `npm run seo:generate -- --public` refreshes the committed `public/sitemap.xml` and `public/robots.txt`.
2. `scripts/seo/verify-seo.mjs` serves `dist/` with the same rewrite rule as production and asserts for every sitemap URL: HTTP 200, `<link rel="canonical">` equals the URL, hreflang set complete and reciprocal, `<html lang>`/`dir` correct, title present and unique.
3. Server config — nginx: `try_files $uri $uri/index.html /index.html;`, long-lived immutable caching for hashed `/assets/`, `no-cache` for HTML, gzip on. Apache (`.htaccess`): `DirectorySlash Off`, pass real files through, rewrite `^(.+?)/?$` to `/$1/index.html` when that file exists, otherwise fall back to `/index.html`.

### Search Console

`docs/seo/SEARCH_CONSOLE_GUIDE.md` per site: verify the Domain property by DNS TXT, submit `https://<domain>/sitemap.xml`, inspect the home URL and two localized URLs, monitor Pages/Core Web Vitals/hreflang, re-submit after deployments.

## Contexts spec

Findings that apply to most sites (details per site in `docs/CONTEXTS_REVIEW.md`):

1. Theme has up to three sources of truth (`GlobalContext.theme`, `ThemeContext`, the zustand `store/theme`). Make one owner apply `<html class>`, `color-scheme` and `meta[name=theme-color]`; the others read from it.
2. First visit ignores `prefers-color-scheme`; follow the system until the visitor chooses.
3. Theme and text direction are applied after first paint, so dark-mode and RTL visitors see a flash. A small inline script in `index.html` sets the theme class, `lang` and `dir` before CSS paints.
4. Hooks must not be called conditionally (Tunisia/Western Sahara `useTheme` fallback calls a store hook only when the context is missing).
5. Every locale's full dictionary is bundled into the main chunk. Load non-default locales on demand.
6. Missing keys should warn in development and fall back predictably (current locale → default locale → provided fallback → humanised key).

## Performance spec

Frontend: images converted to WebP with sensible maximum widths (hero ≤ 1920px, cards ≤ 1200px, thumbnails ≤ 600px), explicit `width`/`height`, `loading="lazy"` + `decoding="async"` below the fold and `fetchpriority="high"` on the LCP image; Maghreb's 644 KB logo SVG (two embedded rasters) replaced by an optimised raster at 2× display size; route components lazy-loaded; heavy libraries (d3, leaflet, pdfjs-dist, jspdf, gsap, framer-motion) kept out of the entry chunk.

Backend: measure first. Typical suspects are list endpoints returning large columns (GEDCOM text, base64 payloads), missing indexes on filter/sort columns, schema checks inside request handlers, a connection pool of 5, compression registered after static middleware, and uncached public read endpoints (settings, hero images, featured lists). Fix the measured hot spots, then re-measure.

Load-test protocol: seed the local database with synthetic data via a script that refuses to run unless `DB_HOST` is `127.0.0.1`/`localhost`; run the backend in production mode with the rate limiter raised; warm up; run `autocannon -c 50 -d 20` per key public endpoint; record requests/s, p50, p97.5, p99, errors and non-2xx; store raw JSON and a summary in `docs/performance/`.

## Verification protocol

For each site: frontend type check and production build, backend type check, SEO verify script, translation audit, Playwright screenshots of key pages at 375px and 1440px in light/dark (plus RTL for Arabic/Hebrew) with zero console errors and no horizontal overflow, load tests before/after. Results are recorded in `docs/CHANGELOG_OVERHAUL.md`.
