import { useState } from "react";
import { Mail, MapPin, Phone, Clock, Send, CheckCircle2, AlertCircle, X } from "lucide-react";
import { useTranslation } from "../context/TranslationContext";
import { api } from "../api/client";
import { PageHero, Section, SectionHeading } from "../components/site/Primitives";
import sidiBouSaid from "../assets/slider-sidibousaid.jpg";
import SEO from "../components/SEO";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema } from "../api/validation";
import { z } from "zod";

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactUs() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [modalStatus, setModalStatus] = useState<{ open: boolean; type: "success" | "error"; msg: string }>({
    open: false,
    type: "success",
    msg: "",
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setLoading(true);

    try {
      await api.post("/contact", data);
      setModalStatus({
        open: true,
        type: "success",
        msg: t("message_sent_success", "Your message has been sent successfully to devteam@rootstunisia.com! A researcher will respond soon."),
      });
      reset();
    } catch (err: any) {
      setModalStatus({
        open: true,
        type: "error",
        msg: err.response?.data?.message || t("message_send_failed", "Failed to send message. Please try again later."),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)] min-h-screen">
      <SEO
        title="Contact Roots Tunisia — Research Help & Partnerships"
        description="Contact the Roots Tunisia team in the Medina of Tunis for research help, archive partnerships, script translation and institutional access."
        keywords={["Contact Roots Tunisia", "Tunisian genealogy support", "Tunisian archives help"]}
      />

      {/* Submission Feedback Modal */}
      {modalStatus.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="surface-card w-full max-w-md p-6 rounded-xl border border-[var(--gold)]/40 shadow-2xl relative text-center">
            <button
              onClick={() => setModalStatus({ ...modalStatus, open: false })}
              className="absolute right-4 top-4 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-teal-500/10 text-teal-600">
              {modalStatus.type === "success" ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              ) : (
                <AlertCircle className="w-8 h-8 text-rose-500" />
              )}
            </div>

            <h3 className="font-display text-xl font-bold mb-2">
              {modalStatus.type === "success" ? "Message Sent!" : "Transmission Error"}
            </h3>

            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mb-6">
              {modalStatus.msg}
            </p>

            <button
              onClick={() => setModalStatus({ ...modalStatus, open: false })}
              className="btn-base btn-gold w-full text-sm font-semibold py-2.5"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <PageHero
        eyebrow="Contact"
        title="Talk to the Roots Tunisia Team"
        subtitle="Research questions, archive partnerships, script translation, or institutional access — write to us and a Tunisian researcher will reply."
        image={sidiBouSaid}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <form
            className="surface-card p-8 transition-transform"
            onSubmit={handleSubmit(onSubmit)}
          >
            <SectionHeading center={false} eyebrow="Send a message" title="How can we help?" />

            <div className="mt-8 grid gap-5">
              <label className="grid gap-2">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                  Full name
                </span>
                <input
                  {...register("name")}
                  required
                  className="rounded-sm border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
                  placeholder="Amel Ben Salah"
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                  Email
                </span>
                <input
                  {...register("email")}
                  type="email"
                  required
                  className="rounded-sm border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
                  placeholder="you@example.tn"
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                  Message
                </span>
                <textarea
                  {...register("message")}
                  rows={5}
                  required
                  className="rounded-sm border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
                  placeholder="Describe the family, places and documents you already have…"
                />
                {errors.message && <p className="text-xs text-red-500">{errors.message.message}</p>}
              </label>

              <button
                type="submit"
                disabled={loading}
                className="btn-base btn-red justify-self-start flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                {loading ? "Sending…" : "Send message"}
              </button>
            </div>
          </form>

          <div className="space-y-6">
            <div className="surface-card p-8">
              <h3 className="font-display text-2xl text-[var(--foreground)]">Direct Contact</h3>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                Our editorial and research team is based in the heart of Tunis.
              </p>
              <ul className="mt-6 space-y-4 text-sm text-[var(--foreground)]">
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-[var(--gold)] shrink-0" />
                  <span>Rue de la Kasbah, Medina of Tunis, Tunisia</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-[var(--gold)] shrink-0" />
                  <a href="mailto:devteam@rootstunisia.com" className="hover:text-[var(--gold)]">
                    devteam@rootstunisia.com
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-[var(--gold)] shrink-0" />
                  <a href="tel:+21671000000" className="hover:text-[var(--gold)]">
                    +216 71 000 000
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-[var(--gold)] shrink-0" />
                  <span>Monday – Friday · 09:00 – 17:00 (GMT+1)</span>
                </li>
              </ul>
            </div>

            <div className="surface-card p-8 border-l-4 border-l-[var(--gold)]">
              <h4 className="font-display text-lg text-[var(--foreground)]">Archive Partnerships</h4>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">
                Are you an institution, municipality or private collector with Tunisian manuscripts, photos or deeds? We offer non-destructive digitization and indexing partnerships.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
