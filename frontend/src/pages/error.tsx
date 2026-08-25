import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import { PageHero, Section } from "../components/site/Primitives";
import sidiBouSaid from "../assets/slider-sidibousaid.jpg";
import SEO from "../components/SEO";

export default function Error() {
  return (
    <div className="bg-[var(--background)] text-[var(--foreground)] min-h-screen">
      <SEO
        title="Page Not Found — Roots Tunisia"
        description="The requested page could not be found in the Roots Tunisia archives."
      />

      <PageHero
        eyebrow="404 Error"
        title="Lost in the Archives"
        subtitle="The document or directory you are looking for has been moved or does not exist."
        image={sidiBouSaid}
      >
        <Link to="/" className="btn-base btn-gold">
          <Home className="h-4 w-4" /> Return to Home
        </Link>
        <button
          onClick={() => window.history.back()}
          className="btn-base btn-outline-light"
        >
          <ArrowLeft className="h-4 w-4" /> Go Back
        </button>
      </PageHero>
    </div>
  );
}
