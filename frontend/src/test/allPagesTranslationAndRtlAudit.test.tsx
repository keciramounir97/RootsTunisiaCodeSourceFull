import { describe, it, expect } from "vitest";
import arLocale from "../locales/ar.json";
import enLocale from "../locales/en.json";
import frLocale from "../locales/fr.json";
import esLocale from "../locales/es.json";
import itLocale from "../locales/it.json";
import mtLocale from "../locales/mt.json";
import { tForLocale, isRtlLocale, SUPPORTED_LOCALES } from "../utils/translations";

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
      "tier_features_title",
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
});
