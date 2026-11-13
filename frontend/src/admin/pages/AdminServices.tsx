import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Calendar,
  Layers,
  Sparkles,
  RefreshCw,
  Phone,
  Mail,
  Video,
  Check,
  X,
  ExternalLink,
  MessageCircle,
  Clock,
  AlertCircle,
  DollarSign,
  ChevronRight,
  ShieldCheck,
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
  meeting_enabled?: boolean | number;
  order_index?: number;
  is_active?: boolean | number;
  created_at?: string;
  updated_at?: string;
}

export interface ServiceBooking {
  id: number;
  service_id: number;
  status: string;
  booking_type?: string;
  meeting_date?: string | null;
}

export default function AdminServicesPage() {
  const { t, isRtl } = useTranslation();

  const [services, setServices] = useState<CustomService[]>([]);
  const [bookings, setBookings] = useState<ServiceBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<CustomService | null>(null);
  const [formSaving, setFormSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "Recherche In Situ",
    description: "",
    full_offer: "",
    deliverablesText: "",
    whatsapp_prefill: "",
    contact_phone: "+216 71 234 567",
    contact_email: "services@rootstunisia.com",
    meeting_enabled: true,
    order_index: 0,
    is_active: true,
  });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [servicesRes, bookingsRes] = await Promise.all([
        api.get<CustomService[]>("/admin/services"),
        api.get<ServiceBooking[]>("/admin/services-bookings"),
      ]);

      const rawS = servicesRes.data as any;
      const rawB = bookingsRes.data as any;
      const sList = Array.isArray(rawS) ? rawS : (Array.isArray(rawS?.data) ? rawS.data : []);
      const bList = Array.isArray(rawB) ? rawB : (Array.isArray(rawB?.data) ? rawB.data : []);
      setServices(sList);
      setBookings(bList);
    } catch (err: any) {
      console.error("Failed to load admin services data:", err);
      setError("Erreur lors du chargement des services. Vérifiez vos accès Super Admin.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    setEditingService(null);
    setFormData({
      title: "",
      slug: "",
      category: "Recherche In Situ",
      description: "",
      full_offer: "",
      deliverablesText: "Déplacement physique aux dépôts\nPhotographies HD des folios originaux\nRapport de recherche avec cotes exactes",
      whatsapp_prefill: "Bonjour Roots Tunisia, je souhaite réserver une consultation pour cette prestation.",
      contact_phone: "+216 71 234 567",
      contact_email: "services@rootstunisia.com",
      meeting_enabled: true,
      order_index: services.length + 1,
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (service: CustomService) => {
    setEditingService(service);
    let delivText = "";
    if (Array.isArray(service.deliverables)) {
      delivText = service.deliverables.join("\n");
    } else if (typeof service.deliverables === "string") {
      try {
        const parsed = JSON.parse(service.deliverables);
        delivText = Array.isArray(parsed) ? parsed.join("\n") : service.deliverables;
      } catch {
        delivText = service.deliverables;
      }
    }

    setFormData({
      title: service.title || "",
      slug: service.slug || "",
      category: service.category || "",
      description: service.description || "",
      full_offer: service.full_offer || "",
      deliverablesText: delivText,
      whatsapp_prefill: service.whatsapp_prefill || "",
      contact_phone: service.contact_phone || "+216 71 234 567",
      contact_email: service.contact_email || "services@rootstunisia.com",
      meeting_enabled: service.meeting_enabled !== false && Number(service.meeting_enabled) !== 0,
      order_index: service.order_index ?? 0,
      is_active: Boolean(service.is_active),
    });
    setIsModalOpen(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setFormSaving(true);
    try {
      const deliverablesArray = formData.deliverablesText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        title: formData.title.trim(),
        slug: formData.slug.trim() || undefined,
        category: formData.category.trim() || "Généalogie",
        price_eur: 0,
        price_usd: 0,
        price_tnd: 0,
        billing_unit: "Sur Devis",
        description: formData.description.trim(),
        full_offer: formData.full_offer.trim() || formData.description.trim(),
        deliverables: deliverablesArray,
        whatsapp_prefill: formData.whatsapp_prefill.trim(),
        contact_phone: formData.contact_phone.trim(),
        contact_email: formData.contact_email.trim(),
        meeting_link: "",
        meeting_enabled: formData.meeting_enabled,
        order_index: Number(formData.order_index) || 0,
        is_active: formData.is_active,
      };

      if (editingService) {
        await api.put(`/admin/services/${editingService.id}`, payload);
      } else {
        await api.post("/admin/services", payload);
      }

      setIsModalOpen(false);
      await fetchData();
    } catch (err: any) {
      console.error("Save service error:", err);
      alert(err.response?.data?.message || "Erreur lors de l'enregistrement du service.");
    } finally {
      setFormSaving(false);
    }
  };

  const handleDeleteService = async (serviceId: number, title: string) => {
    if (!window.confirm(`Supprimer définitivement la prestation "${title}" ?`)) {
      return;
    }
    try {
      await api.delete(`/admin/services/${serviceId}`);
      await fetchData();
    } catch (err) {
      console.error("Delete service error:", err);
      alert("Erreur lors de la suppression de la prestation.");
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

  const stats = useMemo(() => {
    const totalServices = services.length;
    const activeServices = services.filter((s) => s.is_active).length;
    const totalBookings = bookings.length;
    const newBookings = bookings.filter((b) => b.status === "nouveau").length;
    const meetingsCount = bookings.filter((b) => b.booking_type === "meeting" || Boolean(b.meeting_date)).length;
    return { totalServices, activeServices, totalBookings, newBookings, meetingsCount };
  }, [services, bookings]);

  return (
    <div className={`p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto ${isRtl ? "rtl" : "ltr"}`}>
      <SEO
        title="Création & Gestion des Prestations de Services — Super Admin | Roots Tunisia"
        description="Créez et configurez vos offres de services généalogiques, prix multi-devises et coordonnées de réservation."
      />

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[var(--gold)]/20">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SUPER ADMIN • CRÉATION DES SERVICES & OFFRES</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-cinzel font-bold text-[var(--foreground)] tracking-wide">
            Catalogue des Prestations de Services
          </h1>
          <p className="text-xs sm:text-sm text-[var(--foreground)]/70 mt-1 max-w-2xl">
            Créez vos offres de recherche, définissez vos livrables, activez les rendez-vous en direct et paramétrez vos coordonnées de contact.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/admin/services-bookings"
            className="px-4 py-2.5 rounded-xl border border-[var(--gold)]/40 bg-[var(--gold)]/10 hover:bg-[var(--gold)]/20 text-xs font-bold text-[var(--gold)] transition-all flex items-center gap-2 shadow-sm"
          >
            <Calendar className="w-4 h-4" />
            <span>Voir les Réservations & Rendez-vous ({bookings.length}) →</span>
          </Link>

          <Link
            to="/services"
            target="_blank"
            className="px-3.5 py-2.5 rounded-xl border border-[var(--gold)]/30 hover:bg-[var(--gold)]/10 text-xs font-semibold text-[var(--foreground)] transition-all flex items-center gap-2"
          >
            <Eye className="w-4 h-4 text-[var(--gold)]" />
            <span>Aperçu Public</span>
            <ExternalLink className="w-3 h-3 text-[var(--foreground)]/50" />
          </Link>

          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 rounded-xl bg-[var(--gold)] hover:bg-[var(--gold)]/90 text-[var(--card)] font-bold text-xs inline-flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Nouveau Service</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="surface-card p-4 rounded-xl border border-[var(--gold)]/25 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[0.7rem] uppercase font-bold text-[var(--foreground)]/60">Services Actifs</span>
            <Briefcase className="w-4 h-4 text-[var(--gold)]" />
          </div>
          <p className="text-2xl font-bold font-cinzel text-[var(--gold)] mt-2">
            {stats.activeServices} <span className="text-xs font-normal text-[var(--foreground)]/50">/ {stats.totalServices}</span>
          </p>
        </div>

        <div className="surface-card p-4 rounded-xl border border-[var(--gold)]/25 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[0.7rem] uppercase font-bold text-[var(--foreground)]/60">Total Réservations</span>
            <Calendar className="w-4 h-4 text-[var(--gold)]" />
          </div>
          <p className="text-2xl font-bold font-cinzel text-[var(--gold)] mt-2">
            {stats.totalBookings}
          </p>
        </div>

        <div className="surface-card p-4 rounded-xl border border-blue-500/30 bg-blue-500/5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[0.7rem] uppercase font-bold text-blue-600 dark:text-blue-400">Rendez-vous Prévus</span>
            <Video className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold font-cinzel text-blue-600 dark:text-blue-400 mt-2">
            {stats.meetingsCount}
          </p>
        </div>

        <div className="surface-card p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[0.7rem] uppercase font-bold text-amber-600 dark:text-amber-400">Dossiers à Traiter</span>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold font-cinzel text-amber-600 dark:text-amber-400 mt-2">
            {stats.newBookings}
          </p>
        </div>
      </div>

      {/* Dedicated reception page banner */}
      <div className="surface-card rounded-2xl border border-[var(--gold)]/35 p-5 bg-[var(--gold)]/5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[var(--gold)]/20 text-[var(--gold)] flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-cinzel text-sm sm:text-base font-bold text-[var(--foreground)]">
              Espace Réception des Réservations & Rendez-vous
            </h3>
            <p className="text-xs text-[var(--foreground)]/70 mt-0.5">
              Consultez tous les dossiers reçus, les créneaux réservés, les coordonnées clients et mettez à jour leurs statuts.
            </p>
          </div>
        </div>
        <Link
          to="/admin/services-bookings"
          className="px-4 py-2.5 rounded-xl bg-[var(--gold)] hover:bg-[var(--gold)]/90 text-[var(--card)] font-bold text-xs inline-flex items-center gap-2 shadow-md transition-all shrink-0"
        >
          <span>Accéder aux Réservations</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Services Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-cinzel font-bold text-[var(--foreground)] flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-[var(--gold)]" />
            <span>Cartes de Prestations Actives ({services.length})</span>
          </h2>
          <button
            onClick={fetchData}
            className="p-2 rounded-lg border border-[var(--gold)]/30 hover:bg-[var(--gold)]/10 text-xs text-[var(--foreground)] flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[var(--gold)] ${loading ? "animate-spin" : ""}`} />
            <span>Actualiser</span>
          </button>
        </div>

        {loading ? (
          <div className="py-16 text-center space-y-2">
            <RefreshCw className="w-8 h-8 text-[var(--gold)] animate-spin mx-auto" />
            <p className="text-xs text-[var(--foreground)]/70">Chargement des prestations...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-[var(--gold)]/30 rounded-2xl space-y-3">
            <Briefcase className="w-12 h-12 text-[var(--gold)]/40 mx-auto" />
            <h3 className="font-cinzel text-base font-bold text-[var(--foreground)]">
              Aucune prestation de service créée
            </h3>
            <p className="text-xs text-[var(--foreground)]/60 max-w-sm mx-auto">
              Cliquez ci-dessous pour ajouter votre première offre de recherche ou d'archives.
            </p>
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2 rounded-xl bg-[var(--gold)] text-[var(--card)] text-xs font-bold"
            >
              + Créer une Prestation
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((svc) => {
              const bCount = bookingsCountByService.get(svc.id) || 0;
              const hasMeeting = svc.meeting_enabled !== false && Number(svc.meeting_enabled) !== 0;

              return (
                <div
                  key={svc.id}
                  className="surface-card rounded-2xl border border-[var(--gold)]/30 p-5 flex flex-col justify-between shadow-md hover:border-[var(--gold)] transition-all hover:shadow-xl"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[0.65rem] font-bold uppercase tracking-wider bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30">
                        {svc.category}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[0.65rem] font-bold ${
                          svc.is_active
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                            : "bg-red-500/15 text-red-500 border border-red-500/30"
                        }`}
                      >
                        {svc.is_active ? "En ligne" : "Désactivé"}
                      </span>
                    </div>

                    <h3 className="text-base font-cinzel font-bold text-[var(--foreground)] leading-snug">
                      {svc.title}
                    </h3>

                    {/* Consultation & Meeting Badge */}
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Video className="w-3.5 h-3.5" />
                        <span>Rendez-vous & Consultation Gratuite</span>
                      </span>
                      <span className="text-[0.7rem] font-semibold text-[var(--foreground)]/70">
                        Sur Devis
                      </span>
                    </div>

                    <p className="text-xs text-[var(--foreground)]/75 line-clamp-3 leading-relaxed">
                      {svc.description}
                    </p>

                    {/* Contact Badges */}
                    <div className="pt-2 border-t border-[var(--gold)]/15 flex flex-wrap items-center gap-1.5 text-[0.68rem]">
                      {svc.contact_phone && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                          <MessageCircle className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </span>
                      )}
                      {svc.contact_email && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/25">
                          <Mail className="w-3 h-3" />
                          <span>Email</span>
                        </span>
                      )}
                      {hasMeeting && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/25">
                          <Video className="w-3 h-3" />
                          <span>RDV en direct</span>
                        </span>
                      )}
                    </div>

                    {/* Booking Count Info */}
                    <div className="pt-2 flex items-center justify-between text-xs text-[var(--foreground)]/70">
                      <span>Réservations reçues :</span>
                      <strong className="text-[var(--gold)] font-mono">{bCount} dossier{bCount > 1 ? "s" : ""}</strong>
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="mt-5 pt-3.5 border-t border-[var(--gold)]/20 flex items-center justify-between gap-2">
                    <Link
                      to={`/admin/services-bookings?service_id=${svc.id}`}
                      className="px-3 py-1.5 rounded-lg bg-[var(--gold)]/15 hover:bg-[var(--gold)]/25 text-[var(--gold)] text-xs font-bold inline-flex items-center gap-1.5 transition-all"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Réservations ({bCount})</span>
                    </Link>

                    <div className="flex items-center gap-1.5">
                      <Link
                        to={`/services/${svc.slug || svc.id}`}
                        target="_blank"
                        className="p-1.5 rounded-lg border border-[var(--gold)]/30 hover:bg-[var(--gold)]/10 text-[var(--foreground)]"
                        title="Voir la page publique"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        onClick={() => handleOpenEdit(svc)}
                        title="Modifier cette offre"
                        className="p-1.5 rounded-lg border border-[var(--gold)]/30 hover:bg-[var(--gold)]/15 text-[var(--gold)] cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteService(svc.id, svc.title)}
                        title="Supprimer cette offre"
                        className="p-1.5 rounded-lg border border-red-500/30 hover:bg-red-500/15 text-red-500 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Service Edit / Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="surface-card rounded-2xl border border-[var(--gold)]/40 p-6 sm:p-7 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 end-4 p-1.5 rounded-lg text-[var(--foreground)]/60 hover:text-red-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-cinzel font-bold text-[var(--foreground)] mb-1">
              {editingService ? "Modifier l'Offre de Service" : "Créer une Nouvelle Prestation"}
            </h2>
            <p className="text-xs text-[var(--foreground)]/70 mb-5">
              Remplissez les informations de l'offre. Vous recevrez toutes les réservations clients dans la page dédiée aux réservations.
            </p>

            <form onSubmit={handleSaveService} className="space-y-4 text-xs">
              {/* Title & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">
                    Titre du Service <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Recherche In Situ aux Archives"
                    className="w-full px-3 py-2 rounded-lg border border-[var(--gold)]/35 bg-[var(--background)] focus:outline-none focus:border-[var(--gold)]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Identifiant URL (Slug optionnel)</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="recherche-in-situ-archives"
                    className="w-full px-3 py-2 rounded-lg border border-[var(--gold)]/35 bg-[var(--background)] focus:outline-none focus:border-[var(--gold)]"
                  />
                </div>
              </div>

              {/* Category & Order Index */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Catégorie de la Prestation</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Paléographie, Recherche In Situ, Notarié..."
                    className="w-full px-3 py-2 rounded-lg border border-[var(--gold)]/35 bg-[var(--background)] focus:outline-none focus:border-[var(--gold)]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Ordre d'affichage</label>
                  <input
                    type="number"
                    value={formData.order_index}
                    onChange={(e) => setFormData({ ...formData, order_index: Number(e.target.value) || 0 })}
                    placeholder="0, 1, 2..."
                    className="w-full px-3 py-2 rounded-lg border border-[var(--gold)]/35 bg-[var(--background)] focus:outline-none focus:border-[var(--gold)]"
                  />
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="block font-semibold mb-1">Description courte (affichée sur la carte)</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Résumé percutant affiché sur la carte du catalogue..."
                  className="w-full p-2.5 rounded-lg border border-[var(--gold)]/35 bg-[var(--background)]"
                />
              </div>

              {/* Full Offer Description */}
              <div>
                <label className="block font-semibold mb-1">Présentation détaillée de l'offre</label>
                <textarea
                  rows={3}
                  value={formData.full_offer}
                  onChange={(e) => setFormData({ ...formData, full_offer: e.target.value })}
                  placeholder="Expliquez la démarche archivistique, les dépôts consultés, le mandat du chercheur..."
                  className="w-full p-2.5 rounded-lg border border-[var(--gold)]/35 bg-[var(--background)]"
                />
              </div>

              {/* Deliverables (One per line) */}
              <div>
                <label className="block font-semibold mb-1">
                  Livrables & Engagements inclus (un point par ligne)
                </label>
                <textarea
                  rows={3}
                  value={formData.deliverablesText}
                  onChange={(e) => setFormData({ ...formData, deliverablesText: e.target.value })}
                  placeholder="Ex:&#10;Consultation préliminaire de faisabilité&#10;Vérification des cotes physiques&#10;Rapport archivistique officiel"
                  className="w-full p-2.5 rounded-lg border border-[var(--gold)]/35 bg-[var(--background)] font-mono text-[0.75rem]"
                />
              </div>

              {/* Contact Information & Booking Channels */}
              <div className="p-3.5 rounded-xl border border-[var(--gold)]/30 bg-[var(--gold)]/5 space-y-3">
                <p className="font-bold text-[var(--gold)] uppercase tracking-wider text-[0.7rem] flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  <span>Canaux de Contact & Réservation de Rendez-vous</span>
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Numéro WhatsApp de contact</label>
                    <input
                      type="text"
                      value={formData.contact_phone}
                      onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                      placeholder="+216 71 234 567"
                      className="w-full px-3 py-2 rounded-lg border border-[var(--gold)]/35 bg-[var(--background)]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Email de contact</label>
                    <input
                      type="email"
                      value={formData.contact_email}
                      onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                      placeholder="services@rootstunisia.com"
                      className="w-full px-3 py-2 rounded-lg border border-[var(--gold)]/35 bg-[var(--background)]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="service-meeting-enabled"
                    checked={formData.meeting_enabled}
                    onChange={(e) => setFormData({ ...formData, meeting_enabled: e.target.checked })}
                    className="rounded border-[var(--gold)]/40 text-[var(--gold)] focus:ring-[var(--gold)]"
                  />
                  <label htmlFor="service-meeting-enabled" className="font-semibold select-none cursor-pointer">
                    Activer la prise de rendez-vous consultation (Appel Zoom, WhatsApp ou Email)
                  </label>
                </div>
              </div>

              {/* WhatsApp prefill */}
              <div>
                <label className="block font-semibold mb-1">
                  Message prérempli WhatsApp pour commander
                </label>
                <input
                  type="text"
                  value={formData.whatsapp_prefill}
                  onChange={(e) => setFormData({ ...formData, whatsapp_prefill: e.target.value })}
                  placeholder="Bonjour Roots Tunisia, je souhaite commander la prestation..."
                  className="w-full px-3 py-2 rounded-lg border border-[var(--gold)]/35 bg-[var(--background)]"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="service-is-active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="rounded border-[var(--gold)]/40 text-[var(--gold)] focus:ring-[var(--gold)]"
                />
                <label htmlFor="service-is-active" className="font-semibold select-none cursor-pointer">
                  Actif et visible sur la page publique des services
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--gold)]/20">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[var(--gold)]/30 hover:bg-[var(--gold)]/10 font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={formSaving}
                  className="px-5 py-2 rounded-lg bg-[var(--gold)] text-[var(--card)] font-bold shadow-md hover:opacity-90 flex items-center gap-2 cursor-pointer"
                >
                  {formSaving ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Enregistrement...</span>
                    </>
                  ) : (
                    <span>Enregistrer la Prestation</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
