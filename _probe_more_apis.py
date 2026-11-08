import urllib.request

BASE = "https://server.rootstunisia.com"
paths = [
    "/api/site-content",
    "/api/banner-slides",
    "/api/subscriptions",
    "/api/stats",
    "/api/activity",
    "/api/books",
    "/api/audios",
    "/api/documents",
    "/api/articles",
    "/api/newsletter",
]

def get(url):
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0", "Origin": "https://rootstunisia.com"})
        with urllib.request.urlopen(req, timeout=30) as r:
            return r.status, r.read(200)
    except Exception as e:
        code = getattr(e, "code", None)
        try:
            body = e.read(200) if hasattr(e, "read") else str(e).encode()
        except Exception:
            body = str(e).encode()
        return code, body

for p in paths:
    s, b = get(BASE + p)
    print(f"{p} -> {s} {b[:160]!r}")
