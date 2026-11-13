import { useState, useMemo, useEffect, useRef } from "react";
import {
  Check,
  ShieldCheck,
  Zap,
  ChevronDown,
  FileCheck,
  X,
  Users,
  BookOpen,
  Crown,
  Coins,
  Radio,
  FileText,
  Image as ImageIcon,
  FolderTree,
  Sliders,
  Sparkles,
  Compass,
  ArrowRight,
  HelpCircle,
  Lock,
} from "lucide-react";
import { useTranslation } from "../context/TranslationContext";
import { useAuth } from "../admin/components/AuthContext";
import { useCurrency } from "../context/CurrencyContext";
import { useNavigate, Link } from "react-router-dom";
import { PageHero, Section, SectionHeading } from "../components/site/Primitives";
import medina from "../assets/medina-tunis.jpg";
import SEO from "../components/SEO";
import { api } from "../api/client";
import {
  cleanSubscriptionLocale,
  DEFAULT_LOCALIZED_TIER_SERVICES,
  localizeCurrencyName,
  localizeTierBadge,
  localizeTierDescription,
  localizeTierFeature,
  localizeTierName,
} from "../utils/subscriptionTranslations";

type ComparisonCell = string | boolean;

interface ComparisonRow {
  feature: string;
  basic: ComparisonCell;
  premium: ComparisonCell;
  historian: ComparisonCell;
}

interface ApiTier {
  id: number;
  name?: string;
  price?: number | string;
  badge?: string;
  tagline?: string;
  description?: string;
  max_trees?: number;
  max_individuals?: number;
  max_sources?: number;
  max_notes?: number;
  max_tasks?: number;
  max_gallery?: number;
  max_audios?: number;
  max_documents?: number;
  features?: string[] | string;
  is_active?: boolean;
}

type TierLimits = {
  trees: number;
  individuals: number;
  sources: number;
  notes: number;
  tasks: number;
  gallery: number;
  audios: number;
  documents: number;
};

type DisplayTier = {
  id: number;
  slug: string;
  name: string;
  nameKey: string;
  priceUSD: number;
  priceDisplay: string;
  amountRaw: number;
  currencyCode: string;
  period: string;
  limits: TierLimits;
  highlight: boolean;
  badge?: string;
  description?: string;
  services: string[];
  isCurrent: boolean;
};

const DEFAULT_TIER_SERVICES: Record<number, string[]> = {
  1: [
    "Visualisation interactive d’arbres généalogiques (2D/3D)",
    "Inventaires des 19 grands fonds d’archives tunisiens",
    "Importation et exportation GEDCOM standard",
    "Fiches d’individus et repères chronologiques",
    "Accès libre à la communauté et aux récits d’histoire",
  ],
  2: [
    "Tout ce qui est inclus dans Découverte",
    "Consultation & téléchargement HD des actes d’état civil numérisés",
    "Index nominatif des décrets de naturalisation (1924–1927)",
    "Registres paroissiaux & consulaires (italiens, maltais, français)",
    "Exports PDF haute résolution pour livrets de famille",
    "Support prioritaire par email sous 24h",
  ],
  3: [
    "Tout ce qui est inclus dans Chercheur d’Actes",
    "Demande de recherche ciblée auprès des dépôts d’archives",
    "Aide au déchiffrage & transcription (arabe, ottoman, italien)",
    "Validation de filiation avec référent généalogiste",
    "Accès prioritaire aux nouveaux registres indexés",
    "Assistance directe par WhatsApp & messagerie dédiée",
  ],
};

const FALLBACK_API_TIERS: ApiTier[] = [
  {
    id: 1,
    name: "Découverte Patrimoine",
    price: 0,
    badge: "Accès Gratuit",
    description: "Visualisation d’arbres, répertoires des fonds d’archives et import/export GEDCOM.",
    features: DEFAULT_TIER_SERVICES[1],
    max_trees: 50,
    max_individuals: 1000,
    max_sources: 100,
    max_notes: 100,
    max_tasks: 100,
    max_gallery: 100,
    max_audios: 100,
    max_documents: 100,
  },
  {
    id: 2,
    name: "Chercheur & Actes",
    price: 1.99,
    badge: "Recommandé — Actes & Registres",
    description: "Accès complet aux actes d’état civil numérisés, registres paroissiaux et décrets de naturalisation (1924–1927).",
    features: DEFAULT_TIER_SERVICES[2],
    max_trees: 300,
    max_individuals: 6000,
    max_sources: 600,
    max_notes: 600,
    max_tasks: 600,
    max_gallery: 600,
    max_audios: 600,
    max_documents: 600,
  },
  {
    id: 3,
    name: "Historien Pro",
    price: 3.99,
    badge: "Recherche Avancée & Expert",
    description: "Assistance aux recherches ciblées en dépôts, déchiffrage paléographique et suivi personnalisé.",
    features: DEFAULT_TIER_SERVICES[3],
    max_trees: 3000,
    max_individuals: 30000,
    max_sources: 3000,
    max_notes: 3000,
    max_tasks: 3000,
    max_gallery: 3000,
    max_audios: 3000,
    max_documents: 3000,
  },
];

const SLUG_BY_ID: Record<number, string> = {
  1: "basic",
  2: "premium",
  3: "historian",
};

const NAME_KEY_BY_ID: Record<number, string> = {
  1: "tier_basic_name",
  2: "tier_premium_name",
  3: "tier_historian_name",
};

function safeNumber(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function limitsFromApi(tier: ApiTier, fallback: ApiTier): TierLimits {
  const nested = (tier as any)?.limits || {};
  return {
    trees: safeNumber(tier.max_trees ?? nested.trees, fallback.max_trees ?? 50),
    individuals: safeNumber(tier.max_individuals ?? nested.individuals, fallback.max_individuals ?? 1000),
    sources: safeNumber(tier.max_sources ?? nested.sources ?? nested.savedSources, fallback.max_sources ?? 100),
    notes: safeNumber(tier.max_notes ?? nested.notes ?? nested.researchNotes, fallback.max_notes ?? 100),
    tasks: safeNumber(tier.max_tasks ?? nested.tasks ?? nested.researchTasks, fallback.max_tasks ?? 100),
    gallery: safeNumber(tier.max_gallery ?? nested.gallery ?? nested.galleryImages, fallback.max_gallery ?? 100),
    audios: safeNumber(tier.max_audios ?? nested.audios ?? nested.audioFiles, fallback.max_audios ?? 100),
    documents: safeNumber(tier.max_documents ?? nested.documents, fallback.max_documents ?? 100),
  };
}

export default function Subscriptions() {
  const { t, locale, isRtl } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { currencies, selectedCurrency, setCurrencyCode, convertPrice } = useCurrency();
  const cleanLoc = cleanSubscriptionLocale(locale);

  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [apiTiers, setApiTiers] = useState<ApiTier[]>(FALLBACK_API_TIERS);
  const [quotaModalOpen, setQuotaModalOpen] = useState(false);
  const [selectedQuotaTierId, setSelectedQuotaTierId] = useState<number>(2);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const currencyMenuRef = useRef<HTMLDivElement>(null);

  const currentTierId = Number(user?.tier_id ?? 1);

  // Close currency dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (currencyMenuRef.current && !currencyMenuRef.current.contains(event.target as Node)) {
        setCurrencyDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    api
      .get("/subscriptions/tiers")
      .then((res) => {
        if (cancelled) return;
        const raw = Array.isArray(res.data) ? res.data : res.data?.data || [];
        const list = (raw as ApiTier[]).filter((tier) => tier && tier.is_active !== false);
        if (list.length > 0) setApiTiers(list);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const tiers: DisplayTier[] = useMemo(() => {
    const isAnnual = billingCycle === "annual";
    const source = apiTiers.length > 0 ? apiTiers : FALLBACK_API_TIERS;

    return source.map((apiTier, index) => {
      const fallback =
        FALLBACK_API_TIERS.find((f) => f.id === apiTier.id) ||
        FALLBACK_API_TIERS[index] ||
        FALLBACK_API_TIERS[0];
      const monthlyUSD = safeNumber(apiTier.price, safeNumber(fallback.price, 0));
      const priceUSD = isAnnual && monthlyUSD > 0 ? monthlyUSD * 10 : monthlyUSD;
      const converted = convertPrice(priceUSD);
      const id = Number(apiTier.id) || fallback.id || index + 1;
      const limits = limitsFromApi(apiTier, fallback);
      const rawBadge =
        apiTier.badge ||
        apiTier.tagline ||
        (id === 2
          ? t("most_popular", "Recommandé — Actes & Registres")
          : id === 3
            ? t("ultimate_research", "Recherche Avancée & Expert")
            : t("tier_free_badge", "Accès Gratuit"));
      const localizedBadge = localizeTierBadge(rawBadge, id, cleanLoc);

      let rawServices: string[] = [];
      if (Array.isArray(apiTier.features) && apiTier.features.length > 0) {
        rawServices = apiTier.features;
      } else if (typeof apiTier.features === "string" && apiTier.features.trim()) {
        try {
          const parsed = JSON.parse(apiTier.features);
          if (Array.isArray(parsed) && parsed.length > 0) rawServices = parsed;
        } catch {}
      }

      const services =
        rawServices.length > 0
          ? rawServices.map((item) => localizeTierFeature(String(item || ""), cleanLoc)).filter(Boolean)
          : DEFAULT_LOCALIZED_TIER_SERVICES[id]?.[cleanLoc] || DEFAULT_TIER_SERVICES[id] || [];

      const rawName = apiTier.name || fallback.name;
      const rawDescription = apiTier.description || fallback.description || "";

      return {
        id,
        slug: SLUG_BY_ID[id] || `tier-${id}`,
        name: localizeTierName(rawName, id, cleanLoc),
        nameKey: NAME_KEY_BY_ID[id] || `tier_${id}_name`,
        priceUSD,
        priceDisplay: converted.formatted,
        amountRaw: converted.amount,
        currencyCode: converted.code,
        period: isAnnual ? t("per_year", "/ an") : t("per_month", "/ mois"),
        limits,
        highlight: id === 2,
        badge: localizedBadge,
        description: localizeTierDescription(rawDescription, id, cleanLoc),
        services,
        isCurrent: Boolean(user && (currentTierId === id || (id === 1 && !user.tier_id))),
      };
    });
  }, [apiTiers, billingCycle, convertPrice, user, currentTierId, t, cleanLoc]);

  const quotaLabels = [
    { key: "trees", label: t("sub_quota_trees", "Arbres généalogiques"), icon: FolderTree },
    { key: "individuals", label: t("sub_quota_individuals", "Individus enregistrés"), icon: Users },
    { key: "sources", label: t("sub_quota_sources", "Sources & références documentaires"), icon: BookOpen },
    { key: "notes", label: t("sub_quota_notes", "Notes de recherche"), icon: FileText },
    { key: "tasks", label: t("sub_quota_tasks", "Objectifs généalogiques"), icon: Zap },
    { key: "gallery", label: t("sub_quota_gallery", "Photographies & portraits"), icon: ImageIcon },
    { key: "audios", label: t("sub_quota_audios", "Témoignages & récits oraux"), icon: Radio },
    { key: "documents", label: t("sub_quota_documents", "Actes d’archives & justificatifs"), icon: FileCheck },
  ];

  const byId = (id: number) => tiers.find((tier) => tier.id === id);
  const activeModalTier = byId(selectedQuotaTierId) || tiers[1] || tiers[0];

  const comparisonRows: ComparisonRow[] = [
    {
      feature: t("comp_service_nature", "Profil de recherche"),
      basic: t("sub_comp_val_profile_1", "Découverte & arbres"),
      premium: t("sub_comp_val_profile_2", "Actes d'état civil & décrets"),
      historian: t("sub_comp_val_profile_3", "Recherche ciblée & déchiffrage"),
    },
    {
      feature: t("comp_civil_records", "Consultation des actes originaux numérisés"),
      basic: false,
      premium: true,
      historian: true,
    },
    {
      feature: t("comp_naturalizations", "Index des naturalisations (1924–1927) & recensements"),
      basic: t("sub_comp_val_nat_1", "Inventaire descriptif"),
      premium: t("sub_comp_val_nat_2", "Index nominatif complet"),
      historian: t("sub_comp_val_nat_3", "Index intégral + assistance filiation"),
    },
    {
      feature: t("comp_hd_downloads", "Téléchargement d'actes en haute résolution"),
      basic: false,
      premium: true,
      historian: true,
    },
    {
      feature: t("comp_translation_service", "Aide au déchiffrage & paléographie (arabe, ottoman, italien)"),
      basic: false,
      premium: false,
      historian: true,
    },
    {
      feature: t("comp_gedcom", "Importation & exportation GEDCOM standard"),
      basic: true,
      premium: true,
      historian: true,
    },
    {
      feature: t("comp_support", "Accompagnement & support"),
      basic: t("sub_comp_val_sup_1", "Communauté & guides"),
      premium: t("sub_comp_val_sup_2", "Email prioritaire 24h"),
      historian: t("sub_comp_val_sup_3", "WhatsApp & référent généalogiste"),
    },
  ];

  const handleSelectTier = (tier: DisplayTier) => {
    if (tier.id === 1) {
      if (!user) navigate("/signup");
      else navigate("/admin/trees");
      return;
    }

    const query = new URLSearchParams({
      tier: String(tier.id),
      plan: tier.slug,
      amount: String(tier.amountRaw),
      currency: tier.currencyCode,
      interval: billingCycle,
    });
    navigate(`/payment?${query.toString()}`);
  };

  const safeCurrencyCode = String(selectedCurrency?.code || "USD");

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="bg-[var(--background)] text-[var(--foreground)] min-h-screen pb-16">
      <SEO
        title={t("seo_subscriptions_title", "Tarifs & Formules d'Accès aux Actes — Roots Tunisia")}
        description={t(
          "seo_subscriptions_desc",
          "Accédez aux actes d'état civil numérisés, registres paroissiaux et décrets de naturalisation en Tunisie à partir de 1,99 $ / mois."
        )}
        keywords={t(
          "seo_subscriptions_keywords",
          "Roots Tunisia tarifs, abonnements généalogie Tunisie, actes état civil Tunisie, décrets naturalisation 1924 1927, archives tunisiennes"
        )
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean)}
      />

      {/* Page Hero */}
      <PageHero
        eyebrow={t("subscriptions_hero_eyebrow", "Formules d'Accès aux Archives")}
        title={t("subscriptions_hero_title", "Consultez les Actes Numérisés & Retracez vos Lignées")}
        subtitle={t(
          "subscriptions_hero_sub",
          "Un modèle transparent centré sur la valeur : 0 DT pour débuter en exploration libre, 1,99 $ / mois pour les actes d'état civil, 3,99 $ pour l'aide d'un historien."
        )}
        image={medina}
      />

      <Section>
        {/* Floating Controls Toolbar */}
        <div className="surface-card frame-gold p-4 sm:p-5 rounded-2xl shadow-xl max-w-4xl mx-auto -mt-16 sm:-mt-20 relative z-20 bg-[var(--card)]/95 backdrop-blur-md border border-[var(--gold)]/35">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-start w-full sm:w-auto">
              <div className="w-10 h-10 rounded-xl bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30 flex items-center justify-center shrink-0">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <p className="font-cinzel text-sm sm:text-base font-bold text-[var(--foreground)] leading-tight">
                  {t("subscriptions_toolbar_title", "Abonnements & Accès aux Actes")}
                </p>
                <p className="text-[0.72rem] text-[var(--muted-foreground)]">
                  {t("subscriptions_toolbar_sub", "Sans engagement · Annulation en 1 clic · Tarifs clairs")}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-start sm:justify-end">
              {/* Redesigned Currency Selector */}
              <div ref={currencyMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setCurrencyDropdownOpen((prev) => !prev)}
                  aria-expanded={currencyDropdownOpen}
                  aria-haspopup="listbox"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[var(--gold)]/40 hover:border-[var(--gold)] bg-[var(--background)] hover:bg-[var(--gold)]/10 text-xs transition-all shadow-xs cursor-pointer group"
                >
                  <Coins className="h-4 w-4 text-[var(--gold)] shrink-0" />
                  <span className="text-[0.68rem] font-bold text-[var(--muted-foreground)] uppercase">
                    {t("sub_currency_label", "Devise :")}
                  </span>
                  <span
                    dir="ltr"
                    className="font-mono font-bold text-[var(--foreground)] px-2 py-0.5 rounded bg-[var(--gold)]/15 border border-[var(--gold)]/30 flex items-center gap-1"
                  >
                    <span>{safeCurrencyCode}</span>
                    <span className="text-[var(--gold)]">({selectedCurrency?.symbol || "$"})</span>
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-[var(--gold)] transition-transform duration-200 ${
                      currencyDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Themed Currency Dropdown Menu */}
                {currencyDropdownOpen && (
                  <div
                    role="listbox"
                    className="absolute end-0 text-start mt-2 w-56 rounded-2xl bg-[var(--card)] border-2 border-[var(--gold)]/40 shadow-2xl p-2 z-50 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-150"
                  >
                    <div className="px-2.5 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--gold)] border-b border-[var(--gold)]/20 mb-1">
                      {t("sub_select_currency", "Sélectionnez votre devise")}
                    </div>
                    <div className="space-y-1 max-h-60 overflow-y-auto no-scrollbar">
                      {currencies
                        .filter((c) => String(c?.code || "").trim())
                        .map((c) => {
                          const isSelected = c.code === safeCurrencyCode;
                          return (
                            <button
                              key={c.code}
                              type="button"
                              role="option"
                              aria-selected={isSelected}
                              onClick={() => {
                                setCurrencyCode(c.code);
                                setCurrencyDropdownOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-[var(--gold)] text-[#1a1410] font-bold shadow-xs"
                                  : "text-[var(--foreground)] hover:bg-[var(--gold)]/15 hover:text-[var(--gold)]"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span dir="ltr" className="font-mono font-bold">
                                  {c.code}
                                </span>
                                <span className="text-[11px] opacity-80 truncate max-w-[110px]">
                                  {localizeCurrencyName(c.code, c.name, cleanLoc)}
                                </span>
                              </div>
                              <span
                                dir="ltr"
                                className={`font-mono text-xs font-extrabold ${
                                  isSelected ? "text-[#1a1410]" : "text-[var(--gold)]"
                                }`}
                              >
                                {c.symbol}
                              </span>
                            </button>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>

              {/* Monthly / Annual Toggle */}
              <div className="flex items-center rounded-xl border border-[var(--gold)]/40 bg-[var(--background)] p-1 text-xs font-bold shadow-xs">
                <button
                  type="button"
                  onClick={() => setBillingCycle("monthly")}
                  className={`rounded-lg px-3.5 py-1.5 transition-all cursor-pointer font-cinzel ${
                    billingCycle === "monthly"
                      ? "bg-gradient-to-r from-[var(--gold)] to-[#e8c47a] text-[#1a1410] font-bold shadow-sm"
                      : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--gold)]/10"
                  }`}
                >
                  {t("sub_billing_monthly", "Mensuel")}
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle("annual")}
                  className={`rounded-lg px-3.5 py-1.5 transition-all flex items-center gap-1.5 cursor-pointer font-cinzel ${
                    billingCycle === "annual"
                      ? "bg-gradient-to-r from-[var(--gold)] to-[#e8c47a] text-[#1a1410] font-bold shadow-sm"
                      : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--gold)]/10"
                  }`}
                >
                  <span>{t("sub_billing_annual", "Annuel")}</span>
                  <span className="rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 text-[0.62rem] font-mono font-extrabold border border-emerald-500/35">
                    {t("sub_annual_discount", "-17% (2 mois offerts)")}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Main Tier Cards with Redesigned Hierarchy & Action Buttons */}
        <div className="mt-12 sm:mt-14 pt-4 sm:pt-6 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch w-full max-w-[var(--content-max)] mx-auto">
          {tiers.map((tier) => {
            const isBasic = tier.id === 1;
            const isFeatured = tier.id === 2;
            const isHistorian = tier.id === 3;

            return (
              <div
                key={tier.id}
                className={`surface-card p-6 sm:p-7 pt-8 sm:pt-9 rounded-3xl shadow-xl flex flex-col justify-between relative transition-all duration-300 text-start overflow-visible ${
                  isFeatured
                    ? "frame-gold border-2 border-[var(--gold)] ring-4 ring-[var(--gold)]/25 bg-gradient-to-b from-[var(--card)] via-[var(--card)] to-[var(--gold)]/5 hover:-translate-y-2 shadow-2xl"
                    : isHistorian
                      ? "border-2 border-[var(--gold)]/40 hover:border-[var(--gold)] bg-[var(--card)] hover:-translate-y-1 shadow-lg"
                      : "border border-[var(--gold)]/30 hover:border-[var(--gold)]/60 bg-[var(--card)] hover:-translate-y-1 shadow-md"
                }`}
              >
                {/* Featured / Recommended Top Badge */}
                {isFeatured && !tier.isCurrent && (
                  <div className="absolute -top-4.5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-[#140f0a] text-[#fcd34d] shadow-2xl border-2 border-[var(--gold)] flex items-center gap-2 whitespace-nowrap z-20 ring-4 ring-[var(--gold)]/30">
                    <Sparkles className="w-4 h-4 fill-[#fcd34d] text-[#fcd34d] shrink-0" />
                    <span className="font-extrabold tracking-wider">
                      {t("sub_featured_top_badge", "RECOMMANDÉ · ACTES & ÉTAT CIVIL")}
                    </span>
                  </div>
                )}

                {/* Historian Pro Badge */}
                {isHistorian && !tier.isCurrent && (
                  <div className="absolute -top-4.5 start-6 px-4 py-1.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-[#1a1410] text-[#fce79f] border-2 border-[var(--gold)]/70 shadow-xl flex items-center gap-1.5 z-20 ring-2 ring-[var(--gold)]/10">
                    <ShieldCheck className="w-3.5 h-3.5 text-[var(--gold)] shrink-0" />
                    <span>{t("sub_historian_top_badge", "RECHERCHE AVANCÉE & EXPERT")}</span>
                  </div>
                )}

                {/* Current Active Plan Badge */}
                {tier.isCurrent && (
                  <span className="absolute -top-4.5 start-6 px-4 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-wide bg-[var(--gold)] text-[#1f160f] shadow-xl border border-[#1f160f]/20 flex items-center gap-1.5 z-20">
                    <Check className="w-3.5 h-3.5 stroke-[3] shrink-0" />
                    <span>{t("sub_current_plan_badge", "Votre Formule Actuelle")}</span>
                  </span>
                )}

                <div>
                  {/* Tier Header with Icon & Name */}
                  <div className="flex items-center justify-between border-b border-[var(--gold)]/20 pb-4 pt-1">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center border transition-transform ${
                          isFeatured
                            ? "bg-[var(--gold)]/20 text-[var(--gold)] border-[var(--gold)]/60 shadow-md"
                            : isHistorian
                              ? "bg-[var(--gold)]/15 text-[var(--gold)] border-[var(--gold)]/30"
                              : "bg-[var(--gold)]/10 text-[var(--gold)] border-[var(--gold)]/25"
                        }`}
                      >
                        {isFeatured ? (
                          <Crown className="w-5 h-5" />
                        ) : isHistorian ? (
                          <ShieldCheck className="w-5 h-5" />
                        ) : (
                          <Compass className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--gold)]">
                          {isFeatured
                            ? t("sub_tier_2_eyebrow", "Dépôts & Sijillats")
                            : isHistorian
                              ? t("sub_tier_3_eyebrow", "Assistance Paléographique")
                              : t("sub_tier_1_eyebrow", "Exploration Libre")}
                        </span>
                        <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[var(--foreground)]">
                          {tier.name}
                        </h3>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                        isFeatured
                          ? "bg-[var(--gold)] text-[#1a1410] border-[var(--gold)]"
                          : "bg-[var(--gold)]/10 text-[var(--gold)] border-[var(--gold)]/25"
                      }`}
                    >
                      {isBasic
                        ? t("sub_tier_1_pill", "Gratuit")
                        : isFeatured
                          ? t("sub_tier_2_pill", "Le Choix Idéal")
                          : t("sub_tier_3_pill", "Expert")}
                    </span>
                  </div>

                  {/* Pricing Display */}
                  <div className="my-5 border-b border-[var(--gold)]/20 pb-4">
                    <div className="flex items-baseline gap-2">
                      <span
                        dir="ltr"
                        className={`font-cinzel tracking-tight font-black ${
                          isFeatured
                            ? "text-4xl sm:text-5xl text-[var(--gold)]"
                            : "text-3xl sm:text-4xl text-[var(--gold)]"
                        }`}
                      >
                        {tier.priceDisplay}
                      </span>
                      <span className="text-xs text-[var(--muted-foreground)] font-semibold">
                        {isBasic ? t("sub_period_forever", "/ pour toujours") : tier.period}
                      </span>
                    </div>

                    {tier.description ? (
                      <p className="mt-2 text-xs text-[var(--muted-foreground)] leading-relaxed">
                        {tier.description}
                      </p>
                    ) : null}
                  </div>

                  {/* Real Genealogical Services List */}
                  <div className="space-y-2.5 text-xs sm:text-sm text-[var(--foreground)] py-2">
                    <div className="text-[0.68rem] font-bold uppercase tracking-wider text-[var(--gold)] pb-1 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-[var(--gold)]" />
                      <span>
                        {isBasic
                          ? t("sub_included_free", "Inclus sans frais :")
                          : t("sub_included_paid", "Prestations & Privilèges inclus :")}
                      </span>
                    </div>
                    {tier.services.map((serviceText, sIdx) => (
                      <div key={sIdx} className="flex items-start gap-2.5">
                        <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5 stroke-[2.5]" />
                        <span className="text-[var(--foreground)] font-medium leading-snug text-xs">
                          {serviceText}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Discrete Technical Quotas Trigger */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedQuotaTierId(tier.id);
                      setQuotaModalOpen(true);
                    }}
                    className="mt-4 pt-3 border-t border-[var(--gold)]/15 text-[0.72rem] font-semibold text-[var(--gold)] hover:underline flex items-center justify-between w-full cursor-pointer transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <Sliders className="h-3.5 w-3.5 text-[var(--gold)]" />
                      <span>{t("sub_quotas_trigger", "Quotas & stockage inclus")}</span>
                    </span>
                    <span className="font-mono text-[0.65rem] opacity-80 inline-flex items-center gap-1">
                      <span>{t("sub_view_details", "Voir détails")}</span>
                      <ArrowRight className={`w-3 h-3 ${isRtl ? "rotate-180" : ""}`} />
                    </span>
                  </button>
                </div>

                {/* Redesigned Themed Action Buttons */}
                <div className="pt-6 mt-4 border-t border-[var(--gold)]/20">
                  {tier.isCurrent ? (
                    <button
                      type="button"
                      disabled
                      className="w-full py-3 px-4 rounded-xl bg-emerald-500/15 border-2 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-cinzel font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-default shadow-xs"
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>{t("sub_btn_current", "Votre Formule Actuelle (Active)")}</span>
                    </button>
                  ) : isBasic ? (
                    <button
                      type="button"
                      onClick={() => handleSelectTier(tier)}
                      className="w-full py-3 px-4 rounded-xl border-2 border-[var(--gold)]/50 hover:border-[var(--gold)] bg-[var(--background)] hover:bg-[var(--gold)]/15 text-[var(--foreground)] font-cinzel font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs hover:shadow cursor-pointer group/btn"
                    >
                      <Compass className="w-4 h-4 text-[var(--gold)] group-hover/btn:rotate-45 transition-transform" />
                      <span>{t("sub_btn_basic", "Commencer Gratuitement")}</span>
                      <ArrowRight className={`w-4 h-4 text-[var(--gold)] ${isRtl ? "rotate-180" : ""}`} />
                    </button>
                  ) : isFeatured ? (
                    <button
                      type="button"
                      onClick={() => handleSelectTier(tier)}
                      className="w-full py-3.5 px-4 rounded-xl font-cinzel font-black text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-xl hover:shadow-2xl transition-all bg-gradient-to-r from-[var(--gold)] via-[#e8c47a] to-[var(--gold)] hover:brightness-110 text-[#1a1410] border border-[#1a1410]/20 hover:scale-[1.02] cursor-pointer group/btn"
                    >
                      <Crown className="w-4 h-4 fill-[#1a1410] text-[#1a1410] shrink-0" />
                      <span>{t("sub_btn_featured", "Activer la Formule Chercheur")}</span>
                      <ArrowRight
                        className={`w-4 h-4 text-[#1a1410] group-hover/btn:translate-x-1 transition-transform ${
                          isRtl ? "rotate-180 group-hover/btn:-translate-x-1" : ""
                        }`}
                      />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSelectTier(tier)}
                      className="w-full py-3 px-4 rounded-xl font-cinzel font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-lg transition-all bg-[var(--foreground)] text-[var(--background)] hover:bg-[var(--gold)] hover:text-[#1a1410] border-2 border-[var(--gold)] cursor-pointer hover:scale-[1.01] group/btn"
                    >
                      <ShieldCheck className="w-4 h-4 text-[var(--gold)] group-hover/btn:text-[#1a1410] shrink-0 transition-colors" />
                      <span>{t("sub_btn_historian", "Choisir la Formule Historien Pro")}</span>
                      <ArrowRight
                        className={`w-4 h-4 shrink-0 group-hover/btn:translate-x-1 transition-transform ${
                          isRtl ? "rotate-180 group-hover/btn:-translate-x-1" : ""
                        }`}
                      />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 3-Point Reassurance Trust Strip */}
        <div className="mt-12 max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="surface-card frame-gold p-4 rounded-2xl bg-[var(--card)]/80 border border-[var(--gold)]/25 text-center flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[var(--gold)]/15 text-[var(--gold)] flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <strong className="text-xs font-bold text-[var(--foreground)]">
              {t("sub_trust_1_title", "Paiement 100% Sécurisé")}
            </strong>
            <span className="text-[11px] text-[var(--muted-foreground)] leading-tight">
              {t("sub_trust_1_desc", "Chiffrement bancaire SSL 256-bit et passerelles certifiées")}
            </span>
          </div>

          <div className="surface-card frame-gold p-4 rounded-2xl bg-[var(--card)]/80 border border-[var(--gold)]/25 text-center flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[var(--gold)]/15 text-[var(--gold)] flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <strong className="text-xs font-bold text-[var(--foreground)]">
              {t("sub_trust_2_title", "Sans Aucun Engagement")}
            </strong>
            <span className="text-[11px] text-[var(--muted-foreground)] leading-tight">
              {t("sub_trust_2_desc", "Annulez ou changez de formule en 1 clic à tout moment")}
            </span>
          </div>

          <div className="surface-card frame-gold p-4 rounded-2xl bg-[var(--card)]/80 border border-[var(--gold)]/25 text-center flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[var(--gold)]/15 text-[var(--gold)] flex items-center justify-center">
              <FileCheck className="w-4 h-4" />
            </div>
            <strong className="text-xs font-bold text-[var(--foreground)]">
              {t("sub_trust_3_title", "Archives Authentifiées")}
            </strong>
            <span className="text-[11px] text-[var(--muted-foreground)] leading-tight">
              {t("sub_trust_3_desc", "Registres, sijillats et décrets numérisés certifiés conformes")}
            </span>
          </div>
        </div>

        {/* Focused Comparison Table */}
        <div className="mt-16">
          <SectionHeading
            center={true}
            eyebrow={t("sub_comp_eyebrow", "Transparence Totale")}
            title={t("sub_comp_title", "Comparatif Détaillé des Formules")}
            intro={t(
              "sub_comp_intro",
              "Retrouvez l'ensemble des accès et prestations inclus selon vos besoins de recherche généalogique."
            )}
          />

          <div className="surface-card frame-gold mt-8 rounded-2xl overflow-hidden shadow-xl max-w-5xl mx-auto border border-[var(--gold)]/35">
            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-[var(--gold)]/30 bg-[var(--gold)]/10 text-[var(--foreground)]">
                    <th className="py-4 px-6 text-start font-bold uppercase tracking-wider text-xs font-cinzel">
                      {t("sub_comp_col_features", "Prestations & Dépouillements")}
                    </th>
                    <th className="py-4 px-4 text-center font-bold text-xs">
                      <div className="font-cinzel text-sm">
                        {byId(1)?.name || localizeTierName(undefined, 1, cleanLoc)}
                      </div>
                      <div
                        dir="ltr"
                        className="text-[10px] text-[var(--muted-foreground)] font-mono font-normal inline-block"
                      >
                        {byId(1)?.priceDisplay || convertPrice(0).formatted}
                      </div>
                    </th>
                    <th className="py-4 px-4 text-center font-bold text-xs bg-[var(--gold)]/20 border-x-2 border-t-2 border-[var(--gold)] text-[var(--gold)]">
                      <div className="font-cinzel text-sm font-extrabold flex items-center justify-center gap-1">
                        <Crown className="w-3.5 h-3.5 fill-[var(--gold)] text-[var(--gold)]" />
                        <span>{byId(2)?.name || localizeTierName(undefined, 2, cleanLoc)}</span>
                      </div>
                      <div className="text-[10px] text-[var(--gold)] font-mono font-bold">
                        <span dir="ltr">{byId(2)?.priceDisplay}</span> {byId(2)?.period}
                      </div>
                    </th>
                    <th className="py-4 px-4 text-center font-bold text-xs">
                      <div className="font-cinzel text-sm">
                        {byId(3)?.name || localizeTierName(undefined, 3, cleanLoc)}
                      </div>
                      <div className="text-[10px] text-[var(--muted-foreground)] font-mono font-normal">
                        <span dir="ltr">{byId(3)?.priceDisplay}</span> {byId(3)?.period}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {comparisonRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-[var(--gold)]/5 transition-colors">
                      <td className="py-3.5 px-6 font-medium text-[var(--foreground)]">
                        {row.feature}
                      </td>

                      {[row.basic, row.premium, row.historian].map((val, cellIdx) => {
                        const isFeaturedCol = cellIdx === 1;
                        return (
                          <td
                            key={cellIdx}
                            className={`py-3.5 px-4 text-center ${
                              isFeaturedCol
                                ? "bg-[var(--gold)]/5 border-x-2 border-[var(--gold)]/25 font-semibold"
                                : ""
                            }`}
                          >
                            {typeof val === "boolean" ? (
                              val ? (
                                <Check
                                  aria-label={t("sub_comp_included_aria", "Inclus")}
                                  className="h-4 w-4 text-emerald-500 mx-auto stroke-[2.5]"
                                />
                              ) : (
                                <X
                                  aria-label={t("sub_comp_not_included_aria", "Non inclus")}
                                  className="h-3.5 w-3.5 text-rose-400/50 mx-auto"
                                />
                              )
                            ) : (
                              <span
                                className={`text-xs ${
                                  isFeaturedCol
                                    ? "text-[var(--gold)] font-bold"
                                    : "text-[var(--foreground)] font-medium"
                                }`}
                              >
                                {val}
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Assistance & Help Center CTA */}
        <div className="surface-card frame-gold mt-12 p-6 sm:p-8 rounded-2xl bg-[var(--card)]/90 border border-[var(--gold)]/30 text-center max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
          <div className="text-start">
            <h4 className="font-cinzel text-lg sm:text-xl font-bold text-[var(--foreground)]">
              {t("sub_cta_title", "Une question avant de vous abonner ?")}
            </h4>
            <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-1 max-w-xl">
              {t(
                "sub_cta_desc",
                "Consultez notre Centre d'Aide, retrouvez les réponses aux questions fréquentes sur nos tarifs, ou contactez directement nos généalogistes."
              )}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
            <Link
              to="/helpcenter"
              className="btn-base btn-gold text-xs py-2.5 px-5 font-bold flex items-center justify-center gap-2 w-full sm:w-auto shadow-sm"
            >
              <HelpCircle className="w-4 h-4" />
              <span>{t("sub_cta_btn", "Centre d'Aide & FAQ")}</span>
              <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? "rotate-180" : ""}`} />
            </Link>
          </div>
        </div>
      </Section>

      {/* ========================================================================= */}
      {/* TECHNICAL QUOTAS MODAL                                                    */}
      {/* ========================================================================= */}
      {quotaModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setQuotaModalOpen(false)}
        >
          <div
            className="surface-card frame-gold relative w-full max-w-xl rounded-2xl bg-[var(--card)] p-6 sm:p-7 shadow-2xl border-2 border-[var(--gold)]/40 overflow-hidden text-start max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-[var(--gold)]/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30 flex items-center justify-center">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-cinzel text-base sm:text-lg font-bold text-[var(--foreground)]">
                    {t("sub_quotas_modal_title", "Quotas de Stockage & Limites Techniques")}
                  </h3>
                  <p className="text-[0.7rem] text-[var(--muted-foreground)]">
                    {t("sub_quotas_modal_sub", "Capacités d'hébergement allouées à votre compte")}
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label={t("sub_modal_close_icon", "Masquer")}
                onClick={() => setQuotaModalOpen(false)}
                className="p-1.5 rounded-lg text-[var(--foreground)]/60 hover:text-[var(--foreground)] hover:bg-[var(--gold)]/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tier Selector Pills */}
            <div className="flex items-center gap-2 my-4">
              {tiers.map((tItem) => (
                <button
                  key={tItem.id}
                  type="button"
                  onClick={() => setSelectedQuotaTierId(tItem.id)}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                    activeModalTier.id === tItem.id
                      ? "bg-gradient-to-r from-[var(--gold)] to-[#e8c47a] text-[#1a1410] font-bold shadow"
                      : "bg-[var(--background)] border border-[var(--gold)]/25 text-[var(--foreground)]/80 hover:border-[var(--gold)]"
                  }`}
                >
                  {tItem.name}
                </button>
              ))}
            </div>

            {/* Quota Grid */}
            <div className="overflow-y-auto space-y-2 pe-1 text-xs">
              {quotaLabels.map((item) => {
                const IconComp = item.icon;
                const limitValue = (activeModalTier.limits as any)?.[item.key] ?? 0;
                return (
                  <div
                    key={item.key}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--background)] border border-[var(--gold)]/15"
                  >
                    <div className="flex items-center gap-2.5">
                      <IconComp className="w-4 h-4 text-[var(--gold)] shrink-0" />
                      <span className="font-medium text-[var(--foreground)]">{item.label}</span>
                    </div>
                    <span className="font-mono font-bold text-[var(--gold)]">
                      {limitValue >= 999999 ? (
                        t("comp_val_unlimited", "Illimité")
                      ) : (
                        <span dir="ltr">{limitValue.toLocaleString()}</span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 mt-4 border-t border-[var(--gold)]/20 text-center">
              <button
                type="button"
                onClick={() => setQuotaModalOpen(false)}
                className="btn-base btn-gold px-6 py-2 rounded-xl text-xs font-bold cursor-pointer"
              >
                {t("sub_modal_close", "Fermer")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
