import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SignUp from "../signup";
import { TranslationProvider } from "../../context/TranslationContext";
import { SUPPORTED_LOCALES, isRtlLocale, tForLocale } from "../../utils/translations";

const mockRegister = vi.fn();
let mockUser: any = null;

vi.mock("../../admin/components/AuthContext", () => ({
  useAuth: () => ({
    register: (...args: any[]) => mockRegister(...args),
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

describe("Signup Page Complete 6-Language Translation & RTL/LTR Suite", () => {
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

  it("translates every UI label, placeholder, toggle, map detail, SEO tag, and direction across all 6 languages", async () => {
    for (const locale of SUPPORTED_LOCALES) {
      localStorage.setItem("locale", locale);
      const t = (key: string) => tForLocale(locale, key);

      const { container, unmount } = render(
        <MemoryRouter initialEntries={["/signup"]}>
          <TranslationProvider>
            <SignUp />
          </TranslationProvider>
        </MemoryRouter>,
      );

      // 1. RTL / LTR root direction & document attributes
      const expectedDir = isRtlLocale(locale) ? "rtl" : "ltr";
      expect(container.firstElementChild).toHaveAttribute("dir", expectedDir);
      expect(document.documentElement.dir).toBe(expectedDir);
      expect(document.documentElement.lang).toBe(locale);

      // 2. SEO tags
      await waitFor(() => {
        expect(document.title).toBe(t("seo_signup_title"));
      });
      expect(document.title).not.toMatch(/Roots Tunisia.*Roots Tunisia|جذور تونس.*جذور تونس/);
      expect(document.head.querySelector('meta[name="description"]')?.getAttribute("content")).toBe(
        t("seo_signup_description"),
      );
      expect(document.head.querySelector('meta[name="keywords"]')?.getAttribute("content")).toBe(
        t("seo_signup_keywords"),
      );

      // 3. Heading, subtitle, all 4 form inputs & placeholders, links & submit button
      expect(
        screen.getByRole("heading", { level: 1, name: t("create_account") }),
      ).toBeInTheDocument();
      expect(screen.getByText(t("signup_subtitle"))).toBeInTheDocument();

      const fullNameInput = screen.getByLabelText(t("full_name"));
      expect(fullNameInput).toHaveAttribute("placeholder", t("full_name_placeholder"));
      const emailInput = screen.getByLabelText(t("email"));
      expect(emailInput).toHaveAttribute("placeholder", t("email_placeholder"));
      expect(screen.getByLabelText(t("password"))).toBeInTheDocument();
      expect(screen.getByLabelText(t("confirm_password"))).toBeInTheDocument();

      if (locale === "ar") {
        expect(t("confirm_password")).toBe("تأكيد كلمة المرور");
      }

      // Show/Hide password & confirm password eye buttons
      const pwdToggle = screen.getByRole("button", { name: t("show_password") });
      expect(pwdToggle).toHaveAttribute("title", t("show_password"));
      fireEvent.click(pwdToggle);
      expect(screen.getByRole("button", { name: t("hide_password") })).toHaveAttribute(
        "title",
        t("hide_password"),
      );

      const confirmToggle = screen.getByRole("button", { name: t("show_confirm_password") });
      expect(confirmToggle).toHaveAttribute("title", t("show_confirm_password"));
      fireEvent.click(confirmToggle);
      expect(screen.getByRole("button", { name: t("hide_confirm_password") })).toHaveAttribute(
        "title",
        t("hide_confirm_password"),
      );

      expect(screen.getByRole("button", { name: t("create_account") })).toBeInTheDocument();
      expect(screen.getByText(t("already_have_account"))).toBeInTheDocument();
      expect(screen.getByRole("link", { name: t("sign_in") })).toBeInTheDocument();

      // 4. Embedded map inside /signup
      expect(screen.getByText(t("map_auth_title"))).toBeInTheDocument();
      expect(screen.getByText(t("map_auth_subtitle"))).toBeInTheDocument();
      expect(screen.getByText(t("map_btn_open_fullscreen"))).toBeInTheDocument();
      const tunisBtns = screen.getAllByRole("button", { name: t("gov_name_tunis") });
      fireEvent.click(tunisBtns[0]);
      expect(screen.getByText(t("gov_caidat_tunis"))).toBeInTheDocument();
      expect(screen.getByText(t("map_open_dossier"))).toBeInTheDocument();

      if (locale === "ar") {
        for (const key of [
          "seo_signup_title",
          "seo_signup_description",
          "create_account",
          "signup_subtitle",
          "full_name",
          "full_name_placeholder",
          "name_required",
          "email",
          "password",
          "password_min_6",
          "confirm_password",
          "passwords_do_not_match",
          "show_confirm_password",
          "hide_confirm_password",
          "already_have_account",
          "sign_in",
          "account_created",
          "account_ready_login",
          "back_to_login",
        ]) {
          expect(/[\u0600-\u06FF]/.test(t(key))).toBe(true);
        }
      }

      unmount();
    }
  });

  it("translates validation errors, loading state, API errors, and success view across all 6 languages", async () => {
    for (const locale of SUPPORTED_LOCALES) {
      localStorage.setItem("locale", locale);
      const t = (key: string) => tForLocale(locale, key);

      const { unmount } = render(
        <MemoryRouter initialEntries={["/signup"]}>
          <TranslationProvider>
            <SignUp />
          </TranslationProvider>
        </MemoryRouter>,
      );

      // 1. Empty form with mismatch on confirm triggers fullName, email, password (< 6) errors
      fireEvent.change(screen.getByLabelText(t("password")), {
        target: { value: "123" },
      });
      fireEvent.change(screen.getByLabelText(t("confirm_password")), {
        target: { value: "456" },
      });
      fireEvent.click(screen.getByRole("button", { name: t("create_account") }));

      expect(screen.getByText(t("name_required"))).toBeInTheDocument();
      expect(screen.getByText(t("valid_email_required"))).toBeInTheDocument();
      expect(screen.getByText(t("password_min_6"))).toBeInTheDocument();
      expect(screen.getByText(t("passwords_do_not_match"))).toBeInTheDocument();

      // Fill valid signup inputs
      fireEvent.change(screen.getByLabelText(t("full_name")), {
        target: { value: "Amine Ben Ali" },
      });
      fireEvent.change(screen.getByLabelText(t("email")), {
        target: { value: "amine@rootstunisia.com" },
      });
      fireEvent.change(screen.getByLabelText(t("password")), {
        target: { value: "secret123" },
      });
      fireEvent.change(screen.getByLabelText(t("confirm_password")), {
        target: { value: "secret123" },
      });

      // 2. Backend error translation + fallback registration_failed + network error
      const apiErrors: Array<[string, string]> = [
        ["Email already registered", "auth_error_email_already_registered"],
        ["Network Error", "auth_error_network"],
      ];
      for (const [rawBackendMsg, expectedKey] of apiErrors) {
        mockRegister.mockRejectedValueOnce({
          response: { data: { message: rawBackendMsg } },
        });
        fireEvent.click(screen.getByRole("button", { name: t("create_account") }));
        await waitFor(() => {
          expect(screen.getByText(t(expectedKey))).toBeInTheDocument();
        });
      }

      // Generic fallback when error payload has no message
      mockRegister.mockRejectedValueOnce({});
      fireEvent.click(screen.getByRole("button", { name: t("create_account") }));
      await waitFor(() => {
        expect(screen.getByText(t("registration_failed"))).toBeInTheDocument();
      });

      // 3. Pending loading text -> resolved success screen
      let resolveRegister!: (val: any) => void;
      mockRegister.mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveRegister = resolve;
          }),
      );
      fireEvent.click(screen.getByRole("button", { name: t("create_account") }));
      expect(screen.getByText(t("please_wait"))).toBeInTheDocument();
      resolveRegister({ user: { id: 1 } });

      await waitFor(() => {
        expect(
          screen.getByRole("heading", { level: 2, name: t("account_created") }),
        ).toBeInTheDocument();
      });
      expect(screen.getByText(t("account_ready_login"))).toBeInTheDocument();
      expect(screen.getByRole("link", { name: t("back_to_login") })).toBeInTheDocument();

      unmount();
    }
  });
});

