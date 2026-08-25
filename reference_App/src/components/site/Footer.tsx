import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "./Logo";

const explore = [
  { to: "/genealogy-gallery", label: "Family Trees" },
  { to: "/gallery", label: "Photo Gallery" },
  { to: "/library", label: "Library" },
  { to: "/audio", label: "Oral Histories" },
  { to: "/articles", label: "Articles" },
];

const research = [
  { to: "/periods", label: "Tunisian Periods" },
  { to: "/sources", label: "Sources" },
  { to: "/archives", label: "Archives" },
  { to: "/subscriptions", label: "Subscriptions" },
  { to: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-gold/35 bg-secondary/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            A Tunisian genealogy platform connecting civil registers, beylical and Ottoman
            registers, habous deeds, Protectorate archives, photographs and family memory —
            from Carthage to Kairouan, Tunis to Djerba.
          </p>
        </div>
        <div>
          <h4 className="eyebrow">Explore</h4>
          <ul className="mt-4 space-y-2.5">
            {explore.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-sm text-muted-foreground transition-colors hover:text-gold"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="eyebrow">Research</h4>
          <ul className="mt-4 space-y-2.5">
            {research.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-sm text-muted-foreground transition-colors hover:text-gold"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="eyebrow">Contact</h4>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 text-gold" /> Rue de la Kasbah, Medina of
              Tunis, Tunisia
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gold" /> contact@rootstunisia.com
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gold" /> +216 71 000 000
            </li>
          </ul>
        </div>
      </div>
      <div className="gold-rule" />
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Roots Tunisia. All rights reserved.</p>
        <p className="font-display text-sm tracking-wide text-gold">
          جذور تونس · Preserving Tunisian lineage
        </p>
      </div>
    </footer>
  );
}
