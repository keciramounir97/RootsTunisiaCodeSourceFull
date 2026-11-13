import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Periods from "../periods";
import PeriodDetail from "../PeriodDetail";
import { TranslationProvider } from "../../context/TranslationContext";
import { TUNISIAN_HISTORICAL_ERAS } from "../../data/historicalMapData";

// Mock API client
vi.mock("../../api/client", () => ({
  api: {
    get: vi.fn().mockImplementation((url: string) => {
      if (url.includes("/periods/stats")) {
        return Promise.resolve({
          data: {
            ottomane: { total: 3, documents: 2, trees: 1, books: 0, gallery: 0, audios: 0 },
            hafside: { total: 1, documents: 1, trees: 0, books: 0, gallery: 0, audios: 0 },
          },
        });
      }
      if (url.includes("/sources")) {
        return Promise.resolve({
          data: [
            {
              id: 1,
              link_id: 1,
              period_id: "ottomane",
              source_type: "document",
              source_id: 101,
              title: "Defter des Janissaires de Tunis (1605)",
              description: "Registre de la milice ottomane de Tunis",
              archive_source: "Archives Nationales de Tunisie — La Kasbah",
              document_code: "ANT-DEF-1605",
              year: "1605",
            },
          ],
        });
      }
      return Promise.resolve({ data: [] });
    }),
  },
}));

describe("Periods Page", () => {
  it("renders all 12 historical eras in styled cards like Sources & Archives", async () => {
    render(
      <MemoryRouter initialEntries={["/periods"]}>
        <TranslationProvider>
          <Periods />
        </TranslationProvider>
      </MemoryRouter>
    );

    // Checks presence of all key eras
    expect(screen.getByText(/Les Grandes Périodes de la Tunisie/i)).toBeInTheDocument();
    expect(screen.getByText(/Antiquité Punique & Carthage/i)).toBeInTheDocument();
    expect(screen.getByText(/Afrique Proconsulaire & Empire Romain/i)).toBeInTheDocument();
    expect(screen.getByText(/Régence Ottomane de Tunis & Dynastie Mouradite/i)).toBeInTheDocument();
    expect(screen.getByText(/Sultanat Hafside de Tunis & Réfugiés Andalous/i)).toBeInTheDocument();
    expect(screen.getByText(/Beylicat Husseinite & Les 60 Caïdats/i)).toBeInTheDocument();
    expect(screen.getByText(/République Tunisienne Moderne & 24 Gouvernorats/i)).toBeInTheDocument();

    // Verify 12 cards are displayed with redesigned minimalist action button
    const detailLinks = screen.getAllByText(/Découvrir la période/i);
    expect(detailLinks.length).toBe(TUNISIAN_HISTORICAL_ERAS.length);
  });
});

describe("Period Detail Page", () => {
  it("renders rich historical information for the selected era including leaders, families, and Tunis role", async () => {
    render(
      <MemoryRouter initialEntries={["/periods/ottomane"]}>
        <TranslationProvider>
          <Routes>
            <Route path="/periods/:periodId" element={<PeriodDetail />} />
          </Routes>
        </TranslationProvider>
      </MemoryRouter>
    );

    // Title and Arabic title
    expect(screen.getAllByText(/Régence Ottomane de Tunis & Dynastie Mouradite/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/إيالة تونس العثمانية والدولة المرادية/i).length).toBeGreaterThanOrEqual(1);

    // Tunis Role Banner is present
    expect(screen.getByText(/Le Rayonnement & les Institutions de Tunis/i)).toBeInTheDocument();

    // Research chapters tab is present and active by default
    expect(screen.getByText(/Dossier de Recherche & Chapitres/i)).toBeInTheDocument();
    expect(screen.getByText(/Monographie Académique & Dossier Pédagogique/i)).toBeInTheDocument();
    expect(screen.getByText(/Sommaire de l'Époque/i)).toBeInTheDocument();
    expect(screen.getByText(/Synthèse Pédagogique du Chapitre/i)).toBeInTheDocument();

    // Tabs are present
    expect(screen.getAllByText(/Documents & Sources Liés/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Dirigeants & Grandes Familles/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Tunis & Institutions d'État/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Contexte, Traités & Registres/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Tribus & Peuplement/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Divisions & Cités/i).length).toBeGreaterThanOrEqual(1);
  });
});
