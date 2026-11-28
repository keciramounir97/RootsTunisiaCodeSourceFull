import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  Search,
  UserPlus,
  ShieldCheck,
  Mail,
  User,
  Phone,
  X,
  Pencil,
  Trash2,
  Send,
  Lock,
  Eye,
  EyeOff,
  Check,
  Shield,
  Key,
  Crown,
  LayoutDashboard,
  Gauge,
  Network,
  Archive,
  ListChecks,
  StickyNote,
  Image as ImageIcon,
  Music,
  FileText,
  BookOpen,
  Newspaper,
  MessageSquare,
  Wallet,
  Coins,
  Scale,
  Layout,
  Settings as SettingsIcon,
  Users as UsersIcon,
  CheckCircle2,
  XCircle,
  Clock,
  CheckSquare,
  Square,
  ArrowDownCircle,
  UserCheck,
  ArrowUpCircle,
  Ban,
} from "lucide-react";
import { useThemeStore } from "../../store/theme";
import { api } from "../../api/client";
import {
  getApiErrorMessage,
  requestWithFallback,
  shouldFallbackRoute,
} from "../../api/helpers";
import { useAuth } from "../components/AuthContext";
import { useTranslation } from "../../context/TranslationContext";
import Toast from "../../components/Toast";

const PRIVILEGE_OPTIONS = [
  { key: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { key: "usage", label: "Usage Quotas", Icon: Gauge },
  { key: "trees", label: "Family Trees", Icon: Network },
  { key: "individuals", label: "Individuals", Icon: UsersIcon },
  { key: "sources-archives", label: "Sources & Archives", Icon: Archive },
  { key: "tasks", label: "Tasks", Icon: ListChecks },
  { key: "notes", label: "Notes & References", Icon: StickyNote },
  { key: "gallery", label: "Gallery (Images)", Icon: ImageIcon },
  { key: "audios", label: "Audio Archives", Icon: Music },
  { key: "documents", label: "Documents", Icon: FileText },
  { key: "books", label: "Books", Icon: BookOpen },
  { key: "articles", label: "Articles & Chroniques", Icon: Newspaper },
  { key: "users", label: "Users", Icon: UsersIcon },
  { key: "contact-messages", label: "Contact Messages", Icon: MessageSquare },
  { key: "newsletter", label: "Newsletter", Icon: Mail },
  { key: "subscriptions", label: "Subscriptions", Icon: Crown },
  { key: "subscription-payments", label: "Subscription Payments", Icon: Wallet },
  { key: "flagged-payments", label: "Flagged Payments", Icon: Wallet },
  { key: "payment-settings", label: "Payment Methods", Icon: Wallet },
  { key: "currencies", label: "Taux de Change", Icon: Coins },
  { key: "legal-content", label: "Contenu Juridique", Icon: Scale },
  { key: "content", label: "Page Content CMS", Icon: Layout },
  { key: "settings", label: "Settings", Icon: SettingsIcon },
];

const parsePrivileges = (item: any): string[] => {
  const raw =
    item?.privileges ??
    item?.permissions ??
    item?.adminPrivileges ??
    item?.admin_privileges;
  if (Array.isArray(raw)) return raw.map((v) => String(v));
  if (typeof raw === "string" && raw.trim()) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.map((v) => String(v));
    } catch {
      return raw.split(",").map((v) => v.trim()).filter(Boolean);
    }
  }
  return [];
};

export default function UsersPage() {
  const { theme } = useThemeStore();
  const { user: currentUser } = useAuth();
  const { t } = useTranslation();
  const isDark = theme === "dark";

  const isSuperAdmin = Number(currentUser?.role) === 3;
  const canManageUsers = Number(currentUser?.role) === 1 || isSuperAdmin;

  const pageBg = isDark ? "bg-gray-900" : "bg-[var(--paper-color)]";
  const text = isDark ? "text-white" : "text-[var(--text-color)]";
  const card = isDark ? "bg-gray-800" : "bg-white";
  const border = isDark ? "border-gray-700" : "border-[var(--border-color)]";
  const subtle = isDark ? "bg-gray-800" : "bg-gray-50";
  const inputBg = isDark ? "bg-gray-900/60" : "bg-white";
  const inputText = isDark ? "text-white" : "text-[var(--text-color)]";

  const getRoleLabel = (role: string | number) => {
    if (typeof role === "number") {
      if (role === 3) return t("super_admin", "Super Admin");
      if (role === 1) return t("admin", "Admin");
      return t("user", "Utilisateur");
    }
    const str = String(role).toLowerCase();
    if (str.includes("super")) return t("super_admin", "Super Admin");
    if (str.includes("admin")) return t("admin", "Admin");
    if (str.includes("user") || str.includes("member")) return t("user", "Utilisateur");
    return t(str, String(role));
  };

  const getPrivilegeLabel = (key: string, fallback: string = "") => {
    const map: Record<string, string> = {
      dashboard: t("dashboard", "Tableau de Bord"),
      usage: t("usage_quotas", "Quotas d'Utilisation"),
      trees: t("trees", "Arbres Généalogiques"),
      individuals: t("individuals", "Individus"),
      "sources-archives": t("my_sources", "Sources & Archives"),
      tasks: t("tasks", "Tâches de Recherche"),
      notes: t("notes", "Notes & Références"),
      gallery: t("gallery", "Galerie d'Images"),
      audios: t("audios", "Archives Sonores"),
      documents: t("documents", "Documents & Registres"),
      books: t("books", "Livres & Manuscrits"),
      articles: t("articles", "Articles & Chroniques"),
      users: t("users", "Utilisateurs"),
      "contact-messages": t("contact_messages", "Messages de Contact"),
      newsletter: t("newsletter", "Newsletter"),
      subscriptions: t("subscriptions", "Abonnements"),
      "subscription-payments": t("subscription_payments", "Paiements"),
      "flagged-payments": t("flagged_payments", "Paiements Signalés"),
      "payment-settings": t("payment_settings", "Moyens de Paiement"),
      currencies: t("currencies_exchange", "Taux de Change"),
      "legal-content": t("legal_content", "Contenu Juridique"),
      content: t("public_content_manager", "Contenu CMS"),
      settings: t("settings", "Paramètres"),
    };
    return map[key] || fallback || key;
  };

  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "validated" | "rejected">("all");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionUserId, setActionUserId] = useState<number | null>(null);

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editTarget, setEditTarget] = useState<any>(null);
  const [roles, setRoles] = useState<any[]>([]);

  // Add Form state
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    roleId: 2,
    isValidated: true,
    privileges: [] as string[],
  });
  const [showPassword, setShowPassword] = useState(false);

  // Edit Form state
  const [editForm, setEditForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    roleId: 2,
    isValidated: true,
    status: "active",
    privileges: [] as string[],
  });
  const [showEditPassword, setShowEditPassword] = useState(false);

  const [saving, setSaving] = useState(false);

  // Email modal state
  const [emailModalUser, setEmailModalUser] = useState<any>(null);
  const [emailTemplates, setEmailTemplates] = useState<any[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);

  // Delete with reason & email modal state
  const [deleteModalUser, setDeleteModalUser] = useState<any>(null);
  const [deleteReason, setDeleteReason] = useState("");
  const [sendDeleteEmail, setSendDeleteEmail] = useState(true);

  const [toast, setToast] = useState<{ message: string; tone: "success" | "error" }>({
    message: "",
    tone: "success",
  });

  const notify = useCallback((message: string, tone: "success" | "error" = "success") => {
    setToast({ message, tone });
  }, []);

  useEffect(() => {
    if (!toast.message) return;
    const timer = setTimeout(() => {
      setToast({ message: "", tone: "success" });
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast.message]);

  const loadUsers = useCallback(
    async ({ notify: notifyToast = false } = {}) => {
      setLoading(true);
      setError("");
      try {
        const { data } = await requestWithFallback(
          [() => api.get("/admin/users")],
          shouldFallbackRoute
        );
        const rawList = Array.isArray(data)
          ? data
          : Array.isArray((data as any)?.data)
            ? (data as any).data
            : [];
        const userList = rawList.length
          ? rawList.map((u: any) => {
              const privs = parsePrivileges(u);
              const st = String(u.status || "active").toLowerCase();
              const isValidated =
                u.isValidated === true ||
                u.isVerified === true ||
                u.is_verified === true ||
                u.is_verified === 1 ||
                ["active", "validated", "approved"].includes(st);
              return {
                ...u,
                status: st,
                privileges: privs,
                isVerified: isValidated,
                isValidated,
              };
            })
          : [];
        setUsers(userList);
        if (notifyToast) {
          notify(t("users_loaded", "Utilisateurs chargés avec succès."));
        }
      } catch (err) {
        setUsers([]);
        const message = getApiErrorMessage(err, "Échec du chargement des utilisateurs");
        setError(message);
        notify(message, "error");
      } finally {
        setLoading(false);
      }
    },
    [notify, t]
  );

  useEffect(() => {
    void loadUsers({ notify: false });
  }, [loadUsers]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !saving && !sendingEmail) {
        if (emailModalUser) setEmailModalUser(null);
        else if (showEdit) setShowEdit(false);
        else if (showAdd) setShowAdd(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showAdd, showEdit, emailModalUser, saving, sendingEmail]);

  const statusCounts = useMemo(() => {
    let pending = 0;
    let validated = 0;
    let rejected = 0;
    for (const u of users) {
      const st = String(u.status || "").toLowerCase();
      if (["pending", "unvalidated"].includes(st) || (!u.isValidated && !["rejected", "disabled", "banned"].includes(st))) {
        pending++;
      } else if (["rejected", "disabled", "banned"].includes(st)) {
        rejected++;
      } else {
        validated++;
      }
    }
    return { all: users.length, pending, validated, rejected };
  }, [users]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return users.filter((u) => {
      const st = String(u.status || "").toLowerCase();
      if (statusFilter === "pending") {
        const isPending = ["pending", "unvalidated"].includes(st) || (!u.isValidated && !["rejected", "disabled", "banned"].includes(st));
        if (!isPending) return false;
      } else if (statusFilter === "validated") {
        const isVal = u.isValidated || ["active", "validated", "approved"].includes(st);
        if (!isVal || ["rejected", "disabled", "banned"].includes(st)) return false;
      } else if (statusFilter === "rejected") {
        if (!["rejected", "disabled", "banned"].includes(st)) return false;
      }
      if (!query) return true;
      return (
        String(u.fullName || "").toLowerCase().includes(query) ||
        String(u.email || "").toLowerCase().includes(query) ||
        String(u.phone || u.phoneNumber || "").toLowerCase().includes(query)
      );
    });
  }, [users, q, statusFilter]);

  const loadRoles = useCallback(async () => {
    try {
      const { data } = await api.get("/admin/roles");
      return Array.isArray(data) ? data : Array.isArray((data as any)?.data) ? (data as any).data : [];
    } catch {
      return [
        { id: 2, name: "user" },
        { id: 1, name: "admin" },
        { id: 3, name: "super_admin" },
      ];
    }
  }, []);

  const openAdd = async () => {
    setError("");
    setSaving(false);
    setShowPassword(false);
    setForm({
      fullName: "",
      email: "",
      phone: "",
      password: "",
      roleId: 2,
      isValidated: true,
      privileges: [],
    });
    setShowAdd(true);
    try {
      const data = roles.length ? roles : await loadRoles();
      setRoles(data);
    } catch (err) {
      console.warn("Could not load roles", err);
    }
  };

  const openEdit = async (u: any) => {
    if (!u) return;
    setError("");
    setSaving(false);
    setShowEditPassword(false);
    setEditTarget(u);
    const userPrivs = parsePrivileges(u);
    const st = String(u.status || "active").toLowerCase();
    const isValidated =
      u.isValidated === true ||
      u.isVerified === true ||
      ["active", "validated", "approved"].includes(st);
    setEditForm({
      fullName: String(u.fullName || ""),
      email: String(u.email || ""),
      phone: String(u.phone || u.phoneNumber || ""),
      password: "",
      roleId: Number(u.roleId || u.role_id || u.role) || 2,
      isValidated,
      status: st === "validated" || st === "approved" ? "active" : st || (isValidated ? "active" : "pending"),
      privileges: userPrivs,
    });
    setShowEdit(true);

    if (roles.length) return;
    try {
      const data = await loadRoles();
      setRoles(data);
    } catch (err) {
      console.warn("Could not load roles", err);
    }
  };

  const togglePrivilegeAdd = (key: string) => {
    setForm((prev) => ({
      ...prev,
      privileges: prev.privileges.includes(key)
        ? prev.privileges.filter((p) => p !== key)
        : [...prev.privileges, key],
    }));
  };

  const selectAllPrivilegesAdd = () => {
    setForm((prev) => ({
      ...prev,
      privileges: PRIVILEGE_OPTIONS.map((p) => p.key),
    }));
  };

  const clearAllPrivilegesAdd = () => {
    setForm((prev) => ({ ...prev, privileges: [] }));
  };

  const togglePrivilegeEdit = (key: string) => {
    setEditForm((prev) => ({
      ...prev,
      privileges: prev.privileges.includes(key)
        ? prev.privileges.filter((p) => p !== key)
        : [...prev.privileges, key],
    }));
  };

  const selectAllPrivilegesEdit = () => {
    setEditForm((prev) => ({
      ...prev,
      privileges: PRIVILEGE_OPTIONS.map((p) => p.key),
    }));
  };

  const clearAllPrivilegesEdit = () => {
    setEditForm((prev) => ({ ...prev, privileges: [] }));
  };

  const submitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.email.trim()) {
      notify(t("fill_required_fields", "Veuillez remplir le nom et l'adresse email."), "error");
      return;
    }
    if (form.password && form.password.length < 6) {
      notify(t("password_min_length", "Le mot de passe doit comporter au moins 6 caractères."), "error");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const payload: Record<string, any> = {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        roleId: Number(form.roleId) || 2,
        isValidated: true,
        isVerified: true,
        status: "active",
        privileges: form.privileges,
      };
      if (form.password.trim()) {
        payload.password = form.password.trim();
      }

      const { data } = await api.post("/admin/users", payload);
      const createdUser = {
        ...data,
        fullName: payload.fullName,
        email: payload.email,
        phone: payload.phone || null,
        roleId: payload.roleId,
        roleName:
          roles.find((r) => Number(r.id) === payload.roleId)?.name ||
          (payload.roleId === 3 ? "super_admin" : payload.roleId === 1 ? "admin" : "user"),
        isValidated: payload.isValidated,
        isVerified: payload.isValidated,
        status: payload.status,
        privileges: payload.privileges,
      };
      setUsers((prev) => [createdUser, ...prev]);
      setShowAdd(false);
      notify(t("user_created", "Utilisateur créé avec succès."));
    } catch (err) {
      const message = getApiErrorMessage(err, "Échec de création de l'utilisateur");
      setError(message);
      notify(message, "error");
    } finally {
      setSaving(false);
    }
  };

  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;
    if (editForm.password && editForm.password.length < 6) {
      notify(t("password_min_length", "Le mot de passe doit comporter au moins 6 caractères."), "error");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const payload: Record<string, any> = {
        fullName: editForm.fullName.trim(),
        phone: editForm.phone.trim(),
        roleId: Number(editForm.roleId) || 2,
        isValidated: !["disabled","banned","rejected"].includes(String(editForm.status||"").toLowerCase()),
        isVerified: !["disabled","banned","rejected"].includes(String(editForm.status||"").toLowerCase()),
        status: ["disabled","banned","rejected"].includes(String(editForm.status||"").toLowerCase()) ? editForm.status : "active",
        privileges: editForm.privileges,
      };
      if (editForm.password.trim()) {
        payload.password = editForm.password.trim();
      }

      const { data } = await api.patch(`/admin/users/${editTarget.id}`, payload);
      const updated = data?.user || data || {};

      setUsers((prev) =>
        prev.map((u) =>
          u.id === editTarget.id
            ? {
                ...u,
                ...updated,
                fullName: payload.fullName,
                phone: payload.phone || null,
                roleId: payload.roleId,
                roleName:
                  roles.find((r) => Number(r.id) === Number(payload.roleId))?.name ||
                  updated.roleName ||
                  u.roleName,
                status: payload.status,
                isValidated: payload.isValidated,
                isVerified: payload.isValidated,
                privileges: payload.privileges,
              }
            : u
        )
      );
      setShowEdit(false);
      setEditTarget(null);
      notify(t("user_updated", "Utilisateur mis à jour avec succès."));
    } catch (err) {
      const message = getApiErrorMessage(err, "Échec de modification de l'utilisateur");
      setError(message);
      notify(message, "error");
    } finally {
      setSaving(false);
    }
  };

  
  const [tiers, setTiers] = useState([]);
  const [upgradeTarget, setUpgradeTarget] = useState(null);
  const [upgradeTierId, setUpgradeTierId] = useState("");

  useEffect(() => {
    (async () => {
      try {
        let res;
        try {
          res = await api.get("/admin/subscription-tiers");
        } catch {
          res = await api.get("/subscriptions/tiers");
        }
        const data = res?.data;
        const list = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
        setTiers(list);
      } catch {
        setTiers([]);
      }
    })();
  }, []);

  const openUpgradeModal = (u) => {
    setUpgradeTarget(u);
    const first = Array.isArray(tiers) && tiers[0] ? Number(tiers[0].id) : "";
    setUpgradeTierId(first === "" ? "" : first);
  };

  const handleUpgradeUser = async () => {
    if (!upgradeTarget?.id || !upgradeTierId) {
      notify(t("select_tier_first", "Choisissez un plan d'abonnement."), "error");
      return;
    }
    setSaving(true);
    try {
      await api.patch(`/admin/users/${upgradeTarget.id}/subscription`, { tier_id: Number(upgradeTierId) });
      notify(t("upgrade_success", "Abonnement mis à jour avec succès."));
      setUpgradeTarget(null);
      await loadUsers({ notify: false });
    } catch (err) {
      notify(getApiErrorMessage(err, "Échec de la mise à niveau"), "error");
    } finally {
      setSaving(false);
    }
  };

  const resolveFreeTierId = () => {
    const list = Array.isArray(tiers) ? tiers : [];
    const free = list.find((tier) => /free|basic|starter|gratuit|essai/i.test(String(tier.slug || tier.name || "")));
    if (free?.id) return Number(free.id);
    const sorted = [...list].sort((a, b) => Number(a.sort ?? a.price ?? 0) - Number(b.sort ?? b.price ?? 0));
    return sorted[0]?.id ? Number(sorted[0].id) : null;
  };

  const handleRevokeSubscription = async (u) => {
    const freeId = resolveFreeTierId();
    if (!freeId) {
      notify(t("no_tiers_available", "Aucun plan d'abonnement disponible pour révoquer."), "error");
      return;
    }
    if (!window.confirm(t("confirm_revoke_sub", "Révoquer / rétrograder l'abonnement de cet utilisateur ?"))) return;
    setSaving(true);
    try {
      await api.patch(`/admin/users/${u.id}/subscription`, { tier_id: freeId });
      notify(t("revoke_success", "Abonnement révoqué / rétrogradé."));
      await loadUsers({ notify: false });
    } catch (err) {
      notify(getApiErrorMessage(err, "Échec de la révocation"), "error");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleAccountStatus = async (u) => {
    const st = String(u.status || "").toLowerCase();
    const currentlyActive = ["active", "validated", "approved"].includes(st) || u.isValidated;
    const next = currentlyActive ? "disabled" : "active";
    if (!window.confirm(currentlyActive
      ? t("confirm_disable_user", "Désactiver ce compte ?")
      : t("confirm_enable_user", "Réactiver ce compte ?"))) return;
    setSaving(true);
    try {
      await api.patch(`/admin/users/${u.id}`, {
        status: next,
        isValidated: next === "active",
        isVerified: next === "active",
      });
      notify(next === "active"
        ? t("account_enabled", "Compte réactivé.")
        : t("account_disabled", "Compte désactivé."));
      await loadUsers({ notify: false });
    } catch (err) {
      notify(getApiErrorMessage(err, "Échec du changement de statut"), "error");
    } finally {
      setSaving(false);
    }
  };


  const handleQuickValidate = async (targetUser: any) => {
    if (!targetUser?.id) return;
    setActionUserId(Number(targetUser.id));
    setError("");
    try {
      let resData: any = null;
      try {
        const res = await api.patch(`/admin/users/${targetUser.id}/validate`);
        resData = res.data?.user || res.data;
      } catch {
        const res = await api.patch(`/admin/users/${targetUser.id}`, {
          status: "active",
          isValidated: true,
          isVerified: true,
        });
        resData = res.data?.user || res.data;
      }
      setUsers((prev) =>
        prev.map((u) =>
          u.id === targetUser.id
            ? {
                ...u,
                ...(resData || {}),
                status: resData?.status || "active",
                isValidated: true,
                isVerified: true,
              }
            : u
        )
      );
      notify(t("user_validated", "Compte utilisateur validé et activé avec succès."));
    } catch (err) {
      const message = getApiErrorMessage(err, "Échec de validation de l'utilisateur");
      notify(message, "error");
    } finally {
      setActionUserId(null);
    }
  };

  const handleQuickReject = async (targetUser: any) => {
    if (!targetUser?.id) return;
    if (Number(targetUser.id) === Number(currentUser?.id)) {
      notify(t("cannot_reject_self", "Vous ne pouvez pas refuser votre propre compte."), "error");
      return;
    }
    setActionUserId(Number(targetUser.id));
    setError("");
    try {
      let resData: any = null;
      try {
        const res = await api.patch(`/admin/users/${targetUser.id}/reject-validation`);
        resData = res.data?.user || res.data;
      } catch {
        const res = await api.patch(`/admin/users/${targetUser.id}`, {
          status: "rejected",
          isValidated: false,
          isVerified: false,
        });
        resData = res.data?.user || res.data;
      }
      setUsers((prev) =>
        prev.map((u) =>
          u.id === targetUser.id
            ? {
                ...u,
                ...(resData || {}),
                status: "rejected",
                isValidated: false,
                isVerified: false,
              }
            : u
        )
      );
      notify(t("user_rejected", "Compte utilisateur refusé / désactivé."));
    } catch (err) {
      const message = getApiErrorMessage(err, "Échec du refus de l'utilisateur");
      notify(message, "error");
    } finally {
      setActionUserId(null);
    }
  };

  const deleteUser = (userToDelete: any) => {
    if (!userToDelete?.id) return;
    if (Number(userToDelete.id) === Number(currentUser?.id)) {
      notify(t("cannot_delete_self", "Vous ne pouvez pas supprimer votre propre compte."), "error");
      return;
    }
    setDeleteReason("");
    setSendDeleteEmail(true);
    setDeleteModalUser(userToDelete);
  };

  const confirmDeleteUser = async () => {
    if (!deleteModalUser?.id) return;
    setSaving(true);
    setError("");
    try {
      if (sendDeleteEmail && deleteModalUser.email) {
        const reasonText =
          deleteReason.trim() ||
          t("default_delete_reason", "Non-respect des conditions d'utilisation ou compte inactif.");
        try {
          await api.post("/admin/send-email", {
            to: deleteModalUser.email,
            subject: t("account_removed_email_subject", "Suppression de votre compte | Roots Tunisia"),
            body: `Bonjour ${deleteModalUser.fullName || ""},\n\nVotre compte sur la plateforme Roots Tunisia a été supprimé par l'administration.\n\nMotif : ${reasonText}\n\nSi vous pensez qu'il s'agit d'une erreur, vous pouvez contacter notre support.\n\nCordialement,\nL'équipe Roots Tunisia`,
          });
        } catch {
          // Continue with deletion even if SMTP relay is temporarily unavailable
        }
      }
      await api.delete(`/admin/users/${deleteModalUser.id}`);
      setUsers((prev) => prev.filter((u) => u.id !== deleteModalUser.id));
      setDeleteModalUser(null);
      notify(
        sendDeleteEmail
          ? t("user_deleted_and_notified", "Utilisateur supprimé et informé par email.")
          : t("user_deleted", "Utilisateur supprimé avec succès.")
      );
    } catch (err) {
      const message = getApiErrorMessage(err, "Échec de suppression de l'utilisateur");
      setError(message);
      notify(message, "error");
    } finally {
      setSaving(false);
    }
  };

  const openEmailModal = (userTarget: any) => {
    setEmailModalUser(userTarget);
    const tmpls = [
      {
        id: "welcome",
        name: t("tmpl_welcome", "Bienvenue & Onboarding (Welcome)"),
        subject: `Bienvenue sur la plateforme Roots Tunisia, ${userTarget.fullName || ""}`,
        body: `Bonjour ${userTarget.fullName || ""},\n\nNous sommes ravis de vous compter parmi nos membres sur Roots Tunisia. Vous pouvez dès maintenant explorer les archives, documenter vos ancêtres et enrichir votre arbre généalogique.\n\nCordialement,\nL'équipe Roots Tunisia`,
      },
      {
        id: "verification",
        name: t("tmpl_verification", "Validation & Confirmation de Compte"),
        subject: "Confirmation et activation de votre compte | Roots Tunisia",
        body: `Bonjour ${userTarget.fullName || ""},\n\nVotre compte a été vérifié et activé par notre équipe. Vous pouvez désormais vous connecter directement.\n\nBien cordialement,\nL'équipe d'administration`,
      },
      {
        id: "upgrade",
        name: t("tmpl_upgrade", "Attribution d'Accès & Privilèges"),
        subject: "Mise à jour de vos privilèges d'accès | Roots Tunisia",
        body: `Bonjour ${userTarget.fullName || ""},\n\nVos droits et privilèges d'accès ont été mis à jour sur la plateforme. Connectez-vous pour découvrir vos nouveaux espaces.\n\nCordialement,\nAdministration Roots Tunisia`,
      },
      {
        id: "custom",
        name: t("tmpl_custom", "Message Personnalisé"),
        subject: "",
        body: `Bonjour ${userTarget.fullName || ""},\n\n`,
      },
    ];
    setEmailTemplates(tmpls);
    setSelectedTemplateId("welcome");
    setEmailSubject(tmpls[0].subject);
    setEmailBody(tmpls[0].body);
  };

  const handleTemplateChange = (tmplId: string) => {
    setSelectedTemplateId(tmplId);
    const tmpl = emailTemplates.find((t) => t.id === tmplId);
    if (tmpl) {
      setEmailSubject(tmpl.subject);
      setEmailBody(tmpl.body);
    }
  };

  const handleSendEmail = async () => {
    if (!emailModalUser?.email || !emailSubject.trim() || !emailBody.trim()) {
      notify(t("email_fields_required", "Veuillez renseigner le sujet et le contenu du message."), "error");
      return;
    }
    setSendingEmail(true);
    try {
      await api.post("/admin/send-email", {
        to: emailModalUser.email,
        subject: emailSubject.trim(),
        body: emailBody.trim(),
      });
      notify(t("email_sent_success", `Email envoyé avec succès via SMTP à ${emailModalUser.email}`));
      setEmailModalUser(null);
    } catch (err: any) {
      notify(err?.response?.data?.message || t("email_send_failed", "Échec de l'envoi de l'email"), "error");
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div className={`p-4 sm:p-6 min-h-screen ${pageBg} ${text} heritage-page-root`}>
      <Toast message={toast.message} tone={toast.tone} />

      {/* Header Banner */}
      <div
        className={`rounded-2xl p-6 mb-6 border ${border} shadow-lg
        bg-gradient-to-br from-[var(--brand-teal)]/10 via-[var(--brand-gold)]/8 to-[var(--teal-dark)]/10 
        heritage-panel heritage-panel--accent backdrop-blur-sm`}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-[var(--foreground)]">
              {t("users", "Gestion des Utilisateurs")}
            </h1>
            <p className="opacity-75 text-sm mt-1 max-w-2xl">
              {t(
                "users_desc",
                "Créez et gérez les comptes, rôles, abonnements et accès aux pages. Les comptes sont actifs immédiatement."
              )}
            </p>
          </div>

          <button
            className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer
            bg-gradient-to-r from-[var(--brand-teal)] to-[var(--teal-dark)] text-white hover:opacity-95`}
            type="button"
            onClick={openAdd}
            disabled={!canManageUsers}
            title={
              !canManageUsers
                ? t("admin_only", "Réservé aux administrateurs")
                : t("add_user_hint", "Ajouter un nouvel utilisateur")
            }
          >
            <UserPlus className="w-5 h-5" />
            <span>{t("add_user", "Ajouter un Utilisateur")}</span>
          </button>
        </div>

        {/* Search Bar & Validation Filter Pills */}
        <div className="mt-5 flex flex-col sm:flex-row gap-3 sm:items-center">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-color)]/60" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className={`heritage-input w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm
              focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)]/30 focus:border-[var(--brand-gold)]/60 transition-all
              ${inputBg} ${inputText} ${border}`}
              placeholder={t("search_users", "Rechercher par nom, email ou numéro de téléphone...")}
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                { id: "all", label: t("all", "Tous"), count: statusCounts.all },
                { id: "validated", label: t("active_accounts", "Actifs"), count: statusCounts.validated },
                { id: "rejected", label: t("disabled_accounts", "Désactivés"), count: statusCounts.rejected },
              ] as const
            ).map((tab) => {
              const active = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    active
                      ? "bg-[var(--brand-teal)] text-white border-[var(--brand-teal)] shadow-sm"
                      : `${card} ${border} hover:border-[var(--brand-gold)]/60`
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      active
                        ? "bg-white/20 text-white"
                        : tab.id === "pending" && tab.count > 0
                        ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                        : "bg-black/5 dark:bg-white/10"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className={`rounded-2xl border ${border} ${card} overflow-hidden shadow-md heritage-panel`}>
        {loading ? (
          <div className="p-16 text-center opacity-70">
            <div className="inline-block animate-spin rounded-full h-9 w-9 border-b-2 border-[var(--brand-teal)]"></div>
            <p className="mt-4 text-sm font-medium">{t("loading", "Chargement des utilisateurs...")}</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <div className={`text-base font-semibold ${isDark ? "text-red-400" : "text-red-600"}`}>{error}</div>
            <button
              onClick={() => void loadUsers({ notify: true })}
              className="mt-3 px-4 py-1.5 rounded-lg border border-[var(--border)] text-xs font-semibold hover:bg-black/5"
            >
              Réessayer
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center opacity-60">
            <User className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="text-sm font-medium">{t("no_results", "Aucun utilisateur trouvé.")}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="heritage-table w-full text-sm">
              <thead className={`${subtle} ${isDark ? "bg-[#2c1810]/50" : "bg-[#f8f5ef]"}`}>
                <tr className={`text-start border-b ${border}`}>
                  <th className="py-3.5 px-5 text-start font-semibold text-[var(--brand-teal)]">
                    {t("full_name", "Nom & Utilisateur")}
                  </th>
                  <th className="py-3.5 px-5 text-start font-semibold text-[var(--brand-teal)]">
                    {t("email", "Email")}
                  </th>
                  <th className="py-3.5 px-5 text-start font-semibold text-[var(--brand-teal)]">
                    {t("phone", "Téléphone")}
                  </th>
                  <th className="py-3.5 px-5 text-start font-semibold text-[var(--brand-teal)]">
                    {t("role", "Rôle")}
                  </th>
                  <th className="py-3.5 px-5 text-start font-semibold text-[var(--brand-teal)]">
                    {t("account_status", "Statut du compte")}
                  </th>
                  <th className="py-3.5 px-5 text-start font-semibold text-[var(--brand-teal)]">
                    {t("access_pages", "Accès Pages")}
                  </th>
                  {canManageUsers ? (
                    <th className="py-3.5 px-5 text-end font-semibold text-[var(--brand-teal)]">
                      {t("actions", "Actions")}
                    </th>
                  ) : null}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {filtered.map((u) => {
                  const userPrivs = u.privileges || [];
                  const rowStatus = String(u.status || "active").toLowerCase();
                  const isRejectedOrDisabled = ["rejected", "disabled", "banned"].includes(rowStatus);
                  const isVerified =
                    !isRejectedOrDisabled &&
                    (u.isValidated === true ||
                      u.isVerified === true ||
                      ["active", "validated", "approved"].includes(rowStatus));
                  const isCurrentUser = Number(u.id) === Number(currentUser?.id);
                  const isRowBusy = saving || actionUserId === Number(u.id);

                  return (
                    <tr
                      key={u.id}
                      className={`admin-table-row transition-colors ${
                        isCurrentUser
                          ? "bg-[var(--brand-gold)]/10"
                          : "hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                      }`}
                    >
                      <td className="py-3.5 px-5 text-start">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                              Number(u.roleId || u.role) === 3
                                ? "bg-amber-500/15 text-amber-500"
                                : Number(u.roleId || u.role) === 1
                                ? "bg-teal-500/15 text-teal-600 dark:text-teal-400"
                                : "bg-slate-500/15 text-slate-600 dark:text-slate-300"
                            }`}
                          >
                            {Number(u.roleId || u.role) === 3 ? (
                              <Crown className="w-4 h-4" />
                            ) : Number(u.roleId || u.role) === 1 ? (
                              <ShieldCheck className="w-4 h-4" />
                            ) : (
                              <User className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-sm flex items-center gap-1.5">
                              <span>{u.fullName || "—"}</span>
                              {isCurrentUser && (
                                <span className="text-[0.65rem] uppercase tracking-wider px-1.5 py-0.5 rounded bg-[var(--brand-gold)]/20 text-[var(--brand-gold)] font-bold">
                                  Vous
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-[var(--muted-foreground)]">ID #{u.id}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-5 text-start">
                        <div className="flex items-center gap-1.5 text-xs sm:text-sm">
                          <Mail className="w-3.5 h-3.5 opacity-60 text-[var(--brand-teal)]" />
                          <span>{u.email}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-5 text-start">
                        {u.phone || u.phoneNumber ? (
                          <div className="flex items-center gap-1.5 text-xs sm:text-sm">
                            <Phone className="w-3.5 h-3.5 opacity-60 text-[var(--brand-teal)]" />
                            <span>{u.phone || u.phoneNumber}</span>
                          </div>
                        ) : (
                          <span className="opacity-40 text-xs">—</span>
                        )}
                      </td>

                      <td className="py-3.5 px-5 text-start">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                            Number(u.roleId || u.role) === 3
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25"
                              : Number(u.roleId || u.role) === 1
                              ? "bg-[var(--brand-teal)]/10 text-[var(--brand-teal)] border-[var(--brand-teal)]/25"
                              : "bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-500/20"
                          }`}
                        >
                          <ShieldCheck className="w-3 h-3" />
                          {getRoleLabel(u.roleName || u.roleId || u.role)}
                        </span>
                      </td>

                      <td className="py-3.5 px-5 text-start">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {isRejectedOrDisabled ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/25">
                              <XCircle className="w-3 h-3" />
                              {rowStatus === "rejected"
                                ? t("rejected", "Refusé")
                                : t("disabled", "Désactivé")}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                              <CheckCircle2 className="w-3 h-3" />
                              {t("active", "Actif")}
                            </span>
                          )}

                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[0.7rem] font-medium ${
                              isVerified
                                ? isDark
                                  ? "bg-green-500/15 text-green-400"
                                  : "bg-green-100 text-green-700"
                                : isRejectedOrDisabled
                                ? isDark
                                  ? "bg-red-500/15 text-red-400"
                                  : "bg-red-100 text-red-700"
                                : isDark
                                ? "bg-amber-500/15 text-amber-400"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {isRejectedOrDisabled
                              ? t("inactive", "Inactif")
                              : t("active", "Actif")}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-5 text-start">
                        {userPrivs.length > 0 ? (
                          <span
                            title={userPrivs.join(", ")}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-[var(--brand-gold)]/15 text-[var(--brand-gold)] border border-[var(--brand-gold)]/30"
                          >
                            <Key className="w-3 h-3" />
                            <span>
                              {userPrivs.length} {t("pages", "pages")}
                            </span>
                          </span>
                        ) : (
                          <span className="text-xs opacity-40">{t("role_standard", "Standard")}</span>
                        )}
                      </td>

                      {canManageUsers ? (
                        <td className="py-3.5 px-5 text-end">
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">

                            <button
                              type="button"
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-[var(--brand-teal)] text-white hover:opacity-90 transition-all shadow-sm disabled:opacity-50 cursor-pointer"
                              onClick={() => openUpgradeModal(u)}
                              disabled={isRowBusy}
                              title={t("upgrade_subscription", "Upgrader l'abonnement")}
                            >
                              <ArrowUpCircle className="w-3.5 h-3.5" />
                              <span>{t("upgrade", "Upgrade")}</span>
                            </button>

                            <button
                              type="button"
                              className="p-2 rounded-lg transition-all hover:shadow-sm disabled:opacity-50 bg-violet-500/10 text-violet-600 dark:text-violet-400 hover:bg-violet-600 hover:text-white border border-violet-500/25 cursor-pointer"
                              onClick={() => void handleRevokeSubscription(u)}
                              disabled={isRowBusy}
                              title={t("revoke_subscription", "Révoquer / rétrograder l'abonnement")}
                            >
                              <ArrowDownCircle className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              className="p-2 rounded-lg transition-all hover:shadow-sm disabled:opacity-50 bg-slate-500/10 text-slate-600 dark:text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-500/25 cursor-pointer"
                              onClick={() => void handleToggleAccountStatus(u)}
                              disabled={isRowBusy || isCurrentUser}
                              title={isVerified ? t("disable_account", "Désactiver le compte") : t("enable_account", "Réactiver le compte")}
                            >
                              {isVerified ? <Ban className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                            </button>

                            <button
                              type="button"
                              className={`p-2 rounded-lg border ${border} transition-all hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer`}
                              onClick={() => openEmailModal(u)}
                              disabled={isRowBusy}
                              title={t("send_email", "Envoyer un email SMTP")}
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${border} 
                              transition-all hover:shadow-sm disabled:opacity-50 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-xs font-semibold cursor-pointer`}
                              onClick={() => openEdit(u)}
                              disabled={isRowBusy}
                            >
                              <Pencil className="w-3.5 h-3.5 text-[var(--brand-teal)]" />
                              <span>{t("edit", "Modifier")}</span>
                            </button>

                            <button
                              type="button"
                              className={`p-2 rounded-lg transition-all hover:shadow-sm disabled:opacity-50 bg-red-600/10 text-red-600 hover:bg-red-600 hover:text-white border border-red-500/20 cursor-pointer`}
                              onClick={() => deleteUser(u)}
                              disabled={isRowBusy || isCurrentUser}
                              title={
                                isCurrentUser
                                  ? t("cannot_delete_self", "Impossible de supprimer votre propre compte")
                                  : t("delete", "Supprimer")
                              }
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      ) : null}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ===================== ADD USER MODAL ===================== */}
      {showAdd ? createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 backdrop-blur-sm bg-black/65">
          <div
            className="absolute inset-0"
            onClick={() => (saving ? null : setShowAdd(false))}
          />
          <div
            className={`relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl border ${border} ${card} shadow-2xl heritage-panel overflow-hidden`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-[var(--border)] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--brand-teal)]/15 text-[var(--brand-teal)] flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--foreground)]">
                    {t("add_user", "Ajouter un Utilisateur")}
                  </h3>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {t("add_user_sub", "Créer un profil complet avec identifiants, statut validé et accès aux pages.")}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer"
                onClick={() => setShowAdd(false)}
                disabled={saving}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <form className="p-5 space-y-5 overflow-y-auto" onSubmit={submitAdd}>
              {/* Section 1: Coordonnées & Identifiants */}
              <div className="space-y-3.5">
                <div className="flex items-center gap-2 pb-1 border-b border-[var(--border)]">
                  <User className="w-4 h-4 text-[var(--brand-teal)]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
                    1. Identité & Coordonnées
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <label className="block">
                    <span className="block text-xs font-semibold mb-1 text-[var(--foreground)]">
                      {t("full_name", "Nom & Prénom")} <span className="text-red-500">*</span>
                    </span>
                    <input
                      value={form.fullName}
                      onChange={(e) => setForm((s) => ({ ...s, fullName: e.target.value }))}
                      required
                      className={`heritage-input w-full px-3.5 py-2 rounded-xl border text-sm ${inputBg} ${inputText} ${border}
                      focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)]/30`}
                      placeholder={t("ph_user_name", "Ex: Mohamed Ben Salah")}
                      disabled={saving}
                    />
                  </label>

                  <label className="block">
                    <span className="block text-xs font-semibold mb-1 text-[var(--foreground)]">
                      {t("email", "Adresse Email")} <span className="text-red-500">*</span>
                    </span>
                    <input
                      value={form.email}
                      onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                      required
                      type="email"
                      className={`heritage-input w-full px-3.5 py-2 rounded-xl border text-sm ${inputBg} ${inputText} ${border}
                      focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)]/30`}
                      placeholder={t("ph_user_email", "nom@exemple.com")}
                      disabled={saving}
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <label className="block">
                    <span className="block text-xs font-semibold mb-1 text-[var(--foreground)]">
                      {t("phone", "Numéro de Téléphone")} <span className="text-xs opacity-60">({t("optional", "Optionnel")})</span>
                    </span>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
                      <input
                        value={form.phone}
                        onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
                        className={`heritage-input w-full pl-9 pr-3.5 py-2 rounded-xl border text-sm ${inputBg} ${inputText} ${border}
                        focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)]/30`}
                        placeholder={t("ph_phone_tunisia", "+216 20 000 000")}
                        disabled={saving}
                      />
                    </div>
                  </label>

                  <label className="block">
                    <span className="block text-xs font-semibold mb-1 text-[var(--foreground)]">
                      {t("password", "Mot de Passe")}
                    </span>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
                      <input
                        value={form.password}
                        onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
                        type={showPassword ? "text" : "password"}
                        className={`heritage-input w-full pl-9 pr-10 py-2 rounded-xl border text-sm ${inputBg} ${inputText} ${border}
                        focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)]/30`}
                        placeholder={t("ph_user_password_opt", "Min. 6 caractères (ou laisser vide)")}
                        disabled={saving}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <span className="text-[0.68rem] text-[var(--muted-foreground)] mt-0.5 block">
                      Laissez vide pour générer automatiquement un code d'accès sécurisé.
                    </span>
                  </label>
                </div>
              </div>

              {/* Section 2: Rôle du compte */}
              <div className="space-y-3.5">
                <div className="flex items-center gap-2 pb-1 border-b border-[var(--border)]">
                  <ShieldCheck className="w-4 h-4 text-[var(--brand-gold)]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
                    2. Rôle du compte
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-[var(--foreground)]">
                      {t("role", "Rôle du Compte")}
                    </label>
                    <select
                      value={form.roleId}
                      onChange={(e) => setForm((s) => ({ ...s, roleId: Number(e.target.value) }))}
                      className={`heritage-input w-full px-3.5 py-2.5 rounded-xl border text-sm ${inputBg} ${inputText} ${border}
                      focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)]/30 cursor-pointer`}
                      disabled={saving}
                    >
                      <option value={2}>{t("user_standard_member", "Utilisateur (Membre Standard)")}</option>
                      <option value={1}>{t("admin_page_manager", "Administrateur (Gestionnaire de Pages)")}</option>
                      {isSuperAdmin && <option value={3}>{t("super_admin_full_access", "Super Administrateur (Accès Total)")}</option>}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1 text-[var(--foreground)]">
                      {t("account_status", "Statut du compte")}
                    </label>
                    <div className="p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/50">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t("status_validated_active", "Actif immédiatement")}</span>
                    </div>
                  </div>
                </div>
              </div>
              </div>

              {/* Section 3: Accès aux Pages & Permissions Admin */}
              <div className="space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-1 border-b border-[var(--border)]">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[var(--brand-teal)]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
                      3. Accès aux Pages & Permissions ({form.privileges.length}/{PRIVILEGE_OPTIONS.length})
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <button
                      type="button"
                      onClick={selectAllPrivilegesAdd}
                      className="px-2 py-1 rounded-lg bg-[var(--brand-teal)]/10 text-[var(--brand-teal)] hover:bg-[var(--brand-teal)]/20 font-semibold cursor-pointer"
                    >
                      Tout sélectionner
                    </button>
                    <button
                      type="button"
                      onClick={clearAllPrivilegesAdd}
                      className="px-2 py-1 rounded-lg bg-black/5 dark:bg-white/5 text-[var(--muted-foreground)] hover:text-[var(--foreground)] font-semibold cursor-pointer"
                    >
                      Tout désélectionner
                    </button>
                  </div>
                </div>

                <p className="text-xs text-[var(--muted-foreground)]">
                  Cochez les pages et modules d'administration auxquels ce compte aura accès :
                </p>

                <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-56 overflow-y-auto p-2.5 rounded-xl border ${border} ${inputBg}`}>
                  {PRIVILEGE_OPTIONS.map((opt) => {
                    const isChecked = form.privileges.includes(opt.key);
                    const IconComp = opt.Icon;
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => togglePrivilegeAdd(opt.key)}
                        className={`flex items-center gap-2 p-2 rounded-lg text-start text-xs font-medium transition-all cursor-pointer border ${
                          isChecked
                            ? "bg-[var(--brand-teal)]/15 border-[var(--brand-teal)]/40 text-[var(--brand-teal)] font-semibold"
                            : "border-transparent hover:bg-black/5 dark:hover:bg-white/5 opacity-80"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                            isChecked
                              ? "bg-[var(--brand-teal)] border-[var(--brand-teal)] text-white"
                              : "border-[var(--border)] bg-white dark:bg-gray-800"
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <IconComp className="w-3.5 h-3.5 shrink-0 opacity-70" />
                        <span className="truncate">{getPrivilegeLabel(opt.key, opt.label)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {error ? (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 font-semibold">
                  {error}
                </div>
              ) : null}

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl border border-[var(--border)] text-xs font-semibold cursor-pointer hover:bg-black/5 dark:hover:bg-white/5"
                  onClick={() => setShowAdd(false)}
                  disabled={saving}
                >
                  {t("cancel", "Annuler")}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold text-xs shadow-md hover:shadow-lg disabled:opacity-50 bg-gradient-to-r from-[var(--brand-teal)] to-[var(--teal-dark)] text-white cursor-pointer"
                  disabled={saving}
                >
                  {saving ? t("creating", "Création en cours...") : t("create_user", "Enregistrer & Créer")}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      ) : null}

      {/* ===================== EDIT USER MODAL ===================== */}
      {showEdit ? createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 backdrop-blur-sm bg-black/65">
          <div
            className="absolute inset-0"
            onClick={() => (saving ? null : setShowEdit(false))}
          />
          <div
            className={`relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl border ${border} ${card} shadow-2xl heritage-panel overflow-hidden`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-[var(--border)] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--brand-gold)]/15 text-[var(--brand-gold)] flex items-center justify-center">
                  <Pencil className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--foreground)]">
                    {t("edit_user", "Modifier l'Utilisateur")}
                  </h3>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {editForm.email} (ID #{editTarget?.id})
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer"
                onClick={() => setShowEdit(false)}
                disabled={saving}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <form className="p-5 space-y-5 overflow-y-auto" onSubmit={submitEdit}>
              {/* Section 1: Informations de Base */}
              <div className="space-y-3.5">
                <div className="flex items-center gap-2 pb-1 border-b border-[var(--border)]">
                  <User className="w-4 h-4 text-[var(--brand-teal)]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
                    1. Informations & Mot de Passe
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <label className="block">
                    <span className="block text-xs font-semibold mb-1 text-[var(--foreground)]">
                      {t("full_name", "Nom & Prénom")} <span className="text-red-500">*</span>
                    </span>
                    <input
                      value={editForm.fullName}
                      onChange={(e) => setEditForm((s) => ({ ...s, fullName: e.target.value }))}
                      required
                      className={`heritage-input w-full px-3.5 py-2 rounded-xl border text-sm ${inputBg} ${inputText} ${border}
                      focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)]/30`}
                      disabled={saving}
                    />
                  </label>

                  <label className="block">
                    <span className="block text-xs font-semibold mb-1 text-[var(--foreground)]">
                      {t("phone", "Numéro de Téléphone")}
                    </span>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
                      <input
                        value={editForm.phone}
                        onChange={(e) => setEditForm((s) => ({ ...s, phone: e.target.value }))}
                        className={`heritage-input w-full pl-9 pr-3.5 py-2 rounded-xl border text-sm ${inputBg} ${inputText} ${border}
                        focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)]/30`}
                        placeholder={t("ph_phone_tunisia_short", "+216 ...")}
                        disabled={saving}
                      />
                    </div>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-[var(--foreground)]">
                    {t("new_password", "Nouveau Mot de Passe (Optionnel)")}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
                    <input
                      value={editForm.password}
                      onChange={(e) => setEditForm((s) => ({ ...s, password: e.target.value }))}
                      type={showEditPassword ? "text" : "password"}
                      className={`heritage-input w-full pl-9 pr-10 py-2 rounded-xl border text-sm ${inputBg} ${inputText} ${border}
                      focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)]/30`}
                      placeholder={t("ph_user_password_keep", "Laisser vide pour ne pas modifier")}
                      disabled={saving}
                    />
                    <button
                      type="button"
                      onClick={() => setShowEditPassword(!showEditPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 cursor-pointer"
                    >
                      {showEditPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Section 2: Rôle & Statut */}
              <div className="space-y-3.5">
                <div className="flex items-center gap-2 pb-1 border-b border-[var(--border)]">
                  <ShieldCheck className="w-4 h-4 text-[var(--brand-gold)]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
                    {t("sec_role_status", "2. Rôle & Statut du compte")}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-[var(--foreground)]">
                      {t("role", "Rôle")}
                    </label>
                    <select
                      value={editForm.roleId}
                      onChange={(e) => setEditForm((s) => ({ ...s, roleId: Number(e.target.value) }))}
                      className={`heritage-input w-full px-3 py-2 rounded-xl border text-xs sm:text-sm ${inputBg} ${inputText} ${border}
                      focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)]/30 cursor-pointer`}
                      disabled={saving}
                    >
                      <option value={2}>{t("role_user", "Utilisateur")}</option>
                      <option value={1}>{t("role_admin", "Administrateur")}</option>
                      {isSuperAdmin && <option value={3}>{t("role_super_admin", "Super Administrateur")}</option>}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1 text-[var(--foreground)]">
                      {t("account_status", "Statut du Compte")}
                    </label>
                    <select
                      value={editForm.status}
                      onChange={(e) => {
                        const next = e.target.value;
                        setEditForm((s) => ({
                          ...s,
                          status: next,
                          isValidated: next === "active",
                        }));
                      }}
                      className={`heritage-input w-full px-3 py-2 rounded-xl border text-xs sm:text-sm ${inputBg} ${inputText} ${border}
                      focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)]/30 cursor-pointer`}
                      disabled={saving}
                    >
                      <option value="active">{t("status_active", "Actif")}</option>
                      <option value="disabled">{t("status_disabled", "Désactivé")}</option>
                      <option value="banned">{t("status_banned", "Suspendu")}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 3: Accès aux Pages & Permissions Admin */}
              <div className="space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-1 border-b border-[var(--border)]">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[var(--brand-teal)]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
                      3. Accès aux Pages & Permissions ({editForm.privileges.length}/{PRIVILEGE_OPTIONS.length})
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <button
                      type="button"
                      onClick={selectAllPrivilegesEdit}
                      className="px-2 py-1 rounded-lg bg-[var(--brand-teal)]/10 text-[var(--brand-teal)] hover:bg-[var(--brand-teal)]/20 font-semibold cursor-pointer"
                    >
                      Tout sélectionner
                    </button>
                    <button
                      type="button"
                      onClick={clearAllPrivilegesEdit}
                      className="px-2 py-1 rounded-lg bg-black/5 dark:bg-white/5 text-[var(--muted-foreground)] hover:text-[var(--foreground)] font-semibold cursor-pointer"
                    >
                      Tout désélectionner
                    </button>
                  </div>
                </div>

                <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-56 overflow-y-auto p-2.5 rounded-xl border ${border} ${inputBg}`}>
                  {PRIVILEGE_OPTIONS.map((opt) => {
                    const isChecked = editForm.privileges.includes(opt.key);
                    const IconComp = opt.Icon;
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => togglePrivilegeEdit(opt.key)}
                        className={`flex items-center gap-2 p-2 rounded-lg text-start text-xs font-medium transition-all cursor-pointer border ${
                          isChecked
                            ? "bg-[var(--brand-teal)]/15 border-[var(--brand-teal)]/40 text-[var(--brand-teal)] font-semibold"
                            : "border-transparent hover:bg-black/5 dark:hover:bg-white/5 opacity-80"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                            isChecked
                              ? "bg-[var(--brand-teal)] border-[var(--brand-teal)] text-white"
                              : "border-[var(--border)] bg-white dark:bg-gray-800"
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <IconComp className="w-3.5 h-3.5 shrink-0 opacity-70" />
                        <span className="truncate">{getPrivilegeLabel(opt.key, opt.label)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {error ? (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 font-semibold">
                  {error}
                </div>
              ) : null}

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl border border-[var(--border)] text-xs font-semibold cursor-pointer hover:bg-black/5 dark:hover:bg-white/5"
                  onClick={() => setShowEdit(false)}
                  disabled={saving}
                >
                  {t("cancel", "Annuler")}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold text-xs shadow-md hover:shadow-lg disabled:opacity-50 bg-gradient-to-r from-[var(--brand-teal)] to-[var(--teal-dark)] text-white cursor-pointer"
                  disabled={saving}
                >
                  {saving ? t("saving", "Enregistrement...") : t("save", "Sauvegarder les modifications")}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      ) : null}

      {/* ===================== SEND EMAIL VIA SMTP MODAL ===================== */}
      {emailModalUser ? createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm bg-black/65"
          onClick={() => (sendingEmail ? null : setEmailModalUser(null))}
        >
          <div
            className={`w-full max-w-lg rounded-2xl border ${border} ${card} p-6 shadow-2xl space-y-4 text-start`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[var(--gold)]/20 text-[var(--gold)]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[var(--foreground)]">
                    {t("send_smtp_email_to", "Envoyer un Email au Membre")}
                  </h3>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {emailModalUser.fullName} &lt;{emailModalUser.email}&gt;
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEmailModalUser(null)}
                className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  {t("choose_email_model", "Modèle d'email prêt à l'emploi :")}
                </label>
                <select
                  value={selectedTemplateId}
                  onChange={(e) => handleTemplateChange(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border ${border} ${inputBg} ${inputText} text-xs outline-none focus:border-[var(--gold)] cursor-pointer`}
                >
                  {emailTemplates.map((tmpl) => (
                    <option key={tmpl.id} value={tmpl.id}>
                      {tmpl.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  {t("email_subject", "Objet du message :")}
                </label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border ${border} ${inputBg} ${inputText} text-xs outline-none focus:border-[var(--gold)]`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  {t("email_content", "Corps du message :")}
                </label>
                <textarea
                  rows={6}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border ${border} ${inputBg} ${inputText} text-xs outline-none focus:border-[var(--gold)] leading-relaxed`}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
              <span className="text-[0.68rem] text-[var(--muted-foreground)]">
                Relais SMTP: Hostinger SSL (devteam@rootstunisia.com)
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEmailModalUser(null)}
                  className="px-4 py-2 rounded-xl border border-[var(--border)] text-xs font-semibold cursor-pointer"
                >
                  {t("cancel", "Annuler")}
                </button>

                <button
                  type="button"
                  onClick={handleSendEmail}
                  disabled={sendingEmail}
                  className="px-4 py-2 rounded-xl bg-[var(--gold)] text-black text-xs font-bold inline-flex items-center gap-1.5 shadow-sm hover:opacity-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Send className={`w-3.5 h-3.5 ${sendingEmail ? "animate-spin" : ""}`} />
                  <span>{t("send_via_smtp", "Envoyer via SMTP")}</span>
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      ) : null}

      {/* ===================== DELETE USER WITH REASON & EMAIL MODAL ===================== */}
      {deleteModalUser ? createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm bg-black/65"
          onClick={() => (saving ? null : setDeleteModalUser(null))}
        >
          <div
            className={`w-full max-w-lg rounded-2xl border ${border} ${card} p-6 shadow-2xl space-y-4 text-start`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-red-500/15 text-red-600 dark:text-red-400">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[var(--foreground)]">
                    {t("delete_user_title", "Supprimer le compte utilisateur")}
                  </h3>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {deleteModalUser.fullName} &lt;{deleteModalUser.email}&gt;
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDeleteModalUser(null)}
                disabled={saving}
                className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2.5 text-xs font-semibold text-[var(--foreground)] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={sendDeleteEmail}
                  onChange={(e) => setSendDeleteEmail(e.target.checked)}
                  disabled={saving}
                  className="w-4 h-4 rounded accent-[var(--brand-teal)] cursor-pointer"
                />
                <span>{t("send_delete_reason_email", "Envoyer un email explicatif à l'utilisateur via SMTP")}</span>
              </label>

              {sendDeleteEmail && (
                <div>
                  <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                    {t("delete_reason_label", "Motif de suppression (envoyé par email) :")}
                  </label>
                  <textarea
                    rows={4}
                    value={deleteReason}
                    onChange={(e) => setDeleteReason(e.target.value)}
                    disabled={saving}
                    placeholder={t(
                      "delete_reason_placeholder",
                      "Ex: Compte en double, informations non conformes ou non-respect des conditions d'utilisation..."
                    )}
                    className={`w-full px-3 py-2 rounded-xl border ${border} ${inputBg} ${inputText} text-xs outline-none focus:border-[var(--gold)] leading-relaxed`}
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--border)]">
              <button
                type="button"
                onClick={() => setDeleteModalUser(null)}
                disabled={saving}
                className="px-4 py-2 rounded-xl border border-[var(--border)] text-xs font-semibold cursor-pointer"
              >
                {t("cancel", "Annuler")}
              </button>
              <button
                type="button"
                onClick={() => void confirmDeleteUser()}
                disabled={saving}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm hover:bg-red-700 transition-all cursor-pointer disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>
                  {saving
                    ? t("deleting", "Suppression...")
                    : sendDeleteEmail
                    ? t("delete_and_email", "Supprimer & Envoyer l'email")
                    : t("delete", "Supprimer définitivement")}
                </span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      ) : null}

      {upgradeTarget ? createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 backdrop-blur-sm bg-black/65">
          <div className="relative w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-lg font-bold font-display">{t("upgrade_user", "Upgrade utilisateur")}</h3>
              <button type="button" className="p-1.5 rounded-lg hover:bg-black/5 cursor-pointer" onClick={() => setUpgradeTarget(null)}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm opacity-80">
              {upgradeTarget.full_name || upgradeTarget.fullName || upgradeTarget.email}
            </p>
            <label className="block text-xs font-semibold">
              {t("subscription_tier", "Plan d'abonnement")}
              <select
                className={`heritage-input mt-1.5 w-full px-3 py-2.5 rounded-xl border text-sm ${inputBg} ${inputText} ${border}`}
                value={upgradeTierId}
                onChange={(e) => setUpgradeTierId(e.target.value ? Number(e.target.value) : "")}
              >
                <option value="">{t("select_tier", "Sélectionner un plan...")}</option>
                {(Array.isArray(tiers) ? tiers : []).map((tier) => (
                  <option key={tier.id} value={tier.id}>
                    {tier.name || tier.slug || `Tier #${tier.id}`}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className="px-4 py-2 rounded-xl border text-sm cursor-pointer" onClick={() => setUpgradeTarget(null)}>
                {t("cancel", "Annuler")}
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-[var(--brand-teal)] cursor-pointer disabled:opacity-50"
                disabled={saving || !upgradeTierId}
                onClick={() => void handleUpgradeUser()}
              >
                {t("confirm_upgrade", "Confirmer l'upgrade")}
              </button>
            </div>
          </div>
        </div>,
        document.body
      ) : null}

    </div>
  );
}
