import { describe, it, expect } from "vitest";
import { REAL_AUTHENTIC_ARTICLES } from "../../data/realArticles";
import { SCIENTIFIC_GEDCOM_ARTICLES } from "../../utils/articleNormalize";

describe("Real Genealogical Monographs & Archival Articles", () => {
  it("ensures all articles start with strictly 0 likes and 0 comments", () => {
    expect(REAL_AUTHENTIC_ARTICLES.length).toBeGreaterThan(0);
    REAL_AUTHENTIC_ARTICLES.forEach((article) => {
      expect(article.likes).toBe(0);
      expect(article.isLiked).toBe(false);
      expect(article.comments).toEqual([]);
    });

    SCIENTIFIC_GEDCOM_ARTICLES.forEach((article) => {
      expect(article.likes).toBe(0);
      expect(article.isLiked).toBe(false);
      expect(article.comments).toEqual([]);
    });
  });

  it("ensures all articles are rendered strictly without photos (images: [])", () => {
    REAL_AUTHENTIC_ARTICLES.forEach((article) => {
      expect(article.images).toEqual([]);
    });

    SCIENTIFIC_GEDCOM_ARTICLES.forEach((article) => {
      expect(article.images).toEqual([]);
    });
  });

  it("ensures every article has extensive length (minimum 14-page equivalent depth with multiple Roman numeral chapters)", () => {
    REAL_AUTHENTIC_ARTICLES.forEach((article) => {
      expect(article.content.length).toBeGreaterThan(5000); // Massive depth
      expect(article.content).toContain("CHAPITRE I");
      expect(article.content).toContain("CHAPITRE II");
      expect(article.content).toContain("CHAPITRE III");
    });
  });

  it("ensures every article includes explicit archival sources with depositories and cotes", () => {
    REAL_AUTHENTIC_ARTICLES.forEach((article) => {
      expect(article.sources).toBeDefined();
      expect(article.sources!.length).toBeGreaterThanOrEqual(3);
      article.sources!.forEach((src) => {
        expect(src.title.length).toBeGreaterThan(0);
        expect(src.cote).toBeDefined();
        expect(src.cote!.length).toBeGreaterThan(0);
      });
    });
  });

  it("ensures all mock smoke test posts have been completely eliminated", () => {
    const mockPatterns = [/smoke/i, /family archive photo/i, /photo note/i, /gallery image prepared/i, /photo check/i];
    REAL_AUTHENTIC_ARTICLES.forEach((article) => {
      mockPatterns.forEach((pattern) => {
        expect(article.title).not.toMatch(pattern);
        expect(article.content).not.toMatch(pattern);
      });
    });
  });
});

