import { useState, useEffect } from "react";
import { useTranslation } from "../../context/TranslationContext";
import { api } from "../../api/client";
import { useAuth } from "../components/AuthContext";
import {
  Crown,
  Loader2,
  CheckCircle,
  AlertCircle,
  Building2,
  Upload,
  FileText,
  Send,
  Sparkles,
  Sliders,
  Check,
  Info,
} from "lucide-react";

export default function UserUpgrade() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const isAdmin = user?.role === 1 || user?.role === 3;
  const isSuperAdmin = user?.role === 3;

  const [tiers, setTiers] = useState<any[]>([]);
  const [mySubscription, setMySubscription] = useState<any>(null);
  const [bankSettings, setBankSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Upgrade Modal for Users
  const [selectedTier, setSelectedTier] = useState<any>(null);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [status, setStatus] = useState<{ type: string; msg: string }>({ type: "", msg: "" });

  // Admin User Upgrade & Quotas Modal
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [adminSelectedUser, setAdminSelectedUser] = useState<any>(null);
  const [selectedTierId, setSelectedTierId] = useState<number>(2);
  const [upgradingAdmin, setUpgradingAdmin] = useState(false);

  // Custom Quota Modal state (Super Admin)
  const [quotaUser, setQuotaUser] = useState<any>(null);
  const [userQuotas, setUserQuotas] = useState<any>(null);
  const [loadingQuotas, setLoadingQuotas] = useState(false);
  const [savingQuotas, setSavingQuotas] = useState(false);
  const [customLimits, setCustomLimits] = useState<any>({
    custom_max_trees: "",
    custom_max_gallery: "",
    custom_max_audios: "",
    custom_max_documents: "",
    custom_max_individuals: "",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tRes, mySubRes, bankRes] = await Promise.all([
        api.get("/subscriptions/tiers").catch(() => ({ data: [] })),
        api.get("/my/subscription").catch(() => ({ data: null })),
        api.get("/payment-settings").catch(() => ({ data: null })),
      ]);

      setTiers(Array.isArray(tRes.data) ? tRes.data : tRes.data?.data || []);
      setMySubscription(mySubRes.data?.data || mySubRes.data);
      setBankSettings(bankRes.data?.data || bankRes.data);

      if (isAdmin) {
        const uRes = await api.get("/admin/users").catch(() => ({ data: [] }));
        setAdminUsers(Array.isArray(uRes.data) ? uRes.data : uRes.data?.data || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleProofFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProofFile(file);
      const reader = new FileReader();
      reader.onload = () => setProofPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitBankPayment = async () => {
    if (!selectedTier) return;
    setSubmittingPayment(true);
    setStatus({ type: "", msg: "" });
    try {
      await api.post("/my/subscription/payment", {
        tier_id: selectedTier.id,
        amount: selectedTier.price,
        proof_url: proofPreview || null,
        notes: notes.trim() || null,
      });
      setStatus({
        type: "success",
        msg: `Payment proof for ${selectedTier.name} plan submitted! Super Admin will review and activate your tier shortly.`,
      });
      setSelectedTier(null);
      setProofFile(null);
      setProofPreview("");
      setNotes("");
      fetchData();
    } catch (err: any) {
      setStatus({
        type: "error",
        msg: err.response?.data?.message || "Failed to submit payment proof",
      });
    } finally {
      setSubmittingPayment(false);
    }
  };

  // Super Admin actions
  const handleAdminUpgrade = async () => {
    if (!adminSelectedUser) return;
    setUpgradingAdmin(true);
    setStatus({ type: "", msg: "" });
    try {
      await api.patch(`/admin/users/${adminSelectedUser.id}/subscription`, {
        tier_id: selectedTierId,
      });
      setStatus({ type: "success", msg: `User #${adminSelectedUser.id} upgraded successfully!` });
      setAdminSelectedUser(null);
      fetchData();
    } catch (err: any) {
      setStatus({ type: "error", msg: err.response?.data?.message || "Failed to upgrade user" });
    } finally {
      setUpgradingAdmin(false);
    }
  };

  const openQuotasModal = async (u: any) => {
    setQuotaUser(u);
    setLoadingQuotas(true);
    setUserQuotas(null);
    try {
      const res = await api.get(`/admin/users/${u.id}/quotas`);
      const data = res.data?.data || res.data;
      setUserQuotas(data);
      setCustomLimits({
        custom_max_trees: u.custom_max_trees ?? "",
        custom_max_gallery: u.custom_max_gallery ?? "",
        custom_max_audios: u.custom_max_audios ?? "",
        custom_max_documents: u.custom_max_documents ?? "",
        custom_max_individuals: u.custom_max_individuals ?? "",
      });
    } catch {
      // ignore
    } finally {
      setLoadingQuotas(false);
    }
  };

  const handleSaveUserLimits = async () => {
    if (!quotaUser) return;
    setSavingQuotas(true);
    try {
      const payload: any = {
        custom_max_trees: customLimits.custom_max_trees === "" ? null : parseInt(customLimits.custom_max_trees),
        custom_max_gallery: customLimits.custom_max_gallery === "" ? null : parseInt(customLimits.custom_max_gallery),
        custom_max_audios: customLimits.custom_max_audios === "" ? null : parseInt(customLimits.custom_max_audios),
        custom_max_documents: customLimits.custom_max_documents === "" ? null : parseInt(customLimits.custom_max_documents),
        custom_max_individuals: customLimits.custom_max_individuals === "" ? null : parseInt(customLimits.custom_max_individuals),
      };
      await api.patch(`/admin/users/${quotaUser.id}/limits`, payload);
      setStatus({ type: "success", msg: `Custom limits updated for User #${quotaUser.id}` });
      setQuotaUser(null);
      fetchData();
    } catch (err: any) {
      setStatus({ type: "error", msg: err.response?.data?.message || "Failed to update custom limits" });
    } finally {
      setSavingQuotas(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#d9a441]" />
      </div>
    );
  }

  const currentTierId = mySubscription?.tier_id || 1;

  return (
    <div className="p-4 md:p-6 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#d9a441]/15 text-[#d9a441]">
            <Crown className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-cinzel text-[var(--text-color)]">
              {t("subscription_plans", "Subscription Plans & Upgrades")}
            </h1>
            <p className="text-xs text-[var(--text-color)] opacity-70">
              Upgrade your account tier to increase tree, photo, audio, and document upload quotas.
            </p>
          </div>
        </div>
      </div>

      {status.msg && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-sm ${
            status.type === "success"
              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
              : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
          }`}
        >
          {status.type === "success" ? (
            <CheckCircle className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span>{status.msg}</span>
        </div>
      )}

      {/* Subscription Pricing Tiers Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((tier) => {
          const isCurrentPlan = currentTierId === tier.id;
          const isFree = tier.price === 0;

          return (
            <div
              key={tier.id}
              className={`rounded-2xl border p-6 shadow-xl flex flex-col justify-between space-y-6 relative transition-all ${
                isCurrentPlan
                  ? "border-[#d9a441] bg-white dark:bg-[#1a2e2d] ring-2 ring-[#d9a441]/30"
                  : "border-[var(--border-color)] bg-white dark:bg-[#1a2e2d] hover:shadow-2xl"
              }`}
            >
              {isCurrentPlan && (
                <span className="absolute -top-3 right-6 px-3 py-1 rounded-full text-[0.65rem] font-extrabold uppercase bg-[#d9a441] text-[#092C2B] shadow">
                  Current Active Plan
                </span>
              )}

              <div>
                <h3 className="text-xl font-bold font-cinzel text-gray-900 dark:text-white mb-1">
                  {tier.name}
                </h3>
                <div className="flex items-baseline gap-1 my-3">
                  <span className="text-3xl font-black text-[#d9a441]">${tier.price}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                    / {tier.interval || "month"}
                  </span>
                </div>

                <div className="border-t border-[var(--border-color)] pt-4 space-y-2.5 text-xs text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                    <span>Max Trees: <b>{tier.max_trees === -1 ? "Unlimited" : tier.max_trees ?? (isFree ? 25 : tier.price === 9.99 ? 300 : 3000)}</b></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                    <span>Max Individuals: <b>{tier.max_individuals === -1 ? "Unlimited" : tier.max_individuals ?? (isFree ? 25 : tier.price === 9.99 ? 300 : 3000)}</b></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                    <span>Max Saved Sources: <b>{tier.max_sources === -1 ? "Unlimited" : tier.max_sources ?? (isFree ? 25 : tier.price === 9.99 ? 300 : 3000)}</b></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                    <span>Max Research Notes: <b>{tier.max_notes === -1 ? "Unlimited" : tier.max_notes ?? (isFree ? 25 : tier.price === 9.99 ? 300 : 3000)}</b></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                    <span>Max Research Tasks: <b>{tier.max_tasks === -1 ? "Unlimited" : tier.max_tasks ?? (isFree ? 25 : tier.price === 9.99 ? 300 : 3000)}</b></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                    <span>Max Gallery Images: <b>{tier.max_gallery === -1 ? "Unlimited" : tier.max_gallery ?? (isFree ? 25 : tier.price === 9.99 ? 300 : 3000)}</b></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                    <span>Max Audio Files: <b>{tier.max_audios === -1 ? "Unlimited" : tier.max_audios ?? (isFree ? 25 : tier.price === 9.99 ? 300 : 3000)}</b></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                    <span>Max Documents: <b>{tier.max_documents === -1 ? "Unlimited" : tier.max_documents ?? (isFree ? 25 : tier.price === 9.99 ? 300 : 3000)}</b></span>
                  </div>
                </div>
              </div>

              <div>
                {isCurrentPlan ? (
                  <button
                    disabled
                    className="w-full py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 font-bold text-xs cursor-default text-center"
                  >
                    Active Plan
                  </button>
                ) : isFree ? (
                  <button
                    disabled
                    className="w-full py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 font-bold text-xs cursor-default text-center"
                  >
                    Freemium Tier
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedTier(tier);
                      setStatus({ type: "", msg: "" });
                    }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d9a441] to-[#e8c377] text-[#092C2B] font-bold text-xs flex items-center justify-center gap-2 hover:shadow-lg transition-all cursor-pointer"
                  >
                    <Crown className="w-4 h-4" />
                    <span>Upgrade to {tier.name}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* USER BANK PAYMENT MODAL */}
      {selectedTier && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => {
            if (!submittingPayment) setSelectedTier(null);
          }}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-3xl border border-[var(--border-color)] p-6 md:p-8 shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-[var(--border-color)] pb-4 mb-4">
              <Building2 className="w-7 h-7 text-[#d9a441]" />
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Bank Transfer & Payment Proof
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Upgrade Plan: <span className="font-bold text-[#d9a441]">{selectedTier.name}</span> (${selectedTier.price})
                </p>
              </div>
            </div>

            {/* Super Admin Bank Information Box */}
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-500/30 text-xs space-y-2 mb-6">
              <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-300">
                <Info className="w-4 h-4 text-[#d9a441]" />
                <span>Super Admin Bank Transfer Instructions:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-gray-800 dark:text-gray-200">
                <div>
                  <span className="text-gray-500">Bank Name:</span> <b>{bankSettings?.bank || "BiAT Bank Tunisia"}</b>
                </div>
                <div>
                  <span className="text-gray-500">Beneficiary:</span> <b>{bankSettings?.beneficiary || "Roots Tunisia Support"}</b>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-gray-500">Account / IBAN:</span> <b>{bankSettings?.account || "TN59 1000 1234 5678 9012 3456"}</b>
                </div>
                <div>
                  <span className="text-gray-500">Reference Code:</span> <b>{bankSettings?.reference || "ROOTS-SUB"}</b>
                </div>
                <div>
                  <span className="text-gray-500">Currency:</span> <b>{bankSettings?.currency || "USD"}</b>
                </div>
              </div>
              {bankSettings?.instructions && (
                <p className="pt-2 border-t border-amber-500/20 italic text-amber-800 dark:text-amber-300">
                  "{bankSettings.instructions}"
                </p>
              )}
            </div>

            {/* Payment Proof Form */}
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-800 dark:text-gray-200 mb-1">
                  Upload Payment Proof Receipt (Image / Screenshot):
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-gray-50 dark:bg-gray-800 cursor-pointer hover:bg-gray-100 transition-colors">
                    <Upload className="w-4 h-4 text-[#d9a441]" />
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Choose Receipt Image</span>
                    <input type="file" accept="image/*" onChange={handleProofFileChange} className="hidden" />
                  </label>
                  {proofFile && <span className="text-xs text-green-600 font-semibold truncate max-w-xs">{proofFile.name}</span>}
                </div>
                {proofPreview && (
                  <div className="mt-3">
                    <img src={proofPreview} alt="Receipt Preview" className="max-h-36 rounded-xl border object-contain" />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-gray-800 dark:text-gray-200 mb-1">
                  Transaction Notes / Reference Message (Optional):
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Enter bank transaction code, date of transfer, or note for support..."
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-[#d9a441]/30"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-[var(--border-color)]">
                <button
                  onClick={() => setSelectedTier(null)}
                  disabled={submittingPayment}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 dark:text-gray-300 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitBankPayment}
                  disabled={submittingPayment}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d9a441] to-[#e8c377] text-[#092C2B] font-bold text-xs flex items-center gap-2 shadow hover:shadow-lg disabled:opacity-50"
                >
                  {submittingPayment ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Submit Payment Proof
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUPER ADMIN USER MANAGEMENT SECTION */}
      {isAdmin && (
        <section className="mt-12 pt-8 border-t border-[var(--border-color)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#d9a441]" />
                Super Admin: User Subscriptions & Custom Limits
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Directly upgrade user subscriptions or configure custom creation quota overrides per user account.
              </p>
            </div>
          </div>

          <div className="admin-data-card rounded-2xl border overflow-hidden shadow-sm">
            <table className="w-full text-sm text-gray-900 dark:text-white">
              <thead>
                <tr className="border-b border-[var(--border-color)] bg-[var(--paper-color)]">
                  <th className="text-left px-4 py-3 font-semibold">ID</th>
                  <th className="text-left px-4 py-3 font-semibold">Name</th>
                  <th className="text-left px-4 py-3 font-semibold">Email</th>
                  <th className="text-left px-4 py-3 font-semibold">Role</th>
                  <th className="text-left px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {adminUsers.map((u) => (
                  <tr key={u.id} className="border-b border-[var(--border-color)] hover:bg-[var(--paper-color)] transition-colors">
                    <td className="px-4 py-3 font-mono text-xs opacity-60">#{u.id}</td>
                    <td className="px-4 py-3 font-semibold">{u.fullName || u.full_name || "—"}</td>
                    <td className="px-4 py-3 opacity-70">{u.email}</td>
                    <td className="px-4 py-3 text-xs capitalize">{u.roleName || (u.role === 3 ? "Super Admin" : "User")}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setAdminSelectedUser(u)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#d9a441]/15 text-[#d9a441] hover:bg-[#d9a441]/25 flex items-center gap-1"
                        >
                          <Crown className="w-3.5 h-3.5" />
                          <span>Upgrade Tier</span>
                        </button>
                        {isSuperAdmin && (
                          <button
                            onClick={() => openQuotasModal(u)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#d9a441]/40 text-[#d9a441] hover:bg-[#d9a441]/10 flex items-center gap-1"
                          >
                            <Sliders className="w-3.5 h-3.5" />
                            <span>Custom Quotas</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Admin Upgrade User Modal */}
      {adminSelectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => { if (!upgradingAdmin) setAdminSelectedUser(null); }}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-[var(--border-color)] p-6 shadow-2xl w-full max-w-md relative" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">Super Admin Tier Upgrade</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">#{adminSelectedUser.id} — {adminSelectedUser.email}</p>

            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Select Subscription Tier</label>
            <select value={selectedTierId} onChange={(e) => setSelectedTierId(parseInt(e.target.value))} className="w-full px-4 py-3 rounded-xl border border-[var(--border-color)] bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm mb-4 outline-none focus:ring-2 focus:ring-[#d9a441]/30">
              {tiers.map((tier: any) => (
                <option key={tier.id} value={tier.id}>{tier.name} — ${tier.price}/{tier.interval || "month"}</option>
              ))}
            </select>

            <button onClick={handleAdminUpgrade} disabled={upgradingAdmin} className="w-full py-3 rounded-full bg-gradient-to-r from-[#d9a441] to-[#e8c377] text-[#092C2B] font-bold text-sm flex items-center justify-center gap-2 transition-all hover:shadow-lg disabled:opacity-50">
              {upgradingAdmin ? <Loader2 className="w-4 h-4 animate-spin" /> : <Crown className="w-4 h-4" />}
              Apply Tier Upgrade
            </button>
          </div>
        </div>
      )}

      {/* Custom Quotas Modal (Super Admin) */}
      {quotaUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => { if (!savingQuotas) setQuotaUser(null); }}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-[var(--border-color)] p-6 shadow-2xl w-full max-w-lg relative" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">Set Custom User Quotas</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">#{quotaUser.id} — {quotaUser.email}</p>

            {loadingQuotas ? (
              <div className="py-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-[#d9a441]" /></div>
            ) : (
              <div className="space-y-4 text-xs">
                {userQuotas && (
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 space-y-1">
                    <p className="font-bold text-xs">Active Plan ({userQuotas.tierName}) Usage:</p>
                    <div className="grid grid-cols-2 gap-2 text-[0.75rem]">
                      <div>Trees: <b>{userQuotas.limits.trees?.used} / {userQuotas.limits.trees?.max === -1 ? "∞" : userQuotas.limits.trees?.max}</b></div>
                      <div>Gallery: <b>{userQuotas.limits.gallery?.used} / {userQuotas.limits.gallery?.max === -1 ? "∞" : userQuotas.limits.gallery?.max}</b></div>
                      <div>Audios: <b>{userQuotas.limits.audios?.used} / {userQuotas.limits.audios?.max === -1 ? "∞" : userQuotas.limits.audios?.max}</b></div>
                      <div>Docs: <b>{userQuotas.limits.documents?.used} / {userQuotas.limits.documents?.max === -1 ? "∞" : userQuotas.limits.documents?.max}</b></div>
                      <div>Individuals: <b>{userQuotas.limits.individuals?.used} / {userQuotas.limits.individuals?.max === -1 ? "∞" : userQuotas.limits.individuals?.max}</b></div>
                    </div>
                  </div>
                )}

                <p className="font-semibold text-gray-700 dark:text-gray-300">Custom Limit Overrides (leave blank for tier default, -1 for unlimited):</p>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1 font-medium">Trees Limit:</label>
                    <input type="number" value={customLimits.custom_max_trees} onChange={(e) => setCustomLimits({ ...customLimits, custom_max_trees: e.target.value })} placeholder="Tier default" className="w-full px-3 py-2 rounded-lg border bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Gallery Limit:</label>
                    <input type="number" value={customLimits.custom_max_gallery} onChange={(e) => setCustomLimits({ ...customLimits, custom_max_gallery: e.target.value })} placeholder="Tier default" className="w-full px-3 py-2 rounded-lg border bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Audios Limit:</label>
                    <input type="number" value={customLimits.custom_max_audios} onChange={(e) => setCustomLimits({ ...customLimits, custom_max_audios: e.target.value })} placeholder="Tier default" className="w-full px-3 py-2 rounded-lg border bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Docs Limit:</label>
                    <input type="number" value={customLimits.custom_max_documents} onChange={(e) => setCustomLimits({ ...customLimits, custom_max_documents: e.target.value })} placeholder="Tier default" className="w-full px-3 py-2 rounded-lg border bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" />
                  </div>
                  <div className="col-span-2">
                    <label className="block mb-1 font-medium">Individuals Limit:</label>
                    <input type="number" value={customLimits.custom_max_individuals} onChange={(e) => setCustomLimits({ ...customLimits, custom_max_individuals: e.target.value })} placeholder="Tier default" className="w-full px-3 py-2 rounded-lg border bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" />
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button onClick={() => setQuotaUser(null)} disabled={savingQuotas} className="px-4 py-2 rounded-lg border text-gray-600 dark:text-gray-300 font-semibold">Cancel</button>
                  <button onClick={handleSaveUserLimits} disabled={savingQuotas} className="px-5 py-2 rounded-full bg-gradient-to-r from-[#d9a441] to-[#e8c377] text-[#092C2B] font-bold flex items-center gap-1.5">
                    {savingQuotas ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sliders className="w-4 h-4" />}
                    Save Custom Limits
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
