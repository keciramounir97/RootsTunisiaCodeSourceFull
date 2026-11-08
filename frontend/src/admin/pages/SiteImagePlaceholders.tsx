import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ExternalLink,
  Image as ImageIcon,
  Loader2,
  MapPinned,
  RefreshCw,
  Save,
  Upload,
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
} from "../../config/siteImageLibrary";
import Toast from "../../components/Toast";

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
      notify("Site image placements saved");
    } catch (err) {
      notify(getApiErrorMessage(err, "Save failed"), "error");
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
      notify(`Uploaded for ${slot.pageLabel} → ${slot.sectionLabel}`);
    } catch (err) {
      notify(getApiErrorMessage(err, "Upload failed"), "error");
    } finally {
      setUploadingKey(null);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {toast.message ? <Toast message={toast.message} type={toast.tone} /> : null}

      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--gold)]">
            Super Admin
          </p>
          <h1 className="mt-1 text-2xl font-bold text-[var(--foreground)] flex items-center gap-2">
            <MapPinned className="h-6 w-6 text-[var(--gold)]" />
            Site image placeholders
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-[var(--muted-foreground)]">
            Every page section image lives here — page name, section name, and the uploaded or
            library asset. Public heroes and section backgrounds read from these slots (not from
            hardcoded files). Gallery des images and diaporama banners stay separate.
          </p>
          <p className="mt-2 text-xs text-[var(--muted-foreground)]">
            {filledCount}/{SITE_IMAGE_PLACEHOLDERS.length} placeholders assigned
            {doc?.updatedAt ? ` · last save ${new Date(doc.updatedAt).toLocaleString()}` : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter page or section…"
            className="min-w-[200px] rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-[var(--gold)]"
          />
          <button
            type="button"
            onClick={() => void load()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] px-3 py-2 text-xs font-semibold hover:border-[var(--gold)]"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Reload
          </button>
          <button
            type="button"
            disabled={saving || !doc}
            onClick={() => void save()}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--gold)] px-4 py-2 text-xs font-bold text-[#1a140f] disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            Save placements
          </button>
        </div>
      </header>

      {loading || !doc ? (
        <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading placeholders…
        </div>
      ) : (
        <div className="space-y-8">
          {grouped.map(([key, pageSlots]) => {
            const [, pageLabel, pagePath] = key.split("::");
            return (
              <section
                key={key}
                className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 sm:p-5"
              >
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] pb-3">
                  <div>
                    <h2 className="text-lg font-bold text-[var(--foreground)]">{pageLabel}</h2>
                    <p className="text-xs text-[var(--muted-foreground)] font-mono">{pagePath}</p>
                  </div>
                  <Link
                    to={pagePath}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--gold)] hover:underline"
                  >
                    Open page <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {pageSlots.map((slot) => {
                    const value = readImage(doc, slot);
                    const preview = value ? resolveSiteImageUrl(value) || value : "";
                    const uploadKey = `${slot.pageId}.${slot.sectionId}.${slot.fieldKey}`;
                    return (
                      <article
                        key={uploadKey}
                        className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-3 space-y-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-[0.65rem] font-bold uppercase tracking-wide text-[var(--gold)]">
                              Section · {slot.sectionLabel}
                            </p>
                            <h3 className="text-sm font-semibold text-[var(--foreground)]">
                              {slot.fieldLabel}
                            </h3>
                            <p className="mt-0.5 font-mono text-[0.65rem] text-[var(--muted-foreground)]">
                              {slot.pageId} / {slot.sectionId} / {slot.fieldKey}
                            </p>
                          </div>
                          <ImageIcon className="h-4 w-4 shrink-0 text-[var(--muted-foreground)]" />
                        </div>

                        <div className="aspect-[16/10] overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--card)]">
                          {preview ? (
                            <img
                              src={preview}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-xs text-[var(--muted-foreground)]">
                              Empty — using site default
                            </div>
                          )}
                        </div>

                        <label className="block text-[0.7rem] font-semibold text-[var(--muted-foreground)]">
                          Library dropdown
                          <select
                            className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-2 py-2 text-sm text-[var(--foreground)]"
                            value={
                              SITE_IMAGE_LIBRARY.some((i) => i.src === value) ? value : ""
                            }
                            onChange={(e) => setSlotImage(slot, e.target.value)}
                          >
                            <option value="">
                              {value && !SITE_IMAGE_LIBRARY.some((i) => i.src === value)
                                ? "Custom upload (keep)"
                                : "— Select Tunisia heritage image —"}
                            </option>
                            {SITE_IMAGE_LIBRARY.map((img) => (
                              <option key={img.id} value={img.src}>
                                {img.label}
                                {img.region ? ` · ${img.region}` : ""}
                              </option>
                            ))}
                          </select>
                        </label>

                        <div className="flex flex-wrap gap-2">
                          <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--border)] px-2.5 py-1.5 text-[0.7rem] font-semibold hover:border-[var(--gold)]">
                            {uploadingKey === uploadKey ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Upload className="h-3.5 w-3.5" />
                            )}
                            Upload
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
                              className="rounded-lg border border-[var(--border)] px-2.5 py-1.5 text-[0.7rem] font-semibold text-red-600 hover:border-red-400"
                            >
                              Clear
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
      )}
    </div>
  );
}
