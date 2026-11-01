const fs = require('fs');
const path = require('path');

const libPath = path.join(__dirname, '../src/pages/library.tsx');
let c = fs.readFileSync(libPath, 'utf8');

const newCollections = `const collections = [
  {
    id: "manuscripts",
    titleKey: "lib_col_manuscripts_title",
    titleFallback: "Manuscripts & Family Papers",
    bodyKey: "lib_col_manuscripts_body",
    bodyFallback: "Private family collections, nasab rolls, correspondence and marriage contracts held in Tunisian households.",
    countKey: "lib_col_manuscripts_count",
    countFallback: "1,240 items",
    category: "manuscripts",
  },
  {
    id: "etat_civil",
    titleKey: "lib_col_etat_civil_title",
    titleFallback: "État Civil Tunisien",
    bodyKey: "lib_col_etat_civil_body",
    bodyFallback: "Civil status registers from 1886 onward: births, marriages, deaths, and municipal indexes by governorate.",
    countKey: "lib_col_etat_civil_count",
    countFallback: "480,000 entries",
    category: "etat-civil",
  },
  {
    id: "sijillat",
    titleKey: "lib_col_sijillat_title",
    titleFallback: "Charaïque Court Registers",
    bodyKey: "lib_col_sijillat_body",
    bodyFallback: "Sijillat of the qadi courts of Tunis, Kairouan, Sfax and Sousse: inheritance, guardianship, property.",
    countKey: "lib_col_sijillat_count",
    countFallback: "3,100 volumes",
    category: "sijillat",
  },
  {
    id: "habous",
    titleKey: "lib_col_habous_title",
    titleFallback: "Habous Deeds",
    bodyKey: "lib_col_habous_body",
    bodyFallback: "Pious endowment records naming founders, beneficiaries and descendants across generations.",
    countKey: "lib_col_habous_count",
    countFallback: "12,700 deeds",
    category: "habous",
  },
  {
    id: "beylical",
    titleKey: "lib_col_beylical_title",
    titleFallback: "Beylical Decrees & Majba Rolls",
    bodyKey: "lib_col_beylical_body",
    bodyFallback: "Husainid decrees, appointments, and the majba poll-tax registers listing heads of households.",
    countKey: "lib_col_beylical_count",
    countFallback: "890 registers",
    category: "beylical",
  },
  {
    id: "maps",
    titleKey: "lib_col_maps_title",
    titleFallback: "Maps, Cadastre & Gazetteers",
    bodyKey: "lib_col_maps_body",
    bodyFallback: "Protectorate cadastral plans, tribal territory maps and place-name gazetteers for locating ancestors.",
    countKey: "lib_col_maps_count",
    countFallback: "2,050 sheets",
    category: "maps",
  },
  {
    id: "community",
    titleKey: "lib_col_community_title",
    titleFallback: "Community Registers of Djerba & Testour",
    bodyKey: "lib_col_community_body",
    bodyFallback: "Jewish-Tunisian ketubot and Andalusian-Morisco family records from Testour and the Medjerda valley.",
    countKey: "lib_col_community_count",
    countFallback: "640 records",
    category: "community",
  },
  {
    id: "nasab",
    titleKey: "lib_col_nasab_title",
    titleFallback: "Nasab & Lineage Texts",
    bodyKey: "lib_col_nasab_body",
    bodyFallback: "Printed and manuscript genealogies of sharifian, marabout and tribal lineages of Tunisia.",
    countKey: "lib_col_nasab_count",
    countFallback: "410 titles",
    category: "nasab",
  },
  {
    id: "administration",
    titleKey: "lib_col_admin_title",
    titleFallback: "Schools, Army & Emigration Files",
    bodyKey: "lib_col_admin_body",
    bodyFallback: "Sadiki College and Zitouna registers, military conscription lists, and emigration papers to France and Italy.",
    countKey: "lib_col_admin_count",
    countFallback: "1,860 files",
    category: "administration",
  },
];`;

const colRegex = /const collections = \[[\s\S]*?\];/;
c = c.replace(colRegex, newCollections);

c = c.replace(
  '<h3 className="mt-4 font-display text-xl text-[var(--foreground)]">{c.title}</h3>',
  '<h3 className="mt-4 font-display text-xl text-[var(--foreground)]">{t(c.titleKey, c.titleFallback)}</h3>'
);
c = c.replace(
  '<p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--muted-foreground)]">{c.body}</p>',
  '<p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--muted-foreground)]">{t(c.bodyKey, c.bodyFallback)}</p>'
);
c = c.replace(
  '<p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[var(--primary)]">\n                  {c.count}\n                </p>',
  '<p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[var(--primary)]">\n                  {t(c.countKey, c.countFallback)}\n                </p>'
);

fs.writeFileSync(libPath, c, 'utf8');
console.log('library.tsx updated with translation keys');
