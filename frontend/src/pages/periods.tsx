import { useEffect, useState } from "react";
import { useThemeStore } from "../store/theme";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  Scroll,
  Crown,
  Shield,
  BookOpen,
  Map,
  Landmark,
  Archive,
  FileText,
  ChevronDown,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { useTranslation } from "../context/TranslationContext";
import RootsPageShell from "../components/RootsPageShell";
import SEO from "../components/SEO";

export default function Periods() {
  const { theme } = useThemeStore();
  const { t } = useTranslation();
  const [expandedCountry, setExpandedCountry] = useState<string | null>("country_tunisia");

  useEffect(() => {
    AOS.init({ duration: 900, once: true });
  }, []);

  const cardBg = theme === "dark" ? "bg-[#092C2B]" : "bg-white";
  const borderColor = theme === "dark" ? "border-[#134E4A]" : "border-[#c8dedd]";
  const hoverBg = theme === "dark" ? "hover:bg-[#134E4A]" : "hover:bg-[#f0f7f6]";

  const periods = [
    {
      title: t("periods_carthaginian_title", "Carthaginian & Roman Period (c. 814 BCE–439 CE)"),
      icon: Shield,
      accent: "var(--brand-gold)",
      description: t(
        "periods_carthaginian_desc",
        "Phoenician settlement, Punic inscriptions, and Roman documentary layer for Tunisian and North African lineages."
      ),
      bullets: [
        t("periods_carthaginian_b1", "Punic funerary stelae and tophet inscriptions"),
        t("periods_carthaginian_b2", "Roman census and municipal registers (Africa Proconsularis)"),
        t("periods_carthaginian_b3", "Vandal and Byzantine continuity of Roman civil structures"),
        t("periods_carthaginian_b4", "Early Christian epigraphic and ecclesiastical records"),
      ],
    },
    {
      title: t("periods_aghlabid_title", "Islamic & Aghlabid Period (7th–12th c.)"),
      icon: Crown,
      accent: "#134E4A",
      description: t(
        "periods_aghlabid_desc",
        "The Islamic conquest brought Arabic naming, Qadi courts, and waqf institutions that shaped Tunisian and Maghrebi family identity."
      ),
      bullets: [
        t("periods_aghlabid_b1", "Arabic patronymic system (nasab: bin/bint) codified"),
        t("periods_aghlabid_b2", "Aghlabid and Fatimid court archives in Kairouan"),
        t("periods_aghlabid_b3", "Habous deeds and endowment rosters"),
        t("periods_aghlabid_b4", "Zawiya lineages and early sufi lists"),
      ],
    },
    {
      title: t("periods_hafsid_title", "Hafsid Period (1228–1574)"),
      icon: Scroll,
      accent: "var(--brand-gold)",
      description: t(
        "periods_hafsid_desc",
        "Lay the foundations of family record-keeping through local Islamic scholars and sultanic decrees."
      ),
      bullets: [
        t("periods_hafsid_b1", "Sultanic chancery records and diplomatic rosters"),
        t("periods_hafsid_b2", "Andalusian immigrant lineage logs"),
        t("periods_hafsid_b3", "Mosque library donation logs (Zaytuna)"),
        t("periods_hafsid_b4", "Islamic scholar biographical dictionaries"),
      ],
    },
    {
      title: t("periods_ottoman_title", "Ottoman Period (1574–1881)"),
      icon: Crown,
      accent: "#134E4A",
      description: t(
        "periods_ottoman_desc",
        "Ottoman rule brought administrative registers (defters), military rolls, and sharia court logs of the Husainid Dynasty."
      ),
      bullets: [
        t("periods_ottoman_b1", "Beylic military and administrative defters"),
        t("periods_ottoman_b2", "Sharia and civil court notary ledgers"),
        t("periods_ottoman_b3", "Jewish community registry logs (Grana & Tuansa)"),
        t("periods_ottoman_b4", "Family waqf and inheritance rulings"),
      ],
    },
    {
      title: t("periods_colonial_title", "French Protectorate Era (1881–1956)"),
      icon: Landmark,
      accent: "var(--brand-gold)",
      description: t(
        "periods_colonial_desc",
        "Colonial administration formalized census systems, modern civil status records, and surname fixations."
      ),
      bullets: [
        t("periods_colonial_b1", "Etat Civil registers established (1886)"),
        t("periods_colonial_b2", "Consular registrations and passport records"),
        t("periods_colonial_b3", "Surnames fixation decrees (1908-1916)"),
        t("periods_colonial_b4", "Land registry surveys and tribal maps"),
      ],
    },
    {
      title: t("periods_modern_title", "Modern Republic (1956–Present)"),
      icon: BookOpen,
      accent: "#134E4A",
      description: t(
        "periods_modern_desc",
        "Post-independence civil status repositories, national census data, and municipal (APC) archives."
      ),
      bullets: [
        t("periods_modern_b1", "National identity registry databases"),
        t("periods_modern_b2", "Municipal birth, marriage, and death registers"),
        t("periods_modern_b3", "Family record booklets (Daftar al-A'ila)"),
        t("periods_modern_b4", "Diaspora consulate registry books"),
      ],
    },
  ];

  const timeline = [
    {
      period: t("periods_timeline_ancient", "814 BCE–439 CE - Carthaginian & Roman"),
      detail: t(
        "periods_timeline_ancient_desc",
        "Punic inscriptions, Roman municipal registers, Vandal/Byzantine continuity."
      ),
    },
    {
      period: t("periods_timeline_islamic", "7th–12th c. - Islamic & Aghlabid"),
      detail: t(
        "periods_timeline_islamic_desc",
        "Arabic naming, Qadi courts, waqf endowments, Kairouan archives."
      ),
    },
    {
      period: t("periods_timeline_hafsid", "1228–1574 - Hafsid Sultanate"),
      detail: t(
        "periods_timeline_hafsid_desc",
        "Chancery records, scholarly genealogies, notarial documentation."
      ),
    },
    {
      period: t("periods_timeline_ottoman", "1574–1881 - Ottoman & Husainid"),
      detail: t(
        "periods_timeline_ottoman_desc",
        "Sharia court registers, habous deeds, beylical archives."
      ),
    },
    {
      period: t("periods_timeline_protectorate", "1881–1956 - French Protectorate"),
      detail: t(
        "periods_timeline_protectorate_desc",
        "Surname fixation, civil registries, colonial files at Archives Nationales."
      ),
    },
    {
      period: t("periods_timeline_independence", "1956–Present - Independence"),
      detail: t(
        "periods_timeline_independence_desc",
        "Civil registry, national ID, Thekra digital archives."
      ),
    },
  ];

  const highlights = [
    {
      icon: Archive,
      title: t("periods_highlight_ottoman_title", "Ottoman Records"),
      detail: t(
        "periods_highlight_ottoman_desc",
        "Beylic and sharia registers from 1574 are preserved in the National Archives of Tunisia."
      ),
    },
    {
      icon: FileText,
      title: t("periods_highlight_colonial_title", "Colonial Registers"),
      detail: t(
        "periods_highlight_colonial_desc",
        "Colonial civil status registers (ANOM) and land titles contain key family logs."
      ),
    },
    {
      icon: Landmark,
      title: t("periods_highlight_modern_title", "Modern Civil Status"),
      detail: t(
        "periods_highlight_modern_desc",
        "Municipal civil registry records (Etat Civil) provide structured modern details."
      ),
    },
    {
      icon: Map,
      title: t("periods_highlight_digital_title", "Thekra Digital Portal"),
      detail: t(
        "periods_highlight_digital_desc",
        "The Archives Nationales de Tunisie digital platform (thekra.tn) provides online access to indexed archival collections."
      ),
    },
  ];

  // Periods by country / historical framework
  const periodsByCountry = [
    {
      countryKey: "country_tunisia",
      country: t("country_tunisia", "Tunisia"),
      introKey: "periods_country_intro_tn",
      intro: t("periods_country_intro_tn", "From Punic settlements through the Ottoman beylik and French protectorate to the republic—Tunisia's layered archives support deep genealogical research."),
      periods: [
        { key: "periods_tn_ancient", label: t("periods_tn_ancient", "Carthaginian & Roman (814 BCE–439 CE)"), descKey: "periods_tn_ancient_desc", desc: t("periods_tn_ancient_desc", "Punic funerary stelae, Roman municipal registers, and early Christian epigraphy; Bardo Museum and National Archives hold related materials.") },
        { key: "periods_tn_islamic", label: t("periods_tn_islamic", "Islamic & Aghlabid (7th–12th c.)"), descKey: "periods_tn_islamic_desc", desc: t("periods_tn_islamic_desc", "Arabic nasab naming, Qadi court archives in Kairouan, waqf/habous deeds, and mosque library collections (e.g. Al-Zaytuna).") },
        { key: "periods_tn_hafsid", label: t("periods_tn_hafsid", "Hafsid Sultanate (1228–1574)"), descKey: "periods_tn_hafsid_desc", desc: t("periods_tn_hafsid_desc", "Sultanic chancery, scholarly lineage manuscripts, notarial acts, and zawiya networks; holdings dispersed across Tunisian archives.") },
        { key: "periods_tn_ottoman", label: t("periods_tn_ottoman", "Ottoman & Husainid (1574–1881)"), descKey: "periods_tn_ottoman_desc", desc: t("periods_tn_ottoman_desc", "Beylical and sharia court archives, habous registers, and tribal council records; foundational source period at Archives Nationales.") },
        { key: "periods_tn_protectorate", label: t("periods_tn_protectorate", "French Protectorate (1881–1956)"), descKey: "periods_tn_protectorate_desc", desc: t("periods_tn_protectorate_desc", "Civil status registration, censuses, land cadastre, and French administration archives held at Archives Nationales de Tunisie.") },
        { key: "periods_tn_independence", label: t("periods_tn_independence", "Independent Tunisia (1956–present)"), descKey: "periods_tn_independence_desc", desc: t("periods_tn_independence_desc", "Archives Nationales (Thekra), municipal état civil, national identity system, family record books, and diaspora consular files.") },
      ],
    },
    {
      countryKey: "country_morocco",
      country: t("country_morocco", "Morocco"),
      introKey: "periods_country_intro_ma",
      intro: t("periods_country_intro_ma", "From ancient Berber kingdoms and Idrisid Dynasties to the Sharifian empires and protectorate eras—Morocco's rich archival tradition supports lineage verification."),
      periods: [
        { key: "periods_ma_ancient", label: t("periods_ma_ancient", "Ancient & Mauretanian (c. 8th c. BCE–5th c. CE)"), descKey: "periods_ma_ancient_desc", desc: t("periods_ma_ancient_desc", "Phoenician and Punic trade outposts, Volubilis Roman municipal layer, and early Mauretanian epigraphic monuments.") },
        { key: "periods_ma_idrisid", label: t("periods_ma_idrisid", "Idrisid & Early Dynasties (789–1061 CE)"), descKey: "periods_ma_idrisid_desc", desc: t("periods_ma_idrisid_desc", "Establishment of Fez, patronymic registers (nasab), and early Sharifian (Idrisid) genealogical trees preserved in family archives.") },
        { key: "periods_ma_berber_empires", label: t("periods_ma_berber_empires", "Almoravid, Almohad & Marinid (1061–1465 CE)"), descKey: "periods_ma_berber_empires_desc", desc: t("periods_ma_berber_empires_desc", "Genealogical records, waqf/habous deeds, imperial chanceries, scholarly manuscripts, and court rolls from Fez, Marrakech, and Rabat.") },
        { key: "periods_ma_saadian_alaouite", label: t("periods_ma_saadian_alaouite", "Saadian & early Alaouite (1549–1912 CE)"), descKey: "periods_ma_saadian_alaouite_desc", desc: t("periods_ma_saadian_alaouite_desc", "Makhzen administrative registries, court record books, tax rolls, land endowment registers, and tribal alliances documents.") },
        { key: "periods_ma_protectorate", label: t("periods_ma_protectorate", "French & Spanish Protectorate (1912–1956)"), descKey: "periods_ma_protectorate_desc", desc: t("periods_ma_protectorate_desc", "Dual administrative zones: French Civil Status (État Civil) and Spanish consular records, military registries, and cadastre books.") },
        { key: "periods_ma_independence", label: t("periods_ma_independence", "Modern Morocco (1956–present)"), descKey: "periods_ma_independence_desc", desc: t("periods_ma_independence_desc", "Archives du Maroc, Ministry of Interior Civil Status records, family books (Daftar al-A'ila), and consular registries.") },
      ],
    },
    {
      countryKey: "country_algeria",
      country: t("country_algeria", "Algeria"),
      introKey: "periods_country_intro_dz",
      intro: t("periods_country_intro_dz", "From ancient Numidia and medieval dynasties through Ottoman rule to colonial administration and independence—Algeria's records are rich and varied."),
      periods: [
        { key: "periods_dz_ancient", label: t("periods_dz_ancient", "Numidian & Roman Period (202 BCE–430 CE)"), descKey: "periods_dz_ancient_desc", desc: t("periods_dz_ancient_desc", "Numidian Kingdom records under Masinissa, Roman Africa Proconsularis administrative censuses, and early Christian archeological inscriptions.") },
        { key: "periods_dz_islamic", label: t("periods_dz_islamic", "Islamic Dynasties & Rostemids (7th–15th c.)"), descKey: "periods_dz_islamic_desc", desc: t("periods_dz_islamic_desc", "Rostemid, Hammadid, and Zianid dynastic records. Early court registers, waqf files, and scholarly genealogies of Tlemcen and Bejaia.") },
        { key: "periods_dz_ottoman", label: t("periods_dz_ottoman", "Ottoman Regency of Algiers (1518–1830)"), descKey: "periods_dz_ottoman_desc", desc: t("periods_dz_ottoman_desc", "Regency administrative archives, Beylik registers (Constantine, Oran, Médéa), sharia court records, and guild documents.") },
        { key: "periods_dz_colonial", label: t("periods_dz_colonial", "French Colonial Period (1830–1962)"), descKey: "periods_dz_colonial_desc", desc: t("periods_dz_colonial_desc", "Establishment of indigenous civil status (État Civil), land ownership registers (Sénatus-Consulte of 1863), and ANOM files.") },
        { key: "periods_dz_independence", label: t("periods_dz_independence", "Independent Algeria (1962–present)"), descKey: "periods_dz_independence_desc", desc: t("periods_dz_independence_desc", "National Archives of Algeria (CNA), local APC municipality registries, national identity systems, and family record books.") },
      ],
    },
    {
      countryKey: "country_libya",
      country: t("country_libya", "Libya"),
      introKey: "periods_country_intro_ly",
      intro: t("periods_country_intro_ly", "From Greek and Phoenician antiquity, through Tripolitanian dynastic eras and Italian colonial rule to the modern state—Libyan archives hold millions of genealogical records."),
      periods: [
        { key: "periods_ly_ancient", label: t("periods_ly_ancient", "Phoenician, Greek & Roman (c. 7th c. BCE–5th c. CE)"), descKey: "periods_ly_ancient_desc", desc: t("periods_ly_ancient_desc", "Archaeological epigraphy of Leptis Magna, Cyrene, and Sabratha. Garamantes kingdom histories and Roman administrative layers.") },
        { key: "periods_ly_islamic", label: t("periods_ly_islamic", "Islamic Era & Hafsid Rule (7th–16th c.)"), descKey: "periods_ly_islamic_desc", desc: t("periods_ly_islamic_desc", "Spread of Arabic tribes (Beni Hilal and Beni Salim), Hafsid administrative records in Tripolitania, and early sharia records.") },
        { key: "periods_ly_ottoman", label: t("periods_ly_ottoman", "Ottoman Rule & Karamanli Dynasty (1551–1911)"), descKey: "periods_ly_ottoman_desc", desc: t("periods_ly_ottoman_desc", "Karamanli administration court records, Ottoman tax defters, sharia judicial registers, and religious endowments in Tripoli.") },
        { key: "periods_ly_italian", label: t("periods_ly_italian", "Italian Colonial Rule (1911–1943)"), descKey: "periods_ly_italian_desc", desc: t("periods_ly_italian_desc", "Italian demographic registry databases, military archives, census files, and records held in Rome's Archivio Centrale dello Stato.") },
        { key: "periods_ly_independence", label: t("periods_ly_independence", "Modern Libya (1951–present)"), descKey: "periods_ly_independence_desc", desc: t("periods_ly_independence_desc", "Libyan Center for Archives and Historical Studies, municipal civil status registries (Sijil al-Madani), and tribal consensus files.") },
      ],
    },
    {
      countryKey: "country_mauritania",
      country: t("country_mauritania", "Mauritania"),
      introKey: "periods_country_intro_mr",
      intro: t("periods_country_intro_mr", "From nomadic trade confederations and the Almoravid empire to the scholarly emirate period and French administration—Mauritania's history is preserved in rich oral and manuscript heritage."),
      periods: [
        { key: "periods_mr_ancient", label: t("periods_mr_ancient", "Early Inhabitants & Almoravid Era (c. 3rd–12th c.)"), descKey: "periods_mr_ancient_desc", desc: t("periods_mr_ancient_desc", "Sanhaja Berber trade networks, Almoravid movement chronicles, and archaeological records of ancient caravan cities like Aoudaghost.") },
        { key: "periods_mr_emirate", label: t("periods_mr_emirate", "Emirates & Scholarly Era (16th–19th c.)"), descKey: "periods_mr_emirate_desc", desc: t("periods_mr_emirate_desc", "Trarza, Brakna, Adrar, and Tagant emirate chronicles, family manuscript libraries (Chinguetti, Oualata), and traditional nasab trees.") },
        { key: "periods_mr_colonial", label: t("periods_mr_colonial", "French Colonial Administration (1902–1960)"), descKey: "periods_mr_colonial_desc", desc: t("periods_mr_colonial_desc", "French West Africa administrative files, colonial pacification reports, territorial censuses, and early civil registries.") },
        { key: "periods_mr_independence", label: t("periods_mr_independence", "Independent Mauritania (1960–present)"), descKey: "periods_mr_independence_desc", desc: t("periods_mr_independence_desc", "National Archives of Mauritania in Nouakchott, traditional Mahdhara school genealogies, and Ministry of Interior civil status.") },
      ],
    },
  ];

  return (
    <RootsPageShell
      hero={
        <div className="space-y-4">
          <SEO
            title={t("periods", "Historical Periods")}
            description="Explore Maghreb family history across historical eras: Carthaginian, Roman, Islamic conquests, Hafsid dynasty, Ottoman rule, French Protectorate, and post-independence civil records."
            keywords={["Maghreb historical periods", "Carthage genealogy", "Ottoman Maghreb history", "Maghrebi timeline"]}
          />
          <p className="text-sm uppercase tracking-[0.3em] text-[#C39637]">
            {t("periods_hero_label", "Historical Periods")}
          </p>
          <h1 className="text-5xl font-bold">
            {t("periods_hero_title", "Maghreb Genealogy Through Time")}
          </h1>
          <p className="max-w-4xl mx-auto text-lg opacity-90">
            {t(
              "periods_hero_intro",
              "Trace Maghreb family history from Carthaginian inscriptions through Islamic courts and Ottoman beylical archives to modern civil registration."
            )}
          </p>
        </div>
      }
    >
      <section className="roots-section">
        <div className="grid lg:grid-cols-2 gap-8">
          {periods.map((period) => (
            <div
              key={period.title}
              className={`${cardBg} p-8 rounded-2xl shadow-xl border ${borderColor}`}
              data-aos="fade-up"
            >
              <div className="flex items-center gap-4 mb-4">
                <period.icon className="w-10 h-10" style={{ color: period.accent }} />
                <h2 className="text-3xl font-bold">{period.title}</h2>
              </div>
              <p className="opacity-90 mb-4">{period.description}</p>
              <ul className="list-disc pl-6 space-y-3 opacity-90">
                {period.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="roots-section roots-section-alt">
        <h2 className="text-3xl font-bold text-center mb-8">
          {t("periods_timeline_title", "Timeline Overview")}
        </h2>
        <div className="relative border-l-4 border-[#C39637] ml-6 space-y-8">
          {timeline.map((item, index) => (
            <div key={item.period} className="pl-8" data-aos="fade-right" data-aos-delay={index * 150}>
              <h3 className="text-xl font-bold">{item.period}</h3>
              <p className="opacity-80 mt-1">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="roots-section">
        <h2 className="text-3xl font-bold text-center mb-8">
          {t("periods_research_focus_title", "Research Focus by Period")}
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {highlights.map((item: any) => (
            <div
              key={item.title}
              className={`${cardBg} p-6 rounded-2xl shadow-xl border ${borderColor}`}
              data-aos="zoom-in"
            >
              <div className="flex items-center gap-4 mb-3">
                <item.icon className="w-9 h-9 text-[#C39637]" />
                <h3 className="text-2xl font-bold">{item.title}</h3>
              </div>
              <p className="opacity-90">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ========== PERIODS BY COUNTRY (Interactive) ========== */}
      <section className="roots-section roots-section-alt" id="periods-by-country">
        <h2 className="text-4xl font-bold mb-4 border-l-8 border-[#C39637] pl-4">
          {t("periods_by_country_title", "Periods in Maghreb History")}
        </h2>
        <p className="text-lg opacity-90 mb-6">
          {t(
            "periods_by_country_intro",
            "Historical periods and key dates for genealogical research in the Maghreb."
          )}
        </p>
        <p className="text-sm opacity-75 mb-8">
          {t("periods_click_to_expand", "Click to expand and see detailed periods and research tips.")}
        </p>

        <div className="space-y-4">
          {periodsByCountry.map((c) => {
            const isExpanded = expandedCountry === c.countryKey;
            return (
              <div
                key={c.countryKey}
                className={`${cardBg} rounded-2xl shadow-xl border-2 overflow-hidden transition-all duration-300 ${borderColor} ${isExpanded ? "ring-2 ring-[#C39637] ring-offset-2 dark:ring-offset-[#092C2B]" : ""}`}
                data-aos="fade-up"
              >
                <button
                  type="button"
                  onClick={() => setExpandedCountry(isExpanded ? null : c.countryKey)}
                  className={`w-full flex items-center justify-between gap-4 p-6 text-left ${hoverBg} transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C39637] focus-visible:ring-offset-2 rounded-t-2xl`}
                  aria-expanded={isExpanded}
                  aria-controls={`periods-content-${c.countryKey}`}
                  id={`periods-header-${c.countryKey}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#C39637]/15 text-[#C39637]">
                      <Map className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-[#C39637]">{c.country}</h3>
                      <p className="text-sm opacity-80 mt-0.5 max-w-2xl">{c.intro}</p>
                    </div>
                  </div>
                  <span className="flex-shrink-0 text-[#C39637]" aria-hidden>
                    {isExpanded ? <ChevronDown className="w-7 h-7" /> : <ChevronRight className="w-7 h-7" />}
                  </span>
                </button>

                <div
                  id={`periods-content-${c.countryKey}`}
                  role="region"
                  aria-labelledby={`periods-header-${c.countryKey}`}
                  className={`grid transition-all duration-300 ease-out ${isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                >
                  <div className="overflow-hidden">
                    <div className="pt-2 pb-6 px-6 border-t border-[#C39637]/20">
                      <div className="relative pl-8 space-y-6">
                        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#C39637] via-[#C39637]/60 to-[#C39637]/20 rounded-full" />
                        {c.periods.map((p) => (
                          <div key={p.key} className="relative">
                            <div className="absolute -left-8 flex items-center justify-center w-6 h-6 rounded-full bg-[#C39637] text-white">
                              <Calendar className="w-3.5 h-3.5" />
                            </div>
                            <div className={`${cardBg} p-4 rounded-xl border ${borderColor} shadow-sm`}>
                              <h4 className="font-bold text-lg text-[#C39637] mb-2">{p.label}</h4>
                              <p className="opacity-90 text-sm leading-relaxed">{p.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </RootsPageShell>
  );
}
