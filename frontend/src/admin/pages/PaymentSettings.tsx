import { useEffect, useRef, useState } from "react";
import {
  Wallet,
  Plus,
  Trash2,
  Pencil,
  Save,
  X,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { api } from "../../api/client";
import { useTranslation } from "../../context/TranslationContext";

export interface PaymentMethodItem {
  id: number;
  code: string;
  name: string;
  account_details: string;
  instructions: string;
  fee_note: string;
  badge: string;
  is_active: boolean;
  sort_order: number;
}

type FormState = Omit<PaymentMethodItem, "id">;

const EMPTY_FORM: FormState = {
  code: "",
  name: "",
  account_details: "",
  instructions: "",
  fee_note: "",
  badge: "",
  is_active: true,
  sort_order: 1,
};

function unwrapList(payload: any): PaymentMethodItem[] {
  const raw = payload?.data?.data ?? payload?.data ?? payload;
  return Array.isArray(raw) ? raw : [];
}

export default function PaymentSettings() {
  const { t, isRtl } = useTranslation();

  const [methods, setMethods] = useState<PaymentMethodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const statusTimer = useRef<number | null>(null);

  const showStatus = (type: "success" | "error", msg: string, ms = 3500) => {
    setStatus({ type, msg });
    if (statusTimer.current) window.clearTimeout(statusTimer.current);
    statusTimer.current = window.setTimeout(() => setStatus(null), ms);
  };

  const fetchMethods = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/admin/payment-methods");
      setMethods(unwrapList(data));
    } catch {
      showStatus("error", t("payment_methods_load_failed", "Impossible de charger les moyens de paiement."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchMethods();
    return () => {
      if (statusTimer.current) window.clearTimeout(statusTimer.current);
    };
  }, []);

  const startCreate = () => {
    setEditingId(null);
    setFormData({
      ...EMPTY_FORM,
      code: `method_${Date.now()}`,
      sort_order: methods.length + 1,
    });
    setCreating(true);
  };

  const startEdit = (item: PaymentMethodItem) => {
    setCreating(false);
    setEditingId(item.id);
    setFormData({
      code: item.code,
      name: item.name,
      account_details: item.account_details || "",
      instructions: item.instructions || "",
      fee_note: item.fee_note || "",
      badge: item.badge || "",
      is_active: item.is_active !== false,
      sort_order: item.sort_order || 0,
    });
  };

  const cancelForm = () => {
    setCreating(false);
    setEditingId(null);
    setFormData(EMPTY_FORM);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setSaving(true);
    try {
      if (editingId != null) {
        await api.put(`/admin/payment-methods/${editingId}`, formData);
        showStatus("success", t("payment_method_updated", "Moyen de paiement mis à jour."));
      } else {
        await api.post("/admin/payment-methods", formData);
        showStatus("success", t("payment_method_created", "Moyen de paiement ajouté."));
      }
      cancelForm();
      await fetchMethods();
    } catch (err: any) {
      showStatus(
        "error",
        err?.response?.data?.message || t("payment_method_save_failed", "Échec de l'enregistrement."),
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: PaymentMethodItem) => {
    if (!window.confirm(t("confirm_delete_payment_method", `Supprimer « ${item.name} » ?`))) return;
    try {
      await api.delete(`/admin/payment-methods/${item.id}`);
      setMethods((prev) => prev.filter((m) => m.id !== item.id));
      if (editingId === item.id) cancelForm();
      showStatus("success", t("payment_method_deleted", "Moyen de paiement supprimé."));
    } catch (err: any) {
      showStatus(
        "error",
        err?.response?.data?.message || t("payment_method_delete_failed", "Échec de la suppression."),
      );
    }
  };

  const handleToggle = async (item: PaymentMethodItem) => {
    const nextActive = !item.is_active;
    setTogglingId(item.id);
    setMethods((prev) =>
      prev.map((m) => (m.id === item.id ? { ...m, is_active: nextActive } : m)),
    );
    try {
      await api.put(`/admin/payment-methods/${item.id}`, { is_active: nextActive });
    } catch {
      setMethods((prev) =>
        prev.map((m) => (m.id === item.id ? { ...m, is_active: item.is_active } : m)),
      );
      showStatus("error", t("error_toggling_status", "Erreur lors du changement de statut."));
    } finally {
      setTogglingId(null);
    }
  };

  const formOpen = creating || editingId != null;

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="p-4 sm:p-6 lg:p-8 space-y-5 max-w-4xl mx-auto text-[var(--foreground)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--gold)]/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[var(--gold)]/15 text-[var(--gold)]">
            <Wallet className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-display tracking-tight">
              {t("payment_settings_title", "Modes de Paiement")}
            </h1>
            <p className="text-xs text-[var(--muted-foreground)]">
              {t(
                "payment_settings_subtitle",
                "Coordonnées et instructions affichées aux clients sur /payment.",
              )}
            </p>
          </div>
        </div>

        {!formOpen && (
          <button
            type="button"
            onClick={startCreate}
            className="btn-base btn-gold text-xs py-2 px-3.5 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            {t("add_payment_method", "Ajouter")}
          </button>
        )}
      </div>

      {status && (
        <div
          className={`px-3 py-2.5 rounded-lg text-sm flex items-center gap-2 ${
            status.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-200 dark:border-emerald-800"
              : "bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/70 dark:text-rose-200 dark:border-rose-800"
          }`}
        >
          {status.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0" />
          )}
          <span className="flex-1">{status.msg}</span>
          <button type="button" onClick={() => setStatus(null)} className="opacity-60 hover:opacity-100 cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {formOpen && (
        <form
          onSubmit={handleSave}
          className="rounded-xl border border-[var(--gold)]/30 bg-[var(--card)] p-4 space-y-3 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[var(--gold)]">
              {editingId != null
                ? t("edit_payment_method", "Modifier")
                : t("add_payment_method", "Nouveau moyen de paiement")}
            </h2>
            <button type="button" onClick={cancelForm} className="p-1 rounded hover:bg-[var(--gold)]/10 cursor-pointer">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block text-xs space-y-1 sm:col-span-2">
              <span className="font-semibold">{t("payment_method_name", "Nom")}</span>
              <input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] outline-none focus:border-[var(--gold)]"
                placeholder="ex: Virement Bancaire BIAT"
              />
            </label>
            <label className="block text-xs space-y-1">
              <span className="font-semibold">{t("code_identifier", "Code")}</span>
              <input
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] font-mono outline-none focus:border-[var(--gold)]"
              />
            </label>
            <label className="block text-xs space-y-1">
              <span className="font-semibold">{t("badge_tag", "Badge")}</span>
              <input
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] outline-none focus:border-[var(--gold)]"
                placeholder="ex: Recommandé"
              />
            </label>
            <label className="block text-xs space-y-1 sm:col-span-2">
              <span className="font-semibold">{t("account_details_label", "Coordonnées")}</span>
              <textarea
                required
                rows={3}
                value={formData.account_details}
                onChange={(e) => setFormData({ ...formData, account_details: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] font-mono text-xs outline-none focus:border-[var(--gold)]"
              />
            </label>
            <label className="block text-xs space-y-1 sm:col-span-2">
              <span className="font-semibold">{t("client_instructions_label", "Instructions")}</span>
              <textarea
                rows={2}
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] outline-none focus:border-[var(--gold)]"
              />
            </label>
            <label className="block text-xs space-y-1 sm:col-span-2">
              <span className="font-semibold">{t("fee_note_label", "Note frais")}</span>
              <input
                value={formData.fee_note}
                onChange={(e) => setFormData({ ...formData, fee_note: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] outline-none focus:border-[var(--gold)]"
                placeholder="Sans frais supplémentaires"
              />
            </label>
          </div>

          <div className="flex items-center justify-between gap-3 pt-1">
            <label className="inline-flex items-center gap-2 text-xs font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              />
              {t("active_visible_to_clients", "Actif")}
            </label>
            <div className="flex items-center gap-2">
              <button type="button" onClick={cancelForm} className="btn-base btn-outline-light text-xs py-1.5 px-3 cursor-pointer">
                {t("cancel", "Annuler")}
              </button>
              <button
                type="submit"
                disabled={saving}
                className="btn-base btn-gold text-xs py-1.5 px-3.5 inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                <Save className="h-3.5 w-3.5" />
                {saving ? t("saving", "…") : t("save", "Enregistrer")}
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="rounded-xl border border-[var(--border)] overflow-hidden bg-[var(--card)]">
        {loading ? (
          <div className="py-14 flex justify-center">
            <div className="w-8 h-8 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : methods.length === 0 ? (
          <div className="py-12 px-4 text-center space-y-2">
            <Wallet className="w-8 h-8 mx-auto text-[var(--gold)] opacity-70" />
            <p className="text-sm font-semibold">{t("no_payment_methods", "Aucun moyen de paiement")}</p>
            <button type="button" onClick={startCreate} className="text-xs text-[var(--gold)] font-bold underline cursor-pointer">
              {t("add_payment_method", "Ajouter")}
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-[var(--border)]">
            {methods.map((item) => (
              <li
                key={item.id}
                className={`p-4 flex flex-col sm:flex-row sm:items-start gap-3 ${
                  item.is_active ? "" : "opacity-55 bg-[var(--background)]/40"
                } ${editingId === item.id ? "ring-1 ring-inset ring-[var(--gold)]/40" : ""}`}
              >
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-sm">{item.name}</h3>
                    {item.badge ? (
                      <span className="px-1.5 py-0.5 rounded text-[0.65rem] font-bold bg-[var(--gold)]/15 text-[var(--gold)]">
                        {item.badge}
                      </span>
                    ) : null}
                    <span className="text-[0.65rem] font-mono text-[var(--muted-foreground)]">#{item.code}</span>
                  </div>
                  <pre className="text-[0.7rem] font-mono whitespace-pre-wrap text-[var(--muted-foreground)] leading-relaxed">
                    {item.account_details || "—"}
                  </pre>
                  {item.instructions ? (
                    <p className="text-xs text-[var(--muted-foreground)]">{item.instructions}</p>
                  ) : null}
                  {item.fee_note ? (
                    <p className="text-[0.7rem] text-emerald-600 dark:text-emerald-400">{item.fee_note}</p>
                  ) : null}
                </div>

                <div className="flex items-center gap-2 shrink-0 self-start">
                  <button
                    type="button"
                    disabled={togglingId === item.id}
                    onClick={() => handleToggle(item)}
                    className={`text-[0.65rem] font-bold px-2 py-1 rounded-full border cursor-pointer ${
                      item.is_active
                        ? "border-emerald-400/50 text-emerald-700 dark:text-emerald-300 bg-emerald-500/10"
                        : "border-gray-300 text-gray-500 dark:border-gray-600"
                    }`}
                    title={t("toggle_visibility", "Activer / Désactiver")}
                  >
                    {item.is_active ? t("active", "Actif") : t("inactive", "Inactif")}
                  </button>
                  <button
                    type="button"
                    onClick={() => startEdit(item)}
                    className="p-1.5 rounded hover:bg-[var(--gold)]/15 text-[var(--foreground)] cursor-pointer"
                    title={t("edit", "Modifier")}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
                    className="p-1.5 rounded hover:bg-rose-500/15 text-rose-500 cursor-pointer"
                    title={t("delete", "Supprimer")}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
