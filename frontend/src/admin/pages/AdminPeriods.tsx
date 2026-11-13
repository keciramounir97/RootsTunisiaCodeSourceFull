import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Calendar,
  Check,
  Compass,
  Crown,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  FolderArchive,
  GitBranch,
  Globe,
  History,
  Image as ImageIcon,
  Landmark,
  Layers,
  Link2,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  Radio,
  RefreshCw,
  RotateCcw,
  Save,
  Scroll,
  Search,
  Shield,
  Sparkles,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { api } from "../../api/client";
import Toast from "../../components/Toast";
import {
  usePeriodsCmsConfig,
  getDefaultPeriodsCmsConfig,
  PERIODS_CMS_LOCALES,
  buildDefaultPeriodCards,
  type AdminPeriodCard,
  type PeriodCategoryItem,
} from "../../utils/periodsCmsConfig";
import type {
  HistoricalEraLeader,
  HistoricalEraFamily,
  EraAdministrativeDivision,
  HistoricalEraSite,
} from "../../data/historicalMapData";

interface EnrichedPeriodSource {
  id: number;
  link_id: number;
  period_id: string;
  source_type: string;
  source_id: number;
  title: string;
  description?: string;
  archive_source?: string;
  document_code?: string;
  location?: string;
  year?: string;
  thumbnail?: string;
  media_url?: string;
  custom_notes?: string;
}

interface AvailableGalleryItem {
  source_id: number;
  source_type: "document" | "book" | "tree" | "gallery" | "audio";
  title: string;
  secondary?: string;
  archive_source?: string;
  document_code?: string;
  thumbnail?: string;
}

const CATEGORY_ICONS: Record<string, any> = {
  Landmark,
  Crown,
  Scroll,
  Shield,
  History,
  FolderArchive,
  Compass,
  Layers,
};

export default function AdminPeriods() {
  const [selectedLocale, setSelectedLocale] = useState<string>("fr");
  const { config, saveConfig, refresh, loading } = usePeriodsCmsConfig(selectedLocale);

  const [activeTab, setActiveTab] = useState<"periods" | "categories" | "hero" | "preview">("periods");
  const [refreshing, setRefreshing] = useState(false);

  // Filter & Search on Tab 1
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");

  // Linked gallery sources stats & management
  const [statsMap, setStatsMap] = useState<Record<string, { total: number }>>({});
  const [selectedPeriodForSources, setSelectedPeriodForSources] = useState<string>("ottomane");
  const [linkedSources, setLinkedSources] = useState<EnrichedPeriodSource[]>([]);
  const [loadingLinked, setLoadingLinked] = useState(false);

  // Link gallery source modal
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [availableItems, setAvailableItems] = useState<AvailableGalleryItem[]>([]);
  const [loadingAvailable, setLoadingAvailable] = useState(false);
  const [availSearch, setAvailSearch] = useState("");
  const [availTypeFilter, setAvailTypeFilter] = useState("all");
  const [selectedItemToLink, setSelectedItemToLink] = useState<AvailableGalleryItem | null>(null);
  const [customLinkTitle, setCustomLinkTitle] = useState("");
  const [customLinkNotes, setCustomLinkNotes] = useState("");
  const [linkingSubmitting, setLinkingSubmitting] = useState(false);

  // Period Card Add/Edit Modal State
  const [periodModalOpen, setPeriodModalOpen] = useState(false);
  const [modalSubTab, setModalSubTab] = useState<"general" | "narrative" | "leaders" | "divisions">("general");
  const [editingPeriod, setEditingPeriod] = useState<AdminPeriodCard | null>(null);
  const [formPeriod, setFormPeriod] = useState<AdminPeriodCard>(() => buildDefaultPeriodCards()[0]);
  const [customTagsInput, setCustomTagsInput] = useState("");
  const [archivalSourcesInput, setArchivalSourcesInput] = useState("");
  const [savingPeriod, setSavingPeriod] = useState(false);

  // Category Modal State
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<PeriodCategoryItem | null>(null);
  const [catKey, setCatKey] = useState("");
  const [catLabel, setCatLabel] = useState("");
  const [catIcon, setCatIcon] = useState("Landmark");
  const [catDescription, setCatDescription] = useState("");
  const [savingCategory, setSavingCategory] = useState(false);

  // Hero & Public Texts Form State
  const [heroForm, setHeroForm] = useState(config.hero);
  const [kpiForm, setKpiForm] = useState(config.kpi);
  const [homeSectionForm, setHomeSectionForm] = useState(config.homeSection);
  const [savingTexts, setSavingTexts] = useState(false);

  useEffect(() => {
    setHeroForm(config.hero);
    setKpiForm(config.kpi);
    setHomeSectionForm(config.homeSection);
  }, [config.hero, config.kpi, config.homeSection]);

  // Toast State
  const [toast, setToast] = useState<{ message: string; tone: "success" | "error" | "info" }>({
    message: "",
    tone: "info",
  });
  const showToast = (message: string, tone: "success" | "error" | "info" = "success") => {
    setToast({ message, tone });
    setTimeout(() => setToast({ message: "", tone: "info" }), 4000);
  };

  // Fetch linked sources stats
  const fetchStats = async () => {
    try {
      const res = await api.get("/periods/stats");
      setStatsMap(res.data?.data || res.data || {});
    } catch {}
  };

  const fetchLinkedSources = async (periodId: string) => {
    setLoadingLinked(true);
    try {
      const res = await api.get(`/periods/${periodId}/sources`);
      const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setLinkedSources(list);
    } catch {
      setLinkedSources([]);
    } finally {
      setLoadingLinked(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchLinkedSources(selectedPeriodForSources);
  }, [selectedPeriodForSources]);

  // Filtered Periods
  const filteredPeriods = useMemo(() => {
    return config.periods.filter((p) => {
      const matchCat = selectedCategoryFilter === "all" || p.category === selectedCategoryFilter;
      if (!matchCat) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const text = `${p.title} ${p.arabicTitle} ${p.displayPeriod} ${p.capital} ${p.empire} ${p.devletName} ${p.description} ${(p.customTags || []).join(" ")}`.toLowerCase();
      return text.includes(q);
    });
  }, [config.periods, selectedCategoryFilter, searchQuery]);

  // =========================================================================
  // PERIOD CRUD HANDLERS
  // =========================================================================
  const openNewPeriodModal = () => {
    const nextStep = config.periods.length + 1;
    const blank: AdminPeriodCard = {
      ...buildDefaultPeriodCards()[0],
      id: `periode_${nextStep}`,
      stepNumber: nextStep,
      year: 1900,
      displayPeriod: "1900 – 1950",
      title: `${nextStep}. Nouvelle Période Historique`,
      arabicTitle: "فترة تاريخية جديدة",
      empire: "Tunisie",
      devletName: "État Tunisien",
      tunisiaEntityName: "Tunisie",
      capital: "Tunis",
      category: config.categories[0]?.key || "contemporain",
      badge: `ÈRE #${String(nextStep).padStart(2, "0")} • 1900 – 1950`,
      description: "",
      tunisRole: "",
      lineagesSummary: "",
      treatiesAndBorders: "",
      namingStructure: "",
      survivalRating: "Élevé",
      keyRepositories: "Archives Nationales de Tunisie (ANT)",
      archivalSources: [],
      notableLeaders: [],
      notableFamilies: [],
      administrativeDivisions: [],
      keySites: [],
      isPublished: true,
      customTags: [],
      cardButtonLabel: "DÉCOUVRIR LA PÉRIODE",
    };
    setEditingPeriod(null);
    setFormPeriod(blank);
    setCustomTagsInput("");
    setArchivalSourcesInput("");
    setModalSubTab("general");
    setPeriodModalOpen(true);
  };

  const openEditPeriodModal = (period: AdminPeriodCard) => {
    setEditingPeriod(period);
    setFormPeriod({
      ...period,
      notableLeaders: [...(period.notableLeaders || [])],
      notableFamilies: [...(period.notableFamilies || [])],
      administrativeDivisions: [...(period.administrativeDivisions || [])],
      keySites: [...(period.keySites || [])],
    });
    setCustomTagsInput((period.customTags || []).join(", "));
    setArchivalSourcesInput((period.archivalSources || []).join("\n"));
    setModalSubTab("general");
    setPeriodModalOpen(true);
  };

  const handleSavePeriod = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPeriod.title.trim()) {
      showToast("Le titre de la période est obligatoire", "error");
      return;
    }

    setSavingPeriod(true);
    try {
      const cleanId =
        formPeriod.id.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "_") ||
        `periode_${Date.now()}`;
      const customTags = customTagsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const archivalSources = archivalSourcesInput
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const updatedCard: AdminPeriodCard = {
        ...formPeriod,
        id: cleanId,
        title: formPeriod.title.trim(),
        arabicTitle: formPeriod.arabicTitle.trim(),
        displayPeriod: formPeriod.displayPeriod.trim(),
        capital: formPeriod.capital.trim(),
        empire: formPeriod.empire.trim(),
        devletName: formPeriod.devletName.trim(),
        description: formPeriod.description.trim(),
        badge:
          formPeriod.badge.trim() ||
          `ÈRE #${String(formPeriod.stepNumber).padStart(2, "0")} • ${formPeriod.displayPeriod.trim()}`,
        customTags,
        archivalSources,
      };

      let nextPeriods = [...config.periods];
      if (editingPeriod) {
        nextPeriods = nextPeriods.map((p) => (p.id === editingPeriod.id ? updatedCard : p));
      } else {
        if (nextPeriods.some((p) => p.id === cleanId)) {
          showToast("Une période avec cet identifiant existe déjà", "error");
          setSavingPeriod(false);
          return;
        }
        nextPeriods.push(updatedCard);
      }

      await saveConfig({
        ...config,
        periods: nextPeriods,
      });

      showToast(
        editingPeriod
          ? `Période « ${updatedCard.title} » mise à jour avec succès !`
          : `Nouvelle période « ${updatedCard.title} » créée avec succès !`
      );
      setPeriodModalOpen(false);
    } catch {
      showToast("Erreur lors de la sauvegarde de la période", "error");
    } finally {
      setSavingPeriod(false);
    }
  };

  const handleTogglePeriodPublished = async (period: AdminPeriodCard) => {
    const nextPeriods = config.periods.map((p) =>
      p.id === period.id ? { ...p, isPublished: p.isPublished === false ? true : false } : p
    );
    await saveConfig({ ...config, periods: nextPeriods });
    showToast(
      `Statut mis à jour : ${period.isPublished === false ? "Publiée sur le site" : "Masquée"}`
    );
  };

  const handleDeletePeriod = async (period: AdminPeriodCard) => {
    if (!window.confirm(`Confirmez-vous la suppression de la période « ${period.title} » ?`)) {
      return;
    }
    const nextPeriods = config.periods.filter((p) => p.id !== period.id);
    await saveConfig({ ...config, periods: nextPeriods });
    showToast(`Période « ${period.title} » supprimée.`);
  };

  const handleResetDefaultPeriods = async () => {
    if (
      !window.confirm(
        `Restaurer les 12 périodes historiques canoniques (${selectedLocale.toUpperCase()}) et leurs paramètres par défaut ?`
      )
    ) {
      return;
    }
    await saveConfig(getDefaultPeriodsCmsConfig(selectedLocale));
    showToast(
      `Les 12 périodes canoniques (${selectedLocale.toUpperCase()}) ont été restaurées avec succès !`
    );
  };

  // =========================================================================
  // CATEGORY CRUD HANDLERS
  // =========================================================================
  const openNewCategoryModal = () => {
    setEditingCategory(null);
    setCatKey("");
    setCatLabel("");
    setCatIcon("Landmark");
    setCatDescription("");
    setCategoryModalOpen(true);
  };

  const openEditCategoryModal = (cat: PeriodCategoryItem) => {
    setEditingCategory(cat);
    setCatKey(cat.key);
    setCatLabel(cat.label);
    setCatIcon(cat.icon || "Landmark");
    setCatDescription(cat.description || "");
    setCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catLabel.trim()) {
      showToast("Le nom de la macro-époque est obligatoire", "error");
      return;
    }
    setSavingCategory(true);
    const cleanKey = (catKey || catLabel).toLowerCase().replace(/[^a-z0-9_-]/g, "_");
    const newCat: PeriodCategoryItem = {
      key: cleanKey,
      label: catLabel.trim(),
      icon: catIcon,
      description: catDescription.trim(),
    };

    try {
      let nextCats = [...config.categories];
      if (editingCategory) {
        nextCats = nextCats.map((c) => (c.key === editingCategory.key ? newCat : c));
      } else {
        if (nextCats.some((c) => c.key === cleanKey)) {
          showToast("Une macro-époque avec cet identifiant existe déjà", "error");
          setSavingCategory(false);
          return;
        }
        nextCats.push(newCat);
      }
      await saveConfig({ ...config, categories: nextCats });
      showToast(`Macro-époque « ${newCat.label} » enregistrée !`);
      setCategoryModalOpen(false);
    } finally {
      setSavingCategory(false);
    }
  };

  const handleDeleteCategory = async (key: string) => {
    const target = config.categories.find((c) => c.key === key);
    if (!window.confirm(`Supprimer la macro-époque « ${target?.label || key} » ?`)) return;
    const nextCats = config.categories.filter((c) => c.key !== key);
    await saveConfig({ ...config, categories: nextCats });
    showToast("Macro-époque supprimée.");
  };

  // =========================================================================
  // HERO, KPI & PUBLIC TEXTS SAVE
  // =========================================================================
  const handleSavePublicTexts = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingTexts(true);
    try {
      await saveConfig({
        ...config,
        hero: heroForm,
        kpi: kpiForm,
        homeSection: homeSectionForm,
      });
      showToast("En-tête, ruban KPI et textes de la page Périodes sauvegardés avec succès !");
    } catch {
      showToast("Erreur lors de la sauvegarde des textes", "error");
    } finally {
      setSavingTexts(false);
    }
  };

  // =========================================================================
  // GALLERY SOURCE LINKING HANDLERS
  // =========================================================================
  const fetchAvailableGalleryItems = async () => {
    setLoadingAvailable(true);
    try {
      const res = await api.get("/periods/available-sources");
      const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setAvailableItems(list);
    } catch {
      setAvailableItems([]);
    } finally {
      setLoadingAvailable(false);
    }
  };

  const openLinkSourceModal = (periodId?: string) => {
    if (periodId) setSelectedPeriodForSources(periodId);
    setSelectedItemToLink(null);
    setCustomLinkTitle("");
    setCustomLinkNotes("");
    setLinkModalOpen(true);
    fetchAvailableGalleryItems();
  };

  const handleConfirmLinkSource = async () => {
    if (!selectedItemToLink) return;
    setLinkingSubmitting(true);
    try {
      await api.post(`/admin/periods/${selectedPeriodForSources}/sources`, {
        source_type: selectedItemToLink.source_type,
        source_id: selectedItemToLink.source_id,
        custom_title: customLinkTitle.trim() || selectedItemToLink.title,
        custom_notes: customLinkNotes.trim() || undefined,
      });
      showToast("Source associée avec succès à la période !");
      setLinkModalOpen(false);
      fetchLinkedSources(selectedPeriodForSources);
      fetchStats();
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Erreur lors de l'association", "error");
    } finally {
      setLinkingSubmitting(false);
    }
  };

  const handleUnlinkSource = async (linkId: number) => {
    if (!window.confirm("Détacher cette pièce de la période ?")) return;
    try {
      await api.delete(`/admin/periods/sources/${linkId}`);
      showToast("Source détachée avec succès.");
      fetchLinkedSources(selectedPeriodForSources);
      fetchStats();
    } catch {
      showToast("Erreur lors du détachement", "error");
    }
  };

  const filteredAvailableItems = useMemo(() => {
    const q = availSearch.trim().toLowerCase();
    return availableItems.filter((item) => {
      if (availTypeFilter !== "all" && item.source_type !== availTypeFilter) return false;
      if (!q) return true;
      return (
        item.title?.toLowerCase().includes(q) ||
        item.secondary?.toLowerCase().includes(q) ||
        item.archive_source?.toLowerCase().includes(q) ||
        item.document_code?.toLowerCase().includes(q)
      );
    });
  }, [availableItems, availTypeFilter, availSearch]);

  const getSourceIcon = (type: string) => {
    switch (type) {
      case "document":
        return FileText;
      case "tree":
        return GitBranch;
      case "book":
        return BookOpen;
      case "gallery":
        return ImageIcon;
      case "audio":
        return Radio;
      default:
        return FolderArchive;
    }
  };

  // Sub-list helpers inside Period Modal
  const addLeader = () => {
    const next: HistoricalEraLeader = {
      name: "",
      arabicName: "",
      role: "Souverain / Dirigeant",
      reignOrDates: formPeriod.displayPeriod,
      achievements: "",
    };
    setFormPeriod({
      ...formPeriod,
      notableLeaders: [...(formPeriod.notableLeaders || []), next],
    });
  };

  const updateLeader = (idx: number, field: keyof HistoricalEraLeader, value: string) => {
    const list = [...(formPeriod.notableLeaders || [])];
    list[idx] = { ...list[idx], [field]: value };
    setFormPeriod({ ...formPeriod, notableLeaders: list });
  };

  const removeLeader = (idx: number) => {
    setFormPeriod({
      ...formPeriod,
      notableLeaders: (formPeriod.notableLeaders || []).filter((_, i) => i !== idx),
    });
  };

  const addFamily = () => {
    const next: HistoricalEraFamily = {
      name: "",
      arabicName: "",
      role: "Dynastie / Lignée Notable",
      origin: formPeriod.capital,
      lineageNotes: "",
    };
    setFormPeriod({
      ...formPeriod,
      notableFamilies: [...(formPeriod.notableFamilies || []), next],
    });
  };

  const updateFamily = (idx: number, field: keyof HistoricalEraFamily, value: string) => {
    const list = [...(formPeriod.notableFamilies || [])];
    list[idx] = { ...list[idx], [field]: value };
    setFormPeriod({ ...formPeriod, notableFamilies: list });
  };

  const removeFamily = (idx: number) => {
    setFormPeriod({
      ...formPeriod,
      notableFamilies: (formPeriod.notableFamilies || []).filter((_, i) => i !== idx),
    });
  };

  const addDivision = () => {
    const next: EraAdministrativeDivision = {
      id: `div_${Date.now()}`,
      name: "",
      arabicName: "",
      seat: formPeriod.capital,
      coords: [36.8, 10.18],
      description: "",
    };
    setFormPeriod({
      ...formPeriod,
      administrativeDivisions: [...(formPeriod.administrativeDivisions || []), next],
    });
  };

  const updateDivision = (idx: number, field: keyof EraAdministrativeDivision, value: any) => {
    const list = [...(formPeriod.administrativeDivisions || [])];
    list[idx] = { ...list[idx], [field]: value };
    setFormPeriod({ ...formPeriod, administrativeDivisions: list });
  };

  const removeDivision = (idx: number) => {
    setFormPeriod({
      ...formPeriod,
      administrativeDivisions: (formPeriod.administrativeDivisions || []).filter((_, i) => i !== idx),
    });
  };

  const addKeySite = () => {
    const next: HistoricalEraSite = {
      name: "",
      arabicName: "",
      coords: [36.8, 10.18],
      role: "",
    };
    setFormPeriod({
      ...formPeriod,
      keySites: [...(formPeriod.keySites || []), next],
    });
  };

  const updateKeySite = (idx: number, field: keyof HistoricalEraSite, value: any) => {
    const list = [...(formPeriod.keySites || [])];
    list[idx] = { ...list[idx], [field]: value };
    setFormPeriod({ ...formPeriod, keySites: list });
  };

  const removeKeySite = (idx: number) => {
    setFormPeriod({
      ...formPeriod,
      keySites: (formPeriod.keySites || []).filter((_, i) => i !== idx),
    });
  };

  return (
    <div className="space-y-6">
      {toast.message && (
        <Toast
          message={toast.message}
          tone={toast.tone}
          onClose={() => setToast({ message: "", tone: "info" })}
        />
      )}

      {/* Page Header (Identical style to Sources & Archives) */}
      <div className="surface-card frame-gold flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[var(--card)]/95 shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-[var(--gold)]/20 text-[var(--gold)] border border-[var(--gold)]/30">
              Module Périodes Historiques
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-500">
              <Check className="w-3.5 h-3.5" />
              <span>Base Dynamique Active</span>
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-[var(--foreground)] tracking-wide">
            Gestion des Périodes Historiques & Chronologie
          </h1>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] max-w-2xl">
            Ajoutez, modifiez et personnalisez intégralement les fiches d'époques, dirigeants, dynasties, divisions territoriales, sources liées et textes publics.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/periods"
            target="_blank"
            className="btn-base btn-outline px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[var(--gold)]" />
            <span>Voir Page Publique</span>
          </Link>
          <button
            type="button"
            onClick={async () => {
              setRefreshing(true);
              await refresh();
              await fetchStats();
              setRefreshing(false);
              showToast("Données synchronisées");
            }}
            disabled={refreshing}
            className="btn-base btn-outline px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-[var(--gold)]" : ""}`} />
            <span>Actualiser</span>
          </button>
        </div>
      </div>

      {/* Language Selector Pills (Just like Legal Content CMS) */}
      <div className="flex items-center gap-2 flex-wrap surface-card rounded-2xl px-5 py-3.5 bg-[var(--card)]/90 border border-[var(--gold)]/25 shadow-sm">
        <span className="text-xs font-bold text-[var(--muted-foreground)] flex items-center gap-1.5 me-2">
          <Globe className="w-4 h-4 text-[var(--gold)]" />
          <span>Langue d'édition :</span>
        </span>
        <div className="flex items-center gap-1.5 flex-wrap">
          {PERIODS_CMS_LOCALES.map((loc) => (
            <button
              key={loc.code}
              type="button"
              onClick={() => setSelectedLocale(loc.code)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                selectedLocale === loc.code
                  ? "bg-[var(--gold)]/20 text-[var(--gold)] border-[var(--gold)] font-bold shadow-sm"
                  : "bg-[var(--background)] text-[var(--muted-foreground)] border-[var(--border)] hover:text-[var(--foreground)] hover:border-[var(--gold)]/40"
              }`}
            >
              <span>{loc.label}</span>
              <span className="ms-1.5 font-mono text-[10px] opacity-75">[{loc.tag}]</span>
            </button>
          ))}
        </div>
      </div>

      {/* 4 Volets Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[var(--card)] border border-[var(--border)] w-fit shadow-md flex-wrap">
        <button
          type="button"
          onClick={() => setActiveTab("periods")}
          className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === "periods"
              ? "bg-[var(--gold)] text-black shadow-md"
              : "text-[var(--foreground)]/70 hover:text-[var(--foreground)] hover:bg-[var(--gold)]/10"
          }`}
        >
          <Landmark className="w-4 h-4" />
          <span>Fiches des Périodes ({config.periods.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("categories")}
          className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === "categories"
              ? "bg-[var(--gold)] text-black shadow-md"
              : "text-[var(--foreground)]/70 hover:text-[var(--foreground)] hover:bg-[var(--gold)]/10"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Macro-Époques & Sources Liées ({config.categories.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("hero")}
          className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === "hero"
              ? "bg-[var(--gold)] text-black shadow-md"
              : "text-[var(--foreground)]/70 hover:text-[var(--foreground)] hover:bg-[var(--gold)]/10"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>En-tête, KPI & Textes Publics</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("preview")}
          className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === "preview"
              ? "bg-[var(--gold)] text-black shadow-md"
              : "text-[var(--foreground)]/70 hover:text-[var(--foreground)] hover:bg-[var(--gold)]/10"
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Aperçu en Direct</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* VOLET 1: FICHES DES PÉRIODES                                              */}
      {/* ========================================================================= */}
      {activeTab === "periods" && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-sm">
            <div className="flex items-center gap-3 flex-1 flex-wrap">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="w-4 h-4 text-[var(--muted-foreground)] absolute start-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher par époque, capitale, dynastie, souverain..."
                  className="w-full bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg ps-9 pe-3 py-2 text-xs focus:border-[var(--gold)] outline-none"
                />
              </div>

              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg px-3 py-2 text-xs focus:border-[var(--gold)] outline-none"
              >
                <option value="all">Toutes les macro-époques ({config.periods.length})</option>
                {config.categories.map((cat) => {
                  const count = config.periods.filter((p) => p.category === cat.key).length;
                  return (
                    <option key={cat.key} value={cat.key}>
                      {cat.label} ({count})
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleResetDefaultPeriods}
                title="Restaurer les 12 époques par défaut"
                className="btn-base btn-outline text-xs py-2 px-3 inline-flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[var(--gold)]" />
                <span className="hidden md:inline">Par défaut</span>
              </button>

              <button
                type="button"
                onClick={openNewPeriodModal}
                className="btn-base btn-gold text-xs py-2 px-4 inline-flex items-center gap-2 justify-center cursor-pointer font-bold shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter une Période Historique</span>
              </button>
            </div>
          </div>

          {/* Periods Grid */}
          {loading && filteredPeriods.length === 0 ? (
            <div className="text-center py-16 text-[var(--muted-foreground)]">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-[var(--gold)]" />
              <p className="text-xs">Chargement des périodes historiques...</p>
            </div>
          ) : filteredPeriods.length === 0 ? (
            <div className="text-center py-12 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--muted-foreground)] space-y-2">
              <Landmark className="w-10 h-10 mx-auto text-[var(--muted-foreground)]/60" />
              <p className="text-sm font-semibold text-[var(--foreground)]">Aucune période trouvée</p>
              <p className="text-xs">Modifiez votre filtre ou ajoutez une nouvelle période historique.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPeriods.map((period) => {
                const catObj = config.categories.find((c) => c.key === period.category);
                const linkedCount = statsMap[period.id]?.total || 0;
                return (
                  <div
                    key={period.id}
                    className={`surface-card rounded-xl border p-5 shadow-sm transition-all flex flex-col justify-between ${
                      period.isPublished !== false
                        ? "border-[var(--gold)]/30 hover:border-[var(--gold)] bg-[var(--card)]"
                        : "border-dashed border-[var(--border)] bg-[var(--card)]/60 opacity-70"
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Header badge & category */}
                      <div className="flex items-center justify-between gap-2 border-b border-[var(--border)] pb-2.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30 truncate">
                          {period.badge || `ÈRE #${String(period.stepNumber).padStart(2, "0")} • ${period.displayPeriod}`}
                        </span>
                        <span className="text-[11px] font-semibold text-[var(--muted-foreground)] shrink-0">
                          {catObj?.label || period.capital}
                        </span>
                      </div>

                      {/* Title & Arabic Title */}
                      <div>
                        <h3 className="font-serif font-bold text-base text-[var(--foreground)] hover:text-[var(--gold)] transition-colors leading-snug line-clamp-2">
                          {period.title}
                        </h3>
                        {period.arabicTitle && (
                          <p dir="rtl" className="text-xs text-[var(--gold)]/90 font-amiri font-bold mt-0.5">
                            {period.arabicTitle}
                          </p>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-xs text-[var(--foreground)]/80 line-clamp-3 leading-relaxed">
                        {period.description}
                      </p>

                      {/* Metadata Pills */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[var(--background)] text-[var(--muted-foreground)] border border-[var(--border)]">
                          Capitale: {period.capital}
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[var(--background)] text-[var(--muted-foreground)] border border-[var(--border)]">
                          {period.notableLeaders?.length || 0} dirigeant(s)
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[var(--background)] text-[var(--muted-foreground)] border border-[var(--border)]">
                          {period.notableFamilies?.length || 0} dynastie(s)
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/30 font-bold">
                          {linkedCount} source(s) galerie
                        </span>
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <Link
                          to={`/periods/${period.id}`}
                          target="_blank"
                          className="p-1.5 rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-black transition cursor-pointer"
                          title="Ouvrir la page publique de cette période"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleTogglePeriodPublished(period)}
                          className={`p-1.5 rounded-lg transition cursor-pointer ${
                            period.isPublished !== false
                              ? "text-emerald-500 hover:bg-emerald-500/10"
                              : "text-[var(--muted-foreground)] hover:bg-[var(--border)]"
                          }`}
                          title={period.isPublished !== false ? "Publiée (Cliquer pour masquer)" : "Masquée (Cliquer pour publier)"}
                        >
                          {period.isPublished !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPeriodForSources(period.id);
                            setActiveTab("categories");
                          }}
                          className="px-2 py-1 rounded-lg bg-[var(--background)] border border-[var(--border)] hover:border-[var(--gold)] text-[10px] font-mono text-[var(--foreground)] inline-flex items-center gap-1 cursor-pointer"
                          title="Gérer les pièces de la galerie associées"
                        >
                          <Link2 className="w-3 h-3 text-[var(--gold)]" />
                          <span>Sources ({linkedCount})</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditPeriodModal(period)}
                          className="px-2.5 py-1.5 rounded-lg bg-[var(--background)] border border-[var(--border)] hover:border-[var(--gold)] text-[var(--foreground)] text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Pencil className="w-3 h-3 text-[var(--gold)]" />
                          <span>Modifier</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeletePeriod(period)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition cursor-pointer"
                          title="Supprimer la période"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VOLET 2: MACRO-ÉPOQUES & SOURCES DE LA GALERIE LIÉES                      */}
      {/* ========================================================================= */}
      {activeTab === "categories" && (
        <div className="space-y-8">
          {/* Section A: Macro-Epochs Categories */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-sm">
              <div>
                <h2 className="text-sm font-bold text-[var(--foreground)]">
                  Macro-Époques & Groupes Chronologiques
                </h2>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Gérez les onglets de filtrage chronologique affichés en haut de la page publique Périodes.
                </p>
              </div>

              <button
                type="button"
                onClick={openNewCategoryModal}
                className="btn-base btn-gold text-xs py-2 px-3.5 inline-flex items-center gap-1.5 cursor-pointer font-bold shadow-md shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter une Macro-Époque</span>
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {config.categories.map((cat) => {
                const IconComp = CATEGORY_ICONS[cat.icon] || Landmark;
                const count = config.periods.filter((p) => p.category === cat.key).length;
                return (
                  <div
                    key={cat.key}
                    className="surface-card p-4 rounded-xl bg-[var(--card)] border border-[var(--gold)]/25 flex flex-col justify-between space-y-3 shadow-sm"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="p-2 rounded-lg bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/20">
                          <IconComp className="w-4 h-4" />
                        </div>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[var(--background)] border border-[var(--border)] text-[var(--gold)] font-bold">
                          {count} période{count > 1 ? "s" : ""}
                        </span>
                      </div>

                      <h3 className="font-bold text-sm text-[var(--foreground)] font-serif">{cat.label}</h3>
                      <p className="text-[11px] font-mono text-[var(--muted-foreground)]">Clé: {cat.key}</p>
                      {cat.description && (
                        <p className="text-xs text-[var(--foreground)]/80 line-clamp-2 leading-relaxed">
                          {cat.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-[var(--border)]">
                      <button
                        type="button"
                        onClick={() => openEditCategoryModal(cat)}
                        className="px-2 py-1 rounded bg-[var(--background)] border border-[var(--border)] hover:border-[var(--gold)] text-xs text-[var(--foreground)] inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Pencil className="w-3 h-3 text-[var(--gold)]" />
                        <span>Modifier</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(cat.key)}
                        className="p-1 rounded text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                        title="Supprimer la macro-époque"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section B: Linked Gallery Items per Period */}
          <div className="surface-card frame-gold p-6 rounded-2xl bg-[var(--card)] border border-[var(--gold)]/30 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
              <div>
                <h2 className="text-base font-bold font-serif text-[var(--foreground)] flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-[var(--gold)]" />
                  <span>Pièces de la Galerie Rattachées aux Périodes</span>
                </h2>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Sélectionnez une période pour associer ou détacher des actes, manuscrits, arbres généalogiques, livres, photos ou récits audio.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <select
                  value={selectedPeriodForSources}
                  onChange={(e) => setSelectedPeriodForSources(e.target.value)}
                  className="bg-[var(--background)] border border-[var(--gold)]/40 text-[var(--foreground)] rounded-xl px-3 py-2 text-xs font-bold focus:border-[var(--gold)] outline-none"
                >
                  {config.periods.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({statsMap[p.id]?.total || 0} liée(s))
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => openLinkSourceModal(selectedPeriodForSources)}
                  className="btn-base btn-gold text-xs py-2 px-4 inline-flex items-center gap-1.5 font-bold cursor-pointer shadow-md"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Associer une Pièce</span>
                </button>
              </div>
            </div>

            {loadingLinked ? (
              <div className="py-10 text-center text-xs text-[var(--muted-foreground)]">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[var(--gold)]" />
                <span>Chargement des sources associées...</span>
              </div>
            ) : linkedSources.length === 0 ? (
              <div className="py-10 text-center rounded-xl bg-[var(--background)]/60 border border-dashed border-[var(--border)] space-y-2">
                <FolderArchive className="w-8 h-8 mx-auto text-[var(--gold)]/50" />
                <p className="text-xs font-semibold text-[var(--foreground)]">
                  Aucune pièce de la galerie rattachée à cette période.
                </p>
                <button
                  type="button"
                  onClick={() => openLinkSourceModal(selectedPeriodForSources)}
                  className="btn-base btn-gold text-xs py-1.5 px-3.5 inline-flex items-center gap-1.5 font-bold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Associer la Première Pièce</span>
                </button>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {linkedSources.map((src) => {
                  const IconComp = getSourceIcon(src.source_type);
                  return (
                    <div
                      key={src.link_id}
                      className="p-4 rounded-xl bg-[var(--background)] border border-[var(--border)] flex flex-col justify-between gap-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30">
                            <IconComp className="w-3 h-3" />
                            <span>{src.source_type}</span>
                          </span>
                          {src.document_code && (
                            <span className="text-[10px] font-mono text-[var(--muted-foreground)]">
                              {src.document_code}
                            </span>
                          )}
                        </div>
                        <h4 className="font-serif font-bold text-xs sm:text-sm text-[var(--foreground)]">
                          {src.title}
                        </h4>
                        {src.custom_notes && (
                          <p className="text-[11px] text-[var(--muted-foreground)] italic">
                            {src.custom_notes}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-end pt-2 border-t border-[var(--border)]">
                        <button
                          type="button"
                          onClick={() => handleUnlinkSource(src.link_id)}
                          className="px-2.5 py-1 rounded-lg text-xs text-rose-500 hover:bg-rose-500/10 inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Détacher</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VOLET 3: EN-TÊTE, RUBAN KPI & TEXTES PUBLICS                              */}
      {/* ========================================================================= */}
      {activeTab === "hero" && (
        <form onSubmit={handleSavePublicTexts} className="space-y-6 max-w-4xl">
          {/* 1. Hero Banner */}
          <div className="surface-card p-6 rounded-xl bg-[var(--card)] border border-[var(--gold)]/30 shadow-md space-y-4">
            <h2 className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--gold)]" />
              <span>1. Bannière Hero de la Page Périodes (`/periods`)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Surtitre (Eyebrow / Badge du haut)
                </label>
                <input
                  type="text"
                  value={heroForm.eyebrow}
                  onChange={(e) => setHeroForm({ ...heroForm, eyebrow: e.target.value })}
                  className="w-full bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg px-3.5 py-2 text-xs focus:border-[var(--gold)] outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Titre Principal de la Page
                </label>
                <input
                  type="text"
                  value={heroForm.title}
                  onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                  className="w-full bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg px-3.5 py-2 text-xs focus:border-[var(--gold)] outline-none font-bold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Sous-titre / Description d'introduction
                </label>
                <textarea
                  rows={3}
                  value={heroForm.subtitle}
                  onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                  className="w-full bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg p-3 text-xs focus:border-[var(--gold)] outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Texte du Bouton Primaire (Carte Interactive)
                </label>
                <input
                  type="text"
                  value={heroForm.ctaPrimaryLabel}
                  onChange={(e) => setHeroForm({ ...heroForm, ctaPrimaryLabel: e.target.value })}
                  className="w-full bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg px-3.5 py-2 text-xs focus:border-[var(--gold)] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Lien du Bouton Primaire
                </label>
                <input
                  type="text"
                  value={heroForm.ctaPrimaryLink}
                  onChange={(e) => setHeroForm({ ...heroForm, ctaPrimaryLink: e.target.value })}
                  className="w-full bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg px-3.5 py-2 text-xs font-mono focus:border-[var(--gold)] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Texte du Bouton Secondaire (Sources)
                </label>
                <input
                  type="text"
                  value={heroForm.ctaSecondaryLabel}
                  onChange={(e) => setHeroForm({ ...heroForm, ctaSecondaryLabel: e.target.value })}
                  className="w-full bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg px-3.5 py-2 text-xs focus:border-[var(--gold)] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Lien du Bouton Secondaire
                </label>
                <input
                  type="text"
                  value={heroForm.ctaSecondaryLink}
                  onChange={(e) => setHeroForm({ ...heroForm, ctaSecondaryLink: e.target.value })}
                  className="w-full bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg px-3.5 py-2 text-xs font-mono focus:border-[var(--gold)] outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Image d'Arrière-Plan du Hero (Optionnel — URL ou chemin)
                </label>
                <input
                  type="text"
                  value={heroForm.image}
                  onChange={(e) => setHeroForm({ ...heroForm, image: e.target.value })}
                  placeholder="Laisser vide pour utiliser l'amphithéâtre d'El Jem par défaut"
                  className="w-full bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg px-3.5 py-2 text-xs font-mono focus:border-[var(--gold)] outline-none"
                />
              </div>
            </div>
          </div>

          {/* 2. Ruban KPI & Bouton des Cartes */}
          <div className="surface-card p-6 rounded-xl bg-[var(--card)] border border-[var(--gold)]/30 shadow-md space-y-4">
            <h2 className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2">
              <History className="w-4 h-4 text-[var(--gold)]" />
              <span>2. Ruban KPI Chronologique & Bouton des Cartes</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Titre du Ruban KPI
                </label>
                <input
                  type="text"
                  value={kpiForm.title}
                  onChange={(e) => setKpiForm({ ...kpiForm, title: e.target.value })}
                  className="w-full bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg px-3.5 py-2 text-xs focus:border-[var(--gold)] outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Badge de Durée (Droite)
                </label>
                <input
                  type="text"
                  value={kpiForm.badge}
                  onChange={(e) => setKpiForm({ ...kpiForm, badge: e.target.value })}
                  className="w-full bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg px-3.5 py-2 text-xs font-mono focus:border-[var(--gold)] outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Sous-titre du Ruban KPI
                </label>
                <input
                  type="text"
                  value={kpiForm.subtitle}
                  onChange={(e) => setKpiForm({ ...kpiForm, subtitle: e.target.value })}
                  className="w-full bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg px-3.5 py-2 text-xs focus:border-[var(--gold)] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Mention Secondaire à Droite
                </label>
                <input
                  type="text"
                  value={kpiForm.rightText}
                  onChange={(e) => setKpiForm({ ...kpiForm, rightText: e.target.value })}
                  className="w-full bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg px-3.5 py-2 text-xs focus:border-[var(--gold)] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Libellé du Bouton d'Action sur Chaque Carte
                </label>
                <input
                  type="text"
                  value={kpiForm.cardButtonLabel}
                  onChange={(e) => setKpiForm({ ...kpiForm, cardButtonLabel: e.target.value })}
                  className="w-full bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg px-3.5 py-2 text-xs font-bold focus:border-[var(--gold)] outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={savingTexts}
              className="btn-base btn-gold text-xs py-2.5 px-6 inline-flex items-center gap-2 cursor-pointer font-bold shadow-md"
            >
              {savingTexts ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Enregistrer tous les Textes de la Page Périodes</span>
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* VOLET 4: APERÇU EN DIRECT                                                 */}
      {/* ========================================================================= */}
      {activeTab === "preview" && (
        <div className="space-y-6 p-6 rounded-2xl bg-[var(--card)] text-[var(--foreground)] border border-[var(--gold)]/30 shadow-2xl">
          {/* Header Preview Banner */}
          <div className="text-center space-y-3 py-6 px-4 bg-[var(--gold)]/10 rounded-2xl border border-[var(--gold)]/25">
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-[var(--gold)] text-black">
              {heroForm.eyebrow}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--foreground)]">
              {heroForm.title}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--muted-foreground)] max-w-2xl mx-auto leading-relaxed">
              {heroForm.subtitle}
            </p>
          </div>

          {/* KPI Ribbon Preview */}
          <div className="p-4 rounded-2xl bg-[var(--background)] border border-[var(--gold)]/30 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[var(--gold)]/15 text-[var(--gold)] flex items-center justify-center">
                <History className="w-4 h-4" />
              </div>
              <div>
                <p className="font-serif text-sm font-bold text-[var(--foreground)]">{kpiForm.title}</p>
                <p className="text-[11px] text-[var(--muted-foreground)]">{kpiForm.subtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--gold)]">
              <span>{kpiForm.rightText}</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[var(--gold)]/15 border border-[var(--gold)]/30 text-[11px] font-mono font-bold">
                {kpiForm.badge}
              </span>
            </div>
          </div>

          {/* Quick Filter Bar Preview */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            <span className="px-3 py-1.5 rounded-xl text-xs font-serif font-bold bg-[var(--gold)] text-black shadow-sm shrink-0">
              Toutes les époques ({config.periods.filter((p) => p.isPublished !== false).length})
            </span>
            {config.categories.map((cat) => {
              const count = config.periods.filter(
                (p) => p.isPublished !== false && p.category === cat.key
              ).length;
              return (
                <span
                  key={cat.key}
                  className="px-3 py-1.5 rounded-xl text-xs font-serif bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] shrink-0"
                >
                  {cat.label} ({count})
                </span>
              );
            })}
          </div>

          {/* Cards Preview Grid */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {config.periods
              .filter((p) => p.isPublished !== false)
              .slice(0, 6)
              .map((period) => (
                <div
                  key={period.id}
                  className="p-6 rounded-xl bg-[var(--card)] border border-[var(--gold)]/35 shadow-md flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-serif font-bold text-lg text-[var(--foreground)] leading-snug">
                        {period.title}
                      </h4>
                      {period.arabicTitle && (
                        <p dir="rtl" className="text-xs text-[var(--gold)] font-amiri font-bold mt-0.5">
                          {period.arabicTitle}
                        </p>
                      )}
                    </div>

                    <p className="text-xs text-[var(--foreground)]/80 leading-relaxed line-clamp-3">
                      {period.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--background)] text-[var(--foreground)]/80 border border-[var(--border)]">
                        {period.displayPeriod}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--background)] text-[var(--foreground)]/80 border border-[var(--border)]">
                        Capitale : {period.capital}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[var(--gold)]/15">
                    <Link
                      to={`/periods/${period.id}`}
                      target="_blank"
                      className="btn-base btn-gold text-xs py-2 px-4 inline-flex items-center justify-center gap-2 w-full font-bold shadow-sm"
                    >
                      <span>{period.cardButtonLabel || kpiForm.cardButtonLabel || "DÉCOUVRIR LA PÉRIODE"}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT PERIOD (ALL DETAILS IN 4 SUB-TABS)                      */}
      {/* ========================================================================= */}
      {periodModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setPeriodModalOpen(false)}
        >
          <div
            className="surface-card frame-gold w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl bg-[var(--card)] border border-[var(--gold)]/40 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--card)]">
              <h3 className="font-serif font-bold text-base text-[var(--foreground)] flex items-center gap-2">
                <Landmark className="w-4 h-4 text-[var(--gold)]" />
                <span>
                  {editingPeriod
                    ? `Modifier la Période : ${editingPeriod.title}`
                    : "Ajouter une Nouvelle Période Historique"}
                </span>
              </h3>
              <button
                type="button"
                onClick={() => setPeriodModalOpen(false)}
                className="p-1 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--background)] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Sub-Tabs */}
            <div className="px-6 pt-3 pb-2 border-b border-[var(--border)] bg-[var(--background)]/50 flex flex-wrap gap-1.5">
              {[
                { key: "general", label: "1. Identité & Souveraineté" },
                { key: "narrative", label: "2. Récit, Tunis & Archives" },
                { key: "leaders", label: `3. Dirigeants (${formPeriod.notableLeaders?.length || 0}) & Familles (${formPeriod.notableFamilies?.length || 0})` },
                { key: "divisions", label: `4. Divisions (${formPeriod.administrativeDivisions?.length || 0}) & Cités (${formPeriod.keySites?.length || 0})` },
              ].map((st) => (
                <button
                  key={st.key}
                  type="button"
                  onClick={() => setModalSubTab(st.key as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    modalSubTab === st.key
                      ? "bg-[var(--gold)] text-black shadow-xs"
                      : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--gold)]/10"
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSavePeriod} className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* SUB-TAB 1: GENERAL & SOVEREIGNTY */}
              {modalSubTab === "general" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                      Titre Complet de la Période *
                    </label>
                    <input
                      type="text"
                      required
                      value={formPeriod.title}
                      onChange={(e) => setFormPeriod({ ...formPeriod, title: e.target.value })}
                      placeholder="ex: 9. Régence Ottomane de Tunis & Dynastie Mouradite"
                      className="w-full bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg px-3.5 py-2 text-xs font-bold focus:border-[var(--gold)] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                      Titre en Arabe
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      value={formPeriod.arabicTitle}
                      onChange={(e) => setFormPeriod({ ...formPeriod, arabicTitle: e.target.value })}
                      className="w-full bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg px-3.5 py-2 text-xs font-amiri focus:border-[var(--gold)] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                      Identifiant URL (Slug) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formPeriod.id}
                      onChange={(e) => setFormPeriod({ ...formPeriod, id: e.target.value })}
                      className="w-full bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg px-3.5 py-2 text-xs font-mono focus:border-[var(--gold)] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                      Intervalle Temporel Affiché *
                    </label>
                    <input
                      type="text"
                      required
                      value={formPeriod.displayPeriod}
                      onChange={(e) => setFormPeriod({ ...formPeriod, displayPeriod: e.target.value })}
                      placeholder="ex: 1574 – 1705"
                      className="w-full bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg px-3.5 py-2 text-xs focus:border-[var(--gold)] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                      Macro-Époque / Catégorie *
                    </label>
                    <select
                      value={formPeriod.category}
                      onChange={(e) => setFormPeriod({ ...formPeriod, category: e.target.value })}
                      className="w-full bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg px-3 py-2 text-xs focus:border-[var(--gold)] outline-none"
                    >
                      {config.categories.map((cat) => (
                        <option key={cat.key} value={cat.key}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                      Numéro d'Ordre Chronologique
                    </label>
                    <input
                      type="number"
                      value={formPeriod.stepNumber}
                      onChange={(e) => setFormPeriod({ ...formPeriod, stepNumber: Number(e.target.value) })}
                      className="w-full bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg px-3.5 py-2 text-xs focus:border-[var(--gold)] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                      Badge Chronologique
                    </label>
                    <input
                      type="text"
                      value={formPeriod.badge}
                      onChange={(e) => setFormPeriod({ ...formPeriod, badge: e.target.value })}
                      className="w-full bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg px-3.5 py-2 text-xs font-mono focus:border-[var(--gold)] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                      Capitale Historique *
                    </label>
                    <input
                      type="text"
                      required
                      value={formPeriod.capital}
                      onChange={(e) => setFormPeriod({ ...formPeriod, capital: e.target.value })}
                      className="w-full bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg px-3.5 py-2 text-xs focus:border-[var(--gold)] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                      Nom de l'État / Souveraineté (Devlet)
                    </label>
                    <input
                      type="text"
                      value={formPeriod.devletName}
                      onChange={(e) => setFormPeriod({ ...formPeriod, devletName: e.target.value })}
                      className="w-full bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg px-3.5 py-2 text-xs focus:border-[var(--gold)] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                      Ensemble Impérial / Civilisation
                    </label>
                    <input
                      type="text"
                      value={formPeriod.empire}
                      onChange={(e) => setFormPeriod({ ...formPeriod, empire: e.target.value })}
                      className="w-full bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg px-3.5 py-2 text-xs focus:border-[var(--gold)] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                      Libellé du Bouton de la Carte
                    </label>
                    <input
                      type="text"
                      value={formPeriod.cardButtonLabel || ""}
                      onChange={(e) => setFormPeriod({ ...formPeriod, cardButtonLabel: e.target.value })}
                      placeholder="DÉCOUVRIR LA PÉRIODE"
                      className="w-full bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg px-3.5 py-2 text-xs focus:border-[var(--gold)] outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                      Tags Personnalisés sur la Carte (séparés par des virgules — laisser vide pour génération auto)
                    </label>
                    <input
                      type="text"
                      value={customTagsInput}
                      onChange={(e) => setCustomTagsInput(e.target.value)}
                      placeholder="ex: 1574 – 1705, Capitale : Tunis, Régence Ottomane, Dey Othman"
                      className="w-full bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg px-3.5 py-2 text-xs focus:border-[var(--gold)] outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2 flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="periodPublished"
                      checked={formPeriod.isPublished !== false}
                      onChange={(e) => setFormPeriod({ ...formPeriod, isPublished: e.target.checked })}
                      className="rounded border-[var(--border)] text-[var(--gold)]"
                    />
                    <label htmlFor="periodPublished" className="text-xs text-[var(--foreground)] cursor-pointer">
                      Période publiée et visible sur le site public
                    </label>
                  </div>
                </div>
              )}

              {/* SUB-TAB 2: NARRATIVE, TUNIS ROLE & ARCHIVES */}
              {modalSubTab === "narrative" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                      Description Générale (affichée sur la carte et en introduction) *
                    </label>
                    <textarea
                      rows={3}
                      value={formPeriod.description}
                      onChange={(e) => setFormPeriod({ ...formPeriod, description: e.target.value })}
                      className="w-full bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg p-3 text-xs focus:border-[var(--gold)] outline-none leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                      Le Rayonnement & les Institutions de Tunis durant cette Période
                    </label>
                    <textarea
                      rows={3}
                      value={formPeriod.tunisRole || ""}
                      onChange={(e) => setFormPeriod({ ...formPeriod, tunisRole: e.target.value })}
                      className="w-full bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg p-3 text-xs focus:border-[var(--gold)] outline-none leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                      Synthèse des Lignées, Peuplement & Onomastique
                    </label>
                    <textarea
                      rows={3}
                      value={formPeriod.lineagesSummary || ""}
                      onChange={(e) => setFormPeriod({ ...formPeriod, lineagesSummary: e.target.value })}
                      className="w-full bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg p-3 text-xs focus:border-[var(--gold)] outline-none leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                      Traités Historiques & Frontières
                    </label>
                    <textarea
                      rows={2}
                      value={formPeriod.treatiesAndBorders || ""}
                      onChange={(e) => setFormPeriod({ ...formPeriod, treatiesAndBorders: e.target.value })}
                      className="w-full bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg p-3 text-xs focus:border-[var(--gold)] outline-none leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                        Structure des Noms
                      </label>
                      <input
                        type="text"
                        value={formPeriod.namingStructure || ""}
                        onChange={(e) => setFormPeriod({ ...formPeriod, namingStructure: e.target.value })}
                        className="w-full bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg px-3 py-2 text-xs focus:border-[var(--gold)] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                        Taux de Conservation
                      </label>
                      <input
                        type="text"
                        value={formPeriod.survivalRating || ""}
                        onChange={(e) => setFormPeriod({ ...formPeriod, survivalRating: e.target.value })}
                        className="w-full bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg px-3 py-2 text-xs focus:border-[var(--gold)] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                        Dépôts Clés
                      </label>
                      <input
                        type="text"
                        value={formPeriod.keyRepositories || ""}
                        onChange={(e) => setFormPeriod({ ...formPeriod, keyRepositories: e.target.value })}
                        className="w-full bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg px-3 py-2 text-xs focus:border-[var(--gold)] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                      Fonds & Sources Primaires Référencées (une source par ligne)
                    </label>
                    <textarea
                      rows={4}
                      value={archivalSourcesInput}
                      onChange={(e) => setArchivalSourcesInput(e.target.value)}
                      className="w-full bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg p-3 text-xs font-mono focus:border-[var(--gold)] outline-none leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* SUB-TAB 3: NOTABLE LEADERS & FAMILIES */}
              {modalSubTab === "leaders" && (
                <div className="space-y-6">
                  {/* Leaders */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--gold)]">
                        Dirigeants, Beys & Souverains ({formPeriod.notableLeaders?.length || 0})
                      </h4>
                      <button
                        type="button"
                        onClick={addLeader}
                        className="btn-base btn-gold text-[11px] py-1 px-3 inline-flex items-center gap-1 cursor-pointer font-bold"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Ajouter un Dirigeant</span>
                      </button>
                    </div>

                    {(formPeriod.notableLeaders || []).map((leader, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-[var(--background)] border border-[var(--border)] space-y-2.5"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <input
                            type="text"
                            value={leader.name}
                            onChange={(e) => updateLeader(idx, "name", e.target.value)}
                            placeholder="Nom du dirigeant"
                            className="bg-[var(--card)] border border-[var(--border)] rounded-lg px-2.5 py-1.5 text-xs font-bold text-[var(--foreground)]"
                          />
                          <input
                            type="text"
                            value={leader.role}
                            onChange={(e) => updateLeader(idx, "role", e.target.value)}
                            placeholder="Titre / Fonction"
                            className="bg-[var(--card)] border border-[var(--border)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--foreground)]"
                          />
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={leader.reignOrDates}
                              onChange={(e) => updateLeader(idx, "reignOrDates", e.target.value)}
                              placeholder="Dates de règne"
                              className="flex-1 bg-[var(--card)] border border-[var(--border)] rounded-lg px-2.5 py-1.5 text-xs font-mono text-[var(--foreground)]"
                            />
                            <button
                              type="button"
                              onClick={() => removeLeader(idx)}
                              className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <textarea
                          rows={2}
                          value={leader.achievements}
                          onChange={(e) => updateLeader(idx, "achievements", e.target.value)}
                          placeholder="Réalisations historiques et administratives..."
                          className="w-full bg-[var(--card)] border border-[var(--border)] rounded-lg p-2 text-xs text-[var(--foreground)]"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Families */}
                  <div className="space-y-3 pt-4 border-t border-[var(--border)]">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--gold)]">
                        Grandes Familles & Dynasties ({formPeriod.notableFamilies?.length || 0})
                      </h4>
                      <button
                        type="button"
                        onClick={addFamily}
                        className="btn-base btn-gold text-[11px] py-1 px-3 inline-flex items-center gap-1 cursor-pointer font-bold"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Ajouter une Famille</span>
                      </button>
                    </div>

                    {(formPeriod.notableFamilies || []).map((fam, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-[var(--background)] border border-[var(--border)] space-y-2.5"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <input
                            type="text"
                            value={fam.name}
                            onChange={(e) => updateFamily(idx, "name", e.target.value)}
                            placeholder="Nom de la dynastie / famille"
                            className="bg-[var(--card)] border border-[var(--border)] rounded-lg px-2.5 py-1.5 text-xs font-bold text-[var(--foreground)]"
                          />
                          <input
                            type="text"
                            value={fam.role}
                            onChange={(e) => updateFamily(idx, "role", e.target.value)}
                            placeholder="Statut / Rôle"
                            className="bg-[var(--card)] border border-[var(--border)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--foreground)]"
                          />
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={fam.origin}
                              onChange={(e) => updateFamily(idx, "origin", e.target.value)}
                              placeholder="Origine géographique"
                              className="flex-1 bg-[var(--card)] border border-[var(--border)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--foreground)]"
                            />
                            <button
                              type="button"
                              onClick={() => removeFamily(idx)}
                              className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <textarea
                          rows={2}
                          value={fam.lineageNotes}
                          onChange={(e) => updateFamily(idx, "lineageNotes", e.target.value)}
                          placeholder="Notes généalogiques et fonds d'archives associés..."
                          className="w-full bg-[var(--card)] border border-[var(--border)] rounded-lg p-2 text-xs text-[var(--foreground)]"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SUB-TAB 4: DIVISIONS & KEY SITES */}
              {modalSubTab === "divisions" && (
                <div className="space-y-6">
                  {/* Divisions */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--gold)]">
                        Divisions Administratives ({formPeriod.administrativeDivisions?.length || 0})
                      </h4>
                      <button
                        type="button"
                        onClick={addDivision}
                        className="btn-base btn-gold text-[11px] py-1 px-3 inline-flex items-center gap-1 cursor-pointer font-bold"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Ajouter une Division</span>
                      </button>
                    </div>

                    {(formPeriod.administrativeDivisions || []).map((div, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-[var(--background)] border border-[var(--border)] space-y-2"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <input
                            type="text"
                            value={div.name}
                            onChange={(e) => updateDivision(idx, "name", e.target.value)}
                            placeholder="Nom de la division"
                            className="bg-[var(--card)] border border-[var(--border)] rounded-lg px-2.5 py-1.5 text-xs font-bold text-[var(--foreground)]"
                          />
                          <input
                            type="text"
                            dir="rtl"
                            value={div.arabicName}
                            onChange={(e) => updateDivision(idx, "arabicName", e.target.value)}
                            placeholder="Nom en arabe"
                            className="bg-[var(--card)] border border-[var(--border)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--foreground)]"
                          />
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={div.seat}
                              onChange={(e) => updateDivision(idx, "seat", e.target.value)}
                              placeholder="Chef-lieu / Siège"
                              className="flex-1 bg-[var(--card)] border border-[var(--border)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--foreground)]"
                            />
                            <button
                              type="button"
                              onClick={() => removeDivision(idx)}
                              className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <textarea
                          rows={2}
                          value={div.description}
                          onChange={(e) => updateDivision(idx, "description", e.target.value)}
                          placeholder="Description de la juridiction..."
                          className="w-full bg-[var(--card)] border border-[var(--border)] rounded-lg p-2 text-xs text-[var(--foreground)]"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Key Sites */}
                  <div className="space-y-3 pt-4 border-t border-[var(--border)]">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--gold)]">
                        Cités Principales & Places Fortes ({formPeriod.keySites?.length || 0})
                      </h4>
                      <button
                        type="button"
                        onClick={addKeySite}
                        className="btn-base btn-gold text-[11px] py-1 px-3 inline-flex items-center gap-1 cursor-pointer font-bold"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Ajouter une Cité / Site</span>
                      </button>
                    </div>

                    {(formPeriod.keySites || []).map((site, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-[var(--background)] border border-[var(--border)] grid grid-cols-1 sm:grid-cols-3 gap-2 items-center"
                      >
                        <input
                          type="text"
                          value={site.name}
                          onChange={(e) => updateKeySite(idx, "name", e.target.value)}
                          placeholder="Nom de la cité"
                          className="bg-[var(--card)] border border-[var(--border)] rounded-lg px-2.5 py-1.5 text-xs font-bold text-[var(--foreground)]"
                        />
                        <input
                          type="text"
                          value={site.role}
                          onChange={(e) => updateKeySite(idx, "role", e.target.value)}
                          placeholder="Rôle historique / Monument"
                          className="sm:col-span-2 bg-[var(--card)] border border-[var(--border)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--foreground)]"
                        />
                        <div className="sm:col-span-3 flex justify-end">
                          <button
                            type="button"
                            onClick={() => removeKeySite(idx)}
                            className="text-xs text-rose-500 hover:underline inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Retirer ce site</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="pt-4 border-t border-[var(--border)] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPeriodModalOpen(false)}
                  className="btn-base btn-outline text-xs py-2 px-4 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={savingPeriod}
                  className="btn-base btn-gold text-xs py-2 px-5 inline-flex items-center gap-1.5 font-bold cursor-pointer"
                >
                  {savingPeriod && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Enregistrer la Période</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT MACRO-EPOCH CATEGORY                                    */}
      {/* ========================================================================= */}
      {categoryModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setCategoryModalOpen(false)}
        >
          <div
            className="surface-card frame-gold w-full max-w-md flex flex-col rounded-2xl bg-[var(--card)] border border-[var(--gold)]/40 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--card)]">
              <h3 className="font-serif font-bold text-base text-[var(--foreground)] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[var(--gold)]" />
                <span>
                  {editingCategory ? "Modifier la Macro-Époque" : "Ajouter une Macro-Époque"}
                </span>
              </h3>
              <button
                type="button"
                onClick={() => setCategoryModalOpen(false)}
                className="p-1 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Nom Affiché de la Macro-Époque *
                </label>
                <input
                  type="text"
                  required
                  value={catLabel}
                  onChange={(e) => {
                    setCatLabel(e.target.value);
                    if (!editingCategory) {
                      setCatKey(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "_"));
                    }
                  }}
                  placeholder="ex: Antiquité & Byzance"
                  className="w-full bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg px-3.5 py-2 text-xs focus:border-[var(--gold)] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Identifiant / Clé *
                </label>
                <input
                  type="text"
                  required
                  value={catKey}
                  onChange={(e) => setCatKey(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "_"))}
                  className="w-full bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg px-3.5 py-2 text-xs font-mono focus:border-[var(--gold)] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Icône Représentative
                </label>
                <select
                  value={catIcon}
                  onChange={(e) => setCatIcon(e.target.value)}
                  className="w-full bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg px-3 py-2 text-xs focus:border-[var(--gold)] outline-none"
                >
                  <option value="Landmark">Landmark (Antiquité & Monuments)</option>
                  <option value="Crown">Crown (Dynasties & Royaumes)</option>
                  <option value="Scroll">Scroll (Régence & Traités)</option>
                  <option value="Shield">Shield (République & Institutions)</option>
                  <option value="History">History (Chronologie)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Description Courte
                </label>
                <textarea
                  rows={2}
                  value={catDescription}
                  onChange={(e) => setCatDescription(e.target.value)}
                  className="w-full bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg p-3 text-xs focus:border-[var(--gold)] outline-none leading-relaxed"
                />
              </div>

              <div className="pt-3 border-t border-[var(--border)] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(false)}
                  className="btn-base btn-outline text-xs py-2 px-4 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={savingCategory}
                  className="btn-base btn-gold text-xs py-2 px-5 inline-flex items-center gap-1.5 font-bold cursor-pointer"
                >
                  {savingCategory && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Enregistrer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: LINK GALLERY PIECE TO PERIOD                                       */}
      {/* ========================================================================= */}
      {linkModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setLinkModalOpen(false)}
        >
          <div
            className="surface-card frame-gold w-full max-w-2xl max-h-[88vh] flex flex-col rounded-2xl bg-[var(--card)] border border-[var(--gold)]/40 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between">
              <h3 className="font-serif font-bold text-base text-[var(--foreground)] flex items-center gap-2">
                <Link2 className="w-4 h-4 text-[var(--gold)]" />
                <span>Associer une Pièce de la Galerie à la Période</span>
              </h3>
              <button
                type="button"
                onClick={() => setLinkModalOpen(false)}
                className="p-1 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={availSearch}
                  onChange={(e) => setAvailSearch(e.target.value)}
                  placeholder="Rechercher dans la galerie..."
                  className="flex-1 bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs text-[var(--foreground)]"
                />
                <select
                  value={availTypeFilter}
                  onChange={(e) => setAvailTypeFilter(e.target.value)}
                  className="bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs text-[var(--foreground)]"
                >
                  <option value="all">Tous les types</option>
                  <option value="document">Documents</option>
                  <option value="book">Livres & Manuscrits</option>
                  <option value="tree">Arbres Généalogiques</option>
                  <option value="gallery">Photos Galerie</option>
                  <option value="audio">Récits Audio</option>
                </select>
              </div>

              <div className="max-h-56 overflow-y-auto space-y-2 border border-[var(--border)] rounded-xl p-2 bg-[var(--background)]/50">
                {loadingAvailable ? (
                  <p className="text-center py-8 text-xs text-[var(--muted-foreground)]">
                    Chargement du catalogue...
                  </p>
                ) : filteredAvailableItems.length === 0 ? (
                  <p className="text-center py-8 text-xs text-[var(--muted-foreground)]">
                    Aucun élément trouvé.
                  </p>
                ) : (
                  filteredAvailableItems.map((item) => {
                    const isSelected =
                      selectedItemToLink?.source_id === item.source_id &&
                      selectedItemToLink?.source_type === item.source_type;
                    return (
                      <button
                        key={`${item.source_type}-${item.source_id}`}
                        type="button"
                        onClick={() => {
                          setSelectedItemToLink(item);
                          setCustomLinkTitle(item.title);
                          setCustomLinkNotes(
                            item.archive_source
                              ? `Cote : ${item.document_code || "Non spécifiée"} — ${item.archive_source}`
                              : ""
                          );
                        }}
                        className={`w-full text-start p-2.5 rounded-lg border text-xs transition flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? "border-[var(--gold)] bg-[var(--gold)]/15 font-bold"
                            : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--gold)]/50"
                        }`}
                      >
                        <div>
                          <span className="uppercase font-mono text-[10px] text-[var(--gold)] me-2">
                            [{item.source_type}]
                          </span>
                          <span className="text-[var(--foreground)]">{item.title}</span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-[var(--gold)] shrink-0" />}
                      </button>
                    );
                  })
                )}
              </div>

              {selectedItemToLink && (
                <div className="space-y-3 pt-2 border-t border-[var(--border)]">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                      Titre d'affichage personnalisé pour cette période
                    </label>
                    <input
                      type="text"
                      value={customLinkTitle}
                      onChange={(e) => setCustomLinkTitle(e.target.value)}
                      className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs text-[var(--foreground)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                      Notes archivistiques / Cote
                    </label>
                    <input
                      type="text"
                      value={customLinkNotes}
                      onChange={(e) => setCustomLinkNotes(e.target.value)}
                      className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs text-[var(--foreground)]"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-[var(--border)] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setLinkModalOpen(false)}
                className="btn-base btn-outline text-xs py-2 px-4 cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                disabled={!selectedItemToLink || linkingSubmitting}
                onClick={handleConfirmLinkSource}
                className="btn-base btn-gold text-xs py-2 px-5 inline-flex items-center gap-1.5 font-bold cursor-pointer"
              >
                {linkingSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Confirmer l'Association</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
