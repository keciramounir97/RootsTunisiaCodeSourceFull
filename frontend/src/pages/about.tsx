import { Link } from "react-router-dom";
import {
  MapPin,
  Landmark,
  BookOpen,
  ScrollText,
  Search,
  ShieldCheck,
  Building,
  Lock,
  ArrowRight,
  Sparkles,
  FileSearch,
  CheckCircle2,
  Scale,
  Compass,
  FileText,
  HelpCircle,
  FolderArchive,
  Eye,
  Mail,
  Network,
} from "lucide-react";
import SEO from "../components/SEO";
import { useTranslation } from "../context/TranslationContext";
import SiteCustomBlocks from "../components/cms/SiteCustomBlocks";
import medina from "../assets/medina-tunis.jpg";

export default function About() {
  const { t, isRtl } = useTranslation();

  const brand = t("site_title", "Roots Tunisia");

  const corpuses = [
    {
      icon: Building,
      meta: "1886 – Aujourd'hui",
      title: "Registres de l'État Civil Municipal",
      desc: "Naissances, mariages et décès consignés dans les communes des 24 gouvernorats tunisiens depuis la création de l'état civil moderne sous le Protectorat.",
      depot: "Dépôts municipaux & Archives Nationales",
    },
    {
      icon: Scale,
      meta: "XVIIIe – 1957",
      title: "Tribunaux Charaïques & Rabbiniques",
      desc: "Actes de succession (‘Ilm Khabar), donations, testaments et dévolutions notariales rédigés par les ‘udûl de la Mahkama Cheraïa et de l'Ouzara.",
      depot: "Tribunaux de première instance & AN de Tunisie",
    },
    {
      icon: ScrollText,
      meta: "1856 – 1920",
      title: "Rôles Fiscaux Beylicaux & La Majba",
      desc: "Recensements nominatifs des contribuables et des chefs de feu par caïdat et cheikhat, permettant d'identifier la présence ancestrale dans une localité.",
      depot: "Série Historique du Gouvernement Beylical",
    },
    {
      icon: FolderArchive,
      meta: "XVIIe – 1956",
      title: "Fonds des Habous (Waqf)",
      desc: "Fondations pieuses familiales et dévolutions de biens décrivant les chaînes d'ascendance patrilinéaires authentifiées sur 3 à 6 générations.",
      depot: "Archives Nationales de Tunisie (La Kasbah)",
    },
  ];

  const whyUs = [
    {
      icon: MapPin,
      title: "Présence Physique In Situ",
      desc: "Nos chercheurs se déplacent physiquement à Tunis (Archives Nationales de La Kasbah, mairies de Bab Souika) et dans les régions pour localiser et photographier les cotes physiques exactes.",
    },
    {
      icon: FileSearch,
      title: "Paléographie Multilingue",
      desc: "Maîtrise de l'arabe maghrébin manuscrit cursif, de la terminologie juridique des ‘udûl, du turc ottoman beylical ainsi que des registres consulaires italiens et français.",
    },
    {
      icon: CheckCircle2,
      title: "Traçabilité & Preuve Intégrale",
      desc: "Chaque notice, individu ou filiation renvoie à une cote physique vérifiable (registre, carton, folio). Nous rejetons les généalogies présumées sans assise archivistique.",
    },
    {
      icon: Lock,
      title: "Déontologie & Protection INPDP",
      desc: "Conformité stricte avec la loi tunisienne n° 2004-63 (INPDP) et le RGPD : respect scrupuleux du délai légal de 100 ans et protection absolue de la vie privée des personnes vivantes.",
    },
  ];

  const sectionsExploration = [
    {
      to: "/interactive-map",
      icon: Compass,
      title: "Atlas Archivistique (24 Gouvernorats)",
      desc: "Explorez la Tunisie par région : découvrez les dépôts d'archives, les registres d'état civil locaux et les grandes lignées documentées.",
      actionText: "Consulter la carte",
    },
    {
      to: "/gallery/trees",
      icon: Network,
      title: "Arbres Généalogiques Documentés",
      desc: "Consultez des arbres interactifs construits à partir d'actes authentifiés, reliant les membres de familles tunisiennes, italiennes, maltaises et musulmanes.",
      actionText: "Explorer les lignées",
    },
    {
      to: "/gallery",
      icon: Eye,
      title: "Galerie & Fonds Numérisés",
      desc: "Archives photographiques d'époque, numérisations haute définition de manuscrits rares, récits oraux et documents historiques.",
      actionText: "Parcourir la galerie",
    },
    {
      to: "/services",
      icon: Landmark,
      title: "Prestations & Recherche In Situ",
      desc: "Mandatez nos archivistes pour rechercher une cote physique aux Archives Nationales, déchiffrer un acte ancien ou valider un dossier de filiation.",
      actionText: "Découvrir les services",
    },
    {
      to: "/faq",
      icon: HelpCircle,
      title: "Foire Aux Questions (FAQ)",
      desc: "Toutes les réponses sur la méthode de recherche, la communicabilité des registres, les cotes d'archives et nos garanties scientifiques.",
      actionText: "Consulter la FAQ",
    },
  ];

  const legalLinks = [
    {
      to: "/terms",
      title: "Conditions Générales d'Utilisation",
      desc: "Modalités d'accès à la plateforme et règles d'utilisation des outils de généalogie.",
    },
    {
      to: "/privacy",
      title: "Politique de Confidentialité",
      desc: "Traitement de vos données personnelles et conformité INPDP (Loi n° 2004-63) & RGPD.",
    },
    {
      to: "/refund",
      title: "Prestations & Remboursement",
      desc: "Cadre contractuel des recherches archivistiques in situ, devis sur-mesure et garanties.",
    },
    {
      to: "/cookies",
      title: "Gestion des Cookies",
      desc: "Informations relatives aux traceurs techniques et respect de votre consentement.",
    },
  ];

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="about-page bg-[var(--background)] text-[var(--foreground)] min-h-screen pb-20">
      <SEO
        title={`À Propos & Démarche Archivistique | ${brand}`}
        description="Roots Tunisia — La généalogie tunisienne fondée sur la preuve documentaire, le déchiffrage paléographique et la recherche in situ aux Archives Nationales."
        keywords={["À Propos Roots Tunisia", "Généalogie Tunisie", "Archives Nationales de Tunisie", "Paléographie", "INPDP"]}
      />

      {/* 1. Minimalist Editorial Hero */}
      <section className="relative overflow-hidden pt-28 pb-16 lg:pt-36 lg:pb-24 border-b border-[var(--gold)]/20 bg-gradient-to-b from-[var(--card)]/90 via-[var(--background)] to-[var(--background)]">
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(circle_at_50%_15%,var(--gold)_0%,transparent_60%)]" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--gold)]/40 bg-[var(--gold)]/10 text-[var(--gold)] text-xs font-semibold uppercase tracking-widest mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Manifeste & Démarche Archivistique</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-cinzel font-bold text-[var(--foreground)] tracking-tight leading-tight">
            La Généalogie par la <span className="text-gradient-gold">Preuve Documentaire</span>
          </h1>

          <div className="w-20 h-0.5 bg-[var(--gold)] mx-auto my-6" />

          <p className="text-base sm:text-lg text-[var(--foreground)]/80 max-w-2xl mx-auto font-body leading-relaxed">
            En Tunisie, la vérité généalogique ne s'invente pas : elle s'établit dans les registres du XIXe et XXe siècle. Nous comblons le fossé entre la tradition orale et les dépôts d'archives réels, sans promesse démesurée ni artifice.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/interactive-map"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--gold)] to-[var(--gold)]/85 text-[var(--card)] font-bold text-xs flex items-center gap-2 shadow-lg hover:shadow-xl hover:opacity-95 transition-all cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>Consulter l'Atlas des 24 Gouvernorats</span>
            </Link>

            <Link
              to="/gallery/trees"
              className="px-6 py-3 rounded-xl border border-[var(--gold)]/40 bg-[var(--card)]/60 text-[var(--foreground)] font-bold text-xs flex items-center gap-2 hover:bg-[var(--gold)]/15 transition-all cursor-pointer"
            >
              <Network className="w-4 h-4 text-[var(--gold)]" />
              <span>Parcourir les Lignées Documentées</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Notre Mission: Combler l'écart entre le mythe et l'archive */}
      <section className="py-16 sm:py-20 border-b border-[var(--gold)]/15">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 text-start space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--gold)]">
                Notre Démarche Scientifique
              </span>
              <h2 className="text-2xl sm:text-3xl font-cinzel font-bold text-[var(--foreground)] leading-snug">
                Combler l'Écart Entre la Rumeur et l'Archive
              </h2>
              <p className="text-xs sm:text-sm text-[var(--foreground)]/75 leading-relaxed">
                Trop souvent, la quête des origines en Afrique du Nord se heurte à des approximations ou des affirmations sans source. Chez Roots Tunisia, notre posture est délibérément rigoureuse : <strong>la généalogie vérifiable commence avec les documents probants.</strong>
              </p>
              <p className="text-xs sm:text-sm text-[var(--foreground)]/75 leading-relaxed">
                Nous identifions, croisons et exploitons les fonds authentiques reliant les communautés musulmanes, juives, italiennes et maltaises de Tunisie.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {corpuses.map((corpus) => {
                const Icon = corpus.icon;
                return (
                  <div
                    key={corpus.title}
                    className="surface-card rounded-xl border border-[var(--gold)]/25 p-5 text-start hover:border-[var(--gold)]/60 transition-all shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="w-9 h-9 rounded-lg bg-[var(--gold)]/15 text-[var(--gold)] flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[0.65rem] font-bold text-[var(--gold)] font-mono">
                        {corpus.meta}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-[var(--foreground)] mb-1.5">
                      {corpus.title}
                    </h3>
                    <p className="text-xs text-[var(--foreground)]/70 leading-relaxed mb-3">
                      {corpus.desc}
                    </p>
                    <div className="pt-2 border-t border-[var(--gold)]/15 text-[0.68rem] text-[var(--foreground)]/60 flex items-center gap-1.5">
                      <Landmark className="w-3 h-3 text-[var(--gold)] shrink-0" />
                      <span className="truncate">{corpus.depot}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Pourquoi Nous ? (Why Us) */}
      <section className="py-16 sm:py-20 border-b border-[var(--gold)]/15 bg-[var(--card)]/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30 mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Pourquoi Nous Choisir</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-cinzel font-bold text-[var(--foreground)]">
            Quatre Engagements Inébranlables
          </h2>

          <p className="text-xs sm:text-sm text-[var(--foreground)]/70 max-w-xl mx-auto mt-2 mb-10">
            Ce qui distingue Roots Tunisia : une éthique de travail sans complaisance, des sources physiques et une présence constante sur le terrain.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-start">
            {whyUs.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="surface-card rounded-xl border border-[var(--gold)]/25 p-5 hover:border-[var(--gold)]/60 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-[var(--gold)]/15 text-[var(--gold)] flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-[var(--foreground)] mb-2 font-cinzel">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-[var(--foreground)]/70 leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Explorer les Vrais Espaces de la Plateforme */}
      <section className="py-16 sm:py-20 border-b border-[var(--gold)]/15">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl text-start mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--gold)]">
              Accès Direct aux Données
            </span>
            <h2 className="text-2xl sm:text-3xl font-cinzel font-bold text-[var(--foreground)] mt-1">
              Les Espaces de Recherche de Roots Tunisia
            </h2>
            <p className="text-xs sm:text-sm text-[var(--foreground)]/70 mt-1">
              Chaque section de la plateforme répond à un objectif documentaire concret.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sectionsExploration.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="surface-card rounded-xl border border-[var(--gold)]/25 p-5 text-start hover:border-[var(--gold)]/70 hover:shadow-lg transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-9 h-9 rounded-lg bg-[var(--gold)]/15 text-[var(--gold)] flex items-center justify-center mb-3 group-hover:bg-[var(--gold)] group-hover:text-[var(--card)] transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-[var(--foreground)] group-hover:text-[var(--gold)] transition-colors font-cinzel">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[var(--foreground)]/70 leading-relaxed mt-2">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[var(--gold)]/15 flex items-center justify-between text-xs font-bold text-[var(--gold)]">
                    <span>{item.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Transparence Juridique & Liens Légaux */}
      <section className="py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="surface-card rounded-2xl border border-[var(--gold)]/35 p-6 sm:p-10 text-start shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[var(--gold)]/20">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30 mb-2">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Transparence & Cadre Légal</span>
                </span>
                <h2 className="text-xl sm:text-2xl font-cinzel font-bold text-[var(--foreground)]">
                  Protection des Données & Liens Juridiques
                </h2>
                <p className="text-xs sm:text-sm text-[var(--foreground)]/70 mt-1 max-w-xl">
                  Roots Tunisia applique une politique stricte de conformité aux lois relatives aux archives et à la vie privée.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[var(--gold)]/10 border border-[var(--gold)]/25 shrink-0 text-start">
                <p className="text-[0.7rem] uppercase tracking-wider font-bold text-[var(--gold)]">
                  Contact Officiel & Déontologie
                </p>
                <p className="text-xs font-bold text-[var(--foreground)] mt-0.5">
                  contact@rootstunisia.com
                </p>
                <p className="text-[0.65rem] text-[var(--foreground)]/60 mt-0.5">
                  Permanence de recherche à Tunis (La Kasbah)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              {legalLinks.map((legal) => (
                <Link
                  key={legal.to}
                  to={legal.to}
                  className="p-4 rounded-xl border border-[var(--gold)]/20 bg-[var(--background)] hover:border-[var(--gold)]/60 transition-all text-start group"
                >
                  <FileText className="w-4 h-4 text-[var(--gold)] mb-2" />
                  <h3 className="text-xs font-bold text-[var(--foreground)] group-hover:text-[var(--gold)] transition-colors">
                    {legal.title}
                  </h3>
                  <p className="text-[0.7rem] text-[var(--foreground)]/65 leading-relaxed mt-1">
                    {legal.desc}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA final avec photo de fond de la Médina */}
      <section className="px-4 pb-8 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl min-h-[240px] flex items-center justify-center p-8 text-center border border-[var(--gold)]/35 shadow-xl">
          <img src={medina} alt="Médina de Tunis" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-[#092C2B]/85 backdrop-blur-[1px]" />
          <div className="relative z-10 space-y-3 max-w-xl">
            <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white">
              Une Question sur vos Ancêtres Tunisiens ?
            </h3>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              Consultez nos réponses méthodologiques ou contactez directement nos généalogistes pour une consultation gratuite sans engagement.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <Link to="/faq" className="px-5 py-2.5 rounded-xl bg-white text-[#092C2B] font-bold text-xs hover:bg-gray-100 transition-colors shadow">
                Consulter la FAQ
              </Link>
              <Link to="/services" className="px-5 py-2.5 rounded-xl border border-white/40 text-white font-bold text-xs hover:bg-white/10 transition-colors">
                Nos Services de Recherche
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteCustomBlocks pageId="about" />
    </div>
  );
}
