import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Camera,
  GitBranch,
  Mic,
  Landmark,
  FileText,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  MapPin,
} from "lucide-react";
import eljem from "../assets/eljem.jpg";
import carthageRuins from "../assets/01_Carthage_Ancient_Ruins_Landscape.jpg";
import elJemPanorama from "../assets/04_El_Jem_Amphitheater_Panorama.jpg";
import sidiBouSaidDoors from "../assets/11_Sidi_Bou_Said_Blue_Doors_Bougainvillea.jpg";
import kairouanMosque from "../assets/14_Kairouan_Mosque_Arched_Doorways_Dome.jpg";
import medinaDoor from "../assets/16_Medina_Ornate_Door_Blue_Grille.jpg";
import mosqueTilework from "../assets/07_Mosque_Mihrab_Intricate_Tilework.jpg";
import sidiBouSaidCourtyard from "../assets/12_Sidi_Bou_Said_Blue_Gate_Courtyard.jpg";
import kairouanMinaret from "../assets/13_Kairouan_Minaret_Night_Illuminated.jpg";
import fortressPalms from "../assets/17_Fortress_Aerial_Courtyard_Palms.jpg";
import { Section, SectionHeading, InfoCard } from "../components/site/Primitives";
import { TreeCard, type TreeRecord } from "../components/site/TreeCard";
import TunisiaGovernoratesMap from "../components/TunisiaGovernoratesMap";
import SEO from "../components/SEO";
import { useTranslation } from "../context/TranslationContext";
import { api } from "../api/client";
import { useSiteContent } from "../hooks/useSiteContent";
import { getApiRoot } from "../api/helpers";

function resolveBannerUrl(pathOrUrl?: string | null) {
  const raw = String(pathOrUrl || "").trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw) || raw.startsWith("data:")) return raw;
  const root = String(getApiRoot() || "").replace(/\/+$/, "");
  if (raw.startsWith("/")) return `${root}${raw}`;
  return `${root}/${raw}`;
}

const slides = [
  { image: carthageRuins, labelKey: "hero_slide_carthage" },
  { image: sidiBouSaidDoors, labelKey: "hero_slide_sidi" },
  { image: kairouanMosque, labelKey: "hero_slide_kairouan" },
  { image: elJemPanorama, labelKey: "hero_slide_eljem" },
  { image: medinaDoor, labelKey: "hero_slide_medina" },
  { image: fortressPalms, labelKey: "hero_slide_fortress" },
];

const stats = [
  { valueKey: "stat_val_years", labelKey: "stat_years_history", to: "/periods" },
  { valueKey: "stat_val_governorates", labelKey: "stat_governorates", to: "/archives" },
  { valueKey: "stat_val_records", labelKey: "stat_records", to: "/gallery/trees" },
  { valueKey: "stat_val_sources", labelKey: "stat_sources", to: "/sources" },
];

const tools = [
  {
    icon: GitBranch,
    titleKey: "tool_trees_title",
    bodyKey: "tool_trees_body",
    to: "/gallery/trees",
  },
  {
    icon: Camera,
    titleKey: "tool_photos_title",
    bodyKey: "tool_photos_body",
    to: "/gallery",
  },
  {
    icon: BookOpen,
    titleKey: "tool_library_title",
    bodyKey: "tool_library_body",
    to: "/library",
  },
  {
    icon: Mic,
    titleKey: "tool_oral_title",
    bodyKey: "tool_oral_body",
    to: "/audio",
  },
  {
    icon: Landmark,
    titleKey: "tool_sources_title",
    bodyKey: "tool_sources_body",
    to: "/sources",
  },
  {
    icon: FileText,
    titleKey: "nav_articles",
    bodyKey: "articles_intro",
    to: "/gallery/articles",
  },
];

const timeline = [
  { id: "punic", eraKey: "era_punic_title", detailKey: "era_punic_detail", yearsKey: "era_punic_years" },
  { id: "roman", eraKey: "era_roman_title", detailKey: "era_roman_detail", yearsKey: "era_roman_years" },
  { id: "vandal", eraKey: "era_vandal_title", detailKey: "era_vandal_detail", yearsKey: "era_vandal_years" },
  { id: "aghabid", eraKey: "era_aghlabid_title", detailKey: "era_aghlabid_detail", yearsKey: "era_aghlabid_years" },
  { id: "hafsid", eraKey: "era_hafsid_title", detailKey: "era_hafsid_detail", yearsKey: "era_hafsid_years" },
  { id: "ottoman", eraKey: "era_ottoman_title", detailKey: "era_ottoman_detail", yearsKey: "era_ottoman_years" },
  { id: "protectorate", eraKey: "era_protectorate_title", detailKey: "era_protectorate_detail", yearsKey: "era_protectorate_years" },
  { id: "independence", eraKey: "era_independence_title", detailKey: "era_independence_detail", yearsKey: "era_independence_years" },
  { id: "contemporary", eraKey: "era_contemporary_title", detailKey: "era_contemporary_detail", yearsKey: "era_contemporary_years" },
];

const librarySources = [
  { key: "lib_src_manuscripts" },
  { key: "lib_src_etat_civil" },
  { key: "lib_src_nasab" },
  { key: "lib_src_ottoman" },
  { key: "lib_src_habous" },
  { key: "lib_src_maps" },
];

const archives = [
  { key: "arch_ant" },
  { key: "arch_charaiques" },
  { key: "arch_habous" },
  { key: "arch_anom" },
  { key: "arch_beylical" },
  { key: "arch_bnt" },
];

const gallery = [
  { image: carthageRuins, altKey: "gallery_alt_carthage" },
  { image: sidiBouSaidDoors, altKey: "gallery_alt_sidi_doors" },
  { image: mosqueTilework, altKey: "gallery_alt_tilework" },
  { image: elJemPanorama, altKey: "gallery_alt_eljem" },
  { image: medinaDoor, altKey: "gallery_alt_medina_door" },
  { image: fortressPalms, altKey: "gallery_alt_fortress" },
  { image: sidiBouSaidCourtyard, altKey: "gallery_alt_sidi_courtyard" },
  { image: kairouanMinaret, altKey: "gallery_alt_kairouan_night" },
];

export default function Home() {
  const { t, isRtl } = useTranslation();
  const [active, setActive] = useState(0);
  const [activeEraIndex, setActiveEraIndex] = useState(5); // Default to Ottoman & Beylical era
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [dbTrees, setDbTrees] = useState<any[]>([]);
  const [bannerSlides, setBannerSlides] = useState<any[]>(slides);
  const { getText, getImage } = useSiteContent();

  // Public Content Manager overrides (fall back to hardcoded/i18n defaults when unset).
  const heroImageOverride = getImage("home", "hero", "image");
  const activeSlides = useMemo(
    () =>
      heroImageOverride
        ? [{ image: heroImageOverride, label: "", labelKey: "" }]
        : bannerSlides,
    [heroImageOverride, bannerSlides],
  );
  const heroBadge = getText("home", "hero", "eyebrow") ?? t("site_badge");
  const heroTitle = getText("home", "hero", "title") ?? t("hero_title");
  const heroSubtitle = getText("home", "hero", "subtitle") ?? t("hero_subtitle");
  const preserveTitle = getText("home", "preserve", "title") ?? t("preserve_lineage_title");
  const preserveDesc = getText("home", "preserve", "description") ?? t("preserve_lineage_desc");
  const preserveImage = getImage("home", "preserve", "image") ?? eljem;
  const whyTitle = getText("home", "why", "title") ?? t("why_roots_tunisia_title");
  const whyIntro = getText("home", "why", "intro") ?? t("why_roots_tunisia_intro");
  const ctaTitle = getText("home", "cta", "title") ?? t("cta_preserve_history");
  const ctaDesc = getText("home", "cta", "description") ?? t("cta_desc");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/banner-slides");
        const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        if (list.length > 0) {
          setBannerSlides(
            list.map((row: any) => ({
              image: resolveBannerUrl(row.imagePath || row.image_path || row.imageUrl || row.image_url),
              label: String(row.caption || row.title || "").trim(),
              labelKey: "",
            })),
          );
        } else {
          // No active banners yet — keep branded defaults until admin checks slides
          setBannerSlides(slides);
        }
      } catch {
        setBannerSlides(slides);
      }
    })();
  }, []);

  useEffect(() => {
    if (!activeSlides.length) return;
    setActive(0);
    const id = setInterval(() => setActive((i) => (i + 1) % activeSlides.length), 6000);
    return () => clearInterval(id);
  }, [activeSlides.length]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/trees");
        const items = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        setDbTrees(items);
      } catch {
        setDbTrees([]);
      }
    })();
  }, []);

  const fallbackTrees: TreeRecord[] = [
    {
      id: "tunis-ben-achour",
      name: `${t("family_tree")} — ${t("fam_ben_achour")}`,
      owner: t("heritage_research"),
      description: t("gov_notes_tunis"),
      governorate: t("gov_name_tunis"),
      generations: 7,
      membersCount: 84,
      isLocalized: true,
    },
    {
      id: "sfax-fourati",
      name: `${t("family_tree")} — ${t("fam_fourati")}`,
      owner: t("heritage_research"),
      description: t("gov_notes_sfax"),
      governorate: t("gov_name_sfax"),
      generations: 6,
      membersCount: 62,
      isLocalized: true,
    },
    {
      id: "kairouan-chabbi",
      name: `${t("family_tree")} — ${t("fam_chabbi")}`,
      owner: t("heritage_research"),
      description: t("gov_notes_kairouan"),
      governorate: t("gov_name_kairouan"),
      generations: 8,
      membersCount: 96,
      isLocalized: true,
    },
  ];

  const displayedTrees =
    dbTrees.length >= 3
      ? dbTrees.slice(0, dbTrees.length >= 6 ? 6 : 3)
      : [...dbTrees, ...fallbackTrees].slice(0, 3);

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="text-[var(--foreground)] min-h-screen">
      <SEO
        title={t("seo_home_title")}
        description={t("seo_home_desc")}
        keywords={["Roots Tunisia", "Tunisian genealogy", "Tunisia family tree", "Archives Nationales de Tunisie", "Carthage history"]}
      />

      {/* Hero slider (Diaporama) */}
      <section className="w-full px-4 pt-4 sm:px-6 lg:px-8">
        <div className="frame-gold relative mx-auto max-w-[var(--content-max)] overflow-hidden rounded-md min-h-[460px] sm:min-h-[540px] lg:min-h-[600px] flex items-center justify-center">
          {activeSlides.map((s, i) => (
            <img
              key={s.labelKey || s.image || i}
              src={s.image}
              alt={s.label || (s.labelKey ? t(s.labelKey) : "Roots Tunisia")}
              width={1600}
              height={1000}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
                i === active ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
          <div className="hero-scrim absolute inset-0" />

          {/* Prev / Next Slide Controls */}
          <button
            type="button"
            aria-label={t("previous")}
            onClick={() => setActive((i) => (i - 1 + activeSlides.length) % activeSlides.length)}
            className="absolute start-3 top-1/2 -translate-y-1/2 z-20 hidden sm:flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-black/45 !text-white hover:bg-[#d9a441] hover:!text-[#1f160f] hover:border-[#d9a441] transition-colors cursor-pointer"
          >
            <ChevronLeft className={`h-5 w-5 ${isRtl ? "rotate-180" : ""}`} />
          </button>
          <button
            type="button"
            aria-label={t("next")}
            onClick={() => setActive((i) => (i + 1) % activeSlides.length)}
            className="absolute end-3 top-1/2 -translate-y-1/2 z-20 hidden sm:flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-black/45 !text-white hover:bg-[#d9a441] hover:!text-[#1f160f] hover:border-[#d9a441] transition-colors cursor-pointer"
          >
            <ChevronRight className={`h-5 w-5 ${isRtl ? "rotate-180" : ""}`} />
          </button>

          <div className="relative z-10 flex w-full flex-col items-center justify-center px-5 py-12 sm:px-16 sm:py-16 text-center">
            <p className="eyebrow !text-[#f5c857] text-shadow-dark tracking-widest font-bold">
              {heroBadge}
            </p>
            <h1 className="display-xl mt-4 max-w-4xl !text-white font-bold hero-title-shadow text-shadow-glow tracking-wide">
              {heroTitle}
            </h1>
            <div className="gold-rule mt-5 w-32 mx-auto shadow-lg" />
            <p className="mt-5 max-w-2xl text-sm leading-relaxed !text-white drop-shadow-md font-medium sm:text-base">
              {heroSubtitle}
            </p>
            <div className="mt-8 flex w-full sm:w-auto flex-col sm:flex-row flex-wrap justify-center gap-3">
              <Link to="/sources" className="btn-base btn-gold w-full sm:w-auto min-w-[200px]">
                {t("start_exploring")}
              </Link>
              <Link to="/gallery/trees" className="btn-base btn-outline-light !text-white hover:!text-white w-full sm:w-auto min-w-[200px]">
                {t("browse_family_trees")}
              </Link>
            </div>
            <div className="mt-6 flex flex-col items-center gap-2">
              {(() => {
                const currentSlide = activeSlides[active] || activeSlides[0] || slides[0];
                const slideLabel = currentSlide?.label?.trim() || (currentSlide?.labelKey ? t(currentSlide.labelKey) : "");
                if (!slideLabel) return null;
                return (
                  <Link
                    to="/gallery"
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-black/45 px-3 py-1 text-xs font-semibold !text-[#f5c857] hover:bg-black/65 transition-colors"
                  >
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{slideLabel}</span>
                  </Link>
                );
              })()}
              <div className="flex gap-2 mt-1">
                {activeSlides.map((s, i) => (
                  <button
                    key={s.labelKey || s.image || i}
                    aria-label={`${t("hero_show_slide")} ${i + 1}`}
                    onClick={() => setActive(i)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      i === active ? "w-10 bg-[#f5c857]" : "w-4 bg-white/60 hover:bg-white/90"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="w-full px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8">
        <div className="mx-auto max-w-[var(--content-max)]">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-[var(--gold)]/45 bg-[var(--gold)]/35 md:grid-cols-4 shadow-md">
            {stats.map((s) => (
              <Link
                key={s.labelKey}
                to={s.to}
                className="group flex flex-col items-center justify-center min-h-[120px] sm:min-h-[140px] bg-[var(--card)]/95 backdrop-blur-sm px-3 py-6 sm:px-6 sm:py-8 text-center transition-colors hover:bg-[var(--card)]"
              >
                <p className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--primary)] dark:text-[var(--gold)] group-hover:text-[var(--gold)] transition-colors">
                  {t(s.valueKey)}
                </p>
                <p className="mt-2 inline-flex items-center justify-center gap-1 text-[0.68rem] sm:text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[var(--foreground)] group-hover:text-[var(--gold)] transition-colors">
                  <span>{t(s.labelKey)}</span>
                  <span className="opacity-60 group-hover:opacity-100">{isRtl ? "←" : "→"}</span>
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Preserve banner - Historic Tunisian El Jem Landmark Background */}
      <Section>
        <div className="frame-gold relative overflow-hidden rounded-md shadow-xl min-h-[320px] sm:min-h-[360px] flex items-center justify-center">
          <img
            src={preserveImage}
            alt={t("eljem_colosseum_alt")}
            loading="lazy"
            width={1600}
            height={800}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/65 to-black/80" />
          <div className="relative z-10 flex w-full flex-col items-center justify-center px-5 py-12 sm:px-12 sm:py-16 text-center">
            <p className="eyebrow !text-[#f5c857] text-shadow-dark font-bold">{t("site_title")}</p>
            <h2 className="display-lg mt-3 max-w-3xl !text-white font-semibold hero-title-shadow">
              {preserveTitle}
            </h2>
            <p className="mt-4 max-w-2xl text-sm !text-white/95 leading-relaxed font-medium drop-shadow sm:text-base">
              {preserveDesc}
            </p>
            <div className="mt-6 flex w-full sm:w-auto flex-col sm:flex-row flex-wrap justify-center gap-3">
              <Link to="/gallery/trees" className="btn-base btn-gold w-full sm:w-auto min-w-[200px]">
                {t("browse_family_trees")}
              </Link>
              <Link to="/sources" className="btn-base btn-outline-light !text-white hover:!text-white w-full sm:w-auto min-w-[200px]">
                {t("start_exploring")}
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* Why Roots Tunisia */}
      <Section className="!pt-0">
        <SectionHeading
          center={true}
          eyebrow={t("why_roots_tunisia_eyebrow")}
          title={whyTitle}
          intro={whyIntro}
        />

        {/* 3 Symmetric Info Cards */}
        <div className="mt-8 sm:mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
          <InfoCard
            title={t("primary_evidence_title")}
            body={t("primary_evidence_body")}
            to="/sources"
            actionLabel={`${t("open_tool")} ${isRtl ? "←" : "→"}`}
          />
          <InfoCard
            title={t("territorial_depth_title")}
            body={t("territorial_depth_body")}
            to="/archives"
            actionLabel={`${t("open_tool")} ${isRtl ? "←" : "→"}`}
          />
          <InfoCard
            title={t("period_context_title")}
            body={t("period_context_body")}
            to="/periods"
            actionLabel={`${t("open_tool")} ${isRtl ? "←" : "→"}`}
          />
        </div>

        {/* Medina Heritage Feature Banner */}
        <div className="mt-8 sm:mt-12 frame-gold relative overflow-hidden rounded-md shadow-xl bg-[var(--card)]">
          <div className="grid items-center lg:grid-cols-12 min-h-[260px] sm:min-h-[280px]">
            <div className="p-6 sm:p-8 lg:p-10 lg:col-span-7 flex flex-col justify-center">
              <p className="eyebrow text-primary dark:text-[var(--gold)] font-bold">
                {t("site_title")}
              </p>
              <h3 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold mt-2 text-[var(--foreground)]">
                {t("why_roots_tunisia_title")}
              </h3>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-[var(--muted-foreground)]">
                {t("why_roots_tunisia_paragraph_2")}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/about" className="btn-base btn-gold">
                  {t("nav_about")} {isRtl ? "←" : "→"}
                </Link>
                <Link to="/gallery/trees" className="btn-base btn-outline">
                  {t("browse_family_trees")}
                </Link>
              </div>
            </div>
            <div className="relative h-64 lg:h-full min-h-[240px] lg:col-span-5 overflow-hidden">
              <img
                src={medinaDoor}
                alt={t("medina_door_alt")}
                width={800}
                height={600}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 start-3 end-3 rounded bg-black/60 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold !text-white text-center sm:text-start">
                {t("medina_door_alt")}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Tools */}
      <Section>
        <SectionHeading
          eyebrow={t("research_tools_eyebrow")}
          title={t("research_tools_title")}
          intro={t("research_tools_intro")}
        />
        <div className="mt-10 sm:mt-12 grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.titleKey}
                to={tool.to}
                className="surface-card group flex h-full flex-col p-5 sm:p-6 text-start transition-transform hover:-translate-y-1 hover:border-[var(--gold)]/60 bg-[var(--card)]/95 backdrop-blur-sm"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--gold)]/15 text-[var(--gold)] ring-1 ring-[var(--gold)]/45">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-xl font-bold text-[var(--foreground)] group-hover:text-[var(--gold)] transition-colors">
                  {t(tool.titleKey)}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--muted-foreground)]">
                  {t(tool.bodyKey)}
                </p>
                <div className="mt-6 pt-4 border-t border-[var(--gold)]/25">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[var(--gold)] group-hover:text-[var(--primary)] group-hover:underline transition-colors">
                    {t("open_tool")} {isRtl ? "←" : "→"}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </Section>

      {/* Timeline (Interactive 9-Era Explorer) */}
      <Section className="bg-[var(--secondary)]/40">
        <SectionHeading
          eyebrow={t("tunisian_timeline_eyebrow")}
          title={t("tunisian_timeline_title")}
          intro={t("tunisian_timeline_intro")}
        />
        <div className="mt-10 sm:mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
          {timeline.map((item, idx) => {
            const isSelected = activeEraIndex === idx;
            const isLastOdd = idx === timeline.length - 1;
            return (
              <div
                key={item.eraKey}
                role="button"
                tabIndex={0}
                onClick={() => setActiveEraIndex(idx)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveEraIndex(idx);
                  }
                }}
                className={`surface-card group flex h-full flex-col justify-between p-5 text-start transition-all cursor-pointer hover:-translate-y-0.5 bg-[var(--card)]/95 backdrop-blur-sm ${
                  isLastOdd ? "sm:col-span-2 lg:col-span-1" : ""
                } ${
                  isSelected
                    ? "border-2 border-[var(--gold)] ring-2 ring-[var(--gold)]/30 shadow-lg"
                    : "hover:border-[var(--gold)]/60"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-lg font-bold text-[var(--foreground)] group-hover:text-[var(--gold)] transition-colors">
                      {t(item.eraKey)}
                    </h3>
                    <span className="rounded-sm bg-[var(--gold)]/15 border border-[var(--gold)]/35 px-2 py-0.5 text-[0.68rem] font-bold text-[var(--gold)] shrink-0">
                      {t(item.yearsKey)}
                    </span>
                  </div>
                  <p className="mt-2.5 text-xs leading-relaxed text-[var(--muted-foreground)]">
                    {t(item.detailKey)}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[var(--gold)]/20 flex items-center justify-between">
                  <Link
                    to={`/periods#period-${item.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.14em] text-[var(--gold)] hover:text-[var(--primary)] hover:underline"
                  >
                    {t("open_tool")} {isRtl ? "←" : "→"}
                  </Link>
                  <span dir="ltr" className="text-[0.65rem] font-mono font-bold text-[var(--muted-foreground)]">
                    0{idx + 1} / 0{timeline.length}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Selected Era Spotlight Bar */}
        {timeline[activeEraIndex] && (
          <div className="mt-8 surface-card frame-gold p-5 sm:p-6 rounded-lg bg-[var(--card)] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
            <div className="space-y-1.5 text-start">
              <div className="flex flex-wrap items-center gap-2">
                <span className="eyebrow text-[var(--gold)]">{t("tunisian_timeline_eyebrow")}</span>
                <span className="rounded-sm bg-[var(--gold)]/15 border border-[var(--gold)]/35 px-2 py-0.5 text-xs font-bold text-[var(--gold)]">
                  {t(timeline[activeEraIndex].yearsKey)}
                </span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[var(--foreground)]">
                {t(timeline[activeEraIndex].eraKey)}
              </h3>
              <p className="text-sm text-[var(--muted-foreground)] max-w-3xl leading-relaxed">
                {t(timeline[activeEraIndex].detailKey)}
              </p>
            </div>
            <div className="flex w-full sm:w-auto flex-col sm:flex-row flex-wrap gap-3 shrink-0">
              <Link
                to={`/periods#period-${timeline[activeEraIndex].id}`}
                className="btn-base btn-gold w-full sm:w-auto"
              >
                {t("explore_all_9_periods")}
              </Link>
              <Link to="/sources" className="btn-base btn-outline-ink w-full sm:w-auto">
                {t("nav_sources")}
              </Link>
            </div>
          </div>
        )}
      </Section>

      {/* Sources & Archives (Symmetric 2-Column Grid with 6 Items Each) */}
      <Section>
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-10 items-stretch">
          <div className="surface-card p-6 sm:p-8 flex flex-col justify-between bg-[var(--card)]/95">
            <div>
              <SectionHeading
                center={false}
                eyebrow={t("primary_sources_eyebrow")}
                title={t("digitized_catalogued_records")}
                intro={t("digitized_records_intro")}
              />
              <ul className="mt-6 space-y-2.5">
                {librarySources.map((s) => (
                  <li key={s.key}>
                    <Link
                      to="/library"
                      className="surface-card group flex items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-[var(--foreground)] hover:border-[var(--gold)] hover:-translate-y-0.5 transition-all bg-[var(--background)]/70"
                    >
                      <span className="flex items-center gap-3 text-start">
                        <span className="h-2 w-2 rounded-full bg-[var(--gold)] shrink-0" />
                        <span className="group-hover:text-[var(--gold)] transition-colors">{t(s.key)}</span>
                      </span>
                      <span className="text-xs font-bold text-[var(--gold)] shrink-0">
                        {isRtl ? "←" : "→"}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8 pt-4 border-t border-[var(--gold)]/20">
              <Link to="/library" className="btn-base btn-red w-full sm:w-auto">
                {t("browse_library")}
              </Link>
            </div>
          </div>
          <div className="surface-card p-6 sm:p-8 flex flex-col justify-between bg-[var(--card)]/95">
            <div>
              <SectionHeading
                center={false}
                eyebrow={t("archival_repositories_eyebrow")}
                title={t("official_archives_title")}
                intro={t("official_archives_intro")}
              />
              <ul className="mt-6 space-y-2.5">
                {archives.map((a) => (
                  <li key={a.key}>
                    <Link
                      to="/archives"
                      className="surface-card group flex items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-[var(--foreground)] hover:border-[var(--gold)] hover:-translate-y-0.5 transition-all bg-[var(--background)]/70"
                    >
                      <span className="flex items-center gap-3 text-start">
                        <span className="h-2 w-2 rounded-full bg-[var(--primary)] shrink-0" />
                        <span className="group-hover:text-[var(--gold)] transition-colors">{t(a.key)}</span>
                      </span>
                      <span className="text-xs font-bold text-[var(--gold)] shrink-0">
                        {isRtl ? "←" : "→"}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8 pt-4 border-t border-[var(--gold)]/20">
              <Link to="/archives" className="btn-base btn-outline-ink w-full sm:w-auto">
                {t("view_archive_guide")}
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* Interactive Map Section */}
      <Section id="atlas-map" className="bg-[var(--secondary)]/30">
        <TunisiaGovernoratesMap />
      </Section>

      {/* Featured Trees */}
      <Section>
        <SectionHeading
          eyebrow={t("genealogical_trees_eyebrow")}
          title={t("featured_trees_title")}
          intro={t("featured_trees_intro")}
        />
        <div className="mt-10 sm:mt-12 grid gap-6 md:grid-cols-3 items-stretch">
          {displayedTrees.map((tree) => (
            <TreeCard key={tree.id} tree={tree} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link to="/gallery/trees" className="btn-base btn-gold w-full sm:w-auto">
            {t("browse_all_family_trees")}
          </Link>
        </div>
      </Section>

      {/* Photo Gallery Grid (Interactive Lightbox + Full Gallery Link) */}
      <Section className="bg-[var(--secondary)]/40">
        <SectionHeading
          eyebrow={t("visual_heritage")}
          title={t("tunisia_photo_manuscript")}
          intro={t("tunisia_photo_desc")}
        />
        <div className="mt-10 sm:mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {gallery.map((item, i) => {
            const caption = t(item.altKey);
            return (
              <button
                key={i}
                type="button"
                onClick={() => setLightboxIndex(i)}
                className="frame-gold group relative block aspect-[4/3] w-full overflow-hidden rounded-md text-start cursor-pointer"
              >
                <img
                  src={item.image}
                  alt={caption}
                  loading="lazy"
                  width={600}
                  height={450}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/85 via-black/35 to-transparent p-2.5 sm:p-3 opacity-90 sm:opacity-0 transition-opacity group-hover:opacity-100">
                  <p className="text-[0.7rem] sm:text-xs !text-white font-medium line-clamp-2">{caption}</p>
                  <span className="flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-full bg-[#d9a441] !text-[#1f160f]">
                    <Eye className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
        <div className="mt-10 text-center">
          <Link to="/gallery" className="btn-base btn-red w-full sm:w-auto">
            {t("open_full_photo_gallery")}
          </Link>
        </div>
      </Section>

      {/* Interactive Photo Lightbox Modal */}
      {lightboxIndex !== null && gallery[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <div
            className="surface-card frame-gold relative max-w-4xl w-full overflow-hidden rounded-xl bg-[var(--card)] p-4 sm:p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label={t("close")}
              onClick={() => setLightboxIndex(null)}
              className="absolute top-3 end-3 z-20 rounded-full bg-[var(--background)] p-2 text-[var(--foreground)] hover:bg-[var(--gold)]/20 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative overflow-hidden rounded-lg">
              <img
                src={gallery[lightboxIndex].image}
                alt={t(gallery[lightboxIndex].altKey)}
                className="max-h-[68vh] w-full object-cover rounded-lg"
              />
              <button
                type="button"
                aria-label={t("previous")}
                onClick={() => setLightboxIndex((i) => ((i ?? 0) - 1 + gallery.length) % gallery.length)}
                className="absolute start-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/65 !text-white hover:bg-[#d9a441] hover:!text-[#1f160f] cursor-pointer"
              >
                <ChevronLeft className={`h-5 w-5 ${isRtl ? "rotate-180" : ""}`} />
              </button>
              <button
                type="button"
                aria-label={t("next")}
                onClick={() => setLightboxIndex((i) => ((i ?? 0) + 1) % gallery.length)}
                className="absolute end-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/65 !text-white hover:bg-[#d9a441] hover:!text-[#1f160f] cursor-pointer"
              >
                <ChevronRight className={`h-5 w-5 ${isRtl ? "rotate-180" : ""}`} />
              </button>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="eyebrow text-[var(--gold)]">{t("visual_heritage")}</p>
                <h3 className="font-display text-xl font-bold text-[var(--foreground)]">
                  {t(gallery[lightboxIndex].altKey)}
                </h3>
              </div>
              <Link
                to="/gallery"
                onClick={() => setLightboxIndex(null)}
                className="btn-base btn-gold w-full sm:w-auto"
              >
                {t("open_full_photo_gallery")}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Call to action */}
      <Section>
        <div className="surface-card relative overflow-hidden rounded-lg p-6 sm:p-10 md:p-16 text-center border-2 border-[var(--gold)]/50 bg-[var(--card)]/95 backdrop-blur-sm">
          <div className="zellige absolute inset-0 opacity-25 pointer-events-none" />
          <p className="eyebrow relative z-10">{t("start_your_journey")}</p>
          <h2 className="display-lg relative z-10 mt-3 text-[var(--foreground)]">
            {ctaTitle}
          </h2>
          <p className="relative z-10 mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[var(--muted-foreground)]">
            {ctaDesc}
          </p>
          <div className="relative z-10 mt-8 flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
            <Link to="/signup" className="btn-base btn-red px-8 py-3.5 w-full sm:w-auto min-w-[200px]">
              {t("create_free_account")}
            </Link>
            <Link to="/subscriptions" className="btn-base btn-outline-ink px-8 py-3.5 w-full sm:w-auto min-w-[200px]">
              {t("view_plans_tiers")}
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
}
