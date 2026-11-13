import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Individuals from "../Individuals";
import { TranslationProvider } from "../../../context/TranslationContext";
import { tForLocale } from "../../../utils/translations";

vi.mock("../../../store/theme", () => ({
  useThemeStore: () => ({ theme: "light", toggleTheme: vi.fn() }),
}));

vi.mock("../../components/AuthContext", () => ({
  useAuth: () => ({
    user: { id: 77, name: "Mounir", email: "mounir@example.com", role_id: 2 },
    token: "fake-jwt-token",
  }),
}));

const MOCK_INDIVIDUALS = [
  {
    id: "ind-1",
    name: "Ibn Khaldoun",
    gender: "M",
    birthYear: "1332",
    birthPlace: "Tunis",
    deathDate: "1406",
    deathPlace: "Le Caire",
    profession: "Historien & Sociologue",
    details: "Auteur de la Muqaddimah.",
    gedcomText: "0 @I1@ INDI\n1 NAME Ibn /Khaldoun/\n1 SEX M\n1 BIRT\n2 DATE 1332",
    customFields: [{ id: "cf-1", name: "Ouvrage", value: "Al-Muqaddimah" }],
    sourceLinks: ["/uploads/documents/doc-1234567890abcdef.pdf"],
    sourceLinksManaged: true,
    isBackedUp: true,
    isPublic: true,
  },
  {
    id: "ind-2",
    name: "Aziza Othmana",
    gender: "F",
    birthYear: "1606",
    birthPlace: "Tunis",
    deathDate: "1669",
    deathPlace: "Tunis",
    profession: "Princesse & Philanthrope",
    details: "",
    gedcomText: "",
    customFields: [],
    sourceLinks: [],
    sourceLinksManaged: true,
    isBackedUp: false,
    isPublic: false,
  },
];

vi.mock("../../../api/client", () => ({
  api: {
    get: vi.fn(async (url: string) => {
      if (url.includes("individuals")) {
        return { data: MOCK_INDIVIDUALS };
      }
      return { data: [] };
    }),
    post: vi.fn(async () => ({ data: { ok: true } })),
    put: vi.fn(async () => ({ data: { ok: true } })),
    delete: vi.fn(async () => ({ data: { ok: true } })),
  },
}));

describe("User Dashboard Page 3 — Individuals.tsx 6-Language & RTL Translation Suite", () => {
  const languages = ["fr", "en", "ar", "es", "it", "mt"] as const;

  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem(
      "roots_individuals_u77_v3",
      JSON.stringify(MOCK_INDIVIDUALS)
    );
  });

  describe.each(languages)("Language: %s", (lang) => {
    const expectedDir = lang === "ar" ? "rtl" : "ltr";
    const tr = (key: string) => tForLocale(lang, key);

    it(`renders Individuals main page, header, search bar, and grid cards fully translated in ${lang.toUpperCase()} with dir="${expectedDir}"`, async () => {
      localStorage.setItem("locale", lang);

      const { container } = render(
        <TranslationProvider>
          <MemoryRouter initialEntries={["/admin/individuals"]}>
            <Individuals />
          </MemoryRouter>
        </TranslationProvider>
      );

      await waitFor(() => {
        expect(document.documentElement.getAttribute("dir")).toBe(expectedDir);
        expect(document.documentElement.getAttribute("lang")).toBe(lang);
      });

      const rootDiv = container.firstElementChild as HTMLElement;
      expect(rootDiv).toBeTruthy();
      expect(rootDiv.getAttribute("dir")).toBe(expectedDir);

      // Header title, subtitle, Add button
      expect(screen.getByText(tr("legacy.individuals_page_title"))).toBeInTheDocument();
      expect(screen.getByText(tr("legacy.individuals_page_subtitle"))).toBeInTheDocument();
      expect(screen.getByText(tr("legacy.add_person_btn"))).toBeInTheDocument();

      // Search placeholder & records count
      expect(
        screen.getByPlaceholderText(tr("legacy.search_individuals_placeholder"))
      ).toBeInTheDocument();
      expect(
        screen.getByText(new RegExp(tr("legacy.records").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")))
      ).toBeInTheDocument();

      // Grid card badges (sources/media count, DB short badge, Public & Private badges)
      expect(
        screen.getAllByText(
          new RegExp(tr("admin.individuals.sources_media_count").replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        ).length
      ).toBeGreaterThan(0);
      expect(screen.getByText(tr("admin.individuals.db_short"))).toBeInTheDocument();
      expect(screen.getByTitle(tr("admin.individuals.saved_in_db"))).toBeInTheDocument();
      expect(screen.getByText(tr("common.public"))).toBeInTheDocument();
      expect(screen.getByText(tr("common.private"))).toBeInTheDocument();

      // Search filter empty state
      const searchInput = screen.getByPlaceholderText(tr("legacy.search_individuals_placeholder"));
      fireEvent.change(searchInput, { target: { value: "zzzz_nonexistent_person" } });
      expect(screen.getByText(tr("legacy.no_individuals_found"))).toBeInTheDocument();
    });

    it(`renders Create/Edit Modal (Choose, GEDCOM, and Form modes) fully translated in ${lang.toUpperCase()} with dir="${expectedDir}"`, async () => {
      localStorage.setItem("locale", lang);

      render(
        <TranslationProvider>
          <MemoryRouter initialEntries={["/admin/individuals"]}>
            <Individuals />
          </MemoryRouter>
        </TranslationProvider>
      );

      // Click Add Person button
      fireEvent.click(screen.getByText(tr("legacy.add_person_btn")));

      // Choose mode
      expect(screen.getByText(tr("legacy.import_gedcom_title"))).toBeInTheDocument();
      expect(screen.getByText(tr("legacy.import_gedcom_desc"))).toBeInTheDocument();
      expect(screen.getByText(tr("legacy.by_form_title"))).toBeInTheDocument();
      expect(screen.getByText(tr("legacy.by_form_desc"))).toBeInTheDocument();

      // Switch to GEDCOM mode
      fireEvent.click(screen.getByText(tr("legacy.import_gedcom_title")));
      expect(screen.getByText(tr("import_file"))).toBeInTheDocument();
      expect(screen.getByText(tr("edit_or_paste"))).toBeInTheDocument();
      expect(screen.getByText(tr("modify_gedcom_text"))).toBeInTheDocument();
      expect(screen.getByText(tr("export_gedcom"))).toBeInTheDocument();
      expect(screen.getByText(tr("download_file"))).toBeInTheDocument();
      expect(screen.getByText(tr("back"))).toBeInTheDocument();
      expect(screen.getByText(tr("cancel"))).toBeInTheDocument();
      expect(screen.getByText(tr("legacy.import_gedcom"))).toBeInTheDocument();

      const gedcomEditor = document.getElementById("individual-gedcom-editor");
      expect(gedcomEditor).toBeTruthy();
      expect(gedcomEditor?.getAttribute("dir")).toBe("ltr");

      // Go back to Choose mode, then switch to Form mode
      fireEvent.click(screen.getByText(tr("back")));
      fireEvent.click(screen.getByText(tr("legacy.by_form_title")));

      // Form mode sections & labels
      expect(screen.getByText(tr("personal_information"))).toBeInTheDocument();
      expect(
        screen.getByText(new RegExp(tr("full_name").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")))
      ).toBeInTheDocument();
      expect(screen.getByText(tr("gender"))).toBeInTheDocument();
      expect(screen.getByText(tr("admin.individuals.profession"))).toBeInTheDocument();
      expect(screen.getByText(tr("admin.individuals.birth_year"))).toBeInTheDocument();
      expect(screen.getByText(tr("admin.individuals.birth_place"))).toBeInTheDocument();
      expect(screen.getByText(tr("admin.individuals.death_date"))).toBeInTheDocument();
      expect(screen.getByText(tr("admin.individuals.death_place"))).toBeInTheDocument();

      // Custom fields section
      expect(screen.getByText(tr("admin.individuals.custom_fields"))).toBeInTheDocument();
      const addCustomFieldBtn = screen.getByText(
        new RegExp(tr("admin.individuals.add_custom_field").replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      );
      expect(addCustomFieldBtn).toBeInTheDocument();
      fireEvent.click(addCustomFieldBtn);
      expect(
        screen.getByPlaceholderText(tr("admin.individuals.field_name_placeholder"))
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(tr("admin.individuals.field_value_placeholder"))
      ).toBeInTheDocument();

      // Documents & Sources section
      expect(screen.getByText(tr("admin.individuals.documents_and_sources"))).toBeInTheDocument();
      expect(screen.getByText(tr("common.document"))).toBeInTheDocument();
      expect(screen.getByText(tr("common.photo_image"))).toBeInTheDocument();
      expect(screen.getByText(tr("common.audio"))).toBeInTheDocument();
      expect(screen.getByText(tr("common.external_link"))).toBeInTheDocument();

      // Open External Link panel
      fireEvent.click(screen.getByText(tr("common.external_link")));
      expect(screen.getByText(tr("admin.individuals.add_external_link"))).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(tr("admin.individuals.page_title_placeholder"))
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(tr("admin.individuals.url_placeholder"))
      ).toBeInTheDocument();
      expect(screen.getByText(tr("admin.individuals.save_link"))).toBeInTheDocument();

      // Settings & Visibility section
      expect(screen.getByText(tr("admin.individuals.settings_and_visibility"))).toBeInTheDocument();
      expect(screen.getByText(tr("admin.individuals.saved_in_db_backup"))).toBeInTheDocument();
      expect(screen.getByText(tr("admin.individuals.visibility_status"))).toBeInTheDocument();
      expect(screen.getByText(tr("admin.individuals.save_changes"))).toBeInTheDocument();
    });

    it(`renders Individual Details Card Modal and Source Preview Modal fully translated in ${lang.toUpperCase()} with dir="${expectedDir}"`, async () => {
      localStorage.setItem("locale", lang);

      render(
        <TranslationProvider>
          <MemoryRouter initialEntries={["/admin/individuals"]}>
            <Individuals />
          </MemoryRouter>
        </TranslationProvider>
      );

      // Click on "Ibn Khaldoun" card
      const personCard = await screen.findByText("Ibn Khaldoun");
      fireEvent.click(personCard);

      // Verify Individual Details Card Modal
      expect(screen.getByText(tr("legacy.person_card"))).toBeInTheDocument();
      expect(screen.getByText(tr("admin.individuals.gedcom_saved"))).toBeInTheDocument();
      expect(screen.getByText(tr("admin.individuals.gedcom_in_db"))).toBeInTheDocument();
      expect(screen.getByText(tr("admin.individuals.drag_3d_card"))).toBeInTheDocument();
      expect(screen.getByText(tr("genealogy.birth"))).toBeInTheDocument();
      expect(screen.getByText(tr("genealogy.death"))).toBeInTheDocument();
      expect(screen.getByText(tr("admin.individuals.notes_and_details"))).toBeInTheDocument();
      expect(screen.getByText(tr("admin.individuals.custom_fields"))).toBeInTheDocument();
      expect(screen.getByText(tr("admin.individuals.linked_sources_and_docs"))).toBeInTheDocument();
      expect(screen.getByText(tr("common.delete"))).toBeInTheDocument();
      expect(screen.getByText(tr("common.edit"))).toBeInTheDocument();

      // Masked archive document label should be localized
      const maskedDocBtn = screen.getByText(tr("legacy.masked_archive_certified"));
      expect(maskedDocBtn).toBeInTheDocument();

      // Click linked source to open Source Preview Modal
      fireEvent.click(maskedDocBtn);
      expect(
        screen.getByText(tr("legacy.certified_archive_digitized_fund"))
      ).toBeInTheDocument();
      expect(screen.getByText(tr("legacy.download_or_open"))).toBeInTheDocument();
    });
  });
});
