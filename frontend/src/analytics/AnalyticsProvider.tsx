import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "../context/TranslationContext";
import { splitLocaleFromPath } from "../seo/localeRouting";
import {
  ensureGtagLoaded,
  getGaMeasurementId,
  getGoogleSiteVerification,
  hasAnalyticsConsent,
  sendFirstPartyPageview,
  trackGaPageview,
} from "./ga";

function upsertVerificationMeta(token: string) {
  if (!token || typeof document === "undefined") return;
  let el = document.querySelector('meta[name="google-site-verification"]') as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", "google-site-verification");
    document.head.appendChild(el);
  }
  el.setAttribute("content", token);
}

export default function AnalyticsProvider() {
  const location = useLocation();
  const { locale: activeLocale } = useTranslation();
  const { path, locale: prefixLocale } = splitLocaleFromPath(location.pathname);
  const locale = prefixLocale || activeLocale || "fr";

  useEffect(() => {
    upsertVerificationMeta(getGoogleSiteVerification());
  }, []);

  useEffect(() => {
    const onConsent = () => {
      const id = getGaMeasurementId();
      if (hasAnalyticsConsent() && id) ensureGtagLoaded(id);
    };
    onConsent();
    window.addEventListener("roots:cookie-consent-updated", onConsent);
    return () => window.removeEventListener("roots:cookie-consent-updated", onConsent);
  }, []);

  useEffect(() => {
    if (hasAnalyticsConsent()) {
      const id = getGaMeasurementId();
      if (id) ensureGtagLoaded(id);

      const pagePath = `${location.pathname}${location.search || ""}`;
      trackGaPageview(pagePath, document.title);
    }

    void sendFirstPartyPageview({
      path: path || location.pathname,
      title: document.title,
      referrer: document.referrer || undefined,
      locale,
    });
  }, [location.pathname, location.search, path, locale]);

  return null;
}
