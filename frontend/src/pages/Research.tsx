import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, BookOpen, GitBranch, Users, FileText, Download, X } from "lucide-react";
import { api } from "../api/client";
import { PageHero, Section, SectionHeading } from "../components/site/Primitives";
import manuscript from "../assets/family-archive.jpg";
import TreesBuilder, { parseGedcom, parseGedcomX } from "../admin/components/TreesBuilder";
import ErrorBoundary from "../components/ErrorBoundary";
import SEO from "../components/SEO";

export default function Research() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<{ trees: any[]; books: any[]; people: any[] }>({
    trees: [],
    books: [],
    people: [],
  });
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [viewTree, setViewTree] = useState<any>(null);
  const [viewPeople, setViewPeople] = useState<any[]>([]);
  const [viewTreeError, setViewTreeError] = useState("");
  const [viewLoading, setViewLoading] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const { data } = await api.get(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setResults({
        trees: data.trees || [],
        books: data.books || [],
        people: data.people || [],
      });
    } catch (err) {
      setResults({ trees: [], books: [], people: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleViewTree = async (tree: any) => {
    setViewTree(tree);
    setViewPeople([]);
    setViewTreeError("");
    setViewLoading(true);
    try {
      const { data } = await api.get(`/trees/${tree.id}/gedcom`, { responseType: "text" });
      const raw = typeof data === "string" ? data : (data && (data as any).data != null ? String((data as any).data) : "");
      const isGedcomX = /^\s*(\{|\<\?xml)/.test(raw);
      const people = isGedcomX ? parseGedcomX(raw) : parseGedcom(raw);
      setViewPeople(Array.isArray(people) ? people : []);
    } catch (err: any) {
      setViewTreeError("Failed to load pedigree data.");
    } finally {
      setViewLoading(false);
    }
  };

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)] min-h-screen">
      <SEO
        title="Research & Archive Search — Roots Tunisia"
        description="Search across all digitized Tunisian manuscripts, civil registers, and community family trees."
      />

      <PageHero
        eyebrow="Universal Research"
        title="Search Across the Archives"
        subtitle="Search across family names, tribes, ancestral places, digitized books, civil extracts and oral history indices."
        image={manuscript}
      />

      <Section>
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSearch} className="surface-card flex items-center p-2 border-2 border-[var(--gold)]/50">
            <Search className="h-5 w-5 text-[var(--gold)] ml-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search family name, tribe, archive or governorate…"
              className="flex-1 bg-transparent px-4 py-3 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)]"
            />
            <button type="submit" disabled={loading} className="btn-base btn-gold text-xs">
              {loading ? "Searching…" : "Search"}
            </button>
          </form>
        </div>

        {searched && (
          <div className="mt-12 space-y-12">
            {/* Family Trees */}
            <div>
              <h3 className="eyebrow mb-4">Family Trees ({results.trees.length})</h3>
              {results.trees.length === 0 ? (
                <p className="text-sm text-[var(--muted-foreground)]">No matching trees found.</p>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {results.trees.map((t) => (
                    <article key={t.id} className="surface-card p-6">
                      <GitBranch className="h-5 w-5 text-[var(--gold)]" />
                      <h4 className="mt-3 font-display text-xl text-[var(--foreground)]">{t.title}</h4>
                      <p className="mt-1 text-xs text-[var(--muted-foreground)]">{t.owner_name}</p>
                      <p className="mt-3 text-sm text-[var(--muted-foreground)] line-clamp-2">{t.description}</p>
                      <button
                        onClick={() => handleViewTree(t)}
                        className="btn-base btn-red mt-5 text-[0.65rem] py-2 px-3"
                      >
                        View Tree
                      </button>
                    </article>
                  ))}
                </div>
              )}
            </div>

            {/* Books & Documents */}
            <div>
              <h3 className="eyebrow mb-4">Digitized Books & Documents ({results.books.length})</h3>
              {results.books.length === 0 ? (
                <p className="text-sm text-[var(--muted-foreground)]">No matching library documents found.</p>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {results.books.map((b) => (
                    <article key={b.id} className="surface-card p-6">
                      <BookOpen className="h-5 w-5 text-[var(--primary)]" />
                      <h4 className="mt-3 font-display text-xl text-[var(--foreground)]">{b.title}</h4>
                      <p className="mt-1 text-xs text-[var(--muted-foreground)]">{b.author}</p>
                      <p className="mt-3 text-sm text-[var(--muted-foreground)] line-clamp-2">{b.description}</p>
                      <Link to="/subscriptions" className="btn-base btn-outline-ink mt-5 text-[0.65rem] py-2 px-3">
                        Consult Document
                      </Link>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Section>

      {/* Tree Modal */}
      {viewTree && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="surface-card flex flex-col w-full max-w-6xl max-h-[90vh] overflow-hidden border-2 border-[var(--gold)]">
            <div className="flex items-center justify-between border-b border-[var(--gold)]/30 p-4 bg-[var(--secondary)]/50">
              <h3 className="font-display text-xl text-[var(--foreground)]">{viewTree.title}</h3>
              <button
                onClick={() => setViewTree(null)}
                className="rounded p-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {viewLoading ? (
                <p className="py-20 text-center text-[var(--gold)] font-display text-lg">Loading…</p>
              ) : (
                <ErrorBoundary>
                  <TreesBuilder readOnly={true} initialPeople={viewPeople} title={viewTree.title} />
                </ErrorBoundary>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
