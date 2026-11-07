import { Link } from "react-router-dom";
import { Landmark, BookOpen, ScrollText, MapPinned, Search, Compass, ShieldCheck, Sparkles } from "lucide-react";
import { PageHero, Section, SectionHeading, InfoCard } from "../components/site/Primitives";
import TunisiaGovernoratesMap from "../components/TunisiaGovernoratesMap";
import SEO from "../components/SEO";
import { useTranslation } from "../context/TranslationContext";
import { useSiteContent } from "../hooks/useSiteContent";
import carthage from "../assets/slider-carthage.jpg";
import kairouan from "../assets/slider-kairouan.jpg";
import manuscript from "../assets/family-archive.jpg";
import medina from "../assets/medina-tunis.jpg";

export default function About() {
  const { t, isRtl } = useTranslation();
  const { getText, getImage } = useSiteContent();

  // Public Content Manager overrides (hardcoded/i18n defaults when unset).
  const heroEyebrow = getText("about", "hero", "eyebrow") ?? t("nav_about");
  const heroTitle = getText("about", "hero", "title") ?? t("about_hero_title");
  const heroSubtitle = getText("about", "hero", "subtitle") ?? t("about_hero_subtitle");
  const heroImage = getImage("about", "hero", "image") ?? carthage;
  const missionTitle = getText("about", "mission", "title") ?? t("about_mission_title");
  const missionIntro = getText("about", "mission", "intro") ?? t("about_mission_intro");
  const ctaTitle = getText("about", "cta", "title") ?? t("about_cta_title");

  const pillars = [
    {
      icon: Landmark,
      eraBadge: "814 BC – 439 AD",
      title: t("about_carthage_title"),
      body: t("about_carthage_body"),
      to: "/periods#period-punic",
    },
    {
      icon: BookOpen,
      eraBadge: "670 – 1574 AD",
      title: t("about_kairouan_title"),
      body: t("about_kairouan_body"),
      to: "/periods#period-islamic",
    },
    {
      icon: ScrollText,
      eraBadge: "1574 – 1881 AD",
      title: t("about_sijillat_title"),
      body: t("about_sijillat_body"),
      to: "/archives",
    },
    {
      icon: MapPinned,
      eraBadge: "1886 – Present",
      title: t("about_civil_title"),
      body: t("about_civil_body"),
      to: "/sources",
    },
  ];

  const methodologySteps = [
    {
      icon: Compass,
      stepKey: "01",
      title: t("about_method_step_1_title"),
      desc: t("about_method_step_1_desc"),
    },
    {
      icon: ShieldCheck,
      stepKey: "02",
      title: t("about_method_step_2_title"),
      desc: t("about_method_step_2_desc"),
    },
    {
      icon: Sparkles,
      stepKey: "03",
      title: t("about_method_step_3_title"),
      desc: t("about_method_step_3_desc"),
    },
  ];

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="bg-[var(--background)] text-[var(--foreground)] min-h-screen">
      <SEO
        title={t("about_seo_title")}
        description={t("about_seo_desc")}
        keywords={["About Roots Tunisia", "Tunisian genealogy archive", "Carthage lineage", "Ottoman sijillat Tunisia", "24 governorates"]}
      />

      <PageHero
        eyebrow={heroEyebrow}
        title={heroTitle}
        subtitle={heroSubtitle}
        image={heroImage}
      >
        <Link to="/sources" className="btn-base btn-gold w-full sm:w-auto min-w-[180px]">
          <Search className="h-4 w-4" />
          {t("start_exploring")}
        </Link>
        <Link to="/gallery/trees" className="btn-base btn-outline-light !text-white hover:!text-white w-full sm:w-auto min-w-[180px]">
          {t("browse_family_trees")}
        </Link>
      </PageHero>

      {/* 4 Pillars: 4-Column Grid */}
      <Section>
        <SectionHeading
          center={true}
          eyebrow={t("about_pillars_eyebrow")}
          title={missionTitle}
          intro={missionIntro}
        />
        <div className="mt-10 sm:mt-12 grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="surface-card group flex h-full flex-col justify-between p-6 rounded-lg border border-[var(--gold)]/35 hover:border-[var(--gold)] transition-all bg-[var(--card)]/95 backdrop-blur-sm shadow-md hover:-translate-y-1 text-start"
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--gold)]/15 text-[var(--gold)] ring-1 ring-[var(--gold)]/45">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span dir="ltr" className="rounded-sm bg-[var(--gold)]/15 border border-[var(--gold)]/35 px-2 py-0.5 text-[0.68rem] font-bold text-[var(--gold)]">
                      {pillar.eraBadge}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-xl font-bold text-[var(--foreground)] group-hover:text-[var(--gold)] transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[var(--muted-foreground)]">
                    {pillar.body}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[var(--gold)]/20">
                  <Link
                    to={pillar.to}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[var(--gold)] group-hover:text-[var(--primary)] group-hover:underline transition-colors"
                  >
                    {t("open_tool")} {isRtl ? "←" : "→"}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Deep Dive 1: Kairouan Panel */}
      <Section className="!pt-0">
        <div className="surface-card frame-gold overflow-hidden rounded-lg p-6 sm:p-8 lg:p-10 bg-[var(--card)]/95 shadow-xl">
          <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="relative h-[280px] sm:h-[340px] lg:h-[380px] lg:col-span-6 overflow-hidden rounded-md border border-[var(--gold)]/40 shadow-md">
              <img
                src={kairouan}
                alt={t("about_kairouan_title")}
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-3 start-3 end-3 rounded bg-black/60 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold !text-white text-center sm:text-start">
                {t("about_kairouan_title")} · {t("about_kairouan_eyebrow")}
              </div>
            </div>
            <div className="flex flex-col justify-center lg:col-span-6 text-start">
              <SectionHeading
                center={false}
                eyebrow={t("about_kairouan_eyebrow")}
                title={t("about_kairouan_panel_title")}
                intro={t("about_kairouan_panel_intro")}
              />
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/periods#period-islamic" className="btn-base btn-gold w-full sm:w-auto">
                  {t("explore_all_9_periods")} {isRtl ? "←" : "→"}
                </Link>
                <Link to="/sources" className="btn-base btn-outline w-full sm:w-auto">
                  {t("nav_sources")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Deep Dive 2: Ottoman Sijillat Panel */}
      <Section className="bg-[var(--secondary)]/35">
        <div className="surface-card frame-gold overflow-hidden rounded-lg p-6 sm:p-8 lg:p-10 bg-[var(--card)]/95 shadow-xl">
          <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="flex flex-col justify-center lg:col-span-6 text-start order-2 lg:order-1">
              <SectionHeading
                center={false}
                eyebrow={t("about_sijillat_eyebrow")}
                title={t("about_sijillat_panel_title")}
                intro={t("about_sijillat_panel_intro")}
              />
              <div className="mt-6 grid gap-4 sm:grid-cols-2 items-stretch">
                <InfoCard
                  title={t("about_habous_title")}
                  body={t("about_habous_body")}
                  to="/archives"
                  actionLabel={`${t("open_tool")} ${isRtl ? "←" : "→"}`}
                />
                <InfoCard
                  title={t("about_etat_civil_title")}
                  body={t("about_etat_civil_body")}
                  to="/sources"
                  actionLabel={`${t("open_tool")} ${isRtl ? "←" : "→"}`}
                />
              </div>
            </div>
            <div className="relative h-[280px] sm:h-[340px] lg:h-[380px] lg:col-span-6 overflow-hidden rounded-md border border-[var(--gold)]/40 shadow-md order-1 lg:order-2">
              <img
                src={manuscript}
                alt={t("about_sijillat_title")}
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-3 start-3 end-3 rounded bg-black/60 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold !text-white text-center sm:text-start">
                {t("about_sijillat_title")} · {t("about_sijillat_eyebrow")}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* 3-Step Research Methodology */}
      <Section>
        <SectionHeading
          center={true}
          eyebrow={t("about_methodology_eyebrow")}
          title={t("about_methodology_title")}
          intro={t("digitized_records_intro")}
        />
        <div className="mt-10 sm:mt-12 grid gap-6 md:grid-cols-3 items-stretch">
          {methodologySteps.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.stepKey}
                className="surface-card flex h-full flex-col justify-between p-6 sm:p-7 rounded-lg border border-[var(--gold)]/35 bg-[var(--card)]/95 shadow-md text-start"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--gold)]/15 text-[var(--gold)] ring-1 ring-[var(--gold)]/45">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span dir="ltr" className="font-mono text-2xl font-bold text-[var(--gold)]/50">
                      {m.stepKey}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-lg sm:text-xl font-bold text-[var(--foreground)]">
                    {m.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--muted-foreground)]">
                    {m.desc}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[var(--gold)]/20">
                  <span className="text-xs font-bold text-[var(--gold)] uppercase tracking-wider">
                    {t("site_title")}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* 24 Governorates Interactive Map */}
      <Section id="governorates-map" className="bg-[var(--secondary)]/30">
        <SectionHeading
          center={true}
          eyebrow={t("about_map_eyebrow")}
          title={t("about_map_title")}
          intro={t("about_map_intro")}
        />
        <div className="mt-8 sm:mt-10">
          <TunisiaGovernoratesMap />
        </div>
      </Section>

      {/* Call to action */}
      <Section className="!pt-0">
        <div className="frame-gold relative overflow-hidden rounded-lg shadow-2xl min-h-[300px] sm:min-h-[340px] flex items-center justify-center">
          <img
            src={medina}
            alt={t("about_medina_alt")}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/85" />
          <div className="relative z-10 flex w-full flex-col items-center justify-center px-6 py-12 sm:px-12 sm:py-16 text-center">
            <p className="eyebrow !text-[#f5c857] text-shadow-dark font-bold">{t("site_title")}</p>
            <h2 className="display-lg mt-3 max-w-3xl !text-white font-semibold hero-title-shadow">
              {ctaTitle}
            </h2>
            <div className="mt-8 flex w-full sm:w-auto flex-col sm:flex-row flex-wrap justify-center gap-3">
              <Link to="/sources" className="btn-base btn-gold w-full sm:w-auto min-w-[200px]">
                {t("start_exploring")}
              </Link>
              <Link to="/contact" className="btn-base btn-outline-light !text-white hover:!text-white w-full sm:w-auto min-w-[200px]">
                {t("nav_contact")}
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
