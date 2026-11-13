import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getDefaultHelpCenterConfig,
  loadHelpCenterCmsConfig,
  saveHelpCenterCmsConfig,
} from "../helpCenterCmsConfig";

vi.mock("../../api/client", () => ({
  api: {
    get: vi.fn().mockResolvedValue({ data: {} }),
    put: vi.fn().mockResolvedValue({ data: { ok: true } }),
  },
}));

describe("Contact CMS phone/whatsapp clearing", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("keeps intentionally cleared phone and WhatsApp numbers after save/reload", async () => {
    const base = getDefaultHelpCenterConfig("fr");
    const cleared = {
      ...base,
      contact: {
        ...base.contact,
        cards: {
          ...base.contact.cards,
          phoneValue: "",
          whatsappValue: "",
        },
      },
    };

    await saveHelpCenterCmsConfig(cleared, "fr");
    const reloaded = loadHelpCenterCmsConfig("fr");

    expect(reloaded.contact.cards.phoneValue).toBe("");
    expect(reloaded.contact.cards.whatsappValue).toBe("");
  });

  it("does not ship a hardcoded public phone number in defaults", () => {
    for (const locale of ["fr", "en", "ar", "es", "it", "mt"]) {
      const cfg = getDefaultHelpCenterConfig(locale);
      expect(cfg.contact.cards.phoneValue).toBe("");
      expect(cfg.contact.cards.whatsappValue).toBe("");
    }
  });
});
