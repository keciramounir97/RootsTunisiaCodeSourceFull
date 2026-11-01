import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { TranslationProvider } from "../context/TranslationContext";
import { ThemeProvider } from "../context/ThemeContext";

import GalleryArticles from "./GalleryArticles";
import GalleryAudios from "./GalleryAudios";
import GalleryBooks from "./GalleryBooks";
import GalleryDocuments from "./GalleryDocuments";
import GalleryImages from "./GalleryImages";
import GalleryTrees from "./GalleryTrees";

import { AuthProvider } from "../admin/components/AuthContext";

function renderWithProviders(ui: React.ReactNode) {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <ThemeProvider>
          <TranslationProvider>{ui}</TranslationProvider>
        </ThemeProvider>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe("Roots Tunisia Sub-Gallery Pages", () => {
  it("renders GalleryArticles page cleanly", () => {
    renderWithProviders(<GalleryArticles />);
    expect(screen.getAllByText(/Articles|Stories|Récits/i)[0]).toBeInTheDocument();
  });

  it("renders GalleryAudios page cleanly", () => {
    renderWithProviders(<GalleryAudios />);
    expect(screen.getAllByText(/Oral Histories|Audio/i)[0]).toBeInTheDocument();
  });

  it("renders GalleryBooks page cleanly", () => {
    renderWithProviders(<GalleryBooks />);
    expect(screen.getAllByText(/Manuscripts|Books/i)[0]).toBeInTheDocument();
  });

  it("renders GalleryDocuments page cleanly", () => {
    renderWithProviders(<GalleryDocuments />);
    expect(screen.getAllByText(/Documents|Extracts/i)[0]).toBeInTheDocument();
  });

  it("renders GalleryImages page cleanly", () => {
    renderWithProviders(<GalleryImages />);
    expect(screen.getAllByText(/Photo & Visual|Visual Heritage|Galerie Photo|Visuelle|Patrimoine/i)[0]).toBeInTheDocument();
  });

  it("renders GalleryTrees page cleanly", () => {
    renderWithProviders(<GalleryTrees />);
    expect(screen.getAllByText(/Family Trees|Pedigrees|Arbres|Généalogiques|شجرات/i)[0]).toBeInTheDocument();
  });
});
