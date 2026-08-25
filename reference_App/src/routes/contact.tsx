import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { PageHero, Section, SectionHeading } from "../components/site/Primitives";
import sidiBouSaid from "../assets/slider-sidibousaid.jpg";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Roots Tunisia — Research Help & Partnerships" },
      {
        name: "description",
        content:
          "Contact the Roots Tunisia team in the Medina of Tunis for research help, archive partnerships, script translation and institutional access.",
      },
      { property: "og:title", content: "Contact Roots Tunisia" },
      {
        property: "og:description",
        content: "Reach our researchers for help with Tunisian archives, Arabic script and family trees.",
      },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Talk to the Roots Tunisia Team"
        subtitle="Research questions, archive partnerships, script translation, or institutional access — write to us and a Tunisian researcher will reply."
        image={sidiBouSaid}
      />
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <form
            className="surface-card p-8"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <SectionHeading center={false} eyebrow="Send a message" title="How can we help?" />
            <div className="mt-8 grid gap-5">
              <label className="grid gap-2">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  Full name
                </span>
                <input
                  required
                  className="rounded-sm border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-gold"
                  placeholder="Amel Ben Salah"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  Email
                </span>
                <input
                  type="email"
                  required
                  className="rounded-sm border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-gold"
                  placeholder="you@example.tn"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  Region of research
                </span>
                <select className="rounded-sm border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-gold">
                  {[
                    "Tunis & Ariana",
                    "Cap Bon & Nabeul",
                    "Sahel (Sousse, Monastir, Mahdia)",
                    "Sfax & the South-East",
                    "Kairouan & the Centre",
                    "Djérid & the South-West",
                    "North-West (Béja, Jendouba, Kef)",
                    "Djerba & the islands",
                    "Diaspora",
                  ].map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  Message
                </span>
                <textarea
                  rows={5}
                  required
                  className="rounded-sm border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-gold"
                  placeholder="Describe the family, places and documents you already have…"
                />
              </label>
              <button type="submit" className="btn-base btn-red justify-self-start">
                Send message
              </button>
            </div>
          </form>

          <aside className="grid gap-4 content-start">
            {[
              { icon: MapPin, t: "Office", b: "Rue de la Kasbah, Medina of Tunis, 1006 Tunis, Tunisia" },
              { icon: Mail, t: "Email", b: "contact@rootstunisia.com" },
              { icon: Phone, t: "Phone", b: "+216 71 000 000" },
              { icon: Clock, t: "Hours", b: "Monday to Friday, 09:00 – 17:00 (GMT+1)" },
            ].map((c) => (
              <div key={c.t} className="surface-card flex gap-4 p-6">
                <c.icon className="h-5 w-5 shrink-0 text-gold" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{c.t}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{c.b}</p>
                </div>
              </div>
            ))}
            <div className="zellige surface-card p-6">
              <h3 className="font-display text-lg text-foreground">Volunteer as a researcher</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                We welcome archivists, historians and paleographers who can read Maghrebi Arabic,
                Ottoman Turkish or Protectorate French hands.
              </p>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
