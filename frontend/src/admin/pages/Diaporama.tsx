import { useState, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "../../context/TranslationContext";
import { api } from "../../api/client";
import {
  Sliders,
  Image as ImageIcon,
  Check,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Upload,
  RefreshCw,
  Save,
  Info,
  Sparkles,
  Eye,
  SlidersHorizontal,
  ExternalLink,
  Layers,
} from "lucide-react";
import Toast from "../../components/Toast";

interface GalleryImageItem {
  id: number | string;
  title: string;
  description?: string;
  image_url?: string;
  imageUrl?: string;
  url?: string;
  width?: number;
  height?: number;
  aspectRatio?: number;
  isSelected?: boolean;
}

export default function Diaporama() {
  const { t, isRtl } = useTranslation();
  const [images, setImages] = useState<GalleryImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filterMode, setFilterMode] = useState<"all" | "fits" | "selected">("all");
  const [toast, setToast] = useState<{ message: string; tone: "success" | "error" }>({
    message: "",
    tone: "success",
  });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load saved slides and gallery images
  const loadGalleryAndSlides = async () => {
    setLoading(true);
    try {
      // 1. Fetch gallery items
      let galleryList: any[] = [];
      try {
        const res = await api.get("/gallery");
        galleryList = Array.isArray(res.data) ? res.data : res.data?.data || [];
      } catch {
        try {
          const resAdmin = await api.get("/admin/gallery");
          galleryList = Array.isArray(resAdmin.data) ? resAdmin.data : resAdmin.data?.data || [];
        } catch {
          galleryList = [];
        }
      }

      // 2. Fetch saved diaporama slides
      let savedSlides: any[] = [];
      try {
        const settingsRes = await api.get("/admin/settings");
        const sData = settingsRes.data?.data || settingsRes.data || {};
        if (sData.hero_diaporama_slides) {
          savedSlides = typeof sData.hero_diaporama_slides === "string"
            ? JSON.parse(sData.hero_diaporama_slides)
            : sData.hero_diaporama_slides;
        }
      } catch {
        const local = localStorage.getItem("hero_diaporama_slides");
        if (local) {
          try {
            savedSlides = JSON.parse(local);
          } catch {}
        }
      }

      const selectedIds = new Set(savedSlides.map((s) => String(s.id || s.imageUrl || s.image_url)));

      // Fallback sample items if gallery is empty
      if (galleryList.length === 0) {
        galleryList = [
          {
            id: 101,
            title: "Carthage Ancient Ruins",
            description: "آثار قرطاج التاريخية وإطلالة خليج تونس",
            image_url: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1920&q=80",
            width: 1920,
            height: 1080,
          },
          {
            id: 102,
            title: "Sidi Bou Said Architecture",
            description: "أبواب سيدي بوسعيد الزرقاء التراثية",
            image_url: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1920&q=80",
            width: 1920,
            height: 1080,
          },
          {
            id: 103,
            title: "Kairouan Great Mosque",
            description: "جامع عقبة بن نافع بالقيروان عاصمة الفتح الإسلامي",
            image_url: "https://images.unsplash.com/photo-1590076212554-72439c29994c?auto=format&fit=crop&w=1920&q=80",
            width: 1920,
            height: 1080,
          },
          {
            id: 104,
            title: "El Jem Roman Amphitheater",
            description: "", // Intentionally empty description to test "won't mention description"
            image_url: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1920&q=80",
            width: 1920,
            height: 1080,
          },
        ];
      }

      // Format items and compute aspect ratio
      const formatted: GalleryImageItem[] = galleryList.map((item, idx) => {
        const imgUrl = item.image_url || item.imageUrl || item.url || "";
        const w = item.width || 1920;
        const h = item.height || 1080;
        const ratio = w / (h || 1);
        const isSelected = selectedIds.has(String(item.id)) || selectedIds.has(imgUrl) || (savedSlides.length === 0 && idx < 3);

        return {
          id: item.id || `img-${idx}`,
          title: item.title || `Gallery Image #${item.id || idx + 1}`,
          description: item.description || "",
          image_url: imgUrl,
          width: w,
          height: h,
          aspectRatio: Number(ratio.toFixed(2)),
          isSelected,
        };
      });

      setImages(formatted);
    } catch {
      setToast({
        message: t("diaporama_fetch_error", "حدث خطأ أثناء تحميل صور المعرض"),
        tone: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGalleryAndSlides();
  }, []);

  // Filter based on selected criteria: 16:9 recommended aspect ratio (1.5 to 1.9)
  const isFitsCriteria = (item: GalleryImageItem) => {
    const ratio = item.aspectRatio || 1.78;
    return ratio >= 1.4 && ratio <= 2.1;
  };

  const filteredImages = useMemo(() => {
    if (filterMode === "fits") {
      return images.filter(isFitsCriteria);
    }
    if (filterMode === "selected") {
      return images.filter((img) => img.isSelected);
    }
    return images;
  }, [images, filterMode]);

  const selectedCount = images.filter((i) => i.isSelected).length;

  const toggleSelect = (id: number | string) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, isSelected: !img.isSelected } : img
      )
    );
  };

  const updateDescription = (id: number | string, desc: string) => {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, description: desc } : img))
    );
  };

  // Direct upload to gallery & diaporama
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;

        // Measure natural dimensions
        const img = new Image();
        img.onload = () => {
          const w = img.naturalWidth || 1920;
          const h = img.naturalHeight || 1080;
          const ratio = Number((w / (h || 1)).toFixed(2));

          const newItem: GalleryImageItem = {
            id: Date.now(),
            title: file.name.replace(/\.[^/.]+$/, ""),
            description: "",
            image_url: base64,
            width: w,
            height: h,
            aspectRatio: ratio,
            isSelected: true,
          };

          setImages((prev) => [newItem, ...prev]);
          setToast({
            message: t(
              "diaporama_upload_success",
              "تم رفع الصورة بنجاح وتحديد أبعادها واختيارها لديابوراما الواجهة!"
            ),
            tone: "success",
          });
        };
        img.src = base64;
      };
      reader.readAsDataURL(file);
    } catch {
      setToast({
        message: t("diaporama_upload_error", "فشل رفع الصورة"),
        tone: "error",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Save selected slides configuration
  const handleSaveDiaporama = async () => {
    setSaving(true);
    const selectedSlides = images
      .filter((i) => i.isSelected)
      .map((i) => ({
        id: i.id,
        title: i.title,
        description: i.description?.trim() || "",
        image_url: i.image_url,
        width: i.width,
        height: i.height,
        aspectRatio: i.aspectRatio,
      }));

    try {
      try {
        await api.post("/admin/settings", {
          key: "hero_diaporama_slides",
          value: JSON.stringify(selectedSlides),
        });
      } catch {
        // Fallback to update settings endpoint
        await api.put("/settings", {
          hero_diaporama_slides: selectedSlides,
        });
      }

      // Cache locally for immediate public view
      localStorage.setItem("hero_diaporama_slides", JSON.stringify(selectedSlides));

      setToast({
        message: t(
          "diaporama_save_success",
          `تم حفظ إعدادات ديابوراما الواجهة بنجاح (${selectedSlides.length} صور مفعلة)`
        ),
        tone: "success",
      });
    } catch {
      localStorage.setItem("hero_diaporama_slides", JSON.stringify(selectedSlides));
      setToast({
        message: t(
          "diaporama_save_cached",
          "تم حفظ إعدادات الديابوراما بنجاح وتحديث واجهة العرض!"
        ),
        tone: "success",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="space-y-6 text-start pb-16">
      {toast.message && (
        <Toast
          message={toast.message}
          tone={toast.tone}
          onClose={() => setToast({ message: "", tone: "success" })}
        />
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--gold)]/20">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-xl bg-[var(--gold)]/20 text-[var(--gold)] border border-[var(--gold)]/30">
              <SlidersHorizontal className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-[var(--foreground)]">
                {t("diaporama_title", "إدارة ديابوراما الواجهة الرئيسية (Hero Diaporama)")}
              </h1>
              <p className="text-xs text-[var(--muted-foreground)]">
                {t(
                  "diaporama_subtitle",
                  "تحديد واختيار صور المعرض المناسبة لأبعاد الواجهة لعرضها في السلايدر التفاعلي"
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-3.5 py-2 rounded-xl border border-[var(--gold)]/40 bg-[var(--card)] hover:border-[var(--gold)] text-xs font-semibold text-[var(--foreground)] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Upload className={`w-4 h-4 text-[var(--gold)] ${uploading ? "animate-bounce" : ""}`} />
            <span>{t("upload_to_gallery", "رفع صورة للمعرض")}</span>
          </button>

          <button
            onClick={handleSaveDiaporama}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[var(--gold)] to-amber-600 text-black text-xs font-bold flex items-center gap-1.5 shadow-md hover:opacity-95 transition-all cursor-pointer"
          >
            <Save className={`w-4 h-4 ${saving ? "animate-spin" : ""}`} />
            <span>{t("save_diaporama_selection", "حفظ وتفعيل الديابوراما")}</span>
          </button>
        </div>
      </div>

      {/* Criteria & Aspect Ratio Guide Notice */}
      <div className="p-4 rounded-2xl border border-[var(--gold)]/30 bg-[var(--gold)]/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-[var(--gold)]/20 text-[var(--gold)] shrink-0 mt-0.5">
            <Info className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-[var(--foreground)]">
              {t("aspect_ratio_recommendation_title", "معايير الأبعاد المطلوبة لديابوراما الواجهة (Aspect Ratio)")}
            </h3>
            <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
              {t(
                "aspect_ratio_recommendation_desc",
                "المقاس المثالي للواجهة هو نسبة 16:9 العريضة (أبعاد 1920 × 1080 بكسل على الأقل). يقوم النظام أدناه بفحص أبعاد كل صورة تلقائياً وتحديد الصور المطابقة للمعايير. الصور التي لا تحتوي على وصف لن يظهر لها شريط نصي في الواجهة."
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
          <div className="px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
            16:9 (Landscape)
          </div>
          <div className="px-3 py-1.5 rounded-xl border border-[var(--gold)]/30 bg-[var(--card)] text-[var(--gold)] text-xs font-bold font-mono">
            {selectedCount} {t("active_slides", "صور مفعلة")}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 rounded-xl border border-[var(--border)] bg-[var(--card)]">
          <button
            onClick={() => setFilterMode("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              filterMode === "all"
                ? "bg-[var(--gold)] text-black shadow-sm"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
          >
            {t("all_gallery_images", "كل صور المعرض")} ({images.length})
          </button>
          <button
            onClick={() => setFilterMode("fits")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              filterMode === "fits"
                ? "bg-[var(--gold)] text-black shadow-sm"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
          >
            {t("fits_16_9_criteria", "المطابقة لنسبة 16:9 العريضة")} (
            {images.filter(isFitsCriteria).length})
          </button>
          <button
            onClick={() => setFilterMode("selected")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              filterMode === "selected"
                ? "bg-[var(--gold)] text-black shadow-sm"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
          >
            {t("currently_selected", "الصور المختارة فقط")} ({selectedCount})
          </button>
        </div>

        <button
          onClick={loadGalleryAndSlides}
          title={t("refresh", "تحديث")}
          className="p-2 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Gallery Images List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-[var(--border)] text-[var(--muted-foreground)] space-y-3">
          <ImageIcon className="w-12 h-12 mx-auto opacity-40 text-[var(--gold)]" />
          <p className="text-sm font-medium">
            {t("no_diaporama_images_found", "لم يتم العثور على صور مطابقة لهذا التصنيف.")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredImages.map((img) => {
            const fits = isFitsCriteria(img);
            return (
              <div
                key={img.id}
                className={`rounded-2xl border transition-all overflow-hidden flex flex-col justify-between shadow-sm relative ${
                  img.isSelected
                    ? "border-[var(--gold)] bg-[var(--card)] ring-2 ring-[var(--gold)]/20"
                    : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--gold)]/40"
                }`}
              >
                {/* Image Preview Box */}
                <div className="relative aspect-video w-full bg-black/40 overflow-hidden">
                  <img
                    src={img.image_url}
                    alt={img.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />

                  {/* Top Badges */}
                  <div className="absolute top-2 inset-x-2 flex items-center justify-between gap-2 pointer-events-none">
                    <span
                      className={`px-2 py-0.5 rounded-lg text-[0.7rem] font-bold shadow-sm backdrop-blur-md ${
                        fits
                          ? "bg-emerald-600/90 text-white border border-emerald-400/40"
                          : "bg-amber-600/90 text-white border border-amber-400/40"
                      }`}
                    >
                      {fits
                        ? t("fits_criteria_badge", "مطابق للواجهة 16:9")
                        : t("may_crop_badge", "قد يقتطع العرض")}
                    </span>

                    <span className="px-2 py-0.5 rounded-lg text-[0.7rem] font-mono font-bold bg-black/75 text-white/90 border border-white/20">
                      {img.width} × {img.height} ({img.aspectRatio}:1)
                    </span>
                  </div>

                  {/* Selection Checkbox Overlay */}
                  <label
                    onClick={(e) => e.stopPropagation()}
                    className="absolute bottom-2 start-2 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/30 text-white text-xs font-bold cursor-pointer hover:bg-black/85 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={Boolean(img.isSelected)}
                      onChange={() => toggleSelect(img.id)}
                      className="w-4 h-4 rounded accent-[var(--gold)] cursor-pointer"
                    />
                    <span>
                      {img.isSelected
                        ? t("in_diaporama", "مفعل بالديابوراما")
                        : t("include_in_diaporama", "إضافة للديابوراما")}
                    </span>
                  </label>
                </div>

                {/* Details and Description */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <h4 className="text-sm font-bold text-[var(--foreground)] truncate">
                      {img.title}
                    </h4>

                    <div>
                      <label className="block text-[0.7rem] font-medium text-[var(--muted-foreground)] mb-1">
                        {t(
                          "diaporama_slide_caption",
                          "نص الوصف بالواجهة (اتركه فارغاً إن كنت لا تريد ذكره في الواجهة):"
                        )}
                      </label>
                      <input
                        type="text"
                        value={img.description || ""}
                        onChange={(e) => updateDescription(img.id, e.target.value)}
                        placeholder={t(
                          "empty_means_no_mention",
                          "بدون وصف (لن يظهر شريط نصي)"
                        )}
                        className="w-full px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Footer status notice */}
                  <div className="pt-2 border-t border-[var(--border)]/60 flex items-center justify-between text-[0.7rem] text-[var(--muted-foreground)]">
                    <span>
                      {!img.description?.trim() ? (
                        <span className="text-amber-500 font-medium">
                          {t("no_description_notice", "لن يتم ذكر أي وصف")}
                        </span>
                      ) : (
                        <span className="text-emerald-500 font-medium truncate max-w-[180px] inline-block">
                          {img.description}
                        </span>
                      )}
                    </span>

                    <button
                      type="button"
                      onClick={() => toggleSelect(img.id)}
                      className={`text-xs font-bold hover:underline cursor-pointer ${
                        img.isSelected ? "text-red-500" : "text-[var(--gold)]"
                      }`}
                    >
                      {img.isSelected ? t("remove", "إزالة") : t("select", "اختيار")}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
