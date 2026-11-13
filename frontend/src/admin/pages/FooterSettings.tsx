import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "../../context/TranslationContext";
import {
  tForLocale,
  SUPPORTED_LOCALES,
  type SupportedLocale,
} from "../../utils/translations";
import { notifyAdminSaved } from "../utils/notifications";
import { api } from "../../api/client";
import { refreshSiteContent } from "../../hooks/useSiteContent";
import {
  FOOTER_STORAGE_KEY,
  type SocialIconType,
  type SocialLink,
  type FooterConfig,
  ICON_OPTIONS,
  ICON_MAP,
  DEFAULT_FOOTER_CONFIG,
  normalizeFooterConfig,
  loadFooterConfig,
  saveFooterConfig,
  parseSocialLinksPayload,
  getActiveSocialLinks,
  getPlatformLabel,
} from "../../utils/footerConfig";
import {
  Phone,
  Mail,
  MapPin,
  Plus,
  Trash2,
  Save,
  CheckCircle,
  FileText,
  RotateCcw,
  Link as LinkIcon,
} from "lucide-react";

const LOCALE_LABELS: Record<SupportedLocale, string> = {
  fr: "FR",
  en: "EN",
  ar: "العربية",
  es: "ES",
  it: "IT",
  mt: "MT",
};

export {
  FOOTER_STORAGE_KEY,
  type SocialIconType,
  type SocialLink,
  type FooterConfig,
  ICON_OPTIONS,
  ICON_MAP,
  DEFAULT_FOOTER_CONFIG,
  normalizeFooterConfig,
  loadFooterConfig,
};

export default function FooterSettings() {
  const { t, locale, isRtl } = useTranslation();
  const cleanActiveLocale = (locale || "fr").toLowerCase().split("-")[0];

  const [config, setConfig] = useState<FooterConfig>(loadFooterConfig);
  const [descTabLocale, setDescTabLocale] = useState<SupportedLocale>(() =>
    SUPPORTED_LOCALES.includes(cleanActiveLocale as SupportedLocale)
      ? (cleanActiveLocale as SupportedLocale)
      : "fr",
  );
  const [saved, setSaved] = useState(false);
  const [savingRemote, setSavingRemote] = useState(false);
  const syncChainRef = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    if (SUPPORTED_LOCALES.includes(cleanActiveLocale as SupportedLocale)) {
      setDescTabLocale(cleanActiveLocale as SupportedLocale);
    }
  }, [cleanActiveLocale]);

  const persistToBackend = useCallback((target: FooterConfig): Promise<void> => {
    const run = syncChainRef.current.then(async () => {
      try {
        setSavingRemote(true);
        const res = await api.get("/admin/site-content");
        const contentDoc = res.data?.data ?? res.data ?? { pages: [] };
        const pages: any[] = Array.isArray(contentDoc.pages)
          ? JSON.parse(JSON.stringify(contentDoc.pages))
          : [];
        let footerPage = pages.find((p: any) => p.id === "footer");
        if (!footerPage) {
          footerPage = {
            id: "footer",
            label: "Footer & Global Settings",
            path: "/",
            sections: [],
          };
          pages.push(footerPage);
        }

        let cfgSec = footerPage.sections.find((s: any) => s.id === "config");
        if (!cfgSec) {
          cfgSec = { id: "config", label: "Contact & Social Settings", fields: [] };
          footerPage.sections.push(cfgSec);
        }
        const upsertField = (
          key: string,
          type: "text" | "json",
          label: string,
          val: string,
          translations?: Record<string, string>,
        ) => {
          let fld = cfgSec.fields.find((f: any) => f.key === key);
          if (!fld) {
            fld = { key, type, label, value: "" };
            cfgSec.fields.push(fld);
          }
          fld.type = type;
          fld.value = val;
          if (translations !== undefined) {
            fld.translations = translations;
          }
        };
        const cleanedTaglineTranslations: Record<string, string> = {};
        for (const loc of SUPPORTED_LOCALES) {
          const val = target.brandTaglineTranslations?.[loc]?.trim();
          if (val) cleanedTaglineTranslations[loc] = val;
        }
        const defaultTaglineVal =
          target.brandTagline?.trim() || cleanedTaglineTranslations.fr || "";

        upsertField("location", "text", "Location / City", target.location);
        upsertField("email", "text", "Public e-mail", target.email);
        upsertField("phone", "text", "Phone number", target.phone);
        upsertField("whatsapp", "text", "WhatsApp number", target.whatsapp);
        upsertField(
          "brandTagline",
          "text",
          "Business Footer Description",
          defaultTaglineVal,
          cleanedTaglineTranslations,
        );
        upsertField(
          "socialLinksJson",
          "json",
          "Social & Official Platforms",
          JSON.stringify({
            updatedAt: target.updatedAt ?? Date.now(),
            links: target.socialLinks,
          }),
        );

        await api.put("/admin/site-content", { pages });
        await refreshSiteContent();
      } catch (err) {
        console.warn("Could not sync footer settings to /admin/site-content:", err);
      } finally {
        setSavingRemote(false);
      }
    });
    syncChainRef.current = run.catch(() => undefined);
    return run;
  }, []);

  // Hydrate footer configuration from server
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await api.get("/admin/site-content");
        const contentDoc = res.data?.data ?? res.data;
        const page = contentDoc?.pages?.find((p: any) => p.id === "footer");
        if (!page || !active) return;

        const cfgSec = page.sections?.find((s: any) => s.id === "config");
        const readCfg = (key: string): string => {
          const fld = cfgSec?.fields?.find((f: any) => f.key === key);
          return typeof fld?.value === "string" ? fld.value.trim() : "";
        };
        const srvLocation = readCfg("location");
        const srvEmail = readCfg("email");
        const srvPhone = readCfg("phone");
        const srvWhatsapp = readCfg("whatsapp");
        const srvTaglineFld = cfgSec?.fields?.find((f: any) => f.key === "brandTagline");
        const srvBrandTagline =
          typeof srvTaglineFld?.value === "string" ? srvTaglineFld.value.trim() : "";
        const srvBrandTaglineTranslations: Record<string, string> = {};
        if (srvTaglineFld?.translations && typeof srvTaglineFld.translations === "object") {
          for (const [locKey, rawVal] of Object.entries(srvTaglineFld.translations)) {
            if (typeof rawVal === "string" && rawVal.trim()) {
              srvBrandTaglineTranslations[locKey.toLowerCase().split("-")[0]] = rawVal.trim();
            }
          }
        }
        const hasSrvTaglineTranslations = Object.keys(srvBrandTaglineTranslations).length > 0;
        const srvSocial = parseSocialLinksPayload(readCfg("socialLinksJson"));

        if (
          srvLocation ||
          srvEmail ||
          srvPhone ||
          srvWhatsapp ||
          srvBrandTagline ||
          hasSrvTaglineTranslations ||
          srvSocial
        ) {
          setConfig((prev) => {
            const localTs = prev.updatedAt ?? 0;
            const srvTs = srvSocial?.updatedAt ?? 0;
            if (localTs > 0 && localTs > srvTs) return prev;
            const hasVersionedSrv = Boolean(srvSocial && typeof srvSocial.updatedAt === "number");
            const next: FooterConfig = {
              socialLinks: srvSocial ? srvSocial.links : prev.socialLinks,
              location: hasVersionedSrv ? srvLocation : srvLocation || prev.location,
              email: hasVersionedSrv ? srvEmail : srvEmail || prev.email,
              phone: hasVersionedSrv ? srvPhone : srvPhone || prev.phone,
              whatsapp: hasVersionedSrv ? srvWhatsapp : srvWhatsapp || prev.whatsapp,
              brandTagline: hasVersionedSrv
                ? srvBrandTagline
                : srvBrandTagline || prev.brandTagline || "",
              brandTaglineTranslations: hasVersionedSrv
                ? srvBrandTaglineTranslations
                : hasSrvTaglineTranslations
                  ? srvBrandTaglineTranslations
                  : prev.brandTaglineTranslations || {},
              updatedAt: srvSocial?.updatedAt ?? prev.updatedAt,
            };
            if (typeof localStorage !== "undefined") {
              localStorage.setItem(FOOTER_STORAGE_KEY, JSON.stringify(next));
            }
            return next;
          });
        }
      } catch {
        // Keep local fallback cleanly if server request fails
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const enabledSocialLinks = useMemo(() => getActiveSocialLinks(config), [config]);

  const inputClass =
    "w-full min-h-11 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)] outline-none transition focus:border-[var(--gold)]";
  const labelClass =
    "text-xs font-semibold uppercase tracking-wide text-[var(--gold)] flex items-center gap-1.5";

  const handleSave = useCallback(async () => {
    const stamped = saveFooterConfig(config);
    setConfig(stamped);
    await persistToBackend(stamped);

    setSaved(true);
    notifyAdminSaved(t("footer_settings", "Footer Settings"));
    setTimeout(() => setSaved(false), 2500);
  }, [config, persistToBackend, t]);

  const addLink = () => {
    const newLink: SocialLink = {
      id: `link-${Date.now()}`,
      icon: "facebook",
      url: "",
      enabled: true,
    };
    setConfig((prev) => ({ ...prev, socialLinks: [...prev.socialLinks, newLink] }));
  };

  const removeLink = (id: string) => {
    const next: FooterConfig = {
      ...config,
      socialLinks: config.socialLinks.filter((link) => link.id !== id),
    };
    const stamped = saveFooterConfig(next);
    setConfig(stamped);
    void persistToBackend(stamped);
  };

  const updateLink = (id: string, patch: Partial<SocialLink>, syncImmediately = false) => {
    const next: FooterConfig = {
      ...config,
      socialLinks: config.socialLinks.map((link) => (link.id === id ? { ...link, ...patch } : link)),
    };
    if (syncImmediately) {
      const stamped = saveFooterConfig(next);
      setConfig(stamped);
      void persistToBackend(stamped);
      return;
    }
    setConfig(next);
  };

  const commitCurrentConfig = () => {
    const stamped = saveFooterConfig(config);
    setConfig(stamped);
    void persistToBackend(stamped);
  };

  const updateTaglineForLocale = (targetLocale: SupportedLocale, val: string) => {
    setConfig((prev) => {
      const nextTranslations = { ...(prev.brandTaglineTranslations || {}) };
      if (val.trim()) {
        nextTranslations[targetLocale] = val;
      } else {
        delete nextTranslations[targetLocale];
      }
      return {
        ...prev,
        ...(targetLocale === "fr" ? { brandTagline: val } : {}),
        brandTaglineTranslations: nextTranslations,
      };
    });
  };

  const currentTabTaglineValue =
    config.brandTaglineTranslations?.[descTabLocale] ??
    (descTabLocale === "fr" ? config.brandTagline || "" : "");

  const previewTagline =
    config.brandTaglineTranslations?.[cleanActiveLocale]?.trim() ||
    (cleanActiveLocale === "fr" ? config.brandTagline?.trim() : "") ||
    t("footer_tagline");

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="space-y-6 text-start">
      {/* Top Header */}
      <div className="surface-card frame-gold p-6 rounded-2xl bg-[var(--card)]/95 shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-[var(--gold)]/20 text-[var(--gold)] border border-[var(--gold)]/30 inline-block">
            {t("admin", "Administration")} • {t("footer_admin_pill", "Pied de Page")}
          </span>
          <h1 className="mt-2 text-2xl font-bold font-serif text-[var(--foreground)]">
            {t("footer_settings", "Paramètres du Pied de Page")}
          </h1>
          <p className="mt-1 max-w-2xl text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed">
            {t(
              "footer_settings_desc",
              "Gérez la description de l'entreprise, les coordonnées et les réseaux sociaux du pied de page et de la page Contact.",
            )}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={savingRemote}
            onClick={() => void handleSave()}
            className="btn-base btn-gold inline-flex min-h-11 items-center justify-center gap-2 px-5 text-xs font-bold shadow-md transition disabled:opacity-60 cursor-pointer"
          >
            {saved ? <CheckCircle className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            <span>
              {savingRemote
                ? t("footer_saving_status", t("saving", "Enregistrement..."))
                : saved
                ? t("settings_saved", "Paramètres enregistrés.")
                : t("save_settings", "Enregistrer les Paramètres")}
            </span>
          </button>
        </div>
      </div>

      {/* Business Footer Description Editor */}
      <div className="surface-card rounded-2xl border border-[var(--gold)]/30 bg-[var(--card)] p-6 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-base font-bold font-serif text-[var(--foreground)] flex items-center gap-2">
              <FileText className="h-4 w-4 text-[var(--gold)]" />
              <span>{t("footer_business_desc_title", "Description de l'Entreprise (Pied de Page)")}</span>
            </h2>
            <p className="mt-1 text-xs text-[var(--muted-foreground)] leading-relaxed">
              {t(
                "footer_business_desc_hint",
                "Présentez votre mission généalogique et archivistique. Laissez vide pour utiliser la description traduite par défaut dans les 6 langues.",
              )}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {SUPPORTED_LOCALES.map((loc) => {
              const hasOverride = Boolean(
                config.brandTaglineTranslations?.[loc]?.trim() ||
                  (loc === "fr" && config.brandTagline?.trim()),
              );
              const isSelected = descTabLocale === loc;
              return (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setDescTabLocale(loc)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition cursor-pointer inline-flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-[var(--gold)] text-black border-[var(--gold)]"
                      : "bg-[var(--background)] text-[var(--foreground)] border-[var(--border)] hover:border-[var(--gold)]/60"
                  }`}
                >
                  <span>{LOCALE_LABELS[loc]}</span>
                  {hasOverride && (
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isSelected ? "bg-black" : "bg-[var(--gold)]"
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <textarea
            rows={3}
            dir={descTabLocale === "ar" ? "rtl" : "ltr"}
            value={currentTabTaglineValue}
            onChange={(e) => updateTaglineForLocale(descTabLocale, e.target.value)}
            placeholder={t(
              "footer_business_desc_placeholder",
              "Description personnalisée pour cette langue (laisser vide pour le texte par défaut)...",
            )}
            aria-label={`${t("footer_business_desc_title", "Description de l'Entreprise")} (${LOCALE_LABELS[descTabLocale]})`}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)] outline-none transition focus:border-[var(--gold)]"
          />

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 rounded-lg border border-[var(--border)] bg-[var(--background)]/70 p-3 text-xs">
            <div className="space-y-1">
              <div className="font-semibold text-[var(--gold)]">
                {t("footer_business_desc_default_badge", "Aperçu par défaut pour cette langue :")}
              </div>
              <p
                dir={descTabLocale === "ar" ? "rtl" : "ltr"}
                className="text-[var(--muted-foreground)] leading-relaxed"
              >
                {tForLocale(descTabLocale, "footer_tagline")}
              </p>
            </div>
            {currentTabTaglineValue.trim() && (
              <button
                type="button"
                onClick={() => updateTaglineForLocale(descTabLocale, "")}
                className="shrink-0 inline-flex items-center gap-1 rounded-md border border-[var(--border)] px-2.5 py-1 text-[11px] font-semibold text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--gold)] transition cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" />
                <span>{t("reset_defaults", "Réinitialiser par défaut")}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Section Coordonnées */}
        <div className="surface-card rounded-2xl border border-[var(--gold)]/30 bg-[var(--card)] p-6 shadow-md space-y-4">
          <h2 className="text-base font-bold font-serif text-[var(--foreground)]">
            {t("footer_contact_info", "Coordonnées de Contact")}
          </h2>
          <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
            {t(
              "footer_contact_hint",
              "Ces coordonnées s'affichent automatiquement dans le bloc de contact du pied de page et sur la page Contact.",
            )}
          </p>

          <div className="space-y-4 pt-1">
            <div>
              <label className={labelClass}>
                <MapPin className="h-3.5 w-3.5" />
                {t("location", "Localisation")}
              </label>
              <input
                type="text"
                value={config.location}
                onChange={(e) => setConfig((prev) => ({ ...prev, location: e.target.value }))}
                className={inputClass}
                placeholder={t(
                  "footer_location_placeholder",
                  "Laisser vide pour masquer (ex : Tunis, Tunisie)",
                )}
              />
            </div>

            <div>
              <label className={labelClass}>
                <Mail className="h-3.5 w-3.5" />
                {t("email", "E-mail")}
              </label>
              <input
                type="email"
                dir="ltr"
                value={config.email}
                onChange={(e) => setConfig((prev) => ({ ...prev, email: e.target.value }))}
                className={inputClass}
                placeholder="contact@rootstunisia.com"
              />
            </div>

            <div>
              <label className={labelClass}>
                <Phone className="h-3.5 w-3.5" />
                {t("phone", "Téléphone")}
              </label>
              <input
                type="tel"
                dir="ltr"
                value={config.phone}
                onChange={(e) => setConfig((prev) => ({ ...prev, phone: e.target.value }))}
                className={inputClass}
                placeholder={t(
                  "footer_phone_placeholder",
                  "Laisser vide pour masquer (ex : +216 71 000 000)",
                )}
              />
            </div>

            <div>
              <label className={labelClass}>
                <LinkIcon className="h-3.5 w-3.5" />
                {t("whatsapp", "WhatsApp")}
              </label>
              <input
                type="tel"
                dir="ltr"
                value={config.whatsapp}
                onChange={(e) => setConfig((prev) => ({ ...prev, whatsapp: e.target.value }))}
                className={inputClass}
                placeholder={t(
                  "footer_whatsapp_placeholder",
                  "Laisser vide pour masquer (ex : +216 98 000 000)",
                )}
              />
            </div>
          </div>
        </div>

        {/* Section Réseaux Sociaux */}
        <div className="surface-card rounded-2xl border border-[var(--gold)]/30 bg-[var(--card)] p-6 shadow-md space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold font-serif text-[var(--foreground)]">
                {t("footer_social_links", "Réseaux Sociaux")}
              </h2>
              <button
                type="button"
                onClick={addLink}
                className="btn-base btn-gold inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                {t("add_network", "Ajouter un Lien")}
              </button>
            </div>

            <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
              {t(
                "footer_social_hint",
                "Activez ou désactivez les plateformes officielles. Les réseaux actifs s'affichent en direct dans le pied de page et dans le bloc « Plateformes Officielles » de la page Contact.",
              )}
            </p>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pe-1 scrollbar-thin">
              {config.socialLinks.map((link) => {
                const IconComponent = ICON_MAP[link.icon] || LinkIcon;
                const optLabel =
                  ICON_OPTIONS.find((opt) => opt.value === link.icon)?.label || link.icon;
                return (
                  <div
                    key={link.id}
                    className="flex items-center gap-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)] p-3 shadow-sm"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30">
                      <IconComponent className="h-4 w-4" />
                    </div>

                    <select
                      value={link.icon}
                      aria-label={`${t("footer_platform_aria", "Plateforme")} ${optLabel}`}
                      onChange={(e) =>
                        updateLink(link.id, { icon: e.target.value as SocialIconType }, true)
                      }
                      className="min-h-9 rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] px-2 text-xs font-medium outline-none"
                    >
                      {ICON_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-[var(--card)] text-[var(--foreground)]">
                          {opt.label}
                        </option>
                      ))}
                    </select>

                    <input
                      type="text"
                      inputMode="url"
                      dir="ltr"
                      value={link.url}
                      aria-label={`${t("footer_url_aria", "URL")} ${optLabel}`}
                      onChange={(e) => updateLink(link.id, { url: e.target.value })}
                      onBlur={() => commitCurrentConfig()}
                      placeholder={
                        link.icon === "whatsapp"
                          ? "https://wa.me/216..."
                          : "https://..."
                      }
                      className="min-h-9 flex-1 rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] px-2.5 text-xs outline-none focus:border-[var(--gold)]"
                    />

                    <label className="flex items-center gap-1.5 cursor-pointer text-xs">
                      <input
                        type="checkbox"
                        checked={link.enabled}
                        aria-label={`${optLabel} — ${t("footer_active_label", "Actif")}`}
                        onChange={(e) =>
                          updateLink(link.id, { enabled: e.target.checked }, true)
                        }
                        className="rounded border-[var(--border)] text-[var(--gold)] focus:ring-[var(--gold)]"
                      />
                      <span className="hidden sm:inline text-[11px] text-[var(--foreground)] font-semibold">
                        {t("footer_active_label", "Actif")}
                      </span>
                    </label>

                    <button
                      type="button"
                      onClick={() => removeLink(link.id)}
                      className="p-1.5 text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg cursor-pointer transition"
                      title={t("remove", "Supprimer")}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div className="surface-card frame-gold p-6 rounded-2xl bg-[var(--card)]/95 shadow-md space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--gold)] flex items-center gap-2">
          <span>{t("footer_preview_title", "Aperçu Direct (Pied de Page & Page Contact)")}</span>
        </h3>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl bg-[var(--background)] p-4 border border-[var(--border)]">
          <div className="text-xs space-y-1.5 max-w-2xl">
            <p className="text-[var(--muted-foreground)] leading-relaxed">{previewTagline}</p>
            <div className="font-bold text-[var(--foreground)]">
              {config.location || t("footer_no_location", "Aucune localisation configurée")}
            </div>
            <div className="text-[var(--muted-foreground)]">
              <span dir="ltr">{config.email || t("footer_no_email", "Aucun e-mail")}</span> •{" "}
              <span dir="ltr">{config.phone || t("footer_no_phone", "Aucun téléphone")}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {enabledSocialLinks.length === 0 ? (
              <span className="text-xs text-[var(--muted-foreground)] italic">
                {t("footer_no_active_links", "Aucun réseau actif")}
              </span>
            ) : (
              enabledSocialLinks.map((link) => {
                const IconComp = ICON_MAP[link.icon] || LinkIcon;
                const label = getPlatformLabel(link.icon, locale);
                return (
                  <span
                    key={link.id}
                    title={label}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30 text-[11px] font-semibold"
                  >
                    <IconComp className="h-3.5 w-3.5" />
                    <span>{label}</span>
                  </span>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
