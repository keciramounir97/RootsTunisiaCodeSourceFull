const fs = require("fs");
const path = require("path");

const localesDir = path.join(__dirname, "..", "src", "locales");
const localeFiles = ["en", "fr", "ar", "es", "it", "mt", "eo"];

const dictionaries = {};
for (const locale of localeFiles) {
  const file = path.join(localesDir, `${locale}.json`);
  dictionaries[locale] = JSON.parse(fs.readFileSync(file, "utf8"));
}

const referenceKeys = Object.keys(dictionaries.en).sort();
const report = {
  generatedAt: new Date().toISOString(),
  reference: "en.json",
  referenceKeyCount: referenceKeys.length,
  locales: {},
};

for (const locale of localeFiles) {
  const keys = Object.keys(dictionaries[locale]);
  const missing = referenceKeys.filter((key) => !(key in dictionaries[locale]));
  const extra = keys.filter((key) => !referenceKeys.includes(key));
  report.locales[locale] = {
    keyCount: keys.length,
    missingCount: missing.length,
    extraCount: extra.length,
    missing,
    extra,
  };
  console.log(
    `${locale}: ${keys.length} keys, ${missing.length} missing vs en, ${extra.length} extra`,
  );
  if (missing.length) {
    for (const key of missing.slice(0, 25)) console.log(`  - ${key}`);
    if (missing.length > 25) console.log(`  ... ${missing.length - 25} more`);
  }
}

const outJson = path.join(__dirname, "translation-audit-report.json");
const outMd = path.join(__dirname, "..", "TRANSLATION_AUDIT.md");
fs.writeFileSync(outJson, JSON.stringify(report, null, 2) + "\n", "utf8");

const lines = [
  "# Tunisia translation audit",
  "",
  `Generated: ${report.generatedAt}`,
  `Reference: en.json (${report.referenceKeyCount} keys)`,
  "",
];
for (const locale of localeFiles) {
  const row = report.locales[locale];
  lines.push(`## ${locale}`);
  lines.push(`- keys: ${row.keyCount}`);
  lines.push(`- missing vs en: ${row.missingCount}`);
  lines.push(`- extra vs en: ${row.extraCount}`);
  if (row.missing.length) {
    lines.push("");
    lines.push("Missing:");
    for (const key of row.missing) lines.push(`- \`${key}\``);
  }
  lines.push("");
}
fs.writeFileSync(outMd, lines.join("\n"), "utf8");

console.log(`Wrote ${path.relative(process.cwd(), outJson)}`);
console.log(`Wrote ${path.relative(process.cwd(), outMd)}`);
process.exit(0);
