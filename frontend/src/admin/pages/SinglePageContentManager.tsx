import React, { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import type { GrapesBuilderPayload } from "../components/cms/GrapesJsBuilder";
import type { GrapesSeedContext } from "../components/cms/grapesTemplates";

const GrapesJsBuilder = lazy(() => import("../components/cms/GrapesJsBuilder"));

// Authentic 100% Tunisian heritage assets (No foreign / Abrahamic paintings!)
import carthage from "../../assets/01_Carthage_Ancient_Ruins_Landscape.jpg";
import carthageForum from "../../assets/slider-carthage.jpg";
import eljem from "../../assets/04_El_Jem_Amphitheater_Panorama.jpg";
import eljemMonument from "../../assets/eljem.jpg";
import kairouan from "../../assets/14_Kairouan_Mosque_Arched_Doorways_Dome.jpg";
import kairouanNight from "../../assets/13_Kairouan_Minaret_Night_Illuminated.jpg";
import sidiBouSaid from "../../assets/11_Sidi_Bou_Said_Blue_Doors_Bougainvillea.jpg";
import sidiCourtyard from "../../assets/12_Sidi_Bou_Said_Blue_Gate_Courtyard.jpg";
import medina from "../../assets/16_Medina_Ornate_Door_Blue_Grille.jpg";
import medinaStreet from "../../assets/medina-tunis.jpg";
import djerba from "../../assets/djerba.jpg";
import fortress from "../../assets/17_Fortress_Aerial_Courtyard_Palms.jpg";
import manuscript from "../../assets/manuscript.jpg";
import familyArchive from "../../assets/family-archive.jpg";
import capitolium from "../../assets/02_Capitolium_Temple_Roman_Arches.jpg";
import tilework from "../../assets/07_Mosque_Mihrab_Intricate_Tilework.jpg";

// Verified collection of 100% authentic Tunisian heritage images for 1-click selection
export const TUNISIA_HERITAGE_IMAGES = [
  {
    id: "carthage-pan",
    url: carthage,
    title: "Carthage — Ruines Antiques & Vue Méditerranéenne",
    titleAr: "آثار قرطاج التاريخية وإطلالة خليج تونس",
    region: "Carthage · قرطاج",
    category: "Antiquité",
  },
  {
    id: "eljem-pan",
    url: eljem,
    title: "El Jem — Amphithéâtre Romain de Thysdrus",
    titleAr: "قصر الجم الروماني الأثري",
    region: "Mahdia / Sahel · المهدية",
    category: "Monuments",
  },
  {
    id: "sidi-doors",
    url: sidiBouSaid,
    title: "Sidi Bou Saïd — Portes Cloutées & Bougainvilliers",
    titleAr: "أبواب سيدي بوسعيد الزرقاء وزهور الجهنمية",
    region: "Cap Carthage · سيدي بوسعيد",
    category: "Patrimoine Côtier",
  },
  {
    id: "kairouan-mosque",
    url: kairouan,
    title: "Kairouan — Grande Mosquée Oqba Ibn Nafi",
    titleAr: "جامع عقبة بن نافع وأروقة القيروان العريقة",
    region: "Kairouan · القيروان",
    category: "Lieux Spirituels",
  },
  {
    id: "medina-door",
    url: medina,
    title: "Médina de Tunis — Porte Patrimoniale Cloutée",
    titleAr: "أبواب مدينة تونس العتيقة والزخارف الأندلسية",
    region: "Tunis Médina · مدينة تونس",
    category: "Patrimoine Urbain",
  },
  {
    id: "djerba-menzel",
    url: djerba,
    title: "Djerba — Menzel Traditionnel & Oasis",
    titleAr: "منازل جربة البيضاء وواحات النخيل",
    region: "Djerba · جربة",
    category: "Architecture Insulaire",
  },
  {
    id: "fortress-ribat",
    url: fortress,
    title: "Côte Tunisienne — Ribat & Forteresse Maritime",
    titleAr: "رباط وقلاع السواحل التونسية التاريخية",
    region: "Sahel Tunisien · السواحل التونسية",
    category: "Forteresses",
  },
  {
    id: "family-archive-doc",
    url: familyArchive,
    title: "Archives Familiales — Registre Notarié & Sijill",
    titleAr: "سجلات التركات والعدول والأنساب التونسية",
    region: "Archives Nationales · الأرشيف الوطني",
    category: "Manuscrits",
  },
  {
    id: "capitolium-dougga",
    url: capitolium,
    title: "Dougga — Temple du Capitole & Théâtre Antique",
    titleAr: "معبد الكابيتول بدقة الرومانية",
    region: "Béja / Dougga · باجة / دقة",
    category: "Antiquité",
  },
  {
    id: "kairouan-minaret",
    url: kairouanNight,
    title: "Kairouan — Minaret Antique Éclairé de Nuit",
    titleAr: "صومعة القيروان المضاءة ليلاً",
    region: "Kairouan · القيروان",
    category: "Monuments",
  },
  {
    id: "tilework-mihrab",
    url: tilework,
    title: "Arts Islamiques — Céramiques et Faïences de Tunis",
    titleAr: "الخزف التونسي والزليج الأندلسي العريق",
    region: "Zaytouna / Médina · جامع الزيتونة",
    category: "Art & Ornements",
  },
  {
    id: "carthage-forum",
    url: carthageForum,
    title: "Carthage Byrsa — Vue Panoramique du Forum",
    titleAr: "هضبة بيرصا والمنتدى الروماني بقرطاج",
    region: "Carthage · قرطاج",
    category: "Antiquité",
  },
];

type FieldType = "text" | "html" | "image" | "list" | "builder_html" | "css" | "json";
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
  { code: DEFAULT_LANG, label: "Toutes les langues (Défaut global)", short: "ALL", flag: "🌐", dir: "ltr" as const },
  { code: "fr", label: "Français", short: "FR", flag: "🇫🇷", dir: "ltr" as const },
  { code: "ar", label: "العربية", short: "AR", flag: "🇹🇳", dir: "rtl" as const },
  { code: "en", label: "English", short: "EN", flag: "🇬🇧", dir: "ltr" as const },
  { code: "it", label: "Italiano", short: "IT", flag: "🇮🇹", dir: "ltr" as const },
  { code: "es", label: "Español", short: "ES", flag: "🇪🇸", dir: "ltr" as const },
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
  { id: "archives", label: "Archives Nationales", path: "/admin/archives-content", route: "/archives", icon: Archive, category: "Fiches & Références" },
  { id: "sources", label: "Sources Documentaires", path: "/admin/sources-content", route: "/sources", icon: Compass, category: "Fiches & Références" },
  { id: "articles", label: "Articles & Chroniques", path: "/admin/gallery-articles-content", route: "/articles", icon: Newspaper, category: "Recherche" },
  { id: "placeholders", label: "Emplacements d'Images (Pages)", path: "/admin/site-image-placeholders", route: "/gallery", icon: ImageIcon, category: "Médias" },
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
    defaultHeroImage: carthage,
  },
  about: {
    icon: Info,
    titleKey: "about_public_content",
    defaultTitle: "À Propos & Mission",
    defaultSubtitle: "Gérez la mission, la méthodologie de recherche et l'histoire patrimoniale de la plateforme.",
    publicPath: "/about",
    defaultHeroImage: carthageForum,
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
    publicPath: "/gallery/documents",
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
    defaultHeroImage: medina,
  },
  archives: {
    icon: Archive,
    titleKey: "archives_public_content",
    defaultTitle: "Archives Nationales de Tunisie",
    defaultSubtitle: "Présentation des fonds officiels, registres de Dar el-Bey et archives de l'État tunisien.",
    publicPath: "/archives",
    defaultHeroImage: fortress,
  },
  sources: {
    icon: Compass,
    titleKey: "sources_public_content",
    defaultTitle: "Sources Documentaires & Sijillat",
    defaultSubtitle: "Inventaire et guide méthodologique des sources généalogiques et archivistiques tunisiennes.",
    publicPath: "/sources",
    defaultHeroImage: kairouan,
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
  legal: {
    icon: FileCheck,
    titleKey: "legal_content",
    defaultTitle: "Mentions Légales & Confidentialité",
    defaultSubtitle: "Gestion des conditions d'utilisation, politique RGPD et protection des données.",
    publicPath: "/terms",
    defaultHeroImage: familyArchive,
  },
  footer: {
    icon: Sliders,
    titleKey: "footer_settings",
    defaultTitle: "Pied de Page & Paramètres Généraux",
    defaultSubtitle: "Liens institutionnels, réseaux sociaux, copyright et coordonnées du bas de page.",
    publicPath: "/",
    defaultHeroImage: carthage,
  },
};

const inputClass =
  "w-full px-4 py-3 rounded-xl border border-slate-700/80 bg-slate-900/95 text-sm sm:text-base text-slate-100 outline-none transition focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/30 placeholder:text-slate-500 shadow-inner";

const isEmpty = (value: FieldValue | undefined) =>
  value === undefined ||
  (Array.isArray(value) ? value.length === 0 : !String(value).trim());

const emptyFor = (type: FieldType): FieldValue => (type === "list" ? [] : "");

const readValue = (field: ContentField, lang: string): FieldValue =>
  lang === DEFAULT_LANG ? field.value : field.translations?.[lang] ?? emptyFor(field.type);

const isCustomised = (field: ContentField) =>
  !isEmpty(field.value) ||
  (field.translations &&
    Object.values(field.translations).some((v) => !isEmpty(v)));

const BUILTIN_SITE_DEFAULTS: Record<string, string> = {
  eyebrow: "PATRIMOINE & GÉNÉALOGIE DE TUNISIE",
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
  const [viewMode, setViewMode] = useState<"visual" | "grapesjs" | "iframe">(() => {
    try {
      const mode = new URLSearchParams(window.location.search).get("mode");
      if (mode === "grapesjs" || mode === "iframe") return mode;
    } catch {
      // ignore SSR/test window absence
    }
    return "visual";
  });
  const [deviceMode, setDeviceMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [pageDropdownOpen, setPageDropdownOpen] = useState(false);
  const [iframeKey, setIframeKey] = useState<number>(Date.now());

  // Editor Interaction State
  const [lang, setLang] = useState<string>(DEFAULT_LANG);
  const [sidebarTab, setSidebarTab] = useState<"sections" | "inspector">("sections");
  const [sectionId, setSectionId] = useState<string>("hero");
  const [activeFieldKey, setActiveFieldKey] = useState<string | null>(null);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredFieldId, setHoveredFieldId] = useState<string | null>(null);

  // Tunisian Media Selector Modal State
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [mediaTarget, setMediaTarget] = useState<{ sectionId: string; fieldKey: string; label: string } | null>(null);
  const [mediaFilterRegion, setMediaFilterRegion] = useState<string>("all");
  const [mediaSearchQuery, setMediaSearchQuery] = useState("");

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
    defaultHeroImage: carthage,
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
              label: "Bannière Hero Principale",
              description: "Titre, sous-titre, badge et image d'arrière-plan de la bannière.",
              fields: [
                { key: "eyebrow", type: "text", label: "Badge / Surtitre", value: "" },
                { key: "title", type: "text", label: "Titre principal (H1)", value: "" },
                { key: "subtitle", type: "text", label: "Sous-titre descriptif", value: "" },
                { key: "image", type: "image", label: "Image de fond de bannière", value: "" },
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

  const mergeGrapesIntoDoc = useCallback(
    (baseDoc: SiteContentDocument, payload: GrapesBuilderPayload): SiteContentDocument => {
      const next: SiteContentDocument = JSON.parse(JSON.stringify(baseDoc));
      const targetPage = next.pages.find((p) => p.id === pageId);
      if (!targetPage) return baseDoc;
      let gSection = targetPage.sections.find((s) => s.id === "grapes_builder");
      if (!gSection) {
        gSection = {
          id: "grapes_builder",
          label: "GrapesJS Visual Builder",
          fields: [
            { key: "html", type: "builder_html", label: "GrapesJS HTML", value: "" },
            { key: "css", type: "css", label: "GrapesJS CSS", value: "" },
            { key: "project", type: "json", label: "GrapesJS Project Data", value: "" },
          ],
        };
        targetPage.sections.push(gSection);
      }
      const upsert = (key: "html" | "css" | "project", type: FieldType, val: string) => {
        let field = gSection!.fields.find((f) => f.key === key);
        if (!field) {
          field = { key, type, label: key, value: "" };
          gSection!.fields.push(field);
        }
        field.type = type;
        if (lang === DEFAULT_LANG) {
          field.value = val;
        } else {
          const translations = { ...(field.translations || {}) };
          if (val) translations[lang] = val;
          else delete translations[lang];
          field.translations = translations;
        }
      };
      upsert("html", "builder_html", payload.html);
      upsert("css", "css", payload.css);
      upsert("project", "json", payload.projectJson);
      return next;
    },
    [lang, pageId],
  );

  // Save changes
  const handleSave = async (overrideDoc?: SiteContentDocument) => {
    const targetDoc = overrideDoc || doc;
    if (!targetDoc) return;
    try {
      setSaving(true);
      try {
        await api.put("/admin/site-content", { pages: targetDoc.pages });
      } catch {
        await api.put("/site-content", { pages: targetDoc.pages });
      }
      await refreshSiteContent();
      setDirty(false);
      setChangeCount(0);
      setIframeKey(Date.now());
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

  const handleGrapesChange = useCallback(
    (payload: GrapesBuilderPayload) => {
      setDoc((prev) => {
        if (!prev) return prev;
        return mergeGrapesIntoDoc(prev, payload);
      });
      setDirty(true);
      setChangeCount((c) => c + 1);
    },
    [mergeGrapesIntoDoc],
  );

  const handleGrapesPublish = useCallback(
    (payload: GrapesBuilderPayload) => {
      if (!doc) return;
      const updated = mergeGrapesIntoDoc(doc, payload);
      setDoc(updated);
      void handleSave(updated);
    },
    [doc, mergeGrapesIntoDoc],
  );

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
        if (mediaModalOpen) setMediaModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dirty, saving, doc, isFullscreen, inlineQuickEdit, pageDropdownOpen, mediaModalOpen, handleUndo, handleRedo]);

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

  const openMediaPicker = (targetSectionId: string, fieldKey: string, label: string) => {
    setMediaTarget({ sectionId: targetSectionId, fieldKey, label });
    setMediaModalOpen(true);
  };

  const selectHeritageImage = (imageUrl: string) => {
    if (!mediaTarget) return;
    handleFieldValueChange(mediaTarget.sectionId, mediaTarget.fieldKey, imageUrl);
    setMediaModalOpen(false);
    setToast({ message: "Image patrimoniale tunisienne sélectionnée !", tone: "success" });
  };

  // Filter sections by search query (keep GrapesJS payload managed inside GrapesJS tab)
  const filteredSections = useMemo(() => {
    if (!activePage) return [];
    const editableSections = activePage.sections.filter((s) => s.id !== "grapes_builder");
    if (!searchQuery.trim()) return editableSections;
    const q = searchQuery.toLowerCase();
    return editableSections.filter((s) => {
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

  // Filter heritage images in modal
  const filteredHeritageImages = useMemo(() => {
    return TUNISIA_HERITAGE_IMAGES.filter((img) => {
      const matchRegion =
        mediaFilterRegion === "all" ||
        img.region.toLowerCase().includes(mediaFilterRegion.toLowerCase()) ||
        img.category.toLowerCase().includes(mediaFilterRegion.toLowerCase());
      const matchQuery =
        !mediaSearchQuery ||
        img.title.toLowerCase().includes(mediaSearchQuery.toLowerCase()) ||
        img.titleAr.toLowerCase().includes(mediaSearchQuery.toLowerCase()) ||
        img.region.toLowerCase().includes(mediaSearchQuery.toLowerCase());
      return matchRegion && matchQuery;
    });
  }, [mediaFilterRegion, mediaSearchQuery]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4">
        <Loader2 className="w-12 h-12 text-[var(--gold)] animate-spin" />
        <p className="font-mono text-base text-[var(--gold)]">Chargement du Studio CMS de Tunisie...</p>
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
            title={isSidebarOpen ? "Masquer le panneau éditeur" : "Afficher le panneau éditeur"}
            className="p-2.5 rounded-xl border border-slate-700/80 bg-slate-800/80 text-slate-300 hover:text-[var(--gold)] hover:border-[var(--gold)]/50 transition-colors cursor-pointer shrink-0"
          >
            {isSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setPageDropdownOpen((v) => !v)}
              className="px-3.5 py-2 rounded-xl border border-slate-700/90 bg-slate-800/90 hover:bg-slate-750 hover:border-[var(--gold)]/60 text-slate-200 text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <div className="p-1 rounded-md bg-[var(--gold)]/15 text-[var(--gold)] shrink-0">
                <PageIcon className="w-4 h-4" />
              </div>
              <span className="truncate max-w-[140px] sm:max-w-[220px] text-white">
                {meta.defaultTitle}
              </span>
              <span className="font-mono text-[10px] text-slate-400 hidden lg:inline">
                ({meta.publicPath})
              </span>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform ${
                  pageDropdownOpen ? "rotate-180 text-[var(--gold)]" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu of all Pages */}
            {pageDropdownOpen && (
              <div className="absolute top-full start-0 mt-2 w-72 sm:w-84 rounded-2xl border border-slate-700 bg-[#0f1a2d] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
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
                        className={`w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-between transition-colors ${
                          isCur
                            ? "bg-[var(--gold)] text-black font-bold shadow-sm"
                            : "text-slate-300 hover:bg-slate-800/90 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <ItemIcon className={`w-4 h-4 shrink-0 ${isCur ? "text-black" : "text-[var(--gold)]"}`} />
                          <span className="truncate">{item.label}</span>
                        </div>
                        <span className={`font-mono text-[10px] opacity-75 ms-2 shrink-0 ${isCur ? "text-black" : ""}`}>
                          {item.route}
                        </span>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: Dual Mode Switcher (Studio Visual vs Live iFrame) */}
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center gap-1 shadow-inner">
            <button
              type="button"
              onClick={() => setViewMode("visual")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                viewMode === "visual"
                  ? "bg-[var(--gold)] text-black shadow-md"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
              title="Studio Interactif avec modification en direct"
            >
              <Layout className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Studio Éditeur</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grapesjs")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                viewMode === "grapesjs"
                  ? "bg-[var(--gold)] text-black shadow-md"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
              title="Constructeur visuel glisser-déposer GrapesJS"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">GrapesJS Builder</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("iframe")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                viewMode === "iframe"
                  ? "bg-[var(--gold)] text-black shadow-md"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
              title="Aperçu réel de la page en ligne"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Vraie Page Publique</span>
            </button>
          </div>

          {/* Viewport Devices */}
          <div className="hidden lg:flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-700/80">
            <button
              type="button"
              onClick={() => setDeviceMode("desktop")}
              title="Écran Ordinateur (100%)"
              className={`p-1.5 rounded-lg text-xs transition ${
                deviceMode === "desktop" ? "bg-slate-700 text-white shadow-xs" : "text-slate-400 hover:text-white"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setDeviceMode("tablet")}
              title="Écran Tablette (768px)"
              className={`p-1.5 rounded-lg text-xs transition ${
                deviceMode === "tablet" ? "bg-slate-700 text-white shadow-xs" : "text-slate-400 hover:text-white"
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setDeviceMode("mobile")}
              title="Écran Mobile (375px)"
              className={`p-1.5 rounded-lg text-xs transition ${
                deviceMode === "mobile" ? "bg-slate-700 text-white shadow-xs" : "text-slate-400 hover:text-white"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Language Tabs, Undo/Redo & Big Save Button */}
        <div className="flex items-center gap-2">
          {/* Language Selector Dropdown */}
          <div className="flex items-center gap-1">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-700 bg-slate-800 text-xs font-bold text-slate-200 outline-none focus:border-[var(--gold)] cursor-pointer"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.flag} {l.short} — {l.label}
                </option>
              ))}
            </select>
          </div>

          {/* Undo / Redo */}
          <div className="hidden md:flex items-center gap-1 border-s border-slate-700 ps-2">
            <button
              type="button"
              onClick={handleUndo}
              disabled={!canUndo}
              title="Annuler (Ctrl+Z)"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleRedo}
              disabled={!canRedo}
              title="Rétablir (Ctrl+Y)"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>

          {/* Public Link */}
          {meta.publicPath && (
            <a
              href={meta.publicPath}
              target="_blank"
              rel="noreferrer"
              title="Ouvrir la page publique réelle"
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

          {/* Big Senior-Friendly Save Button */}
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={!dirty || saving}
            className="btn-base btn-gold text-xs sm:text-sm py-2 px-4 sm:px-5 flex items-center gap-2 cursor-pointer shadow-xl hover:scale-[1.02] transition-transform disabled:opacity-40 disabled:cursor-not-allowed font-bold"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{t("cms_save", "Enregistrer & Publier")}</span>
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
        <aside
          className={`border-e border-slate-800 bg-[#0a1220] flex flex-col shrink-0 transition-all duration-300 z-30 shadow-2xl ${
            viewMode !== "grapesjs" && isSidebarOpen ? "w-full sm:w-[380px] lg:w-[420px]" : "w-0 overflow-hidden border-none"
          }`}
        >
          {/* Header of Inspector */}
          <div className="p-3.5 border-b border-slate-800 bg-[#0f1b2c] flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSidebarTab("sections")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  sidebarTab === "sections"
                    ? "bg-[var(--gold)] text-black shadow-md"
                    : "text-slate-300 hover:text-white hover:bg-slate-800"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Sections ({activePage.sections.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setSidebarTab("inspector")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  sidebarTab === "inspector"
                    ? "bg-[var(--gold)] text-black shadow-md"
                    : "text-slate-300 hover:text-white hover:bg-slate-800"
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Inspecteur</span>
              </button>
            </div>

            {/* Dirty Indicator Pill */}
            <span
              className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all flex items-center gap-1 ${
                dirty
                  ? "bg-amber-500/15 text-amber-300 border-amber-500/30 animate-pulse"
                  : "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
              }`}
            >
              {dirty ? (
                <>
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Modifié ({changeCount})</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Publié</span>
                </>
              )}
            </span>
          </div>

          {/* TAB 1: SECTIONS LIST */}
          {sidebarTab === "sections" && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
              {/* Senior-Friendly Help Tip */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-200 text-xs flex items-start gap-2.5 leading-relaxed">
                <Sparkles className="w-4 h-4 text-[var(--gold)] shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Aide pour les Administrateurs :</strong>
                  Cliquez sur n'importe quelle section ci-dessous ou directement sur le texte de l'aperçu à droite pour le modifier.
                </div>
              </div>

              {/* Sections Accordion Cards */}
              <div className="space-y-2">
                {filteredSections.map((sec, idx) => {
                  const isActive = sec.id === sectionId;
                  const customFieldsCount = sec.fields.filter(isCustomised).length;

                  return (
                    <div
                      key={sec.id}
                      onClick={() => {
                        setSectionId(sec.id);
                        setSidebarTab("inspector");
                      }}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        isActive
                          ? "border-[var(--gold)] bg-slate-800/90 shadow-md ring-1 ring-[var(--gold)]/40"
                          : "border-slate-800 bg-slate-900/60 hover:bg-slate-800/60 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-6 h-6 rounded-lg bg-[var(--gold)]/15 text-[var(--gold)] text-xs font-bold flex items-center justify-center shrink-0">
                            #{idx + 1}
                          </span>
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-white truncate">{sec.label}</h4>
                            <p className="text-[11px] text-slate-400 truncate max-w-[220px]">
                              {sec.description || `${sec.fields.length} champs de contenu`}
                            </p>
                          </div>
                        </div>

                        <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: DETAILED FIELD INSPECTOR */}
          {sidebarTab === "inspector" && activeSection && (
            <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--gold)]">
                    Section active
                  </span>
                  <h3 className="font-bold text-sm sm:text-base text-white">{activeSection.label}</h3>
                </div>

                <button
                  type="button"
                  onClick={() => setSidebarTab("sections")}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  ← Retour
                </button>
              </div>

              {/* Fields List */}
              <div className="space-y-4">
                {activeSection.fields.map((field) => {
                  const rawVal = readValue(field, lang);
                  const isCurField = activeFieldKey === field.key;

                  return (
                    <div
                      key={field.key}
                      id={`field-box-${activeSection.id}-${field.key}`}
                      className={`p-3.5 rounded-2xl border transition-all space-y-2 ${
                        isCurField
                          ? "border-[var(--gold)] bg-slate-900 shadow-md ring-2 ring-[var(--gold)]/30"
                          : "border-slate-800/90 bg-slate-900/60"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <label className="text-xs sm:text-sm font-bold text-slate-200">
                          {field.label}
                        </label>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleCopyFromDefault(activeSection.id, field.key)}
                            title="Rétablir le modèle ou texte par défaut"
                            className="p-1 rounded-md text-slate-400 hover:text-[var(--gold)] hover:bg-slate-800 text-[10px] font-semibold transition"
                          >
                            Modèle
                          </button>
                        </div>
                      </div>

                      {/* Input based on type */}
                      {field.type === "image" ? (
                        <div className="space-y-3">
                          {typeof rawVal === "string" && rawVal && (
                            <div className="relative rounded-xl overflow-hidden border border-slate-700 max-h-36 bg-black/40 flex items-center justify-center">
                              <img
                                src={resolveSiteImageUrl(rawVal) || rawVal}
                                alt={field.label}
                                className="max-h-36 w-full object-cover"
                              />
                            </div>
                          )}

                          <div className="flex flex-col sm:flex-row gap-2">
                            <button
                              type="button"
                              onClick={() => openMediaPicker(activeSection.id, field.key, field.label)}
                              className="btn-base btn-gold text-xs py-2 px-3 font-bold flex-1 flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                            >
                              <ImageIcon className="w-3.5 h-3.5" />
                              <span>Choisir image de Tunisie</span>
                            </button>

                            <label className="px-3 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-750 text-xs font-semibold text-slate-300 flex items-center justify-center gap-1.5 cursor-pointer transition">
                              <Upload className="w-3.5 h-3.5 text-slate-400" />
                              <span>Téléverser</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const f = e.target.files?.[0];
                                  if (f) void handleUploadImage(f, field.key, activeSection.id);
                                }}
                              />
                            </label>
                          </div>

                          <input
                            id={`field-input-${activeSection.id}-${field.key}`}
                            type="text"
                            value={typeof rawVal === "string" ? rawVal : ""}
                            onChange={(e) => handleFieldValueChange(activeSection.id, field.key, e.target.value)}
                            placeholder="Ou collez une URL d'image personnalisée..."
                            className={`${inputClass} !py-2 text-xs font-mono`}
                          />
                        </div>
                      ) : field.type === "html" ? (
                        <textarea
                          id={`field-input-${activeSection.id}-${field.key}`}
                          dir={activeLangObj.dir}
                          rows={5}
                          value={typeof rawVal === "string" ? rawVal : ""}
                          onChange={(e) => handleFieldValueChange(activeSection.id, field.key, e.target.value)}
                          placeholder="Saisissez votre texte ou contenu..."
                          className={inputClass}
                        />
                      ) : (
                        <input
                          id={`field-input-${activeSection.id}-${field.key}`}
                          type="text"
                          dir={activeLangObj.dir}
                          value={typeof rawVal === "string" ? rawVal : ""}
                          onChange={(e) => handleFieldValueChange(activeSection.id, field.key, e.target.value)}
                          placeholder="Saisissez le texte..."
                          className={inputClass}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </aside>

        {/* ----------------------------------------------------------------------- */}
        {/* RIGHT CANVAS: REAL-TIME STUDIO VISUAL OR LIVE IFRAME                     */}
        {/* ----------------------------------------------------------------------- */}
        <main className="flex-1 bg-[#050912] overflow-hidden flex flex-col relative">
          {/* VIEW MODE 0: GRAPESJS OPEN-SOURCE PAGE BUILDER */}
          {viewMode === "grapesjs" ? (
            <div className="flex-1 overflow-y-auto p-3 sm:p-4">
              {(() => {
                const gSec = activePage?.sections.find((s) => s.id === "grapes_builder");
                const rawVal = (key: "html" | "css" | "project"): string => {
                  const f = gSec?.fields.find((fld) => fld.key === key);
                  if (!f) return "";
                  const v = readValue(f, lang);
                  return typeof v === "string" ? v : "";
                };
                const rawHeroImg = (() => {
                  const heroSec = activePage?.sections.find((s) => s.id === "hero");
                  const imgF = heroSec?.fields.find((fld) => fld.key === "image");
                  const val = imgF && typeof imgF.value === "string" ? imgF.value.trim() : "";
                  return val || undefined;
                })();
                const seedCtx: GrapesSeedContext = {
                  pageId,
                  pageTitle: t(meta.titleKey, meta.defaultTitle),
                  heroEyebrow: getSectionFieldVal("hero", "eyebrow") || "Patrimoine & Généalogie de Tunisie",
                  heroTitle: getSectionFieldVal("hero", "title") || meta.defaultTitle,
                  heroSubtitle: getSectionFieldVal("hero", "subtitle") || meta.defaultSubtitle,
                  heroImage: rawHeroImg,
                  introTitle: getSectionFieldVal("intro", "title") || getSectionFieldVal("mission", "title") || meta.defaultTitle,
                  introBody: getSectionFieldVal("intro", "body") || getSectionFieldVal("mission", "intro") || meta.defaultSubtitle,
                  contactEmail: pageId === "contact" ? getSectionFieldVal("details", "email") : undefined,
                  contactPhone: pageId === "contact" ? getSectionFieldVal("details", "phone") : undefined,
                  contactAddress: pageId === "contact" ? getSectionFieldVal("details", "address") : undefined,
                  contactHours: pageId === "contact" ? getSectionFieldVal("details", "hours") : undefined,
                };
                return (
                  <Suspense
                    fallback={
                      <div className="flex h-[560px] items-center justify-center rounded-xl border border-[var(--gold)]/30 bg-[#0d1626] text-sm text-slate-300 gap-2">
                        <Loader2 className="h-5 w-5 animate-spin text-[var(--gold)]" />
                        <span>Chargement du constructeur visuel GrapesJS…</span>
                      </div>
                    }
                  >
                    <GrapesJsBuilder
                      pageId={pageId}
                      localeCode={lang}
                      initialHtml={rawVal("html")}
                      initialCss={rawVal("css")}
                      initialProjectJson={rawVal("project")}
                      seedContext={seedCtx}
                      onChange={handleGrapesChange}
                      onSaveRequested={handleGrapesPublish}
                      isRtl={lang === "ar"}
                    />
                  </Suspense>
                );
              })()}
            </div>
          ) : viewMode === "iframe" ? (
            <div className="flex-1 flex flex-col bg-[#050912] p-2 sm:p-4 overflow-hidden">
              <div className="mb-2 p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <Globe className="w-4 h-4 text-[var(--gold)]" />
                  <span className="font-mono text-slate-400">rootstunisia.com{meta.publicPath}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIframeKey(Date.now())}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[var(--gold)]" />
                  <span>Recharger l'aperçu</span>
                </button>
              </div>

              <div className="flex-1 rounded-2xl overflow-hidden border border-slate-800 bg-white shadow-2xl flex items-center justify-center">
                <iframe
                  key={iframeKey}
                  src={meta.publicPath || "/"}
                  title="Roots Tunisia Public Preview"
                  className={`h-full border-none transition-all duration-300 ${
                    deviceMode === "mobile" ? "w-[375px]" : deviceMode === "tablet" ? "w-[768px]" : "w-full"
                  }`}
                />
              </div>
            </div>
          ) : (
            /* VIEW MODE 2: INTERACTIVE STUDIO CANVAS (PIXEL-PERFECT REAL-TIME) */
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center custom-scrollbar">
              <div
                className={`w-full transition-all duration-300 bg-[#071322] border border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden ${
                  deviceMode === "mobile"
                    ? "max-w-[390px]"
                    : deviceMode === "tablet"
                    ? "max-w-[780px]"
                    : "max-w-5xl"
                }`}
              >
                {/* Floating Quick Edit Bar when an element is clicked */}
                {inlineQuickEdit && (
                  <div className="sticky top-4 z-40 mx-4 p-3 rounded-2xl bg-[#0d1c30]/95 backdrop-blur-md border border-[var(--gold)] shadow-2xl flex items-center justify-between gap-3 animate-in fade-in duration-150">
                    <div className="flex items-center gap-2">
                      <Edit3 className="w-4 h-4 text-[var(--gold)] shrink-0" />
                      <div>
                        <span className="text-[10px] font-bold uppercase text-[var(--gold)] block">
                          Modification Rapide
                        </span>
                        <span className="text-xs text-white font-semibold truncate max-w-[160px] block">
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
                {/* SECTION: HERO BANNER (PRESENT ON ALL PAGES WITH AUTHENTIC TUNISIAN BG) */}
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
                        onClick={() => openMediaPicker("hero", "image", "Image de fond de la bannière")}
                        className="absolute top-4 end-4 px-3 py-1.5 rounded-xl text-xs font-bold bg-black/85 text-amber-300 border border-amber-400/40 opacity-0 group-hover/hero:opacity-100 transition-opacity flex items-center gap-1.5 hover:bg-black cursor-pointer shadow-lg z-20"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-[var(--gold)]" />
                        <span>Changer l'image de fond (Tunisie)</span>
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
                          onClick={() => handleCanvasElementClick("hero", "title", "Titre principal (H1)")}
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
                    {/* Mission Banner Section ("preserve") with El Jem amphitheater */}
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

                {/* ARCHIVES / SOURCES PREVIEW */}
                {(pageId === "archives" || pageId === "sources") && (
                  <div className="p-6 sm:p-10 space-y-6 text-start">
                    <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3">
                      <span className="text-[10px] font-mono font-bold uppercase text-[var(--gold)]">
                        {pageId === "archives" ? "Fonds d'Archives de Dar el-Bey" : "Sijillat & Actes Judiciaires"}
                      </span>
                      <h3 className="font-serif font-bold text-xl text-white">
                        {pageId === "archives"
                          ? "Inventaire des Séries Historiques et Registres d'État"
                          : "Sources Notariales, Tribunaux Charaïques et Habous"}
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {pageId === "archives"
                          ? "Consultez les séries de décrets beylicaux, recensements du XIXe siècle et archives numérisées."
                          : "Guide méthodologique et inventaire détaillé des sources primaires certifiées par nos historiens."}
                      </p>
                    </div>
                  </div>
                )}

                {/* PERIODS HISTORICAL ERAS PREVIEW */}
                {pageId === "periods" && (
                  <div className="p-6 sm:p-10 space-y-4 text-start">
                    <div className="flex items-center justify-between pb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[var(--gold)]">
                        Chronologie des 9 Grandes Ères de Tunisie
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
          )}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* 3. TUNISIAN HERITAGE MEDIA SELECTOR MODAL (1-CLICK SELECTION)             */}
      {/* ========================================================================= */}
      {mediaModalOpen && mediaTarget && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-150"
          onClick={() => setMediaModalOpen(false)}
        >
          <div
            className="w-full max-w-4xl max-h-[85vh] rounded-3xl bg-[#0c1626] border-2 border-[var(--gold)] shadow-2xl flex flex-col overflow-hidden text-start"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 bg-[#08101c] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--gold)]/20 text-[var(--gold)] flex items-center justify-center">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-white">
                    Photographies Patrimoniales de Tunisie (100% Authentiques)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Sélectionnez en un clic une vue de Tunisie pour :{" "}
                    <strong className="text-[var(--gold)]">{mediaTarget.label}</strong>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMediaModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter and Search Bar */}
            <div className="p-4 border-b border-slate-800 bg-[#0a1322] flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: "all", label: "Toutes les Régions (12)" },
                  { id: "Carthage", label: "Carthage" },
                  { id: "El Jem", label: "El Jem" },
                  { id: "Sidi Bou Saïd", label: "Sidi Bou Saïd" },
                  { id: "Kairouan", label: "Kairouan" },
                  { id: "Tunis", label: "Tunis Médina" },
                  { id: "Djerba", label: "Djerba" },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setMediaFilterRegion(f.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      mediaFilterRegion === f.id
                        ? "bg-[var(--gold)] text-black shadow-md"
                        : "bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={mediaSearchQuery}
                  onChange={(e) => setMediaSearchQuery(e.target.value)}
                  placeholder="Rechercher par lieu..."
                  className="w-full ps-9 pe-3 py-1.5 rounded-xl border border-slate-700 bg-slate-900 text-xs text-white outline-none focus:border-[var(--gold)]"
                />
              </div>
            </div>

            {/* Heritage Images Grid */}
            <div className="flex-1 overflow-y-auto p-5 scrollbar-thin">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredHeritageImages.map((img) => (
                  <div
                    key={img.id}
                    onClick={() => selectHeritageImage(img.url)}
                    className="group relative rounded-2xl overflow-hidden border-2 border-slate-800 hover:border-[var(--gold)] bg-slate-900/90 shadow-lg cursor-pointer transition-all hover:scale-[1.02]"
                  >
                    <div className="h-40 overflow-hidden bg-black/60 relative">
                      <img
                        src={img.url}
                        alt={img.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-2 start-2 px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/80 text-[var(--gold)] border border-[var(--gold)]/40 flex items-center gap-1 backdrop-blur-xs">
                        <MapPin className="w-3 h-3 text-[var(--gold)]" />
                        <span>{img.region}</span>
                      </span>
                    </div>

                    <div className="p-3.5 space-y-1">
                      <h4 className="font-bold text-xs sm:text-sm text-white group-hover:text-[var(--gold)] transition-colors line-clamp-1">
                        {img.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-arabic line-clamp-1">
                        {img.titleAr}
                      </p>
                      <button
                        type="button"
                        className="w-full mt-2 py-1.5 rounded-lg bg-[var(--gold)]/15 group-hover:bg-[var(--gold)] text-[var(--gold)] group-hover:text-black font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Choisir cette photo</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer with Custom Upload */}
            <div className="p-4 border-t border-slate-800 bg-[#08101c] flex flex-col sm:flex-row items-center justify-between gap-3">
              <label className="btn-base btn-outline text-xs py-2 px-4 flex items-center gap-2 cursor-pointer">
                <Upload className="w-4 h-4 text-[var(--gold)]" />
                <span>Téléverser une image depuis mon ordinateur</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f && mediaTarget) {
                      void handleUploadImage(f, mediaTarget.fieldKey, mediaTarget.sectionId).then((url) => {
                        if (url) {
                          setMediaModalOpen(false);
                        }
                      });
                    }
                  }}
                />
              </label>

              <button
                type="button"
                onClick={() => setMediaModalOpen(false)}
                className="px-5 py-2 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
