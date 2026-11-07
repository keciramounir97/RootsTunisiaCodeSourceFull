import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Search,
  Camera,
  X,
  ExternalLink,
  PlusCircle,
  ZoomIn,
  GitBranch,
  BookOpen,
  Headphones,
  FileText,
  MapPin,
  Calendar,
} from "lucide-react";
import { api } from "../api/client";
import { getApiRoot } from "../api/helpers";
import { PageHero, Section, SectionHeading } from "../components/site/Primitives";
import { useTranslation } from "../context/TranslationContext";
import { useAuth } from "../admin/components/AuthContext";
import { localGalleryAssets } from "../utils/galleryData";
import sidiBouSaid from "../assets/slider-sidibousaid.jpg";
import medina from "../assets/medina-tunis.jpg";
import eljem from "../assets/eljem.jpg";
import djerba from "../assets/djerba.jpg";
import carthage from "../assets/slider-carthage.jpg";
import kairouan from "../assets/slider-kairouan.jpg";
import manuscript from "../assets/family-archive.jpg";
import SEO from "../components/SEO";
import { useSiteContent } from "../hooks/useSiteContent";

interface CuratedItem {
  id: string;
  image: string;
  titleKey?: string;
  title: string;
  caption: string;
  location?: string;
  year?: string;
  isLocal?: boolean;
}

const baseCuratedItems: CuratedItem[] = [
  {
    id: "carthage-1",
    image: carthage,
    title: "Carthage Byrsa Hill & Roman Forum",
    caption: "Punic foundations and Roman Africa proconsularis ruins overlooking the Gulf of Tunis.",
    location: "Carthage, Tunis",
    year: "c. 1920",
  },
  {
    id: "kairouan-1",
    image: kairouan,
    title: "Great Mosque of Kairouan Courtyard",
    caption: "Oldest minaret and Islamic jurisprudential nasab manuscript repository in North Africa.",
    location: "Kairouan",
    year: "c. 1910",
  },
  {
    id: "medina-1",
    image: medina,
    title: "Medina of Tunis & Rue de la Kasbah",
    caption: "Historic covered souks, patrician palaces, and the Zitouna University quarter.",
    location: "Medina, Tunis",
    year: "c. 1905",
  },
  {
    id: "eljem-1",
    image: eljem,
    title: "Amphitheatre of El Jem (Thysdrus)",
    caption: "Monumental Roman colosseum in the Sahelian olive-growing plains.",
    location: "El Jem, Mahdia",
    year: "c. 1915",
  },
  {
    id: "djerba-1",
    image: djerba,
    title: "Djerba Traditional Menzel & Palm Oases",
    caption: "Fortified island menzel architecture, ibadi watchtowers, and olive orchards.",
    location: "Houmt Souk, Djerba",
    year: "c. 1930",
  },
  {
    id: "sidibousaid-1",
    image: sidiBouSaid,
    title: "Sidi Bou Saïd Andalusian Coastal Village",
    caption: "Whitewashed walls and moucharabieh balconies above Cap Carthage.",
    location: "Sidi Bou Saïd, Tunis",
    year: "c. 1925",
  },
  {
    id: "manuscript-1",
    image: manuscript,
    title: "Charaïque Court Sijill with Beylical Seal",
    caption: "Handwritten Habous endowment and property inheritance deeds with official Ottoman tugra.",
    location: "Archives Nationales de Tunisie",
    year: "1874",
  },
  {
    id: "family-1",
    image: medina,
    title: "Medina of Tunis Ornate Studded Door",
    caption: "Patrician palace entrance with wrought-iron grille in Tunis Medina.",
    location: "Tunis Medina",
    year: "c. 1918",
  },
];

export default function Gallery() {
  const location = useLocation();
  const { t, isRtl } = useTranslation();
  const { getText, getImage } = useSiteContent();
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState<any | null>(null);

  const apiRoot = useMemo(() => getApiRoot(), []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const qParam = params.get("q");
    setQuery(qParam || "");
  }, [location.search]);

  // Load from backend API with fallback
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await api.get("/gallery");
        if (!mounted) return;
        if (Array.isArray(res.data) && res.data.length > 0) {
          setItems(res.data);
        } else {
          setItems([]);
        }
      } catch (err) {
        setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const allDisplayItems = useMemo(() => {
    const list: any[] = [...baseCuratedItems];

    localGalleryAssets.forEach((g, idx) => {
      list.push({
        id: String(g.id),
        image: g.imagePath || (g as any).image_path,
        title: g.title || `Tunisian Archival Photograph #${idx + 1}`,
        caption: g.description || g.location || "Historical document & visual record from Tunisian heritage collections.",
        location: g.location || "Tunisia",
        year: g.year || "20th Century",
        isLocal: true,
      });
    });

    items.forEach((it) => {
      const imgUrl = it.imageUrl || it.url || (it.image_path ? `${apiRoot}/uploads/gallery/${it.image_path}` : "");
      if (imgUrl) {
        list.unshift({
          id: String(it.id),
          image: imgUrl,
          title: it.title || "Archival Photograph",
          caption: it.description || it.location || "Community uploaded visual record",
          location: it.location || "Tunisia",
          year: it.year || "",
          isLocal: false,
          rawItem: it,
        });
      }
    });

    if (!query.trim()) return list;
    const q = query.toLowerCase().trim();
    return list.filter(
      (c) =>
        c.title?.toLowerCase().includes(q) ||
        c.caption?.toLowerCase().includes(q) ||
        c.location?.toLowerCase().includes(q) ||
        c.year?.toLowerCase().includes(q)
    );
  }, [items, query, apiRoot]);

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="bg-[var(--background)] text-[var(--foreground)] min-h-screen">
      <SEO
        title={t("seo_gallery_title")}
        description="A visual archive of Tunisia: Carthage, Kairouan, the Medina of Tunis, El Jem, Djerba, Sidi Bou Saïd, manuscripts and family portraits."
        keywords={["Tunisia photo gallery", "Tunisian visual heritage", "Medina of Tunis photos"]}
      />

      <PageHero
        eyebrow={getText("gallery", "hero", "eyebrow") ?? t("nav_photos")}
        title={getText("gallery", "hero", "title") ?? t("gallery_teaser_title")}
        subtitle={getText("gallery", "hero", "subtitle") ?? t("gallery_teaser_subtitle")}
        image={getImage("gallery", "hero", "image") ?? sidiBouSaid}
      />

      {/* Sub-Galleries Tab Navigation Bar */}
      <div className="mx-auto max-w-[var(--content-max)] px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[var(--border)] scrollbar-thin">
          <Link
            to="/gallery/images"
            className="px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider bg-[var(--gold)] text-[#1f160f] shadow-sm hover:opacity-95 transition-opacity flex items-center gap-1.5 shrink-0"
          >
            <Camera className="h-3.5 w-3.5" />
            <span>{t("gal_tab_photos")}</span>
          </Link>
          <Link
            to="/gallery/trees"
            className="px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider bg-[var(--card)] text-[var(--foreground)] border border-[var(--border)] hover:border-[var(--gold)] transition-colors flex items-center gap-1.5 shrink-0"
          >
            <GitBranch className="h-3.5 w-3.5 text-[var(--gold)]" />
            <span>{t("gal_tab_trees")}</span>
          </Link>
          <Link
            to="/gallery/books"
            className="px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider bg-[var(--card)] text-[var(--foreground)] border border-[var(--border)] hover:border-[var(--gold)] transition-colors flex items-center gap-1.5 shrink-0"
          >
            <BookOpen className="h-3.5 w-3.5 text-[var(--gold)]" />
            <span>{t("gal_tab_books")}</span>
          </Link>
          <Link
            to="/gallery/audios"
            className="px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider bg-[var(--card)] text-[var(--foreground)] border border-[var(--border)] hover:border-[var(--gold)] transition-colors flex items-center gap-1.5 shrink-0"
          >
            <Headphones className="h-3.5 w-3.5 text-[var(--gold)]" />
            <span>{t("gal_tab_audios")}</span>
          </Link>
          <Link
            to="/gallery/documents"
            className="px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider bg-[var(--card)] text-[var(--foreground)] border border-[var(--border)] hover:border-[var(--gold)] transition-colors flex items-center gap-1.5 shrink-0"
          >
            <FileText className="h-3.5 w-3.5 text-[var(--gold)]" />
            <span>{t("gal_tab_documents")}</span>
          </Link>
        </div>
      </div>

      {/* Search & Actions Bar */}
      <div className="mx-auto max-w-[var(--content-max)] px-4 sm:px-6 lg:px-8 pt-6">
        <div className="surface-card p-4 sm:p-5 rounded-lg border border-[var(--gold)]/35 bg-[var(--card)]/95 shadow-md flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:max-w-xl">
            <Search className="h-4 w-4 text-[var(--muted-foreground)] absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("search_photos_placeholder")}
              className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] ps-9 pe-8 py-2 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute end-2.5 top-1/2 -translate-y-1/2 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
            <Link
              to="/admin/gallery"
              className="btn-base btn-gold text-xs py-2 px-4 flex items-center justify-center gap-1.5 w-full sm:w-auto"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>{t("manage_upload_photos")}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Symmetric Photos Grid */}
      <Section>
        <SectionHeading
          center={true}
          eyebrow={`${t("nav_gallery")} (${allDisplayItems.length})`}
          title={t("places_documents_portraits")}
          intro={t("gallery_intro_stored")}
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-stretch">
          {allDisplayItems.map((item, idx) => (
            <article
              key={item.id || idx}
              onClick={() => setSelectedPhoto(item)}
              className="surface-card group overflow-hidden cursor-pointer border border-[var(--gold)]/30 hover:border-[var(--gold)] transition-all hover:-translate-y-1 shadow-md flex h-full flex-col justify-between rounded-lg bg-[var(--card)] text-start"
            >
              <div>
                <div className="relative aspect-[4/3] overflow-hidden bg-[var(--card)]">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <span className="text-white text-xs font-semibold flex items-center gap-1">
                      <ZoomIn className="h-3.5 w-3.5 text-[var(--gold)]" />
                      <span>{t("view_high_res")}</span>
                    </span>
                  </div>
                  {item.year && (
                    <span className="absolute top-2.5 end-2.5 rounded-sm bg-black/70 px-2 py-0.5 text-[0.65rem] font-bold text-[var(--gold)] backdrop-blur-sm border border-[var(--gold)]/30">
                      {item.year}
                    </span>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-display font-bold text-base text-[var(--foreground)] group-hover:text-[var(--gold)] transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-[var(--muted-foreground)] line-clamp-2 leading-relaxed">
                    {item.caption}
                  </p>
                </div>
              </div>

              {item.location && (
                <div className="px-4 pb-4 pt-2 border-t border-[var(--gold)]/15 flex items-center justify-between text-[0.68rem] text-[var(--muted-foreground)]">
                  <span className="font-semibold text-[var(--gold)] flex items-center gap-1 truncate max-w-[150px]">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </span>
                  <span className="text-[0.62rem] uppercase tracking-wider">{t("archival_image")}</span>
                </div>
              )}
            </article>
          ))}
        </div>
      </Section>

      {/* Lightbox / Zoom Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="surface-card frame-gold relative max-w-4xl w-full overflow-hidden shadow-2xl p-4 sm:p-6 rounded-xl bg-[var(--card)] text-start"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label={t("close")}
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-3 end-3 rounded-full bg-[var(--background)] p-1.5 text-[var(--foreground)] hover:bg-[var(--gold)]/20 transition-colors cursor-pointer z-10"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="max-h-[60vh] overflow-hidden rounded-lg flex items-center justify-center bg-black/40">
              <img
                src={selectedPhoto.image}
                alt={selectedPhoto.title}
                className="max-h-[60vh] max-w-full object-contain rounded"
              />
            </div>

            <div className="mt-4 pt-4 border-t border-[var(--gold)]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-[var(--foreground)]">
                  {selectedPhoto.title}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-1 max-w-2xl leading-relaxed">
                  {selectedPhoto.caption}
                </p>
                {selectedPhoto.location && (
                  <p className="text-xs text-[var(--gold)] font-bold mt-1.5 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{selectedPhoto.location}</span>
                    {selectedPhoto.year && <span>• {selectedPhoto.year}</span>}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedPhoto(null)}
                  className="btn-base btn-outline text-xs py-2 px-4"
                >
                  {t("close")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
