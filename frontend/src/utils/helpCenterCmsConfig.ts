import { useState, useEffect, useCallback } from "react";
import { api } from "../api/client";
import { useTranslation } from "../context/TranslationContext";

export const CMS_LOCALES = [
  { code: "fr", label: "Français", tag: "FR" },
  { code: "en", label: "English", tag: "EN" },
  { code: "ar", label: "العربية", tag: "AR" },
  { code: "es", label: "Español", tag: "ES" },
  { code: "it", label: "Italiano", tag: "IT" },
  { code: "mt", label: "Malti", tag: "MT" },
] as const;

export type CmsLocaleCode = (typeof CMS_LOCALES)[number]["code"];

export interface HelpCenterTopicItem {
  key: string;
  label: string;
}

export interface HelpCenterCorpusItem {
  id: string;
  icon: string;
  meta: string;
  title: string;
  desc: string;
  depot: string;
  published: boolean;
}

export interface HelpCenterWhyUsItem {
  id: string;
  icon: string;
  title: string;
  desc: string;
  published: boolean;
}

export interface HelpCenterExplorationItem {
  id: string;
  icon: string;
  title: string;
  desc: string;
  to: string;
  ctaLabel: string;
  published: boolean;
}

export interface HelpCenterFaqCategory {
  id: string;
  label: string;
  icon: string;
}

export interface HelpCenterFaqQuestion {
  id: string;
  category: string;
  badge?: string;
  q: string;
  a: string;
  published: boolean;
}

export interface HelpCenterLegalCard {
  id: string;
  title: string;
  desc: string;
  to: string;
  ctaLabel: string;
  published: boolean;
}

export interface HelpCenterCmsConfig {
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    image: string;
  };
  tabLabels: {
    contact: string;
    about: string;
    faq: string;
    legal: string;
  };
  contact: {
    cards: {
      phoneLabel: string;
      phoneValue: string;
      phoneCta: string;
      whatsappLabel: string;
      whatsappValue: string;
      whatsappCta: string;
      whatsappPrefillMessage: string;
      emailLabel: string;
      emailValue: string;
      emailCta: string;
      hoursLabel: string;
      hoursValue: string;
      hoursCta: string;
    };
    form: {
      eyebrow: string;
      title: string;
      subtitle: string;
      topicsLabel: string;
      topics: HelpCenterTopicItem[];
      nameLabel: string;
      namePlaceholder: string;
      emailLabel: string;
      emailPlaceholder: string;
      messageLabel: string;
      messagePlaceholder: string;
      consentText: string;
      submitButtonLabel: string;
      sendingButtonLabel: string;
      successModalTitle: string;
      successModalMessage: string;
      errorModalTitle: string;
      errorModalMessage: string;
    };
    sidebar: {
      deskTitle: string;
      deskSubtitle: string;
      deskDescription: string;
      deskLinkLabel: string;
      deskLinkTo: string;
      platformsTitle: string;
      whatsappPlatformLabel: string;
      facebookPlatformLabel: string;
      facebookUrl: string;
      instagramPlatformLabel: string;
      instagramUrl: string;
    };
  };
  about: {
    mission: {
      eyebrow: string;
      title: string;
      titleHighlight: string;
      description: string;
    };
    corpusesHeader: {
      eyebrow: string;
      title: string;
    };
    corpuses: HelpCenterCorpusItem[];
    whyUsHeader: {
      eyebrow: string;
      title: string;
    };
    whyUs: HelpCenterWhyUsItem[];
    explorations: HelpCenterExplorationItem[];
  };
  faq: {
    header: {
      eyebrow: string;
      title: string;
      titleHighlight: string;
      subtitle: string;
      searchPlaceholder: string;
      expandAllLabel: string;
      collapseAllLabel: string;
      emptySearchText: string;
      resetFiltersLabel: string;
    };
    categories: HelpCenterFaqCategory[];
    questions: HelpCenterFaqQuestion[];
    bottomCta: {
      eyebrow: string;
      title: string;
      subtitle: string;
      whatsappLabel: string;
      contactLabel: string;
    };
  };
  legal: {
    header: {
      eyebrow: string;
      title: string;
      description: string;
    };
    cards: HelpCenterLegalCard[];
  };
}

const STORAGE_KEY = "RootsTunisia_help_center_cms_config";
const MULTI_LOCALE_STORAGE_KEY = "RootsTunisia_help_center_cms_locales_v3";

export const DEFAULT_HELP_CENTER_CMS_CONFIG: HelpCenterCmsConfig = {
  hero: {
    eyebrow: "Centre d'Aide & Informations",
    title: "Centre d'Aide",
    subtitle:
      "Découvrez notre démarche archivistique par la preuve, consultez les réponses officielles ou contactez nos chercheurs.",
    image: "",
  },
  tabLabels: {
    contact: "Contact Direct",
    about: "À Propos & Mission",
    faq: "Foire Aux Questions",
    legal: "Cadre Légal",
  },
  contact: {
    cards: {
      phoneLabel: "Téléphone",
      phoneValue: "",
      phoneCta: "Appel direct",
      whatsappLabel: "WhatsApp",
      whatsappValue: "",
      whatsappCta: "Chat en direct",
      whatsappPrefillMessage:
        "Bonjour Roots Tunisia, je souhaite des renseignements sur vos recherches généalogiques.",
      emailLabel: "Email Officiel",
      emailValue: "contact@rootstunisia.com",
      emailCta: "Envoyer un email",
      hoursLabel: "Horaires",
      hoursValue: "09:00 – 17:00 (GMT+1)",
      hoursCta: "Réponse sous 24h",
    },
    form: {
      eyebrow: "Formulaire d'Assistance",
      title: "Transmettez votre Demande",
      subtitle:
        "Précisez vos patronymes, localités ou cotes d'archives recherchées. Notre équipe vous répond sous 24h.",
      topicsLabel: "Objet de la demande",
      topics: [
        { key: "topic_general", label: "Renseignement Général" },
        { key: "topic_tree_search", label: "Recherche d'Ancêtres & Filiation" },
        { key: "topic_archive_request", label: "Consultation de Cotes d'Archives" },
        { key: "topic_partnership", label: "Partenariat & Archivistes" },
      ],
      nameLabel: "Nom complet",
      namePlaceholder: "Ex: Karim Trabelsi",
      emailLabel: "Adresse Email",
      emailPlaceholder: "contact@rootstunisia.com",
      messageLabel: "Votre Message ou Recherche",
      messagePlaceholder:
        "Détaillez votre question, l'ancêtre recherché, la commune ou le type de document...",
      consentText:
        "J'accepte le traitement de mes coordonnées pour répondre à ma demande selon la politique de confidentialité.",
      submitButtonLabel: "Envoyer le Message",
      sendingButtonLabel: "Envoi en cours...",
      successModalTitle: "Message Transmis",
      successModalMessage:
        "Votre message a été transmis avec succès. Notre équipe vous répondra sous 24h.",
      errorModalTitle: "Erreur d'Envoi",
      errorModalMessage:
        "Erreur lors de l'envoi du message. Vous pouvez nous écrire directement sur WhatsApp.",
    },
    sidebar: {
      deskTitle: "Bureau d'Assistance",
      deskSubtitle: "Archives & Généalogie",
      deskDescription:
        "Vous avez une cote d'archives physique ou un acte difficile à déchiffrer ? Vous pouvez également planifier une consultation gratuite.",
      deskLinkLabel: "Découvrir nos prestations & rendez-vous →",
      deskLinkTo: "/services",
      platformsTitle: "Plateformes Officielles",
      whatsappPlatformLabel: "WhatsApp Officiel",
      facebookPlatformLabel: "Facebook Officiel",
      facebookUrl: "",
      instagramPlatformLabel: "Instagram Roots",
      instagramUrl: "",
    },
  },
  about: {
    mission: {
      eyebrow: "Manifeste & Méthode Scientifique",
      title: "La Généalogie par la",
      titleHighlight: "Preuve Documentaire",
      description:
        "Roots Tunisia s'oppose aux généalogies présumées sans assise historique. Notre vocation est d'ancrer chaque filiation dans les archives authentifiées de Tunisie : registres d'état civil municipal, tribunaux charaïques et rabbiniques, rôles fiscaux de la Majba et fonds des Habous.",
    },
    corpusesHeader: {
      eyebrow: "Fonds Documentaires Réels",
      title: "Les 4 Grands Piliers d'Archives en Tunisie",
    },
    corpuses: [
      {
        id: "corpus-1",
        icon: "Building",
        meta: "1886 – Aujourd'hui",
        title: "Registres de l'État Civil Municipal",
        desc: "Naissances, mariages et décès consignés dans les 24 gouvernorats tunisiens depuis la création de l'état civil moderne.",
        depot: "Dépôts municipaux & Archives Nationales",
        published: true,
      },
      {
        id: "corpus-2",
        icon: "Scale",
        meta: "XVIIIe – 1957",
        title: "Tribunaux Charaïques & Rabbiniques",
        desc: "Successions (‘Ilm Khabar), donations, testaments et dévolutions notariales rédigés par les ‘udûl de la Mahkama et de l'Ouzara.",
        depot: "Tribunaux de 1ère instance & AN de Tunisie",
        published: true,
      },
      {
        id: "corpus-3",
        icon: "ScrollText",
        meta: "1856 – 1920",
        title: "Rôles Fiscaux Beylicaux & La Majba",
        desc: "Recensements nominatifs des contribuables et chefs de feu par caïdat et cheikhat, attestant la présence locale.",
        depot: "Série Historique du Gouvernement Beylical",
        published: true,
      },
      {
        id: "corpus-4",
        icon: "FolderArchive",
        meta: "XVIIe – 1956",
        title: "Fonds des Habous (Waqf)",
        desc: "Fondations pieuses familiales et dévolutions de biens décrivant des chaînes d'ascendance sur 3 à 6 générations.",
        depot: "Archives Nationales de Tunisie (La Kasbah)",
        published: true,
      },
    ],
    whyUsHeader: {
      eyebrow: "Nos 4 Engagements",
      title: "Pourquoi Choisir Roots Tunisia ?",
    },
    whyUs: [
      {
        id: "why-1",
        icon: "MapPin",
        title: "Présence Physique In Situ",
        desc: "Recherches directes aux Archives Nationales de La Kasbah et dans les mairies régionales pour photographier les cotes physiques.",
        published: true,
      },
      {
        id: "why-2",
        icon: "FileSearch",
        title: "Paléographie Multilingue",
        desc: "Lecture et traduction certifiée : arabe maghrébin cursif, formules des ‘udûl, turc ottoman beylical, italien ancien et latin.",
        published: true,
      },
      {
        id: "why-3",
        icon: "CheckCircle2",
        title: "Traçabilité & Preuve Intégrale",
        desc: "Toute filiation renvoie à une cote physique vérifiable (registre, carton, folio). Aucune généalogie n'est présumée sans document.",
        published: true,
      },
      {
        id: "why-4",
        icon: "Lock",
        title: "Déontologie INPDP & RGPD",
        desc: "Conformité stricte avec la loi tunisienne n° 2004-63 et le RGPD : respect du délai de 100 ans et protection de la vie privée.",
        published: true,
      },
    ],
    explorations: [
      {
        id: "exp-1",
        to: "/interactive-map",
        icon: "Compass",
        title: "Atlas Archivistique (24 Gouvernorats)",
        desc: "Visualisez les dépôts d'archives et fonds documentés par région.",
        ctaLabel: "Explorer",
        published: true,
      },
      {
        id: "exp-2",
        to: "/gallery/trees",
        icon: "Network",
        title: "Arbres Généalogiques Documentés",
        desc: "Consultez les lignées authentifiées avec cotes sources primaires.",
        ctaLabel: "Explorer",
        published: true,
      },
      {
        id: "exp-3",
        to: "/gallery",
        icon: "Eye",
        title: "Galerie & Fonds Numérisés",
        desc: "Photographies d'époque, cartes postales et manuscrits originaux.",
        ctaLabel: "Explorer",
        published: true,
      },
      {
        id: "exp-4",
        to: "/services",
        icon: "Landmark",
        title: "Prestations & Rendez-vous Dédiés",
        desc: "Planifiez une consultation gratuite par Zoom, WhatsApp ou Email.",
        ctaLabel: "Explorer",
        published: true,
      },
    ],
  },
  faq: {
    header: {
      eyebrow: "Base de Connaissances & Réponses",
      title: "Foire Aux",
      titleHighlight: "Questions",
      subtitle:
        "Toutes les réponses sur nos formules d'abonnements, la prise de rendez-vous gratuite, l'export GEDCOM et les archives tunisiennes.",
      searchPlaceholder:
        "Rechercher une réponse (ex: 1,99 $, Zoom, devis, GEDCOM, INPDP)...",
      expandAllLabel: "Tout déplier",
      collapseAllLabel: "Tout replier",
      emptySearchText: "Aucune réponse ne correspond à votre recherche.",
      resetFiltersLabel: "Effacer les filtres",
    },
    categories: [
      { id: "all", label: "Toutes les Questions", icon: "HelpCircle" },
      { id: "subscriptions", label: "Abonnements & Tarifs", icon: "CreditCard" },
      { id: "services", label: "Prestations & Rendez-vous", icon: "Briefcase" },
      { id: "trees", label: "Arbres & GEDCOM", icon: "Network" },
      { id: "privacy", label: "Confidentialité & Droits", icon: "ShieldCheck" },
      { id: "support", label: "Assistance", icon: "LifeBuoy" },
    ],
    questions: [
      {
        id: "sub-pricing",
        category: "subscriptions",
        badge: "Tarifs & Devises",
        q: "Comment sont fixés les abonnements et quelles devises sont acceptées ?",
        a: "Trois formules claires : accès découverte gratuit (0 $), 1,99 $/mois pour l'accès aux actes numérisés et aux arbres de la galerie, et 3,99 $/mois pour l'accompagnement d'un historien. Les montants sont automatiquement convertis dans votre devise locale (TND, EUR, USD, CAD, GBP, SAR).",
        published: true,
      },
      {
        id: "sub-cancel",
        category: "subscriptions",
        q: "Puis-je changer ou annuler mon abonnement à tout moment ?",
        a: "Oui, sans aucun engagement. Vous pouvez upgrader, downgrader ou résilier votre formule en 1 clic depuis votre profil utilisateur. Vos données restent conservées en toute sécurité.",
        published: true,
      },
      {
        id: "sub-payment-methods",
        category: "subscriptions",
        q: "Quels sont les modes de paiement acceptés pour les abonnements ?",
        a: "Cartes bancaires internationales (Visa, Mastercard), virements bancaires nationaux (RIB tunisien) et internationaux (IBAN/SWIFT), ainsi que D17 / Flouci pour la Tunisie.",
        published: true,
      },
      {
        id: "srv-booking-free",
        category: "services",
        badge: "Consultation Gratuite",
        q: "La prise de rendez-vous ou la consultation préliminaire est-elle payante ?",
        a: "Non. Toute prise de contact ou de rendez-vous (visioconférence Zoom, échange WhatsApp ou échange par email) est 100 % gratuite. Elle permet d'examiner la faisabilité de votre demande et de vous proposer un devis sur-mesure avant tout engagement.",
        published: true,
      },
      {
        id: "srv-doc-upload",
        category: "services",
        badge: "Partage de Fichiers",
        q: "Dois-je téléverser mes documents lors de ma prise de rendez-vous ?",
        a: "Non. Aucun téléversement de fichier n'est requis sur le site. Vous décrivez simplement votre besoin, puis partagerez vos documents directement lors de votre échange Zoom ou via WhatsApp/email.",
        published: true,
      },
      {
        id: "srv-doc-types",
        category: "services",
        q: "Quels types de documents d'archives anciennes traitez-vous ?",
        a: "Actes manuscrits en arabe maghrébin, turc ottoman, italien ancien ou latin d'église : registres paroissiaux, rôles fiscaux de la Majba, actes des tribunaux de la Charaâ (ouzara, cadis), état civil beylical et colonial, actes notariés.",
        published: true,
      },
      {
        id: "srv-insitu",
        category: "services",
        q: "Mandatez-vous des chercheurs physiquement aux dépôts d'archives en Tunisie ?",
        a: "Oui. Nos chercheurs habilités se déplacent directement aux Archives Nationales de Tunisie (La Kasbah) et dans les mairies régionales pour retrouver, vérifier et photographier en HD les documents originaux.",
        published: true,
      },
      {
        id: "tree-start",
        category: "trees",
        q: "Comment créer mon premier arbre généalogique sur Roots Tunisia ?",
        a: "Depuis votre espace personnel, cliquez sur « Nouvel Arbre », saisissez votre fiche ou importez directement votre fichier GEDCOM standard en un clic.",
        published: true,
      },
      {
        id: "tree-gedcom-formats",
        category: "trees",
        badge: "Standards Ouverts",
        q: "Quels formats GEDCOM sont supportés en import et export ?",
        a: "L'ensemble des standards internationaux : GEDCOM 5.5.1, GEDCOM 7.0 et GEDCOM X (XML / JSON / .gedx) pour garantir l'interopérabilité totale avec Gramps, Heredis ou Ancestry.",
        published: true,
      },
      {
        id: "priv-visibility",
        category: "privacy",
        q: "Qui a accès aux données de mon arbre généalogique ?",
        a: "Vous choisissez la visibilité : Privé (strictement accessible à vous seul) ou Public (partagé avec la communauté). Pour les contemporains vivants, les données personnelles sont masquées par défaut.",
        published: true,
      },
      {
        id: "priv-gdpr",
        category: "privacy",
        badge: "INPDP & RGPD",
        q: "Comment mes données personnelles et généalogiques sont-elles protégées ?",
        a: "Roots Tunisia applique des standards de sécurité stricts conformes à la loi tunisienne n° 2004-63 (INPDP) et au RGPD. Vos données ne sont jamais vendues ni cédées à des tiers.",
        published: true,
      },
      {
        id: "sup-contact",
        category: "support",
        q: "Comment contacter l'équipe en cas de question ou de blocage ?",
        a: "Via l'onglet « Contact Direct » ci-dessus, par email à contact@rootstunisia.com, ou directement par WhatsApp.",
        published: true,
      },
    ],
    bottomCta: {
      eyebrow: "Vous n'avez pas trouvé votre réponse ?",
      title: "Nos Archivistes & Généalogistes sont à votre écoute",
      subtitle:
        "Que vous ayez une question sur votre abonnement, un acte manuscrit à déchiffrer ou un projet de recherche familiale, contactez-nous directement.",
      whatsappLabel: "Discuter sur WhatsApp",
      contactLabel: "Nous Écrire",
    },
  },
  legal: {
    header: {
      eyebrow: "Conformité & Protection des Données",
      title: "Cadre Réglementaire & Déontologique",
      description:
        "Roots Tunisia applique une stricte conformité avec la loi tunisienne n° 2004-63 (Instance Nationale de Protection des Données Personnelles - INPDP) et les standards du RGPD. Les registres communicables respectent le délai légal centenaire, et les données relatives aux personnes vivantes sont masquées par défaut.",
    },
    cards: [
      {
        id: "legal-1",
        to: "/terms",
        title: "Conditions Générales d'Utilisation",
        desc: "Modalités d'accès à la plateforme et règles d'utilisation des outils généalogiques.",
        ctaLabel: "Lire le document",
        published: true,
      },
      {
        id: "legal-2",
        to: "/privacy",
        title: "Politique de Confidentialité",
        desc: "Traitement des données personnelles et conformité INPDP (Loi n° 2004-63) & RGPD.",
        ctaLabel: "Lire le document",
        published: true,
      },
      {
        id: "legal-3",
        to: "/refund",
        title: "Prestations & Remboursement",
        desc: "Cadre contractuel des recherches archivistiques, devis et garanties de livraison.",
        ctaLabel: "Lire le document",
        published: true,
      },
      {
        id: "legal-4",
        to: "/cookies",
        title: "Gestion des Cookies",
        desc: "Traceurs techniques et modalités de recueil de votre consentement.",
        ctaLabel: "Lire le document",
        published: true,
      },
    ],
  },
};

const LOCALE_DEFAULTS: Record<string, HelpCenterCmsConfig> = {
  fr: DEFAULT_HELP_CENTER_CMS_CONFIG,
  en: {
    ...DEFAULT_HELP_CENTER_CMS_CONFIG,
    hero: {
      eyebrow: "Help Center & Information",
      title: "Help Center",
      subtitle:
        "Discover our documentary evidence-based archival methodology, browse official answers, or contact our researchers directly.",
      image: "",
    },
    tabLabels: {
      contact: "Direct Contact",
      about: "About & Mission",
      faq: "Frequently Asked Questions",
      legal: "Legal Framework",
    },
    contact: {
      cards: {
        phoneLabel: "Phone",
        phoneValue: "",
        phoneCta: "Direct call",
        whatsappLabel: "WhatsApp",
        whatsappValue: "",
        whatsappCta: "Live chat",
        whatsappPrefillMessage:
          "Hello Roots Tunisia, I would like information about your genealogical research services.",
        emailLabel: "Official Email",
        emailValue: "contact@rootstunisia.com",
        emailCta: "Send an email",
        hoursLabel: "Hours",
        hoursValue: "09:00 – 17:00 (GMT+1)",
        hoursCta: "Reply within 24h",
      },
      form: {
        eyebrow: "Assistance Form",
        title: "Submit Your Inquiry",
        subtitle:
          "Specify the surnames, localities, or archival shelfmarks you are looking for. Our team replies within 24 hours.",
        topicsLabel: "Subject of Inquiry",
        topics: [
          { key: "topic_general", label: "General Inquiry" },
          { key: "topic_tree_search", label: "Ancestor & Lineage Research" },
          { key: "topic_archive_request", label: "Archival Shelfmark Consultation" },
          { key: "topic_partnership", label: "Partnership & Archivists" },
        ],
        nameLabel: "Full Name",
        namePlaceholder: "e.g. Karim Trabelsi",
        emailLabel: "Email Address",
        emailPlaceholder: "contact@rootstunisia.com",
        messageLabel: "Your Message or Research Request",
        messagePlaceholder:
          "Describe your question, the ancestor sought, the municipality, or the document type...",
        consentText:
          "I agree to the processing of my contact details to respond to my request in accordance with the privacy policy.",
        submitButtonLabel: "Send Message",
        sendingButtonLabel: "Sending...",
        successModalTitle: "Message Sent",
        successModalMessage:
          "Your message has been sent successfully. Our team will reply within 24 hours.",
        errorModalTitle: "Submission Error",
        errorModalMessage:
          "An error occurred while sending your message. You can also write to us directly on WhatsApp.",
      },
      sidebar: {
        deskTitle: "Research Assistance Desk",
        deskSubtitle: "Archives & Genealogy",
        deskDescription:
          "Do you have a physical archive shelfmark or a difficult manuscript deed to decipher? You can also book a free consultation.",
        deskLinkLabel: "Discover our services & appointments →",
        deskLinkTo: "/services",
        platformsTitle: "Official Platforms",
        whatsappPlatformLabel: "Official WhatsApp",
        facebookPlatformLabel: "Official Facebook",
        facebookUrl: "",
        instagramPlatformLabel: "Roots Instagram",
        instagramUrl: "",
      },
    },
    about: {
      mission: {
        eyebrow: "Manifesto & Scientific Method",
        title: "Genealogy Through",
        titleHighlight: "Documentary Proof",
        description:
          "Roots Tunisia rejects unverified genealogies without historical evidence. Our mission is to anchor every lineage in authenticated Tunisian archives: municipal civil status registers, Charaâ and rabbinical courts, Majba tax rolls, and Habous endowments.",
      },
      corpusesHeader: {
        eyebrow: "Authentic Documentary Holdings",
        title: "The 4 Pillars of Tunisian Archives",
      },
      corpuses: [
        {
          id: "corpus-1",
          icon: "Building",
          meta: "1886 – Present",
          title: "Municipal Civil Status Registers",
          desc: "Births, marriages, and deaths recorded across the 24 Tunisian governorates since the creation of modern civil registration.",
          depot: "Municipal Repositories & National Archives",
          published: true,
        },
        {
          id: "corpus-2",
          icon: "Scale",
          meta: "18th Century – 1957",
          title: "Charaâ & Rabbinical Courts",
          desc: "Inheritance deeds (‘Ilm Khabar), endowments, wills, and notarial acts drafted by the ‘udûl of the Mahkama and Ouzara.",
          depot: "Courts of First Instance & National Archives",
          published: true,
        },
        {
          id: "corpus-3",
          icon: "ScrollText",
          meta: "1856 – 1920",
          title: "Beylical Tax Rolls & The Majba",
          desc: "Nominal censuses of taxpayers and heads of households by caïdat and cheikhat, attesting local presence.",
          depot: "Historical Series of the Beylical Government",
          published: true,
        },
        {
          id: "corpus-4",
          icon: "FolderArchive",
          meta: "17th Century – 1956",
          title: "Habous (Waqf) Foundations",
          desc: "Family pious endowments and property successions describing multi-generational chains of descent across 3 to 6 generations.",
          depot: "National Archives of Tunisia (La Kasbah)",
          published: true,
        },
      ],
      whyUsHeader: {
        eyebrow: "Our 4 Commitments",
        title: "Why Choose Roots Tunisia?",
      },
      whyUs: [
        {
          id: "why-1",
          icon: "MapPin",
          title: "On-Site Archival Presence",
          desc: "Direct research at the National Archives in La Kasbah and regional municipalities to photograph physical records.",
          published: true,
        },
        {
          id: "why-2",
          icon: "FileSearch",
          title: "Multilingual Paleography",
          desc: "Certified reading and translation: cursive Maghrebi Arabic, ‘udûl formulas, Beylical Ottoman Turkish, old Italian, and Latin.",
          published: true,
        },
        {
          id: "why-3",
          icon: "CheckCircle2",
          title: "Full Traceability & Proof",
          desc: "Every lineage points to a verifiable physical shelfmark (register, box, folio). No genealogy is assumed without a document.",
          published: true,
        },
        {
          id: "why-4",
          icon: "Lock",
          title: "INPDP & GDPR Ethics",
          desc: "Strict compliance with Tunisian Law No. 2004-63 and GDPR: 100-year privacy rule and protection of living individuals.",
          published: true,
        },
      ],
      explorations: [
        {
          id: "exp-1",
          to: "/interactive-map",
          icon: "Compass",
          title: "Archival Atlas (24 Governorates)",
          desc: "Visualize archival repositories and documented funds by region.",
          ctaLabel: "Explore",
          published: true,
        },
        {
          id: "exp-2",
          to: "/gallery/trees",
          icon: "Network",
          title: "Documented Family Trees",
          desc: "Browse authenticated lineages backed by primary source shelfmarks.",
          ctaLabel: "Explore",
          published: true,
        },
        {
          id: "exp-3",
          to: "/gallery",
          icon: "Eye",
          title: "Gallery & Digitized Holdings",
          desc: "Vintage photographs, postcards, and original manuscripts.",
          ctaLabel: "Explore",
          published: true,
        },
        {
          id: "exp-4",
          to: "/services",
          icon: "Landmark",
          title: "Dedicated Services & Appointments",
          desc: "Schedule a free consultation via Zoom, WhatsApp, or Email.",
          ctaLabel: "Explore",
          published: true,
        },
      ],
    },
    faq: {
      header: {
        eyebrow: "Knowledge Base & Answers",
        title: "Frequently Asked",
        titleHighlight: "Questions",
        subtitle:
          "All answers regarding our subscription plans, free consultations, GEDCOM exports, and Tunisian archival research.",
        searchPlaceholder:
          "Search for an answer (e.g. $1.99, Zoom, quote, GEDCOM, INPDP)...",
        expandAllLabel: "Expand all",
        collapseAllLabel: "Collapse all",
        emptySearchText: "No answer matches your search.",
        resetFiltersLabel: "Clear filters",
      },
      categories: [
        { id: "all", label: "All Questions", icon: "HelpCircle" },
        { id: "subscriptions", label: "Subscriptions & Pricing", icon: "CreditCard" },
        { id: "services", label: "Services & Appointments", icon: "Briefcase" },
        { id: "trees", label: "Trees & GEDCOM", icon: "Network" },
        { id: "privacy", label: "Privacy & Rights", icon: "ShieldCheck" },
        { id: "support", label: "Support", icon: "LifeBuoy" },
      ],
      questions: [
        {
          id: "sub-pricing",
          category: "subscriptions",
          badge: "Pricing & Currencies",
          q: "How are subscriptions priced and which currencies are accepted?",
          a: "Three clear plans: Free Discovery ($0), $1.99/month for access to digitized records and gallery trees, and $3.99/month for historian guidance. Amounts are automatically converted into your local currency (TND, EUR, USD, CAD, GBP, SAR).",
          published: true,
        },
        {
          id: "sub-cancel",
          category: "subscriptions",
          q: "Can I change or cancel my subscription at any time?",
          a: "Yes, with no commitment. You can upgrade, downgrade, or cancel your plan in 1 click from your user profile. Your data remains safely preserved.",
          published: true,
        },
        {
          id: "srv-booking-free",
          category: "services",
          badge: "Free Consultation",
          q: "Is booking an appointment or preliminary consultation paid?",
          a: "No. Every initial contact or appointment (Zoom video call, WhatsApp chat, or email exchange) is 100% free. It allows us to assess feasibility and provide a custom quote before any commitment.",
          published: true,
        },
        {
          id: "tree-gedcom-formats",
          category: "trees",
          badge: "Open Standards",
          q: "Which GEDCOM formats are supported for import and export?",
          a: "All international standards: GEDCOM 5.5.1, GEDCOM 7.0, and GEDCOM X (XML / JSON / .gedx) ensuring full interoperability.",
          published: true,
        },
        {
          id: "sub-payment-methods",
          category: "subscriptions",
          q: "What payment methods are accepted for subscriptions?",
          a: "International bank cards (Visa, Mastercard), domestic Tunisian bank transfers (RIB), international wire transfers (IBAN/SWIFT), as well as D17 / Flouci within Tunisia.",
          published: true,
        },
        {
          id: "srv-doc-upload",
          category: "services",
          badge: "File Sharing",
          q: "Do I need to upload my documents when booking an appointment?",
          a: "No. No file upload is required on the website. Simply describe your research need, and you will share your documents directly during your Zoom session or via WhatsApp/email.",
          published: true,
        },
        {
          id: "srv-doc-types",
          category: "services",
          q: "Which types of historical archive documents do you handle?",
          a: "Handwritten records in Maghrebi Arabic, Ottoman Turkish, Old Italian, or Ecclesiastical Latin: parish registers, Majba tax rolls, Sharia court deeds (Ouzara, Qadis), Beylical and Protectorate civil registers, and notarial deeds.",
          published: true,
        },
        {
          id: "srv-insitu",
          category: "services",
          q: "Do you dispatch researchers physically to archive repositories in Tunisia?",
          a: "Yes. Our accredited researchers travel directly to the National Archives of Tunisia (La Kasbah) and regional municipalities to locate, verify, and photograph original records in high resolution.",
          published: true,
        },
        {
          id: "tree-start",
          category: "trees",
          q: "How do I create my first family tree on Roots Tunisia?",
          a: "From your personal workspace, click \"New Tree\", enter your ancestor record manually, or import your standard GEDCOM file directly in one click.",
          published: true,
        },
        {
          id: "priv-visibility",
          category: "privacy",
          q: "Who can access the data in my family tree?",
          a: "You choose the visibility level: Private (accessible strictly to you) or Public (shared with the community). For living individuals, personal details are masked by default.",
          published: true,
        },
        {
          id: "priv-gdpr",
          category: "privacy",
          badge: "INPDP & GDPR",
          q: "How are my personal and genealogical data protected?",
          a: "Roots Tunisia applies strict security standards compliant with Tunisian Law No. 2004-63 (INPDP) and GDPR. Your data is never sold or shared with third parties.",
          published: true,
        },
        {
          id: "sup-contact",
          category: "support",
          q: "How can I reach the team if I have a question or run into an issue?",
          a: "Through the \"Direct Contact\" tab above, by email at contact@rootstunisia.com, or directly via WhatsApp.",
          published: true,
        },
      ],
      bottomCta: {
        eyebrow: "Didn't find your answer?",
        title: "Our Archivists & Genealogists Are Here to Help",
        subtitle:
          "Whether you have a question about your subscription, a manuscript deed to decipher, or a family research project, contact us directly.",
        whatsappLabel: "Chat on WhatsApp",
        contactLabel: "Write to Us",
      },
    },
    legal: {
      header: {
        eyebrow: "Compliance & Data Protection",
        title: "Regulatory & Ethical Framework",
        description:
          "Roots Tunisia maintains strict compliance with Tunisian Law No. 2004-63 (National Authority for Personal Data Protection - INPDP) and GDPR standards. Disclosable civil registers respect the statutory 100-year closure period, and data relating to living individuals is masked by default.",
      },
      cards: [
        {
          id: "legal-1",
          to: "/terms",
          title: "Terms of Service",
          desc: "Platform access rules and terms governing the use of our genealogical research tools.",
          ctaLabel: "Read the document",
          published: true,
        },
        {
          id: "legal-2",
          to: "/privacy",
          title: "Privacy Policy",
          desc: "Personal data processing and compliance with INPDP (Law No. 2004-63) & GDPR.",
          ctaLabel: "Read the document",
          published: true,
        },
        {
          id: "legal-3",
          to: "/refund",
          title: "Services & Refund Policy",
          desc: "Contractual framework for archival research engagements, quotes, and delivery guarantees.",
          ctaLabel: "Read the document",
          published: true,
        },
        {
          id: "legal-4",
          to: "/cookies",
          title: "Cookie Management",
          desc: "Technical cookies and how your consent preferences are recorded and respected.",
          ctaLabel: "Read the document",
          published: true,
        },
      ],
    },
  },
  ar: {
    ...DEFAULT_HELP_CENTER_CMS_CONFIG,
    hero: {
      eyebrow: "مركز المساعدة والمعلومات",
      title: "مركز المساعدة",
      subtitle:
        "اكتشف منهجيتنا التوثيقية القائمة على الحجة الأرشيفية، وتصفح الإجابات الرسمية أو تواصل مباشرة مع باحثينا.",
      image: "",
    },
    tabLabels: {
      contact: "اتصال مباشر",
      about: "من نحن ورسالتنا",
      faq: "الأسئلة الشائعة",
      legal: "الإطار القانوني",
    },
    contact: {
      cards: {
        phoneLabel: "الهاتف",
        phoneValue: "",
        phoneCta: "اتصال مباشر",
        whatsappLabel: "واتساب",
        whatsappValue: "",
        whatsappCta: "محادثة فورية",
        whatsappPrefillMessage:
          "مرحباً جذور تونس، أرغب في الاستفسار حول أبحاث الأنساب والوثائق الأرشيفية.",
        emailLabel: "البريد الرسمي",
        emailValue: "contact@rootstunisia.com",
        emailCta: "إرسال بريد إلكتروني",
        hoursLabel: "أوقات العمل",
        hoursValue: "09:00 – 17:00 (توقيت تونس)",
        hoursCta: "رد خلال 24 ساعة",
      },
      form: {
        eyebrow: "استمارة المساعدة والبحث",
        title: "أرسل طلبك أو استفسارك",
        subtitle:
          "حدد الألقاب العائلية أو المناطق أو أرقام حفظ الوثائق التي تبحث عنها. يرد فريقنا خلال 24 ساعة.",
        topicsLabel: "موضوع الطلب",
        topics: [
          { key: "topic_general", label: "استفسار عام" },
          { key: "topic_tree_search", label: "بحث عن الأجداد وسلاسل النسب" },
          { key: "topic_archive_request", label: "الاطلاع على أرصدة ووثائق الأرشيف" },
          { key: "topic_partnership", label: "شراكة وتعاون بحثي" },
        ],
        nameLabel: "الاسم الكامل",
        namePlaceholder: "مثال: كريم الطرابلسي",
        emailLabel: "البريد الإلكتروني",
        emailPlaceholder: "contact@rootstunisia.com",
        messageLabel: "رسالتك أو تفاصيل البحث",
        messagePlaceholder:
          "اشرح سؤالك أو الجدّ المبحوث عنه أو البلدية أو نوع الوثيقة المطلوبة...",
        consentText:
          "أوافق على معالجة بيانات الاتصال الخاصة بي للرد على طلبي وفقاً لسياسة الخصوصية.",
        submitButtonLabel: "إرسال الرسالة",
        sendingButtonLabel: "جاري الإرسال...",
        successModalTitle: "تم إرسال الرسالة",
        successModalMessage:
          "تم استلام رسالتك بنجاح. سيرد عليك فريقنا المختص في غضون 24 ساعة.",
        errorModalTitle: "خطأ في الإرسال",
        errorModalMessage:
          "حدث خطأ أثناء إرسال الرسالة. يمكنك مراسلتنا مباشرة عبر واتساب.",
      },
      sidebar: {
        deskTitle: "مكتب المساندة البحثية",
        deskSubtitle: "الأرشيف وعلم الأنساب",
        deskDescription:
          "هل لديك رقم حفظ أرشيفي أو عقد خطي قديم يصعب قراءته؟ يمكنك أيضاً حجز استشارة أولية مجانية.",
        deskLinkLabel: "اكتشف خدماتنا واحجز موعداً ←",
        deskLinkTo: "/services",
        platformsTitle: "المنصات الرسمية",
        whatsappPlatformLabel: "واتساب الرسمي",
        facebookPlatformLabel: "فيسبوك الرسمي",
        facebookUrl: "",
        instagramPlatformLabel: "إنستغرام جذور تونس",
        instagramUrl: "",
      },
    },
    about: {
      mission: {
        eyebrow: "البيان العلمي والمنهج التوثيقي",
        title: "علم الأنساب القائم على",
        titleHighlight: "الحجة والوثيقة الأرشيفية",
        description:
          "ترفض منصة جذور تونس الأنساب الظنية غير المسنودة. رسالتنا هي توثيق كل شجرة عائلة بالاعتماد على الأرشيفات التونسية الأصيلة: سجلات الحالة المدنية البلدية، والمحاكم الشرعية والربانية، ودفاتر المجبى، وأرصدة الأحباس والأوقاف.",
      },
      corpusesHeader: {
        eyebrow: "الأرصدة الوثائقية المعتمدة",
        title: "الركائز الأربع الكبرى للأرشيف في تونس",
      },
      corpuses: [
        {
          id: "corpus-1",
          icon: "Building",
          meta: "1886 – اليوم",
          title: "سجلات الحالة المدنية البلدية",
          desc: "عقود الولادات والزواج والوفيات المسجلة في الولايات التونسية الـ 24 منذ تأسيس الحالة المدنية الحديثة.",
          depot: "البلديات والأرشيف الوطني التونسي",
          published: true,
        },
        {
          id: "corpus-2",
          icon: "Scale",
          meta: "القرن 18 – 1957",
          title: "المحاكم الشرعية والربانية",
          desc: "حجج الفرائض والتركات والوصايا والرسوم العدلية المحررة من طرف عدول المحكمة الشرعية والوزارة.",
          depot: "المحاكم الابتدائية والأرشيف الوطني",
          published: true,
        },
        {
          id: "corpus-3",
          icon: "ScrollText",
          meta: "1856 – 1920",
          title: "دفاتر الجباية البايليكية والمجبى",
          desc: "الإحصاءات الاسمية لدافعي الضرائب وأرباب العائلات حسب القيادات والمشيخات.",
          depot: "السلسلة التاريخية للدولة الحسينية",
          published: true,
        },
        {
          id: "corpus-4",
          icon: "FolderArchive",
          meta: "القرن 17 – 1956",
          title: "أرصدة الأحباس والأوقاف",
          desc: "رسوم الحبس الخاص والأوقاف العائلية التي تحفظ سلاسل النسب المتصلة عبر عدة أجيال.",
          depot: "الأرشيف الوطني التونسي (القصبة)",
          published: true,
        },
      ],
      whyUsHeader: {
        eyebrow: "التزاماتنا الأربعة",
        title: "لماذا تختار جذور تونس؟",
      },
      whyUs: [
        {
          id: "why-1",
          icon: "MapPin",
          title: "بحث ميداني مباشر في الأرشيف",
          desc: "تنقل مباشر للباحثين إلى الأرشيف الوطني بالقصبة والبلديات الجهوية لتصوير الوثائق الأصلية.",
          published: true,
        },
        {
          id: "why-2",
          icon: "FileSearch",
          title: "قراءة الخطوط القديمة والترجمة",
          desc: "فك الخطوط المغربية والرسوم العدلية والتركية العثمانية والإيطالية القديمة واللاتينية.",
          published: true,
        },
        {
          id: "why-3",
          icon: "CheckCircle2",
          title: "التوثيق الكامل بأرقام الحفظ",
          desc: "كل حلقة نسب مرتبطة برقم حفظ أرشيفي قابل للتحقق (دفتر، صندوق، ورقة).",
          published: true,
        },
        {
          id: "why-4",
          icon: "Lock",
          title: "حماية المعطيات الشخصية",
          desc: "امتثال تام للقانون التونسي عدد 63 لسنة 2004 واللائحة الأوروبية لحماية البيانات.",
          published: true,
        },
      ],
      explorations: [
        {
          id: "exp-1",
          to: "/interactive-map",
          icon: "Compass",
          title: "الأطلس الأرشيفي (24 ولاية)",
          desc: "استكشف مراكز الأرشيف والأرصدة الوثائقية حسب الولاية.",
          ctaLabel: "استكشاف",
          published: true,
        },
        {
          id: "exp-2",
          to: "/gallery/trees",
          icon: "Network",
          title: "أشجار العائلات الموثقة",
          desc: "تصفح الأنساب الموثقة بالمصادر الأرشيفية الأصلية.",
          ctaLabel: "استكشاف",
          published: true,
        },
        {
          id: "exp-3",
          to: "/gallery",
          icon: "Eye",
          title: "المعرض والأرصدة الرقمية",
          desc: "صور تاريخية نادرة وبطاقات بريدية ومخطوطات أصلية.",
          ctaLabel: "استكشاف",
          published: true,
        },
        {
          id: "exp-4",
          to: "/services",
          icon: "Landmark",
          title: "الخدمات وحجز المواعيد",
          desc: "احجز استشارة مجانية عبر زووم أو واتساب أو البريد الإلكتروني.",
          ctaLabel: "استكشاف",
          published: true,
        },
      ],
    },
    faq: {
      header: {
        eyebrow: "قاعدة المعرفة والإجابات الرسمية",
        title: "الأسئلة",
        titleHighlight: "الشائعة",
        subtitle:
          "جميع الإجابات حول باقات الاشتراك، وحجز المواعيد المجانية، وتصدير ملفات GEDCOM، والأرشيفات التونسية.",
        searchPlaceholder: "ابحث عن إجابة (مثال: اشتراك، زووم، GEDCOM، أرشيف)...",
        expandAllLabel: "فتح الكل",
        collapseAllLabel: "طيّ الكل",
        emptySearchText: "لا توجد إجابة تطابق بحثك.",
        resetFiltersLabel: "مسح الفلاتر",
      },
      categories: [
        { id: "all", label: "جميع الأسئلة", icon: "HelpCircle" },
        { id: "subscriptions", label: "الاشتراكات والأسعار", icon: "CreditCard" },
        { id: "services", label: "الخدمات والمواعيد", icon: "Briefcase" },
        { id: "trees", label: "أشجار العائلات و GEDCOM", icon: "Network" },
        { id: "privacy", label: "الخصوصية وحماية البيانات", icon: "ShieldCheck" },
        { id: "support", label: "الدعم والمساندة", icon: "LifeBuoy" },
      ],
      questions: [
        {
          id: "sub-pricing",
          category: "subscriptions",
          badge: "الأسعار والعملات",
          q: "كيف يتم تحديد أسعار الاشتراكات وما هي العملات المقبولة؟",
          a: "ثلاث باقات واضحة: باقة استكشافية مجانية (0 $)، و1.99 $/شهرياً للوصول إلى الوثائق الرقمية وأشجار المعرض، و3.99 $/شهرياً للمرافقة البحثية. يتم تحويل المبالغ تلقائياً إلى عملتك المحلية (TND, EUR, USD, CAD, GBP, SAR).",
          published: true,
        },
        {
          id: "sub-cancel",
          category: "subscriptions",
          q: "هل يمكنني تغيير أو إلغاء اشتراكي في أي وقت؟",
          a: "نعم، دون أي التزام. يمكنك ترقية باقتك أو إلغاؤها بنقرة واحدة من حسابك الشخصي مع الحفاظ الكامل على بياناتك.",
          published: true,
        },
        {
          id: "srv-booking-free",
          category: "services",
          badge: "استشارة مجانية",
          q: "هل حجز موعد أو استشارة أولية مدفوع؟",
          a: "لا، جميع المواعيد والاستشارات الأولية عبر زووم أو واتساب أو البريد الإلكتروني مجانية بالكامل لتقييم طلبك وتقديم عرض مفصل.",
          published: true,
        },
        {
          id: "tree-gedcom-formats",
          category: "trees",
          badge: "معايير قياسية",
          q: "ما هي صيغ GEDCOM المدعومة في الاستيراد والتصدير؟",
          a: "ندعم جميع المعايير الدولية: GEDCOM 5.5.1 و GEDCOM 7.0 و GEDCOM X (XML / JSON / .gedx).",
          published: true,
        },
        {
          id: "sub-payment-methods",
          category: "subscriptions",
          q: "ما هي وسائل الدفع المقبولة للاشتراكات؟",
          a: "البطاقات البنكية الدولية (Visa, Mastercard)، والتحويلات البنكية الوطنية (RIB) والدولية (IBAN/SWIFT)، بالإضافة إلى D17 / Flouci داخل تونس.",
          published: true,
        },
        {
          id: "srv-doc-upload",
          category: "services",
          badge: "مشاركة الملفات",
          q: "هل يتوجب عليّ رفع وثائقي عند حجز موعد؟",
          a: "لا. لا يلزم رفع أي ملفات عبر الموقع. يكفي وصف طلبك باختصار، ثم تشارك وثائقك مباشرة أثناء مكالمة زووم أو عبر واتساب والبريد الإلكتروني.",
          published: true,
        },
        {
          id: "srv-doc-types",
          category: "services",
          q: "ما أنواع الوثائق الأرشيفية القديمة التي تعالجونها؟",
          a: "العقود المخطوطة بالعربية المغربية والتركية العثمانية والإيطالية القديمة واللاتينية الكنسية: سجلات الرعايا، ودفاتر المجبى، وعقود المحاكم الشرعية (الوزارة والقضاة)، والحالة المدنية البايليكية والاستعمارية، والعقود العدلية.",
          published: true,
        },
        {
          id: "srv-insitu",
          category: "services",
          q: "هل ترسلون باحثين ميدانيين مباشرة إلى مراكز الأرشيف في تونس؟",
          a: "نعم. يتنقل باحثونا المعتمدون مباشرة إلى الأرشيف الوطني التونسي (القصبة) والبلديات الجهوية للعثور على الوثائق الأصلية والتحقق منها وتصويرها بدقة عالية.",
          published: true,
        },
        {
          id: "tree-start",
          category: "trees",
          q: "كيف أنشئ أول شجرة عائلة على منصة جذور تونس؟",
          a: "من مساحتك الشخصية، انقر على «شجرة جديدة»، ثم أدخل بياناتك أو استورد ملف GEDCOM القياسي بنقرة واحدة.",
          published: true,
        },
        {
          id: "priv-visibility",
          category: "privacy",
          q: "من يحق له الاطلاع على بيانات شجرة عائلتي؟",
          a: "تختار مستوى الخصوصية بنفسك: خاصة (متاحة لك وحدك) أو عامة (تُشارك مع المجتمع). وبالنسبة للأفراد الأحياء، تُحجب بياناتهم الشخصية افتراضياً.",
          published: true,
        },
        {
          id: "priv-gdpr",
          category: "privacy",
          badge: "حماية البيانات",
          q: "كيف تتم حماية بياناتي الشخصية والعائلية؟",
          a: "تطبق المنصة معايير أمان صارمة وفق القانون التونسي عدد 63 لسنة 2004 واللائحة الأوروبية لحماية البيانات (GDPR).",
          published: true,
        },
        {
          id: "sup-contact",
          category: "support",
          q: "كيف أتواصل مع الفريق في حال وجود سؤال أو عائق تقني؟",
          a: "عبر تبويب «اتصال مباشر» أعلاه، أو عبر البريد الإلكتروني contact@rootstunisia.com، أو مباشرة عبر واتساب.",
          published: true,
        },
      ],
      bottomCta: {
        eyebrow: "لم تجد إجابتك؟",
        title: "خبراء الأرشيف والأنساب في خدمتك",
        subtitle:
          "سواء كان لديك سؤال حول اشتراكك، أو وثيقة مخطوطة تريد قراءتها، أو مشروع بحث عائلي، تواصل معنا مباشرة.",
        whatsappLabel: "تحدث عبر واتساب",
        contactLabel: "راسلنا",
      },
    },
    legal: {
      header: {
        eyebrow: "الامتثال وحماية المعطيات",
        title: "الإطار التنظيمي والأخلاقي",
        description:
          "تلتزم منصة جذور تونس التزاماً صارماً بالقانون التونسي عدد 63 لسنة 2004 (الهيئة الوطنية لحماية المعطيات الشخصية - INPDP) وبمعايير اللائحة الأوروبية لحماية البيانات (GDPR). وتحترم السجلات المتاحة للعموم الأجل القانوني الممتد لمائة سنة، كما تُحجب معطيات الأشخاص الأحياء افتراضياً.",
      },
      cards: [
        {
          id: "legal-1",
          to: "/terms",
          title: "الشروط العامة للاستخدام",
          desc: "شروط الولوج إلى المنصة وقواعد استخدام أدوات البحث في الأنساب.",
          ctaLabel: "قراءة الوثيقة",
          published: true,
        },
        {
          id: "legal-2",
          to: "/privacy",
          title: "سياسة الخصوصية",
          desc: "معالجة المعطيات الشخصية والامتثال لقانون حماية المعطيات (القانون عدد 63 لسنة 2004) و GDPR.",
          ctaLabel: "قراءة الوثيقة",
          published: true,
        },
        {
          id: "legal-3",
          to: "/refund",
          title: "الخدمات وسياسة الاسترجاع",
          desc: "الإطار التعاقدي لأبحاث الأرشيف وعروض الأسعار وضمانات التسليم.",
          ctaLabel: "قراءة الوثيقة",
          published: true,
        },
        {
          id: "legal-4",
          to: "/cookies",
          title: "إدارة ملفات الارتباط",
          desc: "المتعقبات التقنية وآليات تسجيل موافقتك على ملفات تعريف الارتباط.",
          ctaLabel: "قراءة الوثيقة",
          published: true,
        },
      ],
    },
  },
  es: {
    hero: {
      eyebrow: "Centro de Ayuda e Información",
      title: "Centro de Ayuda",
      subtitle:
        "Descubra nuestra metodología archivística basada en pruebas documentales, consulte las respuestas oficiales o contacte con nuestros investigadores.",
      image: "",
    },
    tabLabels: {
      contact: "Contacto Directo",
      about: "Sobre Nosotros y Misión",
      faq: "Preguntas Frecuentes",
      legal: "Marco Legal",
    },
    contact: {
      cards: {
        phoneLabel: "Teléfono",
        phoneValue: "",
        phoneCta: "Llamada directa",
        whatsappLabel: "WhatsApp",
        whatsappValue: "",
        whatsappCta: "Chat en vivo",
        whatsappPrefillMessage:
          "Hola Roots Tunisia, deseo información sobre sus investigaciones genealógicas.",
        emailLabel: "Correo Oficial",
        emailValue: "contact@rootstunisia.com",
        emailCta: "Enviar un correo",
        hoursLabel: "Horario",
        hoursValue: "09:00 – 17:00 (Hora de Túnez, GMT+1)",
        hoursCta: "Respuesta en 24h",
      },
      form: {
        eyebrow: "Formulario de Asistencia",
        title: "Envíe su Consulta",
        subtitle:
          "Indique los apellidos, localidades o signaturas de archivo que busca. Respondemos en 24h.",
        topicsLabel: "Asunto de la consulta",
        topics: [
          { key: "topic_general", label: "Consulta General" },
          { key: "topic_tree_search", label: "Búsqueda de Ancestros y Filiación" },
          { key: "topic_archive_request", label: "Consulta de Signaturas de Archivo" },
          { key: "topic_partnership", label: "Colaboración y Archiveros" },
        ],
        nameLabel: "Nombre completo",
        namePlaceholder: "Ej.: Karim Trabelsi",
        emailLabel: "Correo electrónico",
        emailPlaceholder: "contact@rootstunisia.com",
        messageLabel: "Su mensaje o consulta",
        messagePlaceholder:
          "Detalle su pregunta, el ancestro buscado, el municipio o el tipo de documento...",
        consentText:
          "Acepto el tratamiento de mis datos de contacto para responder a mi solicitud según la política de privacidad.",
        submitButtonLabel: "Enviar Mensaje",
        sendingButtonLabel: "Enviando...",
        successModalTitle: "Mensaje Enviado",
        successModalMessage:
          "Su mensaje ha sido enviado con éxito. Nuestro equipo le responderá en menos de 24 horas.",
        errorModalTitle: "Error de Envío",
        errorModalMessage:
          "Error al enviar el mensaje. Puede escribirnos directamente por WhatsApp.",
      },
      sidebar: {
        deskTitle: "Oficina de Asistencia",
        deskSubtitle: "Archivos y Genealogía",
        deskDescription:
          "¿Tiene una signatura de archivo o un acta antigua difícil de descifrar? También puede reservar una consulta gratuita.",
        deskLinkLabel: "Descubrir servicios y citas →",
        deskLinkTo: "/services",
        platformsTitle: "Plataformas Oficiales",
        whatsappPlatformLabel: "WhatsApp Oficial",
        facebookPlatformLabel: "Facebook Oficial",
        facebookUrl: "",
        instagramPlatformLabel: "Instagram Roots",
        instagramUrl: "",
      },
    },
    about: {
      mission: {
        eyebrow: "Manifiesto y Método Científico",
        title: "La Genealogía por la",
        titleHighlight: "Prueba Documental",
        description:
          "Roots Tunisia fundamenta cada filiación en los archivos autenticados de Túnez: registros de estado civil municipal, tribunales de la Charaâ y rabínicos, censos fiscales de la Majba y fondos de Habous.",
      },
      corpusesHeader: {
        eyebrow: "Fondos Documentales Reales",
        title: "Los 4 Grandes Pilares de Archivos en Túnez",
      },
      corpuses: [
        {
          id: "corpus-1",
          icon: "Building",
          meta: "1886 – Actualidad",
          title: "Registros del Estado Civil Municipal",
          desc: "Nacimientos, matrimonios y defunciones inscritos en las 24 gobernaciones de Túnez desde la creación del registro civil moderno.",
          depot: "Archivos Municipales y Archivo Nacional",
          published: true,
        },
        {
          id: "corpus-2",
          icon: "Scale",
          meta: "Siglo XVIII – 1957",
          title: "Tribunales de la Charaâ y Rabínicos",
          desc: "Sucesiones (‘Ilm Khabar), donaciones, testamentos y particiones notariales redactadas por los ‘udûl de la Mahkama y de la Ouzara.",
          depot: "Tribunales de 1.ª Instancia y Archivo Nacional",
          published: true,
        },
        {
          id: "corpus-3",
          icon: "ScrollText",
          meta: "1856 – 1920",
          title: "Censos Fiscales Beylicales y La Majba",
          desc: "Padrones nominativos de contribuyentes y cabezas de familia por caidato y cheijato, acreditando el arraigo local.",
          depot: "Serie Histórica del Gobierno Beylical",
          published: true,
        },
        {
          id: "corpus-4",
          icon: "FolderArchive",
          meta: "Siglo XVII – 1956",
          title: "Fondos de Habous (Waqf)",
          desc: "Fundaciones pías familiares y transmisiones patrimoniales que detallan líneas de ascendencia durante 3 a 6 generaciones.",
          depot: "Archivo Nacional de Túnez (La Kasbah)",
          published: true,
        },
      ],
      whyUsHeader: {
        eyebrow: "Nuestros 4 Compromisos",
        title: "¿Por Qué Elegir Roots Tunisia?",
      },
      whyUs: [
        {
          id: "why-1",
          icon: "MapPin",
          title: "Presencia Física In Situ",
          desc: "Investigaciones directas en el Archivo Nacional de La Kasbah y en los ayuntamientos regionales para fotografiar las signaturas originales.",
          published: true,
        },
        {
          id: "why-2",
          icon: "FileSearch",
          title: "Paleografía Multilingüe",
          desc: "Lectura y traducción certificada: árabe magrebí cursivo, fórmulas de los ‘udûl, turco otomano beylical, italiano antiguo y latín.",
          published: true,
        },
        {
          id: "why-3",
          icon: "CheckCircle2",
          title: "Trazabilidad y Prueba Integral",
          desc: "Cada filiación remite a una signatura física verificable (registro, legajo, folio). Ninguna genealogía se presume sin documento.",
          published: true,
        },
        {
          id: "why-4",
          icon: "Lock",
          title: "Deontología INPDP y RGPD",
          desc: "Cumplimiento estricto de la ley tunecina n.º 2004-63 y del RGPD: respeto del plazo centenario y protección de la privacidad.",
          published: true,
        },
      ],
      explorations: [
        {
          id: "exp-1",
          to: "/interactive-map",
          icon: "Compass",
          title: "Atlas Archivístico (24 Gobernaciones)",
          desc: "Explore los depósitos de archivos y fondos documentados por región.",
          ctaLabel: "Explorar",
          published: true,
        },
        {
          id: "exp-2",
          to: "/gallery/trees",
          icon: "Network",
          title: "Árboles Genealógicos Documentados",
          desc: "Consulte linajes autenticados con signaturas de fuentes primarias.",
          ctaLabel: "Explorar",
          published: true,
        },
        {
          id: "exp-3",
          to: "/gallery",
          icon: "Eye",
          title: "Galería y Fondos Digitalizados",
          desc: "Fotografías de época, tarjetas postales y manuscritos originales.",
          ctaLabel: "Explorar",
          published: true,
        },
        {
          id: "exp-4",
          to: "/services",
          icon: "Landmark",
          title: "Servicios y Citas Dedicadas",
          desc: "Programe una consulta gratuita por Zoom, WhatsApp o correo electrónico.",
          ctaLabel: "Explorar",
          published: true,
        },
      ],
    },
    faq: {
      header: {
        eyebrow: "Base de Conocimientos y Respuestas",
        title: "Preguntas",
        titleHighlight: "Frecuentes",
        subtitle:
          "Todas las respuestas sobre suscripciones, citas gratuitas, exportación GEDCOM y archivos tunecinos.",
        searchPlaceholder: "Buscar una respuesta (ej.: 1,99 $, Zoom, GEDCOM, INPDP)...",
        expandAllLabel: "Desplegar todo",
        collapseAllLabel: "Replegar todo",
        emptySearchText: "Ninguna respuesta coincide con su búsqueda.",
        resetFiltersLabel: "Restablecer filtros",
      },
      categories: [
        { id: "all", label: "Todas las Preguntas", icon: "HelpCircle" },
        { id: "subscriptions", label: "Suscripciones y Tarifas", icon: "CreditCard" },
        { id: "services", label: "Servicios y Citas", icon: "Briefcase" },
        { id: "trees", label: "Árboles y GEDCOM", icon: "Network" },
        { id: "privacy", label: "Privacidad y Derechos", icon: "ShieldCheck" },
        { id: "support", label: "Asistencia", icon: "LifeBuoy" },
      ],
      questions: [
        {
          id: "sub-pricing",
          category: "subscriptions",
          badge: "Tarifas y Divisas",
          q: "¿Cómo se fijan las suscripciones y qué divisas se aceptan?",
          a: "Tres planes claros: acceso descubrimiento gratuito (0 $), 1,99 $/mes para acceder a actas digitalizadas y árboles de la galería, y 3,99 $/mes con acompañamiento de un historiador. Los importes se convierten automáticamente a su moneda local (TND, EUR, USD, CAD, GBP, SAR).",
          published: true,
        },
        {
          id: "sub-cancel",
          category: "subscriptions",
          q: "¿Puedo cambiar o cancelar mi suscripción en cualquier momento?",
          a: "Sí, sin compromiso alguno. Puede mejorar, reducir o cancelar su plan en 1 clic desde su perfil de usuario. Sus datos permanecen protegidos de forma segura.",
          published: true,
        },
        {
          id: "sub-payment-methods",
          category: "subscriptions",
          q: "¿Qué métodos de pago se aceptan para las suscripciones?",
          a: "Tarjetas bancarias internacionales (Visa, Mastercard), transferencias bancarias nacionales en Túnez (RIB), transferencias internacionales (IBAN/SWIFT) y D17 / Flouci dentro de Túnez.",
          published: true,
        },
        {
          id: "srv-booking-free",
          category: "services",
          badge: "Consulta Gratuita",
          q: "¿Tiene algún coste reservar una cita o consulta preliminar?",
          a: "No. Toda cita o consulta preliminar (videollamada por Zoom, WhatsApp o correo electrónico) es 100 % gratuita. Permite evaluar la viabilidad de su investigación y ofrecerle un presupuesto a medida antes de cualquier compromiso.",
          published: true,
        },
        {
          id: "srv-doc-upload",
          category: "services",
          badge: "Envío de Archivos",
          q: "¿Debo subir mis documentos al reservar una cita?",
          a: "No. No es necesario subir archivos en la web. Basta con describir su necesidad y luego compartirá sus documentos directamente durante la llamada por Zoom o por WhatsApp/correo.",
          published: true,
        },
        {
          id: "srv-doc-types",
          category: "services",
          q: "¿Qué tipos de documentos de archivos históricos tramitan?",
          a: "Actas manuscritas en árabe magrebí, turco otomano, italiano antiguo o latín eclesiástico: registros parroquiales, padrones de la Majba, actas de tribunales de la Charaâ (Ouzara, cadíes), estado civil beylical y colonial y escrituras notariales.",
          published: true,
        },
        {
          id: "srv-insitu",
          category: "services",
          q: "¿Envían investigadores físicamente a los archivos en Túnez?",
          a: "Sí. Nuestros investigadores acreditados acuden directamente al Archivo Nacional de Túnez (La Kasbah) y a los ayuntamientos regionales para localizar, verificar y fotografiar en alta definición los documentos originales.",
          published: true,
        },
        {
          id: "tree-start",
          category: "trees",
          q: "¿Cómo creo mi primer árbol genealógico en Roots Tunisia?",
          a: "Desde su espacio personal, haga clic en «Nuevo Árbol», introduzca su ficha o importe directamente su archivo GEDCOM estándar en un clic.",
          published: true,
        },
        {
          id: "tree-gedcom-formats",
          category: "trees",
          badge: "Estándares Abiertos",
          q: "¿Qué formatos GEDCOM son compatibles para importar y exportar?",
          a: "Todos los estándares internacionales: GEDCOM 5.5.1, GEDCOM 7.0 y GEDCOM X (XML / JSON / .gedx) para garantizar la interoperabilidad total con Gramps, Heredis o Ancestry.",
          published: true,
        },
        {
          id: "priv-visibility",
          category: "privacy",
          q: "¿Quién tiene acceso a los datos de mi árbol genealógico?",
          a: "Usted elige la visibilidad: Privado (estrictamente accesible solo para usted) o Público (compartido con la comunidad). Para las personas vivas, los datos personales permanecen ocultos por defecto.",
          published: true,
        },
        {
          id: "priv-gdpr",
          category: "privacy",
          badge: "INPDP y RGPD",
          q: "¿Cómo se protegen mis datos personales y genealógicos?",
          a: "Roots Tunisia aplica estrictas medidas de seguridad conforme a la ley tunecina n.º 2004-63 (INPDP) y al RGPD. Sus datos nunca se venden ni ceden a terceros.",
          published: true,
        },
        {
          id: "sup-contact",
          category: "support",
          q: "¿Cómo puedo contactar con el equipo ante una duda o incidencia?",
          a: "Mediante la pestaña «Contacto Directo» superior, por correo electrónico en contact@rootstunisia.com o directamente por WhatsApp.",
          published: true,
        },
      ],
      bottomCta: {
        eyebrow: "¿No encontró su respuesta?",
        title: "Nuestros Archiveros y Genealogistas están a su disposición",
        subtitle:
          "Ya sea por una duda sobre su suscripción, un manuscrito por descifrar o un proyecto familiar, contáctenos directamente.",
        whatsappLabel: "Chatear en WhatsApp",
        contactLabel: "Escribirnos",
      },
    },
    legal: {
      header: {
        eyebrow: "Cumplimiento y Protección de Datos",
        title: "Marco Normativo y Deontológico",
        description:
          "Roots Tunisia cumple estrictamente con la ley tunecina n.º 2004-63 (Instancia Nacional de Protección de Datos Personales - INPDP) y los estándares del RGPD. Los registros consultables respetan el plazo legal de 100 años y los datos de personas vivas se ocultan por defecto.",
      },
      cards: [
        {
          id: "legal-1",
          to: "/terms",
          title: "Condiciones Generales de Uso",
          desc: "Normas de acceso a la plataforma y condiciones de uso de las herramientas genealógicas.",
          ctaLabel: "Leer el documento",
          published: true,
        },
        {
          id: "legal-2",
          to: "/privacy",
          title: "Política de Privacidad",
          desc: "Tratamiento de datos personales y cumplimiento de la INPDP (Ley n.º 2004-63) y RGPD.",
          ctaLabel: "Leer el documento",
          published: true,
        },
        {
          id: "legal-3",
          to: "/refund",
          title: "Servicios y Reembolsos",
          desc: "Marco contractual de las investigaciones archivísticas, presupuestos y garantías de entrega.",
          ctaLabel: "Leer el documento",
          published: true,
        },
        {
          id: "legal-4",
          to: "/cookies",
          title: "Gestión de Cookies",
          desc: "Cookies técnicas y gestión de sus preferencias de consentimiento.",
          ctaLabel: "Leer el documento",
          published: true,
        },
      ],
    },
  },
  it: {
    hero: {
      eyebrow: "Centro Assistenza e Informazioni",
      title: "Centro Assistenza",
      subtitle:
        "Scopri il nostro metodo archivistico basato sulle prove documentarie, consulta le risposte ufficiali o contatta i nostri ricercatori.",
      image: "",
    },
    tabLabels: {
      contact: "Contatto Diretto",
      about: "Chi Siamo e Missione",
      faq: "Domande Frequenti (FAQ)",
      legal: "Quadro Legale",
    },
    contact: {
      cards: {
        phoneLabel: "Telefono",
        phoneValue: "",
        phoneCta: "Chiamata diretta",
        whatsappLabel: "WhatsApp",
        whatsappValue: "",
        whatsappCta: "Chat dal vivo",
        whatsappPrefillMessage:
          "Salve Roots Tunisia, desidero informazioni sulle vostre ricerche genealogiche.",
        emailLabel: "Email Ufficiale",
        emailValue: "contact@rootstunisia.com",
        emailCta: "Invia un'email",
        hoursLabel: "Orari",
        hoursValue: "09:00 – 17:00 (Ora di Tunisi, GMT+1)",
        hoursCta: "Risposta entro 24h",
      },
      form: {
        eyebrow: "Modulo di Assistenza",
        title: "Invia la tua Richiesta",
        subtitle:
          "Specifica i cognomi, le località o le segnature d'archivio cercate. Il nostro team risponde entro 24 ore.",
        topicsLabel: "Oggetto della richiesta",
        topics: [
          { key: "topic_general", label: "Informazioni Generali" },
          { key: "topic_tree_search", label: "Ricerca Antenati e Discendenza" },
          { key: "topic_archive_request", label: "Consultazione Segnature d'Archivio" },
          { key: "topic_partnership", label: "Collaborazione e Archivisti" },
        ],
        nameLabel: "Nome completo",
        namePlaceholder: "Es.: Karim Trabelsi",
        emailLabel: "Indirizzo Email",
        emailPlaceholder: "contact@rootstunisia.com",
        messageLabel: "Il tuo Messaggio o Ricerca",
        messagePlaceholder:
          "Descrivi la tua domanda, l'antenato ricercato, il comune o il tipo di documento...",
        consentText:
          "Acconsento al trattamento dei miei dati di contatto per rispondere alla richiesta secondo l'informativa sulla privacy.",
        submitButtonLabel: "Invia Messaggio",
        sendingButtonLabel: "Invio in corso...",
        successModalTitle: "Messaggio Inviato",
        successModalMessage:
          "Il tuo messaggio è stato inviato con successo. Il nostro team ti risponderà entro 24 ore.",
        errorModalTitle: "Errore di Invio",
        errorModalMessage:
          "Errore durante l'invio del messaggio. Puoi scriverci direttamente su WhatsApp.",
      },
      sidebar: {
        deskTitle: "Ufficio Assistenza",
        deskSubtitle: "Archivi e Genealogia",
        deskDescription:
          "Hai una segnatura d'archivio o un atto manoscritto difficile da decifrare? Puoi anche prenotare una consulenza gratuita.",
        deskLinkLabel: "Scopri i nostri servizi e appuntamenti →",
        deskLinkTo: "/services",
        platformsTitle: "Piattaforme Ufficiali",
        whatsappPlatformLabel: "WhatsApp Ufficiale",
        facebookPlatformLabel: "Facebook Ufficiale",
        facebookUrl: "",
        instagramPlatformLabel: "Instagram Roots",
        instagramUrl: "",
      },
    },
    about: {
      mission: {
        eyebrow: "Manifesto e Metodo Scientifico",
        title: "La Genealogia tramite",
        titleHighlight: "Prova Documentaria",
        description:
          "Roots Tunisia ancora ogni filiazione negli archivi autenticati della Tunisia: registri di stato civile municipale, tribunali sciaraitici e rabbinici, ruoli fiscali della Majba e fondi Habous.",
      },
      corpusesHeader: {
        eyebrow: "Fondi Documentari Reali",
        title: "I 4 Grandi Pilastri degli Archivi in Tunisia",
      },
      corpuses: [
        {
          id: "corpus-1",
          icon: "Building",
          meta: "1886 – Oggi",
          title: "Registri dello Stato Civile Municipale",
          desc: "Nascite, matrimoni e decessi annotati nei 24 governatorati della Tunisia sin dall'istituzione dello stato civile moderno.",
          depot: "Archivi Municipali e Archivi Nazionali",
          published: true,
        },
        {
          id: "corpus-2",
          icon: "Scale",
          meta: "XVIII sec. – 1957",
          title: "Tribunali Sciaraitici e Rabbinici",
          desc: "Successioni (‘Ilm Khabar), donazioni, testamenti e devoluzioni notarili redatte dagli ‘udûl della Mahkama e dell'Ouzara.",
          depot: "Tribunali di 1° Grado e AN di Tunisia",
          published: true,
        },
        {
          id: "corpus-3",
          icon: "ScrollText",
          meta: "1856 – 1920",
          title: "Ruoli Fiscali Beilicali e La Majba",
          desc: "Censimenti nominativi dei contribuenti e capifamiglia per caidato e cheikhato, che attestano la presenza locale.",
          depot: "Serie Storica del Governo Beilicale",
          published: true,
        },
        {
          id: "corpus-4",
          icon: "FolderArchive",
          meta: "XVII sec. – 1956",
          title: "Fondi degli Habous (Waqf)",
          desc: "Fondazioni pie familiari e devoluzioni patrimoniali che ricostruiscono linee ascendenti lungo 3-6 generazioni.",
          depot: "Archivi Nazionali di Tunisia (La Kasbah)",
          published: true,
        },
      ],
      whyUsHeader: {
        eyebrow: "I Nostri 4 Impegni",
        title: "Perché Scegliere Roots Tunisia?",
      },
      whyUs: [
        {
          id: "why-1",
          icon: "MapPin",
          title: "Presenza Fisica In Situ",
          desc: "Ricerche dirette presso gli Archivi Nazionali della Kasbah e nei comuni regionali per fotografare le unità originali.",
          published: true,
        },
        {
          id: "why-2",
          icon: "FileSearch",
          title: "Paleografia Multilingue",
          desc: "Lettura e traduzione certificata: arabo magrebino corsivo, formule degli ‘udûl, turco ottomano beilicale, italiano antico e latino.",
          published: true,
        },
        {
          id: "why-3",
          icon: "CheckCircle2",
          title: "Tracciabilità e Prova Integrale",
          desc: "Ogni discendenza rimanda a una segnatura fisica verificabile (registro, busta, foglio). Nessuna genealogia è presunta senza documento.",
          published: true,
        },
        {
          id: "why-4",
          icon: "Lock",
          title: "Deontologia INPDP e GDPR",
          desc: "Conformità rigorosa alla legge tunisina n. 2004-63 e al GDPR: rispetto del termine centenario e tutela della privacy.",
          published: true,
        },
      ],
      explorations: [
        {
          id: "exp-1",
          to: "/interactive-map",
          icon: "Compass",
          title: "Atlante Archivistico (24 Governatorati)",
          desc: "Esplora i depositi d'archivio e i fondi documentati per regione.",
          ctaLabel: "Esplora",
          published: true,
        },
        {
          id: "exp-2",
          to: "/gallery/trees",
          icon: "Network",
          title: "Alberi Genealogici Documentati",
          desc: "Consulta i lignaggi autenticati con segnature di fonti primarie.",
          ctaLabel: "Esplora",
          published: true,
        },
        {
          id: "exp-3",
          to: "/gallery",
          icon: "Eye",
          title: "Galleria e Fondi Digitalizzati",
          desc: "Fotografie d'epoca, cartoline e manoscritti originali.",
          ctaLabel: "Esplora",
          published: true,
        },
        {
          id: "exp-4",
          to: "/services",
          icon: "Landmark",
          title: "Servizi e Appuntamenti Dedicati",
          desc: "Pianifica una consulenza gratuita via Zoom, WhatsApp o Email.",
          ctaLabel: "Esplora",
          published: true,
        },
      ],
    },
    faq: {
      header: {
        eyebrow: "Base di Conoscenza e Risposte",
        title: "Domande",
        titleHighlight: "Frequenti",
        subtitle:
          "Tutte le risposte su abbonamenti, consulenze gratuite, esportazione GEDCOM e archivi tunisini.",
        searchPlaceholder: "Cerca una risposta (es: 1,99 $, Zoom, GEDCOM, INPDP)...",
        expandAllLabel: "Espandi tutto",
        collapseAllLabel: "Comprimi tutto",
        emptySearchText: "Nessuna risposta corrisponde alla tua ricerca.",
        resetFiltersLabel: "Cancella i filtri",
      },
      categories: [
        { id: "all", label: "Tutte le Domande", icon: "HelpCircle" },
        { id: "subscriptions", label: "Abbonamenti e Tariffe", icon: "CreditCard" },
        { id: "services", label: "Servizi e Appuntamenti", icon: "Briefcase" },
        { id: "trees", label: "Alberi e GEDCOM", icon: "Network" },
        { id: "privacy", label: "Privacy e Diritti", icon: "ShieldCheck" },
        { id: "support", label: "Assistenza", icon: "LifeBuoy" },
      ],
      questions: [
        {
          id: "sub-pricing",
          category: "subscriptions",
          badge: "Tariffe e Valute",
          q: "Come sono strutturati gli abbonamenti e quali valute sono accettate?",
          a: "Tre formule chiare: accesso esplorativo gratuito (0 $), 1,99 $/mese per consultare atti digitalizzati e alberi della galleria, e 3,99 $/mese con affiancamento di uno storico. Gli importi sono convertiti nella tua valuta locale (TND, EUR, USD, CAD, GBP, SAR).",
          published: true,
        },
        {
          id: "sub-cancel",
          category: "subscriptions",
          q: "Posso modificare o disdire il mio abbonamento in qualsiasi momento?",
          a: "Sì, senza alcun vincolo. Puoi cambiare piano o annullare in 1 clic dal tuo profilo utente. I tuoi dati restano sempre al sicuro.",
          published: true,
        },
        {
          id: "sub-payment-methods",
          category: "subscriptions",
          q: "Quali metodi di pagamento sono accettati per gli abbonamenti?",
          a: "Carte bancarie internazionali (Visa, Mastercard), bonifici bancari nazionali in Tunisia (RIB), bonifici internazionali (IBAN/SWIFT) e D17 / Flouci per la Tunisia.",
          published: true,
        },
        {
          id: "srv-booking-free",
          category: "services",
          badge: "Consulenza Gratuita",
          q: "La prenotazione di un appuntamento o consulenza preliminare è a pagamento?",
          a: "No. Qualsiasi contatto o consulenza preliminare (videochiamata Zoom, WhatsApp o email) è gratuita al 100 %. Consente di valutare la fattibilità della ricerca e formulare un preventivo su misura prima di qualsiasi impegno.",
          published: true,
        },
        {
          id: "srv-doc-upload",
          category: "services",
          badge: "Invio File",
          q: "Devo caricare i miei documenti quando prenoto un appuntamento?",
          a: "No. Non è richiesto alcun caricamento di file sul sito. Ti basta descrivere la richiesta e condividerai i documenti durante la sessione Zoom o tramite WhatsApp/email.",
          published: true,
        },
        {
          id: "srv-doc-types",
          category: "services",
          q: "Quali tipi di documenti archivistici antichi trattate?",
          a: "Atti manoscritti in arabo magrebino, turco ottomano, italiano antico o latino ecclesiastico: registri parrocchiali, ruoli fiscali della Majba, atti dei tribunali sciaraitici (Ouzara, cadì), stato civile beilicale e coloniale e atti notarili.",
          published: true,
        },
        {
          id: "srv-insitu",
          category: "services",
          q: "Inviate ricercatori fisicamente negli archivi in Tunisia?",
          a: "Sì. I nostri ricercatori abilitati si recano direttamente agli Archivi Nazionali di Tunisia (La Kasbah) e nei comuni regionali per individuare, verificare e fotografare in alta definizione gli originali.",
          published: true,
        },
        {
          id: "tree-start",
          category: "trees",
          q: "Come creo il mio primo albero genealogico su Roots Tunisia?",
          a: "Dalla tua area personale, clicca su «Nuovo Albero», inserisci la tua scheda oppure importa direttamente il tuo file GEDCOM standard con un clic.",
          published: true,
        },
        {
          id: "tree-gedcom-formats",
          category: "trees",
          badge: "Standard Aperti",
          q: "Quali formati GEDCOM sono supportati in importazione ed esportazione?",
          a: "Tutti gli standard internazionali: GEDCOM 5.5.1, GEDCOM 7.0 e GEDCOM X (XML / JSON / .gedx) per garantire piena interoperabilità con Gramps, Heredis o Ancestry.",
          published: true,
        },
        {
          id: "priv-visibility",
          category: "privacy",
          q: "Chi ha accesso ai dati del mio albero genealogico?",
          a: "Scegli tu la visibilità: Privato (accessibile solo a te) o Pubblico (condiviso con la comunità). Per le persone viventi, i dati personali sono oscurati per impostazione predefinita.",
          published: true,
        },
        {
          id: "priv-gdpr",
          category: "privacy",
          badge: "INPDP & GDPR",
          q: "Come vengono protetti i miei dati personali e genealogici?",
          a: "Roots Tunisia applica rigorosi standard di sicurezza conformi alla legge tunisina n. 2004-63 (INPDP) e al GDPR. I tuoi dati non vengono mai venduti né ceduti a terzi.",
          published: true,
        },
        {
          id: "sup-contact",
          category: "support",
          q: "Come posso contattare il team in caso di domande o difficoltà?",
          a: "Tramite la scheda «Contatto Diretto» qui sopra, per email a contact@rootstunisia.com oppure direttamente su WhatsApp.",
          published: true,
        },
      ],
      bottomCta: {
        eyebrow: "Non hai trovato la risposta?",
        title: "I Nostri Archivisti e Genealogisti sono a tua disposizione",
        subtitle:
          "Per domande sul tuo abbonamento, un manoscritto da decifrare o un progetto di ricerca familiare, contattaci direttamente.",
        whatsappLabel: "Chatta su WhatsApp",
        contactLabel: "Scrivici",
      },
    },
    legal: {
      header: {
        eyebrow: "Conformità e Protezione dei Dati",
        title: "Quadro Normativo e Deontologico",
        description:
          "Roots Tunisia garantisce la piena conformità alla legge tunisina n. 2004-63 (Autorità Nazionale per la Protezione dei Dati Personali - INPDP) e agli standard del GDPR. I registri consultabili rispettano il termine legale di 100 anni e i dati delle persone viventi sono oscurati per impostazione predefinita.",
      },
      cards: [
        {
          id: "legal-1",
          to: "/terms",
          title: "Condizioni Generali d'Uso",
          desc: "Modalità di accesso alla piattaforma e regole di utilizzo degli strumenti genealogici.",
          ctaLabel: "Leggi il documento",
          published: true,
        },
        {
          id: "legal-2",
          to: "/privacy",
          title: "Informativa sulla Privacy",
          desc: "Trattamento dei dati personali e conformità INPDP (Legge n. 2004-63) & GDPR.",
          ctaLabel: "Leggi il documento",
          published: true,
        },
        {
          id: "legal-3",
          to: "/refund",
          title: "Servizi e Politica di Rimborso",
          desc: "Quadro contrattuale delle ricerche archivistiche, preventivi e garanzie di consegna.",
          ctaLabel: "Leggi il documento",
          published: true,
        },
        {
          id: "legal-4",
          to: "/cookies",
          title: "Gestione dei Cookie",
          desc: "Cookie tecnici e modalità di raccolta del tuo consenso.",
          ctaLabel: "Leggi il documento",
          published: true,
        },
      ],
    },
  },
  mt: {
    hero: {
      eyebrow: "Ċentru ta' Għajnuna u Informazzjoni",
      title: "Ċentru ta' Għajnuna",
      subtitle:
        "Skopri l-metodoloġija arkivistika tagħna bbażata fuq il-provi dokumentarji, ara t-tweġibiet uffiċjali jew ikkuntattja lir-riċerkaturi tagħna.",
      image: "",
    },
    tabLabels: {
      contact: "Kuntatt Dirett",
      about: "Fuqna u Missjoni",
      faq: "Mistoqsijiet Frekwenti (FAQ)",
      legal: "Qafas Legali",
    },
    contact: {
      cards: {
        phoneLabel: "Telefon",
        phoneValue: "",
        phoneCta: "Sejħa diretta",
        whatsappLabel: "WhatsApp",
        whatsappValue: "",
        whatsappCta: "Chat dirett",
        whatsappPrefillMessage:
          "Bongu Roots Tunisia, nixtieq informazzjoni dwar ir-riċerka ġenealoġika tagħkom.",
        emailLabel: "Email Uffiċjali",
        emailValue: "contact@rootstunisia.com",
        emailCta: "Ibgħat email",
        hoursLabel: "Ħinijiet",
        hoursValue: "09:00 – 17:00 (Ħin ta' Tuneż, GMT+1)",
        hoursCta: "Tweġiba f'24 siegħa",
      },
      form: {
        eyebrow: "Formola ta' Għajnuna",
        title: "Ibgħat it-Talba Tiegħek",
        subtitle:
          "Speċifika l-kunjomijiet, il-lokalitajiet jew il-kodiċi tal-arkivji li qed tfittex. It-tim tagħna jwieġeb fi żmien 24 siegħa.",
        topicsLabel: "Suġġett tat-talba",
        topics: [
          { key: "topic_general", label: "Informazzjoni Ġenerali" },
          { key: "topic_tree_search", label: "Tfittxija ta' Antenati u Nisel" },
          { key: "topic_archive_request", label: "Konsultazzjoni ta' Kodiċi tal-Arkivju" },
          { key: "topic_partnership", label: "Sħubija u Arkivisti" },
        ],
        nameLabel: "Isem sħiħ",
        namePlaceholder: "Eż.: Karim Trabelsi",
        emailLabel: "Indirizz tal-Email",
        emailPlaceholder: "contact@rootstunisia.com",
        messageLabel: "Il-Messaġġ jew ir-Riċerka Tiegħek",
        messagePlaceholder:
          "Iddettalja l-mistoqsija tiegħek, l-antenat li qed tfittex, il-muniċipalità jew it-tip ta' dokument...",
        consentText:
          "Naqbel mal-ipproċessar tad-dettalji ta' kuntatt tiegħi biex tingħata tweġiba għat-talba tiegħi skont il-politika tal-privatezza.",
        submitButtonLabel: "Ibgħat il-Messaġġ",
        sendingButtonLabel: "Qed jintbagħat...",
        successModalTitle: "Il-Messaġġ Intbagħat",
        successModalMessage:
          "Il-messaġġ tiegħek intbagħat b'suċċess. It-tim tagħna jwieġbek fi żmien 24 siegħa.",
        errorModalTitle: "Żball fl-Ibgħat",
        errorModalMessage:
          "Żball waqt li qed jintbagħat il-messaġġ. Tista' tiktbilna direttament fuq WhatsApp.",
      },
      sidebar: {
        deskTitle: "Uffiċċju ta' Għajnuna",
        deskSubtitle: "Arkivji u Ġenealoġija",
        deskDescription:
          "Għandek dokument antik jew kodiċi tal-arkivju diffiċli biex jinqara? Tista' wkoll tibbukkja konsultazzjoni b'xejn.",
        deskLinkLabel: "Skopri s-servizzi u l-appuntamenti →",
        deskLinkTo: "/services",
        platformsTitle: "Pjattaformi Uffiċjali",
        whatsappPlatformLabel: "WhatsApp Uffiċjali",
        facebookPlatformLabel: "Facebook Uffiċjali",
        facebookUrl: "",
        instagramPlatformLabel: "Instagram Roots",
        instagramUrl: "",
      },
    },
    about: {
      mission: {
        eyebrow: "Manifest u Metodu Xjentifiku",
        title: "Il-Ġenealoġija permezz ta'",
        titleHighlight: "Prova Dokumentarja",
        description:
          "Roots Tunisia tibbaża kull linaġġ fuq l-arkivji awtentikati tat-Tuneżija: reġistri tal-istat ċivili muniċipali, qrati tax-Xarigħa u rabbiniċi, reġistri tat-taxxa tal-Maġba u fondi tal-Ħabus.",
      },
      corpusesHeader: {
        eyebrow: "Fondi Dokumentarji Reali",
        title: "L-4 Pilastri Ewlenin tal-Arkivji fit-Tuneżija",
      },
      corpuses: [
        {
          id: "corpus-1",
          icon: "Building",
          meta: "1886 – Illum",
          title: "Reġistri tal-Istat Ċivili Muniċipali",
          desc: "Twelid, żwiġijiet u mwiet irreġistrati fl-24 governatorat tat-Tuneżija sa mit-twaqqif tal-istat ċivili modern.",
          depot: "Arkivji Muniċipali u Arkivju Nazzjonali",
          published: true,
        },
        {
          id: "corpus-2",
          icon: "Scale",
          meta: "Seklu XVIII – 1957",
          title: "Qrati tax-Xarigħa u Rabbiniċi",
          desc: "Wirtijiet (‘Ilm Khabar), donazzjonijiet, testmenti u atti notarili miktuba mill-‘udûl tal-Mahkama u tal-Ouzara.",
          depot: "Qrati tal-1el Istanza u AN tat-Tuneżija",
          published: true,
        },
        {
          id: "corpus-3",
          icon: "ScrollText",
          meta: "1856 – 1920",
          title: "Reġistri Fiskali Bejlikali u La Majba",
          desc: "Ċensimenti nominattivi tal-kontribwenti u kapijiet tal-familja skont il-kajdat u x-xejkhat, li jikkonfermaw il-preżenza lokali.",
          depot: "Serje Storika tal-Gvern Bejlikali",
          published: true,
        },
        {
          id: "corpus-4",
          icon: "FolderArchive",
          meta: "Seklu XVII – 1956",
          title: "Fondi tal-Ħabus (Waqf)",
          desc: "Fondazzjonijiet familjari u trasferimenti ta' proprjetà li jiddeskrivu ktajjen ta' axxendenza fuq 3 sa 6 ġenerazzjonijiet.",
          depot: "Arkivju Nazzjonali tat-Tuneżija (La Kasbah)",
          published: true,
        },
      ],
      whyUsHeader: {
        eyebrow: "L-4 Impenji Tagħna",
        title: "Għaliex Tagħżel Roots Tunisia?",
      },
      whyUs: [
        {
          id: "why-1",
          icon: "MapPin",
          title: "Preżenza Fiżika Fuq il-Post",
          desc: "Riċerki diretti fl-Arkivju Nazzjonali ta' La Kasbah u fil-muniċipalitajiet reġjonali biex jiġu fotografati l-kodiċi oriġinali.",
          published: true,
        },
        {
          id: "why-2",
          icon: "FileSearch",
          title: "Paleografija Multilingwi",
          desc: "Qari u traduzzjoni ċċertifikata: Għarbi Magrebini kursiv, formuli tal-‘udûl, Tork Ottoman Bejlikali, Taljan antik u Latin.",
          published: true,
        },
        {
          id: "why-3",
          icon: "CheckCircle2",
          title: "Traċċabbiltà u Prova Sħiħa",
          desc: "Kull nisel jirreferi għal kodiċi fiżiku verifikabbli (reġistru, kaxxa, folju). L-ebda ġenealoġija ma tiġi preżunta mingħajr dokument.",
          published: true,
        },
        {
          id: "why-4",
          icon: "Lock",
          title: "Etika INPDP u GDPR",
          desc: "Konformità stretta mal-liġi Tuneżina Nru 2004-63 u l-GDPR: rispett tal-iskadenza ta' 100 sena u protezzjoni tal-privatezza.",
          published: true,
        },
      ],
      explorations: [
        {
          id: "exp-1",
          to: "/interactive-map",
          icon: "Compass",
          title: "Atlas Arkivistiku (24 Governatorat)",
          desc: "Ara l-arkivji u l-fondi dokumentati skont ir-reġjun.",
          ctaLabel: "Esplora",
          published: true,
        },
        {
          id: "exp-2",
          to: "/gallery/trees",
          icon: "Network",
          title: "Siġar tal-Familja Dokumentati",
          desc: "Ikkonsulta l-linaġġi awtentikati b'referenzi ta' sorsi primarji.",
          ctaLabel: "Esplora",
          published: true,
        },
        {
          id: "exp-3",
          to: "/gallery",
          icon: "Eye",
          title: "Gallerija u Fondi Diġitalizzati",
          desc: "Ritratti storiċi, kartolini u manuskritti oriġinali.",
          ctaLabel: "Esplora",
          published: true,
        },
        {
          id: "exp-4",
          to: "/services",
          icon: "Landmark",
          title: "Servizzi u Appuntamenti Dedikati",
          desc: "Ibbukkja konsultazzjoni b'xejn fuq Zoom, WhatsApp jew Email.",
          ctaLabel: "Esplora",
          published: true,
        },
      ],
    },
    faq: {
      header: {
        eyebrow: "Bażi ta' Għarfien u Tweġibiet",
        title: "Mistoqsijiet",
        titleHighlight: "Frekwenti",
        subtitle:
          "It-tweġibiet kollha dwar abbonamenti, konsultazzjonijiet b'xejn, esportazzjoni GEDCOM u l-arkivji Tuneżini.",
        searchPlaceholder: "Fittex tweġiba (eż: 1.99 $, Zoom, GEDCOM, arkivji)...",
        expandAllLabel: "Iftaħ kollox",
        collapseAllLabel: "Agħlaq kollox",
        emptySearchText: "L-ebda tweġiba ma taqbel mat-tfittxija tiegħek.",
        resetFiltersLabel: "Neħħi l-filtri",
      },
      categories: [
        { id: "all", label: "Il-Mistoqsijiet Kollha", icon: "HelpCircle" },
        { id: "subscriptions", label: "Abbonamenti u Prezzijiet", icon: "CreditCard" },
        { id: "services", label: "Servizzi u Appuntamenti", icon: "Briefcase" },
        { id: "trees", label: "Siġar u GEDCOM", icon: "Network" },
        { id: "privacy", label: "Privatezza u Drittijiet", icon: "ShieldCheck" },
        { id: "support", label: "Appoġġ", icon: "LifeBuoy" },
      ],
      questions: [
        {
          id: "sub-pricing",
          category: "subscriptions",
          badge: "Prezzijiet u Muniti",
          q: "Kif jiġu stabbiliti l-abbonamenti u liema muniti huma aċċettati?",
          a: "Tliet pjanijiet ċari: aċċess ta' skoperta b'xejn (0 $), 1.99 $/xahar għal aċċess għall-atti diġitalizzati u s-siġar tal-gallerija, u 3.99 $/xahar għal appoġġ minn storiku. L-ammonti jiġu kkonvertiti awtomatikament fil-munita lokali tiegħek (TND, EUR, USD, CAD, GBP, SAR).",
          published: true,
        },
        {
          id: "sub-cancel",
          category: "subscriptions",
          q: "Nista' nbiddel jew nikkanċella l-abbonament tiegħi fi kwalunkwe ħin?",
          a: "Iva, mingħajr ebda rabta. Tista' taġġorna jew tikkanċella l-pjan tiegħek bi klikk waħda mill-profil tiegħek. Id-dejta tiegħek tibqa' maħżuna b'mod sigur.",
          published: true,
        },
        {
          id: "sub-payment-methods",
          category: "subscriptions",
          q: "Liema metodi ta' ħlas huma aċċettati għall-abbonamenti?",
          a: "Karti bankarji internazzjonali (Visa, Mastercard), trasferimenti bankarji nazzjonali fit-Tuneżija (RIB), trasferimenti internazzjonali (IBAN/SWIFT), kif ukoll D17 / Flouci fit-Tuneżija.",
          published: true,
        },
        {
          id: "srv-booking-free",
          category: "services",
          badge: "Konsultazzjoni B'Xejn",
          q: "Il-prenotazzjoni ta' appuntament jew konsultazzjoni preliminari tiswa flus?",
          a: "Le. Kull kuntatt jew appuntament preliminari (sejħa bil-vidjo Zoom, WhatsApp jew email) huwa 100 % b'xejn. Dan jippermetti li nevalwaw il-fattibbiltà tat-talba tiegħek u noffrulek kwotazzjoni apposta qabel kwalunkwe impenn.",
          published: true,
        },
        {
          id: "srv-doc-upload",
          category: "services",
          badge: "Qsim ta' Fajls",
          q: "Għandi bżonn intella' d-dokumenti tiegħi meta nibbukkja appuntament?",
          a: "Le. Mhu meħtieġ l-ebda tfigħ ta' fajls fuq is-sit. Sempliċement iddeskrivi l-bżonn tiegħek, u mbagħad taqsam id-dokumenti tiegħek direttament waqt is-sessjoni Zoom jew permezz ta' WhatsApp/email.",
          published: true,
        },
        {
          id: "srv-doc-types",
          category: "services",
          q: "Liema tipi ta' dokumenti arkivistiċi storiċi tittrattaw?",
          a: "Atti manuskritti bl-Għarbi Magrebini, Tork Ottoman, Taljan antik jew Latin ekkleżjastiku: reġistri parrokkjali, listi fiskali tal-Maġba, atti tal-qrati tax-Xarigħa (Ouzara, kadijiet), stat ċivili Bejlikali u kolonjali, u atti notarili.",
          published: true,
        },
        {
          id: "srv-insitu",
          category: "services",
          q: "Tibagħtu riċerkaturi fiżikament fl-arkivji fit-Tuneżija?",
          a: "Iva. Ir-riċerkaturi akkreditati tagħna jmorru direttament fl-Arkivju Nazzjonali tat-Tuneżija (La Kasbah) u fil-muniċipalitajiet reġjonali biex isibu, jivverifikaw u jieħdu ritratti b'riżoluzzjoni għolja tad-dokumenti oriġinali.",
          published: true,
        },
        {
          id: "tree-start",
          category: "trees",
          q: "Kif noħloq l-ewwel siġra tal-familja tiegħi fuq Roots Tunisia?",
          a: "Mill-ispazju personali tiegħek, ikklikkja fuq «Siġra Ġdida», daħħal ir-rekord tiegħek jew importa direttament il-fajl GEDCOM standard tiegħek bi klikk waħda.",
          published: true,
        },
        {
          id: "tree-gedcom-formats",
          category: "trees",
          badge: "Standards Miftuħa",
          q: "Liema formati GEDCOM huma appoġġjati għall-importazzjoni u l-esportazzjoni?",
          a: "L-istandards internazzjonali kollha: GEDCOM 5.5.1, GEDCOM 7.0 u GEDCOM X (XML / JSON / .gedx) biex tiġi żgurata kompatibbiltà sħiħa ma' Gramps, Heredis jew Ancestry.",
          published: true,
        },
        {
          id: "priv-visibility",
          category: "privacy",
          q: "Min għandu aċċess għad-dejta tas-siġra tal-familja tiegħi?",
          a: "Int tagħżel il-viżibbiltà: Privat (aċċessibbli strettament għalik biss) jew Pubbliku (maqsum mal-komunità). Għall-persuni ħajjin, id-dettalji personali jinħbew b'mod awtomatiku.",
          published: true,
        },
        {
          id: "priv-gdpr",
          category: "privacy",
          badge: "INPDP & GDPR",
          q: "Kif inhuma protetti d-dejta personali u ġenealoġiċi tiegħi?",
          a: "Roots Tunisia tapplika standards stretti ta' sigurtà konformi mal-liġi Tuneżina Nru 2004-63 (INPDP) u mal-GDPR. Id-dejta tiegħek qatt ma tinbiegħ jew tiġi mgħoddija lil terzi.",
          published: true,
        },
        {
          id: "sup-contact",
          category: "support",
          q: "Kif nista' nikkuntattja lit-tim jekk ikolli mistoqsija jew problema?",
          a: "Permezz tat-tab «Kuntatt Dirett» hawn fuq, bl-email fuq contact@rootstunisia.com, jew direttament fuq WhatsApp.",
          published: true,
        },
      ],
      bottomCta: {
        eyebrow: "Ma sibtx it-tweġiba tiegħek?",
        title: "L-Arkivisti u l-Ġenealoġisti Tagħna Huma għas-Servizz Tiegħek",
        subtitle:
          "Kemm jekk għandek mistoqsija dwar l-abbonament tiegħek, manuskritt xi taqra jew proġett familjari, ikkuntattjana direttament.",
        whatsappLabel: "Iċċettja fuq WhatsApp",
        contactLabel: "Iktbilna",
      },
    },
    legal: {
      header: {
        eyebrow: "Konformità u Protezzjoni tad-Dejta",
        title: "Qafas Regolatorju u Etiku",
        description:
          "Roots Tunisia żżomm konformità stretta mal-liġi Tuneżina Nru 2004-63 (Awtorità Nazzjonali għall-Protezzjoni tad-Dejta Personali - INPDP) u l-istandards tal-GDPR. Ir-reġistri aċċessibbli jirrispettaw il-perjodu legali ta' 100 sena u d-dejta ta' persuni ħajjin tinħeba b'mod awtomatiku.",
      },
      cards: [
        {
          id: "legal-1",
          to: "/terms",
          title: "Termini Ġenerali tal-Użu",
          desc: "Regoli ta' aċċess għall-pjattaforma u kundizzjonijiet tal-użu tal-għodod ġenealoġiċi.",
          ctaLabel: "Aqra d-dokument",
          published: true,
        },
        {
          id: "legal-2",
          to: "/privacy",
          title: "Politika tal-Privatezza",
          desc: "Ipproċessar tad-dejta personali u konformità mal-INPDP (Liġi Nru 2004-63) u GDPR.",
          ctaLabel: "Aqra d-dokument",
          published: true,
        },
        {
          id: "legal-3",
          to: "/refund",
          title: "Servizzi u Politika ta' Rifużjoni",
          desc: "Qafas kuntrattwali tar-riċerki arkivistiċi, kwotazzjonijiet u garanziji ta' kunsinna.",
          ctaLabel: "Aqra d-dokument",
          published: true,
        },
        {
          id: "legal-4",
          to: "/cookies",
          title: "Ġestjoni tal-Cookies",
          desc: "Cookies tekniċi u kif il-kunsens tiegħek jiġi rreġistrat.",
          ctaLabel: "Aqra d-dokument",
          published: true,
        },
      ],
    },
  },
};

function cleanLocaleCode(locale = "fr"): string {
  return (locale || "fr").toLowerCase().split("-")[0];
}

export function getDefaultHelpCenterConfig(locale = "fr"): HelpCenterCmsConfig {
  const clean = cleanLocaleCode(locale);
  return LOCALE_DEFAULTS[clean] || DEFAULT_HELP_CENTER_CMS_CONFIG;
}

/** Contact card fields admins can intentionally clear; empty must not fall back to defaults. */
const CLEARABLE_STRING_KEYS = new Set([
  "phoneValue",
  "whatsappValue",
  "facebookUrl",
  "instagramUrl",
]);

function resolveLocalizedString(candidate: any, baseVal: string, frVal: string, cleanLocale: string): string {
  if (typeof candidate !== "string") return baseVal;
  const trimmed = candidate.trim();
  if (!trimmed) return baseVal;
  if (cleanLocale !== "fr" && trimmed === frVal.trim() && baseVal.trim() !== frVal.trim()) {
    return baseVal;
  }
  return candidate;
}

function resolveLocalizedObject<T extends Record<string, any>>(
  sourceObj: any,
  baseObj: T,
  frObj: T,
  cleanLocale: string
): T {
  const out: Record<string, any> = { ...baseObj };
  if (!sourceObj || typeof sourceObj !== "object") return out as T;
  for (const key of Object.keys(baseObj)) {
    const baseVal = baseObj[key];
    const frVal = frObj?.[key];
    if (typeof baseVal === "string") {
      if (CLEARABLE_STRING_KEYS.has(key) && typeof sourceObj[key] === "string") {
        // Preserve intentional clears from Contact CMS (do not resurrect defaults).
        out[key] = sourceObj[key];
      } else {
        out[key] = resolveLocalizedString(
          sourceObj[key],
          baseVal,
          typeof frVal === "string" ? frVal : "",
          cleanLocale
        );
      }
    } else if (sourceObj[key] !== undefined) {
      out[key] = sourceObj[key];
    }
  }
  return out as T;
}

function resolveLocalizedList<T extends Record<string, any>>(
  sourceList: any,
  baseList: T[],
  frList: T[],
  idKey: string,
  cleanLocale: string
): T[] {
  if (!Array.isArray(sourceList) || sourceList.length === 0) return baseList;
  const frById = new Map<string, T>(frList.map((item) => [String(item[idKey]), item]));
  const baseById = new Map<string, T>(baseList.map((item) => [String(item[idKey]), item]));
  return sourceList.map((item, idx) => {
    const keyVal = item && item[idKey] ? String(item[idKey]) : "";
    const baseItem = (keyVal ? baseById.get(keyVal) : undefined) || baseList[idx];
    const frItem = (keyVal ? frById.get(keyVal) : undefined) || frList[idx];
    if (!baseItem) return item;
    return resolveLocalizedObject(item, baseItem, frItem || baseItem, cleanLocale);
  });
}

function normalizeHelpCenterConfig(parsed: any, locale = "fr"): HelpCenterCmsConfig {
  const clean = cleanLocaleCode(locale);
  const base = getDefaultHelpCenterConfig(clean);
  const frBase = DEFAULT_HELP_CENTER_CMS_CONFIG;
  if (!parsed || typeof parsed !== "object") return base;

  // If the object is a multi-locale wrapper, extract only the target locale slice
  const source =
    parsed.locales && typeof parsed.locales === "object"
      ? parsed.locales[clean] || parsed.locales[locale] || null
      : clean === "fr" && (parsed.contact || parsed.about || parsed.faq || parsed.legal)
      ? parsed
      : null;

  if (!source || typeof source !== "object") return base;

  const rawQuestions = Array.isArray(source.faq?.questions)
    ? source.faq.questions.filter((q: any) => q?.id && !String(q.id).includes("diff"))
    : [];
  const localizedQuestions = resolveLocalizedList(
    rawQuestions,
    base.faq.questions,
    frBase.faq.questions,
    "id",
    clean
  );

  return {
    hero: resolveLocalizedObject(source.hero, base.hero, frBase.hero, clean),
    tabLabels: resolveLocalizedObject(source.tabLabels, base.tabLabels, frBase.tabLabels, clean),
    contact: {
      cards: resolveLocalizedObject(source.contact?.cards, base.contact.cards, frBase.contact.cards, clean),
      form: {
        ...resolveLocalizedObject(source.contact?.form, base.contact.form, frBase.contact.form, clean),
        topics: resolveLocalizedList(
          source.contact?.form?.topics,
          base.contact.form.topics,
          frBase.contact.form.topics,
          "key",
          clean
        ),
      },
      sidebar: resolveLocalizedObject(source.contact?.sidebar, base.contact.sidebar, frBase.contact.sidebar, clean),
    },
    about: {
      mission: resolveLocalizedObject(source.about?.mission, base.about.mission, frBase.about.mission, clean),
      corpusesHeader: resolveLocalizedObject(
        source.about?.corpusesHeader,
        base.about.corpusesHeader,
        frBase.about.corpusesHeader,
        clean
      ),
      corpuses: resolveLocalizedList(
        source.about?.corpuses,
        base.about.corpuses,
        frBase.about.corpuses,
        "id",
        clean
      ),
      whyUsHeader: resolveLocalizedObject(
        source.about?.whyUsHeader,
        base.about.whyUsHeader,
        frBase.about.whyUsHeader,
        clean
      ),
      whyUs: resolveLocalizedList(
        source.about?.whyUs,
        base.about.whyUs,
        frBase.about.whyUs,
        "id",
        clean
      ),
      explorations: resolveLocalizedList(
        source.about?.explorations,
        base.about.explorations,
        frBase.about.explorations,
        "id",
        clean
      ),
    },
    faq: {
      header: resolveLocalizedObject(source.faq?.header, base.faq.header, frBase.faq.header, clean),
      categories: resolveLocalizedList(
        source.faq?.categories,
        base.faq.categories,
        frBase.faq.categories,
        "id",
        clean
      ),
      questions: localizedQuestions,
      bottomCta: resolveLocalizedObject(source.faq?.bottomCta, base.faq.bottomCta, frBase.faq.bottomCta, clean),
    },
    legal: {
      header: resolveLocalizedObject(source.legal?.header, base.legal.header, frBase.legal.header, clean),
      cards: resolveLocalizedList(
        source.legal?.cards,
        base.legal.cards,
        frBase.legal.cards,
        "id",
        clean
      ),
    },
  };
}

function loadAllLocalesBundle(): Record<string, HelpCenterCmsConfig> {
  const out: Record<string, HelpCenterCmsConfig> = {};
  for (const loc of CMS_LOCALES) {
    out[loc.code] = getDefaultHelpCenterConfig(loc.code);
  }
  try {
    const rawMulti = localStorage.getItem(MULTI_LOCALE_STORAGE_KEY);
    if (rawMulti) {
      const parsed = JSON.parse(rawMulti);
      if (parsed && typeof parsed === "object") {
        const map = parsed.locales && typeof parsed.locales === "object" ? parsed.locales : parsed;
        for (const loc of CMS_LOCALES) {
          if (map[loc.code]) {
            out[loc.code] = normalizeHelpCenterConfig({ locales: { [loc.code]: map[loc.code] } }, loc.code);
          }
        }
        return out;
      }
    }
    const rawLegacy = localStorage.getItem(STORAGE_KEY);
    if (rawLegacy) {
      const parsedLegacy = JSON.parse(rawLegacy);
      if (parsedLegacy?.locales) {
        for (const loc of CMS_LOCALES) {
          if (parsedLegacy.locales[loc.code]) {
            out[loc.code] = normalizeHelpCenterConfig(
              { locales: { [loc.code]: parsedLegacy.locales[loc.code] } },
              loc.code
            );
          }
        }
      } else {
        out.fr = normalizeHelpCenterConfig(parsedLegacy, "fr");
      }
    }
  } catch {
    // ignore
  }
  return out;
}

export function loadHelpCenterCmsConfig(locale = "fr"): HelpCenterCmsConfig {
  const clean = cleanLocaleCode(locale);
  const bundle = loadAllLocalesBundle();
  return bundle[clean] || getDefaultHelpCenterConfig(clean);
}

export async function saveHelpCenterCmsConfig(
  config: HelpCenterCmsConfig,
  locale = "fr"
): Promise<void> {
  const cleanLoc = cleanLocaleCode(locale);
  const normalized = normalizeHelpCenterConfig({ locales: { [cleanLoc]: config } }, cleanLoc);
  const bundle = loadAllLocalesBundle();
  bundle[cleanLoc] = normalized;

  const payload = {
    ...bundle.fr,
    locales: bundle,
  };

  try {
    localStorage.setItem(MULTI_LOCALE_STORAGE_KEY, JSON.stringify(payload));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    window.dispatchEvent(
      new CustomEvent("roots_help_center_cms_updated", {
        detail: { locale: cleanLoc, config: normalized, locales: bundle },
      })
    );
  } catch {
    // ignore storage errors
  }

  try {
    await api.put("/admin/help-center/config", payload);
  } catch {
    // fallback if offline
  }
}

export function useHelpCenterCmsConfig(overrideLocale?: string) {
  const { locale: contextLocale } = useTranslation();
  const activeLocale = cleanLocaleCode(overrideLocale || contextLocale || "fr");

  const [config, setConfig] = useState<HelpCenterCmsConfig>(() =>
    loadHelpCenterCmsConfig(activeLocale)
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setConfig(loadHelpCenterCmsConfig(activeLocale));
  }, [activeLocale]);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/help-center/config");
      const raw = res.data?.data ?? res.data;
      if (raw && typeof raw === "object" && (raw.contact || raw.about || raw.faq || raw.legal || raw.locales)) {
        const bundle = loadAllLocalesBundle();
        if (raw.locales && typeof raw.locales === "object") {
          for (const loc of CMS_LOCALES) {
            if (raw.locales[loc.code]) {
              bundle[loc.code] = normalizeHelpCenterConfig(
                { locales: { [loc.code]: raw.locales[loc.code] } },
                loc.code
              );
            }
          }
        } else {
          bundle.fr = normalizeHelpCenterConfig(raw, "fr");
        }
        const payload = { ...bundle.fr, locales: bundle };
        try {
          localStorage.setItem(MULTI_LOCALE_STORAGE_KEY, JSON.stringify(payload));
          localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        } catch {}
        setConfig(bundle[activeLocale] || getDefaultHelpCenterConfig(activeLocale));
      }
    } catch {
      // keep localStorage or default
    } finally {
      setLoading(false);
    }
  }, [activeLocale]);

  useEffect(() => {
    void refresh();

    const handleStorage = (e: StorageEvent) => {
      if ((e.key === STORAGE_KEY || e.key === MULTI_LOCALE_STORAGE_KEY) && e.newValue) {
        setConfig(loadHelpCenterCmsConfig(activeLocale));
      }
    };

    const handleCustom = (e: Event) => {
      const detail = (e as CustomEvent<any>).detail;
      if (detail?.locales && detail.locales[activeLocale]) {
        setConfig(
          normalizeHelpCenterConfig(
            { locales: { [activeLocale]: detail.locales[activeLocale] } },
            activeLocale
          )
        );
      } else if (cleanLocaleCode(detail?.locale) === activeLocale && detail?.config) {
        setConfig(
          normalizeHelpCenterConfig(
            { locales: { [activeLocale]: detail.config } },
            activeLocale
          )
        );
      } else {
        setConfig(loadHelpCenterCmsConfig(activeLocale));
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("roots_help_center_cms_updated", handleCustom);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("roots_help_center_cms_updated", handleCustom);
    };
  }, [refresh, activeLocale]);

  return { config, setConfig, refresh, loading, activeLocale };
}
