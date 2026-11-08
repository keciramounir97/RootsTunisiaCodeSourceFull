process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const https = require("https");
function get(url) {
  return new Promise((res) => {
    https
      .get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (r) => {
        let d = "";
        r.on("data", (c) => (d += c));
        r.on("end", () => res(d));
      })
      .on("error", () => res(""));
  });
}
(async () => {
  const html = await get("https://rootstunisia.com/login");
  const main = [...html.matchAll(/\/assets\/index-[^"']+\.js/g)].map((m) => m[0])[0];
  console.log("main", main);
  const js = await get("https://rootstunisia.com" + main);
  for (const needle of [
    "encodeAuthFormBody",
    "URLSearchParams",
    "email should not be empty",
    "Password is required",
    "/auth/login",
    "application/x-www-form-urlencoded",
    "TunisiaGovernoratesMap",
    "frame-gold",
  ]) {
    console.log(needle, js.includes(needle));
  }
  const idx = js.indexOf('post("/auth/login"');
  const idx2 = js.indexOf("post('/auth/login'");
  const i = Math.max(idx, idx2);
  console.log("post login idx", i);
  console.log(js.slice(Math.max(0, i - 80), i + 200));
})();
