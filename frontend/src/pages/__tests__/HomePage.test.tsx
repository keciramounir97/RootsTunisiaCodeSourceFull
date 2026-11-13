import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "../home";
import { TranslationProvider } from "../../context/TranslationContext";
import { ThemeProvider } from "../../context/ThemeContext";

// Mock API client
vi.mock("../../api/client", () => ({
  api: {
    get: vi.fn().mockImplementation((url: string) => {
      if (url.includes("/banner-slides")) {
        return Promise.resolve({ data: [] });
      }
      return Promise.resolve({ data: [] });
    }),
  },
}));

function renderHomePage() {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <ThemeProvider>
        <TranslationProvider>
          <Home />
        </TranslationProvider>
      </ThemeProvider>
    </MemoryRouter>
  );
}

describe("Home Page Redesign", () => {
  it("renders the 3 screenshot sections: Hero Slider, Stats Bar, and Preserve Banner", async () => {
    renderHomePage();

    // 1. Hero Slider
    expect(
      screen.getByText(/Retracez Vos Racines Familiales Tunisiennes/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Porte Cloutée Traditionnelle de la Médina de Tunis/i)
    ).toBeInTheDocument();

    // 2. Stats Bar (4 columns)
    expect(screen.getAllByText(/1860–1956/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Périodes & Actes Documentés/i)).toBeInTheDocument();
    expect(screen.getAllByText("24").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Gouvernorats Tunisiens Couverts/i)).toBeInTheDocument();
    expect(screen.getAllByText(/12 500\+/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Patronymes & Individus Répertoriés/i)).toBeInTheDocument();
    expect(screen.getByText("19")).toBeInTheDocument();
    expect(screen.getByText(/Grands Fonds d'Archives & Sijillats/i)).toBeInTheDocument();

    // 3. Preserve Banner (El Jem)
    expect(
      screen.getByText(/Préservez Votre Lignée Familiale Comme un Monument Vivant/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/À l'image des arches de pierre d'El Jem/i)
    ).toBeInTheDocument();
  });

  it("restores the interactive map section and renders the infinitely moving periods marquee under it", async () => {
    const { container } = renderHomePage();

    // 4. Restored Interactive Map section
    const mapSection = container.querySelector("#atlas-map");
    expect(mapSection).toBeInTheDocument();

    // The freemium preview banner and fullscreen button bar were removed from the homepage map as requested
    expect(
      screen.queryByText(/Aperçu Découverte · Version Complète pour Abonnés/i)
    ).toBeNull();
    expect(
      screen.queryByText(/Débloquer la Carte Complète \(Paliers 1 & 2\)/i)
    ).toBeNull();

    // 4.5 Infinite Marquee Section of Periods under Interactive Map (renamed shorter)
    const marqueeSection = container.querySelector("#periods-infinite-marquee");
    expect(marqueeSection).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Les 12 Périodes/i })
    ).toBeInTheDocument();

    // The marquee renders period cards with the same content as the periods page
    expect(screen.getAllByText(/Régence Ottomane de Tunis & Dynastie Mouradite/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Antiquité Punique & Carthage/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Beylicat Husseinite & Les 60 Caïdats/i).length).toBeGreaterThanOrEqual(1);

    // 4.6 Infinite Marquee Section of Sources under Periods Marquee (renamed shorter)
    const sourcesMarqueeSection = container.querySelector("#sources-infinite-marquee");
    expect(sourcesMarqueeSection).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Sources & Fonds d'Archives/i })
    ).toBeInTheDocument();

    // The sources marquee renders external archive cards with badges and links
    expect(screen.getAllByText(/Archives Nationales de Tunisie \(ANT\)/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Centre des Archives Diplomatiques de Nantes/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Archives Municipales de la Ville de Tunis/i).length).toBeGreaterThanOrEqual(1);

    // 5. Genealogical Tree Section
    const treesSection = container.querySelector("#genealogical-trees");
    expect(treesSection).toBeInTheDocument();
    expect(
      screen.getByText(/Arbres Généalogiques des Familles Tunisiennes/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Famille Brakha : D'El Kef à Tunis/i)).toBeInTheDocument();
    expect(screen.getByText(/Famille Cassar : Djerba & La Goulette/i)).toBeInTheDocument();

    // 6. Heritage Gallery Section
    const gallerySection = container.querySelector("#heritage-gallery");
    expect(gallerySection).toBeInTheDocument();
    expect(
      screen.getByText(/Galerie & Photothèque Historique/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Portes Cloutées de la Médina/i)).toBeInTheDocument();
    expect(screen.getByText(/Village de Sidi Bou Saïd/i)).toBeInTheDocument();

    // 7. Articles & Monographs Section
    const articlesSection = container.querySelector("#articles-section");
    expect(articlesSection).toBeInTheDocument();
    expect(
      screen.getByText(/Articles & Monographies de Référence/i)
    ).toBeInTheDocument();
    expect(screen.getAllByText(/Majba/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Traité Fondamental/i)).toBeInTheDocument();

    // 8. Combined Collections Section (3 cards for the 3 remaining gallery pages)
    const collectionsSection = container.querySelector("#archival-collections");
    expect(collectionsSection).toBeInTheDocument();
    expect(
      screen.getByText(/Documents, Sijillats, Manuscrits & Mémoire Orale/i)
    ).toBeInTheDocument();
    expect(screen.getAllByText(/Manuscrits & Ouvrages/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Documents & Sijillats/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Récits Oraux & Audio/i).length).toBeGreaterThanOrEqual(1);

    // Verify presence of working page navigation links
    const allLinks = screen.getAllByRole("link");
    const hrefs = allLinks.map((l) => l.getAttribute("href"));

    expect(hrefs).toContain("/periods");
    expect(hrefs).toContain("/sources");
    expect(hrefs).toContain("/gallery/trees");
    expect(hrefs).toContain("/gallery/images");
    expect(hrefs).toContain("/articles");
    expect(hrefs).toContain("/gallery/documents");
    expect(hrefs).toContain("/gallery/books");
    expect(hrefs).toContain("/gallery/audios");
  });
});
