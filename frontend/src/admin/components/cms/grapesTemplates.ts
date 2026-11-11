import { SITE_IMAGE_LIBRARY } from "../../../config/siteImageLibrary";

export interface GrapesSeedContext {
  pageId: string;
  pageTitle?: string;
  heroEyebrow?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: string;
  introTitle?: string;
  introBody?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
  contactHours?: string;
  footerTagline?: string;
  footerCopyright?: string;
  legalSections?: { heading: string; body: string }[];
}

export interface GrapesBlockDefinition {
  id: string;
  label: string;
  category: string;
  media?: string;
  content: string;
}

export const GRAPES_COMMON_CSS = `
.rt-section {
  font-family: 'Cormorant Garamond', Georgia, serif;
  padding: 56px 24px;
  background: #f8f5ef;
  color: #162235;
}
.rt-section-dark {
  background: linear-gradient(135deg, #0d1626 0%, #13253e 100%);
  color: #f8f5ef;
}
.rt-container {
  max-width: 1120px;
  margin: 0 auto;
}
.rt-hero-band {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  border: 1px solid rgba(212, 166, 80, 0.45);
  background: #0d1626;
  color: #ffffff;
  padding: 64px 32px;
  text-align: center;
}
.rt-hero-badge {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 999px;
  border: 1px solid rgba(212, 166, 80, 0.55);
  background: rgba(212, 166, 80, 0.14);
  color: #e8c77b;
  font-family: system-ui, -apple-system, sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}
.rt-hero-title {
  margin: 18px auto 12px;
  max-width: 820px;
  font-size: 38px;
  line-height: 1.15;
  font-weight: 700;
  color: #ffffff;
}
.rt-hero-subtitle {
  margin: 0 auto 26px;
  max-width: 680px;
  font-family: system-ui, -apple-system, sans-serif;
  font-size: 15px;
  line-height: 1.65;
  color: #e2e8f0;
}
.rt-hero-media {
  margin: 24px auto 0;
  max-width: 860px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(212, 166, 80, 0.35);
}
.rt-hero-media img {
  display: block;
  width: 100%;
  max-height: 360px;
  object-fit: cover;
}
.rt-btn-gold {
  display: inline-block;
  padding: 12px 24px;
  border-radius: 8px;
  background: linear-gradient(135deg, #c79a40 0%, #e1bd6a 100%);
  color: #18130a;
  font-family: system-ui, -apple-system, sans-serif;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-decoration: none;
}
.rt-btn-outline {
  display: inline-block;
  padding: 12px 24px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.45);
  color: #ffffff;
  font-family: system-ui, -apple-system, sans-serif;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-decoration: none;
}
.rt-grid-3 {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  margin-top: 24px;
}
.rt-grid-2 {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
  align-items: center;
}
.rt-card {
  border-radius: 14px;
  border: 1px solid rgba(212, 166, 80, 0.35);
  background: #ffffff;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
}
.rt-card-dark {
  background: #101b2e;
  color: #f8fafc;
}
.rt-card-img {
  width: 100%;
  height: 185px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 14px;
}
.rt-card-eyebrow {
  font-family: system-ui, -apple-system, sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #b4822c;
  margin: 0 0 8px;
}
.rt-card-title {
  margin: 0 0 10px;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.25;
}
.rt-card-text {
  font-family: system-ui, -apple-system, sans-serif;
  font-size: 14px;
  line-height: 1.65;
  color: #475569;
  margin: 0;
}
.rt-card-dark .rt-card-text {
  color: #cbd5e1;
}
@media (max-width: 768px) {
  .rt-grid-3, .rt-grid-2 {
    grid-template-columns: 1fr;
  }
  .rt-hero-title {
    font-size: 28px;
  }
}
`;

export const TUNISIAN_ASSET_ITEMS = [
  ...SITE_IMAGE_LIBRARY.map((item) => ({
    src: item.src,
    name: `${item.label}${item.region ? ` (${item.region})` : ""}`,
    type: "image",
  })),
  {
    src: "/assets/roots-tunisia-logo-dark.png",
    name: "Logo Roots Tunisia (Sombre)",
    type: "image",
  },
  {
    src: "/assets/roots-tunisia-logo-light.png",
    name: "Logo Roots Tunisia (Clair)",
    type: "image",
  },
];

export const ROOTS_TUNISIA_BLOCKS: GrapesBlockDefinition[] = [
  {
    id: "rt-hero-carthage",
    label: "Bannière Hero Tunisie",
    category: "Patrimoine Tunisien",
    content: `
      <section class="rt-section rt-section-dark">
        <div class="rt-container">
          <div class="rt-hero-band">
            <span class="rt-hero-badge">Patrimoine & Généalogie de Tunisie</span>
            <h2 class="rt-hero-title">Découvrez l'Histoire & les Lignées de Vos Ancêtres Tunisiens</h2>
            <p class="rt-hero-subtitle">Explorez les registres d'état civil, les actes charaïques (Sijillat) et la mémoire vivante des 24 gouvernorats de Tunisie.</p>
            <div>
              <a href="/gallery/trees" class="rt-btn-gold">Explorer les Arbres</a>
              <a href="/sources" class="rt-btn-outline" style="margin-left:10px;">Consulter les Sources</a>
            </div>
            <div class="rt-hero-media">
              <img src="/assets/01_Carthage_Ancient_Ruins_Landscape.jpg" alt="Carthage — Patrimoine Tunisien" />
            </div>
          </div>
        </div>
      </section>
    `,
  },
  {
    id: "rt-mission-two-col",
    label: "Section 2 Colonnes (Médina)",
    category: "Patrimoine Tunisien",
    content: `
      <section class="rt-section">
        <div class="rt-container rt-grid-2">
          <div>
            <p class="rt-card-eyebrow">Mémoire Documentaire</p>
            <h2 class="rt-card-title" style="font-size:32px;">Préserver chaque acte, transmettre chaque nom</h2>
            <p class="rt-card-text">De la Médina de Tunis aux oasis du Sud et aux îles de Djerba, chaque registre notarié et chaque récit familial reconstitue le tissu historique tunisien.</p>
            <div style="margin-top:20px;">
              <a href="/about" class="rt-btn-gold">Découvrir Notre Mission</a>
            </div>
          </div>
          <div>
            <img src="/assets/16_Medina_Ornate_Door_Blue_Grille.jpg" alt="Porte ornée de la Médina de Tunis" style="width:100%;height:300px;object-fit:cover;border-radius:14px;border:1px solid rgba(212,166,80,0.45);" />
          </div>
        </div>
      </section>
    `,
  },
  {
    id: "rt-three-eras",
    label: "Frise Chronologique (3 Époques)",
    category: "Patrimoine Tunisien",
    content: `
      <section class="rt-section">
        <div class="rt-container">
          <div style="text-align:center;max-width:680px;margin:0 auto 24px;">
            <p class="rt-card-eyebrow">Chronologie Tunisienne</p>
            <h2 class="rt-card-title" style="font-size:30px;">Trois Grandes Périodes Archivistiques</h2>
          </div>
          <div class="rt-grid-3">
            <article class="rt-card">
              <img class="rt-card-img" src="/assets/slider-carthage.jpg" alt="Carthage Antique" />
              <p class="rt-card-eyebrow">814 av. J.-C. – 439</p>
              <h3 class="rt-card-title">Carthage & Afrique Romaine</h3>
              <p class="rt-card-text">Stèles puniques, épigraphie latine et cités maritimes fondatrices du littoral tunisien.</p>
            </article>
            <article class="rt-card">
              <img class="rt-card-img" src="/assets/slider-kairouan.jpg" alt="Grande Mosquée de Kairouan" />
              <p class="rt-card-eyebrow">670 – 1574</p>
              <h3 class="rt-card-title">Kairouan & Période Hafside</h3>
              <p class="rt-card-text">Manuscrits de la Grande Mosquée, traités de nasab, waqfs et érudits andalous de la Zitouna.</p>
            </article>
            <article class="rt-card">
              <img class="rt-card-img" src="/assets/family-archive.jpg" alt="Archives Sijillat de Tunisie" />
              <p class="rt-card-eyebrow">1574 – 1956</p>
              <h3 class="rt-card-title">Sijillat Ottomans & État Civil</h3>
              <p class="rt-card-text">Registres des tribunaux charaïques, actes de habous, archives municipales et actes d'état civil.</p>
            </article>
          </div>
        </div>
      </section>
    `,
  },
  {
    id: "rt-tunisian-gallery-strip",
    label: "Galerie Tunisie (3 Photos)",
    category: "Galeries & Médias",
    content: `
      <section class="rt-section rt-section-dark">
        <div class="rt-container">
          <p class="rt-card-eyebrow" style="color:#e8c77b;">Galerie Historique</p>
          <h2 class="rt-card-title" style="color:#ffffff;font-size:28px;">Tunisie en Images d'Archives</h2>
          <div class="rt-grid-3">
            <div class="rt-card rt-card-dark">
              <img class="rt-card-img" src="/assets/11_Sidi_Bou_Said_Blue_Doors_Bougainvillea.jpg" alt="Sidi Bou Saïd" />
              <h3 class="rt-card-title" style="font-size:18px;">Sidi Bou Saïd</h3>
              <p class="rt-card-text">Architecture andalouse surplombant le golfe de Tunis et Carthage.</p>
            </div>
            <div class="rt-card rt-card-dark">
              <img class="rt-card-img" src="/assets/04_El_Jem_Amphitheater_Panorama.jpg" alt="Amphithéâtre d'El Jem" />
              <h3 class="rt-card-title" style="font-size:18px;">El Jem (Thysdrus)</h3>
              <p class="rt-card-text">Le grand amphithéâtre antique au cœur du Sahel tunisien.</p>
            </div>
            <div class="rt-card rt-card-dark">
              <img class="rt-card-img" src="/assets/djerba.jpg" alt="Djerba — Menzel et palmiers" />
              <h3 class="rt-card-title" style="font-size:18px;">Île de Djerba</h3>
              <p class="rt-card-text">Menzels traditionnels, mémoire orale et archives insulaires.</p>
            </div>
          </div>
        </div>
      </section>
    `,
  },
  {
    id: "rt-archive-notice",
    label: "Fiche d'Archive / Sijill",
    category: "Archives & Sources",
    content: `
      <section class="rt-section">
        <div class="rt-container">
          <article class="rt-card rt-grid-2">
            <img src="/assets/family-archive.jpg" alt="Registre Sijill Tunisien" style="width:100%;height:240px;object-fit:cover;border-radius:10px;" />
            <div>
              <p class="rt-card-eyebrow">Fonds Officiel — Archives Nationales</p>
              <h3 class="rt-card-title">Consultation des Registres Charaïques & Notariés</h3>
              <p class="rt-card-text">Chaque cote documentaire comprend le nom du cadi, l'année hégirienne/grégorienne, le gouvernorat et la référence d'inventaire aux Archives Nationales (Dar El Bey, Tunis).</p>
              <div style="margin-top:16px;">
                <a href="/archives" class="rt-btn-gold">Ouvrir le Répertoire</a>
              </div>
            </div>
          </article>
        </div>
      </section>
    `,
  },
  {
    id: "rt-legal-clause-box",
    label: "Encadré Clause Juridique",
    category: "Juridique & Avis",
    content: `
      <section class="rt-section">
        <div class="rt-container">
          <div class="rt-card">
            <p class="rt-card-eyebrow">Mention Légale & Conformité</p>
            <h3 class="rt-card-title">Protection des Données Généalogiques & Personnes Vivantes</h3>
            <p class="rt-card-text">Conformément aux standards tunisiens et internationaux de protection des données personnelles, les informations relatives aux personnes vivantes ne sont jamais indexées publiquement sans le consentement explicite du gestionnaire d'arbre.</p>
          </div>
        </div>
      </section>
    `,
  },
  {
    id: "rt-contact-banner",
    label: "Bannière Contact Tunisie",
    category: "Contact & Pied de Page",
    content: `
      <section class="rt-section rt-section-dark">
        <div class="rt-container rt-grid-2">
          <div>
            <p class="rt-card-eyebrow" style="color:#e8c77b;">Secrétariat & Recherches — Tunis</p>
            <h3 class="rt-card-title" style="color:#ffffff;font-size:28px;">Besoin d'aide pour localiser un acte en Tunisie ?</h3>
            <p class="rt-card-text">Notre équipe basée à Tunis accompagne les chercheurs et familles de la diaspora pour consulter l'état civil, les habous et les archives régionales.</p>
          </div>
          <div class="rt-card rt-card-dark">
            <p class="rt-card-eyebrow" style="color:#e8c77b;">Coordonnées Officielles</p>
            <p class="rt-card-text" style="margin-bottom:8px;"><strong>Adresse :</strong> Tunis, Tunisie</p>
            <p class="rt-card-text" style="margin-bottom:8px;"><strong>E-mail :</strong> contact@rootstunisia.com</p>
            <p class="rt-card-text" style="margin-bottom:16px;"><strong>Téléphone :</strong> +216 71 000 000</p>
            <a href="/contact" class="rt-btn-gold">Écrire au Secrétariat</a>
          </div>
        </div>
      </section>
    `,
  },
  {
    id: "rt-cta-band",
    label: "Appel à l'Action (Bouton Or)",
    category: "Appels à l'Action",
    content: `
      <section class="rt-section">
        <div class="rt-container" style="text-align:center;">
          <div class="rt-card">
            <p class="rt-card-eyebrow">Votre Arbre Généalogique</p>
            <h2 class="rt-card-title">Commencez à documenter votre lignée tunisienne</h2>
            <p class="rt-card-text" style="max-width:620px;margin:0 auto 20px;">Importez un fichier GEDCOM ou créez votre arbre familial avec sources historiques vérifiées.</p>
            <a href="/tree" class="rt-btn-gold">Ouvrir le Constructeur d'Arbre</a>
          </div>
        </div>
      </section>
    `,
  },
];

function escapeHtml(text: string): string {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Generates an editable starter layout tailored to each of the 13 Roots Tunisia CMS pages
 * using that page's live titles/images and 100% authentic Tunisian assets.
 */
export function buildStarterTemplateForPage(ctx: GrapesSeedContext): {
  html: string;
  css: string;
} {
  const heroImg =
    ctx.heroImage && (ctx.heroImage.startsWith("/") || ctx.heroImage.startsWith("http"))
      ? ctx.heroImage
      : "/assets/slider-carthage.jpg";
  const safeEyebrow = escapeHtml(ctx.heroEyebrow || "Patrimoine & Généalogie de Tunisie");
  const safeTitle = escapeHtml(
    ctx.heroTitle || ctx.pageTitle || "Roots Tunisia — Mémoire & Lignées",
  );
  const safeSubtitle = escapeHtml(
    ctx.heroSubtitle ||
      "Plateforme officielle de préservation des archives familiales, manuscrits et arbres généalogiques de Tunisie.",
  );

  if (ctx.pageId === "footer") {
    return {
      css: GRAPES_COMMON_CSS,
      html: `
        <section class="rt-section rt-section-dark" style="padding:36px 24px;">
          <div class="rt-container rt-grid-2">
            <div>
              <img src="/assets/roots-tunisia-logo-dark.png" alt="Roots Tunisia" style="height:46px;width:auto;margin-bottom:12px;" />
              <p class="rt-card-text" style="max-width:440px;">${escapeHtml(
                ctx.footerTagline ||
                  "Archive tunisienne indépendante dédiée à la préservation de l'histoire familiale et documentaire des 24 gouvernorats.",
              )}</p>
            </div>
            <div class="rt-card rt-card-dark" style="padding:20px;">
              <p class="rt-card-eyebrow" style="color:#e8c77b;">Secrétariat Officiel — Tunisie</p>
              <p class="rt-card-text">📍 ${escapeHtml(ctx.contactAddress || "Tunis, Tunisie")}</p>
              <p class="rt-card-text">✉️ ${escapeHtml(ctx.contactEmail || "contact@rootstunisia.com")}</p>
              <p class="rt-card-text">📞 ${escapeHtml(ctx.contactPhone || "+216 71 000 000")}</p>
            </div>
          </div>
        </section>
      `,
    };
  }

  if (["terms", "privacy", "cookies", "refund"].includes(ctx.pageId)) {
    const clausesHtml =
      ctx.legalSections && ctx.legalSections.length > 0
        ? ctx.legalSections
            .slice(0, 4)
            .map(
              (sec) => `
              <article class="rt-card" style="margin-bottom:16px;">
                <h3 class="rt-card-title" style="font-size:20px;">${escapeHtml(sec.heading)}</h3>
                <p class="rt-card-text">${escapeHtml(sec.body)}</p>
              </article>
            `,
            )
            .join("")
        : `
          <article class="rt-card">
            <h3 class="rt-card-title" style="font-size:20px;">Engagements & Transparence</h3>
            <p class="rt-card-text">${safeSubtitle}</p>
          </article>
        `;
    return {
      css: GRAPES_COMMON_CSS,
      html: `
        <section class="rt-section">
          <div class="rt-container">
            <div class="rt-card" style="border-width:2px;">
              <p class="rt-card-eyebrow">${safeEyebrow}</p>
              <h2 class="rt-card-title" style="font-size:30px;">${safeTitle}</h2>
              <p class="rt-card-text" style="margin-bottom:20px;">${escapeHtml(
                ctx.introBody || "Document officiel encadrant l'accès aux archives et la protection des données familiales sur Roots Tunisia.",
              )}</p>
              ${clausesHtml}
            </div>
          </div>
        </section>
      `,
    };
  }

  if (ctx.pageId === "contact") {
    return {
      css: GRAPES_COMMON_CSS,
      html: `
        <section class="rt-section rt-section-dark">
          <div class="rt-container rt-grid-2">
            <div>
              <span class="rt-hero-badge">${safeEyebrow}</span>
              <h2 class="rt-hero-title" style="text-align:left;margin-left:0;">${safeTitle}</h2>
              <p class="rt-hero-subtitle" style="text-align:left;margin-left:0;">${safeSubtitle}</p>
              <a href="/archives" class="rt-btn-gold">Explorer les Archives</a>
            </div>
            <div class="rt-card rt-card-dark">
              <img class="rt-card-img" src="${escapeHtml(heroImg)}" alt="${safeTitle}" />
              <p class="rt-card-eyebrow" style="color:#e8c77b;">Bureaux — Tunis, Tunisie</p>
              <p class="rt-card-text"><strong>Adresse :</strong> ${escapeHtml(ctx.contactAddress || "Tunis, Tunisie")}</p>
              <p class="rt-card-text"><strong>E-mail :</strong> ${escapeHtml(ctx.contactEmail || "contact@rootstunisia.com")}</p>
              <p class="rt-card-text"><strong>Téléphone :</strong> ${escapeHtml(ctx.contactPhone || "+216 71 000 000")}</p>
              <p class="rt-card-text"><strong>Horaires :</strong> ${escapeHtml(ctx.contactHours || "09:00 – 17:00 (GMT+1)")}</p>
            </div>
          </div>
        </section>
      `,
    };
  }

  const fallbackSecondaryImg =
    ctx.pageId === "archives" || ctx.pageId === "sources"
      ? "/assets/family-archive.jpg"
      : ctx.pageId === "periods"
        ? "/assets/eljem.jpg"
        : ctx.pageId === "audio"
          ? "/assets/djerba.jpg"
          : ctx.pageId === "gallery" || ctx.pageId === "documents"
            ? "/assets/medina-tunis.jpg"
            : "/assets/11_Sidi_Bou_Said_Blue_Doors_Bougainvillea.jpg";

  return {
    css: GRAPES_COMMON_CSS,
    html: `
      <section class="rt-section rt-section-dark">
        <div class="rt-container">
          <div class="rt-hero-band">
            <span class="rt-hero-badge">${safeEyebrow}</span>
            <h2 class="rt-hero-title">${safeTitle}</h2>
            <p class="rt-hero-subtitle">${safeSubtitle}</p>
            <div class="rt-hero-media">
              <img src="${escapeHtml(heroImg)}" alt="${safeTitle}" />
            </div>
          </div>
        </div>
      </section>
      <section class="rt-section">
        <div class="rt-container rt-grid-2">
          <div>
            <p class="rt-card-eyebrow">Section Éditoriale</p>
            <h3 class="rt-card-title">${escapeHtml(
              ctx.introTitle || "Mémoire & Patrimoine Documentaire Tunisien",
            )}</h3>
            <p class="rt-card-text">${escapeHtml(
              ctx.introBody ||
                "Personnalisez librement ce bloc visuel dans GrapesJS : modifiez les textes par double-clic, glissez de nouveaux blocs tunisiens ou remplacez les photographies.",
            )}</p>
          </div>
          <div>
            <img src="${fallbackSecondaryImg}" alt="Patrimoine Tunisien" style="width:100%;height:260px;object-fit:cover;border-radius:14px;border:1px solid rgba(212,166,80,0.45);" />
          </div>
        </div>
      </section>
    `,
  };
}

