import { useState, useEffect } from "react";
import { useTranslation } from "../../context/TranslationContext";
import { api } from "../../api/client";
import {
  Crown,
  Save,
  CheckCircle2,
  Sliders,
  Layers,
  Network,
  Users,
  Archive,
  ListChecks,
  StickyNote,
  Image as ImageIcon,
  Music,
  FileText,
  DollarSign,
  RefreshCw,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  ShieldAlert,
} from "lucide-react";

interface Tier {
  id: number;
  name: string;
  price: number | string;
  interval: string;
  max_trees: number;
  max_individuals: number;
  max_sources: number;
  max_notes: number;
  max_tasks: number;
  max_gallery: number;
  max_audios: number;
  max_documents: number;
  badge?: string;
  description?: string;
  features?: string[];
}

export default function Subscriptions() {
  const { t, isRtl } = useTranslation();
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [savedSuccess, setSavedSuccess] = useState<number | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"limits" | "copy" | "features">("limits");

  const fetchTiers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/subscription-tiers");
      const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
      if (list.length > 0) {
        setTiers(list);
      } else {
        throw new Error("Empty tiers list");
      }
    } catch {
      // Default fallback tiers if offline
      setTiers([
        {
          id: 1,
          name: "Basic",
          price: "0.00",
          interval: "month",
          max_trees: 25,
          max_individuals: 25,
          max_sources: 25,
          max_notes: 25,
          max_tasks: 25,
          max_gallery: 25,
          max_audios: 25,
          max_documents: 25,
          badge: "Accès Gratuit",
          description: "Visualisation d’arbres généalogiques, consultation des répertoires de fonds d’archives et import/export GEDCOM.",
        },
        {
          id: 2,
          name: "Chercheur & Actes",
          price: "1.99",
          interval: "month",
          max_trees: 300,
          max_individuals: 6000,
          max_sources: 600,
          max_notes: 600,
          max_tasks: 600,
          max_gallery: 600,
          max_audios: 600,
          max_documents: 600,
          badge: "Le Plus Populaire — Actes & Registres",
          description: "Accès complet aux actes d’état civil, registres paroissiaux, sijillats notariés et décrets de naturalisation (1924–1927).",
        },
        {
          id: 3,
          name: "Historien & Généalogie Pro",
          price: "3.99",
          interval: "month",
          max_trees: 3000,
          max_individuals: 30000,
          max_sources: 3000,
          max_notes: 3000,
          max_tasks: 3000,
          max_gallery: 3000,
          max_audios: 3000,
          max_documents: 3000,
          badge: "Recherche Avancée & Assistance Dédiée",
          description: "Assistance aux recherches ciblées, déchiffrage de manuscrits (arabe, ottoman, italien) et accès prioritaire aux nouveaux fonds.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTiers();
  }, []);

  const handleUpdateTierField = (tierId: number, field: keyof Tier, val: any) => {
    setTiers((prev) =>
      prev.map((t) => (t.id === tierId ? { ...t, [field]: val } : t))
    );
  };

  const handleSaveTier = async (tier: Tier) => {
    setSavingId(tier.id);
    setSaveError(null);
    try {
      const contentPayload: Record<string, unknown> = {
        name: tier.name,
        price: Number(tier.price) || 0,
        badge: tier.badge || "",
        description: tier.description || "",
      };
      if (tier.features !== undefined) {
        contentPayload.features = tier.features;
      }

      // 1. Persist public copy (name/price/badge/description) to DB
      await api.patch(`/admin/subscription-tiers/${tier.id}`, contentPayload);

      // 2. Persist quota limits to DB
      await api.patch(`/admin/subscription-tiers/${tier.id}/limits`, {
        max_trees: Number(tier.max_trees),
        max_individuals: Number(tier.max_individuals),
        max_sources: Number(tier.max_sources),
        max_notes: Number(tier.max_notes),
        max_tasks: Number(tier.max_tasks),
        max_gallery: Number(tier.max_gallery),
        max_audios: Number(tier.max_audios),
        max_documents: Number(tier.max_documents),
      });

      // Optional local cache only — API is the source of truth
      try {
        localStorage.setItem(`roots_tier_config_${tier.id}`, JSON.stringify(tier));
      } catch {
        /* ignore quota/private-mode failures */
      }

      await fetchTiers();
      setSavedSuccess(tier.id);
      setTimeout(() => setSavedSuccess(null), 3000);
    } catch (err: any) {
      const msg =
        err?.userMessage ||
        err?.response?.data?.message ||
        err?.message ||
        t("tier_save_failed", "فشل حفظ الباقة. حاول مرة أخرى.");
      setSaveError(String(Array.isArray(msg) ? msg.join(", ") : msg));
      console.warn("Failed saving tier:", err);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="space-y-6 text-start">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--gold)]/20">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-xl bg-[var(--gold)]/20 text-[var(--gold)] border border-[var(--gold)]/30">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-[var(--foreground)]">
                {t("unified_subscriptions_title", "إدارة باقات الاشتراكات الموحدة (Subscriptions & Quotas)")}
              </h1>
              <p className="text-xs text-[var(--muted-foreground)]">
                {t(
                  "unified_subscriptions_subtitle",
                  "تعديل الحدود الفعلية لكل باقة وتحديث النصوص والأسعار المعروضة للمستخدمين في الموقع العام"
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Section Mode Switcher */}
          <div className="flex items-center gap-1 p-1 rounded-xl border border-[var(--border)] bg-[var(--background)]">
            <button
              type="button"
              onClick={() => setActiveTab("limits")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "limits"
                  ? "bg-[var(--gold)] text-black shadow"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              {t("real_limits_tab", "الحدود والسعات الفعلية")}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("copy")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "copy"
                  ? "bg-[var(--gold)] text-black shadow"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              {t("public_copy_tab", "النصوص والأسعار العامة")}
            </button>
          </div>

          <button
            onClick={fetchTiers}
            title={t("refresh", "تحديث")}
            className="p-2 rounded-xl border border-[var(--border)] bg-[var(--background)] hover:border-[var(--gold)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {tiers.map((tier) => {
            const isSaving = savingId === tier.id;
            const isSaved = savedSuccess === tier.id;
            const accent =
              tier.id === 3
                ? "border-amber-500 shadow-amber-500/10"
                : tier.id === 2
                ? "border-[var(--gold)] shadow-[var(--gold)]/10"
                : "border-[var(--border)]";

            return (
              <div
                key={tier.id}
                className={`p-6 rounded-3xl border-2 ${accent} bg-[var(--card)] shadow-lg flex flex-col justify-between space-y-6 relative overflow-hidden`}
              >
                {/* Header Badge */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display text-xl font-bold text-[var(--foreground)]">
                      {tier.name}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[0.65rem] font-bold bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30">
                      Tier #{tier.id}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-3xl font-extrabold text-[var(--gold)]">
                      ${Number.isFinite(Number(tier.price)) ? Number(tier.price).toFixed(2) : "0.00"}
                    </span>
                    <span className="text-xs text-[var(--muted-foreground)]">/ month</span>
                  </div>
                </div>

                {/* TAB 1: Real Limits & Quotas */}
                {activeTab === "limits" && (
                  <div className="space-y-3 pt-2 border-t border-[var(--border)]">
                    <span className="text-[0.68rem] uppercase tracking-wider text-[var(--gold)] font-bold block">
                      {t("real_limits_control", "الحدود والسعات الفعلية المسموحة:")}
                    </span>

                    {/* Limits Rows */}
                    <div className="space-y-2 text-xs">
                      {/* Trees */}
                      <div className="flex items-center justify-between p-2 rounded-xl bg-[var(--background)] border border-[var(--border)]">
                        <span className="flex items-center gap-1.5 font-medium text-[var(--foreground)]">
                          <Network className="w-3.5 h-3.5 text-[var(--gold)]" />
                          <span>{t("trees_limit", "شجرات العائلة المتاحة:")}</span>
                        </span>
                        <input
                          type="number"
                          value={tier.max_trees}
                          onChange={(e) =>
                            handleUpdateTierField(tier.id, "max_trees", parseInt(e.target.value) || 0)
                          }
                          className="w-20 px-2 py-1 text-center rounded-lg border border-[var(--border)] bg-[var(--card)] font-bold text-xs outline-none focus:border-[var(--gold)]"
                        />
                      </div>

                      {/* Individuals */}
                      <div className="flex items-center justify-between p-2 rounded-xl bg-[var(--background)] border border-[var(--border)]">
                        <span className="flex items-center gap-1.5 font-medium text-[var(--foreground)]">
                          <Users className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{t("individuals_limit", "أفراد العائلة والأشخاص:")}</span>
                        </span>
                        <input
                          type="number"
                          value={tier.max_individuals}
                          onChange={(e) =>
                            handleUpdateTierField(tier.id, "max_individuals", parseInt(e.target.value) || 0)
                          }
                          className="w-20 px-2 py-1 text-center rounded-lg border border-[var(--border)] bg-[var(--card)] font-bold text-xs outline-none focus:border-[var(--gold)]"
                        />
                      </div>

                      {/* Sources */}
                      <div className="flex items-center justify-between p-2 rounded-xl bg-[var(--background)] border border-[var(--border)]">
                        <span className="flex items-center gap-1.5 font-medium text-[var(--foreground)]">
                          <Archive className="w-3.5 h-3.5 text-sky-500" />
                          <span>{t("sources_limit", "المصادر والمراجع المحفوظة:")}</span>
                        </span>
                        <input
                          type="number"
                          value={tier.max_sources}
                          onChange={(e) =>
                            handleUpdateTierField(tier.id, "max_sources", parseInt(e.target.value) || 0)
                          }
                          className="w-20 px-2 py-1 text-center rounded-lg border border-[var(--border)] bg-[var(--card)] font-bold text-xs outline-none focus:border-[var(--gold)]"
                        />
                      </div>

                      {/* Notes */}
                      <div className="flex items-center justify-between p-2 rounded-xl bg-[var(--background)] border border-[var(--border)]">
                        <span className="flex items-center gap-1.5 font-medium text-[var(--foreground)]">
                          <StickyNote className="w-3.5 h-3.5 text-amber-500" />
                          <span>{t("notes_limit", "الملاحظات والمسودات:")}</span>
                        </span>
                        <input
                          type="number"
                          value={tier.max_notes}
                          onChange={(e) =>
                            handleUpdateTierField(tier.id, "max_notes", parseInt(e.target.value) || 0)
                          }
                          className="w-20 px-2 py-1 text-center rounded-lg border border-[var(--border)] bg-[var(--card)] font-bold text-xs outline-none focus:border-[var(--gold)]"
                        />
                      </div>

                      {/* Tasks */}
                      <div className="flex items-center justify-between p-2 rounded-xl bg-[var(--background)] border border-[var(--border)]">
                        <span className="flex items-center gap-1.5 font-medium text-[var(--foreground)]">
                          <ListChecks className="w-3.5 h-3.5 text-purple-500" />
                          <span>{t("tasks_limit", "مهام البحث والتوثيق:")}</span>
                        </span>
                        <input
                          type="number"
                          value={tier.max_tasks}
                          onChange={(e) =>
                            handleUpdateTierField(tier.id, "max_tasks", parseInt(e.target.value) || 0)
                          }
                          className="w-20 px-2 py-1 text-center rounded-lg border border-[var(--border)] bg-[var(--card)] font-bold text-xs outline-none focus:border-[var(--gold)]"
                        />
                      </div>

                      {/* Gallery */}
                      <div className="flex items-center justify-between p-2 rounded-xl bg-[var(--background)] border border-[var(--border)]">
                        <span className="flex items-center gap-1.5 font-medium text-[var(--foreground)]">
                          <ImageIcon className="w-3.5 h-3.5 text-pink-500" />
                          <span>{t("gallery_limit", "صور المعرض التاريخي:")}</span>
                        </span>
                        <input
                          type="number"
                          value={tier.max_gallery}
                          onChange={(e) =>
                            handleUpdateTierField(tier.id, "max_gallery", parseInt(e.target.value) || 0)
                          }
                          className="w-20 px-2 py-1 text-center rounded-lg border border-[var(--border)] bg-[var(--card)] font-bold text-xs outline-none focus:border-[var(--gold)]"
                        />
                      </div>

                      {/* Audios */}
                      <div className="flex items-center justify-between p-2 rounded-xl bg-[var(--background)] border border-[var(--border)]">
                        <span className="flex items-center gap-1.5 font-medium text-[var(--foreground)]">
                          <Music className="w-3.5 h-3.5 text-teal-500" />
                          <span>{t("audios_limit", "التسجيلات الصوتية:")}</span>
                        </span>
                        <input
                          type="number"
                          value={tier.max_audios}
                          onChange={(e) =>
                            handleUpdateTierField(tier.id, "max_audios", parseInt(e.target.value) || 0)
                          }
                          className="w-20 px-2 py-1 text-center rounded-lg border border-[var(--border)] bg-[var(--card)] font-bold text-xs outline-none focus:border-[var(--gold)]"
                        />
                      </div>

                      {/* Documents */}
                      <div className="flex items-center justify-between p-2 rounded-xl bg-[var(--background)] border border-[var(--border)]">
                        <span className="flex items-center gap-1.5 font-medium text-[var(--foreground)]">
                          <FileText className="w-3.5 h-3.5 text-orange-500" />
                          <span>{t("documents_limit", "الوثائق والمخطوطات:")}</span>
                        </span>
                        <input
                          type="number"
                          value={tier.max_documents}
                          onChange={(e) =>
                            handleUpdateTierField(tier.id, "max_documents", parseInt(e.target.value) || 0)
                          }
                          className="w-20 px-2 py-1 text-center rounded-lg border border-[var(--border)] bg-[var(--card)] font-bold text-xs outline-none focus:border-[var(--gold)]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: Public Website Text & Copy */}
                {activeTab === "copy" && (
                  <div className="space-y-3 pt-2 border-t border-[var(--border)]">
                    <span className="text-[0.68rem] uppercase tracking-wider text-[var(--gold)] font-bold block">
                      {t("public_display_text", "النصوص المعروضة على الموقع العام:")}
                    </span>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-[0.7rem] font-bold text-[var(--muted-foreground)] mb-1">
                          {t("tier_display_name", "اسم الباقة الظاهر:")}
                        </label>
                        <input
                          type="text"
                          value={tier.name}
                          onChange={(e) => handleUpdateTierField(tier.id, "name", e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-[0.7rem] font-bold text-[var(--muted-foreground)] mb-1">
                          {t("monthly_usd_price", "السعر الشهري بالدولار ($):")}
                        </label>
                        <input
                          type="text"
                          value={tier.price}
                          onChange={(e) => handleUpdateTierField(tier.id, "price", e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] font-bold font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[0.7rem] font-bold text-[var(--muted-foreground)] mb-1">
                          {t("badge_display_text", "شريط التمييز العلوي (Badge):")}
                        </label>
                        <input
                          type="text"
                          value={tier.badge || ""}
                          onChange={(e) => handleUpdateTierField(tier.id, "badge", e.target.value)}
                          placeholder="مثال: الخطة النشطة الحالية"
                          className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)]"
                        />
                      </div>

                      <div>
                        <label className="block text-[0.7rem] font-bold text-[var(--muted-foreground)] mb-1">
                          {t("tier_desc_text", "الوصف الترويجي للباقة:")}
                        </label>
                        <textarea
                          rows={2}
                          value={tier.description || ""}
                          onChange={(e) => handleUpdateTierField(tier.id, "description", e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] resize-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Save Button for Tier */}
                <div className="pt-2">
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => handleSaveTier(tier)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[var(--gold)] to-amber-500 text-black font-bold text-xs flex items-center justify-center gap-2 shadow hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSaving ? (
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>
                      {t("save_tier_limits", "حفظ وتطبيق حدود باقة")} {tier.name}
                    </span>
                  </button>

                  {isSaved && (
                    <div className="mt-2 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-center gap-1.5 animate-in fade-in">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t("tier_saved_success", "تم تطبيق الحدود على قواعد البيانات والموقع العام!")}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {saveError ? (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-sm font-bold flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{saveError}</span>
        </div>
      ) : null}
    </div>
  );
}
