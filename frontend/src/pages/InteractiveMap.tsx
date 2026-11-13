import { useState, useMemo, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  Popup,
  Polygon,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  Search,
  GitBranch,
  Archive,
  ArrowLeft,
  Layers,
  Compass,
  MapPin,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  X,
  Share2,
  ExternalLink,
  Landmark,
  Building2,
  Users,
  Scroll,
  RotateCcw,
  Crown,
  Lock,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  BookOpen,
  SlidersHorizontal,
  History,
  Scale,
  Maximize2,
  Map as MapIcon,
  HelpCircle,
  Clock,
  Eye,
  FileText,
  Sliders,
  Shield,
  Flag,
  Navigation,
  Globe,
} from "lucide-react";
import SEO from "../components/SEO";
import { useTranslation } from "../context/TranslationContext";
import { useAuth } from "../admin/components/AuthContext";
import {
  governorates,
  regionDossiers,
  REGIONS,
  REGION_LABEL_KEYS,
  OPEN_SOURCE_TILE_LAYERS,
  goldIcon,
  selectedIcon,
  type Governorate,
  type RegionId,
  type TileLayerKey,
} from "../components/TunisiaGovernoratesMap";
import {
  getWhereaboutsSquare,
  type TribalTerritory,
  type HistoricalEraExtended,
  type HistoricalEraSite,
  type EraAdministrativeDivision,
} from "../data/historicalMapData";
import { getLocalizedGovEnrichment } from "../data/govArchivalEnrichmentLocales";
import { getLocalizedTribes } from "../data/historicalMapLocales";
import { buildDefaultPeriodCards } from "../utils/periodsCmsConfig";

export type SidebarFunctionKey =
  | "dossier"
  | "archives"
  | "tribes"
  | "lineages"
  | "eras"
  | "tools";

// Smooth animated Map Fly Controller
function MapFlyController({
  coords,
  zoom,
  trigger,
}: {
  coords: [number, number];
  zoom: number;
  trigger?: number | string;
}) {
  const map = useMap();
  useEffect(() => {
    if (Number.isFinite(coords[0]) && Number.isFinite(coords[1])) {
      map.flyTo(coords, zoom, {
        duration: 1.5,
        easeLinearity: 0.25,
      });
    }
  }, [coords, zoom, trigger, map]);
  return null;
}

function getShortCapitalName(capital: string): string {
  const beforeParen = capital.split("(")[0].trim();
  return beforeParen || capital;
}

// Custom Leaflet Icons for Tribes and Historical Capitals
function createTribeIcon(
  name: string,
  arabicName: string,
  isSelected: boolean,
  color: string,
  showArabicSub: boolean,
  isRtl: boolean
) {
  return L.divIcon({
    className: "custom-tribe-pin",
    html: `
      <div dir="${isRtl ? "rtl" : "ltr"}" style="
        background: ${isSelected ? "#b81428" : color};
        color: #ffffff;
        padding: 3px 8px;
        border-radius: 9999px;
        border: 2px solid #ffffff;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.02em;
        white-space: nowrap;
        display: flex;
        align-items: center;
        gap: 4px;
        box-shadow: 0 4px 14px rgba(0,0,0,0.45);
        cursor: pointer;
        transform: translate(-50%, -50%) ${isSelected ? "scale(1.15)" : "scale(1)"};
        transition: transform 0.2s;
      ">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        <span>${name}</span>
        ${showArabicSub && arabicName ? `<span style="opacity: 0.85; font-size: 10px;">(${arabicName.split(" ")[0]})</span>` : ""}
      </div>
    `,
    iconSize: [120, 26],
    iconAnchor: [60, 13],
  });
}

function createEraSiteIcon(
  site: HistoricalEraSite,
  isCapital: boolean,
  isOttoman: boolean,
  capitalBadgeText: string,
  isRtl: boolean
) {
  const bg = isCapital ? (isOttoman ? "#b81428" : "#d97706") : "#1f2937";
  const iconSvg = isCapital
    ? '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fef08a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>'
    : '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><line x1="2" x2="22" y1="22" y2="22"/><line x1="12" x2="12" y1="2" y2="6"/><path d="m2 6 10-4 10 4v2H2z"/><path d="M4 10v9"/><path d="M8 10v9"/><path d="M16 10v9"/><path d="M20 10v9"/></svg>';
  return L.divIcon({
    className: "custom-era-pin",
    html: `
      <div dir="${isRtl ? "rtl" : "ltr"}" style="
        background: ${bg};
        color: #ffffff;
        padding: ${isCapital ? "4px 10px" : "3px 7px"};
        border-radius: 9999px;
        border: ${isCapital ? "2.5px solid #fef08a" : "2px solid #ffffff"};
        font-size: ${isCapital ? "12px" : "11px"};
        font-weight: 800;
        white-space: nowrap;
        display: flex;
        align-items: center;
        gap: 5px;
        box-shadow: 0 6px 18px rgba(0,0,0,0.5);
        cursor: pointer;
        transform: translate(-50%, -50%);
        ${isCapital ? "animation: pulse 2s infinite;" : ""}
      ">
        <span>${iconSvg}</span>
        <span>${site.name}</span>
        ${isCapital ? `<span style="background: #fef08a; color: #1e1b4b; padding: 1px 5px; border-radius: 6px; font-size: 9px; font-weight: 900;">${capitalBadgeText}</span>` : ""}
      </div>
    `,
    iconSize: [140, 30],
    iconAnchor: [70, 15],
  });
}

function createDivisionIcon(name: string, isSelected: boolean, isRtl: boolean) {
  return L.divIcon({
    className: "custom-division-pin",
    html: `
      <div dir="${isRtl ? "rtl" : "ltr"}" style="
        background: ${isSelected ? "#b81428" : "#854d0e"};
        color: #ffffff;
        padding: 3px 8px;
        border-radius: 9999px;
        border: ${isSelected ? "2px solid #fef08a" : "1.5px solid #ffffff"};
        font-size: 11px;
        font-weight: 700;
        white-space: nowrap;
        display: flex;
        align-items: center;
        gap: 4px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        cursor: pointer;
        transform: translate(-50%, -50%) ${isSelected ? "scale(1.15)" : "scale(1)"};
        transition: transform 0.2s;
      ">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><line x1="2" x2="22" y1="22" y2="22"/><line x1="12" x2="12" y1="2" y2="6"/><path d="m2 6 10-4 10 4v2H2z"/><path d="M4 10v9"/><path d="M8 10v9"/><path d="M16 10v9"/><path d="M20 10v9"/></svg>
        <span>${name}</span>
      </div>
    `,
    iconSize: [110, 24],
    iconAnchor: [55, 12],
  });
}

function createCityGovMarkerIcon(
  name: string,
  isSelected: boolean,
  isCapital: boolean,
  capitalBadgeText: string,
  isRtl: boolean
) {
  const bg = isSelected ? "#9f1239" : (isCapital ? "#925503" : "#1f160f");
  const borderColor = isSelected ? "#fef08a" : (isCapital ? "#d97706" : "#c69214");
  const iconSvg = isCapital
    ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fef08a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>'
    : '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#e8b84b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>';

  return L.divIcon({
    className: "custom-city-gov-pin",
    html: `
      <div dir="${isRtl ? "rtl" : "ltr"}" style="
        background: ${bg};
        color: #ffffff;
        padding: ${isSelected ? "4px 10px" : "3px 8px"};
        border-radius: 9999px;
        border: ${isSelected ? "2.5px solid #fef08a" : `1.5px solid ${borderColor}`};
        font-size: ${isSelected ? "12px" : "11px"};
        font-weight: 700;
        white-space: nowrap;
        display: flex;
        align-items: center;
        gap: 5px;
        box-shadow: 0 4px 14px rgba(0,0,0,0.45);
        cursor: pointer;
        transform: translate(-50%, -50%) ${isSelected ? "scale(1.15)" : "scale(1)"};
        transition: transform 0.2s;
      ">
        ${iconSvg}
        <span>${name}</span>
        ${isCapital ? `<span style="background: #fef08a; color: #1e1b4b; padding: 1px 4px; border-radius: 4px; font-size: 8px; font-weight: 900;">${capitalBadgeText}</span>` : ""}
      </div>
    `,
    iconSize: [120, 26],
    iconAnchor: [60, 13],
  });
}

export default function InteractiveMap() {
  const { t, isRtl, locale } = useTranslation();
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  const showArabicSub = !locale.toLowerCase().startsWith("ar");
  const capitalBadgeText = t("map_capital_badge", "CAPITALE");

  const tf = useCallback(
    (key: string, fallback: string, vars?: Record<string, string | number>) => {
      let text = t(key, fallback);
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          text = text.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
        }
      }
      return text;
    },
    [t]
  );

  const localizedEras = useMemo(() => buildDefaultPeriodCards(locale), [locale]);
  const localizedBaseTribes = useMemo(() => getLocalizedTribes(locale), [locale]);

  // Access validation: Available ONLY to Tier 1, Tier 2, Admins & Super Admins
  const normalizedRole = Number(user?.role);
  const isPlatformAdmin = isAdmin || normalizedRole === 1 || normalizedRole === 3;
  const userTierId = Number(user?.tier_id ?? (typeof user?.tier === "number" ? user?.tier : 1));
  const planSlug = String(user?.subscription_plan || user?.tier || "").toLowerCase();
  const isPaidPlan =
    planSlug.includes("premium") ||
    planSlug.includes("historian") ||
    planSlug.includes("chercheur") ||
    planSlug.includes("pro");
  const hasPaidAccess = isPlatformAdmin || userTierId >= 2 || isPaidPlan;

  // Selected State
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeRegion, setActiveRegion] = useState<RegionId>("all_tunisia");
  const [tileStyle, setTileStyle] = useState<TileLayerKey>("osm");
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);

  // Big Retractable Sidebars Layout (Left Explorer + Right Dossier)
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);

  // Explorer Mode: "regions" | "governorates" | "tribes" | "eras"
  const [explorerMode, setExplorerMode] = useState<"regions" | "governorates" | "tribes" | "eras">("regions");

  // Selected Tribe State
  const [selectedTribeId, setSelectedTribeId] = useState<string | null>(null);

  // Selected Historical Era State (defaults to null, or e.g. "ottomane")
  const [selectedEraId, setSelectedEraId] = useState<string | null>(null);

  // Selected Era-Specific Administrative Division (Caïdat / Koura / Outan / Curia)
  const [selectedDivisionId, setSelectedDivisionId] = useState<string | null>(null);

  // Toggle Visibility of Historical Overlays
  const [showDevletEmpire, setShowDevletEmpire] = useState<boolean>(true);
  const [showCountryBorders, setShowCountryBorders] = useState<boolean>(true);

  // Right Sidebar Tab: "archives" | "lineages" | "tribes" | "monuments"
  // Distinct tabs for each context to completely eliminate repetition
  const [govDossierTab, setGovDossierTab] = useState<"archives" | "lineages" | "monuments">("archives");
  const [globalDossierTab, setGlobalDossierTab] = useState<"overview" | "national_archives" | "guide">("overview");
  const [eraDossierTab, setEraDossierTab] = useState<"state" | "notables" | "territories" | "archives">("state");

  // Dynamic Map Target (Coords & Zoom)
  const [flyTarget, setFlyTarget] = useState<{ coords: [number, number]; zoom: number; trigger: number }>({
    coords: [34.4, 9.6],
    zoom: 6.5,
    trigger: 1,
  });

  // URL Params on Mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const govParam = params.get("gov") || params.get("q");
    const regionParam = params.get("region");
    const tribeParam = params.get("tribu") || params.get("tribe");
    const eraParam = params.get("era") || params.get("epoque");

    if (govParam) {
      const match = governorates.find(
        (g) => g.id.toLowerCase() === govParam.toLowerCase()
      );
      if (match) {
        setSelectedId(match.id);
        setActiveRegion(match.region);
        setExplorerMode("governorates");
        setIsRightSidebarOpen(true);
        if (match.coords) {
          setFlyTarget({ coords: match.coords, zoom: 9, trigger: Date.now() });
        }
      }
    }
    if (regionParam && (REGIONS as string[]).includes(regionParam)) {
      setActiveRegion(regionParam as RegionId);
      setExplorerMode("regions");
    }
    if (tribeParam) {
      const matchTribe = localizedBaseTribes.find((t) => t.id.toLowerCase() === tribeParam.toLowerCase());
      if (matchTribe) {
        setSelectedTribeId(matchTribe.id);
        setExplorerMode("tribes");
        setIsRightSidebarOpen(true);
        setFlyTarget({ coords: matchTribe.center, zoom: matchTribe.zoom, trigger: Date.now() });
      }
    }
    if (eraParam) {
      const matchEra = localizedEras.find((e) => e.id.toLowerCase() === eraParam.toLowerCase());
      if (matchEra) {
        setSelectedEraId(matchEra.id);
        setExplorerMode("eras");
        setIsRightSidebarOpen(true);
        setFlyTarget({ coords: matchEra.overviewCenter, zoom: matchEra.overviewZoom, trigger: Date.now() });
      }
    }
  }, [localizedBaseTribes, localizedEras]);

  const activeDossier = useMemo(() => {
    return regionDossiers[activeRegion] || regionDossiers.all_tunisia;
  }, [activeRegion]);

  const selectedGov = useMemo(() => {
    if (!selectedId) return null;
    return governorates.find((g) => g.id === selectedId) || null;
  }, [selectedId]);

  const selectedGovEnrichment = useMemo(() => {
    if (!selectedGov) return null;
    return getLocalizedGovEnrichment(selectedGov.id, locale);
  }, [selectedGov, locale]);

  // Keep dossierTab for backward compatibility
  const dossierTab = selectedGov ? govDossierTab : globalDossierTab;
  const setDossierTab = (val: any) => {
    if (selectedGov) setGovDossierTab(val);
    else setGlobalDossierTab(val);
  };

  const selectedEra = useMemo(() => {
    if (!selectedEraId) return null;
    return localizedEras.find((e) => e.id === selectedEraId) || null;
  }, [selectedEraId, localizedEras]);

  // Dynamic Era-Specific Tribes list (changes when era changes)
  const currentTribesList = useMemo(() => {
    if (selectedEra?.eraTribes && selectedEra.eraTribes.length > 0) {
      return selectedEra.eraTribes;
    }
    return localizedBaseTribes;
  }, [selectedEra, localizedBaseTribes]);

  const selectedTribe = useMemo(() => {
    if (!selectedTribeId) return null;
    return currentTribesList.find((t) => t.id === selectedTribeId) || localizedBaseTribes.find((t) => t.id === selectedTribeId) || null;
  }, [selectedTribeId, currentTribesList, localizedBaseTribes]);

  // Main whereabouts square of the selected tribe
  const selectedTribeSquare = useMemo(() => {
    if (!selectedTribe) return null;
    return selectedTribe.whereaboutsSquare || getWhereaboutsSquare(selectedTribe.polygon);
  }, [selectedTribe]);

  // Dynamic Era-Specific Administrative Divisions (Caïdats / Kouras / Outans / Curiae)
  const currentDivisions = useMemo(() => {
    return selectedEra?.administrativeDivisions || [];
  }, [selectedEra]);

  const selectedDivision = useMemo(() => {
    if (!selectedDivisionId || !selectedEra) return null;
    return currentDivisions.find((d) => d.id === selectedDivisionId) || null;
  }, [selectedDivisionId, selectedEra, currentDivisions]);

  // Active tribes for the selected region (or all 16 confederations)
  const activeDisplayTribes = useMemo(() => {
    if (activeRegion === "all_tunisia" || !activeDossier?.governorates) return currentTribesList;
    const govIdsInRegion = activeDossier.governorates;
    const filtered = currentTribesList.filter((tr) =>
      (tr.governorates || []).some((g) => govIdsInRegion.includes(g))
    );
    return filtered.length > 0 ? filtered : currentTribesList;
  }, [activeRegion, currentTribesList, activeDossier]);

  const formatRegionLabel = (reg: RegionId) => t(REGION_LABEL_KEYS[reg]);
  const formatGovName = (govId: string) => t(`gov_name_${govId}`);
  const formatFamName = (famKey: string) => t(`fam_${famKey}`);

  // Filtered Governorates list
  const filteredGovernorates = useMemo(() => {
    let list =
      activeRegion === "all_tunisia"
        ? governorates
        : governorates.filter((g) => g.region === activeRegion);

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter((g) => {
        const govLabel = formatGovName(g.id).toLowerCase();
        const rawId = g.id.toLowerCase();
        const families = g.notableFamilies.map((f) => formatFamName(f).toLowerCase());
        const enrichment = getLocalizedGovEnrichment(g.id, locale);
        const enrichmentText = enrichment
          ? `${enrichment.tribes} ${enrichment.jurisdiction} ${enrichment.census} ${enrichment.chefLieu} ${enrichment.caidatHistorique}`.toLowerCase()
          : "";

        return (
          govLabel.includes(q) ||
          rawId.includes(q) ||
          families.some((f) => f.includes(q)) ||
          enrichmentText.includes(q)
        );
      });
    }
    return list;
  }, [activeRegion, searchQuery, t, locale]);

  // Filtered Tribes list (respecting current active epoch)
  const filteredTribes = useMemo(() => {
    if (!searchQuery.trim()) return currentTribesList;
    const q = searchQuery.trim().toLowerCase();
    return currentTribesList.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.arabicName.includes(q) ||
        t.caidat1881?.toLowerCase().includes(q) ||
        t.capital.toLowerCase().includes(q) ||
        t.fractions.some((f) => f.toLowerCase().includes(q))
    );
  }, [searchQuery, currentTribesList]);

  // Handle Selections
  const handleRegionClick = (reg: RegionId) => {
    setActiveRegion(reg);
    setSelectedId(null);
    setSelectedTribeId(null);
    setSelectedDivisionId(null);
    setSelectedEraId(null);
    setIsRightSidebarOpen(true);
    const govs = governorates.filter((g) => reg === "all_tunisia" || g.region === reg);
    const valid = govs.filter((g) => Number.isFinite(g.coords?.[0]));
    if (valid.length && reg !== "all_tunisia") {
      const avgLat = valid.reduce((acc, g) => acc + g.coords[0], 0) / valid.length;
      const avgLng = valid.reduce((acc, g) => acc + g.coords[1], 0) / valid.length;
      setFlyTarget({ coords: [avgLat, avgLng], zoom: 7.5, trigger: Date.now() });
    } else {
      setFlyTarget({ coords: [34.4, 9.6], zoom: 6.5, trigger: Date.now() });
    }
  };

  const handleGovSelect = (gov: Governorate) => {
    setSelectedId(gov.id);
    setActiveRegion(gov.region);
    setSelectedTribeId(null);
    setSelectedDivisionId(null);
    setSelectedEraId(null);
    setIsRightSidebarOpen(true);
    if (gov.coords) {
      setFlyTarget({ coords: gov.coords, zoom: 9.5, trigger: Date.now() });
    }
  };

  const handleTribeSelect = (tribe: TribalTerritory) => {
    setSelectedTribeId(tribe.id);
    setSelectedId(null);
    setSelectedDivisionId(null);
    setIsRightSidebarOpen(true);
    // Center smoothly on the tribe's whereabouts square center
    const square = tribe.whereaboutsSquare || getWhereaboutsSquare(tribe.polygon);
    const centerLat = (square[0][0] + square[2][0]) / 2;
    const centerLng = (square[0][1] + square[2][1]) / 2;
    setFlyTarget({ coords: [centerLat, centerLng], zoom: tribe.zoom || 9, trigger: Date.now() });
  };

  const handleDivisionSelect = (division: EraAdministrativeDivision) => {
    setSelectedDivisionId(division.id);
    setSelectedTribeId(null);
    setSelectedId(null);
    setIsRightSidebarOpen(true);
    setFlyTarget({ coords: division.coords, zoom: 10, trigger: Date.now() });
  };

  const handleEraSelect = (era: HistoricalEraExtended) => {
    if (selectedEraId === era.id) {
      // Toggle off
      setSelectedEraId(null);
      setSelectedDivisionId(null);
      setSelectedTribeId(null);
      setFlyTarget({ coords: [34.4, 9.6], zoom: 6.5, trigger: Date.now() });
    } else {
      setSelectedEraId(era.id);
      setSelectedDivisionId(null);
      setSelectedTribeId(null);
      setSelectedId(null);
      setIsRightSidebarOpen(true);
      setFlyTarget({ coords: era.overviewCenter, zoom: era.overviewZoom, trigger: Date.now() });
    }
  };

  const handleZoomToCapital = useCallback((era: HistoricalEraExtended) => {
    setFlyTarget({ coords: era.capitalCoords, zoom: 12.5, trigger: Date.now() });
  }, []);

  const handleResetView = () => {
    setSelectedId(null);
    setSelectedTribeId(null);
    setSelectedDivisionId(null);
    setSelectedEraId(null);
    setActiveRegion("all_tunisia");
    setSearchQuery("");
    setFlyTarget({ coords: [34.4, 9.6], zoom: 6.5, trigger: Date.now() });
  };

  const handleShare = () => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (selectedGov) {
      url.searchParams.set("gov", selectedGov.id);
    } else {
      url.searchParams.delete("gov");
    }
    if (selectedTribeId) {
      url.searchParams.set("tribu", selectedTribeId);
    } else {
      url.searchParams.delete("tribu");
    }
    if (selectedEraId) {
      url.searchParams.set("era", selectedEraId);
    } else {
      url.searchParams.delete("era");
    }
    url.searchParams.set("region", activeRegion);
    url.searchParams.set("mode", explorerMode);
    navigator.clipboard.writeText(url.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentLayer = OPEN_SOURCE_TILE_LAYERS[tileStyle] || OPEN_SOURCE_TILE_LAYERS.osm;

  const vipBadgeText = isPlatformAdmin
    ? t("map_vip_badge_admin", "Administration")
    : userTierId >= 3 || planSlug.includes("historian") || planSlug.includes("pro")
    ? t("map_vip_badge_tier2", "Membre Historien (Palier 2)")
    : t("map_vip_badge_tier1", "Membre Chercheur (Palier 1)");

  // =========================================================================
  // PAYWALL VIEW: FREEMIUM & GUEST USERS (Preserved Access Gate)
  // =========================================================================
  if (!loading && !hasPaidAccess) {
    return (
      <div
        dir={isRtl ? "rtl" : "ltr"}
        className="relative flex flex-col items-center justify-center min-h-[calc(100vh-68px)] w-full overflow-hidden bg-[var(--background)] px-4 py-12"
      >
        <SEO
          title={t("seo_map_title", "Carte Interactive des 24 Gouvernorats — Réservé aux Abonnés")}
          description={t(
            "seo_map_desc",
            "Atlas généalogique et archivistique des 24 gouvernorats de Tunisie, réservé aux membres abonnés et administrateurs."
          )}
        />

        {/* Blurred Map Background Teaser */}
        <div className="absolute inset-0 z-0 opacity-20 filter blur-sm pointer-events-none scale-105">
          <MapContainer
            center={[34.4, 9.6]}
            zoom={6.5}
            zoomControl={false}
            scrollWheelZoom={false}
            dragging={false}
            attributionControl={false}
            className="h-full w-full"
            style={{ background: "#e8e0d0" }}
          >
            <TileLayer url={OPEN_SOURCE_TILE_LAYERS.osm.url} />
            {governorates.map((gov) => (
              <Marker key={gov.id} position={gov.coords} icon={goldIcon} />
            ))}
          </MapContainer>
        </div>

        {/* Floating Luxury Paywall Card */}
        <div className="relative z-10 w-full max-w-2xl rounded-3xl border-2 border-[var(--gold)]/50 bg-[var(--card)]/95 p-6 sm:p-10 shadow-2xl backdrop-blur-xl text-center space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-[var(--gold)] bg-gradient-to-br from-[var(--gold)]/30 to-[var(--gold)]/10 text-[var(--gold)] shadow-lg shadow-[var(--gold)]/20 animate-pulse">
            <Crown className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--foreground)] tracking-tight">
              {t("map_access_locked_title", "Atlas Archivistique & Carte Interactive — Accès Réservé")}
            </h1>
            <p className="text-xs sm:text-sm text-[var(--muted-foreground)] max-w-lg mx-auto leading-relaxed font-medium">
              {t(
                "map_access_locked_subtitle",
                "Explorez en immersion les 24 gouvernorats avec leurs séries notariales beylicales, cotes de l'ANT et lignées notables. Réservé aux membres des Paliers 1 & 2 et administrateurs."
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-start pt-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 rounded-xl border border-[var(--gold)]/25 bg-[var(--background)]/60 p-3 shadow-sm"
              >
                <CheckCircle2 className="h-4 w-4 text-[var(--gold)] shrink-0 mt-0.5" />
                <span className="text-xs text-[var(--foreground)] font-semibold leading-snug">
                  {t(`map_access_benefit_${i}`)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/subscriptions"
              className="btn-base btn-gold w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold shadow-xl shadow-[var(--gold)]/25 inline-flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
            >
              <Crown className="h-4 w-4" />
              <span>{t("map_access_locked_cta", "S'abonner au Palier Chercheur ou Historien")}</span>
            </Link>
            {!user ? (
              <Link
                to="/login"
                className="btn-base btn-outline-ink w-full sm:w-auto px-6 py-3.5 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-2"
              >
                <span>{t("map_access_locked_login", "Déjà abonné ? Se connecter")}</span>
              </Link>
            ) : null}
          </div>

          <div className="pt-2 border-t border-[var(--gold)]/20">
            <Link
              to="/#map"
              className="text-xs text-[var(--muted-foreground)] hover:text-[var(--gold)] transition-colors inline-flex items-center gap-1.5"
            >
              <ArrowLeft className={`h-3.5 w-3.5 ${isRtl ? "rotate-180" : ""}`} />
              <span>{t("map_access_locked_explore_home", "Explorer la section d'aperçu gratuite sur la page d'accueil")}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // MAIN REDESIGNED ATLAS: SINGLE SLIM HEADER + BIG RETRACTABLE LEFT SIDEBAR
  // + FULL CENTER MAP CANVAS + RETRACTABLE RIGHT DOSSIER (REVERSES ON RTL)
  // =========================================================================
  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="relative flex flex-col h-[calc(100vh-68px)] w-full overflow-hidden bg-[var(--background)]"
    >
      <SEO
        title={t("seo_map_unlocked_title", "Carte Interactive des 24 Gouvernorats & Tribus — Roots Tunisia")}
        description={t(
          "seo_map_unlocked_desc",
          "Atlas généalogique, tribal et archivistique de Tunisie : 24 gouvernorats, 16 confédérations tribales, et époques historiques punique, romaine et ottomane."
        )}
      />

      {/* ===================================================================== */}
      {/* 1. SINGLE SLENDER MINIMAL TOP BAR (NO MULTIPLE BANDEAUX)              */}
      {/* ===================================================================== */}
      <header className="relative z-30 shrink-0 border-b border-[var(--gold)]/30 bg-[var(--card)]/95 backdrop-blur-md px-3 sm:px-5 py-2 shadow-sm flex items-center justify-between gap-2.5">
        {/* Left / Start: Breadcrumb, Title & VIP Badge */}
        <div className="flex items-center gap-2 min-w-0">
          <Link
            to="/"
            className="text-xs font-semibold text-[var(--muted-foreground)] hover:text-[var(--gold)] flex items-center gap-1 transition-colors shrink-0"
            title={t("nav_home", "Accueil")}
          >
            <ArrowLeft className={`h-3.5 w-3.5 ${isRtl ? "rotate-180" : ""}`} />
            <span className="hidden sm:inline">{t("nav_home", "Accueil")}</span>
          </Link>
          <span className="text-[var(--gold)]/40 text-xs shrink-0">/</span>
          <div className="flex items-center gap-1.5 min-w-0">
            <Compass className="h-4 w-4 text-[var(--gold)] shrink-0" />
            <h1 className="font-display text-xs sm:text-sm font-extrabold text-[var(--foreground)] tracking-wide truncate">
              {t("map_atlas_title", "Atlas Archivistique & Carte Interactive")}
            </h1>
          </div>
          <span className="hidden md:inline-flex rounded-full border border-[var(--gold)]/50 bg-[var(--gold)]/15 px-2 py-0.5 text-[0.62rem] font-bold text-[var(--gold)] items-center gap-1 shrink-0">
            <ShieldCheck className="h-3 w-3" />
            <span>{vipBadgeText}</span>
          </span>
        </div>

        {/* Right / End: Clean Retract Toggles & Actions */}
        <div className="flex items-center gap-1.5 shrink-0 ms-auto">
          {/* Toggle Left Sidebar Button */}
          <button
            type="button"
            onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
            className={`px-2.5 py-1 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isLeftSidebarOpen
                ? "border-[var(--gold)] bg-[var(--gold)]/20 text-[var(--gold)] shadow-xs"
                : "border-[var(--border)] text-[var(--foreground)] hover:border-[var(--gold)] hover:bg-[var(--gold)]/10"
            }`}
            title={
              isLeftSidebarOpen
                ? t("map_nav_retract_title", "Replier le volet d'exploration")
                : t("map_nav_expand_title", "Déplier le volet d'exploration")
            }
          >
            {isLeftSidebarOpen ? (
              <PanelLeftClose className={`h-3.5 w-3.5 ${isRtl ? "scale-x-[-1]" : ""}`} />
            ) : (
              <PanelLeftOpen className={`h-3.5 w-3.5 ${isRtl ? "scale-x-[-1]" : ""}`} />
            )}
            <span className="hidden sm:inline">
              {isLeftSidebarOpen
                ? t("map_nav_hide_filters", "Masquer Filtres")
                : t("map_nav_explore", "Explorer")}
            </span>
          </button>

          {/* Toggle Right Dossier Sidebar Button */}
          <button
            type="button"
            onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
            className={`px-2.5 py-1 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isRightSidebarOpen
                ? "border-[var(--gold)] bg-[var(--gold)]/20 text-[var(--gold)] shadow-xs"
                : "border-[var(--border)] text-[var(--foreground)] hover:border-[var(--gold)] hover:bg-[var(--gold)]/10"
            }`}
            title={
              isRightSidebarOpen
                ? t("map_dossier_retract_title", "Replier le dossier archivistique")
                : t("map_dossier_expand_title", "Déplier le dossier archivistique")
            }
          >
            {isRightSidebarOpen ? (
              <PanelRightClose className={`h-3.5 w-3.5 ${isRtl ? "scale-x-[-1]" : ""}`} />
            ) : (
              <PanelRightOpen className={`h-3.5 w-3.5 ${isRtl ? "scale-x-[-1]" : ""}`} />
            )}
            <span className="hidden sm:inline">
              {isRightSidebarOpen
                ? t("map_hide_dossier", "Masquer Dossier")
                : t("map_dossier_short", "Dossier")}
            </span>
          </button>

          {/* Reset View */}
          {(selectedId || selectedTribeId || selectedEraId || activeRegion !== "all_tunisia" || searchQuery) && (
            <button
              type="button"
              onClick={handleResetView}
              className="btn-base btn-outline-ink text-xs px-2.5 py-1 rounded-xl inline-flex items-center gap-1"
              title={t("map_reset_view_title", "Réinitialiser l'affichage")}
            >
              <RotateCcw className="h-3 w-3" />
              <span className="hidden lg:inline">{t("map_reset_short", "Réinitialiser")}</span>
            </button>
          )}

          {/* Share Direct Link */}
          <button
            type="button"
            onClick={handleShare}
            className="btn-base btn-gold text-xs px-2.5 py-1 rounded-xl inline-flex items-center gap-1"
            title={t("map_share_title", "Copier le lien direct vers cette vue")}
          >
            <Share2 className="h-3 w-3" />
            <span className="hidden md:inline">
              {copied ? t("map_share_copied", "Copié !") : t("map_share_short", "Partager")}
            </span>
          </button>
        </div>
      </header>

      {/* ===================================================================== */}
      {/* 2. MAIN 3-COLUMN WORKSPACE: LEFT SIDEBAR + MAP CANVAS + RIGHT SIDEBAR */}
      {/* On RTL, flex-row naturally puts Child 1 on the RIGHT and Child 3 on LEFT! */}
      {/* ===================================================================== */}
      <div className="relative flex-1 flex flex-row w-full h-full overflow-hidden">
        
        {/* =================================================================== */}
        {/* A. BIG RETRACTABLE SIDEBAR ON THE LEFT (Start)                      */}
        {/* =================================================================== */}
        <aside
          className={`shrink-0 h-full border-e border-[var(--gold)]/30 bg-[var(--card)]/98 backdrop-blur-md transition-all duration-300 ease-in-out flex flex-col z-20 shadow-xl ${
            isLeftSidebarOpen
              ? "w-80 sm:w-96 md:w-[390px]"
              : "w-0 overflow-hidden border-none pointer-events-none"
          }`}
        >
          {/* Sidebar Top: Title + Search + Close Handle */}
          <div className="p-3 sm:p-4 border-b border-[var(--gold)]/20 shrink-0 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Compass className="h-4 w-4 text-[var(--gold)]" />
                <h2 className="font-display text-sm font-bold text-[var(--foreground)]">
                  {t("map_explorer_title", "Navigation & Territoires")}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsLeftSidebarOpen(false)}
                className="p-1 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--gold)]/10 transition cursor-pointer"
                title={t("map_explorer_collapse", "Replier le volet")}
              >
                {isRtl ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </button>
            </div>

            {/* Live Search Input */}
            <div className="relative w-full">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--muted-foreground)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("map_explorer_search_placeholder", "Région, gouvernorat, tribu, caïdat…")}
                className="w-full rounded-xl border border-[var(--gold)]/30 bg-[var(--background)] ps-9 pe-7 py-1.5 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)] shadow-inner transition-colors"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute end-2.5 top-1/2 -translate-y-1/2 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              ) : null}
            </div>

            {/* 4-Mode Segmented Selector: [ Régions ] | [ 24 Gouv. / Divisions ] | [ Tribus ] | [ Époques ] */}
            <div className="grid grid-cols-4 gap-1 rounded-xl border border-[var(--gold)]/25 bg-[var(--background)] p-1 text-center">
              {[
                { id: "regions", icon: Compass, label: t("map_mode_regions", "Régions") },
                {
                  id: "governorates",
                  icon: Landmark,
                  label: selectedEra
                    ? tf("map_mode_divisions_count", "Divisions ({count})", { count: currentDivisions.length })
                    : t("map_mode_govs_short", "24 Gouv."),
                },
                {
                  id: "tribes",
                  icon: Shield,
                  label: tf("map_mode_tribes_count", "Tribus ({count})", { count: currentTribesList.length }),
                },
                {
                  id: "eras",
                  icon: Clock,
                  label: tf("map_mode_eras_12", "Époques ({count})", { count: localizedEras.length }),
                },
              ].map((m) => {
                const Icon = m.icon;
                const isActive = explorerMode === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setExplorerMode(m.id as any)}
                    className={`py-1.5 px-1 rounded-lg text-[0.65rem] font-bold transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                      isActive
                        ? "bg-[var(--gold)] text-[#1f160f] shadow-sm font-extrabold"
                        : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    <Icon className="h-3 w-3 shrink-0" />
                    <span className="truncate">{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sidebar Body: Dynamic Scrollable Explorer Content */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 text-start">
            
            {/* VIEW 1: REGIONS (8) */}
            {explorerMode === "regions" && (
              <div className="space-y-2 animate-in fade-in duration-200">
                {/* Master All Tunisia Card */}
                <button
                  type="button"
                  onClick={() => handleRegionClick("all_tunisia")}
                  className={`w-full p-2.5 rounded-xl border text-start transition-all cursor-pointer flex items-center justify-between ${
                    activeRegion === "all_tunisia" && !selectedId
                      ? "bg-[var(--gold)]/20 border-[var(--gold)] shadow-sm text-[var(--gold)] font-bold"
                      : "bg-[var(--background)]/70 border-[var(--gold)]/20 hover:border-[var(--gold)]/50 text-[var(--foreground)]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[var(--gold)]/20 text-[var(--gold)] flex items-center justify-center font-bold text-xs">
                      {t("map_country_code_tn", "TN")}
                    </div>
                    <div>
                      <div className="text-xs font-bold leading-tight">
                        {t("map_all_tunisia_title", "Toute la Tunisie")}
                      </div>
                      <div className="text-[10px] text-[var(--muted-foreground)]">
                        {t("map_all_tunisia_subtitle", "24 Gouvernorats · Vue globale")}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--gold)]/15 text-[var(--gold)] font-bold">
                    24
                  </span>
                </button>

                {/* Regional Cards */}
                {REGIONS.filter((r) => r !== "all_tunisia").map((reg) => {
                  const isActive = activeRegion === reg && !selectedId && !selectedTribeId && !selectedEraId;
                  const memberGovs = governorates.filter((g) => g.region === reg);

                  return (
                    <div
                      key={reg}
                      className={`rounded-xl border transition-all ${
                        isActive
                          ? "bg-[var(--gold)]/10 border-[var(--gold)] shadow-sm"
                          : "bg-[var(--background)]/60 border-[var(--gold)]/15 hover:border-[var(--gold)]/40"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => handleRegionClick(reg)}
                        className="w-full p-2.5 text-start cursor-pointer flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[var(--foreground)] leading-tight">
                              {formatRegionLabel(reg)}
                            </span>
                            {isActive && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-[var(--gold)] text-[#1f160f] font-extrabold uppercase">
                                {t("map_badge_active", "Actif")}
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-[var(--muted-foreground)] truncate mt-0.5">
                            {memberGovs.length} {t("governorates_count", "gouvernorats")}
                          </div>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--gold)]/15 text-[var(--gold)] font-bold shrink-0">
                          {memberGovs.length}
                        </span>
                      </button>

                      {/* Expandable Member Governorates */}
                      {isActive && (
                        <div className="px-2.5 pb-2.5 pt-1 border-t border-[var(--gold)]/15 flex flex-wrap gap-1.5">
                          {memberGovs.map((mg) => (
                            <button
                              key={mg.id}
                              type="button"
                              onClick={() => handleGovSelect(mg)}
                              className="px-2 py-1 rounded-lg text-[0.68rem] font-semibold bg-[var(--card)] text-[var(--foreground)] border border-[var(--gold)]/25 hover:border-[var(--gold)] transition cursor-pointer flex items-center gap-1"
                            >
                              <span>{formatGovName(mg.id)}</span>
                              <span className="text-[9px] opacity-75 font-mono">({mg.population})</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* VIEW 2: GOUVERNORATS OU DIVISIONS HISTORIQUES D'ÉPOQUE */}
            {explorerMode === "governorates" && (
              <div className="space-y-1.5 animate-in fade-in duration-200">
                {selectedEra && currentDivisions.length > 0 ? (
                  <>
                    <div className="rounded-xl border border-[var(--gold)]/30 bg-[var(--gold)]/10 p-2.5 text-xs text-[var(--foreground)] leading-snug">
                      <span className="font-bold text-[var(--gold)]">
                        {tf("map_era_divisions_intro_label", "Divisions territoriales d'époque ({period}) :", {
                          period: selectedEra.displayPeriod,
                        })}{" "}
                      </span>
                      {tf(
                        "map_era_divisions_intro_desc",
                        "Circonscriptions d'autorité sous {entity} (Caïdats makhzen, Kouras ou Outans).",
                        { entity: selectedEra.tunisiaEntityName }
                      )}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[var(--muted-foreground)] px-1 pb-1">
                      <span>
                        {tf("map_divisions_listed_count", "{count} divisions répertoriées", {
                          count: currentDivisions.length,
                        })}
                      </span>
                      {selectedDivisionId && (
                        <button
                          type="button"
                          onClick={() => setSelectedDivisionId(null)}
                          className="text-[var(--gold)] hover:underline font-bold"
                        >
                          {t("map_deselect", "Désélectionner")}
                        </button>
                      )}
                    </div>
                    {currentDivisions.map((div) => {
                      const isSelected = selectedDivisionId === div.id;
                      return (
                        <button
                          key={div.id}
                          type="button"
                          onClick={() => handleDivisionSelect(div)}
                          className={`w-full p-2.5 rounded-xl border text-start transition-all cursor-pointer flex items-center justify-between gap-3 ${
                            isSelected
                              ? "bg-[#b81428] !text-white border-[#b81428] shadow-md scale-[1.01]"
                              : "bg-[var(--background)]/70 border-[var(--gold)]/20 hover:border-[var(--gold)] hover:bg-[var(--gold)]/10 text-[var(--foreground)]"
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <Landmark className={`h-3.5 w-3.5 shrink-0 ${isSelected ? "text-amber-200" : "text-[var(--gold)]"}`} />
                              <span className="text-xs font-bold leading-tight truncate">
                                {div.name}
                              </span>
                              {showArabicSub && div.arabicName && (
                                <span className={`text-[10px] font-arabic ${isSelected ? "text-amber-200" : "text-[var(--gold)]"}`}>
                                  ({div.arabicName})
                                </span>
                              )}
                            </div>
                            <div className={`text-[10px] truncate mt-0.5 ${isSelected ? "text-rose-100" : "text-[var(--muted-foreground)]"}`}>
                              {t("map_seat_prefix", "Siège :")} {div.chefLieu || div.seat} · {div.description}
                            </div>
                          </div>
                          <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full shrink-0 font-bold ${
                            isSelected ? "bg-white/20 text-white" : "bg-[var(--gold)]/15 text-[var(--gold)]"
                          }`}>
                            {(div.historicalTribes || []).length > 0
                              ? tf("map_tribes_count_badge", "{count} tribus", {
                                  count: div.historicalTribes?.length || 0,
                                })
                              : t("map_division_badge", "Division")}
                          </span>
                        </button>
                      );
                    })}
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between text-[11px] text-[var(--muted-foreground)] px-1 pb-1">
                      <span>
                        {tf("map_govs_found_count", "{count} gouvernorats trouvés", {
                          count: filteredGovernorates.length,
                        })}
                      </span>
                      {selectedGov && (
                        <button
                          type="button"
                          onClick={() => setSelectedId(null)}
                          className="text-[var(--gold)] hover:underline font-bold"
                        >
                          {t("map_deselect", "Désélectionner")}
                        </button>
                      )}
                    </div>

                    {filteredGovernorates.map((gov) => {
                      const isSelected = selectedId === gov.id;
                      const enrichment = getLocalizedGovEnrichment(gov.id, locale);
                      const govLabel = formatGovName(gov.id);

                      return (
                        <button
                          key={gov.id}
                          type="button"
                          onClick={() => handleGovSelect(gov)}
                          className={`w-full p-2.5 rounded-xl border text-start transition-all cursor-pointer flex items-center justify-between gap-3 ${
                            isSelected
                              ? "bg-[#b81428] !text-white border-[#b81428] shadow-md scale-[1.01]"
                              : "bg-[var(--background)]/70 border-[var(--gold)]/20 hover:border-[var(--gold)] hover:bg-[var(--gold)]/10 text-[var(--foreground)]"
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <MapPin className={`h-3.5 w-3.5 shrink-0 ${isSelected ? "text-amber-200" : "text-[var(--gold)]"}`} />
                              <span className="text-xs font-bold leading-tight truncate">
                                {govLabel}
                              </span>
                            </div>
                            <div className={`text-[10px] truncate mt-0.5 ${isSelected ? "text-rose-100" : "text-[var(--muted-foreground)]"}`}>
                              {enrichment?.caidatHistorique || formatRegionLabel(gov.region)} · {enrichment?.chefLieu || t("map_country_tunisia", "Tunisie")}
                            </div>
                          </div>

                          <div className="text-end shrink-0">
                            <span className={`text-[10px] font-mono font-bold block ${isSelected ? "text-amber-200" : "text-[var(--gold)]"}`}>
                              {gov.population}
                            </span>
                            <span className={`text-[9px] block ${isSelected ? "text-white/80" : "text-[var(--muted-foreground)]"}`}>
                              {t("map_hab_short", "hab.")}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </>
                )}
              </div>
            )}

            {/* VIEW 3: TRIBUS & CAÏDATS (CONFÉDÉRATIONS D'ÉPOQUE) */}
            {explorerMode === "tribes" && (
              <div className="space-y-2 animate-in fade-in duration-200">
                <div className="rounded-xl border border-[var(--gold)]/25 bg-[var(--gold)]/10 p-2.5 text-xs text-[var(--foreground)] leading-snug">
                  <span className="font-bold text-[var(--gold)]">
                    {selectedEra
                      ? tf("map_tribes_era_header", "Tribus sous l'époque : {title}", {
                          title: selectedEra.title,
                        })
                      : t("map_tribes_default_header", "Territoires tribaux & confédérations :")}
                  </span>{" "}
                  {t(
                    "map_tribes_help_desc",
                    "Cliquez sur une tribu pour afficher son carré d'implantation principal et son foyer sur la carte."
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] text-[var(--muted-foreground)] px-1 pb-1">
                  <span>
                    {tf("map_tribes_shown_count", "{count} tribus affichées", {
                      count: filteredTribes.length,
                    })}
                  </span>
                  {selectedTribeId && (
                    <button
                      type="button"
                      onClick={() => setSelectedTribeId(null)}
                      className="text-[var(--gold)] hover:underline font-bold"
                    >
                      {t("map_deselect", "Désélectionner")}
                    </button>
                  )}
                </div>

                <div className="space-y-1.5">
                  {filteredTribes.map((tribe) => {
                    const isSelected = selectedTribeId === tribe.id;
                    return (
                      <button
                        key={tribe.id}
                        type="button"
                        onClick={() => handleTribeSelect(tribe)}
                        className={`w-full p-2.5 rounded-xl border text-start transition-all cursor-pointer flex items-center justify-between gap-2 ${
                          isSelected
                            ? "bg-[#b81428] !text-white border-[#b81428] shadow-md scale-[1.01]"
                            : "bg-[var(--background)]/70 border-[var(--gold)]/20 hover:border-[var(--gold)] hover:bg-[var(--gold)]/10 text-[var(--foreground)]"
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <Shield className={`h-3.5 w-3.5 shrink-0 ${isSelected ? "text-amber-200" : "text-[var(--gold)]"}`} />
                            <span className="text-xs font-bold leading-tight truncate">
                              {tribe.name}
                            </span>
                            {showArabicSub && tribe.arabicName && (
                              <span className={`text-[10px] font-arabic ${isSelected ? "text-white/90" : "text-[var(--gold)]"}`}>
                                ({tribe.arabicName})
                              </span>
                            )}
                          </div>
                          <div className={`text-[10px] truncate mt-0.5 ${isSelected ? "text-rose-100" : "text-[var(--muted-foreground)]"}`}>
                            {tribe.capital} · {tribe.caidat1881}
                          </div>
                        </div>

                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full shrink-0 font-bold ${
                          isSelected ? "bg-white/20 text-white" : "bg-[var(--gold)]/15 text-[var(--gold)]"
                        }`}>
                          {tf("map_clans_count", "{count} clans", {
                            count: tribe.fractions.length,
                          })}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* VIEW 4: ÉPOQUES HISTORIQUES AVEC FRONTIÈRES D'ÉPOQUE */}
            {explorerMode === "eras" && (
              <div className="space-y-2 animate-in fade-in duration-200">
                <div className="rounded-xl border border-[var(--gold)]/25 bg-[var(--gold)]/10 p-2.5 text-xs text-[var(--foreground)] leading-snug">
                  <span className="font-bold text-[var(--gold)]">
                    {t("map_eras_intro_title", "Cartographie chronologique :")}{" "}
                  </span>
                  {t(
                    "map_eras_intro_desc",
                    "Sélectionnez une époque pour tracer les frontières historiques et localiser la capitale."
                  )}
                </div>

                <div className="space-y-2">
                  {localizedEras.map((era) => {
                    const isActive = selectedEraId === era.id;

                    return (
                      <div
                        key={era.id}
                        className={`rounded-xl border transition-all ${
                          isActive
                            ? "bg-[var(--gold)]/15 border-[var(--gold)] shadow-md"
                            : "bg-[var(--background)]/70 border-[var(--gold)]/15 hover:border-[var(--gold)]/40"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => handleEraSelect(era)}
                          className="w-full p-3 text-start cursor-pointer space-y-1"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-[var(--foreground)]">
                              {era.title}
                            </span>
                            {isActive && (
                              <span className="text-[9px] px-2 py-0.5 rounded bg-[var(--gold)] text-[#1f160f] font-extrabold uppercase">
                                {t("map_era_displayed", "Affichée")}
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] font-semibold text-[var(--gold)]">
                            {era.displayPeriod} · {era.empire}
                          </div>
                          <p className="text-[10px] text-[var(--muted-foreground)] leading-snug line-clamp-2">
                            {era.description}
                          </p>
                        </button>

                        {/* Quick Auto-Zoom Button for Ottoman Tunis and Key Capitals */}
                        {isActive && (
                          <div className="px-3 pb-3 pt-1 border-t border-[var(--gold)]/15 flex items-center justify-between gap-2">
                            <span className="text-[10px] text-[var(--foreground)] font-medium">
                              {t("map_capital_prefix", "Capitale :")} <b>{era.capital}</b>
                            </span>
                            <button
                              type="button"
                              onClick={() => handleZoomToCapital(era)}
                              className="btn-base btn-gold text-[0.65rem] py-1 px-2.5 font-bold inline-flex items-center gap-1 shadow-sm"
                              title={tf("map_zoom_title", "Zoomer automatiquement sur {capital}", {
                                capital: era.capital,
                              })}
                            >
                              <Navigation className="h-3 w-3" />
                              <span>
                                {tf("map_zoom_on_capital", "Zoomer sur {capital}", {
                                  capital: getShortCapitalName(era.capital),
                                })}
                              </span>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Left Sidebar Footer: Map Style Selector */}
          <div className="p-2.5 border-t border-[var(--gold)]/20 shrink-0 bg-[var(--background)]/60">
            <div className="flex items-center justify-between text-[10px] font-semibold text-[var(--muted-foreground)] mb-1 px-1">
              <span className="flex items-center gap-1">
                <Layers className="h-3 w-3 text-[var(--gold)]" />
                <span>{t("map_tile_style_label", "Style de la Carte")}</span>
              </span>
              <span className="font-mono text-[var(--gold)] uppercase">{t(currentLayer.labelKey)}</span>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {(Object.keys(OPEN_SOURCE_TILE_LAYERS) as TileLayerKey[]).map((key) => {
                const layer = OPEN_SOURCE_TILE_LAYERS[key];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTileStyle(key)}
                    className={`py-1 px-1 rounded-lg text-[0.62rem] font-bold uppercase transition-all cursor-pointer text-center truncate ${
                      tileStyle === key
                        ? "bg-[var(--gold)] text-[#1f160f] font-extrabold shadow-xs"
                        : "bg-[var(--card)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] border border-[var(--border)]"
                    }`}
                  >
                    {t(layer.labelKey)}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Floating Edge Pill to re-open Left Sidebar if closed */}
        {!isLeftSidebarOpen && (
          <button
            type="button"
            onClick={() => setIsLeftSidebarOpen(true)}
            className="absolute top-3 start-3 z-30 btn-base btn-gold shadow-2xl px-3 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 hover:scale-105 transition-all"
            title={t("map_reopen_explorer_title", "Ouvrir la navigation et les filtres")}
          >
            <PanelLeftOpen className={`h-4 w-4 ${isRtl ? "scale-x-[-1]" : ""}`} />
            <span>{t("map_nav_explore", "Explorer")}</span>
          </button>
        )}

        {/* =================================================================== */}
        {/* B. CENTER: EXPANSIVE LEAFLET INTERACTIVE MAP CANVAS                 */}
        {/* =================================================================== */}
        <main className="relative flex-1 h-full w-full overflow-hidden z-0">
          
          {/* FLOATING ACTION NOTIFICATION: WHEN ERA OR TRIBE IS ACTIVE */}
          {selectedEra && (
            <div className="absolute top-3 start-1/2 -translate-x-1/2 z-[400] max-w-xl w-[92%] surface-card frame-gold p-2.5 sm:p-3 rounded-2xl shadow-2xl bg-[var(--card)]/95 backdrop-blur-md flex flex-wrap items-center justify-between gap-2 border border-[var(--gold)]/40 animate-in fade-in duration-200">
              <div className="min-w-0 text-start">
                <div className="text-[10px] text-[var(--gold)] font-bold uppercase tracking-wider">
                  {selectedEra.displayPeriod} · {selectedEra.empire}
                </div>
                <div className="text-xs font-bold text-[var(--foreground)] truncate">
                  {selectedEra.title}
                  {showArabicSub && selectedEra.arabicTitle ? ` (${selectedEra.arabicTitle})` : ""}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                {/* Toggle Devlet Empire Bounds */}
                {selectedEra.outerEmpirePolygon && (
                  <button
                    type="button"
                    onClick={() => setShowDevletEmpire(!showDevletEmpire)}
                    className={`text-[0.65rem] py-1 px-2 rounded-lg font-bold transition-all cursor-pointer border ${
                      showDevletEmpire
                        ? "bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-500/40"
                        : "bg-[var(--background)] text-[var(--muted-foreground)] border-[var(--border)]"
                    }`}
                    title={t("map_devlet_toggle_title", "Afficher / Masquer l'étendue de l'Empire / Devlet")}
                  >
                    <Globe className="h-3 w-3 inline me-1" />
                    <span>
                      {showDevletEmpire
                        ? t("map_devlet_active", "Devlet Actif")
                        : t("map_devlet_hidden", "Devlet Caché")}
                    </span>
                  </button>
                )}

                {/* Toggle Country Borders */}
                <button
                  type="button"
                  onClick={() => setShowCountryBorders(!showCountryBorders)}
                  className={`text-[0.65rem] py-1 px-2 rounded-lg font-bold transition-all cursor-pointer border ${
                    showCountryBorders
                      ? "bg-rose-500/20 text-rose-800 dark:text-rose-300 border-rose-500/40"
                      : "bg-[var(--background)] text-[var(--muted-foreground)] border-[var(--border)]"
                  }`}
                  title={t("map_borders_toggle_title", "Afficher / Masquer les frontières de la Tunisie à cette époque")}
                >
                    <Flag className="h-3 w-3 inline me-1" />
                    <span>
                      {showCountryBorders
                        ? t("map_tunisia_active", "Tunisie Active")
                        : t("map_tunisia_hidden", "Tunisie Cachée")}
                    </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleZoomToCapital(selectedEra)}
                  className="btn-base btn-gold text-[0.65rem] py-1 px-2.5 font-bold inline-flex items-center gap-1 shadow-sm"
                  title={tf("map_zoom_capital_direct_title", "Zoomer directement sur la capitale : {capital}", {
                    capital: selectedEra.capital,
                  })}
                >
                  <Navigation className="h-3 w-3" />
                  <span>{getShortCapitalName(selectedEra.capital)}</span>
                </button>

                <Link
                  to={`/periods/${selectedEra.id}`}
                  className="btn-base btn-outline-ink text-[0.65rem] py-1 px-2 font-bold inline-flex items-center gap-1"
                  title={t("map_era_full_dossier_title", "Ouvrir le dossier historique complet et les archives liées")}
                >
                  <BookOpen className="h-3 w-3 text-[var(--gold)]" />
                  <span className="hidden sm:inline">{t("map_dossier_short", "Dossier")}</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setSelectedEraId(null)}
                  className="p-1 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--gold)]/10"
                  title={t("map_close_era_view_title", "Fermer la vue d'époque")}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {selectedTribe && (
            <div className="absolute top-3 start-1/2 -translate-x-1/2 z-[400] max-w-md w-[90%] surface-card frame-gold p-2.5 sm:p-3 rounded-2xl shadow-2xl bg-[var(--card)]/95 backdrop-blur-md flex items-center justify-between gap-2 border border-[var(--gold)]/40 animate-in fade-in duration-200">
              <div className="min-w-0 text-start">
                <div className="flex items-center gap-1.5 text-[10px] text-[var(--gold)] font-bold uppercase tracking-wider">
                  <span>{t("map_whereabouts_banner_title", "Carré & Foyer Tribal Délimité")}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                </div>
                <div className="text-xs font-bold text-[var(--foreground)] truncate">
                  {selectedTribe.name}
                  {showArabicSub && selectedTribe.arabicName ? ` (${selectedTribe.arabicName})` : ""} · {selectedTribe.capital}
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    const square = selectedTribeSquare;
                    if (square) {
                      const centerLat = (square[0][0] + square[2][0]) / 2;
                      const centerLng = (square[0][1] + square[2][1]) / 2;
                      setFlyTarget({ coords: [centerLat, centerLng], zoom: selectedTribe.zoom || 9.5, trigger: Date.now() });
                    }
                  }}
                  className="btn-base btn-gold text-[0.65rem] py-1 px-2 font-bold inline-flex items-center gap-1"
                  title={t("map_recenter_square_title", "Recentrer sur le carré du foyer tribal")}
                >
                  <Navigation className="h-3 w-3" />
                  <span>{t("map_recenter_short", "Recentrer")}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTribeId(null)}
                  className="p-1 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  title={t("map_close_selection_title", "Fermer la sélection")}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          <MapContainer
            center={[34.4, 9.6]}
            zoom={6.5}
            scrollWheelZoom={true}
            zoomControl={false}
            attributionControl={false}
            className="h-full w-full"
            style={{ background: "#e8e0d0" }}
          >
            <MapFlyController
              coords={flyTarget.coords}
              zoom={flyTarget.zoom}
              trigger={flyTarget.trigger}
            />
            
            <TileLayer
              key={currentLayer.id}
              url={currentLayer.url}
              maxZoom={18}
            />

            {/* =============================================================== */}
            {/* 1. HISTORICAL ERA BORDERS & OUTER EMPIRE POLYGONS               */}
            {/* =============================================================== */}
            {selectedEra && selectedEra.outerEmpirePolygon && showDevletEmpire && (
              <Polygon
                positions={selectedEra.outerEmpirePolygon}
                pathOptions={{
                  color: "#d97706",
                  fillColor: "#f59e0b",
                  fillOpacity: 0.08,
                  weight: 2.5,
                  dashArray: "6, 6",
                }}
              >
                <Tooltip sticky>
                  <div dir={isRtl ? "rtl" : "ltr"} className="text-start font-sans">
                    <div className="font-extrabold text-xs text-[#b45309]">
                      {selectedEra.devletName}
                    </div>
                    <div className="text-[10px] text-[#78350f]">
                      {tf("map_devlet_extent_period", "Étendue générale de l'Empire / Califat ({period})", {
                        period: selectedEra.displayPeriod,
                      })}
                    </div>
                  </div>
                </Tooltip>
              </Polygon>
            )}

            {selectedEra && showCountryBorders && (
              <Polygon
                positions={selectedEra.borderPolygon}
                pathOptions={{
                  color: selectedEra.borderColor,
                  fillColor: selectedEra.fillColor,
                  fillOpacity: 0.28,
                  weight: 3.5,
                }}
              >
                <Tooltip sticky>
                  <div dir={isRtl ? "rtl" : "ltr"} className="text-start font-sans">
                    <div className="font-extrabold text-xs text-[#9f1239]">
                      {selectedEra.tunisiaEntityName}
                    </div>
                    <div className="text-[10px] text-[#881337]">
                      {selectedEra.title} ({selectedEra.displayPeriod})
                    </div>
                  </div>
                </Tooltip>
              </Polygon>
            )}

            {/* Historical Era Key Sites & Capitals Markers */}
            {selectedEra &&
              selectedEra.keySites.map((site) => {
                const isCapital = site.coords[0] === selectedEra.capitalCoords[0] && site.coords[1] === selectedEra.capitalCoords[1];
                const isOttoman = selectedEra.id === "ottomane";
                return (
                  <Marker
                    key={site.name}
                    position={site.coords}
                    icon={createEraSiteIcon(site, isCapital, isOttoman, capitalBadgeText, isRtl)}
                    eventHandlers={{
                      click: () => {
                        setFlyTarget({ coords: site.coords, zoom: site.zoomLevel || 12, trigger: Date.now() });
                      },
                    }}
                  >
                    <Popup>
                      <div dir={isRtl ? "rtl" : "ltr"} className="p-1 max-w-[220px] text-start space-y-1">
                        <div className="font-bold text-sm text-[#9f1239]">{site.name}</div>
                        {showArabicSub && site.arabicName && (
                          <div className="text-xs font-arabic text-[#b8860b]">{site.arabicName}</div>
                        )}
                        <p className="text-xs text-[#2b2118]">{site.role}</p>
                        <button
                          type="button"
                          onClick={() => setFlyTarget({ coords: site.coords, zoom: site.zoomLevel || 13, trigger: Date.now() })}
                          className="w-full btn-base btn-gold text-[0.65rem] py-1 font-bold mt-1"
                        >
                          {t("map_zoom_site_btn", "Zoomer sur ce site")}
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}

            {/* Historical Era Administrative Divisions Markers */}
            {selectedEra &&
              currentDivisions.map((div) => {
                const isSelected = selectedDivisionId === div.id;
                return (
                  <Marker
                    key={`div-marker-${div.id}`}
                    position={div.coords}
                    icon={createDivisionIcon(div.name, isSelected, isRtl)}
                    eventHandlers={{
                      click: () => handleDivisionSelect(div),
                    }}
                  >
                    <Tooltip direction="top" offset={[0, -10]}>
                      <div dir={isRtl ? "rtl" : "ltr"} className="text-start font-sans">
                        <div className="font-bold text-xs text-[#9f1239]">{div.name}</div>
                        {showArabicSub && div.arabicName && (
                          <div className="text-[10px] font-arabic text-[#b45309]">{div.arabicName}</div>
                        )}
                        <div className="text-[9px] text-[#4b5563]">
                          {t("map_cheflieu_prefix", "Chef-lieu :")} {div.chefLieu || div.seat}
                        </div>
                      </div>
                    </Tooltip>
                  </Marker>
                );
              })}

            {/* =============================================================== */}
            {/* 2. TRIBAL HOMELAND TERRITORY POLYGONS & PINS                    */}
            {/* =============================================================== */}
            {explorerMode === "tribes" &&
              currentTribesList.map((tribe) => {
                const isSelected = selectedTribeId === tribe.id;
                return (
                  <Polygon
                    key={tribe.id}
                    positions={tribe.polygon}
                    pathOptions={{
                      color: isSelected ? "#b81428" : tribe.color,
                      fillColor: isSelected ? "#b81428" : tribe.color,
                      fillOpacity: isSelected ? 0.45 : 0.22,
                      weight: isSelected ? 3.5 : 2,
                    }}
                    eventHandlers={{
                      click: () => handleTribeSelect(tribe),
                    }}
                  >
                    <Tooltip sticky>
                      <div dir={isRtl ? "rtl" : "ltr"} className="text-start">
                        <div className="font-bold text-xs text-[#1e1610]">
                          {t("map_tribe_prefix", "Tribu")} {tribe.name}
                          {showArabicSub && tribe.arabicName ? ` (${tribe.arabicName})` : ""}
                        </div>
                        <div className="text-[10px] text-[#5c4938]">{tribe.caidat1881}</div>
                      </div>
                    </Tooltip>
                  </Polygon>
                );
              })}

            {/* =============================================================== */}
            {/* 2B. TRIBAL MAIN WHEREABOUTS SQUARE (ON TRIBE SELECTION)          */}
            {/* =============================================================== */}
            {selectedTribe && selectedTribeSquare && (
              <Polygon
                positions={selectedTribeSquare}
                pathOptions={{
                  color: "#f59e0b",
                  fillColor: "#fbbf24",
                  fillOpacity: 0.28,
                  weight: 3.5,
                  dashArray: "8, 6",
                }}
              >
                <Tooltip permanent direction="top" offset={[0, -20]}>
                  <div dir={isRtl ? "rtl" : "ltr"} className="text-center font-sans p-1">
                    <div className="font-extrabold text-[10px] text-[#78350f] uppercase tracking-wider">
                      {t("map_whereabouts_tooltip_title", "Foyer & Implantation Tribale")}
                    </div>
                    <div className="font-bold text-xs text-[#b45309]">
                      {selectedTribe.name}
                      {showArabicSub && selectedTribe.arabicName ? ` (${selectedTribe.arabicName})` : ""}
                    </div>
                    <div className="text-[9px] text-[#92400e]">
                      {selectedTribe.capital} · {selectedTribe.caidat1881}
                    </div>
                  </div>
                </Tooltip>
              </Polygon>
            )}

            {explorerMode === "tribes" &&
              currentTribesList.map((tribe) => {
                const isSelected = selectedTribeId === tribe.id;
                return (
                  <Marker
                    key={`pin-${tribe.id}`}
                    position={tribe.center}
                    icon={createTribeIcon(tribe.name, tribe.arabicName, isSelected, tribe.color, showArabicSub, isRtl)}
                    eventHandlers={{
                      click: () => handleTribeSelect(tribe),
                    }}
                  />
                );
              })}

            {/* =============================================================== */}
            {/* 3. STANDARD 24 GOUVERNORATS PINS (WHEN NOT IN ERA MODE)         */}
            {/* =============================================================== */}
            {!selectedEra &&
              filteredGovernorates.map((gov) => {
                const [glat, glng] = gov.coords || [NaN, NaN];
                if (!Number.isFinite(glat) || !Number.isFinite(glng)) return null;
                const isSelected = selectedId === gov.id;
                const govLabel = formatGovName(gov.id);
                const enrichment = getLocalizedGovEnrichment(gov.id, locale);

                return (
                  <Marker
                    key={gov.id}
                    position={[glat, glng]}
                    icon={createCityGovMarkerIcon(govLabel, isSelected, gov.id === "tunis", capitalBadgeText, isRtl)}
                    eventHandlers={{
                      click: () => handleGovSelect(gov),
                    }}
                  >
                    <Tooltip direction="top" offset={[0, -10]}>
                      <span
                        dir={isRtl ? "rtl" : "ltr"}
                        className="font-display font-bold text-sm !text-[#1e1610]"
                      >
                        {govLabel}
                      </span>
                    </Tooltip>
                    <Popup>
                      <div
                        dir={isRtl ? "rtl" : "ltr"}
                        className="p-1.5 max-w-[250px] !text-[#1e1610] text-start space-y-1.5"
                      >
                        <div className="flex items-center justify-between border-b border-[#e8d5b5] pb-1">
                          <div className="flex items-center gap-1.5">
                            <Building2 className="w-4 h-4 text-[#9f1239] shrink-0" />
                            <h4 className="font-display font-bold text-base !text-[#9f1239]">
                              {govLabel}
                            </h4>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-[#b8860b]">
                            <Users className="w-3 h-3 text-[#b8860b]" />
                            <span>{gov.population}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-[#5c4938] leading-tight">
                          <History className="w-3 h-3 text-[#b8860b] shrink-0" />
                          <span>{enrichment?.caidatHistorique || formatRegionLabel(gov.region)}</span>
                        </div>
                        <p className="text-xs !text-[#2b2118] leading-relaxed line-clamp-3">
                          {t(`gov_desc_${gov.id}`)}
                        </p>
                        <button
                          onClick={() => handleGovSelect(gov)}
                          className="mt-2 w-full btn-base btn-gold text-[0.65rem] py-1 font-bold cursor-pointer"
                        >
                          {t("map_inspect_full_dossier", "Inspecter le dossier complet")}
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
          </MapContainer>

          {/* Map Attribution Tag */}
          <div className="pointer-events-none absolute bottom-2 end-2 z-[400] rounded bg-black/70 px-2 py-0.5 text-[0.62rem] font-semibold !text-white">
            © {t(currentLayer.labelKey)}
          </div>
        </main>

        {/* Floating Edge Pill to re-open Right Sidebar if closed */}
        {!isRightSidebarOpen && (
          <button
            type="button"
            onClick={() => setIsRightSidebarOpen(true)}
            className="absolute top-3 end-3 z-30 btn-base btn-gold shadow-2xl px-3 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 hover:scale-105 transition-all"
            title={t("map_reopen_dossier_title", "Ouvrir le dossier archivistique")}
          >
            <PanelRightOpen className={`h-4 w-4 ${isRtl ? "scale-x-[-1]" : ""}`} />
            <span>
              {selectedGov
                ? formatGovName(selectedGov.id)
                : selectedTribe
                ? selectedTribe.name
                : selectedEra
                ? selectedEra.title
                : t("map_dossier_short", "Dossier")}
            </span>
          </button>
        )}

        {/* =================================================================== */}
        {/* C. RETRACTABLE SIDEBAR TO THE RIGHT (End)                           */}
        {/* =================================================================== */}
        <aside
          className={`shrink-0 h-full border-s border-[var(--gold)]/30 bg-[var(--card)]/98 backdrop-blur-md transition-all duration-300 ease-in-out flex flex-col z-20 shadow-xl ${
            isRightSidebarOpen
              ? "w-80 sm:w-96 md:w-[420px]"
              : "w-0 overflow-hidden border-none pointer-events-none"
          }`}
        >
          {/* Right Sidebar Header */}
          <div className="p-3 sm:p-4 border-b border-[var(--gold)]/20 shrink-0 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Landmark className="h-4 w-4 text-[var(--gold)] shrink-0" />
                <div className="min-w-0 text-start">
                  <div className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-wider font-semibold">
                    {selectedDivision
                      ? t("map_ctx_division_eyebrow", "Division Territoriale Historique")
                      : selectedEra
                      ? t("map_ctx_era_eyebrow", "Période Historique & Empire")
                      : selectedTribe
                      ? t("map_ctx_tribe_eyebrow", "Fiche Tribale & Caïdat 1881")
                      : selectedGov
                      ? formatRegionLabel(selectedGov.region)
                      : t("map_ctx_global_eyebrow", "Dossier Territoire & Archives")}
                  </div>
                  <h2 className="font-display text-sm sm:text-base font-bold text-[var(--foreground)] truncate leading-tight">
                    {selectedDivision
                      ? `${selectedDivision.name} (${selectedDivision.chefLieu || selectedDivision.seat})`
                      : selectedEra
                      ? selectedEra.title
                      : selectedTribe
                      ? showArabicSub && selectedTribe.arabicName
                        ? `${selectedTribe.name} (${selectedTribe.arabicName})`
                        : selectedTribe.name
                      : selectedGov
                      ? `${formatGovName(selectedGov.id)} (${selectedGov.population})`
                      : formatRegionLabel(activeRegion)}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {(selectedGov || selectedTribe || selectedEra || selectedDivision) && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedId(null);
                      setSelectedTribeId(null);
                      setSelectedDivisionId(null);
                      setSelectedEraId(null);
                    }}
                    className="p-1 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--gold)]/10 text-xs"
                    title={t("map_region_overview_title", "Vue générale")}
                  >
                    {t("map_region_overview_btn", "Vue Région")}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsRightSidebarOpen(false)}
                  className="p-1 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--gold)]/10 transition cursor-pointer"
                  title={t("map_retract_dossier_title", "Replier le dossier")}
                >
                  {isRtl ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* RIGHT SIDEBAR TABS: STRICTLY DIFFERENTIATED BY CONTEXT                   */}
            {/* ========================================================================= */}

            {/* CONTEXT 1: A SPECIFIC GOUVERNORAT IS SELECTED */}
            {selectedGov && !selectedTribe && !selectedDivision && (
              <div className="grid grid-cols-3 gap-1 rounded-xl border border-[var(--gold)]/25 bg-[var(--background)] p-1 text-center">
                {[
                  {
                    id: "archives",
                    icon: BookOpen,
                    label: t("map_gov_tab_archives", "Archives & Cotes"),
                    shortLabel: t("map_gov_tab_archives_short", "Archives"),
                  },
                  {
                    id: "lineages",
                    icon: Users,
                    label: t("map_gov_tab_lineages", "Lignées & Notables"),
                    shortLabel: t("map_gov_tab_lineages_short", "Lignées"),
                  },
                  {
                    id: "monuments",
                    icon: History,
                    label: t("map_gov_tab_monuments", "Histoire & Caïdat"),
                    shortLabel: t("map_gov_tab_monuments_short", "Histoire"),
                  },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = govDossierTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setGovDossierTab(tab.id as any)}
                      className={`py-1.5 px-1 rounded-lg text-[0.65rem] font-bold transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                        isActive
                          ? "bg-[var(--gold)] text-[#1f160f] shadow-sm font-extrabold"
                          : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                      }`}
                      title={tab.label}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{tab.shortLabel}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* CONTEXT 2: AN HISTORICAL ERA IS SELECTED */}
            {selectedEra && !selectedTribe && !selectedDivision && (
              <div className="grid grid-cols-4 gap-1 rounded-xl border border-[var(--gold)]/25 bg-[var(--background)] p-1 text-center">
                {[
                  {
                    id: "state",
                    icon: Crown,
                    label: t("map_era_tab_state", "État & Tunis"),
                    shortLabel: t("map_era_tab_state_short", "État"),
                  },
                  {
                    id: "notables",
                    icon: Users,
                    label: t("map_era_tab_notables", "Dirigeants & Familles"),
                    shortLabel: t("map_era_tab_notables_short", "Dirigeants"),
                  },
                  {
                    id: "territories",
                    icon: Landmark,
                    label: t("map_era_tab_territories", "Cités & Divisions"),
                    shortLabel: t("map_era_tab_territories_short", "Cités"),
                  },
                  {
                    id: "archives",
                    icon: BookOpen,
                    label: t("map_era_tab_archives", "Archives & Actes"),
                    shortLabel: t("map_era_tab_archives_short", "Archives"),
                  },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = eraDossierTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setEraDossierTab(tab.id as any)}
                      className={`py-1.5 px-0.5 rounded-lg text-[0.62rem] font-bold transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                        isActive
                          ? "bg-[var(--gold)] text-[#1f160f] shadow-sm font-extrabold"
                          : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                      }`}
                      title={tab.label}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{tab.shortLabel}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* CONTEXT 3: GLOBAL OVERVIEW (TOUTE LA TUNISIE / RÉGION) - ZERO REPETITION */}
            {!selectedGov && !selectedEra && !selectedTribe && !selectedDivision && (
              <div className="grid grid-cols-3 gap-1 rounded-xl border border-[var(--gold)]/25 bg-[var(--background)] p-1 text-center">
                {[
                  {
                    id: "overview",
                    icon: Landmark,
                    label: t("map_global_tab_overview", "Synthèse & Cadre"),
                    shortLabel: t("map_global_tab_overview_short", "Synthèse"),
                  },
                  {
                    id: "national_archives",
                    icon: BookOpen,
                    label: t("map_global_tab_archives", "Dépôts Nationaux (19)"),
                    shortLabel: t("map_global_tab_archives_short", "Dépôts"),
                  },
                  {
                    id: "guide",
                    icon: Compass,
                    label: t("map_global_tab_guide", "Méthode de Recherche"),
                    shortLabel: t("map_global_tab_guide_short", "Méthode"),
                  },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = globalDossierTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setGlobalDossierTab(tab.id as any)}
                      className={`py-1.5 px-1 rounded-lg text-[0.65rem] font-bold transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                        isActive
                          ? "bg-[var(--gold)] text-[#1f160f] shadow-sm font-extrabold"
                          : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                      }`}
                      title={tab.label}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{tab.shortLabel}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Sidebar Body: Scrollable Dossier Content */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3.5 text-start">
            
            {/* ================================================================= */}
            {/* CASE 0: HISTORICAL ADMINISTRATIVE DIVISION DOSSIER               */}
            {/* ================================================================= */}
            {selectedDivision ? (
              <div className="space-y-3.5 animate-in fade-in duration-200">
                <div className="rounded-xl border border-[var(--gold)]/30 bg-[var(--gold)]/10 p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[var(--gold)]">
                    <span className="flex items-center gap-1.5">
                      <Landmark className="h-4 w-4" />
                      <span>{t("map_div_card_badge", "Circonscription Territoriale Historique")}</span>
                    </span>
                    {showArabicSub && selectedDivision.arabicName && (
                      <span className="text-sm font-arabic font-extrabold">{selectedDivision.arabicName}</span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-[var(--foreground)]">{selectedDivision.name}</h3>
                  <p className="text-xs text-[var(--foreground)] leading-relaxed">
                    {tf(
                      "map_div_summary",
                      "Circonscription d'autorité sous {entity}, ayant pour chef-lieu {seat}.",
                      {
                        entity: selectedEra?.tunisiaEntityName || t("map_div_fallback_entity", "l'entité tunisienne"),
                        seat: selectedDivision.chefLieu || selectedDivision.seat,
                      }
                    )}
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-[var(--gold)]/20 bg-[var(--background)]/60 space-y-1">
                  <div className="text-[10px] font-bold text-[var(--gold)] uppercase">
                    {t("map_div_jurisdiction_label", "Régime Juridique & Compétence")}
                  </div>
                  <p className="text-xs text-[var(--foreground)] leading-relaxed">{selectedDivision.description}</p>
                </div>

                {(selectedDivision.historicalTribes || []).length > 0 && (
                  <div className="space-y-2">
                    <div className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider">
                      {tf("map_div_tribes_count", "Tribus & Populations rattachées ({count})", {
                        count: (selectedDivision.historicalTribes || []).length,
                      })}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedDivision.historicalTribes?.map((tr, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-[var(--gold)]/15 text-[var(--foreground)] border border-[var(--gold)]/30"
                        >
                          {tr}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {(selectedDivision.archivalNotes || selectedDivision.archivalType) && (
                  <div className="p-3 rounded-xl border border-[var(--gold)]/20 bg-[var(--background)]/40 space-y-1">
                    <div className="text-[10px] font-bold text-[var(--gold)] uppercase">
                      {t("map_div_sources_label", "Sources d'Archives & Sijills")}
                    </div>
                    <p className="text-xs text-[var(--foreground)] leading-relaxed">
                      {selectedDivision.archivalNotes || selectedDivision.archivalType}
                    </p>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedDivisionId(null)}
                    className="btn-base btn-outline-ink w-full py-2 text-xs font-bold"
                  >
                    {t("map_back_to_era_btn", "Retour au Dossier de l'Époque")}
                  </button>
                </div>
              </div>
            ) : selectedEra ? (
              /* ================================================================= */
              /* CASE 1: HISTORICAL ERA DOSSIER (STREAMLINED, ZERO REPETITION)     */
              /* ================================================================= */
              <div className="space-y-3.5 animate-in fade-in duration-200">
                
                {/* VOLLET 1: ÉTAT & TUNIS */}
                {eraDossierTab === "state" && (
                  <div className="space-y-3.5 animate-in fade-in duration-200">
                    <div className="rounded-xl border border-[var(--gold)]/30 bg-[var(--gold)]/10 p-3 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-[var(--gold)]">
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          <span>{selectedEra.displayPeriod}</span>
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--gold)]/20 font-extrabold text-[var(--foreground)]">
                          {selectedEra.empire}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-[var(--foreground)]">
                        {selectedEra.title}
                        {showArabicSub && selectedEra.arabicTitle ? ` (${selectedEra.arabicTitle})` : ""}
                      </h3>
                      <div className="text-[11px] font-semibold text-[var(--gold)] flex items-center gap-1.5">
                        <Crown className="h-3.5 w-3.5" />
                        <span>
                          {tf("map_era_devlet_suzerain", "Devlet Suzerain : {devlet}", {
                            devlet: selectedEra.devletName,
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--foreground)] leading-relaxed">
                        {selectedEra.description}
                      </p>
                    </div>

                    {/* Capital Highlight & Quick Zoom */}
                    <div className="p-3 rounded-xl border border-[var(--gold)]/25 bg-[var(--background)]/80 flex items-center justify-between gap-3 shadow-xs">
                      <div>
                        <div className="text-[10px] font-bold text-[var(--gold)] uppercase">
                          {t("map_era_capital_label", "Capitale de l'époque")}
                        </div>
                        <div className="text-xs font-bold text-[var(--foreground)]">{selectedEra.capital}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleZoomToCapital(selectedEra)}
                        className="btn-base btn-gold text-xs py-1.5 px-3 font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Navigation className="h-3.5 w-3.5" />
                        <span>
                          {tf("map_zoom_on_capital", "Zoomer sur {capital}", {
                            capital: getShortCapitalName(selectedEra.capital),
                          })}
                        </span>
                      </button>
                    </div>

                    {/* Role & Influence of Tunis */}
                    {selectedEra.tunisRole && (
                      <div className="p-3.5 rounded-xl border border-[var(--gold)]/30 bg-[var(--gold)]/10 space-y-1.5">
                        <div className="flex items-center gap-2 text-xs font-bold text-[var(--gold)]">
                          <Landmark className="h-4 w-4 shrink-0" />
                          <span>{t("map_era_tunis_role_title", "Rôle & Rayonnement de Tunis sous cette Époque")}</span>
                        </div>
                        <p className="text-xs text-[var(--foreground)] leading-relaxed">
                          {selectedEra.tunisRole}
                        </p>
                      </div>
                    )}

                    {/* Treaties and Boundaries */}
                    <div className="p-3 rounded-xl border border-[var(--gold)]/20 bg-[var(--background)]/50 space-y-1">
                      <div className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase">
                        {t("map_era_treaties_title", "Frontières & Traités Historiques")}
                      </div>
                      <p className="text-xs text-[var(--foreground)] leading-relaxed">
                        {selectedEra.treatiesAndBorders}
                      </p>
                    </div>
                  </div>
                )}

                {/* VOLLET 2: DIRIGEANTS & FAMILLES (MERGED TO AVOID MULTIPLE REDUNDANT TABS) */}
                {eraDossierTab === "notables" && (
                  <div className="space-y-3.5 animate-in fade-in duration-200">
                    {/* Notable Leaders */}
                    {(selectedEra.notableLeaders || []).length > 0 && (
                      <div className="space-y-2">
                        <div className="text-[10px] font-bold text-[var(--gold)] uppercase tracking-wider flex items-center gap-1.5">
                          <Crown className="h-3.5 w-3.5 text-[var(--gold)]" />
                          <span>
                            {tf("map_era_leaders_count", "Souverains & Dirigeants Majeurs ({count})", {
                              count: (selectedEra.notableLeaders || []).length,
                            })}
                          </span>
                        </div>
                        <div className="space-y-2">
                          {selectedEra.notableLeaders?.map((ldr, idx) => (
                            <div key={idx} className="p-3 rounded-xl border border-[var(--gold)]/20 bg-[var(--background)]/70 space-y-1">
                              <div className="flex items-center justify-between text-xs font-bold text-[var(--foreground)]">
                                <span>{ldr.name}</span>
                                {showArabicSub && ldr.arabicName && (
                                  <span className="font-arabic text-[var(--gold)] text-sm">{ldr.arabicName}</span>
                                )}
                              </div>
                              <div className="flex items-center justify-between text-[10px] text-[var(--muted-foreground)]">
                                <span className="font-semibold text-[var(--gold)]">{ldr.role}</span>
                                <span className="font-mono text-[var(--foreground)] font-bold">{ldr.reignOrDates}</span>
                              </div>
                              <p className="text-[11px] text-[var(--foreground)] leading-snug pt-1">
                                {ldr.achievements}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Notable Families */}
                    {(selectedEra.notableFamilies || []).length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-[var(--gold)]/20">
                        <div className="text-[10px] font-bold text-[var(--gold)] uppercase tracking-wider flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5 text-[var(--gold)]" />
                          <span>
                            {tf("map_era_families_count", "Grandes Familles & Dynasties ({count})", {
                              count: (selectedEra.notableFamilies || []).length,
                            })}
                          </span>
                        </div>
                        <div className="space-y-2">
                          {selectedEra.notableFamilies?.map((fam, idx) => (
                            <div key={idx} className="p-3 rounded-xl border border-[var(--gold)]/20 bg-[var(--background)]/60 space-y-1">
                              <div className="flex items-center justify-between text-xs font-bold text-[var(--foreground)]">
                                <span>{fam.name}</span>
                                {showArabicSub && fam.arabicName && (
                                  <span className="font-arabic text-[var(--gold)] text-sm">{fam.arabicName}</span>
                                )}
                              </div>
                              <div className="text-[10px] text-[var(--gold)] font-semibold">
                                {fam.role} · <span className="text-[var(--muted-foreground)]">{fam.origin}</span>
                              </div>
                              <p className="text-[11px] text-[var(--foreground)] leading-snug pt-0.5">
                                {fam.lineageNotes}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedEra.lineagesSummary && (
                      <div className="p-3 rounded-xl border border-[var(--gold)]/20 bg-[var(--background)]/40 space-y-1">
                        <div className="text-[10px] font-bold text-[var(--gold)] uppercase">
                          {t("map_era_lineages_summary_title", "Synthèse Généalogique de l'Époque")}
                        </div>
                        <p className="text-xs text-[var(--foreground)] leading-relaxed">
                          {selectedEra.lineagesSummary}
                        </p>
                      </div>
                    )}

                    <Link
                      to="/gallery/trees"
                      className="btn-base btn-gold w-full py-2.5 text-xs font-bold inline-flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <GitBranch className="h-3.5 w-3.5" />
                      <span>{t("map_era_explore_trees_btn", "Explorer la Galerie des Arbres Liés")}</span>
                    </Link>
                  </div>
                )}

                {/* VOLLET 3: CITÉS & DIVISIONS HISTORIQUES */}
                {eraDossierTab === "territories" && (
                  <div className="space-y-3.5 animate-in fade-in duration-200">
                    <div className="rounded-xl border border-[var(--gold)]/30 bg-[var(--gold)]/10 p-3 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--gold)]">
                        <Landmark className="h-4 w-4" />
                        <span>{selectedEra.divisionsTitle}</span>
                      </div>
                      <p className="text-xs text-[var(--foreground)] leading-relaxed">
                        {tf(
                          "map_era_territories_desc",
                          "Circonscriptions d'autorité et cités stratégiques de la Tunisie sous {title}.",
                          { title: selectedEra.title }
                        )}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider">
                        {tf("map_era_divisions_section_count", "Circonscriptions Administratives ({count})", {
                          count: selectedEra.administrativeDivisions.length,
                        })}
                      </div>
                      <div className="space-y-1.5">
                        {selectedEra.administrativeDivisions.map((div) => (
                          <button
                            key={div.id}
                            type="button"
                            onClick={() => handleDivisionSelect(div)}
                            className="w-full p-2.5 rounded-xl border border-[var(--gold)]/20 bg-[var(--background)]/60 hover:bg-[var(--gold)]/10 hover:border-[var(--gold)] text-start transition flex items-center justify-between gap-2 cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-[var(--gold)] shrink-0" />
                              <div>
                                <div className="text-xs font-bold text-[var(--foreground)]">{div.name}</div>
                                <div className="text-[10px] text-[var(--muted-foreground)]">
                                  {t("map_seat_prefix", "Siège :")} {div.chefLieu || div.seat}
                                </div>
                              </div>
                            </div>
                            {showArabicSub && div.arabicName && (
                              <span className="text-xs font-arabic text-[var(--gold)] font-bold">{div.arabicName}</span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-[var(--gold)]/15">
                      <div className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider">
                        {tf("map_era_sites_section_count", "Cités & Forteresses Remarquables ({count})", {
                          count: selectedEra.keySites.length,
                        })}
                      </div>
                      <div className="space-y-1.5">
                        {selectedEra.keySites.map((site) => (
                          <button
                            key={site.name}
                            type="button"
                            onClick={() => setFlyTarget({ coords: site.coords, zoom: site.zoomLevel || 12.5, trigger: Date.now() })}
                            className="w-full p-2 rounded-xl border border-[var(--gold)]/20 bg-[var(--background)]/60 hover:border-[var(--gold)] hover:bg-[var(--gold)]/10 text-start transition flex items-center justify-between gap-2 cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <Landmark className="h-4 w-4 text-[var(--gold)] shrink-0" />
                              <div>
                                <div className="text-xs font-bold text-[var(--foreground)]">{site.name}</div>
                                <div className="text-[10px] text-[var(--muted-foreground)]">{site.role}</div>
                              </div>
                            </div>
                            <Navigation className="h-3.5 w-3.5 text-[var(--gold)] shrink-0" />
                          </button>
                        ))}
                      </div>
                    </div>

                    {(selectedEra.eraTribes || []).length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-[var(--gold)]/15">
                        <div className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider">
                          {tf("map_era_tribes_section_count", "Tribus & Peuples de l'Époque ({count})", {
                            count: (selectedEra.eraTribes || []).length,
                          })}
                        </div>
                        <div className="space-y-2">
                          {selectedEra.eraTribes.map((tr) => (
                            <div key={tr.id} className="p-2.5 rounded-xl border border-[var(--gold)]/20 bg-[var(--background)]/50 space-y-1.5">
                              <div className="flex items-center justify-between text-xs font-bold text-[var(--foreground)]">
                                <span>{tr.name}</span>
                                {showArabicSub && tr.arabicName && (
                                  <span className="font-arabic text-[var(--gold)]">{tr.arabicName}</span>
                                )}
                              </div>
                              <p className="text-[11px] text-[var(--muted-foreground)]">{tr.homelandDescription}</p>
                              <button
                                type="button"
                                onClick={() => handleTribeSelect(tr)}
                                className="w-full py-1 rounded-lg text-[0.65rem] font-bold border border-[var(--gold)]/40 hover:bg-[var(--gold)] hover:text-[#1f160f] transition flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <MapPin className="h-3 w-3" />
                                <span>{t("map_era_trace_homeland_btn", "Tracer le Foyer sur la Carte")}</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* VOLLET 4: ARCHIVES & ACTES DE L'ÉPOQUE */}
                {eraDossierTab === "archives" && (
                  <div className="space-y-3.5 animate-in fade-in duration-200">
                    <Link
                      to={`/periods/${selectedEra.id}`}
                      className="btn-base btn-gold w-full py-2.5 px-3 text-xs font-bold inline-flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] transition-all"
                    >
                      <BookOpen className="h-4 w-4" />
                      <span>{t("map_era_view_full_archives_btn", "Consulter les Archives & Actes Liés à cette Époque")}</span>
                    </Link>

                    <div className="space-y-2">
                      <div className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider">
                        {tf("map_era_sources_section_count", "Fonds & Cotes d'Archives de l'Époque ({count})", {
                          count: selectedEra.archivalSources.length,
                        })}
                      </div>
                      <div className="space-y-1.5">
                        {selectedEra.archivalSources.map((src, i) => (
                          <div
                            key={i}
                            className="p-2.5 rounded-xl border border-[var(--gold)]/15 bg-[var(--background)] text-xs text-[var(--foreground)] flex items-start gap-2"
                          >
                            <Archive className="h-3.5 w-3.5 text-[var(--gold)] shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{src}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl border border-[var(--gold)]/20 bg-[var(--gold)]/5 text-xs text-[var(--foreground)] space-y-1">
                      <div className="font-bold text-[var(--gold)]">
                        {t("map_era_depot_note_title", "Recherche dans les dépôts d'archives :")}
                      </div>
                      <p className="text-[11px] text-[var(--muted-foreground)] leading-relaxed">
                        {t(
                          "map_era_depot_note_desc",
                          "Ces fonds sont consultables aux Archives Nationales de Tunisie (Kasbah) et au Centre d'Études Historiques. Vous pouvez mandater un chercheur depuis notre page Services."
                        )}
                      </p>
                    </div>
                  </div>
                )}

              </div>
            ) : selectedTribe ? (
              /* ================================================================= */
              /* CASE 2: TRIBAL DOSSIER (FOCUSED INSPECTOR, ZERO REDUNDANT TABS)   */
              /* ================================================================= */
              <div className="space-y-3.5 animate-in fade-in duration-200">
                <div className="rounded-xl border border-[var(--gold)]/30 bg-[var(--gold)]/10 p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[var(--gold)]">
                    <span className="flex items-center gap-1.5">
                      <Shield className="h-4 w-4" />
                      <span>{t("map_tribe_card_badge", "Confédération Tribale")}</span>
                    </span>
                    {showArabicSub && selectedTribe.arabicName && (
                      <span className="text-sm font-arabic font-extrabold">{selectedTribe.arabicName}</span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-[var(--foreground)]">{selectedTribe.name}</h3>
                  <p className="text-xs text-[var(--foreground)] leading-relaxed">
                    {selectedTribe.homelandDescription}
                  </p>
                </div>

                {/* Tribal Whereabouts Square Notice & Action */}
                {selectedTribeSquare && (
                  <div className="p-3 rounded-xl border border-[var(--gold)]/30 bg-[var(--gold)]/10 space-y-1.5 shadow-xs">
                    <div className="flex items-center justify-between text-[10px] font-bold text-[var(--gold)] uppercase">
                      <span>{t("map_tribe_square_title", "Carré & Foyer Géographique")}</span>
                      <span className="font-mono text-[9px] bg-amber-500/20 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded font-extrabold">
                        {t("map_tribe_square_active_tag", "Tracé Doré Actif")}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--foreground)] leading-relaxed">
                      {tf(
                        "map_tribe_square_desc",
                        "Un polygone rectangulaire en pointillés dorés délimite la zone de nomadisme et d'implantation sédentaire de la confédération {name}.",
                        { name: selectedTribe.name }
                      )}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        const square = selectedTribeSquare;
                        if (square) {
                          const centerLat = (square[0][0] + square[2][0]) / 2;
                          const centerLng = (square[0][1] + square[2][1]) / 2;
                          setFlyTarget({ coords: [centerLat, centerLng], zoom: selectedTribe.zoom || 9.5, trigger: Date.now() });
                        }
                      }}
                      className="w-full btn-base btn-outline-ink text-[0.68rem] py-1.5 font-bold flex items-center justify-center gap-1.5 mt-1 cursor-pointer"
                    >
                      <Navigation className="h-3 w-3" />
                      <span>{t("map_tribe_recenter_btn", "Recentrer sur le foyer tribal")}</span>
                    </button>
                  </div>
                )}

                {/* Caïdat 1881 & Capital */}
                <div className="p-3 rounded-xl border border-[var(--gold)]/20 bg-[var(--background)]/60 space-y-1">
                  <div className="text-[10px] font-bold text-[var(--gold)] uppercase">
                    {t("map_tribe_caidat_title", "Rattachement Administratif (1881)")}
                  </div>
                  <div className="text-xs font-bold text-[var(--foreground)]">{selectedTribe.caidat1881}</div>
                  <div className="text-[11px] text-[var(--muted-foreground)]">
                    {tf("map_tribe_hist_capital", "Chef-lieu historique : {capital}", {
                      capital: selectedTribe.capital,
                    })}
                  </div>
                </div>

                {/* Fractions & Clans */}
                <div className="space-y-2">
                  <div className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider">
                    {tf("map_tribe_fractions_count", "Fractions & Clans Déclarés ({count})", {
                      count: selectedTribe.fractions.length,
                    })}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedTribe.fractions.map((frac, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-[var(--gold)]/15 text-[var(--foreground)] border border-[var(--gold)]/30"
                      >
                        {frac}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Majba & Archival Sources */}
                <div className="p-3 rounded-xl border border-[var(--gold)]/20 bg-[var(--background)]/40 space-y-2">
                  <div className="text-[10px] font-bold text-[var(--gold)] uppercase">
                    {t("map_tribe_majba_title", "Rôles Fiscaux de la Majba (1860) & Cotes ANT")}
                  </div>
                  <p className="text-xs text-[var(--foreground)] leading-relaxed">
                    {selectedTribe.majbaSources}
                  </p>
                  <div className="space-y-1 pt-1">
                    {selectedTribe.archivalCotes.map((cote, i) => (
                      <div key={i} className="text-[10px] font-mono text-[var(--muted-foreground)] flex items-start gap-1.5">
                        <Archive className="h-3 w-3 text-[var(--gold)] shrink-0 mt-0.5" />
                        <span>{cote}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 space-y-2">
                  <Link
                    to="/gallery/trees"
                    className="btn-base btn-gold w-full py-2 text-xs font-bold inline-flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Users className="h-3.5 w-3.5" />
                    <span>{t("map_tribe_search_lineages_btn", "Rechercher les Lignées de cette Tribu")}</span>
                  </Link>
                </div>
              </div>
            ) : selectedGov ? (
              /* ================================================================= */
              /* CASE 3: INDIVIDUAL GOUVERNORAT DOSSIER                            */
              /* ================================================================= */
              <>
                {govDossierTab === "archives" && (
                  <div className="space-y-3 animate-in fade-in duration-200">
                    <div className="rounded-xl border border-[var(--gold)]/25 bg-[var(--background)]/60 p-3 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-[var(--gold)]">
                        <BookOpen className="h-4 w-4" />
                        <span>{t("map_gov_archives_title", "Fonds d'Archives Disponibles")}</span>
                      </div>
                      <p className="text-xs text-[var(--foreground)] leading-relaxed">
                        {tf(
                          "map_gov_archives_desc",
                          "Cotes et séries d'archives numérisées ou consultables pour {gov}.",
                          { gov: formatGovName(selectedGov.id) }
                        )}
                      </p>
                    </div>

                    {selectedGovEnrichment?.shelfmarks && selectedGovEnrichment.shelfmarks.length > 0 ? (
                      <div className="space-y-2">
                        {selectedGovEnrichment.shelfmarks.map((fond, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl border border-[var(--gold)]/20 bg-[var(--background)]/60 space-y-1.5 text-xs"
                          >
                            <div className="font-bold text-[var(--foreground)] flex items-center justify-between">
                              <span className="font-mono text-[11px] text-[var(--gold)]">{fond}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl border border-[var(--gold)]/20 bg-[var(--background)]/60 text-xs text-[var(--muted-foreground)]">
                        {t("map_gov_archives_empty", "Fonds en cours d'indexation aux Archives Nationales.")}
                      </div>
                    )}
                  </div>
                )}

                {govDossierTab === "lineages" && (
                  <div className="space-y-3 animate-in fade-in duration-200">
                    <div className="rounded-xl border border-[var(--gold)]/25 bg-[var(--background)]/60 p-3 space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-[var(--gold)]">
                        <Users className="h-4 w-4" />
                        <span>{t("map_gov_lineages_title", "Familles & Lignées Notables")}</span>
                      </div>
                      <p className="text-xs text-[var(--foreground)] leading-relaxed">
                        {tf(
                          "map_gov_lineages_desc",
                          "Patronymes et familles historiquement attestés dans le gouvernorat de {gov}.",
                          { gov: formatGovName(selectedGov.id) }
                        )}
                      </p>
                    </div>

                    {selectedGov.notableFamilies && selectedGov.notableFamilies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {selectedGov.notableFamilies.map((fam, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-[var(--gold)]/10 text-[var(--foreground)] border border-[var(--gold)]/30"
                          >
                            {formatFamName(fam)}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="pt-2">
                      <Link
                        to="/gallery/trees"
                        className="btn-base btn-gold w-full py-2 text-xs font-bold inline-flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <GitBranch className="h-3.5 w-3.5" />
                        <span>{t("map_gov_explore_trees_btn", "Explorer les Arbres Généalogiques de ce Gouvernorat")}</span>
                      </Link>
                    </div>
                  </div>
                )}

                {govDossierTab === "monuments" && (
                  <div className="space-y-3 animate-in fade-in duration-200">
                    <div className="rounded-xl border border-[var(--gold)]/25 bg-[var(--background)]/60 p-3 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-[var(--gold)]">
                        <History className="h-4 w-4" />
                        <span>{t("map_gov_monuments_title", "Histoire Locale & Découpage Beylical")}</span>
                      </div>
                      <div className="text-xs font-bold text-[var(--foreground)]">
                        {selectedGovEnrichment?.caidatHistorique || t("map_gov_caidat_fallback", "Caïdat Traditionnel")}
                      </div>
                      <p className="text-xs text-[var(--foreground)] leading-relaxed">
                        {t(`gov_desc_${selectedGov.id}`)}
                      </p>
                    </div>

                    {selectedGovEnrichment?.monuments && selectedGovEnrichment.monuments.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider">
                          {t("map_gov_sites_title", "Sites Historiques & Monuments Classés")}
                        </div>
                        <div className="space-y-1">
                          {selectedGovEnrichment.monuments.map((m, idx) => (
                            <div
                              key={idx}
                              className="p-2 rounded-xl border border-[var(--gold)]/15 bg-[var(--background)] text-xs text-[var(--foreground)] font-medium flex items-center gap-2"
                            >
                              <Landmark className="h-3.5 w-3.5 text-[var(--gold)] shrink-0" />
                              <span>{m}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Local tribe link if present */}
                    {(() => {
                      const matchingGovTribes = localizedBaseTribes.filter(
                        (tr) => tr.governorates?.includes(selectedGov.id)
                      );
                      if (matchingGovTribes.length === 0) return null;
                      return (
                        <div className="space-y-2 pt-2 border-t border-[var(--gold)]/20">
                          <div className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider">
                            {t("map_gov_attached_tribes_title", "Foyer Tribal Historique Rattaché")}
                          </div>
                          {matchingGovTribes.map((tr) => (
                            <div key={tr.id} className="p-2.5 rounded-xl border border-[var(--gold)]/20 bg-[var(--background)]/60 space-y-1.5">
                              <div className="flex items-center justify-between text-xs font-bold text-[var(--foreground)]">
                                <span>{tr.name}</span>
                                {showArabicSub && tr.arabicName && (
                                  <span className="font-arabic text-[var(--gold)]">{tr.arabicName}</span>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => handleTribeSelect(tr)}
                                className="w-full py-1 rounded-lg text-[0.65rem] font-bold border border-[var(--gold)]/40 hover:bg-[var(--gold)] hover:text-[#1f160f] transition flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <MapPin className="h-3 w-3" />
                                <span>{t("map_gov_trace_tribe_btn", "Tracer le Carré de la Tribu sur la Carte")}</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </>
            ) : (
              /* ================================================================= */
              /* CASE 4: GLOBAL NATIONAL OVERVIEW (NO DUPLICATE GOVERNORATE LIST!) */
              /* ================================================================= */
              <div className="space-y-3.5 animate-in fade-in duration-200">
                
                {/* TAB 1: SYNTHÈSE DU TERRITOIRE & CADRE ARCHIVISTIQUE */}
                {globalDossierTab === "overview" && (
                  <div className="space-y-3.5 animate-in fade-in duration-200">
                    <div className="rounded-xl border border-[var(--gold)]/30 bg-[var(--gold)]/10 p-3.5 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-[var(--gold)]">
                        <Landmark className="h-4 w-4" />
                        <span>{t("map_global_framework_title", "Cadre Territorial & Souveraineté de Tunisie")}</span>
                      </div>
                      <p className="text-xs text-[var(--foreground)] leading-relaxed">
                        {t(
                          "map_global_framework_desc",
                          "La Tunisie réunit 24 gouvernorats héritiers d'un maillage administratif séculaire. De l'Afrique Proconsulaire romaine aux 60 caïdats beylicaux et à la République moderne, découvrez la profondeur historique de chaque terroir."
                        )}
                      </p>
                    </div>

                    {/* Key Platform Numbers */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-3 rounded-xl border border-[var(--gold)]/20 bg-[var(--background)]/70 text-center">
                        <div className="font-cinzel text-xl font-bold text-[var(--gold)]">24</div>
                        <div className="text-[10px] text-[var(--muted-foreground)] font-semibold mt-0.5">
                          {t("map_kpi_active_govs", "Gouvernorats Actifs")}
                        </div>
                      </div>
                      <div className="p-3 rounded-xl border border-[var(--gold)]/20 bg-[var(--background)]/70 text-center">
                        <div className="font-cinzel text-xl font-bold text-[var(--gold)]">16</div>
                        <div className="text-[10px] text-[var(--muted-foreground)] font-semibold mt-0.5">
                          {t("map_kpi_confederations", "Confédérations & Foyers")}
                        </div>
                      </div>
                      <div className="p-3 rounded-xl border border-[var(--gold)]/20 bg-[var(--background)]/70 text-center">
                        <div className="font-cinzel text-xl font-bold text-[var(--gold)]">12</div>
                        <div className="text-[10px] text-[var(--muted-foreground)] font-semibold mt-0.5">
                          {t("map_kpi_eras", "Époques Historiques")}
                        </div>
                      </div>
                      <div className="p-3 rounded-xl border border-[var(--gold)]/20 bg-[var(--background)]/70 text-center">
                        <div className="font-cinzel text-xl font-bold text-[var(--gold)]">19</div>
                        <div className="text-[10px] text-[var(--muted-foreground)] font-semibold mt-0.5">
                          {t("map_kpi_depots", "Grands Dépôts d'Archives")}
                        </div>
                      </div>
                    </div>

                    {/* Interaction Guidance Notice */}
                    <div className="p-3 rounded-xl border border-[var(--gold)]/25 bg-[var(--background)]/60 text-xs text-[var(--foreground)] space-y-1.5 leading-relaxed">
                      <div className="font-bold text-[var(--gold)] flex items-center gap-1.5">
                        <Compass className="h-4 w-4" />
                        <span>{t("map_global_howto_title", "Comment naviguer sur la carte :")}</span>
                      </div>
                      <p className="text-[11px] text-[var(--muted-foreground)]">
                        {t(
                          "map_global_howto_desc",
                          "Sélectionnez un gouvernorat ou une région dans le volet gauche ou directement sur la carte. Ce volet droit affichera instantanément ses cotes physiques d'archives, ses familles notables et ses actes d'état civil."
                        )}
                      </p>
                    </div>
                  </div>
                )}

                {/* TAB 2: LES 19 GRANDS DÉPÔTS D'ARCHIVES NATIONAUX */}
                {globalDossierTab === "national_archives" && (
                  <div className="space-y-3 animate-in fade-in duration-200">
                    <div className="rounded-xl border border-[var(--gold)]/25 bg-[var(--background)]/60 p-3 space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-[var(--gold)]">
                        <BookOpen className="h-4 w-4" />
                        <span>{t("map_pillars_title", "Les 5 Grands Piliers des Archives Tunisiennes")}</span>
                      </div>
                      <p className="text-xs text-[var(--foreground)] leading-relaxed">
                        {t(
                          "map_pillars_intro",
                          "Inventaire des dépôts publics abritant les actes d'état civil, sijillats notariés et titres fonciers de Tunisie :"
                        )}
                      </p>
                    </div>

                    <div className="space-y-2 text-xs">
                      {[1, 2, 3, 4, 5].map((idx) => (
                        <div key={idx} className="p-3 rounded-xl border border-[var(--gold)]/20 bg-[var(--background)]/70 space-y-1">
                          <div className="font-bold text-[var(--foreground)]">
                            {t(`map_pillar_${idx}_title`)}
                          </div>
                          <p className="text-[11px] text-[var(--muted-foreground)]">
                            {t(`map_pillar_${idx}_desc`)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 3: GUIDE & MÉTHODE DE RECHERCHE GÉNÉALOGIQUE */}
                {globalDossierTab === "guide" && (
                  <div className="space-y-3 animate-in fade-in duration-200">
                    <div className="rounded-xl border border-[var(--gold)]/25 bg-[var(--background)]/60 p-3 space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-[var(--gold)]">
                        <Compass className="h-4 w-4" />
                        <span>{t("map_guide_title", "Méthode de Recherche Généalogique")}</span>
                      </div>
                      <p className="text-xs text-[var(--foreground)] leading-relaxed">
                        {t("map_guide_intro", "Retrouvez facilement les traces de vos aïeux en 4 étapes méthodiques :")}
                      </p>
                    </div>

                    <div className="space-y-2 text-xs">
                      {[1, 2, 3, 4].map((step) => (
                        <div key={step} className="p-2.5 rounded-xl border border-[var(--gold)]/15 bg-[var(--background)]/50 space-y-0.5">
                          <div className="font-bold text-[var(--gold)]">
                            {t(`map_guide_step_${step}_title`)}
                          </div>
                          <p className="text-[11px] text-[var(--muted-foreground)]">
                            {t(`map_guide_step_${step}_desc`)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 space-y-2">
                      <Link
                        to="/gallery/trees"
                        className="btn-base btn-gold w-full py-2.5 text-xs font-bold inline-flex items-center justify-center gap-2 shadow-sm"
                      >
                        <GitBranch className="h-4 w-4" />
                        <span>{t("map_guide_trees_btn", "Consulter la Galerie des Arbres")}</span>
                      </Link>
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>

          {/* Fixed Action Footer on Right Sidebar */}
          <div className="p-3 border-t border-[var(--gold)]/20 shrink-0 bg-[var(--background)]/60 flex items-center gap-2">
            <Link
              to="/gallery/trees"
              className="btn-base btn-gold flex-1 py-2 text-xs font-bold inline-flex items-center justify-center gap-1.5 shadow-sm"
            >
              <GitBranch className="h-3.5 w-3.5" />
              <span>{t("map_footer_trees_btn", "Arbres Généalogiques")}</span>
            </Link>
            <Link
              to="/services"
              className="btn-base btn-outline-ink py-2 px-3 text-xs font-bold inline-flex items-center justify-center gap-1.5"
              title={t("map_footer_services_title", "Demander une recherche archivistique personnalisée")}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>{t("map_footer_services_btn", "Services")}</span>
            </Link>
          </div>
        </aside>

      </div>
    </div>
  );
}
