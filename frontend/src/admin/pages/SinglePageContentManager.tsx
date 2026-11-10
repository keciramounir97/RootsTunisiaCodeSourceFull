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
  RotateCcw,
  Save,
  Search,
  Trash2,
  Upload,
  Clock,
  Compass,
} from "lucide-react";
import { useTranslation } from "../../context/TranslationContext";
import { api } from "../../api/client";
import { getApiErrorMessage } from "../../api/helpers";
import { resolveSiteImageUrl } from "../../hooks/useSiteImages";
import { refreshSiteContent } from "../../hooks/useSiteContent";
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

const PAGE_META: Record<string, { icon: any; titleKey: string; defaultTitle: string; defaultSubtitle: string }> = {
  home: {
    icon: HomeIcon,
    titleKey: "home_public_content",
    defaultTitle: "Contenu Public · Accueil",
    defaultSubtitle: "Gérez les textes, bannières, visuels et appels à l'action de la page d'accueil principale.",
  },
  about: {
    icon: Info,
    titleKey: "about_public_content",
    defaultTitle: "Contenu Public · À Propos",
    defaultSubtitle: "Gérez la mission, la méthodologie de recherche et l'histoire de la plateforme Roots Tunisia.",
  },
  gallery: {
    icon: ImageIcon,
    titleKey: "gallery_public_content",
    defaultTitle: "Contenu Public · Galerie",
    defaultSubtitle: "Gérez la bannière et la présentation du centre des collections et archives visuelles.",
  },
  library: {
    icon: BookOpen,
    titleKey: "library_public_content",
    defaultTitle: "Contenu Public · Bibliothèque",
    defaultSubtitle: "Gérez l'en-tête, les descriptions et présentations de la bibliothèque numérique de manuscrits.",
  },
  audio: {
    icon: Mic,
    titleKey: "audio_public_content",
    defaultTitle: "Contenu Public · Audio & Récits",
    defaultSubtitle: "Gérez les introductions et bannières des archives orales et témoignages sonores.",
  },
  documents: {
    icon: FileText,
    titleKey: "documents_public_content",
    defaultTitle: "Contenu Public · Documents",
    defaultSubtitle: "Gérez les présentations des actes notariés, décrets et documents numérisés.",
  },
  contact: {
    icon: Mail,
    titleKey: "contact_public_content",
    defaultTitle: "Contenu Public · Contact & Coordonnées",
    defaultSubtitle: "Gérez les coordonnées (email, téléphone, adresse, horaires) et le texte du formulaire.",
  },
  periods: {
    icon: Clock,
    titleKey: "periods_public_content",
    defaultTitle: "Contenu Public · Périodes Historiques",
    defaultSubtitle: "Gérez la chronologie et les présentations des 9 grandes ères historiques tunisiennes.",
  },
};

const inputClass =
  "w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/25 placeholder:text-[var(--muted-foreground)]/70";
const ghostBtn =
  "px-3 py-1.5 rounded-lg border border-[var(--border)] text-xs font-semibold text-[var(--foreground)] hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

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
    <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-2.5 text-start">
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
              {custom ? t("cms_customised", "Personnalisé") : t("cms_site_default", "Défaut du site")}
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
            title={t("cms_reset_field", "Effacer et revenir au texte par défaut")}
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
  const siteDefault = BUILTIN_SITE_DEFAULTS[field.key] || "";
  const placeholder =
    fallbackHint || siteDefault || t("cms_placeholder_default", "Texte par défaut du site...");
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
    const href = window.prompt(t("cms_link_prompt", "URL du lien (https://…)"), "https://");
    if (!href) return;
    wrap(`<a href="${href.replace(/"/g, "&quot;")}">`, "</a>", "lien");
  };

  const tools = [
    { icon: Bold, label: "Gras", run: () => wrap("<strong>", "</strong>") },
    { icon: Italic, label: "Italique", run: () => wrap("<em>", "</em>") },
    { icon: ListIcon, label: "Liste", run: () => wrap("<ul>\n  <li>", "</li>\n</ul>", "élément") },
    { icon: Link2, label: "Lien", run: addLink },
  ];

  return (
    <FieldShell field={field} lang={lang} onReset={onReset} t={t}>
      <div className="flex items-center gap-1 pb-1 flex-wrap">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.label}
              type="button"
              onClick={tool.run}
              className="px-2 py-1 rounded-md border border-[var(--border)] text-[0.7rem] font-semibold text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--gold)]/15 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Icon className="w-3 h-3" />
              <span>{tool.label}</span>
            </button>
          );
        })}
      </div>
      <textarea
        ref={ref}
        rows={6}
        dir={dir}
        value={value}
        placeholder={t("cms_html_placeholder", "Contenu HTML formaté (balises autorisées : strong, em, ul, li, a)...")}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClass} font-mono text-xs leading-relaxed`}
      />
    </FieldShell>
  );
}

function ImageField({ field, lang, onChange, onReset, onUpload, uploading, t }: FieldEditorProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const rawValue = String(readValue(field, lang) ?? "");
  const preview = resolveSiteImageUrl(rawValue);

  const handlePickFile = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await onUpload(file);
    if (url) onChange(url);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <FieldShell field={field} lang={lang} onReset={onReset} t={t}>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            dir="ltr"
            value={rawValue}
            placeholder="/assets/mon-image.jpg ou https://…"
            onChange={(e) => onChange(e.target.value)}
            className={`${inputClass} flex-1 font-mono text-xs`}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={handlePickFile}
            disabled={uploading}
            className="btn-base btn-gold text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
          >
            {uploading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Upload className="w-3.5 h-3.5" />
            )}
            <span>{t("cms_upload", "Importer")}</span>
          </button>
        </div>

        {preview && (
          <div className="relative w-full h-36 rounded-xl overflow-hidden border border-[var(--gold)]/30 bg-black/20">
            <img src={preview} alt="Aperçu" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute top-2 end-2 p-1 rounded-full bg-black/60 text-white hover:bg-red-600 transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </FieldShell>
  );
}

function ListField({ field, lang, dir, onChange, onReset, t }: FieldEditorProps) {
  const list = (readValue(field, lang) as string[]) || [];

  const handleItemChange = (idx: number, val: string) => {
    const next = [...list];
    next[idx] = val;
    onChange(next);
  };

  const handleAdd = () => {
    onChange([...list, ""]);
  };

  const handleRemove = (idx: number) => {
    const next = list.filter((_, i) => i !== idx);
    onChange(next);
  };

  return (
    <FieldShell field={field} lang={lang} onReset={onReset} t={t}>
      <div className="space-y-2">
        {list.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="font-mono text-xs text-[var(--gold)] shrink-0 font-bold">#{idx + 1}</span>
            <input
              type="text"
              dir={dir}
              value={item}
              placeholder="Texte de l'élément..."
              onChange={(e) => handleItemChange(idx, e.target.value)}
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="p-1.5 rounded-lg text-[var(--muted-foreground)] hover:text-red-500 hover:bg-red-500/10 transition cursor-pointer shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAdd}
          className="text-xs font-bold text-[var(--gold)] hover:underline flex items-center gap-1 cursor-pointer pt-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t("cms_add_item", "Ajouter un élément")}</span>
        </button>
      </div>
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

export default function SinglePageContentManager({ pageId }: { pageId: string }) {
  const { t, isRtl } = useTranslation();
  const [doc, setDoc] = useState<SiteContentDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [lang, setLang] = useState<string>(DEFAULT_LANG);
  const [sectionId, setSectionId] = useState<string>("");
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; tone: "success" | "error" | "info" }>({
    message: "",
    tone: "info",
  });

  const meta = PAGE_META[pageId] || {
    icon: Layout,
    titleKey: "public_content_manager",
    defaultTitle: `Contenu Public · ${pageId.toUpperCase()}`,
    defaultSubtitle: "Gestionnaire des textes et visuels de cette page.",
  };
  const PageIcon = meta.icon;

  const loadContent = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/site-content/admin");
      const d = (res.data?.data ?? res.data) as SiteContentDocument;
      setDoc(d);
      setDirty(false);
      // Auto-select first section if available
      const p = d?.pages?.find((x) => x.id === pageId);
      if (p?.sections?.length) {
        setSectionId(p.sections[0].id);
      }
    } catch (err) {
      setToast({ message: getApiErrorMessage(err, "Erreur lors du chargement"), tone: "error" });
    } finally {
      setLoading(false);
    }
  }, [pageId]);

  useEffect(() => {
    void loadContent();
  }, [loadContent]);

  const activePage = useMemo(() => {
    return doc?.pages?.find((p) => p.id === pageId) || null;
  }, [doc, pageId]);

  const activeSection = useMemo(() => {
    if (!activePage) return null;
    return activePage.sections.find((s) => s.id === sectionId) || activePage.sections[0] || null;
  }, [activePage, sectionId]);

  const updateField = (
    fieldKey: string,
    transform: (prev: ContentField) => ContentField,
  ) => {
    if (!doc || !activeSection) return;
    setDoc({
      ...doc,
      pages: doc.pages.map((p) => {
        if (p.id !== pageId) return p;
        return {
          ...p,
          sections: p.sections.map((s) => {
            if (s.id !== activeSection.id) return s;
            return {
              ...s,
              fields: s.fields.map((f) => (f.key === fieldKey ? transform(f) : f)),
            };
          }),
        };
      }),
    });
    setDirty(true);
  };

  const handleSave = async () => {
    if (!doc) return;
    try {
      setSaving(true);
      await api.put("/site-content", doc);
      await refreshSiteContent();
      setDirty(false);
      setToast({ message: t("cms_saved_toast", "Contenu enregistré et publié avec succès."), tone: "success" });
    } catch (err) {
      setToast({ message: getApiErrorMessage(err, "Erreur d'enregistrement"), tone: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (file: File, key: string): Promise<string | null> => {
    try {
      setUploadingKey(key);
      const fd = new FormData();
      fd.append("file", file);
      const res = await api.post("/site-content/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const url = res.data?.data?.url || res.data?.url;
      return url || null;
    } catch (err) {
      setToast({ message: getApiErrorMessage(err, "Échec du téléversement de l'image"), tone: "error" });
      return null;
    } finally {
      setUploadingKey(null);
    }
  };

  const activeLang = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="w-8 h-8 text-[var(--gold)] animate-spin" />
      </div>
    );
  }

  if (!activePage) {
    return (
      <div className="p-8 text-center border border-[var(--gold)]/30 rounded-xl bg-[var(--card)] text-sm text-[var(--muted-foreground)]">
        <AlertCircle className="w-8 h-8 text-[var(--gold)] mx-auto mb-2 opacity-70" />
        <p>Page introuvable dans le gestionnaire de contenu.</p>
      </div>
    );
  }

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="space-y-6 text-start pb-20">
      {toast.message && <Toast message={toast.message} tone={toast.tone} />}

      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[var(--gold)]/20">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[var(--gold)]/15 text-[var(--gold)] ring-1 ring-[var(--gold)]/35">
            <PageIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-[var(--foreground)]">
              {t(meta.titleKey, meta.defaultTitle)}
            </h1>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
              {meta.defaultSubtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {dirty && (
            <span className="px-2.5 py-1 rounded-full text-[0.7rem] font-bold bg-amber-500/15 text-amber-500 border border-amber-500/30">
              Modifications non enregistrées
            </span>
          )}
          {activePage.path && (
            <a
              href={activePage.path}
              target="_blank"
              rel="noopener noreferrer"
              className={ghostBtn}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Voir la page publique</span>
            </a>
          )}
          <button
            type="button"
            onClick={loadContent}
            disabled={!dirty || saving}
            className={ghostBtn}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t("cms_discard", "Annuler")}</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!dirty || saving}
            className="btn-base btn-gold text-xs py-2 px-5 flex items-center gap-2 cursor-pointer shadow-md hover:scale-[1.02] transition-transform disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{t("cms_save", "Enregistrer & Publier")}</span>
          </button>
        </div>
      </div>

      {/* Sections Selector Pills */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--gold)] flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5" />
          <span>Sections de la page ({activePage.sections.length})</span>
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {activePage.sections.map((section) => {
            const isSel = section.id === activeSection?.id;
            const customCount = countCustomised(section.fields);
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => setSectionId(section.id)}
                className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                  isSel
                    ? "bg-[var(--gold)] text-black border-[var(--gold)] shadow-md font-extrabold"
                    : "bg-[var(--card)] text-[var(--foreground)] border-[var(--border)] hover:border-[var(--gold)]/60"
                }`}
              >
                <span>{section.label}</span>
                {customCount > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      isSel ? "bg-black/20 text-black font-extrabold" : "bg-[var(--gold)]/20 text-[var(--gold)]"
                    }`}
                  >
                    {customCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Language Switcher Tabs */}
      <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[var(--gold)]" />
            <span className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">
              Langue d'édition :
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {LANGUAGES.map((l) => {
              const selected = l.code === lang;
              return (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setLang(l.code)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                    selected
                      ? "bg-[var(--gold)] text-black border-[var(--gold)] font-extrabold shadow-sm"
                      : "border-[var(--border)] text-[var(--foreground)] hover:border-[var(--gold)]/50"
                  }`}
                >
                  {l.code === DEFAULT_LANG ? (
                    <span className="flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      <span>{l.label}</span>
                    </span>
                  ) : (
                    <span>
                      {l.short} · {l.label}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        {lang !== DEFAULT_LANG && (
          <p className="text-[0.7rem] text-[var(--muted-foreground)]">
            Les valeurs saisies ici s'appliquent spécifiquement à la langue sélectionnée et remplacent le texte par défaut.
          </p>
        )}
      </div>

      {/* Active Section Content Editor */}
      {activeSection && (
        <div className="space-y-4">
          {/* Miniature Live Preview */}
          <MiniatureSectionPreview page={activePage} section={activeSection} lang={lang} />

          {/* Fields */}
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
                  updateField(field.key, (f) =>
                    withValue(f, f.type === "image" ? DEFAULT_LANG : lang, value),
                  )
                }
                onReset={() =>
                  updateField(field.key, (f) =>
                    withValue(f, f.type === "image" ? DEFAULT_LANG : lang, emptyFor(f.type)),
                  )
                }
                onUpload={(file) =>
                  handleUpload(file, `${activePage.id}.${activeSection.id}.${field.key}`)
                }
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
