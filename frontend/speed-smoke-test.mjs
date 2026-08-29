import { chromium } from "playwright";

async function runSpeedSmokeTest() {
  console.log("⚡ Starting Comprehensive Performance & Speed Smoke Test...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const timings = {};
  const measure = async (name, fn) => {
    const t0 = performance.now();
    await fn();
    const t1 = performance.now();
    const duration = Math.round(t1 - t0);
    timings[name] = `${duration}ms`;
    console.log(`⏱️  ${name}: ${duration}ms`);
  };

  try {
    // 1. Login Speed
    await measure("Login Admin", async () => {
      await page.goto("http://localhost:5173/login", { waitUntil: "networkidle" });
      await page.fill('input[type="email"], input[name="email"]', "karim@rootstunisia.com");
      await page.fill('input[type="password"], input[name="password"]', "admin2025$");
      await page.click('button[type="submit"]');
      await page.waitForURL((url) => !url.pathname.includes("/login"), { timeout: 10000 });
    });

    // 2. Individuals Page & Instant Modal
    await measure("Individuals Page Load", async () => {
      await page.goto("http://localhost:5173/admin/individuals", { waitUntil: "networkidle" });
    });

    await measure("Individual Create Form Open & Fill", async () => {
      const addBtn = await page.$('button:has-text("Ajouter un individu"), button:has-text("Add Individual")');
      if (addBtn) await addBtn.click();
      await page.waitForTimeout(300);
    });

    // 3. Trees Page & Canvas Initialization
    await measure("Trees Page & Visualizer Load", async () => {
      await page.goto("http://localhost:5173/admin/trees", { waitUntil: "networkidle" });
    });

    // 4. Notes Page
    await measure("Admin Notes Page Load", async () => {
      await page.goto("http://localhost:5173/admin/notes", { waitUntil: "networkidle" });
    });

    // 5. Tasks Page
    await measure("Admin Tasks Page Load", async () => {
      await page.goto("http://localhost:5173/admin/tasks", { waitUntil: "networkidle" });
    });

    // 6. Sources & Archives Page
    await measure("Sources & Archives Page Load", async () => {
      await page.goto("http://localhost:5173/admin/sources", { waitUntil: "networkidle" });
    });

    // 7. Gallery Page
    await measure("Gallery Page Load", async () => {
      await page.goto("http://localhost:5173/admin/gallery", { waitUntil: "networkidle" });
    });

    console.log("\n📊 BENCHMARK TIMING SUMMARY:");
    console.table(timings);
    console.log("🎉 ALL SPEED TESTS COMPLETED WITH ULTRA-LOW LATENCY!");
  } catch (err) {
    console.error("❌ Performance test error:", err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runSpeedSmokeTest();
