import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Archive,
  Download,
  Eye,
  Filter,
  FileText,
  Search,
  GitBranch,
  Users,
  X,
  Lock,
} from "lucide-react";
import { api } from "../api/client";
import { getApiErrorMessage, getApiRoot, normalizeTree } from "../api/helpers";
import { useTranslation } from "../context/TranslationContext";
import { PageHero, Section, SectionHeading } from "../components/site/Primitives";
import { TreeCard, featuredTrees } from "../components/site/TreeCard";
import TreesBuilder, { parseGedcom, parseGedcomX } from "../admin/components/TreesBuilder";
import galleryImage from "../assets/galleryimage.png";
import ErrorBoundary from "../components/ErrorBoundary";
import SEO from "../components/SEO";

export default function GenealogyGallery() {
  const { t } = useTranslation();
  const location = useLocation();

  const [trees, setTrees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [viewTree, setViewTree] = useState<any>(null);
  const [viewPeople, setViewPeople] = useState<any[]>([]);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewTreeError, setViewTreeError] = useState("");

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
        const treesRes = await api.get("/trees");
        if (!mounted) return;
        const apiRootVal = getApiRoot();
        let nextTrees =
          treesRes.status === 200 && Array.isArray(treesRes.data)
            ? treesRes.data.map((tr) => normalizeTree(tr, { apiRoot: apiRootVal, isPublic: true }))
            : [];
        setTrees(nextTrees);
      } catch (err) {
        if (!mounted) return;
        setTrees([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleViewTree = async (tree: any) => {
    setViewTree(tree);
    setViewPeople([]);
    setViewTreeError("");
    setViewLoading(true);
    try {
      if (!tree.hasGedcom) {
        setViewTreeError(t("no_gedcom_available", "No GEDCOM file available yet."));
        setViewLoading(false);
        return;
      }
      const { data } = await api.get(`/trees/${tree.id}/gedcom`, { responseType: "text" });
      const raw = typeof data === "string" ? data : (data && (data as any).data != null ? String((data as any).data) : "");
      const isGedcomX = /^\s*(\{|\<\?xml)/.test(raw);
      const people = isGedcomX ? parseGedcomX(raw) : parseGedcom(raw);
      const list = Array.isArray(people) ? people : [];
      setViewPeople(list);
      if (!list.length) {
        setViewTreeError(t("gedcom_no_people", "No individuals found in GEDCOM."));
      }
    } catch (err: any) {
      setViewTreeError(err?.response?.data?.message || err?.message || t("tree_builder_error", "Failed to load tree."));
    } finally {
      setViewLoading(false);
    }
  };

  const filteredApiTrees = useMemo(() => {
    if (!query) return trees;
    const q = query.toLowerCase();
    return trees.filter(
      (t) =>
        t.title?.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q) ||
        t.archiveSource?.toLowerCase().includes(q)
    );
  }, [trees, query]);

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)] min-h-screen">
      <SEO
        title="Tunisian Family Trees — Roots Tunisia Genealogy Gallery"
        description="Browse public Tunisian family trees from Tunis, Sfax, Kairouan, Djerba and the Djérid, with archive sources, document codes and GEDCOM 5.5.1 support."
        keywords={["Tunisian family trees", "Roots Tunisia genealogy gallery", "GEDCOM Tunisia"]}
      />

      <PageHero
        eyebrow="Genealogy Gallery"
        title="Tunisian Family Trees"
        subtitle="Public lineages documented with état civil extracts, charaïque registers, habous deeds and family memory."
        image={galleryImage}
      >
        <Link to="/signup" className="btn-base btn-gold">
          Create your tree
        </Link>
        <Link to="/subscriptions" className="btn-base btn-outline-light">
          Upgrade for GEDCOM Export
        </Link>
      </PageHero>

      {/* Search & Filter Bar */}
      <div className="mx-auto max-w-7xl px-5 pt-8">
        <div className="surface-card flex items-center gap-3 p-3">
          <Search className="h-4 w-4 text-[var(--muted-foreground)] ml-2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search family name, tribe, archive or governorate…"
            className="w-full bg-transparent text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)]"
          />
        </div>
      </div>

      <Section>
        <SectionHeading
          eyebrow="Family Tree Builder"
          title="Explore public Tunisian lineages"
          intro="Every tree carries its archive source and document code so other researchers can verify, extend or challenge the evidence."
        />

        {/* Database Trees if available */}
        {filteredApiTrees.length > 0 && (
          <div className="mt-10 mb-12">
            <h3 className="eyebrow mb-6">User Contributed Lineages ({filteredApiTrees.length})</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredApiTrees.map((tree) => (
                <article key={tree.id} className="surface-card flex flex-col p-6 transition-transform hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    <p className="eyebrow">Community Tree</p>
                    <span className="rounded-sm border border-[var(--gold)]/50 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-[var(--gold)]">
                      Public
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-xl leading-snug text-[var(--foreground)]">{tree.title}</h3>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                    {tree.owner_name || "Community Member"}
                  </p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--muted-foreground)]">
                    {tree.description || "Tunisian family lineage recorded with verified civil and historical records."}
                  </p>
                  <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-[var(--gold)]/25 pt-4 text-xs">
                    <div>
                      <dt className="font-bold uppercase tracking-[0.14em] text-[var(--gold)]">Archive Source</dt>
                      <dd className="mt-1 text-[var(--muted-foreground)]">{tree.archiveSource || "Archives Nationales de Tunisie"}</dd>
                    </div>
                    <div>
                      <dt className="font-bold uppercase tracking-[0.14em] text-[var(--gold)]">Document Code</dt>
                      <dd className="mt-1 text-[var(--muted-foreground)]">{tree.documentCode || "ANT-DOC-001"}</dd>
                    </div>
                  </dl>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <button
                      onClick={() => handleViewTree(tree)}
                      className="btn-base btn-red px-4 py-2 text-[0.65rem]"
                    >
                      <GitBranch className="h-3.5 w-3.5" /> View Tree
                    </button>
                    <Link to="/subscriptions" className="btn-base btn-outline-ink px-4 py-2 text-[0.65rem]">
                      <Download className="h-3.5 w-3.5" /> GEDCOM Export
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Featured Reference Trees */}
        <h3 className="eyebrow mb-6">Verified Archival Lineages</h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredTrees.map((t) => (
            <TreeCard key={t.id} tree={t} />
          ))}
        </div>
      </Section>

      <Section className="!pt-0">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              t: "Build Multi-Generational Trees",
              b: "Connect parents, grandparents, historical ancestors and extended families across Tunisian regions.",
            },
            {
              t: "Attach Historical Documents",
              b: "Upload birth records, marriage contracts, ANT and Protectorate archive scans, manuscripts and more.",
            },
            {
              t: "Trace Migration Paths",
              b: "Follow lineages across Carthage, Kairouan, Tunis, Sfax, Djerba, the Sahel, the Djérid and the diaspora.",
            },
          ].map((c) => (
            <div key={c.t} className="surface-card p-7">
              <h3 className="font-display text-xl text-[var(--foreground)]">{c.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--muted-foreground)]">{c.b}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* GEDCOM Viewer Modal */}
      {viewTree && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="surface-card flex flex-col w-full max-w-6xl max-h-[90vh] overflow-hidden border-2 border-[var(--gold)]">
            <div className="flex items-center justify-between border-b border-[var(--gold)]/30 p-4 bg-[var(--secondary)]/50">
              <div>
                <p className="eyebrow">Interactive Tree Viewer</p>
                <h3 className="font-display text-xl text-[var(--foreground)]">{viewTree.title}</h3>
              </div>
              <button
                onClick={() => setViewTree(null)}
                className="rounded p-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--gold)]/20"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {viewLoading ? (
                <div className="py-20 text-center">
                  <p className="font-display text-lg text-[var(--gold)]">Loading GEDCOM pedigree data…</p>
                </div>
              ) : viewTreeError ? (
                <div className="py-12 text-center text-red-500">
                  <p>{viewTreeError}</p>
                </div>
              ) : (
                <ErrorBoundary>
                  <TreesBuilder
                    readOnly={true}
                    initialPeople={viewPeople}
                    title={viewTree.title}
                  />
                </ErrorBoundary>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
