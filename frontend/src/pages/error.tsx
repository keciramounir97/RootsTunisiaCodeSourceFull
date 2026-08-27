import { Link } from "react-router-dom";
import { Home, Search, ArrowLeft } from "lucide-react";
import RootsPageShell from "../components/RootsPageShell";
import { useTranslation } from "../context/TranslationContext";

export default function Error() {
  const { t } = useTranslation();
  return (
    <RootsPageShell
      hero={
        <div className="space-y-6 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-accent-gold/20 border-4 border-accent-gold/40">
            <Search className="w-12 h-12 text-accent-gold" />
          </div>
          <p className="text-sm uppercase tracking-[0.25em] text-accent-gold font-semibold">
            {t("page_not_found", "404 • Page Not Found")}
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-primary-brown dark:text-white">
            {t("lost_in_archives", "Lost in the Archives")}
          </h1>
          <p className="max-w-xl mx-auto text-lg opacity-85">
            {t("error_404_description", "The page you're looking for doesn't exist or has been moved. Return home to continue exploring your Maghreb heritage.")}
          </p>
        </div>
      }
    >
      <section className="roots-section roots-section-alt">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="roots-cta interactive-btn inline-flex items-center justify-center gap-2 px-8 py-3 text-base"
          >
            <Home className="w-5 h-5" />
            {t("go_to_home", "Go to Home")}
          </Link>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="interactive-btn inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border-2 border-primary-brown/40 dark:border-accent-gold/40 text-primary-brown dark:text-accent-gold font-semibold hover:bg-primary-brown/5 dark:hover:bg-accent-gold/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            {t("go_back", "Go Back")}
          </button>
        </div>
      </section>
    </RootsPageShell>
  );
}
