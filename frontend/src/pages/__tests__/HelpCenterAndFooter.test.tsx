import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ContactUs from "../contactUs";
import Footer from "../../components/Footer";
import { TranslationProvider, useTranslation } from "../../context/TranslationContext";
import { SUPPORTED_LOCALES, tForLocale } from "../../utils/translations";
import {
  DEFAULT_HELP_CENTER_CMS_CONFIG,
  getDefaultHelpCenterConfig,
  loadHelpCenterCmsConfig,
} from "../../utils/helpCenterCmsConfig";

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

const EXPECTED_FAQ_IDS = [
  "sub-pricing",
  "sub-cancel",
  "sub-payment-methods",
  "srv-booking-free",
  "srv-doc-upload",
  "srv-doc-types",
  "srv-insitu",
  "tree-start",
  "tree-gedcom-formats",
  "priv-visibility",
  "priv-gdpr",
  "sup-contact",
];

const NEUTRAL_IDENTICAL_FIELDS = new Set([
  "id",
  "icon",
  "to",
  "category",
  "published",
  "key",
  "image",
  "phoneValue",
  "whatsappLabel",
  "whatsappValue",
  "emailValue",
  "emailPlaceholder",
  "facebookUrl",
  "instagramUrl",
  "deskLinkTo",
]);

describe("Help Center (/helpcenter) & Footer 6-Language Translation & RTL", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mockGet.mockResolvedValue({ data: null });
    mockPost.mockResolvedValue({ data: { ok: true } });
  });

  it("provides complete translated HelpCenter CMS defaults for all 6 locales without French leftovers or competitor mentions", () => {
    const fr = getDefaultHelpCenterConfig("fr");

    for (const loc of SUPPORTED_LOCALES) {
      const cfg = getDefaultHelpCenterConfig(loc);
      const serialized = JSON.stringify(cfg);

      expect(serialized).not.toMatch(/familysearch|geneanet/i);
      expect(cfg.contact.form.topics).toHaveLength(4);
      expect(cfg.about.corpuses).toHaveLength(4);
      expect(cfg.about.whyUs).toHaveLength(4);
      expect(cfg.about.explorations).toHaveLength(4);
      expect(cfg.faq.categories).toHaveLength(6);
      expect(cfg.faq.questions).toHaveLength(12);
      expect(cfg.legal.cards).toHaveLength(4);

      const ids = cfg.faq.questions.map((q) => q.id);
      for (const expectedId of EXPECTED_FAQ_IDS) {
        expect(ids).toContain(expectedId);
      }

      if (loc !== "fr") {
        expect(cfg.hero.title).not.toBe(fr.hero.title);
        expect(cfg.hero.eyebrow).not.toBe(fr.hero.eyebrow);
        expect(cfg.tabLabels.contact).not.toBe(fr.tabLabels.contact);
        expect(cfg.tabLabels.legal).not.toBe(fr.tabLabels.legal);
        expect(cfg.contact.cards.whatsappPrefillMessage).not.toBe(fr.contact.cards.whatsappPrefillMessage);
        expect(cfg.contact.form.consentText).not.toBe(fr.contact.form.consentText);
        expect(cfg.contact.sidebar.whatsappPlatformLabel).not.toBe(fr.contact.sidebar.whatsappPlatformLabel);
        expect(cfg.contact.sidebar.facebookPlatformLabel).not.toBe(fr.contact.sidebar.facebookPlatformLabel);
        expect(cfg.faq.header.emptySearchText).not.toBe(fr.faq.header.emptySearchText);
        expect(cfg.faq.header.resetFiltersLabel).not.toBe(fr.faq.header.resetFiltersLabel);
        expect(cfg.legal.header.eyebrow).not.toBe(fr.legal.header.eyebrow);
        expect(cfg.legal.header.title).not.toBe(fr.legal.header.title);
        expect(cfg.legal.header.description).not.toBe(fr.legal.header.description);

        cfg.contact.form.topics.forEach((topic, i) => {
          expect(topic.label.trim().length).toBeGreaterThan(0);
          expect(topic.label).not.toBe(fr.contact.form.topics[i].label);
        });
        cfg.about.corpuses.forEach((c, i) => {
          expect(c.title).not.toBe(fr.about.corpuses[i].title);
          expect(c.desc).not.toBe(fr.about.corpuses[i].desc);
          expect(c.depot).not.toBe(fr.about.corpuses[i].depot);
        });
        cfg.about.whyUs.forEach((w, i) => {
          expect(w.title).not.toBe(fr.about.whyUs[i].title);
          expect(w.desc).not.toBe(fr.about.whyUs[i].desc);
        });
        cfg.about.explorations.forEach((e, i) => {
          expect(e.title).not.toBe(fr.about.explorations[i].title);
          expect(e.desc).not.toBe(fr.about.explorations[i].desc);
          expect(e.ctaLabel).not.toBe(fr.about.explorations[i].ctaLabel);
        });
        cfg.faq.categories.forEach((cat, i) => {
          expect(cat.label).not.toBe(fr.faq.categories[i].label);
        });
        cfg.faq.questions.forEach((q) => {
          const frQ = fr.faq.questions.find((x) => x.id === q.id)!;
          expect(q.q).not.toBe(frQ.q);
          expect(q.a).not.toBe(frQ.a);
        });
        cfg.legal.cards.forEach((card, i) => {
          expect(card.title).not.toBe(fr.legal.cards[i].title);
          expect(card.desc).not.toBe(fr.legal.cards[i].desc);
          expect(card.ctaLabel).not.toBe(fr.legal.cards[i].ctaLabel);
        });
      }

      if (loc === "ar") {
        const arabicChecks = [
          cfg.hero.eyebrow,
          cfg.hero.title,
          cfg.hero.subtitle,
          cfg.tabLabels.contact,
          cfg.tabLabels.about,
          cfg.tabLabels.faq,
          cfg.tabLabels.legal,
          cfg.legal.header.title,
          cfg.legal.header.description,
          ...cfg.legal.cards.map((c) => c.title),
          ...cfg.legal.cards.map((c) => c.ctaLabel),
          ...cfg.faq.questions.map((q) => q.q),
          ...cfg.faq.questions.map((q) => q.a),
        ];
        for (const text of arabicChecks) {
          expect(/[\u0600-\u06FF]/.test(text)).toBe(true);
        }
      }

      // Guard against accidental untouched non-neutral keys copied from FR
      for (const key of Object.keys(fr.contact.form) as (keyof typeof fr.contact.form)[]) {
        if (key === "topics" || NEUTRAL_IDENTICAL_FIELDS.has(key)) continue;
        if (loc !== "fr") {
          expect(cfg.contact.form[key]).not.toBe(fr.contact.form[key]);
        }
      }
    }
  });

  it("ignores stale French root or v2 slices in localStorage for non-FR locales and handles locale sub-tags", () => {
    localStorage.setItem(
      "RootsTunisia_help_center_cms_config",
      JSON.stringify({
        ...DEFAULT_HELP_CENTER_CMS_CONFIG,
        locales: {
          es: {
            legal: DEFAULT_HELP_CENTER_CMS_CONFIG.legal,
            contact: {
              form: {
                topics: DEFAULT_HELP_CENTER_CMS_CONFIG.contact.form.topics,
              },
            },
          },
        },
      })
    );

    const esCfg = loadHelpCenterCmsConfig("es-ES");
    expect(esCfg.legal.cards[0].title).toBe("Condiciones Generales de Uso");
    expect(esCfg.contact.form.topics[0].label).toBe("Consulta General");

    const arCfg = loadHelpCenterCmsConfig("ar-TN");
    expect(arCfg.legal.cards[1].title).toBe("سياسة الخصوصية");
  });

  it("renders all 4 Help Center tabs in all 6 languages with Arabic RTL and zero French leakage", async () => {
    const frenchSnippets = [
      "Centre d'Aide & Informations",
      "Cadre Réglementaire & Déontologique",
      "Prestations & Remboursement",
      "Renseignement Général",
      "Aucune réponse ne correspond à votre recherche.",
    ];

    for (const loc of SUPPORTED_LOCALES) {
      localStorage.setItem("locale", loc);
      const cfg = getDefaultHelpCenterConfig(loc);

      const { container, unmount } = render(
        <MemoryRouter initialEntries={["/helpcenter"]}>
          <TranslationProvider>
            <ContactUs />
          </TranslationProvider>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(cfg.hero.eyebrow)).toBeInTheDocument();
        expect(screen.getByText(cfg.hero.title)).toBeInTheDocument();
      });

      const rootDiv = container.firstElementChild as HTMLElement;
      expect(rootDiv.getAttribute("dir")).toBe(loc === "ar" ? "rtl" : "ltr");

      // Tab 1: Contact Direct (initial active tab)
      const findTabButton = (label: string) =>
        screen
          .getAllByText(label)
          .map((el) => el.closest("button"))
          .find((btn): btn is HTMLButtonElement => Boolean(btn));

      const contactTabBtn = findTabButton(cfg.tabLabels.contact);
      const aboutTabBtn = findTabButton(cfg.tabLabels.about);
      const faqTabBtn = findTabButton(cfg.tabLabels.faq);
      const legalTabBtn = findTabButton(cfg.tabLabels.legal);

      expect(contactTabBtn).toBeTruthy();
      expect(aboutTabBtn).toBeTruthy();
      expect(faqTabBtn).toBeTruthy();
      expect(legalTabBtn).toBeTruthy();

      expect(screen.getAllByText(cfg.contact.cards.phoneCta).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(cfg.contact.cards.emailCta).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(cfg.contact.form.title).length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText(cfg.contact.form.consentText)).toBeInTheDocument();
      expect(screen.getByText(cfg.contact.sidebar.deskTitle)).toBeInTheDocument();
      expect(screen.getByText(cfg.contact.sidebar.whatsappPlatformLabel)).toBeInTheDocument();
      for (const topic of cfg.contact.form.topics) {
        expect(screen.getByText(topic.label)).toBeInTheDocument();
      }
      if (loc === "ar") {
        expect(screen.getAllByText("←").length).toBeGreaterThanOrEqual(2);
      } else {
        expect(screen.getAllByText("→").length).toBeGreaterThanOrEqual(2);
      }

      // Tab 2: À Propos & Mission
      fireEvent.click(aboutTabBtn!);
      await waitFor(() => {
        expect(screen.getAllByText(cfg.about.mission.titleHighlight).length).toBeGreaterThanOrEqual(1);
        expect(screen.getByText(cfg.about.corpusesHeader.title)).toBeInTheDocument();
        expect(screen.getByText(cfg.about.whyUsHeader.title)).toBeInTheDocument();
      });
      for (const c of cfg.about.corpuses) {
        expect(screen.getByText(c.title)).toBeInTheDocument();
      }
      for (const w of cfg.about.whyUs) {
        expect(screen.getByText(w.title)).toBeInTheDocument();
      }
      for (const e of cfg.about.explorations) {
        expect(screen.getByText(e.title)).toBeInTheDocument();
      }

      // Tab 3: Foire Aux Questions (FAQ)
      fireEvent.click(faqTabBtn!);
      await waitFor(() => {
        expect(screen.getByText(cfg.faq.header.eyebrow)).toBeInTheDocument();
        expect(screen.getByText(cfg.faq.bottomCta.title)).toBeInTheDocument();
      });
      for (const cat of cfg.faq.categories) {
        expect(screen.getByText(cat.label)).toBeInTheDocument();
      }
      for (const q of cfg.faq.questions) {
        expect(screen.getByText(q.q)).toBeInTheDocument();
      }

      // Tab 4: Cadre Légal
      fireEvent.click(legalTabBtn!);
      await waitFor(() => {
        expect(screen.getByText(cfg.legal.header.eyebrow)).toBeInTheDocument();
        expect(screen.getByText(cfg.legal.header.title)).toBeInTheDocument();
        expect(screen.getByText(cfg.legal.header.description)).toBeInTheDocument();
      });
      for (const card of cfg.legal.cards) {
        expect(screen.getByText(card.title)).toBeInTheDocument();
        expect(screen.getByText(card.desc)).toBeInTheDocument();
      }
      expect(screen.getAllByText(cfg.legal.cards[0].ctaLabel)).toHaveLength(4);

      if (loc !== "fr") {
        for (const snippet of frenchSnippets) {
          expect(screen.queryByText(snippet)).not.toBeInTheDocument();
        }
      }

      unmount();
    }
  });

  it("translates all Footer headings, links, tagline, copyright, location, and legal bar across all 6 languages and blocks French prop leakage", async () => {
    const expectedLocations: Record<string, string> = {
      fr: "Tunis, Tunisie",
      en: "Tunis, Tunisia",
      ar: "تونس، الجمهورية التونسية",
      es: "Túnez, Túnez",
      it: "Tunisi, Tunisia",
      mt: "Tuneż, Tuneżija",
    };

    const footerKeys = [
      "explore",
      "research",
      "contact",
      "email",
      "footer_tagline",
      "footer_copyright",
      "footer_rights",
      "site_title",
      "terms_of_service",
      "privacy_policy",
      "refund_policy",
      "cookie_policy",
      "cookie_preferences",
      "nav_trees",
      "nav_photos",
      "nav_library",
      "nav_audios",
      "nav_articles",
      "nav_about",
      "nav_periods",
      "nav_sources_and_archives",
      "nav_subscriptions",
      "nav_help_center",
    ];

    for (const loc of SUPPORTED_LOCALES) {
      localStorage.setItem("locale", loc);
      localStorage.setItem(
        "RootsTunisia_footer_settings",
        JSON.stringify({
          socialLinks: [],
          location: "Tunis, Tunisie",
          email: "contact@rootstunisia.com",
          phone: "+216 92 225 533",
          whatsapp: "+216 92 225 533",
        })
      );

      const { container, unmount } = render(
        <MemoryRouter>
          <TranslationProvider>
            <Footer
              data={{
                enabled: true,
                brandTagline: "Texte français personnalisé uniquement FR",
                fineprint: "© Mention française uniquement FR",
              }}
            />
          </TranslationProvider>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText(tForLocale(loc, "explore"))).toBeInTheDocument();
      });

      const footerEl = container.querySelector("footer") as HTMLElement;
      expect(footerEl.getAttribute("dir")).toBe(loc === "ar" ? "rtl" : "ltr");
      expect(screen.getByText(expectedLocations[loc])).toBeInTheDocument();

      for (const k of footerKeys) {
        const expectedText = tForLocale(loc, k);
        if (k === "footer_tagline" && loc === "fr") {
          expect(screen.getByText("Texte français personnalisé uniquement FR")).toBeInTheDocument();
        } else if (k === "footer_copyright" && loc === "fr") {
          expect(screen.getByText("© Mention française uniquement FR")).toBeInTheDocument();
        } else if (k === "site_title" || k === "footer_rights") {
          expect(
            screen.getByText(`${tForLocale(loc, "site_title")} · ${tForLocale(loc, "footer_rights")}`)
          ).toBeInTheDocument();
        } else if (k === "email") {
          expect(screen.getByPlaceholderText(expectedText)).toBeInTheDocument();
        } else {
          expect(screen.getAllByText(expectedText).length).toBeGreaterThanOrEqual(1);
        }
      }

      if (loc !== "fr") {
        expect(screen.queryByText("Texte français personnalisé uniquement FR")).not.toBeInTheDocument();
        expect(screen.queryByText("© Mention française uniquement FR")).not.toBeInTheDocument();
        expect(screen.queryByText("Tunis, Tunisie")).not.toBeInTheDocument();
        expect(screen.queryByText("Conditions d'Utilisation")).not.toBeInTheDocument();
      }

      unmount();
    }
  });

  it("updates ContactUs and Footer dynamically when switching locale from FR to AR", async () => {
    localStorage.setItem("locale", "fr");
    localStorage.setItem(
      "RootsTunisia_footer_settings",
      JSON.stringify({
        socialLinks: [],
        location: "Tunis, Tunisie",
        email: "contact@rootstunisia.com",
        phone: "",
        whatsapp: "",
      })
    );

    function Switcher() {
      const { setLocale } = useTranslation();
      return (
        <div>
          <button type="button" onClick={() => setLocale("ar")}>
            AR
          </button>
          <ContactUs />
          <Footer
            data={{
              enabled: true,
            }}
          />
        </div>
      );
    }

    render(
      <MemoryRouter>
        <TranslationProvider>
          <Switcher />
        </TranslationProvider>
      </MemoryRouter>
    );

    expect(screen.getByText("Centre d'Aide & Informations")).toBeInTheDocument();
    expect(screen.getByText("Conditions d'Utilisation")).toBeInTheDocument();

    fireEvent.click(screen.getByText("AR"));

    await waitFor(() => {
      expect(screen.getByText("مركز المساعدة والمعلومات")).toBeInTheDocument();
      expect(screen.getByText("شروط الاستخدام")).toBeInTheDocument();
      expect(screen.getByText("تونس، الجمهورية التونسية")).toBeInTheDocument();
    });

    expect(screen.queryByText("Centre d'Aide & Informations")).not.toBeInTheDocument();
    expect(screen.queryByText("Conditions d'Utilisation")).not.toBeInTheDocument();
  });
});
