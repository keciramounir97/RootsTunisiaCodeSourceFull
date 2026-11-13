import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import InteractiveMap from "../InteractiveMap";
import TunisiaGovernoratesMap from "../../components/TunisiaGovernoratesMap";
import MaghrebTribesMap from "../../components/MaghrebTribesMap";
import { TranslationProvider } from "../../context/TranslationContext";
import { AuthContext, type User } from "../../admin/components/AuthContext";
import { SUPPORTED_LOCALES, isRtlLocale, tForLocale } from "../../utils/translations";
import { getLocalizedGovEnrichment } from "../../data/govArchivalEnrichmentLocales";
import { getLocalizedTribes } from "../../data/historicalMapLocales";
import { buildDefaultPeriodCards } from "../../utils/periodsCmsConfig";
import { MAGHREB_MAP_LOCALES } from "../../data/maghrebMapLocales";

vi.mock("../../api/client", () => ({
  api: {
    get: vi.fn().mockResolvedValue({ data: [] }),
    post: vi.fn().mockResolvedValue({ data: {} }),
  },
}));

vi.mock("react-leaflet", () => ({
  MapContainer: ({ children }: any) => (
    <div data-testid="leaflet-map-container">{children}</div>
  ),
  TileLayer: () => <div data-testid="leaflet-tile-layer" />,
  ZoomControl: () => <div data-testid="leaflet-zoom-control" />,
  Marker: ({ children, eventHandlers }: any) => (
    <div data-testid="leaflet-marker" onClick={() => eventHandlers?.click?.()}>
      {children}
    </div>
  ),
  Tooltip: ({ children }: any) => <div data-testid="leaflet-tooltip">{children}</div>,
  Popup: ({ children }: any) => <div data-testid="leaflet-popup">{children}</div>,
  Polygon: ({ children, eventHandlers }: any) => (
    <div data-testid="leaflet-polygon" onClick={() => eventHandlers?.click?.()}>
      {children}
    </div>
  ),
  Polyline: ({ children }: any) => <div data-testid="leaflet-polyline">{children}</div>,
  Circle: ({ children }: any) => <div data-testid="leaflet-circle">{children}</div>,
  useMap: () => ({
    setView: vi.fn(),
    flyTo: vi.fn(),
    fitBounds: vi.fn(),
    zoomIn: vi.fn(),
    zoomOut: vi.fn(),
    invalidateSize: vi.fn(),
    getSize: () => ({ x: 800, y: 600 }),
    getContainer: () => null,
  }),
}));

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const tf = (locale: string, key: string, vars: Record<string, string | number> = {}) => {
  let text = tForLocale(locale, key);
  for (const [k, v] of Object.entries(vars)) {
    text = text.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
  }
  return text;
};

const makeAuthContextValue = (user: User | null) => ({
  user,
  loading: false,
  isAdmin: user?.role === 1,
  signup: vi.fn(),
  register: vi.fn(),
  login: vi.fn(),
  requestReset: vi.fn(),
  verifyReset: vi.fn(),
  logout: vi.fn(),
  refreshMe: vi.fn().mockResolvedValue(user),
});

const SUBSCRIBED_USER: User = {
  id: 42,
  email: "historian@rootstunisia.tn",
  fullName: "Amine Historian",
  role: 2,
  status: "active",
  tier_id: 2,
  subscription_status: "active",
};

const renderWithProviders = (
  ui: React.ReactElement,
  user: User | null = null,
  initialPath = "/interactive-map",
) =>
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <TranslationProvider>
        <AuthContext.Provider value={makeAuthContextValue(user)}>{ui}</AuthContext.Provider>
      </TranslationProvider>
    </MemoryRouter>,
  );

describe("Interactive Map, TunisiaGovernoratesMap & MaghrebTribesMap 6-Language & RTL Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    document.head.innerHTML = "";
    document.title = "";
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query.includes("min-width: 1024px"),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it("translates the InteractiveMap paywall, benefits, SEO tags, and direction across all 6 languages", async () => {
    for (const locale of SUPPORTED_LOCALES) {
      localStorage.setItem("locale", locale);
      const t = (key: string) => tForLocale(locale, key);
      const expectedDir = isRtlLocale(locale) ? "rtl" : "ltr";

      const { container, unmount } = renderWithProviders(<InteractiveMap />, null);

      expect(container.firstElementChild).toHaveAttribute("dir", expectedDir);
      expect(document.documentElement.dir).toBe(expectedDir);
      expect(document.documentElement.lang).toBe(locale);

      await waitFor(() => {
        expect(document.title).toContain(t("seo_map_title"));
      });
      expect(document.head.querySelector('meta[name="description"]')?.getAttribute("content")).toBe(
        t("seo_map_desc"),
      );

      expect(screen.getByText(t("map_access_locked_title"))).toBeInTheDocument();
      expect(screen.getByText(t("map_access_locked_subtitle"))).toBeInTheDocument();
      expect(screen.getByText(t("map_access_benefit_1"))).toBeInTheDocument();
      expect(screen.getByText(t("map_access_benefit_2"))).toBeInTheDocument();
      expect(screen.getByText(t("map_access_benefit_3"))).toBeInTheDocument();
      expect(screen.getByText(t("map_access_benefit_4"))).toBeInTheDocument();
      expect(screen.getByText(t("map_access_locked_cta"))).toBeInTheDocument();
      expect(screen.getByText(t("map_access_locked_login"))).toBeInTheDocument();
      expect(screen.getByText(t("map_access_locked_explore_home"))).toBeInTheDocument();

      if (locale !== "fr") {
        expect(screen.queryByText("S'abonner au Palier Chercheur ou Historien")).not.toBeInTheDocument();
        expect(screen.queryByText("Explorer la section d'aperçu gratuite sur la page d'accueil")).not.toBeInTheDocument();
      }

      unmount();
    }
  });

  it("translates full InteractiveMap explorer modes, tribal/era/division/governorate dossiers, KPIs, pillars & guide across all 6 languages", async () => {
    for (const locale of SUPPORTED_LOCALES) {
      localStorage.setItem("locale", locale);
      const t = (key: string) => tForLocale(locale, key);
      const expectedDir = isRtlLocale(locale) ? "rtl" : "ltr";

      const localizedTribes = getLocalizedTribes(locale);
      const localizedPeriods = buildDefaultPeriodCards(locale);
      const tunisGovEnrichment = getLocalizedGovEnrichment("tunis", locale)!;
      const ouerghemmaTribe = localizedTribes.find((tr) => tr.id === "ouerghemma")!;
      const ottomanEra = localizedPeriods.find((e) => e.id === "ottomane")!;

      const { container, unmount } = renderWithProviders(<InteractiveMap />, SUBSCRIBED_USER);

      expect(container.firstElementChild).toHaveAttribute("dir", expectedDir);
      expect(document.documentElement.dir).toBe(expectedDir);

      await waitFor(() => {
        expect(document.title).toContain(t("seo_map_unlocked_title"));
      });
      expect(document.head.querySelector('meta[name="description"]')?.getAttribute("content")).toBe(
        t("seo_map_unlocked_desc"),
      );

      // Header VIP badge (tier_id: 2 maps to Tier 1 Researcher badge) & search input
      expect(screen.getByText(t("map_vip_badge_tier1"))).toBeInTheDocument();
      expect(screen.getByPlaceholderText(t("map_explorer_search_placeholder"))).toBeInTheDocument();

      // Segmented 4 explorer mode buttons
      const regionsBtn = screen.getByRole("button", { name: t("map_mode_regions") });
      const govsBtn = screen.getByRole("button", { name: t("map_mode_govs_short") });
      const tribesLabel = tf(locale, "map_mode_tribes_count", { count: localizedTribes.length });
      const tribesBtn = screen.getByRole("button", { name: tribesLabel });
      const erasLabel = tf(locale, "map_mode_eras_12", { count: localizedPeriods.length });
      const erasBtn = screen.getByRole("button", { name: erasLabel });

      expect(regionsBtn).toBeInTheDocument();
      expect(govsBtn).toBeInTheDocument();
      expect(tribesBtn).toBeInTheDocument();
      expect(erasBtn).toBeInTheDocument();

      // Check Leaflet tooltip/popup directional wrappers
      const tooltips = screen.getAllByTestId("leaflet-tooltip");
      expect(tooltips.length).toBeGreaterThan(0);
      for (const tip of tooltips) {
        const innerDir = tip.querySelector("[dir]");
        if (innerDir) {
          expect(innerDir).toHaveAttribute("dir", expectedDir);
        }
      }

      // Global overview tabs: Overview (KPIs), National Archives (5 pillars), Guide (4 steps)
      expect(screen.getByText(t("map_global_framework_title"))).toBeInTheDocument();
      expect(screen.getByText(t("map_kpi_active_govs"))).toBeInTheDocument();
      expect(screen.getByText(t("map_kpi_confederations"))).toBeInTheDocument();
      expect(screen.getByText(t("map_kpi_eras"))).toBeInTheDocument();
      expect(screen.getByText(t("map_kpi_depots"))).toBeInTheDocument();

      fireEvent.click(screen.getByTitle(t("map_global_tab_archives")));
      expect(screen.getByText(t("map_pillars_title"))).toBeInTheDocument();
      expect(screen.getByText(t("map_pillar_1_title"))).toBeInTheDocument();
      expect(screen.getByText(t("map_pillar_5_title"))).toBeInTheDocument();

      fireEvent.click(screen.getByTitle(t("map_global_tab_guide")));
      expect(screen.getByText(t("map_guide_title"))).toBeInTheDocument();
      expect(screen.getByText(t("map_guide_step_1_title"))).toBeInTheDocument();
      expect(screen.getByText(t("map_guide_step_4_title"))).toBeInTheDocument();

      // Switch to Tribes mode & select a tribe
      fireEvent.click(tribesBtn);
      expect(screen.getByText(t("map_tribes_help_desc"))).toBeInTheDocument();
      const tribeButtons = screen.getAllByRole("button", {
        name: new RegExp(ouerghemmaTribe.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"),
      });
      fireEvent.click(tribeButtons[0]);

      expect(screen.getByText(t("map_ctx_tribe_eyebrow"))).toBeInTheDocument();
      expect(screen.getByText(t("map_tribe_square_title"))).toBeInTheDocument();
      expect(screen.getByText(t("map_recenter_short"))).toBeInTheDocument();
      expect(screen.getByText(ouerghemmaTribe.homelandDescription)).toBeInTheDocument();
      expect(ouerghemmaTribe.majbaSources).toBeTruthy();
      expect(screen.getByText(ouerghemmaTribe.majbaSources!)).toBeInTheDocument();

      if (locale === "ar") {
        expect(screen.queryByText(`(${ouerghemmaTribe.arabicName})`)).not.toBeInTheDocument();
      }

      // Switch to Eras mode & select Ottoman era
      fireEvent.click(erasBtn);
      expect(screen.getByText(t("map_eras_intro_desc"))).toBeInTheDocument();
      const eraCardBtn = screen.getAllByRole("button", {
        name: new RegExp(escapeRe(ottomanEra.title), "i"),
      })[0];
      fireEvent.click(eraCardBtn);

      expect(screen.getByText(t("map_ctx_era_eyebrow"))).toBeInTheDocument();
      expect(screen.getByText(t("map_devlet_active"))).toBeInTheDocument();
      expect(screen.getByText(t("map_tunisia_active"))).toBeInTheDocument();
      expect(screen.getByText(t("map_era_tunis_role_title"))).toBeInTheDocument();

      fireEvent.click(screen.getByTitle(t("map_era_tab_notables")));
      expect(ottomanEra.notableLeaders?.[0]?.name).toBeTruthy();
      expect(screen.getAllByText(ottomanEra.notableLeaders![0].name).length).toBeGreaterThan(0);

      fireEvent.click(screen.getByTitle(t("map_era_tab_territories")));
      const firstDivision = ottomanEra.administrativeDivisions[0];
      expect(screen.getAllByText(firstDivision.name).length).toBeGreaterThan(0);
      fireEvent.click(
        screen.getAllByRole("button", {
          name: new RegExp(escapeRe(firstDivision.name), "i"),
        })[0],
      );
      expect(screen.getByText(t("map_ctx_division_eyebrow"))).toBeInTheDocument();
      expect(screen.getByText(t("map_div_jurisdiction_label"))).toBeInTheDocument();
      expect(screen.getAllByText(firstDivision.description).length).toBeGreaterThan(0);
      fireEvent.click(screen.getByRole("button", { name: new RegExp(escapeRe(t("map_back_to_era_btn")), "i") }));

      fireEvent.click(screen.getByTitle(t("map_era_tab_archives")));
      expect(screen.getByText(t("map_era_depot_note_desc"))).toBeInTheDocument();

      // Clear selected era or switch back to Governorates mode and inspect Tunis dossier
      fireEvent.click(screen.getByTitle(t("map_close_era_view_title")));
      fireEvent.click(govsBtn);
      fireEvent.click(
        screen.getAllByRole("button", {
          name: new RegExp(escapeRe(t("gov_name_tunis")), "i"),
        })[0],
      );

      expect(screen.getAllByText(t("gov_name_tunis")).length).toBeGreaterThan(0);
      expect(screen.getByTitle(t("map_gov_tab_archives"))).toBeInTheDocument();
      expect(screen.getByTitle(t("map_gov_tab_lineages"))).toBeInTheDocument();
      expect(screen.getByTitle(t("map_gov_tab_monuments"))).toBeInTheDocument();
      expect(screen.getAllByText(tunisGovEnrichment.shelfmarks[0]).length).toBeGreaterThan(0);

      fireEvent.click(screen.getByTitle(t("map_gov_tab_monuments")));
      expect(screen.getAllByText(tunisGovEnrichment.caidatHistorique).length).toBeGreaterThan(0);
      expect(screen.getAllByText(tunisGovEnrichment.monuments[0]).length).toBeGreaterThan(0);

      unmount();
    }
  }, 30000);

  it("translates TunisiaGovernoratesMap in both full and embed variants across all 6 languages", () => {
    for (const locale of SUPPORTED_LOCALES) {
      localStorage.setItem("locale", locale);
      const t = (key: string) => tForLocale(locale, key);
      const expectedDir = isRtlLocale(locale) ? "rtl" : "ltr";
      const tunisGovEnrichment = getLocalizedGovEnrichment("tunis", locale)!;

      // Full variant
      const { container: fullContainer, unmount: unmountFull } = renderWithProviders(
        <TunisiaGovernoratesMap variant="full" />,
        null,
      );
      expect(fullContainer.querySelector("[dir]") ?? fullContainer.firstElementChild).toBeTruthy();
      expect(document.documentElement.dir).toBe(expectedDir);

      expect(screen.getByText(t("map_atlas_eyebrow"))).toBeInTheDocument();
      expect(screen.getByText(t("map_atlas_title"))).toBeInTheDocument();
      expect(screen.getByText(t("map_atlas_intro"))).toBeInTheDocument();
      expect(screen.getByText(t("map_freemium_preview_badge"))).toBeInTheDocument();
      expect(screen.getByText(t("map_freemium_preview_desc"))).toBeInTheDocument();
      expect(screen.getByText(t("map_freemium_unlock_cta"))).toBeInTheDocument();
      expect(
        screen.getAllByRole("button", { name: new RegExp(`^${escapeRe(t("map_tab_regions"))}`) }).length,
      ).toBeGreaterThan(0);
      const govTab = screen.getAllByRole("button", {
        name: new RegExp(`^${escapeRe(t("map_tab_governorates"))}`),
      })[0];
      expect(govTab).toBeInTheDocument();
      expect(screen.getByText(t("map_bottom_banner_desc"))).toBeInTheDocument();
      expect(screen.getAllByText(t("map_btn_open_fullscreen")).length).toBeGreaterThan(0);

      fireEvent.click(govTab);
      expect(screen.getByPlaceholderText(t("map_filter_gov_placeholder"))).toBeInTheDocument();
      fireEvent.click(
        screen.getAllByRole("button", {
          name: new RegExp(escapeRe(t("gov_name_tunis")), "i"),
        })[0],
      );
      expect(screen.getAllByText(tunisGovEnrichment.jurisdiction).length).toBeGreaterThan(0);
      expect(screen.getAllByText(tunisGovEnrichment.census).length).toBeGreaterThan(0);
      unmountFull();

      // Embed variant
      const { container: embedContainer, unmount: unmountEmbed } = renderWithProviders(
        <TunisiaGovernoratesMap variant="embed" />,
        null,
      );
      expect(embedContainer.querySelector("[dir]")).toHaveAttribute("dir", expectedDir);
      expect(screen.getByText(t("map_auth_title"))).toBeInTheDocument();
      expect(screen.getByText(t("map_auth_subtitle"))).toBeInTheDocument();
      expect(screen.getAllByText(t("map_btn_open_fullscreen")).length).toBeGreaterThan(0);
      expect(screen.getAllByText(t("region_greater_tunis")).length).toBeGreaterThan(0);
      unmountEmbed();
    }
  }, 30000);

  it("translates MaghrebTribesMap regions, cities, labels, and tooltip/popup RTL across all 6 languages", () => {
    for (const locale of SUPPORTED_LOCALES) {
      localStorage.setItem("locale", locale);
      const t = (key: string) => tForLocale(locale, key);
      const expectedDir = isRtlLocale(locale) ? "rtl" : "ltr";

      const expectedFesName =
        locale === "fr" ? "Fès & Meknès" : MAGHREB_MAP_LOCALES[locale].regions["Fès & Meknès"].name;
      const expectedTunisCity =
        locale === "fr" ? "Tunis" : MAGHREB_MAP_LOCALES[locale].cities["Tunis"].name;
      const expectedTunisCountry =
        locale === "fr" ? "Tunisie" : MAGHREB_MAP_LOCALES[locale].cities["Tunis"].country;

      const { unmount } = renderWithProviders(<MaghrebTribesMap />, null);

      expect(screen.getByTestId("leaflet-zoom-control")).toBeInTheDocument();
      expect(screen.getAllByText(t("history_label")).length).toBeGreaterThan(0);
      expect(screen.getAllByText(t("families_tribes_label")).length).toBeGreaterThan(0);
      expect(screen.getAllByText(t("key_site_label")).length).toBeGreaterThan(0);

      expect(
        screen.getAllByText(new RegExp(escapeRe(expectedFesName), "i")).length,
      ).toBeGreaterThan(0);
      expect(
        screen.getAllByText(
          new RegExp(escapeRe(`${expectedTunisCity} (${expectedTunisCountry})`)),
        ).length,
      ).toBeGreaterThan(0);

      const tooltips = screen.getAllByTestId("leaflet-tooltip");
      for (const tip of tooltips) {
        const inner = tip.querySelector("[dir]");
        expect(inner).toHaveAttribute("dir", expectedDir);
      }

      const popups = screen.getAllByTestId("leaflet-popup");
      for (const pop of popups) {
        const inner = pop.querySelector("[dir]");
        expect(inner).toHaveAttribute("dir", expectedDir);
      }

      if (locale !== "fr") {
        expect(screen.queryByText("Histoire :")).not.toBeInTheDocument();
        expect(screen.queryByText("Familles/Tribus :")).not.toBeInTheDocument();
        expect(screen.queryByText("Site clé :")).not.toBeInTheDocument();
      }

      unmount();
    }
  });
});
