export interface DropdownTranslationSet {
  nav_explore: string;
  nav_periods: string;
  nav_periods_hint: string;
  nav_sources: string;
  nav_sources_hint: string;
  nav_archives: string;
  nav_archives_hint: string;
  nav_subscriptions: string;
  nav_subscriptions_hint: string;
  nav_gallery: string;
  nav_gallery_hub: string;
  nav_gallery_hub_hint: string;
  nav_photo_archives: string;
  nav_photo_archives_hint: string;
  nav_trees: string;
  nav_trees_hint: string;
  nav_library: string;
  nav_library_hint: string;
  nav_audios: string;
  nav_audios_hint: string;
  nav_documents: string;
  nav_documents_hint: string;
  nav_articles: string;
  nav_articles_hint: string;
}

export const TUNISIA_NAV_TRANSLATIONS: Record<string, DropdownTranslationSet> = {
  en: {
    nav_explore: "Explore",
    nav_periods: "Periods",
    nav_periods_hint: "Historical eras & timeline",
    nav_sources: "Sources",
    nav_sources_hint: "Archival guides & primary repositories",
    nav_archives: "Archives",
    nav_archives_hint: "National & regional collections",
    nav_subscriptions: "Subscriptions",
    nav_subscriptions_hint: "Membership & research passes",
    nav_gallery: "Gallery",
    nav_gallery_hub: "Collections hub",
    nav_gallery_hub_hint: "Tunisia trees, photos & fonds",
    nav_photo_archives: "Photo archives",
    nav_photo_archives_hint: "Carthage, Kairouan, Medina & Sahel",
    nav_trees: "Family trees",
    nav_trees_hint: "Nasab & GEDCOM lineages",
    nav_library: "Manuscript library",
    nav_library_hint: "Habous registers & nasab works",
    nav_audios: "Oral histories & Audio",
    nav_audios_hint: "Malouf, elders & testimony",
    nav_documents: "Documents & Sijillat",
    nav_documents_hint: "Sijills, beylical & notarial deeds",
    nav_articles: "Articles & Heritage Stories",
    nav_articles_hint: "Essays on Tunisian heritage",
  },
  fr: {
    nav_explore: "Explorer",
    nav_periods: "Périodes",
    nav_periods_hint: "Époques historiques & chronologie",
    nav_sources: "Sources",
    nav_sources_hint: "Guides des sources & dépôts primaires",
    nav_archives: "Archives",
    nav_archives_hint: "Fonds nationaux & régionaux",
    nav_subscriptions: "Abonnements",
    nav_subscriptions_hint: "Formules & accès à la recherche",
    nav_gallery: "Galerie",
    nav_gallery_hub: "Centre des collections",
    nav_gallery_hub_hint: "Arbres, photographies & fonds de Tunisie",
    nav_photo_archives: "Archives photographiques",
    nav_photo_archives_hint: "Carthage, Kairouan, Médina & Sahel",
    nav_trees: "Arbres généalogiques",
    nav_trees_hint: "Lignées de nasab & arbres GEDCOM",
    nav_library: "Manuscrits & Ouvrages",
    nav_library_hint: "Registres des habous & ouvrages de nasab",
    nav_audios: "Récits Oraux & Audio",
    nav_audios_hint: "Malouf, aînés & témoignages oraux",
    nav_documents: "Documents & Sijillat",
    nav_documents_hint: "Sijills, actes beylicaux & notariés",
    nav_articles: "Articles & Récits",
    nav_articles_hint: "Essais et études sur le patrimoine tunisien",
  },
  ar: {
    nav_explore: "استكشف",
    nav_periods: "الفترات التاريخية",
    nav_periods_hint: "الحقب التاريخية والخط الزمني",
    nav_sources: "المصادر والأرشيف",
    nav_sources_hint: "أدلة المصادر والمستودعات الأولية",
    nav_archives: "الأرشيفات والمراكز",
    nav_archives_hint: "الأرشيف الوطني والأرصدة الجهوية",
    nav_subscriptions: "الاشتراكات",
    nav_subscriptions_hint: "خطط الاشتراك وباقات البحث",
    nav_gallery: "المجموعات",
    nav_gallery_hub: "مجمع المجموعات",
    nav_gallery_hub_hint: "أشجار العائلات، الصور والأرشيف في تونس",
    nav_photo_archives: "أرشيف الصور",
    nav_photo_archives_hint: "قرطاج، القيروان، المدينة والساحل",
    nav_trees: "شجرات العائلة",
    nav_trees_hint: "أنساب العائلات وسجلات جيدكوم",
    nav_library: "المكتبة والمخطوطات",
    nav_library_hint: "دفاتر الأحباس وكتب الأنساب والمصادر",
    nav_audios: "الروايات الشفوية والتسجيلات",
    nav_audios_hint: "المالوف، الذاكرة الشفوية والشهادات",
    nav_documents: "وثائق الأرشيف والسجلات",
    nav_documents_hint: "السجلات الشرعية، الحجج والدفاتر البايليك",
    nav_articles: "المقالات والأبحاث",
    nav_articles_hint: "دراسات ومقالات في التراث التونسي",
  },
};

export function getTunisiaDropdownText(locale: string | undefined, key: keyof DropdownTranslationSet): string {
  const lang = (locale || "en").toLowerCase().slice(0, 2);
  const dict = TUNISIA_NAV_TRANSLATIONS[lang] || TUNISIA_NAV_TRANSLATIONS.en;
  return dict[key] || TUNISIA_NAV_TRANSLATIONS.en[key] || "";
}

