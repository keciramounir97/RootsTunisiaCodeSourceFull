export const SOURCES_CMS_LOCALES = [
  { code: "fr", label: "Français", tag: "FR" },
  { code: "en", label: "English", tag: "EN" },
  { code: "ar", label: "العربية", tag: "AR" },
  { code: "es", label: "Español", tag: "ES" },
  { code: "it", label: "Italiano", tag: "IT" },
  { code: "mt", label: "Malti", tag: "MT" },
] as const;

export interface SourcesHeroLocaleConfig {
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
}

export interface SourcesCardLocaleOverride {
  title?: string;
  badge?: string;
  description?: string;
  tags?: string[];
}

export interface SourcesLocationLocaleOverride {
  label?: string;
  description?: string;
}

export interface SourcesMultiLocaleStore {
  heroByLocale: Record<string, SourcesHeroLocaleConfig>;
  cardOverridesByLocale: Record<string, Record<string, SourcesCardLocaleOverride>>;
  locationOverridesByLocale: Record<string, Record<string, SourcesLocationLocaleOverride>>;
}

export const SOURCES_CMS_STORAGE_KEY = "RootsTunisia_sources_cms_locales_v3";

export const DEFAULT_SOURCES_HERO_BY_LOCALE: Record<string, SourcesHeroLocaleConfig> = {
  fr: {
    eyebrow: "RÉPERTOIRE DES INSTITUTIONS & DÉPÔTS",
    title: "Sources & Archives pour la Tunisie",
    subtitle:
      "Portails officiels, bases nominatives et dépôts d'archives nationaux et internationaux indispensables pour retracer une lignée en Tunisie.",
    image: "",
  },
  en: {
    eyebrow: "DIRECTORY OF INSTITUTIONS & REPOSITORIES",
    title: "Sources & Archives for Tunisia",
    subtitle:
      "Official portals, nominal databases, and national and international archival repositories essential for tracing a family lineage in Tunisia.",
    image: "",
  },
  ar: {
    eyebrow: "دليل المؤسسات ومراكز الأرشيف",
    title: "المصادر والأرشيفات الخاصة بتونس",
    subtitle:
      "البوابات الرسمية، وقواعد البيانات الاسمية، ومراكز الأرشيف الوطنية والدولية الأساسية لتتبع وتوثيق شجرات الأنساب في تونس.",
    image: "",
  },
  es: {
    eyebrow: "DIRECTORIO DE INSTITUCIONES Y DEPÓSITOS",
    title: "Fuentes y Archivos para Túnez",
    subtitle:
      "Portales oficiales, bases nominales y depósitos de archivos nacionales e internacionales indispensables para rastrear un linaje en Túnez.",
    image: "",
  },
  it: {
    eyebrow: "REPERTORIO DELLE ISTITUZIONI E DEPOSITI",
    title: "Fonti e Archivi per la Tunisia",
    subtitle:
      "Portali ufficiali, banche dati nominative e depositi d'archivio nazionali e internazionali indispensabili per ricostruire un lignaggio in Tunisia.",
    image: "",
  },
  mt: {
    eyebrow: "DIRETTORJU TAL-ISTITUZZJONIJIET U REPOŻITORJI",
    title: "Sorsi u Arkivji għat-Tuneżija",
    subtitle:
      "Portali uffiċjali, bażijiet tad-dejta nominattivi u arkivji nazzjonali u internazzjonali essenzjali biex issib linaġġ tal-familja fit-Tuneżija.",
    image: "",
  },
};

export const DEFAULT_LOCATIONS_BY_LOCALE: Record<
  string,
  Record<string, { label: string; description: string }>
> = {
  fr: {
    tunisia: { label: "Tunisie", description: "Archives d'État, dépôts notariaux et fonds beylicaux" },
    france: { label: "France", description: "Fonds du Protectorat, CADN, ANOM et SHD" },
    italy: { label: "Italie & Sicile", description: "État civil Antenati, consulats et archives provinciales" },
    malta: { label: "Malte", description: "Archives nationales maltaises et registres paroissiaux" },
    uk: { label: "Royaume-Uni", description: "Foreign Office, consulat général et sépultures alliées" },
    jewish: { label: "Fonds Juifs", description: "Cercle de généalogie, AIU, SHJT et archives rabbiniques" },
    ottoman: { label: "Ottoman & Islamique", description: "Archives impériales ottomanes, IRCICA et Zitouna" },
    maghreb: { label: "Algérie & Maghreb", description: "Archives transfrontalières d'Afrique du Nord" },
  },
  en: {
    tunisia: { label: "Tunisia", description: "State archives, notarial repositories, and Beylical holdings" },
    france: { label: "France", description: "Protectorate holdings, CADN, ANOM, and military archives" },
    italy: { label: "Italy & Sicily", description: "Antenati civil registration, consulates, and provincial archives" },
    malta: { label: "Malta", description: "National Archives of Malta and parish registers" },
    uk: { label: "United Kingdom", description: "Foreign Office, consulate general, and Commonwealth graves" },
    jewish: { label: "Jewish Holdings", description: "Genealogy societies, AIU, SHJT, and rabbinical archives" },
    ottoman: { label: "Ottoman & Islamic", description: "Imperial Ottoman archives, IRCICA, and Zitouna manuscripts" },
    maghreb: { label: "Algeria & Maghreb", description: "Cross-border North African archival holdings" },
  },
  ar: {
    tunisia: { label: "تونس", description: "أرشيف الدولة، ودفاتر العدول، والأرصدة البايليكية" },
    france: { label: "فرنسا", description: "أرصدة فترة الحماية، وأرشيف نانت، وأرشيف ما وراء البحار" },
    italy: { label: "إيطاليا وصقلية", description: "سجلات الحالة المدنية والقنصليات والأرشيفات الإقليمية" },
    malta: { label: "مالطا", description: "الأرشيف الوطني المالطي والسجلات الكنسية" },
    uk: { label: "المملكة المتحدة", description: "وزارة الخارجية البريطانية والقنصلية العامة بتونس" },
    jewish: { label: "الأرصدة اليهودية", description: "الجمعيات الجينالوجية ومدارس الأليانس والمحاكم الربانية" },
    ottoman: { label: "الأرشيف العثماني والإسلامي", description: "الأرشيف العثماني ومخطوطات جامع الزيتونة" },
    maghreb: { label: "الجزائر والمغرب الكبير", description: "الأرشيفات المغاربية المشتركة عبر الحدود" },
  },
  es: {
    tunisia: { label: "Túnez", description: "Archivos de Estado, notarías y fondos beylical" },
    france: { label: "Francia", description: "Fondos del Protectorado, CADN, ANOM y SHD" },
    italy: { label: "Italia y Sicilia", description: "Registro civil Antenati, consulados y archivos provinciales" },
    malta: { label: "Malta", description: "Archivos nacionales de Malta y registros parroquiales" },
    uk: { label: "Reino Unido", description: "Foreign Office, consulado general y cementerios aliados" },
    jewish: { label: "Fondos Judíos", description: "Círculo de genealogía, AIU, SHJT y archivos rabínicos" },
    ottoman: { label: "Otomano e Islámico", description: "Archivos imperiales otomanos, IRCICA y Zitouna" },
    maghreb: { label: "Argelia y Magreb", description: "Archivos transfronterizos del Norte de África" },
  },
  it: {
    tunisia: { label: "Tunisia", description: "Archivi di Stato, depositi notarili e fondi beylicali" },
    france: { label: "Francia", description: "Fondi del Protettorato, CADN, ANOM e SHD" },
    italy: { label: "Italia e Sicilia", description: "Stato civile Antenati, consolati e archivi provinciali" },
    malta: { label: "Malta", description: "Archivi nazionali maltesi e registri parrocchiali" },
    uk: { label: "Regno Unito", description: "Foreign Office, consolato generale e cimiteri alleati" },
    jewish: { label: "Fondi Ebraici", description: "Circolo di genealogia, AIU, SHJT e archivi rabbinici" },
    ottoman: { label: "Ottomano e Islamico", description: "Archivi imperiali ottomani, IRCICA e Zitouna" },
    maghreb: { label: "Algeria e Maghreb", description: "Archivi transfrontalieri del Nord Africa" },
  },
  mt: {
    tunisia: { label: "Tuneżija", description: "Arkivji tal-Istat, reġistri notarili u fondi bejlikali" },
    france: { label: "Franza", description: "Fondi tal-Protettorat, CADN, ANOM u SHD" },
    italy: { label: "Italja u Sqallija", description: "Stat ċivili Antenati, konsulati u arkivji provinċjali" },
    malta: { label: "Malta", description: "Arkivji Nazzjonali ta' Malta u reġistri parrokkjali" },
    uk: { label: "Renju Unit", description: "Foreign Office, konsulat ġenerali u ċimiterji" },
    jewish: { label: "Fondi Lhud", description: "Ċirku tal-ġenealoġija, AIU, SHJT u arkivji rabbiniċi" },
    ottoman: { label: "Ottoman u Islamiku", description: "Arkivji imperjali Ottomani, IRCICA u Zitouna" },
    maghreb: { label: "Alġerija u Maghreb", description: "Arkivji transkonfinali tal-Afrika ta' Fuq" },
  },
};

/**
 * Full 6-language default translations for all 28 archive cards in ARCHIVES_DIRECTORY
 */
export const DEFAULT_SOURCE_CARDS_BY_LOCALE: Record<
  string,
  Record<string, Required<SourcesCardLocaleOverride>>
> = {
  en: {
    "ant-tunisie": {
      title: "National Archives of Tunisia (ANT)",
      badge: "State Archives • Tunis",
      description:
        "Central repository of Tunisian history. Preserves the nominal Majba tax census registers (1860–1869), Husseinite Beylical decrees, secular Ouzara court rulings, and notarial deeds ('udul).",
      tags: ["Majba 1860-1869", "Beylical Decrees", "Notarial 'Udul", "Ouzara Courts"],
    },
    "bnt-tunisie": {
      title: "National Library of Tunisia (BNT)",
      badge: "Written Heritage & Manuscripts • Tunis",
      description:
        "Preservation of printed and manuscript heritage. Houses historical newspapers of the Regency, Didot-Bottin administrative directories, biographical dictionaries of scholars and notable families (Tarājim), and Zitouna University archives.",
      tags: ["Arabic Manuscripts", "Tarājim (Biographies)", "Historical Press", "Zitouna"],
    },
    "commune-tunis": {
      title: "Municipal Archives of the City of Tunis (Civil Status)",
      badge: "Municipal Civil Status • Capital",
      description:
        "Registers of births, marriages, and deaths for the Municipality of Tunis since the establishment of modern civil registration (1886), as well as burial permits and cemetery concessions.",
      tags: ["Civil Status (1886-1956)", "Births", "Marriages", "Municipal Cemeteries"],
    },
    "habous-tunisie": {
      title: "Archives of the Habous & Waqf of Tunisia",
      badge: "Pious Endowments • Tunis",
      description:
        "Holdings of the Djemaa el-Habous. Family waqf endowment deeds (habous ahlī) record the exhaustive family tree of founders, ancestors, and all beneficiaries across several centuries.",
      tags: ["Family Habous", "Waqf Ahlī", "Authentic Genealogies", "Inheritances"],
    },
    "cadn-nantes": {
      title: "Center for Diplomatic Archives in Nantes (CADN)",
      badge: "Diplomatic & Consular Archives • Nantes",
      description:
        "Foundational archive of the Protectorate (1881–1956). Preserves the consular civil status of Europeans in Tunisia, Beylical and French naturalization decrees (1924–1927), electoral rolls, and guardianship and estate records.",
      tags: ["Consular Civil Status", "Naturalizations 1924-1927", "Estates", "Electoral Lists"],
    },
    "anom-aix": {
      title: "French National Overseas Archives (ANOM)",
      badge: "Overseas & Protectorate Holdings • Aix-en-Provence",
      description:
        "Military service registers of conscripts and volunteers in Tunisia, career files of Protectorate civil servants, agricultural land grants, and North African administrative reports.",
      tags: ["Military Registers", "Protectorate Personnel", "Land Grants", "North Africa"],
    },
    "anf-pierrefitte": {
      title: "National Archives of France (Pierrefitte-sur-Seine)",
      badge: "Central Archives • Pierrefitte / Paris",
      description:
        "Preserves individual naturalization files submitted by residents of Tunisia (French, Italian, Maltese, Jewish, and Muslim Tunisians), complete with family trees and administrative inquiries.",
      tags: ["Naturalization Decrees", "Ministry of Justice", "Individual Files"],
    },
    "shd-vincennes": {
      title: "Defense Historical Service (SHD)",
      badge: "Military Archives • Château de Vincennes & Caen",
      description:
        "Individual career files, service records, citations, and pensions of Tunisian soldiers who served in the 4th Regiment of Tunisian Tirailleurs and 1st Spahis during both World Wars.",
      tags: ["4th Tunisian Tirailleurs", "1st Spahis", "WWI 1914-1918", "WWII 1939-1945"],
    },
    "gallica-bnf": {
      title: "Gallica — National Library of France (BnF)",
      badge: "Digital Library • BnF Paris",
      description:
        "Full digitized access to the Tunisian Official Gazette (1883–1956), North African Didot-Bottin directories, and historical newspapers (La Dépêche Tunisienne, Le Petit Tunisien) for addresses, professions, and obituaries.",
      tags: ["Tunisian Official Gazette", "Commercial Directories", "Daily Press"],
    },
    "memoire-des-hommes": {
      title: "Mémoire des Hommes (Ministry of the Armed Forces)",
      badge: "Nominal Combatant Database",
      description:
        "Official database for nominal searches of Tunisian tirailleurs, spahis, and military personnel who fell during World War I, World War II, and the Indochina War.",
      tags: ["Fallen Soldiers", "Tunisian Tirailleurs", "Military Graves"],
    },
    "antenati-italie": {
      title: "Portale Antenati (Italian State Archives)",
      badge: "National Civil Status Portal • Ministry of Culture",
      description:
        "Official Italian genealogy portal providing free access to millions of digitized civil registration deeds (Palermo, Trapani, Messina, Pantelleria) of Sicilian and Italian families settled in Tunis, La Goulette, Bizerte, and Sousse.",
      tags: ["Italian Civil Status", "Sicily", "Pantelleria", "La Goulette Families"],
    },
    "asdmae-rome": {
      title: "Historical Diplomatic Archives (MAECI - Rome)",
      badge: "Foreign Affairs • Rome",
      description:
        "Archives of the Italian Ministry of Foreign Affairs preserving consular registration rolls, passport applications, and civil status deeds of Italian citizens in the Regency of Tunis.",
      tags: ["Italian Consulate Tunis", "La Goulette", "Consular Registrations", "Passports"],
    },
    "archivio-palermo": {
      title: "State Archives of Palermo (Sicily)",
      badge: "Provincial Archives • Palermo, Sicily",
      description:
        "Port embarkation lists to La Goulette and Tunis, passport records for North Africa, and military conscription lists (Liste di leva) of Sicilian families who emigrated to Tunisia between 1860 and 1940.",
      tags: ["Sicilian Emigration", "Embarkation Lists", "Military Leva", "Palermo"],
    },
    "archivio-trapani": {
      title: "State Archives of Trapani (Sicily)",
      badge: "Maritime & Notarial Archives • Trapani",
      description:
        "Archival holdings of coral fishermen, sailors, and merchants from Trapani and Pantelleria who founded the historic Italian communities of La Goulette, Tabarka, and Cap Bon.",
      tags: ["Trapani", "Pantelleria", "Coral Fishermen", "Tabarka"],
    },
    "national-archives-malta": {
      title: "National Archives of Malta (Arkivji Nazzjonali ta' Malta)",
      badge: "National Archives • Rabat & Mdina",
      description:
        "Official registers of passport applications for Tunis, judicial depositions, and British subject certificates issued to Maltese citizens living in Tunis, Sousse, Mahdia, and Djerba from 1840 to 1940.",
      tags: ["Passports for Tunis (1840-1940)", "British Subjects", "Maltese Emigration"],
    },
    "malta-family-history": {
      title: "Geneanum — Maltese Archives & Genealogy (Adami Collection)",
      badge: "Parish Registers • Malta & Tunisia",
      description:
        "Adami Collection and digitized parish registers: baptism, marriage, and burial records of Maltese families recorded in Catholic parishes of Malta and Tunisia (Holy Cross of Tunis, St. Felix of Sousse).",
      tags: ["Parish Records", "Baptisms & Marriages", "Holy Cross of Tunis"],
    },
    "tna-kew-uk": {
      title: "The National Archives (TNA - Kew, United Kingdom)",
      badge: "Government Archives • Kew, London",
      description:
        "Foreign Office diplomatic series (FO 102, FO 335, FO 84) relating to Her Majesty's Consulate General in Tunis, including registration of British subjects, Maltese merchants, and protected residents.",
      tags: ["Foreign Office FO 102 / FO 335", "Consulate General Tunis", "British Protected Persons"],
    },
    "cwgc-tunisie": {
      title: "Commonwealth War Graves Commission (CWGC)",
      badge: "Allied Military Graves",
      description:
        "Commemorative registers and grave locations of British, Canadian, Australian, New Zealand, and Allied soldiers who fell during the Tunisia Campaign (1942–1943) at Medjez-el-Bab and Enfidaville.",
      tags: ["Tunisia Campaign 1943", "Medjez-el-Bab", "Enfidaville", "Military Cemeteries"],
    },
    "cgj-paris": {
      title: "Circle of Jewish Genealogy (CGJ - Paris)",
      badge: "North African Jewish Genealogy • Paris",
      description:
        "Leading association for Tunisian Jewish genealogy. Complete indexes of Jewish civil registration, burial records from Borgel and Bab El Khadra cemeteries in Tunis, and rabbinical marriage contracts (Ketubot).",
      tags: ["Jewish Civil Status", "Borgel Cemetery", "Ketubot", "Granas & Twansa"],
    },
    "cahjp-jerusalem": {
      title: "Central Archives for the History of the Jewish People (CAHJP)",
      badge: "Community Historical Archives • Jerusalem",
      description:
        "Largest historical archive of Tunisian Jewry. Preserves records of the Rabbinical Courts of Tunis, Mohel circumcision registers (1845–1950), and community archives of both Granas (Livornese) and Twansa.",
      tags: ["Rabbinical Court Tunis", "Mohel Books (1845-1950)", "Granas (Livornese)", "Twansa"],
    },
    "aiu-paris": {
      title: "Alliance Israélite Universelle (AIU - Paris)",
      badge: "School & Community Archives • Paris",
      description:
        "Nominal student enrollment registers of AIU schools founded in Tunis (from 1878), Sousse, Sfax, Nabeul, Bizerte, and Djerba, including full parentage, parents' occupations, and birth dates.",
      tags: ["AIU Schools Tunis", "School Registers", "Djerba", "Sousse", "Sfax"],
    },
    "shjt-paris": {
      title: "Society for the History of the Jews of Tunisia (SHJT)",
      badge: "Learned Society & Research • Paris",
      description:
        "Monographic studies, genealogical indexes, and documentary holdings on Tunisian Jewish surnames (Iberian, Tuscan, or indigenous origins) and their Mediterranean migration paths.",
      tags: ["Tunisian Jewish Surnames", "Community History", "Family Monographs"],
    },
    "osmanli-arsivi-istanbul": {
      title: "Ottoman State Archives (Devlet Arşivleri — Istanbul)",
      badge: "Imperial Ottoman Archives • Istanbul",
      description:
        "Imperial Ottoman holdings (Mühimme Defterleri) preserving Sultanic firmans regarding the Regency of Tunis, appointments of Pashas and Deys, and chancellery correspondence between Istanbul and Bardo.",
      tags: ["Imperial Firmans", "Pashalik of Tunis", "Divan-ı Hümayun", "Husseinite Dynasty"],
    },
    "ircica-istanbul": {
      title: "IRCICA — Research Centre for Islamic History and Art",
      badge: "Islamic Documentation • Istanbul",
      description:
        "OIC institution preserving Beylical-era photographic collections on Tunis, catalogs of Islamic manuscripts, waqf charters, and studies on guilds and Arab-Muslim notarial systems.",
      tags: ["Beylical Photo Archive", "Islamic Manuscripts", "Guilds & Notaries"],
    },
    "zitouna-manuscrits": {
      title: "Zitouna Mosque Manuscript Holdings (BNT Department)",
      badge: "Great Mosque of Zitouna • Tunis",
      description:
        "Registers of professors and students of Zitouna University, religious teaching licenses (ijāzāt), biographies of scholars (tarājim), Chorfas, and Maliki and Hanafi qadis of Tunisia.",
      tags: ["Ijaza Diplomas", "Hanafi & Maliki Qadis", "Chorfas", "Zitouna Scholars"],
    },
    "cna-alger": {
      title: "National Archives Center of Algeria (CNA)",
      badge: "National Archives • Algiers",
      description:
        "Documentary holdings on the Tunisian-Algerian border regions (Khmir, Mogod, Medjerda, Nemencha), border treaties, and historical movements of nomadic tribes between Tunisia and Algeria.",
      tags: ["Border Tribes", "Khmir & Nemencha", "Constantine Region", "Tunisian-Algerian Border"],
    },
    "archives-maroc-rabat": {
      title: "Archives of Morocco (Rabat)",
      badge: "National Archives • Rabat",
      description:
        "Archival records relating to Andalusian families who passed through Fez and Tetouan before settling in Testour, Soliman, and Tunis, as well as registers of shared Sufi brotherhoods (Tijaniyya, Shadhiliyya).",
      tags: ["Andalusian Families", "Testour & Soliman", "Sufi Brotherhoods", "Sharifian Lineages"],
    },
    "anom-irel-maghreb": {
      title: "ANOM — IREL Database of North African Registers",
      badge: "IREL Nominal Database • Online",
      description:
        "Online nominal search in civil status and parish registers of border localities (Annaba/Bône, Constantine, Souk Ahras, Tebessa) where many families of Tunisian origin or alliance resided.",
      tags: ["IREL Database", "Constantine", "Bône / Annaba", "Border Exchanges"],
    },
  },
  ar: {
    "ant-tunisie": {
      title: "الأرشيف الوطني التونسي (ANT)",
      badge: "أرشيف الدولة • تونس العاصمة",
      description:
        "المستودع المركزي للتاريخ التونسي. يحفظ الدفاتر الجبائية لإحصاء المجبة الاسمي (1860–1869)، والأوامر العليّة الحسينية، وأحكام محاكم الوزارة، وحجج العدول والعقود الشرعية.",
      tags: ["دفاتر المجبة 1860-1869", "الأوامر البايليكية", "عقود العدول", "محاكم الوزارة"],
    },
    "bnt-tunisie": {
      title: "دار الكتب الوطنية التونسية (BNT)",
      badge: "التراث المكتوب والمخطوطات • تونس",
      description:
        "حفظ التراث المطبوع والمخطوط، بما في ذلك الدوريات والصحف التاريخية للإيالة، والأدلة الإدارية، وكتب التراجم والطبقات لعلماء تونس والبيوتات الكبرى، وأرشيف جامع الزيتونة.",
      tags: ["المخطوطات العربية", "كتب التراجم والطبقات", "الصحافة التاريخية", "جامع الزيتونة"],
    },
    "commune-tunis": {
      title: "الأرشيف البلدي لمدينة تونس (الحالة المدنية)",
      badge: "الحالة المدنية البلدية • العاصمة",
      description:
        "سجلات عقود الولادات والزواج والوفيات ببلدية تونس منذ تأسيس الحالة المدنية العصرية سنة 1886، بالإضافة إلى دفاتر المقابر البلدية ورخص الدفن.",
      tags: ["الحالة المدنية (1886-1956)", "عقود الولادات", "عقود الزواج", "المقابر البلدية"],
    },
    "habous-tunisie": {
      title: "أرشيف الأحباس والأوقاف بالبلاد التونسية",
      badge: "المؤسسات الوقفية • تونس",
      description:
        "رصيد جمعية الأوقاف: تتضمن حجج الأحباس الأهلية والخاصة شجرات النسب المفصلة للمحبسين وأصولهم وكافة المستحقين والأعقاب عبر عدة قرون.",
      tags: ["الأحباس الأهلية", "الوقف العائلي", "شجرات الأنساب الموثقة", "الفرائض والمواريث"],
    },
    "cadn-nantes": {
      title: "مركز الأرشيف الدبلوماسي بنانت (CADN)",
      badge: "الأرشيف الدبلوماسي والقنصلي • نانت",
      description:
        "الرصيد الأساسي لفترة الحماية (1881–1956): يحفظ سجلات الحالة المدنية القنصلية للأوروبيين بتونس، ومراسيم التجنيس (1924–1927)، والقوائم الانتخابية، وملفات التركات.",
      tags: ["الحالة المدنية القنصلية", "مراسيم التجنيس 1924-1927", "التركات", "القوائم الانتخابية"],
    },
    "anom-aix": {
      title: "الأرشيف الوطني لما وراء البحار (ANOM)",
      badge: "أرصدة ما وراء البحار والحماية • أكس أون بروفانس",
      description:
        "دفاتر الخدمة العسكرية للمجندين في تونس، والملفات الإدارية للموظفين، وملفات الأراضي الفلاحية، والتقارير التاريخية بشمال إفريقيا.",
      tags: ["السجلات العسكرية", "موظفو الحماية", "الأراضي الفلاحية", "شمال إفريقيا"],
    },
    "anf-pierrefitte": {
      title: "الأرشيف الوطني الفرنسي (بييرفيت سور سين)",
      badge: "الأرشيف المركزي • باريس",
      description:
        "يحفظ الملفات الفردية لطلبات التجنيس المقدمة من المقيمين في تونس (التونسيين، الإيطاليين، المالطيين، والفرنسيين) مع شجرات النسب والتحقيقات الإدارية.",
      tags: ["ملفات التجنيس", "وزارة العدل", "الملفات الفردية"],
    },
    "shd-vincennes": {
      title: "المصلحة التاريخية للدفاع (SHD)",
      badge: "الأرشيف العسكري • فينسين وكان",
      description:
        "الملفات الفردية وبيانات الخدمات والأوسمة وجرايات التقاعد للجنود التونسيين (الفوج الرابع للمناوشين التونسيين وفوج الصبايحية الأول) خلال الحربين العالميتين.",
      tags: ["الفوج 4 للمناوشين التونسيين", "فوج الصبايحية", "الحرب العالمية الأولى", "الحرب العالمية الثانية"],
    },
    "gallica-bnf": {
      title: "غاليكا — المكتبة الوطنية الفرنسية (BnF)",
      badge: "المكتبة الرقمية • باريس",
      description:
        "ولوج رقمي كامل للرائد الرسمي التونسي (1883–1956)، والأدلة التجارية لشمال إفريقيا، والصحافة التاريخية اليومية للبحث عن العناوين والمهن والإعلانات العائلية.",
      tags: ["الرائد الرسمي التونسي", "الأدلة التجارية", "الصحافة اليومية"],
    },
    "memoire-des-hommes": {
      title: "ذاكرة الرجال (قاعدة البيانات العسكرية)",
      badge: "قاعدة بيانات اسمية للمحاربين",
      description:
        "قاعدة بيانات رسمية للبحث الاسمي عن الجنود والمناوشين والصبايحية أصيلي البلاد التونسية الذين سقطوا خلال الحربين العالميتين.",
      tags: ["البحث الاسمي العسكري", "المناوشون التونسيون", "المقابر العسكرية"],
    },
    "antenati-italie": {
      title: "بوابة الأجداد (أرشيف الدولة الإيطالي - Antenati)",
      badge: "البوابة الوطنية للحالة المدنية • وزارة الثقافة الإيطالية",
      description:
        "البوابة الرسمية للجينالوجيا الإيطالية التي تتيح ملايين عقود الحالة المدنية المرقمنة (باليرمو، تراباني، مسينا، بانتيليريا) للعائلات الإيطالية والصقلية المستقرة بتونس وحلق الوادي وبنزرت وسوسة.",
      tags: ["الحالة المدنية الإيطالية", "صقلية", "بانتيليريا", "عائلات حلق الوادي"],
    },
    "asdmae-rome": {
      title: "الأرشيف التاريخي الدبلوماسي الإيطالي (روما)",
      badge: "الشؤون الخارجية • روما",
      description:
        "أرشيف وزارة الخارجية الإيطالية: يحفظ سجلات التسجيل القنصلي وطلبات جوازات السفر وعقود الحالة المدنية للجالية الإيطالية في إيالة تونس.",
      tags: ["القنصلية الإيطالية بتونس", "حلق الوادي", "التسجيلات القنصلية", "جوازات السفر"],
    },
    "archivio-palermo": {
      title: "أرشيف الدولة في باليرمو (صقلية)",
      badge: "الأرشيف الإقليمي • باليرمو، صقلية",
      description:
        "سجلات الإبحار نحو حلق الوادي وتونس، وتراخيص السفر لشمال إفريقيا، وقوائم التجنيد للعائلات الصقلية التي هاجرت إلى تونس بين 1860 و1940.",
      tags: ["الهجرة الصقلية", "قوائم المسافرين", "سجلات باليرمو", "صقلية"],
    },
    "archivio-trapani": {
      title: "أرشيف الدولة في تراباني (صقلية)",
      badge: "الأرشيف البحري والعدلي • تراباني",
      description:
        "أرصدة أرشيفية لصيادي المرجان والبحارة والتجار من تراباني وجزيرة بانتيليريا الذين أسسوا الجاليات التاريخية في حلق الوادي وطبرقة والوطن القبلي.",
      tags: ["تراباني", "بانتيليريا", "صيادو المرجان", "طبرقة"],
    },
    "national-archives-malta": {
      title: "الأرشيف الوطني المالطي (الرباط ومدينا)",
      badge: "الأرشيف الوطني • مالطا",
      description:
        "السجلات الرسمية لطلبات جوازات السفر نحو تونس، والشهادات القنصلية البريطانية المسلمة للمواطنين المالطيين المقيمين في تونس وسوسة والمهدية وجربة من 1840 إلى 1940.",
      tags: ["جوازات السفر لتونس (1840-1940)", "الرعايا البريطانيون", "الهجرة المالطية"],
    },
    "malta-family-history": {
      title: "جينيانوم — الأرشيف والجينالوجيا المالطية (مجموعة أدامي)",
      badge: "السجلات الكنسية • مالطا وتونس",
      description:
        "مجموعة أدامي والسجلات الكنسية المرقمنة: عقود التعميد والزواج والوفاة للعائلات المالطية المسجلة في كنائس مالطا وتونس (كنيسة الصليب المقدس بتونس وسان فيليكس بسوسة).",
      tags: ["السجلات الكنسية", "عقود الزواج والتعميد", "كنيسة الصليب المقدس بتونس"],
    },
    "tna-kew-uk": {
      title: "الأرشيف الوطني البريطاني (كيو - لندن)",
      badge: "الأرشيف الحكومي • لندن",
      description:
        "السلاسل الدبلوماسية لوزارة الخارجية البريطانية (FO 102, FO 335) الخاصة بالقنصلية العامة بتونس، بما في ذلك تسجيل الرعايا البريطانيين والتجار المالطيين.",
      tags: ["وزارة الخارجية FO 102 / FO 335", "القنصلية العامة بتونس", "الرعايا المحميون"],
    },
    "cwgc-tunisie": {
      title: "هيئة الكومنولث لمقابر الحرب (CWGC)",
      badge: "المقابر العسكرية للحلفاء",
      description:
        "السجلات التذكارية ومواقع قبور جنود الحلفاء الذين سقطوا خلال حملة تونس (1942–1943) في المقابر العسكرية بمجاز الباب والنفيضة.",
      tags: ["حملة تونس 1943", "مجاز الباب", "النفيضة", "المقابر العسكرية"],
    },
    "cgj-paris": {
      title: "حلقة الجينالوجيا اليهودية (CGJ - باريس)",
      badge: "جينالوجيا يهود شمال إفريقيا • باريس",
      description:
        "جمعية مرجعية لجينالوجيا يهود تونس: فهارس الحالة المدنية، وجرد قبور مقبرة بورجل وباب الخضراء بتونس، وعقود الزواج الربانية (الكتوبة).",
      tags: ["الحالة المدنية الإسرائيلية", "مقبرة بورجل", "عقود الكتوبة", "القرانة والتوانسة"],
    },
    "cahjp-jerusalem": {
      title: "الأرشيف المركزي لتاريخ الشعب اليهودي (CAHJP)",
      badge: "الأرشيف التاريخي المجتمعي • القدس",
      description:
        "أكبر مركز أرشيفي لتاريخ يهود تونس: يحفظ سجلات المحاكم الربانية بتونس، ودفاتر الموهيل (1845–1950)، ووثائق طائفتي القرانة (الليفورنيين) والتوانسة.",
      tags: ["المحكمة الربانية بتونس", "دفاتر الموهيل (1845-1950)", "القرانة", "التوانسة"],
    },
    "aiu-paris": {
      title: "الاتحاد الإسرائيلي العالمي (مدارس الأليانس - AIU)",
      badge: "الأرشيف المدرسي والمجتمعي • باريس",
      description:
        "سجلات الترسيم المدرسي الاسمية لمدارس الأليانس المؤسسة في تونس (منذ 1878) وسوسة وصفاقس ونابل وبنزرت وجربة مع النسب الكامل ومهن الأولياء.",
      tags: ["مدارس الأليانس بتونس", "السجلات المدرسية", "جربة", "سوسة", "صفاقس"],
    },
    "shjt-paris": {
      title: "جمعية تاريخ يهود تونس (SHJT)",
      badge: "جمعية علمية وبحثية • باريس",
      description:
        "دراسات تاريخية وفهارس عائلية وأرصدة وثائقية حول تاريخ الألقاب العائلية ليهود تونس وأصولهم الأندلسية والتوسكانية والتونسية.",
      tags: ["الألقاب العائلية", "التاريخ المجتمعي", "دراسات العائلات"],
    },
    "osmanli-arsivi-istanbul": {
      title: "أرشيف الدولة العثماني (إسطنبول)",
      badge: "الأرشيف السلطاني العثماني • إسطنبول",
      description:
        "دفاتر المهمة السلطانية العثمانية: تحفظ الفرمانات العليّة المتعلقة بإيالة تونس، وتعيينات الباشوات والدايات والبايات الحسينيين، والمراسلات بين الباب العالي وباردو.",
      tags: ["الفرمانات السلطانية", "باشوية تونس", "الديوان الهمايوني", "الدولة الحسينية"],
    },
    "ircica-istanbul": {
      title: "مركز الأبحاث للتاريخ والفنون والثقافة الإسلامية (إرسيكا)",
      badge: "التوثيق الإسلامي • إسطنبول",
      description:
        "مؤسسة تابعة لمنظمة التعاون الإسلامي تحفظ مجموعات صور فوتوغرافية نادرة للعهد الحسيني بتونس، وفهارس المخطوطات الإسلامية، وحجج الأوقاف والحرف.",
      tags: ["الصور التاريخية البايليكية", "المخطوطات الإسلامية", "الحرف والعدول"],
    },
    "zitouna-manuscrits": {
      title: "رصيد مخطوطات وسجلات جامع الزيتونة المعمور (BNT)",
      badge: "جامع الزيتونة المعمور • تونس",
      description:
        "سجلات المشايخ والطلبة بالجامعة الزيتونية، والإجازات العلمية، وتراجم العلماء والأشراف والقضاة الحنفية والمالكية بالبلاد التونسية.",
      tags: ["الإجازات العلمية", "القضاة الحنفية والمالكية", "الأشراف", "أعلام الزيتونة"],
    },
    "cna-alger": {
      title: "المركز الوطني للأرشيف بالجزائر (CNA)",
      badge: "الأرشيف الوطني • الجزائر",
      description:
        "أرصدة وثائقية حول المناطق الحدودية التونسية الجزائرية (خمير، مقعد، مجردة، النمامشة)، ومعاهدات ترسيم الحدود وتنقلات القبائل.",
      tags: ["القبائل الحدودية", "خمير والنمامشة", "إقليم قسنطينة", "الحدود التونسية الجزائرية"],
    },
    "archives-maroc-rabat": {
      title: "أرشيف المغرب (الرباط)",
      badge: "الأرشيف الوطني • الرباط",
      description:
        "وثائق أرشيفية تتعلق بالعائلات الأندلسية التي مرت بفاس وتطوان قبل الاستقرار في تستور وسليمان وتونس، وسجلات الزوايا والطرق الصوفية المشتركة.",
      tags: ["العائلات الأندلسية", "تستور وسليمان", "الطرق الصوفية", "الأدارسة والأشراف"],
    },
    "anom-irel-maghreb": {
      title: "قاعدة بيانات IREL لسجلات شمال إفريقيا (الجزائر / تونس)",
      badge: "قاعدة بيانات اسمية • على الخط",
      description:
        "بحث اسمي مباشر في سجلات الحالة المدنية للمدن الحدودية (عنابة، قسنطينة، سوق أهراس، تبسة) حيث أقامت العديد من العائلات ذات الأصول أو المصاهرات التونسية.",
      tags: ["قاعدة IREL", "قسنطينة", "عنابة", "المصاهرات الحدودية"],
    },
  },
  es: {
    "ant-tunisie": {
      title: "Archivos Nacionales de Túnez (ANT)",
      badge: "Archivos de Estado • Túnez",
      description:
        "Depósito central de la historia tunecina. Conserva los registros fiscales nominales de la Majba (1860–1869), los decretos beylicales husseinitas, las sentencias de los tribunales de la Ouzara y las actas notariales ('udul).",
      tags: ["Majba 1860-1869", "Decretos Beylicales", "Notarías 'Udul", "Tribunales Ouzara"],
    },
    "bnt-tunisie": {
      title: "Biblioteca Nacional de Túnez (BNT)",
      badge: "Patrimonio Escrito y Manuscritos • Túnez",
      description:
        "Conservación del patrimonio impreso y manuscrito: periódicos históricos de la Regencia, anuarios Didot-Bottin, diccionarios biográficos de eruditos y grandes familias (Tarājim) y archivos de la Universidad Zitouna.",
      tags: ["Manuscritos Árabes", "Tarājim (Biografías)", "Prensa Histórica", "Zitouna"],
    },
    "commune-tunis": {
      title: "Archivos Municipales de la Ciudad de Túnez (Estado Civil)",
      badge: "Estado Civil Municipal • Capital",
      description:
        "Registros de actas de nacimiento, matrimonio y defunción del municipio de Túnez desde la instauración del registro civil moderno (1886), así como concesiones de cementerios de la capital.",
      tags: ["Estado Civil (1886-1956)", "Nacimientos", "Matrimonios", "Cementerios Municipales"],
    },
    "habous-tunisie": {
      title: "Archivos de los Habous y Waqf de Túnez",
      badge: "Fundaciones Pías • Túnez",
      description:
        "Fondos de la Djemaa el-Habous. Las escrituras de waqf familiar (habous ahlī) mencionan el árbol genealógico exhaustivo de los fundadores, ascendientes y descendientes durante varios siglos.",
      tags: ["Habous Familiar", "Waqf Ahlī", "Genealogías Auténticas", "Sucesiones"],
    },
    "cadn-nantes": {
      title: "Centro de Archivos Diplomáticos de Nantes (CADN)",
      badge: "Archivos Diplomáticos y Consulares • Nantes",
      description:
        "El fondo fundamental del Protectorado (1881–1956): conserva el estado civil consular de los europeos de Túnez, los decretos de naturalización (1924–1927), las listas electorales y las sucesiones.",
      tags: ["Estado Civil Consular", "Naturalizaciones 1924-1927", "Sucesiones", "Listas Electorales"],
    },
    "anom-aix": {
      title: "Archivos Nacionales de Ultramar (ANOM)",
      badge: "Fondos Coloniales y Protectorado • Aix-en-Provence",
      description:
        "Registros militares de reclutas en Túnez, expedientes de carrera de funcionarios del Protectorado, concesiones agrícolas e informes del Norte de África.",
      tags: ["Registros Militares", "Personal Protectorado", "Concesiones", "Norte de África"],
    },
    "anf-pierrefitte": {
      title: "Archivos Nacionales de Francia (Pierrefitte-sur-Seine)",
      badge: "Archivos Centrales • París",
      description:
        "Expedientes individuales de solicitudes de naturalización presentadas por residentes de Túnez (franceses, italianos, malteses, judíos y musulmanes tunecinos) con árboles genealógicos.",
      tags: ["Decretos de Naturalización", "Ministerio de Justicia", "Expedientes Individuales"],
    },
    "shd-vincennes": {
      title: "Servicio Histórico de la Defensa (SHD)",
      badge: "Archivos Militares • Vincennes y Caen",
      description:
        "Expedientes individuales de carrera, hojas de servicio y pensiones de soldados tunecinos que sirvieron en el 4.º Regimiento de Tiradores Tunecinos y 1.º de Spahis en las dos guerras mundiales.",
      tags: ["4.º Tiradores Tunecinos", "1.º Spahis", "Guerra 1914-1918", "Guerra 1939-1945"],
    },
    "gallica-bnf": {
      title: "Gallica — Biblioteca Nacional de Francia (BnF)",
      badge: "Biblioteca Digital • BnF París",
      description:
        "Acceso digitalizado al Diario Oficial Tunecino (1883–1956), anuarios Didot-Bottin del Norte de África y prensa histórica de época para hallar direcciones, profesiones y esquelas.",
      tags: ["Diario Oficial Tunecino", "Anuarios Comerciales", "Prensa Diaria"],
    },
    "memoire-des-hommes": {
      title: "Mémoire des Hommes (Ministerio de las Fuerzas Armadas)",
      badge: "Base Nominativa de Combatientes",
      description:
        "Base de datos oficial para la búsqueda nominativa de tiradores, spahis y militares originarios de Túnez caídos durante la Primera y Segunda Guerra Mundial.",
      tags: ["Caídos en Guerra", "Tiradores Tunecinos", "Sepulturas Militares"],
    },
    "antenati-italie": {
      title: "Portale Antenati (Archivos de Estado de Italia)",
      badge: "Portal Nacional de Estado Civil • Ministerio de Cultura",
      description:
        "Portal oficial de genealogía italiana con acceso gratuito a millones de actas de estado civil digitalizadas (Palermo, Trapani, Mesina, Pantelaria) de las familias italianas establecidas en Túnez, La Goleta, Bizerta y Susa.",
      tags: ["Estado Civil Italiano", "Sicilia", "Pantelaria", "Familias de La Goleta"],
    },
    "asdmae-rome": {
      title: "Archivo Histórico Diplomático (MAECI - Roma)",
      badge: "Asuntos Exteriores • Roma",
      description:
        "Archivos del Ministerio de Asuntos Exteriores italiano: conserva registros de matrícula consular, pasaportes y actas de estado civil de súbditos italianos en la Regencia de Túnez.",
      tags: ["Consulado Italiano Túnez", "La Goleta", "Matrículas Consulares", "Pasaportes"],
    },
    "archivio-palermo": {
      title: "Archivo de Estado de Palermo (Sicilia)",
      badge: "Archivos Provinciales • Palermo, Sicilia",
      description:
        "Registros de embarque portuario hacia La Goleta y Túnez, pasaportes y listas de reclutamiento militar (Liste di leva) de las familias sicilianas emigradas a Túnez entre 1860 y 1940.",
      tags: ["Emigración Siciliana", "Listas de Embarque", "Reclutamiento Leva", "Palermo"],
    },
    "archivio-trapani": {
      title: "Archivo de Estado de Trapani (Sicilia)",
      badge: "Archivos Marítimos y Notariales • Trapani",
      description:
        "Fondos de pescadores de coral, marinos y comerciantes de Trapani y Pantelaria que fundaron las comunidades italianas históricas de La Goleta, Tabarka y Cabo Bon.",
      tags: ["Trapani", "Pantelaria", "Pescadores de Coral", "Tabarka"],
    },
    "national-archives-malta": {
      title: "Archivos Nacionales de Malta (Arkivji Nazzjonali ta' Malta)",
      badge: "Archivos Nacionales • Rabat y Mdina",
      description:
        "Registros oficiales de solicitudes de pasaportes para Túnez, declaraciones judiciales y certificados de súbditos británicos expedidos a malteses en Túnez, Susa, Mahdia y Djerba de 1840 a 1940.",
      tags: ["Pasaportes para Túnez (1840-1940)", "Súbditos Británicos", "Emigración Maltesa"],
    },
    "malta-family-history": {
      title: "Geneanum — Archivos y Genealogía Maltesa (Colección Adami)",
      badge: "Registros Parroquiales • Malta y Túnez",
      description:
        "Colección Adami y registros parroquiales digitalizados: partidas de bautismo, matrimonio y defunción de familias maltesas en las parroquias católicas de Malta y Túnez (Santa Cruz de Túnez, San Félix de Susa).",
      tags: ["Actas Parroquiales", "Bautismos y Matrimonios", "Santa Cruz de Túnez"],
    },
    "tna-kew-uk": {
      title: "The National Archives (TNA - Kew, Reino Unido)",
      badge: "Archivos Gubernamentales • Kew, Londres",
      description:
        "Series diplomáticas del Foreign Office (FO 102, FO 335, FO 84) relativas al Consulado General británico en Túnez, incluyendo el registro de súbditos británicos y comerciantes malteses.",
      tags: ["Foreign Office FO 102 / FO 335", "Consulado General Túnez", "Protegidos Británicos"],
    },
    "cwgc-tunisie": {
      title: "Commonwealth War Graves Commission (CWGC)",
      badge: "Sepulturas Militares Aliadas",
      description:
        "Registros conmemorativos y localización de sepulturas de soldados aliados caídos durante la Campaña de Túnez (1942–1943) en los cementerios de Medjez-el-Bab y Enfidaville.",
      tags: ["Campaña de Túnez 1943", "Medjez-el-Bab", "Enfidaville", "Cementerios Militares"],
    },
    "cgj-paris": {
      title: "Círculo de Genealogía Judía (CGJ - París)",
      badge: "Genealogía Judía Norteafricana • París",
      description:
        "Asociación de referencia para la genealogía judía de Túnez: vaciados de estado civil israelita, sepulturas de los cementerios del Borgel y Bab El Khadra y contratos matrimoniales rabínicos (ketubot).",
      tags: ["Estado Civil Israelita", "Cementerio del Borgel", "Ketubot", "Granas y Twansa"],
    },
    "cahjp-jerusalem": {
      title: "Archivos Centrales para la Historia del Pueblo Judío (CAHJP)",
      badge: "Archivos Históricos Comunitarios • Jerusalén",
      description:
        "Mayor centro de archivos históricos del judaísmo tunecino: conserva registros de los tribunales rabínicos de Túnez, libros de Mohel (1845–1950) y archivos de las comunidades Granas y Twansa.",
      tags: ["Tribunal Rabínico Túnez", "Libros de Mohel (1845-1950)", "Granas (Livorneses)", "Twansa"],
    },
    "aiu-paris": {
      title: "Alianza Israelita Universal (AIU - París)",
      badge: "Archivos Escolares y Comunitarios • París",
      description:
        "Registros nominales de matrícula escolar de las escuelas de la AIU fundadas en Túnez (desde 1878), Susa, Sfax, Nabeul, Bizerta y Djerba, con filiación completa y profesión de los padres.",
      tags: ["Escuelas AIU Túnez", "Registros Escolares", "Djerba", "Susa", "Sfax"],
    },
    "shjt-paris": {
      title: "Sociedad de Historia de los Judíos de Túnez (SHJT)",
      badge: "Sociedad Científica e Investigación • París",
      description:
        "Estudios monográficos y fondos documentales sobre la historia de los apellidos judíos tunecinos (orígenes ibéricos, toscanos o autóctonos) y sus trayectorias en el Mediterráneo.",
      tags: ["Apellidos Judíos Tunecinos", "Historia Comunitaria", "Monografías Familiares"],
    },
    "osmanli-arsivi-istanbul": {
      title: "Archivos Estatales Otomanos (Devlet Arşivleri — Estambul)",
      badge: "Archivos Imperiales Otomanos • Estambul",
      description:
        "Fondo imperial otomano (Mühimme Defterleri): conserva los firmanes sultánicos sobre la Regencia de Túnez, nombramientos de Bajás y Deys y correspondencia entre Estambul y el Bardo.",
      tags: ["Firmanes Imperiales", "Bajalato de Túnez", "Divan-ı Hümayun", "Dinastía Husseinita"],
    },
    "ircica-istanbul": {
      title: "IRCICA — Centro de Investigación de Historia y Arte Islámicos",
      badge: "Documentación Islámica • Estambul",
      description:
        "Institución de la OCI que conserva colecciones fotográficas de época beylical sobre Túnez, catálogos de manuscritos islámicos, cartas waqf y estudios sobre gremios y notarías.",
      tags: ["Fototeca Beylical", "Manuscritos Islámicos", "Gremios y Notarías"],
    },
    "zitouna-manuscrits": {
      title: "Fondo de Manuscritos de la Mezquita Zitouna (BNT)",
      badge: "Gran Mezquita Zitouna • Túnez",
      description:
        "Registros de profesores y estudiantes de la Universidad Zitouna, licencias de enseñanza (ijāzāt), biografías de ulemas (tarājim), chorfas y cadíes malikíes y hanafíes de Túnez.",
      tags: ["Diplomas Ijaza", "Cadíes Hanafíes y Malikíes", "Chorfas", "Ulemas Zitouna"],
    },
    "cna-alger": {
      title: "Centro Nacional de Archivos de Argelia (CNA)",
      badge: "Archivos Nacionales • Argel",
      description:
        "Fondos documentales sobre las regiones fronterizas tunecino-argelinas (Khmir, Mogod, Medjerda, Nemencha), tratados fronterizos y desplazamientos de tribus.",
      tags: ["Tribus Fronterizas", "Khmir y Nemencha", "Constantina", "Frontera Tunecino-Argelina"],
    },
    "archives-maroc-rabat": {
      title: "Archivos de Marruecos (Rabat)",
      badge: "Archivos Nacionales • Rabat",
      description:
        "Documentos de archivo relativos a las familias andalusíes que pasaron por Fez y Tetuán antes de establecerse en Testour, Soliman y Túnez, y registros de cofradías sufíes.",
      tags: ["Familias Andalusíes", "Testour y Soliman", "Cofradías Sufíes", "Jerifes"],
    },
    "anom-irel-maghreb": {
      title: "ANOM — Base IREL de Registros del Norte de África",
      badge: "Base Nominativa IREL • En Línea",
      description:
        "Búsqueda nominativa en línea en registros civiles y parroquiales de localidades limítrofes (Annaba/Bône, Constantina, Souk Ahras, Tébessa) con familias de origen o alianza tunecina.",
      tags: ["Base IREL", "Constantina", "Bône / Annaba", "Frontera e Intercambios"],
    },
  },
  it: {
    "ant-tunisie": {
      title: "Archivi Nazionali di Tunisia (ANT)",
      badge: "Archivi di Stato • Tunisi",
      description:
        "Deposito centrale della storia tunisina. Conserva i registri fiscali nominativi della Majba (1860–1869), i decreti beylicali husseiniti, le sentenze dei tribunali dell'Ouzara e gli atti notarili ('udul).",
      tags: ["Majba 1860-1869", "Decreti Beylicali", "Notai 'Udul", "Tribunali Ouzara"],
    },
    "bnt-tunisie": {
      title: "Biblioteca Nazionale di Tunisia (BNT)",
      badge: "Patrimonio Scritto e Manoscritti • Tunisi",
      description:
        "Conservazione del patrimonio a stampa e manoscritto: giornali storici della Reggenza, annuari Didot-Bottin, dizionari biografici di eruditi e grandi famiglie (Tarājim) e archivi dell'Università Zitouna.",
      tags: ["Manoscritti Arabi", "Tarājim (Biografie)", "Stampa Storica", "Zitouna"],
    },
    "commune-tunis": {
      title: "Archivi Municipali della Città di Tunisi (Stato Civile)",
      badge: "Stato Civile Municipale • Capitale",
      description:
        "Registri degli atti di nascita, matrimonio e morte del comune di Tunisi dall'istituzione dello stato civile moderno (1886), oltre alle concessioni cimiteriali della capitale.",
      tags: ["Stato Civile (1886-1956)", "Nascite", "Matrimoni", "Cimiteri Municipali"],
    },
    "habous-tunisie": {
      title: "Archivi degli Habous e Waqf di Tunisia",
      badge: "Fondazioni Pie • Tunisi",
      description:
        "Fondi della Djemaa el-Habous. Gli atti di costituzione di waqf familiare (habous ahlī) riportano l'albero genealogico completo dei fondatori, ascendenti e discendenti su più secoli.",
      tags: ["Habous Familiare", "Waqf Ahlī", "Genealogie Autentiche", "Successioni"],
    },
    "cadn-nantes": {
      title: "Centro degli Archivi Diplomatici di Nantes (CADN)",
      badge: "Archivi Diplomatici e Consolari • Nantes",
      description:
        "Il fondo fondamentale del Protettorato (1881–1956): conserva lo stato civile consolare degli europei di Tunisia, i decreti di naturalizzazione (1924–1927), le liste elettorali e le successioni.",
      tags: ["Stato Civile Consolare", "Naturalizzazioni 1924-1927", "Successioni", "Liste Elettorali"],
    },
    "anom-aix": {
      title: "Archivi Nazionali d'Oltremare (ANOM)",
      badge: "Fondi Coloniali e Protettorato • Aix-en-Provence",
      description:
        "Registri matricolari militari in Tunisia, fascicoli di carriera dei funzionari del Protettorato, concessioni agricole e rapporti amministrativi sul Nord Africa.",
      tags: ["Registri Matricolari", "Personale Protettorato", "Concessioni", "Nord Africa"],
    },
    "anf-pierrefitte": {
      title: "Archivi Nazionali di Francia (Pierrefitte-sur-Seine)",
      badge: "Archivi Centrali • Parigi",
      description:
        "Fascicoli individuali di domande di naturalizzazione presentate da residenti in Tunisia (francesi, italiani, maltesi, ebrei e musulmani tunisini) con alberi genealogici.",
      tags: ["Decreti di Naturalizzazione", "Ministero della Giustizia", "Fascicoli Individuali"],
    },
    "shd-vincennes": {
      title: "Servizio Storico della Difesa (SHD)",
      badge: "Archivi Militari • Vincennes e Caen",
      description:
        "Fascicoli individuali di carriera, stati di servizio e pensioni dei soldati tunisini che hanno prestato servizio nel 4º Reggimento Tirailleurs Tunisini e nel 1º Spahis nelle due guerre mondiali.",
      tags: ["4º Tirailleurs Tunisini", "1º Spahis", "Guerra 1914-1918", "Guerra 1939-1945"],
    },
    "gallica-bnf": {
      title: "Gallica — Biblioteca Nazionale di Francia (BnF)",
      badge: "Biblioteca Digitale • BnF Parigi",
      description:
        "Accesso integrale digitalizzato al Journal Officiel Tunisien (1883–1956), agli annuari Didot-Bottin del Nord Africa e alla stampa storica d'epoca per ritrovare indirizzi, professioni e necrologi.",
      tags: ["Gazzetta Ufficiale Tunisina", "Annuari Commerciali", "Stampa Quotidiana"],
    },
    "memoire-des-hommes": {
      title: "Mémoire des Hommes (Ministero delle Forze Armate)",
      badge: "Banca Dati Nominativa dei Combattenti",
      description:
        "Banca dati ufficiale per la ricerca nominativa di tirailleurs, spahis e militari originari della Tunisia caduti durante la Prima e la Seconda Guerra Mondiale.",
      tags: ["Caduti in Guerra", "Tirailleurs Tunisini", "Sepolture Militari"],
    },
    "antenati-italie": {
      title: "Portale Antenati (Archivi di Stato d'Italia)",
      badge: "Portale Nazionale di Stato Civile • Ministero della Cultura",
      description:
        "Portale ufficiale della genealogia italiana con accesso gratuito a milioni di atti di stato civile digitalizzati (Palermo, Trapani, Messina, Pantelleria) delle famiglie italiane e siciliane stabilitesi a Tunisi, La Goulette, Biserta e Sousse.",
      tags: ["Stato Civile Italiano", "Sicilia", "Pantelleria", "Famiglie de La Goulette"],
    },
    "asdmae-rome": {
      title: "Archivio Storico Diplomatico (MAECI - Roma)",
      badge: "Affari Esteri • Roma",
      description:
        "Archivi del Ministero degli Affari Esteri italiano: conserva i registri di immatricolazione consolare, le domande di passaporto e gli atti di stato civile dei cittadini italiani nella Reggenza (Consolato Generale di Tunisi, La Goulette, Sfax, Monastir).",
      tags: ["Consolato Italiano Tunisi", "La Goulette", "Immatricolazioni Consolari", "Passaporti"],
    },
    "archivio-palermo": {
      title: "Archivio di Stato di Palermo (Sicilia)",
      badge: "Archivi Provinciali • Palermo, Sicilia",
      description:
        "Registri d'imbarco portuali verso La Goulette e Tunisi, rilascio di passaporti per il Nord Africa e liste di leva delle famiglie siciliane emigrate in Tunisia tra il 1860 e il 1940.",
      tags: ["Emigrazione Siciliana", "Liste d'Imbarco", "Liste di Leva", "Palermo"],
    },
    "archivio-trapani": {
      title: "Archivio di Stato di Trapani (Sicilia)",
      badge: "Archivi Marittimi e Notarili • Trapani",
      description:
        "Fondi archivistici dei pescatori di corallo, marinai e negozianti di Trapani e dell'isola di Pantelleria che fondarono le storiche comunità italiane de La Goulette, Tabarka e Capo Bon.",
      tags: ["Trapani", "Pantelleria", "Pescatori di Corallo", "Tabarka"],
    },
    "national-archives-malta": {
      title: "National Archives of Malta (Archivi Nazionali di Malta)",
      badge: "Archivi Nazionali • Rabat e Mdina",
      description:
        "Registri ufficiali delle domande di passaporto per Tunisi, deposizioni giudiziarie e certificati di sudditanza britannica rilasciati ai cittadini maltesi residenti a Tunisi, Sousse, Mahdia e Djerba dal 1840 al 1940.",
      tags: ["Passaporti per Tunisi (1840-1940)", "Sudditi Britannici", "Emigrazione Maltese"],
    },
    "malta-family-history": {
      title: "Geneanum — Archivi e Genealogia Maltese (Collezione Adami)",
      badge: "Registri Parrocchiali • Malta e Tunisia",
      description:
        "Collezione Adami e registri parrocchiali digitalizzati: atti di battesimo, matrimonio e sepoltura delle famiglie maltesi registrati nelle parrocchie cattoliche di Malta e Tunisia (Santa Croce di Tunisi, San Felice di Sousse).",
      tags: ["Atti Parrocchiali", "Battesimi e Matrimoni", "Santa Croce di Tunisi"],
    },
    "tna-kew-uk": {
      title: "The National Archives (TNA - Kew, Regno Unito)",
      badge: "Archivi Governativi • Kew, Londra",
      description:
        "Serie diplomatiche del Foreign Office (FO 102, FO 335, FO 84) relative al Consolato Generale britannico a Tunisi, inclusa la registrazione dei sudditi britannici e dei mercanti maltesi.",
      tags: ["Foreign Office FO 102 / FO 335", "Consolato Generale Tunisi", "Protetti Britannici"],
    },
    "cwgc-tunisie": {
      title: "Commonwealth War Graves Commission (CWGC)",
      badge: "Sepolture Militari Alleate",
      description:
        "Registri commemorativi e localizzazione delle sepolture dei soldati alleati caduti durante la Campagna di Tunisia (1942–1943) nei cimiteri militari di Medjez-el-Bab ed Enfidaville.",
      tags: ["Campagna di Tunisia 1943", "Medjez-el-Bab", "Enfidaville", "Cimiteri Militari"],
    },
    "cgj-paris": {
      title: "Circolo di Genealogia Ebraica (CGJ - Parigi)",
      badge: "Genealogia Ebraica Nordafricana • Parigi",
      description:
        "Associazione di riferimento per la genealogia ebraica di Tunisia: spogli completi dello stato civile israelita, sepolture dei cimiteri del Borgel e Bab El Khadra a Tunisi e contratti matrimoniali rabbinici (ketubot).",
      tags: ["Stato Civile Israelita", "Cimitero del Borgel", "Ketubot", "Grana e Twansa"],
    },
    "cahjp-jerusalem": {
      title: "Archivi Centrali per la Storia del Popolo Ebraico (CAHJP)",
      badge: "Archivi Storici Comunitari • Gerusalemme",
      description:
        "Il più vasto centro archivistico dell'ebraismo tunisino: conserva i registri dei tribunali rabbinici di Tunisi, i registri di Mohel (1845–1950) e gli archivi delle comunità Grana (Livornesi) e Twansa.",
      tags: ["Tribunale Rabbinico Tunisi", "Libri di Mohel (1845-1950)", "Grana (Livornesi)", "Twansa"],
    },
    "aiu-paris": {
      title: "Alleanza Israelitica Universale (AIU - Parigi)",
      badge: "Archivi Scolastici e Comunitari • Parigi",
      description:
        "Registri nominativi d'iscrizione scolastica delle scuole dell'AIU fondate a Tunisi (dal 1878), Sousse, Sfax, Nabeul, Biserta e Djerba, con filiazioni complete e professioni dei genitori.",
      tags: ["Scuole AIU Tunisi", "Registri Scolastici", "Djerba", "Sousse", "Sfax"],
    },
    "shjt-paris": {
      title: "Società di Storia degli Ebrei di Tunisia (SHJT)",
      badge: "Società Scientifica e Ricerca • Parigi",
      description:
        "Studi monografici, spogli genealogici e fondi documentari sulla storia dei cognomi ebraici tunisini (origini iberiche, toscane/livornesi o autoctone) e le loro rotte nel Mediterraneo.",
      tags: ["Cognomi Ebraici Tunisini", "Storia Comunitaria", "Monografie Familiari"],
    },
    "osmanli-arsivi-istanbul": {
      title: "Archivi di Stato Ottomani (Devlet Arşivleri — Istanbul)",
      badge: "Archivi Imperiali Ottomani • Istanbul",
      description:
        "Fondo imperiale ottomano (Mühimme Defterleri): conserva i firmani sultaniali riguardanti la Reggenza di Tunisi, le nomine di Pascià e Dey e la corrispondenza tra Istanbul e il Bardo.",
      tags: ["Firmani Imperiali", "Pascialato di Tunisi", "Divan-ı Hümayun", "Dinastia Husseinita"],
    },
    "ircica-istanbul": {
      title: "IRCICA — Centro di Ricerca per la Storia e l'Arte Islamica",
      badge: "Documentazione Islamica • Istanbul",
      description:
        "Istituzione dell'OCI che conserva importanti collezioni fotografiche d'epoca beylicale su Tunisi, cataloghi di manoscritti islamici, carte waqf e studi su corporazioni e notariato.",
      tags: ["Fototeca Beylicale", "Manoscritti Islamici", "Corporazioni e Notariato"],
    },
    "zitouna-manuscrits": {
      title: "Fondo dei Manoscritti della Moschea Zitouna (BNT)",
      badge: "Grande Moschea Zitouna • Tunisi",
      description:
        "Registri di docenti e studenti dell'Università Zitouna, diplomi di insegnamento (ijāzāt), biografie di eruditi (tarājim), chorfa e qadi malikiti e hanafiti di Tunisia.",
      tags: ["Diplomi Ijaza", "Qadi Hanafiti e Malikiti", "Chorfa", "Eruditi della Zitouna"],
    },
    "cna-alger": {
      title: "Centro Nazionale degli Archivi d'Algeria (CNA)",
      badge: "Archivi Nazionali • Algeri",
      description:
        "Fondi documentari sulle regioni di confine tunisino-algerine (Khmir, Mogod, Medjerda, Nemencha), trattati di confine e spostamenti storici di tribù.",
      tags: ["Tribù di Confine", "Khmir e Nemencha", "Costantina", "Confine Tunisino-Algerino"],
    },
    "archives-maroc-rabat": {
      title: "Archivi del Marocco (Rabat)",
      badge: "Archivi Nazionali • Rabat",
      description:
        "Documenti d'archivio relativi alle famiglie andaluse transitate per Fez e Tetouan prima di stabilirsi a Testour, Soliman e Tunisi, e registri delle confraternite sufi.",
      tags: ["Famiglie Andaluse", "Testour e Soliman", "Confraternite Sufi", "Sceriffi"],
    },
    "anom-irel-maghreb": {
      title: "ANOM — Banca Dati IREL dei Registri del Nord Africa",
      badge: "Banca Dati Nominativa IREL • Online",
      description:
        "Ricerca nominativa online nei registri di stato civile e parrocchiali delle località di confine (Annaba/Bône, Costantina, Souk Ahras, Tébessa) con famiglie di origine o alleanza tunisina.",
      tags: ["Banca Dati IREL", "Costantina", "Bône / Annaba", "Confine e Scambi"],
    },
  },
  mt: {
    "ant-tunisie": {
      title: "Arkivji Nazzjonali tat-Tuneżija (ANT)",
      badge: "Arkivji tal-Istat • Tuneż",
      description:
        "Repożitorju ċentrali tal-istorja Tuneżina. Jippreserva r-reġistri fiskali nominattivi tal-Majba (1860–1869), id-digrieti bejlikali Ħussejniti, is-sentenzi tal-qrati tal-Ouzara u l-atti nutarili ('udul).",
      tags: ["Majba 1860-1869", "Digrieti Bejlikali", "Nutarili 'Udul", "Qrati Ouzara"],
    },
    "bnt-tunisie": {
      title: "Bibljoteka Nazzjonali tat-Tuneżija (BNT)",
      badge: "Wirt Miktub u Manuskritti • Tuneż",
      description:
        "Konservazzjoni tal-wirt stampat u manuskritt: gazzetti storiċi tar-Reġġenza, direttorji amministrattivi Didot-Bottin, dizzjunarji bijografiċi (Tarājim) u arkivji tal-Università Zitouna.",
      tags: ["Manuskritti Għarab", "Tarājim (Bijografiji)", "Stampa Storika", "Zitouna"],
    },
    "commune-tunis": {
      title: "Arkivji Muniċipali tal-Belt ta' Tuneż (Stat Ċivili)",
      badge: "Stat Ċivili Muniċipali • Kapitali",
      description:
        "Reġistri tal-atti tat-twelid, żwieġ u mewt tal-muniċipalità ta' Tuneż mit-twaqqif tal-istat ċivili modern (1886), kif ukoll konċessjonijiet taċ-ċimiterji tal-kapitali.",
      tags: ["Stat Ċivili (1886-1956)", "Twelid", "Żwiġijiet", "Ċimiterji Muniċipali"],
    },
    "habous-tunisie": {
      title: "Arkivji tal-Ħabous u Waqf tat-Tuneżija",
      badge: "Fondazzjonijiet Piji • Tuneż",
      description:
        "Fondi tal-Djemaa el-Habous. L-atti ta' waqf tal-familja (habous ahlī) jelenkaw is-siġra tar-razza kompluta tal-fundaturi, l-antenati u d-dixxendenti kollha tul diversi sekli.",
      tags: ["Ħabous tal-Familja", "Waqf Ahlī", "Ġenealoġiji Awtentiċi", "Wirt"],
    },
    "cadn-nantes": {
      title: "Ċentru tal-Arkivji Diplomatiċi ta' Nantes (CADN)",
      badge: "Arkivji Diplomatiċi u Konsulari • Nantes",
      description:
        "Il-fond fundamentali tal-Protettorat (1881–1956): jippreserva l-istat ċivili konsulari tal-Ewropej fit-Tuneżija (inklużi l-Maltin), id-digrieti ta' naturalizzazzjoni (1924–1927), il-listi elettorali u s-suċċessjonijiet.",
      tags: ["Stat Ċivili Konsulari", "Naturalizzazzjonijiet 1924-1927", "Suċċessjonijiet", "Listi Elettorali"],
    },
    "anom-aix": {
      title: "Arkivji Nazzjonali Extra-Ewropej ta' Franza (ANOM)",
      badge: "Fondi tal-Protettorat • Aix-en-Provence",
      description:
        "Reġistri militari tar-rekluti fit-Tuneżija, fajls tal-karriera tal-uffiċjali tal-Protettorat, konċessjonijiet agrikoli u rapporti dwar l-Afrika ta' Fuq.",
      tags: ["Reġistri Militari", "Persunal tal-Protettorat", "Konċessjonijiet", "Afrika ta' Fuq"],
    },
    "anf-pierrefitte": {
      title: "Arkivji Nazzjonali ta' Franza (Pierrefitte-sur-Seine)",
      badge: "Arkivji Ċentrali • Pariġi",
      description:
        "Fajls individwali ta' talbiet għan-naturalizzazzjoni ppreżentati minn residenti fit-Tuneżija (Franċiżi, Taljani, Maltin, Lhud u Musulmani Tuneżini) b'siġar tal-familja.",
      tags: ["Digrieti ta' Naturalizzazzjoni", "Ministeru tal-Ġustizzja", "Fajls Individwali"],
    },
    "shd-vincennes": {
      title: "Servizz Storiku tad-Difiża (SHD)",
      badge: "Arkivji Militari • Vincennes u Caen",
      description:
        "Fajls individwali tal-karriera, rekords tas-servizz u pensjonijiet tas-suldati Tuneżini li servew fir-4 Reġiment tat-Tirailleurs Tuneżini u fl-1 Spahis fiż-żewġ gwerer dinjija.",
      tags: ["4 Tirailleurs Tuneżini", "1 Spahis", "Gwerra 1914-1918", "Gwerra 1939-1945"],
    },
    "gallica-bnf": {
      title: "Gallica — Bibljoteka Nazzjonali ta' Franza (BnF)",
      badge: "Bibljoteka Diġitali • BnF Pariġi",
      description:
        "Aċċess diġitali sħiħ għall-Journal Officiel Tunisien (1883–1956), id-direttorji Didot-Bottin tal-Afrika ta' Fuq u l-istampa storika biex issib indirizzi, professjonijiet u obitwarji.",
      tags: ["Gazzetta Uffiċjali Tuneżina", "Direttorji Kummerċjali", "Stampa ta' Kuljum"],
    },
    "memoire-des-hommes": {
      title: "Mémoire des Hommes (Ministeru tal-Forzi Armati)",
      badge: "Bażi Nominattiva tal-Kumbattenti",
      description:
        "Bażi tad-dejta uffiċjali għat-tfittxija nominattiva ta' tirailleurs, spahis u persunal militari mit-Tuneżija li mietu matul l-Ewwel u t-Tieni Gwerra Dinjija.",
      tags: ["Suldati Mejta fil-Gwerra", "Tirailleurs Tuneżini", "Oqbra Militari"],
    },
    "antenati-italie": {
      title: "Portale Antenati (Arkivji tal-Istat tal-Italja)",
      badge: "Portal Nazzjonali tal-Istat Ċivili • Ministeru tal-Kultura",
      description:
        "Portal uffiċjali tal-ġenealoġija Taljana b'aċċess b'xejn għal miljuni ta' atti tal-istat ċivili diġitalizzati (Palermo, Trapani, Messina, Pantelleria) tal-familji Taljani u Sqallin stabbiliti f'Tuneż, La Goulette, Bizerte u Sousse.",
      tags: ["Stat Ċivili Taljan", "Sqallija", "Pantelleria", "Familji ta' La Goulette"],
    },
    "asdmae-rome": {
      title: "Arkivju Storiku Diplomatiku (MAECI - Ruma)",
      badge: "Affarijiet Barranin • Ruma",
      description:
        "Arkivji tal-Ministeru tal-Affarijiet Barranin Taljan: jippreserva reġistri konsulari, passaporti u atti tal-istat ċivili taċ-ċittadini Taljani fir-Reġġenza ta' Tuneż.",
      tags: ["Konsulat Taljan Tuneż", "La Goulette", "Reġistrazzjonijiet Konsulari", "Passaporti"],
    },
    "archivio-palermo": {
      title: "Arkivju tal-Istat ta' Palermo (Sqallija)",
      badge: "Arkivji Provinċjali • Palermo, Sqallija",
      description:
        "Reġistri tal-imbark lejn La Goulette u Tuneż, ħruġ ta' passaporti għall-Afrika ta' Fuq u listi tal-lieva militari tal-familji Sqallin li emigraw lejn it-Tuneżija bejn l-1860 u l-1940.",
      tags: ["Emigrazzjoni Sqallija", "Listi tal-Imbark", "Lieva Militari", "Palermo"],
    },
    "archivio-trapani": {
      title: "Arkivju tal-Istat ta' Trapani (Sqallija)",
      badge: "Arkivji Marittimi u Nutarili • Trapani",
      description:
        "Fondi arkivistiċi tas-sajjieda tal-qroll, baħrin u negozjanti ta' Trapani u Pantelleria li waqqfu l-komunitajiet storiċi ta' La Goulette, Tabarka u Cap Bon.",
      tags: ["Trapani", "Pantelleria", "Sajjieda tal-Qroll", "Tabarka"],
    },
    "national-archives-malta": {
      title: "Arkivji Nazzjonali ta' Malta (National Archives of Malta)",
      badge: "Arkivji Nazzjonali • Ir-Rabat u l-Imdina",
      description:
        "Reġistri uffiċjali ta' applikazzjonijiet għall-passaporti lejn Tuneż, depożizzjonijiet ġudizzjarji u ċertifikati ta' suġġetti Brittaniċi maħruġa lill-Maltin li kienu jgħixu f'Tuneż, Sousse, Mahdia, Sfax u Djerba mill-1840 sal-1940.",
      tags: ["Passaporti għal Tuneż (1840-1940)", "Suġġetti Brittaniċi", "Emigrazzjoni Maltija"],
    },
    "malta-family-history": {
      title: "Geneanum — Arkivji u Ġenealoġija Maltija (Kollezzjoni Adami)",
      badge: "Reġistri Parrokkjali • Malta u t-Tuneżija",
      description:
        "Il-Kollezzjoni Adami u r-reġistri parrokkjali diġitalizzati: atti tal-magħmudija, żwieġ u dfin tal-familji Maltin irreġistrati fil-parroċċi Kattoliċi ta' Malta u tat-Tuneżija (Santa Kruċ ta' Tuneż, San Feliċ ta' Sousse).",
      tags: ["Atti Parrokkjali", "Magħmudijiet u Żwiġijiet", "Santa Kruċ ta' Tuneż"],
    },
    "tna-kew-uk": {
      title: "The National Archives (TNA - Kew, ir-Renju Unit)",
      badge: "Arkivji Governattivi • Kew, Londra",
      description:
        "Serje diplomatiċi tal-Foreign Office (FO 102, FO 335, FO 84) dwar il-Konsulat Ġenerali Brittaniku f'Tuneż, inkluża r-reġistrazzjoni tas-suġġetti Brittaniċi u tan-negozjanti u l-familji Maltin.",
      tags: ["Foreign Office FO 102 / FO 335", "Konsulat Ġenerali Tuneż", "Maltin u Suġġetti Brittaniċi"],
    },
    "cwgc-tunisie": {
      title: "Commonwealth War Graves Commission (CWGC)",
      badge: "Oqbra Militari tal-Alleati",
      description:
        "Reġistri kommemorattivi u postijiet tal-oqbra tas-suldati Brittaniċi, Maltin u Alleati li mietu matul il-Kampanja tat-Tuneżija (1942–1943) fiċ-ċimiterji militari ta' Medjez-el-Bab u Enfidaville.",
      tags: ["Kampanja tat-Tuneżija 1943", "Medjez-el-Bab", "Enfidaville", "Ċimiterji Militari"],
    },
    "cgj-paris": {
      title: "Ċirku tal-Ġenealoġija Lhudija (CGJ - Pariġi)",
      badge: "Ġenealoġija Lhudija tal-Afrika ta' Fuq • Pariġi",
      description:
        "Assoċjazzjoni ewlenija għall-ġenealoġija Lhudija tat-Tuneżija: indiċijiet tal-istat ċivili, oqbra taċ-ċimiterji ta' Borgel u Bab El Khadra f'Tuneż u kuntratti taż-żwieġ rabbiniċi (ketubot).",
      tags: ["Stat Ċivili Lhudi", "Ċimiterju ta' Borgel", "Ketubot", "Grana u Twansa"],
    },
    "cahjp-jerusalem": {
      title: "Arkivji Ċentrali għall-Istorja tal-Poplu Lhudi (CAHJP)",
      badge: "Arkivji Storiċi Komunitarji • Ġerusalemm",
      description:
        "L-akbar ċentru arkivistiku tal-Lhud Tuneżini: jippreserva r-reġistri tal-qrati rabbiniċi ta' Tuneż, ir-reġistri ta' Mohel (1845–1950) u d-dokumenti tal-komunitajiet Grana u Twansa.",
      tags: ["Qorti Rabbinika Tuneż", "Kotba ta' Mohel (1845-1950)", "Grana (Livorniżi)", "Twansa"],
    },
    "aiu-paris": {
      title: "Alleanza Iżraelitika Universali (AIU - Pariġi)",
      badge: "Arkivji Skolastiċi u Komunitarji • Pariġi",
      description:
        "Reġistri nominattivi tar-reġistrazzjoni fl-iskejjel tal-AIU mwaqqfa f'Tuneż (mill-1878), Sousse, Sfax, Nabeul, Bizerte u Djerba, bil-ġenituri u l-professjonijiet tagħhom.",
      tags: ["Skejjel AIU Tuneż", "Reġistri Skolastiċi", "Djerba", "Sousse", "Sfax"],
    },
    "shjt-paris": {
      title: "Soċjetà tal-Istorja tal-Lhud tat-Tuneżija (SHJT)",
      badge: "Soċjetà Xjentifika u Riċerka • Pariġi",
      description:
        "Studji monografiċi u fondi dokumentarji dwar l-istorja tal-kunjomijiet Lhud Tuneżini u l-migrazzjoni tagħhom fil-Mediterran.",
      tags: ["Kunjomijiet Lhud Tuneżini", "Storja Komunitarja", "Monografiji tal-Familji"],
    },
    "osmanli-arsivi-istanbul": {
      title: "Arkivji tal-Istat Ottomani (Devlet Arşivleri — Istanbul)",
      badge: "Arkivji Imperjali Ottomani • Istanbul",
      description:
        "Fond imperjali Ottoman (Mühimme Defterleri): jippreserva l-firmani sultani dwar ir-Reġġenza ta' Tuneż, il-ħatriet ta' Pashas u Deys u l-korrispondenza bejn Istanbul u l-Bardo.",
      tags: ["Firmani Imperjali", "Pashalik ta' Tuneż", "Divan-ı Hümayun", "Dinastija Ħussejnita"],
    },
    "ircica-istanbul": {
      title: "IRCICA — Ċentru ta' Riċerka għall-Istorja u l-Arti Iżlamika",
      badge: "Dokumentazzjoni Iżlamika • Istanbul",
      description:
        "Istituzzjoni tal-OCI li tippreserva kollezzjonijiet fotografiċi ta' żmien il-Bey fuq Tuneż, katalgi ta' manuskritti Iżlamiċi, karti waqf u studji dwar il-korporazzjonijiet.",
      tags: ["Fototeka Bejlikali", "Manuskritti Iżlamiċi", "Korporazzjonijiet u Nutara"],
    },
    "zitouna-manuscrits": {
      title: "Fond tal-Manuskritti tal-Moskea Zitouna (BNT)",
      badge: "Moskea l-Kbira Zitouna • Tuneż",
      description:
        "Reġistri tal-għalliema u l-istudenti tal-Università Zitouna, diplomi tat-tagħlim (ijāzāt), bijografiji ta' studjużi (tarājim), xorfa u qadis Malikiti u Ħanafiti tat-Tuneżija.",
      tags: ["Diplomi Ijaza", "Qadis Ħanafiti u Malikiti", "Xorfa", "Studjużi taż-Zitouna"],
    },
    "cna-alger": {
      title: "Ċentru Nazzjonali tal-Arkivji tal-Alġerija (CNA)",
      badge: "Arkivji Nazzjonali • Alġeri",
      description:
        "Fondi dokumentarji dwar ir-reġjuni tal-fruntiera Tuneżina-Alġerina (Khmir, Mogod, Medjerda, Nemencha), trattati tal-fruntiera u movimenti tat-tribujiet.",
      tags: ["Tribujiet tal-Fruntiera", "Khmir u Nemencha", "Constantine", "Fruntiera Tuneżina-Alġerina"],
    },
    "archives-maroc-rabat": {
      title: "Arkivji tal-Marokk (Rabat)",
      badge: "Arkivji Nazzjonali • Rabat",
      description:
        "Dokumenti arkivistiċi dwar il-familji Andalusjani li għaddew minn Fez u Tetouan qabel ma stabbilew ruħhom f'Testour, Soliman u Tuneż, u reġistri tal-fratellanzi Sufi.",
      tags: ["Familji Andalusjani", "Testour u Soliman", "Fratellanzi Sufi", "Xeriffi"],
    },
    "anom-irel-maghreb": {
      title: "ANOM — Bażi IREL tar-Reġistri tal-Afrika ta' Fuq",
      badge: "Bażi Nominattiva IREL • Online",
      description:
        "Tfittxija nominattiva online fir-reġistri tal-istat ċivili u parrokkjali tal-bliet tal-fruntiera (Annaba/Bône, Constantine, Souk Ahras, Tébessa) b'familji ta' oriġini jew alleanza Tuneżina.",
      tags: ["Bażi IREL", "Constantine", "Bône / Annaba", "Fruntiera u Skambji"],
    },
  },
};

const LINK_TO_ARCHIVE_ID: Record<string, string> = {
  "http://www.archives.nat.tn": "ant-tunisie",
  "https://www.commune-tunis.gov.tn": "commune-tunis",
  "http://www.affaires-religieuses.tn": "habous-tunisie",
  "https://www.diplomatie.gouv.fr/fr/archives-diplomatiques/": "cadn-nantes",
  "https://archives-nationales-outre-mer.culture.gouv.fr/": "anom-aix",
  "https://www.archives-nationales.culture.gouv.fr": "anf-pierrefitte",
  "https://www.servicehistorique.sga.defense.gouv.fr/": "shd-vincennes",
  "https://gallica.bnf.fr": "gallica-bnf",
  "https://www.memoiredeshommes.sga.defense.gouv.fr": "memoire-des-hommes",
  "https://antenati.cultura.gov.it": "antenati-italie",
  "https://asd.esteri.it/": "asdmae-rome",
  "https://saassipa.cultura.gov.it/": "archivio-palermo",
  "https://archiviodistatotrapani.cultura.gov.it": "archivio-trapani",
  "https://nationalarchives.gov.mt": "national-archives-malta",
  "https://geneanum.com": "malta-family-history",
  "https://www.nationalarchives.gov.uk": "tna-kew-uk",
  "https://www.cwgc.org": "cwgc-tunisie",
  "https://www.genealoj.org": "cgj-paris",
  "https://cahjp.nli.org.il": "cahjp-jerusalem",
  "https://www.aiu.org/": "aiu-paris",
  "https://shjt.fr": "shjt-paris",
  "https://www.devletarsivleri.gov.tr": "osmanli-arsivi-istanbul",
  "https://www.ircica.org": "ircica-istanbul",
  "https://www.archives-nationales.dz": "cna-alger",
  "https://www.archivesdumaroc.ma": "archives-maroc-rabat",
  "https://archives-nationales-outre-mer.culture.gouv.fr/web/guest/etat-civil": "anom-irel-maghreb",
};

function findCanonicalArchiveId(card: {
  id: string | number;
  title?: string;
  name?: string;
  link?: string;
  category?: string;
}): string {
  const idStr = String(card.id || "");
  if (DEFAULT_SOURCE_CARDS_BY_LOCALE.en[idStr]) {
    return idStr;
  }
  const rawTitle = (card.title || card.name || "").toLowerCase();
  if (rawTitle.includes("zitouna")) return "zitouna-manuscrits";
  if (rawTitle.includes("bibliothèque nationale de tunisie") || rawTitle.includes("(bnt)")) {
    return "bnt-tunisie";
  }
  const cleanLink = (card.link || "").trim();
  if (cleanLink && LINK_TO_ARCHIVE_ID[cleanLink]) {
    return LINK_TO_ARCHIVE_ID[cleanLink];
  }
  return idStr;
}

export function loadSourcesMultiLocaleStore(): SourcesMultiLocaleStore {
  const base: SourcesMultiLocaleStore = {
    heroByLocale: { ...DEFAULT_SOURCES_HERO_BY_LOCALE },
    cardOverridesByLocale: { fr: {}, en: {}, ar: {}, es: {}, it: {}, mt: {} },
    locationOverridesByLocale: { fr: {}, en: {}, ar: {}, es: {}, it: {}, mt: {} },
  };
  try {
    const raw = localStorage.getItem(SOURCES_CMS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        if (parsed.heroByLocale && typeof parsed.heroByLocale === "object") {
          for (const loc of SOURCES_CMS_LOCALES) {
            if (parsed.heroByLocale[loc.code]) {
              base.heroByLocale[loc.code] = {
                ...DEFAULT_SOURCES_HERO_BY_LOCALE[loc.code],
                ...parsed.heroByLocale[loc.code],
              };
            }
          }
        }
        if (parsed.cardOverridesByLocale && typeof parsed.cardOverridesByLocale === "object") {
          base.cardOverridesByLocale = {
            ...base.cardOverridesByLocale,
            ...parsed.cardOverridesByLocale,
          };
        }
        if (
          parsed.locationOverridesByLocale &&
          typeof parsed.locationOverridesByLocale === "object"
        ) {
          base.locationOverridesByLocale = {
            ...base.locationOverridesByLocale,
            ...parsed.locationOverridesByLocale,
          };
        }
      }
    }
  } catch {}
  return base;
}

export function saveSourcesMultiLocaleStore(store: SourcesMultiLocaleStore): void {
  try {
    localStorage.setItem(SOURCES_CMS_STORAGE_KEY, JSON.stringify(store));
    window.dispatchEvent(new CustomEvent("roots_sources_cms_updated", { detail: store }));
  } catch {}
}

export function resolveLocalizedSourceCard<
  T extends {
    id: string | number;
    title?: string;
    name?: string;
    badge?: string;
    description: string;
    link?: string;
    category?: string;
    tags?: string[];
    translations?: Record<string, { title?: string; description?: string }>;
  }
>(card: T, locale: string, store?: SourcesMultiLocaleStore): T {
  const cleanLoc = (locale || "fr").toLowerCase();
  const activeStore = store || loadSourcesMultiLocaleStore();
  const key = String(card.id);
  const canonicalKey = findCanonicalArchiveId(card);
  const override =
    activeStore.cardOverridesByLocale?.[cleanLoc]?.[key] ||
    activeStore.cardOverridesByLocale?.[cleanLoc]?.[canonicalKey];
  const defaultLocCard = DEFAULT_SOURCE_CARDS_BY_LOCALE[cleanLoc]?.[canonicalKey];
  const dbTrans = card.translations?.[cleanLoc];

  if (cleanLoc === "fr" && !override) {
    return card;
  }

  const nextTitle =
    override?.title ||
    dbTrans?.title ||
    defaultLocCard?.title ||
    card.title ||
    card.name ||
    "";
  const nextDesc =
    override?.description ||
    dbTrans?.description ||
    defaultLocCard?.description ||
    card.description ||
    "";
  const nextBadge =
    override?.badge ||
    defaultLocCard?.badge ||
    card.badge ||
    "";
  const nextTags =
    Array.isArray(override?.tags) && override!.tags!.length > 0
      ? override!.tags!
      : Array.isArray(defaultLocCard?.tags) && defaultLocCard!.tags.length > 0
      ? defaultLocCard!.tags
      : card.tags || [];

  return {
    ...card,
    ...(card.title !== undefined ? { title: nextTitle } : {}),
    ...(card.name !== undefined ? { name: nextTitle } : {}),
    description: nextDesc,
    badge: nextBadge,
    tags: nextTags,
  };
}

export function resolveLocalizedLocation<
  T extends { key: string; label: string; description?: string; icon?: string }
>(loc: T, locale: string, store?: SourcesMultiLocaleStore): T {
  const cleanLoc = (locale || "fr").toLowerCase();
  const activeStore = store || loadSourcesMultiLocaleStore();
  const override = activeStore.locationOverridesByLocale?.[cleanLoc]?.[loc.key];
  const def = DEFAULT_LOCATIONS_BY_LOCALE[cleanLoc]?.[loc.key];

  return {
    ...loc,
    label: override?.label || def?.label || loc.label,
    ...(loc.description !== undefined || def?.description || override?.description
      ? { description: override?.description || def?.description || loc.description }
      : {}),
  };
}
