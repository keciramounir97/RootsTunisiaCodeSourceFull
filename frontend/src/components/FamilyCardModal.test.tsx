// @vitest-environment jsdom
import React from "react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";

const mockGet = vi.fn();

vi.mock("../api/client", () => ({
  api: {
    defaults: { baseURL: "https://server.rootstunisia.com/api" },
    get: (...args: any[]) => mockGet(...args),
  },
}));

vi.mock("../admin/components/TreesBuilder", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../admin/components/TreesBuilder")>();
  return {
    ...actual,
    default: function MockTreesBuilder({ people }: { people: any[] }) {
      return React.createElement(
        "div",
        { "data-testid": "mock-trees-builder" },
        `${Array.isArray(people) ? people.length : 0} nodes`
      );
    },
  };
});

import FamilyCardModal from "./FamilyCardModal";

const EMPTY_GEDCOM = `0 HEAD
1 GEDC
2 VERS 5.5.1
0 TRLR`;

const THREE_PEOPLE_NO_SOURCES_GEDCOM = `0 HEAD
1 SOUR RootsTunisia
1 GEDC
2 VERS 5.5.1
0 @I1@ INDI
1 NAME Ali /Ben Salah/
1 GIVN Ali
1 SURN Ben Salah
1 SEX M
1 BIRT
2 DATE 1890
1 FAMS @F1@
0 @I2@ INDI
1 NAME Amina /Trabelsi/
1 GIVN Amina
1 SURN Trabelsi
1 SEX F
1 FAMS @F1@
0 @I3@ INDI
1 NAME Karim /Ben Salah/
1 GIVN Karim
1 SURN Ben Salah
1 SEX M
1 BIRT
2 DATE 1920
1 FAMC @F1@
0 @F1@ FAM
1 HUSB @I1@
1 WIFE @I2@
1 CHIL @I3@
0 TRLR`;

const MIXED_SOURCES_GEDCOM = `0 HEAD
1 SOUR RootsTunisia
1 GEDC
2 VERS 5.5.1
0 @I1@ INDI
1 NAME Xavier /Cassar/
1 GIVN Xavier
1 SURN Cassar
1 SEX M
1 BIRT
2 DATE 19 DEC 1890
1 OCCU Pecheur
1 _SOURCELINK Portrait Djerba | /uploads/gallery/gallery-11111111.jpg
1 _SOURCELINK Enregistrement Oral | /uploads/audios/audio-22222222.mp3
1 _SOURCELINK Registre National | https://archives.nat.tn/record/42
1 _SLINK_MANAGED Y
1 FAMS @F1@
0 @I2@ INDI
1 NAME Richarde /Gaffiero/
1 GIVN Richarde
1 SURN Gaffiero
1 SEX F
1 SOUR @35680273@
1 _SLINK_MANAGED Y
1 FAMS @F1@
0 @I3@ INDI
1 NAME Sauveur /Cassar/
1 GIVN Sauveur
1 SURN Cassar
1 SEX M
1 BIRT
2 DATE 1915
1 FAMC @F1@
0 @F1@ FAM
1 HUSB @I1@
1 WIFE @I2@
1 CHIL @I3@
0 TRLR`;

describe("FamilyCardModal Open Details source detection & empty states", () => {
  beforeEach(() => {
    mockGet.mockReset();
  });

  afterEach(() => {
    cleanup();
  });

  it("never injects fake individuals or gallery photos for an empty tree", async () => {
    mockGet.mockResolvedValue({ data: EMPTY_GEDCOM });

    const { container } = render(
      <FamilyCardModal
        tree={{ id: 144, title: "Xavier Cassar Empty", people_count: 0 }}
        onClose={() => {}}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/Aucun individu enregistré dans cet arbre/i)).toBeTruthy();
    });

    expect(screen.queryByText(/Fatma Bent Othman Fourati/i)).toBeNull();
    expect(screen.queryByText(/Youssef Ben Ali Lasram/i)).toBeNull();
    expect(container.querySelectorAll("img").length).toBe(0);

    fireEvent.click(screen.getByText("Aperçu Sources"));

    await waitFor(() => {
      expect(screen.getByText(/Aucun individu ni source liée dans cet arbre/i)).toBeTruthy();
    });
    expect(screen.queryByText(/Acte de Naissance/i)).toBeNull();
    expect(container.querySelectorAll("img").length).toBe(0);
  });

  it("shows exact 3 members with '0 source liée' when none of the 3 have Open Details sources", async () => {
    mockGet.mockResolvedValue({ data: THREE_PEOPLE_NO_SOURCES_GEDCOM });

    const { container } = render(
      <FamilyCardModal
        tree={{ id: 201, title: "Famille Ben Salah", people_count: 3 }}
        onClose={() => {}}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("3 nodes")).toBeTruthy();
    });

    fireEvent.click(screen.getByText("Aperçu Sources"));

    await waitFor(() => {
      expect(screen.getByText(/Aucune source ni document lié pour cet arbre/i)).toBeTruthy();
    });

    expect(screen.getByText("Ali Ben Salah")).toBeTruthy();
    expect(screen.getByText("Amina Trabelsi")).toBeTruthy();
    expect(screen.getByText("Karim Ben Salah")).toBeTruthy();
    expect(screen.getAllByText("0 source liée").length).toBe(3);
    expect(container.querySelectorAll("img").length).toBe(0);
  });

  it("detects strictly each individual's Open Details sources without gallery banner photos", async () => {
    mockGet.mockResolvedValue({ data: MIXED_SOURCES_GEDCOM });

    const { container } = render(
      <FamilyCardModal
        tree={{ id: 202, title: "Famille Cassar", people_count: 3 }}
        onClose={() => {}}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("3 nodes")).toBeTruthy();
    });

    fireEvent.click(screen.getByText("Aperçu Sources"));

    await waitFor(() => {
      expect(screen.getByText("Portrait Djerba")).toBeTruthy();
    });

    expect(screen.getByText("Enregistrement Oral")).toBeTruthy();
    expect(screen.getByText("Registre National")).toBeTruthy();
    expect(screen.queryByText("@35680273@")).toBeNull();
    expect(screen.getByText(/Tous les membres \(3\)/i)).toBeTruthy();

    // Must NOT render inline banner <img> thumbnails in Aperçu Sources cards
    expect(container.querySelectorAll("img").length).toBe(0);

    // Every source card here belongs strictly to Xavier Cassar
    expect(screen.getAllByText("Xavier Cassar").length).toBeGreaterThanOrEqual(4); // filter pill + 3 source cards

    // Filter to Richarde Gaffiero -> must report zero sources for her
    fireEvent.click(screen.getByRole("button", { name: /Richarde Gaffiero/i }));
    expect(screen.getByText(/Aucune source rattachée à ce membre/i)).toBeTruthy();

    // Switch to Fiche & GEDCOM -> check per-individual Open Details parity
    fireEvent.click(screen.getByText("Fiche & GEDCOM"));
    expect(screen.getByText("3 documents")).toBeTruthy();
    expect(screen.getByText("Pecheur")).toBeTruthy();

    fireEvent.click(screen.getByText("Richarde Gaffiero"));
    expect(screen.getByText(/Aucune source ni document rattaché à cet individu/i)).toBeTruthy();
  });
});
