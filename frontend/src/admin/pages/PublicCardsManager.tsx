import { useState, useMemo } from "react";
import {
  Archive,
  FileText,
  Plus,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Eye,
  EyeOff,
  Check,
  X,
  Globe,
  Loader2,
  Compass,
  Link2,
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
  { code: "fr", label: "Français (Défaut)", flag: "FR", dir: "ltr" },
  { code: "en", label: "English", flag: "EN", dir: "ltr" },
  { code: "ar", label: "العربية", flag: "AR", dir: "rtl" },
  { code: "es", label: "Español", flag: "ES", dir: "ltr" },
  { code: "it", label: "Italiano", flag: "IT", dir: "ltr" },
  { code: "mt", label: "Malti", flag: "MT", dir: "ltr" },
];

export default function PublicCardsManager({ kind }: PublicCardsManagerProps) {
  const { locale, t, isRtl } = useTranslation();
  const { cards = [], loading, reload } = usePublicCards(kind);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>({ ...EMPTY_FORM, kind });
  const [activeLangTab, setActiveLangTab] = useState<string>("fr");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | string | null>(null);
  const [toast, setToast] = useState<{ message: string; tone: "success" | "error" | "info" }>({
    message: "",
    tone: "info",
  });

  const cardsList = useMemo(() => cards || [], [cards]);

  const pageTitle =
    kind === "archive" ? t("pc_title_archive") : t("pc_title_source");
  const pageSubtitle =
    kind === "archive" ? t("pc_subtitle_archive") : t("pc_subtitle_source");

  const openAddModal = () => {
    setForm({
      ...EMPTY_FORM,
      kind,
      sortOrder: cardsList.length,
    });
    setActiveLangTab("fr");
    setModalOpen(true);
  };

  const openEditModal = (card: PublicCardRecord) => {
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
    setActiveLangTab("fr");
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setToast({ message: "Le titre est obligatoire.", tone: "error" });
      return;
    }
    if (!form.link.trim()) {
      setToast({ message: "Le lien est obligatoire.", tone: "error" });
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
      if (form.id && typeof form.id === "number") {
        await api.put(`/admin/public-cards/${form.id}`, payload);
      } else if (form.id) {
        await api.put(`/admin/public-cards/${form.id}`, payload);
      } else {
        await api.post("/admin/public-cards", payload);
      }
      setToast({ message: t("pc_saved"), tone: "success" });
      setModalOpen(false);
      await refreshPublicCards(kind);
      if (reload) await reload();
    } catch (err) {
      setToast({ message: getApiErrorMessage(err, t("pc_error")), tone: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number | string) => {
    if (!window.confirm(t("pc_confirm_delete"))) return;
    try {
      setDeletingId(id);
      await api.delete(`/admin/public-cards/${id}`);
      setToast({ message: t("pc_deleted"), tone: "success" });
      await refreshPublicCards(kind);
      if (reload) await reload();
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
    } catch (err) {
      setToast({ message: getApiErrorMessage(err, t("pc_error")), tone: "error" });
    }
  };

  // Preview title and description based on selected language tab
  const previewData = useMemo(() => {
    if (activeLangTab === "fr") {
      return {
        title: form.title || "Titre de la fiche",
        description: form.description || "Description de la source ou archive affichée sur la page publique...",
      };
    }
    const tr = form.translations[activeLangTab];
    return {
      title: tr?.title || form.title || "Titre de la fiche",
      description: tr?.description || form.description || "Description de la source ou archive...",
    };
  }, [activeLangTab, form]);

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="space-y-6 text-start pb-20">
      {toast.message && <Toast message={toast.message} tone={toast.tone} />}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--gold)]/20">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--gold)]/15 text-[var(--gold)] ring-1 ring-[var(--gold)]/35 shrink-0">
            {kind === "archive" ? <Archive className="h-6 w-6" /> : <FileText className="h-6 w-6" />}
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-[var(--foreground)]">{pageTitle}</h1>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{pageSubtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30">
            {cardsList.length} {t("pc_count")}
          </span>
          <button
            type="button"
            onClick={openAddModal}
            className="btn-base btn-gold text-xs py-2 px-4 flex items-center gap-2 cursor-pointer shadow-md hover:scale-[1.02] transition-transform"
          >
            <Plus className="h-4 w-4" />
            <span>{t("pc_add")}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {loading && cardsList.length === 0 ? (
        <div className="flex items-center justify-center p-16">
          <Loader2 className="h-8 w-8 text-[var(--gold)] animate-spin" />
        </div>
      ) : cardsList.length === 0 ? (
        <div className="text-center p-12 rounded-xl border border-[var(--gold)]/30 bg-[var(--card)]/60 text-sm text-[var(--muted-foreground)] space-y-3">
          <Compass className="h-10 w-10 text-[var(--gold)] mx-auto opacity-70" />
          <p className="font-semibold text-[var(--foreground)]">{t("pc_empty")}</p>
          <button
            type="button"
            onClick={openAddModal}
            className="btn-base btn-outline text-xs py-2 px-4 cursor-pointer"
          >
            {t("pc_add")}
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cardsList.map((card, idx) => {
            const { title, description } = resolveCardText(card, locale);
            const cardLink = card.link || card.linkUrl || "#";
            const isCardActive = card.isPublished !== false && card.isActive !== false;

            return (
              <article
                key={card.id}
                className={`surface-card group flex flex-col justify-between p-5 rounded-xl border transition-all duration-200 ${
                  isCardActive
                    ? "border-[var(--gold)]/35 bg-[var(--card)]/90 hover:border-[var(--gold)] shadow-sm hover:shadow-md"
                    : "border-dashed border-[var(--border)] bg-[var(--card)]/40 opacity-70"
                }`}
              >
                <div className="space-y-3">
                  {/* Card Top: Order and status */}
                  <div className="flex items-center justify-between text-xs border-b border-[var(--gold)]/15 pb-2.5">
                    <span className="font-mono text-[11px] font-bold text-[var(--gold)]">
                      #{idx + 1}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(card)}
                        title={isCardActive ? t("pc_published") : t("pc_hidden")}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                          isCardActive
                            ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30"
                            : "bg-stone-500/20 text-stone-400 border border-stone-500/30"
                        }`}
                      >
                        {isCardActive ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                        <span>{isCardActive ? t("pc_published") : t("pc_hidden")}</span>
                      </button>
                    </div>
                  </div>

                  {/* Card Title & Description */}
                  <div>
                    <h3 className="font-serif font-bold text-base text-[var(--foreground)] group-hover:text-[var(--gold)] transition-colors leading-snug">
                      {title || card.title}
                    </h3>
                    <p className="mt-2 text-xs text-[var(--muted-foreground)] leading-relaxed line-clamp-3">
                      {description || card.description}
                    </p>
                  </div>

                  {/* Link Preview */}
                  <div className="pt-2 text-[11px] text-[var(--gold)] flex items-center gap-1 font-mono truncate">
                    <Link2 className="h-3 w-3 shrink-0" />
                    <span className="truncate">{cardLink}</span>
                  </div>
                </div>

                {/* Card Footer: Actions */}
                <div className="mt-4 pt-3 border-t border-[var(--gold)]/15 flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, "up")}
                      className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--gold)] hover:border-[var(--gold)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title={t("pc_move_up")}
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === cardsList.length - 1}
                      onClick={() => handleMove(idx, "down")}
                      className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--gold)] hover:border-[var(--gold)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title={t("pc_move_down")}
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditModal(card)}
                      className="p-1.5 rounded-lg border border-[var(--gold)]/40 bg-[var(--gold)]/10 text-[var(--gold)] hover:bg-[var(--gold)]/20 transition-colors cursor-pointer"
                      title={t("pc_edit")}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={deletingId === card.id}
                      onClick={() => handleDelete(card.id)}
                      className="p-1.5 rounded-lg border border-red-500/40 bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors cursor-pointer disabled:opacity-50"
                      title={t("pc_delete")}
                    >
                      {deletingId === card.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Modal for Add / Edit */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="surface-card frame-gold relative w-full max-w-2xl max-h-[92vh] overflow-y-auto p-6 sm:p-8 rounded-2xl bg-[var(--card)] shadow-2xl text-start"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[var(--gold)]/25 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--gold)]/15 text-[var(--gold)] ring-1 ring-[var(--gold)]/40">
                  {form.id ? <Pencil className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                </div>
                <div>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-[var(--foreground)]">
                    {form.id ? t("pc_edit") : t("pc_add")}
                  </h3>
                  <p className="text-[11px] text-[var(--muted-foreground)]">
                    {kind === "archive" ? "Fiche d'archives publiques" : "Fiche de source publique"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-[var(--gold)]/15 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Language Selector Tabs */}
            <div className="mt-4 pt-1 border-b border-[var(--border)] flex items-center gap-1.5 overflow-x-auto pb-2">
              <span className="text-[11px] font-bold text-[var(--muted-foreground)] me-1 uppercase tracking-wider flex items-center gap-1 shrink-0">
                <Globe className="h-3.5 w-3.5 text-[var(--gold)]" />
                <span>{t("pc_translations")}:</span>
              </span>
              {LOCALES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setActiveLangTab(l.code)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                    activeLangTab === l.code
                      ? "bg-[var(--gold)] text-black font-extrabold shadow-sm"
                      : "border border-[var(--border)] text-[var(--foreground)] hover:border-[var(--gold)]/50"
                  }`}
                >
                  {l.flag} · {l.label}
                </button>
              ))}
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="mt-5 space-y-4">
              {activeLangTab === "fr" ? (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--foreground)] mb-1">
                      {t("pc_name")} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="Ex: Archives Nationales de Tunisie"
                      className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--foreground)] mb-1">
                      {t("pc_description")}
                    </label>
                    <textarea
                      rows={3}
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="Ex: Consultation des séries historiques, état civil..."
                      className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/30 leading-relaxed"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="p-3 rounded-lg bg-[var(--gold)]/10 border border-[var(--gold)]/25 text-[11px] text-[var(--foreground)]">
                    <p className="font-semibold">{t("pc_translations_hint")}</p>
                    <p className="opacity-80 mt-1">
                      Par défaut (FR): <strong>{form.title || "(aucun titre)"}</strong>
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--foreground)] mb-1">
                      {t("pc_name")} ({activeLangTab.toUpperCase()})
                    </label>
                    <input
                      type="text"
                      dir={activeLangTab === "ar" ? "rtl" : "ltr"}
                      value={form.translations[activeLangTab]?.title || ""}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          translations: {
                            ...form.translations,
                            [activeLangTab]: {
                              ...form.translations[activeLangTab],
                              title: e.target.value,
                            },
                          },
                        })
                      }
                      placeholder={form.title || "Titre traduit..."}
                      className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--foreground)] mb-1">
                      {t("pc_description")} ({activeLangTab.toUpperCase()})
                    </label>
                    <textarea
                      rows={3}
                      dir={activeLangTab === "ar" ? "rtl" : "ltr"}
                      value={form.translations[activeLangTab]?.description || ""}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          translations: {
                            ...form.translations,
                            [activeLangTab]: {
                              ...form.translations[activeLangTab],
                              description: e.target.value,
                            },
                          },
                        })
                      }
                      placeholder={form.description || "Description traduite..."}
                      className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/30 leading-relaxed"
                    />
                  </div>
                </>
              )}

              {/* Link Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--foreground)] mb-1">
                  {t("pc_link")} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={form.link}
                    onChange={(e) => setForm({ ...form, link: e.target.value })}
                    placeholder="https://www.archives.nat.tn ou /gallery/trees"
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/30 pe-20 font-mono"
                  />
                  {form.link && (
                    <a
                      href={form.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute end-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded bg-[var(--gold)]/15 text-[var(--gold)] hover:bg-[var(--gold)]/25 text-[10px] font-bold flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>Tester</span>
                    </a>
                  )}
                </div>
                <p className="mt-1 text-[10.5px] text-[var(--muted-foreground)]">
                  {t("pc_link_hint")}
                </p>
              </div>

              {/* Published Toggle */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isPublishedToggle"
                  checked={form.isPublished}
                  onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                  className="rounded border-[var(--border)] accent-[var(--gold)] h-4 w-4"
                />
                <label htmlFor="isPublishedToggle" className="text-xs font-semibold text-[var(--foreground)] cursor-pointer">
                  {t("pc_published")}
                </label>
              </div>

              {/* Live Preview of the Simplified Public Card */}
              <div className="mt-5 pt-4 border-t border-[var(--gold)]/20 space-y-2">
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-[var(--gold)] flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" />
                  <span>{t("pc_preview")}</span>
                </span>

                <div
                  dir={activeLangTab === "ar" ? "rtl" : "ltr"}
                  className="surface-card frame-gold p-5 rounded-xl bg-[var(--card)] border border-[var(--gold)]/40 shadow-sm flex flex-col justify-between gap-3 text-start"
                >
                  <div>
                    <h4 className="font-serif font-bold text-base text-[var(--foreground)]">
                      {previewData.title}
                    </h4>
                    <p className="mt-1.5 text-xs text-[var(--muted-foreground)] leading-relaxed">
                      {previewData.description}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-[var(--gold)]/15">
                    <span className="btn-base btn-gold text-[11px] py-1.5 px-3 inline-flex items-center gap-1.5 shadow-sm pointer-events-none">
                      <ExternalLink className="h-3 w-3" />
                      <span>{t("card_open_link")}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-6 pt-4 border-t border-[var(--gold)]/25 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn-base btn-outline text-xs py-2 px-4 cursor-pointer"
                >
                  {t("pc_cancel")}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-base btn-gold text-xs py-2 px-5 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  <span>{t("pc_save")}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
