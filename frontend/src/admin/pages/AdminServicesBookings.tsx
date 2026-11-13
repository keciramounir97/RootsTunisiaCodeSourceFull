import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  Phone,
  Mail,
  MessageCircle,
  ExternalLink,
  Filter,
  Search,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Download,
  Trash2,
  User,
  Briefcase,
  Layers,
  Sparkles,
  ChevronRight,
  Video,
  FileText,
  X,
  Check,
} from "lucide-react";
import { api } from "../../api/client";
import { useTranslation } from "../../context/TranslationContext";
import SEO from "../../components/SEO";

export interface CustomService {
  id: number;
  slug: string;
  title: string;
  category: string;
  price_eur: number | string;
  price_usd: number | string;
  price_tnd: number | string;
  billing_unit: string;
  description: string;
  full_offer?: string;
  deliverables?: string[] | string;
  whatsapp_prefill?: string;
  contact_phone?: string;
  contact_email?: string;
  meeting_link?: string;
  meeting_enabled?: boolean;
  order_index?: number;
  is_active?: boolean | number;
}

export interface ServiceBooking {
  id: number;
  service_id: number;
  service_title?: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  target_ancestor?: string;
  message: string;
  urgency: string;
  preferred_contact: string;
  attachment_url?: string;
  status: string;
  admin_notes?: string;
  booking_type?: string;
  meeting_date?: string | null;
  meeting_time?: string | null;
  meeting_type?: string | null;
  created_at: string;
  updated_at?: string;
}

export default function AdminServicesBookingsPage() {
  const { t, isRtl } = useTranslation();

  const [services, setServices] = useState<CustomService[]>([]);
  const [bookings, setBookings] = useState<ServiceBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active volet tab: 'all' or `service-${id}`
  const [activeVolet, setActiveVolet] = useState<string>("all");

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Notes Modal state
  const [editingNotesBooking, setEditingNotesBooking] = useState<ServiceBooking | null>(null);
  const [notesDraft, setNotesDraft] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [servicesRes, bookingsRes] = await Promise.all([
        api.get<CustomService[]>("/admin/services"),
        api.get<ServiceBooking[]>("/admin/services-bookings"),
      ]);

      const rawS = servicesRes.data as any;
      const sList = Array.isArray(rawS) ? rawS : (Array.isArray(rawS?.data) ? rawS.data : []);
      setServices(sList);

      const rawB = bookingsRes.data as any;
      const bList = Array.isArray(rawB) ? rawB : (Array.isArray(rawB?.data) ? rawB.data : []);
      setBookings(bList);
    } catch (err: any) {
      console.error("Failed to load services & bookings:", err);
      setError("Impossible de charger les réservations. Vérifiez votre connexion.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (bookingId: number, nextStatus: string) => {
    try {
      await api.put(`/admin/services-bookings/${bookingId}/status`, { status: nextStatus });
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: nextStatus } : b))
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Erreur lors de la mise à jour du statut.");
    }
  };

  const handleSaveNotes = async () => {
    if (!editingNotesBooking) return;
    setSavingNotes(true);
    try {
      await api.put(`/admin/services-bookings/${editingNotesBooking.id}/status`, {
        status: editingNotesBooking.status,
        admin_notes: notesDraft,
      });
      setBookings((prev) =>
        prev.map((b) => (b.id === editingNotesBooking.id ? { ...b, admin_notes: notesDraft } : b))
      );
      setEditingNotesBooking(null);
    } catch (err) {
      console.error("Failed to save admin notes:", err);
      alert("Erreur lors de l'enregistrement de la note.");
    } finally {
      setSavingNotes(false);
    }
  };

  const handleDeleteBooking = async (bookingId: number) => {
    if (!window.confirm(`Supprimer définitivement la réservation #BK-${bookingId} ?`)) {
      return;
    }
    try {
      await api.delete(`/admin/services-bookings/${bookingId}`);
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    } catch (err) {
      console.error("Failed to delete booking:", err);
      alert("Erreur lors de la suppression de la réservation.");
    }
  };

  // Count bookings by service
  const bookingsCountByService = useMemo(() => {
    const map = new Map<number, number>();
    bookings.forEach((b) => {
      map.set(b.service_id, (map.get(b.service_id) || 0) + 1);
    });
    return map;
  }, [bookings]);

  // Filter bookings for active table
  const filteredBookings = useMemo(() => {
    let list = bookings;

    if (activeVolet !== "all") {
      const sId = Number(activeVolet.replace("service-", ""));
      list = bookings.filter((b) => b.service_id === sId);
    }

    if (statusFilter !== "all") {
      list = list.filter((b) => b.status === statusFilter);
    }

    if (typeFilter !== "all") {
      list = list.filter((b) => {
        const isMeeting = b.booking_type === "meeting" || Boolean(b.meeting_date);
        return typeFilter === "meeting" ? isMeeting : !isMeeting;
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (b) =>
          b.client_name?.toLowerCase().includes(q) ||
          b.client_email?.toLowerCase().includes(q) ||
          b.client_phone?.toLowerCase().includes(q) ||
          b.target_ancestor?.toLowerCase().includes(q) ||
          b.message?.toLowerCase().includes(q) ||
          b.service_title?.toLowerCase().includes(q) ||
          b.admin_notes?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [bookings, activeVolet, statusFilter, typeFilter, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const total = bookings.length;
    const newCount = bookings.filter((b) => b.status === "nouveau").length;
    const inProgress = bookings.filter((b) => b.status === "en_cours").length;
    const confirmed = bookings.filter((b) => b.status === "confirme" || b.status === "termine").length;
    const meetings = bookings.filter((b) => b.booking_type === "meeting" || Boolean(b.meeting_date)).length;
    return { total, newCount, inProgress, confirmed, meetings };
  }, [bookings]);

  // CSV Export
  const exportBookingsCSV = () => {
    if (filteredBookings.length === 0) {
      alert("Aucune réservation à exporter.");
      return;
    }

    const headers = [
      "ID",
      "Date Creation",
      "Prestation",
      "Type",
      "Date Rendez-vous",
      "Heure",
      "Format Rendez-vous",
      "Client Nom",
      "Email",
      "Telephone",
      "Ancetre Cible",
      "Urgence",
      "Contact Prefere",
      "Message",
      "Statut",
      "Notes Admin",
    ];

    const rows = filteredBookings.map((b) => [
      `BK-${b.id}`,
      new Date(b.created_at).toLocaleDateString("fr-FR"),
      `"${(b.service_title || "").replace(/"/g, '""')}"`,
      b.booking_type === "meeting" || b.meeting_date ? "Rendez-vous" : "Prestation",
      b.meeting_date || "",
      b.meeting_time || "",
      b.meeting_type || "",
      `"${(b.client_name || "").replace(/"/g, '""')}"`,
      `"${(b.client_email || "").replace(/"/g, '""')}"`,
      `"${(b.client_phone || "").replace(/"/g, '""')}"`,
      `"${(b.target_ancestor || "").replace(/"/g, '""')}"`,
      b.urgency || "standard",
      b.preferred_contact || "whatsapp",
      `"${(b.message || "").replace(/"/g, '""')}"`,
      b.status || "nouveau",
      `"${(b.admin_notes || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(";"), ...rows.map((e) => e.join(";"))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `reservations-roots-tunisia-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const activeServiceObj = useMemo(() => {
    if (activeVolet === "all") return null;
    const sId = Number(activeVolet.replace("service-", ""));
    return services.find((s) => s.id === sId) || null;
  }, [activeVolet, services]);

  return (
    <div className={`p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto ${isRtl ? "rtl" : "ltr"}`}>
      <SEO
        title="Réception des Réservations & Rendez-vous — Super Admin | Roots Tunisia"
        description="Consultez et gérez l'ensemble des réservations et rendez-vous clients reçus par volet de service."
      />

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[var(--gold)]/20">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30 mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>SUPER ADMIN • RÉCEPTION DES RÉSERVATIONS & RENDEZ-VOUS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-cinzel font-bold text-[var(--foreground)] tracking-wide">
            Réservations & Rendez-vous Clients
          </h1>
          <p className="text-xs sm:text-sm text-[var(--foreground)]/70 mt-1 max-w-2xl">
            Toutes les demandes de prestations et rendez-vous généalogiques reçus sont centralisés ici par volet de service.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/admin/services"
            className="px-4 py-2.5 rounded-xl border border-[var(--gold)]/40 hover:bg-[var(--gold)]/10 text-xs font-semibold text-[var(--foreground)] transition-all flex items-center gap-2 shadow-sm"
          >
            <Briefcase className="w-4 h-4 text-[var(--gold)]" />
            <span>Gérer les Cartes d'Offres</span>
          </Link>

          <button
            type="button"
            onClick={exportBookingsCSV}
            className="px-4 py-2.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold transition-all flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Exporter en CSV</span>
          </button>

          <button
            type="button"
            onClick={fetchData}
            className="p-2.5 rounded-xl border border-[var(--gold)]/30 hover:bg-[var(--gold)]/10 text-[var(--foreground)] transition-all cursor-pointer"
            title="Rafraîchir"
          >
            <RefreshCw className={`w-4 h-4 text-[var(--gold)] ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div className="surface-card p-4 rounded-xl border border-[var(--gold)]/25 flex flex-col justify-between">
          <span className="text-[0.7rem] uppercase font-bold text-[var(--foreground)]/60">Total Reçu</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-cinzel font-bold text-[var(--foreground)]">{stats.total}</span>
            <span className="text-[0.65rem] text-[var(--foreground)]/50">dossiers</span>
          </div>
        </div>

        <div className="surface-card p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 flex flex-col justify-between">
          <span className="text-[0.7rem] uppercase font-bold text-amber-600 dark:text-amber-400">Nouveaux</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-cinzel font-bold text-amber-600 dark:text-amber-400">{stats.newCount}</span>
            <span className="text-[0.65rem] text-amber-600/70">à traiter</span>
          </div>
        </div>

        <div className="surface-card p-4 rounded-xl border border-blue-500/30 bg-blue-500/5 flex flex-col justify-between">
          <span className="text-[0.7rem] uppercase font-bold text-blue-600 dark:text-blue-400">Rendez-vous</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-cinzel font-bold text-blue-600 dark:text-blue-400">{stats.meetings}</span>
            <span className="text-[0.65rem] text-blue-600/70">entretiens</span>
          </div>
        </div>

        <div className="surface-card p-4 rounded-xl border border-purple-500/30 bg-purple-500/5 flex flex-col justify-between">
          <span className="text-[0.7rem] uppercase font-bold text-purple-600 dark:text-purple-400">En Cours</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-cinzel font-bold text-purple-600 dark:text-purple-400">{stats.inProgress}</span>
            <span className="text-[0.65rem] text-purple-600/70">en étude</span>
          </div>
        </div>

        <div className="surface-card p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex flex-col justify-between col-span-2 sm:col-span-1">
          <span className="text-[0.7rem] uppercase font-bold text-emerald-600 dark:text-emerald-400">Confirmés</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-cinzel font-bold text-emerald-600 dark:text-emerald-400">{stats.confirmed}</span>
            <span className="text-[0.65rem] text-emerald-600/70">validés</span>
          </div>
        </div>
      </div>

      {/* Volet Tabs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase font-bold tracking-wider text-[var(--gold)] flex items-center gap-1.5">
            <Layers className="w-4 h-4" />
            <span>Volets de réception par prestation :</span>
          </p>
          <span className="text-xs text-[var(--foreground)]/60">
            {services.length} volets créés
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-[var(--card)] border border-[var(--gold)]/30">
          <button
            type="button"
            onClick={() => setActiveVolet("all")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeVolet === "all"
                ? "bg-[var(--gold)] text-[#1f160f] shadow-md"
                : "text-[var(--foreground)]/80 hover:bg-[var(--gold)]/10"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Toutes les Réservations ({bookings.length})</span>
          </button>

          {services.map((svc) => {
            const count = bookingsCountByService.get(svc.id) || 0;
            const isActive = activeVolet === `service-${svc.id}`;
            return (
              <button
                key={svc.id}
                type="button"
                onClick={() => setActiveVolet(`service-${svc.id}`)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? "bg-[var(--gold)] text-[#1f160f] shadow-md"
                    : "text-[var(--foreground)]/80 hover:bg-[var(--gold)]/10"
                }`}
              >
                <Briefcase className="w-3.5 h-3.5 opacity-70" />
                <span className="max-w-[200px] truncate">{svc.title}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[0.65rem] font-black ${
                    isActive
                      ? "bg-black/20 text-[#1f160f]"
                      : count > 0
                      ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                      : "bg-stone-500/10 text-stone-400"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Volet Content & Table */}
      <div className="surface-card rounded-2xl border border-[var(--gold)]/30 p-5 sm:p-6 shadow-xl space-y-5">
        {/* Volet Title & Filters Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[var(--gold)]/20">
          <div>
            <h2 className="text-lg font-cinzel font-bold text-[var(--foreground)] flex items-center gap-2">
              <span>{activeServiceObj ? activeServiceObj.title : "Toutes les Réservations & Rendez-vous"}</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-[var(--gold)]/15 text-[var(--gold)] font-mono font-bold">
                {filteredBookings.length}
              </span>
            </h2>
            <p className="text-xs text-[var(--foreground)]/65 mt-0.5">
              {activeServiceObj
                ? `Volet dédié à l'offre "${activeServiceObj.title}" (${activeServiceObj.billing_unit} • ${activeServiceObj.price_eur} € / ${activeServiceObj.price_tnd} TND)`
                : "Vue d'ensemble centralisée de tous les dossiers reçus sur Roots Tunisia"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search */}
            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 absolute start-3 top-1/2 -translate-y-1/2 text-[var(--foreground)]/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher nom, ancêtre, tel..."
                className="w-full ps-8 pe-3 py-1.5 rounded-lg border border-[var(--gold)]/30 bg-[var(--background)] text-xs focus:outline-none focus:border-[var(--gold)]"
              />
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-1.5">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-[var(--gold)]/30 bg-[var(--background)] text-xs font-semibold focus:outline-none focus:border-[var(--gold)] cursor-pointer"
              >
                <option value="all">Tous types</option>
                <option value="service">Prestation seule</option>
                <option value="meeting">Rendez-vous / Entretien</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-[var(--gold)]" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-[var(--gold)]/30 bg-[var(--background)] text-xs font-semibold focus:outline-none focus:border-[var(--gold)] cursor-pointer"
              >
                <option value="all">Tous statuts</option>
                <option value="nouveau">Nouveau</option>
                <option value="en_cours">En cours</option>
                <option value="confirme">Confirmé</option>
                <option value="termine">Terminé</option>
                <option value="annule">Annulé</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table of bookings */}
        {loading ? (
          <div className="py-16 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-[var(--gold)] animate-spin mx-auto" />
            <p className="text-xs text-[var(--foreground)]/70">Chargement des réservations...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="py-14 text-center space-y-3 border border-dashed border-[var(--gold)]/30 rounded-xl">
            <Calendar className="w-10 h-10 text-[var(--gold)]/40 mx-auto" />
            <h3 className="font-cinzel text-base font-bold text-[var(--foreground)]">
              Aucune réservation trouvée pour ce volet
            </h3>
            <p className="text-xs text-[var(--foreground)]/60 max-w-md mx-auto">
              {searchQuery || statusFilter !== "all" || typeFilter !== "all"
                ? "Aucun résultat ne correspond à vos filtres actuels."
                : "Les réservations et rendez-vous pris par vos clients pour cette prestation apparaîtront automatiquement ici."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-[var(--gold)]/20 shadow-sm">
            <table className="w-full text-xs text-start">
              <thead className="bg-[var(--gold)]/10 border-b border-[var(--gold)]/25 text-[var(--foreground)]/80 uppercase text-[0.68rem] tracking-wider font-bold">
                <tr>
                  <th className="p-3 text-start">Réf. & Date</th>
                  {activeVolet === "all" && <th className="p-3 text-start">Prestation</th>}
                  <th className="p-3 text-start">Client & Contact</th>
                  <th className="p-3 text-start">Type / Rendez-vous</th>
                  <th className="p-3 text-start">Ancêtre Ciblé & Message</th>
                  <th className="p-3 text-start">Statut</th>
                  <th className="p-3 text-end">Actions Rapides</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--gold)]/15">
                {filteredBookings.map((b) => {
                  const isMeeting = b.booking_type === "meeting" || Boolean(b.meeting_date);
                  const cleanPhone = (b.client_phone || "").replace(/\s+/g, "");
                  const waUrl = `https://wa.me/${cleanPhone.replace("+", "")}?text=${encodeURIComponent(
                    `Bonjour ${b.client_name}, je vous contacte concernant votre demande Roots Tunisia #${b.id} pour la prestation "${b.service_title || ""}".`
                  )}`;

                  return (
                    <tr
                      key={b.id}
                      className="hover:bg-[var(--gold)]/5 transition-colors group"
                    >
                      {/* Ref & Date */}
                      <td className="p-3 align-top whitespace-nowrap">
                        <div className="font-mono font-bold text-[var(--gold)]">
                          #BK-{b.id}
                        </div>
                        <div className="text-[0.65rem] text-[var(--foreground)]/50 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(b.created_at).toLocaleDateString("fr-FR")}</span>
                        </div>
                        {b.urgency === "urgent" && (
                          <span className="mt-1 inline-block px-1.5 py-0.5 rounded text-[0.6rem] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                            Urgent
                          </span>
                        )}
                        {b.urgency === "express" && (
                          <span className="mt-1 inline-block px-1.5 py-0.5 rounded text-[0.6rem] font-bold bg-red-500/20 text-red-500 border border-red-500/30">
                            Express
                          </span>
                        )}
                      </td>

                      {/* Service Title (if all-bookings) */}
                      {activeVolet === "all" && (
                        <td className="p-3 align-top max-w-[200px]">
                          <div className="font-semibold text-[var(--foreground)] line-clamp-2">
                            {b.service_title || `Service #${b.service_id}`}
                          </div>
                        </td>
                      )}

                      {/* Client info */}
                      <td className="p-3 align-top min-w-[190px]">
                        <div className="font-bold text-[var(--foreground)] flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-[var(--gold)] shrink-0" />
                          <span>{b.client_name}</span>
                        </div>
                        <div className="text-[0.7rem] text-[var(--foreground)]/70 flex items-center gap-1 mt-1 truncate">
                          <Mail className="w-3 h-3 text-[var(--gold)]/70 shrink-0" />
                          <a href={`mailto:${b.client_email}`} className="hover:underline hover:text-[var(--gold)] truncate">
                            {b.client_email}
                          </a>
                        </div>
                        <div className="text-[0.7rem] text-[var(--foreground)]/70 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-emerald-500 shrink-0" />
                          <span className="font-mono">{b.client_phone}</span>
                        </div>
                      </td>

                      {/* Type / Meeting schedule */}
                      <td className="p-3 align-top min-w-[180px]">
                        {isMeeting ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[0.68rem] font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                              <Video className="w-3 h-3" />
                              <span>Rendez-vous réservé</span>
                            </span>
                            {b.meeting_date && (
                              <div className="font-semibold text-xs text-[var(--foreground)] flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-[var(--gold)]" />
                                <span>{b.meeting_date}</span>
                                {b.meeting_time && <span className="text-[0.7rem] text-[var(--foreground)]/60">({b.meeting_time})</span>}
                              </div>
                            )}
                            {b.meeting_type && (
                              <div className="text-[0.68rem] text-[var(--foreground)]/60">
                                Format: <span className="font-medium text-[var(--foreground)]">{b.meeting_type}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[0.68rem] font-bold bg-stone-500/15 text-stone-600 dark:text-stone-300 border border-stone-500/25">
                              <Briefcase className="w-3 h-3" />
                              <span>Commande Prestation</span>
                            </span>
                            <div className="text-[0.68rem] text-[var(--foreground)]/60">
                              Contact: <span className="capitalize font-medium">{b.preferred_contact || "WhatsApp"}</span>
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Ancestor & Message */}
                      <td className="p-3 align-top max-w-[280px]">
                        {b.target_ancestor && (
                          <div className="text-xs font-semibold text-[var(--gold)] mb-1">
                            🎯 {b.target_ancestor}
                          </div>
                        )}
                        <p className="text-[0.72rem] text-[var(--foreground)]/80 line-clamp-3 leading-relaxed">
                          {b.message || "Aucun message spécifique."}
                        </p>
                        {b.admin_notes && (
                          <div className="mt-2 p-1.5 rounded bg-[var(--gold)]/10 border border-[var(--gold)]/20 text-[0.68rem] text-[var(--foreground)]/80 flex items-start gap-1">
                            <FileText className="w-3 h-3 text-[var(--gold)] shrink-0 mt-0.5" />
                            <span className="line-clamp-2">
                              <strong>Note :</strong> {b.admin_notes}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Status Dropdown */}
                      <td className="p-3 align-top whitespace-nowrap">
                        <select
                          value={b.status}
                          onChange={(e) => handleUpdateStatus(b.id, e.target.value)}
                          className={`text-xs font-bold rounded-lg px-2.5 py-1 border transition-all cursor-pointer ${
                            b.status === "nouveau"
                              ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
                              : b.status === "en_cours"
                              ? "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30"
                              : b.status === "confirme"
                              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                              : b.status === "termine"
                              ? "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30"
                              : "bg-stone-500/15 text-stone-500 border-stone-500/30"
                          }`}
                        >
                          <option value="nouveau">Nouveau</option>
                          <option value="en_cours">En cours</option>
                          <option value="confirme">Confirmé</option>
                          <option value="termine">Terminé</option>
                          <option value="annule">Annulé</option>
                        </select>
                      </td>

                      {/* Fast Actions */}
                      <td className="p-3 align-top text-end whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Direct WhatsApp button */}
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25 transition-all"
                            title="Contacter sur WhatsApp en 1 clic"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>

                          {/* Direct Email button */}
                          <a
                            href={`mailto:${b.client_email}?subject=${encodeURIComponent(
                              `Roots Tunisia - Réservation #${b.id} (${b.service_title || ""})`
                            )}`}
                            className="p-1.5 rounded-lg border border-blue-500/40 bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/25 transition-all"
                            title="Envoyer un email"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </a>

                          {/* Notes */}
                          <button
                            type="button"
                            onClick={() => {
                              setEditingNotesBooking(b);
                              setNotesDraft(b.admin_notes || "");
                            }}
                            className="p-1.5 rounded-lg border border-[var(--gold)]/40 hover:bg-[var(--gold)]/15 text-[var(--gold)] transition-all cursor-pointer"
                            title="Ajouter une note d'administration"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleDeleteBooking(b.id)}
                            className="p-1.5 rounded-lg border border-red-500/30 text-red-500 hover:bg-red-500/15 transition-all cursor-pointer"
                            title="Supprimer la réservation"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
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

      {/* Admin Notes Modal */}
      {editingNotesBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="surface-card rounded-2xl border border-[var(--gold)]/40 p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--gold)]/20">
              <h3 className="font-cinzel text-base font-bold text-[var(--foreground)] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[var(--gold)]" />
                <span>Notes Administrateur • Dossier #BK-{editingNotesBooking.id}</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingNotesBooking(null)}
                className="p-1.5 rounded-lg hover:bg-black/10 text-[var(--foreground)]/60 hover:text-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-[var(--foreground)]/70 space-y-1">
              <p>Client : <strong className="text-[var(--foreground)]">{editingNotesBooking.client_name}</strong></p>
              <p>Prestation : <strong className="text-[var(--foreground)]">{editingNotesBooking.service_title}</strong></p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--foreground)]/85 mb-1.5">
                Note interne (visible uniquement par les administrateurs) :
              </label>
              <textarea
                rows={4}
                value={notesDraft}
                onChange={(e) => setNotesDraft(e.target.value)}
                placeholder="Ex: Acte trouvé aux archives de Sfax le 12/11. En attente de paiement ou de signature..."
                className="w-full p-3 rounded-lg border border-[var(--gold)]/35 bg-[var(--background)] text-xs focus:outline-none focus:border-[var(--gold)]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingNotesBooking(null)}
                className="px-4 py-2 rounded-lg border border-[var(--gold)]/30 text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--gold)]/10 transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleSaveNotes}
                disabled={savingNotes}
                className="px-4 py-2 rounded-lg bg-[var(--gold)] hover:bg-[var(--gold)]/90 text-[var(--card)] text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md"
              >
                {savingNotes ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                <span>Enregistrer la note</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

