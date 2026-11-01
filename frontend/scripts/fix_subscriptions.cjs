const fs = require('fs');
const path = require('path');

const subPath = path.join(__dirname, '../src/pages/subscriptions.tsx');
let c = fs.readFileSync(subPath, 'utf8');

const newPlans = `const plans = [
  {
    id: "zitouna",
    nameKey: "plan_zitouna_name",
    nameFallback: "Zitouna",
    priceKey: "plan_zitouna_price",
    priceFallback: "Free",
    periodKey: "plan_zitouna_period",
    periodFallback: "forever",
    taglineKey: "plan_zitouna_tagline",
    taglineFallback: "For families starting their first tree",
    features: [
      { key: "feat_zitouna_1", fallback: "One family tree, up to 150 people" },
      { key: "feat_zitouna_2", fallback: "Photo uploads with captions" },
      { key: "feat_zitouna_3", fallback: "Read-only access to period guides" },
      { key: "feat_zitouna_4", fallback: "Community forum access" },
      { key: "feat_zitouna_5", fallback: "Standard support" },
    ],
    ctaKey: "plan_zitouna_cta",
    ctaFallback: "Create account",
    to: "/signup",
    highlight: false,
  },
  {
    id: "researcher",
    nameKey: "plan_researcher_name",
    nameFallback: "Researcher",
    priceKey: "plan_researcher_price",
    priceFallback: "39 TND",
    periodKey: "plan_researcher_period",
    periodFallback: "per month",
    taglineKey: "plan_researcher_tagline",
    taglineFallback: "For serious archive-led research",
    features: [
      { key: "feat_researcher_1", fallback: "Unlimited trees and people" },
      { key: "feat_researcher_2", fallback: "Full library and archive index access" },
      { key: "feat_researcher_3", fallback: "GEDCOM 5.5.1 import and export" },
      { key: "feat_researcher_4", fallback: "Document codes and citation manager" },
      { key: "feat_researcher_5", fallback: "Oral history storage with transcripts" },
      { key: "feat_researcher_6", fallback: "Priority research assistance" },
    ],
    ctaKey: "plan_researcher_cta",
    ctaFallback: "Start researching",
    to: "/payment?plan=researcher&amount=39",
    highlight: true,
  },
  {
    id: "institution",
    nameKey: "plan_institution_name",
    nameFallback: "Institution",
    priceKey: "plan_institution_price",
    priceFallback: "On request",
    periodKey: "plan_institution_period",
    periodFallback: "annual",
    taglineKey: "plan_institution_tagline",
    taglineFallback: "For associations, schools and archives",
    features: [
      { key: "feat_institution_1", fallback: "Multi-seat team accounts" },
      { key: "feat_institution_2", fallback: "Bulk digitization workspace" },
      { key: "feat_institution_3", fallback: "Private collections and permissions" },
      { key: "feat_institution_4", fallback: "Training in Maghrebi paleography" },
      { key: "feat_institution_5", fallback: "Dedicated Tunisian support line" },
      { key: "feat_institution_6", fallback: "Custom SLA & data export" },
    ],
    ctaKey: "plan_institution_cta",
    ctaFallback: "Contact Us",
    to: "/contact",
    highlight: false,
  },
];`;

const planRegex = /const plans = \[[\s\S]*?\];/;
c = c.replace(planRegex, newPlans);

c = c.replace(
  '<h2 className="font-display text-2xl text-[var(--foreground)]">{p.name}</h2>',
  '<h2 className="font-display text-2xl text-[var(--foreground)]">{t(p.nameKey, p.nameFallback)}</h2>'
);
c = c.replace(
  '<p className="mt-1 text-sm text-[var(--muted-foreground)]">{p.tagline}</p>',
  '<p className="mt-1 text-sm text-[var(--muted-foreground)]">{t(p.taglineKey, p.taglineFallback)}</p>'
);
c = c.replace(
  '<p className="font-display text-4xl font-bold text-[var(--primary)]">{p.price}</p>',
  '<p className="font-display text-4xl font-bold text-[var(--primary)]">{t(p.priceKey, p.priceFallback)}</p>'
);
c = c.replace(
  '<span className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">\n                  {p.period}\n                </span>',
  '<span className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">\n                  {t(p.periodKey, p.periodFallback)}\n                </span>'
);
c = c.replace(
  '{p.features.map((f) => (\n                  <li key={f} className="flex items-start gap-2.5 text-sm text-[var(--foreground)]">\n                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--gold)]" />\n                    <span>{f}</span>\n                  </li>\n                ))}',
  '{p.features.map((f) => (\n                  <li key={f.key} className="flex items-start gap-2.5 text-sm text-[var(--foreground)]">\n                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--gold)]" />\n                    <span>{t(f.key, f.fallback)}</span>\n                  </li>\n                ))}'
);
c = c.replace(
  '{p.cta}',
  '{t(p.ctaKey, p.ctaFallback)}'
);

fs.writeFileSync(subPath, c, 'utf8');
console.log('subscriptions.tsx updated with translation keys');
