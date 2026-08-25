import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, Download, Search, FileText, ExternalLink } from "lucide-react";
import { api } from "../api/client";
import { getApiRoot } from "../api/helpers";
import { PageHero, Section, SectionHeading } from "../components/site/Primitives";
import manuscript from "../assets/manuscript.jpg";
import SEO from "../components/SEO";
import { useTranslation } from "../context/TranslationContext";

const collections = [
  {
    title: "Manuscripts & Family Papers",
    body: "Private family collections, nasab rolls, correspondence and marriage contracts held in Tunisian households.",
    count: "1,240 items",
    category: "manuscripts",
  },
  {
    title: "État Civil Tunisien",
    body: "Civil status registers from 1886 onward: births, marriages, deaths, and municipal indexes by governorate.",
    count: "480,000 entries",
    category: "etat-civil",
  },
  {
    title: "Charaïque Court Registers",
    body: "Sijillat of the qadi courts of Tunis, Kairouan, Sfax and Sousse: inheritance, guardianship, property.",
    count: "3,100 volumes",
    category: "sijillat",
  },
  {
    title: "Habous Deeds",
    body: "Pious endowment records naming founders, beneficiaries and descendants across generations.",
    count: "12,700 deeds",
    category: "habous",
  },
  {
    title: "Beylical Decrees & Majba Rolls",
    body: "Husainid decrees, appointments, and the majba poll-tax registers listing heads of households.",
    count: "890 registers",
    category: "beylical",
  },
  {
    title: "Maps, Cadastre & Gazetteers",
    body: "Protectorate cadastral plans, tribal territory maps and place-name gazetteers for locating ancestors.",
    count: "2,050 sheets",
    category: "maps",
  },
  {
    title: "Community Registers of Djerba & Testour",
    body: "Jewish-Tunisian ketubot and Andalusian-Morisco family records from Testour and the Medjerda valley.",
    count: "640 records",
    category: "community",
  },
  {
    title: "Nasab & Lineage Texts",
    body: "Printed and manuscript genealogies of sharifian, marabout and tribal lineages of Tunisia.",
    count: "410 titles",
    category: "nasab",
  },
  {
    title: "Schools, Army & Emigration Files",
    body: "Sadiki College and Zitouna registers, military conscription lists, and emigration papers to France and Italy.",
    count: "1,860 files",
    category: "administration",
  },
];

export default function Library() {
  const { t } = useTranslation();
  const location = useLocation();
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const apiRoot = useMemo(() => getApiRoot(), []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const qParam = params.get("q");
    setQuery(qParam || "");
  }, [location.search]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await api.get("/books");
        if (!mounted) return;
        if (Array.isArray(res.data)) {
          setBooks(res.data);
        }
      } catch (err) {
        // Keep collections
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredBooks = useMemo(() => {
    if (!query) return books;
    const q = query.toLowerCase();
    return books.filter(
      (b) =>
        b.title?.toLowerCase().includes(q) ||
        b.author?.toLowerCase().includes(q) ||
        b.description?.toLowerCase().includes(q)
    );
  }, [books, query]);

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)] min-h-screen">
      <SEO
        title="Tunisian Genealogy Library — Manuscripts, Registers & Guides"
        description="A curated Tunisian research library: manuscripts, état civil extracts, charaïque registers, habous deeds, nasab texts, maps and archive guides."
        keywords={["Tunisian manuscripts", "Tunisian genealogy library", "Habous deeds Tunisia"]}
      />

      <PageHero
        eyebrow="Library"
        title="Tunisian Genealogy Library"
        subtitle="Digitized books, manuscripts, civil extracts, court registers, deeds and maps — organized so every claim in your tree can carry a citation."
        image={manuscript}
      >
        <Link to="/subscriptions" className="btn-base btn-gold">
          Get full access
        </Link>
        <Link to="/sources" className="btn-base btn-outline-light">
          Browse Archive Sources
        </Link>
      </PageHero>

      {/* Search Bar */}
      <div className="mx-auto max-w-7xl px-5 pt-8">
        <div className="surface-card flex items-center gap-3 p-3">
          <Search className="h-4 w-4 text-[var(--muted-foreground)] ml-2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search manuscripts, books, civil registers or author names…"
            className="w-full bg-transparent text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)]"
          />
        </div>
      </div>

      <Section>
        {/* Uploaded Library Documents if available */}
        {filteredBooks.length > 0 && (
          <div className="mb-14">
            <h3 className="eyebrow mb-6">Digitized Documents in Archive ({filteredBooks.length})</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredBooks.map((b) => (
                <article key={b.id} className="surface-card flex flex-col p-6 transition-transform hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    <BookOpen className="h-5 w-5 text-[var(--primary)]" />
                    <span className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[var(--gold)]">
                      {b.category || "General"}
                    </span>
                  </div>
                  <h4 className="mt-3 font-display text-xl leading-snug text-[var(--foreground)]">{b.title}</h4>
                  {b.author && (
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                      {b.author}
                    </p>
                  )}
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--muted-foreground)]">
                    {b.description || "Historical Tunisian reference volume and digitized archival record."}
                  </p>
                  <div className="mt-5 pt-4 border-t border-[var(--gold)]/20 flex items-center justify-between">
                    <span className="text-xs text-[var(--muted-foreground)]">
                      {b.documentCode || "DOC-INDEXED"}
                    </span>
                    <Link to="/subscriptions" className="btn-base btn-red px-3 py-1.5 text-[0.65rem]">
                      Consult Volume
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        <SectionHeading
          eyebrow="Collections"
          title="Nine core collections for Tunisian research"
          intro="Each collection is indexed by governorate, period and record type, with guidance on what the document can and cannot prove."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {collections.map((c) => (
            <article key={c.title} className="surface-card flex flex-col p-7 transition-transform hover:-translate-y-1">
              <BookOpen className="h-5 w-5 text-[var(--gold)]" />
              <h3 className="mt-4 font-display text-xl text-[var(--foreground)]">{c.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--muted-foreground)]">{c.body}</p>
              <div className="mt-6 pt-4 border-t border-[var(--gold)]/20 flex items-center justify-between">
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[var(--primary)]">
                  {c.count}
                </p>
                <Link to="/sources" className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--gold)] hover:underline">
                  View guide →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Section>
    </div>
  );
}
