import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

const { mockSiteContentState } = vi.hoisted(() => ({
  mockSiteContentState: {
    version: 1,
    updatedAt: null as string | null,
    pages: {} as Record<string, any>,
  },
}));

vi.mock("../../hooks/useSiteContent", async () => {
  const actual = await vi.importActual<typeof import("../../hooks/useSiteContent")>(
    "../../hooks/useSiteContent",
  );
  return {
    ...actual,
    useSiteContent: () => ({
      content: mockSiteContentState,
      loading: false,
      getText: (pageId: string, secId: string, key: string, locale = "fr") => {
        const entry = mockSiteContentState.pages?.[pageId]?.[secId]?.[key];
        if (!entry) return "";
        const clean = (locale || "fr").toLowerCase().split("-")[0];
        return entry.translations?.[clean] || entry.value || "";
      },
      getHtml: () => "",
      getImage: () => "",
      getList: () => [],
    }),
    refreshSiteContent: vi.fn(async () => mockSiteContentState),
  };
});

import Footer from "../../components/Footer";
import FooterSettings from "../../admin/pages/FooterSettings";
import { TranslationProvider } from "../../context/TranslationContext";
import { api } from "../../api/client";
import {
  SUPPORTED_LOCALES,
  tForLocale,
} from "../../utils/translations";
import {
  DEFAULT_FOOTER_CONFIG,
  FOOTER_STORAGE_KEY,
  mergeFooterConfigWithSiteContent,
} from "../../utils/footerConfig";

describe("Footer Business Description & Complete 6-Language Translation", () => {
  beforeEach(() => {
    localStorage.clear();
    mockSiteContentState.pages = {};
    vi.restoreAllMocks();
  });

  it("provides redone Roots Tunisia business footer description and clean footer admin keys across all 6 locales", () => {
    const taglines = SUPPORTED_LOCALES.map((loc) => tForLocale(loc, "footer_tagline"));
    expect(new Set(taglines).size).toBe(6);

    const footerKeysToVerify = [
      "footer_tagline",
      "footer_preview_desc",
      "footer_contact_info",
      "footer_settings",
      "footer_settings_desc",
      "footer_social_links",
      "add_network",
      "remove",
      "saving",
      "save_settings",
      "settings_saved",
      "location",
      "phone",
      "admin",
      "footer_admin_pill",
      "footer_business_desc_title",
      "footer_business_desc_hint",
      "footer_contact_hint",
      "footer_social_hint",
      "footer_preview_title",
      "footer_no_location",
      "footer_no_email",
      "footer_no_phone",
      "footer_no_active_links",
      "footer_copyright",
      "footer_rights",
    ];

    for (const loc of SUPPORTED_LOCALES) {
      for (const key of footerKeysToVerify) {
        const val = tForLocale(loc, key);
        expect(val).toBeTruthy();
        expect(val).not.toBe(key);
        expect(val).not.toContain("الالمغرب العربيية");
        expect(val).not.toContain("de Carthage à Kairouan");
        if (loc === "ar") {
          expect(/[\u0600-\u06FF]/.test(val)).toBe(true);
        }
      }

      if (loc !== "en") {
        expect(tForLocale(loc, "footer_contact_info")).not.toBe("Contact Info");
        expect(tForLocale(loc, "footer_settings")).not.toBe("Footer Settings");
        expect(tForLocale(loc, "footer_social_links")).not.toBe("Social Links");
        expect(tForLocale(loc, "save_settings")).not.toBe("Save Settings");
        expect(tForLocale(loc, "remove")).not.toBe("Remove");
      }
      if (loc !== "fr") {
        expect(tForLocale(loc, "saving")).not.toBe("Enregistrement...");
      }
    }
  });

  it("localizes extended Tunisian locations and renders siteContent per-locale business descriptions without French leakage", () => {
    const locationCases: Array<[string, Record<string, string>]> = [
      [
        "Tunis, Tunisia",
        {
          fr: "Tunis, Tunisie",
          en: "Tunis, Tunisia",
          ar: "تونس، الجمهورية التونسية",
          es: "Túnez, Túnez",
          it: "Tunisi, Tunisia",
          mt: "Tuneż, Tuneżija",
        },
      ],
      [
        "Tunis",
        {
          fr: "Tunis",
          en: "Tunis",
          ar: "تونس",
          es: "Túnez",
          it: "Tunisi",
          mt: "Tuneż",
        },
      ],
      [
        "Sfax, Tunisie",
        {
          fr: "Sfax, Tunisie",
          en: "Sfax, Tunisia",
          ar: "Sfax، تونس",
          es: "Sfax, Túnez",
          it: "Sfax, Tunisia",
          mt: "Sfax, Tuneżija",
        },
      ],
      [
        "Rue de la Kasbah, Médina de Tunis, Tunisie",
        {
          fr: "Rue de la Kasbah, Médina de Tunis, Tunisie",
          en: "Rue de la Kasbah, Medina of Tunis, Tunisia",
          ar: "نهج القصبة، المدينة العتيقة، تونس العاصمة",
          es: "Rue de la Kasbah, Medina de Túnez, Túnez",
          it: "Rue de la Kasbah, Medina di Tunisi, Tunisia",
          mt: "Rue de la Kasbah, Medina ta' Tuneż, it-Tuneżija",
        },
      ],
    ];

    for (const [rawLoc, expectedMap] of locationCases) {
      for (const loc of SUPPORTED_LOCALES) {
        localStorage.setItem("locale", loc);
        localStorage.setItem(
          FOOTER_STORAGE_KEY,
          JSON.stringify({ ...DEFAULT_FOOTER_CONFIG, location: rawLoc }),
        );
        const { unmount } = render(
          <MemoryRouter>
            <TranslationProvider>
              <Footer />
            </TranslationProvider>
          </MemoryRouter>,
        );
        expect(screen.getByText(expectedMap[loc])).toBeInTheDocument();
        unmount();
      }
    }

    // Site content with FR value + AR & EN translations (es/it/mt fall back to built-in footer_tagline)
    mockSiteContentState.pages = {
      footer: {
        config: {
          email: { value: "contact@rootstunisia.com", translations: {} },
          brandTagline: {
            value: "Description officielle FR uniquement",
            translations: {
              fr: "Description officielle FR",
              en: "Official EN business footer description",
              ar: "الوصف الرسمي بالعربية لمنصة جذور تونس",
            },
          },
          copyrightText: {
            value: "© Mention FR uniquement",
            translations: {
              en: "© Custom EN Copyright",
            },
          },
        },
      },
    };
    localStorage.removeItem(FOOTER_STORAGE_KEY);

    localStorage.setItem("locale", "fr");
    const rFr = render(
      <MemoryRouter>
        <TranslationProvider>
          <Footer />
        </TranslationProvider>
      </MemoryRouter>,
    );
    expect(screen.getByText("Description officielle FR")).toBeInTheDocument();
    expect(screen.getByText("© Mention FR uniquement")).toBeInTheDocument();
    rFr.unmount();

    localStorage.setItem("locale", "en");
    const rEn = render(
      <MemoryRouter>
        <TranslationProvider>
          <Footer />
        </TranslationProvider>
      </MemoryRouter>,
    );
    expect(screen.getByText("Official EN business footer description")).toBeInTheDocument();
    expect(screen.getByText("© Custom EN Copyright")).toBeInTheDocument();
    rEn.unmount();

    localStorage.setItem("locale", "ar");
    const rAr = render(
      <MemoryRouter>
        <TranslationProvider>
          <Footer />
        </TranslationProvider>
      </MemoryRouter>,
    );
    expect(screen.getByText("الوصف الرسمي بالعربية لمنصة جذور تونس")).toBeInTheDocument();
    expect(screen.getByText(tForLocale("ar", "footer_copyright"))).toBeInTheDocument();
    rAr.unmount();

    localStorage.setItem("locale", "es");
    const rEs = render(
      <MemoryRouter>
        <TranslationProvider>
          <Footer />
        </TranslationProvider>
      </MemoryRouter>,
    );
    expect(screen.queryByText("Description officielle FR uniquement")).not.toBeInTheDocument();
    expect(screen.queryByText("Description officielle FR")).not.toBeInTheDocument();
    expect(screen.getByText(tForLocale("es", "footer_tagline"))).toBeInTheDocument();
    rEs.unmount();
  });

  it("renders FooterSettings in all 6 languages without French/English leakage and saves localized brandTaglineTranslations", async () => {
    vi.spyOn(api, "get").mockResolvedValue({ data: { data: { pages: [] } } } as any);
    const putSpy = vi.spyOn(api, "put").mockResolvedValue({ data: { ok: true } } as any);

    for (const loc of SUPPORTED_LOCALES) {
      localStorage.setItem("locale", loc);
      const { container, unmount } = render(
        <MemoryRouter>
          <TranslationProvider>
            <FooterSettings />
          </TranslationProvider>
        </MemoryRouter>,
      );

      expect(container.firstElementChild?.getAttribute("dir")).toBe(
        loc === "ar" ? "rtl" : "ltr",
      );
      expect(screen.getByText(tForLocale(loc, "footer_settings"))).toBeInTheDocument();
      expect(screen.getByText(tForLocale(loc, "footer_business_desc_title"))).toBeInTheDocument();
      expect(screen.getByText(tForLocale(loc, "footer_contact_info"))).toBeInTheDocument();
      expect(screen.getByText(tForLocale(loc, "footer_social_links"))).toBeInTheDocument();
      expect(screen.getByText(tForLocale(loc, "footer_preview_title"))).toBeInTheDocument();

      if (loc !== "fr") {
        expect(screen.queryByText(/Coordonnées Officielles/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Aperçu Direct/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Pied de Page/i)).not.toBeInTheDocument();
        expect(screen.queryByTitle("Supprimer")).not.toBeInTheDocument();
      }
      unmount();
    }

    // Edit business footer description in EN via FooterSettings and save
    localStorage.setItem("locale", "en");
    render(
      <MemoryRouter>
        <TranslationProvider>
          <FooterSettings />
        </TranslationProvider>
      </MemoryRouter>,
    );

    const textarea = screen.getByLabelText(/Business Footer Description/i);
    fireEvent.change(textarea, {
      target: { value: "Bespoke EN archival description from admin." },
    });
    fireEvent.click(screen.getByRole("button", { name: /Save Settings/i }));

    await waitFor(() => expect(putSpy).toHaveBeenCalled());

    const stored = JSON.parse(localStorage.getItem(FOOTER_STORAGE_KEY) || "{}");
    expect(stored.brandTaglineTranslations?.en).toBe(
      "Bespoke EN archival description from admin.",
    );

    const merged = mergeFooterConfigWithSiteContent(stored, {
      version: 1,
      updatedAt: null,
      pages: {},
    }, "en");
    expect(merged.brandTaglineTranslations?.en).toBe(
      "Bespoke EN archival description from admin.",
    );
    cleanup();
  });
});

