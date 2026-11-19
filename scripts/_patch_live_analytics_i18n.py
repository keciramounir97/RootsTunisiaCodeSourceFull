import json
import pathlib

root = pathlib.Path(__file__).resolve().parents[1] / "frontend" / "src" / "locales"
vals = {
    "en": "Live Analytics",
    "fr": "Analytique en direct",
    "ar": "التحليلات المباشرة",
    "es": "Analítica en vivo",
    "it": "Analisi in tempo reale",
    "mt": "Analitika live",
}

for loc, val in vals.items():
    p = root / f"{loc}.json"
    text = p.read_text(encoding="utf-8")
    data = json.loads(text)
    if "live_analytics" in data:
        print("exists", loc)
        continue
    needle = '"activity":'
    idx = text.find(needle)
    if idx != -1:
        line_end = text.find("\n", idx)
        insertion = f'\n  "live_analytics": {json.dumps(val, ensure_ascii=False)},'
        text2 = text[:line_end] + insertion + text[line_end:]
        json.loads(text2)
        p.write_text(text2, encoding="utf-8")
        print("patched", loc)
    else:
        data["live_analytics"] = val
        p.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print("rewrote", loc)
