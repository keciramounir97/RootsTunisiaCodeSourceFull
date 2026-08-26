import { useEffect, useMemo, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  Camera,
  Search,
  Maximize2,
  X,
  Filter,
  MapPin,
  Calendar,
  Share2,
  Heart,
  Upload,
} from "lucide-react";
import { api } from "../api/client";
import { useTranslation } from "../context/TranslationContext";
import { useTheme } from "../context/ThemeContext";
import RootsPageShell from "../components/RootsPageShell";

import carthage from "../assets/slider-carthage.jpg";
import kairouan from "../assets/slider-kairouan.jpg";
import sidiBouSaid from "../assets/slider-sidibousaid.jpg";
import familyArchive from "../assets/family-archive.jpg";
import medina from "../assets/medina-tunis.jpg";
import eljem from "../assets/eljem.jpg";
import djerba from "../assets/djerba.jpg";

interface ImageItem {
  id: number | string;
  title: string;
  category: string;
  governorate?: string;
  yearStr?: string;
  imageUrl: string;
  description: string;
  likes?: number;
  isLiked?: boolean;
}

const TUNISIAN_INITIAL_IMAGES: ImageItem[] = [
  {
    id: "img-tn-1",
    title: "Medina of Tunis Souk Alley & Archways",
    category: "Landmarks & Architecture",
    governorate: "Tunis",
    yearStr: "c. 1910",
    imageUrl: medina,
    description: "Traditional arched souk alleyways in the historic Medina of Tunis, a UNESCO World Heritage site and home to centuries of family residences.",
    likes: 88,
  },
  {
    id: "img-tn-2",
    title: "Sidi Bou Saïd Blue and White Coastal Architecture",
    category: "Landmarks & Architecture",
    governorate: "Tunis / Sidi Bou Saïd",
    yearStr: "c. 1925",
    imageUrl: sidiBouSaid,
    description: "Famous cliffside village overlooking the Gulf of Tunis, renowned for its blue lattice windows (mashrabiya) and whitewashed walls.",
    likes: 95,
  },
  {
    id: "img-tn-3",
    title: "Great Mosque of Kairouan & Ancient Minaret",
    category: "Historic Landmarks",
    governorate: "Kairouan",
    yearStr: "c. 1900",
    imageUrl: kairouan,
    description: "The premier spiritual and scholarship sanctuary of North Africa, founded in 670 AD, keeping family lineage registers and waqf charters.",
    likes: 112,
  },
  {
    id: "img-tn-4",
    title: "Roman Amphitheatre of El Jem",
    category: "Ancient Heritage",
    governorate: "Mahdia / El Jem",
    yearStr: "Historical Monument",
    imageUrl: eljem,
    description: "The majestic Roman amphitheatre of Thysdrus (El Jem), illustrating the deep antiquity and epigraphic legacy of central Tunisia.",
    likes: 74,
  },
  {
    id: "img-tn-5",
    title: "Traditional Domed Djerban Menzel Architecture",
    category: "Regional Heritage",
    governorate: "Médenine / Djerba",
    yearStr: "c. 1930",
    imageUrl: djerba,
    description: "Distinctive whitewashed domed houses (menzels) in Djerba, reflecting centuries of island community settlement and family heritage.",
    likes: 67,
  },
  {
    id: "img-tn-6",
    title: "Tunisian Family Archival Portrait & Studio Photo",
    category: "Family Portraits",
    governorate: "Tunis",
    yearStr: "c. 1915",
    imageUrl: familyArchive,
    description: "Restored vintage family portrait from an early 20th century studio in Tunis, capturing traditional attire and ancestral poise.",
    likes: 104,
  },
];

export default function GalleryImages() {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [activeImage, setActiveImage] = useState<ImageItem | null>(null);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/gallery");
        const items = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        if (items.length > 0) {
          setImages(items);
        } else {
          setImages(TUNISIAN_INITIAL_IMAGES);
        }
      } catch {
        setImages(TUNISIAN_INITIAL_IMAGES);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const categories = ["All", "Landmarks & Architecture", "Historic Landmarks", "Family Portraits", "Regional Heritage", "Ancient Heritage"];

  const filteredImages = useMemo(() => {
    return images.filter((item) => {
      const matchQuery =
        !query ||
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        (item.governorate && item.governorate.toLowerCase().includes(query.toLowerCase())) ||
        item.description.toLowerCase().includes(query.toLowerCase());
      const matchCat = categoryFilter === "All" || item.category === categoryFilter;
      return matchQuery && matchCat;
    });
  }, [images, query, categoryFilter]);

  const toggleLike = (id: number | string) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === id
          ? {
              ...img,
              isLiked: !img.isLiked,
              likes: img.isLiked ? (img.likes || 0) - 1 : (img.likes || 0) + 1,
            }
          : img
      )
    );
  };

  return (
    <RootsPageShell
      hero={
        <div className="space-y-4 text-center">
          <p className="eyebrow text-[var(--gold)]">
            {t("nav_photos", "Roots Tunisia Photo Gallery")}
          </p>
          <h1 className="display-xl text-[var(--foreground)] font-serif">
            {t("visual_gallery_title", "Photo & Visual Heritage Gallery")}
          </h1>
          <p className="max-w-3xl mx-auto text-base opacity-90 text-[var(--muted-foreground)]">
            {t(
              "visual_gallery_desc",
              "Discover vintage family portraits, historic urban views of Tunis, Sfax & Sousse, and iconic landmarks across the 24 governorates.",
            )}
          </p>
        </div>
      }
    >
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Search & Categories */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[var(--muted-foreground)] absolute start-3 top-2.5" />
            <input
              type="text"
              placeholder={t("search_images_placeholder", "Search photos, landmarks, or governorate…")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full ps-9 pe-3 py-1.5 text-xs rounded-sm border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
            <Filter className="w-4 h-4 text-[var(--gold)] shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                  categoryFilter === cat
                    ? "bg-[var(--primary)] text-white shadow-sm"
                    : "bg-[var(--card)] text-[var(--foreground)] border border-[var(--border)] hover:border-[var(--gold)]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Image Grid */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((img) => (
              <div
                key={img.id}
                className="surface-card frame-gold rounded-lg overflow-hidden shadow-md flex flex-col justify-between group hover:-translate-y-1 transition-transform"
              >
                <div className="relative aspect-4/3 overflow-hidden bg-[var(--background)]">
                  <img
                    src={img.imageUrl}
                    alt={img.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      onClick={() => setActiveImage(img)}
                      className="p-2.5 rounded-full bg-black/70 text-white hover:text-[var(--gold)] transition-colors cursor-pointer"
                    >
                      <Maximize2 className="w-5 h-5" />
                    </button>
                  </div>
                  {img.yearStr && (
                    <span className="absolute bottom-2 start-2 px-2 py-0.5 rounded-sm bg-black/75 text-[0.65rem] font-mono font-bold text-[var(--gold)]">
                      {img.yearStr}
                    </span>
                  )}
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-[0.65rem] font-bold text-[var(--gold)] uppercase">
                    <span>{img.category}</span>
                    <span className="flex items-center gap-1 text-[var(--muted-foreground)]">
                      <MapPin className="w-3 h-3 text-[var(--primary)]" />
                      {img.governorate}
                    </span>
                  </div>

                  <h3 className="text-base font-serif font-bold text-[var(--foreground)] line-clamp-1">
                    {img.title}
                  </h3>

                  <p className="text-xs text-[var(--muted-foreground)] line-clamp-2 leading-relaxed">
                    {img.description}
                  </p>

                  <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-xs">
                    <button
                      onClick={() => toggleLike(img.id)}
                      className={`flex items-center gap-1 font-bold transition-colors cursor-pointer ${
                        img.isLiked ? "text-[var(--primary)]" : "text-[var(--muted-foreground)] hover:text-[var(--gold)]"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${img.isLiked ? "fill-current" : ""}`} />
                      <span>{img.likes || 0}</span>
                    </button>

                    <button
                      onClick={() => setActiveImage(img)}
                      className="text-[0.7rem] font-bold text-[var(--gold)] hover:underline cursor-pointer"
                    >
                      View Photo Details →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox Modal */}
        {activeImage && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="surface-card frame-gold p-6 rounded-lg max-w-3xl w-full space-y-4 bg-[var(--card)] shadow-2xl">
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                <div>
                  <span className="text-[0.65rem] font-bold uppercase text-[var(--gold)]">{activeImage.category}</span>
                  <h3 className="text-xl font-serif font-bold text-[var(--foreground)]">{activeImage.title}</h3>
                </div>
                <button onClick={() => setActiveImage(null)} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-hidden rounded-md border border-[var(--border)] max-h-[60vh] flex items-center justify-center bg-black">
                <img src={activeImage.imageUrl} alt={activeImage.title} className="max-h-[55vh] object-contain" />
              </div>

              <div className="space-y-2 text-xs text-[var(--foreground)]">
                <p className="leading-relaxed text-sm">{activeImage.description}</p>
                <div className="flex items-center gap-4 font-mono text-[0.7rem] text-[var(--muted-foreground)]">
                  <span><strong>Governorate:</strong> {activeImage.governorate || "Tunisia"}</span>
                  <span><strong>Year/Period:</strong> {activeImage.yearStr || "Historical Record"}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border)]">
                <button onClick={() => setActiveImage(null)} className="btn-base btn-outline-ink text-xs px-4 py-2 cursor-pointer">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </RootsPageShell>
  );
}
