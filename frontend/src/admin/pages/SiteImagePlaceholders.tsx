import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ExternalLink,
  Image as ImageIcon,
  Loader2,
  MapPinned,
  RefreshCw,
  Save,
  Upload,
  Layers,
  Sparkles,
  Search,
  CheckCircle2,
  Check,
  X,
  Eye,
  SlidersHorizontal,
} from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../../api/client";
import { getApiErrorMessage } from "../../api/helpers";
import { resolveSiteImageUrl } from "../../hooks/useSiteImages";
import { refreshSiteContent } from "../../hooks/useSiteContent";
import {
  SITE_IMAGE_LIBRARY,
  SITE_IMAGE_PLACEHOLDERS,
  type SiteImagePlaceholder,
  type SiteLibraryImage,
} from "../../config/siteImageLibrary";
import Toast from "../../components/Toast";
import MediaSelect, { type MediaOption } from "../../components/MediaSelect";

type FieldType = "text" | "html" | "image" | "list";
type FieldValue = string | string[];

interface ContentField {
  key: string;
  type: FieldType;
  label: string;
  hint?: string;
  value: FieldValue;
  translations?: Record<string, FieldValue>;
}
interface ContentSection {
  id: string;
  label: string;
  description?: string;
  fields: ContentField[];
}
interface ContentPage {
  id: string;
  label: string;
  description?: string;
  path?: string;
  sections: ContentSection[];
}
interface SiteContentDocument {
  version: number;
  updatedAt: string | null;
  updatedBy: number | null;
  pages: ContentPage[];
}

const imageField = (key: string, label: string, hint?: string): ContentField => ({
  key,
  type: "image",
  label,
  ...(hint ? { hint } : {}),
  value: "",
});

function ensurePlaceholderSlots(doc: SiteContentDocument): SiteContentDocument {
  const pages = [...(doc.pages || [])];
  for (const slot of SITE_IMAGE_PLACEHOLDERS) {
    let page = pages.find((p) => p.id === slot.pageId);
    if (!page) {
      page = {
        id: slot.pageId,
        label: slot.pageLabel,
        path: slot.pagePath,
        sections: [],
      };
      pages.push(page);
    }
    let section = page.sections.find((s) => s.id === slot.sectionId);
    if (!section) {
      section = {
        id: slot.sectionId,
        label: slot.sectionLabel,
        fields: [],
      };
      page.sections.push(section);
    }
    if (!section.fields.some((f) => f.key === slot.fieldKey)) {
      section.fields.push(imageField(slot.fieldKey, slot.fieldLabel, slot.hint));
    }
  }
  return { ...doc, pages };
}

function readImage(
  doc: SiteContentDocument | null,
  slot: SiteImagePlaceholder,
): string {
  if (!doc) return "";
  const page = doc.pages.find((p) => p.id === slot.pageId);
  const section = page?.sections.find((s) => s.id === slot.sectionId);
  const field = section?.fields.find((f) => f.key === slot.fieldKey);
  return typeof field?.value === "string" ? field.value : "";
}

function writeImage(
  doc: SiteContentDocument,
  slot: SiteImagePlaceholder,
  url: string,
): SiteContentDocument {
  const ensured = ensurePlaceholderSlots(doc);
  const pages = ensured.pages.map((page) => {
    if (page.id !== slot.pageId) return page;
    return {
      ...page,
      sections: page.sections.map((section) => {
        if (section.id !== slot.sectionId) return section;
        return {
          ...section,
          fields: section.fields.map((field) =>
            field.key === slot.fieldKey && field.type === "image"
              ? { ...field, value: url }
              : field,
          ),
        };
      }),
    };
  });
  return { ...ensured, pages };
}

export default function SiteImagePlaceholders() {
  const [doc, setDoc] = useState<SiteContentDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const [activeSlot, setActiveSlot] = useState<SiteImagePlaceholder | null>(null);
  const [showGalleryVolet, setShowGalleryVolet] = useState<boolean>(true);
  const [galleryFilterFolder, setGalleryFilterFolder] = useState<string>("all");
  const [gallerySearch, setGallerySearch] = useState<string>("");
  const [hoveredGalleryImage, setHoveredGalleryImage] = useState<SiteLibraryImage | null>(null);

  const [toast, setToast] = useState({
    message: "",
    tone: "success" as "success" | "error",
  });

  const notify = useCallback((message: string, tone: "success" | "error" = "success") => {
    setToast({ message, tone });
  }, []);

  useEffect(() => {
    if (!toast.message) return;
    const timer = window.setTimeout(() => setToast({ message: "", tone: "success" }), 3500);
    return () => window.clearTimeout(timer);
  }, [toast.message]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/site-content");
      const raw = (res.data?.data ?? res.data) as SiteContentDocument;
      setDoc(ensurePlaceholderSlots(raw));
    } catch (err) {
      notify(getApiErrorMessage(err, "Failed to load site image placeholders"), "error");
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    void load();
  }, [load]);

  const slots = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return SITE_IMAGE_PLACEHOLDERS;
    return SITE_IMAGE_PLACEHOLDERS.filter(
      (s) =>
        s.pageLabel.toLowerCase().includes(q) ||
        s.sectionLabel.toLowerCase().includes(q) ||
        s.fieldLabel.toLowerCase().includes(q) ||
        s.pagePath.toLowerCase().includes(q),
    );
  }, [filter]);

  const grouped = useMemo(() => {
    const map = new Map<string, SiteImagePlaceholder[]>();
    for (const slot of slots) {
      const key = `${slot.pageId}::${slot.pageLabel}::${slot.pagePath}`;
      const list = map.get(key) || [];
      list.push(slot);
      map.set(key, list);
    }
    return [...map.entries()];
  }, [slots]);

  const filledCount = useMemo(() => {
    if (!doc) return 0;
    return SITE_IMAGE_PLACEHOLDERS.filter((s) => Boolean(readImage(doc, s))).length;
  }, [doc]);

  const save = async () => {
    if (!doc) return;
    setSaving(true);
    try {
      const payload = ensurePlaceholderSlots(doc);
      const res = await api.put("/admin/site-content", { pages: payload.pages });
      const next = (res.data?.data ?? res.data) as SiteContentDocument;
      setDoc(ensurePlaceholderSlots(next));
      await refreshSiteContent();
      notify("Emplacements d'images du site enregistrés avec succès !");
    } catch (err) {
      notify(getApiErrorMessage(err, "Échec de l'enregistrement"), "error");
    } finally {
      setSaving(false);
    }
  };

  const setSlotImage = (slot: SiteImagePlaceholder, url: string) => {
    setDoc((prev) => (prev ? writeImage(prev, slot, url) : prev));
  };

  const uploadForSlot = async (slot: SiteImagePlaceholder, file: File) => {
    const key = `${slot.pageId}.${slot.sectionId}.${slot.fieldKey}`;
    setUploadingKey(key);
    try {
      const form = new FormData();
      form.append("image", file);
      const res = await api.post("/admin/site-content/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const url = String(res.data?.url || res.data?.data?.url || "");
      if (!url) throw new Error("No upload URL returned");
      setSlotImage(slot, url);
      notify(`Image téléversée pour ${slot.pageLabel} → ${slot.sectionLabel}`);
    } catch (err) {
      notify(getApiErrorMessage(err, "Échec du téléversement"), "error");
    } finally {
      setUploadingKey(null);
    }
  };

  // Convert SITE_IMAGE_LIBRARY into MediaOptions for MediaSelect
  const mediaOptions: MediaOption[] = useMemo(() => {
    return SITE_IMAGE_LIBRARY.map((img) => ({
      value: img.src,
      label: img.label,
      sublabel: img.src,
      type: "image",
      previewUrl: img.src,
      badge: img.region || "Patrimoine",
      details: `Fonds patrimonial de Tunisie · ${img.region || "Général"}`,
      category: img.region || "Général",
    }));
  }, []);

  // Filtered gallery for Volet 2
  const filteredGalleryImages = useMemo(() => {
    let list = SITE_IMAGE_LIBRARY;
    if (galleryFilterFolder !== "all") {
      list = list.filter((img) =>
        (img.region || "").toLowerCase().includes(galleryFilterFolder.toLowerCase()),
      );
    }
    if (gallerySearch.trim()) {
      const q = gallerySearch.trim().toLowerCase();
      list = list.filter(
        (img) =>
          img.label.toLowerCase().includes(q) ||
          img.src.toLowerCase().includes(q) ||
          (img.region && img.region.toLowerCase().includes(q)),
      );
    }
    return list;
  }, [galleryFilterFolder, gallerySearch]);

  const uniqueFolders = useMemo(() => {
    const set = new Set<string>();
    SITE_IMAGE_LIBRARY.forEach((img) => {
      if (img.region) set.add(img.region);
    });
    return ["all", ...Array.from(set)];
  }, []);

  const handleApplyGalleryImageToActiveSlot = (imgSrc: string) => {
    if (!activeSlot) {
      notify("Veuillez d'abord cliquer sur 'Sélectionner' sur un emplacement dans le Volet 1.", "error");
      return;
    }
    setSlotImage(activeSlot, imgSrc);
    notify(`Image assignée à ${activeSlot.pageLabel} → ${activeSlot.sectionLabel}`);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 text-start">
      {toast.message ? <Toast message={toast.message} type={toast.tone} /> : null}

      {/* Top Header */}
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between border-b border-[var(--gold)]/20 pb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--gold)] flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            Super Administration · Gestionnaire d&apos;Images
          </p>
          <h1 className="mt-1 text-2xl font-bold text-[var(--foreground)] flex items-center gap-2">
            <MapPinned className="h-6 w-6 text-[var(--gold)]" />
            Emplacements des Images du Site & Volet Galerie
          </h1>
          <p className="mt-2 max-w-3xl text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed">
            Configurez chaque bannière, arrière-plan de section et hero du site. Utilisez le menu déroulant avec aperçu au survol ou le second volet de galerie pour prévisualiser et assigner en un clic vos visuels.
          </p>
          <p className="mt-2 text-xs font-semibold text-[var(--gold)]">
            {filledCount}/{SITE_IMAGE_PLACEHOLDERS.length} emplacements configurés
            {doc?.updatedAt ? ` · Dernier enregistrement le ${new Date(doc.updatedAt).toLocaleString()}` : ""}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filtrer page ou section…"
            className="min-w-[180px] rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
          />
          <button
            type="button"
            onClick={() => setShowGalleryVolet(!showGalleryVolet)}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold cursor-pointer transition-all ${
              showGalleryVolet
                ? "bg-[var(--gold)]/20 border-[var(--gold)] text-[var(--foreground)]"
                : "border-[var(--border)] bg-[var(--background)] text-[var(--muted-foreground)] hover:border-[var(--gold)]"
            }`}
          >
            <Layers className="h-3.5 w-3.5 text-[var(--gold)]" />
            <span>{showGalleryVolet ? "Masquer Volet Galerie" : "Afficher Volet Galerie"}</span>
          </button>
          <button
            type="button"
            onClick={() => void load()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs font-semibold hover:border-[var(--gold)] cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Recharger
          </button>
          <button
            type="button"
            disabled={saving || !doc}
            onClick={() => void save()}
            className="btn-base btn-gold inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold cursor-pointer disabled:opacity-50 shadow-md"
          >
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            Enregistrer les Emplacements
          </button>
        </div>
      </header>

      {/* Main 2-Volet Split Layout */}
      {loading || !doc ? (
        <div className="flex items-center justify-center p-12 text-sm text-[var(--muted-foreground)] gap-2">
          <Loader2 className="h-5 w-5 animate-spin text-[var(--gold)]" />
          Chargement des emplacements et de la photothèque…
        </div>
      ) : (
        <div className={`grid gap-6 ${showGalleryVolet ? "xl:grid-cols-12 items-start" : "grid-cols-1"}`}>
          {/* VOLET 1: Emplacements des Pages du Site */}
          <div className={showGalleryVolet ? "xl:col-span-7 space-y-6" : "space-y-6"}>
            <div className="flex items-center justify-between border-b border-[var(--gold)]/20 pb-2">
              <h2 className="text-base font-bold text-[var(--foreground)] flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--gold)]/20 text-[var(--gold)] text-xs font-extrabold">
                  1
                </span>
                Volet 1 · Emplacements & Sections ({grouped.length} pages)
              </h2>
              {activeSlot ? (
                <div className="flex items-center gap-2 text-xs font-semibold text-[var(--gold)] bg-[var(--gold)]/10 px-2.5 py-1 rounded-md border border-[var(--gold)]/30">
                  <span>Cible active :</span>
                  <span className="font-bold underline">{activeSlot.pageLabel} → {activeSlot.fieldLabel}</span>
                  <button
                    type="button"
                    onClick={() => setActiveSlot(null)}
                    className="hover:text-red-500 cursor-pointer p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : null}
            </div>

            {grouped.map(([key, pageSlots]) => {
              const [pageIdKey, pageLabel, pagePath] = key.split("::");
              const studioAdminRouteMap: Record<string, string> = {
                home: "/admin/home-content",
                about: "/admin/about-content",
                gallery: "/admin/gallery-content",
                gallery_images: "/admin/gallery-content",
                library: "/admin/library-content",
                audio: "/admin/audio-content",
                documents: "/admin/documents-content",
                gallery_documents: "/admin/documents-content",
                periods: "/admin/periods-content",
                contact: "/admin/contact-content",
                archives: "/admin/archives-content",
                sources: "/admin/sources-content",
                research: "/admin/sources-content",
              };
              const studioRoute = studioAdminRouteMap[pageIdKey];
              return (
                <section
                  key={key}
                  className="surface-card rounded-xl border border-[var(--gold)]/35 bg-[var(--card)] p-4 sm:p-5 shadow-sm"
                >
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] pb-3">
                    <div>
                      <h3 className="text-base font-bold text-[var(--foreground)]">{pageLabel}</h3>
                      <p className="text-xs text-[var(--muted-foreground)] font-mono">{pagePath}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      {studioRoute ? (
                        <Link
                          to={studioRoute}
                          className="inline-flex items-center gap-1 rounded-md border border-[var(--gold)]/40 bg-[var(--gold)]/10 px-2.5 py-1 text-xs font-bold text-[var(--gold)] hover:bg-[var(--gold)] hover:text-[#18130a] transition-colors"
                        >
                          <Sparkles className="h-3 w-3" />
                          Studio Contenu
                        </Link>
                      ) : null}
                      <Link
                        to={pagePath}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--gold)] hover:underline"
                      >
                        Ouvrir la page publique <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {pageSlots.map((slot) => {
                      const value = readImage(doc, slot);
                      const preview = value ? resolveSiteImageUrl(value) || value : "";
                      const uploadKey = `${slot.pageId}.${slot.sectionId}.${slot.fieldKey}`;
                      const isTargetActive =
                        activeSlot?.pageId === slot.pageId &&
                        activeSlot?.sectionId === slot.sectionId &&
                        activeSlot?.fieldKey === slot.fieldKey;

                      return (
                        <article
                          key={uploadKey}
                          className={`rounded-xl border p-3.5 space-y-3 transition-all ${
                            isTargetActive
                              ? "border-[var(--gold)] bg-[var(--gold)]/10 ring-2 ring-[var(--gold)]/35 shadow-md"
                              : "border-[var(--border)] bg-[var(--background)]/60 hover:border-[var(--gold)]/50"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-[0.65rem] font-bold uppercase tracking-wide text-[var(--gold)]">
                                Section · {slot.sectionLabel}
                              </p>
                              <h4 className="text-xs sm:text-sm font-semibold text-[var(--foreground)]">
                                {slot.fieldLabel}
                              </h4>
                              <p className="mt-0.5 font-mono text-[0.62rem] text-[var(--muted-foreground)]">
                                {slot.pageId} / {slot.sectionId} / {slot.fieldKey}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveSlot(slot);
                                setShowGalleryVolet(true);
                              }}
                              className={`rounded-md px-2 py-1 text-[0.65rem] font-bold transition-colors cursor-pointer border flex items-center gap-1 ${
                                isTargetActive
                                  ? "bg-[var(--gold)] !text-[#1a140f] border-[var(--gold)]"
                                  : "bg-[var(--background)] text-[var(--muted-foreground)] border-[var(--border)] hover:border-[var(--gold)] hover:text-[var(--gold)]"
                              }`}
                            >
                              <Layers className="h-3 w-3" />
                              <span>{isTargetActive ? "Cible active" : "Sélectionner"}</span>
                            </button>
                          </div>

                          {/* Image Thumbnail Preview */}
                          <div className="aspect-[16/10] overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--card)] relative group">
                            {preview ? (
                              <>
                                <img
                                  src={preview}
                                  alt=""
                                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                  <a
                                    href={preview}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-1.5 rounded-full bg-black/60 text-white hover:text-[var(--gold)]"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </a>
                                </div>
                              </>
                            ) : (
                              <div className="flex h-full items-center justify-center text-xs text-[var(--muted-foreground)]">
                                Emplacement vide — Image par défaut
                              </div>
                            )}
                          </div>

                          {/* MediaSelect with Tooltip Preview */}
                          <div>
                            <MediaSelect
                              label="Sélectionner dans la photothèque (Survol pour aperçu)"
                              value={value}
                              onChange={(val) => setSlotImage(slot, val)}
                              options={mediaOptions}
                              placeholder="— Choisir une image patrimoniale —"
                            />
                          </div>

                          {/* Upload & Clear Actions */}
                          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[var(--border)]/50">
                            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--border)] px-2.5 py-1 text-[0.7rem] font-semibold hover:border-[var(--gold)] transition-colors">
                              {uploadingKey === uploadKey ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Upload className="h-3.5 w-3.5" />
                              )}
                              Téléverser
                              <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/gif"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) void uploadForSlot(slot, file);
                                  e.target.value = "";
                                }}
                              />
                            </label>
                            {value ? (
                              <button
                                type="button"
                                onClick={() => setSlotImage(slot, "")}
                                className="rounded-lg border border-[var(--border)] px-2.5 py-1 text-[0.7rem] font-semibold text-rose-500 hover:border-rose-400 cursor-pointer"
                              >
                                Vider
                              </button>
                            ) : null}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>

          {/* VOLET 2: Galerie d'Images du Site & Dossiers */}
          {showGalleryVolet ? (
            <aside className="xl:col-span-5 sticky top-20 surface-card rounded-xl border-2 border-[var(--gold)]/45 bg-[var(--card)] p-4 sm:p-5 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
              {/* Volet 2 Header */}
              <div className="border-b border-[var(--gold)]/25 pb-3">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-base font-bold text-[var(--foreground)] flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--gold)] !text-[#1a140f] text-xs font-extrabold">
                      2
                    </span>
                    Volet 2 · Galerie d&apos;Images du Site
                  </h2>
                  <span className="text-[0.65rem] font-bold text-[var(--gold)] bg-[var(--gold)]/10 px-2 py-0.5 rounded-full border border-[var(--gold)]/30">
                    {filteredGalleryImages.length} images
                  </span>
                </div>
                <p className="text-xs text-[var(--muted-foreground)] mt-1">
                  Cliquez sur une image pour l&apos;assigner directement à l&apos;emplacement sélectionné dans le Volet 1.
                </p>

                {/* Active Target Banner */}
                <div className="mt-2.5 p-2.5 rounded-lg bg-[var(--gold)]/15 border border-[var(--gold)]/40 flex items-center justify-between gap-2">
                  <div className="text-xs">
                    <span className="text-[var(--muted-foreground)] block text-[0.65rem] uppercase font-bold">
                      Emplacement ciblé :
                    </span>
                    <span className="font-bold text-[var(--foreground)]">
                      {activeSlot
                        ? `${activeSlot.pageLabel} → ${activeSlot.fieldLabel}`
                        : "Aucun (Cliquez sur 'Sélectionner' dans le Volet 1)"}
                    </span>
                  </div>
                  {activeSlot ? (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white text-[0.65rem]">
                      <Check className="h-3 w-3" />
                    </span>
                  ) : null}
                </div>

                {/* Gallery Search & Folder Filters */}
                <div className="mt-3 space-y-2">
                  <div className="relative">
                    <Search className="absolute start-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--muted-foreground)]" />
                    <input
                      type="text"
                      value={gallerySearch}
                      onChange={(e) => setGallerySearch(e.target.value)}
                      placeholder="Rechercher par mot-clé, région, nom…"
                      className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] ps-8 pe-3 py-1.5 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-thin">
                    {uniqueFolders.map((folder) => {
                      const isActive = galleryFilterFolder === folder;
                      return (
                        <button
                          key={folder}
                          type="button"
                          onClick={() => setGalleryFilterFolder(folder)}
                          className={`shrink-0 rounded-md px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider cursor-pointer border transition-all ${
                            isActive
                              ? "bg-[var(--gold)] !text-[#1a140f] border-[var(--gold)] shadow-sm"
                              : "bg-[var(--background)] text-[var(--muted-foreground)] border-[var(--border)] hover:border-[var(--gold)]/50"
                          }`}
                        >
                          {folder === "all" ? "Tous les dossiers" : folder}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Gallery Image Grid with Instant Select */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pe-1 scrollbar-thin">
                {filteredGalleryImages.length === 0 ? (
                  <p className="p-6 text-center text-xs text-[var(--muted-foreground)]">
                    Aucune image ne correspond aux critères.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                    {filteredGalleryImages.map((img) => (
                      <div
                        key={img.id}
                        onClick={() => handleApplyGalleryImageToActiveSlot(img.src)}
                        onMouseEnter={() => setHoveredGalleryImage(img)}
                        onMouseLeave={() => setHoveredGalleryImage(null)}
                        className="group relative cursor-pointer rounded-lg border border-[var(--gold)]/30 bg-[var(--background)] p-1.5 transition-all hover:border-[var(--gold)] hover:scale-[1.02] shadow-sm flex flex-col justify-between"
                      >
                        <div className="aspect-[16/10] overflow-hidden rounded-md bg-black/10 relative">
                          <img
                            src={img.src}
                            alt={img.label}
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute inset-0 bg-[var(--gold)]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="rounded bg-black/75 text-white text-[0.62rem] font-bold px-2 py-0.5">
                              Appliquer
                            </span>
                          </div>
                        </div>
                        <div className="mt-1.5">
                          <p className="text-[0.68rem] font-semibold text-[var(--foreground)] truncate">
                            {img.label}
                          </p>
                          {img.region ? (
                            <p className="text-[0.6rem] text-[var(--gold)] font-bold truncate">
                              {img.region}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Hover Tooltip Details in Volet 2 */}
              {hoveredGalleryImage ? (
                <div className="border-t border-[var(--gold)]/25 pt-2.5 text-xs text-start flex items-center gap-3 animate-fade-in bg-[var(--background)]/70 p-2 rounded-lg">
                  <img
                    src={hoveredGalleryImage.src}
                    alt=""
                    className="h-10 w-14 rounded object-cover border border-[var(--gold)]/40 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-xs truncate">{hoveredGalleryImage.label}</p>
                    <p className="font-mono text-[0.62rem] text-[var(--muted-foreground)] truncate">
                      {hoveredGalleryImage.src}
                    </p>
                  </div>
                </div>
              ) : null}
            </aside>
          ) : null}
        </div>
      )}
    </div>
  );
}
