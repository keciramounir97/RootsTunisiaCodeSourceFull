import { useState, useEffect } from "react";
import { useTranslation } from "../../context/TranslationContext";
import { api } from "../../api/client";
import { Search, Edit3, Loader2, Save, ShieldAlert, Crown } from "lucide-react";

export default function Subscriptions() {
  const { t } = useTranslation();
  const [tiers, setTiers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editLimits, setEditLimits] = useState<{
    max_trees: number;
    max_gallery: number;
    max_audios: number;
    max_documents: number;
    max_individuals: number;
    max_sources: number;
    max_notes: number;
    max_tasks: number;
  }>({
    max_trees: 25,
    max_gallery: 25,
    max_audios: 25,
    max_documents: 25,
    max_individuals: 25,
    max_sources: 25,
    max_notes: 25,
    max_tasks: 25,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: string; text: string }>({ type: "", text: "" });

  const fetchTiers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/subscription-tiers");
      setTiers(Array.isArray(res.data) ? res.data : res.data?.data || []);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTiers();
  }, []);

  const startEdit = (tier: any) => {
    setEditingId(tier.id);
    setEditLimits({
      max_trees: tier.max_trees ?? 25,
      max_gallery: tier.max_gallery ?? 25,
      max_audios: tier.max_audios ?? 25,
      max_documents: tier.max_documents ?? 25,
      max_individuals: tier.max_individuals ?? 25,
      max_sources: tier.max_sources ?? 25,
      max_notes: tier.max_notes ?? 25,
      max_tasks: tier.max_tasks ?? 25,
    });
    setMessage({ type: "", text: "" });
  };

  const handleSaveLimits = async (tierId: number) => {
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      await api.patch(`/admin/subscription-tiers/${tierId}/limits`, editLimits);
      setMessage({ type: "success", text: `Creation quotas updated for Tier #${tierId}!` });
      setEditingId(null);
      fetchTiers();
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to update quotas" });
    } finally {
      setSaving(false);
    }
  };

  const filtered = tiers.filter((t) =>
    (t.name || "").toLowerCase().includes(search.toLowerCase())
  );

  const formatLimit = (val: number | null | undefined) => {
    if (val === -1 || val === null || val === undefined) return "∞ Unlimited";
    return String(val);
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#d9a441]" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Crown className="w-8 h-8 text-[#d9a441]" />
          <div>
            <h1 className="text-2xl font-bold font-cinzel text-[var(--text-color)]">
              {t("subscription_tiers_quotas", "Subscription Tiers & Creation Limits")}
            </h1>
            <p className="text-xs text-[var(--text-color)] opacity-70">
              Super Admin Control: Configure creation quotas (trees, gallery, audio, docs, individuals, sources, notes, tasks) per tier. Use -1 for unlimited.
            </p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("search_tiers", "Search tiers...")}
            className="pl-9 pr-4 py-2 rounded-xl border border-[var(--border-color)] bg-white dark:bg-[#1a2e2d] text-sm w-full sm:w-56 outline-none focus:ring-2 focus:ring-[#d9a441]/30"
          />
        </div>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-sm ${
            message.type === "success"
              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
              : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
          }`}
        >
          <ShieldAlert className="w-5 h-5 shrink-0" />
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((tier) => {
          const isEditing = editingId === tier.id;
          return (
            <div
              key={tier.id}
              className="rounded-2xl border border-[var(--border-color)] bg-white dark:bg-[#1a2e2d] p-6 shadow-md flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3 mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {tier.name}
                    </h2>
                    <p className="text-xs text-[#d9a441] font-semibold">
                      ${tier.price} / {tier.interval || "month"}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                    Active
                  </span>
                </div>

                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-color)] opacity-60 mb-3">
                  Resource Creation Quotas:
                </h3>

                {isEditing ? (
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block font-semibold mb-1">Max Trees (-1 for ∞):</label>
                      <input
                        type="number"
                        value={editLimits.max_trees}
                        onChange={(e) =>
                          setEditLimits({ ...editLimits, max_trees: parseInt(e.target.value) || 0 })
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-[var(--border-color)] bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Max Individuals (-1 for ∞):</label>
                      <input
                        type="number"
                        value={editLimits.max_individuals}
                        onChange={(e) =>
                          setEditLimits({ ...editLimits, max_individuals: parseInt(e.target.value) || 0 })
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-[var(--border-color)] bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Max Saved Sources (-1 for ∞):</label>
                      <input
                        type="number"
                        value={editLimits.max_sources}
                        onChange={(e) =>
                          setEditLimits({ ...editLimits, max_sources: parseInt(e.target.value) || 0 })
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-[var(--border-color)] bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Max Research Notes (-1 for ∞):</label>
                      <input
                        type="number"
                        value={editLimits.max_notes}
                        onChange={(e) =>
                          setEditLimits({ ...editLimits, max_notes: parseInt(e.target.value) || 0 })
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-[var(--border-color)] bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Max Research Tasks (-1 for ∞):</label>
                      <input
                        type="number"
                        value={editLimits.max_tasks}
                        onChange={(e) =>
                          setEditLimits({ ...editLimits, max_tasks: parseInt(e.target.value) || 0 })
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-[var(--border-color)] bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Max Gallery Images (-1 for ∞):</label>
                      <input
                        type="number"
                        value={editLimits.max_gallery}
                        onChange={(e) =>
                          setEditLimits({ ...editLimits, max_gallery: parseInt(e.target.value) || 0 })
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-[var(--border-color)] bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Max Audios (-1 for ∞):</label>
                      <input
                        type="number"
                        value={editLimits.max_audios}
                        onChange={(e) =>
                          setEditLimits({ ...editLimits, max_audios: parseInt(e.target.value) || 0 })
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-[var(--border-color)] bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Max Documents (-1 for ∞):</label>
                      <input
                        type="number"
                        value={editLimits.max_documents}
                        onChange={(e) =>
                          setEditLimits({ ...editLimits, max_documents: parseInt(e.target.value) || 0 })
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-[var(--border-color)] bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                ) : (
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex justify-between items-center py-1 border-b border-gray-100 dark:border-gray-800">
                      <span>🌳 Family Trees:</span>
                      <span className="font-bold font-mono text-[#d9a441]">{formatLimit(tier.max_trees)}</span>
                    </li>
                    <li className="flex justify-between items-center py-1 border-b border-gray-100 dark:border-gray-800">
                      <span>👤 Individuals:</span>
                      <span className="font-bold font-mono text-[#d9a441]">{formatLimit(tier.max_individuals)}</span>
                    </li>
                    <li className="flex justify-between items-center py-1 border-b border-gray-100 dark:border-gray-800">
                      <span>🏛️ Saved Sources:</span>
                      <span className="font-bold font-mono text-[#d9a441]">{formatLimit(tier.max_sources)}</span>
                    </li>
                    <li className="flex justify-between items-center py-1 border-b border-gray-100 dark:border-gray-800">
                      <span>📝 Research Notes:</span>
                      <span className="font-bold font-mono text-[#d9a441]">{formatLimit(tier.max_notes)}</span>
                    </li>
                    <li className="flex justify-between items-center py-1 border-b border-gray-100 dark:border-gray-800">
                      <span>✅ Research Tasks:</span>
                      <span className="font-bold font-mono text-[#d9a441]">{formatLimit(tier.max_tasks)}</span>
                    </li>
                    <li className="flex justify-between items-center py-1 border-b border-gray-100 dark:border-gray-800">
                      <span>🖼️ Gallery Images:</span>
                      <span className="font-bold font-mono text-[#d9a441]">{formatLimit(tier.max_gallery)}</span>
                    </li>
                    <li className="flex justify-between items-center py-1 border-b border-gray-100 dark:border-gray-800">
                      <span>🎵 Audios:</span>
                      <span className="font-bold font-mono text-[#d9a441]">{formatLimit(tier.max_audios)}</span>
                    </li>
                    <li className="flex justify-between items-center py-1 border-b border-gray-100 dark:border-gray-800">
                      <span>📄 Documents:</span>
                      <span className="font-bold font-mono text-[#d9a441]">{formatLimit(tier.max_documents)}</span>
                    </li>
                  </ul>
                )}
              </div>

              <div className="pt-4 border-t border-[var(--border-color)] flex justify-end gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => setEditingId(null)}
                      disabled={saving}
                      className="px-3 py-1.5 rounded-lg border text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSaveLimits(tier.id)}
                      disabled={saving}
                      className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#d9a441] to-[#e8c377] text-[#092C2B] font-bold text-xs flex items-center gap-1.5 shadow"
                    >
                      {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                      Save Quotas
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => startEdit(tier)}
                    className="w-full py-2 rounded-xl border border-[#d9a441]/40 text-[#d9a441] hover:bg-[#d9a441]/10 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit Creation Quotas
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
