import { describe, it, expect } from "vitest";
import arLocale from "../locales/ar.json";
import enLocale from "../locales/en.json";
import frLocale from "../locales/fr.json";
import esLocale from "../locales/es.json";
import itLocale from "../locales/it.json";
import mtLocale from "../locales/mt.json";
import { tForLocale, isRtlLocale, SUPPORTED_LOCALES } from "../utils/translations";
import { getDefaultPeriodsCmsConfig } from "../utils/periodsCmsConfig";
import { getEraResearchDossier } from "../data/eraResearchChapters";
import {
  loadSourcesMultiLocaleStore,
  resolveLocalizedLocation,
  resolveLocalizedSourceCard,
} from "../utils/sourcesCmsConfig";
import { ARCHIVES_DIRECTORY } from "../pages/SourcesAndArchives";

describe("All User, Admin & Super Admin Pages Translation and RTL/LTR Audit", () => {
  it("supports all 6 declared locales", () => {
    expect(SUPPORTED_LOCALES).toEqual(["en", "fr", "ar", "es", "it", "mt"]);
  });

  it("identifies RTL exclusively for Arabic and LTR for others", () => {
    expect(isRtlLocale("ar")).toBe(true);
    expect(isRtlLocale("en")).toBe(false);
    expect(isRtlLocale("fr")).toBe(false);
    expect(isRtlLocale("es")).toBe(false);
    expect(isRtlLocale("it")).toBe(false);
    expect(isRtlLocale("mt")).toBe(false);
  });

  it("contains extensive dictionary keys in all 6 locales", () => {
    expect(Object.keys(arLocale).length).toBeGreaterThan(3000);
    expect(Object.keys(enLocale).length).toBeGreaterThan(2500);
    expect(Object.keys(frLocale).length).toBeGreaterThan(2500);
    expect(Object.keys(esLocale).length).toBeGreaterThan(2500);
    expect(Object.keys(itLocale).length).toBeGreaterThan(2500);
    expect(Object.keys(mtLocale).length).toBeGreaterThan(2500);
  });

  it("translates all user sidebar keys across all 6 locales", () => {
    const userKeys = [
      "usage_quotas",
      "trees",
      "individuals",
      "my_sources",
      "tasks",
      "notes",
      "gallery",
      "audios",
      "documents",
      "user_upgrade",
      "contact_support",
      "user_settings",
      "suggestions",
    ];

    for (const locale of SUPPORTED_LOCALES) {
      for (const key of userKeys) {
        const val = tForLocale(locale, key);
        expect(val).toBeTruthy();
        expect(val).not.toBe(key);
        if (locale === "ar") {
          expect(/[\u0600-\u06FF]/.test(val)).toBe(true);
        }
      }
    }
  });

  it("translates all admin sidebar keys across all 6 locales", () => {
    const adminKeys = [
      "dashboard",
      "users",
      "contact_messages",
      "newsletter",
      "download_requests",
      "articles",
      "books",
      "activity",
      "footer_settings",
      "settings",
    ];

    for (const locale of SUPPORTED_LOCALES) {
      for (const key of adminKeys) {
        const val = tForLocale(locale, key);
        expect(val).toBeTruthy();
        expect(val).not.toBe(key);
        if (locale === "ar") {
          expect(/[\u0600-\u06FF]/.test(val)).toBe(true);
        }
      }
    }
  });

  it("translates all super admin keys across all 6 locales", () => {
    const superAdminKeys = [
      "admins",
      "subscriptions",
      "subscription_payments",
      "currencies_exchange",
      "payment_settings",
      "legal_content",
      "backups",
      "approvals",
    ];

    for (const locale of SUPPORTED_LOCALES) {
      for (const key of superAdminKeys) {
        const val = tForLocale(locale, key);
        expect(val).toBeTruthy();
        expect(val).not.toBe(key);
        if (locale === "ar") {
          expect(/[\u0600-\u06FF]/.test(val)).toBe(true);
        }
      }
    }
  });

  it("translates recently added currency & payment settings keys across all 6 locales", () => {
    const keys = [
      "currencies_load_failed",
      "currency_updated_success",
      "currency_deleted",
      "save_rate",
      "exchange_rate",
      "payment_methods_load_failed",
      "payment_method_updated",
      "payment_method_deleted",
      "active_for_clients",
      "hidden_from_clients",
      "preferred_currency",
    ];

    for (const locale of SUPPORTED_LOCALES) {
      for (const key of keys) {
        const val = tForLocale(locale, key);
        expect(val).toBeTruthy();
        expect(val).not.toBe(key);
        if (locale === "ar") {
          expect(/[\u0600-\u06FF]/.test(val)).toBe(true);
        }
      }
    }
  });

  it("handles legacy-prefixed and non-prefixed keys symmetrically", () => {
    const key = "account_deletion_requests";
    const legacyKey = "legacy.account_deletion_requests";

    for (const locale of SUPPORTED_LOCALES) {
      const val1 = tForLocale(locale, key);
      const val2 = tForLocale(locale, legacyKey);
      expect(val1).toBeTruthy();
      expect(val2).toBeTruthy();
      if (locale === "ar") {
        expect(/[\u0600-\u06FF]/.test(val1)).toBe(true);
        expect(/[\u0600-\u06FF]/.test(val2)).toBe(true);
      }
    }
  });

  it("translates all homepage (page d'accueil) sections and marquee keys across all 6 locales", () => {
    const homeKeys = [
      "seo_home_title",
      "seo_home_desc",
      "site_badge",
      "hero_title",
      "hero_subtitle",
      "start_exploring",
      "browse_family_trees",
      "stat_years_history",
      "stat_governorates",
      "stat_records",
      "stat_sources",
      "heritage_banner_eyebrow",
      "preserve_lineage_title",
      "preserve_lineage_desc",
      "periods_marquee_badge",
      "periods_marquee_title",
      "periods_marquee_desc",
      "periods_marquee_view_all",
      "discover_period_cta",
      "sources_marquee_badge",
      "sources_marquee_title",
      "sources_marquee_desc",
      "sources_marquee_view_all",
      "visit_archive_cta",
      "trees_section_eyebrow",
      "trees_section_title",
      "trees_section_intro",
      "generations_label",
      "individuals_label",
      "explore_family_card",
      "browse_all_trees_cta",
      "gallery_section_eyebrow",
      "gallery_section_title",
      "gallery_section_intro",
      "view_high_res",
      "browse_all_gallery_cta",
      "articles_section_eyebrow",
      "articles_section_title",
      "articles_section_intro",
      "sources_label",
      "reading_label",
      "read_article_cta",
      "browse_all_articles_cta",
      "collections_section_eyebrow",
      "collections_section_title",
      "collections_section_intro",
      "collections_series_label",
      "col_books_badge",
      "col_books_title",
      "col_books_desc",
      "col_books_cta",
      "col_docs_badge",
      "col_docs_title",
      "col_docs_desc",
      "col_docs_cta",
      "col_audios_badge",
      "col_audios_title",
      "col_audios_desc",
      "col_audios_cta",
    ];

    for (const locale of SUPPORTED_LOCALES) {
      for (const key of homeKeys) {
        const val = tForLocale(locale, key);
        expect(val).toBeTruthy();
        expect(val).not.toBe(key);
        if (locale === "ar") {
          expect(/[\u0600-\u06FF]/.test(val)).toBe(true);
        }
      }
    }
  });

  it("translates all 12 historical periods, hero, KPI, and categories on the public Periods page across all 6 locales", () => {
    const frCfg = getDefaultPeriodsCmsConfig("fr");

    for (const locale of SUPPORTED_LOCALES) {
      const cfg = getDefaultPeriodsCmsConfig(locale);
      expect(cfg.hero.title).toBeTruthy();
      expect(cfg.hero.subtitle).toBeTruthy();
      expect(cfg.kpi.title).toBeTruthy();
      expect(cfg.categories).toHaveLength(4);
      expect(cfg.periods).toHaveLength(12);

      if (locale !== "fr") {
        expect(cfg.hero.title).not.toBe(frCfg.hero.title);
        expect(cfg.kpi.cardButtonLabel).not.toBe(frCfg.kpi.cardButtonLabel);
      }

      for (let i = 0; i < cfg.periods.length; i++) {
        const p = cfg.periods[i];
        const frP = frCfg.periods[i];
        expect(p.title).toBeTruthy();
        expect(p.description).toBeTruthy();
        expect(p.displayPeriod).toBeTruthy();
        expect(p.capital).toBeTruthy();
        if (locale !== "fr") {
          expect(p.title).not.toBe(frP.title);
          expect(p.description).not.toBe(frP.description);
          expect(Array.isArray(p.customTags) && p.customTags.length).toBeGreaterThanOrEqual(4);
          if (p.notableLeaders && p.notableLeaders.length > 0 && frP.notableLeaders && frP.notableLeaders.length > 0) {
            expect(p.notableLeaders[0].role).not.toBe(frP.notableLeaders[0].role);
          }
          if (p.eraTribes && p.eraTribes.length > 0 && frP.eraTribes && frP.eraTribes.length > 0) {
            expect(p.eraTribes[0].homelandDescription).not.toBe(frP.eraTribes[0].homelandDescription);
          }
        }
        const dossier = getEraResearchDossier(p.id, locale, p);
        expect(dossier.chapters.length).toBeGreaterThanOrEqual(2);
        if (locale === "ar") {
          expect(/[\u0600-\u06FF]/.test(p.title)).toBe(true);
          expect(/[\u0600-\u06FF]/.test(p.description)).toBe(true);
          expect(/[\u0600-\u06FF]/.test(dossier.chapters[0].title)).toBe(true);
        }
      }
    }
  });

  it("translates all 28 archive cards and 8 location tabs on the public Sources & Archives page across all 6 locales", () => {
    const store = loadSourcesMultiLocaleStore();
    expect(ARCHIVES_DIRECTORY.length).toBe(28);

    const frCards = ARCHIVES_DIRECTORY.map((c) => resolveLocalizedSourceCard(c, "fr", store));
    for (const locale of SUPPORTED_LOCALES) {
      const locInfo = resolveLocalizedLocation({ key: "tunisia", label: "Tunisie" }, locale, store);
      expect(locInfo.label).toBeTruthy();

      for (let i = 0; i < ARCHIVES_DIRECTORY.length; i++) {
        const card = resolveLocalizedSourceCard(ARCHIVES_DIRECTORY[i], locale, store);
        expect(card.name).toBeTruthy();
        expect(card.description).toBeTruthy();
        expect(card.badge).toBeTruthy();
        expect(card.tags.length).toBeGreaterThan(0);

        if (locale !== "fr") {
          expect(card.description).not.toBe(frCards[i].description);
          expect(card.badge).not.toBe(frCards[i].badge);
        }
        if (locale === "ar") {
          expect(/[\u0600-\u06FF]/.test(card.name)).toBe(true);
          expect(/[\u0600-\u06FF]/.test(card.description)).toBe(true);
        }
      }
    }
  });
});
