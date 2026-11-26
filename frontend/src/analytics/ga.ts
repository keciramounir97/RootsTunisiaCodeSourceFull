declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const CONSENT_KEY = "roots_cookie_consent_v1";

export function getGaMeasurementId(): string {
  return String(import.meta.env.VITE_GA_MEASUREMENT_ID || "").trim();
}

export function getGoogleSiteVerification(): string {
  return String(import.meta.env.VITE_GOOGLE_SITE_VERIFICATION || "").trim();
}

export function hasAnalyticsConsent(): boolean {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return true;
    const parsed = JSON.parse(raw);
    return parsed?.analytics !== false;
  } catch {
    return true;
  }
}

export function ensureGtagLoaded(measurementId: string) {
  if (!measurementId || typeof document === "undefined") return;
  if (document.getElementById("ga4-gtag")) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer?.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", measurementId, { anonymize_ip: true, send_page_view: false });

  const script = document.createElement("script");
  script.id = "ga4-gtag";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);
}

export function trackGaPageview(path: string, title?: string) {
  const id = getGaMeasurementId();
  if (!id || !hasAnalyticsConsent() || !window.gtag) return;
  window.gtag("event", "page_view", {
    page_path: path,
    page_title: title || document.title,
    send_to: id,
  });
}

export function getOrCreateSessionId(): string {
  const key = "roots_analytics_session";
  try {
    const existing = sessionStorage.getItem(key);
    if (existing) return existing;
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `s_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem(key, id);
    return id;
  } catch {
    return `s_${Date.now()}`;
  }
}

function resolveApiRoot(): string {
  if (typeof window === "undefined") {
    return String(import.meta.env.VITE_API_URL || "https://server.rootstunisia.com").replace(/\/+$/, "").replace(/\/api$/i, "");
  }
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(hostname) || hostname === "localhost" || hostname === "127.0.0.1") {
    return `${protocol}//${hostname}:5000`;
  }
  if (import.meta.env.VITE_API_URL) {
    return String(import.meta.env.VITE_API_URL).replace(/\/+$/, "").replace(/\/api$/i, "");
  }
  if (hostname.includes("rootstunisia.com")) return `${protocol}//server.rootstunisia.com`;
  if (hostname.includes("rootsegypt.org")) return `${protocol}//api.rootsegypt.org`;
  return `${protocol}//${hostname}`;
}

export async function sendFirstPartyPageview(payload: {
  path: string;
  title?: string;
  referrer?: string;
  locale?: string;
}) {
  if (payload.path.startsWith("/admin") || payload.path.startsWith("/api")) return;

  const body = JSON.stringify({
    path: payload.path,
    title: payload.title,
    referrer: payload.referrer,
    locale: payload.locale,
    sessionId: getOrCreateSessionId(),
  });
  const url = `${resolveApiRoot()}/api/analytics/collect`;

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon(url, blob);
      return;
    }
  } catch {
    // fall through
  }

  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
      credentials: "omit",
    });
  } catch {
    // ignore beacon failures
  }
}
