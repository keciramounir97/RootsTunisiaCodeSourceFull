import urllib.request
import re

pages = [
    "https://rootstunisia.com/",
    "https://rootstunisia.com/subscriptions",
    "https://rootstunisia.com/admin",
    "https://rootstunisia.com/login",
    "https://rootstunisia.com/gallery",
    "https://rootstunisia.com/about",
    "https://www.rootstunisia.com/",
]

def get(url):
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=30) as r:
            return r.status, r.headers.get("Content-Type", ""), r.read()
    except Exception as e:
        code = getattr(e, "code", None)
        try:
            body = e.read() if hasattr(e, "read") else b""
        except Exception:
            body = str(e).encode()
        return code, "", body

for url in pages:
    s, c, b = get(url)
    text = b.decode("utf-8", "replace") if b else ""
    assets = re.findall(r'src="(/assets/[^"]+\.js)"', text)
    print(f"\n{url} -> {s} {c} assets={len(assets)}")
    # check first asset
    if assets:
        a = assets[0]
        as_, ac, ab = get("https://rootstunisia.com" + a)
        print(f"  main {a} -> {as_} {ac} {ab[:30]!r}")

# Check lazy chunks that often break
chunks = [
    "https://rootstunisia.com/assets/Settings-",
]
# list some asset directory? can't. Probe via index map deps.
s, c, b = get("https://rootstunisia.com/assets/index-d9kdfO8M.js")
text = b.decode("utf-8", "replace")
# find missing chunk references that 404
refs = sorted(set(re.findall(r'assets/([A-Za-z0-9_-]+\.js)', text)))
print("\nReferenced chunk count from index:", len(refs))
missing = []
for name in refs[:80]:
    st, ct, bd = get(f"https://rootstunisia.com/assets/{name}")
    if st != 200 or (ct and "javascript" not in ct and "ecmascript" not in ct):
        missing.append((name, st, ct))
print("Missing/bad among first 80:", missing[:20], "count", len(missing))
