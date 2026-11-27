import { resolveSocialHref } from "./footerConfig";
import { publicSiteWhatsApp } from "../constants/contact";

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
 * Site-wide WhatsApp comes only from VITE_CONTACT_WHATSAPP / VITE_CONTACT_PHONE.
 * An explicit per-service number still wins when the caller passes one.
 */
export function resolveConfiguredWhatsAppContact(
  explicitPhoneOrUrl?: string | null,
): string {
  const override = String(explicitPhoneOrUrl || "").trim();
  if (override) return override;
  return publicSiteWhatsApp()?.tel ?? "";
}

export function buildConfiguredWhatsAppUrl(
  prefillMessage?: string,
  explicitPhoneOrUrl?: string | null,
): string {
  return buildWhatsAppUrl(resolveConfiguredWhatsAppContact(explicitPhoneOrUrl), prefillMessage);
}
