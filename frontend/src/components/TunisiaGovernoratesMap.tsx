import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import L from "leaflet";
import { Search, GitBranch, Archive, ArrowLeft, Layers, Compass, MapPin } from "lucide-react";
import { useTranslation } from "../context/TranslationContext";

// Custom gold and red marker icons
const goldIcon = L.divIcon({
  className: "",
  html: `<div style="background:linear-gradient(135deg,#e3b555,#b8860b);width:20px;height:20px;border-radius:50%;border:3px solid #fdfbf7;box-shadow:0 3px 12px rgba(217,164,65,0.75);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:transform 0.2s;"><div style="width:6px;height:6px;background:#fdfbf7;border-radius:50%;"></div></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const selectedIcon = L.divIcon({
  className: "",
  html: `<div style="background:linear-gradient(135deg,#e11d48,#9f1239);width:26px;height:26px;border-radius:50%;border:3px solid #fdfbf7;box-shadow:0 0 18px rgba(200,16,46,0.95);display:flex;align-items:center;justify-content:center;cursor:pointer;"><div style="width:8px;height:8px;background:#fdfbf7;border-radius:50%;"></div></div>`,
  iconSize: [26, 26],
  iconAnchor: [13, 13],
});

type RegionId =
  | "all_tunisia"
  | "greater_tunis"
  | "north"
  | "north_east"
  | "north_west"
  | "sahel"
  | "central_west"
  | "south_west"
  | "south_east";

interface Governorate {
  id: string;
  coords: [number, number];
  region: RegionId;
  population: string;
  notableFamilies: string[];
}

interface RegionInfo {
  id: RegionId;
  labelKey: string;
  governorates: string[];
  notableLineages: string[];
}

const REGIONS: RegionId[] = [
  "all_tunisia",
  "greater_tunis",
  "north",
  "north_east",
  "north_west",
  "sahel",
  "central_west",
  "south_west",
  "south_east",
];

const REGION_LABEL_KEYS: Record<RegionId, string> = {
  all_tunisia: "region_all",
  greater_tunis: "region_greater_tunis",
  north: "region_north",
  north_east: "region_north_east",
  north_west: "region_north_west",
  sahel: "region_sahel",
  central_west: "region_central_west",
  south_west: "region_south_west",
  south_east: "region_south_east",
};

const regionDossiers: Record<RegionId, RegionInfo> = {
  all_tunisia: {
    id: "all_tunisia",
    labelKey: "region_all",
    governorates: [
      "tunis", "ariana", "ben_arous", "manouba", "nabeul", "zaghouan", "bizerte",
      "beja", "jendouba", "le_kef", "siliana", "sousse", "monastir", "mahdia",
      "sfax", "kairouan", "kasserine", "sidi_bouzid", "gafsa", "tozeur", "kebili",
      "gabes", "medenine", "tataouine",
    ],
    notableLineages: [
      "ben_achour", "fourati", "chabbi", "lasram", "zarrouk",
      "sellami", "bourguiba", "caid_essebsi", "khmiri", "marzougui",
    ],
  },
  greater_tunis: {
    id: "greater_tunis",
    labelKey: "region_greater_tunis",
    governorates: ["tunis", "ariana", "ben_arous", "manouba"],
    notableLineages: [
      "ben_achour", "caid_essebsi", "lasram", "zarrouk", "djaziri",
      "baccouche", "mami", "chennoufi", "ennaifer", "bouhajeb",
    ],
  },
  north: {
    id: "north",
    labelKey: "region_north",
    governorates: ["bizerte"],
    notableLineages: ["guiga", "boukhris", "allani", "ben_cheikh", "baccari", "ben_rejeb"],
  },
  north_east: {
    id: "north_east",
    labelKey: "region_north_east",
    governorates: ["nabeul", "zaghouan"],
    notableLineages: ["haddad", "kharraz", "gharbi", "chaouch", "boudhina", "mani", "triki", "khouja"],
  },
  north_west: {
    id: "north_west",
    labelKey: "region_north_west",
    governorates: ["beja", "jendouba", "le_kef", "siliana"],
    notableLineages: ["dridi", "amdouni", "khmiri", "ayari", "mazigh", "chebbi", "boughanmi", "souissi", "maktari"],
  },
  sahel: {
    id: "sahel",
    labelKey: "region_sahel",
    governorates: ["sousse", "monastir", "mahdia", "sfax"],
    notableLineages: ["fourati", "sellami", "abid", "fendri", "bourguiba", "mzali", "boujnah", "jenayah", "hamza", "farhat", "sfar"],
  },
  central_west: {
    id: "central_west",
    labelKey: "region_central_west",
    governorates: ["kairouan", "kasserine", "sidi_bouzid"],
    notableLineages: ["alouini", "mourali", "attia", "bouraoui", "chammakhi", "bouazizi", "nasri", "gharbi", "majri", "kadri"],
  },
  south_west: {
    id: "south_west",
    labelKey: "region_south_west",
    governorates: ["gafsa", "tozeur", "kebili"],
    notableLineages: ["chabbi", "ibn_chabbat", "ben_othman", "gafsi", "marzougui", "douzi", "dabbabi", "yacoubi", "bousmaha"],
  },
  south_east: {
    id: "south_east",
    labelKey: "region_south_east",
    governorates: ["gabes", "medenine", "tataouine"],
    notableLineages: ["trabelsi", "djerbi", "ouderni", "ksouri", "bannani", "boulbaba", "zammouri", "chenini", "douiri", "jlassi"],
  },
};

const governorates: Governorate[] = [
  { id: "tunis", coords: [36.8065, 10.1815], region: "greater_tunis", population: "1,075,000", notableFamilies: ["ben_achour", "caid_essebsi", "djaziri", "lasram", "zarrouk", "ben_ayed"] },
  { id: "ariana", coords: [36.8625, 10.1956], region: "greater_tunis", population: "576,000", notableFamilies: ["baccouche", "mami", "ennaifer", "bouhajeb"] },
  { id: "ben_arous", coords: [36.7533, 10.2281], region: "greater_tunis", population: "631,000", notableFamilies: ["belkhodja", "klibi", "chennoufi", "snoussi"] },
  { id: "manouba", coords: [36.8100, 10.0972], region: "greater_tunis", population: "379,000", notableFamilies: ["kassar", "farhat", "ben_mustapha", "tlili"] },
  { id: "nabeul", coords: [36.4561, 10.7376], region: "north_east", population: "787,000", notableFamilies: ["haddad", "kharraz", "gharbi", "chaouch", "boudhina"] },
  { id: "zaghouan", coords: [36.4029, 10.1429], region: "north_east", population: "176,000", notableFamilies: ["mani", "triki", "ben_rejeb", "khouja"] },
  { id: "bizerte", coords: [37.2744, 9.8739], region: "north", population: "568,000", notableFamilies: ["guiga", "boukhris", "allani", "ben_cheikh", "baccari"] },
  { id: "beja", coords: [36.7256, 9.1817], region: "north_west", population: "303,000", notableFamilies: ["dridi", "amdouni", "trabelsi", "riahi", "jouini"] },
  { id: "jendouba", coords: [36.5011, 8.7803], region: "north_west", population: "401,000", notableFamilies: ["khmiri", "ayari", "boughanmi", "souissi", "gharbi"] },
  { id: "le_kef", coords: [36.1822, 8.7149], region: "north_west", population: "243,000", notableFamilies: ["mazigh", "chabbi", "chebbi", "mansouri", "bouassida"] },
  { id: "siliana", coords: [36.0847, 9.3708], region: "north_west", population: "223,000", notableFamilies: ["ayari", "siliani", "hammami", "maktari", "jouini"] },
  { id: "sousse", coords: [35.8256, 10.6369], region: "sahel", population: "675,000", notableFamilies: ["boujnah", "baccouche", "melliti", "chouikha", "jenayah", "letaief"] },
  { id: "monastir", coords: [35.7779, 10.8261], region: "sahel", population: "548,000", notableFamilies: ["bourguiba", "essid", "mzali", "kallal", "sayah", "ghedira"] },
  { id: "mahdia", coords: [35.5047, 11.0622], region: "sahel", population: "410,000", notableFamilies: ["hamza", "farhat", "ben_romdhane", "sfar", "kacem"] },
  { id: "sfax", coords: [34.7406, 10.7603], region: "sahel", population: "1,030,000", notableFamilies: ["fourati", "abid", "sellami", "fendri", "kammoun", "hachicha", "ellouze"] },
  { id: "kairouan", coords: [35.6781, 10.0963], region: "central_west", population: "570,000", notableFamilies: ["alouini", "mourali", "attia", "bouraoui", "chammakhi", "bardi"] },
  { id: "kasserine", coords: [35.1676, 8.8365], region: "central_west", population: "439,000", notableFamilies: ["gharbi", "nasri", "hafsi", "boulaabi", "majri"] },
  { id: "sidi_bouzid", coords: [35.0382, 9.4849], region: "central_west", population: "430,000", notableFamilies: ["bouazizi", "hamdouni", "kadri", "zitouni", "amri"] },
  { id: "gafsa", coords: [34.4250, 8.7842], region: "south_west", population: "337,000", notableFamilies: ["gafsi", "dabbabi", "znaidi", "mbarki", "khadhraoui"] },
  { id: "tozeur", coords: [33.9197, 8.1336], region: "south_west", population: "107,000", notableFamilies: ["chabbi", "ibn_chabbat", "ben_othman", "gueblaoui", "bousmaha"] },
  { id: "kebili", coords: [33.7050, 8.9650], region: "south_west", population: "157,000", notableFamilies: ["marzougui", "douzi", "yacoubi", "ben_amor", "ghouma"] },
  { id: "gabes", coords: [33.8815, 10.0982], region: "south_east", population: "374,000", notableFamilies: ["boulbaba", "zammouri", "chennoufi", "arbi", "marzouk"] },
  { id: "medenine", coords: [33.3549, 10.5055], region: "south_east", population: "479,000", notableFamilies: ["trabelsi", "ksouri", "bannani", "gharbi", "djerbi", "haddad"] },
  { id: "tataouine", coords: [32.9297, 10.4518], region: "south_east", population: "149,000", notableFamilies: ["ouderni", "dabbabi", "chenini", "douiri", "jlassi"] },
];

// Free, Open-Source Tile Layers (Zero API Keys Required)
const OPEN_SOURCE_TILE_LAYERS = {
  osm: {
    id: "osm",
    labelKey: "map_layer_osm",
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>',
  },
  humanitarian: {
    id: "humanitarian",
    labelKey: "map_layer_hot",
    url: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>',
  },
  topo: {
    id: "topo",
    labelKey: "map_layer_topo",
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> · <a href="https://opentopomap.org" target="_blank" rel="noopener noreferrer">OpenTopoMap</a>',
  },
} as const;

type TileLayerKey = keyof typeof OPEN_SOURCE_TILE_LAYERS;

function MapCenterController({ coords, zoom }: { coords: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    const [lat, lng] = coords || [NaN, NaN];
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || !Number.isFinite(zoom)) return;
    try {
      map.invalidateSize(false);
      const size = map.getSize();
      if (!size.x || !size.y) return;
      map.flyTo([lat, lng], zoom, { duration: 1.1 });
    } catch {
      // Leaflet throws Invalid LatLng when the container is still zero-sized.
    }
  }, [coords, zoom, map]);
  return null;
}

export default function TunisiaGovernoratesMap({
  variant = "full",
}: {
  /** Auth side panels use `embed` inside `hidden lg:flex` — delay Leaflet until lg. */
  variant?: "full" | "embed";
} = {}) {
  const { t, isRtl } = useTranslation();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeRegion, setActiveRegion] = useState<RegionId>("all_tunisia");
  const [tileStyle, setTileStyle] = useState<TileLayerKey>("osm");
  const [viewportReady, setViewportReady] = useState(variant !== "embed");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (variant !== "embed" || typeof window === "undefined") {
      setViewportReady(true);
      return;
    }
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setViewportReady(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [variant]);

  const activeDossier = useMemo(() => {
    return regionDossiers[activeRegion] || regionDossiers.all_tunisia;
  }, [activeRegion]);

  const selectedGov = useMemo(() => {
    if (!selectedId) return null;
    return governorates.find((g) => g.id === selectedId) || null;
  }, [selectedId]);

  const filteredGovernorates = useMemo(() => {
    let list = activeRegion === "all_tunisia" ? governorates : governorates.filter((g) => g.region === activeRegion);
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (g) =>
          g.id.toLowerCase().includes(q) ||
          g.notableFamilies.some((f) => f.toLowerCase().includes(q)),
      );
    }
    return list;
  }, [activeRegion, searchQuery]);

  const mapView = useMemo<{ coords: [number, number]; zoom: number }>(() => {
    const fallback: [number, number] = [34.4, 9.6];
    if (selectedGov) {
      const [lat, lng] = selectedGov.coords || [NaN, NaN];
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        return { coords: [lat, lng], zoom: 9 };
      }
    }
    if (activeRegion !== "all_tunisia" && filteredGovernorates.length > 0) {
      const valid = filteredGovernorates.filter(
        (g) => Number.isFinite(g.coords?.[0]) && Number.isFinite(g.coords?.[1]),
      );
      if (valid.length) {
        const avgLat = valid.reduce((acc, g) => acc + g.coords[0], 0) / valid.length;
        const avgLng = valid.reduce((acc, g) => acc + g.coords[1], 0) / valid.length;
        if (Number.isFinite(avgLat) && Number.isFinite(avgLng)) {
          return { coords: [avgLat, avgLng], zoom: 7 };
        }
      }
    }
    return { coords: fallback, zoom: 6 };
  }, [selectedGov, activeRegion, filteredGovernorates]);

  const handleRegionClick = (reg: RegionId) => {
    setActiveRegion(reg);
    setSelectedId(null);
  };

  const handleGovSelect = (gov: Governorate) => {
    setSelectedId(gov.id);
    setActiveRegion(gov.region);
  };

  const formatRegionLabel = (reg: RegionId) => t(REGION_LABEL_KEYS[reg]);
  const formatGovName = (govId: string) => t(`gov_name_${govId}`);
  const formatFamName = (famKey: string) => t(`fam_${famKey}`);

  const currentLayer = OPEN_SOURCE_TILE_LAYERS[tileStyle];

  const isEmbed = variant === "embed";

  if (isEmbed && !viewportReady) {
    return <div className="absolute inset-0 w-full h-full bg-[var(--card)] animate-pulse" />;
  }

  // Auth pages: interactive map only — no dossier card (matches Maghreb embed).
  if (isEmbed) {
    return (
      <div
        dir={isRtl ? "rtl" : "ltr"}
        className="absolute inset-0 z-0 flex h-full w-full flex-col bg-[var(--card)]"
      >
        <div className="flex shrink-0 flex-wrap items-center justify-center gap-1.5 border-b border-[var(--gold)]/25 bg-[var(--card)]/95 px-2 py-2 z-[500]">
          {REGIONS.map((reg) => {
            const isActive = activeRegion === reg;
            return (
              <button
                key={reg}
                type="button"
                onClick={() => handleRegionClick(reg)}
                className={`rounded-md px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.12em] transition-all cursor-pointer border ${
                  isActive
                    ? "bg-[#b81428] !text-white border-[#b81428] shadow-md"
                    : "bg-[var(--card)] text-[var(--foreground)] border-[var(--gold)]/40 hover:border-[var(--gold)] hover:bg-[var(--gold)]/15"
                }`}
              >
                {formatRegionLabel(reg)}
              </button>
            );
          })}
        </div>
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-2 sm:p-3">
          <div className="mb-2 flex shrink-0 flex-wrap items-center justify-between gap-2 px-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--foreground)]">
              <MapPin className="h-4 w-4 text-[var(--primary)]" />
              <span>
                {selectedGov
                  ? formatGovName(selectedGov.id)
                  : `${formatRegionLabel(activeRegion)} · ${filteredGovernorates.length}`}
              </span>
            </div>
            <div className="flex items-center gap-1 rounded-md border border-[var(--gold)]/35 bg-[var(--background)] p-1">
              <Layers className="h-3.5 w-3.5 text-[var(--gold)] mx-1.5" />
              {(Object.keys(OPEN_SOURCE_TILE_LAYERS) as TileLayerKey[]).map((key) => {
                const layer = OPEN_SOURCE_TILE_LAYERS[key];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTileStyle(key)}
                    className={`rounded px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                      tileStyle === key
                        ? "bg-[#d9a441] !text-[#1f160f] shadow-sm"
                        : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    {t(layer.labelKey)}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="relative min-h-0 flex-1 overflow-hidden rounded-lg border border-[var(--gold)]/30">
            <MapContainer
              center={[34.4, 9.6]}
              zoom={6}
              scrollWheelZoom
              zoomControl
              attributionControl={false}
              className="h-full w-full z-0"
              style={{ background: "#e8e0d0" }}
            >
              <MapCenterController coords={mapView.coords} zoom={mapView.zoom} />
              <TileLayer key={currentLayer.id} url={currentLayer.url} maxZoom={18} />
              {filteredGovernorates.map((gov) => {
                const [glat, glng] = gov.coords || [NaN, NaN];
                if (!Number.isFinite(glat) || !Number.isFinite(glng)) return null;
                const isSelected = selectedId === gov.id;
                return (
                  <Marker
                    key={gov.id}
                    position={[glat, glng]}
                    icon={isSelected ? selectedIcon : goldIcon}
                    eventHandlers={{ click: () => handleGovSelect(gov) }}
                  >
                    <Tooltip direction="top" offset={[0, -10]}>
                      <span className="font-display font-bold text-sm">
                        {formatGovName(gov.id)}
                      </span>
                    </Tooltip>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
          <div className="mt-2 flex shrink-0 items-center gap-2 overflow-x-auto border-t border-[var(--gold)]/25 pt-2 text-xs">
            {filteredGovernorates.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => handleGovSelect(g)}
                className={`shrink-0 rounded-md border px-3 py-1 text-xs font-semibold cursor-pointer ${
                  selectedId === g.id
                    ? "border-[#b81428] bg-[#b81428] !text-white"
                    : "border-[var(--gold)]/35 bg-[var(--background)] text-[var(--foreground)]"
                }`}
              >
                {formatGovName(g.id)}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-[var(--gold)]/40 bg-[var(--gold)]/10 px-3.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.24em] text-[var(--gold)] mb-3">
          <Compass className="h-3.5 w-3.5" />
          {t("map_atlas_eyebrow")}
        </span>
        <h2 className="display-lg text-[var(--foreground)] font-bold">
          {t("map_atlas_title")}
        </h2>
        <div className="gold-rule mx-auto mt-3 mb-4 w-24" />
        <p className="text-sm sm:text-base text-[var(--muted-foreground)] max-w-2xl mx-auto leading-relaxed font-medium">
          {t("map_atlas_intro")}
        </p>
      </div>

      {/* Region Filter Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-6">
        {REGIONS.map((reg) => {
          const isActive = activeRegion === reg;
          return (
            <button
              key={reg}
              onClick={() => handleRegionClick(reg)}
              className={`rounded-md px-3 py-1.5 sm:px-4 sm:py-2 text-[0.7rem] sm:text-xs font-bold uppercase tracking-[0.14em] transition-all cursor-pointer border ${
                isActive && !selectedId
                  ? "bg-[#b81428] !text-white border-[#b81428] shadow-md"
                  : isActive
                  ? "bg-[#d9a441] !text-[#1f160f] border-[#d9a441] shadow-sm font-extrabold"
                  : "bg-[var(--card)] text-[var(--foreground)] border-[var(--gold)]/40 hover:border-[var(--gold)] hover:bg-[var(--gold)]/15"
              }`}
            >
              {formatRegionLabel(reg)}
            </button>
          );
        })}
      </div>

      {/* Map + Sidebar Split (Equal Height) */}
      <div className="grid gap-6 lg:grid-cols-12 lg:items-stretch">
        {/* Left: OpenStreetMap Interactive Container */}
        <div className="lg:col-span-7 surface-card overflow-hidden p-3 border-2 border-[var(--gold)]/45 shadow-2xl rounded-xl flex flex-col h-[420px] sm:h-[560px] lg:h-[680px] bg-[var(--card)]">
          {/* Top Map Toolbar: Open-Source Layer Switcher + Status + Search */}
          <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2 px-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--foreground)]">
              <MapPin className="h-4 w-4 text-[var(--primary)]" />
              <span>
                {selectedGov
                  ? `${formatGovName(selectedGov.id)} (${selectedGov.population})`
                  : `${formatRegionLabel(activeRegion)} · ${filteredGovernorates.length} ${t("governorates_count")}`}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-[140px] sm:min-w-[190px]">
                <Search className="absolute start-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--muted-foreground)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("map_search_placeholder", "Rechercher région, famille…")}
                  className="w-full rounded border border-[var(--gold)]/35 bg-[var(--background)] ps-7 pe-5 py-1 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)] transition-colors"
                />
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute end-1.5 top-1/2 -translate-y-1/2 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer"
                  >
                    ×
                  </button>
                ) : null}
              </div>

              <div className="flex items-center gap-1 rounded-md border border-[var(--gold)]/35 bg-[var(--background)] p-1">
                <Layers className="h-3.5 w-3.5 text-[var(--gold)] mx-1.5" />
                {(Object.keys(OPEN_SOURCE_TILE_LAYERS) as TileLayerKey[]).map((key) => {
                  const layer = OPEN_SOURCE_TILE_LAYERS[key];
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setTileStyle(key)}
                      className={`rounded px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                        tileStyle === key
                          ? "bg-[#d9a441] !text-[#1f160f] shadow-sm"
                          : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                      }`}
                    >
                      {t(layer.labelKey)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Map Canvas */}
          <div className="flex-1 w-full rounded-lg overflow-hidden relative min-h-0 border border-[var(--gold)]/30">
            <MapContainer
              center={[34.4, 9.6]}
              zoom={6}
              scrollWheelZoom={false}
              zoomControl={true}
              attributionControl={false}
              className="h-full w-full z-0"
              style={{ background: "#e8e0d0" }}
            >
              <MapCenterController coords={mapView.coords} zoom={mapView.zoom} />
              <TileLayer
                key={currentLayer.id}
                url={currentLayer.url}
                maxZoom={18}
              />
              {filteredGovernorates.map((gov) => {
                const [glat, glng] = gov.coords || [NaN, NaN];
                if (!Number.isFinite(glat) || !Number.isFinite(glng)) return null;
                const isSelected = selectedId === gov.id;
                const govLabel = formatGovName(gov.id);
                return (
                  <Marker
                    key={gov.id}
                    position={[glat, glng]}
                    icon={isSelected ? selectedIcon : goldIcon}
                    eventHandlers={{
                      click: () => handleGovSelect(gov),
                    }}
                  >
                    <Tooltip direction="top" offset={[0, -10]}>
                      <span dir={isRtl ? "rtl" : "ltr"} className="font-display font-bold text-sm !text-[#1e1610]">
                        {govLabel}
                      </span>
                    </Tooltip>
                    <Popup>
                      <div dir={isRtl ? "rtl" : "ltr"} className="p-1.5 max-w-[230px] !text-[#1e1610] text-start">
                        <h4 className="font-display font-bold text-base !text-[#9f1239]">
                          {govLabel}
                        </h4>
                        <p className="text-xs font-semibold !text-[#5c4938] mt-0.5">
                          {formatRegionLabel(gov.region)} · {gov.population} {t("inhabitants")}
                        </p>
                        <p className="text-xs !text-[#2b2118] mt-2 leading-relaxed">
                          {t(`gov_desc_${gov.id}`)}
                        </p>
                        <button
                          onClick={() => handleGovSelect(gov)}
                          className="mt-3 w-full btn-base btn-gold text-[0.65rem] py-1.5 cursor-pointer"
                        >
                          {t("view_archival_details")}
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
            <div className="pointer-events-none absolute bottom-1.5 end-2 z-[400] rounded bg-black/65 px-2 py-0.5 text-[0.62rem] font-semibold !text-white">
              © {t(currentLayer.labelKey)}
            </div>
          </div>

          {/* Quick Governorates Pill List */}
          <div className="mt-2.5 shrink-0 flex items-center gap-2 overflow-x-auto pt-2 pb-1 border-t border-[var(--gold)]/25 text-xs">
            <span className="eyebrow shrink-0 text-[0.65rem] font-extrabold">{t("governorates_label")}:</span>
            {filteredGovernorates.map((g) => (
              <button
                key={g.id}
                onClick={() => handleGovSelect(g)}
                className={`shrink-0 rounded-md px-3 py-1 text-xs font-semibold transition-all cursor-pointer border ${
                  selectedId === g.id
                    ? "bg-[#b81428] !text-white border-[#b81428] font-bold shadow-sm"
                    : "bg-[var(--background)] text-[var(--foreground)] border-[var(--gold)]/35 hover:border-[var(--gold)] hover:bg-[var(--gold)]/15"
                }`}
              >
                {formatGovName(g.id)}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Dynamic Information Dossier Panel (Region or Governorate) */}
        <div className="lg:col-span-5 surface-card p-4 sm:p-6 border-2 border-[var(--gold)]/45 shadow-2xl flex flex-col min-h-[420px] max-h-[540px] sm:max-h-none sm:h-[560px] lg:h-[680px] rounded-xl overflow-hidden bg-[var(--card)]">
          {selectedGov ? (
            /* INDIVIDUAL GOVERNORATE DOSSIER */
            <>
              <div className="shrink-0 border-b border-[var(--gold)]/30 pb-3.5">
                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedId(null)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[var(--gold)] hover:underline cursor-pointer"
                  >
                    <ArrowLeft className={`h-3.5 w-3.5 ${isRtl ? "rotate-180" : ""}`} />
                    {t("back_to_overview")}
                  </button>
                  <span className="rounded-md border border-[var(--gold)]/50 bg-[var(--gold)]/10 px-2.5 py-0.5 text-[0.65rem] font-bold text-[var(--foreground)]">
                    {t("pop_prefix")} {selectedGov.population}
                  </span>
                </div>
                <div className="mt-3 flex items-baseline justify-between gap-2">
                  <h3 className="display-lg text-2xl sm:text-3xl text-[var(--foreground)] font-bold">
                    {formatGovName(selectedGov.id)}
                  </h3>
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted-foreground)] mt-1">
                  {t("capital_label")}: {t(`gov_capital_${selectedGov.id}`)} · {formatRegionLabel(selectedGov.region)}
                </p>
              </div>

              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto pe-1 text-start space-y-4 py-3 text-xs sm:text-sm leading-relaxed">
                <div>
                  <p className="eyebrow text-[0.65rem] text-[var(--gold)] mb-1">
                    {t("historical_overview")}
                  </p>
                  <p className="text-xs sm:text-sm text-[var(--foreground)] leading-relaxed">
                    {t(`gov_desc_${selectedGov.id}`)}
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-[var(--secondary)]/80 border border-[var(--gold)]/35">
                  <div className="flex items-center gap-1.5 text-[var(--primary)] font-bold text-xs uppercase tracking-[0.14em] mb-1.5">
                    <Archive className="h-4 w-4" />
                    <span>{t("archival_civil_records")}</span>
                  </div>
                  <p className="text-xs text-[var(--foreground)]/90 leading-relaxed">
                    {t(`gov_notes_${selectedGov.id}`)}
                  </p>
                </div>

                <div>
                  <p className="eyebrow text-[0.65rem] text-[var(--gold)] mb-1">
                    {t("key_historical_landmarks")}
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)] font-medium">
                    {t(`gov_landmarks_${selectedGov.id}`)}
                  </p>
                </div>

                <div>
                  <p className="eyebrow text-[0.65rem] text-[var(--gold)] mb-2">
                    {t("historically_documented_lineages")}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedGov.notableFamilies.map((famKey) => {
                      const famLabel = formatFamName(famKey);
                      return (
                        <Link
                          key={famKey}
                          to={`/gallery/trees?q=${encodeURIComponent(famLabel)}`}
                          className="rounded-md border border-[var(--gold)]/45 bg-[var(--background)] px-2.5 py-1 text-xs font-bold text-[var(--foreground)] hover:border-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-colors"
                        >
                          {famLabel}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="shrink-0 pt-3 border-t border-[var(--gold)]/25 grid grid-cols-2 gap-2.5 mt-auto">
                <Link
                  to={`/gallery?q=${encodeURIComponent(formatGovName(selectedGov.id))}`}
                  className="btn-base btn-red text-[0.68rem] py-2.5 text-center flex items-center justify-center gap-1.5"
                >
                  <Search className="h-3.5 w-3.5" /> {t("records")}
                </Link>
                <Link
                  to={`/gallery/trees?q=${encodeURIComponent(formatGovName(selectedGov.id))}`}
                  className="btn-base btn-outline-ink text-[0.68rem] py-2.5 text-center flex items-center justify-center gap-1.5"
                >
                  <GitBranch className="h-3.5 w-3.5" /> {t("trees")}
                </Link>
              </div>
            </>
          ) : (
            /* REGIONAL OVERVIEW DOSSIER */
            <>
              <div className="shrink-0 border-b border-[var(--gold)]/30 pb-3.5">
                <div className="flex items-center justify-between">
                  <span className="rounded-md border border-[var(--gold)]/50 bg-[var(--gold)]/10 px-2.5 py-0.5 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-[var(--gold)]">
                    {t("regional_archival_dossier")}
                  </span>
                  <span className="text-xs text-[var(--foreground)] font-bold">
                    {activeDossier.governorates.length} {t("governorates_count")}
                  </span>
                </div>
                <div className="mt-3 flex items-baseline justify-between gap-2">
                  <h3 className="display-lg text-2xl sm:text-3xl text-[var(--foreground)] font-bold">
                    {t(`dossier_title_${activeDossier.id}`)}
                  </h3>
                </div>
              </div>

              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto pe-1 text-start space-y-4 py-3 text-xs sm:text-sm leading-relaxed">
                <div>
                  <p className="eyebrow text-[0.65rem] text-[var(--gold)] mb-1">
                    {t("territory_demographics")}
                  </p>
                  <p className="text-xs sm:text-sm text-[var(--foreground)] leading-relaxed">
                    {t(`dossier_summary_${activeDossier.id}`)}
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-[var(--secondary)]/80 border border-[var(--gold)]/35">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--primary)] mb-1">
                    {t("historical_settlement_layers")}
                  </p>
                  <p className="text-xs text-[var(--foreground)]/90 leading-relaxed">
                    {t(`dossier_settlement_${activeDossier.id}`)}
                  </p>
                </div>

                <div>
                  <p className="eyebrow text-[0.65rem] text-[var(--gold)] mb-1">
                    {t("archival_repositories_court")}
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)] font-medium leading-relaxed">
                    {t(`dossier_holdings_${activeDossier.id}`)}
                  </p>
                </div>

                <div>
                  <p className="eyebrow text-[0.65rem] text-[var(--gold)] mb-2">
                    {t("member_governorates")}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {activeDossier.governorates.map((govId) => {
                      const gObj = governorates.find((x) => x.id === govId);
                      return (
                        <button
                          key={govId}
                          onClick={() => gObj && handleGovSelect(gObj)}
                          className="rounded-md border border-[var(--gold)]/45 bg-[var(--background)] px-2.5 py-1 text-xs font-bold text-[var(--foreground)] hover:border-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-colors cursor-pointer"
                        >
                          {formatGovName(govId)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <p className="eyebrow text-[0.65rem] text-[var(--gold)] mb-2">
                    {t("notable_family_lineages")}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {activeDossier.notableLineages.map((famKey) => {
                      const famLabel = formatFamName(famKey);
                      return (
                        <Link
                          key={famKey}
                          to={`/gallery/trees?q=${encodeURIComponent(famLabel)}`}
                          className="rounded-md border border-[var(--border)] bg-[var(--background)] px-2.5 py-1 text-xs font-semibold text-[var(--foreground)] hover:text-[var(--gold)] hover:border-[var(--gold)] transition-colors"
                        >
                          {famLabel}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Direct Search Actions */}
              <div className="shrink-0 pt-3 border-t border-[var(--gold)]/25 grid grid-cols-2 gap-2.5 mt-auto">
                <Link
                  to={`/gallery?q=${encodeURIComponent(formatRegionLabel(activeRegion))}`}
                  className="btn-base btn-red text-[0.68rem] py-2.5 text-center flex items-center justify-center gap-1.5"
                >
                  <Search className="h-3.5 w-3.5" /> {t("regional_records")}
                </Link>
                <Link
                  to={`/gallery/trees?q=${encodeURIComponent(formatRegionLabel(activeRegion))}`}
                  className="btn-base btn-outline-ink text-[0.68rem] py-2.5 text-center flex items-center justify-center gap-1.5"
                >
                  <GitBranch className="h-3.5 w-3.5" /> {t("regional_trees")}
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
