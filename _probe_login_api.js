process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const https = require("https");

function post(host, ctype, body) {
  return new Promise((resolve) => {
    const req = https.request(
      {
        hostname: host,
        path: "/api/auth/login",
        method: "POST",
        headers: {
          "Content-Type": ctype,
          "Content-Length": Buffer.byteLength(body),
          Origin: host.includes("tunisia")
            ? "https://rootstunisia.com"
            : "https://www.rootsmaghreb.com",
        },
      },
      (res) => {
        let d = "";
        res.on("data", (c) => (d += c));
        res.on("end", () =>
          resolve({ status: res.statusCode, body: d.slice(0, 220) }),
        );
      },
    );
    req.on("error", (e) => resolve({ error: e.message }));
    req.write(body);
    req.end();
  });
}

(async () => {
  const cases = [
    [
      "server.rootstunisia.com",
      "application/json",
      JSON.stringify({
        email: "karimadmin@rootstunisia.com",
        password: "admin2025$",
      }),
    ],
    [
      "server.rootstunisia.com",
      "application/x-www-form-urlencoded",
      new URLSearchParams({
        email: "karimadmin@rootstunisia.com",
        password: "admin2025$",
      }).toString(),
    ],
    [
      "server.rootsmaghreb.com",
      "application/json",
      JSON.stringify({
        email: "karimadmin@rootsmaghreb.com",
        password: "admin2025$",
      }),
    ],
    [
      "server.rootsmaghreb.com",
      "application/x-www-form-urlencoded",
      new URLSearchParams({
        email: "karimadmin@rootsmaghreb.com",
        password: "admin2025$",
      }).toString(),
    ],
  ];
  for (const [host, ctype, body] of cases) {
    console.log(host, ctype.split(";")[0], await post(host, ctype, body));
  }
})();
