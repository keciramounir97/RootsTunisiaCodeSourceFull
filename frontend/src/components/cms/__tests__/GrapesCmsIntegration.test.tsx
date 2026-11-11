import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

const { mockGetText } = vi.hoisted(() => ({
  mockGetText: vi.fn(),
}));

const apiMock = vi.hoisted(() => ({
  get: vi.fn(),
  put: vi.fn(),
  post: vi.fn(),
  defaults: { baseURL: "http://localhost:5000/api" },
}));

vi.mock("../../../hooks/useSiteContent", () => ({
  useSiteContent: () => ({
    content: { version: 1, updatedAt: null, pages: {} },
    loading: false,
    getText: mockGetText,
    getHtml: mockGetText,
    getImage: vi.fn(),
    getList: vi.fn(),
  }),
  refreshSiteContent: vi.fn(async () => ({ version: 1, updatedAt: null, pages: {} })),
}));

vi.mock("../../../api/client", () => ({
  api: apiMock,
  default: apiMock,
}));

vi.mock("../../../context/TranslationContext", () => ({
  useTranslation: () => ({
    t: (_k: string, fallback?: string) => fallback || _k,
    locale: "fr",
    isRtl: false,
    setLocale: vi.fn(),
  }),
}));

import SiteCustomBlocks, {
  sanitizeClientBuilderHtml,
  scopeBuilderCss,
} from "../SiteCustomBlocks";
import { DEFAULT_FOOTER_CONFIG } from "../../../utils/footerConfig";
import SinglePageContentManager from "../../../admin/pages/SinglePageContentManager";

describe("CMS Studio Integration for Roots Tunisia (Fast, Clean, GrapesJS Free)", () => {
  beforeEach(() => {
    mockGetText.mockReset();
    apiMock.get.mockReset().mockResolvedValue({
      data: {
        data: {
          version: 1,
          updatedAt: null,
          updatedBy: null,
          pages: [
            {
              id: "home",
              label: "Home",
              path: "/",
              sections: [
                {
                  id: "hero",
                  label: "Hero banner",
                  fields: [
                    { key: "title", type: "text", label: "Heading", value: "Tunisie" },
                  ],
                },
              ],
            },
          ],
        },
      },
    });
  });

  it("sanitizes builder HTML safely while preserving Tunisian media and layout elements", () => {
    const clean = sanitizeClientBuilderHtml(
      '<section class="rt-section"><h2 onclick="alert(1)">Carthage</h2><img src="/assets/slider-carthage.jpg" alt="Carthage" onerror="evil()"><script>alert(1)</script><a href="https://rootstunisia.com">Lien</a><a href="javascript:alert(1)">Bad</a></section>',
    );
    expect(clean).toContain('<section class="rt-section">');
    expect(clean).toContain("Carthage");
    expect(clean).toContain('src="/assets/slider-carthage.jpg"');
    expect(clean).not.toMatch(/script|onclick|onerror|javascript:/i);
  });

  it("scopes custom CSS rules cleanly without global leakage", () => {
    const scoped = scopeBuilderCss(
      `@import url("https://bad.test/a.css");
       body { margin: 0; }
       .rt-card { border-radius: 12px; }
       @media (max-width: 768px) { .rt-grid-3 { grid-template-columns: 1fr; } }
       @keyframes fade { from { opacity: 0; } to { opacity: 1; } }`,
      '[data-rt-gjs-scope="home"]',
    );
    expect(scoped).toContain('[data-rt-gjs-scope="home"] { margin: 0; }');
    expect(scoped).toContain('[data-rt-gjs-scope="home"] .rt-card { border-radius: 12px; }');
    expect(scoped).toContain("@media (max-width: 768px) {");
    expect(scoped).toContain('[data-rt-gjs-scope="home"] .rt-grid-3');
    expect(scoped).toContain("@keyframes fade");
    expect(scoped).not.toContain("@import");
  });

  it("renders SiteCustomBlocks dynamically and returns null when empty", () => {
    mockGetText.mockReturnValue("");
    const emptyRender = render(<SiteCustomBlocks pageId="about" />);
    expect(emptyRender.container.firstChild).toBeNull();

    mockGetText.mockImplementation((_page: string, _sec: string, key: string) => {
      if (key === "html") return '<div class="rt-box">Mémoire de Kairouan</div>';
      if (key === "css") return ".rt-box { color: rgb(212, 166, 80); }";
      return "";
    });
    const { container } = render(<SiteCustomBlocks pageId="about" />);
    const scopeEl = container.querySelector('[data-rt-gjs-scope="about"]');
    expect(scopeEl).not.toBeNull();
    expect(scopeEl?.innerHTML).toContain("Mémoire de Kairouan");
    expect(scopeEl?.innerHTML).toContain('[data-rt-gjs-scope="about"] .rt-box');
  });

  it("leaves phone and address vacant by default in footerConfig until configured by admin", () => {
    expect(DEFAULT_FOOTER_CONFIG.phone).toBe("");
    expect(DEFAULT_FOOTER_CONFIG.location).toBe("");
    expect(DEFAULT_FOOTER_CONFIG.email).toContain("rootstunisia.com");
  });

  it("loads SinglePageContentManager with fast Studio Éditeur and Vraie Page Publique without GrapesJS overhead", async () => {
    render(
      <MemoryRouter>
        <SinglePageContentManager pageId="home" />
      </MemoryRouter>,
    );
    const studioTabBtn = await screen.findByRole("button", { name: /Studio Éditeur/i });
    expect(studioTabBtn).toBeTruthy();
    const livePageTabBtn = await screen.findByRole("button", { name: /Vraie Page Publique/i });
    expect(livePageTabBtn).toBeTruthy();
    expect(screen.queryByRole("button", { name: /GrapesJS Builder/i })).toBeNull();
  });
});
