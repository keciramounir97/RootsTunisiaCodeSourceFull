import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "../login";
import { TranslationProvider } from "../../context/TranslationContext";
import { SUPPORTED_LOCALES, isRtlLocale, tForLocale } from "../../utils/translations";

const mockLogin = vi.fn();
let mockUser: any = null;

vi.mock("../../admin/components/AuthContext", () => ({
  useAuth: () => ({
    login: (...args: any[]) => mockLogin(...args),
    user: mockUser,
    loading: false,
    isAdmin: false,
  }),
}));

vi.mock("react-leaflet", () => ({
  MapContainer: ({ children }: any) => <div data-testid="leaflet-map-container">{children}</div>,
  TileLayer: () => <div data-testid="leaflet-tile-layer" />,
  Marker: ({ children }: any) => <div data-testid="leaflet-marker">{children}</div>,
  Tooltip: ({ children }: any) => <div data-testid="leaflet-tooltip">{children}</div>,
  Popup: ({ children }: any) => <div data-testid="leaflet-popup">{children}</div>,
  useMap: () => ({
    setView: vi.fn(),
    flyTo: vi.fn(),
    invalidateSize: vi.fn(),
    getSize: () => ({ x: 600, y: 600 }),
    getContainer: () => null,
  }),
}));

describe("Login Page Complete 6-Language Translation & RTL/LTR Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUser = null;
    localStorage.clear();
    document.head.innerHTML = "";
    document.title = "";
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query.includes("min-width: 1024px"),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it("translates every UI label, placeholder, button, map embed control, SEO tag, and direction across all 6 languages", async () => {
    for (const locale of SUPPORTED_LOCALES) {
      localStorage.setItem("locale", locale);
      const t = (key: string) => tForLocale(locale, key);
      const expectArabic = locale === "ar";

      const { container, unmount } = render(
        <MemoryRouter initialEntries={["/login"]}>
          <TranslationProvider>
            <Login />
          </TranslationProvider>
        </MemoryRouter>,
      );

      // 1. RTL / LTR root direction & logical alignment
      const expectedDir = isRtlLocale(locale) ? "rtl" : "ltr";
      expect(container.firstElementChild).toHaveAttribute("dir", expectedDir);
      expect(document.documentElement.dir).toBe(expectedDir);
      expect(document.documentElement.lang).toBe(locale);

      // 2. SEO metadata without duplicated brand suffix
      await waitFor(() => {
        expect(document.title).toBe(t("seo_login_title"));
      });
      expect(document.title).not.toMatch(/Roots Tunisia.*Roots Tunisia|جذور تونس.*جذور تونس/);
      expect(document.head.querySelector('meta[name="description"]')?.getAttribute("content")).toBe(
        t("seo_login_description"),
      );
      expect(document.head.querySelector('meta[name="keywords"]')?.getAttribute("content")).toBe(
        t("seo_login_keywords"),
      );

      // 3. Heading, subtitle, inputs, placeholders, links, buttons
      expect(screen.getByRole("heading", { level: 1, name: t("welcome_back") })).toBeInTheDocument();
      expect(screen.getByText(t("login_subtitle"))).toBeInTheDocument();
      const emailInput = screen.getByLabelText(t("email"));
      expect(emailInput).toHaveAttribute("placeholder", t("email_placeholder"));
      expect(screen.getByLabelText(t("login_password"))).toBeInTheDocument();

      // Show/Hide password toggle aria-label + title
      const toggleBtn = screen.getByRole("button", { name: t("show_password") });
      expect(toggleBtn).toHaveAttribute("title", t("show_password"));
      fireEvent.click(toggleBtn);
      expect(screen.getByRole("button", { name: t("hide_password") })).toHaveAttribute(
        "title",
        t("hide_password"),
      );

      expect(screen.getByRole("link", { name: t("forgot_password") })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: t("login") })).toBeInTheDocument();
      expect(screen.getByText(t("no_account_yet"))).toBeInTheDocument();
      expect(screen.getByRole("link", { name: t("create_account") })).toBeInTheDocument();

      // 4. Embedded interactive map inside /login
      expect(screen.getByText(t("map_auth_title"))).toBeInTheDocument();
      expect(screen.getByText(t("map_auth_subtitle"))).toBeInTheDocument();
      expect(screen.getByText(t("map_btn_open_fullscreen"))).toBeInTheDocument();
      expect(screen.getByRole("button", { name: t("region_all") })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: t("map_layer_osm") })).toBeInTheDocument();

      // Selecting a governorate card in the embedded map translates its historical caidat & CTA
      const tunisBtns = screen.getAllByRole("button", { name: t("gov_name_tunis") });
      fireEvent.click(tunisBtns[0]);
      expect(screen.getByText(t("gov_caidat_tunis"))).toBeInTheDocument();
      expect(screen.getByText(t("map_open_dossier"))).toBeInTheDocument();

      if (expectArabic) {
        for (const key of [
          "seo_login_title",
          "seo_login_description",
          "welcome_back",
          "login_subtitle",
          "email",
          "email_placeholder",
          "login_password",
          "show_password",
          "hide_password",
          "forgot_password",
          "login",
          "no_account_yet",
          "create_account",
          "gov_caidat_tunis",
          "map_open_dossier",
        ]) {
          expect(/[\u0600-\u06FF]/.test(t(key))).toBe(true);
        }
      }

      unmount();
    }
  });

  it("translates all validation, loading, and backend/network auth errors across all 6 languages", async () => {
    for (const locale of SUPPORTED_LOCALES) {
      localStorage.setItem("locale", locale);
      const t = (key: string) => tForLocale(locale, key);

      const { unmount } = render(
        <MemoryRouter initialEntries={["/login"]}>
          <TranslationProvider>
            <Login />
          </TranslationProvider>
        </MemoryRouter>,
      );

      // 1. Empty form submission shows localized email + password validation errors (and never 'new admin')
      fireEvent.click(screen.getByRole("button", { name: t("login") }));
      expect(screen.getByText(t("valid_email_required"))).toBeInTheDocument();
      expect(screen.getByText(t("password_required"))).toBeInTheDocument();
      expect(t("password_required")).not.toMatch(/new admin/i);

      // Fill valid syntax credentials
      fireEvent.change(screen.getByLabelText(t("email")), {
        target: { value: "researcher@rootstunisia.com" },
      });
      fireEvent.change(screen.getByLabelText(t("login_password")), {
        target: { value: "secret123" },
      });

      // 2. Loading spinner text while login is pending
      let resolveLogin!: (u: any) => void;
      mockLogin.mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveLogin = resolve;
          }),
      );
      fireEvent.click(screen.getByRole("button", { name: t("login") }));
      expect(screen.getByText(t("please_wait"))).toBeInTheDocument();
      resolveLogin(null);
      await waitFor(() => {
        expect(screen.getByText(t("login_failed_no_user"))).toBeInTheDocument();
      });

      // 3. Translated backend/network API errors
      const apiErrors: Array<[string, string]> = [
        ["Invalid credentials", "invalid_credentials"],
        ["Your account is pending validation", "auth_error_account_pending"],
        ["Your account is not allowed to log in", "auth_error_account_blocked"],
        ["Network Error", "auth_error_network"],
      ];

      for (const [rawBackendMsg, expectedKey] of apiErrors) {
        mockLogin.mockRejectedValueOnce({
          response: { data: { message: rawBackendMsg } },
        });
        fireEvent.click(screen.getByRole("button", { name: t("login") }));
        await waitFor(() => {
          expect(screen.getByText(t(expectedKey))).toBeInTheDocument();
        });
      }

      unmount();
    }
  });
});

