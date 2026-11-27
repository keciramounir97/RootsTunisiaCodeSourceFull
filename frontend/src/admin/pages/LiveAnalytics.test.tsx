import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LiveAnalytics from "./LiveAnalytics";
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
          searchConsoleVerification: null,
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
    expect(screen.getAllByText("G-X750JBGTXR").length).toBeGreaterThan(0);
    expect(screen.getAllByText("566029672").length).toBeGreaterThan(0);
    expect(screen.getByText("Non configuré")).toBeInTheDocument();
    expect(screen.getAllByText("Le temps réel nécessite un compte de service").length).toBeGreaterThan(0);

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

  it("shows Not configured instead of an undefined measurement id", async () => {
    mockGet.mockResolvedValue({
      data: {
        live: { activeVisitors: 0, activeSessions: 0, pageviews: 0, topPages: [], recent: [], series: [], source: "first_party" },
        googleAnalytics: { configured: false },
        config: { measurementId: null, propertyId: null, dataApiConfigured: false, searchConsoleVerification: null },
      },
    });
    renderPage();
    await waitFor(() => {
      expect(screen.getAllByText("Non configuré").length).toBeGreaterThan(0);
    });
    expect(screen.queryByText("Non défini")).not.toBeInTheDocument();
    expect(screen.queryByText("Non lié pour le moment")).not.toBeInTheDocument();
    expect(screen.getAllByText("0").length).toBeGreaterThan(0);
  });
});
