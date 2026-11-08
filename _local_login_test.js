const fs = require("fs");
const http = require("http");
const path = require("path");

function loadEnv(file) {
  const out = {};
  if (!fs.existsSync(file)) return out;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!m) continue;
    out[m[1]] = m[2];
  }
  return out;
}

function post(port, ctype, body, headers = {}) {
  return new Promise((resolve) => {
    const req = http.request(
      {
        hostname: "127.0.0.1",
        port,
        path: "/api/auth/login",
        method: "POST",
        headers: {
          "Content-Type": ctype,
          "Content-Length": Buffer.byteLength(body),
          ...headers,
        },
      },
      (res) => {
        let d = "";
        res.on("data", (c) => (d += c));
        res.on("end", () => {
          let summary = d.slice(0, 180);
          try {
            const j = JSON.parse(d);
            const data = j.data || j;
            if (data && data.token) {
              summary = `LOGIN_OK user=${data.user?.email || data.user?.id} token=${String(data.token).slice(0, 16)}...`;
            } else {
              summary = Array.isArray(j.message)
                ? j.message.join("; ")
                : String(j.message || summary);
            }
          } catch {
            /* keep raw */
          }
          resolve({ status: res.statusCode, summary });
        });
      },
    );
    req.on("error", (e) => resolve({ error: e.message }));
    req.write(body);
    req.end();
  });
}

async function runCase(label, port, email, password) {
  console.log(`\n=== ${label} port=${port} email=${email} ===`);
  const jsonBody = JSON.stringify({ email, password });
  const formBody = new URLSearchParams({ email, password }).toString();
  console.log(
    "JSON",
    await post(port, "application/json", jsonBody, {
      "X-Forwarded-For": "203.0.113.10",
    }),
  );
  console.log(
    "FORM",
    await post(port, "application/x-www-form-urlencoded", formBody, {
      "X-Forwarded-For": "203.0.113.10",
    }),
  );
}

(async () => {
  const tn = loadEnv(path.join(__dirname, "backend", ".env"));
  const mg = loadEnv(
    path.join(
      __dirname,
      "..",
      "RootsMaghrebCodeSource-main",
      "RootsMaghrebCodeSource-main",
      "backend",
      ".env",
    ),
  );

  const tnEmail = tn.SEED_ADMIN_EMAIL || "karim@rootstunisia.com";
  const tnPass = tn.SEED_ADMIN_PASSWORD || "admin2025$";
  const mgEmail = mg.SEED_ADMIN_EMAIL || "karimadmin@rootsmaghreb.com";
  const mgPass = mg.SEED_ADMIN_PASSWORD || "admin2025$";
  const mgEmail2 = mg.SEED_ADMIN2_EMAIL || "kameladmin@rootsmaghreb.com";
  const mgPass2 = mg.SEED_ADMIN2_PASSWORD || mgPass;

  await runCase("TUNISIA", 5001, tnEmail, tnPass);
  // also try legacy admin emails used in seed patches
  await runCase("TUNISIA-legacy", 5001, "karimadmin@rootstunisia.com", tnPass);

  await runCase("MAGHREB", 5000, mgEmail, mgPass);
  await runCase("MAGHREB-kamel", 5000, mgEmail2, mgPass2);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
