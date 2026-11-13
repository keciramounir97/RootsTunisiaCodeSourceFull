import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import FAQPage from "../FAQ";
import Navbar from "../../components/Navbar";
import { TranslationProvider } from "../../context/TranslationContext";

vi.mock("../../api/client", () => ({
  api: {
    get: vi.fn().mockResolvedValue({ data: [] }),
  },
}));

vi.mock("../../admin/components/AuthContext", () => ({
  useAuth: () => ({
    user: null,
    isAdmin: false,
    logout: vi.fn(),
  }),
}));

describe("FAQ Page & Navbar Integration", () => {
  it("renders the dedicated FAQ page with categories and search filtering", () => {
    render(
      <MemoryRouter>
        <TranslationProvider>
          <FAQPage />
        </TranslationProvider>
      </MemoryRouter>
    );

    // Hero title
    expect(screen.getByRole("heading", { name: /Foire Aux Questions/i })).toBeInTheDocument();

    // Category pills exist
    expect(screen.getByRole("button", { name: /Toutes les Questions/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Abonnements & Tarifs/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Prestations & Déchiffrage/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Arbres & GEDCOM/i })).toBeInTheDocument();

    // Specific questions exist
    expect(
      screen.getByText(/Qu'est-ce qui différencie Roots Tunisia des sites d'arbres gratuits/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Comment se déroule la prise en charge d'un dossier de recherche ou de transcription/i)
    ).toBeInTheDocument();

    // Search filter works
    const searchInput = screen.getByPlaceholderText(/Rechercher une question/i);
    fireEvent.change(searchInput, { target: { value: "GEDCOM" } });

    expect(screen.getByText(/Quels formats de fichiers GEDCOM sont supportés/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/Qu'est-ce qui différencie Roots Tunisia des sites d'arbres gratuits/i)
    ).not.toBeInTheDocument();
  });

  it("does not render separate FAQ or À Propos links in the navbar since they are merged into Contact", () => {
    render(
      <MemoryRouter>
        <TranslationProvider>
          <Navbar />
        </TranslationProvider>
      </MemoryRouter>
    );

    // FAQ and À Propos links are removed from Navbar
    expect(screen.queryByRole("link", { name: /^FAQ$/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /^À Propos$/i })).not.toBeInTheDocument();

    // Help Center link exists
    const helpLinks = screen.getAllByRole("link", { name: /aide|help|contact/i });
    expect(helpLinks.length).toBeGreaterThanOrEqual(1);
  });
});

