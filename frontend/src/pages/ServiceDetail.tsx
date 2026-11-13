import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Briefcase,
  CheckCircle2,
  Clock,
  Landmark,
  ShieldCheck,
  Send,
  MessageCircle,
  FileCheck,
  Calendar,
  User,
  Mail,
  Phone,
  FileText,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Video,
} from "lucide-react";
import { api } from "../api/client";
import { useTranslation } from "../context/TranslationContext";
import SEO from "../components/SEO";
import { CustomService } from "./Services";
import {
  DEFAULT_SERVICES_CATALOG,
  SERVICES_UI_BY_LOCALE,
  localizeServiceItem,
} from "../utils/servicesCatalogI18n";
import { buildConfiguredWhatsAppUrl } from "../utils/whatsAppContact";

export default function ServiceDetailPage() {
  const { idOrSlug } = useParams<{ idOrSlug: string }>();
  const { locale, isRtl } = useTranslation();
  const cleanLocale = (locale || "fr").toLowerCase();
  const ui = SERVICES_UI_BY_LOCALE[cleanLocale] || SERVICES_UI_BY_LOCALE.fr;

  const [rawService, setRawService] = useState<CustomService | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);

  // 3 Consultation Modes: 'zoom' | 'whatsapp' | 'email'
  const [consultationMode, setConsultationMode] = useState<"zoom" | "whatsapp" | "email">("zoom");
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingTime, setMeetingTime] = useState("10:00 - 11:00");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [targetAncestor, setTargetAncestor] = useState("");
  const [urgency, setUrgency] = useState("standard");
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<any | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!idOrSlug) return;
    const fetchService = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await api.get(`/services/${idOrSlug}`);
        const raw = res.data as any;
        const item = raw?.data && typeof raw.data === "object" ? raw.data : raw;
        if (item && (item.id || item.slug || item.title)) {
          setRawService(item);
        } else {
          const fallback = DEFAULT_SERVICES_CATALOG.find(
            (s) => s.slug === idOrSlug || String(s.id) === String(idOrSlug)
          );
          if (fallback) setRawService(fallback);
          else setError(true);
        }
      } catch (err: any) {
        console.error("Failed to load service detail:", err);
        const fallback = DEFAULT_SERVICES_CATALOG.find(
          (s) => s.slug === idOrSlug || String(s.id) === String(idOrSlug)
        );
        if (fallback) {
          setRawService(fallback);
        } else {
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [idOrSlug]);

  const parseDeliverables = (d: any): string[] => {
    if (!d) return [];
    if (Array.isArray(d)) return d;
    if (typeof d === "string") {
      try {
        const parsed = JSON.parse(d);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        return d.split("\n").map((line) => line.trim()).filter(Boolean);
      }
    }
    return [];
  };

  const service: CustomService | null = rawService
    ? localizeServiceItem(rawService, cleanLocale)
    : null;

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service) return;

    if (!clientName.trim() || !clientEmail.trim() || !clientPhone.trim() || !message.trim()) {
      setSubmitError(ui.errMissingFields);
      return;
    }

    if (consultationMode === "zoom" && !meetingDate) {
      setSubmitError(ui.errMissingDate);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await api.post("/services/bookings", {
        service_id: service.id,
        service_title: rawService?.title || service.title,
        client_name: clientName.trim(),
        client_email: clientEmail.trim(),
        client_phone: clientPhone.trim(),
        target_ancestor: targetAncestor.trim() || null,
        client_message: message.trim(),
        message: message.trim(),
        urgency,
        preferred_contact: consultationMode,
        booking_type: consultationMode,
        meeting_date: consultationMode === "zoom" ? meetingDate || null : null,
        meeting_time: consultationMode === "zoom" ? meetingTime || null : null,
        meeting_type:
          consultationMode === "zoom"
            ? "Appel Zoom (Visioconférence)"
            : consultationMode === "whatsapp"
            ? "WhatsApp Direct"
            : "Email",
      });

      const raw = res.data as any;
      const confirmed = raw?.booking || raw?.data?.booking || raw?.data || { id: raw?.id || 1, client_name: clientName };
      setSubmitSuccess(confirmed);
    } catch (err: any) {
      console.error("Booking error:", err);
      const backendMsg = err.response?.data?.message;
      const useBackendMsg =
        typeof backendMsg === "string" &&
        backendMsg.trim().length > 0 &&
        (cleanLocale === "fr" || (cleanLocale === "ar" && /[\u0600-\u06FF]/.test(backendMsg)));
      setSubmitError(useBackendMsg ? backendMsg : ui.errSubmitFailed);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div
        dir={isRtl ? "rtl" : "ltr"}
        className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center gap-3"
      >
        <RefreshCw className="w-8 h-8 text-[var(--gold)] animate-spin" />
        <p className="text-sm font-medium text-[var(--foreground)]/70">{ui.detailLoading}</p>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div
        dir={isRtl ? "rtl" : "ltr"}
        className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center p-6 text-center"
      >
        <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
        <h2 className="text-xl font-cinzel font-bold mb-2">{ui.detailNotFoundTitle}</h2>
        <p className="text-sm text-[var(--foreground)]/70 mb-5">{ui.detailNotFoundDesc}</p>
        <Link
          to="/services"
          className="px-5 py-2.5 rounded-lg bg-[var(--gold)] text-[var(--card)] font-bold text-xs inline-flex items-center gap-2"
        >
          <ArrowLeft className={`w-4 h-4 ${isRtl ? "rotate-180" : ""}`} />
          <span>{ui.detailBackToServices}</span>
        </Link>
      </div>
    );
  }

  const deliverables = parseDeliverables(service.deliverables);
  const waContactUrl = buildConfiguredWhatsAppUrl(
    service.whatsapp_prefill || ui.defaultWhatsappPrefill(service.title),
    service.contact_phone,
  );

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-28 pb-24"
    >
      <SEO
        title={`${service.title} | Roots Tunisia`}
        description={service.description}
        keywords={[service.title, service.category, ...ui.seoKeywords]}
      />

      <div className="max-w-[var(--content-max)] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--gold)] hover:underline"
          >
            <ArrowLeft className={`w-3.5 h-3.5 ${isRtl ? "rotate-180" : ""}`} />
            <span>{ui.detailAllServicesBreadcrumb}</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Service Details & Offer Presentation */}
          <div className="lg:col-span-7 space-y-6">
            <div className="surface-card rounded-2xl border border-[var(--gold)]/35 p-6 sm:p-8 shadow-xl">
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30">
                  {service.category || ui.defaultCategoryBadge}
                </span>
                <span className="text-xs text-[var(--foreground)]/50 font-mono">
                  {ui.detailRefPrefix}{service.id}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-cinzel font-bold text-[var(--foreground)] leading-tight">
                {service.title}
              </h1>

              {/* Consultation Gratuite & Devis Sur-Mesure - AUCUN PRIX AFFICHÉ */}
              <div className="mt-5 p-5 rounded-2xl border border-[var(--gold)]/35 bg-gradient-to-br from-[var(--gold)]/15 via-[var(--card)] to-[var(--background)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[var(--gold)] text-[#1f160f] shadow-sm">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{ui.detailFreeBadge}</span>
                  </div>
                  <h3 className="text-lg font-cinzel font-bold text-[var(--foreground)] pt-1">
                    {ui.detailFreeHeading}
                  </h3>
                  <p className="text-xs text-[var(--foreground)]/75 leading-relaxed">
                    {ui.detailFreeDesc}
                  </p>
                </div>
                <div className="px-4 py-2 rounded-xl border border-[var(--gold)]/40 bg-[var(--card)] text-xs font-mono font-bold text-[var(--gold)] text-center shrink-0 shadow-inner">
                  {ui.detailCustomQuoteBadge}
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <h3 className="text-xs uppercase tracking-wider font-bold text-[var(--gold)] mb-2">
                  {ui.detailPresentationHeading}
                </h3>
                <p className="text-sm text-[var(--foreground)]/85 leading-relaxed font-body">
                  {service.description}
                </p>
              </div>

              {/* Full Offer Description if present */}
              {service.full_offer && (
                <div className="mt-6 pt-6 border-t border-[var(--gold)]/20">
                  <h3 className="text-xs uppercase tracking-wider font-bold text-[var(--gold)] mb-2">
                    {ui.detailFullOfferHeading}
                  </h3>
                  <div className="text-sm text-[var(--foreground)]/85 leading-relaxed font-body whitespace-pre-line space-y-2">
                    {service.full_offer}
                  </div>
                </div>
              )}

              {/* Deliverables */}
              {deliverables.length > 0 && (
                <div className="mt-6 pt-6 border-t border-[var(--gold)]/20">
                  <h3 className="text-xs uppercase tracking-wider font-bold text-[var(--gold)] mb-3">
                    {ui.detailIncludedHeading}
                  </h3>
                  <ul className="space-y-2.5">
                    {deliverables.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[var(--foreground)]/90">
                        <CheckCircle2 className="w-4 h-4 text-[var(--gold)] shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Direct WhatsApp Option — only when admin configured a real number */}
              {waContactUrl ? (
                <div className="mt-8 pt-6 border-t border-[var(--gold)]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-start">
                    <p className="text-xs font-bold text-[var(--foreground)]">{ui.detailNeedDirectChatTitle}</p>
                    <p className="text-[0.7rem] text-[var(--foreground)]/60">
                      {ui.detailNeedDirectChatSub}
                    </p>
                  </div>
                  <a
                    href={waContactUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold inline-flex items-center gap-2 hover:bg-emerald-500/20 transition-all shrink-0"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{ui.detailOrderViaWhatsappCta}</span>
                  </a>
                </div>
              ) : null}
            </div>

            {/* Quality Guarantees */}
            <div className="surface-card rounded-xl border border-[var(--gold)]/25 p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div>
                <Landmark className="w-5 h-5 text-[var(--gold)] mx-auto mb-1.5" />
                <p className="text-xs font-bold">{ui.detailGuarantee1Title}</p>
                <p className="text-[0.65rem] text-[var(--foreground)]/60">{ui.detailGuarantee1Sub}</p>
              </div>
              <div>
                <ShieldCheck className="w-5 h-5 text-[var(--gold)] mx-auto mb-1.5" />
                <p className="text-xs font-bold">{ui.detailGuarantee2Title}</p>
                <p className="text-[0.65rem] text-[var(--foreground)]/60">{ui.detailGuarantee2Sub}</p>
              </div>
              <div>
                <Clock className="w-5 h-5 text-[var(--gold)] mx-auto mb-1.5" />
                <p className="text-xs font-bold">{ui.detailGuarantee3Title}</p>
                <p className="text-[0.65rem] text-[var(--foreground)]/60">{ui.detailGuarantee3Sub}</p>
              </div>
            </div>
          </div>

          {/* Right Column: 3-Way Free Consultation Booking Form */}
          <div className="lg:col-span-5">
            <div className="surface-card rounded-2xl border border-[var(--gold)]/40 p-6 sm:p-7 shadow-2xl relative sticky top-28">
              <div className="mb-5 pb-4 border-b border-[var(--gold)]/20">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--gold)] mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{ui.formTopBadge}</span>
                </div>
                <h2 className="text-xl font-cinzel font-bold text-[var(--foreground)]">
                  {consultationMode === "zoom"
                    ? ui.formHeadingZoom
                    : consultationMode === "whatsapp"
                    ? ui.formHeadingWhatsapp
                    : ui.formHeadingEmail}
                </h2>
                <p className="text-xs text-[var(--foreground)]/70 mt-1">
                  {consultationMode === "zoom"
                    ? ui.formSubZoom
                    : consultationMode === "whatsapp"
                    ? ui.formSubWhatsapp
                    : ui.formSubEmail}
                </p>

                {/* 3-Way Consultation Mode Switcher */}
                <div className="grid grid-cols-3 gap-1.5 mt-4 p-1 rounded-xl bg-[var(--gold)]/10 border border-[var(--gold)]/25">
                  <button
                    type="button"
                    onClick={() => setConsultationMode("zoom")}
                    className={`py-2 px-2 rounded-lg text-[0.72rem] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      consultationMode === "zoom"
                        ? "bg-[var(--gold)] text-[var(--card)] shadow-md"
                        : "text-[var(--foreground)]/70 hover:text-[var(--foreground)]"
                    }`}
                  >
                    <Video className="w-3.5 h-3.5 shrink-0" />
                    <span>{ui.modeZoomLabel}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setConsultationMode("whatsapp")}
                    className={`py-2 px-2 rounded-lg text-[0.72rem] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      consultationMode === "whatsapp"
                        ? "bg-[var(--gold)] text-[var(--card)] shadow-md"
                        : "text-[var(--foreground)]/70 hover:text-[var(--foreground)]"
                    }`}
                  >
                    <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{ui.modeWhatsappLabel}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setConsultationMode("email")}
                    className={`py-2 px-2 rounded-lg text-[0.72rem] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      consultationMode === "email"
                        ? "bg-[var(--gold)] text-[var(--card)] shadow-md"
                        : "text-[var(--foreground)]/70 hover:text-[var(--foreground)]"
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5 shrink-0" />
                    <span>{ui.modeEmailLabel}</span>
                  </button>
                </div>
              </div>

              {/* Informational Guidance: No Uploads Needed on Web */}
              <div className="mb-4 p-3 rounded-xl bg-[var(--gold)]/10 border border-[var(--gold)]/25 text-[0.75rem] text-[var(--foreground)]/85 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[var(--gold)] shrink-0 mt-0.5" />
                <span>
                  <strong>{ui.noUploadNoticeBold}</strong>{" "}
                  {ui.noUploadNoticeText(
                    consultationMode === "zoom"
                      ? ui.modeShareZoom
                      : consultationMode === "whatsapp"
                      ? ui.modeShareWhatsapp
                      : ui.modeShareEmail
                  )}
                </span>
              </div>

              {/* Success Notification */}
              {submitSuccess ? (
                <div className="py-6 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-cinzel text-lg font-bold text-[var(--foreground)]">
                    {ui.successHeading}
                  </h3>
                  <p className="text-xs text-[var(--foreground)]/80 leading-relaxed max-w-sm mx-auto">
                    {ui.successDescPrefix} <span className="font-bold text-[var(--gold)]">{clientName}</span>.{" "}
                    {ui.successDescMiddle}{" "}
                    <strong className="text-[var(--foreground)] capitalize">
                      {consultationMode === "zoom"
                        ? ui.modeZoomLabel
                        : consultationMode === "whatsapp"
                        ? ui.modeWhatsappLabel
                        : ui.modeEmailLabel}
                    </strong>{" "}
                    {ui.successDescSuffix}
                  </p>

                  <div className="p-3 rounded-lg bg-[var(--gold)]/10 border border-[var(--gold)]/30 text-xs font-mono text-[var(--gold)]">
                    {ui.successRefLabel} #BK-{submitSuccess.id || "CONFIRMED"}
                  </div>

                  {consultationMode === "whatsapp" && waContactUrl ? (
                    <a
                      href={buildConfiguredWhatsAppUrl(
                        `${ui.defaultWhatsappPrefill(service.title)} #${submitSuccess.id || ""} (${clientName})`,
                        service.contact_phone,
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{ui.successOpenWhatsappCta}</span>
                    </a>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => {
                      setSubmitSuccess(null);
                      setMessage("");
                      setTargetAncestor("");
                    }}
                    className="text-xs text-[var(--foreground)]/60 hover:text-[var(--gold)] underline pt-2 block mx-auto cursor-pointer"
                  >
                    {ui.successSendAnotherBtn}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  {submitError && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  {/* Client Name */}
                  <div>
                    <label className="block text-xs font-semibold text-[var(--foreground)]/85 mb-1">
                      {ui.labelName} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-[var(--foreground)]/40" />
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder={ui.placeholderName}
                        className="w-full ps-9 pe-3 py-2 rounded-lg border border-[var(--gold)]/35 bg-[var(--background)] text-xs focus:outline-none focus:border-[var(--gold)]"
                      />
                    </div>
                  </div>

                  {/* Client Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[var(--foreground)]/85 mb-1">
                        {ui.labelEmail} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-[var(--foreground)]/40" />
                        <input
                          type="email"
                          required
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                          placeholder={ui.placeholderEmail}
                          className="w-full ps-9 pe-3 py-2 rounded-lg border border-[var(--gold)]/35 bg-[var(--background)] text-xs focus:outline-none focus:border-[var(--gold)]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[var(--foreground)]/85 mb-1">
                        {ui.labelPhone} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-[var(--foreground)]/40" />
                        <input
                          type="tel"
                          required
                          value={clientPhone}
                          onChange={(e) => setClientPhone(e.target.value)}
                          placeholder={ui.placeholderPhone}
                          className="w-full ps-9 pe-3 py-2 rounded-lg border border-[var(--gold)]/35 bg-[var(--background)] text-xs focus:outline-none focus:border-[var(--gold)]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Meeting Details when consultationMode === 'zoom' */}
                  {consultationMode === "zoom" && (
                    <div className="p-3.5 rounded-xl border border-blue-500/30 bg-blue-500/5 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400">
                        <Calendar className="w-4 h-4" />
                        <span>{ui.zoomScheduleHeading}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-[var(--foreground)]/85 mb-1">
                            {ui.labelPreferredDate} <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            required
                            min={new Date().toISOString().slice(0, 10)}
                            value={meetingDate}
                            onChange={(e) => setMeetingDate(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-[var(--gold)]/35 bg-[var(--background)] text-xs focus:outline-none focus:border-[var(--gold)]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[var(--foreground)]/85 mb-1">
                            {ui.labelTimeSlot} <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={meetingTime}
                            onChange={(e) => setMeetingTime(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-[var(--gold)]/35 bg-[var(--background)] text-xs focus:outline-none focus:border-[var(--gold)]"
                          >
                            <option value="09:00 - 10:00">09:00 - 10:00 ({ui.slotMorning})</option>
                            <option value="10:00 - 11:00">10:00 - 11:00 ({ui.slotMorning})</option>
                            <option value="11:00 - 12:00">11:00 - 12:00 ({ui.slotMorning})</option>
                            <option value="14:00 - 15:00">14:00 - 15:00 ({ui.slotAfternoon})</option>
                            <option value="15:00 - 16:00">15:00 - 16:00 ({ui.slotAfternoon})</option>
                            <option value="16:00 - 17:00">16:00 - 17:00 ({ui.slotAfternoon})</option>
                            <option value="17:00 - 18:00">17:00 - 18:00 ({ui.slotLateAfternoon})</option>
                            <option value="18:00 - 19:00">18:00 - 19:00 ({ui.slotEvening})</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Target Ancestor */}
                  <div>
                    <label className="block text-xs font-semibold text-[var(--foreground)]/85 mb-1">
                      {ui.labelTargetAncestor}
                    </label>
                    <input
                      type="text"
                      value={targetAncestor}
                      onChange={(e) => setTargetAncestor(e.target.value)}
                      placeholder={ui.placeholderTargetAncestor}
                      className="w-full px-3 py-2 rounded-lg border border-[var(--gold)]/35 bg-[var(--background)] text-xs focus:outline-none focus:border-[var(--gold)]"
                    />
                  </div>

                  {/* Urgency */}
                  <div>
                    <label className="block text-xs font-semibold text-[var(--foreground)]/85 mb-1">
                      {ui.labelUrgency}
                    </label>
                    <select
                      value={urgency}
                      onChange={(e) => setUrgency(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[var(--gold)]/35 bg-[var(--background)] text-xs focus:outline-none focus:border-[var(--gold)]"
                    >
                      <option value="standard">{ui.urgencyStandard}</option>
                      <option value="urgent">{ui.urgencyUrgent}</option>
                      <option value="express">{ui.urgencyExpress}</option>
                    </select>
                  </div>

                  {/* What the client wants / message */}
                  <div>
                    <label className="block text-xs font-semibold text-[var(--foreground)]/85 mb-1">
                      {ui.labelMessage} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={ui.placeholderMessage}
                      className="w-full p-3 rounded-lg border border-[var(--gold)]/35 bg-[var(--background)] text-xs focus:outline-none focus:border-[var(--gold)] leading-relaxed resize-y"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[var(--gold)] to-[var(--gold)]/85 text-[var(--card)] font-bold text-xs flex items-center justify-center gap-2 shadow-lg hover:opacity-95 hover:shadow-xl transition-all disabled:opacity-60 cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>{ui.submittingText}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>
                          {consultationMode === "zoom"
                            ? ui.submitZoomCta
                            : consultationMode === "whatsapp"
                            ? ui.submitWhatsappCta
                            : ui.submitEmailCta}
                        </span>
                      </>
                    )}
                  </button>

                  <p className="text-[0.65rem] text-center text-[var(--foreground)]/60">
                    {ui.formFooterDisclaimer}
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
