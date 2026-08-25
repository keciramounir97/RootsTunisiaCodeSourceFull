import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Image as ImageIcon, X, ExternalLink, PlusCircle, Trash2, Edit3, ZoomIn } from "lucide-react";
import { api } from "../api/client";
import { getApiRoot } from "../api/helpers";
import { PageHero, Section, SectionHeading } from "../components/site/Primitives";
import { useTranslation } from "../context/TranslationContext";
import { useAuth } from "../admin/components/AuthContext";
import { localGalleryAssets, withLocalGalleryFallback, GalleryDataItem } from "../utils/galleryData";
import sidiBouSaid from "../assets/slider-sidibousaid.jpg";
import medina from "../assets/medina-tunis.jpg";
import eljem from "../assets/eljem.jpg";
import djerba from "../assets/djerba.jpg";
import carthage from "../assets/slider-carthage.jpg";
import kairouan from "../assets/slider-kairouan.jpg";
import manuscript from "../assets/manuscript.jpg";
import familyArchive from "../assets/family-archive.jpg";
import SEO from "../components/SEO";

// High-fidelity seeded archive photos
const baseCuratedItems: { id: string; image: string; title: string; caption: string; location?: string; year?: string; isLocal?: boolean }[] = [
  { id: "carthage-1", image: carthage, title: "Carthage Byrsa Hill & Roman Forum", caption: "Punic foundations and Roman Africa proconsularis ruins overlooking the Gulf of Tunis.", location: "Carthage, Tunis", year: "c. 1920" },
  { id: "kairouan-1", image: kairouan, title: "Great Mosque of Kairouan Courtyard", caption: "Oldest minaret and Islamic jurisprudential nasab manuscript repository in North Africa.", location: "Kairouan", year: "c. 1910" },
  { id: "medina-1", image: medina, title: "Medina of Tunis & Rue de la Kasbah", caption: "Historic covered souks, patrician palaces, and the Zitouna University quarter.", location: "Medina, Tunis", year: "c. 1905" },
  { id: "eljem-1", image: eljem, title: "Amphitheatre of El Jem (Thysdrus)", caption: "Monumental Roman colosseum in the Sahelian olive-growing plains.", location: "El Jem, Mahdia", year: "c. 1915" },
  { id: "djerba-1", image: djerba, title: "Djerba Traditional Menzel & Palm Oases", caption: "Fortified island menzel architecture, ibadi watchtowers, and olive orchards.", location: "Houmt Souk, Djerba", year: "c. 1930" },
  { id: "sidibousaid-1", image: sidiBouSaid, title: "Sidi Bou Saïd Andalusian Village", caption: "Whitewashed walls and moucharabieh balconies above Cap Carthage.", location: "Sidi Bou Saïd, Tunis", year: "c. 1925" },
  { id: "manuscript-1", image: manuscript, title: "Charaïque Court Sijill with Beylical Seal", caption: "Handwritten Habous endowment and property inheritance deeds with official Ottoman tugra.", location: "Archives Nationales de Tunisie", year: "1874" },
  { id: "family-1", image: familyArchive, title: "Beldi Family Studio Portrait", caption: "Traditional embroidered silk jebba and farmla attire documented in Tunis photo studio.", location: "Tunis Medina", year: "c. 1918" },
];

export default function Gallery() {
  const location = useLocation();
  const { t } = useTranslation();
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
    // Start with local assets
    const list: any[] = [...baseCuratedItems];

    // Add all 15 local gallery assets
    localGalleryAssets.forEach((g, idx) => {
      list.push({
        id: String(g.id),
        image: g.imagePath || g.image_path,
        title: g.title || `Tunisian Archival Photograph #${idx + 1}`,
        caption: g.description || g.location || "Historical document & visual record from Tunisian heritage collections.",
        location: g.location || "Tunisia",
        year: g.year || "20th Century",
        isLocal: true,
      });
    });

    // Add API items
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
    <div className="bg-[var(--background)] text-[var(--foreground)] min-h-screen">
      <SEO
        title="Tunisian Visual Heritage — Roots Tunisia Photo Gallery"
        description="A visual archive of Tunisia: Carthage, Kairouan, the Medina of Tunis, El Jem, Djerba, Sidi Bou Saïd, manuscripts and family portraits."
        keywords={["Tunisia photo gallery", "Tunisian visual heritage", "Medina of Tunis photos"]}
      />

      <PageHero
        eyebrow={t("nav_photos", "Photo & Visual Gallery")}
        title={t("gallery_teaser_title", "Tunisian Visual Heritage")}
        subtitle={t("gallery_teaser_subtitle", "Historical photographs, court deeds, and family archives preserving the visual memory of Tunisia.")}
        image={sidiBouSaid}
      />

      {/* Search & Actions Bar */}
      <div className="mx-auto max-w-7xl px-5 pt-8">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="surface-card flex items-center gap-3 p-3 w-full sm:max-w-xl">
            <Search className="h-4 w-4 text-[var(--muted-foreground)] ml-2 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search photographs by city, governorate, topic or period…"
              className="w-full bg-transparent text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)]"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer pr-2"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/admin/gallery"
              className="btn-base btn-gold text-xs py-2.5 px-4 flex items-center gap-1.5"
            >
              <PlusCircle className="h-4 w-4" /> Manage & Upload Photos
            </Link>
          </div>
        </div>
      </div>

      <Section>
        <SectionHeading
          eyebrow={`Gallery (${allDisplayItems.length})`}
          title="Places, documents and portraits"
          intro="Images are stored with captions, dates, locations and the family or record they belong to."
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {allDisplayItems.map((item, idx) => (
            <div
              key={item.id || idx}
              onClick={() => setSelectedPhoto(item)}
              className="surface-card group overflow-hidden cursor-pointer border border-[var(--gold)]/30 hover:border-[var(--gold)] transition-all hover:-translate-y-1 shadow-md flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[var(--card)]">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <span className="text-white text-xs font-semibold flex items-center gap-1">
                    <ZoomIn className="h-3.5 w-3.5 text-[var(--gold)]" /> View High-Res
                  </span>
                </div>
                {item.year && (
                  <span className="absolute top-2.5 right-2.5 rounded-sm bg-black/65 px-2 py-0.5 text-[0.65rem] font-bold text-[var(--gold)] backdrop-blur-sm">
                    {item.year}
                  </span>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display font-bold text-lg text-[var(--foreground)] group-hover:text-[var(--gold)] transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-[var(--muted-foreground)] line-clamp-2 leading-relaxed">
                    {item.caption}
                  </p>
                </div>

                {item.location && (
                  <div className="mt-3 pt-2 border-t border-[var(--gold)]/20 flex items-center justify-between text-[0.68rem] text-[var(--muted-foreground)]">
                    <span className="font-semibold text-[var(--gold)]">{item.location}</span>
                    <span className="text-[0.62rem] uppercase tracking-wider">Archival Image</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Lightbox / Zoom Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="surface-card relative max-w-4xl w-full overflow-hidden border-2 border-[var(--gold)]/50 shadow-2xl p-4 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-3 right-3 rounded-full bg-[var(--background)] p-1.5 text-[var(--foreground)] hover:bg-[var(--gold)]/20 transition-colors cursor-pointer z-10"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="max-h-[60vh] overflow-hidden rounded flex items-center justify-center bg-black/40">
              <img
                src={selectedPhoto.image}
                alt={selectedPhoto.title}
                className="max-h-[60vh] max-w-full object-contain rounded"
              />
            </div>

            <div className="mt-4 pt-4 border-t border-[var(--gold)]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-display text-2xl font-bold text-[var(--foreground)]">
                  {selectedPhoto.title}
                </h3>
                <p className="text-sm text-[var(--muted-foreground)] mt-1 max-w-2xl leading-relaxed">
                  {selectedPhoto.caption}
                </p>
                {selectedPhoto.location && (
                  <p className="text-xs text-[var(--gold)] font-bold mt-1">
                    Location: {selectedPhoto.location} {selectedPhoto.year ? `· Date: ${selectedPhoto.year}` : ""}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  to="/admin/gallery"
                  className="btn-base btn-red text-xs py-2 px-3"
                >
                  <Edit3 className="h-3.5 w-3.5" /> Edit in Admin
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
