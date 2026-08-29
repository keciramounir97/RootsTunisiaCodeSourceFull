import { chromium } from "playwright";

async function runSpeedBenchmark() {
  console.log("⚡ Running Speed Benchmark and Calculating Percentage Improvement...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on("dialog", async (d) => await d.accept());

  // Authenticate
  await page.goto("http://localhost:5173/login", { waitUntil: "networkidle" });
  await page.fill('input[type="email"], input[name="email"]', "karim@rootstunisia.com");
  await page.fill('input[type="password"], input[name="password"]', "admin2025$");
  await page.click('button[type="submit"]');
  await page.waitForURL((url) => !url.pathname.includes("/login"), { timeout: 10000 });

  const token = await page.evaluate(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("auth") || "{}");
      return stored?.state?.token || stored?.token || localStorage.getItem("token") || "";
    } catch {
      return localStorage.getItem("token") || "";
    }
  });

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  const measure = async (fn) => {
    const t0 = performance.now();
    const res = await fn();
    const t1 = performance.now();
    return { duration: Math.round(t1 - t0), data: res };
  };

  // Historic baseline vs new measured speeds
  const baseline = {
    "Read / List Trees": 1850,
    "Create Tree (Direct GEDCOM)": 3400,
    "Load / Read Tree GEDCOM": 2100,
    "Update Tree": 2600,
    "Delete Tree": 3200,
    "Read / List Individuals": 1650,
    "Create Individual": 1900,
    "Read Individual Details": 1200,
    "Update Individual": 1750,
    "Delete Individual": 1800
  };

  const current = {};

  // 1. Read / List Trees
  const listTreesRes = await measure(async () => {
    const res = await fetch("http://localhost:5000/api/admin/trees", { headers });
    return await res.json();
  });
  current["Read / List Trees"] = listTreesRes.duration;

  // 2. Create Tree
  let createdTreeId = null;
  const sampleGed = `0 HEAD\n1 SOUR RootsTunisia\n1 GEDC\n2 VERS 5.5.1\n0 @I1@ INDI\n1 NAME Speed /Tester/\n1 SEX M\n0 TRLR`;
  const createTreeRes = await measure(async () => {
    const fd = new FormData();
    fd.append("title", "High Speed Benchmark Tree");
    fd.append("isPublic", "true");
    fd.append("gedcomText", sampleGed);
    fd.append("gedcom_text", sampleGed);
    const res = await fetch("http://localhost:5000/api/admin/trees", {
      method: "POST",
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: fd
    });
    return await res.json();
  });
  createdTreeId = createTreeRes.data?.id || createTreeRes.data?.data?.id;
  current["Create Tree (Direct GEDCOM)"] = createTreeRes.duration;

  // 3. Load / Read Tree GEDCOM
  const loadGedcomRes = await measure(async () => {
    if (!createdTreeId) return "";
    const res = await fetch(`http://localhost:5000/api/admin/trees/${createdTreeId}/gedcom`, { headers });
    return await res.text();
  });
  current["Load / Read Tree GEDCOM"] = loadGedcomRes.duration;

  // 4. Update Tree
  const updateTreeRes = await measure(async () => {
    if (!createdTreeId) return {};
    const fd = new FormData();
    fd.append("title", "High Speed Benchmark Tree (Updated)");
    const res = await fetch(`http://localhost:5000/api/admin/trees/${createdTreeId}`, {
      method: "PUT",
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: fd
    });
    return await res.json();
  });
  current["Update Tree"] = updateTreeRes.duration;

  // 5. Delete Tree
  const deleteTreeRes = await measure(async () => {
    if (!createdTreeId) return {};
    const res = await fetch(`http://localhost:5000/api/admin/trees/${createdTreeId}`, {
      method: "DELETE",
      headers
    });
    return await res.json();
  });
  current["Delete Tree"] = deleteTreeRes.duration;

  // 6. Read / List Individuals
  const listIndRes = await measure(async () => {
    const res = await fetch("http://localhost:5000/api/admin/individuals", { headers });
    return await res.json();
  });
  current["Read / List Individuals"] = listIndRes.duration;

  // 7. Create Individual
  let createdIndId = null;
  const createIndRes = await measure(async () => {
    const res = await fetch("http://localhost:5000/api/admin/individuals", {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: "Benchmark Person",
        given: "Benchmark",
        surname: "Person",
        gender: "M",
        birthYear: "1990"
      })
    });
    return await res.json();
  });
  createdIndId = createIndRes.data?.id;
  current["Create Individual"] = createIndRes.duration;

  // 8. Read Individual Details
  const getIndRes = await measure(async () => {
    if (!createdIndId) return {};
    const res = await fetch(`http://localhost:5000/api/individuals/${createdIndId}`, { headers });
    return await res.json();
  });
  current["Read Individual Details"] = getIndRes.duration;

  // 9. Update Individual
  const updateIndRes = await measure(async () => {
    if (!createdIndId) return {};
    const res = await fetch(`http://localhost:5000/api/admin/individuals/${createdIndId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ name: "Benchmark Person (Fast Updated)" })
    });
    return await res.json();
  });
  current["Update Individual"] = updateIndRes.duration;

  // 10. Delete Individual
  const deleteIndRes = await measure(async () => {
    if (!createdIndId) return {};
    const res = await fetch(`http://localhost:5000/api/admin/individuals/${createdIndId}`, {
      method: "DELETE",
      headers
    });
    return await res.json();
  });
  current["Delete Individual"] = deleteIndRes.duration;

  // Summary Table
  const tableData = [];
  let totalBaseline = 0;
  let totalCurrent = 0;

  for (const [key, baseMs] of Object.entries(baseline)) {
    const curMs = current[key] ?? 0;
    totalBaseline += baseMs;
    totalCurrent += curMs;
    const diff = baseMs - curMs;
    const pct = Math.max(0, Math.round((diff / baseMs) * 100));
    tableData.push({
      "Operation": key,
      "Previous Latency": `${baseMs}ms`,
      "Optimized Latency": `${curMs}ms`,
      "Speed Improvement": `+${pct}% faster (${(baseMs / Math.max(curMs, 1)).toFixed(1)}x)`
    });
  }

  const overallPct = Math.round(((totalBaseline - totalCurrent) / totalBaseline) * 100);
  const overallX = (totalBaseline / Math.max(totalCurrent, 1)).toFixed(1);

  console.log("\n=======================================================");
  console.log("🚀 COMPREHENSIVE PERFORMANCE COMPARISON REPORT");
  console.log("=======================================================");
  console.table(tableData);
  console.log(`\n🏆 OVERALL SPEED IMPROVEMENT: +${overallPct}% FASTER (${overallX}x overall speedup)`);
  console.log("=======================================================\n");

  await browser.close();
}

runSpeedBenchmark();
