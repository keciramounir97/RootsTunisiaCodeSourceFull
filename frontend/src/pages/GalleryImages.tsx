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
  ZoomIn,
  MessageSquare,
} from "lucide-react";
import { api } from "../api/client";
import { useTranslation } from "../context/TranslationContext";
import { useTheme } from "../context/ThemeContext";
import { useSiteContent } from "../hooks/useSiteContent";
import { useAuth } from "../admin/components/AuthContext";
import RootsPageShell from "../components/RootsPageShell";
import GalleryCommentsModal from "../components/GalleryCommentsModal";
import {
  getSocialLikes,
  toggleSocialLike,
  getTrackedUploads,
  resolveGalleryItemUrl,
  fetchBatchSocialCounts,
} from "../utils/gallerySocial";
import ResilientMediaImage from "../components/ResilientMediaImage";

import carthage from "../assets/slider-carthage.jpg";
import kairouan from "../assets/slider-kairouan.jpg";
import sidiBouSaid from "../assets/slider-sidibousaid.jpg";
import medina from "../assets/medina-tunis.jpg";
import eljem from "../assets/eljem.jpg";
import djerba from "../assets/djerba.jpg";

interface ImageItem {
  id: number | string;
  titleKey?: string;
  title: string;
  category: string;
  categoryKey?: string;
  governorate?: string;
  yearStr?: string;
  imageUrl: string;
  image_path?: string | null;
  descriptionKey?: string;
  description: string;
  likes?: number;
  isLiked?: boolean;
}

const baseCuratedImages: ImageItem[] = [
  {
    id: "img-tn-1",
    title: "Medina of Tunis Souk Alley & Archways",
    category: "Landmarks & Architecture",
    categoryKey: "img_cat_landmarks",
    governorate: "Tunis",
    yearStr: "c. 1910",
    imageUrl: medina,
    description: "Traditional arched souk alleyways in the historic Medina of Tunis, a UNESCO World Heritage site and home to centuries of family residences.",
    likes: 0,
  },
  {
    id: "img-tn-2",
    title: "Sidi Bou Saïd Blue and White Coastal Architecture",
    category: "Landmarks & Architecture",
    categoryKey: "img_cat_landmarks",
    governorate: "Tunis / Sidi Bou Saïd",
    yearStr: "c. 1925",
    imageUrl: sidiBouSaid,
    description: "Famous cliffside village overlooking the Gulf of Tunis, renowned for its blue lattice windows (mashrabiya) and whitewashed walls.",
    likes: 0,
  },
  {
    id: "img-tn-3",
    title: "Great Mosque of Kairouan & Ancient Minaret",
    category: "Historic Landmarks",
    categoryKey: "img_cat_historic",
    governorate: "Kairouan",
    yearStr: "c. 1900",
    imageUrl: kairouan,
    description: "The premier spiritual and scholarship sanctuary of North Africa, founded in 670 AD, keeping family lineage registers and waqf charters.",
    likes: 0,
  },
  {
    id: "img-tn-4",
    title: "Roman Amphitheatre of El Jem",
    category: "Ancient Heritage",
    categoryKey: "img_cat_ancient",
    governorate: "Mahdia / El Jem",
    yearStr: "Historical Monument",
    imageUrl: eljem,
    description: "The majestic Roman amphitheatre of Thysdrus (El Jem), illustrating the deep antiquity and epigraphic legacy of central Tunisia.",
    likes: 0,
  },
  {
    id: "img-tn-5",
    title: "Traditional Domed Djerban Menzel Architecture",
    category: "Regional Heritage",
    categoryKey: "img_cat_regional",
    governorate: "Médenine / Djerba",
    yearStr: "c. 1930",
    imageUrl: djerba,
    description: "Distinctive whitewashed domed houses (menzels) in Djerba, reflecting centuries of island community settlement and family heritage.",
    likes: 0,
  },
  {
    id: "img-tn-6",
    title: "Medina of Tunis Ornate Studded Door & Blue Grille",
    category: "Landmarks & Architecture",
    categoryKey: "img_cat_landmarks",
    governorate: "Tunis",
    yearStr: "c. 1915",
    imageUrl: medina,
    description: "Ornate studded wooden door with wrought-iron grille in the Medina of Tunis, reflecting patrician architectural heritage.",
    likes: 0,
  },
];

export default function GalleryImages() {
  const { theme } = useTheme();
  const { t, isRtl } = useTranslation();
  const { getText, getImage } = useSiteContent();
  const { user } = useAuth();

  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [activeImage, setActiveImage] = useState<ImageItem | null>(null);
  const [commentTarget, setCommentTarget] = useState<{
    mediaKey: string;
    title: string;
    subtitle?: string;
    likes: number;
    entityType?: string;
    entityId?: number;
  } | null>(null);

  const loadAllImages = async () => {
    try {
      setLoading(true);
      let items: any[] = [];
      try {
        const { data } = await api.get("/gallery");
        items = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
      } catch {
        // fallback
      }

      const formatted = items.map((it: any) => {
        const key = `gallery_img_${it.id}`;
        const social = getSocialLikes(key, 0);
        return {
          id: it.id,
          title: it.title || "Archival Image",
          category: it.category || "Regional Heritage",
          governorate: it.governorate || it.location || "Tunisia",
          yearStr: it.year || "",
          imageUrl: resolveGalleryItemUrl(it, undefined, medina),
          image_path: it.image_path || it.imagePath || it.imageUrl || it.url || null,
          description: it.description || it.caption || "",
          likes: social.count,
          isLiked: social.isLiked,
        };
      });

      const tracked = getTrackedUploads("images").map((it: any) => {
        const key = `gallery_img_${it.id}`;
        const social = getSocialLikes(key, 0);
        return {
          id: it.id,
          title: it.title || "Uploaded Image",
          category: it.category || "Heritage Archives",
          governorate: it.location || it.governorate || "Tunisia",
          yearStr: it.year || "Uploaded",
          imageUrl: resolveGalleryItemUrl(it, undefined, medina),
          image_path: it.image_path || it.imageUrl || it.url || null,
          description: it.description || "",
          likes: social.count,
          isLiked: social.isLiked,
          isUserUpload: true,
        };
      });

      const curated = baseCuratedImages.map((it) => {
        const key = `gallery_img_${it.id}`;
        const social = getSocialLikes(key, 0);
        return {
          ...it,
          likes: social.count,
          isLiked: social.isLiked,
        };
      });

      const combined = [...tracked, ...formatted, ...curated];
      setImages(combined);

      // Asynchronously fetch live database counts
      const allKeys = combined.map((x) => `gallery_img_${x.id}`);
      fetchBatchSocialCounts(allKeys)
        .then((batch) => {
          if (batch && Object.keys(batch).length > 0) {
            setImages((prev) =>
              prev.map((item) => {
                const k = `gallery_img_${item.id}`;
                if (batch[k]) {
                  return {
                    ...item,
                    likes: batch[k].count,
                    isLiked: batch[k].isLiked ?? item.isLiked,
                  };
                }
                return item;
              })
            );
          }
        })
        .catch(() => {});
    } catch {
      setImages(baseCuratedImages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    loadAllImages();

    const handleUploadsChanged = (e: any) => {
      if (!e.detail || e.detail.kind === "images") {
        loadAllImages();
      }
    };
    window.addEventListener("roots:uploads-changed", handleUploadsChanged);
    return () => window.removeEventListener("roots:uploads-changed", handleUploadsChanged);
  }, []);

  const categoryOptions = [
    { key: "All", labelKey: "cat_all" },
    { key: "Landmarks & Architecture", labelKey: "img_cat_landmarks" },
    { key: "Historic Landmarks", labelKey: "img_cat_historic" },
    { key: "Family Portraits", labelKey: "img_cat_portraits" },
    { key: "Regional Heritage", labelKey: "img_cat_regional" },
    { key: "Ancient Heritage", labelKey: "img_cat_ancient" },
  ];

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

  const toggleLike = async (id: number | string) => {
    if (!user) {
      alert(
        t(
          "legacy.login_to_like",
          "Vous devez être connecté avec un compte pour aimer une photo. / Please sign in to like this photo."
        )
      );
      return;
    }
    const key = `gallery_img_${id}`;
    const target = images.find((i) => i.id === id);
    const result = await toggleSocialLike(
      key,
      target?.likes || 0,
      undefined,
      "image",
      Number(id) || undefined
    );
    setImages((prev) =>
      prev.map((img) => {
        if (img.id === id) {
          return {
            ...img,
            isLiked: result.isLiked,
            likes: result.count,
          };
        }
        return img;
      })
    );
  };

  return (
    <RootsPageShell
      heroBackgroundUrl={getImage("gallery_images", "hero", "image") ?? getImage("gallery", "hero", "image")}
      hero={
        <div className="space-y-4 text-center">
          <p className="eyebrow text-[var(--gold)] text-shadow-gold tracking-widest font-bold">
            {getText("gallery_images", "hero", "eyebrow") ?? getText("gallery", "hero", "eyebrow") ?? t("nav_photos")}
          </p>
          <h1 className="display-xl text-white font-bold hero-title-shadow text-shadow-glow tracking-wide">
            {getText("gallery_images", "hero", "title") ?? getText("gallery", "hero", "title") ?? t("gallery_teaser_title")}
          </h1>
          <div className="gold-rule mt-4 w-28 mx-auto shadow-lg" />
          <p className="max-w-3xl mx-auto text-base text-slate-100/95 font-medium drop-shadow-md">
            {getText("gallery_images", "hero", "subtitle") ?? getText("gallery", "hero", "subtitle") ?? t("gallery_teaser_subtitle")}
          </p>
        </div>
      }
    >
      <div className="w-full space-y-8">
        {/* Search & Categories Bar */}
        <div className="surface-card p-4 sm:p-5 rounded-lg border border-[var(--gold)]/35 bg-[var(--card)]/95 shadow-md flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[var(--muted-foreground)] absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={t("search_images_placeholder")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full ps-9 pe-3 py-2 text-xs rounded-md border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 scrollbar-thin">
            <Filter className="w-4 h-4 text-[var(--gold)] shrink-0" />
            {categoryOptions.map((catOpt) => (
              <button
                key={catOpt.key}
                type="button"
                onClick={() => setCategoryFilter(catOpt.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                  categoryFilter === catOpt.key
                    ? "bg-[var(--gold)] text-[#1f160f] shadow-sm font-bold"
                    : "bg-[var(--card)] text-[var(--foreground)] border border-[var(--border)] hover:border-[var(--gold)]"
                }`}
              >
                {t(catOpt.labelKey)}
              </button>
            ))}
          </div>
        </div>

        {/* Images Grid */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="surface-card frame-gold p-12 text-center rounded-lg space-y-4 max-w-xl mx-auto my-8">
            <Camera className="w-12 h-12 text-[var(--gold)] mx-auto opacity-80" />
            <h3 className="text-xl font-display font-bold text-[var(--foreground)]">
              {t("no_records_found")}
            </h3>
            <p className="text-sm text-[var(--muted-foreground)]">
              {t("search_photos_placeholder")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-stretch">
            {filteredImages.map((img) => (
              <article
                key={img.id}
                className="surface-card frame-gold group overflow-hidden transition-all hover:-translate-y-1 shadow-md flex h-full flex-col justify-between rounded-lg bg-[var(--card)] text-start"
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
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <span className="text-white text-xs font-semibold flex items-center gap-1.5">
                        <ZoomIn className="h-3.5 w-3.5 text-[#f5c857]" />
                        <span>{t("view_high_res")}</span>
                      </span>
                    </div>
                    {img.yearStr && (
                      <span className="absolute top-2.5 end-2.5 rounded-md bg-[#140f0a]/85 px-2.5 py-1 text-xs font-mono font-bold text-[#f5c857] backdrop-blur-md border border-[#f5c857]/40 shadow-sm">
                        {img.yearStr}
                      </span>
                    )}
                  </div>

                  <div className="p-4 sm:p-5">
                    <h3 className="font-display font-bold text-base sm:text-lg text-[var(--foreground)] group-hover:text-[var(--gold)] transition-colors line-clamp-1">
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
                      onClick={() => toggleLike(img.id)}
                      className={`flex items-center gap-1.5 text-xs transition-colors cursor-pointer ${
                        img.isLiked
                          ? "text-rose-500 font-bold"
                          : "text-[var(--muted-foreground)] hover:text-rose-500"
                      }`}
                      title={t("like", "Like")}
                    >
                      <Heart
                        className={`h-3.5 w-3.5 ${
                          img.isLiked ? "fill-rose-500 text-rose-500" : ""
                        }`}
                      />
                      <span>{img.likes || 0}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setCommentTarget({
                          mediaKey: `gallery_img_${img.id}`,
                          title: img.title,
                          subtitle: img.governorate || img.category,
                          likes: img.likes || 0,
                          entityType: "image",
                          entityId: Number(img.id) || undefined,
                        })
                      }
                      className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] hover:text-[var(--gold)] transition-colors cursor-pointer"
                      title={t("comments", "Comments")}
                    >
                      <MessageSquare className="h-3.5 w-3.5 text-[var(--gold)]" />
                      <span>{t("comment", "Comment")}</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
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
                <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-1 max-w-2xl leading-relaxed">
                  {activeImage.description}
                </p>
                {activeImage.governorate && (
                  <p className="text-xs text-[var(--gold)] font-bold mt-1.5 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{activeImage.governorate}</span>
                    {activeImage.yearStr && <span>• {activeImage.yearStr}</span>}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => toggleLike(activeImage.id)}
                  className="btn-base btn-outline text-xs py-2 px-3 flex items-center gap-1.5"
                >
                  <Heart className={`h-4 w-4 ${activeImage.isLiked ? "fill-rose-500 text-rose-500" : ""}`} />
                  <span>{activeImage.likes || 0}</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setCommentTarget({
                      mediaKey: `gallery_img_${activeImage.id}`,
                      title: activeImage.title,
                      subtitle: activeImage.governorate || activeImage.category,
                      likes: activeImage.likes || 0,
                      entityType: "image",
                      entityId: Number(activeImage.id) || undefined,
                    })
                  }
                  className="btn-base btn-gold text-xs py-2 px-3 flex items-center gap-1.5"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>{t("comments", "Comments")}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveImage(null)}
                  className="btn-base btn-outline text-xs py-2 px-4"
                >
                  {t("close")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {commentTarget && (
        <GalleryCommentsModal
          isOpen={Boolean(commentTarget)}
          onClose={() => setCommentTarget(null)}
          mediaKey={commentTarget.mediaKey}
          itemTitle={commentTarget.title}
          itemSubtitle={commentTarget.subtitle}
          defaultLikes={commentTarget.likes}
          entityType={commentTarget.entityType}
          entityId={commentTarget.entityId}
        />
      )}
    </RootsPageShell>
  );
}
