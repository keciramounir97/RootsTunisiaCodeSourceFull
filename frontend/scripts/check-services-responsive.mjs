import { chromium } from "playwright";

const BASE = process.env.BASE_URL || "http://localhost:5173";
const VIEWPORTS = [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1280, height: 800 },
];

async function checkPage(page, path, label) {
  await page.goto(`${BASE}${path}`, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(800);

  const report = await page.evaluate(() => {
    const doc = document.documentElement;
    const body = document.body;
    const horizontalOverflow = Math.max(doc.scrollWidth, body.scrollWidth) > window.innerWidth + 1;

    const overflowing = [];
    const candidates = Array.from(
      document.querySelectorAll("h1, h2, p, a, button, span, .surface-card, section"),
    ).slice(0, 250);

    const isInHorizontalScroller = (el) => {
      let node = el;
      while (node && node !== document.body) {
        const s = window.getComputedStyle(node);
        if (
          (s.overflowX === "auto" || s.overflowX === "scroll") &&
          node.scrollWidth > node.clientWidth + 1
        ) {
          return true;
        }
        node = node.parentElement;
      }
      return false;
    };

    for (const el of candidates) {
      const style = window.getComputedStyle(el);
      if (style.display === "none" || style.visibility === "hidden") continue;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue;
      // Intentionally scrollable chip rows / carousels are allowed to extend.
      if (isInHorizontalScroller(el)) continue;
      // Sticky/fixed chrome (lang switcher, cookie bar) is outside this page audit.
      if (el.closest("nav, header, [class*='Cookie'], [class*='cookie']")) continue;
      if (rect.right > window.innerWidth + 2 || rect.left < -2) {
        overflowing.push({
          tag: el.tagName.toLowerCase(),
          text: (el.textContent || "").trim().slice(0, 80),
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          vw: window.innerWidth,
        });
      }
    }

    const hero = document.querySelector('[aria-label="Diaporama services"]');
    const h1 = document.querySelector("h1");
    return {
      horizontalOverflow,
      overflowCount: overflowing.length,
      overflowing: overflowing.slice(0, 8),
      hasHeroTabs: Boolean(hero),
      h1Text: (h1?.textContent || "").trim().slice(0, 120),
      h1FontSize: h1 ? window.getComputedStyle(h1).fontSize : null,
    };
  });

  return { label, ...report };
}

const browser = await chromium.launch({ headless: true });
const results = [];

for (const vp of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
  });
  const page = await context.newPage();
  results.push(await checkPage(page, "/services", `services:${vp.name}`));
  results.push(await checkPage(page, "/helpcenter", `contact:${vp.name}`));
  await context.close();
}

await browser.close();

let failed = false;
for (const r of results) {
  const ok = !r.horizontalOverflow && r.overflowCount === 0;
  if (!ok) failed = true;
  console.log(
    `${ok ? "PASS" : "FAIL"} ${r.label} overflow=${r.horizontalOverflow} elems=${r.overflowCount} h1=${r.h1FontSize} tabs=${r.hasHeroTabs}`,
  );
  if (r.overflowing?.length) {
    for (const o of r.overflowing) {
      console.log(`  - <${o.tag}> L${o.left} R${o.right}/${o.vw} "${o.text}"`);
    }
  }
}

process.exit(failed ? 1 : 0);
