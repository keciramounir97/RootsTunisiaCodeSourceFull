import { Link, useSearchParams } from "react-router-dom";
import { Home, ArrowLeft, ShieldAlert, AlertTriangle, Database, FileQuestion, RefreshCw } from "lucide-react";
import { PageHero } from "../components/site/Primitives";
import { useTranslation } from "../context/TranslationContext";
import sidiBouSaid from "../assets/slider-sidibousaid.jpg";
import SEO from "../components/SEO";

interface ErrorConfig {
  eyebrow: string;
  title: string;
  subtitle: string;
  seoTitle: string;
  icon: typeof FileQuestion;
}

const ERROR_CONFIGS: Record<string, ErrorConfig> = {
  "403": {
    eyebrow: "403 Forbidden",
    title: "Archival Access Restricted",
    subtitle: "You do not possess the required permissions to access this family tree, register, or administrative console. Make sure you are logged into the authorized account.",
    seoTitle: "403 Access Denied — Roots Tunisia",
    icon: ShieldAlert,
  },
  "404": {
    eyebrow: "404 Not Found",
    title: "Lost in the Archives",
    subtitle: "The document, register or directory you are looking for has been moved, re-indexed, or does not exist.",
    seoTitle: "404 Page Not Found — Roots Tunisia",
    icon: FileQuestion,
  },
  "500": {
    eyebrow: "500 Internal Error",
    title: "Archival Server Anomaly",
    subtitle: "An unexpected error occurred while processing this request. Our engineering team has been notified. None of your saved trees or notes have been affected.",
    seoTitle: "500 Server Error — Roots Tunisia",
    icon: AlertTriangle,
  },
  "503": {
    eyebrow: "503 Database Maintenance",
    title: "Database Temporarily Unavailable",
    subtitle: "The historical archive database is currently performing scheduled sync operations or experiencing temporary connectivity limits. Please wait a moment and try again.",
    seoTitle: "503 Service Unavailable — Roots Tunisia",
    icon: Database,
  },
};

export default function Error() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const statusParam = searchParams.get("status") || "404";
  const config = ERROR_CONFIGS[statusParam] || ERROR_CONFIGS["404"];
  const Icon = config.icon;

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)] min-h-screen">
      <SEO
        title={config.seoTitle}
        description={config.subtitle}
      />

      <PageHero
        eyebrow={t(`error_${statusParam}_eyebrow`, config.eyebrow)}
        title={t(`error_${statusParam}_title`, config.title)}
        subtitle={t(`error_${statusParam}_subtitle`, config.subtitle)}
        image={sidiBouSaid}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Link to="/" className="btn-base btn-gold flex items-center gap-2">
            <Home className="h-4 w-4" /> {t("error_home", "Return to Home")}
          </Link>
          {statusParam === "503" || statusParam === "500" ? (
            <button
              onClick={() => window.location.reload()}
              className="btn-base btn-outline-light flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" /> {t("retry_connection", "Retry Connection")}
            </button>
          ) : (
            <button
              onClick={() => window.history.back()}
              className="btn-base btn-outline-light flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" /> {t("error_back", "Go Back")}
            </button>
          )}
          <Link to="/contact" className="btn-base btn-outline-light">
            {t("contact_support", "Contact Support")}
          </Link>
        </div>
      </PageHero>

      {/* Helpful Guidance Section */}
      <section className="py-12 px-4 max-w-4xl mx-auto">
        <div className="surface-card p-8 rounded-xl border border-[var(--gold)]/30 flex items-start gap-4">
          <div className="p-3 rounded-lg bg-[var(--gold)]/10 text-[var(--gold)] shrink-0">
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold">{t("need_archival_assistance", "Need assistance finding archival records?")}</h2>
            <p className="mt-1 text-sm text-[var(--muted-foreground)] leading-relaxed">
              {t("error_follow_citation_prefix", "If you followed a citation or link from an external genealogy document, visit our")}{" "}
              <Link to="/search" className="text-[var(--gold)] underline hover:text-[var(--foreground)]">
                {t("general_search", "General Search")}
              </Link>{" "}
              {t("or_message_support_prefix", "or message our genealogical support desk via the")}{" "}
              <Link to="/contact" className="text-[var(--gold)] underline hover:text-[var(--foreground)]">
                {t("contact_page", "Contact Page")}
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
