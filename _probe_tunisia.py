import urllib.request
import re

def get(url):
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=30) as r:
            body = r.read()
            return r.status, r.headers.get("Content-Type", ""), body
    except Exception as e:
        code = getattr(e, "code", None)
        try:
            body = e.read() if hasattr(e, "read") else b""
        except Exception:
            body = b""
        return code, "", body or str(e).encode()

status, ctype, body = get("https://rootstunisia.com/")
print("HOME", status, ctype, "len", len(body))
text = body.decode("utf-8", "replace")
print(text[:1500])
assets = re.findall(r'(?:src|href)="([^"]+\.(?:js|css))"', text)
print("ASSETS", assets[:20])
for a in assets[:8]:
    url = a if a.startswith("http") else "https://rootstunisia.com" + (a if a.startswith("/") else "/" + a)
    s, c, b = get(url)
    print(" ", a, "->", s, c, "starts", b[:40])

for api in [
    "https://api.rootstunisia.com/api/health",
    "https://api.rootstunisia.com/health",
    "https://rootstunisia.com/api/health",
    "https://server.rootstunisia.com/api/health",
]:
    s, c, b = get(api)
    print("API", api, "->", s, (b[:120] if b else b))
