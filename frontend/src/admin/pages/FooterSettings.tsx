import { Suspense, lazy, useCallback, useEffect, useMemo, useState } from "react";
import type { ElementType } from "react";
import { useTranslation } from "../../context/TranslationContext";
import { useThemeStore } from "../../store/theme";
import { notifyAdminSaved } from "../utils/notifications";
import { api } from "../../api/client";
import { refreshSiteContent } from "../../hooks/useSiteContent";
import type { GrapesBuilderPayload } from "../components/cms/GrapesJsBuilder";
import {
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Linkedin,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Plus,
  Trash2,
  Save,
  ExternalLink,
  CheckCircle,
  Globe,
  Send,
  Music,
  Eye,
  Link as LinkIcon,
  Layout,
  Sparkles,
} from "lucide-react";

const GrapesJsBuilder = lazy(() => import("../components/cms/GrapesJsBuilder"));

const STORAGE_KEY = "RootsTunisia_footer_settings";

export type SocialIconType =
  | "facebook" | "instagram" | "youtube" | "twitter" | "linkedin"
  | "whatsapp" | "telegram" | "tiktok";

export interface SocialLink {
  id: string;
  icon: SocialIconType;
  url: string;
  enabled: boolean;
}

export interface FooterConfig {
  socialLinks: SocialLink[];
  location: string;
  email: string;
  phone: string;
  whatsapp: string;
}

const ICON_OPTIONS: { value: SocialIconType; label: string }[] = [
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "twitter", label: "Twitter / X" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "telegram", label: "Telegram" },
  { value: "tiktok", label: "TikTok" },
];

const VALID_ICONS = new Set(ICON_OPTIONS.map((item) => item.value));

export const ICON_MAP: Record<SocialIconType, ElementType> = {
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  twitter: Twitter,
  linkedin: Linkedin,
  whatsapp: MessageCircle,
  telegram: Send,
  tiktok: Music,
};

export const DEFAULT_FOOTER_CONFIG: FooterConfig = {
  socialLinks: [
    { id: "fb", icon: "facebook", url: "https://facebook.com", enabled: true },
    { id: "ig", icon: "instagram", url: "https://instagram.com", enabled: true },
    { id: "yt", icon: "youtube", url: "https://youtube.com", enabled: true },
  ],
  location: "Rue de la Kasbah, Médina de Tunis, Tunisie",
  email: "contact@rootstunisia.com",
  phone: "+216 71 000 000",
  whatsapp: "+216 71 000 000",
};

function normalizeFooterConfig(value: Partial<FooterConfig> | null): FooterConfig {
  const socialLinks = Array.isArray(value?.socialLinks)
    ? value.socialLinks
        .filter((link) => VALID_ICONS.has(link.icon))
        .map((link) => ({
          id: String(link.id || `link-${Date.now()}`),
          icon: link.icon,
          url: String(link.url || ""),
          enabled: Boolean(link.enabled),
        }))
    : DEFAULT_FOOTER_CONFIG.socialLinks;

  return {
    ...DEFAULT_FOOTER_CONFIG,
    ...value,
    socialLinks,
  };
}

export function loadFooterConfig(): FooterConfig {
  if (typeof localStorage === "undefined") return DEFAULT_FOOTER_CONFIG;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return normalizeFooterConfig(JSON.parse(raw));
  } catch {
    // Keep the public footer available even if saved settings are malformed.
  }
  return DEFAULT_FOOTER_CONFIG;
}

function saveFooterConfig(cfg: FooterConfig) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
}

export default function FooterSettings() {
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const isDark = theme === "dark";

  const [config, setConfig] = useState<FooterConfig>(loadFooterConfig);
  const [saved, setSaved] = useState(false);
  const [savingRemote, setSavingRemote] = useState(false);
  const [editorTab, setEditorTab] = useState<"form" | "grapesjs">("form");
  const [grapesPayload, setGrapesPayload] = useState<GrapesBuilderPayload>({
    html: "",
    css: "",
    projectJson: "",
  });

  // Hydrate footer configuration and GrapesJS footer visual layout from server
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

        if (srvLocation || srvEmail || srvPhone || srvWhatsapp) {
          setConfig((prev) => {
            const next = {
              ...prev,
              location: srvLocation || prev.location,
              email: srvEmail || prev.email,
              phone: srvPhone || prev.phone,
              whatsapp: srvWhatsapp || prev.whatsapp,
            };
            saveFooterConfig(next);
            return next;
          });
        }

        const gSec = page.sections?.find((s: any) => s.id === "grapes_builder");
        const readG = (key: string): string => {
          const fld = gSec?.fields?.find((f: any) => f.key === key);
          return typeof fld?.value === "string" ? fld.value : "";
        };
        setGrapesPayload({
          html: readG("html"),
          css: readG("css"),
          projectJson: readG("project"),
        });
      } catch {
        // Keep local fallback cleanly if server request fails
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const enabledSocialLinks = useMemo(
    () => config.socialLinks.filter((link) => link.enabled && link.url.trim()),
    [config.socialLinks],
  );

  const pageBg = isDark ? "bg-[#071827] text-[#f5f1e8]" : "bg-[#f5f1e8] text-[#162238]";
  const panel = isDark ? "bg-[#0f1f33] border-white/10" : "bg-white border-[#24766f]/15";
  const subtlePanel = isDark ? "bg-white/5 border-white/10" : "bg-[#f8f5ef] border-[#24766f]/10";
  const inputClass = `w-full min-h-11 rounded-md border px-3 text-sm outline-none transition ${
    isDark
      ? "bg-[#071827] border-white/15 text-white placeholder-white/35 focus:border-[#d9a441]"
      : "bg-white border-[#24766f]/20 text-[#162238] placeholder-[#162238]/45 focus:border-[#24766f]"
  } focus:ring-2 focus:ring-[#d9a441]/20`;
  const labelClass = `text-xs font-semibold uppercase tracking-wide ${isDark ? "text-[#d9a441]" : "text-[#24766f]"}`;

  const handleSave = useCallback(
    async (grapesOverride?: GrapesBuilderPayload) => {
      saveFooterConfig(config);
      try {
        window.dispatchEvent(new CustomEvent("roots_footer_updated", { detail: config }));
      } catch {
        // Ignore custom event dispatch errors in headless test envs
      }

      const activeGrapes = grapesOverride || grapesPayload;
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
        const upsertText = (key: string, label: string, val: string) => {
          let fld = cfgSec.fields.find((f: any) => f.key === key);
          if (!fld) {
            fld = { key, type: "text", label, value: "" };
            cfgSec.fields.push(fld);
          }
          fld.value = val;
        };
        upsertText("location", "Location / City", config.location);
        upsertText("email", "Public e-mail", config.email);
        upsertText("phone", "Phone number", config.phone);
        upsertText("whatsapp", "WhatsApp number", config.whatsapp);

        let gSec = footerPage.sections.find((s: any) => s.id === "grapes_builder");
        if (!gSec) {
          gSec = { id: "grapes_builder", label: "GrapesJS Visual Builder", fields: [] };
          footerPage.sections.push(gSec);
        }
        const upsertBuilder = (key: "html" | "css" | "project", type: string, val: string) => {
          let fld = gSec.fields.find((f: any) => f.key === key);
          if (!fld) {
            fld = { key, type, label: key, value: "" };
            gSec.fields.push(fld);
          }
          fld.type = type;
          fld.value = val;
        };
        upsertBuilder("html", "builder_html", activeGrapes.html);
        upsertBuilder("css", "css", activeGrapes.css);
        upsertBuilder("project", "json", activeGrapes.projectJson);

        await api.put("/admin/site-content", { pages });
        await refreshSiteContent();
        if (grapesOverride) setGrapesPayload(grapesOverride);
      } catch {
        // Local storage + live event still succeeded
      } finally {
        setSavingRemote(false);
      }

      setSaved(true);
      notifyAdminSaved(t("settings_saved", "Saved."));
      setTimeout(() => setSaved(false), 2500);
    },
    [config, grapesPayload, t],
  );

  const addLink = () => {
    setConfig((prev) => ({
      ...prev,
      socialLinks: [
        ...prev.socialLinks,
        { id: `link-${Date.now()}`, icon: "facebook", url: "https://", enabled: true },
      ],
    }));
  };

  const removeLink = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((link) => link.id !== id),
    }));
  };

  const updateLink = (id: string, patch: Partial<SocialLink>) => {
    setConfig((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.map((link) => (link.id === id ? { ...link, ...patch } : link)),
    }));
  };

  return (
    <div className={`min-h-screen p-4 md:p-6 ${pageBg}`}>
      <div className="mx-auto max-w-6xl space-y-6">
        <div className={`rounded-lg border ${panel} p-5 shadow-sm`}>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className={labelClass}>{t("admin", "Admin")}</p>
              <h1 className="mt-1 text-2xl font-bold">
                {t("footer_settings", "Pied de page & Canaux de Contact (Footer & Contact)")}
              </h1>
              <p className="mt-2 max-w-2xl text-sm opacity-70">
                {t(
                  "footer_settings_desc",
                  "Gérez les réseaux sociaux (Facebook, Instagram, WhatsApp) et coordonnées directes affichés sur le Pied de page (Footer) et sur la Page Contact (/contact).",
                )}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex rounded-md border border-[var(--border)] bg-black/10 p-0.5">
                <button
                  type="button"
                  onClick={() => setEditorTab("form")}
                  className={`inline-flex items-center gap-1.5 rounded px-3 py-2 text-xs font-bold cursor-pointer transition ${
                    editorTab === "form"
                      ? "bg-[#d9a441] text-[#071827]"
                      : "hover:text-[#d9a441]"
                  }`}
                >
                  <Layout className="h-3.5 w-3.5" />
                  <span>Coordonnées & Réseaux</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditorTab("grapesjs")}
                  className={`inline-flex items-center gap-1.5 rounded px-3 py-2 text-xs font-bold cursor-pointer transition ${
                    editorTab === "grapesjs"
                      ? "bg-[#d9a441] text-[#071827]"
                      : "hover:text-[#d9a441]"
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>GrapesJS Builder</span>
                </button>
              </div>
              <button
                type="button"
                disabled={savingRemote}
                onClick={() => void handleSave()}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#d9a441] px-5 text-sm font-semibold text-[#071827] shadow-sm transition hover:bg-[#c4932e] disabled:opacity-60 cursor-pointer"
              >
                {saved ? <CheckCircle className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                {savingRemote ? "..." : saved ? t("settings_saved", "Saved") : t("save_settings", "Save Settings")}
              </button>
            </div>
          </div>
        </div>

        {editorTab === "grapesjs" ? (
          <Suspense
            fallback={
              <div className="rounded-xl border border-[var(--border)] p-10 text-center text-sm opacity-80">
                Chargement du constructeur GrapesJS du Pied de Page…
              </div>
            }
          >
            <GrapesJsBuilder
              pageId="footer"
              localeCode="default"
              initialHtml={grapesPayload.html}
              initialCss={grapesPayload.css}
              initialProjectJson={grapesPayload.projectJson}
              seedContext={{
                pageId: "footer",
                pageTitle: "Pied de Page Roots Tunisia",
                contactEmail: config.email,
                contactPhone: config.phone,
                contactAddress: config.location,
              }}
              onChange={setGrapesPayload}
              onSaveRequested={(payload) => void handleSave(payload)}
            />
          </Suspense>
        ) : (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-6">
            <section className={`rounded-lg border ${panel} p-5 shadow-sm`}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="flex items-center gap-2 text-base font-bold">
                    <Globe className="h-5 w-5 text-[#d9a441]" />
                    {t("footer_social_links", "Social Links")}
                  </h2>
                  <p className="mt-1 text-sm opacity-65">
                    {enabledSocialLinks.length} {t("active_of", "active of")}{" "}
                    {config.socialLinks.length} {t("configured", "configured")}.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addLink}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-[#24766f] px-4 text-sm font-semibold text-white transition hover:bg-[#1f625d]"
                >
                  <Plus className="h-4 w-4" />
                  {t("add_social_link", "Add Social Link")}
                </button>
              </div>

              <div className="mt-5 space-y-3">
                {config.socialLinks.length === 0 ? (
                  <div className={`rounded-md border ${subtlePanel} p-8 text-center text-sm opacity-70`}>
                    {t("no_social_links", "No social links yet.")}
                  </div>
                ) : (
                  config.socialLinks.map((link) => {
                    const IconComp = ICON_MAP[link.icon];
                    return (
                      <div
                        key={link.id}
                        className={`grid gap-3 rounded-md border ${subtlePanel} p-3 md:grid-cols-[44px_160px_minmax(0,1fr)_80px] md:items-center`}
                      >
                        <button
                          type="button"
                          onClick={() => updateLink(link.id, { enabled: !link.enabled })}
                          className={`flex h-10 w-10 items-center justify-center rounded-md transition ${
                            link.enabled
                              ? "bg-[#24766f] text-white"
                              : isDark
                                ? "bg-white/10 text-white/45"
                                : "bg-black/5 text-[#162238]/45"
                          }`}
                          title={link.enabled ? t("disable", "Disable") : t("enable", "Enable")}
                          aria-label={
                            link.enabled
                              ? t("disable_social_link", "Disable social link")
                              : t("enable_social_link", "Enable social link")
                          }
                        >
                          <IconComp className="h-4 w-4" />
                        </button>

                        <select
                          value={link.icon}
                          onChange={(event) => updateLink(link.id, { icon: event.target.value as SocialIconType })}
                          className={inputClass}
                        >
                          {ICON_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>

                        <div className="relative">
                          <LinkIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-45" />
                          <input
                            type="url"
                            value={link.url}
                            onChange={(event) => updateLink(link.id, { url: event.target.value })}
                            placeholder={t("url_placeholder", "https://...")}
                            className={`${inputClass} pl-9`}
                          />
                        </div>

                        <div className="flex items-center justify-end gap-3">
                          {link.url && link.url !== "https://" ? (
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-md p-2 text-[#24766f] transition hover:bg-[#24766f]/10 hover:text-[#d9a441]"
                              title={t("open_url", "Open URL")}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          ) : null}
                          <button
                            type="button"
                            onClick={() => removeLink(link.id)}
                            className="rounded-md p-2 text-red-500 transition hover:bg-red-500/10"
                            title={t("remove", "Remove")}
                            aria-label={t("remove", "Remove")}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>

            <section className={`rounded-lg border ${panel} p-5 shadow-sm`}>
              <h2 className="flex items-center gap-2 text-base font-bold">
                <Mail className="h-5 w-5 text-[#d9a441]" />
                {t("footer_contact_info", "Contact Info")}
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className={labelClass}>{t("location", "Location")}</span>
                  <input
                    type="text"
                    value={config.location}
                    onChange={(event) => setConfig((prev) => ({ ...prev, location: event.target.value }))}
                    className={inputClass}
                    placeholder={t("city_country_placeholder", "City, Country")}
                  />
                </label>

                <label className="space-y-2">
                  <span className={labelClass}>{t("email", "Email")}</span>
                  <input
                    type="email"
                    value={config.email}
                    onChange={(event) => setConfig((prev) => ({ ...prev, email: event.target.value }))}
                    className={inputClass}
                    placeholder={t("contact_email_placeholder", "contact@example.com")}
                  />
                </label>

                <label className="space-y-2">
                  <span className={labelClass}>{t("phone", "Phone")}</span>
                  <input
                    type="text"
                    value={config.phone}
                    onChange={(event) => setConfig((prev) => ({ ...prev, phone: event.target.value }))}
                    className={inputClass}
                    placeholder="+1 234 567 890"
                  />
                </label>

                <label className="space-y-2">
                  <span className={labelClass}>{t("whatsapp", "WhatsApp")}</span>
                  <input
                    type="text"
                    value={config.whatsapp}
                    onChange={(event) => setConfig((prev) => ({ ...prev, whatsapp: event.target.value }))}
                    className={inputClass}
                    placeholder="+1 234 567 890"
                  />
                </label>
              </div>
            </section>
          </div>

          <aside className={`rounded-lg border ${panel} p-5 shadow-sm xl:sticky xl:top-6 xl:self-start`}>
            <h2 className="flex items-center gap-2 text-base font-bold">
              <Eye className="h-5 w-5 text-[#d9a441]" />
              {t("live_preview", "Live Preview")}
            </h2>

            <div className={`mt-5 rounded-md border ${subtlePanel} p-4`}>
              <p className="text-lg font-bold">{t("app_name", "جذور تونس")}</p>
              <p className="mt-2 text-sm leading-6 opacity-70">
                {t(
                  "footer_preview_desc",
                  "A modern home for Tunisian lineage, archive research, and community memory.",
                )}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {enabledSocialLinks.length ? (
                  enabledSocialLinks.map((link) => {
                    const IconComp = ICON_MAP[link.icon];
                    return (
                      <span
                        key={link.id}
                        className="flex h-9 w-9 items-center justify-center rounded-md bg-[#24766f] text-white"
                      >
                        <IconComp className="h-4 w-4" />
                      </span>
                    );
                  })
                ) : (
                  <span className="text-sm opacity-60">
                    {t("no_active_links", "No active links")}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-[#d9a441]" />
                <span>{config.location || t("location_not_set", "Location not set")}</span>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 text-[#d9a441]" />
                <span className="break-all">{config.email || t("email_not_set", "Email not set")}</span>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 text-[#d9a441]" />
                <span>{config.phone || t("phone_not_set", "Phone not set")}</span>
              </div>
              <div className="flex items-start gap-3">
                <MessageCircle className="mt-0.5 h-4 w-4 text-[#d9a441]" />
                <span>{config.whatsapp || t("whatsapp_not_set", "WhatsApp not set")}</span>
              </div>
            </div>
          </aside>
        </div>
        )}
      </div>
    </div>
  );
}
