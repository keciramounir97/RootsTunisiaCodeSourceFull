import { BadRequestException } from "@nestjs/common";
import {
  buildDefaultPages,
  collectUploadedFilenames,
  mergeWithDefaults,
  sanitizeHtml,
  sanitizePages,
  toPublicContent,
} from "./site-content.model";

describe("site-content model", () => {
  it("seeds all required pages with typed fields", () => {
    const pages = buildDefaultPages();
    expect(pages.map((p) => p.id)).toEqual([
      "home", "about", "gallery", "library", "audio", "documents", "contact", "research",
    ]);
    const types = new Set(
      pages.flatMap((p) => p.sections.flatMap((s) => s.fields.map((f) => f.type))),
    );
    expect([...types].sort()).toEqual(["html", "image", "list", "text"]);
  });

  it("merges stored values over the default schema and keeps custom entries", () => {
    const merged = mergeWithDefaults([
      {
        id: "home",
        label: "ignored",
        sections: [
          {
            id: "hero",
            label: "ignored",
            fields: [
              { key: "title", type: "text", label: "x", value: "Hello", translations: { fr: "Bonjour" } },
              { key: "extra", type: "text", label: "Extra", value: "kept" },
            ],
          },
        ],
      },
      { id: "custom", label: "Custom", sections: [] },
    ]);
    const hero = merged.find((p) => p.id === "home")!.sections.find((s) => s.id === "hero")!;
    const title = hero.fields.find((f) => f.key === "title")!;
    expect(title.value).toBe("Hello");
    expect(title.translations).toEqual({ fr: "Bonjour" });
    expect(title.label).toBe("Heading");
    expect(hero.fields.find((f) => f.key === "extra")?.value).toBe("kept");
    expect(merged.some((p) => p.id === "custom")).toBe(true);
    expect(merged.find((p) => p.id === "contact")).toBeDefined();
  });

  it("projects only non-empty fields publicly", () => {
    const pages = mergeWithDefaults([
      {
        id: "contact",
        label: "Contact",
        sections: [
          {
            id: "hero",
            label: "Hero",
            fields: [
              { key: "title", type: "text", label: "T", value: "", translations: { en: "Contact us" } },
              { key: "subtitle", type: "text", label: "S", value: "" },
            ],
          },
        ],
      },
    ]);
    const pub = toPublicContent({ version: 1, updatedAt: null, updatedBy: null, pages });
    expect(Object.keys(pub.pages)).toEqual(["contact"]);
    expect(pub.pages.contact.hero.title.translations).toEqual({ en: "Contact us" });
    expect(pub.pages.contact.hero.subtitle).toBeUndefined();
  });

  it("sanitizes html with an allow-list", () => {
    const dirty =
      '<p onclick="x()">Hi <script>alert(1)</script><a href="javascript:alert(1)">bad</a> <a href="https://ok.test">ok</a><img src=x onerror=alert(1)> 1 < 2</p>';
    const clean = sanitizeHtml(dirty);
    expect(clean).not.toMatch(/script|onclick|onerror|javascript:|<img/i);
    expect(clean).toContain('<a href="https://ok.test" target="_blank" rel="noopener noreferrer">ok</a>');
    expect(clean).toContain("1 &lt; 2");
  });

  it("rejects bad structure and unsafe image references", () => {
    expect(() => sanitizePages("nope")).toThrow(BadRequestException);
    expect(() =>
      sanitizePages([{ id: "a b", sections: [] }]),
    ).toThrow(BadRequestException);
    expect(() =>
      sanitizePages([
        { id: "p", sections: [{ id: "s", fields: [{ key: "i", type: "image", value: "javascript:alert(1)" }] }] },
      ]),
    ).toThrow(BadRequestException);
    expect(() =>
      sanitizePages([
        { id: "p", sections: [{ id: "s", fields: [{ key: "i", type: "video", value: "" }] }] },
      ]),
    ).toThrow(BadRequestException);
  });

  it("normalizes lists and drops empty translations", () => {
    const [page] = sanitizePages([
      {
        id: "p",
        sections: [
          {
            id: "s",
            fields: [
              { key: "l", type: "list", value: "a\n\n b ", translations: { fr: [], en: ["x"] } },
            ],
          },
        ],
      },
    ]);
    const field = page.sections[0].fields[0];
    expect(field.value).toEqual(["a", "b"]);
    expect(field.translations).toEqual({ en: ["x"] });
  });

  it("collects uploaded filenames for orphan cleanup", () => {
    const names = collectUploadedFilenames([
      {
        id: "p",
        label: "p",
        sections: [
          {
            id: "s",
            label: "s",
            fields: [
              { key: "a", type: "image", label: "a", value: "/uploads/site-content/sc-1.png" },
              { key: "b", type: "image", label: "b", value: "https://x.test/uploads/site-content/sc-2.png" },
            ],
          },
        ],
      },
    ]);
    expect([...names]).toEqual(["sc-1.png"]);
  });
});
