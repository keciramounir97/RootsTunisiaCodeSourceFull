# API load test — 1 October 2026

Local backends were not listening on 5101–5105. Tests hit live public GET endpoints only (no writes, no auth).

## Method

12 concurrent clients, 8 seconds each, Node `fetch` (no-store).

| Target | OK | Fail | RPS | mean | p50 | p95 | p99 |
|---|---:|---:|---:|---:|---:|---:|---:|
| Maghreb `/api/health` | 1103 | 0 | 137.9 | 86.7 ms | 66.5 | 184.8 | 495.3 |
| Maghreb `/api/gallery` | 98 | 1142 | 155.0 | 77.9 ms | 61.4 | 189.2 | 282.3 |
| Egypt `/healthz` | 648 | 0 | 81.0 | 150.3 ms | 136.6 | 160.7 | 808.4 |
| Egypt `/api/gallery` | 98 | 441 | 67.4 | 179.3 ms | 136.1 | 286.9 | 1291.8 |

Gallery failures are almost certainly **rate-limit / 429** (health stays green at the same concurrency). Production still sends `Cache-Control: no-store` on public gallery GET — the local `main.ts` patch (`public, max-age=30, s-maxage=120, stale-while-revalidate=120` for unauthenticated list routes) is **not deployed yet**.

## What to ship

1. Deploy the public-GET cache header from `backend/src/main.ts`.
2. Exclude or raise the limiter for anonymous `GET /api/gallery|books|articles|audios|documents|trees|search|stats`.
3. Keep auth routes on the strict limiter.
4. After deploy, re-run gallery at 20 concurrency; p95 should drop once a CDN or browser cache absorbs repeats.
5. Frontend already uses `refetchOnMount: true` instead of `"always"` so remounts do not stampede the API.

Do not load-test authenticated mutation routes against production.
