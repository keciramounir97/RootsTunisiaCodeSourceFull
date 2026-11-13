import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Subscriptions from "../subscriptions";
import { TranslationProvider } from "../../context/TranslationContext";
import { ThemeProvider } from "../../context/ThemeContext";
import { CurrencyProvider } from "../../context/CurrencyContext";
import { AuthProvider } from "../../admin/components/AuthContext";

// Mock API client
vi.mock("../../api/client", () => ({
  api: {
    get: vi.fn().mockImplementation((url: string) => {
      if (url.includes("/subscriptions/tiers")) {
        return Promise.resolve({
          data: [
            {
              id: 1,
              name: "Découverte Patrimoine",
              price: 0,
              badge: "Accès Gratuit",
              description: "Visualisation d’arbres et répertoires d'archives.",
              is_active: true,
            },
            {
              id: 2,
              name: "Chercheur & Actes",
              price: 1.99,
              badge: "Recommandé — Actes & Registres",
              description: "Accès complet aux actes d’état civil numérisés.",
              is_active: true,
            },
            {
              id: 3,
              name: "Historien Pro",
              price: 3.99,
              badge: "Recherche Avancée & Expert",
              description: "Assistance aux recherches ciblées et paléographie.",
              is_active: true,
            },
          ],
        });
      }
      return Promise.resolve({ data: [] });
    }),
  },
}));

function renderSubscriptionsPage() {
  return render(
    <MemoryRouter initialEntries={["/subscriptions"]}>
      <ThemeProvider>
        <TranslationProvider>
          <AuthProvider>
            <CurrencyProvider>
              <Subscriptions />
            </CurrencyProvider>
          </AuthProvider>
        </TranslationProvider>
      </ThemeProvider>
    </MemoryRouter>
  );
}

describe("Subscriptions Page Redesign", () => {
  it("renders the redesigned hero, toolbar, and the 3 tiers with themed action buttons", async () => {
    renderSubscriptionsPage();

    // 1. Page Hero & Floating Toolbar
    expect(
      screen.getByText(/Des forfaits pour chaque famille et chercheur tunisien/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Abonnements & Accès aux Actes/i)
    ).toBeInTheDocument();

    // 2. The 3 Tier Cards
    expect(screen.getAllByText(/Découverte Patrimoine/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Chercheur & Actes/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Historien Pro/i).length).toBeGreaterThanOrEqual(1);

    // 3. Recommended Featured Badge
    expect(
      screen.getByText(/RECOMMANDÉ · ACTES & ÉTAT CIVIL/i)
    ).toBeInTheDocument();

    // 4. Redesigned Themed Action Buttons
    expect(
      screen.getByRole("button", { name: /Commencer Gratuitement/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Activer la Formule Chercheur/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Choisir la Formule Historien Pro/i })
    ).toBeInTheDocument();

    // 5. Reassurance Badges
    expect(screen.getByText(/Paiement 100% Sécurisé/i)).toBeInTheDocument();
    expect(screen.getByText(/Sans Aucun Engagement/i)).toBeInTheDocument();
    expect(screen.getByText(/Archives Authentifiées/i)).toBeInTheDocument();

    // 6. Comparison Table
    expect(screen.getByText(/Comparatif Détaillé des Formules/i)).toBeInTheDocument();
    expect(screen.getByText(/Prestations & Dépouillements/i)).toBeInTheDocument();
  });

  it("handles currency dropdown opening and selecting currency", async () => {
    renderSubscriptionsPage();

    // Currency trigger button
    const currencyBtn = screen.getByRole("button", { name: /Devise/i });
    expect(currencyBtn).toBeInTheDocument();

    // Open dropdown
    fireEvent.click(currencyBtn);
    expect(screen.getByText(/Sélectionnez votre devise/i)).toBeInTheDocument();

    // Look for TND option and click
    const tndOption = screen.getByRole("option", { name: /TND/i });
    expect(tndOption).toBeInTheDocument();
    fireEvent.click(tndOption);

    // Dropdown closes and currency updates
    expect(screen.queryByText(/Sélectionnez votre devise/i)).toBeNull();
  });

  it("toggles billing cycle between monthly and annual with -17% discount", async () => {
    renderSubscriptionsPage();

    const annualBtn = screen.getByRole("button", { name: /Annuel/i });
    expect(annualBtn).toBeInTheDocument();

    fireEvent.click(annualBtn);
    expect(annualBtn).toHaveClass("bg-gradient-to-r");
  });

  it("opens and closes the technical quotas modal", async () => {
    renderSubscriptionsPage();

    const quotaBtns = screen.getAllByRole("button", { name: /Quotas & stockage inclus/i });
    expect(quotaBtns.length).toBeGreaterThanOrEqual(1);

    fireEvent.click(quotaBtns[0]);
    expect(screen.getByText(/Quotas de Stockage & Limites Techniques/i)).toBeInTheDocument();

    // Close button
    const closeBtn = screen.getByRole("button", { name: /Fermer/i });
    fireEvent.click(closeBtn);
    expect(screen.queryByText(/Quotas de Stockage & Limites Techniques/i)).toBeNull();
  });
});
