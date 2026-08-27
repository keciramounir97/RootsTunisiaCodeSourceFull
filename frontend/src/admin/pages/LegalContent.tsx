import { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle,
  FileText,
  Lock,
  Plus,
  Save,
  Scale,
  Shield,
  Trash2,
  Loader2,
  FileCode,
} from "lucide-react";
import { api } from "../../api/client";
import { getApiErrorMessage } from "../../api/helpers";
import { useTranslation } from "../../context/TranslationContext";
import { notifyAdminSaved } from "../utils/notifications";

type LegalSection = { heading: string; body: string };

type LegalDocument = {
  slug: string;
  locale: string;
  title: string;
  intro: string;
  sections: LegalSection[];
  translated?: boolean;
};

const SLUGS: { slug: string; labelKey: string; label: string; Icon: typeof FileText }[] = [
  { slug: "terms", labelKey: "terms_of_service", label: "Conditions d'Utilisation", Icon: Scale },
  { slug: "privacy", labelKey: "privacy_policy", label: "Politique de Confidentialité", Icon: Lock },
  { slug: "cookies", labelKey: "cookie_policy", label: "Gestion des Cookies", Icon: Shield },
];

const LOCALES: { value: string; label: string }[] = [
  { value: "fr", label: "Français" },
  { value: "en", label: "English" },
  { value: "ar", label: "العربية" },
  { value: "it", label: "Italiano" },
  { value: "es", label: "Español" },
];

export default function LegalContent() {
  const { t } = useTranslation();

  const [slug, setSlug] = useState("terms");
  const [locale, setLocale] = useState("fr");
  const [doc, setDoc] = useState<LegalDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const loadDocument = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get(`/admin/legal/${slug}`, { params: { locale } });
      const docData = data?.data || data;
      setDoc(docData);
    } catch (err) {
      setError(getApiErrorMessage(err, t("legal_content_load_failed", "Échec du chargement du document légal.")));
      setDoc(null);
    } finally {
      setLoading(false);
    }
  }, [slug, locale, t]);

  useEffect(() => {
    void loadDocument();
  }, [loadDocument]);

  const handleSave = async () => {
    if (!doc) return;
    setSaving(true);
    setError("");
    try {
      const { data } = await api.put(`/admin/legal/${slug}`, {
        locale,
        title: doc.title,
        intro: doc.intro,
        sections: doc.sections,
      });
      setDoc(data?.data || data);
      setSaved(true);
      notifyAdminSaved(t("settings_saved", "Modifications enregistrées."));
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(getApiErrorMessage(err, t("legal_content_save_failed", "Échec de la sauvegarde")));
    } finally {
      setSaving(false);
    }
  };

  const updateSection = (index: number, patch: Partial<LegalSection>) => {
    setDoc((prev) =>
      prev
        ? {
            ...prev,
            sections: prev.sections.map((section, i) => (i === index ? { ...section, ...patch } : section)),
          }
        : prev,
    );
  };

  const addSection = () => {
    setDoc((prev) =>
      prev ? { ...prev, sections: [...prev.sections, { heading: "", body: "" }] } : prev,
    );
  };

  const removeSection = (index: number) => {
    setDoc((prev) =>
      prev ? { ...prev, sections: prev.sections.filter((_, i) => i !== index) } : prev,
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* HEADER SECTION */}
      <div className="neu-card p-5 rounded-2xl border border-[#0d9488]/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0d9488] block mb-1">
            {t("admin", "Administration")}
          </span>
          <h1 className="font-cinzel text-2xl font-bold text-[#0c4a6e] dark:text-[#0d9488]">
            {t("legal_content", "Gestion des Textes Légaux")}
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 max-w-2xl mt-1">
            {t(
              "legal_content_desc",
              "Éditez les conditions d'utilisation, politiques de confidentialité et règles de cookies affichées sur le site public.",
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || loading || !doc}
          className="interactive-btn btn-neu btn-neu--primary px-6 py-2.5 text-xs flex items-center gap-2 disabled:opacity-50"
        >
          {saved ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saved
            ? t("settings_saved", "Enregistré")
            : saving
              ? t("saving", "Enregistrement...")
              : t("save_settings", "Enregistrer")}
        </button>
      </div>

      {/* DISCLAIMER BANNER */}
      <div className="neu-inset p-4 rounded-xl flex items-start gap-3 text-xs text-stone-600 dark:text-stone-300">
        <AlertTriangle className="w-5 h-5 shrink-0 text-amber-500 mt-0.5" />
        <p>
          {t(
            "legal_content_disclaimer",
            "Ces textes servent de modèles de référence (conformes RGPD/CCPA). Assurez-vous d'adapter ces informations selon vos exigences juridiques spécifiques.",
          )}
        </p>
      </div>

      {/* SLUG & LOCALE SELECTOR */}
      <div className="neu-card p-4 rounded-xl border border-[#0d9488]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {SLUGS.map(({ slug: s, label, Icon }) => (
            <button
              key={s}
              type="button"
              onClick={() => setSlug(s)}
              className={`interactive-btn btn-neu px-4 py-2 text-xs flex items-center gap-2 ${
                slug === s ? "btn-neu--primary font-bold" : ""
              }`}
            >
              <Icon className="w-4 h-4" />
              {t(SLUGS.find((item) => item.slug === s)!.labelKey, label)}
            </button>
          ))}
        </div>

        <select
          value={locale}
          onChange={(event) => setLocale(event.target.value)}
          className="neu-field px-4 py-2 text-xs rounded-lg cursor-pointer"
        >
          {LOCALES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs font-semibold text-red-500">
          {error}
        </div>
      ) : null}

      {doc && doc.translated === false ? (
        <div className="neu-inset p-3.5 rounded-xl text-xs italic text-stone-500 dark:text-stone-400">
          {t(
            "legal_content_not_translated",
            "Aucun contenu traduit trouvé pour cette langue — affichage de la version par défaut.",
          )}
        </div>
      ) : null}

      {loading ? (
        <div className="neu-card p-16 rounded-2xl text-center text-xs">
          <Loader2 className="w-8 h-8 mx-auto animate-spin text-[#0d9488] mb-2" />
          {t("loading", "Chargement en cours...")}
        </div>
      ) : doc ? (
        <div className="neu-card p-6 rounded-2xl border border-[#0d9488]/20 space-y-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-[#0c4a6e] dark:text-[#0d9488] block">
              {t("legal_content_title", "Titre du Document")}
            </label>
            <input
              type="text"
              value={doc.title}
              onChange={(event) => setDoc((prev) => (prev ? { ...prev, title: event.target.value } : prev))}
              className="neu-field w-full px-4 py-2.5 text-xs font-bold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-[#0c4a6e] dark:text-[#0d9488] block">
              {t("legal_content_intro", "Introduction / Préambule")}
            </label>
            <textarea
              value={doc.intro}
              onChange={(event) => setDoc((prev) => (prev ? { ...prev, intro: event.target.value } : prev))}
              rows={3}
              className="neu-field w-full px-4 py-2.5 text-xs"
            />
          </div>

          {/* SECTIONS */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-[#0d9488]/30 pb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#0c4a6e] dark:text-[#0d9488]">
                {t("legal_content_sections", "Articles & Sections Légales")}
              </span>
              <button
                type="button"
                onClick={addSection}
                className="interactive-btn btn-neu text-xs !px-3 !py-1 text-[#0d9488] font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                {t("add_section", "Ajouter une section")}
              </button>
            </div>

            <div className="space-y-4">
              {doc.sections.map((section, index) => (
                <div
                  key={index}
                  className="neu-inset p-4 rounded-xl border border-[#0d9488]/15 space-y-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-extrabold text-[#0d9488]">
                      Article #{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeSection(index)}
                      className="p-1 rounded text-red-500 hover:bg-red-500/10 transition"
                      title={t("delete", "Supprimer")}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={section.heading}
                    onChange={(event) => updateSection(index, { heading: event.target.value })}
                    placeholder={t("section_heading_placeholder", "Intitulé du chapitre (ex. Collecte des données)")}
                    className="neu-field w-full px-3.5 py-2 text-xs font-semibold"
                  />

                  <textarea
                    value={section.body}
                    onChange={(event) => updateSection(index, { body: event.target.value })}
                    placeholder={t("section_body_placeholder", "Texte détaillé du chapitre...")}
                    rows={4}
                    className="neu-field w-full px-3.5 py-2 text-xs"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
