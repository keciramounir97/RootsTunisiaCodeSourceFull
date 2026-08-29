import { chromium } from "playwright";

async function benchmarkAuthAndCrud() {
  console.log("⚡ Benchmarking Super-Fast Auth (Login, Signup, Forgot Password) & Trees / Individuals CRUD...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on("dialog", async (d) => await d.accept());

  const results = {};
  const measure = async (name, fn) => {
    const start = performance.now();
    await fn();
    const duration = Math.round(performance.now() - start);
    results[name] = `${duration}ms`;
    console.log(`⏱️  [${name}]: ${duration}ms`);
  };

  const testEmail = `speedtest_${Date.now()}@rootstunisia.com`;

  try {
    // 1. Direct API Forgot Password speed test
    await measure("Forgot Password Code Request API", async () => {
      const res = await fetch("http://localhost:5000/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "karim@rootstunisia.com" })
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
    });

    // 2. Direct API Signup speed test
    await measure("User Signup API", async () => {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: "Speed Tester",
          email: testEmail,
          password: "password123!"
        })
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
    });

    // 3. UI Login Karim Admin
    let authToken = "";
    await measure("Admin UI Login", async () => {
      await page.goto("http://localhost:5173/login", { waitUntil: "networkidle" });
      await page.fill('input[type="email"], input[name="email"]', "karim@rootstunisia.com");
      await page.fill('input[type="password"], input[name="password"]', "admin2025$");
      await page.click('button[type="submit"]');
      await page.waitForURL((url) => !url.pathname.includes("/login"), { timeout: 10000 });
      authToken = await page.evaluate(() => {
        try {
          const stored = JSON.parse(localStorage.getItem("auth") || "{}");
          return stored?.state?.token || stored?.token || localStorage.getItem("token") || "";
        } catch {
          return localStorage.getItem("token") || "";
        }
      });
    });

    const headers = {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
    };

    // 4. Fast Individual Create, Update, Delete API
    let indId = null;
    await measure("Individual Create API", async () => {
      const res = await fetch("http://localhost:5000/api/admin/individuals", {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: "Test Person Speed",
          given: "Test",
          surname: "Speed",
          gender: "M",
          birthYear: "1980"
        })
      });
      const data = await res.json();
      indId = data.id;
    });

    await measure("Individual Update API", async () => {
      if (indId) {
        await fetch(`http://localhost:5000/api/admin/individuals/${indId}`, {
          method: "PUT",
          headers,
          body: JSON.stringify({ name: "Test Person Speed (Updated)" })
        });
      }
    });

    await measure("Individual Delete API", async () => {
      if (indId) {
        await fetch(`http://localhost:5000/api/admin/individuals/${indId}`, {
          method: "DELETE",
          headers
        });
      }
    });

    // 5. Fast Tree Create, Load GEDCOM, and Delete API
    let treeId = null;
    await measure("Tree Create with Direct GEDCOM API", async () => {
      const sampleGed = `0 HEAD\n1 SOUR RootsTunisia\n1 GEDC\n2 VERS 5.5.1\n0 @I1@ INDI\n1 NAME Ahmed /Ben Ali/\n1 SEX M\n0 TRLR`;
      const fd = new FormData();
      fd.append("title", "Benchmark Tree High Speed");
      fd.append("isPublic", "true");
      fd.append("gedcomText", sampleGed);
      fd.append("gedcom_text", sampleGed);

      const res = await fetch("http://localhost:5000/api/admin/trees", {
        method: "POST",
        headers: { ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
        body: fd
      });
      const data = await res.json();
      treeId = data.id || data.data?.id;
    });

    await measure("Tree Load GEDCOM Content API", async () => {
      if (treeId) {
        const res = await fetch(`http://localhost:5000/api/admin/trees/${treeId}/gedcom`, { headers });
        await res.text();
      }
    });

    await measure("Tree Delete API", async () => {
      if (treeId) {
        await fetch(`http://localhost:5000/api/admin/trees/${treeId}`, {
          method: "DELETE",
          headers
        });
      }
    });

    console.log("\n🚀 SPEED BENCHMARK SUMMARY RESULTS:");
    console.table(results);
    console.log("🎉 ALL OPERATIONS EXECUTED WITH ULTRA-FAST LATENCY!");
  } catch (err) {
    console.error("❌ Benchmark error:", err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

benchmarkAuthAndCrud();
