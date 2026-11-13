import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ServicesPage from "../Services";
import ServiceDetailPage from "../ServiceDetail";
import AdminServicesPage from "../../admin/pages/AdminServices";
import AdminServicesBookingsPage from "../../admin/pages/AdminServicesBookings";
import { TranslationProvider, useTranslation } from "../../context/TranslationContext";
import { SERVICES_UI_BY_LOCALE, LOCALIZED_SERVICES_BY_LOCALE } from "../../utils/servicesCatalogI18n";
import { getTunisiaDropdownText } from "../../utils/navDropdownTranslations";
import { SUPPORTED_LOCALES } from "../../utils/translations";

const mockGet = vi.fn();
const mockPost = vi.fn();
const mockPut = vi.fn();
const mockDelete = vi.fn();

vi.mock("../../api/client", () => ({
  api: {
    get: (...args: any[]) => mockGet(...args),
    post: (...args: any[]) => mockPost(...args),
    put: (...args: any[]) => mockPut(...args),
    delete: (...args: any[]) => mockDelete(...args),
  },
}));

const sampleServices = [
  {
    id: 1,
    slug: "dechiffrage-transcription",
    title: "Déchiffrage & Transcription Paléographique",
    category: "Paléographie",
    price_eur: 25,
    price_usd: 25,
    price_tnd: 80,
    billing_unit: "acte",
    description: "Transcription et traduction française/anglaise d'actes manuscrits.",
    full_offer: "Détails complets de la transcription mot à mot.",
    deliverables: [
      "Transcription intégrale mot à mot",
      "Traduction en français ou anglais",
      "Notes onomastiques sur les patronymes",
    ],
    whatsapp_prefill: "Bonjour Roots Tunisia, je souhaite commander une transcription.",
    is_active: true,
  },
  {
    id: 2,
    slug: "recherche-in-situ-archives",
    title: "Recherche In Situ aux Archives Nationales",
    category: "Recherche In Situ",
    price_eur: 49,
    price_usd: 49,
    price_tnd: 160,
    billing_unit: "dossier",
    description: "Mandat d'un chercheur à Tunis pour retrouver une cote physique.",
    full_offer: "Déplacement in situ à la Kasbah.",
    deliverables: [
      "Déplacement physique aux dépôts",
      "Photographies HD des folios originaux",
    ],
    whatsapp_prefill: "Bonjour Roots Tunisia, je souhaite mandater un chercheur.",
    is_active: true,
  },
];

const sampleBookings = [
  {
    id: 101,
    service_id: 1,
    service_title: "Déchiffrage & Transcription Paléographique",
    client_name: "Yassine Trabelsi",
    client_email: "yassine@example.com",
    client_phone: "+216 98 111 222",
    target_ancestor: "Famille Trabelsi de Sousse",
    message: "J'ai un acte de mariage de 1895 rédigé en arabe maghrébin à déchiffrer.",
    urgency: "urgent",
    preferred_contact: "whatsapp",
    status: "nouveau",
    created_at: "2026-11-11T12:00:00Z",
  },
  {
    id: 102,
    service_id: 2,
    service_title: "Recherche In Situ aux Archives Nationales",
    client_name: "Sophie Martin",
    client_email: "sophie@example.com",
    client_phone: "+33 6 12 34 56 78",
    target_ancestor: "Cassar Xavier",
    message: "Recherche de la cote du décret de naturalisation de 1927.",
    urgency: "standard",
    preferred_contact: "email",
    status: "contacté",
    created_at: "2026-11-11T14:30:00Z",
  },
];

describe("Services & Booking Feature", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("renders public services page dynamically with multi-currency pricing and deliverables", async () => {
    mockGet.mockResolvedValueOnce({ data: sampleServices });

    render(
      <MemoryRouter>
        <TranslationProvider>
          <ServicesPage />
        </TranslationProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Chargement des offres de services/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Déchiffrage & Transcription Paléographique")).toBeInTheDocument();
      expect(screen.getByText("Recherche In Situ aux Archives Nationales")).toBeInTheDocument();
    });

    // Hero diaporama uses Services page copy (not homepage)
    expect(screen.getByText(/Expertise Archivistique & Paléographique/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Nos Prestations & Services/i })).toBeInTheDocument();
    expect(screen.getByRole("tablist", { name: /Diaporama services/i })).toBeInTheDocument();

    // Check no-money client policy badges
    expect(screen.getAllByText(/Consultation Gratuite • Sur Devis/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Réserver une Consultation Gratuite/i).length).toBeGreaterThan(0);

    // Check deliverables
    expect(screen.getByText("Transcription intégrale mot à mot")).toBeInTheDocument();
    expect(screen.getByText("Notes onomastiques sur les patronymes")).toBeInTheDocument();
  });

  it("renders service detail page and submits a client booking successfully", async () => {
    mockGet.mockResolvedValueOnce({ data: sampleServices[0] });
    mockPost.mockResolvedValueOnce({
      data: {
        success: true,
        id: 777,
        booking: { id: 777, client_name: "Mounir Test" },
      },
    });

    render(
      <MemoryRouter initialEntries={["/services/dechiffrage-transcription"]}>
        <TranslationProvider>
          <Routes>
            <Route path="/services/:idOrSlug" element={<ServiceDetailPage />} />
          </Routes>
        </TranslationProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Déchiffrage & Transcription Paléographique")).toBeInTheDocument();
      expect(screen.getByText(/Détails complets de la transcription mot à mot/i)).toBeInTheDocument();
    });

    // Fill form
    fireEvent.change(screen.getByPlaceholderText(/Ex: Karim Ben Salem/i), {
      target: { value: "Mounir Test" },
    });
    fireEvent.change(screen.getByPlaceholderText(/votre@email.com/i), {
      target: { value: "mounir@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/\+216 98 123 456/i), {
      target: { value: "+216 98 765 432" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Décrivez votre besoin/i), {
      target: { value: "Déchiffrage d'un acte manuscrit du tribunal de Tunis" },
    });

    // Select date for zoom consultation
    const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement;
    if (dateInput) {
      fireEvent.change(dateInput, { target: { value: "2026-11-20" } });
    }

    // Submit
    fireEvent.click(screen.getByRole("button", { name: /Confirmer mon Appel Zoom Gratuit/i }));

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith(
        "/services/bookings",
        expect.objectContaining({
          service_id: 1,
          client_name: "Mounir Test",
          client_email: "mounir@example.com",
          client_phone: "+216 98 765 432",
          message: "Déchiffrage d'un acte manuscrit du tribunal de Tunis",
        })
      );
      expect(screen.getByText(/Demande de Consultation Enregistrée/i)).toBeInTheDocument();
    });
  });

  it("renders AdminServices catalog and AdminServicesBookings multi-volet reception tables", async () => {
    mockGet.mockImplementation((url: string) => {
      if (url === "/admin/services") return Promise.resolve({ data: sampleServices });
      if (url === "/admin/services-bookings") return Promise.resolve({ data: sampleBookings });
      return Promise.reject(new Error("unknown url"));
    });

    // 1. Render AdminServices Catalog Page
    const { unmount } = render(
      <MemoryRouter>
        <TranslationProvider>
          <AdminServicesPage />
        </TranslationProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Catalogue des Prestations de Services")).toBeInTheDocument();
      expect(screen.getByText(/Cartes de Prestations Actives/i)).toBeInTheDocument();
      expect(screen.getByText(/Voir les Réservations & Rendez-vous/i)).toBeInTheDocument();
    });

    unmount();

    // 2. Render AdminServicesBookings Reception Page
    render(
      <MemoryRouter>
        <TranslationProvider>
          <AdminServicesBookingsPage />
        </TranslationProvider>
      </MemoryRouter>
    );

    // Wait for bookings and volets
    await waitFor(() => {
      expect(screen.getByText(/Toutes les Réservations \(2\)/i)).toBeInTheDocument();
    });

    // Dedicated Volet tab buttons for each service exist
    const dechiffrageTabs = screen.getAllByText("Déchiffrage & Transcription Paléographique");
    expect(dechiffrageTabs.length).toBeGreaterThanOrEqual(1);

    // Switch to dedicated Volet for Déchiffrage
    const voletBtn = screen.getByRole("button", {
      name: /Déchiffrage & Transcription Paléographique\s*1/i,
    });
    fireEvent.click(voletBtn);

    // Now table should display booking for Yassine Trabelsi
    await waitFor(() => {
      expect(screen.getByText("Yassine Trabelsi")).toBeInTheDocument();
      expect(screen.getByText("+216 98 111 222")).toBeInTheDocument();
      expect(screen.getByText("🎯 Famille Trabelsi de Sousse")).toBeInTheDocument();
    });

    // Sophie Martin (from service 2) should NOT be in this service's dedicated volet table
    expect(screen.queryByText("Sophie Martin")).not.toBeInTheDocument();
  });

  it("translates /services completely (hero, pills, cards, categories, methodology, FAQ) across all 6 languages and sets RTL for Arabic", async () => {
    const frenchOnlySnippets = [
      "Nos Prestations & Services",
      "Toutes les Prestations",
      "Réserver une Consultation Gratuite",
      "Déchiffrage & Transcription Paléographique",
    ];

    for (const loc of SUPPORTED_LOCALES) {
      localStorage.setItem("locale", loc);
      mockGet.mockResolvedValueOnce({ data: [] });

      const ui = SERVICES_UI_BY_LOCALE[loc];
      const { container, unmount } = render(
        <MemoryRouter>
          <TranslationProvider>
            <ServicesPage />
          </TranslationProvider>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(ui.heroTitleGold)).toBeInTheDocument();
        expect(screen.getByText(ui.allCategories)).toBeInTheDocument();
      });

      const rootDiv = container.firstElementChild as HTMLElement;
      expect(rootDiv.getAttribute("dir")).toBe(loc === "ar" ? "rtl" : "ltr");

      // Guarantees strip, methodology & FAQ link
      expect(screen.getAllByText(ui.pill1).length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText(ui.methodTitle)).toBeInTheDocument();
      expect(screen.getByText(ui.faqLinkCta)).toBeInTheDocument();

      // Hero CTA + 6 fallback service cards
      const bookingCtas = screen.getAllByText(ui.bookFreeConsultationCta);
      expect(bookingCtas).toHaveLength(7);
      const locServices = LOCALIZED_SERVICES_BY_LOCALE[loc];
      for (const id of [1, 2, 3, 4, 5, 6]) {
        expect(screen.getByText(locServices[id].title)).toBeInTheDocument();
        expect(screen.getAllByText(locServices[id].category).length).toBeGreaterThanOrEqual(1);
        if (loc === "ar") {
          expect(/[\u0600-\u06FF]/.test(locServices[id].title)).toBe(true);
          expect(/[\u0600-\u06FF]/.test(locServices[id].category)).toBe(true);
        }
      }

      if (loc === "ar") {
        expect(/[\u0600-\u06FF]/.test(ui.heroTitleMain)).toBe(true);
        expect(screen.getAllByText("استشارة مجانية • عرض سعر مخصّص")).toHaveLength(6);
      }

      if (loc !== "fr") {
        for (const snippet of frenchOnlySnippets) {
          expect(screen.queryByText(snippet)).not.toBeInTheDocument();
        }
      }

      unmount();
    }
  });

  it("resets category filter and updates all rendered cards when switching between French and Arabic dynamically", async () => {
    localStorage.setItem("locale", "fr");
    mockGet.mockResolvedValueOnce({ data: [] });

    function LocaleSwitchHarness() {
      const { setLocale } = useTranslation();
      return (
        <>
          <button type="button" onClick={() => setLocale("ar")}>
            Switch AR
          </button>
          <button type="button" onClick={() => setLocale("fr")}>
            Switch FR
          </button>
          <ServicesPage />
        </>
      );
    }

    render(
      <MemoryRouter>
        <TranslationProvider>
          <LocaleSwitchHarness />
        </TranslationProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Déchiffrage & Transcription Paléographique")).toBeInTheDocument();
    });

    // Filter to one French category pill (hero CTA remains + 1 card CTA)
    fireEvent.click(screen.getByRole("button", { name: "Paléographie & Traduction" }));
    expect(screen.getAllByText("Réserver une Consultation Gratuite")).toHaveLength(2);

    // Switch dynamically to Arabic -> filter resets and all 6 cards appear in Arabic
    fireEvent.click(screen.getByRole("button", { name: "Switch AR" }));
    await waitFor(() => {
      expect(screen.getAllByText("احجز استشارة مجانية")).toHaveLength(7);
      expect(screen.getByText(LOCALIZED_SERVICES_BY_LOCALE.ar[1].title)).toBeInTheDocument();
      expect(screen.queryByText("Déchiffrage & Transcription Paléographique")).not.toBeInTheDocument();
    });

    // Switch back dynamically to French -> hero + all 6 cards appear in French
    fireEvent.click(screen.getByRole("button", { name: "Switch FR" }));
    await waitFor(() => {
      expect(screen.getAllByText("Réserver une Consultation Gratuite")).toHaveLength(7);
      expect(screen.getByText("Déchiffrage & Transcription Paléographique")).toBeInTheDocument();
    });
  });

  it("translates /services/:idOrSlug detail & booking page across all 6 languages with canonical fallback", async () => {
    for (const loc of SUPPORTED_LOCALES) {
      localStorage.setItem("locale", loc);
      mockGet.mockRejectedValueOnce(new Error("404"));

      const ui = SERVICES_UI_BY_LOCALE[loc];
      const { container, unmount } = render(
        <MemoryRouter initialEntries={["/services/dechiffrage-transcription-paleographique"]}>
          <TranslationProvider>
            <Routes>
              <Route path="/services/:idOrSlug" element={<ServiceDetailPage />} />
            </Routes>
          </TranslationProvider>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(ui.detailAllServicesBreadcrumb)).toBeInTheDocument();
        expect(screen.getByText(ui.formHeadingZoom)).toBeInTheDocument();
      });

      const rootDiv = container.firstElementChild as HTMLElement;
      expect(rootDiv.getAttribute("dir")).toBe(loc === "ar" ? "rtl" : "ltr");
      expect(screen.getByText(ui.detailFreeBadge)).toBeInTheDocument();
      expect(screen.getByText(ui.submitZoomCta)).toBeInTheDocument();

      if (loc === "ar") {
        expect(screen.getByText(LOCALIZED_SERVICES_BY_LOCALE.ar[1].title)).toBeInTheDocument();
        expect(screen.queryByText("Planifier votre Appel Zoom Gratuit")).not.toBeInTheDocument();
      }

      unmount();
    }
  });

  it("provides Navbar dropdown labels (including nav_services) across all 6 languages", () => {
    for (const loc of SUPPORTED_LOCALES) {
      const label = getTunisiaDropdownText(loc, "nav_services");
      const hint = getTunisiaDropdownText(loc, "nav_services_hint");
      expect(label).toBeTruthy();
      expect(hint).toBeTruthy();
      if (loc === "ar") {
        expect(label).toBe("الخدمات");
        expect(/[\u0600-\u06FF]/.test(hint)).toBe(true);
      }
      if (loc === "mt") {
        expect(label).toBe("Servizzi");
      }
      if (loc === "es") {
        expect(label).toBe("Servicios");
      }
      if (loc === "it") {
        expect(label).toBe("Servizi");
      }
    }
  });
});
