import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Terms from "../terms";
import Privacy from "../privacy";
import RefundPolicy from "../refund";
import Cookies from "../cookies";
import CookieConsentBanner from "../../components/CookieConsentBanner";
import Footer from "../../components/Footer";
import { TranslationProvider, useTranslation } from "../../context/TranslationContext";
import { SUPPORTED_LOCALES, tForLocale } from "../../utils/translations";
import {
  cleanLegalLocale,
  formatLegalSeoTitle,
  getLegalSeoKeywords,
  unwrapLegalDocument,
  type LegalSlug,
} from "../../utils/legalDocument";

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

const ALL_LEGAL_AND_COOKIE_KEYS = [
  // Legal shared + Terms
  "legal_eyebrow",
  "terms_of_service",
  "terms_seo_desc",
  "terms_intro",
  "legal_updated",
  "terms_s1_title",
  "terms_s1_body",
  "terms_s2_title",
  "terms_s2_body",
  "terms_s3_title",
  "terms_s3_body",
  "terms_s4_title",
  "terms_s4_body",
  "terms_s5_title",
  "terms_s5_body",
  // Privacy
  "privacy_eyebrow",
  "privacy_policy",
  "privacy_seo_desc",
  "privacy_intro",
  "privacy_s1_title",
  "privacy_s1_body",
  "privacy_s2_title",
  "privacy_s2_body",
  "privacy_s3_title",
  "privacy_s3_body",
  // Refund
  "seo_refund_title",
  "refund_seo_desc",
  "refund_eyebrow",
  "refund_title",
  "refund_subtitle",
  "fair_billing_commitment",
  "fair_billing_desc",
  "refund_section_1_title",
  "refund_section_1_p1",
  "refund_section_1_p2",
  "refund_section_2_title",
  "refund_section_2_p1",
  "refund_section_2_p2",
  "refund_section_3_title",
  "refund_section_3_p1",
  "refund_exception_1",
  "refund_exception_2",
  "refund_section_4_title",
  "refund_section_4_p1",
  "refund_section_4_with",
  "refund_req_item_1",
  "refund_req_item_2",
  "refund_req_item_3",
  "refund_section_4_p2",
  "refund_section_5_title",
  "refund_section_5_p1",
  "return_to_terms",
  "last_updated_date",
  // Cookies Page
  "cookies_eyebrow",
  "cookie_policy",
  "cookies_seo_desc",
  "cookies_intro",
  "cookies_s1_title",
  "cookies_s1_body",
  "cookies_s2_title",
  "cookies_s2_body",
  // Cookie Consent Banner & Preferences Modal
  "cookie_consent_banner",
  "cookie_banner_title",
  "cookie_banner_desc",
  "learn_more",
  "customize_cookies",
  "reject_optional",
  "accept_all",
  "cookie_preferences_title",
  "close_customizer",
  "essential_cookies",
  "required",
  "essential_cookies_desc",
  "preference_storage",
  "preference_storage_desc",
  "analytics_cookies",
  "analytics_cookies_desc",
  "reject_all_optional",
  "save_preferences",
] as const;

const PLACEHOLDER_REGEX =
  /^(Refund Title|Refund Eyebrow|Refund Subtitle|Refund Section 4 P1|seo_refund_title|refund_seo_desc)$/i;

describe("All Legal Pages (/terms, /privacy, /refund, /cookies) & Cookie Preferences 6-Language & RTL", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mockGet.mockResolvedValue({ data: null });
    mockPost.mockResolvedValue({ data: { ok: true } });
  });

  it("translates every legal and cookie preference key across all 6 locales with zero placeholders, Esperanto, or Maltese typos", () => {
    for (const loc of SUPPORTED_LOCALES) {
      for (const key of ALL_LEGAL_AND_COOKIE_KEYS) {
        const val = tForLocale(loc, key);
        expect(val, `Missing or identical key ${key} in ${loc}`).toBeTruthy();
        expect(val).not.toBe(key);
        expect(PLACEHOLDER_REGEX.test(val)).toBe(false);
        expect(val).not.toMatch(/familysearch|geneanet|esperanto/i);

        if (loc === "ar") {
          expect(/[\u0600-\u06FF]/.test(val), `Expected Arabic script for ar.${key}, got "${val}"`).toBe(true);
        } else {
          expect(/[\u0600-\u06FF]/.test(val), `Unexpected Arabic characters in ${loc}.${key}: "${val}"`).toBe(false);
        }

        if (loc !== "fr") {
          expect(val, `FR leakage in ${loc}.${key}`).not.toBe(tForLocale("fr", key));
        }
        if (loc !== "en") {
          expect(val, `EN leakage in ${loc}.${key}`).not.toBe(tForLocale("en", key));
        }
      }

      if (loc === "mt") {
        expect(tForLocale("mt", "cookies_s2_body")).toContain("bil-lingwa");
        expect(tForLocale("mt", "legal_updated")).toContain("Tuneż, Tuneżija");
      }
    }
  });

  it("rejects untranslated or mismatched-locale CMS payloads in unwrapLegalDocument and localizes SEO helpers", () => {
    const englishUntranslated = {
      data: {
        slug: "terms",
        locale: "en",
        translated: false,
        title: "Terms of Service",
        intro: "These Terms of Service govern your use...",
        sections: [{ heading: "1. Acceptance of Terms", body: "English body" }],
      },
    };

    expect(unwrapLegalDocument(englishUntranslated, "fr")).toBeNull();
    expect(unwrapLegalDocument(englishUntranslated, "ar")).toBeNull();
    expect(unwrapLegalDocument(englishUntranslated, "es")).toBeNull();

    const mismatchedWithoutFlag = {
      slug: "privacy",
      locale: "en",
      title: "Privacy Policy",
      intro: "English intro",
      sections: [{ heading: "1. Privacy", body: "English body" }],
    };
    expect(unwrapLegalDocument(mismatchedWithoutFlag, "fr")).toBeNull();
    expect(unwrapLegalDocument(mismatchedWithoutFlag, "en")).not.toBeNull();

    const matchedSubtag = {
      data: {
        slug: "refund",
        locale: "ar-TN",
        translated: true,
        title: "سياسة الاسترجاع",
        intro: "مقدمة عربية",
        sections: [{ heading: "1. الإلغاء", body: "نص عربي" }],
      },
    };
    expect(cleanLegalLocale("ar-TN")).toBe("ar");
    expect(unwrapLegalDocument(matchedSubtag, "ar")).toEqual({
      title: "سياسة الاسترجاع",
      intro: "مقدمة عربية",
      sections: [{ heading: "1. الإلغاء", body: "نص عربي" }],
    });

    const slugs: LegalSlug[] = ["terms", "privacy", "refund", "cookies"];
    for (const loc of SUPPORTED_LOCALES) {
      const formatted = formatLegalSeoTitle(tForLocale(loc, "terms_of_service"), loc);
      if (loc === "ar") {
        expect(formatted).toContain("جذور تونس");
      } else {
        expect(formatted).toContain("Roots Tunisia");
      }
      for (const slug of slugs) {
        const kw = getLegalSeoKeywords(slug, loc);
        expect(kw.length).toBeGreaterThanOrEqual(3);
        if (loc === "ar") {
          expect(kw.every((item) => /[\u0600-\u06FF]/.test(item))).toBe(true);
        }
      }
    }
  });

  it("renders /terms, /privacy, /refund, and /cookies in all 6 languages even if backend returns untranslated English fallback, with RTL in Arabic", async () => {
    mockGet.mockImplementation((url: string) => {
      if (url.startsWith("/legal/")) {
        return Promise.resolve({
          data: {
            slug: url.replace("/legal/", ""),
            locale: "en",
            translated: false,
            title: "Untranslated English Fallback Title",
            intro: "Untranslated English Fallback Intro",
            sections: [{ heading: "1. Untranslated Heading", body: "Untranslated English body" }],
          },
        });
      }
      return Promise.resolve({ data: null });
    });

    for (const loc of SUPPORTED_LOCALES) {
      localStorage.setItem("locale", loc);
      const expectedDir = loc === "ar" ? "rtl" : "ltr";

      // 1. /terms
      {
        const { container, unmount } = render(
          <MemoryRouter initialEntries={["/terms"]}>
            <TranslationProvider>
              <Terms />
            </TranslationProvider>
          </MemoryRouter>,
        );

        await waitFor(() => {
          expect(screen.getByText(tForLocale(loc, "terms_of_service"))).toBeInTheDocument();
        });
        expect((container.firstElementChild as HTMLElement).getAttribute("dir")).toBe(expectedDir);
        expect(screen.getByText(tForLocale(loc, "legal_eyebrow"))).toBeInTheDocument();
        expect(screen.getByText(tForLocale(loc, "terms_intro"))).toBeInTheDocument();
        expect(screen.getByText(tForLocale(loc, "legal_updated"))).toBeInTheDocument();
        expect(screen.getByText(tForLocale(loc, "terms_s1_title"))).toBeInTheDocument();
        expect(screen.getByText(tForLocale(loc, "terms_s5_title"))).toBeInTheDocument();
        expect(screen.queryByText("Untranslated English Fallback Title")).not.toBeInTheDocument();
        if (loc !== "fr") {
          expect(screen.queryByText(tForLocale("fr", "terms_of_service"))).not.toBeInTheDocument();
        }
        unmount();
      }

      // 2. /privacy
      {
        const { container, unmount } = render(
          <MemoryRouter initialEntries={["/privacy"]}>
            <TranslationProvider>
              <Privacy />
            </TranslationProvider>
          </MemoryRouter>,
        );

        await waitFor(() => {
          expect(screen.getByText(tForLocale(loc, "privacy_policy"))).toBeInTheDocument();
        });
        expect((container.firstElementChild as HTMLElement).getAttribute("dir")).toBe(expectedDir);
        expect(screen.getByText(tForLocale(loc, "privacy_eyebrow"))).toBeInTheDocument();
        expect(screen.getByText(tForLocale(loc, "privacy_intro"))).toBeInTheDocument();
        expect(screen.getByText(tForLocale(loc, "privacy_s1_title"))).toBeInTheDocument();
        expect(screen.getByText(tForLocale(loc, "privacy_s3_title"))).toBeInTheDocument();
        expect(screen.queryByText("Untranslated English Fallback Title")).not.toBeInTheDocument();
        unmount();
      }

      // 3. /refund
      {
        const { container, unmount } = render(
          <MemoryRouter initialEntries={["/refund"]}>
            <TranslationProvider>
              <RefundPolicy />
            </TranslationProvider>
          </MemoryRouter>,
        );

        await waitFor(() => {
          expect(screen.getByText(tForLocale(loc, "refund_title"))).toBeInTheDocument();
        });
        expect((container.firstElementChild as HTMLElement).getAttribute("dir")).toBe(expectedDir);
        expect(screen.getByText(tForLocale(loc, "refund_eyebrow"))).toBeInTheDocument();
        expect(screen.getByText(tForLocale(loc, "refund_subtitle"))).toBeInTheDocument();
        expect(screen.getByText(tForLocale(loc, "fair_billing_commitment"))).toBeInTheDocument();
        expect(screen.getByText(tForLocale(loc, "fair_billing_desc"))).toBeInTheDocument();
        expect(screen.getByText(tForLocale(loc, "refund_section_1_title"))).toBeInTheDocument();
        expect(screen.getByText(tForLocale(loc, "refund_section_3_title"))).toBeInTheDocument();
        expect(screen.getByText(tForLocale(loc, "refund_section_5_title"))).toBeInTheDocument();
        expect(screen.getByText(tForLocale(loc, "return_to_terms"))).toBeInTheDocument();
        expect(screen.getByText(tForLocale(loc, "last_updated_date"))).toBeInTheDocument();
        expect(screen.queryByText("Untranslated English Fallback Title")).not.toBeInTheDocument();
        if (loc !== "ar") {
          expect(document.title).not.toContain("سياسة الاسترجاع والإلغاء");
        }
        unmount();
      }

      // 4. /cookies
      {
        const { container, unmount } = render(
          <MemoryRouter initialEntries={["/cookies"]}>
            <TranslationProvider>
              <Cookies />
            </TranslationProvider>
          </MemoryRouter>,
        );

        await waitFor(() => {
          expect(screen.getByText(tForLocale(loc, "cookie_policy"))).toBeInTheDocument();
        });
        expect((container.firstElementChild as HTMLElement).getAttribute("dir")).toBe(expectedDir);
        expect(screen.getByText(tForLocale(loc, "cookies_eyebrow"))).toBeInTheDocument();
        expect(screen.getByText(tForLocale(loc, "cookies_intro"))).toBeInTheDocument();
        expect(screen.getByText(tForLocale(loc, "cookies_s1_title"))).toBeInTheDocument();
        expect(screen.getByText(tForLocale(loc, "cookies_s2_title"))).toBeInTheDocument();
        expect(container.textContent).not.toMatch(/Esperanto/i);
        expect(screen.queryByText("Untranslated English Fallback Title")).not.toBeInTheDocument();
        unmount();
      }
    }
  });

  it("renders translated backend CMS legal documents for all 4 legal routes when backend returns matching locale", async () => {
    mockGet.mockImplementation((url: string, config?: any) => {
      const requested = config?.params?.locale || "en";
      if (url.startsWith("/legal/")) {
        const slug = url.replace("/legal/", "");
        return Promise.resolve({
          data: {
            slug,
            locale: requested,
            translated: true,
            title: `CMS-${slug}-${requested}-title`,
            intro: `CMS-${slug}-${requested}-intro`,
            sections: [
              {
                heading: `CMS-${slug}-${requested}-section-heading`,
                body: `CMS-${slug}-${requested}-section-body`,
              },
            ],
          },
        });
      }
      return Promise.resolve({ data: null });
    });

    for (const loc of SUPPORTED_LOCALES) {
      localStorage.setItem("locale", loc);

      const { unmount } = render(
        <MemoryRouter initialEntries={["/terms"]}>
          <TranslationProvider>
            <Terms />
            <Privacy />
            <RefundPolicy />
            <Cookies />
          </TranslationProvider>
        </MemoryRouter>,
      );

      for (const slug of ["terms", "privacy", "refund", "cookies"]) {
        await waitFor(() => {
          expect(screen.getAllByText(`CMS-${slug}-${loc}-title`).length).toBeGreaterThanOrEqual(1);
          expect(screen.getAllByText(`CMS-${slug}-${loc}-section-heading`).length).toBeGreaterThanOrEqual(1);
        });
      }

      unmount();
    }
  });

  it("renders CookieConsentBanner & Preferences modal in all 6 languages with RTL and Footer reopening", async () => {
    for (const loc of SUPPORTED_LOCALES) {
      localStorage.clear();
      localStorage.setItem("locale", loc);
      const expectedDir = loc === "ar" ? "rtl" : "ltr";

      const { unmount } = render(
        <MemoryRouter>
          <TranslationProvider>
            <Footer data={{ enabled: true }} />
            <CookieConsentBanner />
          </TranslationProvider>
        </MemoryRouter>,
      );

      const bannerRegion = screen.getByRole("region", {
        name: tForLocale(loc, "cookie_consent_banner"),
      });
      expect(bannerRegion).toBeInTheDocument();
      expect(bannerRegion.getAttribute("dir")).toBe(expectedDir);
      expect(screen.getByText(tForLocale(loc, "cookie_banner_title"))).toBeInTheDocument();
      expect(bannerRegion.textContent).toContain(tForLocale(loc, "cookie_banner_desc"));
      expect(screen.getByText(tForLocale(loc, "learn_more"))).toBeInTheDocument();
      expect(screen.getByText(tForLocale(loc, "reject_optional"))).toBeInTheDocument();
      expect(screen.getByText(tForLocale(loc, "accept_all"))).toBeInTheDocument();

      // Expand Customize Preferences modal
      fireEvent.click(screen.getByText(tForLocale(loc, "customize_cookies")));

      expect(screen.getByText(tForLocale(loc, "cookie_preferences_title"))).toBeInTheDocument();
      expect(screen.getByText(tForLocale(loc, "essential_cookies"))).toBeInTheDocument();
      expect(screen.getByText(tForLocale(loc, "required"))).toBeInTheDocument();
      expect(screen.getByText(tForLocale(loc, "essential_cookies_desc"))).toBeInTheDocument();
      expect(screen.getByText(tForLocale(loc, "preference_storage"))).toBeInTheDocument();
      expect(screen.getByText(tForLocale(loc, "preference_storage_desc"))).toBeInTheDocument();
      expect(screen.getByText(tForLocale(loc, "analytics_cookies"))).toBeInTheDocument();
      expect(screen.getByText(tForLocale(loc, "analytics_cookies_desc"))).toBeInTheDocument();
      expect(screen.getByLabelText(tForLocale(loc, "essential_cookies"))).toBeDisabled();
      expect(screen.getByLabelText(tForLocale(loc, "preference_storage"))).toBeEnabled();
      expect(screen.getByLabelText(tForLocale(loc, "analytics_cookies"))).toBeEnabled();

      // Save custom preferences
      fireEvent.click(screen.getByText(tForLocale(loc, "save_preferences")));
      expect(screen.queryByText(tForLocale(loc, "cookie_preferences_title"))).not.toBeInTheDocument();

      // Clicking "Préférences Cookies" button inside Footer reopens the banner in the active language
      const footerPrefsBtn = screen.getByRole("button", {
        name: tForLocale(loc, "cookie_preferences"),
      });
      fireEvent.click(footerPrefsBtn);

      await waitFor(() => {
        expect(screen.getByText(tForLocale(loc, "cookie_preferences_title"))).toBeInTheDocument();
      });

      unmount();
    }
  });

  it("dynamically translates Terms, RefundPolicy, and CookieConsentBanner when switching locale from FR to AR", async () => {
    localStorage.setItem("locale", "fr");

    function SwitcherHarness() {
      const { setLocale } = useTranslation();
      return (
        <div>
          <button type="button" onClick={() => setLocale("ar")}>
            SWITCH_AR
          </button>
          <Terms />
          <RefundPolicy />
          <CookieConsentBanner />
        </div>
      );
    }

    render(
      <MemoryRouter>
        <TranslationProvider>
          <SwitcherHarness />
        </TranslationProvider>
      </MemoryRouter>,
    );

    expect(screen.getByText(tForLocale("fr", "terms_of_service"))).toBeInTheDocument();
    expect(screen.getByText(tForLocale("fr", "refund_title"))).toBeInTheDocument();
    expect(screen.getByText(tForLocale("fr", "cookie_banner_title"))).toBeInTheDocument();

    fireEvent.click(screen.getByText("SWITCH_AR"));

    await waitFor(() => {
      expect(screen.getByText(tForLocale("ar", "terms_of_service"))).toBeInTheDocument();
      expect(screen.getByText(tForLocale("ar", "refund_title"))).toBeInTheDocument();
      expect(screen.getByText(tForLocale("ar", "cookie_banner_title"))).toBeInTheDocument();
    });

    expect(screen.queryByText(tForLocale("fr", "terms_of_service"))).not.toBeInTheDocument();
    expect(screen.queryByText(tForLocale("fr", "refund_title"))).not.toBeInTheDocument();
  });
});
