import React, { useState } from "react";
import {
  Landmark,
  FolderArchive,
  CheckCircle2,
  Compass,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  ExternalLink,
  Eye,
  Columns,
  ChevronRight,
  Globe,
} from "lucide-react";
import {
  useHelpCenterCmsConfig,
  saveHelpCenterCmsConfig,
  getDefaultHelpCenterConfig,
  CMS_LOCALES,
} from "../../utils/helpCenterCmsConfig";

export default function AdminAboutContent() {
  const [selectedLocale, setSelectedLocale] = useState<string>("fr");
  const { config, setConfig } = useHelpCenterCmsConfig(selectedLocale);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"split" | "editor" | "preview">("split");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleSave = async (
    nextConfig = config,
    msg = `Page À Propos & Mission (${selectedLocale.toUpperCase()}) enregistrée avec succès.`
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
        `Réinitialiser la page À Propos & Mission (${selectedLocale.toUpperCase()}) aux valeurs par défaut ?`
      )
    )
      return;
    const def = getDefaultHelpCenterConfig(selectedLocale);
    const next = {
      ...config,
      about: def.about,
    };
    await handleSave(
      next,
      `Valeurs par défaut d'À Propos & Mission (${selectedLocale.toUpperCase()}) restaurées.`
    );
  };

  // Inline Corpus updates
  const updateCorpus = (idx: number, field: "meta" | "title" | "desc" | "depot", value: string) => {
    const corpuses = config.about.corpuses.map((c, i) => (i === idx ? { ...c, [field]: value } : c));
    setConfig({ ...config, about: { ...config.about, corpuses } });
  };

  const addCorpus = () => {
    const nextItem = {
      id: `corpus-${Date.now()}`,
      icon: "FolderArchive",
      meta: "XIXe – XXe siècle",
      title: "Nouveau Pilier d'Archives",
      desc: "Description du fonds documentaire...",
      depot: "Archives Nationales de Tunisie",
      published: true,
    };
    setConfig({
      ...config,
      about: { ...config.about, corpuses: [...config.about.corpuses, nextItem] },
    });
  };

  const deleteCorpus = (idx: number) => {
    setConfig({
      ...config,
      about: {
        ...config.about,
        corpuses: config.about.corpuses.filter((_, i) => i !== idx),
      },
    });
  };

  // Inline WhyUs updates
  const updateWhyUs = (idx: number, field: "title" | "desc", value: string) => {
    const whyUs = config.about.whyUs.map((w, i) => (i === idx ? { ...w, [field]: value } : w));
    setConfig({ ...config, about: { ...config.about, whyUs } });
  };

  const addWhyUs = () => {
    const nextItem = {
      id: `why-${Date.now()}`,
      icon: "CheckCircle2",
      title: "Nouvel Engagement",
      desc: "Détail de l'engagement scientifique ou déontologique...",
      published: true,
    };
    setConfig({
      ...config,
      about: { ...config.about, whyUs: [...config.about.whyUs, nextItem] },
    });
  };

  const deleteWhyUs = (idx: number) => {
    setConfig({
      ...config,
      about: {
        ...config.about,
        whyUs: config.about.whyUs.filter((_, i) => i !== idx),
      },
    });
  };

  // Inline Exploration updates
  const updateExploration = (idx: number, field: "title" | "desc" | "to" | "ctaLabel", value: string) => {
    const explorations = config.about.explorations.map((e, i) =>
      i === idx ? { ...e, [field]: value } : e
    );
    setConfig({ ...config, about: { ...config.about, explorations } });
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
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--gold)]">
                  Contenu Public • À Propos & Mission
                </span>
                <a
                  href="/helpcenter#about"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] font-semibold text-[var(--gold)]/80 hover:text-[var(--gold)] underline"
                >
                  <span>Voir /helpcenter#about</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
              <h1 className="font-cinzel text-2xl font-bold text-[var(--foreground)] mt-0.5">
                Gestion de la Page À Propos & Mission
              </h1>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">
                Modifiez le manifeste scientifique, les 4 piliers d'archives et vos engagements avec un aperçu en direct à droite.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
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
        {/* LEFT COLUMN: SIMPLE INLINE EDITOR */}
        {viewMode !== "preview" && (
          <div className={viewMode === "split" ? "xl:col-span-6 space-y-5" : "space-y-5"}>
            {/* 1. Manifeste & Mission */}
            <div className="surface-card frame-gold rounded-2xl p-5 bg-[var(--card)]/95 border border-[var(--gold)]/30 space-y-3.5">
              <div className="flex items-center gap-2 border-b border-[var(--gold)]/15 pb-2.5">
                <Landmark className="w-4 h-4 text-[var(--gold)]" />
                <h2 className="font-cinzel text-sm font-bold text-[var(--foreground)]">
                  1. Manifeste & Méthode Scientifique
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-[var(--gold)] block mb-1">
                    Surtitre
                  </label>
                  <input
                    type="text"
                    value={config.about.mission.eyebrow}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        about: {
                          ...config.about,
                          mission: { ...config.about.mission, eyebrow: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-xl border border-[var(--gold)]/30 bg-[var(--background)] text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-[var(--gold)] block mb-1">
                    Titre (Début)
                  </label>
                  <input
                    type="text"
                    value={config.about.mission.title}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        about: {
                          ...config.about,
                          mission: { ...config.about.mission, title: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-xl border border-[var(--gold)]/30 bg-[var(--background)] text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-[var(--gold)] block mb-1">
                    Mots en Or
                  </label>
                  <input
                    type="text"
                    value={config.about.mission.titleHighlight}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        about: {
                          ...config.about,
                          mission: { ...config.about.mission, titleHighlight: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-xl border border-[var(--gold)]/30 bg-[var(--background)] text-xs font-bold text-[var(--gold)]"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="text-[10px] font-bold uppercase text-[var(--gold)] block mb-1">
                    Description du Manifeste
                  </label>
                  <textarea
                    rows={3}
                    value={config.about.mission.description}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        about: {
                          ...config.about,
                          mission: { ...config.about.mission, description: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[var(--gold)]/30 bg-[var(--background)] text-xs leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* 2. Les Piliers / Corpus d'Archives */}
            <div className="surface-card frame-gold rounded-2xl p-5 bg-[var(--card)]/95 border border-[var(--gold)]/30 space-y-3.5">
              <div className="flex items-center justify-between border-b border-[var(--gold)]/15 pb-2.5">
                <div className="flex items-center gap-2">
                  <FolderArchive className="w-4 h-4 text-[var(--gold)]" />
                  <h2 className="font-cinzel text-sm font-bold text-[var(--foreground)]">
                    2. Piliers d'Archives ({config.about.corpuses.length})
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={addCorpus}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-[var(--gold)]/20 border border-[var(--gold)]/50 text-xs font-bold text-[var(--gold)] cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter un Pilier</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={config.about.corpusesHeader.eyebrow}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      about: {
                        ...config.about,
                        corpusesHeader: { ...config.about.corpusesHeader, eyebrow: e.target.value },
                      },
                    })
                  }
                  placeholder="Surtitre section"
                  className="px-3 py-1.5 rounded-xl border border-[var(--gold)]/30 bg-[var(--background)] text-xs"
                />
                <input
                  type="text"
                  value={config.about.corpusesHeader.title}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      about: {
                        ...config.about,
                        corpusesHeader: { ...config.about.corpusesHeader, title: e.target.value },
                      },
                    })
                  }
                  placeholder="Titre section"
                  className="px-3 py-1.5 rounded-xl border border-[var(--gold)]/30 bg-[var(--background)] text-xs font-bold"
                />
              </div>

              <div className="space-y-3">
                {config.about.corpuses.map((c, idx) => (
                  <div
                    key={c.id}
                    className="p-3.5 rounded-xl border border-[var(--gold)]/25 bg-[var(--background)]/40 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={c.title}
                        onChange={(e) => updateCorpus(idx, "title", e.target.value)}
                        placeholder="Titre du pilier"
                        className="flex-1 px-2.5 py-1.5 rounded-lg border border-[var(--gold)]/30 bg-[var(--background)] text-xs font-bold"
                      />
                      <input
                        type="text"
                        value={c.meta}
                        onChange={(e) => updateCorpus(idx, "meta", e.target.value)}
                        placeholder="Époque (ex: 1886 – Aujourd'hui)"
                        className="w-40 px-2.5 py-1.5 rounded-lg border border-[var(--gold)]/30 bg-[var(--background)] text-[11px] text-[var(--gold)] font-semibold"
                      />
                      <button
                        type="button"
                        onClick={() => deleteCorpus(idx)}
                        className="p-1.5 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/15 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      value={c.desc}
                      onChange={(e) => updateCorpus(idx, "desc", e.target.value)}
                      placeholder="Description du corpus..."
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[var(--gold)]/30 bg-[var(--background)] text-xs"
                    />
                    <input
                      type="text"
                      value={c.depot}
                      onChange={(e) => updateCorpus(idx, "depot", e.target.value)}
                      placeholder="Lieu de dépôt (ex: Archives Nationales)"
                      className="w-full px-2.5 py-1 rounded-lg border border-[var(--gold)]/20 bg-[var(--background)] text-[11px] text-[var(--gold)]"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Nos Engagements (Why Us) */}
            <div className="surface-card frame-gold rounded-2xl p-5 bg-[var(--card)]/95 border border-[var(--gold)]/30 space-y-3.5">
              <div className="flex items-center justify-between border-b border-[var(--gold)]/15 pb-2.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--gold)]" />
                  <h2 className="font-cinzel text-sm font-bold text-[var(--foreground)]">
                    3. Nos Engagements ({config.about.whyUs.length})
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={addWhyUs}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-[var(--gold)]/20 border border-[var(--gold)]/50 text-xs font-bold text-[var(--gold)] cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {config.about.whyUs.map((w, idx) => (
                  <div
                    key={w.id}
                    className="p-3 rounded-xl border border-[var(--gold)]/25 bg-[var(--background)]/40 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={w.title}
                        onChange={(e) => updateWhyUs(idx, "title", e.target.value)}
                        className="flex-1 px-2.5 py-1 rounded-lg border border-[var(--gold)]/30 bg-[var(--background)] text-xs font-bold"
                      />
                      <button
                        type="button"
                        onClick={() => deleteWhyUs(idx)}
                        className="p-1 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/15 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      value={w.desc}
                      onChange={(e) => updateWhyUs(idx, "desc", e.target.value)}
                      className="w-full px-2.5 py-1 rounded-lg border border-[var(--gold)]/30 bg-[var(--background)] text-[11px]"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Cartes d'Exploration Rapide */}
            <div className="surface-card frame-gold rounded-2xl p-5 bg-[var(--card)]/95 border border-[var(--gold)]/30 space-y-3.5">
              <div className="flex items-center gap-2 border-b border-[var(--gold)]/15 pb-2.5">
                <Compass className="w-4 h-4 text-[var(--gold)]" />
                <h2 className="font-cinzel text-sm font-bold text-[var(--foreground)]">
                  4. Cartes d'Exploration Rapide ({config.about.explorations.length})
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {config.about.explorations.map((exp, idx) => (
                  <div
                    key={exp.id}
                    className="p-3 rounded-xl border border-[var(--gold)]/25 bg-[var(--background)]/40 space-y-2"
                  >
                    <input
                      type="text"
                      value={exp.title}
                      onChange={(e) => updateExploration(idx, "title", e.target.value)}
                      className="w-full px-2.5 py-1 rounded-lg border border-[var(--gold)]/30 bg-[var(--background)] text-xs font-bold"
                    />
                    <input
                      type="text"
                      value={exp.desc}
                      onChange={(e) => updateExploration(idx, "desc", e.target.value)}
                      className="w-full px-2.5 py-1 rounded-lg border border-[var(--gold)]/30 bg-[var(--background)] text-[11px]"
                    />
                    <div className="grid grid-cols-2 gap-1.5">
                      <input
                        type="text"
                        value={exp.to}
                        onChange={(e) => updateExploration(idx, "to", e.target.value)}
                        className="px-2 py-1 rounded-lg border border-[var(--gold)]/20 bg-[var(--background)] text-[10px] font-mono text-[var(--gold)]"
                      />
                      <input
                        type="text"
                        value={exp.ctaLabel}
                        onChange={(e) => updateExploration(idx, "ctaLabel", e.target.value)}
                        className="px-2 py-1 rounded-lg border border-[var(--gold)]/20 bg-[var(--background)] text-[10px]"
                      />
                    </div>
                  </div>
                ))}
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
                    Aperçu en Direct — Page À Propos & Mission
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Temps Réel
                </span>
              </div>

              <div className="rounded-2xl border border-[var(--gold)]/25 bg-[var(--background)] p-5 space-y-5">
                {/* Mission Banner Preview */}
                <div className="p-5 rounded-2xl border border-[var(--gold)]/35 bg-[var(--card)] text-center space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--gold)]">
                    {config.about.mission.eyebrow}
                  </span>
                  <h3 className="font-cinzel text-xl font-bold text-[var(--foreground)]">
                    {config.about.mission.title}{" "}
                    <span className="text-[var(--gold)]">{config.about.mission.titleHighlight}</span>
                  </h3>
                  <p className="text-xs text-[var(--muted-foreground)] leading-relaxed max-w-xl mx-auto">
                    {config.about.mission.description}
                  </p>
                </div>

                {/* Corpuses Preview */}
                <div className="space-y-2.5">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--gold)]">
                      {config.about.corpusesHeader.eyebrow}
                    </span>
                    <h4 className="font-cinzel text-sm font-bold text-[var(--foreground)]">
                      {config.about.corpusesHeader.title}
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {config.about.corpuses.map((c) => (
                      <div
                        key={c.id}
                        className="p-3.5 rounded-xl border border-[var(--gold)]/30 bg-[var(--card)] flex flex-col justify-between space-y-2"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <FolderArchive className="w-4 h-4 text-[var(--gold)]" />
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30">
                              {c.meta}
                            </span>
                          </div>
                          <h5 className="font-cinzel text-xs font-bold text-[var(--foreground)]">
                            {c.title}
                          </h5>
                          <p className="text-[11px] text-[var(--muted-foreground)] mt-1 leading-relaxed">
                            {c.desc}
                          </p>
                        </div>
                        <div className="pt-2 border-t border-[var(--gold)]/15 text-[10px] font-semibold text-[var(--gold)]">
                          {c.depot}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Why Us Preview */}
                <div className="p-4 rounded-2xl border border-[var(--gold)]/30 bg-[var(--gold)]/5 space-y-2.5">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--gold)]">
                      {config.about.whyUsHeader.eyebrow}
                    </span>
                    <h4 className="font-cinzel text-sm font-bold text-[var(--foreground)]">
                      {config.about.whyUsHeader.title}
                    </h4>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {config.about.whyUs.map((w) => (
                      <div key={w.id} className="p-3 rounded-xl border border-[var(--gold)]/20 bg-[var(--card)]">
                        <h6 className="font-cinzel text-xs font-bold text-[var(--foreground)]">{w.title}</h6>
                        <p className="text-[10px] text-[var(--muted-foreground)] mt-1 leading-relaxed">{w.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Explorations Preview */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {config.about.explorations.map((exp) => (
                    <div
                      key={exp.id}
                      className="p-3 rounded-xl border border-[var(--gold)]/25 bg-[var(--card)] flex flex-col justify-between"
                    >
                      <div>
                        <h6 className="font-cinzel text-[11px] font-bold text-[var(--foreground)]">{exp.title}</h6>
                        <p className="text-[10px] text-[var(--muted-foreground)] mt-1">{exp.desc}</p>
                      </div>
                      <div className="mt-2 pt-1.5 border-t border-[var(--gold)]/15 text-[10px] font-bold text-[var(--gold)] flex items-center justify-between">
                        <span>{exp.ctaLabel}</span>
                        <ChevronRight className="w-3 h-3" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
