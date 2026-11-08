import urllib.request
import json

BASE = "https://server.rootstunisia.com"

paths = [
    "/api/health",
    "/api/currencies",
    "/api/subscriptions/tiers",
    "/api/trees",
    "/api/gallery",
    "/api/site-images",
    "/api/settings",
    "/api/content",
]

def get(url):
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0", "Origin": "https://rootstunisia.com"})
        with urllib.request.urlopen(req, timeout=30) as r:
            body = r.read(500)
            return r.status, r.headers.get("Content-Type", ""), body
    except Exception as e:
        code = getattr(e, "code", None)
        try:
            body = e.read(300) if hasattr(e, "read") else str(e).encode()
        except Exception:
            body = str(e).encode()
        return code, "", body

for p in paths:
    s, c, b = get(BASE + p)
    print(f"{p} -> {s} {c} {b[:140]!r}")
