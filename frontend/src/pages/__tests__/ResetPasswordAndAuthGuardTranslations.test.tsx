import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ResetPassword from "../resetpassword";
import ProtectedRoute from "../../admin/components/protectedRoute";
import { TranslationProvider } from "../../context/TranslationContext";
import { SUPPORTED_LOCALES, isRtlLocale, tForLocale } from "../../utils/translations";

const mockRequestReset = vi.fn();
const mockVerifyReset = vi.fn();
let mockAuthLoading = false;
let mockAuthUser: any = null;

vi.mock("../../admin/components/AuthContext", () => ({
  useAuth: () => ({
    requestReset: (...args: any[]) => mockRequestReset(...args),
    verifyReset: (...args: any[]) => mockVerifyReset(...args),
    user: mockAuthUser,
    loading: mockAuthLoading,
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

describe("Reset Password & ProtectedRoute 6-Language Translation & RTL/LTR Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthLoading = false;
    mockAuthUser = null;
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

  it("translates every step (request -> verify -> done), validation/API errors, SEO tags, and embedded map on /resetpassword across all 6 languages", async () => {
    for (const locale of SUPPORTED_LOCALES) {
      localStorage.setItem("locale", locale);
      const t = (key: string) => tForLocale(locale, key);

      const { container, unmount } = render(
        <MemoryRouter initialEntries={["/resetpassword"]}>
          <TranslationProvider>
            <ResetPassword />
          </TranslationProvider>
        </MemoryRouter>,
      );

      const expectedDir = isRtlLocale(locale) ? "rtl" : "ltr";
      expect(container.firstElementChild).toHaveAttribute("dir", expectedDir);
      expect(document.documentElement.dir).toBe(expectedDir);
      expect(document.documentElement.lang).toBe(locale);

      // 1. SEO metadata
      await waitFor(() => {
        expect(document.title).toBe(t("seo_reset_title"));
      });
      expect(document.title).not.toMatch(/Roots Tunisia.*Roots Tunisia|جذور تونس.*جذور تونس/);
      expect(document.head.querySelector('meta[name="description"]')?.getAttribute("content")).toBe(
        t("seo_reset_description"),
      );
      expect(document.head.querySelector('meta[name="keywords"]')?.getAttribute("content")).toBe(
        t("seo_reset_keywords"),
      );

      // 2. Step 1 (request): heading, instruction, label, placeholder, remember link, embedded map
      expect(
        screen.getByRole("heading", { level: 1, name: t("reset_password") }),
      ).toBeInTheDocument();
      expect(screen.getByText(t("reset_password_instruction"))).toBeInTheDocument();
      const emailInput = screen.getByLabelText(t("email"));
      expect(emailInput).toHaveAttribute("placeholder", t("placeholder_email_example"));
      expect(screen.getByText(t("remember_password"))).toBeInTheDocument();
      expect(screen.getByRole("link", { name: t("login") })).toBeInTheDocument();

      // Embedded map panel + caidat overlay check
      expect(screen.getByText(t("map_auth_title"))).toBeInTheDocument();
      const tunisBtns = screen.getAllByRole("button", { name: t("gov_name_tunis") });
      fireEvent.click(tunisBtns[0]);
      expect(screen.getByText(t("gov_caidat_tunis"))).toBeInTheDocument();

      // Validation error when submitting empty email
      fireEvent.click(screen.getByRole("button", { name: t("send_reset_code") }));
      expect(screen.getByText(t("valid_email_required"))).toBeInTheDocument();

      // Fill valid email -> test API error translation -> then sending_code loading -> transition to step 2
      fireEvent.change(emailInput, { target: { value: "reset@rootstunisia.com" } });
      mockRequestReset.mockRejectedValueOnce({
        response: { data: { message: "Network Error" } },
      });
      fireEvent.click(screen.getByRole("button", { name: t("send_reset_code") }));
      await waitFor(() => {
        expect(screen.getByText(t("auth_error_network"))).toBeInTheDocument();
      });

      let resolveRequest!: (val: any) => void;
      mockRequestReset.mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveRequest = resolve;
          }),
      );
      fireEvent.click(screen.getByRole("button", { name: t("send_reset_code") }));
      expect(screen.getByRole("button", { name: t("sending_code") })).toBeInTheDocument();
      resolveRequest({ data: { ok: true } });

      // 3. Step 2 (verify): labels, placeholders, eye toggle, validation errors, API error translation
      await waitFor(() => {
        expect(
          screen.getByRole("heading", { level: 1, name: t("enter_reset_code") }),
        ).toBeInTheDocument();
      });
      expect(screen.getByText(t("reset_code_sent_to"))).toBeInTheDocument();
      expect(screen.getByText("reset@rootstunisia.com")).toBeInTheDocument();
      expect(screen.getByLabelText(t("verification_code"))).toHaveAttribute(
        "placeholder",
        t("six_digit_code"),
      );
      const newPwdInput = screen.getByLabelText(t("new_password"));
      expect(newPwdInput).toHaveAttribute("placeholder", t("new_password"));

      // Show/Hide password toggle aria-label & title
      const toggleBtn = screen.getByRole("button", { name: t("show_password") });
      expect(toggleBtn).toHaveAttribute("title", t("show_password"));
      fireEvent.click(toggleBtn);
      expect(screen.getByRole("button", { name: t("hide_password") })).toHaveAttribute(
        "title",
        t("hide_password"),
      );

      expect(screen.getByRole("button", { name: t("change_email_address") })).toBeInTheDocument();

      // Empty code + short password triggers translated field validation errors
      fireEvent.click(screen.getByRole("button", { name: t("reset_password") }));
      expect(screen.getByText(t("reset_code_required"))).toBeInTheDocument();
      expect(screen.getByText(t("password_min_6"))).toBeInTheDocument();

      // Fill code & new password -> test backend OTP error translation -> verifying loading -> step 3
      fireEvent.change(screen.getByLabelText(t("verification_code")), {
        target: { value: "123456" },
      });
      fireEvent.change(newPwdInput, { target: { value: "newpass123" } });

      mockVerifyReset.mockRejectedValueOnce({
        response: { data: { message: "Invalid or expired reset code" } },
      });
      fireEvent.click(screen.getByRole("button", { name: t("reset_password") }));
      await waitFor(() => {
        expect(screen.getByText(t("auth_error_reset_code_expired"))).toBeInTheDocument();
      });

      let resolveVerify!: (val: any) => void;
      mockVerifyReset.mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveVerify = resolve;
          }),
      );
      fireEvent.click(screen.getByRole("button", { name: t("reset_password") }));
      expect(screen.getByRole("button", { name: t("verifying") })).toBeInTheDocument();
      resolveVerify({ ok: true });

      // 4. Step 3 (done): completion heading, description, sign in link
      await waitFor(() => {
        expect(
          screen.getByRole("heading", { level: 2, name: t("password_reset_complete") }),
        ).toBeInTheDocument();
      });
      expect(screen.getByText(t("password_reset_success_desc"))).toBeInTheDocument();
      expect(screen.getByRole("link", { name: t("signin_now") })).toBeInTheDocument();

      if (locale === "ar") {
        for (const key of [
          "seo_reset_title",
          "seo_reset_description",
          "reset_password",
          "reset_password_instruction",
          "placeholder_email_example",
          "send_reset_code",
          "sending_code",
          "remember_password",
          "enter_reset_code",
          "reset_code_sent_to",
          "verification_code",
          "six_digit_code",
          "reset_code_required",
          "new_password",
          "verifying",
          "change_email_address",
          "password_reset_complete",
          "password_reset_success_desc",
          "signin_now",
          "auth_error_reset_code_expired",
          "auth_checking",
        ]) {
          expect(/[\u0600-\u06FF]/.test(t(key))).toBe(true);
        }
      }

      unmount();
    }
  });

  it("translates ProtectedRoute loading screen with proper RTL/LTR direction across all 6 languages", () => {
    mockAuthLoading = true;
    for (const locale of SUPPORTED_LOCALES) {
      localStorage.setItem("locale", locale);
      const t = (key: string) => tForLocale(locale, key);

      const { unmount } = render(
        <MemoryRouter initialEntries={["/myprofile"]}>
          <TranslationProvider>
            <ProtectedRoute>
              <div>Private Content</div>
            </ProtectedRoute>
          </TranslationProvider>
        </MemoryRouter>,
      );

      const checkingEl = screen.getByText(t("auth_checking"));
      expect(checkingEl).toBeInTheDocument();
      expect(checkingEl).toHaveAttribute("dir", isRtlLocale(locale) ? "rtl" : "ltr");
      unmount();
    }
  });
});

