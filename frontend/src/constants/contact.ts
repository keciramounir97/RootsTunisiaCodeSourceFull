/**
 * Public contact phone and WhatsApp.
 * Set `VITE_CONTACT_PHONE` (E.164) on the frontend environment to show a phone.
 * Optional: `VITE_CONTACT_PHONE_DISPLAY`, `VITE_CONTACT_WHATSAPP`,
 * `VITE_CONTACT_WHATSAPP_DISPLAY`.
 * When `VITE_CONTACT_PHONE` is empty, the public site does not render a phone.
 */

function envValue(name: keyof ImportMetaEnv): string {
  const value = import.meta.env[name];
  return typeof value === "string" ? value.trim() : "";
}

function toTel(raw: string): string {
  const compact = raw.replace(/\s/g, "");
  if (!compact) return "";
  if (compact.startsWith("+") || compact.startsWith("http")) return compact;
  return `+${compact}`;
}

export function publicSitePhone(): { tel: string; display: string } | null {
  const raw = envValue("VITE_CONTACT_PHONE");
  if (!raw) return null;
  const tel = toTel(raw);
  if (!tel) return null;
  return {
    tel,
    display: envValue("VITE_CONTACT_PHONE_DISPLAY") || raw,
  };
}

export function publicSiteWhatsApp(): { tel: string; display: string } | null {
  const raw = envValue("VITE_CONTACT_WHATSAPP") || envValue("VITE_CONTACT_PHONE");
  if (!raw) return null;
  const tel = toTel(raw);
  if (!tel) return null;
  return {
    tel,
    display:
      envValue("VITE_CONTACT_WHATSAPP_DISPLAY") ||
      envValue("VITE_CONTACT_PHONE_DISPLAY") ||
      raw,
  };
}
