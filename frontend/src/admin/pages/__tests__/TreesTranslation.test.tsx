import React, { useLayoutEffect } from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Trees from "../Trees";
import { TranslationProvider, useTranslation } from "../../../context/TranslationContext";
import { tForLocale } from "../../../utils/translations";

const mockApiGet = vi.fn();
const mockApiPost = vi.fn();
const mockApiPut = vi.fn();
const mockApiDelete = vi.fn();

vi.mock("../../../api/client", () => ({
  api: {
    get: (...args: any[]) => mockApiGet(...args),
    post: (...args: any[]) => mockApiPost(...args),
    put: (...args: any[]) => mockApiPut(...args),
    delete: (...args: any[]) => mockApiDelete(...args),
  },
}));

vi.mock("../../components/AuthContext", () => ({
  useAuth: () => ({
    user: {
      id: 1,
      email: "researcher@rootstunisia.com",
      fullName: "Mounir Researcher",
      role: 2,
    },
    logout: vi.fn(),
  }),
}));

vi.mock("../../../store/theme", () => ({
  useThemeStore: () => ({
    theme: "dark",
    toggleTheme: vi.fn(),
  }),
}));

const MOCK_MY_TREES = [
  {
    id: 101,
    title: "Famille Ben Mohamed",
    description: "Lignée historique de Tunis",
    archiveSource: "Archives Nationales de Tunisie",
    documentCode: "ANT-101",
    isPublic: false,
    hasGedcom: true,
    has_gedcom: 1,
    gedcom_path: "/uploads/trees/ben_mohamed.ged",
    gedcomPath: "/uploads/trees/ben_mohamed.ged",
    ownerId: 1,
    user_id: 1,
    ownerName: "Mounir Researcher",
    ownerEmail: "researcher@rootstunisia.com",
  },
];

const MOCK_PUBLIC_TREES = [
  {
    id: 202,
    title: "Dynastie Husseinite",
    description: "Arbre public de la dynastie",
    archiveSource: "Bardo",
    documentCode: "ANT-202",
    isPublic: true,
    is_public: 1,
    hasGedcom: false,
    has_gedcom: 0,
    ownerId: 99,
    user_id: 99,
    ownerName: "Other Historian",
    ownerEmail: "historian@rootstunisia.com",
  },
];

const SAMPLE_GEDCOM = [
  "0 HEAD",
  "1 SOUR RootsTunisia",
  "1 GEDC",
  "2 VERS 5.5.1",
  "0 @I1@ INDI",
  "1 NAME Ahmed /Ben Mohamed/",
  "1 SEX M",
  "1 BIRT",
  "2 DATE 1920",
  "2 PLAC Tunis",
  "0 TRLR",
].join("\n");

const LOCALES = ["fr", "en", "ar", "es", "it", "mt"] as const;
type SupportedLocale = (typeof LOCALES)[number];

function LocaleInitializer({
  locale,
  children,
}: {
  locale: SupportedLocale;
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

describe("Trees Page (/admin/trees) & TreesBuilder 6-Language Translation & RTL Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    if (typeof ResizeObserver === "undefined") {
      (globalThis as any).ResizeObserver = class {
        observe() {}
        unobserve() {}
        disconnect() {}
      };
    }
    mockApiGet.mockImplementation((url: string) => {
      if (url.includes("/my")) {
        return Promise.resolve({ data: MOCK_MY_TREES });
      }
      if (url.startsWith("/trees")) {
        return Promise.resolve({ data: MOCK_PUBLIC_TREES });
      }
      if (url.includes("/gedcom")) {
        return Promise.resolve({ data: SAMPLE_GEDCOM });
      }
      return Promise.resolve({ data: [] });
    });
  });

  it.each(LOCALES)(
    "renders the main Trees page, header, canvas, and TreesBuilder toolbar fully translated in '%s' with proper dir (RTL/LTR)",
    async (locale) => {
      window.localStorage.setItem("app_lang", locale);
      window.localStorage.setItem("roots_Locale", locale);

      const { container } = render(
        <MemoryRouter initialEntries={["/admin/trees"]}>
          <TranslationProvider>
            <LocaleInitializer locale={locale}>
              <Trees />
            </LocaleInitializer>
          </TranslationProvider>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalled();
      });

      const expectedDir = locale === "ar" ? "rtl" : "ltr";
      expect(document.documentElement.getAttribute("dir")).toBe(expectedDir);
      const pageRoot = container.querySelector(".heritage-page-root");
      expect(pageRoot?.getAttribute("dir")).toBe(expectedDir);

      // Header title & description
      expect(screen.getByText(tForLocale(locale, "legacy.trees_builder"))).toBeInTheDocument();
      expect(screen.getByText(tForLocale(locale, "legacy.trees_builder_desc"))).toBeInTheDocument();

      // Action buttons
      expect(screen.getByText(tForLocale(locale, "legacy.see_my_trees"))).toBeInTheDocument();
      expect(screen.getByText(tForLocale(locale, "legacy.add_tree"))).toBeInTheDocument();
      expect(screen.getByText(tForLocale(locale, "legacy.refresh"))).toBeInTheDocument();

      // Canvas header & Clear Canvas button
      expect(screen.getByText(tForLocale(locale, "legacy.clear_canvas"))).toBeInTheDocument();

      // TreesBuilder toolbar controls
      expect(screen.getByLabelText(tForLocale(locale, "legacy.zoom_in"))).toBeInTheDocument();
      expect(screen.getByLabelText(tForLocale(locale, "legacy.zoom_out"))).toBeInTheDocument();
      expect(screen.getByText(tForLocale(locale, "legacy.center"))).toBeInTheDocument();
      expect(screen.getAllByText(tForLocale(locale, "legacy.import_gedcom")).length).toBeGreaterThan(0);
      expect(screen.getAllByText(tForLocale(locale, "legacy.export_gedcom")).length).toBeGreaterThan(0);
      expect(screen.getAllByText(tForLocale(locale, "legacy.import_gedcomx")).length).toBeGreaterThan(0);
      expect(screen.getAllByText(tForLocale(locale, "legacy.export_gedcomx")).length).toBeGreaterThan(0);
    }
  );

  it.each(LOCALES)(
    "renders the 'See My Trees' portal drawer (My Trees & Public Trees tabs, search, badges, actions) in '%s' with RTL/LTR support",
    async (locale) => {
      window.localStorage.setItem("app_lang", locale);
      window.localStorage.setItem("roots_Locale", locale);

      render(
        <MemoryRouter initialEntries={["/admin/trees"]}>
          <TranslationProvider>
            <LocaleInitializer locale={locale}>
              <Trees />
            </LocaleInitializer>
          </TranslationProvider>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalled();
      });

      // Open "See My Trees" drawer
      const seeMyTreesBtn = screen.getByTitle(tForLocale(locale, "legacy.see_my_trees"));
      fireEvent.click(seeMyTreesBtn);

      const expectedDir = locale === "ar" ? "rtl" : "ltr";

      // Tabs
      expect(
        screen.getAllByText(new RegExp(tForLocale(locale, "legacy.my_trees").replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))).length
      ).toBeGreaterThan(0);
      const publicTabBtn = screen.getByText(
        new RegExp(tForLocale(locale, "legacy.public_trees").replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      );
      expect(publicTabBtn).toBeInTheDocument();

      // Check portal dir attribute
      const portalWrapper = publicTabBtn.closest("[dir]");
      expect(portalWrapper?.getAttribute("dir")).toBe(expectedDir);

      // Search input placeholder
      expect(
        screen.getByPlaceholderText(tForLocale(locale, "legacy.search_trees"))
      ).toBeInTheDocument();

      // My tree card badges & buttons
      expect(screen.getByText(tForLocale(locale, "legacy.private"))).toBeInTheDocument();
      expect(screen.getByText(tForLocale(locale, "legacy.has_file"))).toBeInTheDocument();
      expect(screen.getByText(tForLocale(locale, "legacy.view_tree"))).toBeInTheDocument();
      expect(screen.getByTitle(tForLocale(locale, "legacy.download"))).toBeInTheDocument();
      expect(screen.getByText(tForLocale(locale, "legacy.delete"))).toBeInTheDocument();

      // Switch to Public Trees tab
      fireEvent.click(publicTabBtn);
      expect(screen.getByText(tForLocale(locale, "legacy.public"))).toBeInTheDocument();
      expect(screen.getByText(tForLocale(locale, "read_only"))).toBeInTheDocument();
      expect(screen.getByText(tForLocale(locale, "legacy.no_file"))).toBeInTheDocument();
    }
  );

  it.each(LOCALES)(
    "renders the '+ Add Tree' portal drawer (Form Mode & Direct GEDCOM Code Mode) in '%s' with RTL/LTR support",
    async (locale) => {
      window.localStorage.setItem("app_lang", locale);
      window.localStorage.setItem("roots_Locale", locale);

      render(
        <MemoryRouter initialEntries={["/admin/trees"]}>
          <TranslationProvider>
            <LocaleInitializer locale={locale}>
              <Trees />
            </LocaleInitializer>
          </TranslationProvider>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalled();
      });

      // Open "+ Add Tree" drawer
      const addTreeBtn = screen.getByTitle(tForLocale(locale, "legacy.add_tree"));
      fireEvent.click(addTreeBtn);

      const expectedDir = locale === "ar" ? "rtl" : "ltr";

      // Header & Mode Tabs
      const createTreeHeader = screen.getByText(tForLocale(locale, "legacy.create_tree"));
      expect(createTreeHeader).toBeInTheDocument();
      expect(createTreeHeader.closest("[dir]")?.getAttribute("dir")).toBe(expectedDir);

      expect(screen.getByText(tForLocale(locale, "legacy.form_mode"))).toBeInTheDocument();
      const codeModeTab = screen.getByText(tForLocale(locale, "legacy.code_mode"));
      expect(codeModeTab).toBeInTheDocument();

      // Form Mode labels & placeholders
      expect(screen.getByText(tForLocale(locale, "legacy.gedcom_file_upload_label"))).toBeInTheDocument();
      expect(screen.getByText(tForLocale(locale, "legacy.click_or_drag_gedcom"))).toBeInTheDocument();
      expect(screen.getByText(tForLocale(locale, "legacy.gedcom_upload_formats_hint"))).toBeInTheDocument();
      expect(screen.getByPlaceholderText(tForLocale(locale, "legacy.tree_title_placeholder"))).toBeInTheDocument();
      expect(screen.getByText(tForLocale(locale, "legacy.custom_category"))).toBeInTheDocument();
      expect(screen.getByPlaceholderText(tForLocale(locale, "placeholder_tree_category"))).toBeInTheDocument();
      expect(screen.getByText(tForLocale(locale, "legacy.save_file_as"))).toBeInTheDocument();
      expect(screen.getByText(tForLocale(locale, "legacy.description"))).toBeInTheDocument();
      expect(screen.getByPlaceholderText(tForLocale(locale, "legacy.tree_description_placeholder"))).toBeInTheDocument();
      expect(screen.getByText(tForLocale(locale, "legacy.archive_source"))).toBeInTheDocument();
      expect(screen.getByText(tForLocale(locale, "legacy.document_code"))).toBeInTheDocument();
      expect(screen.getByPlaceholderText(tForLocale(locale, "placeholder_doc_code"))).toBeInTheDocument();
      expect(screen.getByText(tForLocale(locale, "legacy.save_to_db_label"), { exact: false })).toBeInTheDocument();
      expect(screen.getByText(tForLocale(locale, "legacy.save_to_db_hint"))).toBeInTheDocument();
      expect(screen.getByText(tForLocale(locale, "legacy.save_tree"))).toBeInTheDocument();
      expect(screen.getByText(tForLocale(locale, "legacy.reset"))).toBeInTheDocument();

      // Switch to Code Mode
      fireEvent.click(codeModeTab);
      expect(screen.getByText(tForLocale(locale, "legacy.gedcom_code_editor"))).toBeInTheDocument();
      expect(screen.getByText(tForLocale(locale, "legacy.apply_and_sync"))).toBeInTheDocument();
    }
  );

  it.each(LOCALES)(
    "renders the TreesBuilder Empty State and Add Person Modal portal in '%s' with RTL/LTR support",
    async (locale) => {
      window.localStorage.setItem("app_lang", locale);
      window.localStorage.setItem("roots_Locale", locale);

      render(
        <MemoryRouter initialEntries={["/admin/trees"]}>
          <TranslationProvider>
            <LocaleInitializer locale={locale}>
              <Trees />
            </LocaleInitializer>
          </TranslationProvider>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalled();
      });

      // Clear canvas so empty state appears with "Add Person" button
      const clearBtn = screen.getByText(tForLocale(locale, "legacy.clear_canvas"));
      fireEvent.click(clearBtn);

      expect(screen.getByText(tForLocale(locale, "legacy.tree_empty_prompt"))).toBeInTheDocument();
      expect(screen.getByText(tForLocale(locale, "legacy.tree_empty_hint"))).toBeInTheDocument();

      // Click "Add Person" inside empty state
      const addPersonBtns = screen.getAllByText(tForLocale(locale, "legacy.add_person"));
      fireEvent.click(addPersonBtns[0]);

      const expectedDir = locale === "ar" ? "rtl" : "ltr";

      // Check Person Modal fields
      const personalInfoHeading = screen.getByText(tForLocale(locale, "legacy.personal_info"));
      expect(personalInfoHeading).toBeInTheDocument();
      expect(personalInfoHeading.closest("[dir]")?.getAttribute("dir")).toBe(expectedDir);

      expect(screen.getByText(tForLocale(locale, "legacy.full_name"))).toBeInTheDocument();
      expect(screen.getByPlaceholderText(tForLocale(locale, "legacy.name_placeholder"))).toBeInTheDocument();
      expect(screen.getByText(tForLocale(locale, "legacy.gender"))).toBeInTheDocument();
      expect(screen.getByText(tForLocale(locale, "legacy.select_color"))).toBeInTheDocument();
      expect(screen.getByText(tForLocale(locale, "legacy.color_on_tree_hint"))).toBeInTheDocument();
      expect(screen.getByText(tForLocale(locale, "legacy.details_biography"))).toBeInTheDocument();
      expect(screen.getByPlaceholderText(tForLocale(locale, "legacy.additional_notes"))).toBeInTheDocument();
      expect(screen.getByText(tForLocale(locale, "legacy.profession"))).toBeInTheDocument();
      expect(screen.getByPlaceholderText(tForLocale(locale, "legacy.profession_placeholder"))).toBeInTheDocument();
      expect(screen.getByText(tForLocale(locale, "legacy.dates_places"))).toBeInTheDocument();
      expect(screen.getByText(tForLocale(locale, "legacy.birth_year"))).toBeInTheDocument();
      expect(screen.getByText(tForLocale(locale, "legacy.birth_place"))).toBeInTheDocument();
      expect(screen.getByText(tForLocale(locale, "legacy.death_date"))).toBeInTheDocument();
      expect(screen.getByText(tForLocale(locale, "legacy.death_place"))).toBeInTheDocument();
    }
  );
});
