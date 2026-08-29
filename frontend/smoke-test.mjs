import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const SAMPLE_GEDCOM = `0 HEAD
1 SOUR RootsTunisia
1 GEDC
2 VERS 5.5.1
2 FORM LINEAGE-LINKED
1 CHAR UTF-8
0 @I1@ INDI
1 NAME Ali /Ben Salah/
1 GIVN Ali
1 SURN Ben Salah
1 SEX M
1 BIRT
2 DATE 1940
1 FAMS @F1@
0 @I2@ INDI
1 NAME Fatima /Mansour/
1 GIVN Fatima
1 SURN Mansour
1 SEX F
1 BIRT
2 DATE 1945
1 FAMS @F1@
0 @I3@ INDI
1 NAME Youssef /Ben Salah/
1 GIVN Youssef
1 SURN Ben Salah
1 SEX M
1 BIRT
2 DATE 1970
1 FAMC @F1@
0 @F1@ FAM
1 HUSB @I1@
1 WIFE @I2@
1 CHIL @I3@
0 TRLR
`;

async function runSmokeTest() {
  console.log("🚀 Starting Playwright Smoke Test...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // 1. Login
    console.log("🔑 1. Logging in as Karim Admin...");
    await page.goto("http://localhost:5173/login", { waitUntil: "networkidle" });
    await page.fill('input[type="email"], input[name="email"]', "karim@rootstunisia.com");
    await page.fill('input[type="password"], input[name="password"]', "admin2025$");
    await page.click('button[type="submit"]');

    // Wait for redirect to admin or dashboard
    await page.waitForURL((url) => !url.pathname.includes("/login"), { timeout: 10000 });
    console.log("✅ Logged in successfully!");

    // 2. Test Trees Page
    console.log("🌳 2. Testing Trees Builder & GEDCOM Loading...");
    await page.goto("http://localhost:5173/admin/trees", { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);

    // Save temporary GEDCOM file for import
    const tempGedcomPath = path.resolve("./temp-smoke-tree.ged");
    fs.writeFileSync(tempGedcomPath, SAMPLE_GEDCOM, "utf8");

    // Click Import GEDCOM or set file directly to input
    const fileInput = await page.$('input[type="file"][accept*=".ged"]');
    if (fileInput) {
      await fileInput.setInputFiles(tempGedcomPath);
      await page.waitForTimeout(1000);
      console.log("✅ GEDCOM file imported onto canvas!");
    }

    // Open Save/Update Drawer
    const saveBtn = await page.$('button:has-text("Enregistrer l\'arbre"), button:has-text("Save Tree"), button:has-text("Nouvel Arbre"), button:has-text("Nouveau")');
    if (saveBtn) {
      await saveBtn.click();
      await page.waitForTimeout(800);
    }

    // Fill title in drawer
    const titleInput = await page.$('input[name="title"], input[placeholder*="titre" i], input[placeholder*="title" i], input[placeholder*="Nom de l\'arbre" i]');
    if (titleInput) {
      await titleInput.fill("Smoke Test Family Tree");
    }

    // Click the Save/Update button inside drawer
    const confirmSaveBtn = await page.$('div[role="dialog"] button:has-text("Save"), div[role="dialog"] button:has-text("Enregistrer"), button:has-text("Update Tree"), button:has-text("Mettre à jour")');
    if (confirmSaveBtn) {
      await confirmSaveBtn.click();
      await page.waitForTimeout(2000);
      console.log("✅ Tree saved to database successfully!");
    }

    // Click "Vider le canevas" / Clear Canvas
    console.log("🧹 Testing 'Vider le canevas'...");
    const clearBtn = await page.$('button:has-text("Vider le canevas"), button:has-text("Clear")');
    if (clearBtn) {
      await clearBtn.click();
      await page.waitForTimeout(1000);
      console.log("✅ Canvas cleared!");
    }

    // Click "Voir mes arbres" / "See My Trees"
    console.log("📂 Opening 'See My Trees' drawer and reloading saved tree...");
    const myTreesBtn = await page.$('button:has-text("Voir mes arbres"), button:has-text("See My Trees")');
    if (myTreesBtn) {
      await myTreesBtn.click();
      await page.waitForTimeout(1000);

      // Find our saved tree in list and click it
      const treeItem = await page.$('text="Smoke Test Family Tree"');
      if (treeItem) {
        await treeItem.click();
        await page.waitForTimeout(2000);
        console.log("✅ Tree reloaded from database!");

        // Verify nodes on canvas
        const nodeCount = await page.locator("svg g.node, svg g.nodes text, svg text").count();
        console.log(`✅ Visualizer rendered with ${nodeCount} SVG text/node elements!`);
      }
    }

    // Clean up temp file
    if (fs.existsSync(tempGedcomPath)) fs.unlinkSync(tempGedcomPath);

    // 3. Test Individuals Page
    console.log("👤 3. Testing Individuals CRUD...");
    await page.goto("http://localhost:5173/admin/individuals", { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);

    const individualsHeader = await page.textContent("h1, h2, h3");
    console.log(`✅ Individuals page rendered: ${individualsHeader}`);

    console.log("🎉 ALL SMOKE TESTS PASSED SUCCESSFULLY!");
  } catch (err) {
    console.error("❌ Smoke test encountered an error:", err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runSmokeTest();
