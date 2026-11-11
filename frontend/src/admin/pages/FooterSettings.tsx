import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "../../context/TranslationContext";
import { useThemeStore } from "../../store/theme";
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
} from "../../utils/footerConfig";
import {
  Phone,
  Mail,
  MapPin,
  Plus,
  Trash2,
  Save,
  CheckCircle,
  Link as LinkIcon,
} from "lucide-react";

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
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const isDark = theme === "dark";

  const [config, setConfig] = useState<FooterConfig>(loadFooterConfig);
  const [saved, setSaved] = useState(false);
  const [savingRemote, setSavingRemote] = useState(false);

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

  const handleSave = useCallback(async () => {
    saveFooterConfig(config);
    try {
      window.dispatchEvent(new CustomEvent("roots_footer_updated", { detail: config }));
    } catch {
      // Ignore custom event dispatch errors in headless test envs
    }

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

      await api.put("/admin/site-content", { pages });
      await refreshSiteContent();
    } catch (err) {
      console.warn("Could not sync footer settings to /admin/site-content:", err);
    } finally {
      setSavingRemote(false);
    }

    setSaved(true);
    notifyAdminSaved(t("footer_settings", "Footer Settings"));
    setTimeout(() => setSaved(false), 2500);
  }, [config, t]);

  const addLink = () => {
    const newLink: SocialLink = {
      id: `link-${Date.now()}`,
      icon: "facebook",
      url: "https://",
      enabled: true,
    };
    setConfig((prev) => ({ ...prev, socialLinks: [...prev.socialLinks, newLink] }));
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

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Section Coordonnées */}
          <div className={`space-y-4 rounded-lg border ${panel} p-5 shadow-sm`}>
            <h2 className="text-lg font-semibold">{t("contact_info", "Contact Details")}</h2>
            <p className="text-xs opacity-70">
              Ces coordonnées s'affichent automatiquement dans le bloc de contact du pied de page et sur la page Contact.
            </p>

            <div className="space-y-3">
              <div>
                <label className={labelClass}>
                  <MapPin className="mr-1 inline-block h-3.5 w-3.5" />
                  {t("location", "Location / Address")}
                </label>
                <input
                  type="text"
                  value={config.location}
                  onChange={(e) => setConfig((prev) => ({ ...prev, location: e.target.value }))}
                  className={inputClass}
                  placeholder="Laisser vide pour masquer (ex: Tunis, Tunisie)"
                />
              </div>

              <div>
                <label className={labelClass}>
                  <Mail className="mr-1 inline-block h-3.5 w-3.5" />
                  {t("email", "Public Email")}
                </label>
                <input
                  type="email"
                  value={config.email}
                  onChange={(e) => setConfig((prev) => ({ ...prev, email: e.target.value }))}
                  className={inputClass}
                  placeholder="contact@rootstunisia.com"
                />
              </div>

              <div>
                <label className={labelClass}>
                  <Phone className="mr-1 inline-block h-3.5 w-3.5" />
                  {t("phone", "Telephone")}
                </label>
                <input
                  type="tel"
                  value={config.phone}
                  onChange={(e) => setConfig((prev) => ({ ...prev, phone: e.target.value }))}
                  className={inputClass}
                  placeholder="Laisser vide pour masquer (ex: +216 ...)"
                />
              </div>

              <div>
                <label className={labelClass}>
                  <LinkIcon className="mr-1 inline-block h-3.5 w-3.5" />
                  {t("whatsapp", "WhatsApp Direct")}
                </label>
                <input
                  type="tel"
                  value={config.whatsapp}
                  onChange={(e) => setConfig((prev) => ({ ...prev, whatsapp: e.target.value }))}
                  className={inputClass}
                  placeholder="Laisser vide pour masquer (ex: +216 ...)"
                />
              </div>
            </div>
          </div>

          {/* Section Réseaux Sociaux */}
          <div className={`space-y-4 rounded-lg border ${panel} p-5 shadow-sm`}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{t("social_networks", "Social Networks")}</h2>
              <button
                type="button"
                onClick={addLink}
                className="inline-flex items-center gap-1.5 rounded-md border border-[var(--gold)]/40 px-3 py-1.5 text-xs font-semibold text-[var(--gold)] hover:bg-[var(--gold)]/10 cursor-pointer transition"
              >
                <Plus className="h-3.5 w-3.5" />
                {t("add_network", "Add Social Link")}
              </button>
            </div>

            <p className="text-xs opacity-70">
              Activez ou désactivez les icônes sociales à afficher dans le pied de page public.
            </p>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {config.socialLinks.map((link) => {
                const IconComponent = ICON_MAP[link.icon] || LinkIcon;
                return (
                  <div
                    key={link.id}
                    className={`flex items-center gap-2.5 rounded-lg border ${subtlePanel} p-2.5`}
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--gold)]/15 text-[var(--gold)]">
                      <IconComponent className="h-4 w-4" />
                    </div>

                    <select
                      value={link.icon}
                      onChange={(e) => updateLink(link.id, { icon: e.target.value as SocialIconType })}
                      className="min-h-9 rounded border border-white/10 bg-black/20 px-2 text-xs font-medium outline-none"
                    >
                      {ICON_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-[#0f1f33] text-white">
                          {opt.label}
                        </option>
                      ))}
                    </select>

                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => updateLink(link.id, { url: e.target.value })}
                      placeholder="https://..."
                      className="min-h-9 flex-1 rounded border border-white/10 bg-black/20 px-2.5 text-xs outline-none"
                    />

                    <label className="flex items-center gap-1.5 cursor-pointer text-xs">
                      <input
                        type="checkbox"
                        checked={link.enabled}
                        onChange={(e) => updateLink(link.id, { enabled: e.target.checked })}
                        className="rounded accent-[var(--gold)]"
                      />
                      <span className="hidden sm:inline text-[11px] opacity-80">Actif</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => removeLink(link.id)}
                      className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded cursor-pointer transition"
                      title="Supprimer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Aperçu direct en direct */}
        <div className={`rounded-lg border ${panel} p-5 shadow-sm space-y-3`}>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--gold)]">
            Aperçu Direct du Pied de Page Public
          </h3>
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-black/20 p-4 border border-white/5">
            <div className="text-xs space-y-1">
              <div className="font-medium text-white">{config.location}</div>
              <div className="opacity-70">{config.email} • {config.phone}</div>
            </div>
            <div className="flex items-center gap-2">
              {enabledSocialLinks.map((link) => {
                const IconComp = ICON_MAP[link.icon] || LinkIcon;
                return (
                  <span
                    key={link.id}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--gold)]/20 text-[var(--gold)]"
                  >
                    <IconComp className="h-4 w-4" />
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
