import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  Bold,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Compass,
  CornerDownLeft,
  Edit3,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  Filter,
  Globe,
  Headphones,
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
  MapPin,
  Maximize2,
  Mic,
  Monitor,
  Music,
  Newspaper,
  Phone,
  Plus,
  RefreshCw,
  RotateCcw,
  Save,
  Search,
  Sliders,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Tablet,
  Trash2,
  Undo,
  Upload,
  X,
} from "lucide-react";
import { useTranslation } from "../../context/TranslationContext";
import { api } from "../../api/client";
import { getApiErrorMessage } from "../../api/helpers";
import { resolveSiteImageUrl } from "../../hooks/useSiteImages";
import { refreshSiteContent } from "../../hooks/useSiteContent";
import Toast from "../../components/Toast";

// Assets for authentic live preview
import carthage from "../../assets/slider-carthage.jpg";
import kairouan from "../../assets/slider-kairouan.jpg";
import sidiBouSaid from "../../assets/slider-sidibousaid.jpg";
import eljem from "../../assets/eljem.jpg";
import manuscript from "../../assets/manuscript.jpg";
import djerba from "../../assets/djerba.jpg";
import familyArchive from "../../assets/family-archive.jpg";
import heroBg from "../../assets/background-image-herosection.png";

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
  { code: DEFAULT_LANG, label: "All languages (Défaut global)", short: "ALL", flag: "🌐", dir: "ltr" as const },
  { code: "fr", label: "Français", short: "FR", flag: "🇫🇷", dir: "ltr" as const },
  { code: "en", label: "English", short: "EN", flag: "🇬🇧", dir: "ltr" as const },
  { code: "ar", label: "العربية", short: "AR", flag: "🇹🇳", dir: "rtl" as const },
  { code: "es", label: "Español", short: "ES", flag: "🇪🇸", dir: "ltr" as const },
  { code: "it", label: "Italiano", short: "IT", flag: "🇮🇹", dir: "ltr" as const },
  { code: "mt", label: "Malti", short: "MT", flag: "🇲🇹", dir: "ltr" as const },
];

const PAGE_META: Record<
  string,
  {
    icon: any;
    titleKey: string;
    defaultTitle: string;
    defaultSubtitle: string;
    publicPath: string;
    defaultHeroImage: string;
  }
> = {
  home: {
    icon: HomeIcon,
    titleKey: "home_public_content",
    defaultTitle: "Page d'Accueil",
    defaultSubtitle: "Gérez en direct les textes, bannières, visuels et appels à l'action de la page d'accueil.",
    publicPath: "/",
    defaultHeroImage: heroBg,
  },
  about: {
    icon: Info,
    titleKey: "about_public_content",
    defaultTitle: "À Propos & Mission",
    defaultSubtitle: "Gérez la mission, la méthodologie de recherche et l'histoire patrimoniale de la plateforme.",
    publicPath: "/about",
    defaultHeroImage: carthage,
  },
  gallery: {
    icon: ImageIcon,
    titleKey: "gallery_public_content",
    defaultTitle: "Galerie & Collections",
    defaultSubtitle: "Gérez la présentation et les bannières du centre des collections patrimoniales.",
    publicPath: "/gallery",
    defaultHeroImage: sidiBouSaid,
  },
  library: {
    icon: BookOpen,
    titleKey: "library_public_content",
    defaultTitle: "Bibliothèque Numérique",
    defaultSubtitle: "Gérez les en-têtes et descriptions de la collection de livres et manuscrits historiques.",
    publicPath: "/library",
    defaultHeroImage: manuscript,
  },
  audio: {
    icon: Mic,
    titleKey: "audio_public_content",
    defaultTitle: "Audio & Récits Oraux",
    defaultSubtitle: "Gérez les introductions et bannières des archives sonores et témoignages d'anciens.",
    publicPath: "/audio",
    defaultHeroImage: djerba,
  },
  documents: {
    icon: FileText,
    titleKey: "documents_public_content",
    defaultTitle: "Documents Numérisés",
    defaultSubtitle: "Gérez les présentations des décrets, actes notariés et fonds administratifs anciens.",
    publicPath: "/documents",
    defaultHeroImage: familyArchive,
  },
  periods: {
    icon: Clock,
    titleKey: "periods_public_content",
    defaultTitle: "Périodes Historiques",
    defaultSubtitle: "Gérez la chronologie et les présentations des 9 grandes ères de l'histoire tunisienne.",
    publicPath: "/periods",
    defaultHeroImage: eljem,
  },
  contact: {
    icon: Mail,
    titleKey: "contact_public_content",
    defaultTitle: "Contact & Coordonnées",
    defaultSubtitle: "Gérez les coordonnées officielles, horaires d'ouverture et texte du formulaire.",
    publicPath: "/contact",
    defaultHeroImage: sidiBouSaid,
  },
  articles: {
    icon: Newspaper,
    titleKey: "articles_public_content",
    defaultTitle: "Articles & Chroniques",
    defaultSubtitle: "Gérez les en-têtes et textes introductifs de la section des articles scientifiques et chroniques.",
    publicPath: "/articles",
    defaultHeroImage: manuscript,
  },
  gallery_articles: {
    icon: Newspaper,
    titleKey: "articles_public_content",
    defaultTitle: "Articles & Chroniques",
    defaultSubtitle: "Gérez les en-têtes et textes introductifs de la section des articles scientifiques et chroniques.",
    publicPath: "/gallery/articles",
    defaultHeroImage: manuscript,
  },
};

const inputClass =
  "w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/25 placeholder:text-[var(--muted-foreground)]/60 shadow-inner";

const isEmpty = (value: FieldValue | undefined) =>
  value === undefined ||
  (Array.isArray(value) ? value.length === 0 : !String(value).trim());

const emptyFor = (type: FieldType): FieldValue => (type === "list" ? [] : "");

const readValue = (field: ContentField, lang: string): FieldValue =>
  lang === DEFAULT_LANG ? field.value : field.translations?.[lang] ?? emptyFor(field.type);

const isCustomised = (field: ContentField) =>
  !isEmpty(field.value) ||
  Object.values(field.translations || {}).some((v) => !isEmpty(v));

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

export default function SinglePageContentManager({ pageId }: { pageId: string }) {
  const { t, isRtl: appIsRtl } = useTranslation();
  const [doc, setDoc] = useState<SiteContentDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  // Studio Mode State
  const [deviceMode, setDeviceMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [lang, setLang] = useState<string>(DEFAULT_LANG);
  const [sidebarTab, setSidebarTab] = useState<"sections" | "inspector">("sections");
  const [sectionId, setSectionId] = useState<string>("hero");
  const [activeFieldKey, setActiveFieldKey] = useState<string | null>(null);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [hoveredBlock, setHoveredBlock] = useState<{ sectionId: string; fieldKey: string } | null>(null);
  const [inlineQuickEdit, setInlineQuickEdit] = useState<{
    sectionId: string;
    fieldKey: string;
    label: string;
    value: string;
  } | null>(null);

  const [toast, setToast] = useState<{ message: string; tone: "success" | "error" | "info" }>({
    message: "",
    tone: "info",
  });

  const inspectorInputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  const meta = PAGE_META[pageId] || {
    icon: Layout,
    titleKey: "public_content_manager",
    defaultTitle: `Contenu Public · ${pageId.toUpperCase()}`,
    defaultSubtitle: "Gestionnaire des textes et visuels de cette page.",
    publicPath: `/${pageId}`,
    defaultHeroImage: heroBg,
  };
  const PageIcon = meta.icon;

  const activeLangObj = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];
  const isCanvasRtl = activeLangObj.dir === "rtl";

  // Load Content
  const loadContent = useCallback(async () => {
    try {
      setLoading(true);
      let res;
      try {
        res = await api.get("/admin/site-content");
      } catch {
        res = await api.get("/site-content/admin");
      }
      let d = (res.data?.data ?? res.data) as SiteContentDocument;
      if (!d || typeof d !== "object") {
        d = { version: 1, updatedAt: null, updatedBy: null, pages: [] };
      }

      let pages = Array.isArray(d.pages) ? [...d.pages] : [];
      let p = pages.find((x) => x.id === pageId);
      if (!p) {
        p = {
          id: pageId,
          label: meta.defaultTitle,
          description: meta.defaultSubtitle,
          sections: [
            {
              id: "hero",
              label: "Bannière Hero",
              description: "Titre, sous-titre, badge et image d'arrière-plan de la bannière principale.",
              fields: [
                { key: "eyebrow", type: "text", label: "Badge / Surtitre", value: "" },
                { key: "title", type: "text", label: "Titre principal", value: "" },
                { key: "subtitle", type: "text", label: "Sous-titre", value: "" },
                { key: "image", type: "image", label: "Image de bannière", value: "" },
              ],
            },
            {
              id: "intro",
              label: "Introduction & Présentation",
              description: "Texte introductif ou description détaillée.",
              fields: [
                { key: "title", type: "text", label: "Titre de section", value: "" },
                { key: "body", type: "html", label: "Corps du texte (mise en forme)", value: "" },
              ],
            },
          ],
        };
        pages.push(p);
        d = { ...d, pages };
      }

      setDoc(d);
      setDirty(false);
      if (p?.sections?.length) {
        setSectionId(p.sections[0].id);
      }
    } catch (err) {
      setToast({ message: getApiErrorMessage(err, "Erreur lors du chargement"), tone: "error" });
    } finally {
      setLoading(false);
    }
  }, [pageId, meta.defaultTitle, meta.defaultSubtitle]);

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

  // Update Field
  const updateField = useCallback(
    (targetSectionId: string, fieldKey: string, transform: (prev: ContentField) => ContentField) => {
      if (!doc) return;
      setDoc((prevDoc) => {
        if (!prevDoc) return prevDoc;
        return {
          ...prevDoc,
          pages: prevDoc.pages.map((p) => {
            if (p.id !== pageId) return p;
            return {
              ...p,
              sections: p.sections.map((s) => {
                if (s.id !== targetSectionId) return s;
                return {
                  ...s,
                  fields: s.fields.map((f) => (f.key === fieldKey ? transform(f) : f)),
                };
              }),
            };
          }),
        };
      });
      setDirty(true);
    },
    [doc, pageId]
  );

  const handleFieldValueChange = useCallback(
    (targetSectionId: string, fieldKey: string, newValue: FieldValue) => {
      updateField(targetSectionId, fieldKey, (prev) => {
        if (lang === DEFAULT_LANG) return { ...prev, value: newValue };
        const translations = { ...(prev.translations || {}) };
        const blank = Array.isArray(newValue) ? newValue.length === 0 : newValue === "";
        if (blank) delete translations[lang];
        else translations[lang] = newValue;
        return { ...prev, translations };
      });
    },
    [lang, updateField]
  );

  // Save changes
  const handleSave = async () => {
    if (!doc) return;
    try {
      setSaving(true);
      try {
        await api.put("/admin/site-content", { pages: doc.pages });
      } catch {
        await api.put("/site-content", { pages: doc.pages });
      }
      await refreshSiteContent();
      setDirty(false);
      setToast({
        message: t("cms_saved_toast", "Modifications enregistrées et publiées en direct !"),
        tone: "success",
      });
    } catch (err) {
      setToast({ message: getApiErrorMessage(err, "Erreur d'enregistrement"), tone: "error" });
    } finally {
      setSaving(false);
    }
  };

  // Keyboard shortcut Ctrl+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (dirty && !saving) {
          void handleSave();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dirty, saving, doc]);

  // Upload Image
  const handleUploadImage = async (file: File, key: string, targetSectionId: string): Promise<string | null> => {
    try {
      setUploadingKey(key);
      const fd = new FormData();
      fd.append("image", file);
      let res;
      try {
        res = await api.post("/admin/site-content/upload", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } catch {
        res = await api.post("/site-content/upload", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      const url = res.data?.data?.url || res.data?.url;
      if (url) {
        handleFieldValueChange(targetSectionId, key, url);
        setToast({ message: "Image téléversée avec succès !", tone: "success" });
      }
      return url || null;
    } catch (err) {
      setToast({ message: getApiErrorMessage(err, "Échec du téléversement de l'image"), tone: "error" });
      return null;
    } finally {
      setUploadingKey(null);
    }
  };

  // Helper to read current value for section and key
  const getSectionFieldVal = useCallback(
    (secId: string, key: string): string => {
      if (!activePage) return "";
      const sec = activePage.sections.find((s) => s.id === secId);
      if (!sec) return "";
      const f = sec.fields.find((field) => field.key === key);
      if (!f) return "";
      const v = readValue(f, lang);
      if (!isEmpty(v)) return String(v);
      return BUILTIN_SITE_DEFAULTS[key] || "";
    },
    [activePage, lang]
  );

  const getSectionFieldRaw = useCallback(
    (secId: string, key: string): string => {
      if (!activePage) return "";
      const sec = activePage.sections.find((s) => s.id === secId);
      if (!sec) return "";
      const f = sec.fields.find((field) => field.key === key);
      if (!f) return "";
      const v = readValue(f, lang);
      return typeof v === "string" ? v : "";
    },
    [activePage, lang]
  );

  // Click-to-edit handler directly from the preview canvas
  const handleCanvasElementClick = (targetSectionId: string, fieldKey: string, label: string) => {
    setSectionId(targetSectionId);
    setActiveFieldKey(fieldKey);
    setSidebarTab("inspector");

    // Open inline quick-edit popover
    const currentVal = getSectionFieldRaw(targetSectionId, fieldKey);
    setInlineQuickEdit({
      sectionId: targetSectionId,
      fieldKey,
      label,
      value: currentVal,
    });

    // Auto-scroll inspector input into view
    setTimeout(() => {
      const el = document.getElementById(`field-input-${targetSectionId}-${fieldKey}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.focus();
      }
    }, 150);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4">
        <Loader2 className="w-10 h-10 text-[var(--gold)] animate-spin" />
        <p className="font-mono text-sm text-[var(--muted-foreground)]">Chargement de l'éditeur visuel Shopify CMS...</p>
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
    <div className="flex flex-col h-[calc(100vh-80px)] -m-3 sm:-m-6 lg:-m-8 bg-[#0b131e] text-slate-100 overflow-hidden font-sans">
      {toast.message && <Toast message={toast.message} tone={toast.tone} />}

      {/* ========================================================================= */}
      {/* 1. SHOPIFY-STYLE TOP STUDIO BAR                                            */}
      {/* ========================================================================= */}
      <header className="h-16 border-b border-slate-700/80 bg-[#0f172a]/95 backdrop-blur-md px-4 flex items-center justify-between gap-3 shrink-0 z-40 select-none shadow-md">
        {/* Left: Brand + Page Title + Path */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-widest bg-gradient-to-r from-amber-500/20 to-yellow-500/10 text-[var(--gold)] border border-[var(--gold)]/40 flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3 h-3 text-[var(--gold)] animate-pulse" />
              <span>Studio CMS Shopify</span>
            </span>
            <span className="text-slate-500 text-sm hidden sm:inline">/</span>
          </div>

          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1.5 rounded-lg bg-[var(--gold)]/15 text-[var(--gold)] shrink-0">
              <PageIcon className="w-4 h-4" />
            </div>
            <div className="truncate">
              <span className="font-bold text-sm text-white truncate block">
                {meta.defaultTitle}
              </span>
              <span className="font-mono text-[10px] text-slate-400 block truncate">
                {meta.publicPath}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Device Switcher + Language Selector */}
        <div className="hidden md:flex items-center gap-3">
          {/* Viewport Device Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-inner">
            <button
              type="button"
              onClick={() => setDeviceMode("desktop")}
              title="Aperçu Bureau (Plein écran)"
              className={`p-1.5 rounded-lg transition-all flex items-center gap-1.5 text-xs font-semibold ${
                deviceMode === "desktop"
                  ? "bg-[var(--gold)] text-black shadow-sm font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Monitor className="w-4 h-4" />
              <span className="hidden lg:inline">Bureau</span>
            </button>
            <button
              type="button"
              onClick={() => setDeviceMode("tablet")}
              title="Aperçu Tablette (768px)"
              className={`p-1.5 rounded-lg transition-all flex items-center gap-1.5 text-xs font-semibold ${
                deviceMode === "tablet"
                  ? "bg-[var(--gold)] text-black shadow-sm font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Tablet className="w-4 h-4" />
              <span className="hidden lg:inline">Tablette</span>
            </button>
            <button
              type="button"
              onClick={() => setDeviceMode("mobile")}
              title="Aperçu Mobile (385px)"
              className={`p-1.5 rounded-lg transition-all flex items-center gap-1.5 text-xs font-semibold ${
                deviceMode === "mobile"
                  ? "bg-[var(--gold)] text-black shadow-sm font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span className="hidden lg:inline">Mobile</span>
            </button>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-inner overflow-x-auto max-w-[260px] lg:max-w-none">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => setLang(l.code)}
                title={l.label}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  lang === l.code
                    ? "bg-[var(--gold)] text-black shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <span>{l.flag}</span>
                <span className="font-mono text-[11px]">{l.short}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Status + Public Link + Discard + Save Button */}
        <div className="flex items-center gap-2 shrink-0">
          {dirty ? (
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>Modifié en direct</span>
            </span>
          ) : (
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
              <Check className="w-3 h-3" />
              <span>À jour</span>
            </span>
          )}

          {activePage.path && (
            <a
              href={activePage.path}
              target="_blank"
              rel="noopener noreferrer"
              title="Ouvrir la page publique réelle dans un nouvel onglet"
              className="p-2 rounded-xl border border-slate-700 bg-slate-800/80 text-slate-300 hover:text-white hover:border-[var(--gold)] transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}

          <button
            type="button"
            onClick={loadContent}
            disabled={!dirty || saving}
            title="Annuler les modifications non enregistrées"
            className="p-2 rounded-xl border border-slate-700 bg-slate-800/80 text-slate-300 hover:text-red-400 hover:border-red-500/50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={!dirty || saving}
            className="btn-base btn-gold text-xs py-2 px-4.5 flex items-center gap-2 cursor-pointer shadow-lg hover:scale-[1.02] transition-transform disabled:opacity-40 disabled:cursor-not-allowed font-bold"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span className="hidden sm:inline">{t("cms_save", "Enregistrer & Publier")}</span>
            <span className="sm:hidden">Publier</span>
            <kbd className="hidden lg:inline text-[9px] px-1 py-0.5 rounded bg-black/20 text-black font-mono">
              Ctrl+S
            </kbd>
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. SPLIT STUDIO WORKSPACE: LEFT INSPECTOR + RIGHT LIVE CANVAS              */}
      {/* ========================================================================= */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* ----------------------------------------------------------------------- */}
        {/* LEFT PANEL: SHOPIFY-STYLE SECTIONS TREE & INSPECTOR                     */}
        {/* ----------------------------------------------------------------------- */}
        <aside className="w-full lg:w-[410px] border-r border-slate-800 bg-[#0f172a] flex flex-col shrink-0 z-30 shadow-xl overflow-hidden">
          {/* Sidebar Tab Header */}
          <div className="p-3 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-800/90 border border-slate-700 w-full">
              <button
                type="button"
                onClick={() => setSidebarTab("sections")}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  sidebarTab === "sections"
                    ? "bg-[var(--gold)] text-black shadow-sm font-extrabold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Sections ({activePage.sections.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setSidebarTab("inspector")}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  sidebarTab === "inspector"
                    ? "bg-[var(--gold)] text-black shadow-sm font-extrabold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Inspecteur</span>
              </button>
            </div>
          </div>

          {/* Sidebar Content Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
            {sidebarTab === "sections" ? (
              /* TAB 1: SECTIONS LIST */
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
                  <span className="font-semibold uppercase tracking-wider text-[11px] text-[var(--gold)]">
                    Structure de la page
                  </span>
                  <span>Cliquez pour personnaliser</span>
                </div>

                {activePage.sections.map((section, idx) => {
                  const isSel = section.id === activeSection?.id;
                  const customCount = countCustomised(section.fields);
                  return (
                    <div
                      key={section.id}
                      onClick={() => {
                        setSectionId(section.id);
                        setSidebarTab("inspector");
                      }}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                        isSel
                          ? "bg-slate-800/90 border-[var(--gold)] shadow-md ring-1 ring-[var(--gold)]/40"
                          : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-850"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                            isSel ? "bg-[var(--gold)] text-black" : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          #{idx + 1}
                        </div>
                        <div className="min-w-0 text-start">
                          <h4 className="font-bold text-sm text-slate-100 group-hover:text-[var(--gold)] transition-colors truncate">
                            {section.label}
                          </h4>
                          {section.description && (
                            <p className="text-[11px] text-slate-400 truncate mt-0.5 font-light">
                              {section.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {customCount > 0 && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30">
                            {customCount} modif.
                          </span>
                        )}
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-[var(--gold)] group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* TAB 2: SECTION SETTINGS / INSPECTOR */
              <div className="space-y-4">
                {/* Back to sections header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <button
                    type="button"
                    onClick={() => setSidebarTab("sections")}
                    className="text-xs font-semibold text-slate-400 hover:text-[var(--gold)] flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Toutes les sections</span>
                  </button>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono uppercase bg-slate-800 text-slate-300">
                    {activeSection?.id}
                  </span>
                </div>

                <div className="text-start">
                  <h3 className="font-bold text-base text-white flex items-center gap-2">
                    <span>{activeSection?.label}</span>
                  </h3>
                  {activeSection?.description && (
                    <p className="text-xs text-slate-400 mt-1">{activeSection.description}</p>
                  )}
                </div>

                {/* Fields List of Active Section */}
                <div className="space-y-4 pt-2">
                  {activeSection?.fields.map((field) => {
                    const isFieldHighlighted = activeFieldKey === field.key;
                    const custom = isCustomised(field);
                    const currentVal = readValue(field, lang);
                    const isValEmpty = isEmpty(currentVal);

                    return (
                      <div
                        key={field.key}
                        id={`field-box-${activeSection.id}-${field.key}`}
                        className={`p-4 rounded-2xl border transition-all text-start space-y-3 ${
                          isFieldHighlighted
                            ? "bg-slate-850 border-[var(--gold)] ring-2 ring-[var(--gold)]/40 shadow-lg"
                            : "bg-slate-900/80 border-slate-800 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
                            <span>{field.label}</span>
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono uppercase bg-slate-800 text-slate-400">
                              {field.type}
                            </span>
                          </label>

                          <div className="flex items-center gap-1.5">
                            {custom && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30">
                                Personnalisé
                              </span>
                            )}
                            {!isValEmpty && (
                              <button
                                type="button"
                                onClick={() => handleFieldValueChange(activeSection.id, field.key, "")}
                                title="Réinitialiser à la valeur par défaut"
                                className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition cursor-pointer"
                              >
                                <RotateCcw className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>

                        {field.hint && (
                          <p className="text-[11px] text-slate-400 font-light">{field.hint}</p>
                        )}

                        {/* Field Control by Type */}
                        {field.type === "image" ? (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <input
                                id={`field-input-${activeSection.id}-${field.key}`}
                                type="text"
                                dir="ltr"
                                value={String(currentVal ?? "")}
                                placeholder="/assets/image.jpg ou https://..."
                                onChange={(e) =>
                                  handleFieldValueChange(activeSection.id, field.key, e.target.value)
                                }
                                className={`${inputClass} flex-1 font-mono text-xs`}
                              />
                              <label
                                className="btn-base btn-gold text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer shrink-0 font-bold"
                                title="Importer un fichier image depuis votre ordinateur"
                              >
                                {uploadingKey === field.key ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Upload className="w-3.5 h-3.5" />
                                )}
                                <span>Importer</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      await handleUploadImage(file, field.key, activeSection.id);
                                    }
                                  }}
                                />
                              </label>
                            </div>

                            {/* Live Thumbnail */}
                            {Boolean(currentVal) && (
                              <div className="relative w-full h-32 rounded-xl overflow-hidden border border-[var(--gold)]/40 bg-black/40 group">
                                <img
                                  src={resolveSiteImageUrl(String(currentVal))}
                                  alt={field.label}
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleFieldValueChange(activeSection.id, field.key, "")}
                                  className="absolute top-2 end-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-red-600 transition opacity-0 group-hover:opacity-100 cursor-pointer"
                                  title="Supprimer cette image"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        ) : field.type === "html" || MULTILINE_KEY.test(field.key) ? (
                          <textarea
                            id={`field-input-${activeSection.id}-${field.key}`}
                            rows={3}
                            dir={activeLangObj.dir}
                            value={String(currentVal ?? "")}
                            placeholder={BUILTIN_SITE_DEFAULTS[field.key] || "Texte par défaut du site..."}
                            onChange={(e) =>
                              handleFieldValueChange(activeSection.id, field.key, e.target.value)
                            }
                            className={`${inputClass} leading-relaxed resize-y`}
                          />
                        ) : (
                          <input
                            id={`field-input-${activeSection.id}-${field.key}`}
                            type="text"
                            dir={activeLangObj.dir}
                            value={String(currentVal ?? "")}
                            placeholder={BUILTIN_SITE_DEFAULTS[field.key] || "Texte par défaut du site..."}
                            onChange={(e) =>
                              handleFieldValueChange(activeSection.id, field.key, e.target.value)
                            }
                            className={inputClass}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* ----------------------------------------------------------------------- */}
        {/* RIGHT PANEL: LIVE INTERACTIVE SHOPIFY PREVIEW CANVAS                   */}
        {/* ----------------------------------------------------------------------- */}
        <main className="flex-1 bg-[#070b12] overflow-y-auto flex flex-col items-center p-3 sm:p-6 lg:p-8 relative scrollbar-thin">
          {/* Subtle canvas background grid */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #d4a956 1px, transparent 0)`,
              backgroundSize: "24px 24px",
            }}
          />

          {/* Interactive Device Viewport Frame */}
          <div
            className={`transition-all duration-300 w-full flex flex-col relative z-10 ${
              deviceMode === "mobile"
                ? "max-w-[390px] rounded-[44px] border-[10px] border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden my-4 bg-slate-950 ring-1 ring-slate-700/50"
                : deviceMode === "tablet"
                ? "max-w-[768px] rounded-[30px] border-[8px] border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden my-4 bg-slate-950 ring-1 ring-slate-700/50"
                : "w-full max-w-6xl rounded-2xl border border-slate-800 shadow-2xl overflow-hidden bg-slate-950"
            }`}
          >
            {/* Simulated Device / Browser Top Header */}
            <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs select-none">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
              </div>

              {/* Faux browser URL or Mobile notch */}
              {deviceMode === "mobile" ? (
                <div className="w-24 h-4 bg-black rounded-full mx-auto" />
              ) : (
                <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-slate-400 max-w-sm truncate">
                  <span className="text-emerald-400">🔒</span>
                  <span className="truncate">rootstunisia.com{activePage.path}</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-slate-400 font-mono text-[10px]">
                <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[var(--gold)] font-bold">
                  {activeLangObj.short}
                </span>
              </div>
            </div>

            {/* LIVE WEBPAGE BODY WITH CLICK-TO-EDIT INTERACTION */}
            <div
              dir={isCanvasRtl ? "rtl" : "ltr"}
              className="bg-[#0b1420] text-slate-100 min-h-[600px] flex flex-col relative select-text"
            >
              {/* Floating Inline Quick Edit Bar (When clicking canvas element) */}
              {inlineQuickEdit && (
                <div className="sticky top-2 z-50 mx-4 p-3 rounded-2xl bg-slate-900/95 border-2 border-[var(--gold)] shadow-2xl backdrop-blur-md flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="p-1.5 rounded-lg bg-[var(--gold)]/20 text-[var(--gold)] shrink-0">
                      <Edit3 className="w-4 h-4" />
                    </span>
                    <div className="truncate text-start">
                      <span className="text-[10px] uppercase font-bold text-[var(--gold)] tracking-wider block">
                        Modification directe en ligne
                      </span>
                      <span className="text-xs font-bold text-white truncate block">
                        {inlineQuickEdit.label}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-1 max-w-md">
                    <input
                      type="text"
                      dir={activeLangObj.dir}
                      value={inlineQuickEdit.value}
                      placeholder="Tapez le nouveau texte ici..."
                      onChange={(e) => {
                        const val = e.target.value;
                        setInlineQuickEdit((prev) => (prev ? { ...prev, value: val } : null));
                        handleFieldValueChange(inlineQuickEdit.sectionId, inlineQuickEdit.fieldKey, val);
                      }}
                      className={`${inputClass} !py-1.5 text-xs`}
                    />
                    <button
                      type="button"
                      onClick={() => setInlineQuickEdit(null)}
                      className="p-1.5 rounded-lg bg-[var(--gold)] text-black font-bold text-xs hover:scale-105 transition-transform shrink-0"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setInlineQuickEdit(null)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* =================================================================== */}
              {/* SECTION: HERO BANNER (PRESENT ON ALL PAGES)                         */}
              {/* =================================================================== */}
              {(() => {
                const heroEyebrow = getSectionFieldVal("hero", "eyebrow") || meta.defaultTitle;
                const heroTitle = getSectionFieldVal("hero", "title") || meta.defaultTitle;
                const heroSubtitle =
                  getSectionFieldVal("hero", "subtitle") ||
                  meta.defaultSubtitle ||
                  "Explorez les archives officielles et la généalogie tunisienne.";
                const heroImgUrl =
                  resolveSiteImageUrl(getSectionFieldRaw("hero", "image")) || meta.defaultHeroImage;

                return (
                  <div
                    className="relative overflow-hidden min-h-[380px] sm:min-h-[460px] flex items-center justify-center p-6 sm:p-12 text-center group/hero border-b border-slate-800/80"
                    style={{
                      backgroundImage: `url(${heroImgUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/60 to-black/90 pointer-events-none" />

                    {/* Change Background Button Overlay */}
                    <button
                      type="button"
                      onClick={() => handleCanvasElementClick("hero", "image", "Image de fond de la bannière")}
                      className="absolute top-4 end-4 px-3 py-1.5 rounded-xl text-xs font-bold bg-black/75 text-amber-300 border border-amber-400/40 opacity-0 group-hover/hero:opacity-100 transition-opacity flex items-center gap-1.5 hover:bg-black cursor-pointer shadow-lg z-20"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-[var(--gold)]" />
                      <span>Changer l'image de fond</span>
                    </button>

                    <div className="relative z-10 max-w-3xl space-y-4 mx-auto flex flex-col items-center">
                      {/* Eyebrow / Badge */}
                      <div
                        onClick={() => handleCanvasElementClick("hero", "eyebrow", "Badge / Surtitre")}
                        className="group/item relative cursor-pointer"
                        title="Cliquer pour modifier le badge"
                      >
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-amber-400/10 text-amber-300 border border-amber-300/30 group-hover/item:ring-2 group-hover/item:ring-[var(--gold)] group-hover/item:bg-amber-400/20 transition-all">
                          <span>{heroEyebrow}</span>
                          <Edit3 className="w-3 h-3 text-[var(--gold)] opacity-0 group-hover/item:opacity-100 transition-opacity" />
                        </span>
                      </div>

                      {/* Main Title */}
                      <div
                        onClick={() => handleCanvasElementClick("hero", "title", "Titre principal")}
                        className="group/item relative cursor-pointer w-full"
                        title="Cliquer pour modifier le titre principal"
                      >
                        <h1 className="font-serif font-black text-2xl sm:text-4xl lg:text-5xl text-amber-50 tracking-wide leading-tight group-hover/item:text-[var(--gold)] transition-colors p-1 rounded-xl group-hover/item:ring-2 group-hover/item:ring-[var(--gold)]/60 group-hover/item:bg-black/30">
                          {heroTitle}
                        </h1>
                      </div>

                      {/* Gold separator rule */}
                      <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent mx-auto" />

                      {/* Subtitle */}
                      <div
                        onClick={() => handleCanvasElementClick("hero", "subtitle", "Sous-titre")}
                        className="group/item relative cursor-pointer w-full max-w-2xl"
                        title="Cliquer pour modifier le sous-titre"
                      >
                        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-light group-hover/item:text-white transition-colors p-2 rounded-xl group-hover/item:ring-2 group-hover/item:ring-[var(--gold)]/60 group-hover/item:bg-black/30">
                          {heroSubtitle}
                        </p>
                      </div>

                      {/* Call to action buttons preview */}
                      <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                        <span className="btn-base btn-gold text-xs py-2 px-5 font-bold shadow-lg pointer-events-none">
                          Consulter les collections
                        </span>
                        <span className="px-4 py-2 rounded-xl border border-white/20 text-xs text-white/90 font-semibold bg-white/5 pointer-events-none">
                          En savoir plus
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* =================================================================== */}
              {/* PAGE-SPECIFIC SECONDARY SECTIONS PREVIEW                            */}
              {/* =================================================================== */}
              {pageId === "home" && (
                <div className="space-y-8 p-6 sm:p-10">
                  {/* Mission Banner Section ("preserve") */}
                  {(() => {
                    const preserveTitle =
                      getSectionFieldVal("preserve", "title") ||
                      "Préservez Votre Lignée Tunisienne pour les Générations Futures";
                    const preserveDesc =
                      getSectionFieldVal("preserve", "description") ||
                      "Les archives familiales et actes d'état civil tunisiens sont des trésors vivants.";
                    const preserveImg =
                      resolveSiteImageUrl(getSectionFieldRaw("preserve", "image")) || eljem;

                    return (
                      <div
                        onClick={() => handleCanvasElementClick("preserve", "title", "Mission Banner")}
                        className="group/preserve relative rounded-3xl overflow-hidden p-6 sm:p-8 border-2 border-[var(--gold)]/40 text-start cursor-pointer hover:ring-2 hover:ring-[var(--gold)] transition-all shadow-xl"
                        style={{
                          backgroundImage: `url(${preserveImg})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      >
                        <div className="absolute inset-0 bg-slate-950/85 pointer-events-none" />
                        <div className="relative z-10 max-w-xl space-y-2">
                          <span className="text-[10px] uppercase font-mono font-bold text-[var(--gold)] tracking-widest">
                            Mission de Préservation
                          </span>
                          <h3 className="font-serif font-bold text-lg sm:text-2xl text-amber-100 group-hover/preserve:text-[var(--gold)] transition-colors">
                            {preserveTitle}
                          </h3>
                          <p className="text-xs text-slate-300 leading-relaxed font-light line-clamp-3">
                            {preserveDesc}
                          </p>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Why Roots Tunisia ("why") */}
                  {(() => {
                    const whyTitle =
                      getSectionFieldVal("why", "title") || "Pourquoi Explorer Roots Tunisia ?";
                    const whyIntro =
                      getSectionFieldVal("why", "intro") ||
                      "Une méthodologie rigoureuse basée sur les sources primaires, archives notariales et registres.";

                    return (
                      <div
                        onClick={() => handleCanvasElementClick("why", "title", "Section Pourquoi Roots Tunisia")}
                        className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 text-start space-y-3 cursor-pointer hover:border-[var(--gold)]/60 transition-all"
                      >
                        <span className="text-[10px] font-mono font-bold uppercase text-[var(--gold)]">
                          Excellence de Recherche
                        </span>
                        <h3 className="font-serif font-bold text-lg sm:text-xl text-white">
                          {whyTitle}
                        </h3>
                        <p className="text-xs text-slate-300 leading-relaxed">{whyIntro}</p>
                      </div>
                    );
                  })()}

                  {/* Final CTA ("cta") */}
                  {(() => {
                    const ctaTitle =
                      getSectionFieldVal("cta", "title") ||
                      "Prêt à Découvrir Votre Histoire Familiale ?";
                    const ctaDesc =
                      getSectionFieldVal("cta", "description") ||
                      "Accédez dès aujourd'hui aux archives nationales et construisez votre arbre généalogique.";

                    return (
                      <div
                        onClick={() => handleCanvasElementClick("cta", "title", "Appel à l'action final")}
                        className="p-8 rounded-3xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-black border-2 border-[var(--gold)]/40 text-center space-y-3 cursor-pointer hover:scale-[1.01] transition-transform"
                      >
                        <h3 className="font-serif font-bold text-xl sm:text-2xl text-amber-100">
                          {ctaTitle}
                        </h3>
                        <p className="text-xs text-slate-300 max-w-lg mx-auto">{ctaDesc}</p>
                        <div className="pt-2">
                          <span className="btn-base btn-gold text-xs py-2 px-5 font-bold shadow-md inline-block pointer-events-none">
                            Commencer l'exploration
                          </span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* ABOUT SECONDARY SECTIONS */}
              {pageId === "about" && (
                <div className="p-6 sm:p-10 space-y-6 text-start">
                  {(() => {
                    const missionTitle =
                      getSectionFieldVal("mission", "title") || "Notre Mission & Vision";
                    const missionIntro =
                      getSectionFieldVal("mission", "intro") ||
                      "Sauvegarder et numériser la mémoire généalogique des familles tunisiennes.";

                    return (
                      <div
                        onClick={() => handleCanvasElementClick("mission", "title", "Mission & Vision")}
                        className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3 cursor-pointer hover:border-[var(--gold)] transition-all"
                      >
                        <span className="text-[10px] font-mono font-bold uppercase text-[var(--gold)]">
                          Histoire & Racines
                        </span>
                        <h3 className="font-serif font-bold text-xl text-white">{missionTitle}</h3>
                        <p className="text-xs text-slate-300 leading-relaxed">{missionIntro}</p>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* CONTACT SECONDARY SECTIONS */}
              {pageId === "contact" && (
                <div className="p-6 sm:p-10 space-y-6 text-start">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div
                      onClick={() => handleCanvasElementClick("details", "email", "Email Officiel")}
                      className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 cursor-pointer hover:border-[var(--gold)] transition-all space-y-1"
                    >
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Email
                      </span>
                      <strong className="text-xs text-[var(--gold)] block font-mono">
                        {getSectionFieldVal("details", "email") || "contact@rootstunisia.com"}
                      </strong>
                    </div>

                    <div
                      onClick={() => handleCanvasElementClick("details", "phone", "Téléphone")}
                      className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 cursor-pointer hover:border-[var(--gold)] transition-all space-y-1"
                    >
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Téléphone
                      </span>
                      <strong className="text-xs text-[var(--gold)] block font-mono">
                        {getSectionFieldVal("details", "phone") || "+216 71 000 000"}
                      </strong>
                    </div>

                    <div
                      onClick={() => handleCanvasElementClick("details", "hours", "Horaires")}
                      className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 cursor-pointer hover:border-[var(--gold)] transition-all space-y-1"
                    >
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Horaires d'ouverture
                      </span>
                      <strong className="text-xs text-slate-200 block">
                        {getSectionFieldVal("details", "hours") || "09:00 – 17:00 (GMT+1)"}
                      </strong>
                    </div>

                    <div
                      onClick={() => handleCanvasElementClick("details", "address", "Adresse")}
                      className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 cursor-pointer hover:border-[var(--gold)] transition-all space-y-1"
                    >
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Adresse physique
                      </span>
                      <strong className="text-xs text-slate-200 block">
                        {getSectionFieldVal("details", "address") || "Tunis, Tunisie"}
                      </strong>
                    </div>
                  </div>
                </div>
              )}

              {/* PERIODS HISTORICAL ERAS PREVIEW */}
              {pageId === "periods" && (
                <div className="p-6 sm:p-10 space-y-4 text-start">
                  <div className="flex items-center justify-between pb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--gold)]">
                      Chronologie des 9 Grandes Ères
                    </span>
                    <span className="text-[10px] text-slate-400">Punique à Ère Contemporaine</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { era: "Carthage Punique", years: "814 – 146 av. J.-C.", rating: "★★★★★" },
                      { era: "Afrique Romaine", years: "146 av. J.-C. – 439", rating: "★★★★☆" },
                      { era: "Ère Ottomane & Husseinite", years: "1574 – 1881", rating: "★★★★★" },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1 hover:border-[var(--gold)]/50 transition-colors"
                      >
                        <span className="text-[10px] font-mono text-[var(--gold)] block font-bold">
                          {item.years}
                        </span>
                        <h4 className="font-bold text-xs text-white">{item.era}</h4>
                        <span className="text-[9px] text-amber-400 block">{item.rating}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
