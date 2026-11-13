import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { TranslationProvider } from "../context/TranslationContext";
import { ThemeProvider } from "../context/ThemeContext";
import { AuthContext } from "../admin/components/AuthContext";
import InteractiveMap from "./InteractiveMap";
import TunisiaGovernoratesMap from "../components/TunisiaGovernoratesMap";

// Mock react-leaflet components for headless jsdom test execution
vi.mock("react-leaflet", () => ({
  MapContainer: ({ children }: any) => <div data-testid="leaflet-map-container">{children}</div>,
  TileLayer: () => <div data-testid="leaflet-tile-layer" />,
  Marker: ({ children }: any) => <div data-testid="leaflet-marker">{children}</div>,
  Tooltip: ({ children }: any) => <div data-testid="leaflet-tooltip">{children}</div>,
  Popup: ({ children }: any) => <div data-testid="leaflet-popup">{children}</div>,
  Polygon: ({ children }: any) => <div data-testid="leaflet-polygon">{children}</div>,
  Polyline: ({ children }: any) => <div data-testid="leaflet-polyline">{children}</div>,
  Circle: ({ children }: any) => <div data-testid="leaflet-circle">{children}</div>,
  useMap: () => ({ setView: vi.fn(), flyTo: vi.fn() }),
}));

function renderInteractiveMapWithAuth(user: any) {
  const authValue: any = {
    user,
    token: user ? "mock-token" : null,
    loading: false,
    isAdmin: user?.role === 1 || user?.role === 3,
    login: vi.fn(),
    logout: vi.fn(),
    updateUser: vi.fn(),
  };

  return render(
    <MemoryRouter>
      <AuthContext.Provider value={authValue}>
        <ThemeProvider>
          <TranslationProvider>
            <InteractiveMap />
          </TranslationProvider>
        </ThemeProvider>
      </AuthContext.Provider>
    </MemoryRouter>
  );
}

function renderSectionWithAuth(user: any) {
  const authValue: any = {
    user,
    token: user ? "mock-token" : null,
    loading: false,
    isAdmin: user?.role === 1 || user?.role === 3,
    login: vi.fn(),
    logout: vi.fn(),
    updateUser: vi.fn(),
  };

  return render(
    <MemoryRouter>
      <AuthContext.Provider value={authValue}>
        <ThemeProvider>
          <TranslationProvider>
            <TunisiaGovernoratesMap />
          </TranslationProvider>
        </ThemeProvider>
      </AuthContext.Provider>
    </MemoryRouter>
  );
}

describe("InteractiveMap Access Gate & Redesign", () => {
  it("blocks guest / unauthenticated users with luxury paywall on /interactive-map", () => {
    renderInteractiveMapWithAuth(null);
    expect(
      screen.getAllByText(/Atlas Archivistique|Archival Atlas/i)[0]
    ).toBeInTheDocument();
    expect(screen.getByText(/S'abonner|Subscribe|Unlock/i)).toBeInTheDocument();
  });

  it("blocks free tier (tier 1) users with paywall", () => {
    const freemiumUser = {
      id: 99,
      email: "freemium@test.com",
      role: 2,
      tier_id: 1,
      subscription_plan: "free",
    };
    renderInteractiveMapWithAuth(freemiumUser);
    expect(
      screen.getAllByText(/Atlas Archivistique|Archival Atlas/i)[0]
    ).toBeInTheDocument();
  });

  it("grants full access to Tier 1 Paid (Tier 2 'Chercheur')", () => {
    const tier1User = {
      id: 101,
      email: "chercheur@test.com",
      role: 2,
      tier_id: 2,
      subscription_plan: "premium",
    };
    renderInteractiveMapWithAuth(tier1User);
    expect(screen.getByText(/Membre Chercheur|Researcher Member/i)).toBeInTheDocument();
    expect(screen.getByTestId("leaflet-map-container")).toBeInTheDocument();
  });

  it("grants full access to Tier 2 Paid (Tier 3 'Historien')", () => {
    const tier2User = {
      id: 102,
      email: "historian@test.com",
      role: 2,
      tier_id: 3,
      subscription_plan: "historian",
    };
    renderInteractiveMapWithAuth(tier2User);
    expect(screen.getByText(/Membre Historien|Historian Member/i)).toBeInTheDocument();
    expect(screen.getByTestId("leaflet-map-container")).toBeInTheDocument();
  });

  it("grants full access to Admins (role 1) and Super Admins (role 3)", () => {
    const adminUser = {
      id: 1,
      email: "admin@rootstunisia.com",
      role: 1,
      tier_id: 1,
    };
    renderInteractiveMapWithAuth(adminUser);
    expect(screen.getByText(/Administration/i)).toBeInTheDocument();
    expect(screen.getByTestId("leaflet-map-container")).toBeInTheDocument();
  });

  it("allows freemium users to see the embedded section freely with gold preview badge", () => {
    const freemiumUser = {
      id: 99,
      email: "freemium@test.com",
      role: 2,
      tier_id: 1,
    };
    renderSectionWithAuth(freemiumUser);
    expect(screen.getByTestId("leaflet-map-container")).toBeInTheDocument();
    expect(
      screen.getByText(/Aperçu Découverte|Discovery Preview/i)
    ).toBeInTheDocument();
  });

  it("switches to tribes mode and displays tribal confederations and territories", () => {
    const tier2User = { id: 102, role: 2, tier_id: 3, subscription_plan: "historian" };
    renderInteractiveMapWithAuth(tier2User);
    
    // Click on Tribus tab in left sidebar
    const tribesBtns = screen.getAllByRole("button", { name: /Tribus/i });
    fireEvent.click(tribesBtns[0]);

    expect(screen.getAllByText(/Territoires tribaux/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Ouerghemma/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Jlass/i)[0]).toBeInTheDocument();
  });

  it("switches to historical eras mode and enables Ottoman era 1600 with capital auto-zoom", () => {
    const tier2User = { id: 102, role: 2, tier_id: 3, subscription_plan: "historian" };
    renderInteractiveMapWithAuth(tier2User);

    // Click on Époques tab
    const erasTab = screen.getByRole("button", { name: /Époques/i });
    fireEvent.click(erasTab);

    expect(screen.getByText(/Cartographie chronologique/i)).toBeInTheDocument();
    expect(screen.getByText(/Régence Ottomane de Tunis/i)).toBeInTheDocument();
  });

  it("displays the tribe whereabouts square and dossier when a tribe is selected", () => {
    const tier2User = { id: 102, role: 2, tier_id: 3, subscription_plan: "historian" };
    renderInteractiveMapWithAuth(tier2User);

    // Switch to tribes mode
    const tribesBtns = screen.getAllByRole("button", { name: /Tribus/i });
    fireEvent.click(tribesBtns[0]);

    // Click on Ouerghemma tribe
    const tribeCard = screen.getAllByText(/Ouerghemma/i)[0];
    fireEvent.click(tribeCard);

    // Should display whereabouts notification & dossier
    expect(screen.getAllByText(/Carré & Foyer Tribal/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Recentrer/i)[0]).toBeInTheDocument();
  });

  it("displays Devlet empire and era divisions when an epoch is selected", () => {
    const tier2User = { id: 102, role: 2, tier_id: 3, subscription_plan: "historian" };
    renderInteractiveMapWithAuth(tier2User);

    // Click on Époques tab
    const erasTab = screen.getByRole("button", { name: /Époques/i });
    fireEvent.click(erasTab);

    // Click on Ottoman era
    const ottomanCard = screen.getByText(/Régence Ottomane de Tunis/i);
    fireEvent.click(ottomanCard);

    // Devlet toggle and country borders toggle should be present
    expect(screen.getByText(/Devlet Actif/i)).toBeInTheDocument();
    expect(screen.getByText(/Tunisie Active/i)).toBeInTheDocument();
  });

  it("displays national archival framework in right sidebar without governorate duplication", () => {
    const tier2User = { id: 102, role: 2, tier_id: 3, subscription_plan: "historian" };
    renderInteractiveMapWithAuth(tier2User);

    // In Right Sidebar, verify national synthesis tabs
    expect(screen.getByTitle(/Synthèse & Cadre/i)).toBeInTheDocument();
    expect(screen.getByTitle(/Dépôts Nationaux/i)).toBeInTheDocument();

    // Click on Dépôts Nationaux tab
    const archivesTab = screen.getByTitle(/Dépôts Nationaux/i);
    fireEvent.click(archivesTab);

    // Should display national archival pillars
    expect(screen.getByText(/Les 5 Grands Piliers des Archives Tunisiennes/i)).toBeInTheDocument();
    expect(screen.getByText(/Archives Nationales de Tunisie \(ANT — La Kasbah\)/i)).toBeInTheDocument();
  });

  it("displays rich historical leaders, Tunis role, and families in Era dossier", () => {
    const tier2User = { id: 102, role: 2, tier_id: 3, subscription_plan: "historian" };
    renderInteractiveMapWithAuth(tier2User);

    // Click on Époques tab
    const erasTab = screen.getByRole("button", { name: /Époques/i });
    fireEvent.click(erasTab);

    // Click on Ottoman era
    const ottomanCard = screen.getByText(/Régence Ottomane de Tunis/i);
    fireEvent.click(ottomanCard);

    // Under State & Tunis vollet, verify leaders and Tunis role
    expect(screen.getByText(/Rôle & Rayonnement de Tunis sous cette Époque/i)).toBeInTheDocument();

    // Switch to Dirigeants & Familles vollet in Era mode
    const leadersVolletBtn = screen.getByTitle(/Dirigeants & Familles/i);
    fireEvent.click(leadersVolletBtn);

    // Should display notable leaders and families of the era
    expect(screen.getAllByText(/Hammouda Pacha/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/Dynastie Beylicale des Mouradites/i)).toBeInTheDocument();
  });
});
