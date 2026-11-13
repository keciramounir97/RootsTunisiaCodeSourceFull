import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  History,
  FolderArchive,
  ShieldCheck,
  GitBranch,
  Camera,
  BookOpen,
  Sparkles,
  HelpCircle,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
  CheckCircle2,
  FileText,
  Headphones,
  Scroll,
  Users,
  Clock,
  Calendar,
  Heart,
  MessageSquare,
  ZoomIn,
  Layers,
  X,
  Play,
  Pause,
} from "lucide-react";
import eljem from "../assets/eljem.jpg";
import djerba from "../assets/djerba.jpg";
import carthageRuins from "../assets/01_Carthage_Ancient_Ruins_Landscape.jpg";
import elJemPanorama from "../assets/04_El_Jem_Amphitheater_Panorama.jpg";
import sidiBouSaidDoors from "../assets/11_Sidi_Bou_Said_Blue_Doors_Bougainvillea.jpg";
import kairouanMosque from "../assets/14_Kairouan_Mosque_Arched_Doorways_Dome.jpg";
import medinaDoor from "../assets/16_Medina_Ornate_Door_Blue_Grille.jpg";
import fortressPalms from "../assets/17_Fortress_Aerial_Courtyard_Palms.jpg";
import sidiBouSaid from "../assets/slider-sidibousaid.jpg";
import kairouan from "../assets/slider-kairouan.jpg";
import medina from "../assets/medina-tunis.jpg";
import { Section, SectionHeading } from "../components/site/Primitives";
import TunisiaGovernoratesMap from "../components/TunisiaGovernoratesMap";
import PeriodsInfiniteMarquee from "../components/PeriodsInfiniteMarquee";
import SourcesInfiniteMarquee from "../components/SourcesInfiniteMarquee";
import SEO from "../components/SEO";
import { useTranslation } from "../context/TranslationContext";
import { api } from "../api/client";
import { useSiteContent } from "../hooks/useSiteContent";
import SiteCustomBlocks from "../components/cms/SiteCustomBlocks";
import { getApiRoot } from "../api/helpers";
import { getTreeMetrics } from "../utils/treeMetrics";
import FamilyCardModal from "../components/FamilyCardModal";
import ArticleModal from "../components/ArticleModal";
import ResilientMediaImage from "../components/ResilientMediaImage";
import { useAuth } from "../admin/components/AuthContext";
import {
  extractArticleList,
  normalizeArticle,
  type NormalizedArticle,
} from "../utils/articleNormalize";
import { REAL_AUTHENTIC_ARTICLES } from "../data/realArticles";
import {
  getSocialLikes,
  toggleSocialLike,
  resolveAnyMediaUrl,
  resolveGalleryItemUrl,
  getTrackedUploads,
  fetchBatchSocialCounts,
} from "../utils/gallerySocial";

function resolveBannerUrl(pathOrUrl?: string | null) {
  const raw = String(pathOrUrl || "").trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw) || raw.startsWith("data:")) return raw;
  const root = String(getApiRoot() || "").replace(/\/+$/, "");
  if (raw.startsWith("/")) return `${root}${raw}`;
  return `${root}/${raw}`;
}

const slides = [
  { image: medinaDoor, labelKey: "hero_slide_medina" },
  { image: sidiBouSaidDoors, labelKey: "hero_slide_sidi" },
  { image: kairouanMosque, labelKey: "hero_slide_kairouan" },
  { image: fortressPalms, labelKey: "hero_slide_fortress" },
  { image: elJemPanorama, labelKey: "hero_slide_eljem" },
  { image: carthageRuins, labelKey: "hero_slide_carthage" },
];

const stats = [
  { valueKey: "stat_val_years", labelKey: "stat_years_history", to: "/periods" },
  { valueKey: "stat_val_governorates", labelKey: "stat_governorates", to: "/interactive-map" },
  { valueKey: "stat_val_records", labelKey: "stat_records", to: "/gallery/trees" },
  { valueKey: "stat_val_sources", labelKey: "stat_sources", to: "/sources" },
];

// Fallback real trees matching backend data
const fallbackRealTrees: any[] = [
  {
    id: 145,
    title: "Famille Brakha : D'El Kef à Tunis",
    name: "Les Brakha : Victor Samuel Brakha, cordonnier, et Marie Sabban, d’El Kef à Tunis (1889–1927)",
    description: "Victor Samuel Brakha, cordonnier d’El Kef installé à Tunis, et Marie Sabban : itinéraire d’un couple et d’une fratrie (1889–1927)",
    governorate: "El Kef & Tunis",
    people_count: 7,
    generations: 4,
    people: [
      { id: "p1", name: "Victor Samuel Brakha", birthDate: "1889", birthPlace: "El Kef", occupation: "Cordonnier" },
      { id: "p2", name: "Marie Sabban", birthDate: "1893", birthPlace: "Tunis" },
      { id: "p3", name: "Albert Brakha", birthDate: "1915", birthPlace: "Tunis" },
      { id: "p4", name: "Gaston Brakha", birthDate: "1918", birthPlace: "Tunis" },
      { id: "p5", name: "Fortunée Brakha", birthDate: "1921", birthPlace: "Tunis" },
      { id: "p6", name: "Samuel Brakha", birthDate: "1862", birthPlace: "El Kef" },
      { id: "p7", name: "Rachel Sitruk", birthDate: "1866", birthPlace: "El Kef" },
    ],
    likes: 0,
    isLiked: false,
    commentsCount: 0,
  },
  {
    id: 144,
    title: "Famille Cassar : Djerba & La Goulette",
    name: "Xavier Cassar, dit Sauveur, pêcheur, et Richarde Gaffiero : un couple de Houmt Souk à Tunis (1890–1927)",
    description: "Un foyer de pêcheurs entre Djerba et Tunis : Xavier et Richarde Cassar-Gaffiero, et la naturalisation de 1927",
    governorate: "Djerba & La Goulette",
    people_count: 2,
    generations: 2,
    people: [
      { id: "p1", name: "Xavier Cassar", birthDate: "1890", birthPlace: "Houmt Souk, Djerba", occupation: "Marin-pêcheur" },
      { id: "p2", name: "Richarde Gaffiero", birthDate: "1894", birthPlace: "La Goulette, Tunis" },
    ],
    likes: 0,
    isLiked: false,
    commentsCount: 0,
  },
  {
    id: 136,
    title: "Les Buonaventura-Guagliardo : de Palma à Radès (1884–1924)",
    name: "Les Buonaventura-Guagliardo : une famille méditerranéenne de Palma à Radès (1884–1924)",
    description: "Itinéraire d'un employé municipal et de sa famille entre Palma de Majorque, La Goulette et la commune de Radès.",
    governorate: "Ben Arous / Radès",
    people_count: 6,
    generations: 3,
    people: [
      { id: "p1", name: "Nicolas Jean Buonaventura", birthDate: "1884", birthPlace: "Palma", occupation: "Employé municipal" },
      { id: "p2", name: "Marie Guagliardo", birthDate: "1888", birthPlace: "Tunis" },
    ],
    likes: 0,
    isLiked: false,
    commentsCount: 0,
  },
  {
    id: 133,
    title: "Les Castellano-Monaco : de Skikda à Tunis (1894–1925)",
    name: "Les Castellano-Monaco : une famille italienne de Skikda à Tunis (1894–1925) — itinéraire d’un boulanger",
    description: "De l'artisanat boulanger à Skikda vers l'établissement durable dans la Médina et les faubourgs de Tunis.",
    governorate: "Tunis",
    people_count: 5,
    generations: 3,
    people: [
      { id: "p1", name: "Rosaire Castellano", birthDate: "1894", birthPlace: "Skikda", occupation: "Maître boulanger" },
    ],
    likes: 0,
    isLiked: false,
    commentsCount: 0,
  },
  {
    id: 129,
    title: "La Lignée Cantini : de Livourne à Tunis (1878–1913)",
    name: "La Lignée Cantini : De l'Ancrage Toscan de Livourne au Réseau de Transport Tunisois (1878-1913)",
    description: "Lignée familiale originaire de Toscane établie à Tunis dans l'administration et les réseaux ferroviaires et urbains.",
    governorate: "Tunis",
    people_count: 6,
    generations: 3,
    people: [
      { id: "p1", name: "Hamlet Humbert Cantini", birthDate: "1878", birthPlace: "Livourne" },
    ],
    likes: 0,
    isLiked: false,
    commentsCount: 0,
  },
  {
    id: 32,
    title: "Lignée Notariée Ali Ben Salah",
    name: "Lignée Notariée Ali Ben Salah (Kairouan & Charaâ)",
    description: "Généalogie continue documentée à partir des actes notariés d'udul, registres du Charaâ et rôles fiscaux de la Majba de Kairouan.",
    governorate: "Kairouan",
    people_count: 3,
    generations: 3,
    people: [
      { id: "p1", name: "Ali Ben Salah", birthDate: "1838", birthPlace: "Kairouan", occupation: "Adoul notaire" },
      { id: "p2", name: "Salah Ben Mohamed", birthDate: "1812", birthPlace: "Kairouan" },
      { id: "p3", name: "Mohamed Ben Salah", birthDate: "1868", birthPlace: "Kairouan" },
    ],
    likes: 0,
    isLiked: false,
    commentsCount: 0,
  },
];

// Fallback curated gallery images matching GalleryImages.tsx (all 6 curated items)
const fallbackCuratedImages = [
  {
    id: "img-tn-1",
    title: "Portes Cloutées de la Médina",
    category: "Landmarks & Architecture",
    governorate: "Tunis",
    yearStr: "c. 1910",
    imageUrl: medina,
    description: "Ruelles voûtées, heurtoirs en bronze sculpté et moucharabiehs historiques de la Médina de Tunis.",
    likes: 0,
    isLiked: false,
  },
  {
    id: "img-tn-2",
    title: "Village de Sidi Bou Saïd",
    category: "Landmarks & Architecture",
    governorate: "Tunis / Sidi Bou Saïd",
    yearStr: "c. 1925",
    imageUrl: sidiBouSaid,
    description: "Ruelles pavées, fenêtres bleues traditionnelles et bougainvilliers dominant le golfe de Tunis.",
    likes: 0,
    isLiked: false,
  },
  {
    id: "img-tn-3",
    title: "Grande Mosquée de Kairouan",
    category: "Historic Landmarks",
    governorate: "Kairouan",
    yearStr: "c. 1900",
    imageUrl: kairouan,
    description: "Sanctuaire spirituel d'Ifriqiya fondé en 670, conservant les registres de waqf et manuscrits notariés.",
    likes: 0,
    isLiked: false,
  },
  {
    id: "img-tn-4",
    title: "Amphithéâtre Romain de Thysdrus",
    category: "Ancient Heritage",
    governorate: "Mahdia / El Jem",
    yearStr: "c. 1915",
    imageUrl: eljem,
    description: "Arches monumentales du colisée romain d'Afrique proconsulaire et inscriptions épigraphiques séculaires.",
    likes: 0,
    isLiked: false,
  },
  {
    id: "img-tn-5",
    title: "Menzels & Coupoles Traditionnelles de Djerba",
    category: "Regional Heritage",
    governorate: "Médenine / Djerba",
    yearStr: "c. 1930",
    imageUrl: djerba,
    description: "Architecture insulaire blanchie à la chaux des menzels de Djerba et mémoire séculaire des familles de Houmt Souk.",
    likes: 0,
    isLiked: false,
  },
  {
    id: "img-tn-6",
    title: "Porte Patricienne & Grille Bleue de Tunis",
    category: "Landmarks & Architecture",
    governorate: "Tunis",
    yearStr: "c. 1915",
    imageUrl: medinaDoor,
    description: "Porte en bois clouté et ferronnerie d'art d'une demeure citadine baldiya de la Médina de Tunis.",
    likes: 0,
    isLiked: false,
  },
];

// The 3 remaining gallery pages that do not have their own standalone section on the homepage
const remainingGalleryPages = [
  {
    id: "books",
    to: "/gallery/books",
    icon: BookOpen,
    badgeKey: "col_books_badge",
    badgeFallback: "Fonds Livres & Manuscrits",
    titleKey: "col_books_title",
    titleFallback: "Manuscrits & Ouvrages",
    descKey: "col_books_desc",
    descFallback:
      "Registres de cadis hanéfites et malékites, traités généalogiques de la Mosquée Zitouna, ouvrages historiques et recueils rares de habous (awqaf).",
    highlights: [
      { key: "col_books_h1", fallback: "Manuscrits de la Zitouna & nasab" },
      { key: "col_books_h2", fallback: "Ouvrages généalogiques historiques" },
      { key: "col_books_h3", fallback: "Traités de jurisprudence & habous" },
    ],
    ctaKey: "col_books_cta",
    ctaFallback: "Explorer les Manuscrits & Ouvrages",
  },
  {
    id: "documents",
    to: "/gallery/documents",
    icon: FileText,
    badgeKey: "col_docs_badge",
    badgeFallback: "Actes, Décrets & Sijillats",
    titleKey: "col_docs_title",
    titleFallback: "Documents & Sijillats",
    descKey: "col_docs_desc",
    descFallback:
      "Actes d'état civil originaux (naissances, mariages, décès), décrets de naturalisation (1924–1927), sijillats notariés d''udul et registres fiscaux.",
    highlights: [
      { key: "col_docs_h1", fallback: "Sijillats notariés d''udul & mahkamas" },
      { key: "col_docs_h2", fallback: "Décrets de naturalisation (1924–1927)" },
      { key: "col_docs_h3", fallback: "Registres d'état civil originaux" },
    ],
    ctaKey: "col_docs_cta",
    ctaFallback: "Consulter les Documents & Sijillats",
  },
  {
    id: "audios",
    to: "/gallery/audios",
    icon: Headphones,
    badgeKey: "col_audios_badge",
    badgeFallback: "Mémoire Sonore & Entretiens",
    titleKey: "col_audios_title",
    titleFallback: "Récits Oraux & Audio",
    descKey: "col_audios_desc",
    descFallback:
      "Entretiens oraux avec les doyens et aînés de familles, transmissions orales des lignées tribales et enregistrements sonores du patrimoine traditionnel tunisien.",
    highlights: [
      { key: "col_audios_h1", fallback: "Témoignages oraux d'anciens & doyens" },
      { key: "col_audios_h2", fallback: "Transmissions orales des lignées et tribus" },
      { key: "col_audios_h3", fallback: "Fonds sonores et récits patrimoniaux" },
    ],
    ctaKey: "col_audios_cta",
    ctaFallback: "Écouter les Récits Oraux & Audio",
  },
];

export default function Home() {
  const { t, isRtl, locale } = useTranslation();
  const { user } = useAuth();
  const [active, setActive] = useState(0);
  const [bannerSlides, setBannerSlides] = useState<any[]>(slides);
  const { getText, getImage } = useSiteContent();
  const apiRoot = useMemo(() => getApiRoot(), []);

  // Live real data states (ALL items, no slice truncation)
  const [trees, setTrees] = useState<any[]>(fallbackRealTrees);
  const [galleryImages, setGalleryImages] = useState<any[]>(fallbackCuratedImages);
  const [articles, setArticles] = useState<NormalizedArticle[]>(REAL_AUTHENTIC_ARTICLES);

  // Infinite Marquee Pause States & Scroll Refs
  const [treesPaused, setTreesPaused] = useState(false);
  const [galleryPaused, setGalleryPaused] = useState(false);
  const [articlesPaused, setArticlesPaused] = useState(false);
  const treesMarqueeRef = useRef<HTMLDivElement>(null);
  const galleryMarqueeRef = useRef<HTMLDivElement>(null);
  const articlesMarqueeRef = useRef<HTMLDivElement>(null);

  // Interactive modals
  const [activeTree, setActiveTree] = useState<any | null>(null);
  const [activeImage, setActiveImage] = useState<any | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<NormalizedArticle | null>(null);

  const nudgeMarquee = (
    ref: React.RefObject<HTMLDivElement | null>,
    direction: "left" | "right"
  ) => {
    if (ref.current) {
      const scrollAmount = direction === "left" ? -420 : 420;
      ref.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const heroImageOverride = getImage("home", "hero", "image");
  const activeSlides = useMemo(
    () =>
      heroImageOverride
        ? [{ image: heroImageOverride, label: "", labelKey: "hero_slide_medina" }]
        : bannerSlides,
    [heroImageOverride, bannerSlides],
  );
  const heroBadge = getText("home", "hero", "eyebrow") ?? t("site_badge");
  const heroTitle = getText("home", "hero", "title") ?? t("hero_title");
  const heroSubtitle = getText("home", "hero", "subtitle") ?? t("hero_subtitle");
  const preserveTitle = getText("home", "preserve", "title") ?? t("preserve_lineage_title");
  const preserveDesc = getText("home", "preserve", "description") ?? t("preserve_lineage_desc");
  const preserveImage = getImage("home", "preserve", "image") ?? eljem;

  // Banner slides loader
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/banner-slides");
        const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        if (list.length > 0) {
          setBannerSlides(
            list.map((row: any, idx: number) => ({
              image: resolveBannerUrl(row.imagePath || row.image_path || row.imageUrl || row.image_url),
              label: String(row.caption || row.title || "").trim(),
              labelKey: slides[idx % slides.length]?.labelKey || "hero_slide_medina",
            })),
          );
        } else {
          setBannerSlides(slides);
        }
      } catch {
        setBannerSlides(slides);
      }
    })();
  }, []);

  // Fetch ALL real Trees from /trees API + tracked uploads (identical to GalleryTrees.tsx)
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/trees");
        const items = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        const tracked = getTrackedUploads("trees");
        const rawList = [...tracked, ...items];

        if (rawList.length > 0) {
          const seenIds = new Set<string>();
          const formatted = rawList
            .filter((tr: any) => {
              const idKey = String(tr.id);
              if (seenIds.has(idKey)) return false;
              seenIds.add(idKey);

              const titleStr = tr.name || tr.title || "";
              if (/^new\s+family\s+tree$/i.test(titleStr.trim())) return false;
              if (/^arbre\s+(famille\s+)?guagliardo$/i.test(titleStr.trim())) return false;
              if (titleStr.trim() === "111") return false;
              const descStr = tr.description || tr.notes || tr.provenance || "";
              if (descStr.trim() === "1111") return false;
              if (/genealogical\s+tree\s+uploaded\s+via\s+admin/i.test(descStr.trim())) return false;
              return true;
            })
            .map((tr: any) => {
              const key = `gallery_tree_${tr.id}`;
              const social = getSocialLikes(key, 0);
              return {
                ...tr,
                title: tr.title || tr.name,
                likes: social.count,
                isLiked: social.isLiked,
              };
            });

          if (formatted.length > 0) {
            setTrees(formatted);
            const allKeys = formatted.map((tr: any) => `gallery_tree_${tr.id}`);
            fetchBatchSocialCounts(allKeys)
              .then((batch) => {
                if (batch && Object.keys(batch).length > 0) {
                  setTrees((prev) =>
                    prev.map((tr) => {
                      const k = `gallery_tree_${tr.id}`;
                      if (batch[k]) {
                        return {
                          ...tr,
                          likes: batch[k].likes ?? tr.likes,
                          isLiked: batch[k].isLiked ?? tr.isLiked,
                          commentsCount: batch[k].comments ?? tr.commentsCount,
                        };
                      }
                      return tr;
                    })
                  );
                }
              })
              .catch(() => {});
          }
        }
      } catch {
        // Fallback already set
      }
    })();
  }, []);

  // Fetch ALL real Gallery Images from /gallery + /documents?type=image + tracked uploads + curated images
  useEffect(() => {
    (async () => {
      try {
        let galleryItems: any[] = [];
        let docImages: any[] = [];

        try {
          const { data } = await api.get("/gallery");
          galleryItems = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        } catch {
          // ignore
        }

        try {
          const { data } = await api.get("/documents?type=image");
          docImages = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        } catch {
          // ignore
        }

        const formattedGallery = galleryItems.map((it: any) => {
          const key = `gallery_img_${it.id}`;
          const social = getSocialLikes(key, 0);
          return {
            id: it.id,
            title: it.title || "Photographie d'Archive",
            category: it.category || "Regional Heritage",
            governorate: it.governorate || it.location || "Tunis",
            yearStr: it.year || it.yearStr || "c. 1920",
            imageUrl: resolveGalleryItemUrl(it, undefined, medina),
            image_path: it.image_path || it.imagePath || it.imageUrl || it.url || null,
            description: it.description || it.caption || "",
            likes: social.count,
            isLiked: social.isLiked,
          };
        });

        const formattedDocs = docImages.map((img: any) => {
          const key = `gallery_img_${img.id}`;
          const social = getSocialLikes(key, 0);
          return {
            id: `doc-${img.id}`,
            title: img.title || "Photographie d'Archive",
            category: img.category || "Patrimoine & Architecture",
            governorate: img.governorate || "Tunis",
            yearStr: img.year || img.yearStr || "c. 1920",
            imageUrl: resolveAnyMediaUrl(img.file_path || img.imageUrl, undefined, medina),
            image_path: img.file_path || img.imageUrl || null,
            description: img.description || "",
            likes: social.count,
            isLiked: social.isLiked,
          };
        });

        const tracked = getTrackedUploads("images").map((it: any) => {
          const key = `gallery_img_${it.id}`;
          const social = getSocialLikes(key, 0);
          return {
            id: it.id,
            title: it.title || "Photographie d'Archive",
            category: it.category || "Heritage Archives",
            governorate: it.location || it.governorate || "Tunis",
            yearStr: it.year || "Archive",
            imageUrl: resolveGalleryItemUrl(it, undefined, medina),
            image_path: it.image_path || it.imageUrl || it.url || null,
            description: it.description || "",
            likes: social.count,
            isLiked: social.isLiked,
          };
        });

        const curated = fallbackCuratedImages.map((it) => {
          const key = `gallery_img_${it.id}`;
          const social = getSocialLikes(key, 0);
          return {
            ...it,
            likes: social.count,
            isLiked: social.isLiked,
          };
        });

        const combined = [...tracked, ...formattedGallery, ...formattedDocs, ...curated];
        const seenIds = new Set<string>();
        const deduped = combined.filter((item) => {
          const k = String(item.id);
          if (seenIds.has(k)) return false;
          seenIds.add(k);
          return true;
        });

        if (deduped.length > 0) {
          setGalleryImages(deduped);
          const allKeys = deduped.map((x) => `gallery_img_${x.id}`);
          fetchBatchSocialCounts(allKeys)
            .then((batch) => {
              if (batch && Object.keys(batch).length > 0) {
                setGalleryImages((prev) =>
                  prev.map((item) => {
                    const k = `gallery_img_${item.id}`;
                    if (batch[k]) {
                      return {
                        ...item,
                        likes: batch[k].likes ?? item.likes,
                        isLiked: batch[k].isLiked ?? item.isLiked,
                      };
                    }
                    return item;
                  })
                );
              }
            })
            .catch(() => {});
        }
      } catch {
        // Fallback already set
      }
    })();
  }, []);

  // Fetch ALL real Articles from /articles API + tracked uploads + REAL_AUTHENTIC_ARTICLES
  useEffect(() => {
    (async () => {
      try {
        let apiItems: any[] = [];
        try {
          const { data } = await api.get("/articles");
          apiItems = extractArticleList(data);
        } catch {
          // ignore
        }

        const normalizedApi = apiItems.map((item) => {
          const norm = normalizeArticle(item, apiRoot, t("member", "Membre"), "");
          const social = getSocialLikes(`gallery_article_${norm.id}`, norm.likes || 0);
          return {
            ...norm,
            likes: social.count,
            isLiked: social.isLiked,
          };
        });

        const tracked = getTrackedUploads("articles").map((item: any) => {
          const norm = normalizeArticle(item, apiRoot, item.authorName || "Karim Admin", "");
          const social = getSocialLikes(`gallery_article_${norm.id}`, norm.likes || 0);
          return {
            ...norm,
            likes: social.count,
            isLiked: social.isLiked,
          };
        });

        const authenticWithLikes = REAL_AUTHENTIC_ARTICLES.map((art) => {
          const social = getSocialLikes(`gallery_article_${art.id}`, art.likes || 0);
          return {
            ...art,
            likes: social.count,
            isLiked: social.isLiked,
          };
        });

        const combined = [...tracked, ...normalizedApi, ...authenticWithLikes];
        const seenTitles = new Set<string>();
        const deduped = combined.filter((art) => {
          const normTitle = String(art.title || "").trim().toLowerCase();
          const key = normTitle || String(art.id);
          if (seenTitles.has(key)) return false;
          seenTitles.add(key);
          return true;
        });

        if (deduped.length > 0) {
          setArticles(deduped);
        }
      } catch {
        // Fallback already set
      }
    })();
  }, [apiRoot, t]);

  useEffect(() => {
    if (!activeSlides.length) return;
    setActive(0);
    const id = setInterval(() => setActive((i) => (i + 1) % activeSlides.length), 6000);
    return () => clearInterval(id);
  }, [activeSlides.length]);

  const toggleTreeLike = async (id: number | string) => {
    const key = `gallery_tree_${id}`;
    const target = trees.find((t) => t.id === id);
    const result = await toggleSocialLike(key, target?.likes || 0, undefined, "tree", Number(id) || undefined);
    setTrees((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isLiked: result.isLiked, likes: result.count } : t))
    );
  };

  const toggleImageLike = async (id: number | string) => {
    const key = `gallery_img_${id}`;
    const target = galleryImages.find((img) => img.id === id);
    const result = await toggleSocialLike(key, target?.likes || 0, undefined, "image", Number(id) || undefined);
    setGalleryImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, isLiked: result.isLiked, likes: result.count } : img))
    );
  };

  const toggleArticleLike = async (id: number | string) => {
    const key = `gallery_article_${id}`;
    const target = articles.find((art) => art.id === id);
    const result = await toggleSocialLike(key, target?.likes || 0, undefined, "article", Number(id) || undefined);
    setArticles((prev) =>
      prev.map((art) => (art.id === id ? { ...art, isLiked: result.isLiked, likes: result.count } : art))
    );
  };

  // Build seamless duplicated tracks for the 3 infinite marquees
  const duplicatedTrees = useMemo(() => {
    const base = trees.length > 0 ? trees : fallbackRealTrees;
    return [...base, ...base];
  }, [trees]);

  const duplicatedGalleryImages = useMemo(() => {
    const base = galleryImages.length > 0 ? galleryImages : fallbackCuratedImages;
    return [...base, ...base];
  }, [galleryImages]);

  const duplicatedArticles = useMemo(() => {
    const base = articles.length > 0 ? articles : REAL_AUTHENTIC_ARTICLES;
    const wideBase = base.length < 5 ? [...base, ...base] : base;
    return [...wideBase, ...wideBase];
  }, [articles]);

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="text-[var(--foreground)] min-h-screen">
      <SEO
        title={t("seo_home_title")}
        description={t("seo_home_desc")}
      />

      {/* ========================================================================= */}
      {/* 1. HERO SLIDER (DIAPORAMA) RESTORED ORIGINAL DESIGN                       */}
      {/* ========================================================================= */}
      <section className="w-full px-4 pt-4 sm:px-6 lg:px-8">
        <div className="frame-gold relative mx-auto w-full max-w-[var(--content-max)] overflow-hidden rounded-md min-h-[460px] sm:min-h-[540px] lg:min-h-[600px] flex items-center justify-center">
          {activeSlides.map((s, i) => (
            <img
              key={s.labelKey || s.image || i}
              src={s.image}
              alt={s.labelKey ? t(s.labelKey) : s.label || "Roots Tunisia"}
              width={1600}
              height={1000}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
                i === active ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
          <div className="hero-scrim absolute inset-0" />

          {/* Prev / Next Slide Controls */}
          <button
            type="button"
            aria-label={t("previous")}
            onClick={() => setActive((i) => (i - 1 + activeSlides.length) % activeSlides.length)}
            className="absolute start-3 top-1/2 -translate-y-1/2 z-20 hidden sm:flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-black/45 !text-white hover:bg-[#d9a441] hover:!text-[#1f160f] hover:border-[#d9a441] transition-colors cursor-pointer"
          >
            <ChevronLeft className={`h-5 w-5 ${isRtl ? "rotate-180" : ""}`} />
          </button>
          <button
            type="button"
            aria-label={t("next")}
            onClick={() => setActive((i) => (i + 1) % activeSlides.length)}
            className="absolute end-3 top-1/2 -translate-y-1/2 z-20 hidden sm:flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-black/45 !text-white hover:bg-[#d9a441] hover:!text-[#1f160f] hover:border-[#d9a441] transition-colors cursor-pointer"
          >
            <ChevronRight className={`h-5 w-5 ${isRtl ? "rotate-180" : ""}`} />
          </button>

          <div className="relative z-10 flex w-full flex-col items-center justify-center px-5 py-12 sm:px-16 sm:py-16 text-center">
            <p className="eyebrow !text-[#f5c857] text-shadow-dark tracking-widest font-bold">
              {heroBadge}
            </p>
            <h1 className="display-xl mt-4 max-w-4xl !text-white font-bold hero-title-shadow text-shadow-glow tracking-wide">
              {heroTitle}
            </h1>
            <div className="gold-rule mt-5 w-32 mx-auto shadow-lg" />
            <p className="mt-5 max-w-2xl text-sm leading-relaxed !text-white drop-shadow-md font-medium sm:text-base">
              {heroSubtitle}
            </p>
            <div className="mt-8 flex w-full sm:w-auto flex-col sm:flex-row flex-wrap justify-center gap-3">
              <Link to="/interactive-map" className="btn-base btn-gold w-full sm:w-auto min-w-[200px]">
                {t("start_exploring")}
              </Link>
              <Link to="/gallery/trees" className="btn-base btn-outline-light !text-white hover:!text-white w-full sm:w-auto min-w-[200px]">
                {t("browse_family_trees")}
              </Link>
            </div>
            <div className="mt-6 flex flex-col items-center gap-2">
              {(() => {
                const currentSlide = activeSlides[active] || activeSlides[0] || slides[0];
                const slideLabel =
                  locale !== "fr" && currentSlide?.labelKey
                    ? t(currentSlide.labelKey)
                    : currentSlide?.label?.trim() ||
                      (currentSlide?.labelKey ? t(currentSlide.labelKey) : "");
                if (!slideLabel) return null;
                return (
                  <Link
                    to="/gallery/images"
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-black/45 px-3 py-1 text-xs font-semibold !text-[#f5c857] hover:bg-black/65 transition-colors"
                  >
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{slideLabel}</span>
                  </Link>
                );
              })()}
              <div className="flex gap-2 mt-1">
                {activeSlides.map((s, i) => (
                  <button
                    key={s.labelKey || s.image || i}
                    aria-label={`${t("hero_show_slide")} ${i + 1}`}
                    onClick={() => setActive(i)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      i === active ? "w-10 bg-[#f5c857]" : "w-4 bg-white/60 hover:bg-white/90"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. STATS BAR : 4 COLUMNS                                                  */}
      {/* ========================================================================= */}
      <section className="w-full px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8">
        <div className="mx-auto w-full max-w-[var(--content-max)]">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-[var(--gold)]/45 bg-[var(--gold)]/35 md:grid-cols-4 shadow-md">
            {stats.map((s) => (
              <Link
                key={s.labelKey}
                to={s.to}
                className="group flex flex-col items-center justify-center min-h-[120px] sm:min-h-[140px] bg-[var(--card)]/95 backdrop-blur-sm px-3 py-6 sm:px-6 sm:py-8 text-center transition-colors hover:bg-[var(--card)]"
              >
                <p className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--primary)] dark:text-[var(--gold)] group-hover:text-[var(--gold)] transition-colors">
                  {t(s.valueKey)}
                </p>
                <p className="mt-2 inline-flex items-center justify-center gap-1 text-[0.68rem] sm:text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[var(--foreground)] group-hover:text-[var(--gold)] transition-colors">
                  <span>{t(s.labelKey)}</span>
                  <span className="opacity-60 group-hover:opacity-100">{isRtl ? "←" : "→"}</span>
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. PRESERVE BANNER (EL JEM MONUMENT ARCHES)                               */}
      {/* ========================================================================= */}
      <Section className="!pt-12 sm:!pt-16">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[var(--gold)]/30 min-h-[380px] sm:min-h-[440px] flex items-center justify-center text-center p-6 sm:p-12">
          <img
            src={preserveImage}
            alt={t("hero_slide_eljem", "Amphithéâtre d'El Jem")}
            className="absolute inset-0 w-full h-full object-cover brightness-[0.4] contrast-[1.1]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/60" />

          <div className="relative z-10 max-w-3xl mx-auto text-white space-y-4 sm:space-y-6">
            <span className="inline-block text-xs sm:text-sm font-mono font-bold tracking-widest text-[#f5c857] uppercase px-3 py-1 rounded-full bg-black/50 border border-[#f5c857]/40">
              {t("heritage_banner_eyebrow", "MÉMOIRE & PÉRENNITÉ HISTORIQUE")}
            </span>
            <h2 className="font-cinzel text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight drop-shadow-md">
              {preserveTitle}
            </h2>
            <p className="text-xs sm:text-base text-white/90 max-w-2xl mx-auto font-body leading-relaxed drop-shadow">
              {preserveDesc}
            </p>
            <div className="mt-6 flex w-full sm:w-auto flex-col sm:flex-row flex-wrap justify-center gap-3">
              <Link to="/gallery/trees" className="btn-base btn-gold w-full sm:w-auto min-w-[200px]">
                {t("browse_family_trees")}
              </Link>
              <Link to="/interactive-map" className="btn-base btn-outline-light !text-white hover:!text-white w-full sm:w-auto min-w-[200px]">
                {t("start_exploring")}
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* ========================================================================= */}
      {/* 4. INTERACTIVE MAP SECTION RESTORED (ATLAS DES 24 GOUVERNORATS)           */}
      {/* ========================================================================= */}
      <Section id="atlas-map" className="bg-[var(--secondary)]/30">
        <TunisiaGovernoratesMap hideHeaderBanners={true} />
      </Section>

      {/* ========================================================================= */}
      {/* 4.5 CHRONOLOGIE CONTINUE : DÉFILEMENT INFINI X DES 12 PÉRIODES DE TUNISIE */}
      {/* ========================================================================= */}
      <PeriodsInfiniteMarquee />

      {/* ========================================================================= */}
      {/* 4.6 INVENTAIRE CONTINU : DÉFILEMENT INFINI X DES 28 FONDS D'ARCHIVES      */}
      {/* ========================================================================= */}
      <SourcesInfiniteMarquee />

      {/* ========================================================================= */}
      {/* 5. SECTION ARBRES GÉNÉALOGIQUES : DÉFILEMENT INFINI DE TOUS LES ARBRES    */}
      {/* ========================================================================= */}
      <Section id="genealogical-trees" className="!pt-6 !pb-10 overflow-hidden relative">
        <div className="w-full max-w-[var(--content-max)] mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-[var(--gold)]/20 pb-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/25 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                <GitBranch className="w-3.5 h-3.5" />
                <span>{t("trees_section_eyebrow", "GÉNÉALOGIE & LIGNÉES")}</span>
                <span className="px-1.5 py-0.2 rounded bg-[var(--gold)]/20 text-[10px]">
                  {trees.length}
                </span>
              </div>
              <h2 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--foreground)] tracking-tight">
                {t("trees_section_title", "Arbres Généalogiques des Familles Tunisiennes")}
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed font-body">
                {t(
                  "trees_section_intro",
                  "Explorez en défilement continu toutes les lignées familiales documentées à travers les 24 gouvernorats : visualisez les filiations sur plusieurs générations, les individus répertoriés et chaque fiche familiale."
                )}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setTreesPaused((prev) => !prev)}
                aria-label={treesPaused ? t("marquee_resume", "Reprendre") : t("marquee_pause", "Pause")}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[var(--card)] hover:bg-[var(--gold)]/15 text-[var(--foreground)] border border-[var(--gold)]/30 hover:border-[var(--gold)] transition-all cursor-pointer shadow-xs"
              >
                {treesPaused ? (
                  <>
                    <Play className="w-3.5 h-3.5 text-[var(--gold)] fill-[var(--gold)]" />
                    <span>{t("marquee_resume", "Reprendre")}</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-3.5 h-3.5 text-[var(--gold)]" />
                    <span>{t("marquee_pause", "Pause")}</span>
                  </>
                )}
              </button>

              <div className="hidden sm:inline-flex items-center rounded-xl bg-[var(--card)] border border-[var(--gold)]/30 p-0.5">
                <button
                  type="button"
                  onClick={() => nudgeMarquee(treesMarqueeRef, "left")}
                  aria-label={t("marquee_scroll_left", "Défiler vers la gauche")}
                  className="p-1.5 rounded-lg hover:bg-[var(--gold)]/20 text-[var(--foreground)] transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 text-[var(--gold)]" />
                </button>
                <button
                  type="button"
                  onClick={() => nudgeMarquee(treesMarqueeRef, "right")}
                  aria-label={t("marquee_scroll_right", "Défiler vers la droite")}
                  className="p-1.5 rounded-lg hover:bg-[var(--gold)]/20 text-[var(--foreground)] transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4 text-[var(--gold)]" />
                </button>
              </div>

              <Link
                to="/gallery/trees"
                className="btn-base btn-gold text-xs py-2 px-3.5 rounded-xl font-bold inline-flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Users className="w-3.5 h-3.5 shrink-0" />
                <span>{t("browse_all_trees_cta", "Consulter Tous les Arbres Généalogiques")}</span>
                <ArrowRight className={`w-3.5 h-3.5 shrink-0 ${isRtl ? "rotate-180" : ""}`} />
              </Link>
            </div>
          </div>
        </div>

        <div className="relative w-full overflow-hidden group">
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-16 lg:w-24 bg-gradient-to-r from-[var(--background)] to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 lg:w-24 bg-gradient-to-l from-[var(--background)] to-transparent z-10" />

          <div
            ref={treesMarqueeRef}
            className="w-full overflow-x-auto no-scrollbar scroll-smooth py-3"
            tabIndex={0}
            role="region"
            aria-label={t("trees_section_title", "Arbres Généalogiques des Familles Tunisiennes")}
          >
            <div
              dir="ltr"
              style={{ animationDuration: `${Math.max(65, trees.length * 4)}s` }}
              className={`flex items-stretch gap-6 pl-4 sm:pl-8 pr-4 sm:pr-8 animate-marquee-ltr ${
                treesPaused ? "marquee-paused" : ""
              }`}
            >
              {duplicatedTrees.map((tree, idx) => {
                const titleStr = tree.title || tree.name || `Arbre Familial #${tree.id}`;
                const descStr = tree.description || tree.notes || tree.provenance || "";
                const { individuals: memberCount, generations: genCount } = getTreeMetrics(tree);

                return (
                  <div
                    key={`tree-marquee-${tree.id}-${idx}`}
                    className="w-[330px] sm:w-[380px] shrink-0 flex flex-col"
                  >
                    <article
                      dir={isRtl ? "rtl" : "ltr"}
                      className="surface-card frame-gold p-6 rounded-lg shadow-md space-y-4 flex h-full flex-col justify-between hover:-translate-y-1 transition-all text-start"
                    >
                      <div className="space-y-3">
                        <h3
                          onClick={() => setActiveTree(tree)}
                          className="text-lg sm:text-xl font-display font-bold text-[var(--foreground)] leading-snug cursor-pointer hover:text-[var(--gold)] transition-colors line-clamp-2"
                          title={t("open_tree_details", "Cliquer pour ouvrir l'arbre généalogique")}
                        >
                          {titleStr}
                        </h3>

                        <p className="text-xs text-[var(--foreground)]/80 leading-relaxed line-clamp-3">
                          {descStr}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[var(--border)] space-y-3">
                        <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-[var(--background)] p-3 rounded-md border border-[var(--border)]">
                          <div className="flex items-center gap-1.5 text-[var(--foreground)]">
                            <Layers className="w-3.5 h-3.5 text-[var(--gold)] shrink-0" />
                            <span>
                              <strong>{t("generations_label", "Générations")}:</strong> {genCount}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[var(--foreground)]">
                            <Users className="w-3.5 h-3.5 text-[var(--gold)] shrink-0" />
                            <span>
                              <strong>{t("individuals_label", "Individus")}:</strong> {memberCount}
                            </span>
                          </div>
                        </div>

                        <div className="pt-2 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setActiveTree(tree)}
                            className="btn-base btn-gold flex-1 text-xs py-2 flex items-center justify-center gap-2 cursor-pointer font-bold"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{t("explore_family_card", "Explorer la Fiche")}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleTreeLike(tree.id)}
                            className={`btn-base btn-outline text-xs py-2 px-2.5 flex items-center justify-center gap-1 cursor-pointer transition-all ${
                              tree.isLiked ? "border-rose-500/50 bg-rose-500/10" : ""
                            }`}
                            title={user ? t("like", "Like") : t("login_to_like", "Connectez-vous pour aimer")}
                          >
                            <Heart
                              className={`w-3.5 h-3.5 ${
                                tree.isLiked ? "fill-rose-500 text-rose-500" : "text-[var(--gold)]"
                              }`}
                            />
                            <span className={`text-[0.65rem] font-bold ${tree.isLiked ? "text-rose-500" : ""}`}>
                              {tree.likes || 0}
                            </span>
                          </button>
                          <Link
                            to="/gallery/trees"
                            className="btn-base btn-outline text-xs py-2 px-2.5 flex items-center justify-center gap-1 cursor-pointer"
                            title={t("view_in_gallery", "Voir dans la galerie")}
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-[var(--gold)]" />
                            {typeof tree.commentsCount === "number" && tree.commentsCount > 0 && (
                              <span className="text-[0.65rem] font-bold text-[var(--gold)]">
                                {tree.commentsCount}
                              </span>
                            )}
                          </Link>
                        </div>
                      </div>
                    </article>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Section>

      {/* ========================================================================= */}
      {/* 6. SECTION GALERIE DU PATRIMOINE HISTORIQUE : DÉFILEMENT INFINI           */}
      {/* ========================================================================= */}
      <Section id="heritage-gallery" className="!pt-6 !pb-10 bg-[var(--secondary)]/20 overflow-hidden relative">
        <div className="w-full max-w-[var(--content-max)] mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-[var(--gold)]/20 pb-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/25 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                <Camera className="w-3.5 h-3.5" />
                <span>{t("gallery_section_eyebrow", "PATRIMOINE VISUEL")}</span>
                <span className="px-1.5 py-0.2 rounded bg-[var(--gold)]/20 text-[10px]">
                  {galleryImages.length}
                </span>
              </div>
              <h2 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--foreground)] tracking-tight">
                {t("gallery_section_title", "Galerie & Photothèque Historique")}
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed font-body">
                {t(
                  "gallery_section_intro",
                  "Portraits anciens de familles tunisiennes, ruines archéologiques puniques et romaines, portes cloutées et médinas séculaires conservées en haute définition."
                )}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setGalleryPaused((prev) => !prev)}
                aria-label={galleryPaused ? t("marquee_resume", "Reprendre") : t("marquee_pause", "Pause")}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[var(--card)] hover:bg-[var(--gold)]/15 text-[var(--foreground)] border border-[var(--gold)]/30 hover:border-[var(--gold)] transition-all cursor-pointer shadow-xs"
              >
                {galleryPaused ? (
                  <>
                    <Play className="w-3.5 h-3.5 text-[var(--gold)] fill-[var(--gold)]" />
                    <span>{t("marquee_resume", "Reprendre")}</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-3.5 h-3.5 text-[var(--gold)]" />
                    <span>{t("marquee_pause", "Pause")}</span>
                  </>
                )}
              </button>

              <div className="hidden sm:inline-flex items-center rounded-xl bg-[var(--card)] border border-[var(--gold)]/30 p-0.5">
                <button
                  type="button"
                  onClick={() => nudgeMarquee(galleryMarqueeRef, "left")}
                  aria-label={t("marquee_scroll_left", "Défiler vers la gauche")}
                  className="p-1.5 rounded-lg hover:bg-[var(--gold)]/20 text-[var(--foreground)] transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 text-[var(--gold)]" />
                </button>
                <button
                  type="button"
                  onClick={() => nudgeMarquee(galleryMarqueeRef, "right")}
                  aria-label={t("marquee_scroll_right", "Défiler vers la droite")}
                  className="p-1.5 rounded-lg hover:bg-[var(--gold)]/20 text-[var(--foreground)] transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4 text-[var(--gold)]" />
                </button>
              </div>

              <Link
                to="/gallery/images"
                className="btn-base btn-gold text-xs py-2 px-3.5 rounded-xl font-bold inline-flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5 shrink-0" />
                <span>{t("browse_all_gallery_cta", "Parcourir la Photothèque Complète")}</span>
                <ArrowRight className={`w-3.5 h-3.5 shrink-0 ${isRtl ? "rotate-180" : ""}`} />
              </Link>
            </div>
          </div>
        </div>

        <div className="relative w-full overflow-hidden group">
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-16 lg:w-24 bg-gradient-to-r from-[var(--background)] to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 lg:w-24 bg-gradient-to-l from-[var(--background)] to-transparent z-10" />

          <div
            ref={galleryMarqueeRef}
            className="w-full overflow-x-auto no-scrollbar scroll-smooth py-3"
            tabIndex={0}
            role="region"
            aria-label={t("gallery_section_title", "Galerie & Photothèque Historique")}
          >
            <div
              dir="ltr"
              style={{ animationDuration: `${Math.max(65, galleryImages.length * 3.5)}s` }}
              className={`flex items-stretch gap-6 pl-4 sm:pl-8 pr-4 sm:pr-8 animate-marquee-ltr ${
                galleryPaused ? "marquee-paused" : ""
              }`}
            >
              {duplicatedGalleryImages.map((img, idx) => (
                <div
                  key={`gallery-marquee-${img.id}-${idx}`}
                  className="w-[300px] sm:w-[340px] shrink-0 flex flex-col"
                >
                  <article
                    dir={isRtl ? "rtl" : "ltr"}
                    className="surface-card frame-gold group/card overflow-hidden transition-all hover:-translate-y-1 shadow-md flex h-full flex-col justify-between rounded-lg bg-[var(--card)] text-start"
                  >
                    <div>
                      <div
                        onClick={() => setActiveImage(img)}
                        className="relative aspect-[4/3] overflow-hidden bg-[var(--card)] cursor-pointer"
                      >
                        <ResilientMediaImage
                          src={img.imageUrl}
                          alt={img.title}
                          loading="lazy"
                          item={img}
                          fallbackSrc={medina}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity flex items-end p-3">
                          <span className="text-white text-xs font-semibold flex items-center gap-1.5">
                            <ZoomIn className="h-3.5 w-3.5 text-[#f5c857]" />
                            <span>{t("view_high_res", "Voir en haute résolution")}</span>
                          </span>
                        </div>
                        {img.yearStr && (
                          <span className="absolute top-2.5 end-2.5 rounded-md bg-[#140f0a]/85 px-2.5 py-1 text-xs font-mono font-bold text-[#f5c857] backdrop-blur-md border border-[#f5c857]/40 shadow-sm">
                            {img.yearStr}
                          </span>
                        )}
                      </div>

                      <div className="p-4 sm:p-5">
                        <h3
                          onClick={() => setActiveImage(img)}
                          className="font-display font-bold text-base sm:text-lg text-[var(--foreground)] group-hover/card:text-[var(--gold)] transition-colors line-clamp-1 cursor-pointer"
                        >
                          {img.title}
                        </h3>
                        <p className="mt-1.5 text-xs text-[var(--foreground)]/80 line-clamp-2 leading-relaxed">
                          {img.description}
                        </p>
                      </div>
                    </div>

                    <div className="px-4 pb-4 pt-2.5 border-t border-[var(--border)] flex items-center justify-between text-xs">
                      {img.governorate && (
                        <span className="font-semibold text-[var(--gold)] flex items-center gap-1.5 text-xs truncate max-w-[130px]">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-[var(--gold)]" />
                          <span className="truncate">{img.governorate}</span>
                        </span>
                      )}
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => toggleImageLike(img.id)}
                          className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] hover:text-rose-500 transition-colors cursor-pointer"
                          title={t("like", "Like")}
                        >
                          <Heart
                            className={`h-3.5 w-3.5 ${
                              img.isLiked ? "fill-rose-500 text-rose-500" : ""
                            }`}
                          />
                          <span>{img.likes || 0}</span>
                        </button>
                        <Link
                          to="/gallery/images"
                          className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] hover:text-[var(--gold)] transition-colors cursor-pointer"
                          title={t("comments", "Commentaires")}
                        >
                          <MessageSquare className="h-3.5 w-3.5 text-[var(--gold)]" />
                          <span>{t("comment", "Commenter")}</span>
                        </Link>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ========================================================================= */}
      {/* 7. SECTION ARTICLES & MONOGRAPHIES : DÉFILEMENT INFINI                    */}
      {/* ========================================================================= */}
      <Section id="articles-section" className="!pt-6 !pb-10 overflow-hidden relative">
        <div className="w-full max-w-[var(--content-max)] mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-[var(--gold)]/20 pb-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/25 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{t("articles_section_eyebrow", "RECHERCHES & ÉTUDES HISTORIQUES")}</span>
                <span className="px-1.5 py-0.2 rounded bg-[var(--gold)]/20 text-[10px]">
                  {articles.length}
                </span>
              </div>
              <h2 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--foreground)] tracking-tight">
                {t("articles_section_title", "Articles & Monographies de Référence")}
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed font-body">
                {t(
                  "articles_section_intro",
                  "Études approfondies et monographies universitaires complètes sur l'état civil tunisien, l'impôt de la Majba et la paléographie notariale."
                )}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setArticlesPaused((prev) => !prev)}
                aria-label={articlesPaused ? t("marquee_resume", "Reprendre") : t("marquee_pause", "Pause")}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[var(--card)] hover:bg-[var(--gold)]/15 text-[var(--foreground)] border border-[var(--gold)]/30 hover:border-[var(--gold)] transition-all cursor-pointer shadow-xs"
              >
                {articlesPaused ? (
                  <>
                    <Play className="w-3.5 h-3.5 text-[var(--gold)] fill-[var(--gold)]" />
                    <span>{t("marquee_resume", "Reprendre")}</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-3.5 h-3.5 text-[var(--gold)]" />
                    <span>{t("marquee_pause", "Pause")}</span>
                  </>
                )}
              </button>

              <div className="hidden sm:inline-flex items-center rounded-xl bg-[var(--card)] border border-[var(--gold)]/30 p-0.5">
                <button
                  type="button"
                  onClick={() => nudgeMarquee(articlesMarqueeRef, "left")}
                  aria-label={t("marquee_scroll_left", "Défiler vers la gauche")}
                  className="p-1.5 rounded-lg hover:bg-[var(--gold)]/20 text-[var(--foreground)] transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 text-[var(--gold)]" />
                </button>
                <button
                  type="button"
                  onClick={() => nudgeMarquee(articlesMarqueeRef, "right")}
                  aria-label={t("marquee_scroll_right", "Défiler vers la droite")}
                  className="p-1.5 rounded-lg hover:bg-[var(--gold)]/20 text-[var(--foreground)] transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4 text-[var(--gold)]" />
                </button>
              </div>

              <Link
                to="/articles"
                className="btn-base btn-gold text-xs py-2 px-3.5 rounded-xl font-bold inline-flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 shrink-0" />
                <span>{t("browse_all_articles_cta", "Consulter Tous les Articles & Monographies")}</span>
                <ArrowRight className={`w-3.5 h-3.5 shrink-0 ${isRtl ? "rotate-180" : ""}`} />
              </Link>
            </div>
          </div>
        </div>

        <div className="relative w-full overflow-hidden group">
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-16 lg:w-24 bg-gradient-to-r from-[var(--background)] to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 lg:w-24 bg-gradient-to-l from-[var(--background)] to-transparent z-10" />

          <div
            ref={articlesMarqueeRef}
            className="w-full overflow-x-auto no-scrollbar scroll-smooth py-3"
            tabIndex={0}
            role="region"
            aria-label={t("articles_section_title", "Articles & Monographies de Référence")}
          >
            <div
              dir="ltr"
              style={{ animationDuration: `${Math.max(55, duplicatedArticles.length * 3)}s` }}
              className={`flex items-stretch gap-6 pl-4 sm:pl-8 pr-4 sm:pr-8 animate-marquee-ltr ${
                articlesPaused ? "marquee-paused" : ""
              }`}
            >
              {duplicatedArticles.map((article, idx) => (
                <div
                  key={`article-marquee-${article.id}-${idx}`}
                  className="w-[340px] sm:w-[390px] shrink-0 flex flex-col"
                >
                  <article
                    dir={isRtl ? "rtl" : "ltr"}
                    className="surface-card frame-gold p-6 rounded-lg shadow-md space-y-4 flex h-full flex-col justify-between hover:-translate-y-1 transition-all text-start"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/30 font-bold">
                          {article.category || "Archives & Notariats"}
                        </span>
                        <span className="text-[11px] font-mono text-[var(--muted-foreground)] flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[var(--gold)]" />
                          <span>{article.readingTime || "15 min"}</span>
                        </span>
                      </div>

                      <h3
                        onClick={() => setSelectedArticle(article)}
                        className="text-lg sm:text-xl font-display font-bold text-[var(--foreground)] leading-snug cursor-pointer hover:text-[var(--gold)] transition-colors line-clamp-2"
                        title={t("open_article_details", "Cliquer pour lire l'article complet et ses sources")}
                      >
                        {article.title}
                      </h3>

                      <p className="text-xs text-[var(--foreground)]/80 leading-relaxed line-clamp-3">
                        {article.content}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[var(--border)] space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-[var(--background)] p-3 rounded-md border border-[var(--border)]">
                        <div className="flex items-center gap-1.5 text-[var(--foreground)]">
                          <FileText className="w-3.5 h-3.5 text-[var(--gold)] shrink-0" />
                          <span>
                            <strong>{t("sources_label", "Sources")}:</strong> {article.sources?.length || 3}{" "}
                            {t("docs_short_label", "docs")}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[var(--foreground)]">
                          <Clock className="w-3.5 h-3.5 text-[var(--gold)] shrink-0" />
                          <span>
                            <strong>{t("reading_label", "Lecture")}:</strong> {article.readingTime || "15 min"}
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedArticle(article)}
                          className="btn-base btn-gold flex-1 text-xs py-2 flex items-center justify-center gap-2 cursor-pointer font-bold"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>{t("read_article_cta", "LIRE L'ARTICLE")}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleArticleLike(article.id)}
                          className={`btn-base btn-outline text-xs py-2 px-2.5 flex items-center justify-center gap-1 cursor-pointer transition-all ${
                            article.isLiked ? "border-rose-500/50 bg-rose-500/10 text-rose-500" : ""
                          }`}
                          title={t("like", "Like")}
                        >
                          <Heart
                            className={`w-3.5 h-3.5 ${
                              article.isLiked ? "fill-rose-500 text-rose-500" : "text-[var(--gold)]"
                            }`}
                          />
                          <span className={`text-[0.65rem] font-bold ${article.isLiked ? "text-rose-500" : ""}`}>
                            {article.likes || 0}
                          </span>
                        </button>

                        <Link
                          to="/articles"
                          className="btn-base btn-outline text-xs py-2 px-2.5 flex items-center justify-center gap-1 cursor-pointer"
                          title={t("browse_all_articles_cta", "Consulter tous les articles")}
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-[var(--gold)]" />
                        </Link>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ========================================================================= */}
      {/* 8. FONDS NUMÉRISÉS : DOCUMENTS, SIJILLATS & AUDIOS (3 CARTES DÉDIÉES)     */}
      {/* ========================================================================= */}
      <Section id="archival-collections" className="!pt-6 sm:!pt-10 bg-[var(--secondary)]/15">
        <SectionHeading
          center={true}
          eyebrow={t("collections_section_eyebrow", "FONDS NUMÉRISÉS & MÉDIAS")}
          title={t("collections_section_title", "Documents, Sijillats, Manuscrits & Mémoire Orale")}
          intro={t(
            "collections_section_intro",
            "Accédez directement aux trois fonds documentaires numérisés de la plateforme : actes d'état civil originaux, manuscrits et sijillats des mahkamas, et mémoires orales."
          )}
        />

        <div className="mt-10 sm:mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7 items-stretch">
          {remainingGalleryPages.map((col) => {
            const Icon = col.icon;
            return (
              <article
                key={col.id}
                className="surface-card frame-gold p-6 sm:p-7 rounded-lg shadow-md space-y-4 flex h-full flex-col justify-between hover:-translate-y-1 transition-all text-start"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/35">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/30 font-bold">
                      {t(col.badgeKey, col.badgeFallback)}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-display font-bold text-[var(--foreground)] leading-snug">
                    <Link to={col.to} className="hover:text-[var(--gold)] transition-colors">
                      {t(col.titleKey, col.titleFallback)}
                    </Link>
                  </h3>

                  <p className="text-xs text-[var(--foreground)]/80 leading-relaxed line-clamp-3">
                    {t(col.descKey, col.descFallback)}
                  </p>
                </div>

                <div className="pt-3 border-t border-[var(--border)] space-y-3">
                  <div className="p-3 rounded-md bg-[var(--background)] border border-[var(--border)] space-y-1.5 text-xs font-mono">
                    <span className="text-[10px] uppercase font-bold text-[var(--gold)] tracking-wider block">
                      {t("collections_series_label", "Fonds & Séries Documentaires :")}
                    </span>
                    {col.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[var(--foreground)] text-[11px]">
                        <CheckCircle2 className="h-3 w-3 text-[var(--gold)] shrink-0" />
                        <span className="truncate">{t(h.key, h.fallback)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <Link
                      to={col.to}
                      className="btn-base btn-gold w-full text-xs py-2 flex items-center justify-center gap-2 cursor-pointer font-bold"
                    >
                      <span>{t(col.ctaKey, col.ctaFallback)}</span>
                      <ArrowRight className={`h-3.5 w-3.5 ${isRtl ? "rotate-180" : ""}`} />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Section>

      {/* Interactive Lightbox for Gallery Images */}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setActiveImage(null)}
        >
          <div
            className="surface-card frame-gold relative max-w-4xl w-full overflow-hidden shadow-2xl p-4 sm:p-6 rounded-xl bg-[var(--card)] text-start"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label={t("close")}
              onClick={() => setActiveImage(null)}
              className="absolute top-3 end-3 rounded-full bg-[var(--background)] p-1.5 text-[var(--foreground)] hover:bg-[var(--gold)]/20 transition-colors cursor-pointer z-10"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="max-h-[60vh] overflow-hidden rounded-lg flex items-center justify-center bg-black/40">
              <ResilientMediaImage
                src={activeImage.imageUrl}
                alt={activeImage.title}
                loading="eager"
                item={activeImage}
                fallbackSrc={medina}
                className="max-h-[60vh] max-w-full object-contain rounded"
              />
            </div>

            <div className="mt-4 pt-4 border-t border-[var(--gold)]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-[var(--foreground)]">
                  {activeImage.title}
                </h3>
                <p className="mt-1 text-xs text-[var(--muted-foreground)] flex items-center gap-2">
                  <span>{activeImage.yearStr}</span>
                  {activeImage.governorate && <span>• {activeImage.governorate}</span>}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  to="/gallery/images"
                  className="btn-base btn-gold text-xs py-2 px-4 inline-flex items-center gap-1.5 font-bold"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>{t("view_in_gallery", "Voir dans la galerie")}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3D Family Card Inspector Modal for Trees */}
      {activeTree && (
        <FamilyCardModal
          tree={activeTree}
          onClose={() => setActiveTree(null)}
        />
      )}

      {/* Article Reader Modal */}
      {selectedArticle && (
        <ArticleModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
          onLike={() => toggleArticleLike(selectedArticle.id)}
        />
      )}

      <SiteCustomBlocks pageId="home" />
    </div>
  );
}
