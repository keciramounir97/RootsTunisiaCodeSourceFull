import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  Archive,
  ArrowDown,
  ArrowUp,
  Bold,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Compass,
  Copy,
  CornerDownLeft,
  Edit3,
  ExternalLink,
  Eye,
  EyeOff,
  FileCheck,
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
  Minimize2,
  Monitor,
  Music,
  Newspaper,
  PanelLeftClose,
  PanelLeftOpen,
  Phone,
  Plus,
  Redo2,
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
  Undo2,
  Upload,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useTranslation } from "../../context/TranslationContext";
import { api } from "../../api/client";
import { getApiErrorMessage } from "../../api/helpers";
import { resolveSiteImageUrl } from "../../hooks/useSiteImages";
import { refreshSiteContent } from "../../hooks/useSiteContent";
import Toast from "../../components/Toast";

// Authentic heritage assets for live preview
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

const CMS_NAV_ITEMS = [
  { id: "home", label: "Page d'Accueil", path: "/admin/home-content", route: "/", icon: HomeIcon, category: "Pages Publiques" },
  { id: "about", label: "À Propos & Mission", path: "/admin/about-content", route: "/about", icon: Info, category: "Pages Publiques" },
  { id: "gallery", label: "Galerie & Collections", path: "/admin/gallery-content", route: "/gallery", icon: ImageIcon, category: "Collections" },
  { id: "library", label: "Bibliothèque Numérique", path: "/admin/library-content", route: "/library", icon: BookOpen, category: "Collections" },
  { id: "audio", label: "Audio & Récits Oraux", path: "/admin/audio-content", route: "/audio", icon: Mic, category: "Collections" },
  { id: "documents", label: "Documents Numérisés", path: "/admin/documents-content", route: "/documents", icon: FileText, category: "Collections" },
  { id: "periods", label: "Périodes Historiques", path: "/admin/periods-content", route: "/periods", icon: Clock, category: "Histoire" },
  { id: "contact", label: "Contact & Coordonnées", path: "/admin/contact-content", route: "/contact", icon: Mail, category: "Pages Publiques" },
  { id: "articles", label: "Articles & Chroniques", path: "/admin/gallery-articles-content", route: "/articles", icon: Newspaper, category: "Recherche" },
  { id: "archives", label: "Archives Nationales", path: "/admin/archives-content", route: "/archives", icon: Archive, category: "Fiches & Références" },
  { id: "sources", label: "Sources Documentaires", path: "/admin/sources-content", route: "/sources", icon: Compass, category: "Fiches & Références" },
  { id: "placeholders", label: "Emplacements d'Images", path: "/admin/site-image-placeholders", route: "/gallery", icon: ImageIcon, category: "Médias" },
  { id: "legal", label: "Mentions Légales", path: "/admin/legal-content", route: "/legal", icon: FileCheck, category: "Légal" },
  { id: "footer", label: "Pied de Page (Footer)", path: "/admin/footer-settings", route: "/", icon: Sliders, category: "Structure" },
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
  "w-full px-3.5 py-2.5 rounded-xl border border-slate-700/80 bg-slate-900/90 text-sm text-slate-100 outline-none transition focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/25 placeholder:text-slate-500 shadow-inner";

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
  const [changeCount, setChangeCount] = useState(0);

  // Undo / Redo History Stack
  const historyStackRef = useRef<SiteContentDocument[]>([]);
  const historyIndexRef = useRef<number>(-1);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Pro Studio Layout Controls
  const [deviceMode, setDeviceMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [pageDropdownOpen, setPageDropdownOpen] = useState(false);

  // Editor Interaction State
  const [lang, setLang] = useState<string>(DEFAULT_LANG);
  const [sidebarTab, setSidebarTab] = useState<"sections" | "inspector">("sections");
  const [sectionId, setSectionId] = useState<string>("hero");
  const [activeFieldKey, setActiveFieldKey] = useState<string | null>(null);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredFieldId, setHoveredFieldId] = useState<string | null>(null);

  // Floating Inline Quick Edit Bar
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

  const pageDropdownRef = useRef<HTMLDivElement | null>(null);

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

  // Push Document to Undo History
  const pushToHistory = useCallback((newDoc: SiteContentDocument) => {
    const nextHistory = historyStackRef.current.slice(0, historyIndexRef.current + 1);
    nextHistory.push(JSON.parse(JSON.stringify(newDoc)));
    if (nextHistory.length > 30) nextHistory.shift();
    historyStackRef.current = nextHistory;
    historyIndexRef.current = nextHistory.length - 1;
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(false);
  }, []);

  const handleUndo = useCallback(() => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current -= 1;
      const targetDoc = historyStackRef.current[historyIndexRef.current];
      setDoc(JSON.parse(JSON.stringify(targetDoc)));
      setDirty(true);
      setCanUndo(historyIndexRef.current > 0);
      setCanRedo(true);
      setToast({ message: "Action annulée (Undo)", tone: "info" });
    }
  }, []);

  const handleRedo = useCallback(() => {
    if (historyIndexRef.current < historyStackRef.current.length - 1) {
      historyIndexRef.current += 1;
      const targetDoc = historyStackRef.current[historyIndexRef.current];
      setDoc(JSON.parse(JSON.stringify(targetDoc)));
      setDirty(true);
      setCanUndo(true);
      setCanRedo(historyIndexRef.current < historyStackRef.current.length - 1);
      setToast({ message: "Action rétablie (Redo)", tone: "info" });
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (pageDropdownRef.current && !pageDropdownRef.current.contains(e.target as Node)) {
        setPageDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

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
      setChangeCount(0);
      historyStackRef.current = [JSON.parse(JSON.stringify(d))];
      historyIndexRef.current = 0;
      setCanUndo(false);
      setCanRedo(false);

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
        const nextDoc: SiteContentDocument = {
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
        pushToHistory(nextDoc);
        return nextDoc;
      });
      setDirty(true);
      setChangeCount((c) => c + 1);
    },
    [doc, pageId, pushToHistory]
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

  // Pre-fill from Global Default
  const handleCopyFromDefault = useCallback(
    (targetSectionId: string, fieldKey: string) => {
      if (!activePage) return;
      const sec = activePage.sections.find((s) => s.id === targetSectionId);
      const f = sec?.fields.find((field) => field.key === fieldKey);
      if (f && !isEmpty(f.value)) {
        handleFieldValueChange(targetSectionId, fieldKey, f.value);
        setToast({ message: "Copié depuis la valeur par défaut !", tone: "info" });
      } else {
        const fallback = BUILTIN_SITE_DEFAULTS[fieldKey] || "";
        if (fallback) {
          handleFieldValueChange(targetSectionId, fieldKey, fallback);
          setToast({ message: "Modèle inséré avec succès !", tone: "info" });
        }
      }
    },
    [activePage, handleFieldValueChange]
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
      setChangeCount(0);
      setToast({
        message: t("cms_saved_toast", "✨ Modifications enregistrées et publiées en direct avec succès !"),
        tone: "success",
      });
    } catch (err) {
      setToast({ message: getApiErrorMessage(err, "Erreur d'enregistrement"), tone: "error" });
    } finally {
      setSaving(false);
    }
  };

  // Keyboard Shortcuts: Ctrl+S, Ctrl+Z, Ctrl+Y, Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const mod = isMac ? e.metaKey : e.ctrlKey;

      if (mod && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (dirty && !saving) void handleSave();
      } else if (mod && !e.shiftKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        handleUndo();
      } else if ((mod && e.shiftKey && e.key.toLowerCase() === "z") || (mod && e.key.toLowerCase() === "y")) {
        e.preventDefault();
        handleRedo();
      } else if (e.key === "Escape") {
        if (isFullscreen) setIsFullscreen(false);
        if (inlineQuickEdit) setInlineQuickEdit(null);
        if (pageDropdownOpen) setPageDropdownOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dirty, saving, doc, isFullscreen, inlineQuickEdit, pageDropdownOpen, handleUndo, handleRedo]);

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
    if (!isSidebarOpen) setIsSidebarOpen(true);

    const currentVal = getSectionFieldRaw(targetSectionId, fieldKey);
    setInlineQuickEdit({
      sectionId: targetSectionId,
      fieldKey,
      label,
      value: currentVal,
    });

    setTimeout(() => {
      const el = document.getElementById(`field-input-${targetSectionId}-${fieldKey}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.focus();
      }
    }, 150);
  };

  // Filter sections by search query
  const filteredSections = useMemo(() => {
    if (!activePage) return [];
    if (!searchQuery.trim()) return activePage.sections;
    const q = searchQuery.toLowerCase();
    return activePage.sections.filter((s) => {
      const matchSec = s.label.toLowerCase().includes(q) || (s.description || "").toLowerCase().includes(q);
      const matchFields = s.fields.some(
        (f) =>
          f.label.toLowerCase().includes(q) ||
          f.key.toLowerCase().includes(q) ||
          String(f.value || "").toLowerCase().includes(q)
      );
      return matchSec || matchFields;
    });
  }, [activePage, searchQuery]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4">
        <Loader2 className="w-10 h-10 text-[var(--gold)] animate-spin" />
        <p className="font-mono text-sm text-[var(--muted-foreground)]">Chargement du Studio CMS Professionnel...</p>
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
    <div
      className={`flex flex-col bg-[#070d17] text-slate-100 overflow-hidden font-sans transition-all duration-200 ${
        isFullscreen
          ? "fixed inset-0 z-[100] h-screen w-screen m-0"
          : "h-[calc(100vh-80px)] -m-3 sm:-m-6 lg:-m-8 rounded-none sm:rounded-2xl border border-slate-800/80 shadow-2xl"
      }`}
    >
      {toast.message && <Toast message={toast.message} tone={toast.tone} />}

      {/* ========================================================================= */}
      {/* 1. TOP STUDIO PRO BAR: BREADCRUMB, HISTORY, VIEWPORT, ZOOM, SAVE          */}
      {/* ========================================================================= */}
      <header className="h-16 border-b border-slate-800 bg-[#0c1524]/95 backdrop-blur-md px-3 sm:px-5 flex items-center justify-between gap-3 shrink-0 z-40 select-none shadow-md">
        {/* Left: Quick Page Switcher Dropdown */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0" ref={pageDropdownRef}>
          <button
            type="button"
            onClick={() => setIsSidebarOpen((v) => !v)}
            title={isSidebarOpen ? "Masquer le panneau inspecteur" : "Afficher le panneau inspecteur"}
            className="p-2 rounded-xl border border-slate-700/80 bg-slate-800/80 text-slate-300 hover:text-[var(--gold)] hover:border-[var(--gold)]/50 transition-colors cursor-pointer shrink-0"
          >
            {isSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setPageDropdownOpen((v) => !v)}
              className="px-3 py-1.5 rounded-xl border border-slate-700/90 bg-slate-800/90 hover:bg-slate-750 hover:border-[var(--gold)]/60 text-slate-200 text-xs font-bold transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <div className="p-1 rounded-md bg-[var(--gold)]/15 text-[var(--gold)] shrink-0">
                <PageIcon className="w-3.5 h-3.5" />
              </div>
              <span className="truncate max-w-[140px] sm:max-w-[200px] text-white">
                {meta.defaultTitle}
              </span>
              <span className="font-mono text-[10px] text-slate-400 hidden md:inline">
                ({meta.publicPath})
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                  pageDropdownOpen ? "rotate-180 text-[var(--gold)]" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu of all Pages */}
            {pageDropdownOpen && (
              <div className="absolute top-full start-0 mt-2 w-72 sm:w-80 rounded-2xl border border-slate-700 bg-[#0f1a2d] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-[var(--gold)] border-b border-slate-800 flex items-center justify-between">
                  <span>Navigation Rapide Studio</span>
                  <span className="font-mono text-slate-500">14 Pages</span>
                </div>
                <div className="max-h-80 overflow-y-auto py-1 space-y-0.5 scrollbar-thin">
                  {CMS_NAV_ITEMS.map((item) => {
                    const ItemIcon = item.icon;
                    const isCur = item.id === pageId;
                    return (
                      <a
                        key={item.id}
                        href={item.path}
                        className={`w-full px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                          isCur
                            ? "bg-[var(--gold)] text-black font-bold shadow-sm"
                            : "text-slate-300 hover:bg-slate-800/90 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <ItemIcon className="w-3.5 h-3.5 shrink-0 opacity-80" />
                          <span className="truncate">{item.label}</span>
                        </div>
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                            isCur ? "bg-black/20 text-black" : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {item.route}
                        </span>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Undo & Redo Controls */}
          <div className="hidden sm:flex items-center p-0.5 rounded-xl bg-slate-900/90 border border-slate-800">
            <button
              type="button"
              onClick={handleUndo}
              disabled={!canUndo}
              title="Annuler (Ctrl+Z)"
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleRedo}
              disabled={!canRedo}
              title="Rétablir (Ctrl+Y)"
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center: Device Switcher + Zoom + Language */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Device Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-inner">
            <button
              type="button"
              onClick={() => setDeviceMode("desktop")}
              title="Aperçu Bureau (Plein écran / 1280px)"
              className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 text-xs font-semibold ${
                deviceMode === "desktop"
                  ? "bg-[var(--gold)] text-black shadow-sm font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Bureau</span>
            </button>
            <button
              type="button"
              onClick={() => setDeviceMode("tablet")}
              title="Aperçu Tablette (768px × 1024px)"
              className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 text-xs font-semibold ${
                deviceMode === "tablet"
                  ? "bg-[var(--gold)] text-black shadow-sm font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
              <span>Tablette</span>
            </button>
            <button
              type="button"
              onClick={() => setDeviceMode("mobile")}
              title="Aperçu Mobile (390px × 844px)"
              className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 text-xs font-semibold ${
                deviceMode === "mobile"
                  ? "bg-[var(--gold)] text-black shadow-sm font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile</span>
            </button>
          </div>

          {/* Zoom Level Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-inner text-xs">
            <button
              type="button"
              onClick={() => setZoomLevel((z) => (z === 100 ? 85 : z === 85 ? 75 : 100))}
              title="Changer le niveau de zoom"
              className="px-2 py-1 rounded-lg text-slate-400 hover:text-white font-mono font-bold flex items-center gap-1"
            >
              <ZoomIn className="w-3.5 h-3.5 text-[var(--gold)]" />
              <span>{zoomLevel}%</span>
            </button>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-inner">
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

        {/* Right: Dirty Pill + Fullscreen + Link + Discard + Save */}
        <div className="flex items-center gap-2 shrink-0">
          {dirty ? (
            <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>{changeCount} modif.</span>
            </span>
          ) : (
            <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
              <Check className="w-3 h-3" />
              <span>Publié</span>
            </span>
          )}

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={() => setIsFullscreen((v) => !v)}
            title={isFullscreen ? "Quitter le plein écran (Échap)" : "Plein écran Studio"}
            className="p-2 rounded-xl border border-slate-700/80 bg-slate-800/80 text-slate-300 hover:text-white hover:border-[var(--gold)] transition-colors cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Public Page Link */}
          {activePage.path && (
            <a
              href={activePage.path}
              target="_blank"
              rel="noopener noreferrer"
              title="Ouvrir la page publique réelle dans un nouvel onglet"
              className="p-2 rounded-xl border border-slate-700/80 bg-slate-800/80 text-slate-300 hover:text-white hover:border-[var(--gold)] transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}

          {/* Revert / Discard */}
          <button
            type="button"
            onClick={loadContent}
            disabled={!dirty || saving}
            title="Annuler toutes les modifications non enregistrées"
            className="p-2 rounded-xl border border-slate-700/80 bg-slate-800/80 text-slate-300 hover:text-red-400 hover:border-red-500/50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Save Button */}
          <button
            type="button"
            onClick={handleSave}
            disabled={!dirty || saving}
            className="btn-base btn-gold text-xs py-2 px-4 flex items-center gap-2 cursor-pointer shadow-lg hover:scale-[1.02] transition-transform disabled:opacity-40 disabled:cursor-not-allowed font-bold"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span className="hidden sm:inline">{t("cms_save", "Enregistrer & Publier")}</span>
            <span className="sm:hidden">Publier</span>
            <kbd className="hidden xl:inline text-[9px] px-1 py-0.5 rounded bg-black/20 text-black font-mono">
              Ctrl+S
            </kbd>
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. SPLIT WORKSPACE: COLLAPSIBLE INSPECTOR + RIGHT LIVE PREVIEW CANVAS      */}
      {/* ========================================================================= */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* ----------------------------------------------------------------------- */}
        {/* LEFT PANEL: SHOPIFY-STYLE SECTIONS TREE & DETAILED INSPECTOR            */}
        {/* ----------------------------------------------------------------------- */}
        {isSidebarOpen && (
          <aside className="w-full lg:w-[420px] border-r border-slate-800/90 bg-[#0e1726] flex flex-col shrink-0 z-30 shadow-2xl overflow-hidden animate-in slide-in-from-left duration-200">
            {/* Search Filter Header */}
            <div className="p-3 border-b border-slate-800 bg-[#0a1220] space-y-2.5 shrink-0">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filtrer les sections ou champs..."
                  className="w-full ps-9 pe-8 py-2 text-xs rounded-xl border border-slate-700/80 bg-slate-900 text-slate-100 placeholder:text-slate-500 outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)]/40 transition shadow-inner"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute end-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Tabs Switcher: Sections vs Inspecteur */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-800/90 border border-slate-700/80">
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

            {/* Sidebar Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
              {sidebarTab === "sections" ? (
                /* TAB 1: SECTIONS LIST */
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
                    <span className="font-semibold uppercase tracking-wider text-[11px] text-[var(--gold)]">
                      Structure de la page
                    </span>
                    <span className="text-[11px] text-slate-500">Cliquez pour modifier</span>
                  </div>

                  {filteredSections.map((section, idx) => {
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
                            ? "bg-slate-800/95 border-[var(--gold)] shadow-md ring-1 ring-[var(--gold)]/40"
                            : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-850"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                              isSel ? "bg-[var(--gold)] text-black shadow-sm" : "bg-slate-800 text-slate-400"
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
                  {/* Inspector Header */}
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
                      ID: {activeSection?.id}
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

                  {/* Section Fields */}
                  <div className="space-y-4 pt-1">
                    {activeSection?.fields.map((field) => {
                      const isFieldHighlighted = activeFieldKey === field.key;
                      const custom = isCustomised(field);
                      const currentVal = readValue(field, lang);
                      const isValEmpty = isEmpty(currentVal);
                      const currentStr = String(currentVal ?? "");

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
                              {/* Copy Default Button */}
                              <button
                                type="button"
                                onClick={() => handleCopyFromDefault(activeSection.id, field.key)}
                                title={
                                  lang === DEFAULT_LANG
                                    ? "Insérer le texte recommandé par défaut"
                                    : "Copier la valeur depuis la version par défaut"
                                }
                                className="p-1 rounded text-slate-400 hover:text-[var(--gold)] hover:bg-[var(--gold)]/10 transition cursor-pointer"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                              </button>

                              {custom && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30">
                                  Personnalisé
                                </span>
                              )}
                              {!isValEmpty && (
                                <button
                                  type="button"
                                  onClick={() => handleFieldValueChange(activeSection.id, field.key, "")}
                                  title="Réinitialiser à vide"
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

                          {/* Control By Type */}
                          {field.type === "image" ? (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <input
                                  id={`field-input-${activeSection.id}-${field.key}`}
                                  type="text"
                                  dir="ltr"
                                  value={currentStr}
                                  placeholder="/assets/image.jpg ou https://..."
                                  onChange={(e) =>
                                    handleFieldValueChange(activeSection.id, field.key, e.target.value)
                                  }
                                  className={`${inputClass} flex-1 font-mono text-xs`}
                                />
                                <label
                                  className="btn-base btn-gold text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer shrink-0 font-bold shadow-md"
                                  title="Téléverser une image depuis votre ordinateur"
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

                              {/* Live Thumbnail Preview */}
                              {Boolean(currentVal) && (
                                <div className="relative w-full h-32 rounded-xl overflow-hidden border border-[var(--gold)]/40 bg-black/40 group">
                                  <img
                                    src={resolveSiteImageUrl(currentStr)}
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
                            <div className="space-y-1">
                              <textarea
                                id={`field-input-${activeSection.id}-${field.key}`}
                                rows={3}
                                dir={activeLangObj.dir}
                                value={currentStr}
                                placeholder={BUILTIN_SITE_DEFAULTS[field.key] || "Texte par défaut du site..."}
                                onChange={(e) =>
                                  handleFieldValueChange(activeSection.id, field.key, e.target.value)
                                }
                                className={`${inputClass} leading-relaxed resize-y`}
                              />
                              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                                <span>{currentStr.length} caractères</span>
                                {currentStr.length > 0 && currentStr.length < 250 && (
                                  <span className="text-emerald-400 font-sans">✓ Longueur optimale</span>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <input
                                id={`field-input-${activeSection.id}-${field.key}`}
                                type="text"
                                dir={activeLangObj.dir}
                                value={currentStr}
                                placeholder={BUILTIN_SITE_DEFAULTS[field.key] || "Texte par défaut du site..."}
                                onChange={(e) =>
                                  handleFieldValueChange(activeSection.id, field.key, e.target.value)
                                }
                                className={inputClass}
                              />
                              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                                <span>{currentStr.length} caractères</span>
                                {field.key === "title" && currentStr.length >= 20 && currentStr.length <= 70 && (
                                  <span className="text-emerald-400 font-sans">✓ Idéal SEO</span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* RIGHT PANEL: LIVE INTERACTIVE PREVIEW CANVAS WITH CLICK-TO-EDIT        */}
        {/* ----------------------------------------------------------------------- */}
        <main className="flex-1 bg-[#05080e] overflow-y-auto flex flex-col items-center p-3 sm:p-6 lg:p-8 relative scrollbar-thin">
          {/* Studio Canvas Background Grid */}
          <div
            className="absolute inset-0 opacity-[0.035] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #d4af37 1px, transparent 0)`,
              backgroundSize: "28px 28px",
            }}
          />

          {/* Interactive Device Viewport Frame with Zoom */}
          <div
            style={{
              transform: zoomLevel !== 100 ? `scale(${zoomLevel / 100})` : undefined,
              transformOrigin: "top center",
              transition: "transform 0.2s ease, max-width 0.3s ease",
            }}
            className={`w-full flex flex-col relative z-10 ${
              deviceMode === "mobile"
                ? "max-w-[390px] rounded-[48px] border-[10px] border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] overflow-hidden my-4 bg-slate-950 ring-1 ring-slate-700/60"
                : deviceMode === "tablet"
                ? "max-w-[768px] rounded-[32px] border-[8px] border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden my-4 bg-slate-950 ring-1 ring-slate-700/60"
                : "w-full max-w-6xl rounded-2xl border border-slate-800 shadow-2xl overflow-hidden bg-slate-950 my-2"
            }`}
          >
            {/* Simulated Device Top Bar */}
            <div className="bg-[#0b1320] px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs select-none">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
              </div>

              {/* Faux browser URL or Mobile Dynamic Island */}
              {deviceMode === "mobile" ? (
                <div className="w-24 h-4 bg-black rounded-full mx-auto shadow-inner" />
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
                <div className="sticky top-2 z-50 mx-4 p-3 rounded-2xl bg-slate-900/95 border-2 border-[var(--gold)] shadow-2xl backdrop-blur-md flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="p-1.5 rounded-lg bg-[var(--gold)]/20 text-[var(--gold)] shrink-0">
                      <Edit3 className="w-4 h-4 text-[var(--gold)]" />
                    </span>
                    <div className="truncate text-start">
                      <span className="text-[10px] uppercase font-bold text-[var(--gold)] tracking-wider block">
                        Modification directe en direct
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
                      title="Valider"
                      className="p-1.5 rounded-lg bg-[var(--gold)] text-black font-bold text-xs hover:scale-105 transition-transform shrink-0 cursor-pointer shadow-md"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setInlineQuickEdit(null)}
                      title="Fermer"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition shrink-0 cursor-pointer"
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
                    <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/60 to-black/90 pointer-events-none" />

                    {/* Change Background Button Overlay */}
                    <button
                      type="button"
                      onClick={() => handleCanvasElementClick("hero", "image", "Image de fond de la bannière")}
                      className="absolute top-4 end-4 px-3 py-1.5 rounded-xl text-xs font-bold bg-black/80 text-amber-300 border border-amber-400/40 opacity-0 group-hover/hero:opacity-100 transition-opacity flex items-center gap-1.5 hover:bg-black cursor-pointer shadow-lg z-20"
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
                        <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-amber-400/10 text-amber-300 border border-amber-300/30 group-hover/item:ring-2 group-hover/item:ring-[var(--gold)] group-hover/item:bg-amber-400/20 transition-all">
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

                      {/* Gold Separator Rule */}
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
