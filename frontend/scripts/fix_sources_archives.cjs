const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, '../src/pages/SourcesAndArchives.tsx');
let c = fs.readFileSync(srcPath, 'utf8');

const newSourcesArray = `const sources = [
  {
    id: "etat_civil",
    titleKey: "src_etat_civil_title",
    titleFallback: "État Civil Tunisien",
    periodKey: "src_etat_civil_period",
    periodFallback: "1886 – present",
    holdsKey: "src_etat_civil_holds",
    holdsFallback: "Municipalities · Archives Nationales de Tunisie",
    provesKey: "src_etat_civil_proves",
    provesFallback: "Births, marriages, deaths, parents' names, occupations, exact places and dates.",
  },
  {
    id: "charaïque",
    titleKey: "src_charaïque_title",
    titleFallback: "Charaïque Court Sijillat",
    periodKey: "src_charaïque_period",
    periodFallback: "16th c. – 1956",
    holdsKey: "src_charaïque_holds",
    holdsFallback: "ANT · regional court depositories",
    provesKey: "src_charaïque_proves",
    provesFallback: "Inheritance shares, guardianship, marriage contracts, property sales naming heirs.",
  },
  {
    id: "habous",
    titleKey: "src_habous_title",
    titleFallback: "Habous (Waqf) Deeds",
    periodKey: "src_habous_period",
    periodFallback: "13th c. – 1957",
    holdsKey: "src_habous_holds",
    holdsFallback: "Jamaiyat el Habous fonds, ANT",
    provesKey: "src_habous_proves",
    provesFallback: "Founders and named lines of descendants as endowment beneficiaries.",
  },
  {
    id: "beylical",
    titleKey: "src_beylical_title",
    titleFallback: "Beylical Decrees & Appointments",
    periodKey: "src_beylical_period",
    periodFallback: "1705 – 1957",
    holdsKey: "src_beylical_holds",
    holdsFallback: "ANT · Série Beylicale",
    provesKey: "src_beylical_proves",
    provesFallback: "Office holding, honorifics, land grants and household affiliation.",
  },
  {
    id: "majba",
    titleKey: "src_majba_title",
    titleFallback: "Majba & Tax Rolls",
    periodKey: "src_majba_period",
    periodFallback: "1856 – 1881",
    holdsKey: "src_majba_holds",
    holdsFallback: "ANT fiscal series",
    provesKey: "src_majba_proves",
    provesFallback: "Heads of household per douar and tribe — an effective proto-census.",
  },
  {
    id: "cadastre",
    titleKey: "src_cadastre_title",
    titleFallback: "Cadastre & Land Titles",
    periodKey: "src_cadastre_period",
    periodFallback: "1885 – present",
    holdsKey: "src_cadastre_holds",
    holdsFallback: "OTC · Protectorate cadastral service",
    provesKey: "src_cadastre_proves",
    provesFallback: "Property continuity, co-heirs, neighbouring kin and village geography.",
  },
  {
    id: "schools",
    titleKey: "src_schools_title",
    titleFallback: "School & College Registers",
    periodKey: "src_schools_period",
    periodFallback: "1875 – present",
    holdsKey: "src_schools_holds",
    holdsFallback: "Sadiki College, Zitouna, Alaoui, lycées",
    provesKey: "src_schools_proves",
    provesFallback: "Birth dates, fathers' occupations, home addresses and sibling groups.",
  },
  {
    id: "military",
    titleKey: "src_military_title",
    titleFallback: "Military & Conscription Lists",
    periodKey: "src_military_period",
    periodFallback: "1883 – present",
    holdsKey: "src_military_holds",
    holdsFallback: "ANT · French army archives",
    provesKey: "src_military_proves",
    provesFallback: "Physical descriptions, residence, literacy and service or emigration.",
  },
  {
    id: "community",
    titleKey: "src_community_title",
    titleFallback: "Community & Diaspora Registers",
    periodKey: "src_community_period",
    periodFallback: "18th c. – present",
    holdsKey: "src_community_holds",
    holdsFallback: "Djerba, Testour, Marseille, Paris, Milan",
    provesKey: "src_community_proves",
    provesFallback: "Ketubot, community rolls, consulate files and emigration paperwork.",
  },
];`;

const newInstitutionsArray = `const institutions = [
  {
    id: "ant",
    nameKey: "inst_ant_name",
    nameFallback: "Archives Nationales de Tunisie",
    cityKey: "inst_ant_city",
    cityFallback: "Tunis · Boulevard 9 Avril",
    holdingsKey: "inst_ant_holdings",
    holdingsFallback: "Beylical series, fiscal registers, Protectorate administration, charaïque sijillat.",
  },
  {
    id: "bnt",
    nameKey: "inst_bnt_name",
    nameFallback: "Bibliothèque Nationale de Tunisie",
    cityKey: "inst_bnt_city",
    cityFallback: "Tunis · Souk El Attarine",
    holdingsKey: "inst_bnt_holdings",
    holdingsFallback: "Arabic manuscripts, nasab texts, printed genealogies, periodicals.",
  },
  {
    id: "habous",
    nameKey: "inst_habous_name",
    nameFallback: "Jamaiyat el Habous Fonds",
    cityKey: "inst_habous_city",
    cityFallback: "Tunis",
    holdingsKey: "inst_habous_holdings",
    holdingsFallback: "Pious endowment deeds, beneficiary lines, property inventories.",
  },
  {
    id: "kairouan",
    nameKey: "inst_kairouan_name",
    nameFallback: "Tribunal Charaïque de Kairouan",
    cityKey: "inst_kairouan_city",
    cityFallback: "Kairouan",
    holdingsKey: "inst_kairouan_holdings",
    holdingsFallback: "Inheritance rulings, marriage contracts, guardianship files.",
  },
  {
    id: "sfax",
    nameKey: "inst_sfax_name",
    nameFallback: "Archives Municipales de Sfax",
    cityKey: "inst_sfax_city",
    cityFallback: "Sfax",
    holdingsKey: "inst_sfax_holdings",
    holdingsFallback: "État civil, market and port records, notarial acts, olive land titles.",
  },
  {
    id: "sousse",
    nameKey: "inst_sousse_name",
    nameFallback: "Regional Archives of Sousse & the Sahel",
    cityKey: "inst_sousse_city",
    cityFallback: "Sousse · Monastir · Mahdia",
    holdingsKey: "inst_sousse_holdings",
    holdingsFallback: "Civil registers, maritime records, emigration files.",
  },
  {
    id: "djerba",
    nameKey: "inst_djerba_name",
    nameFallback: "Djerba Community Registers",
    cityKey: "inst_djerba_city",
    cityFallback: "Houmt Souk · Hara Sghira",
    holdingsKey: "inst_djerba_holdings",
    holdingsFallback: "Ketubot, community rolls, synagogue and cemetery records.",
  },
  {
    id: "testour",
    nameKey: "inst_testour_name",
    nameFallback: "Testour Andalusian Collections",
    cityKey: "inst_testour_city",
    cityFallback: "Testour · Medjerda valley",
    holdingsKey: "inst_testour_holdings",
    holdingsFallback: "Morisco family papers, settlement records, mosque documents.",
  },
  {
    id: "anom",
    nameKey: "inst_anom_name",
    nameFallback: "Archives Nationales d'Outre-Mer (ANOM)",
    cityKey: "inst_anom_city",
    cityFallback: "Aix-en-Provence, France",
    holdingsKey: "inst_anom_holdings",
    holdingsFallback: "Protectorate correspondence, cadastre, European and Tunisian civil series.",
  },
  {
    id: "inp",
    nameKey: "inst_inp_name",
    nameFallback: "Institut National du Patrimoine",
    cityKey: "inst_inp_city",
    cityFallback: "Tunis · Carthage",
    holdingsKey: "inst_inp_holdings",
    holdingsFallback: "Epigraphy, excavation records, site and monument documentation.",
  },
];`;

const srcRegex = /const sources = \[[\s\S]*?\];/;
const instRegex = /const institutions = \[[\s\S]*?\];/;

c = c.replace(srcRegex, newSourcesArray);
c = c.replace(instRegex, newInstitutionsArray);

// Update sources map in JSX
c = c.replace(
  '<h3 className="font-display text-lg font-semibold text-[var(--foreground)]">{s.title}</h3>',
  '<h3 className="font-display text-lg font-semibold text-[var(--foreground)]">{t(s.titleKey, s.titleFallback)}</h3>'
);
c = c.replace(
  '<span className="rounded-sm bg-[var(--gold)]/15 px-2 py-0.5 text-[0.65rem] font-bold text-[var(--gold)] shrink-0">\n                  {s.period}\n                </span>',
  '<span className="rounded-sm bg-[var(--gold)]/15 px-2 py-0.5 text-[0.65rem] font-bold text-[var(--gold)] shrink-0">\n                  {t(s.periodKey, s.periodFallback)}\n                </span>'
);
c = c.replace(
  '<p className="mt-1 text-xs text-[var(--muted-foreground)]">{s.holds}</p>',
  '<p className="mt-1 text-xs text-[var(--muted-foreground)]">{t(s.holdsKey, s.holdsFallback)}</p>'
);
c = c.replace(
  '<p className="mt-1 flex-1 text-sm leading-relaxed text-[var(--foreground)]">{s.proves}</p>',
  '<p className="mt-1 flex-1 text-sm leading-relaxed text-[var(--foreground)]">{t(s.provesKey, s.provesFallback)}</p>'
);

// Update institutions map in JSX
c = c.replace(
  '<h3 className="mt-4 font-display text-xl text-[var(--foreground)]">{i.name}</h3>',
  '<h3 className="mt-4 font-display text-xl text-[var(--foreground)]">{t(i.nameKey, i.nameFallback)}</h3>'
);
c = c.replace(
  '<MapPin className="h-3.5 w-3.5" /> {i.city}',
  '<MapPin className="h-3.5 w-3.5" /> {t(i.cityKey, i.cityFallback)}'
);
c = c.replace(
  '<p className="mt-4 text-sm leading-relaxed text-[var(--muted-foreground)]">\n                {i.holdings}\n              </p>',
  '<p className="mt-4 text-sm leading-relaxed text-[var(--muted-foreground)]">\n                {t(i.holdingsKey, i.holdingsFallback)}\n              </p>'
);

fs.writeFileSync(srcPath, c, 'utf8');
console.log('SourcesAndArchives.tsx updated with translation keys');
