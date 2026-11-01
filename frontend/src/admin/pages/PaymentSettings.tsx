import { useEffect, useState } from "react";
import {
  Wallet,
  Plus,
  Trash2,
  Edit2,
  Check,
  Save,
  X,
  CreditCard,
  Building2,
  Smartphone,
  Info,
  CheckCircle2,
  AlertCircle,
  Eye,
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

const EMPTY_FORM: Omit<PaymentMethodItem, "id"> = {
  code: "",
  name: "",
  account_details: "",
  instructions: "",
  fee_note: "Sans frais supplémentaires",
  badge: "",
  is_active: true,
  sort_order: 1,
};

export default function PaymentSettings() {
  const { t, isRtl } = useTranslation();

  const [methods, setMethods] = useState<PaymentMethodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<PaymentMethodItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Omit<PaymentMethodItem, "id">>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const fetchMethods = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/admin/payment-methods");
      const items = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
      setMethods(items);
    } catch {
      setStatus({ type: "error", msg: t("payment_methods_load_failed", "Impossible de charger les moyens de paiement.") });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchMethods();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      ...EMPTY_FORM,
      code: `method_${Date.now()}`,
      sort_order: methods.length + 1,
    });
    setShowModal(true);
  };

  const openEditModal = (item: PaymentMethodItem) => {
    setEditingItem(item);
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
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setSaving(true);
    setStatus(null);
    try {
      if (editingItem) {
        await api.put(`/admin/payment-methods/${editingItem.id}`, formData);
        setStatus({
          type: "success",
          msg: t("payment_method_updated", `Moyen de paiement "${formData.name}" mis à jour avec succès.`),
        });
      } else {
        await api.post("/admin/payment-methods", formData);
        setStatus({
          type: "success",
          msg: t("payment_method_created", `Nouveau moyen de paiement "${formData.name}" ajouté avec succès.`),
        });
      }
      setShowModal(false);
      await fetchMethods();
      setTimeout(() => setStatus(null), 4000);
    } catch (err: any) {
      setStatus({
        type: "error",
        msg: err?.response?.data?.message || t("payment_method_save_failed", "Échec de l'enregistrement."),
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: PaymentMethodItem) => {
    if (!window.confirm(t("confirm_delete_payment_method", `Supprimer le moyen de paiement "${item.name}" ?`))) return;
    try {
      await api.delete(`/admin/payment-methods/${item.id}`);
      setMethods((prev) => prev.filter((m) => m.id !== item.id));
      setStatus({ type: "success", msg: t("payment_method_deleted", `Moyen de paiement supprimé.`) });
      setTimeout(() => setStatus(null), 3000);
    } catch (err: any) {
      setStatus({
        type: "error",
        msg: err?.response?.data?.message || t("payment_method_delete_failed", "Échec de la suppression."),
      });
    }
  };

  const handleToggle = async (item: PaymentMethodItem) => {
    try {
      const nextActive = !item.is_active;
      await api.put(`/admin/payment-methods/${item.id}`, { is_active: nextActive });
      setMethods((prev) =>
        prev.map((m) => (m.id === item.id ? { ...m, is_active: nextActive } : m))
      );
    } catch (err: any) {
      setStatus({ type: "error", msg: t("error_toggling_status", "Erreur lors du changement de statut.") });
    }
  };

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto text-[var(--foreground)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--gold)]/20 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30">
            <Wallet className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display tracking-tight text-[var(--foreground)]">
              {t("payment_settings_title", "Gestion des Moyens de Paiement (Vue Client)")}
            </h1>
            <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
              {t(
                "payment_settings_subtitle",
                "Ajoutez, modifiez et contrôlez exactement les coordonnées bancaires (RIB, IBAN, Flouci, D17) et instructions affichées aux clients lors du paiement.",
              )}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="btn-base btn-gold text-xs py-2.5 px-4 flex items-center gap-2 cursor-pointer shadow"
        >
          <Plus className="h-4 w-4" />
          <span>{t("add_payment_method", "Ajouter un Moyen de Paiement")}</span>
        </button>
      </div>

      {/* Info notice */}
      <div className="p-4 rounded-xl border border-[var(--gold)]/35 bg-[var(--gold)]/10 text-xs sm:text-sm text-[var(--foreground)] flex items-start gap-3">
        <Info className="h-5 w-5 text-[var(--gold)] shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold text-[var(--gold)]">
            {t("payment_methods_control_notice", "Contrôle Direct de l'Expérience Client")} :
          </strong>
          <span className="ms-1 text-[var(--muted-foreground)]">
            {t(
              "payment_methods_control_help",
              "Les informations et coordonnées saisies ici s'affichent automatiquement au client sur la page de paiement (/payment) lorsqu'il confirme son abonnement.",
            )}
          </span>
        </div>
      </div>

      {/* Status banner */}
      {status && (
        <div
          className={`p-4 rounded-lg text-sm flex items-center gap-3 shadow-md ${
            status.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-300 dark:bg-rose-950/80 dark:text-rose-200"
          }`}
        >
          {status.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
          )}
          <span>{status.msg}</span>
        </div>
      )}

      {/* Methods List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {loading ? (
          <div className="col-span-full flex justify-center py-16">
            <div className="w-9 h-9 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : methods.length === 0 ? (
          <div className="col-span-full surface-card frame-gold p-12 text-center rounded-xl space-y-3">
            <CreditCard className="w-10 h-10 text-[var(--gold)] mx-auto opacity-70" />
            <h3 className="text-lg font-bold">{t("no_payment_methods", "Aucun moyen de paiement configuré")}</h3>
            <p className="text-xs text-[var(--muted-foreground)]">
              {t("click_add_method_hint", "Cliquez sur 'Ajouter un Moyen de Paiement' pour en créer un.")}
            </p>
          </div>
        ) : (
          methods.map((item) => (
            <div
              key={item.id}
              className={`surface-card frame-gold p-5 rounded-xl shadow-md border transition-all flex flex-col justify-between space-y-4 ${
                item.is_active
                  ? "border-[var(--gold)]/40 bg-[var(--card)]"
                  : "border-gray-300 dark:border-gray-800 opacity-60 bg-gray-50 dark:bg-gray-900"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3 border-b border-[var(--gold)]/20 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-[var(--gold)]/15 text-[var(--gold)]">
                      {item.code.includes("bank") ? (
                        <Building2 className="w-5 h-5" />
                      ) : (
                        <Smartphone className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-[var(--foreground)]">{item.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[0.68rem] font-mono text-[var(--muted-foreground)]">
                          #{item.code}
                        </span>
                        {item.badge && (
                          <span className="px-2 py-0.5 rounded text-[0.65rem] font-bold bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <label className="inline-flex items-center cursor-pointer" title={t("toggle_visibility", "Activer / Désactiver")}>
                    <input
                      type="checkbox"
                      checked={item.is_active}
                      onChange={() => handleToggle(item)}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-gray-300 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[var(--gold)] relative"></div>
                  </label>
                </div>

                {/* Account details */}
                <div className="p-3 rounded-lg bg-[var(--background)] border border-[var(--border)] text-xs font-mono whitespace-pre-wrap leading-relaxed text-[var(--foreground)]">
                  {item.account_details || t("no_account_details", "Aucune coordonnée bancaire saisie.")}
                </div>

                {/* Instructions */}
                {item.instructions && (
                  <p className="text-xs text-[var(--muted-foreground)] italic leading-relaxed">
                    💡 {item.instructions}
                  </p>
                )}

                {item.fee_note && (
                  <p className="text-[0.72rem] text-emerald-600 dark:text-emerald-400 font-medium">
                    ✓ {item.fee_note}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-[var(--gold)]/15">
                <span className="text-[0.68rem] font-semibold text-[var(--muted-foreground)]">
                  {item.is_active ? t("active_for_clients", "✓ Visible aux clients") : t("hidden_from_clients", "Désactivé")}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(item)}
                    className="p-1.5 rounded text-[var(--foreground)] hover:text-[var(--gold)] hover:bg-[var(--gold)]/15 transition-colors cursor-pointer"
                    title={t("edit", "Modifier")}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
                    className="p-1.5 rounded text-rose-500 hover:bg-rose-500/15 transition-colors cursor-pointer"
                    title={t("delete", "Supprimer")}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal for Add / Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div
            dir={isRtl ? "rtl" : "ltr"}
            className="surface-card frame-gold w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 rounded-2xl shadow-2xl space-y-5 text-start"
          >
            <div className="flex items-center justify-between border-b border-[var(--gold)]/20 pb-3">
              <h2 className="text-lg font-bold font-display text-[var(--gold)] flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                <span>
                  {editingItem
                    ? t("edit_payment_method", "Modifier le Moyen de Paiement")
                    : t("add_payment_method", "Ajouter un Moyen de Paiement")}
                </span>
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-full hover:bg-[var(--gold)]/15 text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold mb-1 text-[var(--foreground)]">
                  {t("payment_method_name", "Nom du Moyen de Paiement (ex: Virement Bancaire RIB / IBAN)")}
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Virement Bancaire (BIAT / Attijari)"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] outline-none focus:border-[var(--gold)] font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-[var(--foreground)]">
                    {t("code_identifier", "Identifiant / Code")}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ex: biat_wire"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] font-mono outline-none focus:border-[var(--gold)]"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-[var(--foreground)]">
                    {t("badge_tag", "Badge (ex: Recommandé en Tunisie, Rapide)")}
                  </label>
                  <input
                    type="text"
                    placeholder="ex: Recommandé en Tunisie"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[var(--foreground)]">
                  {t("account_details_label", "Coordonnées Bancaires / Numéro de Compte (affiché en bloc au client)")}
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder={`Banque: BIAT\nRIB: 0800 1234 5678 9012 3456\nIBAN: TN59 0800 1234 5678 9012 3456\nTitulaire: Roots Tunisia\nSWIFT: BIATTNTT`}
                  value={formData.account_details}
                  onChange={(e) => setFormData({ ...formData, account_details: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] font-mono text-xs outline-none focus:border-[var(--gold)]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[var(--foreground)]">
                  {t("client_instructions_label", "Instructions Détaillées pour le Client")}
                </label>
                <textarea
                  rows={3}
                  placeholder="Veuillez effectuer le virement puis saisir ci-dessous le numéro de référence de votre transaction ou votre nom de compte."
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[var(--foreground)]">
                  {t("fee_note_label", "Note sur les Frais (ex: Sans frais supplémentaires)")}
                </label>
                <input
                  type="text"
                  placeholder="ex: Sans frais supplémentaires · Validation sous 24h"
                  value={formData.fee_note}
                  onChange={(e) => setFormData({ ...formData, fee_note: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="rounded border-[var(--border)]"
                  />
                  <span>{t("active_visible_to_clients", "Actif (visible immédiatement aux clients)")}</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-base btn-outline-light text-xs py-2 px-4 cursor-pointer"
                  >
                    {t("cancel", "Annuler")}
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-base btn-gold text-xs py-2 px-5 flex items-center gap-2 cursor-pointer shadow"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? t("saving", "Enregistrement...") : t("save", "Enregistrer")}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
