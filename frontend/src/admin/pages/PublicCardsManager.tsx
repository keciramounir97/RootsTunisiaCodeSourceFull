import React, { useState, useMemo } from "react";
import {
  Archive,
  ArrowDown,
  ArrowUp,
  Check,
  ChevronLeft,
  ChevronRight,
  Compass,
  Edit3,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  Globe,
  Link2,
  Loader2,
  Monitor,
  Pencil,
  Plus,
  RotateCcw,
  Save,
  Search,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Tablet,
  Trash2,
  X,
} from "lucide-react";
import { useTranslation } from "../../context/TranslationContext";
import { api } from "../../api/client";
import { getApiErrorMessage } from "../../api/helpers";
import {
  usePublicCards,
  refreshPublicCards,
  resolveCardText,
  type PublicCardRecord,
  type PublicCardTranslation,
} from "../../hooks/usePublicCards";
import Toast from "../../components/Toast";

interface PublicCardsManagerProps {
  kind: "archive" | "source";
}

interface FormState {
  id?: number | string;
  kind: "archive" | "source";
  title: string;
  description: string;
  link: string;
  sortOrder: number;
  isPublished: boolean;
  translations: Record<string, PublicCardTranslation>;
}

const EMPTY_FORM: FormState = {
  kind: "archive",
  title: "",
  description: "",
  link: "",
  sortOrder: 0,
  isPublished: true,
  translations: {},
};

const LOCALES = [
  { code: "fr", label: "Français (Défaut)", flag: "🇫🇷", short: "FR", dir: "ltr" as const },
  { code: "en", label: "English", flag: "🇬🇧", short: "EN", dir: "ltr" as const },
  { code: "ar", label: "العربية", flag: "🇹🇳", short: "AR", dir: "rtl" as const },
  { code: "es", label: "Español", flag: "🇪🇸", short: "ES", dir: "ltr" as const },
  { code: "it", label: "Italiano", flag: "🇮🇹", short: "IT", dir: "ltr" as const },
  { code: "mt", label: "Malti", flag: "🇲🇹", short: "MT", dir: "ltr" as const },
];

export default function PublicCardsManager({ kind }: PublicCardsManagerProps) {
  const { locale, t } = useTranslation();
  const { cards = [], loading, reload } = usePublicCards(kind);

  const [deviceMode, setDeviceMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [activeLangTab, setActiveLangTab] = useState<string>("fr");
  const [sidebarTab, setSidebarTab] = useState<"list" | "inspector">("list");
  const [selectedCardId, setSelectedCardId] = useState<number | string | null>(null);

  const [form, setForm] = useState<FormState>({ ...EMPTY_FORM, kind });
  const [searchQuery, setSearchQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | string | null>(null);
  const [toast, setToast] = useState<{ message: string; tone: "success" | "error" | "info" }>({
    message: "",
    tone: "info",
  });

  const cardsList = useMemo(() => cards || [], [cards]);
  const activeLangObj = LOCALES.find((l) => l.code === activeLangTab) || LOCALES[0];
  const isCanvasRtl = activeLangObj.dir === "rtl";

  const pageTitle =
    kind === "archive" ? "Archives Nationales & Régionales" : "Sources Documentaires & Notariales";
  const pageSubtitle =
    kind === "archive"
      ? "Gérez les fiches et liens officiels des institutions d'archives de Tunisie."
      : "Gérez les registres civils, tribunaux charaïques et fonds documentaires patrimoniaux.";

  const filteredCards = useMemo(() => {
    if (!searchQuery.trim()) return cardsList;
    const q = searchQuery.toLowerCase();
    return cardsList.filter((c) => {
      const matchTitle = (c.title || "").toLowerCase().includes(q);
      const matchDesc = (c.description || "").toLowerCase().includes(q);
      const matchLink = (c.link || c.linkUrl || "").toLowerCase().includes(q);
      return matchTitle || matchDesc || matchLink;
    });
  }, [cardsList, searchQuery]);

  const openAddCard = () => {
    const newForm: FormState = {
      ...EMPTY_FORM,
      kind,
      sortOrder: cardsList.length,
    };
    setForm(newForm);
    setSelectedCardId("new");
    setSidebarTab("inspector");
  };

  const openEditCard = (card: PublicCardRecord) => {
    setSelectedCardId(card.id);
    setForm({
      id: card.id,
      kind: card.kind,
      title: card.title || "",
      description: card.description || "",
      link: card.link || card.linkUrl || "",
      sortOrder: card.sortOrder || 0,
      isPublished: card.isPublished !== false && card.isActive !== false,
      translations: { ...(card.translations || {}) },
    });
    setSidebarTab("inspector");
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!form.title.trim()) {
      setToast({ message: "Le titre est obligatoire.", tone: "error" });
      return;
    }
    if (!form.link.trim()) {
      setToast({ message: "Le lien web officiel est obligatoire.", tone: "error" });
      return;
    }

    const payload = {
      kind,
      title: form.title.trim(),
      description: form.description.trim(),
      link: form.link.trim(),
      sortOrder: form.sortOrder,
      isPublished: form.isPublished,
      translations: form.translations,
    };

    try {
      setSaving(true);
      if (form.id && form.id !== "new") {
        await api.put(`/admin/public-cards/${form.id}`, payload);
      } else {
        await api.post("/admin/public-cards", payload);
      }
      setToast({ message: t("pc_saved", "Fiche enregistrée et publiée en direct !"), tone: "success" });
      await refreshPublicCards(kind);
      if (reload) await reload();
      setSidebarTab("list");
      setSelectedCardId(null);
    } catch (err) {
      setToast({ message: getApiErrorMessage(err, t("pc_error")), tone: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number | string) => {
    if (!window.confirm(t("pc_confirm_delete", "Voulez-vous vraiment supprimer cette fiche ?"))) return;
    try {
      setDeletingId(id);
      await api.delete(`/admin/public-cards/${id}`);
      setToast({ message: t("pc_deleted", "Fiche supprimée."), tone: "success" });
      await refreshPublicCards(kind);
      if (reload) await reload();
      if (selectedCardId === id) {
        setSelectedCardId(null);
        setSidebarTab("list");
      }
    } catch (err) {
      setToast({ message: getApiErrorMessage(err, t("pc_error")), tone: "error" });
    } finally {
      setDeletingId(null);
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= cardsList.length) return;

    const newCards = [...cardsList];
    const [moved] = newCards.splice(index, 1);
    newCards.splice(targetIndex, 0, moved);

    const orderedIds = newCards.map((c) => c.id);
    try {
      await api.post("/admin/public-cards/reorder", { ids: orderedIds });
      await refreshPublicCards(kind);
      if (reload) await reload();
    } catch (err) {
      setToast({ message: getApiErrorMessage(err, t("pc_error")), tone: "error" });
    }
  };

  const handleToggleActive = async (card: PublicCardRecord) => {
    const nextState = !card.isPublished;
    try {
      await api.put(`/admin/public-cards/${card.id}`, {
        isPublished: nextState,
      });
      await refreshPublicCards(kind);
      if (reload) await reload();
      setToast({
        message: nextState ? "Fiche publiée en ligne" : "Fiche masquée du site",
        tone: "info",
      });
    } catch (err) {
      setToast({ message: getApiErrorMessage(err, t("pc_error")), tone: "error" });
    }
  };

  // Live updated cards list reflecting uncommitted changes in the inspector
  const livePreviewCards = useMemo(() => {
    return cardsList.map((c) => {
      if (selectedCardId === c.id) {
        return {
          ...c,
          title: form.title || c.title,
          description: form.description || c.description,
          link: form.link || c.link,
          isPublished: form.isPublished,
          translations: form.translations,
        };
      }
      return c;
    });
  }, [cardsList, selectedCardId, form]);

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] -m-3 sm:-m-6 lg:-m-8 bg-[#0b131e] text-slate-100 overflow-hidden font-sans">
      {toast.message && <Toast message={toast.message} tone={toast.tone} />}

      {/* ========================================================================= */}
      {/* 1. TOP STUDIO BAR                                                         */}
      {/* ========================================================================= */}
      <header className="h-16 border-b border-slate-700/80 bg-[#0f172a]/95 backdrop-blur-md px-4 flex items-center justify-between gap-3 shrink-0 z-40 select-none shadow-md">
        <div className="flex items-center gap-3 min-w-0">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-widest bg-gradient-to-r from-amber-500/20 to-yellow-500/10 text-[var(--gold)] border border-[var(--gold)]/40 flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3 h-3 text-[var(--gold)] animate-pulse" />
            <span>Studio Shopify Fiches</span>
          </span>

          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1.5 rounded-lg bg-[var(--gold)]/15 text-[var(--gold)] shrink-0">
              {kind === "archive" ? <Archive className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
            </div>
            <div className="truncate text-start">
              <span className="font-bold text-sm text-white truncate block">{pageTitle}</span>
              <span className="font-mono text-[10px] text-slate-400 block truncate">
                {cardsList.length} fiches répertoriées
              </span>
            </div>
          </div>
        </div>

        {/* Center: Device Switcher + Language Selector */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center p-1 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-inner">
            <button
              type="button"
              onClick={() => setDeviceMode("desktop")}
              className={`p-1.5 rounded-lg transition-all flex items-center gap-1.5 text-xs font-semibold ${
                deviceMode === "desktop"
                  ? "bg-[var(--gold)] text-black shadow-sm font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Monitor className="w-4 h-4" />
              <span className="hidden lg:inline">Bureau</span>
            </button>
            <button
              type="button"
              onClick={() => setDeviceMode("tablet")}
              className={`p-1.5 rounded-lg transition-all flex items-center gap-1.5 text-xs font-semibold ${
                deviceMode === "tablet"
                  ? "bg-[var(--gold)] text-black shadow-sm font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Tablet className="w-4 h-4" />
              <span className="hidden lg:inline">Tablette</span>
            </button>
            <button
              type="button"
              onClick={() => setDeviceMode("mobile")}
              className={`p-1.5 rounded-lg transition-all flex items-center gap-1.5 text-xs font-semibold ${
                deviceMode === "mobile"
                  ? "bg-[var(--gold)] text-black shadow-sm font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span className="hidden lg:inline">Mobile</span>
            </button>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-inner">
            {LOCALES.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => setActiveLangTab(l.code)}
                title={l.label}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  activeLangTab === l.code
                    ? "bg-[var(--gold)] text-black shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <span>{l.flag}</span>
                <span className="font-mono text-[11px]">{l.short}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Action: Add Card Button */}
        <div className="flex items-center gap-2">
          <a
            href={kind === "archive" ? "/archives" : "/sources"}
            target="_blank"
            rel="noopener noreferrer"
            title="Ouvrir la page publique réelle"
            className="p-2 rounded-xl border border-slate-700 bg-slate-800/80 text-slate-300 hover:text-white hover:border-[var(--gold)] transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </a>

          <button
            type="button"
            onClick={openAddCard}
            className="btn-base btn-gold text-xs py-2 px-4 flex items-center gap-1.5 cursor-pointer shadow-lg font-bold"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvelle Fiche</span>
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. SPLIT WORKSPACE: LEFT INSPECTOR + RIGHT LIVE CARDS GRID                */}
      {/* ========================================================================= */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* LEFT PANEL: CARDS LIST & INSPECTOR */}
        <aside className="w-full lg:w-[410px] border-r border-slate-800 bg-[#0f172a] flex flex-col shrink-0 z-30 shadow-xl overflow-hidden">
          <div className="p-3 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-800/90 border border-slate-700 w-full">
              <button
                type="button"
                onClick={() => setSidebarTab("list")}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  sidebarTab === "list"
                    ? "bg-[var(--gold)] text-black shadow-sm font-extrabold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <span>Toutes les fiches ({cardsList.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setSidebarTab("inspector")}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  sidebarTab === "inspector"
                    ? "bg-[var(--gold)] text-black shadow-sm font-extrabold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Éditeur de fiche</span>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
            {sidebarTab === "list" ? (
              <div className="space-y-3">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-500 absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filtrer les fiches..."
                    className="w-full ps-9 pe-3 py-2 text-xs rounded-xl border border-slate-800 bg-slate-900 text-slate-200 outline-none focus:border-[var(--gold)]"
                  />
                </div>

                {filteredCards.map((card, idx) => {
                  const { title } = resolveCardText(card, activeLangTab);
                  const isSel = selectedCardId === card.id;
                  const isPub = card.isPublished !== false && card.isActive !== false;

                  return (
                    <div
                      key={card.id}
                      onClick={() => openEditCard(card)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 group text-start ${
                        isSel
                          ? "bg-slate-800/90 border-[var(--gold)] ring-1 ring-[var(--gold)]/40 shadow-md"
                          : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-850"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="font-mono text-xs font-bold text-[var(--gold)] shrink-0">
                          #{idx + 1}
                        </span>
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs text-white group-hover:text-[var(--gold)] transition-colors truncate">
                            {title || card.title}
                          </h4>
                          <span className="font-mono text-[10px] text-slate-400 truncate block mt-0.5">
                            {card.link || card.linkUrl}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMove(idx, "up")}
                          className="p-1 rounded text-slate-500 hover:text-[var(--gold)] disabled:opacity-20"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === cardsList.length - 1}
                          onClick={() => handleMove(idx, "down")}
                          className="p-1 rounded text-slate-500 hover:text-[var(--gold)] disabled:opacity-20"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleActive(card)}
                          className={`p-1 rounded ${isPub ? "text-emerald-400" : "text-slate-600"}`}
                        >
                          {isPub ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* CARD INSPECTOR FORM */
              <div className="space-y-4 text-start">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <button
                    type="button"
                    onClick={() => setSidebarTab("list")}
                    className="text-xs font-semibold text-slate-400 hover:text-[var(--gold)] flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Retour à la liste</span>
                  </button>
                  <span className="text-[10px] font-mono text-[var(--gold)] font-bold">
                    {selectedCardId === "new" ? "Nouvelle Fiche" : `Édition #${form.id}`}
                  </span>
                </div>

                {/* Title Input */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Titre de la fiche</label>
                  <input
                    type="text"
                    dir={activeLangObj.dir}
                    value={
                      activeLangTab === "fr"
                        ? form.title
                        : form.translations[activeLangTab]?.title ?? ""
                    }
                    placeholder="ex. Archives Nationales de Tunisie (ANT)"
                    onChange={(e) => {
                      const val = e.target.value;
                      if (activeLangTab === "fr") {
                        setForm((prev) => ({ ...prev, title: val }));
                      } else {
                        setForm((prev) => ({
                          ...prev,
                          translations: {
                            ...prev.translations,
                            [activeLangTab]: {
                              ...(prev.translations[activeLangTab] || {}),
                              title: val,
                            },
                          },
                        }));
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-sm text-white outline-none focus:border-[var(--gold)]"
                  />
                </div>

                {/* Description Input */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Description détaillée</label>
                  <textarea
                    rows={4}
                    dir={activeLangObj.dir}
                    value={
                      activeLangTab === "fr"
                        ? form.description
                        : form.translations[activeLangTab]?.description ?? ""
                    }
                    placeholder="Description du fonds patrimonial, consultations sur place..."
                    onChange={(e) => {
                      const val = e.target.value;
                      if (activeLangTab === "fr") {
                        setForm((prev) => ({ ...prev, description: val }));
                      } else {
                        setForm((prev) => ({
                          ...prev,
                          translations: {
                            ...prev.translations,
                            [activeLangTab]: {
                              ...(prev.translations[activeLangTab] || {}),
                              description: val,
                            },
                          },
                        }));
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-xs text-white outline-none focus:border-[var(--gold)] leading-relaxed"
                  />
                </div>

                {/* Link Input */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Lien web officiel</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      dir="ltr"
                      value={form.link}
                      placeholder="https://archives.nat.tn..."
                      onChange={(e) => setForm((prev) => ({ ...prev, link: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-xs font-mono text-[var(--gold)] outline-none focus:border-[var(--gold)]"
                    />
                    {form.link && (
                      <a
                        href={form.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-[var(--gold)]"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Publication switch */}
                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-900">
                  <span className="text-xs font-bold text-slate-200">Statut de publication</span>
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, isPublished: !prev.isPublished }))}
                    className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors ${
                      form.isPublished
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                        : "bg-slate-800 text-slate-400 border border-slate-700"
                    }`}
                  >
                    {form.isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{form.isPublished ? "En Ligne" : "Masquée"}</span>
                  </button>
                </div>

                {/* Action buttons */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 btn-base btn-gold text-xs py-2.5 font-bold shadow-lg flex items-center justify-center gap-1.5"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>Enregistrer la Fiche</span>
                  </button>

                  {form.id && form.id !== "new" && (
                    <button
                      type="button"
                      onClick={() => form.id && handleDelete(form.id)}
                      className="p-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors"
                      title="Supprimer cette fiche"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* RIGHT PANEL: LIVE RESPONSIVE CANVAS */}
        <main className="flex-1 bg-[#070b12] overflow-y-auto flex flex-col items-center p-4 sm:p-8 relative scrollbar-thin">
          <div
            className={`transition-all duration-300 w-full flex flex-col relative z-10 ${
              deviceMode === "mobile"
                ? "max-w-[390px] rounded-[44px] border-[10px] border-slate-800 shadow-2xl overflow-hidden my-4 bg-slate-950"
                : deviceMode === "tablet"
                ? "max-w-[768px] rounded-[30px] border-[8px] border-slate-800 shadow-2xl overflow-hidden my-4 bg-slate-950"
                : "w-full max-w-6xl rounded-2xl border border-slate-800 shadow-2xl overflow-hidden bg-slate-950"
            }`}
          >
            {/* Device header */}
            <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs select-none">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Aperçu en direct · {kind === "archive" ? "/archives" : "/sources"}
              </span>
              <span className="font-mono text-[10px] text-[var(--gold)] font-bold">
                {activeLangObj.short}
              </span>
            </div>

            {/* LIVE CARDS GRID BODY */}
            <div dir={isCanvasRtl ? "rtl" : "ltr"} className="p-6 sm:p-10 bg-[#0b1420] min-h-[500px]">
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {livePreviewCards.map((card, idx) => {
                  const { title, description } = resolveCardText(card, activeLangTab);
                  const isSel = selectedCardId === card.id;

                  return (
                    <div
                      key={card.id}
                      onClick={() => openEditCard(card)}
                      className={`group/card relative rounded-2xl p-5 border text-start transition-all cursor-pointer flex flex-col justify-between ${
                        isSel
                          ? "border-[var(--gold)] ring-2 ring-[var(--gold)]/50 bg-slate-850 shadow-2xl scale-[1.01]"
                          : "border-slate-800 bg-slate-900/90 hover:border-[var(--gold)]/70 hover:scale-[1.01] shadow-md"
                      }`}
                    >
                      {/* Floating edit badge on hover */}
                      <div className="absolute top-2 end-2 opacity-0 group-hover/card:opacity-100 transition-opacity">
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-[var(--gold)] text-black shadow-md flex items-center gap-1">
                          <Edit3 className="w-2.5 h-2.5" />
                          <span>Modifier</span>
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                          <span className="font-mono text-[10px] text-[var(--gold)] font-bold">
                            #{idx + 1}
                          </span>
                          <span className="text-[9px] uppercase font-bold text-slate-400">
                            {kind === "archive" ? "ARCHIVE OFFICIELLE" : "SOURCE DOCUMENTAIRE"}
                          </span>
                        </div>

                        <h3 className="font-serif font-bold text-base text-white group-hover/card:text-[var(--gold)] transition-colors leading-snug">
                          {title || card.title}
                        </h3>

                        <p className="text-xs text-slate-300 leading-relaxed font-light line-clamp-3">
                          {description || card.description}
                        </p>
                      </div>

                      <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--gold)]">
                          <span>Accéder au portail</span>
                          <ExternalLink className="w-3 h-3" />
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 truncate max-w-[120px]">
                          {card.link}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
