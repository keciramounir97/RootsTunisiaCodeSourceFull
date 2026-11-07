import { useEffect, useRef, useState } from "react";
import {
  Coins,
  Plus,
  Trash2,
  Save,
  Check,
  RefreshCw,
  AlertCircle,
  ArrowRightLeft,
  X,
} from "lucide-react";
import { api } from "../../api/client";
import { useTranslation } from "../../context/TranslationContext";
import { useCurrency, type CurrencyItem } from "../../context/CurrencyContext";

function unwrapList(payload: any): CurrencyItem[] {
  const raw = payload?.data?.data ?? payload?.data ?? payload;
  return Array.isArray(raw) ? raw : [];
}

export default function Currencies() {
  const { t, isRtl } = useTranslation();
  const { refreshCurrencies } = useCurrency();

  const [currencies, setCurrencies] = useState<CurrencyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const statusTimer = useRef<number | null>(null);

  const [newCode, setNewCode] = useState("");
  const [newName, setNewName] = useState("");
  const [newSymbol, setNewSymbol] = useState("");
  const [newRate, setNewRate] = useState<string>("1.00");
  const [adding, setAdding] = useState(false);

  const flash = (type: "success" | "error", text: string, ms = 4000) => {
    setStatusMessage({ type, text });
    if (statusTimer.current) window.clearTimeout(statusTimer.current);
    statusTimer.current = window.setTimeout(() => setStatusMessage(null), ms);
  };

  const fetchCurrencies = async (opts?: { silent?: boolean }) => {
    try {
      if (!opts?.silent) setLoading(true);
      const { data } = await api.get("/admin/currencies");
      setCurrencies(unwrapList(data));
    } catch {
      flash("error", t("currencies_load_failed", "Impossible de charger les taux de change."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchCurrencies();
    return () => {
      if (statusTimer.current) window.clearTimeout(statusTimer.current);
    };
  }, []);

  const afterMutation = async () => {
    await refreshCurrencies();
    await fetchCurrencies({ silent: true });
  };

  const handleUpdate = async (curr: CurrencyItem) => {
    setSavingId(curr.id);
    try {
      await api.put(`/admin/currencies/${curr.id}`, {
        name: curr.name,
        symbol: curr.symbol,
        rate: Number(curr.rate),
        is_active: curr.is_active,
      });
      await afterMutation();
      flash(
        "success",
        t("currency_updated_success", `Taux pour ${curr.code} enregistré — visible sur tout le site.`),
      );
    } catch (err: any) {
      flash(
        "error",
        err?.response?.data?.message || t("currency_update_failed", "Échec de la mise à jour."),
      );
    } finally {
      setSavingId(null);
    }
  };

  const handleToggleActive = async (curr: CurrencyItem, nextActive: boolean) => {
    const previous = curr.is_active;
    setCurrencies((prev) =>
      prev.map((c) => (c.id === curr.id ? { ...c, is_active: nextActive } : c)),
    );
    setSavingId(curr.id);
    try {
      await api.put(`/admin/currencies/${curr.id}`, {
        name: curr.name,
        symbol: curr.symbol,
        rate: Number(curr.rate),
        is_active: nextActive,
      });
      await afterMutation();
      flash(
        "success",
        nextActive
          ? t("currency_activated", `${curr.code} activée.`)
          : t("currency_deactivated", `${curr.code} désactivée.`),
      );
    } catch (err: any) {
      setCurrencies((prev) =>
        prev.map((c) => (c.id === curr.id ? { ...c, is_active: previous } : c)),
      );
      flash(
        "error",
        err?.response?.data?.message || t("currency_update_failed", "Échec de la mise à jour."),
      );
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id: number, code: string) => {
    if (!window.confirm(t("confirm_delete_currency", `Supprimer la devise ${code} ?`))) return;
    try {
      await api.delete(`/admin/currencies/${id}`);
      setCurrencies((prev) => prev.filter((c) => c.id !== id));
      await refreshCurrencies();
      flash("success", t("currency_deleted", `Devise ${code} supprimée.`));
    } catch (err: any) {
      flash(
        "error",
        err?.response?.data?.message || t("currency_delete_failed", "Impossible de supprimer cette devise."),
      );
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    setAdding(true);
    try {
      const payload = {
        code: newCode.trim().toUpperCase(),
        name: newName.trim() || newCode.trim().toUpperCase(),
        symbol: newSymbol.trim() || newCode.trim().toUpperCase(),
        rate: parseFloat(newRate) || 1.0,
      };
      await api.post("/admin/currencies", payload);
      setNewCode("");
      setNewName("");
      setNewSymbol("");
      setNewRate("1.00");
      await afterMutation();
      flash(
        "success",
        t("currency_added_success", `Devise ${payload.code} ajoutée.`),
      );
    } catch (err: any) {
      flash(
        "error",
        err?.response?.data?.message || t("currency_add_failed", "Échec de l'ajout de la devise."),
      );
    } finally {
      setAdding(false);
    }
  };

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto text-[var(--foreground)]">
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
              {t(
                "currencies_management_desc",
                "Gérez les devises et taux. Les changements sont appliqués immédiatement sur le site.",
              )}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => fetchCurrencies()}
          disabled={loading}
          className="btn-base btn-outline-light text-xs py-2 px-4 flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>{t("refresh", "Actualiser")}</span>
        </button>
      </div>

      {statusMessage && (
        <div
          role="status"
          className={`p-3.5 rounded-lg text-sm flex items-center gap-3 shadow-sm ${
            statusMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-200 dark:border-emerald-800"
              : "bg-rose-50 text-rose-800 border border-rose-300 dark:bg-rose-950/80 dark:text-rose-200 dark:border-rose-800"
          }`}
        >
          {statusMessage.type === "success" ? (
            <Check className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
          )}
          <span className="flex-1 font-medium">{statusMessage.text}</span>
          <button
            type="button"
            onClick={() => setStatusMessage(null)}
            className="opacity-60 hover:opacity-100 cursor-pointer p-0.5"
            aria-label={t("dismiss", "Fermer")}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="surface-card frame-gold p-5 sm:p-6 rounded-xl space-y-4">
        <h2 className="text-base font-bold flex items-center gap-2 text-[var(--gold)]">
          <Plus className="h-4 w-4" />
          <span>{t("add_new_currency", "Ajouter une Devise")}</span>
        </h2>

        <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-end">
          <div>
            <label className="block text-xs font-semibold mb-1 text-[var(--muted-foreground)]">
              {t("currency_abbreviation", "Code (ex: TND)")}
            </label>
            <input
              type="text"
              required
              maxLength={10}
              placeholder="TND"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] uppercase font-mono font-bold outline-none focus:border-[var(--gold)]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-[var(--muted-foreground)]">
              {t("currency_name", "Nom")}
            </label>
            <input
              type="text"
              placeholder="Dinar Tunisien"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-[var(--muted-foreground)]">
              {t("currency_symbol", "Symbole")}
            </label>
            <input
              type="text"
              placeholder="DT"
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-[var(--muted-foreground)]">
              {t("exchange_rate_relative_usd", "Taux (1 USD = X)")}
            </label>
            <input
              type="number"
              step="0.0001"
              min="0.0001"
              required
              placeholder="3.1500"
              value={newRate}
              onChange={(e) => setNewRate(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] font-mono font-bold outline-none focus:border-[var(--gold)]"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={adding || !newCode.trim()}
              className="btn-base btn-gold w-full py-2.5 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow disabled:opacity-60"
            >
              <Plus className="h-4 w-4" />
              <span>{adding ? t("adding", "Ajout...") : t("add_currency_btn", "Ajouter")}</span>
            </button>
          </div>
        </form>
      </div>

      <div className="surface-card frame-gold rounded-xl overflow-hidden shadow-lg border border-[var(--gold)]/30">
        <div className="p-4 sm:p-5 border-b border-[var(--gold)]/20 flex items-center justify-between">
          <h3 className="font-bold text-base flex items-center gap-2">
            <ArrowRightLeft className="h-4 w-4 text-[var(--gold)]" />
            <span>
              {t("active_currencies_list", "Devises")} ({currencies.length})
            </span>
          </h3>
          <span className="text-xs text-[var(--muted-foreground)] font-mono">
            {t("base_currency_note", "Référence: USD ($1.00)")}
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
                  <th className="py-3 px-4 text-start">{t("code", "Code")}</th>
                  <th className="py-3 px-4 text-start">{t("name", "Nom")}</th>
                  <th className="py-3 px-4 text-start">{t("symbol", "Symbole")}</th>
                  <th className="py-3 px-4 text-start">{t("exchange_rate", "Taux (pour 1 USD)")}</th>
                  <th className="py-3 px-4 text-start">{t("preview", "Aperçu")}</th>
                  <th className="py-3 px-4 text-center">{t("active", "Actif")}</th>
                  <th className="py-3 px-4 text-end">{t("actions", "Actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {currencies.map((curr) => {
                  const isBase = curr.code === "USD" || curr.is_base;
                  const isSaving = savingId === curr.id;

                  return (
                    <tr key={curr.id} className="hover:bg-[var(--gold)]/5 transition-colors">
                      <td className="py-3.5 px-4 font-bold font-mono text-base">
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
                              prev.map((c) => (c.id === curr.id ? { ...c, name: val } : c)),
                            );
                          }}
                          className="w-full max-w-[160px] px-2 py-1 text-xs rounded border border-[var(--border)] bg-[var(--background)] outline-none focus:border-[var(--gold)]"
                        />
                      </td>

                      <td className="py-3.5 px-4">
                        <input
                          type="text"
                          value={curr.symbol}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCurrencies((prev) =>
                              prev.map((c) => (c.id === curr.id ? { ...c, symbol: val } : c)),
                            );
                          }}
                          className="w-16 px-2 py-1 text-xs rounded border border-[var(--border)] bg-[var(--background)] font-bold text-center outline-none focus:border-[var(--gold)]"
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
                                prev.map((c) => (c.id === curr.id ? { ...c, rate: val } : c)),
                              );
                            }}
                            className="w-28 px-2.5 py-1 text-xs font-mono font-bold rounded border border-[var(--border)] bg-[var(--background)] outline-none focus:border-[var(--gold)] disabled:opacity-60"
                          />
                          <span className="text-[0.7rem] text-[var(--muted-foreground)] font-mono">
                            {curr.symbol}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-xs font-mono text-[var(--gold)] font-bold">
                          $9.99 = {(9.99 * Number(curr.rate || 0)).toFixed(2)} {curr.symbol}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={curr.is_active !== false}
                            disabled={isBase || isSaving}
                            onChange={(e) => handleToggleActive(curr, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-8 h-4 bg-gray-300 dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[var(--gold)] relative peer-disabled:opacity-50" />
                        </label>
                      </td>

                      <td className="py-3.5 px-4 text-end">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleUpdate(curr)}
                            disabled={isSaving}
                            className="btn-base btn-gold text-xs py-1.5 px-3 flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                            title={t("save_rate", "Enregistrer")}
                          >
                            <Save className={`h-3.5 w-3.5 ${isSaving ? "animate-spin" : ""}`} />
                            <span>{isSaving ? t("saving", "…") : t("save", "Enregistrer")}</span>
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
