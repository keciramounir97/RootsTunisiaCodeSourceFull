import { useState, useMemo, useEffect } from "react";
import {
  Check,
  ShieldCheck,
  Zap,
  HelpCircle,
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
  ScrollText,
  Search,
  Download,
  Languages,
} from "lucide-react";
import { useTranslation } from "../context/TranslationContext";
import { useAuth } from "../admin/components/AuthContext";
import { useCurrency } from "../context/CurrencyContext";
import { useNavigate } from "react-router-dom";
import { PageHero, Section, SectionHeading } from "../components/site/Primitives";
import medina from "../assets/medina-tunis.jpg";
import SEO from "../components/SEO";
import { api } from "../api/client";

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
    "Inventaires & guides des 19 grands fonds d’archives tunisiens",
    "Importation et exportation GEDCOM 5.5.1 standard",
    "Fiches d’individus, repères chronologiques et patronymes",
    "Accès libre à la communauté et aux récits d’archives",
  ],
  2: [
    "Tout ce qui est inclus dans Découverte Patrimoine",
    "Consultation & téléchargement HD des actes d’état civil numérisés",
    "Index nominatif des décrets de naturalisation (1924–1927)",
    "Croisement multi-communautés (italienne, maltaise, juive, tunisienne)",
    "Exports PDF haute résolution pour livrets et tirages d’art",
    "Support prioritaire par e-mail avec réponse sous 24h",
  ],
  3: [
    "Tout ce qui est inclus dans Chercheur & Actes",
    "Demande de recherche ciblée auprès des dépôts d’archives tunisiens",
    "Aide au déchiffrage & transcription (arabe, ottoman, italien, maltais)",
    "Validation et certification de filiation avec référent généalogiste",
    "Accès prioritaire en avant-première aux nouveaux fonds indexés",
    "Assistance directe et personnalisée par WhatsApp & messagerie dédiée",
  ],
};

const FALLBACK_API_TIERS: ApiTier[] = [
  {
    id: 1,
    name: "Découverte Patrimoine",
    price: 0,
    badge: "Accès Gratuit",
    description: "Visualisation d’arbres généalogiques, consultation des répertoires de fonds d’archives et import/export GEDCOM.",
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
    badge: "Le Plus Populaire — Actes & Registres",
    description: "Accès complet aux actes d’état civil, registres paroissiaux, sijillats notariés et décrets de naturalisation (1924–1927).",
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
    name: "Historien & Généalogie Pro",
    price: 3.99,
    badge: "Recherche Avancée & Assistance Dédiée",
    description: "Assistance aux recherches ciblées, déchiffrage de manuscrits (arabe, ottoman, italien) et accès prioritaire aux nouveaux fonds.",
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
  return {
    trees: safeNumber(tier.max_trees, fallback.max_trees ?? 50),
    individuals: safeNumber(tier.max_individuals, fallback.max_individuals ?? 1000),
    sources: safeNumber(tier.max_sources, fallback.max_sources ?? 100),
    notes: safeNumber(tier.max_notes, fallback.max_notes ?? 100),
    tasks: safeNumber(tier.max_tasks, fallback.max_tasks ?? 100),
    gallery: safeNumber(tier.max_gallery, fallback.max_gallery ?? 100),
    audios: safeNumber(tier.max_audios, fallback.max_audios ?? 100),
    documents: safeNumber(tier.max_documents, fallback.max_documents ?? 100),
  };
}

export default function Subscriptions() {
  const { t, isRtl } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { currencies, selectedCurrency, setCurrencyCode, convertPrice } = useCurrency();

  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [apiTiers, setApiTiers] = useState<ApiTier[]>(FALLBACK_API_TIERS);
  const [quotaModalOpen, setQuotaModalOpen] = useState(false);
  const [selectedQuotaTierId, setSelectedQuotaTierId] = useState<number>(2);

  const currentTierId = Number(user?.tier_id ?? 1);

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
      .catch(() => {
        // Keep hardcoded FALLBACK if API fails
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const tiers: DisplayTier[] = useMemo(() => {
    const isAnnual = billingCycle === "annual";
    const source = apiTiers.length > 0 ? apiTiers : FALLBACK_API_TIERS;

    return source.map((apiTier, index) => {
      const fallback = FALLBACK_API_TIERS.find((f) => f.id === apiTier.id) || FALLBACK_API_TIERS[index] || FALLBACK_API_TIERS[0];
      const monthlyUSD = safeNumber(apiTier.price, safeNumber(fallback.price, 0));
      const priceUSD = isAnnual && monthlyUSD > 0 ? monthlyUSD * 10 : monthlyUSD;
      const converted = convertPrice(priceUSD);
      const id = Number(apiTier.id) || fallback.id || index + 1;
      const limits = limitsFromApi(apiTier, fallback);
      const badge =
        apiTier.badge ||
        apiTier.tagline ||
        (id === 2
          ? t("most_popular", "Le Plus Populaire — Actes & Registres")
          : id === 3
            ? t("ultimate_research", "Recherche Avancée & Assistance Dédiée")
            : t("tier_free_badge", "Accès Gratuit"));

      let services: string[] = DEFAULT_TIER_SERVICES[id] || [];
      if (Array.isArray(apiTier.features) && apiTier.features.length > 0) {
        services = apiTier.features;
      } else if (typeof apiTier.features === "string" && apiTier.features.trim()) {
        try {
          const parsed = JSON.parse(apiTier.features);
          if (Array.isArray(parsed) && parsed.length > 0) services = parsed;
        } catch {}
      }

      return {
        id,
        slug: SLUG_BY_ID[id] || `tier-${id}`,
        name: apiTier.name || fallback.name || `Tier ${id}`,
        nameKey: NAME_KEY_BY_ID[id] || `tier_${id}_name`,
        priceUSD,
        priceDisplay: converted.formatted,
        amountRaw: converted.amount,
        currencyCode: converted.code,
        period: isAnnual ? t("per_year", "/ an") : t("per_month", "/ mois"),
        limits,
        highlight: id === 2,
        badge,
        description: apiTier.description || fallback.description || "",
        services,
        isCurrent: id === 1 ? !user || currentTierId === 1 : Boolean(user && currentTierId === id),
      };
    });
  }, [apiTiers, billingCycle, convertPrice, user, currentTierId, t]);

  const quotaLabels = [
    { key: "trees", label: t("max_trees", "Arbres généalogiques"), icon: FolderTree },
    { key: "individuals", label: t("max_individuals", "Personnes et individus enregistrés"), icon: Users },
    { key: "sources", label: t("max_saved_sources", "Sources et références documentaires"), icon: BookOpen },
    { key: "notes", label: t("max_research_notes", "Notes et mémos de recherche"), icon: FileText },
    { key: "tasks", label: t("max_research_tasks", "Tâches et objectifs généalogiques"), icon: Zap },
    { key: "gallery", label: t("max_gallery_images", "Photographies et portraits historiques"), icon: ImageIcon },
    { key: "audios", label: t("max_audio_files", "Récits oraux et témoignages audio"), icon: Radio },
    { key: "documents", label: t("max_documents", "Actes d’archives et pièces justificatives"), icon: FileCheck },
  ];

  const byId = (id: number) => tiers.find((tier) => tier.id === id);
  const activeModalTier = byId(selectedQuotaTierId) || tiers[1] || tiers[0];

  const comparisonRows: ComparisonRow[] = [
    {
      feature: t("comp_service_nature", "Nature de la promesse"),
      basic: "Découverte & visualiseur d'arbres",
      premium: "Accès actes d'état civil & décrets",
      historian: "Recherche sur commande & déchiffrage",
    },
    {
      feature: t("comp_civil_records", "Consultation des actes originaux numérisés"),
      basic: false,
      premium: true,
      historian: true,
    },
    {
      feature: t("comp_naturalizations", "Décrets de naturalisation (1924–1927) & recensements"),
      basic: "Inventaire descriptif",
      premium: "Index nominatif complet",
      historian: "Index intégral + assistance filiation",
    },
    {
      feature: t("comp_hd_downloads", "Téléchargement d'actes et de sources en haute résolution"),
      basic: false,
      premium: true,
      historian: true,
    },
    {
      feature: t("comp_translation_service", "Assistance transcription & déchiffrage (arabe, ottoman, italien)"),
      basic: false,
      premium: false,
      historian: true,
    },
    {
      feature: t("comp_gedcom", "Importation et exportation GEDCOM 5.5.1"),
      basic: true,
      premium: true,
      historian: true,
    },
    {
      feature: t("comp_support", "Accompagnement et support"),
      basic: "Communauté & guides",
      premium: "E-mail prioritaire 24h",
      historian: "WhatsApp & référent généalogiste",
    },
  ];

  const faqs = [
    {
      qKey: "faq_q1",
      defaultQ: "Qu'est-ce qui différencie Roots Tunisia des sites d'arbres gratuits comme Geneanet ou FamilySearch ?",
      aKey: "faq_a1",
      defaultA:
        "Contrairement aux simples logiciels de construction d'arbres, Roots Tunisia mutualise et indexe directement les sources exclusives de Tunisie : état civil des municipalités, registres consulaires (CADN/ANOM), sijillats notariés, décrets de naturalisation (1924–1927) et archives ottomanes. Vous ne payez pas pour stocker un arbre, mais pour accéder à des actes et des transcriptions réelles introuvables ailleurs.",
    },
    {
      qKey: "faq_q2",
      defaultQ: "Comment sont fixés les prix de 1,99 $ et 3,99 $ et quelles devises sont acceptées ?",
      aKey: "faq_a2",
      defaultA:
        "Nos tarifs ont été fixés pour rester extrêmement accessibles à tous les chercheurs de la diaspora et de Tunisie : 0 $ en accès libre, 1,99 $/mois pour l'accès complet aux actes numérisés, et 3,99 $/mois pour l'accompagnement d'un historien. Les prix sont convertis en temps réel dans votre devise (TND, EUR, USD, CAD, GBP, SAR).",
    },
    {
      qKey: "faq_q3",
      defaultQ: "Comment puis-je demander une recherche ciblée d'acte en Tunisie ?",
      aKey: "faq_a3",
      defaultA:
        "Avec l'abonnement Historien Pro (3,99 $), vous pouvez soumettre une demande ciblée (par exemple un acte de mariage ou de décès dans une commune spécifique) et bénéficier de l'aide de notre réseau de transcripteurs pour déchiffrer les actes manuscrits arabes ou italiens.",
    },
    {
      qKey: "faq_q4",
      defaultQ: "Puis-je changer ou annuler mon abonnement à tout moment ?",
      aKey: "faq_a4",
      defaultA:
        "Oui, sans aucun engagement. Vous pouvez upgrader, downgrader ou résilier votre abonnement en un clic depuis votre espace utilisateur. Vos arbres et données généalogiques restent toujours consultables en toute sécurité.",
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
    <div dir={isRtl ? "rtl" : "ltr"} className="bg-[var(--background)] text-[var(--foreground)] min-h-screen">
      <SEO
        title={t("seo_subscriptions_title", "Tarifs & Services Généalogiques — Roots Tunisia")}
        description="Accédez aux actes d'état civil numérisés, décrets de naturalisation et assistance de recherche généalogique en Tunisie à partir de 1,99 $ / mois."
        keywords={["Roots Tunisia pricing", "tarifs généalogie tunisie", "actes état civil tunisie", "naturalisation 1924 1927"]}
      />

      <PageHero
        eyebrow={t("subscriptions_eyebrow", "Services & Abonnements Généalogiques")}
        title={t("subscriptions_hero_title", "Accédez aux Actes & Retracez vos Lignées en Tunisie")}
        subtitle={t("subscriptions_hero_subtitle", "Un modèle clair centré sur la valeur : consultez les actes numérisés, décrets de naturalisation et registres notariés réels à prix accessible.")}
        image={medina}
      />

      <Section>
        {/* Header Bar */}
        <div className="surface-card frame-gold p-6 sm:p-8 rounded-2xl shadow-xl max-w-5xl mx-auto -mt-16 sm:-mt-20 relative z-20 bg-[var(--card)]/95 backdrop-blur-md">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-start w-full md:w-auto">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--gold)]/15 text-[var(--gold)] ring-1 ring-[var(--gold)]/40 shadow-inner">
                <Crown className="h-7 w-7" />
              </div>
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[var(--foreground)]">
                  {t("subscription_plans", "Abonnements & Accès aux Actes")}
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-[var(--muted-foreground)]">
                  {t("subscription_value_sub", "Freemium à 0 $, Chercheur d’actes à 1,99 $ et Historien Pro à 3,99 $ / mois.")}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-start md:justify-end">
              <div className="flex items-center gap-2 p-1.5 rounded-xl border border-[var(--gold)]/35 bg-[var(--background)] shadow-sm">
                <Coins className="h-4 w-4 text-[var(--gold)] shrink-0 ms-1" />
                <span className="text-[0.68rem] font-bold text-[var(--muted-foreground)] uppercase">
                  {t("currency", "Devise")}:
                </span>
                <select
                  value={safeCurrencyCode}
                  onChange={(e) => setCurrencyCode(e.target.value)}
                  className="bg-transparent text-xs font-bold font-mono text-[var(--foreground)] outline-none cursor-pointer pe-2"
                >
                  {currencies
                    .filter((c) => String(c?.code || "").trim())
                    .map((c) => (
                      <option key={c.code} value={c.code} className="bg-[var(--card)] text-[var(--foreground)]">
                        {c.code} ({c.symbol}) — {c.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex items-center rounded-xl border border-[var(--gold)]/35 bg-[var(--background)] p-1 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setBillingCycle("monthly")}
                  className={`rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
                    billingCycle === "monthly"
                      ? "bg-[var(--gold)] text-[#1f160f] shadow-sm"
                      : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {t("monthly", "Mensuel")}
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle("annual")}
                  className={`rounded-lg px-3 py-1.5 transition-all flex items-center gap-1.5 cursor-pointer ${
                    billingCycle === "annual"
                      ? "bg-[var(--gold)] text-[#1f160f] shadow-sm"
                      : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  }`}
                >
                  <span>{t("annual", "Annuel")}</span>
                  <span className="rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.2 text-[0.62rem] font-extrabold border border-emerald-500/30">
                    -17%
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Main Tier Cards */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch w-full max-w-[var(--content-max)] mx-auto">
          {tiers.map((tier) => {
            const isBasic = tier.id === 1;

            return (
              <div
                key={tier.id}
                className={`surface-card frame-gold p-6 sm:p-7 rounded-2xl shadow-xl flex flex-col justify-between relative transition-all duration-300 text-start ${
                  tier.isCurrent
                    ? "border-[var(--gold)] ring-2 ring-[var(--gold)]/40 bg-[var(--card)]"
                    : "border-[var(--gold)]/35 hover:-translate-y-1.5 hover:shadow-2xl bg-[var(--card)]"
                }`}
              >
                {tier.isCurrent && (
                  <span className="absolute -top-3.5 start-6 px-3.5 py-1 rounded-full text-[0.68rem] font-extrabold uppercase tracking-wide bg-[var(--gold)] text-[#1f160f] shadow-md border border-[#1f160f]/20">
                    {t("current_active_plan", "Votre Formule Actuelle")}
                  </span>
                )}
                {!tier.isCurrent && tier.badge && (
                  <span className="absolute -top-3.5 start-6 px-3 py-1 rounded-full text-[0.65rem] font-bold uppercase tracking-wider bg-[var(--gold)]/20 text-[var(--gold)] border border-[var(--gold)]/40 backdrop-blur-sm shadow-sm">
                    {tier.badge}
                  </span>
                )}

                <div>
                  <h3 className="font-display text-2xl font-bold text-[var(--foreground)] mt-2">
                    {tier.name}
                  </h3>

                  {tier.description ? (
                    <p className="mt-1.5 text-xs text-[var(--muted-foreground)] leading-relaxed min-h-[36px]">
                      {tier.description}
                    </p>
                  ) : null}

                  <div className="flex items-baseline gap-1.5 my-4 border-b border-[var(--gold)]/20 pb-4">
                    <span className="font-display text-3xl sm:text-4xl font-extrabold text-[var(--gold)]">
                      {tier.priceDisplay}
                    </span>
                    <span className="text-xs text-[var(--muted-foreground)] font-semibold">
                      {tier.period}
                    </span>
                  </div>

                  {/* Real Genealogical Services List */}
                  <div className="space-y-2.5 text-xs sm:text-sm text-[var(--foreground)] py-2">
                    <div className="text-[0.7rem] font-bold uppercase tracking-wider text-[var(--gold)] pb-1">
                      {isBasic ? "Services inclus sans frais :" : "Ce que vous obtenez :"}
                    </div>
                    {tier.services.map((serviceText, sIdx) => (
                      <div key={sIdx} className="flex items-start gap-2.5">
                        <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5 stroke-[2.5]" />
                        <span className="text-[var(--foreground)] font-medium leading-snug">
                          {serviceText}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Technical Quotas Button (Opens Modal) */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedQuotaTierId(tier.id);
                      setQuotaModalOpen(true);
                    }}
                    className="mt-4 pt-3 border-t border-[var(--gold)]/20 text-xs font-semibold text-[var(--gold)] hover:text-amber-500 flex items-center justify-between w-full cursor-pointer transition-colors group"
                  >
                    <span className="flex items-center gap-1.5">
                      <Sliders className="h-3.5 w-3.5 group-hover:rotate-45 transition-transform" />
                      <span>{t("view_full_quotas", "Voir tous les quotas & limites techniques")}</span>
                    </span>
                    <span className="text-[10px] font-mono opacity-80 underline">
                      Détails →
                    </span>
                  </button>
                </div>

                <div className="pt-6 mt-4 border-t border-[var(--gold)]/20">
                  {tier.isCurrent ? (
                    <button
                      type="button"
                      disabled
                      className="w-full py-3 rounded-xl bg-black/10 dark:bg-white/10 border border-[var(--border)] text-[var(--muted-foreground)] font-bold text-xs sm:text-sm cursor-default text-center shadow-inner"
                    >
                      {t("active_plan_btn", "Formule Active")}
                    </button>
                  ) : isBasic ? (
                    <button
                      type="button"
                      onClick={() => handleSelectTier(tier)}
                      className="w-full py-3 rounded-xl border-2 border-[var(--gold)]/40 hover:border-[var(--gold)] bg-[var(--background)] hover:bg-[var(--gold)]/10 text-[var(--foreground)] text-xs sm:text-sm font-bold text-center cursor-pointer transition-colors shadow-sm"
                    >
                      {t("start_free", "Démarrer Gratuitement")}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSelectTier(tier)}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-[var(--gold)] to-amber-600 hover:from-amber-500 hover:to-[var(--gold)] text-[#1f160f] text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:scale-[1.02] transition-all"
                    >
                      <Crown className="w-4 h-4 shrink-0 text-[#1f160f]" />
                      <span>
                        {t("upgrade_to", "Choisir")} {tier.name}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Global Modal Trigger Link */}
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => setQuotaModalOpen(true)}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[var(--gold)] hover:underline cursor-pointer"
          >
            <Sliders className="h-4 w-4" />
            <span>{t("view_all_quotas_modal_btn", "Consulter le tableau complet des quotas de stockage par niveau")}</span>
          </button>
        </div>

        <div className="mt-10 text-center text-xs text-[var(--muted-foreground)] flex items-center justify-center gap-2 max-w-xl mx-auto">
          <ShieldCheck className="h-4 w-4 text-[var(--gold)] shrink-0" />
          <span>
            {t(
              "subscriptions_guarantee",
              "Paiement sécurisé · Aucun engagement de durée · Annulation en 1 clic · Tarifs justes et transparents",
            )}
          </span>
        </div>

        {/* On-Demand Archival Services & Upsells (Paiement à l'Acte) */}
        <div className="mt-20">
          <SectionHeading
            center={true}
            eyebrow={t("services_ondemand_badge", "Services Sur Mesure & Recherche à la Carte")}
            title={t("services_ondemand_title", "Besoin d'aide pour un acte ou un document ancien ?")}
            intro={t(
              "services_ondemand_subtitle",
              "Nos historiens et paléographes interviennent directement pour déchiffrer, traduire ou rechercher des actes non numérisés en Tunisie."
            )}
          />

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto text-start">
            {/* Service 1: Transcription */}
            <div className="surface-card frame-gold p-6 rounded-2xl shadow-md flex flex-col justify-between hover:-translate-y-1 transition-all border-t-4 border-t-amber-500">
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
                  <Languages className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-display font-bold text-[var(--foreground)]">
                    {t("service_transcription_title", "Déchiffrage & Transcription")}
                  </h3>
                  <p className="mt-1 font-mono text-xl font-extrabold text-[var(--gold)]">
                    {t("service_transcription_price", "25 € / 25 $ (80 TND)")}
                    <span className="text-xs font-normal text-[var(--muted-foreground)]"> / acte</span>
                  </p>
                </div>
                <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed">
                  {t(
                    "service_transcription_desc",
                    "Transcription et traduction certifiée de manuscrits anciens en arabe maghrébin, turc ottoman, italien ancien ou latin d'église."
                  )}
                </p>
                <ul className="space-y-2 text-xs text-[var(--foreground)]/90 pt-2 border-t border-[var(--border)]">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[var(--gold)] shrink-0" />
                    <span>Transcription intégrale mot à mot</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[var(--gold)] shrink-0" />
                    <span>Traduction en français ou anglais</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[var(--gold)] shrink-0" />
                    <span>Notes onomastiques sur les patronymes</span>
                  </li>
                </ul>
              </div>
              <div className="pt-6 mt-6 border-t border-[var(--border)]">
                <a
                  href={`https://wa.me/21671234567?text=${encodeURIComponent("Bonjour Roots Tunisia, je souhaite commander une transcription/déchiffrage d'acte ancien.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-base btn-gold w-full text-center flex items-center justify-center gap-2 text-xs font-bold py-2.5"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{t("service_order_cta", "Commander ce service")}</span>
                </a>
              </div>
            </div>

            {/* Service 2: In Situ Research */}
            <div className="surface-card frame-gold p-6 rounded-2xl shadow-md flex flex-col justify-between hover:-translate-y-1 transition-all border-t-4 border-t-[var(--gold)]">
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--gold)]/15 text-[var(--gold)]">
                  <Search className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-display font-bold text-[var(--foreground)]">
                    {t("service_insitu_title", "Recherche In Situ aux Archives")}
                  </h3>
                  <p className="mt-1 font-mono text-xl font-extrabold text-[var(--gold)]">
                    {t("service_insitu_price", "49 € / 49 $ (160 TND)")}
                    <span className="text-xs font-normal text-[var(--muted-foreground)]"> / dossier</span>
                  </p>
                </div>
                <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed">
                  {t(
                    "service_insitu_desc",
                    "Mandat d'un chercheur à Tunis (dépôt de la Kasbah, dépôts municipaux) pour retrouver, vérifier et photographier une cote physique."
                  )}
                </p>
                <ul className="space-y-2 text-xs text-[var(--foreground)]/90 pt-2 border-t border-[var(--border)]">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[var(--gold)] shrink-0" />
                    <span>Déplacement physique aux dépôts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[var(--gold)] shrink-0" />
                    <span>Photographies HD des folios originaux</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[var(--gold)] shrink-0" />
                    <span>Rapport de recherche avec cotes exactes</span>
                  </li>
                </ul>
              </div>
              <div className="pt-6 mt-6 border-t border-[var(--border)]">
                <a
                  href={`https://wa.me/21671234567?text=${encodeURIComponent("Bonjour Roots Tunisia, je souhaite mandater un chercheur pour une recherche in situ aux archives.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-base btn-gold w-full text-center flex items-center justify-center gap-2 text-xs font-bold py-2.5"
                >
                  <Search className="h-3.5 w-3.5" />
                  <span>{t("service_order_cta", "Commander ce service")}</span>
                </a>
              </div>
            </div>

            {/* Service 3: Certified Lineage Dossier */}
            <div className="surface-card frame-gold p-6 rounded-2xl shadow-md flex flex-col justify-between hover:-translate-y-1 transition-all border-t-4 border-t-emerald-600">
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  <ScrollText className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-display font-bold text-[var(--foreground)]">
                    {t("service_notary_title", "Validation de Filiation Notariée")}
                  </h3>
                  <p className="mt-1 font-mono text-xl font-extrabold text-[var(--gold)]">
                    {t("service_notary_price", "99 € / 99 $ (320 TND)")}
                    <span className="text-xs font-normal text-[var(--muted-foreground)]"> / lignée</span>
                  </p>
                </div>
                <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed">
                  {t(
                    "service_notary_desc",
                    "Constitution d'un dossier complet de filiation avec sceaux archivistiques et chaînes de transmission pour vos démarches officielles."
                  )}
                </p>
                <ul className="space-y-2 text-xs text-[var(--foreground)]/90 pt-2 border-t border-[var(--border)]">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[var(--gold)] shrink-0" />
                    <span>Dossier complet de preuves juridiques</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[var(--gold)] shrink-0" />
                    <span>Validation paléographique de la chaîne</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[var(--gold)] shrink-0" />
                    <span>Livret de transmission patrimoniale relié</span>
                  </li>
                </ul>
              </div>
              <div className="pt-6 mt-6 border-t border-[var(--border)]">
                <a
                  href={`https://wa.me/21671234567?text=${encodeURIComponent("Bonjour Roots Tunisia, je souhaite commander une validation de filiation notariée.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-base bg-emerald-700 hover:bg-emerald-800 text-white w-full text-center flex items-center justify-center gap-2 text-xs font-bold py-2.5 transition shadow"
                >
                  <ScrollText className="h-3.5 w-3.5" />
                  <span>{t("service_order_cta", "Commander ce service")}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Service Comparison Table */}
        <div className="mt-20">
          <SectionHeading
            center={true}
            eyebrow={t("comparison_eyebrow", "Transparence Totale")}
            title={t("compare_all_features", "Comparatif Détaillé des Services")}
            intro={t("compare_intro", "Retrouvez les accès et prestations inclus selon vos besoins de recherche.")}
          />

          <div className="surface-card frame-gold mt-10 rounded-2xl overflow-hidden shadow-xl max-w-5xl mx-auto">
            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-[var(--gold)]/30 bg-[var(--gold)]/10 text-[var(--foreground)]">
                    <th className="py-4 px-6 text-start font-bold uppercase tracking-wider text-xs">
                      {t("feature", "Prestation & Accès")}
                    </th>
                    <th className="py-4 px-4 text-center font-bold text-xs">
                      {byId(1)?.name || "Découverte"}
                      <div className="text-[10px] text-[var(--muted-foreground)] font-normal">0,00 $</div>
                    </th>
                    <th className="py-4 px-4 text-center font-bold text-xs text-[var(--gold)]">
                      {byId(2)?.name || "Chercheur & Actes"}
                      <div className="text-[10px] text-[var(--gold)] font-normal">1,99 $ / mois</div>
                    </th>
                    <th className="py-4 px-4 text-center font-bold text-xs">
                      {byId(3)?.name || "Historien Pro"}
                      <div className="text-[10px] text-[var(--muted-foreground)] font-normal">3,99 $ / mois</div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {comparisonRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-[var(--gold)]/5 transition-colors">
                      <td className="py-3.5 px-6 font-medium text-[var(--foreground)]">
                        {row.feature}
                      </td>

                      {[row.basic, row.premium, row.historian].map((val, cellIdx) => (
                        <td key={cellIdx} className="py-3.5 px-4 text-center">
                          {typeof val === "boolean" ? (
                            val ? (
                              <Check className="h-5 w-5 text-emerald-500 mx-auto" />
                            ) : (
                              <X className="h-4 w-4 text-rose-400 mx-auto opacity-60" />
                            )
                          ) : (
                            <span
                              className={`font-semibold ${
                                cellIdx === 1 ? "text-[var(--gold)] font-bold" : "text-[var(--foreground)]"
                              }`}
                            >
                              {val}
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <SectionHeading
            center={true}
            eyebrow={t("faq_eyebrow", "Questions Fréquentes")}
            title={t("frequently_asked_questions", "Comprendre nos abonnements et notre méthodologie")}
            intro={t("faq_intro", "Des réponses directes et sans détours sur les sources, les tarifs et l’accès aux actes.")}
          />

          <div className="mt-10 space-y-3.5">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="surface-card frame-gold rounded-xl border border-[var(--gold)]/30 overflow-hidden shadow-sm transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-start font-bold flex items-center justify-between gap-4 cursor-pointer hover:bg-[var(--gold)]/5 transition-colors text-xs sm:text-sm"
                  >
                    <span className="flex items-center gap-2.5 text-[var(--foreground)]">
                      <HelpCircle className="h-4 w-4 text-[var(--gold)] shrink-0" />
                      <span>{t(faq.qKey, faq.defaultQ)}</span>
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-[var(--gold)] shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed border-t border-[var(--gold)]/10">
                      {t(faq.aKey, faq.defaultA)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* ========================================================================= */}
      {/* QUOTAS MODAL (Technical Storage & Capacity Limits)                         */}
      {/* ========================================================================= */}
      {quotaModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setQuotaModalOpen(false)}
        >
          <div
            className="surface-card frame-gold relative w-full max-w-2xl rounded-2xl bg-[var(--card)] p-6 sm:p-7 shadow-2xl border border-[var(--gold)]/40 overflow-hidden text-start max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[var(--gold)]/20">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--gold)]/15 text-[var(--gold)]">
                  <Sliders className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--foreground)] font-display">
                    {t("quotas_modal_title", "Quotas Techniques & Limites de Stockage")}
                  </h3>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {t("quotas_modal_sub", "Capacités techniques allouées à votre compte selon votre formule :")}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setQuotaModalOpen(false)}
                className="rounded-lg p-2 text-[var(--muted-foreground)] hover:bg-[var(--gold)]/10 hover:text-[var(--gold)] transition-colors cursor-pointer"
                aria-label="Fermer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Tier Selector in Modal */}
            <div className="flex items-center gap-2 py-4 border-b border-[var(--border)] overflow-x-auto">
              {tiers.map((tItem) => (
                <button
                  key={tItem.id}
                  type="button"
                  onClick={() => setSelectedQuotaTierId(tItem.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    selectedQuotaTierId === tItem.id
                      ? "bg-[var(--gold)] text-[#1f160f] shadow-md"
                      : "bg-[var(--background)] border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {tItem.name} ({tItem.priceDisplay})
                </button>
              ))}
            </div>

            {/* Quota Details List */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              <div className="rounded-xl bg-[var(--gold)]/10 border border-[var(--gold)]/30 p-3 text-xs text-[var(--foreground)]">
                <span className="font-bold text-[var(--gold)]">{activeModalTier.name} :</span>{" "}
                Ces quotas sont configurés et garantis pour chaque utilisateur. Ils n'entravent jamais la consultation des actes publics.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {quotaLabels.map((item) => {
                  const Icon = item.icon;
                  const limit = activeModalTier.limits[item.key as keyof typeof activeModalTier.limits];
                  return (
                    <div
                      key={item.key}
                      className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--background)]/80 flex items-center justify-between gap-3 shadow-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--gold)]/15 text-[var(--gold)]">
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-semibold text-[var(--foreground)]">
                          {item.label}
                        </span>
                      </div>
                      <span className="font-mono text-sm font-extrabold text-[var(--gold)] shrink-0 px-2 py-0.5 rounded bg-[var(--card)] border border-[var(--gold)]/30">
                        {limit}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-[var(--gold)]/20 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-[var(--muted-foreground)]">
                Formule sélectionnée : <b className="text-[var(--foreground)]">{activeModalTier.name}</b> ({activeModalTier.priceDisplay} {activeModalTier.period})
              </span>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setQuotaModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[var(--border)] text-xs font-semibold hover:bg-[var(--gold)]/10 transition cursor-pointer w-full sm:w-auto"
                >
                  Fermer
                </button>
                {!activeModalTier.isCurrent && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuotaModalOpen(false);
                      handleSelectTier(activeModalTier);
                    }}
                    className="px-4 py-2 rounded-xl bg-[var(--gold)] text-[#1f160f] text-xs font-bold shadow-md hover:bg-amber-500 transition cursor-pointer w-full sm:w-auto"
                  >
                    Choisir cette formule
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
