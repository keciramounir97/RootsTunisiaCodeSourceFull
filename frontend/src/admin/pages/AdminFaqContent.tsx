import React, { useState, useMemo } from "react";
import {
  HelpCircle,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  Eye,
  EyeOff,
  Columns,
  Search,
  ChevronDown,
  MessageCircle,
  Mail,
  Globe,
} from "lucide-react";
import {
  useHelpCenterCmsConfig,
  saveHelpCenterCmsConfig,
  getDefaultHelpCenterConfig,
  CMS_LOCALES,
} from "../../utils/helpCenterCmsConfig";

export default function AdminFaqContent() {
  const [selectedLocale, setSelectedLocale] = useState<string>("fr");
  const { config, setConfig } = useHelpCenterCmsConfig(selectedLocale);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"split" | "editor" | "preview">("split");

  // Filter in editor & preview
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedPreviewId, setExpandedPreviewId] = useState<string | null>(
    config.faq.questions[0]?.id || null
  );
  const [newCategoryLabel, setNewCategoryLabel] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleSave = async (
    nextConfig = config,
    msg = `Page Foire Aux Questions (${selectedLocale.toUpperCase()}) enregistrée avec succès.`
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
        `Réinitialiser la FAQ (${selectedLocale.toUpperCase()}) aux valeurs par défaut ?`
      )
    )
      return;
    const def = getDefaultHelpCenterConfig(selectedLocale);
    const next = {
      ...config,
      faq: def.faq,
    };
    await handleSave(next, `Valeurs par défaut de la FAQ (${selectedLocale.toUpperCase()}) restaurées.`);
  };

  // Categories
  const addCategory = () => {
    const label = newCategoryLabel.trim();
    if (!label) return;
    const id = label
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-");
    setConfig({
      ...config,
      faq: {
        ...config.faq,
        categories: [...config.faq.categories, { id, label, icon: "HelpCircle" }],
      },
    });
    setNewCategoryLabel("");
  };

  const updateCategoryLabel = (idx: number, label: string) => {
    const categories = config.faq.categories.map((c, i) => (i === idx ? { ...c, label } : c));
    setConfig({ ...config, faq: { ...config.faq, categories } });
  };

  const deleteCategory = (id: string) => {
    if (id === "all") return;
    setConfig({
      ...config,
      faq: {
        ...config.faq,
        categories: config.faq.categories.filter((c) => c.id !== id),
      },
    });
  };

  // Questions
  const addQuestion = () => {
    const defaultCat =
      selectedCategory !== "all"
        ? selectedCategory
        : config.faq.categories.find((c) => c.id !== "all")?.id || "subscriptions";
    const newQ = {
      id: `faq-${Date.now()}`,
      category: defaultCat,
      badge: "Nouvelle Question",
      q: "Nouvelle question fréquente...",
      a: "Saisissez ici la réponse détaillée qui s'affichera dans la FAQ.",
      published: true,
    };
    setConfig({
      ...config,
      faq: {
        ...config.faq,
        questions: [newQ, ...config.faq.questions],
      },
    });
    setExpandedPreviewId(newQ.id);
  };

  const updateQuestion = (
    id: string,
    field: "q" | "a" | "category" | "badge" | "published",
    value: any
  ) => {
    const questions = config.faq.questions.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setConfig({ ...config, faq: { ...config.faq, questions } });
  };

  const deleteQuestion = (id: string) => {
    setConfig({
      ...config,
      faq: {
        ...config.faq,
        questions: config.faq.questions.filter((item) => item.id !== id),
      },
    });
  };

  const filteredQuestions = useMemo(() => {
    return config.faq.questions.filter((item) => {
      const matchCat = selectedCategory === "all" || item.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchCat;
      return (
        matchCat &&
        (item.q.toLowerCase().includes(q) ||
          item.a.toLowerCase().includes(q) ||
          (item.badge || "").toLowerCase().includes(q))
      );
    });
  }, [config.faq.questions, selectedCategory, searchQuery]);

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
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--gold)]">
                  Contenu Public • Foire Aux Questions (FAQ)
                </span>
                <a
                  href="/helpcenter#faq"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] font-semibold text-[var(--gold)]/80 hover:text-[var(--gold)] underline"
                >
                  <span>Voir /helpcenter#faq</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
              <h1 className="font-cinzel text-2xl font-bold text-[var(--foreground)] mt-0.5">
                Gestion de la Foire Aux Questions (FAQ)
              </h1>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">
                Ajoutez ou modifiez vos questions/réponses et catégories avec un aperçu interactif en direct à droite.
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
            {/* 1. En-tête FAQ & Bannière Support */}
            <div className="surface-card frame-gold rounded-2xl p-5 bg-[var(--card)]/95 border border-[var(--gold)]/30 space-y-3.5">
              <div className="flex items-center gap-2 border-b border-[var(--gold)]/15 pb-2.5">
                <HelpCircle className="w-4 h-4 text-[var(--gold)]" />
                <h2 className="font-cinzel text-sm font-bold text-[var(--foreground)]">
                  1. En-tête de la FAQ & Bannière Support
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="text-[10px] font-bold uppercase text-[var(--gold)] block mb-1">
                    Surtitre
                  </label>
                  <input
                    type="text"
                    value={config.faq.header.eyebrow}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        faq: {
                          ...config.faq,
                          header: { ...config.faq.header, eyebrow: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-xl border border-[var(--gold)]/30 bg-[var(--background)] text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-[var(--gold)] block mb-1">
                    Titre
                  </label>
                  <input
                    type="text"
                    value={config.faq.header.title}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        faq: {
                          ...config.faq,
                          header: { ...config.faq.header, title: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-xl border border-[var(--gold)]/30 bg-[var(--background)] text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-[var(--gold)] block mb-1">
                    Mot en Or
                  </label>
                  <input
                    type="text"
                    value={config.faq.header.titleHighlight}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        faq: {
                          ...config.faq,
                          header: { ...config.faq.header, titleHighlight: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-xl border border-[var(--gold)]/30 bg-[var(--background)] text-xs font-bold text-[var(--gold)]"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="text-[10px] font-bold uppercase text-[var(--gold)] block mb-1">
                    Sous-titre d'introduction
                  </label>
                  <input
                    type="text"
                    value={config.faq.header.subtitle}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        faq: {
                          ...config.faq,
                          header: { ...config.faq.header, subtitle: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-xl border border-[var(--gold)]/30 bg-[var(--background)] text-xs"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="text-[10px] font-bold uppercase text-[var(--gold)] block mb-1">
                    Placeholder de Recherche
                  </label>
                  <input
                    type="text"
                    value={config.faq.header.searchPlaceholder}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        faq: {
                          ...config.faq,
                          header: { ...config.faq.header, searchPlaceholder: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-xl border border-[var(--gold)]/30 bg-[var(--background)] text-xs"
                  />
                </div>
              </div>
            </div>

            {/* 2. Catégories de la FAQ */}
            <div className="surface-card frame-gold rounded-2xl p-5 bg-[var(--card)]/95 border border-[var(--gold)]/30 space-y-3">
              <h2 className="font-cinzel text-sm font-bold text-[var(--foreground)] border-b border-[var(--gold)]/15 pb-2">
                2. Catégories de Filtrage ({config.faq.categories.length})
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {config.faq.categories.map((cat, idx) => (
                  <div key={cat.id} className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={cat.label}
                      onChange={(e) => updateCategoryLabel(idx, e.target.value)}
                      className="flex-1 px-2.5 py-1.5 rounded-lg border border-[var(--gold)]/30 bg-[var(--background)] text-xs font-semibold"
                    />
                    {cat.id !== "all" && (
                      <button
                        type="button"
                        onClick={() => deleteCategory(cat.id)}
                        className="p-1.5 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/15 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={newCategoryLabel}
                  onChange={(e) => setNewCategoryLabel(e.target.value)}
                  placeholder="Nouvelle catégorie FAQ..."
                  className="flex-1 px-3 py-1.5 rounded-xl border border-[var(--gold)]/30 bg-[var(--background)] text-xs"
                />
                <button
                  type="button"
                  onClick={addCategory}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[var(--gold)]/20 border border-[var(--gold)]/50 text-xs font-bold text-[var(--gold)] cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter</span>
                </button>
              </div>
            </div>

            {/* 3. Questions & Réponses */}
            <div className="surface-card frame-gold rounded-2xl p-5 bg-[var(--card)]/95 border border-[var(--gold)]/30 space-y-3.5">
              <div className="flex items-center justify-between border-b border-[var(--gold)]/15 pb-2.5">
                <h2 className="font-cinzel text-sm font-bold text-[var(--foreground)]">
                  3. Questions & Réponses ({filteredQuestions.length})
                </h2>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="btn-base btn-gold inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nouvelle Question</span>
                </button>
              </div>

              {/* Filter Bar */}
              <div className="flex flex-wrap items-center gap-1.5">
                {config.faq.categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                      selectedCategory === cat.id
                        ? "bg-[var(--gold)] text-[#1f160f] font-bold"
                        : "border border-[var(--gold)]/25 bg-[var(--background)]/50 text-[var(--muted-foreground)]"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1 custom-scrollbar">
                {filteredQuestions.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setExpandedPreviewId(item.id)}
                    className={`p-3.5 rounded-xl border transition space-y-2 ${
                      item.published !== false
                        ? "border-[var(--gold)]/30 bg-[var(--background)]/50"
                        : "border-rose-500/30 bg-rose-950/10 opacity-75"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <select
                        value={item.category}
                        onChange={(e) => updateQuestion(item.id, "category", e.target.value)}
                        className="px-2.5 py-1 rounded-lg border border-[var(--gold)]/30 bg-[var(--background)] text-[11px] font-semibold text-[var(--gold)]"
                      >
                        {config.faq.categories
                          .filter((c) => c.id !== "all")
                          .map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.label}
                            </option>
                          ))}
                      </select>

                      <input
                        type="text"
                        value={item.badge || ""}
                        onChange={(e) => updateQuestion(item.id, "badge", e.target.value)}
                        placeholder="Badge (optionnel)"
                        className="w-36 px-2.5 py-1 rounded-lg border border-[var(--gold)]/25 bg-[var(--background)] text-[11px]"
                      />

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => updateQuestion(item.id, "published", !item.published)}
                          className="p-1.5 rounded-lg border border-[var(--gold)]/30 text-[var(--gold)] cursor-pointer"
                          title={item.published !== false ? "Masquer" : "Publier"}
                        >
                          {item.published !== false ? (
                            <Eye className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteQuestion(item.id)}
                          className="p-1.5 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/15 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <input
                      type="text"
                      value={item.q}
                      onChange={(e) => updateQuestion(item.id, "q", e.target.value)}
                      placeholder="Question..."
                      className="w-full px-3 py-1.5 rounded-lg border border-[var(--gold)]/30 bg-[var(--background)] text-xs font-bold"
                    />

                    <textarea
                      rows={3}
                      value={item.a}
                      onChange={(e) => updateQuestion(item.id, "a", e.target.value)}
                      placeholder="Réponse..."
                      className="w-full px-3 py-1.5 rounded-lg border border-[var(--gold)]/30 bg-[var(--background)] text-xs leading-relaxed"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* RIGHT COLUMN: INTERACTIVE LIVE PREVIEW */}
        {viewMode !== "editor" && (
          <div className={viewMode === "split" ? "xl:col-span-6 xl:sticky xl:top-6" : ""}>
            <div className="surface-card frame-gold rounded-2xl p-5 bg-[var(--card)]/95 border border-[var(--gold)]/40 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-[var(--gold)]/20 pb-3">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[var(--gold)]" />
                  <span className="font-cinzel text-sm font-bold text-[var(--foreground)]">
                    Aperçu Interactif en Direct — Page FAQ
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Temps Réel
                </span>
              </div>

              <div className="rounded-2xl border border-[var(--gold)]/25 bg-[var(--background)] p-5 space-y-4">
                {/* Search Header Preview */}
                <div className="p-5 rounded-2xl border border-[var(--gold)]/35 bg-[var(--card)] text-center space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--gold)]">
                    {config.faq.header.eyebrow}
                  </span>
                  <h3 className="font-cinzel text-xl font-bold text-[var(--foreground)]">
                    {config.faq.header.title}{" "}
                    <span className="text-[var(--gold)]">{config.faq.header.titleHighlight}</span>
                  </h3>
                  <p className="text-xs text-[var(--muted-foreground)] max-w-md mx-auto">
                    {config.faq.header.subtitle}
                  </p>
                  <div className="relative max-w-md mx-auto pt-2">
                    <Search className="w-3.5 h-3.5 text-[var(--gold)] absolute left-3.5 top-1/2 -translate-y-1/2 mt-1" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={config.faq.header.searchPlaceholder}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-[var(--gold)]/35 bg-[var(--background)] text-[11px]"
                    />
                  </div>
                </div>

                {/* Categories Pills Preview */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {config.faq.categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition cursor-pointer ${
                        selectedCategory === cat.id
                          ? "bg-[var(--gold)] text-[#1f160f] font-bold"
                          : "border border-[var(--gold)]/30 bg-[var(--card)] text-[var(--foreground)]/80"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Accordion Items Preview */}
                <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
                  {filteredQuestions
                    .filter((q) => q.published !== false)
                    .map((faq) => {
                      const isOpen = expandedPreviewId === faq.id;
                      return (
                        <div
                          key={faq.id}
                          className={`rounded-xl border transition ${
                            isOpen
                              ? "border-[var(--gold)] bg-[var(--card)]"
                              : "border-[var(--gold)]/25 bg-[var(--card)]/90"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => setExpandedPreviewId(isOpen ? null : faq.id)}
                            className="w-full p-3.5 text-left flex items-center justify-between gap-3 cursor-pointer"
                          >
                            <div>
                              {faq.badge && (
                                <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30 mb-1">
                                  {faq.badge}
                                </span>
                              )}
                              <h5 className="font-cinzel text-xs font-bold text-[var(--foreground)]">
                                {faq.q}
                              </h5>
                            </div>
                            <ChevronDown
                              className={`w-4 h-4 text-[var(--gold)] shrink-0 transition-transform ${
                                isOpen ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                          {isOpen && (
                            <div className="px-3.5 pb-3.5 pt-2 border-t border-[var(--gold)]/15 text-xs text-[var(--muted-foreground)] leading-relaxed">
                              {faq.a}
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>

                {/* Bottom CTA Preview */}
                <div className="p-4 rounded-2xl border border-[var(--gold)]/30 bg-[var(--card)] text-center space-y-2">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--gold)]">
                    {config.faq.bottomCta.eyebrow}
                  </span>
                  <h5 className="font-cinzel text-sm font-bold text-[var(--foreground)]">
                    {config.faq.bottomCta.title}
                  </h5>
                  <p className="text-[11px] text-[var(--muted-foreground)]">
                    {config.faq.bottomCta.subtitle}
                  </p>
                  <div className="flex items-center justify-center gap-2 pt-1">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-[10px] font-bold">
                      <MessageCircle className="w-3 h-3" />
                      <span>{config.faq.bottomCta.whatsappLabel}</span>
                    </span>
                    <span className="btn-base btn-gold inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold">
                      <Mail className="w-3 h-3" />
                      <span>{config.faq.bottomCta.contactLabel}</span>
                    </span>
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

