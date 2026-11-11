// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
if (!window.localStorage) Object.defineProperty(window, "localStorage", { configurable: true, value: { getItem: () => null, setItem: () => {}, removeItem: () => {} } });
const {
  extractPersonLinks,
  hydrateEditableSourceLinks,
  formatPersistedSourceLink,
  persistedValueFromExtractedLink,
  buildMediaTitleLookup,
  applyMediaTitlesToLinks,
  parseTitledSourceValue,
  resolveOpenableUrl,
  maskSourceLabel,
  isInternalBackendUrl,
} = await import("./TreesBuilder");

describe("Person source links", () => {
  it("classifies document, audio, image, and external links", () => {
    const links = extractPersonLinks({ archiveSource: "https://example.com/record.pdf https://example.com/interview.mp3", documentCode: "https://example.com/photo.jpg https://example.com/archive" });
    expect(links.map((link: any) => link.kind)).toEqual(["document", "audio", "image", "external"]);
  });

  it("shows the titled label for Title | url source links", () => {
    const links = extractPersonLinks({
      sourceLinks: [
        "Family Portrait | /uploads/gallery/gallery-8fd5b6d9dd233c8d906512ed0df5e73f.jpg",
        "Marriage Deed | /uploads/documents/doc-abc.pdf",
        "Oral History | /uploads/audios/audio-xyz.mp3",
        "ANT Register | https://archives.nat.tn/entry/123",
        "Wikipedia|https://en.wikipedia.org/wiki/Genealogy",
        { title: "Archive.org Record", url: "https://archive.org/details/smoke-test" },
      ],
      sourceLinksManaged: true,
    });
    expect(links.map((link: any) => link.label)).toEqual([
      "Family Portrait",
      "Marriage Deed",
      "Oral History",
      "ANT Register",
      "Wikipedia",
      "Archive.org Record",
    ]);
    expect(links[4].url).toBe("https://en.wikipedia.org/wiki/Genealogy");
    expect(links[5].url).toBe("https://archive.org/details/smoke-test");
  });

  it("parses titled values and resolves openable urls", () => {
    expect(parseTitledSourceValue("Page Name | https://example.com/a")).toEqual({
      title: "Page Name",
      target: "https://example.com/a",
    });
    expect(resolveOpenableUrl("https://example.com/x")).toBe("https://example.com/x");
    expect(resolveOpenableUrl("www.example.com/x")).toBe("https://www.example.com/x");
  });

  it("formatPersistedSourceLink keeps title with path", () => {
    expect(
      formatPersistedSourceLink(
        "/uploads/gallery/gallery-8fd5b6d9dd233c8d906512ed0df5e73f.jpg",
        "Family Portrait"
      )
    ).toBe("Family Portrait | /uploads/gallery/gallery-8fd5b6d9dd233c8d906512ed0df5e73f.jpg");
    expect(formatPersistedSourceLink("/uploads/gallery/x.jpg", "")).toBe("/uploads/gallery/x.jpg");
  });

  it("hydrateEditableSourceLinks preserves titles instead of stripping to URL", () => {
    const person = {
      sourceLinks: [
        "Family Portrait | /uploads/gallery/gallery-8fd5b6d9dd233c8d906512ed0df5e73f.jpg",
        "ANT Register | https://archives.nat.tn/entry/123",
      ],
      sourceLinksManaged: true,
    };
    const hydrated = hydrateEditableSourceLinks(person);
    expect(hydrated.sourceLinks).toEqual([
      "Family Portrait | /uploads/gallery/gallery-8fd5b6d9dd233c8d906512ed0df5e73f.jpg",
      "ANT Register | https://archives.nat.tn/entry/123",
    ]);
  });

  it("hydrateEditableSourceLinks keeps titles when sourceLinks were unmanaged", () => {
    const person = {
      archiveSource: "Family Portrait | /uploads/gallery/gallery-abc.jpg",
      sourceLinksManaged: false,
    };
    const hydrated = hydrateEditableSourceLinks(person);
    expect(hydrated.sourceLinks).toEqual([
      "Family Portrait | /uploads/gallery/gallery-abc.jpg",
    ]);
  });

  it("persistedValueFromExtractedLink keeps Title | path for local media", () => {
    const [link] = extractPersonLinks({
      sourceLinks: ["Family Portrait | /uploads/gallery/gallery-abc.jpg"],
      sourceLinksManaged: true,
    });
    expect(persistedValueFromExtractedLink(link)).toBe(
      "Family Portrait | /uploads/gallery/gallery-abc.jpg"
    );
  });

  it("applyMediaTitlesToLinks replaces hashed filenames with catalog titles", () => {
    const links = extractPersonLinks({
      sourceLinks: ["/uploads/gallery/gallery-8fd5b6d9dd233c8d906512ed0df5e73f.jpg"],
      sourceLinksManaged: true,
    });
    expect(links[0].label).toMatch(/^gallery-/);

    const lookup = buildMediaTitleLookup([
      {
        title: "Family Portrait",
        sourceUrl: "https://api.example.com/uploads/gallery/gallery-8fd5b6d9dd233c8d906512ed0df5e73f.jpg",
        image_path: "/uploads/gallery/gallery-8fd5b6d9dd233c8d906512ed0df5e73f.jpg",
      },
    ]);
    const enriched = applyMediaTitlesToLinks(links, lookup);
    expect(enriched[0].label).toBe("Family Portrait");
    expect(enriched[0].raw).toBe(
      "Family Portrait | /uploads/gallery/gallery-8fd5b6d9dd233c8d906512ed0df5e73f.jpg"
    );
  });

  it("does not persist hashed filenames as titles and can still enrich them", () => {
    expect(
      formatPersistedSourceLink(
        "/uploads/gallery/gallery-8fd5b6d9dd233c8d906512ed0df5e73f.jpg",
        "gallery-8fd5b6d9dd233c8d906512ed0df5e73f.jpg"
      )
    ).toBe("/uploads/gallery/gallery-8fd5b6d9dd233c8d906512ed0df5e73f.jpg");

    const locked = extractPersonLinks({
      sourceLinks: [
        "gallery-8fd5b6d9dd233c8d906512ed0df5e73f.jpg | /uploads/gallery/gallery-8fd5b6d9dd233c8d906512ed0df5e73f.jpg",
      ],
      sourceLinksManaged: true,
    });
    const lookup = buildMediaTitleLookup([
      {
        title: "Family Portrait",
        image_path: "/uploads/gallery/gallery-8fd5b6d9dd233c8d906512ed0df5e73f.jpg",
      },
    ]);
    expect(applyMediaTitlesToLinks(locked, lookup)[0].label).toBe("Family Portrait");
  });

  it("detects and masks internal backend server URLs and hashes", () => {
    // 1. isInternalBackendUrl detection
    expect(isInternalBackendUrl("https://server.rootstunisia.com/uploads/gallery/gallery-3bfdb7d9139ef02f82604cf0e880be26.jpg")).toBe(true);
    expect(isInternalBackendUrl("https://server.rootstunisia.com/uploads/gallery/gallery-d438de85fe3cad555e6c7f8fde44326f.jpeg")).toBe(true);
    expect(isInternalBackendUrl("/uploads/gallery/gallery-d438de85fe3cad555e6c7f8fde44326f.jpeg")).toBe(true);
    expect(isInternalBackendUrl("gallery-d438de85fe3cad555e6c7f8fde44326f.jpeg")).toBe(true);
    expect(isInternalBackendUrl("https://gallica.bnf.fr/ark:/12148/bpt6k12345")).toBe(false);

    // 2. maskSourceLabel masks raw URLs and hashes
    expect(
      maskSourceLabel(
        "https://server.rootstunisia.com/uploads/gallery/gallery-3bfdb7d9139ef02f82604cf0e880be26.jpg",
        "https://server.rootstunisia.com/uploads/gallery/gallery-3bfdb7d9139ef02f82604cf0e880be26.jpg",
        "image"
      )
    ).toBe("Photographie d'Archive Numérisée");

    expect(
      maskSourceLabel(
        "gallery-d438de85fe3cad555e6c7f8fde44326f.jpeg",
        "https://server.rootstunisia.com/uploads/gallery/gallery-d438de85fe3cad555e6c7f8fde44326f.jpeg",
        "image"
      )
    ).toBe("Photographie d'Archive Numérisée");

    // 3. maskSourceLabel preserves legitimate human archival titles
    const realTitle = "El Kef, Tunisie - Ville natale de Victor Samuel Brakha, Marie Sabban et plusieurs membres de la fratrie.";
    expect(
      maskSourceLabel(
        realTitle,
        "https://server.rootstunisia.com/uploads/gallery/gallery-d438de85fe3cad555e6c7f8fde44326f.jpeg",
        "image"
      )
    ).toBe(realTitle);
  });
});
