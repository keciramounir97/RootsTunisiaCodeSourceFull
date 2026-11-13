import { beforeEach, describe, expect, it } from "vitest";
import { buildConfiguredWhatsAppUrl, buildWhatsAppUrl } from "../whatsAppContact";
import { DEFAULT_FOOTER_CONFIG, FOOTER_STORAGE_KEY } from "../footerConfig";

describe("whatsAppContact helpers", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("never invents a WhatsApp number when nothing is configured", () => {
    expect(buildWhatsAppUrl("")).toBe("");
    expect(buildWhatsAppUrl(null)).toBe("");
    expect(buildConfiguredWhatsAppUrl("Bonjour")).toBe("");
  });

  it("builds a wa.me link only from an admin-provided number", () => {
    expect(buildWhatsAppUrl("+216 98 111 222", "Hello")).toBe(
      "https://wa.me/21698111222?text=Hello",
    );
  });

  it("keeps default footer social networks empty and disabled", () => {
    expect(DEFAULT_FOOTER_CONFIG.socialLinks.every((l) => !l.enabled && !l.url)).toBe(true);
    expect(DEFAULT_FOOTER_CONFIG.phone).toBe("");
    expect(DEFAULT_FOOTER_CONFIG.whatsapp).toBe("");
  });

  it("reads WhatsApp from footer settings when configured", () => {
    localStorage.setItem(
      FOOTER_STORAGE_KEY,
      JSON.stringify({
        ...DEFAULT_FOOTER_CONFIG,
        whatsapp: "+216 22 333 444",
      }),
    );
    expect(buildConfiguredWhatsAppUrl("Ping")).toBe(
      "https://wa.me/21622333444?text=Ping",
    );
  });
});
