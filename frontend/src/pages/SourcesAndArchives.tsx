import { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Archive,
  FileText,
  Search,
  ExternalLink,
  ArrowRight,
  Compass,
  FileCheck,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { PageHero, Section, SectionHeading } from "../components/site/Primitives";
import kairouan from "../assets/slider-kairouan.jpg";
import SEO from "../components/SEO";
import { useTranslation } from "../context/TranslationContext";
import { useSiteContent } from "../hooks/useSiteContent";
import SiteCustomBlocks from "../components/cms/SiteCustomBlocks";
import {
  usePublicCards,
  resolveCardText,
  type PublicCardRecord,
} from "../hooks/usePublicCards";

export default function SourcesAndArchives() {
  const { locale, t, isRtl } = useTranslation();
  const { getText, getImage } = useSiteContent();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState<"all" | "sources" | "archives">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { cards: sourceCards = [], loading: sourcesLoading } = usePublicCards("source");
  const { cards: archiveCards = [], loading: archivesLoading } = usePublicCards("archive");

  useEffect(() => {
    if (location.pathname.includes("/archives") || location.hash === "#archives") {
      setActiveTab("archives");
    } else if (location.pathname.includes("/sources") || location.hash === "#sources") {
      setActiveTab("sources");
    }
  }, [location.pathname, location.hash]);

  const query = searchQuery.trim().toLowerCase();

  const filteredSources = useMemo(() => {
    const list = (sourceCards || []).filter((c) => c.isPublished !== false && c.isActive !== false);
    if (!query) return list;
    return list.filter((s) => {
      const { title, description } = resolveCardText(s, locale);
      return (
        title.toLowerCase().includes(query) ||
        description.toLowerCase().includes(query) ||
        (s.title || "").toLowerCase().includes(query)
      );
    });
  }, [sourceCards, query, locale]);

  const filteredArchives = useMemo(() => {
    const list = (archiveCards || []).filter((c) => c.isPublished !== false && c.isActive !== false);
    if (!query) return list;
    return list.filter((a) => {
      const { title, description } = resolveCardText(a, locale);
      return (
        title.toLowerCase().includes(query) ||
        description.toLowerCase().includes(query) ||
        (a.title || "").toLowerCase().includes(query)
      );
    });
  }, [archiveCards, query, locale]);

  const showSources = activeTab === "all" || activeTab === "sources";
  const showArchives = activeTab === "all" || activeTab === "archives";

  const protocolSteps = [
    {
      step: "01",
      title: t("protocol_step_1_title", "Localiser la Juridiction & le Caïdat"),
      desc: t(
        "protocol_step_1_desc",
        "Identifier la commune, le tribunal ou le caïdat historique où l'ancêtre a vécu pour cibler la bonne série d'archives."
      ),
      icon: Compass,
    },
    {
      step: "02",
      title: t("protocol_step_2_title", "Consulter l'Inventaire & les Microfilms"),
      desc: t(
        "protocol_step_2_desc",
        "Parcourir les répertoires chronologiques des séries charaïques, habous ou état civil auprès des dépôts nationaux."
      ),
      icon: FileCheck,
    },
    {
      step: "03",
      title: t("protocol_step_3_title", "Croiser avec les Registres Fiscaux"),
      desc: t(
        "protocol_step_3_desc",
        "Valider les filiations en recoupant les registres de la Majba, les actes notariés et les recensements municipaux."
      ),
      icon: CheckCircle2,
    },
  ];

  const renderCard = (card: PublicCardRecord, isArchive: boolean) => {
    const { title, description } = resolveCardText(card, locale);
    const linkDestination = card.link || card.linkUrl || "#";
    const isInternal = linkDestination.startsWith("/") && !linkDestination.startsWith("//");
    const Icon = isArchive ? Archive : FileText;

    return (
      <article
        key={card.id}
        className="surface-card frame-gold group flex h-full flex-col justify-between p-6 sm:p-7 rounded-xl shadow-md bg-[var(--card)]/95 backdrop-blur-sm text-start transition-all hover:border-[var(--gold)] hover:-translate-y-1"
      >
        <div className="space-y-3.5">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-[var(--gold)]/20 pb-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--gold)]/15 text-[var(--gold)] ring-1 ring-[var(--gold)]/40 shrink-0">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="font-display text-lg sm:text-xl font-bold text-[var(--foreground)] group-hover:text-[var(--gold)] transition-colors leading-snug">
              {title || card.title}
            </h3>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed">
            {description || card.description}
          </p>
        </div>

        {/* Action Button */}
        <div className="mt-6 pt-4 border-t border-[var(--gold)]/15 flex items-center justify-between">
          {isInternal ? (
            <Link
              to={linkDestination}
              className="btn-base btn-gold text-xs py-2 px-4 inline-flex items-center gap-1.5 shadow-sm hover:scale-[1.02] transition-transform"
            >
              <span>{t("card_open_link", "Ouvrir le lien")}</span>
              <ArrowRight className={`h-3.5 w-3.5 ${isRtl ? "rotate-180" : ""}`} />
            </Link>
          ) : (
            <a
              href={linkDestination}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-base btn-gold text-xs py-2 px-4 inline-flex items-center gap-1.5 shadow-sm hover:scale-[1.02] transition-transform"
            >
              <span>{t("card_open_link", "Ouvrir le lien")}</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
          <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--muted-foreground)] opacity-70">
            {isArchive ? t("official_archive_badge", "Archive Officielle") : t("document_collection_badge", "Fonds Documentaire")}
          </span>
        </div>
      </article>
    );
  };

  const isArchivesRoute = location.pathname.includes("/archives");
  const cmsPageId = isArchivesRoute || activeTab === "archives" ? "archives" : "sources";
  const heroEyebrow =
    getText(cmsPageId, "hero", "eyebrow") ??
    getText("research", "hero", "eyebrow") ??
    t("sources_and_archives_nav", "Patrimoine & Archives");
  const heroTitle =
    getText(cmsPageId, "hero", "title") ??
    getText("research", "hero", "title") ??
    t("tunisian_sources_repositories", "Sources & Archives de Tunisie");
  const heroSubtitle =
    getText(cmsPageId, "hero", "subtitle") ??
    getText("research", "hero", "subtitle") ??
    t(
      "tunisian_sources_repositories_desc",
      "Fonds d'archives officiels, registres civils, tribunaux charaïques et institutions patrimoniales de Tunisie."
    );
  const heroImg =
    getImage(cmsPageId, "hero", "image") ??
    getImage("research", "hero", "image") ??
    kairouan;

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="bg-[var(--background)] text-[var(--foreground)] min-h-screen">
      <SEO
        title={t("seo_sources_title", "Sources et Archives de Tunisie")}
        description={t(
          "seo_sources_desc",
          "Consultez les fonds d'archives officiels et sources généalogiques de Tunisie : État Civil, Justice Charaïque, Habous et Dépôts Régionaux."
        )}
        keywords={[
          "Tunisian sources",
          "Archives Nationales de Tunisie",
          "Genealogy archives Tunis",
          "Civil registry Tunisia",
          "Sijillat charaique",
        ]}
      />

      {/* Page Hero */}
      <PageHero
        eyebrow={heroEyebrow}
        title={heroTitle}
        subtitle={heroSubtitle}
        image={heroImg}
      >
        <Link to="/periods" className="btn-base btn-gold w-full sm:w-auto min-w-[180px]">
          {t("see_the_timeline", "Voir la Chronologie")}
        </Link>
      </PageHero>

      {/* Interactive Filter & Live Search Bar */}
      <section className="w-full px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8">
        <div className="mx-auto w-full max-w-[var(--content-max)]">
          <div className="surface-card p-4 sm:p-6 rounded-xl border border-[var(--gold)]/35 bg-[var(--card)]/95 shadow-md flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* View Switcher Tabs */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border transition-all cursor-pointer ${
                  activeTab === "all"
                    ? "border-[var(--gold)] bg-[var(--gold)] text-[#1f160f] shadow-sm font-extrabold"
                    : "border-[var(--border)] bg-[var(--background)]/70 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--gold)]/50"
                }`}
              >
                {t("tab_all", "Tous")} ({filteredSources.length + filteredArchives.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("sources")}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "sources"
                    ? "border-[var(--gold)] bg-[var(--gold)] text-[#1f160f] shadow-sm font-extrabold"
                    : "border-[var(--border)] bg-[var(--background)]/70 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--gold)]/50"
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                <span>{t("tab_sources", "Sources")} ({filteredSources.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("archives")}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "archives"
                    ? "border-[var(--gold)] bg-[var(--gold)] text-[#1f160f] shadow-sm font-extrabold"
                    : "border-[var(--border)] bg-[var(--background)]/70 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--gold)]/50"
                }`}
              >
                <Archive className="h-3.5 w-3.5" />
                <span>{t("tab_archives", "Archives")} ({filteredArchives.length})</span>
              </button>
            </div>

            {/* Live Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)] pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("search_records_placeholder", "Rechercher par titre ou mot-clé...")}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] ps-9 pe-4 py-2 text-xs text-[var(--foreground)] outline-none transition focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/30"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sources Section */}
      {showSources && (
        <Section id="sources">
          <SectionHeading
            center={true}
            eyebrow={t("evidence_eyebrow", "Preuves & Fonds")}
            title={t("know_what_document_proves", "Fonds Documentaires & Sources Notariées")}
            intro={t(
              "know_what_document_proves_intro",
              "Chaque acte d'archive porte une valeur juridique et généalogique essentielle dans l'établissement des filiations."
            )}
          />

          {sourcesLoading && filteredSources.length === 0 ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="h-8 w-8 text-[var(--gold)] animate-spin" />
            </div>
          ) : filteredSources.length === 0 ? (
            <div className="mt-8 text-center p-8 rounded-xl border border-[var(--gold)]/30 bg-[var(--card)] text-sm text-[var(--muted-foreground)]">
              {t("no_records_found", "Aucun résultat trouvé.")}
            </div>
          ) : (
            <div className="mt-10 sm:mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
              {filteredSources.map((s) => renderCard(s, false))}
            </div>
          )}
        </Section>
      )}

      {/* Archives Directory Section */}
      {showArchives && (
        <Section id="archives" className="bg-[var(--secondary)]/35">
          <SectionHeading
            center={true}
            eyebrow={t("directory", "Répertoire")}
            title={t("ten_institutions_title", "Institutions & Dépôts d'Archives")}
            intro={t(
              "ten_institutions_intro",
              "Les centres d'archives nationaux, municipaux et diocésains conservant les registres historiques tunisiens."
            )}
          />

          {archivesLoading && filteredArchives.length === 0 ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="h-8 w-8 text-[var(--gold)] animate-spin" />
            </div>
          ) : filteredArchives.length === 0 ? (
            <div className="mt-8 text-center p-8 rounded-xl border border-[var(--gold)]/30 bg-[var(--card)] text-sm text-[var(--muted-foreground)]">
              {t("no_records_found", "Aucun résultat trouvé.")}
            </div>
          ) : (
            <div className="mt-10 sm:mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
              {filteredArchives.map((a) => renderCard(a, true))}
            </div>
          )}
        </Section>
      )}

      {/* 3-Step Research Protocol Section */}
      <Section>
        <SectionHeading
          center={true}
          eyebrow={t("archival_protocol_eyebrow", "Méthodologie")}
          title={t("archival_protocol_title", "Protocole de Recherche en 3 Étapes")}
          intro={t(
            "archival_protocol_intro",
            "La démarche rigoureuse validée par nos généalogistes pour remonter les générations avec certitude documentaire."
          )}
        />
        <div className="mt-10 sm:mt-12 grid gap-6 md:grid-cols-3 items-stretch">
          {protocolSteps.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.step}
                className="surface-card frame-gold p-6 sm:p-8 rounded-xl shadow-md bg-[var(--card)]/90 text-start flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-2xl sm:text-3xl font-bold text-[var(--gold)]">
                      {p.step}
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--gold)]/15 text-[var(--gold)] ring-1 ring-[var(--gold)]/30">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="font-display text-lg font-bold text-[var(--foreground)] mb-2">
                    {p.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed">
                    {p.desc}
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-[var(--gold)]/20">
                  <span className="text-[0.68rem] font-bold text-[var(--gold)] uppercase tracking-wider">
                    {t("site_title", "Roots Tunisia")} Protocol
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      <SiteCustomBlocks pageId={cmsPageId} fallbackPageId="research" />
    </div>
  );
}
