import { useEffect, useRef, useState } from "react";
import { useTranslation } from "../../context/TranslationContext";
import { api } from "../../api/client";
import { getApiRoot } from "../../api/helpers";
import {
  SlidersHorizontal,
  Image as ImageIcon,
  Upload,
  RefreshCw,
  Save,
  Info,
  Trash2,
} from "lucide-react";
import Toast from "../../components/Toast";

const MIN_W = 1920;
const MIN_H = 1080;
const RATIO_MIN = 1.7;
const RATIO_MAX = 1.85;

interface BannerSlide {
  id: number;
  imagePath: string;
  imageUrl?: string;
  width: number | null;
  height: number | null;
  title?: string | null;
  caption?: string | null;
  isActive: boolean;
  sortOrder?: number;
  createdAt?: string;
}

function resolveMediaUrl(pathOrUrl?: string | null) {
  const raw = String(pathOrUrl || "").trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw) || raw.startsWith("data:")) return raw;
  const root = String(getApiRoot() || "").replace(/\/+$/, "");
  if (raw.startsWith("/")) return `${root}${raw}`;
  return `${root}/${raw}`;
}

function isValidBannerDimensions(width: number, height: number) {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return false;
  }
  const ratio = width / height;
  return width >= MIN_W && height >= MIN_H && ratio >= RATIO_MIN && ratio <= RATIO_MAX;
}

function readImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const width = img.naturalWidth || 0;
      const height = img.naturalHeight || 0;
      URL.revokeObjectURL(url);
      resolve({ width, height });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to read image"));
    };
    img.src = url;
  });
}

function normalizeSlide(row: any): BannerSlide {
  return {
    id: Number(row.id),
    imagePath: row.imagePath || row.image_path || row.imageUrl || row.image_url || "",
    imageUrl: row.imageUrl || row.image_url || row.imagePath || row.image_path || "",
    width: row.width != null ? Number(row.width) : null,
    height: row.height != null ? Number(row.height) : null,
    title: row.title || null,
    caption: row.caption || null,
    isActive: Boolean(row.isActive ?? row.is_active),
    sortOrder: Number(row.sortOrder ?? row.sort_order ?? 0),
    createdAt: row.createdAt || row.created_at,
  };
}

export default function Diaporama() {
  const { t, isRtl } = useTranslation();
  const [slides, setSlides] = useState<BannerSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const [toast, setToast] = useState<{ message: string; tone: "success" | "error" }>({
    message: "",
    tone: "success",
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const loadSlides = async () => {
    setLoading(true);
    try {
      let res = await api.get("/admin/banner-slides");
      let raw = res.data?.data ?? res.data;
      let list = Array.isArray(raw) ? raw : [];

      // First visit: import the homepage slides already playing so they appear as cards
      if (list.length === 0) {
        try {
          const seeded = await api.post("/admin/banner-slides/seed-defaults");
          const payload = seeded.data?.data ?? seeded.data;
          list = Array.isArray(payload?.slides)
            ? payload.slides
            : Array.isArray(payload)
              ? payload
              : [];
          if (!list.length) {
            res = await api.get("/admin/banner-slides");
            raw = res.data?.data ?? res.data;
            list = Array.isArray(raw) ? raw : [];
          }
        } catch {
          /* keep empty if seed unavailable */
        }
      }

      setSlides(list.map(normalizeSlide));
      setUploadErrors([]);
    } catch {
      setToast({
        message: t("diaporama_fetch_error", "Impossible de charger les bannières / فشل تحميل البانرات"),
        tone: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSlides();
  }, []);

  const activeSlides = slides.filter((s) => s.isActive);
  const librarySlides = slides.filter((s) => !s.isActive);
  const activeCount = activeSlides.length;

  const renderSlideCard = (slide: BannerSlide) => {
    const thumb = resolveMediaUrl(slide.imagePath || slide.imageUrl);
    return (
      <div
        key={slide.id}
        className={`rounded-2xl border overflow-hidden flex flex-col shadow-sm ${
          slide.isActive
            ? "border-[var(--gold)] bg-[var(--card)] ring-2 ring-[var(--gold)]/20"
            : "border-[var(--border)] bg-[var(--card)]"
        }`}
      >
        <div className="relative aspect-video w-full bg-black/40 overflow-hidden">
          <img
            src={thumb}
            alt={slide.title || `Banner #${slide.id}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 end-2 flex flex-col items-end gap-1">
            {slide.isActive ? (
              <span className="px-2 py-0.5 rounded-lg text-[0.65rem] font-bold uppercase tracking-wide bg-[var(--gold)] text-black border border-black/10">
                {t("playing_now_badge", "En lecture")}
              </span>
            ) : null}
            <span className="px-2 py-0.5 rounded-lg text-[0.7rem] font-mono font-bold bg-black/75 text-white/90 border border-white/20">
              {slide.width || "?"} × {slide.height || "?"}
            </span>
          </div>
          <label className="absolute bottom-2 start-2 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/30 text-white text-xs font-bold cursor-pointer">
            <input
              type="checkbox"
              checked={slide.isActive}
              onChange={() => togglePlay(slide.id)}
              className="w-4 h-4 rounded accent-[var(--gold)] cursor-pointer"
            />
            <span>{t("play_in_diaporama", "Play in diaporama")}</span>
          </label>
        </div>

        <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
          <div className="space-y-1.5">
            <h4 className="text-sm font-bold text-[var(--foreground)] truncate">
              {slide.title || `Banner #${slide.id}`}
            </h4>
            <label className="block text-[0.7rem] font-medium text-[var(--muted-foreground)] mb-1">
              {t("diaporama_slide_caption", "Légende (optionnelle)")}
            </label>
            <input
              type="text"
              value={slide.caption || ""}
              onChange={(e) => updateCaption(slide.id, e.target.value)}
              placeholder={t("empty_means_no_mention", "Sans légende")}
              className="w-full px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)] transition-colors"
            />
          </div>

          <div className="pt-2 border-t border-[var(--border)]/60 flex items-center justify-end">
            <button
              type="button"
              onClick={() => handleDelete(slide.id)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-500 hover:underline cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {t("delete", "Supprimer")}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const togglePlay = (id: number) => {
    setSlides((prev) =>
      prev.map((slide) =>
        slide.id === id ? { ...slide, isActive: !slide.isActive } : slide,
      ),
    );
  };

  const updateCaption = (id: number, caption: string) => {
    setSlides((prev) =>
      prev.map((slide) => (slide.id === id ? { ...slide, caption } : slide)),
    );
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploading(true);
    const errors: string[] = [];
    let successCount = 0;

    for (const file of files) {
      try {
        const { width, height } = await readImageDimensions(file);
        if (!isValidBannerDimensions(width, height)) {
          const ratio = height ? (width / height).toFixed(2) : "?";
          const msg = t(
            "banner_dimension_reject",
            `Rejected "${file.name}": must be ≥1920×1080 and 16:9 (ratio 1.70–1.85). Got ${width}×${height} (ratio ${ratio}). / Refusé : minimum 1920×1080 et ratio 16:9 (1,70–1,85). Reçu ${width}×${height}.`,
          );
          errors.push(msg);
          continue;
        }

        const formData = new FormData();
        formData.append("image", file);
        formData.append("width", String(width));
        formData.append("height", String(height));
        formData.append("title", file.name.replace(/\.[^/.]+$/, ""));

        const res = await api.post("/admin/banner-slides", formData);
        const created = normalizeSlide(res.data?.data ?? res.data);
        setSlides((prev) => [created, ...prev]);
        successCount += 1;
      } catch (err: any) {
        const serverMsg =
          err?.response?.data?.message ||
          err?.userMessage ||
          t("diaporama_upload_error", "Échec du téléversement / فشل الرفع");
        errors.push(`${file.name}: ${Array.isArray(serverMsg) ? serverMsg.join(", ") : serverMsg}`);
      }
    }

    setUploadErrors(errors);
    if (successCount > 0) {
      setToast({
        message: t(
          "diaporama_upload_success",
          `${successCount} bannière(s) téléversée(s) / تم رفع ${successCount} بانر`,
        ),
        tone: "success",
      });
    } else if (errors.length) {
      setToast({
        message: t(
          "banner_dimension_reject",
          "Certaines images ont été refusées (dimensions / ratio 16:9).",
        ),
        tone: "error",
      });
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSaveSelection = async () => {
    setSaving(true);
    try {
      const ids = slides.filter((s) => s.isActive).map((s) => s.id);
      const res = await api.put("/admin/banner-slides/selection", { ids });
      const raw = res.data?.data ?? res.data;
      if (Array.isArray(raw)) {
        setSlides(raw.map(normalizeSlide));
      }

      // Persist optional captions for active/inactive cards
      await Promise.all(
        slides.map(async (slide) => {
          if (slide.caption == null) return;
          try {
            await api.patch(`/admin/banner-slides/${slide.id}`, {
              caption: slide.caption,
            });
          } catch {
            /* non-blocking */
          }
        }),
      );

      setToast({
        message: t(
          "diaporama_save_success",
          `Sélection diaporama enregistrée (${ids.length} actives)`,
        ),
        tone: "success",
      });
      await loadSlides();
    } catch {
      setToast({
        message: t("diaporama_save_error", "Échec de l'enregistrement / فشل الحفظ"),
        tone: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(t("confirm_delete_banner", "Supprimer cette bannière ? / حذف هذا البانر؟"))) {
      return;
    }
    try {
      await api.delete(`/admin/banner-slides/${id}`);
      setSlides((prev) => prev.filter((s) => s.id !== id));
      setToast({
        message: t("banner_deleted", "Bannière supprimée / تم الحذف"),
        tone: "success",
      });
    } catch {
      setToast({
        message: t("banner_delete_error", "Échec de la suppression / فشل الحذف"),
        tone: "error",
      });
    }
  };

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="space-y-6 text-start pb-16">
      {toast.message ? (
        <Toast
          message={toast.message}
          tone={toast.tone}
          onClose={() => setToast({ message: "", tone: "success" })}
        />
      ) : null}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--gold)]/20">
        <div className="flex items-center gap-2">
          <div className="p-2.5 rounded-xl bg-[var(--gold)]/20 text-[var(--gold)] border border-[var(--gold)]/30">
            <SlidersHorizontal className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-[var(--foreground)]">
              {t("diaporama_title", "Bannière / Banner Diaporama")}
            </h1>
            <p className="text-xs text-[var(--muted-foreground)]">
              {t(
                "diaporama_subtitle",
                "Téléversez des bannières 16:9 (≥1920×1080) et choisissez celles à jouer sur l'accueil",
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/jpeg,image/png,image/gif,image/webp,.jpg,.jpeg,.png,.gif,.webp"
            multiple
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-3.5 py-2 rounded-xl border border-[var(--gold)]/40 bg-[var(--card)] hover:border-[var(--gold)] text-xs font-semibold text-[var(--foreground)] flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-60"
          >
            <Upload className={`w-4 h-4 text-[var(--gold)] ${uploading ? "animate-bounce" : ""}`} />
            <span>{t("upload_banner_images", "Téléverser des bannières")}</span>
          </button>

          <button
            type="button"
            onClick={handleSaveSelection}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[var(--gold)] to-amber-600 text-black text-xs font-bold flex items-center gap-1.5 shadow-md hover:opacity-95 transition-all cursor-pointer disabled:opacity-60"
          >
            <Save className={`w-4 h-4 ${saving ? "animate-spin" : ""}`} />
            <span>{t("save_diaporama_selection", "Save diaporama selection")}</span>
          </button>
        </div>
      </div>

      <div className="p-4 rounded-2xl border border-[var(--gold)]/30 bg-[var(--gold)]/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-[var(--gold)]/20 text-[var(--gold)] shrink-0 mt-0.5">
            <Info className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-[var(--foreground)]">
              {t("aspect_ratio_recommendation_title", "Critères 16:9 obligatoires")}
            </h3>
            <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
              {t(
                "banner_dimension_reject",
                "Chaque image doit faire au moins 1920×1080 px avec un ratio entre 1.70 et 1.85. Sinon elle est refusée et n'est pas enregistrée.",
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
            16:9 · ≥ 1920×1080
          </div>
          <div className="px-3 py-1.5 rounded-xl border border-[var(--gold)]/30 bg-[var(--card)] text-[var(--gold)] text-xs font-bold font-mono">
            {activeCount} {t("active_slides", "actives")}
          </div>
          <button
            type="button"
            onClick={loadSlides}
            className="p-2 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {uploadErrors.length > 0 ? (
        <div className="p-4 rounded-xl border border-rose-400/40 bg-rose-500/10 text-rose-700 dark:text-rose-300 space-y-1.5">
          {uploadErrors.map((err) => (
            <p key={err} className="text-xs font-medium">
              {err}
            </p>
          ))}
        </div>
      ) : null}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : slides.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-[var(--border)] text-[var(--muted-foreground)] space-y-3">
          <ImageIcon className="w-12 h-12 mx-auto opacity-40 text-[var(--gold)]" />
          <p className="text-sm font-medium">
            {t("no_banner_slides", "Aucune bannière pour l'instant. Téléversez des images 16:9.")}
          </p>
          <button
            type="button"
            onClick={async () => {
              setLoading(true);
              try {
                await api.post("/admin/banner-slides/seed-defaults");
                await loadSlides();
              } catch {
                setLoading(false);
                setToast({
                  message: t("diaporama_seed_error", "Impossible d'importer les bannières actuelles"),
                  tone: "error",
                });
              }
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--gold)]/40 text-xs font-bold text-[var(--gold)] hover:bg-[var(--gold)]/10 cursor-pointer"
          >
            {t("import_current_banners", "Importer les bannières déjà en lecture")}
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          <section className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--gold)]">
                {t("playing_on_homepage", "En lecture sur l'accueil")} ({activeCount})
              </h2>
            </div>
            {activeSlides.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {activeSlides.map(renderSlideCard)}
              </div>
            ) : (
              <p className="text-xs text-[var(--muted-foreground)] italic">
                {t(
                  "no_active_banners",
                  "Aucune diapositive active. Cochez des cartes puis enregistrez la sélection.",
                )}
              </p>
            )}
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
              {t("banner_library", "Bibliothèque / nouvelles uploads")} ({librarySlides.length})
            </h2>
            {librarySlides.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {librarySlides.map(renderSlideCard)}
              </div>
            ) : (
              <p className="text-xs text-[var(--muted-foreground)] italic">
                {t(
                  "no_inactive_banners",
                  "Les nouvelles images téléversées apparaîtront ici tant qu'elles ne sont pas cochées pour le diaporama.",
                )}
              </p>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
