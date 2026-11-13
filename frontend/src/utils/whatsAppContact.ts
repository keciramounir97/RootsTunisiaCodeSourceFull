import {
  getActiveSocialLinks,
  loadFooterConfig,
  resolveSocialHref,
} from "./footerConfig";
import { loadHelpCenterCmsConfig } from "./helpCenterCmsConfig";

/**
 * Build a WhatsApp deep link from an admin-configured number/URL.
 * Returns "" when nothing real is configured (never invents a fake number).
 */
export function buildWhatsAppUrl(
  rawPhoneOrUrl: string | null | undefined,
  prefillMessage?: string,
): string {
  const base = resolveSocialHref("whatsapp", String(rawPhoneOrUrl || "").trim());
  if (!base) return "";
  const prefill = String(prefillMessage || "").trim();
  if (!prefill) return base;
  if (/[?&]text=/i.test(base)) return base;
  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}text=${encodeURIComponent(prefill)}`;
}

/**
 * Resolve the public WhatsApp contact from admin sources only.
 * Priority: explicit override → Contact CMS → Footer WhatsApp field → Footer social link.
 */
export function resolveConfiguredWhatsAppContact(
  explicitPhoneOrUrl?: string | null,
): string {
  const override = String(explicitPhoneOrUrl || "").trim();
  if (override) return override;

  try {
    const hc = loadHelpCenterCmsConfig();
    const cmsWa = String(hc.contact?.cards?.whatsappValue || "").trim();
    if (cmsWa) return cmsWa;
  } catch {
    // ignore
  }

  try {
    const footer = loadFooterConfig();
    const footerWa = String(footer.whatsapp || "").trim();
    if (footerWa) return footerWa;
    const socialWa = getActiveSocialLinks(footer).find((l) => l.icon === "whatsapp");
    if (socialWa?.url?.trim()) return socialWa.url.trim();
  } catch {
    // ignore
  }

  return "";
}

export function buildConfiguredWhatsAppUrl(
  prefillMessage?: string,
  explicitPhoneOrUrl?: string | null,
): string {
  return buildWhatsAppUrl(resolveConfiguredWhatsAppContact(explicitPhoneOrUrl), prefillMessage);
}
