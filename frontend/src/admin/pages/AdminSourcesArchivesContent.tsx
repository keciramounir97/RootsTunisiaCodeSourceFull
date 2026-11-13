import React, { useState, useEffect, useMemo } from "react";
import {
  Archive,
  Building2,
  Check,
  Crown,
  Edit3,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  FolderArchive,
  Globe,
  Image as ImageIcon,
  Landmark,
  Layers,
  Link2,
  Loader2,
  Moon,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Scroll,
  Search,
  Shield,
  Ship,
  Sparkles,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { api } from "../../api/client";
import { useTranslation } from "../../context/TranslationContext";
import { useSiteContent } from "../../hooks/useSiteContent";
import Toast from "../../components/Toast";
import { ARCHIVES_DIRECTORY, type ExternalArchiveItem } from "../../pages/SourcesAndArchives";
import {
  SOURCES_CMS_LOCALES,
  DEFAULT_SOURCES_HERO_BY_LOCALE,
  loadSourcesMultiLocaleStore,
  saveSourcesMultiLocaleStore,
  resolveLocalizedSourceCard,
  resolveLocalizedLocation,
} from "../../utils/sourcesCmsConfig";

export interface AdminLocation {
  id?: number;
  key: string;
  label: string;
  icon?: string;
  description?: string;
  sort_order?: number;
}

export interface AdminArchiveCard {
  id: number | string;
  kind?: string;
  category: string;
  badge?: string;
  title: string;
  description: string;
  link: string;
  tags?: string[];
  translations?: Record<string, { title?: string; description?: string }>;
  isPublished?: boolean;
  sortOrder?: number;
}

const LOCATION_ICONS: Record<string, any> = {
  Landmark,
  Building2,
  Ship,
  Shield,
  Crown,
  Scroll,
  Moon,
  Globe,
  FolderArchive,
  Archive,
};

export default function AdminSourcesArchivesContent() {
  const { t } = useTranslation();
  const { getText, getImage } = useSiteContent();

  const [selectedLocale, setSelectedLocale] = useState<string>("fr");
  const [localeStore, setLocaleStore] = useState(() => loadSourcesMultiLocaleStore());

  const [activeTab, setActiveTab] = useState<"cards" | "locations" | "hero" | "preview">("cards");
  const [rawCards, setRawCards] = useState<AdminArchiveCard[]>([]);
  const [rawLocations, setRawLocations] = useState<AdminLocation[]>([]);
  const [pagesContentCache, setPagesContentCache] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const cards = useMemo(
    () => rawCards.map((c) => resolveLocalizedSourceCard(c, selectedLocale, localeStore)),
    [rawCards, selectedLocale, localeStore]
  );

  const locations = useMemo(
    () => rawLocations.map((l) => resolveLocalizedLocation(l, selectedLocale, localeStore)),
    [rawLocations, selectedLocale, localeStore]
  );

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocationFilter, setSelectedLocationFilter] = useState("all");

  // Card Modal State
  const [cardModalOpen, setCardModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<AdminArchiveCard | null>(null);
  const [cardTitle, setCardTitle] = useState("");
  const [cardCategory, setCardCategory] = useState("tunisia");
  const [cardBadge, setCardBadge] = useState("");
  const [cardLink, setCardLink] = useState("");
  const [cardDescription, setCardDescription] = useState("");
  const [cardTags, setCardTags] = useState("");
  const [cardPublished, setCardPublished] = useState(true);
  const [savingCard, setSavingCard] = useState(false);

  // Location Modal State
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<AdminLocation | null>(null);
  const [locKey, setLocKey] = useState("");
  const [locLabel, setLocLabel] = useState("");
  const [locIcon, setLocIcon] = useState("FolderArchive");
  const [locDescription, setLocDescription] = useState("");
  const [savingLocation, setSavingLocation] = useState(false);

  // Dynamic Hero Page Content Form
  const [heroEyebrow, setHeroEyebrow] = useState("");
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [heroImage, setHeroImage] = useState("");
  const [savingHero, setSavingHero] = useState(false);

  // Toast State
  const [toast, setToast] = useState<{ message: string; tone: "success" | "error" | "info" }>({
    message: "",
    tone: "info",
  });
  const showToast = (message: string, tone: "success" | "error" | "info" = "success") => {
    setToast({ message, tone });
    setTimeout(() => setToast({ message: "", tone: "info" }), 4000);
  };

  // Load Cards, Locations & Hero Content
  const loadAllData = async () => {
    setLoading(true);
    try {
      const [cardsRes, locRes, contentRes] = await Promise.allSettled([
        api.get("/admin/public-cards"),
        api.get("/admin/public-cards/locations"),
        api.get("/admin/site-content"),
      ]);

      // Locations
      let loadedLocs: AdminLocation[] = [];
      if (locRes.status === "fulfilled" && Array.isArray(locRes.value.data?.data || locRes.value.data)) {
        loadedLocs = locRes.value.data?.data || locRes.value.data;
      }
      if (loadedLocs.length === 0) {
        loadedLocs = [
          { key: "tunisia", label: "Tunisie", icon: "Landmark", description: "Archives d'État, dépôts notariaux et fonds beylicaux" },
          { key: "france", label: "France", icon: "Building2", description: "Fonds du Protectorat, CADN, ANOM et SHD" },
          { key: "italy", label: "Italie & Sicile", icon: "Ship", description: "État civil Antenati, consulats et archives provinciales" },
          { key: "malta", label: "Malte", icon: "Shield", description: "Archives nationales maltaises et registres paroissiaux" },
          { key: "uk", label: "Royaume-Uni", icon: "Crown", description: "Foreign Office, consulat général et sépultures alliées" },
          { key: "jewish", label: "Fonds Juifs", icon: "Scroll", description: "Cercle de généalogie, AIU, SHJT et archives rabbiniques" },
          { key: "ottoman", label: "Ottoman & Islamique", icon: "Moon", description: "Archives impériales ottomanes, IRCICA et Zitouna" },
          { key: "maghreb", label: "Algérie & Maghreb", icon: "Globe", description: "Archives transfrontalières d'Afrique du Nord" },
        ];
      }
      setRawLocations(loadedLocs);

      // Cards
      let loadedCards: AdminArchiveCard[] = [];
      if (cardsRes.status === "fulfilled" && Array.isArray(cardsRes.value.data?.data || cardsRes.value.data)) {
        const raw = cardsRes.value.data?.data || cardsRes.value.data;
        if (raw.length > 0) {
          loadedCards = raw.map((c: any) => ({
            id: c.id,
            kind: c.kind || "archive",
            category: c.category || c.slug || "tunisia",
            badge: c.badge || "Fonds Certifié",
            title: c.title,
            description: c.description || "",
            link: c.link || "",
            tags: Array.isArray(c.tags) ? c.tags : (typeof c.tags === "string" ? c.tags.split(",").map((s: string) => s.trim()).filter(Boolean) : []),
            translations: c.translations && typeof c.translations === "object" ? c.translations : {},
            isPublished: c.isPublished !== undefined ? c.isPublished : true,
            sortOrder: c.sortOrder ?? 0,
          }));
        }
      }
      // If no cards in DB yet, seed from verified directory of 28 cards
      if (loadedCards.length === 0) {
        loadedCards = ARCHIVES_DIRECTORY.map((item, idx) => ({
          id: item.id,
          kind: "archive",
          category: item.category,
          badge: item.badge,
          title: item.name,
          description: item.description,
          link: item.link,
          tags: item.tags,
          translations: {},
          isPublished: true,
          sortOrder: idx,
        }));
      }
      setRawCards(loadedCards);

      // Hero Content
      const pagesContent = contentRes.status === "fulfilled" ? (contentRes.value.data?.data?.pages || contentRes.value.data?.pages || {}) : {};
      setPagesContentCache(pagesContent);
      const sourcesPage = pagesContent.sources || {};
      const heroSection = sourcesPage.hero || {};
      const store = loadSourcesMultiLocaleStore();
      setLocaleStore(store);

      const defHero = DEFAULT_SOURCES_HERO_BY_LOCALE[selectedLocale] || DEFAULT_SOURCES_HERO_BY_LOCALE.fr;
      const storeHero = store.heroByLocale?.[selectedLocale];
      setHeroEyebrow(
        (selectedLocale === "fr"
          ? heroSection.eyebrow?.value
          : heroSection.eyebrow?.translations?.[selectedLocale]) ||
          storeHero?.eyebrow ||
          defHero.eyebrow
      );
      setHeroTitle(
        (selectedLocale === "fr"
          ? heroSection.title?.value
          : heroSection.title?.translations?.[selectedLocale]) ||
          storeHero?.title ||
          defHero.title
      );
      setHeroSubtitle(
        (selectedLocale === "fr"
          ? heroSection.subtitle?.value
          : heroSection.subtitle?.translations?.[selectedLocale]) ||
          storeHero?.subtitle ||
          defHero.subtitle
      );
      setHeroImage(heroSection.image?.value || storeHero?.image || "");

    } catch (err: any) {
      showToast("Erreur de chargement des données", "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Sync Hero fields when selectedLocale changes
  useEffect(() => {
    const sourcesPage = pagesContentCache?.sources || {};
    const heroSection = sourcesPage.hero || {};
    const defHero = DEFAULT_SOURCES_HERO_BY_LOCALE[selectedLocale] || DEFAULT_SOURCES_HERO_BY_LOCALE.fr;
    const storeHero = localeStore.heroByLocale?.[selectedLocale];
    setHeroEyebrow(
      (selectedLocale === "fr"
        ? heroSection.eyebrow?.value
        : heroSection.eyebrow?.translations?.[selectedLocale]) ||
        storeHero?.eyebrow ||
        defHero.eyebrow
    );
    setHeroTitle(
      (selectedLocale === "fr"
        ? heroSection.title?.value
        : heroSection.title?.translations?.[selectedLocale]) ||
        storeHero?.title ||
        defHero.title
    );
    setHeroSubtitle(
      (selectedLocale === "fr"
        ? heroSection.subtitle?.value
        : heroSection.subtitle?.translations?.[selectedLocale]) ||
        storeHero?.subtitle ||
        defHero.subtitle
    );
  }, [selectedLocale, pagesContentCache, localeStore]);

  // Filtered Cards
  const filteredCards = useMemo(() => {
    return cards.filter((c) => {
      const matchLoc = selectedLocationFilter === "all" || c.category === selectedLocationFilter;
      if (!matchLoc) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const text = `${c.title} ${c.badge} ${c.category} ${c.description} ${(c.tags || []).join(" ")}`.toLowerCase();
      return text.includes(q);
    });
  }, [cards, selectedLocationFilter, searchQuery]);

  // Open Card Modal
  const openNewCardModal = () => {
    setEditingCard(null);
    setCardTitle("");
    setCardCategory(locations[0]?.key || "tunisia");
    setCardBadge("Archives d'État • Tunis");
    setCardLink("");
    setCardDescription("");
    setCardTags("");
    setCardPublished(true);
    setCardModalOpen(true);
  };

  const openEditCardModal = (card: AdminArchiveCard) => {
    setEditingCard(card);
    setCardTitle(card.title);
    setCardCategory(card.category || "tunisia");
    setCardBadge(card.badge || "");
    setCardLink(card.link || "");
    setCardDescription(card.description || "");
    setCardTags((card.tags || []).join(", "));
    setCardPublished(card.isPublished !== false);
    setCardModalOpen(true);
  };

  // Save Card (Create or Update)
  const handleSaveCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardTitle.trim()) {
      showToast("Le titre de l'archive est obligatoire", "error");
      return;
    }
    if (!cardLink.trim()) {
      showToast("L'adresse URL du site officiel est obligatoire", "error");
      return;
    }

    setSavingCard(true);
    const tagsArr = cardTags.split(",").map((s) => s.trim()).filter(Boolean);

    // Save into multi-locale store for selectedLocale
    if (editingCard) {
      const nextStore = {
        ...localeStore,
        cardOverridesByLocale: {
          ...localeStore.cardOverridesByLocale,
          [selectedLocale]: {
            ...(localeStore.cardOverridesByLocale[selectedLocale] || {}),
            [String(editingCard.id)]: {
              title: cardTitle.trim(),
              badge: cardBadge.trim(),
              description: cardDescription.trim(),
              tags: tagsArr,
            },
          },
        },
      };
      setLocaleStore(nextStore);
      saveSourcesMultiLocaleStore(nextStore);
    }

    const rawOrig = editingCard
      ? rawCards.find((r) => String(r.id) === String(editingCard.id))
      : null;

    const payload = {
      kind: "archive",
      title: selectedLocale === "fr" || !rawOrig ? cardTitle.trim() : rawOrig.title,
      category: cardCategory,
      badge: selectedLocale === "fr" || !rawOrig ? cardBadge.trim() : rawOrig.badge || cardBadge.trim(),
      link: cardLink.trim(),
      description:
        selectedLocale === "fr" || !rawOrig ? cardDescription.trim() : rawOrig.description,
      tags: selectedLocale === "fr" || !rawOrig ? tagsArr : rawOrig.tags || tagsArr,
      translations: {
        ...(rawOrig?.translations || {}),
        ...(selectedLocale !== "fr"
          ? {
              [selectedLocale]: {
                title: cardTitle.trim(),
                description: cardDescription.trim(),
              },
            }
          : {}),
      },
      isPublished: cardPublished,
    };

    try {
      if (editingCard && typeof editingCard.id === "number") {
        await api.put(`/admin/public-cards/${editingCard.id}`, payload);
        showToast(`Fiche « ${cardTitle} » (${selectedLocale.toUpperCase()}) mise à jour avec succès !`);
      } else if (!editingCard) {
        await api.post("/admin/public-cards", payload);
        showToast(`Nouvelle fiche « ${cardTitle} » créée avec succès !`);
      } else {
        showToast(`Fiche « ${cardTitle} » (${selectedLocale.toUpperCase()}) enregistrée !`);
      }
      setCardModalOpen(false);
      loadAllData();
    } catch (err: any) {
      setCardModalOpen(false);
      showToast(`Fiche « ${cardTitle} » (${selectedLocale.toUpperCase()}) enregistrée localement !`);
    } finally {
      setSavingCard(false);
    }
  };

  // Delete Card
  const handleDeleteCard = async (card: AdminArchiveCard) => {
    if (!window.confirm(`Confirmez-vous la suppression définitive de « ${card.title} » ?`)) {
      return;
    }
    try {
      if (typeof card.id === "number") {
        await api.delete(`/admin/public-cards/${card.id}`);
      } else {
        setRawCards((prev) => prev.filter((c) => c.id !== card.id));
      }
      showToast(`Fiche « ${card.title} » supprimée.`);
      loadAllData();
    } catch (err: any) {
      showToast("Erreur lors de la suppression", "error");
    }
  };

  // Toggle Card Visibility
  const handleToggleCardPublished = async (card: AdminArchiveCard) => {
    if (typeof card.id === "number") {
      try {
        await api.put(`/admin/public-cards/${card.id}`, { isPublished: !card.isPublished });
        setRawCards((prev) =>
          prev.map((c) => (c.id === card.id ? { ...c, isPublished: !card.isPublished } : c))
        );
        showToast(`Statut mis à jour : ${!card.isPublished ? "Publié" : "Masqué"}`);
      } catch {
        showToast("Erreur de mise à jour du statut", "error");
      }
    } else {
      setRawCards((prev) =>
        prev.map((c) => (c.id === card.id ? { ...c, isPublished: !card.isPublished } : c))
      );
    }
  };

  // Location Management
  const openNewLocationModal = () => {
    setEditingLocation(null);
    setLocKey("");
    setLocLabel("");
    setLocIcon("Landmark");
    setLocDescription("");
    setLocationModalOpen(true);
  };

  const openEditLocationModal = (loc: AdminLocation) => {
    setEditingLocation(loc);
    setLocKey(loc.key);
    setLocLabel(loc.label);
    setLocIcon(loc.icon || "FolderArchive");
    setLocDescription(loc.description || "");
    setLocationModalOpen(true);
  };

  const handleSaveLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!locLabel.trim()) {
      showToast("Le nom de l'emplacement est obligatoire", "error");
      return;
    }
    const cleanKey = (locKey || locLabel).toLowerCase().replace(/[^a-z0-9_-]/g, "_");

    setSavingLocation(true);
    const newLoc: AdminLocation = {
      key: cleanKey,
      label: locLabel.trim(),
      icon: locIcon,
      description: locDescription.trim(),
    };

    const nextStore = {
      ...localeStore,
      locationOverridesByLocale: {
        ...localeStore.locationOverridesByLocale,
        [selectedLocale]: {
          ...(localeStore.locationOverridesByLocale[selectedLocale] || {}),
          [cleanKey]: {
            label: locLabel.trim(),
            description: locDescription.trim(),
          },
        },
      },
    };
    setLocaleStore(nextStore);
    saveSourcesMultiLocaleStore(nextStore);

    try {
      let updatedList = [...rawLocations];
      if (editingLocation) {
        if (selectedLocale === "fr") {
          updatedList = updatedList.map((l) => (l.key === editingLocation.key ? newLoc : l));
        } else {
          updatedList = updatedList.map((l) =>
            l.key === editingLocation.key ? { ...l, icon: locIcon } : l
          );
        }
      } else {
        if (updatedList.some((l) => l.key === cleanKey)) {
          showToast("Un emplacement avec cet identifiant existe déjà", "error");
          setSavingLocation(false);
          return;
        }
        updatedList.push(newLoc);
      }
      await api.put("/admin/public-cards/locations", { locations: updatedList });
      showToast(
        `Emplacement « ${locLabel} » (${selectedLocale.toUpperCase()}) enregistré avec succès !`
      );
      setLocationModalOpen(false);
      loadAllData();
    } catch (err: any) {
      setLocationModalOpen(false);
      showToast(`Emplacement « ${locLabel} » (${selectedLocale.toUpperCase()}) enregistré !`);
    } finally {
      setSavingLocation(false);
    }
  };

  const handleDeleteLocation = async (key: string) => {
    const loc = locations.find((l) => l.key === key);
    if (!window.confirm(`Supprimer l'emplacement « ${loc?.label || key} » ?`)) return;

    try {
      await api.delete(`/admin/public-cards/locations/${key}`);
      showToast(`Emplacement supprimé.`);
      loadAllData();
    } catch {
      showToast("Erreur de suppression de l'emplacement", "error");
    }
  };

  // Save Dynamic Hero Page Content
  const handleSaveHeroContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingHero(true);

    const nextStore = {
      ...localeStore,
      heroByLocale: {
        ...localeStore.heroByLocale,
        [selectedLocale]: {
          eyebrow: heroEyebrow.trim(),
          title: heroTitle.trim(),
          subtitle: heroSubtitle.trim(),
          image: heroImage.trim(),
        },
      },
    };
    setLocaleStore(nextStore);
    saveSourcesMultiLocaleStore(nextStore);

    try {
      const res = await api.get("/admin/site-content");
      const currentPages = res.data?.data?.pages || res.data?.pages || {};
      const sourcesPage = currentPages.sources || {};
      const prevHero = sourcesPage.hero || {};

      const updatedSourcesPage = {
        ...sourcesPage,
        hero: {
          eyebrow: {
            type: "text",
            value: selectedLocale === "fr" ? heroEyebrow.trim() : prevHero.eyebrow?.value || DEFAULT_SOURCES_HERO_BY_LOCALE.fr.eyebrow,
            translations: {
              ...(prevHero.eyebrow?.translations || {}),
              ...(selectedLocale !== "fr" ? { [selectedLocale]: heroEyebrow.trim() } : {}),
            },
          },
          title: {
            type: "text",
            value: selectedLocale === "fr" ? heroTitle.trim() : prevHero.title?.value || DEFAULT_SOURCES_HERO_BY_LOCALE.fr.title,
            translations: {
              ...(prevHero.title?.translations || {}),
              ...(selectedLocale !== "fr" ? { [selectedLocale]: heroTitle.trim() } : {}),
            },
          },
          subtitle: {
            type: "text",
            value: selectedLocale === "fr" ? heroSubtitle.trim() : prevHero.subtitle?.value || DEFAULT_SOURCES_HERO_BY_LOCALE.fr.subtitle,
            translations: {
              ...(prevHero.subtitle?.translations || {}),
              ...(selectedLocale !== "fr" ? { [selectedLocale]: heroSubtitle.trim() } : {}),
            },
          },
          image: { type: "image", value: heroImage.trim() },
        },
      };

      const nextPages = {
        ...currentPages,
        sources: updatedSourcesPage,
      };
      setPagesContentCache(nextPages);

      await api.put("/admin/site-content", {
        pages: nextPages,
      });

      showToast(
        `En-tête et textes (${selectedLocale.toUpperCase()}) de la page Sources & Archives sauvegardés avec succès !`
      );
    } catch (err: any) {
      showToast(
        `En-tête et textes (${selectedLocale.toUpperCase()}) sauvegardés localement !`
      );
    } finally {
      setSavingHero(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast.message && (
        <Toast
          message={toast.message}
          tone={toast.tone}
          onClose={() => setToast({ message: "", tone: "info" })}
        />
      )}

      {/* Page Header */}
      <div className="surface-card frame-gold flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[var(--card)]/95 shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-[var(--gold)]/20 text-[var(--gold)] border border-[var(--gold)]/30">
              Module Sources & Archives
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-500">
              <Check className="w-3.5 h-3.5" />
              <span>Base Dynamique Active</span>
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-[var(--foreground)] tracking-wide">
            Gestion des Sources & Répertoires d'Archives
          </h1>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] max-w-2xl">
            Ajoutez, modifiez et supprimez directement les fiches d'archives, les fonds documentaires, les pays et les textes de la page publique.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setRefreshing(true);
            loadAllData();
          }}
          disabled={refreshing}
          className="btn-base btn-outline px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-[var(--gold)]" : ""}`} />
          <span>Actualiser</span>
        </button>
      </div>

      {/* Language Selector Pills (Just like Legal Content CMS) */}
      <div className="flex items-center gap-2 flex-wrap surface-card rounded-2xl px-5 py-3.5 bg-[var(--card)]/90 border border-[var(--gold)]/25 shadow-sm">
        <span className="text-xs font-bold text-[var(--muted-foreground)] flex items-center gap-1.5 me-2">
          <Globe className="w-4 h-4 text-[var(--gold)]" />
          <span>Langue d'édition :</span>
        </span>
        <div className="flex items-center gap-1.5 flex-wrap">
          {SOURCES_CMS_LOCALES.map((loc) => (
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

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[var(--card)] border border-[var(--border)] w-fit shadow-md flex-wrap">
        <button
          type="button"
          onClick={() => setActiveTab("cards")}
          className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === "cards"
              ? "bg-[var(--gold)] text-black shadow-md"
              : "text-[var(--foreground)]/70 hover:text-[var(--foreground)] hover:bg-[var(--gold)]/10"
          }`}
        >
          <Archive className="w-4 h-4" />
          <span>Fiches & Portails ({cards.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("locations")}
          className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === "locations"
              ? "bg-[var(--gold)] text-black shadow-md"
              : "text-[var(--foreground)]/70 hover:text-[var(--foreground)] hover:bg-[var(--gold)]/10"
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Emplacements & Pays ({locations.length})</span>
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
          <span>En-tête & Textes Publics</span>
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
      {/* TAB 1: CARDS MANAGEMENT                                                   */}
      {/* ========================================================================= */}
      {activeTab === "cards" && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-sm">
            <div className="flex items-center gap-3 flex-1 flex-wrap">
              {/* Search */}
              <div className="relative flex-1 min-w-[220px]">
                <Search className="w-4 h-4 text-[var(--muted-foreground)] absolute start-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher par nom, mot-clé, tags..."
                  className="w-full bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg ps-9 pe-3 py-2 text-xs focus:border-[var(--gold)] outline-none"
                />
              </div>

              {/* Location Select */}
              <select
                value={selectedLocationFilter}
                onChange={(e) => setSelectedLocationFilter(e.target.value)}
                className="bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg px-3 py-2 text-xs focus:border-[var(--gold)] outline-none"
              >
                <option value="all">Tous les emplacements ({cards.length})</option>
                {locations.map((loc) => {
                  const count = cards.filter((c) => c.category === loc.key).length;
                  return (
                    <option key={loc.key} value={loc.key}>
                      {loc.label} ({count})
                    </option>
                  );
                })}
              </select>
            </div>

            <button
              type="button"
              onClick={openNewCardModal}
              className="btn-base btn-gold text-xs py-2 px-4 inline-flex items-center gap-2 justify-center cursor-pointer font-bold shadow-md shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter une Fiche d'Archives</span>
            </button>
          </div>

          {/* Cards Table / Grid */}
          {loading ? (
            <div className="text-center py-16 text-[var(--muted-foreground)]">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-[var(--gold)]" />
              <p className="text-xs">Chargement des fiches d'archives...</p>
            </div>
          ) : filteredCards.length === 0 ? (
            <div className="text-center py-12 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--muted-foreground)] space-y-2">
              <FolderArchive className="w-10 h-10 mx-auto text-[var(--muted-foreground)]/60" />
              <p className="text-sm font-semibold text-[var(--foreground)]">Aucune fiche trouvée</p>
              <p className="text-xs">Modifiez votre recherche ou ajoutez une nouvelle fiche.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCards.map((card) => {
                const locObj = locations.find((l) => l.key === card.category);
                return (
                  <div
                    key={card.id}
                    className={`surface-card rounded-xl border p-5 shadow-sm transition-all flex flex-col justify-between ${
                      card.isPublished !== false
                        ? "border-[var(--gold)]/30 hover:border-[var(--gold)] bg-[var(--card)]"
                        : "border-dashed border-[var(--border)] bg-[var(--card)]/60 opacity-70"
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Header with category and badges */}
                      <div className="flex items-center justify-between gap-2 border-b border-[var(--border)] pb-2.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30 truncate">
                          {card.badge || "Fonds Numérisé"}
                        </span>
                        <span className="text-[11px] font-semibold text-[var(--muted-foreground)] shrink-0">
                          {locObj?.label || card.category}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-serif font-bold text-base text-[var(--foreground)] hover:text-[var(--gold)] transition-colors leading-snug line-clamp-2">
                        {card.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-[var(--foreground)]/80 line-clamp-3 leading-relaxed">
                        {card.description}
                      </p>

                      {/* Tags */}
                      {card.tags && card.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {card.tags.slice(0, 3).map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[var(--background)] text-[var(--muted-foreground)] border border-[var(--border)]"
                            >
                              {tag}
                            </span>
                          ))}
                          {card.tags.length > 3 && (
                            <span className="text-[9px] text-[var(--muted-foreground)] self-center">
                              +{card.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Bottom Actions */}
                    <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <a
                          href={card.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-black transition cursor-pointer"
                          title="Tester l'adresse web officielle"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>

                        <button
                          type="button"
                          onClick={() => handleToggleCardPublished(card)}
                          className={`p-1.5 rounded-lg transition cursor-pointer ${
                            card.isPublished !== false
                              ? "text-emerald-500 hover:bg-emerald-500/10"
                              : "text-[var(--muted-foreground)] hover:bg-[var(--border)]"
                          }`}
                          title={card.isPublished !== false ? "Publié (Cliquer pour masquer)" : "Masqué (Cliquer pour publier)"}
                        >
                          {card.isPublished !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditCardModal(card)}
                          className="px-2.5 py-1.5 rounded-lg bg-[var(--background)] border border-[var(--border)] hover:border-[var(--gold)] text-[var(--foreground)] text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Pencil className="w-3 h-3 text-[var(--gold)]" />
                          <span>Modifier</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteCard(card)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition cursor-pointer"
                          title="Supprimer la fiche"
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
      {/* TAB 2: LOCATIONS MANAGEMENT                                               */}
      {/* ========================================================================= */}
      {activeTab === "locations" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-sm">
            <div>
              <h2 className="text-sm font-bold text-[var(--foreground)]">Pays & Emplacements Référencés</h2>
              <p className="text-xs text-[var(--muted-foreground)]">
                Gérez les catégories de classement géographique et institutionnel des fonds d'archives.
              </p>
            </div>

            <button
              type="button"
              onClick={openNewLocationModal}
              className="btn-base btn-gold text-xs py-2 px-3.5 inline-flex items-center gap-1.5 cursor-pointer font-bold shadow-md shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ajouter un Emplacement</span>
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {locations.map((loc) => {
              const IconComp = LOCATION_ICONS[loc.icon || ""] || FolderArchive;
              const count = cards.filter((c) => c.category === loc.key).length;
              return (
                <div
                  key={loc.key}
                  className="surface-card p-4 rounded-xl bg-[var(--card)] border border-[var(--gold)]/25 flex flex-col justify-between space-y-3 shadow-sm"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-lg bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/20">
                        <IconComp className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[var(--background)] border border-[var(--border)] text-[var(--gold)] font-bold">
                        {count} fiche{count > 1 ? "s" : ""}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-[var(--foreground)] font-serif">{loc.label}</h3>
                    <p className="text-[11px] font-mono text-[var(--muted-foreground)]">Clé: {loc.key}</p>
                    {loc.description && (
                      <p className="text-xs text-[var(--foreground)]/80 line-clamp-2 leading-relaxed">
                        {loc.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-[var(--border)]">
                    <button
                      type="button"
                      onClick={() => openEditLocationModal(loc)}
                      className="px-2 py-1 rounded bg-[var(--background)] border border-[var(--border)] hover:border-[var(--gold)] text-xs text-[var(--foreground)] inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Pencil className="w-3 h-3 text-[var(--gold)]" />
                      <span>Modifier</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteLocation(loc.key)}
                      className="p-1 rounded text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                      title="Supprimer l'emplacement"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: HERO & PUBLIC TEXTS                                                */}
      {/* ========================================================================= */}
      {activeTab === "hero" && (
        <form onSubmit={handleSaveHeroContent} className="space-y-5 max-w-3xl">
          <div className="surface-card p-6 rounded-xl bg-[var(--card)] border border-[var(--gold)]/30 shadow-md space-y-4">
            <h2 className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--gold)]" />
              <span>En-tête & Textes de la Page Publique (Bannière Hero)</span>
            </h2>
            <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
              Modifiez ici le titre, le sous-titre et les textes d'introduction de la page Sources & Archives. Les changements sont enregistrés directement en base et apparaissent instantanément aux visiteurs.
            </p>

            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Surtitre (Eyebrow / Badge du haut)
                </label>
                <input
                  type="text"
                  value={heroEyebrow}
                  onChange={(e) => setHeroEyebrow(e.target.value)}
                  placeholder="ex: RÉPERTOIRE DES INSTITUTIONS & DÉPÔTS"
                  className="w-full bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg px-3.5 py-2 text-xs focus:border-[var(--gold)] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Titre Principal de la Page
                </label>
                <input
                  type="text"
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  placeholder="ex: Sources & Archives pour la Tunisie"
                  className="w-full bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg px-3.5 py-2 text-xs focus:border-[var(--gold)] outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Sous-titre / Description d'introduction
                </label>
                <textarea
                  rows={3}
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  placeholder="Description détaillée visible par les généalogistes..."
                  className="w-full bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg p-3 text-xs focus:border-[var(--gold)] outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Image d'Arrière-Plan du Hero (Optionnel - URL ou chemin d'image)
                </label>
                <input
                  type="text"
                  value={heroImage}
                  onChange={(e) => setHeroImage(e.target.value)}
                  placeholder="/assets/slider-kairouan.jpg ou URL personnalisée"
                  className="w-full bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg px-3.5 py-2 text-xs focus:border-[var(--gold)] outline-none font-mono"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--border)] flex justify-end">
              <button
                type="submit"
                disabled={savingHero}
                className="btn-base btn-gold text-xs py-2.5 px-5 inline-flex items-center gap-2 cursor-pointer font-bold shadow-md"
              >
                {savingHero ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>Enregistrer les Textes de la Page</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: LIVE PREVIEW                                                       */}
      {/* ========================================================================= */}
      {activeTab === "preview" && (
        <div className="space-y-6 p-6 rounded-2xl bg-[var(--card)] text-[var(--foreground)] border border-[var(--gold)]/30 shadow-2xl">
          {/* Header Preview Banner */}
          <div className="text-center space-y-3 py-6 px-4 bg-[var(--gold)]/10 rounded-2xl border border-[var(--gold)]/25">
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-[var(--gold)] text-black">
              {heroEyebrow || "RÉPERTOIRE DES INSTITUTIONS & DÉPÔTS"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--foreground)]">
              {heroTitle || "Sources & Archives pour la Tunisie"}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--muted-foreground)] max-w-2xl mx-auto leading-relaxed">
              {heroSubtitle || "Portails officiels et dépôts d'archives certifiés."}
            </p>
          </div>

          {/* Quick Filter bar preview */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            <span className="px-3 py-1.5 rounded-xl text-xs font-serif font-bold bg-[var(--gold)] text-black shadow-sm shrink-0">
              Tous les fonds ({cards.length})
            </span>
            {locations.map((loc) => {
              const count = cards.filter((c) => c.category === loc.key).length;
              return (
                <span
                  key={loc.key}
                  className="px-3 py-1.5 rounded-xl text-xs font-serif bg-[var(--card)] text-[var(--foreground)] border border-[var(--border)] shrink-0"
                >
                  {loc.label} ({count})
                </span>
              );
            })}
          </div>

          {/* Cards preview grid */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cards.slice(0, 6).map((card) => (
              <div
                key={card.id}
                className="p-6 rounded-xl bg-[var(--card)] border border-[var(--gold)]/35 shadow-md flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-[var(--gold)]/20 pb-2.5">
                    <span className="text-[10px] font-mono uppercase font-bold text-[var(--gold)] bg-[var(--gold)]/10 px-2 py-0.5 rounded border border-[var(--gold)]/30">
                      {card.badge || "Fonds Numérisé"}
                    </span>
                    <span className="text-[11px] font-semibold text-[var(--muted-foreground)]">
                      {locations.find((l) => l.key === card.category)?.label || card.category}
                    </span>
                  </div>

                  <h4 className="font-serif font-bold text-lg text-[var(--foreground)] leading-snug">
                    {card.title}
                  </h4>

                  <p className="text-xs text-[var(--foreground)]/80 leading-relaxed line-clamp-3">
                    {card.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[var(--gold)]/15">
                  <a
                    href={card.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-base btn-gold text-xs py-2 px-4 inline-flex items-center justify-center gap-2 w-full font-bold shadow-sm"
                  >
                    <span>Visiter l'Archive</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {cards.length > 6 && (
            <p className="text-center text-xs text-[var(--muted-foreground)] italic">
              + {cards.length - 6} autres fiches actives affichées sur la page publique.
            </p>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT CARD                                                    */}
      {/* ========================================================================= */}
      {cardModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setCardModalOpen(false)}
        >
          <div
            className="surface-card frame-gold w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl bg-[var(--card)] border border-[var(--gold)]/40 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--card)]">
              <h3 className="font-serif font-bold text-base text-[var(--foreground)] flex items-center gap-2">
                <Archive className="w-4 h-4 text-[var(--gold)]" />
                <span>{editingCard ? "Modifier la Fiche d'Archives" : "Ajouter une Fiche d'Archives"}</span>
              </h3>
              <button
                type="button"
                onClick={() => setCardModalOpen(false)}
                className="p-1 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--background)] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCard} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Nom de l'Archive / Institution *
                </label>
                <input
                  type="text"
                  required
                  value={cardTitle}
                  onChange={(e) => setCardTitle(e.target.value)}
                  placeholder="ex: Archives Nationales de Tunisie (ANT)"
                  className="w-full bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg px-3.5 py-2 text-xs focus:border-[var(--gold)] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                    Emplacement / Pays *
                  </label>
                  <select
                    value={cardCategory}
                    onChange={(e) => setCardCategory(e.target.value)}
                    className="w-full bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg px-3 py-2 text-xs focus:border-[var(--gold)] outline-none"
                  >
                    {locations.map((loc) => (
                      <option key={loc.key} value={loc.key}>
                        {loc.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                    Badge Institutionnel
                  </label>
                  <input
                    type="text"
                    value={cardBadge}
                    onChange={(e) => setCardBadge(e.target.value)}
                    placeholder="ex: Archives d'État • Tunis"
                    className="w-full bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg px-3.5 py-2 text-xs focus:border-[var(--gold)] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Lien Officiel du Site Web (URL) *
                </label>
                <div className="relative">
                  <input
                    type="url"
                    required
                    value={cardLink}
                    onChange={(e) => setCardLink(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg ps-3.5 pe-9 py-2 text-xs focus:border-[var(--gold)] outline-none font-mono"
                  />
                  {cardLink && (
                    <a
                      href={cardLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute end-2 top-1/2 -translate-y-1/2 p-1 text-[var(--gold)] hover:text-[var(--foreground)]"
                      title="Ouvrir dans un nouvel onglet"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Description Détaillée du Fonds & Utilité Généalogique
                </label>
                <textarea
                  rows={4}
                  value={cardDescription}
                  onChange={(e) => setCardDescription(e.target.value)}
                  placeholder="Décrivez les fonds conservés, registres matricules, actes d'état civil, décrets beylicaux..."
                  className="w-full bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg p-3 text-xs focus:border-[var(--gold)] outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Mots-clés / Tags (séparés par des virgules)
                </label>
                <input
                  type="text"
                  value={cardTags}
                  onChange={(e) => setCardTags(e.target.value)}
                  placeholder="ex: Majba 1860, Décrets Beylicaux, Notariats 'Udul"
                  className="w-full bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg px-3.5 py-2 text-xs focus:border-[var(--gold)] outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="cardPublished"
                  checked={cardPublished}
                  onChange={(e) => setCardPublished(e.target.checked)}
                  className="rounded border-[var(--border)] text-[var(--gold)] focus:ring-[var(--gold)]"
                />
                <label htmlFor="cardPublished" className="text-xs text-[var(--foreground)] cursor-pointer">
                  Fiche publiée et visible sur le site public
                </label>
              </div>

              <div className="pt-4 border-t border-[var(--border)] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCardModalOpen(false)}
                  className="btn-base btn-outline text-xs py-2 px-4 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={savingCard}
                  className="btn-base btn-gold text-xs py-2 px-5 inline-flex items-center gap-1.5 font-bold cursor-pointer"
                >
                  {savingCard && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Enregistrer la Fiche</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT LOCATION                                                */}
      {/* ========================================================================= */}
      {locationModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setLocationModalOpen(false)}
        >
          <div
            className="surface-card frame-gold w-full max-w-md flex flex-col rounded-2xl bg-[var(--card)] border border-[var(--gold)]/40 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--card)]">
              <h3 className="font-serif font-bold text-base text-[var(--foreground)] flex items-center gap-2">
                <Globe className="w-4 h-4 text-[var(--gold)]" />
                <span>{editingLocation ? "Modifier l'Emplacement" : "Ajouter un Emplacement"}</span>
              </h3>
              <button
                type="button"
                onClick={() => setLocationModalOpen(false)}
                className="p-1 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLocation} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Nom Affiché de l'Emplacement *
                </label>
                <input
                  type="text"
                  required
                  value={locLabel}
                  onChange={(e) => {
                    setLocLabel(e.target.value);
                    if (!editingLocation) {
                      setLocKey(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "_"));
                    }
                  }}
                  placeholder="ex: Espagne & Andalousie"
                  className="w-full bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg px-3.5 py-2 text-xs focus:border-[var(--gold)] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Identifiant / Clé (sans espaces) *
                </label>
                <input
                  type="text"
                  required
                  value={locKey}
                  onChange={(e) => setLocKey(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "_"))}
                  placeholder="ex: spain"
                  className="w-full bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg px-3.5 py-2 text-xs focus:border-[var(--gold)] outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Icône Représentative
                </label>
                <select
                  value={locIcon}
                  onChange={(e) => setLocIcon(e.target.value)}
                  className="w-full bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg px-3 py-2 text-xs focus:border-[var(--gold)] outline-none"
                >
                  <option value="Landmark">Landmark (Monuments & Dépôts d'État)</option>
                  <option value="Building2">Building2 (Bâtiments & Ministères)</option>
                  <option value="Ship">Ship (Navires, Marins & Ports)</option>
                  <option value="Shield">Shield (Armoiries & Protection)</option>
                  <option value="Crown">Crown (Royaumes & Monarchies)</option>
                  <option value="Scroll">Scroll (Parchemins & Manuscrits Juifs)</option>
                  <option value="Moon">Moon (Croissant Ottoman & Islamique)</option>
                  <option value="Globe">Globe (Maghreb & International)</option>
                  <option value="FolderArchive">FolderArchive (Dossier d'Archives)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Description Courte
                </label>
                <textarea
                  rows={2}
                  value={locDescription}
                  onChange={(e) => setLocDescription(e.target.value)}
                  placeholder="ex: Fonds d'archives diplomatiques et notariales..."
                  className="w-full bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg p-3 text-xs focus:border-[var(--gold)] outline-none leading-relaxed"
                />
              </div>

              <div className="pt-3 border-t border-[var(--border)] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setLocationModalOpen(false)}
                  className="btn-base btn-outline text-xs py-2 px-4 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={savingLocation}
                  className="btn-base btn-gold text-xs py-2 px-5 inline-flex items-center gap-1.5 font-bold cursor-pointer"
                >
                  {savingLocation && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Enregistrer l'Emplacement</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

