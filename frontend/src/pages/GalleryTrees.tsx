import { useEffect, useMemo, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  GitBranch,
  Users,
  Search,
  Filter,
  X,
  FileCode,
  Layers,
} from "lucide-react";
import { api } from "../api/client";
import { useTranslation } from "../context/TranslationContext";
import RootsPageShell from "../components/RootsPageShell";
import { Link } from "react-router-dom";

interface TreeItem {
  id: number | string;
  name?: string;
  title?: string;
  owner?: { full_name?: string; email?: string };
  creator?: string;
  region?: string;
  governorate?: string;
  generations?: number;
  membersCount?: number;
  description?: string;
  notes?: string;
  provenance?: string;
  hasGedcom?: boolean;
  updated_at?: string;
  created_at?: string;
  people?: any[];
}

export default function GalleryTrees() {
  const { t } = useTranslation();

  const [trees, setTrees] = useState<TreeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedGov, setSelectedGov] = useState("All");
  const [activeTree, setActiveTree] = useState<TreeItem | null>(null);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/trees");
        const items = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        setTrees(items);
      } catch {
        setTrees([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const governorates = ["All", "Tunis", "Sfax", "Mahdia", "Kairouan", "Sousse", "Djerba", "Bizerte"];

  const filteredTrees = useMemo(() => {
    return trees.filter((item) => {
      const titleStr = item.name || item.title || `Family Tree #${item.id}`;
      const creatorStr = item.owner?.full_name || item.creator || "Roots Tunisia Researcher";
      const descStr = item.description || item.notes || item.provenance || "";
      const govStr = item.governorate || item.region || "Tunisia";

      const matchQuery =
        !query ||
        titleStr.toLowerCase().includes(query.toLowerCase()) ||
        creatorStr.toLowerCase().includes(query.toLowerCase()) ||
        descStr.toLowerCase().includes(query.toLowerCase());
      const matchGov = selectedGov === "All" || govStr === selectedGov;
      return matchQuery && matchGov;
    });
  }, [trees, query, selectedGov]);

  return (
    <RootsPageShell
      hero={
        <div className="space-y-4 text-center">
          <p className="eyebrow text-[var(--gold)] text-shadow-gold tracking-widest font-bold">
            {t("nav_trees", "Roots Tunisia Pedigrees")}
          </p>
          <h1 className="display-xl text-white font-bold hero-title-shadow text-shadow-glow tracking-wide">
            {t("family_trees_title", "Family Trees & Pedigrees Gallery")}
          </h1>
          <div className="gold-rule mt-4 w-28 mx-auto shadow-lg" />
          <p className="max-w-3xl mx-auto text-base text-slate-100/95 font-medium drop-shadow-md">
            {t(
              "family_trees_desc",
              "Explore multi-generational family trees, GEDCOM datasets, and noble lineage records across the 24 governorates of Tunisia.",
            )}
          </p>
        </div>
      }
    >
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[var(--muted-foreground)] absolute start-3 top-2.5" />
            <input
              type="text"
              placeholder={t("search_trees_placeholder", "Search family tree, surname, or creator…")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full ps-9 pe-3 py-1.5 text-xs rounded-sm border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
            <Filter className="w-4 h-4 text-[var(--gold)] shrink-0" />
            {governorates.map((gov) => (
              <button
                key={gov}
                onClick={() => setSelectedGov(gov)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                  selectedGov === gov
                    ? "bg-[var(--primary)] text-white shadow-sm"
                    : "bg-[var(--card)] text-[var(--foreground)] border border-[var(--border)] hover:border-[var(--gold)]"
                }`}
              >
                {gov}
              </button>
            ))}
          </div>
        </div>

        {/* Trees Grid */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredTrees.length === 0 ? (
          <div className="surface-card frame-gold p-12 text-center rounded-lg space-y-4 max-w-xl mx-auto my-8">
            <GitBranch className="w-12 h-12 text-[var(--gold)] mx-auto opacity-80" />
            <h3 className="text-xl font-serif font-bold text-[var(--foreground)]">
              {t("no_trees_yet_title", "Aucun arbre généalogique publié")}
            </h3>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
              {t(
                "no_trees_yet_desc",
                "Créez et sauvegardez vos arbres généalogiques dans l'Éditeur d'Arbres. Ils s'afficheront automatiquement ici avec leurs cartes de famille.",
              )}
            </p>
            <div className="pt-2">
              <Link to="/admin/trees" className="btn-base btn-gold text-xs py-2.5 px-6 inline-flex items-center gap-2">
                <GitBranch className="w-4 h-4" />
                <span>Ouvrir l'Éditeur d'Arbres (Tree Builder)</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTrees.map((tree) => {
              const titleStr = tree.name || tree.title || `Family Tree #${tree.id}`;
              const creatorStr = tree.owner?.full_name || tree.creator || "Roots Tunisia Researcher";
              const descStr = tree.description || tree.notes || tree.provenance || "Arbre généalogique numérisé et documenté.";
              const govStr = tree.governorate || tree.region || "Tunisie";
              const memberCount = tree.people?.length ?? tree.membersCount ?? 0;
              const genCount = tree.generations ?? (memberCount > 0 ? Math.ceil(Math.log2(memberCount + 1)) : 1);

              return (
                <div
                  key={tree.id}
                  className="surface-card frame-gold p-6 rounded-lg shadow-md space-y-4 flex flex-col justify-between hover:-translate-y-1 transition-transform"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-sm text-[0.65rem] font-bold uppercase tracking-wider bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30">
                        📍 {govStr}
                      </span>
                      <span className="flex items-center gap-1 text-[0.65rem] font-mono text-[var(--primary)] font-bold">
                        <FileCode className="w-3.5 h-3.5" />
                        GEDCOM 5.5.1
                      </span>
                    </div>

                    <h3 className="text-xl font-serif font-bold text-[var(--foreground)] leading-snug">
                      {titleStr}
                    </h3>

                    <p className="text-xs text-[var(--foreground)]/80 leading-relaxed line-clamp-3">
                      {descStr}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[var(--border)] space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-[var(--background)] p-3 rounded-sm border border-[var(--border)]">
                      <div className="flex items-center gap-1.5 text-[var(--foreground)]">
                        <Layers className="w-3.5 h-3.5 text-[var(--gold)]" />
                        <span><strong>Générations:</strong> {genCount}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[var(--foreground)]">
                        <Users className="w-3.5 h-3.5 text-[var(--gold)]" />
                        <span><strong>Individus:</strong> {memberCount}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[0.65rem] text-[var(--muted-foreground)]">
                      <span>Proposé par {creatorStr}</span>
                      <span>{tree.updated_at ? new Date(tree.updated_at).toLocaleDateString() : "Mis à jour récemment"}</span>
                    </div>

                    <button
                      onClick={() => setActiveTree(tree)}
                      className="w-full btn-base btn-gold text-xs py-2 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <GitBranch className="w-4 h-4" />
                      <span>Explorer la Carte de Famille</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tree Details Drawer/Modal */}
        {activeTree && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="surface-card frame-gold p-6 rounded-lg max-w-xl w-full space-y-5 bg-[var(--card)] shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                <div>
                  <span className="text-[0.65rem] font-bold uppercase text-[var(--gold)]">
                    📍 {activeTree.governorate || activeTree.region || "Gouvernorat de Tunisie"}
                  </span>
                  <h3 className="text-xl font-serif font-bold text-[var(--foreground)]">
                    {activeTree.name || activeTree.title || `Arbre Familial #${activeTree.id}`}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTree(null)}
                  className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs text-[var(--foreground)]">
                <p className="leading-relaxed text-sm text-[var(--foreground)]/90">
                  {activeTree.description || activeTree.notes || activeTree.provenance || "Arbre généalogique documenté conservé dans la base des archives tunisiennes."}
                </p>

                <div className="p-4 rounded-sm bg-[var(--background)] border border-[var(--border)] space-y-2 font-mono text-[0.72rem]">
                  <div><strong>Membres Enregistrés:</strong> {activeTree.people?.length ?? activeTree.membersCount ?? 0} personnes</div>
                  <div><strong>Proposé par:</strong> {activeTree.owner?.full_name || activeTree.creator || "Recherche Patrimoniale"}</div>
                  <div><strong>Standard d'Exportation:</strong> GEDCOM 5.5.1 UTF-8</div>
                </div>

                {/* People / Individuals List inside tree card modal */}
                {Array.isArray(activeTree.people) && activeTree.people.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h4 className="font-semibold text-xs text-[var(--foreground)] uppercase tracking-wider flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-[var(--gold)]" />
                      <span>Membres de la Famille ({activeTree.people.length})</span>
                    </h4>
                    <div className="max-h-48 overflow-y-auto space-y-1.5 pe-1">
                      {activeTree.people.map((person: any, idx: number) => (
                        <div
                          key={person.id || idx}
                          className="p-2.5 rounded bg-[var(--background)] border border-[var(--border)] flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-bold text-[var(--foreground)]">
                              {person.first_name || person.firstName} {person.last_name || person.lastName || person.surname}
                            </span>
                            {(person.birth_date || person.birth_place) && (
                              <p className="text-[0.68rem] text-[var(--muted-foreground)]">
                                ✳️ {person.birth_date || "Date inconnue"} {person.birth_place ? `• ${person.birth_place}` : ""}
                              </p>
                            )}
                          </div>
                          <span className="text-[0.65rem] px-2 py-0.5 rounded bg-[var(--gold)]/10 text-[var(--gold)] font-mono">
                            {person.gender === 'F' ? '♀ Femme' : '♂ Homme'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border)]">
                <button
                  onClick={() => setActiveTree(null)}
                  className="btn-base btn-outline-ink text-xs px-4 py-2 cursor-pointer"
                >
                  Fermer
                </button>
                <Link
                  to="/admin/trees"
                  className="btn-base btn-gold text-xs px-5 py-2 flex items-center gap-1.5 cursor-pointer"
                >
                  <GitBranch className="w-3.5 h-3.5" />
                  <span>Ouvrir dans l'Éditeur d'Arbres</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </RootsPageShell>
  );
}
