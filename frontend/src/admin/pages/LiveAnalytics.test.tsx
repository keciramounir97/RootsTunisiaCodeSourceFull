import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LiveAnalytics, { readLivePayload } from "./LiveAnalytics";
import { TranslationProvider } from "../../context/TranslationContext";

const mockGet = vi.fn();

vi.mock("../../api/client", () => ({
  api: {
    get: (...args: unknown[]) => mockGet(...args),
  },
}));

function ymd(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function renderPage() {
  return render(
    <MemoryRouter>
      <TranslationProvider>
        <LiveAnalytics />
      </TranslationProvider>
    </MemoryRouter>,
  );
}

describe("Google Analytics admin page", () => {
  beforeEach(() => {
    localStorage.setItem("locale", "fr");
    mockGet.mockReset();
    mockGet.mockResolvedValue({
      data: {
        live: {
          activeVisitors: 4,
          activeSessions: 3,
          pageviews: 9,
          topPages: [{ path: "/trees", views: 9 }],
          byLocale: [{ locale: "fr", views: 6 }, { locale: "en", views: 3 }],
          recent: [],
          series: [{ t: "2026-11-27 10:00", views: 9 }],
          seriesGranularity: "hour",
          source: "first_party",
          range: "day",
        },
        googleAnalytics: { configured: false, message: "service account missing" },
        config: {
          measurementId: "G-X750JBGTXR",
          propertyId: "566029672",
          dataApiConfigured: false,
          searchConsoleVerification: "google-site-verification-secret-token",
        },
      },
    });
  });

  it("names the page Google Analytics and loads the selected calendar day", async () => {
    renderPage();

    expect(screen.getAllByRole("heading", { name: "Google Analytics" }).length).toBeGreaterThan(0);
    const today = ymd(new Date());
    await waitFor(() => {
      expect(mockGet).toHaveBeenCalledWith(expect.stringContaining(`date=${today}`));
    });
    expect(String(mockGet.mock.calls[0][0])).toContain("range=day");
    expect(screen.queryByText("Non défini")).not.toBeInTheDocument();
    expect(screen.queryByText("G-X750JBGTXR")).not.toBeInTheDocument();
    expect(screen.queryByText("566029672")).not.toBeInTheDocument();
    expect(screen.queryByText("google-site-verification-secret-token")).not.toBeInTheDocument();
    expect(screen.queryByText("GOOGLE_SITE_VERIFICATION")).not.toBeInTheDocument();
    expect(screen.queryByText("GA_MEASUREMENT_ID")).not.toBeInTheDocument();
    expect(screen.queryByText("GA4_PROPERTY_ID")).not.toBeInTheDocument();
    expect(screen.queryByText("GA_SERVICE_ACCOUNT_JSON")).not.toBeInTheDocument();
    expect(screen.queryByText(/VITE_GOOGLE_SITE_VERIFICATION/)).not.toBeInTheDocument();
    expect(screen.queryByText("Le temps réel nécessite un compte de service")).not.toBeInTheDocument();
    expect(screen.queryByText("service account missing")).not.toBeInTheDocument();
    expect(screen.queryByText("Non configuré")).not.toBeInTheDocument();
    expect(screen.queryByText("Identifiant de mesure")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Google Analytics" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Search Console" })).not.toBeInTheDocument();

    expect(screen.getAllByText("4").some((el) => el.tagName === "STRONG")).toBe(true);
    expect(screen.getAllByText("3").some((el) => el.tagName === "STRONG")).toBe(true);
    expect(screen.getAllByText("9").some((el) => el.tagName === "STRONG")).toBe(true);
    expect(screen.getAllByText("Première partie").length).toBeGreaterThan(0);
    expect(screen.getByText("Trafic par langue")).toBeInTheDocument();
    expect(screen.getByText("fr")).toBeInTheDocument();
    expect(screen.getAllByText("6").some((el) => el.tagName === "SPAN")).toBe(true);

    const selected = screen.getByRole("gridcell", { selected: true });
    expect(selected.className).toContain("bg-[#e08a72]");

    const target = new Date();
    target.setDate(1);
    if (ymd(target) === today) target.setMonth(target.getMonth() - 1);
    if (target.getMonth() !== new Date().getMonth()) {
      fireEvent.click(screen.getByRole("button", { name: "Mois précédent" }));
    }
    const label = new Intl.DateTimeFormat("fr", { dateStyle: "full" }).format(target);
    fireEvent.click(screen.getByRole("gridcell", { name: label }));

    await waitFor(() => {
      expect(mockGet.mock.calls.some((call) => String(call[0]).includes(`date=${ymd(target)}`) && String(call[0]).includes("range=day"))).toBe(true);
    });

    fireEvent.click(screen.getByRole("button", { name: "Semaine" }));
    await waitFor(() => {
      expect(mockGet.mock.calls.some((call) => String(call[0]).includes("range=week"))).toBe(true);
    });

    fireEvent.click(screen.getByRole("button", { name: "Année" }));
    await waitFor(() => {
      expect(mockGet.mock.calls.some((call) => String(call[0]).includes("range=year"))).toBe(true);
    });
  });

  it("shows first-party GA active users instead of Not configured", async () => {
    mockGet.mockResolvedValue({
      data: {
        live: {
          activeVisitors: 7,
          activeSessions: 2,
          pageviews: 11,
          topPages: [],
          byLocale: [],
          recent: [],
          series: [],
          source: "first_party",
        },
        googleAnalytics: { configured: false },
        config: { measurementId: null, propertyId: null, dataApiConfigured: false, searchConsoleVerification: null },
      },
    });
    renderPage();
    await waitFor(() => {
      expect(screen.getAllByText("7").length).toBeGreaterThanOrEqual(2);
    });
    expect(screen.queryByText("Non configuré")).not.toBeInTheDocument();
    expect(screen.queryByText("Non défini")).not.toBeInTheDocument();
    expect(screen.getAllByText("Première partie").length).toBeGreaterThan(0);
  });

  it("shows year totals when the API envelope is still wrapped", async () => {
    const wrapped = {
      statusCode: 200,
      message: "Success",
      data: {
        live: {
          activeVisitors: 131,
          activeSessions: 165,
          pageviews: 565,
          topPages: [{ path: "/", views: 565 }],
          byLocale: [{ locale: "ar", views: 200 }],
          recent: [{ path: "/", created_at: "2026-11-27T10:00:00.000Z" }],
          series: [{ t: "2026-11", views: 565 }],
          seriesGranularity: "month",
          source: "first_party",
          range: "year",
        },
        googleAnalytics: { configured: false, message: "Add GA_SERVICE_ACCOUNT_JSON" },
        config: {
          measurementId: null,
          propertyId: null,
          dataApiConfigured: false,
          searchConsoleVerification: null,
        },
      },
      meta: null,
      timestamp: "2026-11-27T00:00:00.000Z",
    };
    expect(readLivePayload(wrapped).live?.activeVisitors).toBe(131);
    mockGet.mockResolvedValue({ data: wrapped });

    renderPage();
    await waitFor(() => {
      expect(screen.getAllByText("131").length).toBeGreaterThanOrEqual(2);
    });
    expect(screen.getByText("165")).toBeInTheDocument();
    expect(screen.getAllByText("565").length).toBeGreaterThan(0);
    expect(screen.getByText("ar")).toBeInTheDocument();
    expect(screen.getByText("200")).toBeInTheDocument();
    expect(screen.queryByText("Add GA_SERVICE_ACCOUNT_JSON")).not.toBeInTheDocument();
    expect(screen.queryByText("Non configuré")).not.toBeInTheDocument();
  });
});
