import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "../../context/TranslationContext";
import { api } from "../../api/client";
import { getApiErrorMessage } from "../../api/helpers";
import { notifyAdmin } from "../utils/notifications";
import { ListChecks, Loader2, Plus, RefreshCw, Trash2, ShieldCheck, Layers } from "lucide-react";

type Tier = { id: number; slug: string; name: string };

type FeatureRow = {
  featureKey: string;
  label: string;
  tiers: Record<string, { enabled: boolean; tierSlug?: string; tierName?: string }>;
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
      const rawTiers = Array.isArray(tiersRes.data) ? tiersRes.data : tiersRes.data?.data || [];
      const rawFeatures = Array.isArray(featuresRes.data) ? featuresRes.data : featuresRes.data?.data || [];
      setTiers(rawTiers);
      setFeatures(rawFeatures);
    } catch (err) {
      setError(getApiErrorMessage(err, t("tier_features_failed", "Impossible de charger la matrice des fonctionnalités.")));
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
      const nextFeatures = Array.isArray(data) ? data : data?.data || features;
      setFeatures(nextFeatures);
      notifyAdmin(t("tier_feature_updated", "Mise à jour effectuée."));
    } catch (err) {
      notifyAdmin(getApiErrorMessage(err, t("tier_feature_update_failed", "Échec de la mise à jour")), "error");
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
      const nextFeatures = Array.isArray(data) ? data : data?.data || features;
      setFeatures(nextFeatures);
      setNewKey("");
      setNewLabel("");
      notifyAdmin(t("feature_added", "Fonctionnalité ajoutée avec succès."));
    } catch (err) {
      notifyAdmin(getApiErrorMessage(err, t("feature_add_failed", "Échec de l'ajout de la fonctionnalité")), "error");
    } finally {
      setCreating(false);
    }
  };

  const removeFeature = async (featureKey: string) => {
    if (!window.confirm(t("confirm_delete_feature", "Voulez-vous supprimer cette fonctionnalité ?"))) return;
    try {
      const { data } = await api.delete(`/admin/subscription-tier-features/${featureKey}`);
      const nextFeatures = Array.isArray(data) ? data : data?.data || features;
      setFeatures(nextFeatures);
      notifyAdmin(t("feature_removed", "Fonctionnalité supprimée."));
    } catch (err) {
      notifyAdmin(getApiErrorMessage(err, t("feature_remove_failed", "Échec de la suppression")), "error");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#0d9488]/20 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#0d9488]/15 border border-[#0d9488]/30 flex items-center justify-center text-[#0d9488]">
            <ListChecks className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-cinzel text-2xl font-bold text-[#0c4a6e] dark:text-[#0d9488]">
              {t("tier_features_title", "Gestion des Fonctionnalités par Offre")}
            </h1>
            <p className="text-xs text-stone-500 dark:text-stone-400 max-w-2xl mt-0.5">
              {t(
                "tier_features_desc",
                "Configurez les droits et fonctionnalités débloqués pour chaque niveau d'abonnement (Gratuit, Premium, Pro, etc.).",
              )}
            </p>
          </div>
        </div>
        <button
          onClick={() => void load()}
          className="interactive-btn btn-neu px-4 py-2 text-xs flex items-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#0d9488] ${loading ? "animate-spin" : ""}`} />
          {t("refresh", "Actualiser")}
        </button>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-600 text-xs font-semibold">
          {error}
        </div>
      ) : null}

      {/* CREATE FEATURE CARD */}
      <div className="neu-card p-5 rounded-2xl border border-[#0d9488]/20 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#0c4a6e] dark:text-[#0d9488]">
          <Plus className="w-4 h-4 text-[#0d9488]" />
          <span>{t("add_feature", "Ajouter une nouvelle fonctionnalité")}</span>
        </div>
        <div className="flex flex-wrap gap-3">
          <input
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            placeholder={t("feature_key_placeholder", "clé (ex. priority_download)")}
            className="neu-field flex-1 min-w-[200px] px-3.5 py-2 text-xs"
          />
          <input
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder={t("feature_label_placeholder", "Libellé d'affichage (ex. Téléchargement prioritaire)")}
            className="neu-field flex-1 min-w-[220px] px-3.5 py-2 text-xs"
          />
          <button
            onClick={() => void addFeature()}
            disabled={creating || !newKey.trim() || !newLabel.trim()}
            className="interactive-btn btn-neu btn-neu--primary px-5 py-2 text-xs flex items-center gap-1.5 disabled:opacity-50"
          >
            {creating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
            {t("add", "Ajouter")}
          </button>
        </div>
      </div>

      {/* MATRIX TABLE */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#0d9488]" />
        </div>
      ) : features.length === 0 ? (
        <div className="neu-inset p-12 rounded-2xl text-center text-xs italic text-stone-500 dark:text-stone-400">
          <Layers className="w-10 h-10 mx-auto text-[#0d9488] opacity-40 mb-2" />
          {t("no_features_yet", "Aucune fonctionnalité configurée pour le moment.")}
        </div>
      ) : (
        <div className="neu-card rounded-2xl border border-[#0d9488]/20 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[#0c4a6e] text-white border-b border-[#0d9488]/30">
                  <th className="text-left px-4 py-3.5 font-bold uppercase tracking-wider">{t("feature", "Fonctionnalité")}</th>
                  {tiers.map((tier) => (
                    <th key={tier.id} className="text-center px-4 py-3.5 font-bold uppercase tracking-wider">
                      {tier.name}
                    </th>
                  ))}
                  <th className="px-4 py-3.5 w-16" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0d9488]/15">
                {features.map((feature) => (
                  <tr
                    key={feature.featureKey}
                    className="hover:bg-[#0d9488]/5 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="font-bold text-[#0c4a6e] dark:text-[#0d9488]">{feature.label}</div>
                      <div className="text-[10px] font-mono opacity-60 mt-0.5">{feature.featureKey}</div>
                    </td>
                    {tiers.map((tier) => {
                      const cell = feature.tiers?.[tier.id] || feature.tiers?.[String(tier.id)];
                      const cellKey = `${tier.id}-${feature.featureKey}`;
                      const isBusy = busyCell === cellKey;
                      return (
                        <td key={tier.id} className="px-4 py-3 text-center">
                          <input
                            type="checkbox"
                            checked={Boolean(cell?.enabled)}
                            disabled={isBusy}
                            onChange={(e) => void toggle(tier.id, feature.featureKey, e.target.checked)}
                            className="w-4 h-4 accent-[#0d9488] cursor-pointer disabled:opacity-40"
                          />
                        </td>
                      );
                    })}
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => void removeFeature(feature.featureKey)}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/15 transition-colors"
                        title={t("delete", "Supprimer")}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
