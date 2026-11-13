import React, { useState } from "react";
import {
  Mail,
  Phone,
  MessageCircle,
  Clock,
  Sparkles,
  Compass,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  Upload,
  Eye,
  Columns,
  Send,
  Check,
  Globe,
} from "lucide-react";
import {
  useHelpCenterCmsConfig,
  saveHelpCenterCmsConfig,
  getDefaultHelpCenterConfig,
  CMS_LOCALES,
} from "../../utils/helpCenterCmsConfig";
import { api } from "../../api/client";

export default function AdminContactContent() {
  const [selectedLocale, setSelectedLocale] = useState<string>("fr");
  const { config, setConfig } = useHelpCenterCmsConfig(selectedLocale);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"split" | "editor" | "preview">("split");
  const [newTopicLabel, setNewTopicLabel] = useState("");
  const [uploadingHeroImg, setUploadingHeroImg] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleSave = async (
    nextConfig = config,
    msg = `Page Contact Direct (${selectedLocale.toUpperCase()}) enregistrée avec succès.`
  ) => {
    setSaving(true);
    try {
      await saveHelpCenterCmsConfig(nextConfig, selectedLocale);
      setConfig(nextConfig);
      showToast(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (
      !window.confirm(
        `Réinitialiser la page Contact Direct (${selectedLocale.toUpperCase()}) aux valeurs par défaut ?`
      )
    )
      return;
    const def = getDefaultHelpCenterConfig(selectedLocale);
    const next = {
      ...config,
      hero: def.hero,
      contact: def.contact,
    };
    await handleSave(
      next,
      `Valeurs par défaut du Contact Direct (${selectedLocale.toUpperCase()}) restaurées.`
    );
  };

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingHeroImg(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const url = res.data?.url || res.data?.data?.url;
      if (url) {
        const next = { ...config, hero: { ...config.hero, image: url } };
        await handleSave(next, "Image de bannière mise à jour.");
      }
    } catch {
      const reader = new FileReader();
      reader.onload = async () => {
        if (typeof reader.result === "string") {
          const next = { ...config, hero: { ...config.hero, image: reader.result } };
          await handleSave(next, "Image de bannière mise à jour.");
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingHeroImg(false);
      e.target.value = "";
    }
  };

  const handleAddTopic = () => {
    const label = newTopicLabel.trim();
    if (!label) return;
    const key = `topic_${Date.now()}`;
    setConfig({
      ...config,
      contact: {
        ...config.contact,
        form: {
          ...config.contact.form,
          topics: [...config.contact.form.topics, { key, label }],
        },
      },
    });
    setNewTopicLabel("");
  };

  const handleUpdateTopic = (idx: number, label: string) => {
    const topics = config.contact.form.topics.map((t, i) => (i === idx ? { ...t, label } : t));
    setConfig({
      ...config,
      contact: {
        ...config.contact,
        form: { ...config.contact.form, topics },
      },
    });
  };

  const handleDeleteTopic = (idx: number) => {
    const topics = config.contact.form.topics.filter((_, i) => i !== idx);
    setConfig({
      ...config,
      contact: {
        ...config.contact,
        form: { ...config.contact.form, topics },
      },
    });
  };

  return (
    <div className="space-y-6 pb-14 text-[var(--foreground)]">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border border-[var(--gold)] bg-[var(--card)] px-4 py-3 text-xs font-bold text-[var(--gold)] shadow-2xl">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="surface-card frame-gold rounded-2xl p-6 bg-[var(--card)]/95 border border-[var(--gold)]/30 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[var(--gold)]/15 border border-[var(--gold)]/40 flex items-center justify-center text-[var(--gold)] shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--gold)]">
                  Contenu Public • Contact Direct
                </span>
                <a
                  href="/helpcenter#contact"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] font-semibold text-[var(--gold)]/80 hover:text-[var(--gold)] underline"
                >
                  <span>Voir /helpcenter#contact</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
              <h1 className="font-cinzel text-2xl font-bold text-[var(--foreground)] mt-0.5">
                Gestion de la Page Contact Direct
              </h1>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">
                Modifiez simplement les coordonnées directes, le formulaire d'assistance et visualisez chaque changement en direct à droite.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center rounded-xl border border-[var(--gold)]/30 bg-[var(--background)]/60 p-1">
              <button
                type="button"
                onClick={() => setViewMode("split")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewMode === "split"
                    ? "bg-[var(--gold)] text-[#1f160f]"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                }`}
              >
                <Columns className="w-3.5 h-3.5" />
                <span>Éditeur + Aperçu Direct</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("preview")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewMode === "preview"
                    ? "bg-[var(--gold)] text-[#1f160f]"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Aperçu Plein Écran</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[var(--gold)]/30 bg-[var(--background)]/60 text-xs font-semibold text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--gold)] transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Par défaut</span>
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave(config)}
              className="btn-base btn-gold inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Enregistrement..." : `Enregistrer (${selectedLocale.toUpperCase()})`}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Language Selector Pills (Just like Legal Content CMS) */}
      <div className="flex items-center gap-2 flex-wrap surface-card rounded-2xl px-5 py-3.5 bg-[var(--card)]/90 border border-[var(--gold)]/25 shadow-sm">
        <span className="text-xs font-bold text-[var(--muted-foreground)] flex items-center gap-1.5 me-2">
          <Globe className="w-4 h-4 text-[var(--gold)]" />
          <span>Langue d'édition :</span>
        </span>
        <div className="flex items-center gap-1.5 flex-wrap">
          {CMS_LOCALES.map((loc) => (
            <button
              key={loc.code}
              type="button"
              onClick={() => setSelectedLocale(loc.code)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                selectedLocale === loc.code
                  ? "bg-[var(--gold)]/20 text-[var(--gold)] border-[var(--gold)] font-bold shadow-sm"
                  : "bg-[var(--background)] text-[var(--muted-foreground)] border-[var(--border)] hover:text-[var(--foreground)] hover:border-[var(--gold)]/40"
              }`}
            >
              <span>{loc.label}</span>
              <span className="ms-1.5 font-mono text-[10px] opacity-75">[{loc.tag}]</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Split Grid: Left = Simple Editor, Right = Live Preview */}
      <div
        dir={selectedLocale === "ar" ? "rtl" : "ltr"}
        className={`grid gap-6 items-start ${
          viewMode === "split" ? "grid-cols-1 xl:grid-cols-12" : "grid-cols-1"
        }`}
      >
        {/* LEFT COLUMN: SIMPLE EDITOR */}
        {viewMode !== "preview" && (
          <div className={viewMode === "split" ? "xl:col-span-6 space-y-5" : "space-y-5"}>
            {/* 1. Bannière Hero */}
            <div className="surface-card frame-gold rounded-2xl p-5 bg-[var(--card)]/95 border border-[var(--gold)]/30 space-y-3.5">
              <div className="flex items-center gap-2 border-b border-[var(--gold)]/15 pb-2.5">
                <Sparkles className="w-4 h-4 text-[var(--gold)]" />
                <h2 className="font-cinzel text-sm font-bold text-[var(--foreground)]">
                  1. Bannière d'En-tête (Hero)
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-[var(--gold)] block mb-1">
                    Surtitre (Eyebrow)
                  </label>
                  <input
                    type="text"
                    value={config.hero.eyebrow}
                    onChange={(e) =>
                      setConfig({ ...config, hero: { ...config.hero, eyebrow: e.target.value } })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[var(--gold)]/30 bg-[var(--background)] text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-[var(--gold)] block mb-1">
                    Titre Principal
                  </label>
                  <input
                    type="text"
                    value={config.hero.title}
                    onChange={(e) =>
                      setConfig({ ...config, hero: { ...config.hero, title: e.target.value } })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[var(--gold)]/30 bg-[var(--background)] text-xs font-bold"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-bold uppercase text-[var(--gold)] block mb-1">
                    Sous-titre d'Introduction
                  </label>
                  <textarea
                    rows={2}
                    value={config.hero.subtitle}
                    onChange={(e) =>
                      setConfig({ ...config, hero: { ...config.hero, subtitle: e.target.value } })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[var(--gold)]/30 bg-[var(--background)] text-xs"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-bold uppercase text-[var(--gold)] block mb-1">
                    Image de Bannière (URL ou Fichier)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={config.hero.image}
                      onChange={(e) =>
                        setConfig({ ...config, hero: { ...config.hero, image: e.target.value } })
                      }
                      placeholder="Image par défaut (Sidi Bou Saïd)"
                      className="flex-1 px-3 py-2 rounded-xl border border-[var(--gold)]/30 bg-[var(--background)] text-xs"
                    />
                    <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[var(--gold)]/40 bg-[var(--gold)]/10 text-xs font-bold text-[var(--gold)] hover:bg-[var(--gold)]/20 cursor-pointer shrink-0">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingHeroImg ? "..." : "Choisir"}</span>
                      <input type="file" accept="image/*" onChange={handleHeroImageUpload} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Les 4 Cartes de Contact Direct */}
            <div className="surface-card frame-gold rounded-2xl p-5 bg-[var(--card)]/95 border border-[var(--gold)]/30 space-y-3.5">
              <div className="flex items-center gap-2 border-b border-[var(--gold)]/15 pb-2.5">
                <Phone className="w-4 h-4 text-[var(--gold)]" />
                <h2 className="font-cinzel text-sm font-bold text-[var(--foreground)]">
                  2. Les 4 Cartes de Coordonnées Directes
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Téléphone */}
                <div className="p-3 rounded-xl border border-[var(--gold)]/20 bg-[var(--background)]/40 space-y-2">
                  <span className="text-[10px] font-bold uppercase text-[var(--gold)]">Carte 1 • Téléphone</span>
                  <input
                    type="text"
                    value={config.contact.cards.phoneLabel}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        contact: {
                          ...config.contact,
                          cards: { ...config.contact.cards, phoneLabel: e.target.value },
                        },
                      })
                    }
                    placeholder="Titre (Téléphone)"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[var(--gold)]/30 bg-[var(--background)] text-xs"
                  />
                  <input
                    type="text"
                    value={config.contact.cards.phoneValue}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        contact: {
                          ...config.contact,
                          cards: { ...config.contact.cards, phoneValue: e.target.value },
                        },
                      })
                    }
                    placeholder="Numéro (+216...)"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[var(--gold)]/30 bg-[var(--background)] text-xs font-bold"
                  />
                  <input
                    type="text"
                    value={config.contact.cards.phoneCta}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        contact: {
                          ...config.contact,
                          cards: { ...config.contact.cards, phoneCta: e.target.value },
                        },
                      })
                    }
                    placeholder="Texte action (Appel direct)"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[var(--gold)]/30 bg-[var(--background)] text-xs"
                  />
                </div>

                {/* WhatsApp */}
                <div className="p-3 rounded-xl border border-emerald-500/25 bg-[var(--background)]/40 space-y-2">
                  <span className="text-[10px] font-bold uppercase text-emerald-400">Carte 2 • WhatsApp</span>
                  <input
                    type="text"
                    value={config.contact.cards.whatsappLabel}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        contact: {
                          ...config.contact,
                          cards: { ...config.contact.cards, whatsappLabel: e.target.value },
                        },
                      })
                    }
                    placeholder="Titre (WhatsApp)"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[var(--gold)]/30 bg-[var(--background)] text-xs"
                  />
                  <input
                    type="text"
                    value={config.contact.cards.whatsappValue}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        contact: {
                          ...config.contact,
                          cards: { ...config.contact.cards, whatsappValue: e.target.value },
                        },
                      })
                    }
                    placeholder="Numéro WhatsApp"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[var(--gold)]/30 bg-[var(--background)] text-xs font-bold"
                  />
                  <input
                    type="text"
                    value={config.contact.cards.whatsappCta}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        contact: {
                          ...config.contact,
                          cards: { ...config.contact.cards, whatsappCta: e.target.value },
                        },
                      })
                    }
                    placeholder="Texte action (Chat en direct)"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[var(--gold)]/30 bg-[var(--background)] text-xs"
                  />
                </div>

                {/* Email */}
                <div className="p-3 rounded-xl border border-[var(--gold)]/20 bg-[var(--background)]/40 space-y-2">
                  <span className="text-[10px] font-bold uppercase text-[var(--gold)]">Carte 3 • Email Officiel</span>
                  <input
                    type="text"
                    value={config.contact.cards.emailLabel}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        contact: {
                          ...config.contact,
                          cards: { ...config.contact.cards, emailLabel: e.target.value },
                        },
                      })
                    }
                    placeholder="Titre (Email Officiel)"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[var(--gold)]/30 bg-[var(--background)] text-xs"
                  />
                  <input
                    type="text"
                    value={config.contact.cards.emailValue}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        contact: {
                          ...config.contact,
                          cards: { ...config.contact.cards, emailValue: e.target.value },
                        },
                      })
                    }
                    placeholder="contact@rootstunisia.com"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[var(--gold)]/30 bg-[var(--background)] text-xs font-bold"
                  />
                  <input
                    type="text"
                    value={config.contact.cards.emailCta}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        contact: {
                          ...config.contact,
                          cards: { ...config.contact.cards, emailCta: e.target.value },
                        },
                      })
                    }
                    placeholder="Texte action (Envoyer un email)"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[var(--gold)]/30 bg-[var(--background)] text-xs"
                  />
                </div>

                {/* Horaires */}
                <div className="p-3 rounded-xl border border-[var(--gold)]/20 bg-[var(--background)]/40 space-y-2">
                  <span className="text-[10px] font-bold uppercase text-[var(--gold)]">Carte 4 • Horaires</span>
                  <input
                    type="text"
                    value={config.contact.cards.hoursLabel}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        contact: {
                          ...config.contact,
                          cards: { ...config.contact.cards, hoursLabel: e.target.value },
                        },
                      })
                    }
                    placeholder="Titre (Horaires)"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[var(--gold)]/30 bg-[var(--background)] text-xs"
                  />
                  <input
                    type="text"
                    value={config.contact.cards.hoursValue}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        contact: {
                          ...config.contact,
                          cards: { ...config.contact.cards, hoursValue: e.target.value },
                        },
                      })
                    }
                    placeholder="09:00 – 17:00 (GMT+1)"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[var(--gold)]/30 bg-[var(--background)] text-xs font-bold"
                  />
                  <input
                    type="text"
                    value={config.contact.cards.hoursCta}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        contact: {
                          ...config.contact,
                          cards: { ...config.contact.cards, hoursCta: e.target.value },
                        },
                      })
                    }
                    placeholder="Badge (Réponse sous 24h)"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[var(--gold)]/30 bg-[var(--background)] text-xs"
                  />
                </div>
              </div>
            </div>

            {/* 3. Formulaire d'Assistance & Objets */}
            <div className="surface-card frame-gold rounded-2xl p-5 bg-[var(--card)]/95 border border-[var(--gold)]/30 space-y-3.5">
              <div className="flex items-center gap-2 border-b border-[var(--gold)]/15 pb-2.5">
                <Mail className="w-4 h-4 text-[var(--gold)]" />
                <h2 className="font-cinzel text-sm font-bold text-[var(--foreground)]">
                  3. Formulaire d'Assistance & Objets de Demande
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-[var(--gold)] block mb-1">
                    Surtitre Formulaire
                  </label>
                  <input
                    type="text"
                    value={config.contact.form.eyebrow}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        contact: {
                          ...config.contact,
                          form: { ...config.contact.form, eyebrow: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-xl border border-[var(--gold)]/30 bg-[var(--background)] text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-[var(--gold)] block mb-1">
                    Titre Formulaire
                  </label>
                  <input
                    type="text"
                    value={config.contact.form.title}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        contact: {
                          ...config.contact,
                          form: { ...config.contact.form, title: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-xl border border-[var(--gold)]/30 bg-[var(--background)] text-xs font-bold"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-bold uppercase text-[var(--gold)] block mb-1">
                    Sous-titre Formulaire
                  </label>
                  <input
                    type="text"
                    value={config.contact.form.subtitle}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        contact: {
                          ...config.contact,
                          form: { ...config.contact.form, subtitle: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-xl border border-[var(--gold)]/30 bg-[var(--background)] text-xs"
                  />
                </div>
              </div>

              {/* Topics */}
              <div className="pt-2 border-t border-[var(--gold)]/15 space-y-2">
                <label className="text-[10px] font-bold uppercase text-[var(--gold)] block">
                  Objets de la demande (Boutons de choix)
                </label>
                <div className="space-y-1.5">
                  {config.contact.form.topics.map((tp, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={tp.label}
                        onChange={(e) => handleUpdateTopic(idx, e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-xl border border-[var(--gold)]/30 bg-[var(--background)] text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteTopic(idx)}
                        className="p-1.5 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/15 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={newTopicLabel}
                    onChange={(e) => setNewTopicLabel(e.target.value)}
                    placeholder="Nouvel objet de demande..."
                    className="flex-1 px-3 py-1.5 rounded-xl border border-[var(--gold)]/30 bg-[var(--background)] text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddTopic}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[var(--gold)]/20 border border-[var(--gold)]/50 text-xs font-bold text-[var(--gold)] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ajouter</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[var(--gold)]/15">
                <div>
                  <label className="text-[10px] font-bold uppercase text-[var(--gold)] block mb-1">
                    Texte du Bouton Envoyer
                  </label>
                  <input
                    type="text"
                    value={config.contact.form.submitButtonLabel}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        contact: {
                          ...config.contact,
                          form: { ...config.contact.form, submitButtonLabel: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-xl border border-[var(--gold)]/30 bg-[var(--background)] text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-[var(--gold)] block mb-1">
                    Titre Encart Assistance (Droite)
                  </label>
                  <input
                    type="text"
                    value={config.contact.sidebar.deskTitle}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        contact: {
                          ...config.contact,
                          sidebar: { ...config.contact.sidebar, deskTitle: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-xl border border-[var(--gold)]/30 bg-[var(--background)] text-xs font-bold"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] font-bold uppercase text-[var(--gold)] block mb-1">
                    Description Encart Bureau d'Assistance
                  </label>
                  <textarea
                    rows={2}
                    value={config.contact.sidebar.deskDescription}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        contact: {
                          ...config.contact,
                          sidebar: { ...config.contact.sidebar, deskDescription: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-xl border border-[var(--gold)]/30 bg-[var(--background)] text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RIGHT COLUMN: LIVE PREVIEW */}
        {viewMode !== "editor" && (
          <div className={viewMode === "split" ? "xl:col-span-6 xl:sticky xl:top-6" : ""}>
            <div className="surface-card frame-gold rounded-2xl p-5 bg-[var(--card)]/95 border border-[var(--gold)]/40 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-[var(--gold)]/20 pb-3">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[var(--gold)]" />
                  <span className="font-cinzel text-sm font-bold text-[var(--foreground)]">
                    Aperçu en Direct — Page Contact Direct
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Temps Réel
                </span>
              </div>

              {/* Live Rendered Preview Box */}
              <div className="rounded-2xl border border-[var(--gold)]/25 bg-[var(--background)] p-5 space-y-5">
                {/* Hero Preview */}
                <div className="rounded-2xl border border-[var(--gold)]/30 bg-gradient-to-b from-[var(--card)] to-[var(--background)] p-5 text-center space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--gold)]">
                    {config.hero.eyebrow}
                  </span>
                  <h3 className="font-cinzel text-xl font-bold text-[var(--foreground)]">
                    {config.hero.title}
                  </h3>
                  <p className="text-xs text-[var(--muted-foreground)] max-w-lg mx-auto">
                    {config.hero.subtitle}
                  </p>
                </div>

                {/* 4 Direct Cards Preview */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-3 rounded-xl border border-[var(--gold)]/35 bg-[var(--card)] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-[var(--gold)] mb-1">
                        <Phone className="w-3.5 h-3.5" />
                        <span className="text-[9px] uppercase font-bold text-[var(--muted-foreground)]">
                          {config.contact.cards.phoneLabel}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-[var(--foreground)] truncate">
                        {config.contact.cards.phoneValue}
                      </p>
                    </div>
                    <span className="text-[9px] font-bold text-[var(--gold)] mt-2 pt-1 border-t border-[var(--gold)]/15">
                      {config.contact.cards.phoneCta} →
                    </span>
                  </div>

                  <div className="p-3 rounded-xl border border-emerald-500/35 bg-[var(--card)] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span className="text-[9px] uppercase font-bold text-[var(--muted-foreground)]">
                          {config.contact.cards.whatsappLabel}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-[var(--foreground)] truncate">
                        {config.contact.cards.whatsappValue}
                      </p>
                    </div>
                    <span className="text-[9px] font-bold text-emerald-400 mt-2 pt-1 border-t border-emerald-500/15">
                      {config.contact.cards.whatsappCta} →
                    </span>
                  </div>

                  <div className="p-3 rounded-xl border border-[var(--gold)]/35 bg-[var(--card)] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-[var(--gold)] mb-1">
                        <Mail className="w-3.5 h-3.5" />
                        <span className="text-[9px] uppercase font-bold text-[var(--muted-foreground)]">
                          {config.contact.cards.emailLabel}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-[var(--foreground)] truncate">
                        {config.contact.cards.emailValue}
                      </p>
                    </div>
                    <span className="text-[9px] font-bold text-[var(--gold)] mt-2 pt-1 border-t border-[var(--gold)]/15">
                      {config.contact.cards.emailCta} →
                    </span>
                  </div>

                  <div className="p-3 rounded-xl border border-[var(--gold)]/35 bg-[var(--card)] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-[var(--gold)] mb-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-[9px] uppercase font-bold text-[var(--muted-foreground)]">
                          {config.contact.cards.hoursLabel}
                        </span>
                      </div>
                      <p className="text-[11px] font-bold text-[var(--foreground)] truncate">
                        {config.contact.cards.hoursValue}
                      </p>
                    </div>
                    <span className="text-[9px] font-bold text-[var(--gold)] mt-2 pt-1 border-t border-[var(--gold)]/15 flex items-center justify-between">
                      <span>{config.contact.cards.hoursCta}</span>
                      <Check className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </div>

                {/* Form & Desk Preview */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                  <div className="md:col-span-8 p-4 rounded-2xl border border-[var(--gold)]/30 bg-[var(--card)] space-y-3">
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--gold)]">
                        {config.contact.form.eyebrow}
                      </span>
                      <h4 className="font-cinzel text-base font-bold text-[var(--foreground)]">
                        {config.contact.form.title}
                      </h4>
                      <p className="text-[11px] text-[var(--muted-foreground)]">
                        {config.contact.form.subtitle}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {config.contact.form.topics.map((tp, idx) => (
                        <span
                          key={idx}
                          className={`px-2.5 py-1 rounded-lg text-[10px] border ${
                            idx === 0
                              ? "border-[var(--gold)] bg-[var(--gold)]/20 text-[var(--foreground)] font-bold"
                              : "border-[var(--gold)]/25 text-[var(--muted-foreground)]"
                          }`}
                        >
                          {tp.label}
                        </span>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="px-3 py-2 rounded-lg border border-[var(--gold)]/20 bg-[var(--background)] text-[10px] text-[var(--muted-foreground)]">
                        {config.contact.form.namePlaceholder}
                      </div>
                      <div className="px-3 py-2 rounded-lg border border-[var(--gold)]/20 bg-[var(--background)] text-[10px] text-[var(--muted-foreground)]">
                        {config.contact.form.emailPlaceholder}
                      </div>
                    </div>

                    <div className="px-3 py-3 rounded-lg border border-[var(--gold)]/20 bg-[var(--background)] text-[10px] text-[var(--muted-foreground)]">
                      {config.contact.form.messagePlaceholder}
                    </div>

                    <span className="btn-base btn-gold inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[11px] font-bold">
                      <Send className="w-3 h-3" />
                      <span>{config.contact.form.submitButtonLabel}</span>
                    </span>
                  </div>

                  <div className="md:col-span-4 p-4 rounded-2xl border border-[var(--gold)]/30 bg-[var(--card)] space-y-2">
                    <div className="flex items-center gap-2">
                      <Compass className="w-4 h-4 text-[var(--gold)]" />
                      <div>
                        <h5 className="font-cinzel text-xs font-bold text-[var(--foreground)]">
                          {config.contact.sidebar.deskTitle}
                        </h5>
                        <p className="text-[10px] font-bold text-[var(--gold)]">
                          {config.contact.sidebar.deskSubtitle}
                        </p>
                      </div>
                    </div>
                    <p className="text-[11px] text-[var(--muted-foreground)] leading-relaxed">
                      {config.contact.sidebar.deskDescription}
                    </p>
                    <p className="text-[10px] font-bold text-[var(--gold)] pt-1">
                      {config.contact.sidebar.deskLinkLabel}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
