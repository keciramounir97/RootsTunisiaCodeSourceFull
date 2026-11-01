const fs = require('fs');
const path = require('path');

const periodsPath = path.join(__dirname, '../src/pages/periods.tsx');
let c = fs.readFileSync(periodsPath, 'utf8');

const newPeriodsArray = `const periods = [
  {
    id: "punic",
    eraKey: "period_punic_era",
    eraFallback: "Punic Carthage",
    yearsKey: "period_punic_years",
    yearsFallback: "814–146 BC",
    recordsKey: "period_punic_records",
    recordsFallback: "Votive stelae from the Tophet, Punic onomastics, Neo-Punic inscriptions",
    noteKey: "period_punic_note",
    noteFallback: "No continuous lineage evidence, but name elements and place attachments survive in later toponyms.",
  },
  {
    id: "roman",
    eraKey: "period_roman_era",
    eraFallback: "Roman Africa Proconsularis",
    yearsKey: "period_roman_years",
    yearsFallback: "146 BC–439 AD",
    recordsKey: "period_roman_records",
    recordsFallback: "Funerary epigraphy, municipal alba, land registers, El Jem and Dougga inscriptions",
    noteKey: "period_roman_note",
    noteFallback: "Latin inscriptions document family groups, freedmen and civic office across Tunisian cities.",
  },
  {
    id: "vandal",
    eraKey: "period_vandal_era",
    eraFallback: "Vandal & Byzantine",
    yearsKey: "period_vandal_years",
    yearsFallback: "439–698",
    recordsKey: "period_vandal_records",
    recordsFallback: "Church councils, episcopal lists, Latin and Christian funerary texts",
    noteKey: "period_vandal_note",
    noteFallback: "Ecclesiastical sources dominate; onomastic shifts mark community change.",
  },
  {
    id: "aghabid",
    eraKey: "period_aghabid_era",
    eraFallback: "Aghlabid & Fatimid Ifriqiya",
    yearsKey: "period_aghabid_years",
    yearsFallback: "800–1048",
    recordsKey: "period_aghabid_records",
    recordsFallback: "Kairouan scholarly biographies (tabaqat), nasab chains, early waqf",
    noteKey: "period_aghabid_note",
    noteFallback: "Chains of transmission among Kairouan jurists provide some of Tunisia's oldest documented lineages.",
  },
  {
    id: "hafsid",
    eraKey: "period_hafsid_era",
    eraFallback: "Zirid, Almohad & Hafsid",
    yearsKey: "period_hafsid_years",
    yearsFallback: "1048–1574",
    recordsKey: "period_hafsid_records",
    recordsFallback: "Hafsid chancery documents, qadi rulings, family endowments, ijazat",
    noteKey: "period_hafsid_note",
    noteFallback: "Tunis becomes an administrative capital; scholarly and mercantile families appear in continuous records.",
  },
  {
    id: "ottoman",
    eraKey: "period_ottoman_era",
    eraFallback: "Ottoman Regency & Beylical Tunisia",
    yearsKey: "period_ottoman_years",
    yearsFallback: "1574–1881",
    recordsKey: "period_ottoman_records",
    recordsFallback: "Charaïque sijillat, habous deeds, beylical decrees, majba tax rolls, Mamluk household lists",
    noteKey: "period_ottoman_note",
    noteFallback: "The richest pre-modern layer: inheritance cases name three to four generations at once.",
  },
  {
    id: "protectorate",
    eraKey: "period_protectorate_era",
    eraFallback: "French Protectorate",
    yearsKey: "period_protectorate_years",
    yearsFallback: "1881–1956",
    recordsKey: "period_protectorate_records",
    recordsFallback: "État civil, cadastre, caïdat files, school and military registers, ANOM series",
    noteKey: "period_protectorate_note",
    noteFallback: "Systematic civil registration begins in 1886 for Europeans and expands to Tunisians; surnames become fixed.",
  },
  {
    id: "independence",
    eraKey: "period_independence_era",
    eraFallback: "Independence & Bourguiba era",
    yearsKey: "period_independence_years",
    yearsFallback: "1956–1987",
    recordsKey: "period_independence_records",
    recordsFallback: "Civil registry, CIN records, nationality files, emigration and labour contracts",
    noteKey: "period_independence_note",
    noteFallback: "Personal Status Code reshapes marriage and inheritance documentation.",
  },
  {
    id: "contemporary",
    eraKey: "period_contemporary_era",
    eraFallback: "Contemporary Tunisia",
    yearsKey: "period_contemporary_years",
    yearsFallback: "1987–Present",
    recordsKey: "period_contemporary_records",
    recordsFallback: "Digitized archives, municipal databases, family testimony, restored photographs",
    noteKey: "period_contemporary_note",
    noteFallback: "Collaborative research and diaspora contributions rebuild branches separated by migration.",
  },
];`;

const periodRegex = /const periods = \[[\s\S]*?\];/;
c = c.replace(periodRegex, newPeriodsArray);

c = c.replace(
  '<h3 className="font-display text-xl md:text-2xl text-[var(--foreground)]">{p.era}</h3>',
  '<h3 className="font-display text-xl md:text-2xl text-[var(--foreground)]">{t(p.eraKey, p.eraFallback)}</h3>'
);
c = c.replace(
  '<span className="rounded-sm bg-[var(--gold)]/15 px-3 py-1 text-xs font-bold text-[var(--gold)]">\n                    {p.years}\n                  </span>',
  '<span className="rounded-sm bg-[var(--gold)]/15 px-3 py-1 text-xs font-bold text-[var(--gold)]">\n                    {t(p.yearsKey, p.yearsFallback)}\n                  </span>'
);
c = c.replace(
  '<p className="text-[var(--muted-foreground)] leading-relaxed">{p.records}</p>',
  '<p className="text-[var(--muted-foreground)] leading-relaxed">{t(p.recordsKey, p.recordsFallback)}</p>'
);
c = c.replace(
  '<p className="text-[var(--muted-foreground)] leading-relaxed">{p.note}</p>',
  '<p className="text-[var(--muted-foreground)] leading-relaxed">{t(p.noteKey, p.noteFallback)}</p>'
);

fs.writeFileSync(periodsPath, c, 'utf8');
console.log('periods.tsx updated with translation keys');
