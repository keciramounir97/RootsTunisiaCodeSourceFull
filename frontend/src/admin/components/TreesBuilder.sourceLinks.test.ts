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
      ],
      sourceLinksManaged: true,
    });
    expect(links.map((link: any) => link.label)).toEqual([
      "Family Portrait",
      "Marriage Deed",
      "Oral History",
      "ANT Register",
    ]);
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
});
