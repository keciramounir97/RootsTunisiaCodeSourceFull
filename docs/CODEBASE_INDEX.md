# Roots Tunisia — codebase index

Generated: 2026-10-01

| Item | Value |
| --- | --- |
| Canonical origin | https://rootstunisia.com |
| API origin | https://server.rootstunisia.com |
| Default locale | `fr` |
| Locales | fr, en, ar, es, it, mt, eo |
| RTL | ar |
| Local DB | `rootstunisiadb` |
| Local API / web | 5104 / 5174 |

## Layout

- `backend/` — NestJS (Express + Knex + Objection), MySQL.
- `frontend/` — Vite + React 19 SPA (public site + `/admin`).
- `docs/` — audit, SEO, marketing, changelog.

## Public surface (indexable)

Home, About, Gallery (+ trees / images / books / audios / documents / articles), Articles, Research, Periods, Sources/Archives, Library, Audio, Contact, legal (terms / privacy / cookies), Help Center, Subscriptions.

Admin, login, signup, reset-password, account tools and `/api/` are noindex.

## i18n and theme

Locale-prefixed URLs for non-default locales. `SeoHead` writes canonical + hreflang. Language and theme boot in `index.html` before paint. Theme follows `prefers-color-scheme` until the user chooses.

## SEO artifacts

- `frontend/src/seo/seo-routes.json`
- `frontend/scripts/seo/generate-seo.mjs`
- `frontend/public/sitemap.xml`
- `frontend/public/robots.txt`
