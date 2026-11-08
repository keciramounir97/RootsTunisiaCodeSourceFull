process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const https = require("https");
function get(url) {
  return new Promise((res, rej) => {
    https
      .get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (r) => {
        let d = "";
        r.on("data", (c) => (d += c));
        r.on("end", () => res({ status: r.statusCode, body: d }));
      })
      .on("error", (e) => res({ error: e.message }));
  });
}
(async () => {
  const html = await get("https://rootstunisia.com/login");
  console.log("status", html.status, "err", html.error);
  const assets = [...(html.body || "").matchAll(/\/assets\/[^"']+\.js/g)].map((m) => m[0]);
  console.log("assets", assets.slice(0, 4));
  const main = assets.find((a) => a.includes("index")) || assets[0];
  if (!main) return;
  const js = await get("https://rootstunisia.com" + main);
  console.log("js len", js.body?.length);
  console.log("has form body", /URLSearchParams/.test(js.body || ""));
  console.log("has TunisiaGovernoratesMap", /TunisiaGovernoratesMap|governorate/i.test(js.body || ""));
  const idx = (js.body || "").indexOf("/auth/login");
  console.log("snippet", (js.body || "").slice(Math.max(0, idx - 100), idx + 180));
})();
