import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "../../context/TranslationContext";
import { api } from "../../api/client";
import { getApiErrorMessage } from "../../api/helpers";
import { notifyAdmin } from "../utils/notifications";
import { ListChecks, Loader2, Plus, RefreshCw, Trash2 } from "lucide-react";

type Tier = { id: number; slug: string; name: string };

type FeatureRow = {
  featureKey: string;
  label: string;
  tiers: Record<string, { enabled: boolean; tierSlug: string; tierName: string }>;
};

export default function TierFeatures() {
  const { t } = useTranslation();
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [features, setFeatures] = useState<FeatureRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyCell, setBusyCell] = useState<string | null>(null);
  const [newKey, setNewKey] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [tiersRes, featuresRes] = await Promise.all([
        api.get("/admin/subscription-tiers"),
        api.get("/admin/subscription-tier-features"),
      ]);
      setTiers(Array.isArray(tiersRes.data) ? tiersRes.data : []);
      setFeatures(Array.isArray(featuresRes.data) ? featuresRes.data : []);
    } catch (err) {
      setError(getApiErrorMessage(err, t("tier_features_failed", "Failed to load feature flags")));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void load();
  }, [load]);

  const toggle = async (tierId: number, featureKey: string, enabled: boolean) => {
    const cellKey = `${tierId}-${featureKey}`;
    setBusyCell(cellKey);
    try {
      const { data } = await api.put(`/admin/subscription-tier-features/${tierId}/${featureKey}`, { enabled });
      setFeatures(Array.isArray(data) ? data : features);
    } catch (err) {
      notifyAdmin(getApiErrorMessage(err, t("tier_feature_update_failed", "Failed to update feature flag")), "error");
    } finally {
      setBusyCell(null);
    }
  };

  const addFeature = async () => {
    if (!newKey.trim() || !newLabel.trim()) return;
    setCreating(true);
    try {
      const { data } = await api.post("/admin/subscription-tier-features", {
        featureKey: newKey.trim(),
        label: newLabel.trim(),
      });
      setFeatures(Array.isArray(data) ? data : features);
      setNewKey("");
      setNewLabel("");
      notifyAdmin(t("feature_added", "Feature added."));
    } catch (err) {
      notifyAdmin(getApiErrorMessage(err, t("feature_add_failed", "Failed to add feature")), "error");
    } finally {
      setCreating(false);
    }
  };

  const removeFeature = async (featureKey: string) => {
    try {
      const { data } = await api.delete(`/admin/subscription-tier-features/${featureKey}`);
      setFeatures(Array.isArray(data) ? data : features);
    } catch (err) {
      notifyAdmin(getApiErrorMessage(err, t("feature_remove_failed", "فشل حذف الميزة")), "error");
    }
  };

  const getTierName = (tier: Tier) => {
    const map: Record<string, string> = {
      free: t("tier_free", "المجانية"),
      basic: t("tier_basic", "الأساسية"),
      researcher: t("tier_researcher", "الباحث"),
      institution: t("tier_institution", "المؤسسات"),
    };
    const key = (tier.slug || tier.name || "").toLowerCase();
    return map[key] || t(`tier_${key}`, tier.name);
  };

  return (
    <div className="p-6 bg-[var(--background)] text-[var(--foreground)] min-h-screen">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <ListChecks className="w-8 h-8 text-[var(--gold)]" />
          <div>
            <h1 className="font-display text-2xl">{t("tier_features_title", "ميزات باقات الاشتراكات")}</h1>
            <p className="text-sm opacity-60 max-w-xl">
              {t(
                "tier_features_desc",
                "تحديد الميزات والصفحات المتاحة لكل باقة اشتراك في المنصة.",
              )}
            </p>
          </div>
        </div>
        <button
          onClick={() => void load()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-sm border border-[var(--border)] text-sm hover:bg-[var(--gold)]/10"
          title={t("refresh", "تحديث")}
          aria-label={t("refresh", "تحديث")}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          {t("refresh", "تحديث")}
        </button>
      </div>

      {error ? (
        <div className="rounded-sm border border-red-500/30 bg-red-500/10 p-4 text-red-500 mb-4">{error}</div>
      ) : null}

      <div className="surface-card p-5 mb-6">
        <p className="eyebrow mb-3">{t("add_feature", "إضافة ميزة")}</p>
        <div className="flex flex-wrap gap-3">
          <input
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            placeholder={t("feature_key_placeholder", "رمز الميزة باللغة اللاتينية (مثال: export_gedcom)")}
            className="flex-1 min-w-[200px] px-3 py-2 rounded-sm border border-[var(--border)] bg-[var(--background)] text-sm"
          />
          <input
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder={t("feature_label_placeholder", "اسم الميزة بالعربية")}
            className="flex-1 min-w-[200px] px-3 py-2 rounded-sm border border-[var(--border)] bg-[var(--background)] text-sm"
          />
          <button
            onClick={() => void addFeature()}
            disabled={creating || !newKey.trim() || !newLabel.trim()}
            className="btn-base btn-gold disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            {t("add", "إضافة")}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--gold)]" />
        </div>
      ) : features.length === 0 ? (
        <div className="surface-card p-10 text-center text-sm opacity-60">
          {t("no_features_yet", "لا توجد ميزات محددة بعد.")}
        </div>
      ) : (
        <div className="surface-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--primary)] border-b border-white/20">
                <th className="ltr:text-left rtl:text-right px-4 py-3.5 font-semibold text-white">{t("feature", "الميزة")}</th>
                {tiers.map((tier) => (
                  <th key={tier.id} className="text-center px-4 py-3.5 font-semibold text-white">
                    {getTierName(tier)}
                  </th>
                ))}
                <th className="px-4 py-3.5" />
              </tr>
            </thead>
            <tbody>
              {features.map((feature) => (
                <tr key={feature.featureKey} className="border-b border-[var(--border)] hover:bg-[var(--gold)]/5">
                  <td className="px-4 py-3 ltr:text-left rtl:text-right">
                    <div className="font-semibold">{feature.label}</div>
                    <div className="text-xs opacity-50 font-mono">{feature.featureKey}</div>
                  </td>
                  {tiers.map((tier) => {
                    const cell = feature.tiers[tier.id] ?? feature.tiers[String(tier.id)];
                    const cellKey = `${tier.id}-${feature.featureKey}`;
                    return (
                      <td key={tier.id} className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={Boolean(cell?.enabled)}
                          disabled={busyCell === cellKey}
                          onChange={(e) => void toggle(tier.id, feature.featureKey, e.target.checked)}
                          className="w-4 h-4 accent-[var(--gold)]"
                        />
                      </td>
                    );
                  })}
                  <td className="px-4 py-3">
                    <button
                      onClick={() => void removeFeature(feature.featureKey)}
                      className="p-1.5 rounded-sm bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-400"
                      title={t("delete", "حذف")}
                      aria-label={t("delete", "حذف")}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
