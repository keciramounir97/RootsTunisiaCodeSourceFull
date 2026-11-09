import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  Bold,
  BookOpen,
  ExternalLink,
  FileText,
  Globe,
  Home as HomeIcon,
  Image as ImageIcon,
  Info,
  Italic,
  Layers,
  Layout,
  Link2,
  List as ListIcon,
  Loader2,
  Mail,
  Mic,
  Plus,
  RefreshCw,
  RotateCcw,
  Save,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useTranslation } from "../../context/TranslationContext";
import { api } from "../../api/client";
import { getApiErrorMessage } from "../../api/helpers";
import { resolveSiteImageUrl } from "../../hooks/useSiteImages";
import { refreshSiteContent } from "../../hooks/useSiteContent";
import Toast from "../../components/Toast";

/* ------------------------------------------------------------------ */
/* Content model (mirrors backend site-content.model.ts)               */
/* ------------------------------------------------------------------ */

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

const DEFAULT_LANG = "default";
const LANGUAGES = [
  { code: DEFAULT_LANG, label: "All languages", short: "ALL", dir: "ltr" as const },
  { code: "fr", label: "Français", short: "FR", dir: "ltr" as const },
  { code: "en", label: "English", short: "EN", dir: "ltr" as const },
  { code: "ar", label: "العربية", short: "AR", dir: "rtl" as const },
  { code: "es", label: "Español", short: "ES", dir: "ltr" as const },
  { code: "it", label: "Italiano", short: "IT", dir: "ltr" as const },
  { code: "mt", label: "Malti", short: "MT", dir: "ltr" as const },
];

const PAGE_ICONS: Record<string, typeof Layout> = {
  home: HomeIcon,
  about: Info,
  gallery: ImageIcon,
  library: BookOpen,
  audio: Mic,
  documents: FileText,
  contact: Mail,
  research: Search,
};

const inputClass =
  "w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/25 placeholder:text-[var(--muted-foreground)]/70";
const ghostBtn =
  "px-3 py-1.5 rounded-lg border border-[var(--border)] text-xs font-semibold text-[var(--foreground)] hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const isEmpty = (value: FieldValue | undefined) =>
  value === undefined ||
  (Array.isArray(value) ? value.length === 0 : !String(value).trim());

const emptyFor = (type: FieldType): FieldValue => (type === "list" ? [] : "");

const readValue = (field: ContentField, lang: string): FieldValue =>
  lang === DEFAULT_LANG ? field.value : field.translations?.[lang] ?? emptyFor(field.type);

const isCustomised = (field: ContentField) =>
  !isEmpty(field.value) ||
  Object.values(field.translations || {}).some((v) => !isEmpty(v));

const withValue = (field: ContentField, lang: string, value: FieldValue): ContentField => {
  if (lang === DEFAULT_LANG) return { ...field, value };
  const translations = { ...(field.translations || {}) };
  // Strict emptiness here so a leading space typed into a translation is not swallowed.
  const blank = Array.isArray(value) ? value.length === 0 : value === "";
  if (blank) delete translations[lang];
  else translations[lang] = value;
  return { ...field, translations };
};

const countCustomised = (fields: ContentField[]) => fields.filter(isCustomised).length;

const MULTILINE_KEY = /(subtitle|description|intro|body|caption)/i;

const BUILTIN_SITE_DEFAULTS: Record<string, string> = {
  eyebrow: "Patrimoine & Généalogie de Tunisie",
  title: "Explorez Vos Origines & Arbres Généalogiques Tunisiens",
  subtitle: "Découvrez l'histoire de vos ancêtres à travers les archives nationales, tribunaux charaïques et registres de Tunisie.",
  intro: "Fonds d'archives officiels, registres civils, tribunaux charaïques et institutions patrimoniales de Tunisie.",
  cta: "Explorer les collections",
  buttonText: "Consulter les archives",
  body: "Notre mission est de rassembler, préserver et rendre accessible le patrimoine généalogique tunisien à travers des sources documentaires authentifiées.",
  description: "Dossiers généalogiques, actes notariés et transcriptions historiques certifiées par nos historiens.",
};

function MiniatureSectionPreview({
  page,
  section,
  lang,
}: {
  page: ContentPage;
  section: ContentSection;
  lang: string;
}) {
  const getFieldVal = (key: string): string => {
    const f = section.fields.find((field) => field.key === key);
    if (!f) return "";
    const v = readValue(f, lang);
    if (!isEmpty(v)) return String(v);
    return BUILTIN_SITE_DEFAULTS[key] || "";
  };

  const getListVal = (key: string): string[] => {
    const f = section.fields.find((field) => field.key === key);
    if (!f) return [];
    const v = readValue(f, lang);
    if (Array.isArray(v) && v.length > 0) return v;
    return [];
  };

  const eyebrow = getFieldVal("eyebrow") || page.label;
  const title = getFieldVal("title") || section.label;
  const subtitle = getFieldVal("subtitle") || getFieldVal("description") || getFieldVal("intro") || section.description || "";
  const imageUrl = getFieldVal("image") || getFieldVal("backgroundImage");
  const cta = getFieldVal("cta") || getFieldVal("buttonText");
  const listItems = getListVal("items") || getListVal("features");

  return (
    <div className="rounded-2xl border-2 border-[var(--gold)]/45 bg-[var(--card)] overflow-hidden shadow-xl mb-4">
      <div className="flex items-center justify-between px-3.5 py-2 bg-[var(--background)]/90 border-b border-[var(--border)] text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          <span className="font-mono text-[11px] font-bold text-[var(--gold)] ms-2">
            Aperçu Miniature en Direct : {page.label} › {section.label}
          </span>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[var(--gold)]/20 text-[var(--gold)] border border-[var(--gold)]/40 animate-pulse">
          Mise à jour instantanée
        </span>
      </div>

      <div className="relative p-5 sm:p-6 bg-gradient-to-br from-[#121c29] via-[#0d1722] to-[#080d14] text-white overflow-hidden min-h-[140px] flex flex-col justify-center">
        {imageUrl && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25 pointer-events-none"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
        )}
        <div className="relative z-10 space-y-2 max-w-xl text-start">
          {eyebrow && (
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest text-amber-300 bg-amber-400/10 border border-amber-300/30">
              {eyebrow}
            </span>
          )}
          <h3 className="font-serif font-bold text-lg sm:text-xl text-amber-100 tracking-wide leading-snug">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-300 leading-relaxed font-light line-clamp-2">
              {subtitle}
            </p>
          )}
          {cta && (
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-bold bg-[var(--gold)] text-black shadow-sm">
                <span>{cta}</span>
              </span>
            </div>
          )}
          {listItems.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {listItems.map((item, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded text-[10px] bg-white/10 text-slate-200 border border-white/15"
                >
                  ✓ {item}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Field editors (module-level so inputs never remount while typing)   */
/* ------------------------------------------------------------------ */

interface FieldEditorProps {
  field: ContentField;
  lang: string;
  dir: "ltr" | "rtl";
  onChange: (value: FieldValue) => void;
  onReset: () => void;
  onUpload: (file: File) => Promise<string | null>;
  uploading: boolean;
  t: (key: string, fallback?: string) => string;
}

function FieldShell({
  field,
  lang,
  children,
  onReset,
  t,
}: {
  field: ContentField;
  lang: string;
  children: React.ReactNode;
  onReset: () => void;
  t: FieldEditorProps["t"];
}) {
  const custom = isCustomised(field);
  const hasValueHere = !isEmpty(readValue(field, lang));
  return (
    <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-2.5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <label className="text-xs font-bold text-[var(--foreground)] flex items-center gap-2 flex-wrap">
            <span>{field.label}</span>
            <span className="px-1.5 py-0.5 rounded-md text-[0.62rem] font-mono uppercase bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/25">
              {field.type}
            </span>
            <span
              className={`px-1.5 py-0.5 rounded-md text-[0.62rem] font-bold border ${
                custom
                  ? "bg-[var(--gold)]/15 text-[var(--gold)] border-[var(--gold)]/30"
                  : "text-[var(--muted-foreground)] border-[var(--border)]"
              }`}
            >
              {custom ? t("cms_customised", "Customised") : t("cms_site_default", "Site default")}
            </span>
          </label>
          {field.hint && (
            <p className="mt-1 text-[0.7rem] text-[var(--muted-foreground)]">{field.hint}</p>
          )}
        </div>
        {hasValueHere && (
          <button
            type="button"
            onClick={onReset}
            title={t("cms_reset_field", "Clear override and use the site default")}
            className="shrink-0 p-1.5 rounded-lg text-[var(--muted-foreground)] hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function TextField({ field, lang, dir, onChange, onReset, t }: FieldEditorProps) {
  const value = String(readValue(field, lang) ?? "");
  const fallbackHint =
    lang !== DEFAULT_LANG && !isEmpty(field.value) ? String(field.value) : undefined;
  const placeholder =
    fallbackHint || t("cms_placeholder_default", "Empty — the built-in site text is used");
  return (
    <FieldShell field={field} lang={lang} onReset={onReset} t={t}>
      {MULTILINE_KEY.test(field.key) ? (
        <textarea
          rows={3}
          dir={dir}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputClass} leading-relaxed`}
        />
      ) : (
        <input
          type="text"
          dir={dir}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
        />
      )}
    </FieldShell>
  );
}

function HtmlField({ field, lang, dir, onChange, onReset, t }: FieldEditorProps) {
  const ref = useRef<HTMLTextAreaElement | null>(null);
  const value = String(readValue(field, lang) ?? "");

  const wrap = (open: string, close: string, fallbackText = "text") => {
    const el = ref.current;
    if (!el) return;
    const { selectionStart: start, selectionEnd: end } = el;
    const selected = value.slice(start, end) || fallbackText;
    const next = `${value.slice(0, start)}${open}${selected}${close}${value.slice(end)}`;
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + open.length, start + open.length + selected.length);
    });
  };

  const addLink = () => {
    const href = window.prompt(t("cms_link_prompt", "Link URL (https://…)"), "https://");
    if (!href) return;
    wrap(`<a href="${href.replace(/"/g, "&quot;")}">`, "</a>", "link");
  };

  const tools = [
    { icon: Bold, label: "Bold", run: () => wrap("<strong>", "</strong>") },
    { icon: Italic, label: "Italic", run: () => wrap("<em>", "</em>") },
    { icon: ListIcon, label: "List", run: () => wrap("<ul>\n  <li>", "</li>\n</ul>", "item") },
    { icon: Link2, label: "Link", run: addLink },
  ];

  return (
    <FieldShell field={field} lang={lang} onReset={onReset} t={t}>
      <div className="flex items-center gap-1.5 flex-wrap">
        {tools.map(({ icon: Icon, label, run }) => (
          <button
            key={label}
            type="button"
            title={label}
            aria-label={label}
            onClick={run}
            className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--foreground)] hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors cursor-pointer"
          >
            <Icon className="w-3.5 h-3.5" />
          </button>
        ))}
        <button
          type="button"
          onClick={() => wrap("<p>", "</p>", "paragraph")}
          className="px-2 py-1 rounded-lg border border-[var(--border)] text-[0.7rem] font-mono text-[var(--foreground)] hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors cursor-pointer"
        >
          &lt;p&gt;
        </button>
        <span className="text-[0.68rem] text-[var(--muted-foreground)] ms-auto">
          {t("cms_html_sanitized", "Unsafe markup is removed on save")}
        </span>
      </div>
      <textarea
        ref={ref}
        rows={8}
        dir={dir}
        value={value}
        placeholder={t("cms_placeholder_default", "Empty — the built-in site text is used")}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClass} font-mono text-xs leading-relaxed`}
      />
    </FieldShell>
  );
}

function ImageField({ field, lang, onChange, onReset, onUpload, uploading, t }: FieldEditorProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const value = String(field.value ?? "");
  const preview = resolveSiteImageUrl(value);
  const shared = lang !== DEFAULT_LANG;

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (inputRef.current) inputRef.current.value = "";
    if (!file) return;
    const url = await onUpload(file);
    if (url) onChange(url);
  };

  return (
    <FieldShell field={field} lang={DEFAULT_LANG} onReset={onReset} t={t}>
      {shared && (
        <p className="text-[0.7rem] text-[var(--muted-foreground)] flex items-center gap-1.5">
          <Globe className="w-3 h-3" />
          {t("cms_image_shared", "Images are shared by all languages — edit under “All languages”.")}
        </p>
      )}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="w-full sm:w-44 aspect-video shrink-0 rounded-lg overflow-hidden border border-dashed border-[var(--gold)]/40 bg-black/5 dark:bg-white/5 flex items-center justify-center">
          {preview ? (
            <img src={preview} alt={field.label} className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="w-7 h-7 text-[var(--muted-foreground)]" />
          )}
        </div>
        <div className="flex-1 space-y-2 min-w-0">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            className="hidden"
            onChange={handleFile}
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={shared || uploading}
              onClick={() => inputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg bg-[var(--gold)] text-black text-xs font-bold flex items-center gap-1.5 shadow-sm hover:opacity-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              {value ? t("cms_replace_image", "Replace image") : t("cms_upload_image", "Upload image")}
            </button>
            {value && !shared && (
              <button type="button" onClick={() => onChange("")} className={ghostBtn}>
                <Trash2 className="w-3.5 h-3.5" />
                {t("cms_remove_image", "Remove")}
              </button>
            )}
          </div>
          <input
            type="text"
            dir="ltr"
            disabled={shared}
            value={value}
            placeholder="/uploads/site-content/… or https://…"
            onChange={(e) => onChange(e.target.value)}
            className={`${inputClass} font-mono text-xs disabled:opacity-60`}
          />
        </div>
      </div>
    </FieldShell>
  );
}

function ListField({ field, lang, dir, onChange, onReset, t }: FieldEditorProps) {
  const raw = readValue(field, lang);
  const items = Array.isArray(raw) ? raw : [];
  // Keep blank rows editable locally; the server drops empty items on save.
  const setItem = (index: number, text: string) =>
    onChange(items.map((item, i) => (i === index ? text : item)));
  const removeItem = (index: number) => onChange(items.filter((_, i) => i !== index));
  const defaultItems = Array.isArray(field.value) ? field.value : [];

  return (
    <FieldShell field={field} lang={lang} onReset={onReset} t={t}>
      {items.length === 0 && (
        <p className="text-xs text-[var(--muted-foreground)]">
          {lang !== DEFAULT_LANG && defaultItems.length > 0
            ? t("cms_list_uses_default", "Using the “All languages” list.")
            : t("cms_list_empty", "No items — the built-in list is used.")}
        </p>
      )}
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="w-5 text-center text-[0.68rem] font-mono text-[var(--muted-foreground)]">
              {index + 1}
            </span>
            <input
              type="text"
              dir={dir}
              value={item}
              onChange={(e) => setItem(index, e.target.value)}
              className={inputClass}
            />
            <button
              type="button"
              aria-label={t("cms_remove_item", "Remove item")}
              onClick={() => removeItem(index)}
              className="p-1.5 rounded-lg text-[var(--muted-foreground)] hover:text-red-500 hover:bg-red-500/10 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => onChange([...items, ""])} className={ghostBtn}>
        <Plus className="w-3.5 h-3.5" />
        {t("cms_add_item", "Add item")}
      </button>
    </FieldShell>
  );
}

function FieldEditor(props: FieldEditorProps) {
  switch (props.field.type) {
    case "html":
      return <HtmlField {...props} />;
    case "image":
      return <ImageField {...props} />;
    case "list":
      return <ListField {...props} />;
    default:
      return <TextField {...props} />;
  }
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function ContentManager() {
  const { t, isRtl } = useTranslation();

  const [pages, setPages] = useState<ContentPage[]>([]);
  const [baseline, setBaseline] = useState<string>("[]");
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

  const [pageId, setPageId] = useState<string>("home");
  const [sectionId, setSectionId] = useState<string>("");
  const [lang, setLang] = useState<string>(DEFAULT_LANG);
  const [toast, setToast] = useState<{ message: string; tone: "success" | "error" }>({
    message: "",
    tone: "success",
  });

  const notify = useCallback((message: string, tone: "success" | "error" = "success") => {
    setToast({ message, tone });
  }, []);
  useEffect(() => {
    if (!toast.message) return undefined;
    const id = window.setTimeout(() => setToast((c) => ({ ...c, message: "" })), 4000);
    return () => window.clearTimeout(id);
  }, [toast.message]);

  const applyDocument = useCallback((doc: SiteContentDocument) => {
    setPages(doc.pages);
    setBaseline(JSON.stringify(doc.pages));
    setUpdatedAt(doc.updatedAt);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await api.get("/admin/site-content");
      const doc = (res.data?.data ?? res.data) as SiteContentDocument;
      if (!doc || !Array.isArray(doc.pages)) throw new Error("Unexpected response");
      applyDocument(doc);
    } catch (err) {
      setLoadError(
        getApiErrorMessage(err, t("cms_load_failed", "Could not load site content.")),
      );
    } finally {
      setLoading(false);
    }
  }, [applyDocument, t]);

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dirty = useMemo(() => JSON.stringify(pages) !== baseline, [pages, baseline]);

  useEffect(() => {
    if (!dirty) return undefined;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const activePage = pages.find((p) => p.id === pageId) || pages[0];
  const activeSection =
    activePage?.sections.find((s) => s.id === sectionId) || activePage?.sections[0];
  const activeLang = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  const updateField = useCallback(
    (page: string, section: string, key: string, update: (f: ContentField) => ContentField) => {
      setPages((prev) =>
        prev.map((p) =>
          p.id !== page
            ? p
            : {
                ...p,
                sections: p.sections.map((s) =>
                  s.id !== section
                    ? s
                    : { ...s, fields: s.fields.map((f) => (f.key === key ? update(f) : f)) },
                ),
              },
        ),
      );
    },
    [],
  );

  const handleUpload = useCallback(
    async (file: File, key: string): Promise<string | null> => {
      setUploadingKey(key);
      try {
        const form = new FormData();
        form.append("image", file);
        const res = await api.post("/admin/site-content/upload", form);
        const data = res.data?.data ?? res.data;
        if (!data?.url) throw new Error("Upload returned no URL");
        notify(t("cms_upload_ok", "Image uploaded. Save to publish it."));
        return String(data.url);
      } catch (err) {
        notify(getApiErrorMessage(err, t("cms_upload_failed", "Image upload failed.")), "error");
        return null;
      } finally {
        setUploadingKey(null);
      }
    },
    [notify, t],
  );

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.put("/admin/site-content", { pages });
      const doc = (res.data?.data ?? res.data) as SiteContentDocument;
      if (!doc || !Array.isArray(doc.pages)) throw new Error("Unexpected response");
      applyDocument(doc);
      void refreshSiteContent();
      notify(t("cms_saved", "Content saved and published."));
    } catch (err) {
      notify(getApiErrorMessage(err, t("cms_save_failed", "Saving failed — nothing was published.")), "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    try {
      setPages(JSON.parse(baseline));
    } catch {
      void load();
    }
  };

  const totalCustomised = useMemo(
    () => pages.reduce((n, p) => n + p.sections.reduce((m, s) => m + countCustomised(s.fields), 0), 0),
    [pages],
  );

  /* ---------------------------- render ----------------------------- */

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-24 text-sm text-[var(--muted-foreground)]">
        <Loader2 className="w-5 h-5 animate-spin text-[var(--gold)]" />
        {t("cms_loading", "Loading site content…")}
      </div>
    );
  }

  if (loadError || !activePage) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <AlertCircle className="w-10 h-10 mx-auto text-red-500" />
        <p className="text-sm text-[var(--foreground)]">{loadError || "No content available."}</p>
        <button type="button" onClick={() => void load()} className={`${ghostBtn} mx-auto`}>
          <RefreshCw className="w-3.5 h-3.5" />
          {t("cms_retry", "Retry")}
        </button>
      </div>
    );
  }

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="space-y-6 text-start pb-20">
      {toast.message && <Toast message={toast.message} tone={toast.tone} />}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[var(--gold)]/20">
        <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[var(--gold)]/20 text-[var(--gold)] border border-[var(--gold)]/30">
              <Layout className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-[var(--foreground)]">
              {t("cms_title", "Public Content Manager")}
              </h1>
              <p className="text-xs text-[var(--muted-foreground)]">
                {t(
                "cms_subtitle",
                "Edit headings, rich text, lists and images of the public pages. Empty fields keep the built-in text.",
                )}
              </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`px-2.5 py-1 rounded-full text-[0.7rem] font-bold border ${
              dirty
                ? "bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/30"
                : "bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/25"
            }`}
          >
            {dirty
              ? t("cms_unsaved", "Unsaved changes")
              : updatedAt
                ? `${t("cms_saved_at", "Saved")} ${new Date(updatedAt).toLocaleString()}`
                : t("cms_nothing_saved", "No saved overrides yet")}
          </span>
          <span className="text-[0.7rem] text-[var(--muted-foreground)]">
            {totalCustomised} {t("cms_customised_fields", "customised fields")}
          </span>
          <button type="button" onClick={handleDiscard} disabled={!dirty || saving} className={ghostBtn}>
            <RotateCcw className="w-3.5 h-3.5" />
            {t("cms_discard", "Discard")}
          </button>
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={!dirty || saving}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[var(--gold)] to-amber-600 text-black text-xs font-bold flex items-center gap-1.5 shadow-md hover:opacity-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {t("cms_save", "Save & publish")}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Page + section picker */}
        <aside className="lg:col-span-4 space-y-5 lg:sticky lg:top-20">
          <div className="space-y-2">
            <h2 className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
              1 · {t("cms_pages", "Pages")}
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {pages.map((page) => {
                const Icon = PAGE_ICONS[page.id] || Layout;
                const selected = page.id === activePage.id;
                const custom = page.sections.reduce((n, s) => n + countCustomised(s.fields), 0);
              return (
                  <button
                    key={page.id}
                    type="button"
                  onClick={() => {
                      setPageId(page.id);
                      setSectionId("");
                    }}
                    aria-pressed={selected}
                    className={`p-3 rounded-xl border text-start transition-all cursor-pointer ${
                      selected
                        ? "border-[var(--gold)] bg-[var(--gold)]/10 ring-2 ring-[var(--gold)]/25"
                        : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--gold)]/60"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Icon className={`w-4 h-4 ${selected ? "text-[var(--gold)]" : "text-teal-600 dark:text-teal-300"}`} />
                      {custom > 0 && (
                        <span className="px-1.5 rounded-full text-[0.62rem] font-bold bg-[var(--gold)]/20 text-[var(--gold)]">
                          {custom}
                      </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm font-bold text-[var(--foreground)] truncate">{page.label}</p>
                    <p className="text-[0.66rem] text-[var(--muted-foreground)]">
                      {page.sections.length} {t("cms_sections", "sections")}
                    </p>
                  </button>
              );
            })}
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
              2 · {t("cms_sections_of", "Sections of")} {activePage.label}
            </h2>
            {activePage.description && (
              <p className="text-xs text-[var(--muted-foreground)]">{activePage.description}</p>
            )}
            <div className="space-y-2">
              {activePage.sections.map((section) => {
                const selected = section.id === activeSection?.id;
                const custom = countCustomised(section.fields);
              return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setSectionId(section.id)}
                    aria-pressed={selected}
                    className={`w-full p-3 rounded-xl border flex items-center gap-3 text-start transition-all cursor-pointer ${
                      selected
                        ? "border-[var(--gold)] bg-[var(--gold)]/10"
                        : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--gold)]/60"
                    }`}
                  >
                    <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-700 dark:text-teal-300">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-[var(--foreground)] truncate">{section.label}</p>
                      <p className="text-[0.66rem] text-[var(--muted-foreground)]">
                        {section.fields.length} {t("cms_fields", "fields")}
                        {custom > 0 && ` · ${custom} ${t("cms_customised_lower", "customised")}`}
                      </p>
                    </div>
                  </button>
              );
            })}
            </div>
          </div>
        </aside>

        {/* Editor */}
        <section className="lg:col-span-8 space-y-4">
          {activeSection && (
            <>
              <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-base font-bold font-display text-[var(--foreground)]">
                      {activePage.label} <span className="text-[var(--gold)]">›</span> {activeSection.label}
                    </h2>
                    {activeSection.description && (
                      <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{activeSection.description}</p>
                    )}
                  </div>
                  {activePage.path && (
                    <a
                      href={activePage.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={ghostBtn}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      {t("cms_open_page", "Open page")}
                    </a>
                  )}
                </div>

                <div role="tablist" aria-label="Language" className="flex flex-wrap gap-1.5 pt-1">
                  {LANGUAGES.map((l) => {
                    const selected = l.code === lang;
                    return (
                      <button
                        key={l.code}
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        onClick={() => setLang(l.code)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                          selected
                            ? "bg-teal-600 text-white border-teal-600 shadow-sm"
                            : "border-[var(--border)] text-[var(--foreground)] hover:border-teal-500/60"
                        }`}
                      >
                        {l.code === DEFAULT_LANG ? (
                          <span className="flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            {l.label}
                          </span>
                        ) : (
                          <span>
                            {l.short} <span className="font-normal opacity-80">· {l.label}</span>
                          </span>
                        )}
                      </button>
              );
            })}
          </div>
                {lang !== DEFAULT_LANG && (
                  <p className="text-[0.7rem] text-[var(--muted-foreground)]">
                    {t(
                      "cms_lang_note",
                      "Values here apply only to this language and win over “All languages”. Leave empty to inherit.",
                    )}
                  </p>
                )}
              </div>

              {/* Miniature live preview of the section reflecting current inputs */}
              <MiniatureSectionPreview page={activePage} section={activeSection} lang={lang} />

              <div className="space-y-3">
                {activeSection.fields.map((field) => (
                  <FieldEditor
                    key={`${activePage.id}.${activeSection.id}.${field.key}`}
                    field={field}
                    lang={lang}
                    dir={activeLang.dir}
                    uploading={uploadingKey === `${activePage.id}.${activeSection.id}.${field.key}`}
                    t={t}
                    onChange={(value) =>
                      updateField(activePage.id, activeSection.id, field.key, (f) =>
                        withValue(f, f.type === "image" ? DEFAULT_LANG : lang, value),
                      )
                    }
                    onReset={() =>
                      updateField(activePage.id, activeSection.id, field.key, (f) =>
                        withValue(f, f.type === "image" ? DEFAULT_LANG : lang, emptyFor(f.type)),
                      )
                    }
                    onUpload={(file) =>
                      handleUpload(file, `${activePage.id}.${activeSection.id}.${field.key}`)
                    }
                  />
                ))}
              </div>
            </>
          )}
        </section>
        </div>
    </div>
  );
}
