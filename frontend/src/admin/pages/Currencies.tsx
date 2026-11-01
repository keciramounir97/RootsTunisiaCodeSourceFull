import { useEffect, useState } from "react";
import {
  Coins,
  Plus,
  Trash2,
  Save,
  Check,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Globe,
  ArrowRightLeft,
} from "lucide-react";
import { api } from "../../api/client";
import { useTranslation } from "../../context/TranslationContext";
import { useCurrency, type CurrencyItem } from "../../context/CurrencyContext";

export default function Currencies() {
  const { t, isRtl } = useTranslation();
  const { refreshCurrencies: refreshGlobalRates } = useCurrency();

  const [currencies, setCurrencies] = useState<CurrencyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // New currency form state
  const [newCode, setNewCode] = useState("");
  const [newName, setNewName] = useState("");
  const [newSymbol, setNewSymbol] = useState("");
  const [newRate, setNewRate] = useState<string>("1.00");
  const [adding, setAdding] = useState(false);

  const fetchCurrencies = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/admin/currencies");
      const items = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
      setCurrencies(items);
    } catch {
      setStatusMessage({ type: "error", text: t("currencies_load_failed", "Impossible de charger les taux de change.") });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchCurrencies();
  }, []);

  const handleUpdate = async (curr: CurrencyItem) => {
    setSavingId(curr.id);
    setStatusMessage(null);
    try {
      await api.put(`/admin/currencies/${curr.id}`, {
        name: curr.name,
        symbol: curr.symbol,
        rate: Number(curr.rate),
        is_active: curr.is_active,
      });
      await refreshGlobalRates();
      setStatusMessage({
        type: "success",
        text: t("currency_updated_success", `Taux de change pour ${curr.code} mis à jour avec succès. Visible sur tout le site !`),
      });
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err?.response?.data?.message || t("currency_update_failed", "Échec de la mise à jour."),
      });
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id: number, code: string) => {
    if (!window.confirm(t("confirm_delete_currency", `Supprimer la devise ${code} ?`))) return;
    try {
      await api.delete(`/admin/currencies/${id}`);
      setCurrencies((prev) => prev.filter((c) => c.id !== id));
      await refreshGlobalRates();
      setStatusMessage({ type: "success", text: t("currency_deleted", `Devise ${code} supprimée.`) });
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err?.response?.data?.message || t("currency_delete_failed", "Impossible de supprimer cette devise."),
      });
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    setAdding(true);
    setStatusMessage(null);
    try {
      const payload = {
        code: newCode.trim().toUpperCase(),
        name: newName.trim() || newCode.trim().toUpperCase(),
        symbol: newSymbol.trim() || newCode.trim().toUpperCase(),
        rate: parseFloat(newRate) || 1.0,
      };
      const { data } = await api.post("/admin/currencies", payload);
      const created = data?.data || data;
      setCurrencies((prev) => [...prev.filter((c) => c.code !== created.code), created]);
      await refreshGlobalRates();

      setNewCode("");
      setNewName("");
      setNewSymbol("");
      setNewRate("1.00");
      setStatusMessage({
        type: "success",
        text: t("currency_added_success", `Nouvelle devise ${payload.code} ajoutée avec succès !`),
      });
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err?.response?.data?.message || t("currency_add_failed", "Échec de l'ajout de la devise."),
      });
    } finally {
      setAdding(false);
    }
  };

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto text-[var(--foreground)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--gold)]/20 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30">
            <Coins className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display tracking-tight text-[var(--foreground)]">
              {t("currencies_management_title", "Taux de Change & Devises")}
            </h1>
            <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
              {t("currencies_management_desc", "Gérez les devises disponibles et leurs taux de change. Toute modification est immédiatement appliquée à l'ensemble du site.")}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={fetchCurrencies}
          disabled={loading}
          className="btn-base btn-outline-light text-xs py-2 px-4 flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>{t("refresh", "Actualiser")}</span>
        </button>
      </div>

      {/* Real-time Global Sync Banner */}
      <div className="p-4 rounded-xl border border-[var(--gold)]/40 bg-[var(--gold)]/10 text-[var(--foreground)] flex items-start gap-3 shadow-sm">
        <Globe className="h-5 w-5 text-[var(--gold)] shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm space-y-1">
          <strong className="font-bold text-[var(--gold)]">
            {t("realtime_sync_notice", "Synchronisation Mondiale en Temps Réel")}
          </strong>
          <p className="text-[var(--muted-foreground)]">
            {t(
              "realtime_sync_help",
              "Lorsque vous modifiez ou ajoutez un taux de change ici en tant que Super Admin, tous les visiteurs et clients du site verront instantanément les tarifs d'abonnement et de paiement convertis selon votre nouveau taux.",
            )}
          </p>
        </div>
      </div>

      {/* Status Alert */}
      {statusMessage && (
        <div
          className={`p-4 rounded-lg text-sm flex items-center gap-3 shadow-md ${
            statusMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-300 dark:bg-rose-950/80 dark:text-rose-200"
          }`}
        >
          {statusMessage.type === "success" ? (
            <Check className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Add New Currency Form */}
      <div className="surface-card frame-gold p-5 sm:p-6 rounded-xl space-y-4">
        <h2 className="text-base font-bold flex items-center gap-2 text-[var(--gold)]">
          <Plus className="h-4 w-4" />
          <span>{t("add_new_currency", "Ajouter une Devise & Définir son Taux")}</span>
        </h2>

        <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-end">
          <div>
            <label className="block text-xs font-semibold mb-1 text-[var(--muted-foreground)]">
              {t("currency_abbreviation", "Code / Abréviation (ex: TND, EUR, CAD)")}
            </label>
            <input
              type="text"
              required
              maxLength={10}
              placeholder="ex: TND"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] uppercase font-mono font-bold outline-none focus:border-[var(--gold)]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-[var(--muted-foreground)]">
              {t("currency_name", "Nom de la Devise (ex: Dinar Tunisien)")}
            </label>
            <input
              type="text"
              placeholder="ex: Dinar Tunisien"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-[var(--muted-foreground)]">
              {t("currency_symbol", "Symbole (ex: DT, $, €)")}
            </label>
            <input
              type="text"
              placeholder="ex: DT"
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-[var(--muted-foreground)]">
              {t("exchange_rate_relative_usd", "Taux de Change (1 USD = X)")}
            </label>
            <input
              type="number"
              step="0.0001"
              min="0.0001"
              required
              placeholder="ex: 3.1500"
              value={newRate}
              onChange={(e) => setNewRate(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] font-mono font-bold outline-none focus:border-[var(--gold)]"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={adding || !newCode.trim()}
              className="btn-base btn-gold w-full py-2.5 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow"
            >
              <Plus className="h-4 w-4" />
              <span>{adding ? t("adding", "Ajout...") : t("add_currency_btn", "Ajouter la devise")}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Currencies Grid & Table */}
      <div className="surface-card frame-gold rounded-xl overflow-hidden shadow-lg border border-[var(--gold)]/30">
        <div className="p-4 sm:p-5 border-b border-[var(--gold)]/20 flex items-center justify-between">
          <h3 className="font-bold text-base flex items-center gap-2">
            <ArrowRightLeft className="h-4 w-4 text-[var(--gold)]" />
            <span>{t("active_currencies_list", "Devises & Taux de Change Actifs")} ({currencies.length})</span>
          </h3>
          <span className="text-xs text-[var(--muted-foreground)] font-mono">
            {t("base_currency_note", "Devise de référence: USD ($1.00)")}
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-9 h-9 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : currencies.length === 0 ? (
          <div className="p-12 text-center text-sm text-[var(--muted-foreground)]">
            {t("no_currencies_configured", "Aucune devise configurée.")}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs sm:text-sm">
              <thead className="bg-[var(--gold)]/10 text-[var(--gold)] uppercase text-[0.7rem] tracking-wider border-b border-[var(--gold)]/20">
                <tr>
                  <th className="py-3 px-4 text-start">{t("code", "Code / Abréviation")}</th>
                  <th className="py-3 px-4 text-start">{t("name", "Nom")}</th>
                  <th className="py-3 px-4 text-start">{t("symbol", "Symbole")}</th>
                  <th className="py-3 px-4 text-start">{t("exchange_rate", "Taux de Change (pour 1 USD)")}</th>
                  <th className="py-3 px-4 text-start">{t("preview", "Aperçu Conversion")}</th>
                  <th className="py-3 px-4 text-center">{t("active", "Statut")}</th>
                  <th className="py-3 px-4 text-end">{t("actions", "Actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {currencies.map((curr) => {
                  const isBase = curr.code === "USD" || curr.is_base;
                  const isSaving = savingId === curr.id;

                  return (
                    <tr key={curr.id} className="hover:bg-[var(--gold)]/5 transition-colors">
                      <td className="py-3.5 px-4 font-bold font-mono text-base text-[var(--foreground)]">
                        <div className="flex items-center gap-2">
                          <span>{curr.code}</span>
                          {isBase && (
                            <span className="px-2 py-0.5 rounded-full text-[0.62rem] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                              BASE
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <input
                          type="text"
                          value={curr.name}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCurrencies((prev) =>
                              prev.map((c) => (c.id === curr.id ? { ...c, name: val } : c))
                            );
                          }}
                          className="w-full max-w-[160px] px-2 py-1 text-xs rounded border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
                        />
                      </td>

                      <td className="py-3.5 px-4">
                        <input
                          type="text"
                          value={curr.symbol}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCurrencies((prev) =>
                              prev.map((c) => (c.id === curr.id ? { ...c, symbol: val } : c))
                            );
                          }}
                          className="w-16 px-2 py-1 text-xs rounded border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] font-bold text-center outline-none focus:border-[var(--gold)]"
                        />
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            step="0.0001"
                            min="0.0001"
                            disabled={isBase}
                            value={curr.rate}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value) || 0;
                              setCurrencies((prev) =>
                                prev.map((c) => (c.id === curr.id ? { ...c, rate: val } : c))
                              );
                            }}
                            className="w-28 px-2.5 py-1 text-xs font-mono font-bold rounded border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] outline-none focus:border-[var(--gold)] disabled:opacity-60"
                          />
                          <span className="text-[0.7rem] text-[var(--muted-foreground)] font-mono">
                            {curr.symbol}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-xs font-mono space-y-0.5">
                          <div className="text-[var(--gold)] font-bold">
                            $9.99 = {(9.99 * Number(curr.rate)).toFixed(2)} {curr.symbol}
                          </div>
                          <div className="text-[0.65rem] text-[var(--muted-foreground)]">
                            $19.99 = {(19.99 * Number(curr.rate)).toFixed(2)} {curr.symbol}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={curr.is_active !== false}
                            disabled={isBase}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setCurrencies((prev) =>
                                prev.map((c) => (c.id === curr.id ? { ...c, is_active: checked } : c))
                              );
                            }}
                            className="sr-only peer"
                          />
                          <div className="w-8 h-4 bg-gray-300 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[var(--gold)] relative"></div>
                        </label>
                      </td>

                      <td className="py-3.5 px-4 text-end">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleUpdate(curr)}
                            disabled={isSaving}
                            className="btn-base btn-gold text-xs py-1.5 px-3 flex items-center gap-1.5 cursor-pointer"
                            title={t("save_rate", "Enregistrer le taux")}
                          >
                            <Save className={`h-3.5 w-3.5 ${isSaving ? "animate-spin" : ""}`} />
                            <span>{isSaving ? "..." : t("save", "Enregistrer")}</span>
                          </button>

                          {!isBase && (
                            <button
                              type="button"
                              onClick={() => handleDelete(curr.id, curr.code)}
                              className="p-1.5 rounded text-rose-500 hover:bg-rose-500/15 transition-colors cursor-pointer"
                              title={t("delete", "Supprimer")}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

