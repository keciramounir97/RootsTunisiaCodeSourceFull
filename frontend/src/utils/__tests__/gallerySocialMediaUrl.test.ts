import { describe, expect, it, vi } from "vitest";

vi.mock("../../api/helpers", () => ({
  getApiRoot: () => "https://server.example.test",
}));

import {
  galleryImageFallbackCandidates,
  resolveAnyMediaUrl,
  resolveGalleryItemUrl,
} from "../gallerySocial";

describe("gallery media URL resolution", () => {
  it("keeps frontend Vite assets on the SPA origin", () => {
    expect(resolveAnyMediaUrl("/assets/medina-tunis.jpg")).toBe("/assets/medina-tunis.jpg");
  });

  it("prefixes API uploads with the API root", () => {
    expect(resolveAnyMediaUrl("/uploads/gallery/photo.jpg")).toBe(
      "https://server.example.test/uploads/gallery/photo.jpg",
    );
  });

  it("maps bare image filenames into uploads/gallery", () => {
    expect(resolveAnyMediaUrl("tunisia-medina.jpg")).toBe(
      "https://server.example.test/uploads/gallery/tunisia-medina.jpg",
    );
  });

  it("uses durable API image stream for numeric gallery ids", () => {
    expect(
      resolveGalleryItemUrl({
        id: 42,
        image_path: "/uploads/tunisia-medina.jpg",
      }),
    ).toBe("https://server.example.test/api/gallery/42/image");
  });

  it("builds non-hardcoded fallback candidates including legacy root uploads", () => {
    const candidates = galleryImageFallbackCandidates(
      "https://server.example.test/api/gallery/7/image",
      { id: 7, image_path: "/uploads/tunisia-eljem.jpg" },
      undefined,
      "/assets/fallback.jpg",
    );
    expect(candidates[0]).toContain("/api/gallery/7/image");
    expect(candidates).toContain("https://server.example.test/uploads/gallery/tunisia-eljem.jpg");
    expect(candidates).toContain("https://server.example.test/uploads/tunisia-eljem.jpg");
    expect(candidates).toContain("/assets/fallback.jpg");
  });
});
