/**
 * Curated Tunisia site-image library (heritage stills from /assets).
 * Used by Super Admin Site Image Placeholders dropdown and public fallbacks.
 */

export type SiteLibraryImage = {
  id: string;
  src: string;
  label: string;
  region?: string;
};

export const SITE_IMAGE_LIBRARY: SiteLibraryImage[] = [
  {
    id: "carthage-ruins",
    src: "/assets/01_Carthage_Ancient_Ruins_Landscape.jpg",
    label: "Carthage ancient ruins",
    region: "Carthage",
  },
  {
    id: "carthage-slider",
    src: "/assets/slider-carthage.jpg",
    label: "Carthage Byrsa & Roman forum",
    region: "Carthage",
  },
  {
    id: "eljem-panorama",
    src: "/assets/04_El_Jem_Amphitheater_Panorama.jpg",
    label: "El Jem amphitheatre panorama",
    region: "Mahdia / Sahel",
  },
  {
    id: "eljem",
    src: "/assets/eljem.jpg",
    label: "Amphitheatre of Thysdrus",
    region: "El Jem",
  },
  {
    id: "kairouan-slider",
    src: "/assets/slider-kairouan.jpg",
    label: "Great Mosque of Kairouan",
    region: "Kairouan",
  },
  {
    id: "kairouan-dome",
    src: "/assets/14_Kairouan_Mosque_Arched_Doorways_Dome.jpg",
    label: "Kairouan mosque arcades & dome",
    region: "Kairouan",
  },
  {
    id: "medina-door",
    src: "/assets/16_Medina_Ornate_Door_Blue_Grille.jpg",
    label: "Medina ornate studded door",
    region: "Tunis Medina",
  },
  {
    id: "medina-tunis",
    src: "/assets/medina-tunis.jpg",
    label: "Medina of Tunis streetscape",
    region: "Tunis",
  },
  {
    id: "sidi-bou-said",
    src: "/assets/11_Sidi_Bou_Said_Blue_Doors_Bougainvillea.jpg",
    label: "Sidi Bou Saïd blue doors",
    region: "Cap Carthage",
  },
  {
    id: "sidibousaid-slider",
    src: "/assets/slider-sidibousaid.jpg",
    label: "Sidi Bou Saïd coastal village",
    region: "Sidi Bou Saïd",
  },
  {
    id: "djerba",
    src: "/assets/djerba.jpg",
    label: "Djerba menzel & palms",
    region: "Djerba",
  },
  {
    id: "fortress-palms",
    src: "/assets/17_Fortress_Aerial_Courtyard_Palms.jpg",
    label: "Coastal kasbah courtyard & palms",
    region: "Tunisia",
  },
  {
    id: "family-archive",
    src: "/assets/family-archive.jpg",
    label: "Notarial manuscript & sijill",
    region: "Archives",
  },
];

export const DEFAULT_SITE_HERO = SITE_IMAGE_LIBRARY[0].src;

export type SiteImagePlaceholder = {
  pageId: string;
  pageLabel: string;
  pagePath: string;
  sectionId: string;
  sectionLabel: string;
  fieldKey: string;
  fieldLabel: string;
  hint?: string;
};

export const SITE_IMAGE_PLACEHOLDERS: SiteImagePlaceholder[] = [
  {
    pageId: "home",
    pageLabel: "Home",
    pagePath: "/",
    sectionId: "hero",
    sectionLabel: "Hero banner",
    fieldKey: "image",
    fieldLabel: "Hero image",
  },
  {
    pageId: "home",
    pageLabel: "Home",
    pagePath: "/",
    sectionId: "preserve",
    sectionLabel: "Mission banner",
    fieldKey: "image",
    fieldLabel: "Background image",
  },
  {
    pageId: "home",
    pageLabel: "Home",
    pagePath: "/",
    sectionId: "gallery",
    sectionLabel: "Home photo strip",
    fieldKey: "image_1",
    fieldLabel: "Photo 1",
  },
  {
    pageId: "home",
    pageLabel: "Home",
    pagePath: "/",
    sectionId: "gallery",
    sectionLabel: "Home photo strip",
    fieldKey: "image_2",
    fieldLabel: "Photo 2",
  },
  {
    pageId: "home",
    pageLabel: "Home",
    pagePath: "/",
    sectionId: "gallery",
    sectionLabel: "Home photo strip",
    fieldKey: "image_3",
    fieldLabel: "Photo 3",
  },
  {
    pageId: "home",
    pageLabel: "Home",
    pagePath: "/",
    sectionId: "gallery",
    sectionLabel: "Home photo strip",
    fieldKey: "image_4",
    fieldLabel: "Photo 4",
  },
  {
    pageId: "home",
    pageLabel: "Home",
    pagePath: "/",
    sectionId: "gallery",
    sectionLabel: "Home photo strip",
    fieldKey: "image_5",
    fieldLabel: "Photo 5",
  },
  {
    pageId: "home",
    pageLabel: "Home",
    pagePath: "/",
    sectionId: "gallery",
    sectionLabel: "Home photo strip",
    fieldKey: "image_6",
    fieldLabel: "Photo 6",
  },
  {
    pageId: "about",
    pageLabel: "About",
    pagePath: "/about",
    sectionId: "hero",
    sectionLabel: "Hero banner",
    fieldKey: "image",
    fieldLabel: "Hero image",
  },
  {
    pageId: "contact",
    pageLabel: "Contact",
    pagePath: "/contact",
    sectionId: "hero",
    sectionLabel: "Hero banner",
    fieldKey: "image",
    fieldLabel: "Hero image",
  },
  {
    pageId: "gallery",
    pageLabel: "Gallery hub",
    pagePath: "/gallery",
    sectionId: "hero",
    sectionLabel: "Hero banner",
    fieldKey: "image",
    fieldLabel: "Hero image",
  },
  {
    pageId: "gallery_images",
    pageLabel: "Photo archives",
    pagePath: "/gallery/images",
    sectionId: "hero",
    sectionLabel: "Hero banner",
    fieldKey: "image",
    fieldLabel: "Hero image",
  },
  {
    pageId: "gallery_trees",
    pageLabel: "Family trees gallery",
    pagePath: "/gallery/trees",
    sectionId: "hero",
    sectionLabel: "Hero banner",
    fieldKey: "image",
    fieldLabel: "Hero image",
  },
  {
    pageId: "gallery_articles",
    pageLabel: "Articles gallery",
    pagePath: "/gallery/articles",
    sectionId: "hero",
    sectionLabel: "Hero banner",
    fieldKey: "image",
    fieldLabel: "Hero image",
  },
  {
    pageId: "gallery_documents",
    pageLabel: "Documents gallery",
    pagePath: "/gallery/documents",
    sectionId: "hero",
    sectionLabel: "Hero banner",
    fieldKey: "image",
    fieldLabel: "Hero image",
  },
  {
    pageId: "library",
    pageLabel: "Library",
    pagePath: "/library",
    sectionId: "hero",
    sectionLabel: "Hero banner",
    fieldKey: "image",
    fieldLabel: "Hero image",
  },
  {
    pageId: "audio",
    pageLabel: "Audio / oral history",
    pagePath: "/audio",
    sectionId: "hero",
    sectionLabel: "Hero banner",
    fieldKey: "image",
    fieldLabel: "Hero image",
  },
  {
    pageId: "research",
    pageLabel: "Sources & archives",
    pagePath: "/sources",
    sectionId: "hero",
    sectionLabel: "Hero banner",
    fieldKey: "image",
    fieldLabel: "Hero image",
  },
  {
    pageId: "periods",
    pageLabel: "Historical periods",
    pagePath: "/periods",
    sectionId: "hero",
    sectionLabel: "Hero banner",
    fieldKey: "image",
    fieldLabel: "Hero image",
  },
  {
    pageId: "subscriptions",
    pageLabel: "Subscriptions",
    pagePath: "/subscriptions",
    sectionId: "hero",
    sectionLabel: "Hero banner",
    fieldKey: "image",
    fieldLabel: "Hero image",
  },
  {
    pageId: "refund",
    pageLabel: "Refund policy",
    pagePath: "/refund",
    sectionId: "hero",
    sectionLabel: "Hero banner",
    fieldKey: "image",
    fieldLabel: "Hero image",
  },
  {
    pageId: "privacy",
    pageLabel: "Privacy",
    pagePath: "/privacy",
    sectionId: "hero",
    sectionLabel: "Hero banner",
    fieldKey: "image",
    fieldLabel: "Hero image",
  },
  {
    pageId: "terms",
    pageLabel: "Terms",
    pagePath: "/terms",
    sectionId: "hero",
    sectionLabel: "Hero banner",
    fieldKey: "image",
    fieldLabel: "Hero image",
  },
  {
    pageId: "cookies",
    pageLabel: "Cookies",
    pagePath: "/cookies",
    sectionId: "hero",
    sectionLabel: "Hero banner",
    fieldKey: "image",
    fieldLabel: "Hero image",
  },
];
