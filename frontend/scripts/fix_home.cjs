const fs = require('fs');
const path = require('path');

const homePath = path.join(__dirname, '../src/pages/home.tsx');
let c = fs.readFileSync(homePath, 'utf8');

// Replace tools array
const oldTools = `const tools = [
  {
    icon: GitBranch,
    title: "Family Trees",
    body: "Build multi-generational trees, import GEDCOM files, and attach Tunisian records, places, dates and source notes.",
    to: "/gallery/trees",
  },
  {
    icon: Camera,
    title: "Photo Gallery",
    body: "Preserve family portraits, studio photographs from Tunis and Sfax, documents and maps with provenance.",
    to: "/gallery",
  },
  {
    icon: BookOpen,
    title: "Library & Documents",
    body: "Organize digitized books, manuscripts, civil extracts, nasab texts, beylical decrees and research notes.",
    to: "/library",
  },
  {
    icon: Mic,
    title: "Oral Histories",
    body: "Record elders, malouf songs, dialect memories, tribal poetry and migration stories from the diaspora.",
    to: "/gallery/audios",
  },
  {
    icon: Landmark,
    title: "Sources & Periods",
    body: "Navigate the Archives Nationales de Tunisie, charaïque courts, habous, état civil, and the periods that shaped them.",
    to: "/sources",
  },
];`;

const newTools = `const tools = [
  {
    icon: GitBranch,
    titleKey: "tool_family_trees_title",
    titleFallback: "Family Trees",
    bodyKey: "tool_family_trees_body",
    bodyFallback: "Build multi-generational trees, import GEDCOM files, and attach Tunisian records, places, dates and source notes.",
    to: "/gallery/trees",
  },
  {
    icon: Camera,
    titleKey: "tool_photo_gallery_title",
    titleFallback: "Photo Gallery",
    bodyKey: "tool_photo_gallery_body",
    bodyFallback: "Preserve family portraits, studio photographs from Tunis and Sfax, documents and maps with provenance.",
    to: "/gallery",
  },
  {
    icon: BookOpen,
    titleKey: "tool_library_docs_title",
    titleFallback: "Library & Documents",
    bodyKey: "tool_library_docs_body",
    bodyFallback: "Organize digitized books, manuscripts, civil extracts, nasab texts, beylical decrees and research notes.",
    to: "/library",
  },
  {
    icon: Mic,
    titleKey: "tool_oral_histories_title",
    titleFallback: "Oral Histories",
    bodyKey: "tool_oral_histories_body",
    bodyFallback: "Record elders, malouf songs, dialect memories, tribal poetry and migration stories from the diaspora.",
    to: "/gallery/audios",
  },
  {
    icon: Landmark,
    titleKey: "tool_sources_periods_title",
    titleFallback: "Sources & Periods",
    bodyKey: "tool_sources_periods_body",
    bodyFallback: "Navigate the Archives Nationales de Tunisie, charaïque courts, habous, état civil, and the periods that shaped them.",
    to: "/sources",
  },
];`;

c = c.replace(oldTools, newTools);

// Replace timeline array
const oldTimeline = `const timeline = [
  { era: "Punic Carthage", detail: "Stelae, votive inscriptions, Punic onomastics", years: "814–146 BC" },
  { era: "Roman Africa", detail: "Epigraphy, colonial land registers, El Jem", years: "146 BC–439 AD" },
  { era: "Vandal & Byzantine", detail: "Church records, Latin inscriptions", years: "439–698" },
  { era: "Aghlabid & Fatimid", detail: "Kairouan scholarship, nasab chains, waqf", years: "800–1048" },
  { era: "Hafsid", detail: "Tunis chancery, qadi rulings, family endowments", years: "1229–1574" },
  { era: "Ottoman & Beylical", detail: "Sijillat, beylical decrees, majba tax rolls", years: "1574–1881" },
  { era: "French Protectorate", detail: "État civil, cadastre, ANOM, school registers", years: "1881–1956" },
  { era: "Independence", detail: "Civil registry, ID papers, migration files", years: "1956–1987" },
  { era: "Contemporary", detail: "Digital archives, restoration, collaboration", years: "1987–Present" },
];`;

const newTimeline = `const timeline = [
  { eraKey: "timeline_era_punic", eraFallback: "Punic Carthage", detailKey: "timeline_detail_punic", detailFallback: "Stelae, votive inscriptions, Punic onomastics", yearsKey: "timeline_years_punic", yearsFallback: "814–146 BC" },
  { eraKey: "timeline_era_roman", eraFallback: "Roman Africa", detailKey: "timeline_detail_roman", detailFallback: "Epigraphy, colonial land registers, El Jem", yearsKey: "timeline_years_roman", yearsFallback: "146 BC–439 AD" },
  { eraKey: "timeline_era_vandal", eraFallback: "Vandal & Byzantine", detailKey: "timeline_detail_vandal", detailFallback: "Church records, Latin inscriptions", yearsKey: "timeline_years_vandal", yearsFallback: "439–698" },
  { eraKey: "timeline_era_aghabid", eraFallback: "Aghlabid & Fatimid", detailKey: "timeline_detail_aghabid", detailFallback: "Kairouan scholarship, nasab chains, waqf", yearsKey: "timeline_years_aghabid", yearsFallback: "800–1048" },
  { eraKey: "timeline_era_hafsid", eraFallback: "Hafsid", detailKey: "timeline_detail_hafsid", detailFallback: "Tunis chancery, qadi rulings, family endowments", yearsKey: "timeline_years_hafsid", yearsFallback: "1229–1574" },
  { eraKey: "timeline_era_ottoman", eraFallback: "Ottoman & Beylical", detailKey: "timeline_detail_ottoman", detailFallback: "Sijillat, beylical decrees, majba tax rolls", yearsKey: "timeline_years_ottoman", yearsFallback: "1574–1881" },
  { eraKey: "timeline_era_protectorate", eraFallback: "French Protectorate", detailKey: "timeline_detail_protectorate", detailFallback: "État civil, cadastre, ANOM, school registers", yearsKey: "timeline_years_protectorate", yearsFallback: "1881–1956" },
  { eraKey: "timeline_era_independence", eraFallback: "Independence", detailKey: "timeline_detail_independence", detailFallback: "Civil registry, ID papers, migration files", yearsKey: "timeline_years_independence", yearsFallback: "1956–1987" },
  { eraKey: "timeline_era_contemporary", eraFallback: "Contemporary", detailKey: "timeline_detail_contemporary", detailFallback: "Digital archives, restoration, collaboration", yearsKey: "timeline_years_contemporary", yearsFallback: "1987–Present" },
];`;

c = c.replace(oldTimeline, newTimeline);

// Replace librarySources
const oldLibSources = `const librarySources = [
  "Manuscripts & Family Papers",
  "État Civil Tunisien (1886–)",
  "Nasab & Lineage Texts",
  "Ottoman & Beylical Registers",
  "Habous Property Deeds",
  "Maps, Cadastre & Gazetteers",
];`;

const newLibSources = `const librarySources = [
  { key: "lib_source_manuscripts", fallback: "Manuscripts & Family Papers" },
  { key: "lib_source_etat_civil", fallback: "État Civil Tunisien (1886–)" },
  { key: "lib_source_nasab", fallback: "Nasab & Lineage Texts" },
  { key: "lib_source_ottoman", fallback: "Ottoman & Beylical Registers" },
  { key: "lib_source_habous", fallback: "Habous Property Deeds" },
  { key: "lib_source_maps", fallback: "Maps, Cadastre & Gazetteers" },
];`;

c = c.replace(oldLibSources, newLibSources);

// Replace archives
const oldArchives = `const archives = [
  "Archives Nationales de Tunisie (Tunis)",
  "Registres Charaïques (Tunis, Kairouan, Sfax)",
  "Jamaiyat el Habous — Pious Endowments",
  "Archives du Protectorat & ANOM",
  "Beylical Decrees & Majba Tax Rolls",
  "Djerba & Testour Community Registers",
  "Bibliothèque Nationale de Tunisie",
];`;

const newArchives = `const archives = [
  { key: "archive_ant", fallback: "Archives Nationales de Tunisie (Tunis)" },
  { key: "archive_charaïque", fallback: "Registres Charaïques (Tunis, Kairouan, Sfax)" },
  { key: "archive_habous", fallback: "Jamaiyat el Habous — Pious Endowments" },
  { key: "archive_protectorat", fallback: "Archives du Protectorat & ANOM" },
  { key: "archive_beylical", fallback: "Beylical Decrees & Majba Tax Rolls" },
  { key: "archive_djerba_testour", fallback: "Djerba & Testour Community Registers" },
  { key: "archive_bnt", fallback: "Bibliothèque Nationale de Tunisie" },
];`;

c = c.replace(oldArchives, newArchives);

// Update tools.map in JSX
c = c.replace(
  '<article\n                key={tool.title}',
  '<article\n                key={tool.titleKey}'
);
c = c.replace(
  '<h3 className="mt-4 font-display text-xl text-[var(--foreground)]">{tool.title}</h3>\n                <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--muted-foreground)]">\n                  {tool.body}\n                </p>',
  '<h3 className="mt-4 font-display text-xl text-[var(--foreground)]">{t(tool.titleKey, tool.titleFallback)}</h3>\n                <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--muted-foreground)]">\n                  {t(tool.bodyKey, tool.bodyFallback)}\n                </p>'
);

// Update timeline.map in JSX
c = c.replace(
  '<div\n              key={item.era}',
  '<div\n              key={item.eraKey}'
);
c = c.replace(
  '<h3 className="font-display text-lg font-semibold text-[var(--foreground)]">{item.era}</h3>\n                  <span className="rounded-sm bg-[var(--gold)]/15 px-2 py-0.5 text-[0.65rem] font-bold text-[var(--gold)]">\n                    {item.years}\n                  </span>\n                </div>\n                <p className="mt-2.5 text-xs leading-relaxed text-[var(--muted-foreground)]">\n                  {item.detail}\n                </p>',
  '<h3 className="font-display text-lg font-semibold text-[var(--foreground)]">{t(item.eraKey, item.eraFallback)}</h3>\n                  <span className="rounded-sm bg-[var(--gold)]/15 px-2 py-0.5 text-[0.65rem] font-bold text-[var(--gold)]">\n                    {t(item.yearsKey, item.yearsFallback)}\n                  </span>\n                </div>\n                <p className="mt-2.5 text-xs leading-relaxed text-[var(--muted-foreground)]">\n                  {t(item.detailKey, item.detailFallback)}\n                </p>'
);

// Update librarySources.map in JSX
c = c.replace(
  '{librarySources.map((s) => (\n                <li key={s} className="flex items-center gap-3 text-sm text-[var(--foreground)]">\n                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold)] shrink-0" />\n                  {s}\n                </li>\n              ))}',
  '{librarySources.map((s) => (\n                <li key={s.key} className="flex items-center gap-3 text-sm text-[var(--foreground)]">\n                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold)] shrink-0" />\n                  {t(s.key, s.fallback)}\n                </li>\n              ))}'
);

// Update archives.map in JSX
c = c.replace(
  '{archives.map((a) => (\n                <li key={a} className="flex items-center gap-3 text-sm text-[var(--foreground)]">\n                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)] shrink-0" />\n                  {a}\n                </li>\n              ))}',
  '{archives.map((a) => (\n                <li key={a.key} className="flex items-center gap-3 text-sm text-[var(--foreground)]">\n                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)] shrink-0" />\n                  {t(a.key, a.fallback)}\n                </li>\n              ))}'
);

// Update French fallbacks in individuals and empty states
c = c.replace(
  `{t("no_published_trees", "Aucun arbre généalogique publié pour le moment. Créez votre premier arbre dans l'Éditeur d'Arbres !")}`,
  `{t("no_published_trees", "لا توجد أشجار عائلية منشورة حالياً. أنشئ شجرتك الأولى في أداة بناء الأشجار!")}`
);
c = c.replace(
  `{t("personalities_lineages", "Personnalités & Lignées")}`,
  `{t("personalities_lineages", "شخصيات ولئيات تونسية")}`
);
c = c.replace(
  `{t("individuals_and_registers", "Individus & Registres Généalogiques")}`,
  `{t("individuals_and_registers", "الأفراد وسجلات الأنساب")}`
);
c = c.replace(
  `{t("individuals_registers_intro", "Explorez les fiches généalogiques d'ancêtres, savants, marchands et notables répertoriés dans les archives tunisiennes.")}`,
  `{t("individuals_registers_intro", "استكشف السجلات والوثائق الجينيالوجية للأجداد والعلماء والتجار والوجهاء في الأرشيف التونسي.")}`
);
c = c.replace(
  `{person.birth_place || person.birthPlace || t("tunisia", "Tunisie")}`,
  `{person.birth_place || person.birthPlace || t("tunisia", "تونس")}`
);
c = c.replace(
  `{person.gender === 'F' ? t("female", "Femme") : t("male", "Homme")}`,
  `{person.gender === 'F' ? t("female", "أنثى") : t("male", "ذكر")}`
);
c = c.replace(
  `{t("birth_abbr", "Nais.:")} {person.birth_date || person.birthDate || t("unknown", "Inconnue")}`,
  `{t("birth_abbr", "الولادة:")} {person.birth_date || person.birthDate || t("unknown", "غير معروفة")}`
);
c = c.replace(
  `{t("death_abbr", "Décès:")}`,
  `{t("death_abbr", "الوفاة:")}`
);
c = c.replace(
  `<span>{t("view_individual_card_3d", "Afficher la Fiche Individuelle 3D")}</span>`,
  `<span>{t("view_individual_card_3d", "عرض البطاقة ثلاثية الأبعاد")}</span>`
);
c = c.replace(
  `{t("no_individuals_listed", "Aucun individu répertorié pour le moment.")}`,
  `{t("no_individuals_listed", "لا يوجد أفراد مسجلون حالياً.")}`
);

fs.writeFileSync(homePath, c, 'utf8');
console.log('Home.tsx updated with translation keys and Arabic fallbacks');
