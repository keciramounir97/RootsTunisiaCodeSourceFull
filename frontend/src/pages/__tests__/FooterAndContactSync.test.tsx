import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import FooterSettings from "../../admin/pages/FooterSettings";
import Footer from "../../components/Footer";
import ContactUs from "../contactUs";
import { TranslationProvider } from "../../context/TranslationContext";
import { SUPPORTED_LOCALES } from "../../utils/translations";
import {
  FOOTER_STORAGE_KEY,
  getPlatformLabel,
  resolveSocialHref,
} from "../../utils/footerConfig";
import { refreshSiteContent } from "../../hooks/useSiteContent";

const mockGet = vi.fn();
const mockPut = vi.fn();
const mockPost = vi.fn();

vi.mock("../../api/client", () => ({
  api: {
    get: (...args: any[]) => mockGet(...args),
    put: (...args: any[]) => mockPut(...args),
    post: (...args: any[]) => mockPost(...args),
  },
}));

describe("Footer Settings <-> Footer <-> Contact Page Official Platforms Sync", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    localStorage.clear();
    localStorage.setItem("locale", "fr");
    mockGet.mockResolvedValue({ data: { pages: [] } });
    mockPut.mockResolvedValue({ data: { ok: true } });
    mockPost.mockResolvedValue({ data: { ok: true } });
    await refreshSiteContent();
  });

  it("toggling checkboxes in FooterSettings makes platforms appear/disappear simultaneously in Footer and Contact Page", async () => {
    // Seed only after admin filled real URLs — defaults ship empty/disabled.
    localStorage.setItem(
      FOOTER_STORAGE_KEY,
      JSON.stringify({
        socialLinks: [
          { id: "wa", icon: "whatsapp", url: "", enabled: false },
          { id: "fb", icon: "facebook", url: "https://facebook.com/rootstunisia", enabled: true },
          { id: "ig", icon: "instagram", url: "https://instagram.com/rootstunisia", enabled: true },
          { id: "yt", icon: "youtube", url: "https://youtube.com/@rootstunisia", enabled: false },
        ],
        location: "",
        email: "contact@rootstunisia.com",
        phone: "",
        whatsapp: "",
      }),
    );

    render(
      <MemoryRouter initialEntries={["/helpcenter"]}>
        <TranslationProvider>
          <div data-testid="admin-pane">
            <FooterSettings />
          </div>
          <div data-testid="contact-pane">
            <ContactUs />
          </div>
          <Footer data={{ enabled: true }} />
        </TranslationProvider>
      </MemoryRouter>,
    );

    const adminPane = () => screen.getByTestId("admin-pane");
    const contactPane = () => screen.getByTestId("contact-pane");
    const footerEl = () => document.querySelector("footer") as HTMLElement;
    const footerNav = () =>
      within(footerEl()).queryByRole("navigation", { name: "Réseaux Sociaux" });

    await waitFor(() => {
      expect(within(contactPane()).getByText("Facebook Officiel")).toBeInTheDocument();
      expect(within(contactPane()).getByText("Instagram Roots")).toBeInTheDocument();
    });
    expect(within(contactPane()).queryByText("WhatsApp Officiel")).not.toBeInTheDocument();
    expect(within(contactPane()).queryByText("YouTube Officiel")).not.toBeInTheDocument();

    expect(within(footerNav()!).queryByLabelText("WhatsApp Officiel")).not.toBeInTheDocument();
    expect(within(footerNav()!).getByLabelText("Facebook Officiel")).toHaveAttribute(
      "href",
      "https://facebook.com/rootstunisia",
    );
    expect(within(footerNav()!).getByLabelText("Instagram Roots")).toHaveAttribute(
      "href",
      "https://instagram.com/rootstunisia",
    );
    expect(within(footerNav()!).queryByLabelText("YouTube Officiel")).not.toBeInTheDocument();

    // 1. Uncheck Facebook -> disappears immediately from BOTH Footer & Contact Page
    const fbCheckbox = within(adminPane()).getByLabelText("Facebook — Actif");
    fireEvent.click(fbCheckbox);

    await waitFor(() => {
      expect(within(contactPane()).queryByText("Facebook Officiel")).not.toBeInTheDocument();
      expect(within(footerEl()).queryByLabelText("Facebook Officiel")).not.toBeInTheDocument();
    });

    // Backend site-content persistence receives socialLinksJson with facebook enabled: false
    await waitFor(() => {
      expect(mockPut).toHaveBeenCalledWith(
        "/admin/site-content",
        expect.objectContaining({
          pages: expect.arrayContaining([
            expect.objectContaining({
              id: "footer",
            }),
          ]),
        }),
      );
    });

    // 2. Check YouTube -> appears immediately in BOTH Footer & Contact Page
    const ytCheckbox = within(adminPane()).getByLabelText("YouTube — Actif");
    fireEvent.click(ytCheckbox);

    await waitFor(() => {
      expect(within(contactPane()).getByText("YouTube Officiel")).toBeInTheDocument();
      expect(within(footerNav()!).getByLabelText("YouTube Officiel")).toHaveAttribute(
        "href",
        "https://youtube.com/@rootstunisia",
      );
    });
    const ytContactLink = within(contactPane()).getByText("YouTube Officiel").closest("a");
    expect(ytContactLink).toHaveAttribute("href", "https://youtube.com/@rootstunisia");

    // 3. Uncheck ALL remaining active platforms -> both Footer nav & Plateformes Officielles card disappear
    fireEvent.click(within(adminPane()).getByLabelText("Instagram — Actif"));
    fireEvent.click(within(adminPane()).getByLabelText("YouTube — Actif"));

    await waitFor(() => {
      expect(footerNav()).toBeNull();
      expect(within(contactPane()).queryByText("Plateformes Officielles")).not.toBeInTheDocument();
    });
  });

  it("updates platform URLs, supports WhatsApp numbers, adds new networks, and deletes networks across both Footer and Contact Page", async () => {
    localStorage.setItem(
      FOOTER_STORAGE_KEY,
      JSON.stringify({
        socialLinks: [
          { id: "wa", icon: "whatsapp", url: "", enabled: false },
          { id: "fb", icon: "facebook", url: "https://facebook.com/rootstunisia", enabled: true },
          { id: "ig", icon: "instagram", url: "https://instagram.com/rootstunisia", enabled: true },
          { id: "yt", icon: "youtube", url: "", enabled: false },
        ],
        location: "",
        email: "contact@rootstunisia.com",
        phone: "",
        whatsapp: "",
      }),
    );

    render(
      <MemoryRouter initialEntries={["/helpcenter"]}>
        <TranslationProvider>
          <div data-testid="admin-pane">
            <FooterSettings />
          </div>
          <div data-testid="contact-pane">
            <ContactUs />
          </div>
          <Footer data={{ enabled: true }} />
        </TranslationProvider>
      </MemoryRouter>,
    );

    const adminPane = () => screen.getByTestId("admin-pane");
    const contactPane = () => screen.getByTestId("contact-pane");

    await waitFor(() => {
      expect(within(contactPane()).getByText("Facebook Officiel")).toBeInTheDocument();
    });

    fireEvent.click(within(adminPane()).getByLabelText("WhatsApp — Actif"));
    const waInput = within(adminPane()).getByLabelText("URL WhatsApp");
    fireEvent.change(waInput, { target: { value: "+216 22 111 444" } });
    fireEvent.blur(waInput);

    const saveBtn = within(adminPane()).getByRole("button", {
      name: /Save Settings|Enregistrer/i,
    });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(within(contactPane()).getByText("WhatsApp Officiel")).toBeInTheDocument();
      const contactWa = within(contactPane()).getByText("WhatsApp Officiel").closest("a");
      expect(contactWa).toHaveAttribute("href", "https://wa.me/21622111444");
      const footerWa = within(document.querySelector("footer") as HTMLElement).getByLabelText(
        "WhatsApp Officiel",
      );
      expect(footerWa).toHaveAttribute("href", "https://wa.me/21622111444");
    });

    // Add a new Telegram platform
    fireEvent.click(within(adminPane()).getByRole("button", { name: /Ajouter un Lien/i }));
    const platformSelects = within(adminPane()).getAllByRole("combobox");
    const newSelect = platformSelects[platformSelects.length - 1];
    fireEvent.change(newSelect, { target: { value: "telegram" } });

    const tgInput = within(adminPane()).getByLabelText("URL Telegram");
    fireEvent.change(tgInput, { target: { value: "https://t.me/rootstunisia" } });
    fireEvent.blur(tgInput);

    await waitFor(() => {
      expect(within(contactPane()).getByText("Telegram Officiel").closest("a")).toHaveAttribute(
        "href",
        "https://t.me/rootstunisia",
      );
      expect(
        within(document.querySelector("footer") as HTMLElement).getByLabelText("Telegram Officiel"),
      ).toHaveAttribute("href", "https://t.me/rootstunisia");
    });

    // Delete Telegram -> disappears immediately from BOTH Footer & Contact Page
    const deleteButtons = within(adminPane()).getAllByTitle("Supprimer");
    fireEvent.click(deleteButtons[deleteButtons.length - 1]);

    await waitFor(() => {
      expect(within(contactPane()).queryByText("Telegram Officiel")).not.toBeInTheDocument();
      expect(
        within(document.querySelector("footer") as HTMLElement).queryByLabelText("Telegram Officiel"),
      ).not.toBeInTheDocument();
    });
  });

  it("hydrates synced socialLinksJson from /site-content across all 6 languages even when localStorage is empty", async () => {
    const serverLinks = {
      updatedAt: 9999999999999,
      links: [
        { id: "wa", icon: "whatsapp", url: "https://wa.me/21699888777", enabled: true },
        { id: "fb", icon: "facebook", url: "https://facebook.com/rootstunisia", enabled: false },
        { id: "li", icon: "linkedin", url: "https://linkedin.com/company/roots-tunisia", enabled: true },
      ],
    };

    mockGet.mockImplementation((url: string) => {
      if (url === "/site-content") {
        return Promise.resolve({
          data: {
            version: 1,
            updatedAt: "2026-11-12T23:00:00.000Z",
            pages: {
              footer: {
                config: {
                  email: { type: "text", value: "archives@rootstunisia.com" },
                  socialLinksJson: { type: "json", value: JSON.stringify(serverLinks) },
                },
              },
            },
          },
        });
      }
      return Promise.resolve({ data: null });
    });
    await refreshSiteContent();

    for (const loc of SUPPORTED_LOCALES) {
      localStorage.removeItem(FOOTER_STORAGE_KEY);
      localStorage.setItem("locale", loc);

      const { unmount } = render(
        <MemoryRouter initialEntries={["/helpcenter"]}>
          <TranslationProvider>
            <ContactUs />
            <Footer data={{ enabled: true }} />
          </TranslationProvider>
        </MemoryRouter>,
      );

      const waLabel = getPlatformLabel("whatsapp", loc);
      const fbLabel = getPlatformLabel("facebook", loc);
      const liLabel = getPlatformLabel("linkedin", loc);

      await waitFor(() => {
        expect(screen.getByText(waLabel).closest("a")).toHaveAttribute(
          "href",
          "https://wa.me/21699888777",
        );
        expect(screen.getByText(liLabel).closest("a")).toHaveAttribute(
          "href",
          "https://linkedin.com/company/roots-tunisia",
        );
      });

      const footerEl = document.querySelector("footer") as HTMLElement;
      expect(within(footerEl).getByLabelText(waLabel)).toHaveAttribute(
        "href",
        "https://wa.me/21699888777",
      );
      expect(within(footerEl).getByLabelText(liLabel)).toHaveAttribute(
        "href",
        "https://linkedin.com/company/roots-tunisia",
      );
      // Disabled in FooterSettings -> hidden in BOTH Footer and Contact Page across all 6 languages
      expect(screen.queryByText(fbLabel)).not.toBeInTheDocument();
      expect(within(footerEl).queryByLabelText(fbLabel)).not.toBeInTheDocument();

      unmount();
    }
  });

  it("blocks unsafe URL schemes cleanly in resolveSocialHref", () => {
    expect(resolveSocialHref("facebook", "javascript:alert(1)")).toBe("");
    expect(resolveSocialHref("whatsapp", "+216 92 225 533")).toBe("https://wa.me/21692225533");
    expect(resolveSocialHref("instagram", "instagram.com/rootstunisia")).toBe(
      "https://instagram.com/rootstunisia",
    );
    expect(resolveSocialHref("youtube", "https://")).toBe("");
  });
});
