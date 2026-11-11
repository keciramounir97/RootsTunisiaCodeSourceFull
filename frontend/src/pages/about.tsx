import { Link } from "react-router-dom";
import {
  BookOpen,
  Landmark,
  MapPinned,
  ScrollText,
  Search,
} from "lucide-react";
import { PageHero, Section } from "../components/site/Primitives";
import TunisiaGovernoratesMap from "../components/TunisiaGovernoratesMap";
import SEO from "../components/SEO";
import { useTranslation } from "../context/TranslationContext";
import { useSiteContent } from "../hooks/useSiteContent";
import SiteCustomBlocks from "../components/cms/SiteCustomBlocks";
import carthage from "../assets/slider-carthage.jpg";
import medina from "../assets/medina-tunis.jpg";

export default function About() {
  const { t, isRtl } = useTranslation();
  const { getText, getImage } = useSiteContent();

  const brand = t("site_title", "Roots Tunisia");
  const heroEyebrow = getText("about", "hero", "eyebrow") ?? brand;
  const heroTitle = getText("about", "hero", "title") ?? t("about_hero_title", "Roots Tunisia");
  const heroSubtitle =
    getText("about", "hero", "subtitle") ??
    t(
      "about_hero_subtitle",
      "From Carthage to the civil registers — a living archive of Tunisian lineages.",
    );
  const heroImage = getImage("about", "hero", "image") ?? carthage;
  const missionTitle =
    getText("about", "mission", "title") ??
    t(
      "about_mission_title",
      "Read Tunisia through its records, cities, and family names.",
    );
  const missionIntro =
    getText("about", "mission", "intro") ??
    t(
      "about_mission_intro",
      "Roots Tunisia gathers periods, sijillat, and governorate memory so families can verify what oral history alone cannot hold.",
    );
  const ctaTitle =
    getText("about", "cta", "title") ??
    t("about_cta_title", "Start in the archives");

  const themes = [
    {
      icon: Landmark,
      meta: "814 BC – 439 AD",
      title: t("about_carthage_title", "Carthage & Roman Africa"),
      body: t(
        "about_carthage_body",
        "Coastal cities, roads, and provincial families that still echo in place names and lineages.",
      ),
      to: "/periods",
    },
    {
      icon: BookOpen,
      meta: "670 – 1574",
      title: t("about_kairouan_title", "Kairouan & Islamic learning"),
      body: t(
        "about_kairouan_body",
        "Scholarship, madinas, and manuscript culture that shaped Tunisian family memory.",
      ),
      to: "/periods",
    },
    {
      icon: ScrollText,
      meta: "1574 – 1881",
      title: t("about_sijillat_title", "Ottoman sijillat"),
      body: t(
        "about_sijillat_body",
        "Court registers, habous, and notarial acts — the backbone of documentary genealogy.",
      ),
      to: "/archives",
    },
    {
      icon: MapPinned,
      meta: "1886 – today",
      title: t("about_civil_title", "Civil status & diaspora"),
      body: t(
        "about_civil_body",
        "État civil, migration dossiers, and modern trees across the twenty-four governorates.",
      ),
      to: "/sources",
    },
  ];

  const practice = [
    {
      title: t("about_method_step_1_title", "Collect"),
      desc: t(
        "about_method_step_1_desc",
        "Gather civil acts, sijillat references, and family papers.",
      ),
    },
    {
      title: t("about_method_step_2_title", "Verify"),
      desc: t(
        "about_method_step_2_desc",
        "Cross-check places, dates, and archive codes before attaching them to a person.",
      ),
    },
    {
      title: t("about_method_step_3_title", "Transmit"),
      desc: t(
        "about_method_step_3_desc",
        "Publish trees and sources so the next generation inherits evidence, not only stories.",
      ),
    },
  ];

  const pathways = [
    { to: "/periods", title: t("nav_periods", "Historical periods"), body: t("about_path_periods", "Nine eras from antiquity to independence.") },
    { to: "/sources", title: t("nav_sources", "Sources & archives"), body: t("about_path_sources", "Guides to Tunisian and overseas fonds.") },
    { to: "/archives", title: t("nav_archives", "Archives"), body: t("about_path_archives", "Sijillat, habous, and civil-status pathways.") },
    { to: "/gallery/trees", title: t("nav_trees", "Family trees"), body: t("about_path_trees", "Public Tunisian lineages and GEDCOM trees.") },
    { to: "/gallery", title: t("nav_gallery", "Gallery"), body: t("about_path_gallery", "Photos, documents, and oral collections.") },
    { to: "/contact", title: t("nav_contact", "Contact"), body: t("about_path_contact", "Reach the Roots Tunisia team.") },
  ];

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="about-page bg-[var(--background)] text-[var(--foreground)] min-h-screen">
      <SEO
        title={t("about_seo_title", `About | ${brand}`)}
        description={t("about_seo_desc", "About Roots Tunisia — Carthage, Kairouan, sijillat, and civil registers.")}
        keywords={["About Roots Tunisia", "Tunisian genealogy", "sijillat", "governorates"]}
      />

      <style>{`
        .about-page .about-fade { animation: aboutFadeUp 0.85s ease-out both; }
        .about-page .about-fade-delay { animation: aboutFadeUp 0.95s ease-out 0.12s both; }
        .about-page .about-map-frame { animation: aboutFadeUp 1s ease-out 0.08s both; }
        @keyframes aboutFadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .about-page .about-fade,
          .about-page .about-fade-delay,
          .about-page .about-map-frame { animation: none; }
        }
      `}</style>

      <PageHero eyebrow={heroEyebrow} title={heroTitle} subtitle={heroSubtitle} image={heroImage}>
        <Link to="/sources" className="btn-base btn-gold">
          <Search className="h-4 w-4" />
          {t("start_exploring", "Start exploring")}
        </Link>
        <Link to="/gallery/trees" className="btn-base btn-outline-light !text-white hover:!text-white">
          {t("browse_family_trees", "Family trees")}
        </Link>
      </PageHero>

      <Section className="about-fade">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end">
          <div>
            <p className="font-display text-[clamp(1.75rem,3.5vw,2.75rem)] leading-[1.15] text-[var(--foreground)]">
              {missionTitle}
            </p>
            <div className="gold-rule mt-6 w-20" />
          </div>
          <p className="text-base leading-relaxed text-[var(--muted-foreground)] sm:text-lg">
            {missionIntro}
          </p>
        </div>
      </Section>

      <Section className="!pt-0 about-fade-delay">
        <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-4 border-y border-[var(--gold)]/30">
          {themes.map(({ icon: Icon, meta, title, body, to }, index) => (
            <article
              key={title}
              className={`px-1 py-8 sm:px-5 sm:py-10 ${
                index > 0 ? "border-t sm:border-t-0 sm:border-s border-[var(--gold)]/25" : ""
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <Icon className="h-5 w-5 text-[var(--gold)]" aria-hidden />
                <span dir="ltr" className="text-[0.65rem] font-bold text-[var(--gold)]">
                  {meta}
                </span>
              </div>
              <h2 className="mt-4 font-display text-xl text-[var(--foreground)]">{title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-[var(--muted-foreground)]">{body}</p>
              <Link
                to={to}
                className="mt-4 inline-block text-xs font-bold uppercase tracking-[0.14em] text-[var(--gold)] hover:underline"
              >
                {t("open_tool", "Open")} {isRtl ? "←" : "→"}
              </Link>
            </article>
          ))}
        </div>
      </Section>

      <Section id="governorates-map" className="bg-[var(--secondary)]/35">
        <div className="mb-8 max-w-2xl">
          <p className="font-display text-2xl text-[var(--foreground)] sm:text-3xl">
            {t("about_map_title", "Twenty-four governorates")}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted-foreground)] sm:text-base">
            {t(
              "about_map_intro",
              "Place Tunisian families on the map — from Tunis and Sfax to the interior and the islands.",
            )}
          </p>
        </div>
        <div className="about-map-frame">
          <TunisiaGovernoratesMap />
        </div>
      </Section>

      <Section>
        <p className="font-display text-2xl text-[var(--foreground)] sm:text-3xl">
          {t("about_methodology_title", "How we work")}
        </p>
        <div className="mt-8 relative">
          <div
            className="pointer-events-none absolute start-[0.55rem] top-2 bottom-2 w-px bg-[var(--gold)]/40 md:start-0 md:inset-x-0 md:top-[0.85rem] md:bottom-auto md:h-px md:w-auto"
            aria-hidden
          />
          <div className="grid gap-8 md:grid-cols-3 md:gap-6">
            {practice.map(({ title, desc }) => (
              <div key={title} className="relative ps-7 md:ps-0 md:pt-8">
                <span className="absolute start-0 top-1.5 h-2.5 w-2.5 rounded-full bg-[var(--gold)] md:top-0" />
                <h3 className="font-display text-xl text-[var(--foreground)]">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="!pt-0">
        <p className="mb-6 font-display text-2xl text-[var(--foreground)] sm:text-3xl">
          {t("about_gallery_title", "Pathways into Tunisia")}
        </p>
        <ul className="divide-y divide-[var(--gold)]/20 border-y border-[var(--gold)]/30">
          {pathways.map(({ to, title, body }) => (
            <li key={to}>
              <Link
                to={to}
                className="group flex items-start justify-between gap-4 py-5 hover:bg-[var(--gold)]/[0.06] sm:items-center"
              >
                <span className="min-w-0">
                  <span className="block font-display text-lg text-[var(--foreground)] group-hover:text-[var(--gold)] sm:text-xl">
                    {title}
                  </span>
                  <span className="mt-1 block text-sm text-[var(--muted-foreground)]">{body}</span>
                </span>
                <span className="shrink-0 text-xs font-bold uppercase tracking-[0.14em] text-[var(--gold)]">
                  {t("open_tool", "Open")}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section className="!pt-0">
        <div className="frame-gold relative overflow-hidden rounded-md min-h-[280px] flex items-center justify-center">
          <img src={medina} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-[var(--brand-teal)]/80" />
          <div className="relative z-10 px-6 py-12 text-center text-white">
            <p className="font-display text-2xl sm:text-3xl !text-white">{ctaTitle}</p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link to="/sources" className="btn-base btn-gold">
                {t("start_exploring", "Start exploring")}
              </Link>
              <Link to="/contact" className="btn-base btn-outline !text-white !border-white/50">
                {t("nav_contact", "Contact")}
              </Link>
            </div>
          </div>
        </div>
      </Section>

      <SiteCustomBlocks pageId="about" />
    </div>
  );
}
