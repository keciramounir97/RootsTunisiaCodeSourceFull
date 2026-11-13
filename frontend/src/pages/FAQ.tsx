import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  HelpCircle,
  Search,
  ChevronDown,
  Sparkles,
  CreditCard,
  Briefcase,
  Network,
  ShieldCheck,
  MessageCircle,
  Mail,
  ArrowRight,
  BookOpen,
  LifeBuoy,
  X,
  CheckCircle2,
} from "lucide-react";
import { useTranslation } from "../context/TranslationContext";
import SEO from "../components/SEO";
import { buildConfiguredWhatsAppUrl } from "../utils/whatsAppContact";

interface FaqItem {
  id: string;
  category: "subscriptions" | "services" | "trees" | "privacy" | "support";
  q: string;
  a: string;
  badge?: string;
}

export default function FAQPage() {
  const { t, isRtl } = useTranslation();
  const faqWhatsappUrl = buildConfiguredWhatsAppUrl(
    "Bonjour Roots Tunisia, j'ai une question spécifique concernant mes recherches d'archives.",
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = [
    { id: "all", label: "Toutes les Questions", icon: HelpCircle },
    { id: "subscriptions", label: "Abonnements & Tarifs", icon: CreditCard },
    { id: "services", label: "Prestations & Déchiffrage", icon: Briefcase },
    { id: "trees", label: "Arbres & GEDCOM", icon: Network },
    { id: "privacy", label: "Confidentialité & Droits", icon: ShieldCheck },
    { id: "support", label: "Comptes & Assistance", icon: LifeBuoy },
  ];

  const faqList: FaqItem[] = [
    // === Abonnements & Tarifs ===
    {
      id: "sub-pricing",
      category: "subscriptions",
      badge: "Tarifs & Devises",
      q: "Comment sont fixés les prix et quelles devises sont acceptées ?",
      a: "Nos tarifs ont été fixés pour rester extrêmement accessibles à tous les chercheurs de la diaspora et de Tunisie : accès découverte libre (0 $), 1,99 $/mois pour l'accès complet aux actes numérisés et aux arbres de la galerie, et 3,99 $/mois pour l'accompagnement d'un historien. Les prix sont convertis en temps réel dans votre devise locale (TND, EUR, USD, CAD, GBP, SAR).",
    },
    {
      id: "sub-request-act",
      category: "subscriptions",
      q: "Comment puis-je demander une recherche ciblée d'acte en Tunisie ?",
      a: "Avec l'abonnement Historien Pro (3,99 $), vous pouvez soumettre une demande ciblée (par exemple un acte de mariage ou de décès dans une commune spécifique) et bénéficier de l'aide de notre réseau de transcripteurs pour déchiffrer les actes manuscrits arabes ou italiens.",
    },
    {
      id: "sub-cancel",
      category: "subscriptions",
      q: "Puis-je changer ou annuler mon abonnement à tout moment ?",
      a: "Oui, sans aucun engagement. Vous pouvez upgrader, downgrader ou résilier votre abonnement en un clic depuis votre espace utilisateur. Vos arbres et données généalogiques créés restent toujours consultables en toute sécurité.",
    },
    {
      id: "sub-payment-methods",
      category: "subscriptions",
      q: "Quels sont les modes de paiement acceptés ?",
      a: "Nous acceptons les cartes bancaires internationales (Visa, Mastercard), les virements bancaires nationaux (RIB tunisien) et internationaux (IBAN / SWIFT), ainsi que les règlements par D17 / Flouci pour les résidents en Tunisie.",
    },
    {
      id: "sub-activation-delay",
      category: "subscriptions",
      q: "Quel est le délai d'activation après soumission de ma preuve de paiement ?",
      a: "Pour les paiements par carte bancaire, l'activation est immédiate. Pour les virements et transferts manuels avec reçu, notre équipe administrative valide l'accès sous 2 à 24 heures ouvrées.",
    },

    // === Prestations de Services & Déchiffrage ===
    {
      id: "srv-workflow",
      category: "services",
      badge: "Méthodologie",
      q: "Comment se déroule la prise en charge d'un dossier de recherche ou de transcription ?",
      a: "Dès réception de votre demande via le formulaire de réservation ou WhatsApp, un chercheur paléographe examine la faisabilité et les cotes disponibles aux Archives Nationales de Tunisie. Un devis transparent et un planning d'intervention vous sont confirmés sous 24h avant tout paiement.",
    },
    {
      id: "srv-doc-types",
      category: "services",
      q: "Quels types de documents d'archives anciennes pouvez-vous transcrire ?",
      a: "Nous traitons les actes manuscrits en arabe maghrébin, turc ottoman, italien ancien ou latin d'église : registres paroissiaux, rôles fiscaux beylicaux (qānūn), actes des tribunaux de la Charaâ (ouzara, cadis), registres d'état civil beylicaux et coloniaux, correspondances consulaires et actes notariés.",
    },
    {
      id: "srv-notarized",
      category: "services",
      badge: "Validité Juridique",
      q: "Les dossiers de filiation sont-ils certifiés et recevables juridiquement ?",
      a: "Oui, nos dossiers de filiation s'appuient sur des photographies haute définition des actes originaux, accompagnées des cotes officielles des dépôts d'archives et de la transcription paléographique rigoureuse avec sceau d'expert pour vos démarches administratives, notariales ou consulaires.",
    },
    {
      id: "srv-insitu",
      category: "services",
      q: "Mandatez-vous des chercheurs physiquement aux dépôts d'archives à Tunis et en régions ?",
      a: "Absolument. Notre service de Recherche In Situ comprend le déplacement physique d'un chercheur aux Archives Nationales de Tunisie (dépôt de la Kasbah), aux dépôts municipaux et diocésains pour retrouver, vérifier sous fiches foliotées et photographier en HD les documents originaux.",
    },
    {
      id: "srv-delays",
      category: "services",
      q: "Quels sont les délais habituels de livraison d'une prestation ?",
      a: "Un déchiffrage d'acte manuscrit est généralement rendu sous 48h à 72h. Une mission de recherche in situ ou une validation de filiation notariée nécessite 7 à 15 jours ouvrés selon la localisation des registres.",
    },

    // === Arbres Généalogiques & GEDCOM ===
    {
      id: "tree-start",
      category: "trees",
      q: "Comment créer mon premier arbre généalogique sur Roots Tunisia ?",
      a: "Depuis votre espace personnel, cliquez sur « Nouvel Arbre », saisissez votre fiche individuelle ou celle d'un ancêtre racine, puis ajoutez parents, conjoints et enfants. Vous pouvez également importer directement un fichier GEDCOM existant en un clic.",
    },
    {
      id: "tree-gedcom-formats",
      category: "trees",
      badge: "Interopérabilité",
      q: "Quels formats de fichiers GEDCOM sont supportés en import et export ?",
      a: "Nous prenons en charge l'ensemble des standards internationaux : GEDCOM 5.5.1, GEDCOM 7.0 moderne, ainsi que les formats GEDCOM X (XML / JSON / .gedx) pour garantir l'interopérabilité totale avec vos logiciels (Gramps, Heredis, Ancestry).",
    },
    {
      id: "tree-download-protection",
      category: "trees",
      q: "Pourquoi puis-je visualiser un arbre public mais devoir demander une autorisation pour le télécharger ?",
      a: "La consultation d'un arbre public est libre dans l'interface interactive. Toutefois, le téléchargement brut du fichier GEDCOM nécessite l'accord du propriétaire de l'arbre ou d'un administrateur. Cela protège le travail d'enquête des chercheurs contre le pillage en masse.",
    },
    {
      id: "tree-request-download",
      category: "trees",
      q: "Comment effectuer une demande de téléchargement d'arbre ?",
      a: "Sur la fiche de l'arbre, cliquez sur « Demander le téléchargement ». Le propriétaire reçoit une notification et examine votre demande. Vous pouvez suivre l'état d'avancement de vos demandes depuis votre profil.",
    },

    // === Confidentialité & Droits ===
    {
      id: "priv-visibility",
      category: "privacy",
      q: "Qui a accès aux données de mon arbre généalogique ?",
      a: "Vous choisissez la visibilité lors de la création de chaque arbre : Privé (strictement accessible à vous seul) ou Public (visible dans la galerie de la communauté). Pour les personnes contemporaines vivantes, les données sensibles sont masquées par défaut.",
    },
    {
      id: "priv-gdpr",
      category: "privacy",
      badge: "RGPD & Protection",
      q: "Comment mes données personnelles et généalogiques sont-elles protégées ?",
      a: "Roots Tunisia applique des standards de sécurité stricts conformes au RGPD et aux législations sur les données personnelles. Toutes les communications sont chiffrées (SSL/TLS), et vos données ne sont jamais vendues ni cédées à des régies publicitaires.",
    },
    {
      id: "priv-deletion",
      category: "privacy",
      q: "Puis-je exporter ou supprimer définitivement mes données et mon compte ?",
      a: "Oui. Vous bénéficiez d'un droit total d'accès, d'exportation de vos arbres et de suppression définitive de votre compte depuis la page Paramètres de votre profil.",
    },

    // === Assistance & Support ===
    {
      id: "sup-contact",
      category: "support",
      q: "Comment contacter l'équipe Roots Tunisia en cas de question ou de blocage ?",
      a: "Vous pouvez nous joindre via notre formulaire de contact en ligne, par email à contact@rootstunisia.com, ou directement via notre assistance WhatsApp dédiée pour un échange rapide avec nos généalogistes.",
    },
    {
      id: "sup-forgot-password",
      category: "support",
      q: "J'ai oublié mon mot de passe, comment le réinitialiser ?",
      a: "Cliquez sur « Mot de passe oublié » sur la page de connexion, saisissez votre adresse email et suivez le lien sécurisé envoyé dans votre boîte de réception pour définir un nouveau mot de passe.",
    },
  ];

  // Filtering
  const filteredFaqs = useMemo(() => {
    return faqList.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;

      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchesCategory;

      const matchQ = item.q.toLowerCase().includes(q);
      const matchA = item.a.toLowerCase().includes(q);
      const matchBadge = item.badge?.toLowerCase().includes(q);

      return matchesCategory && (matchQ || matchA || matchBadge);
    });
  }, [faqList, selectedCategory, searchQuery]);

  const toggleAccordion = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleExpandAll = () => {
    if (expandedId === "ALL") {
      setExpandedId(null);
    } else {
      setExpandedId("ALL");
    }
  };

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pb-24"
    >
      <SEO
        title="Foire Aux Questions (FAQ) — Réponses & Méthodologie | Roots Tunisia"
        description="Trouvez des réponses complètes sur nos abonnements, sources d'archives, tarifs, déchiffrage d'actes anciens, formats GEDCOM et recherche généalogique en Tunisie."
        keywords={[
          "FAQ Roots Tunisia",
          "Questions généalogie Tunisie",
          "Archives nationales tunisiennes",
          "Abonnements Roots Tunisia",
          "Déchiffrage acte ancien",
          "GEDCOM Tunisie",
        ]}
      />

      {/* Hero Header */}
      <section className="relative overflow-hidden pt-28 pb-16 lg:pt-36 lg:pb-20 border-b border-[var(--gold)]/20 bg-gradient-to-b from-[var(--card)]/90 via-[var(--background)] to-[var(--background)]">
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(circle_at_50%_20%,var(--gold)_0%,transparent_60%)]" />
        <div className="max-w-[var(--content-max)] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--gold)]/40 bg-[var(--gold)]/10 text-[var(--gold)] text-xs font-semibold uppercase tracking-widest mb-6">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Centre d'Aide & Questions Fréquentes</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-cinzel font-bold text-[var(--foreground)] tracking-tight leading-tight max-w-4xl mx-auto">
            Foire Aux <span className="text-gradient-gold">Questions</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-[var(--foreground)]/75 max-w-2xl mx-auto font-body leading-relaxed">
            Tout ce que vous devez savoir sur la consultation des registres d'archives, nos abonnements,
            le déchiffrage paléographique et la construction de vos arbres généalogiques en Tunisie.
          </p>

          {/* Quick Search Input */}
          <div className="mt-8 max-w-xl mx-auto relative">
            <Search className="w-4 h-4 absolute start-4 top-1/2 -translate-y-1/2 text-[var(--foreground)]/45" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une question (tarifs, GEDCOM, déchiffrage, Kasbah, virement)..."
              className="w-full ps-11 pe-10 py-3.5 rounded-xl border border-[var(--gold)]/40 bg-[var(--card)] text-sm shadow-xl focus:outline-none focus:border-[var(--gold)] transition-colors placeholder:text-[var(--foreground)]/40"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute end-3.5 top-1/2 -translate-y-1/2 text-[var(--foreground)]/50 hover:text-[var(--foreground)]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Category Pills Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-thin">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? "bg-[var(--gold)] text-[var(--card)] font-bold shadow-md"
                    : "surface-card border border-[var(--gold)]/30 text-[var(--foreground)]/80 hover:border-[var(--gold)] hover:bg-[var(--gold)]/5"
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Results Header with Toggle All */}
        <div className="flex items-center justify-between gap-4 mb-6 pb-3 border-b border-[var(--gold)]/20 text-xs">
          <span className="text-[var(--foreground)]/70">
            Affichage de <span className="font-bold text-[var(--gold)]">{filteredFaqs.length}</span> question{filteredFaqs.length > 1 ? "s" : ""}
          </span>

          <button
            type="button"
            onClick={handleExpandAll}
            className="text-xs font-semibold text-[var(--gold)] hover:underline cursor-pointer"
          >
            {expandedId === "ALL" ? "Tout replier" : "Tout déplier"}
          </button>
        </div>

        {/* Empty State */}
        {filteredFaqs.length === 0 && (
          <div className="py-16 text-center surface-card rounded-xl border border-[var(--gold)]/25 p-8 max-w-md mx-auto">
            <HelpCircle className="w-12 h-12 text-[var(--gold)]/40 mx-auto mb-3" />
            <h3 className="font-cinzel text-base font-bold">Aucune réponse correspondante</h3>
            <p className="text-xs text-[var(--foreground)]/70 mt-1">
              Essayez un autre terme de recherche ou explorez une autre catégorie.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="mt-4 px-4 py-2 rounded-lg bg-[var(--gold)] text-[var(--card)] text-xs font-bold"
            >
              Réinitialiser la recherche
            </button>
          </div>
        )}

        {/* Accordion FAQ Items */}
        <div className="space-y-3.5">
          {filteredFaqs.map((item) => {
            const isOpen = expandedId === "ALL" || expandedId === item.id;
            return (
              <div
                key={item.id}
                className={`surface-card rounded-xl border transition-all duration-200 overflow-hidden shadow-sm ${
                  isOpen
                    ? "border-[var(--gold)] shadow-md bg-[var(--card)]"
                    : "border-[var(--gold)]/30 hover:border-[var(--gold)]/60"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(item.id)}
                  className="w-full p-4 sm:p-5 flex items-start justify-between gap-4 text-start cursor-pointer hover:bg-[var(--gold)]/5 transition-colors"
                >
                  <div className="flex-1 space-y-1">
                    {item.badge && (
                      <span className="inline-block px-2 py-0.5 rounded-full text-[0.65rem] font-bold uppercase tracking-wider bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/25 mb-1">
                        {item.badge}
                      </span>
                    )}
                    <h3 className="text-sm sm:text-base font-semibold font-body text-[var(--foreground)] leading-snug">
                      {item.q}
                    </h3>
                  </div>
                  <div
                    className={`p-1.5 rounded-lg border border-[var(--gold)]/30 text-[var(--gold)] shrink-0 transition-transform duration-200 mt-0.5 ${
                      isOpen ? "rotate-180 bg-[var(--gold)]/15" : "bg-transparent"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-2 text-xs sm:text-sm text-[var(--foreground)]/80 leading-relaxed border-t border-[var(--gold)]/15 font-body">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact Support CTA Card */}
        <div className="mt-16 surface-card rounded-2xl border border-[var(--gold)]/35 p-6 sm:p-8 shadow-xl text-center relative overflow-hidden">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--gold)] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Assistance Dédiée</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-cinzel font-bold text-[var(--foreground)]">
            Vous n'avez pas trouvé réponse à votre question ?
          </h3>

          <p className="mt-2 text-xs sm:text-sm text-[var(--foreground)]/75 max-w-xl mx-auto font-body leading-relaxed">
            Nos chercheurs, archivistes et paléographes sont à votre écoute pour examiner la faisabilité
            de vos recherches d'ancêtres en Tunisie.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            {faqWhatsappUrl ? (
              <a
                href={faqWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Contacter un Archiviste sur WhatsApp</span>
              </a>
            ) : null}

            <Link
              to="/contact"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[var(--gold)]/50 bg-[var(--gold)]/10 hover:bg-[var(--gold)]/20 text-[var(--gold)] font-bold text-xs inline-flex items-center justify-center gap-2 transition-all"
            >
              <Mail className="w-4 h-4" />
              <span>Envoyer un message de contact</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

