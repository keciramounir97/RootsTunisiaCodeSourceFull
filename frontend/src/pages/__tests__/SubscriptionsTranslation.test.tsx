import React, { useLayoutEffect } from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SubscriptionsPage from "../subscriptions";
import { TranslationProvider, useTranslation } from "../../context/TranslationContext";
import { CurrencyProvider } from "../../context/CurrencyContext";

import fr from "../../locales/fr.json";
import en from "../../locales/en.json";
import ar from "../../locales/ar.json";
import es from "../../locales/es.json";
import itLocale from "../../locales/it.json";
import mt from "../../locales/mt.json";
import {
  DEFAULT_LOCALIZED_TIER_SERVICES,
  localizeCurrencyName,
  localizeTierDescription,
  localizeTierFeature,
  localizeTierName,
  type SubscriptionLocale,
} from "../../utils/subscriptionTranslations";

const mockGet = vi.fn();
const mockNavigate = vi.fn();
let mockCurrentUser: any = null;

vi.mock("../../api/client", () => ({
  api: {
    get: (...args: any[]) => mockGet(...args),
  },
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../../admin/components/AuthContext", () => ({
  useAuth: () => ({
    user: mockCurrentUser,
    token: mockCurrentUser ? "fake-token" : null,
    isAuthenticated: Boolean(mockCurrentUser),
  }),
}));

const LOCALES: Record<SubscriptionLocale, Record<string, any>> = {
  fr,
  en,
  ar,
  es,
  it: itLocale,
  mt,
};

const LIVE_DB_TIERS = [
  {
    id: 1,
    name: "Découverte Patrimoine",
    priceMonthly: 0,
    priceYearly: 0,
    tagline: "Gratuit pour démarrer",
    badge: "Accès Gratuit",
    description:
      "Idéal pour débuter votre arbre généalogique familial et explorer l'annuaire des patronymes tunisiens.",
    features: [
      "Création et édition de votre arbre familial (jusqu'à 50 individus)",
      "Exploration de l'annuaire historique des noms de famille tunisiens",
      "Consultation de la carte interactive des archives et lieux de mémoire",
      "Accès aux guides méthodologiques de recherche généalogique en Tunisie",
      "Sauvegarde sécurisée de vos premières fiches et notes familiales",
    ],
    limits: {
      trees: 1,
      individuals: 50,
      savedSources: 10,
      researchNotes: 10,
      researchTasks: 10,
      galleryImages: 15,
      audioFiles: 3,
      documents: 10,
    },
  },
  {
    id: 2,
    name: "Chercheur & Actes",
    priceMonthly: 1.99,
    priceYearly: 19.99,
    tagline: "Accès aux actes & registres",
    badge: "Le Plus Populaire — Actes & Registres",
    description:
      "L'accès complet aux registres numérisés, actes d'état civil, décrets de naturalisation et archives historiques.",
    features: [
      "Consultation intégrale des actes de naissance, mariage et décès numérisés",
      "Accès aux registres paroissiaux, consulaires et sijillats notariaux (Adoul)",
      "Recherche dans les décrets de naturalisation (1924–1927) et recensements",
      "Téléchargement des actes et manuscrits originaux en haute résolution",
      "5 arbres généalogiques complets (jusqu'à 2 000 individus) & export GEDCOM",
      "Support prioritaire par nos archivistes sous 24h",
    ],
    limits: {
      trees: 5,
      individuals: 2000,
      savedSources: 250,
      researchNotes: 250,
      researchTasks: 150,
      galleryImages: 300,
      audioFiles: 50,
      documents: 250,
    },
  },
  {
    id: 3,
    name: "Historien & Généalogie Pro",
    priceMonthly: 3.99,
    priceYearly: 39.99,
    tagline: "Assistance & recherche avancée",
    badge: "Recherche Avancée & Assistance Dédiée",
    description:
      "Pour les recherches approfondies sur plusieurs lignées avec aide au déchiffrage paléographique et accompagnement expert.",
    features: [
      "Toutes les archives et privilèges de la formule Chercheur & Actes",
      "Arbres généalogiques, individus, actes et galerie multimédia illimités",
      "Aide au déchiffrage et traduction d'actes anciens (arabe, ottoman, italien, français)",
      "Recherches ciblées sur demande dans les fonds d'archives nationaux et diocésains",
      "Vérification de filiation et constitution de dossier historique certifié",
      "Accompagnement personnalisé par un généalogiste référent (WhatsApp & visio)",
    ],
    limits: {
      trees: 999999,
      individuals: 999999,
      savedSources: 999999,
      researchNotes: 999999,
      researchTasks: 999999,
      galleryImages: 999999,
      audioFiles: 999999,
      documents: 999999,
    },
  },
];

const LIVE_DB_CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar", rate: 1, isDefault: true, isActive: true },
  { code: "TND", symbol: "DT", name: "Dinar Tunisien", rate: 3.1, isDefault: false, isActive: true },
  { code: "EUR", symbol: "€", name: "Euro", rate: 0.92, isDefault: false, isActive: true },
  { code: "GBP", symbol: "£", name: "Livre Sterling", rate: 0.79, isDefault: false, isActive: true },
  { code: "CAD", symbol: "C$", name: "Dollar Canadien", rate: 1.36, isDefault: false, isActive: true },
  { code: "SAR", symbol: "SR", name: "Riyal Saoudien", rate: 3.75, isDefault: false, isActive: true },
];

function LocaleInitializer({
  locale,
  children,
}: {
  locale: SubscriptionLocale;
  children: React.ReactNode;
}) {
  const { locale: activeLocale, setLocale } = useTranslation();
  useLayoutEffect(() => {
    if (activeLocale !== locale) {
      setLocale(locale);
    }
  }, [activeLocale, locale, setLocale]);
  return <>{children}</>;
}

function renderSubscriptionsWithLocale(locale: SubscriptionLocale, useFallbackApi = false) {
  window.localStorage.setItem("roots_locale", locale);
  window.localStorage.setItem("locale", locale);
  window.localStorage.setItem("roots_currency", "USD");

  mockGet.mockImplementation((url: string) => {
    if (url.includes("/subscriptions/tiers")) {
      if (useFallbackApi) {
        return Promise.reject(new Error("Offline fallback test"));
      }
      return Promise.resolve({ data: LIVE_DB_TIERS });
    }
    if (url.includes("/currencies")) {
      return Promise.resolve({ data: LIVE_DB_CURRENCIES });
    }
    if (url.includes("/translations/")) {
      return Promise.resolve({ data: {} });
    }
    return Promise.resolve({ data: {} });
  });

  return render(
    <MemoryRouter initialEntries={["/subscriptions"]}>
      <TranslationProvider>
        <LocaleInitializer locale={locale}>
          <CurrencyProvider>
            <SubscriptionsPage />
          </CurrencyProvider>
        </LocaleInitializer>
      </TranslationProvider>
    </MemoryRouter>
  );
}

const FORBIDDEN_FRENCH_FRAGMENTS = [
  "Formules d'Accès aux Archives",
  "Des forfaits pour chaque famille et chercheur tunisien",
  "Abonnements & Accès aux Actes",
  "Sans engagement · Annulation en 1 clic",
  "Sélectionnez votre devise",
  "2 mois offerts",
  "RECOMMANDÉ · ACTES & ÉTAT CIVIL",
  "RECHERCHE AVANCÉE & EXPERT",
  "Votre Formule Actuelle",
  "Dépôts & Sijillats",
  "Assistance Paléographique",
  "Exploration Libre",
  "Le Choix Idéal",
  "/ pour toujours",
  "Inclus sans frais :",
  "Prestations & Privilèges inclus :",
  "Quotas & stockage inclus",
  "Voir détails",
  "Commencer Gratuitement",
  "Activer la Formule Chercheur",
  "Choisir la Formule Historien Pro",
  "Paiement 100% Sécurisé",
  "Chiffrement bancaire SSL 256-bit",
  "Sans Aucun Engagement",
  "Archives Authentifiées",
  "Comparatif Détaillé des Formules",
  "Prestations & Dépouillements",
  "Une question avant de vous abonner ?",
  "Quotas de Stockage & Limites Techniques",
  "Capacités d'hébergement allouées à votre compte",
  "Découverte Patrimoine",
  "Chercheur & Actes",
  "Historien & Généalogie Pro",
];

describe("SubscriptionsPage 6-Language Full Translation & RTL Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCurrentUser = null;
    window.localStorage.clear();
  });

  it.each(["fr", "en", "ar", "es", "it", "mt"] as SubscriptionLocale[])(
    "renders every section, card, DB tier, currency dropdown, comparison row, CTA, and quota modal in %s",
    async (locale) => {
      const dict = LOCALES[locale];
      const { container } = renderSubscriptionsWithLocale(locale);

      // 1. Wait for DB tiers to load and verify localized tier names
      const expectedTier1Name = localizeTierName(LIVE_DB_TIERS[0].name, 1, locale);
      const expectedTier2Name = localizeTierName(LIVE_DB_TIERS[1].name, 2, locale);
      const expectedTier3Name = localizeTierName(LIVE_DB_TIERS[2].name, 3, locale);

      await waitFor(() => {
        expect(screen.getAllByText(expectedTier1Name).length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText(expectedTier2Name).length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText(expectedTier3Name).length).toBeGreaterThanOrEqual(1);
      });

      // 2. Verify RTL / LTR direction
      const rootWrapper = container.firstElementChild as HTMLElement;
      expect(rootWrapper).toHaveAttribute("dir", locale === "ar" ? "rtl" : "ltr");

      // 3. Verify Hero & Toolbar
      expect(screen.getByText(dict.subscriptions_hero_eyebrow)).toBeInTheDocument();
      expect(screen.getByText(dict.subscriptions_hero_title)).toBeInTheDocument();
      expect(screen.getByText(dict.subscriptions_hero_sub)).toBeInTheDocument();
      expect(screen.getByText(dict.subscriptions_toolbar_title)).toBeInTheDocument();
      expect(screen.getByText(dict.subscriptions_toolbar_sub)).toBeInTheDocument();

      // 4. Verify Billing Cycle Toggle & Annual Discount Pill
      expect(screen.getByRole("button", { name: dict.sub_billing_monthly })).toBeInTheDocument();
      expect(screen.getByText(dict.sub_billing_annual)).toBeInTheDocument();
      expect(screen.getByText(dict.sub_annual_discount)).toBeInTheDocument();

      // Verify "/ month" and switching to "/ year"
      expect(screen.getAllByText(dict.per_month).length).toBeGreaterThanOrEqual(2);
      fireEvent.click(screen.getByText(dict.sub_billing_annual));
      expect(screen.getAllByText(dict.per_year).length).toBeGreaterThanOrEqual(2);
      fireEvent.click(screen.getByRole("button", { name: dict.sub_billing_monthly }));

      // 5. Verify Currency Selector & Localized Currency Names in Dropdown
      const currencyBtn = screen.getByRole("button", {
        name: new RegExp(dict.sub_currency_label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"),
      });
      fireEvent.click(currencyBtn);

      const listbox = screen.getByRole("listbox");
      expect(within(listbox).getByText(dict.sub_select_currency)).toBeInTheDocument();
      for (const curr of LIVE_DB_CURRENCIES) {
        const expectedCurrName = localizeCurrencyName(curr.code, curr.name, locale);
        expect(within(listbox).getByText(expectedCurrName)).toBeInTheDocument();
      }
      // Close dropdown
      fireEvent.click(currencyBtn);

      // 6. Verify Tier Badges, Eyebrows, Pills, Descriptions, and Feature Bullets
      expect(screen.getByText(dict.sub_featured_top_badge)).toBeInTheDocument();
      expect(screen.getByText(dict.sub_historian_top_badge)).toBeInTheDocument();
      expect(screen.getByText(dict.sub_tier_1_eyebrow)).toBeInTheDocument();
      expect(screen.getByText(dict.sub_tier_2_eyebrow)).toBeInTheDocument();
      expect(screen.getByText(dict.sub_tier_3_eyebrow)).toBeInTheDocument();
      expect(screen.getByText(dict.sub_tier_1_pill)).toBeInTheDocument();
      expect(screen.getByText(dict.sub_tier_2_pill)).toBeInTheDocument();
      expect(screen.getByText(dict.sub_tier_3_pill)).toBeInTheDocument();
      expect(screen.getByText(dict.sub_period_forever)).toBeInTheDocument();
      expect(screen.getByText(dict.sub_included_free)).toBeInTheDocument();
      expect(screen.getAllByText(dict.sub_included_paid).length).toBe(2);

      for (const dbTier of LIVE_DB_TIERS) {
        const expectedDesc = localizeTierDescription(dbTier.description, dbTier.id, locale);
        expect(screen.getByText(expectedDesc)).toBeInTheDocument();
        for (const rawBullet of dbTier.features) {
          const expectedBullet = localizeTierFeature(rawBullet, locale);
          expect(screen.getByText(expectedBullet)).toBeInTheDocument();
        }
      }

      // 7. Verify Action Buttons
      expect(screen.getByRole("button", { name: dict.sub_btn_basic })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: dict.sub_btn_featured })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: dict.sub_btn_historian })).toBeInTheDocument();

      // 8. Verify 3-Point Trust Strip
      expect(screen.getByText(dict.sub_trust_1_title)).toBeInTheDocument();
      expect(screen.getByText(dict.sub_trust_1_desc)).toBeInTheDocument();
      expect(screen.getByText(dict.sub_trust_2_title)).toBeInTheDocument();
      expect(screen.getByText(dict.sub_trust_2_desc)).toBeInTheDocument();
      expect(screen.getByText(dict.sub_trust_3_title)).toBeInTheDocument();
      expect(screen.getByText(dict.sub_trust_3_desc)).toBeInTheDocument();

      // 9. Verify Comparison Table Headers, Row Labels, and Values
      expect(screen.getByText(dict.sub_comp_eyebrow)).toBeInTheDocument();
      expect(screen.getByText(dict.sub_comp_title)).toBeInTheDocument();
      expect(screen.getByText(dict.sub_comp_intro)).toBeInTheDocument();
      expect(screen.getByText(dict.sub_comp_col_features)).toBeInTheDocument();
      expect(screen.getByText(dict.comp_service_nature)).toBeInTheDocument();
      expect(screen.getByText(dict.comp_civil_records)).toBeInTheDocument();
      expect(screen.getByText(dict.comp_naturalizations)).toBeInTheDocument();
      expect(screen.getByText(dict.comp_hd_downloads)).toBeInTheDocument();
      expect(screen.getByText(dict.comp_translation_service)).toBeInTheDocument();
      expect(screen.getByText(dict.comp_support)).toBeInTheDocument();

      expect(screen.getByText(dict.sub_comp_val_profile_1)).toBeInTheDocument();
      expect(screen.getByText(dict.sub_comp_val_profile_2)).toBeInTheDocument();
      expect(screen.getByText(dict.sub_comp_val_profile_3)).toBeInTheDocument();
      expect(screen.getByText(dict.sub_comp_val_nat_1)).toBeInTheDocument();
      expect(screen.getByText(dict.sub_comp_val_nat_2)).toBeInTheDocument();
      expect(screen.getByText(dict.sub_comp_val_nat_3)).toBeInTheDocument();
      expect(screen.getByText(dict.sub_comp_val_sup_1)).toBeInTheDocument();
      expect(screen.getByText(dict.sub_comp_val_sup_2)).toBeInTheDocument();
      expect(screen.getByText(dict.sub_comp_val_sup_3)).toBeInTheDocument();

      // 10. Verify Help Center CTA
      expect(screen.getByText(dict.sub_cta_title)).toBeInTheDocument();
      expect(screen.getByText(dict.sub_cta_desc)).toBeInTheDocument();
      expect(screen.getByText(dict.sub_cta_btn)).toBeInTheDocument();

      // 11. Verify Technical Quotas Modal (Open, Switch Tiers, Unlimited, Close)
      const quotaTriggers = screen.getAllByText(dict.sub_quotas_trigger);
      expect(quotaTriggers.length).toBe(3);
      expect(screen.getAllByText(dict.sub_view_details).length).toBe(3);

      fireEvent.click(quotaTriggers[0]);

      const dialog = await screen.findByRole("dialog");
      expect(within(dialog).getByText(dict.sub_quotas_modal_title)).toBeInTheDocument();
      expect(within(dialog).getByText(dict.sub_quotas_modal_sub)).toBeInTheDocument();

      // All 8 quota labels
      expect(within(dialog).getByText(dict.sub_quota_trees)).toBeInTheDocument();
      expect(within(dialog).getByText(dict.sub_quota_individuals)).toBeInTheDocument();
      expect(within(dialog).getByText(dict.sub_quota_sources)).toBeInTheDocument();
      expect(within(dialog).getByText(dict.sub_quota_notes)).toBeInTheDocument();
      expect(within(dialog).getByText(dict.sub_quota_tasks)).toBeInTheDocument();
      expect(within(dialog).getByText(dict.sub_quota_gallery)).toBeInTheDocument();
      expect(within(dialog).getByText(dict.sub_quota_audios)).toBeInTheDocument();
      expect(within(dialog).getByText(dict.sub_quota_documents)).toBeInTheDocument();

      // Switch to Tier 3 inside modal to verify localized "Unlimited"
      const tier3ModalPill = within(dialog).getByRole("button", { name: expectedTier3Name });
      fireEvent.click(tier3ModalPill);
      expect(within(dialog).getAllByText(dict.comp_val_unlimited).length).toBe(8);

      // Check zero French leakage in non-FR locales while modal is open
      if (locale !== "fr") {
        const fullText = container.textContent || "";
        for (const frPhrase of FORBIDDEN_FRENCH_FRAGMENTS) {
          expect(fullText).not.toContain(frPhrase);
        }
      }

      // Close modal via primary close button
      const closeBtn = within(dialog).getByRole("button", { name: dict.sub_modal_close });
      fireEvent.click(closeBtn);
      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });
    }
  );

  it.each(["en", "ar", "es", "it", "mt"] as SubscriptionLocale[])(
    "renders fallback tiers & active current plan state in %s with zero French leakage",
    async (locale) => {
      mockCurrentUser = { id: 99, tier_id: 2, role: "user" };
      const dict = LOCALES[locale];
      const { container } = renderSubscriptionsWithLocale(locale, true);

      await waitFor(() => {
        expect(screen.getByText(dict.sub_current_plan_badge)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: dict.sub_btn_current })).toBeDisabled();
      });

      // Check fallback services are localized for all 3 tiers
      for (const tierId of [1, 2, 3]) {
        for (const bullet of DEFAULT_LOCALIZED_TIER_SERVICES[tierId][locale]) {
          expect(screen.getByText(bullet)).toBeInTheDocument();
        }
      }

      const fullText = container.textContent || "";
      for (const frPhrase of FORBIDDEN_FRENCH_FRAGMENTS) {
        expect(fullText).not.toContain(frPhrase);
      }
    }
  );
});
