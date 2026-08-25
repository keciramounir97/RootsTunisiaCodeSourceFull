// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
if (!window.localStorage) Object.defineProperty(window, "localStorage", { configurable: true, value: { getItem: () => null, setItem: () => {}, removeItem: () => {} } });
const { extractPersonLinks } = await import("./TreesBuilder");

describe("Person source links", () => {
  it("classifies document, audio, image, and external links", () => {
    const links = extractPersonLinks({ archiveSource: "https://example.com/record.pdf https://example.com/interview.mp3", documentCode: "https://example.com/photo.jpg https://example.com/archive" });
    expect(links.map((link) => link.kind)).toEqual(["document", "audio", "image", "external"]);
  });
});
