# Roots Tunisia — audit (2026-10-01)

## Identity
Tunisian families in 24 governorates, the Italian and Maltese historical communities, and the Tunisian diaspora.

## Corrections applied this pass
- Locale-prefixed routing with stripped React Router location so `/fr/gallery` resolves.
- `SeoHead` + build-time sitemap with xhtml hreflang for Google Search Console.
- Public GET cache headers on list APIs (`max-age=30`, `s-maxage=120`).
- TanStack Query `refetchOnMount: true` (not `"always"`) where it was over-fetching.
- Theme: system preference, `color-scheme`, FOUC boot script.
- Language context reads URL prefix / `?lang=` before localStorage.
- Maghreb / Tunisia / Western Sahara logos clamp on narrow viewports (site-specific radii kept).
- Tunisia and Western Sahara public pages completed to sibling feature parity (About, Articles, Research, admin Articles / Tier Features,  locale packs).

## Residual risk
- Some frontends carry a pre-existing TypeScript baseline; new files should not add to it.
- Production `.env` files must never be used for local load tests (override DB + SMTP).
- `www` vs bare-domain duplicates must 301 to https://rootstunisia.com.
