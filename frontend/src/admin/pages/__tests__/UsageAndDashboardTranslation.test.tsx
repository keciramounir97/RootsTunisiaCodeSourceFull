import React, { useLayoutEffect } from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Usage from "../Usage";
import AdminLayout from "../../AdminLayout";
import { TranslationProvider, useTranslation } from "../../../context/TranslationContext";
import { tForLocale } from "../../../utils/translations";
import { localizeTierName, type SubscriptionLocale } from "../../../utils/subscriptionTranslations";

import fr from "../../../locales/fr.json";
import en from "../../../locales/en.json";
import ar from "../../../locales/ar.json";
import es from "../../../locales/es.json";
import itLocale from "../../../locales/it.json";
import mt from "../../../locales/mt.json";

const mockGet = vi.fn();
const mockLogout = vi.fn();
let mockCurrentUser: any = null;

vi.mock("../../../api/client", () => ({
  api: {
    get: (...args: any[]) => mockGet(...args),
  },
}));

vi.mock("../../components/AuthContext", () => ({
  useAuth: () => ({
    user: mockCurrentUser,
    logout: mockLogout,
    token: mockCurrentUser ? "fake-token" : null,
    isAuthenticated: Boolean(mockCurrentUser),
  }),
}));

vi.mock("../../../hooks/useSiteImages", () => ({
  useSiteImages: () => ({
    backgroundImage: "/fake-bg.jpg",
    heroImages: {},
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

const USER_QUOTAS_PAYLOAD = {
  userId: 42,
  tierId: 2,
  tierName: "Chercheur & Actes",
  isSuperAdmin: false,
  limits: {
    trees: { used: 5, max: 5, custom: false }, // Full (100%)
    individuals: { used: 1200, max: 2000, custom: true }, // 60% + Custom Admin Quota
    sources: { used: 210, max: 250, custom: false }, // 84% (Near full)
    notes: { used: 15, max: -1, custom: false }, // Unlimited
    tasks: { used: 0, max: null, custom: false }, // Waiting for quota
    gallery: { used: 45, max: 300, custom: false }, // 15%
    audios: { used: 10, max: 50, custom: false }, // 20%
    documents: { used: 50, max: 250, custom: false }, // 20%
  },
};

const SUPER_ADMIN_QUOTAS_PAYLOAD = {
  userId: 1,
  tierId: 3,
  tierName: "Super Admin (Unlimited)",
  isSuperAdmin: true,
  limits: {
    trees: { used: 12, max: -1, custom: false },
    individuals: { used: 450, max: -1, custom: false },
    sources: { used: 80, max: -1, custom: false },
    notes: { used: 30, max: -1, custom: false },
    tasks: { used: 14, max: -1, custom: false },
    gallery: { used: 95, max: -1, custom: false },
    audios: { used: 18, max: -1, custom: false },
    documents: { used: 64, max: -1, custom: false },
  },
};

function renderDashboardUsage(locale: SubscriptionLocale, quotasPayload: any) {
  window.localStorage.setItem("roots_locale", locale);
  window.localStorage.setItem("locale", locale);
  window.localStorage.setItem("admin_sidebar_open", "true");

  mockGet.mockImplementation((url: string) => {
    if (url.includes("/my/quotas")) {
      return Promise.resolve({ data: quotasPayload });
    }
    return Promise.resolve({ data: {} });
  });

  return render(
    <MemoryRouter initialEntries={["/admin/usage"]}>
      <TranslationProvider>
        <LocaleInitializer locale={locale}>
          <Routes>
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="usage" element={<Usage />} />
            </Route>
          </Routes>
        </LocaleInitializer>
      </TranslationProvider>
    </MemoryRouter>
  );
}

describe("Usage.tsx & User/Admin Dashboard Interface 6-Language + RTL Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
  });

  it.each(["fr", "en", "ar", "es", "it", "mt"] as SubscriptionLocale[])(
    "renders Usage.tsx and full User Dashboard shell (Header, Sidebar, Breadcrumb) in %s with full RTL/LTR support",
    async (locale) => {
      mockCurrentUser = {
        id: 42,
        name: "Youssef Ben Ali",
        role: 2,
        tier_id: 2,
        permissions: [],
      };
      const tr = (key: string) => tForLocale(locale, key);
      const expectedDir = locale === "ar" ? "rtl" : "ltr";
      const { container } = renderDashboardUsage(locale, USER_QUOTAS_PAYLOAD);

      const expectedTierName = localizeTierName("Chercheur & Actes", 2, locale);

      // Wait for quotas to load
      await waitFor(() => {
        expect(screen.getByText(tr("usage_and_quotas"))).toBeInTheDocument();
        expect(screen.getByText(expectedTierName)).toBeInTheDocument();
      });

      // 1. Verify RTL / LTR direction on AdminLayout, AdminHeader, AdminSidebar, Breadcrumb, and Usage
      const layoutRoot = container.firstElementChild as HTMLElement;
      expect(layoutRoot).toHaveAttribute("dir", expectedDir);

      const header = container.querySelector("header") as HTMLElement;
      const aside = container.querySelector("aside") as HTMLElement;
      const breadcrumbNav = screen.getByRole("navigation", { name: tr("breadcrumb") });

      expect(header).toHaveAttribute("dir", expectedDir);
      expect(aside).toHaveAttribute("dir", expectedDir);
      expect(breadcrumbNav).toHaveAttribute("dir", expectedDir);

      if (locale === "ar") {
        expect(aside.className).toContain("right-0");
        expect(aside.className).toContain("border-l");
        expect(header.className).toContain("lg:right-64");
      } else {
        expect(aside.className).toContain("left-0");
        expect(aside.className).toContain("border-r");
        expect(header.className).toContain("lg:left-64");
      }

      // 2. Verify Breadcrumb segments are translated
      expect(within(breadcrumbNav).getByText(tr("home"))).toBeInTheDocument();
      expect(within(breadcrumbNav).getByText(tr("admin"))).toBeInTheDocument();
      expect(within(breadcrumbNav).getByText(tr("usage_quotas"))).toBeInTheDocument();

      // 3. Verify User Dashboard Sidebar categories & all 12 user links are translated
      expect(within(aside).getByText(tr("researcher"))).toBeInTheDocument();
      expect(within(aside).getByText(tr("admin_cat_overview"))).toBeInTheDocument();
      expect(within(aside).getByText(tr("admin_cat_genealogy"))).toBeInTheDocument();
      expect(within(aside).getByText(tr("admin_cat_media"))).toBeInTheDocument();
      expect(within(aside).getByText(tr("admin_cat_account"))).toBeInTheDocument();

      expect(within(aside).getByText(tr("usage_quotas"))).toBeInTheDocument();
      expect(within(aside).getByText(tr("trees"))).toBeInTheDocument();
      expect(within(aside).getByText(tr("individuals"))).toBeInTheDocument();
      expect(within(aside).getByText(tr("my_sources"))).toBeInTheDocument();
      expect(within(aside).getByText(tr("tasks"))).toBeInTheDocument();
      expect(within(aside).getByText(tr("notes"))).toBeInTheDocument();
      expect(within(aside).getByText(tr("gallery"))).toBeInTheDocument();
      expect(within(aside).getByText(tr("audios"))).toBeInTheDocument();
      expect(within(aside).getByText(tr("documents"))).toBeInTheDocument();
      expect(within(aside).getByText(tr("user_upgrade"))).toBeInTheDocument();
      expect(within(aside).getByText(tr("contact_support"))).toBeInTheDocument();
      expect(within(aside).getByText(tr("user_settings"))).toBeInTheDocument();
      expect(within(aside).getByText(tr("nav_signout"))).toBeInTheDocument();

      // 4. Verify AdminHeader elements are translated
      expect(within(header).getByPlaceholderText(tr("nav_search_placeholder"))).toBeInTheDocument();
      expect(within(header).getByText(tr("view_public_site"))).toBeInTheDocument();
      expect(within(header).getByRole("button", { name: tr("toggle_sidebar") })).toBeInTheDocument();
      expect(within(header).getByRole("button", { name: tr("nav_signout") })).toBeInTheDocument();

      // 5. Verify Usage.tsx Hero, Active Plan Banner & Quota Limit Reached Warning
      expect(screen.getByText(tr("usage_subtitle"))).toBeInTheDocument();
      expect(screen.getByText(tr("upgrade_subscription"))).toBeInTheDocument();
      expect(
        screen.getByText(`${expectedTierName} — ${tr("tier_features")}`)
      ).toBeInTheDocument();
      expect(screen.getByText(tr("user_quota_info"))).toBeInTheDocument();
      expect(screen.getByText(tr("view_plans"))).toBeInTheDocument();

      expect(screen.getByText(tr("quota_limit_reached"))).toBeInTheDocument();
      expect(screen.getByText(tr("quota_limit_reached_desc"))).toBeInTheDocument();
      expect(screen.getByText(tr("upgrade_plan"))).toBeInTheDocument();

      // 6. Verify all 8 Resource Cards (Titles, Descriptions, Statuses, Badges, Manage Links)
      const expectedResources = [
        { title: tr("family_trees"), desc: tr("trees_desc") },
        { title: tr("individuals"), desc: tr("ind_desc") },
        { title: tr("my_sources"), desc: tr("sources_desc") },
        { title: tr("research_notes"), desc: tr("notes_desc") },
        { title: tr("research_tasks"), desc: tr("tasks_desc") },
        { title: tr("gallery_images"), desc: tr("gallery_desc") },
        { title: tr("audio_files"), desc: tr("audio_desc") },
        { title: tr("documents"), desc: tr("doc_desc") },
      ];

      for (const res of expectedResources) {
        expect(screen.getAllByText(res.title).length).toBeGreaterThanOrEqual(1);
        expect(screen.getByText(res.desc)).toBeInTheDocument();
        expect(screen.getByText(`${tr("manage_resource")} ${res.title}`)).toBeInTheDocument();
      }

      // Status badges & states
      expect(screen.getByText(tr("full"))).toBeInTheDocument();
      expect(screen.getByText(tr("unlimited"))).toBeInTheDocument();
      expect(screen.getByText(tr("unlimited_access"))).toBeInTheDocument();
      expect(screen.getByText(tr("waiting_quota"))).toBeInTheDocument();
      expect(screen.getByText(tr("custom_admin_quota"))).toBeInTheDocument();
      expect(screen.getAllByText(new RegExp(tr("used"), "i")).length).toBeGreaterThanOrEqual(1);
    }
  );

  it.each(["fr", "en", "ar", "es", "it", "mt"] as SubscriptionLocale[])(
    "renders Super Admin Unlimited mode & all Admin Sidebar categories in %s",
    async (locale) => {
      mockCurrentUser = {
        id: 1,
        name: "Karim Mansour",
        role: 3,
        tier_id: 3,
        permissions: [],
      };
      const tr = (key: string) => tForLocale(locale, key);
      const { container } = renderDashboardUsage(locale, SUPER_ADMIN_QUOTAS_PAYLOAD);

      await waitFor(() => {
        expect(screen.getByText(tr("unlimited_super_admin"))).toBeInTheDocument();
        expect(screen.getByText(tr("super_admin_unlimited_tier"))).toBeInTheDocument();
        expect(screen.getByText(tr("super_admin_quota_unrestricted"))).toBeInTheDocument();
      });

      const aside = container.querySelector("aside") as HTMLElement;
      expect(within(aside).getByText(tr("super_admin"))).toBeInTheDocument();
      expect(within(aside).getByText(tr("admin_cat_content"))).toBeInTheDocument();
      expect(within(aside).getByText(tr("admin_cat_users"))).toBeInTheDocument();
      expect(within(aside).getByText(tr("admin_cat_finance"))).toBeInTheDocument();

      // All 8 resource cards show Unlimited & Unlimited Access
      expect(screen.getAllByText(tr("unlimited")).length).toBe(8);
      expect(screen.getAllByText(tr("unlimited_access")).length).toBe(8);
    }
  );
});
