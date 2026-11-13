import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SourcesAndArchives from "../SourcesAndArchives";
import { TranslationProvider } from "../../context/TranslationContext";

// Mock API client to ensure static ARCHIVES_DIRECTORY fallback with all 28 entries
vi.mock("../../api/client", () => ({
  api: {
    get: vi.fn().mockImplementation((url: string) => {
      if (url.includes("/public-cards/locations")) {
        return Promise.resolve({
          data: [
            { key: "tunisia", label: "Tunisie", icon: "Landmark" },
            { key: "france", label: "France", icon: "Building2" },
            { key: "italy", label: "Italie & Sicile", icon: "Ship" },
            { key: "malta", label: "Malte", icon: "Shield" },
            { key: "uk", label: "Royaume-Uni", icon: "Crown" },
            { key: "jewish", label: "Fonds Juifs", icon: "Scroll" },
            { key: "ottoman", label: "Ottoman & Islamique", icon: "Moon" },
            { key: "maghreb", label: "Algérie & Maghreb", icon: "Globe" },
          ],
        });
      }
      return Promise.resolve({ data: [] });
    }),
  },
}));

describe("Sources & Archives Page", () => {
  it("renders the 9 category links with correct counts in dark/white compatible styles", async () => {
    render(
      <MemoryRouter>
        <TranslationProvider>
          <SourcesAndArchives />
        </TranslationProvider>
      </MemoryRouter>
    );

    // Verify all 9 category link labels exist
    expect(screen.getAllByText(/Tous les fonds/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Tunisie/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/France/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Italie & Sicile/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Malte/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Royaume-Uni/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Fonds Juifs/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Ottoman & Islamique/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Algérie & Maghreb/i).length).toBeGreaterThanOrEqual(1);

    // Verify count "28" is displayed
    expect(screen.getByText("28")).toBeInTheDocument();
  });

  it("displays theme-styled error/empty state when no results match search query", async () => {
    render(
      <MemoryRouter>
        <TranslationProvider>
          <SourcesAndArchives />
        </TranslationProvider>
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText(/Rechercher par nom d'archive/i);
    fireEvent.change(searchInput, { target: { value: "xyznonexistentquery999" } });

    // Verify theme-styled error box
    expect(screen.getByText(/Recherche Infructueuse/i)).toBeInTheDocument();
    expect(screen.getByText(/Réinitialiser les filtres/i)).toBeInTheDocument();

    // Resetting filters restores archives
    fireEvent.click(screen.getByText(/Réinitialiser les filtres/i));
    expect(screen.queryByText(/Recherche Infructueuse/i)).not.toBeInTheDocument();
  });
});
