import { useEffect, useMemo, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  GitBranch,
  Users,
  Search,
  Eye,
  Download,
  Filter,
  Plus,
  X,
  FileCode,
  Calendar,
  Layers,
  Sparkles,
} from "lucide-react";
import { api } from "../api/client";
import { useTranslation } from "../context/TranslationContext";
import { useTheme } from "../context/ThemeContext";
import RootsPageShell from "../components/RootsPageShell";

interface TreeItem {
  id: number | string;
  title: string;
  creator: string;
  governorate?: string;
  generations: number;
  membersCount: number;
  description: string;
  hasGedcom?: boolean;
  updatedAt?: string;
}

const TUNISIAN_INITIAL_TREES: TreeItem[] = [
  {
    id: "tree-tn-1",
    title: "Ben Ammar Lineage of the Tunis Medina",
    creator: "Archives Nationales de Tunisie / Community",
    governorate: "Tunis",
    generations: 7,
    membersCount: 142,
    description: "Multi-generational lineage spanning 1780 to modern Tunis, connecting habous property deeds and Zaytuna scholar branches.",
    hasGedcom: true,
    updatedAt: "2026-02-10",
  },
  {
    id: "tree-tn-2",
    title: "Sfar & Andalusian Patricians of Mahdia",
    creator: "Mahdia Historical Society",
    governorate: "Mahdia",
    generations: 6,
    membersCount: 98,
    description: "Family tree tracing Andalusian migration from Testour to Mahdia, with maritime trade and civil registry links.",
    hasGedcom: true,
    updatedAt: "2026-01-25",
  },
  {
    id: "tree-tn-3",
    title: "Jaziri & Olive Merchant Pedigrees of Sfax",
    creator: "Sfax Heritage Research Group",
    governorate: "Sfax",
    generations: 8,
    membersCount: 215,
    description: "Extensive family pedigree linking coastal agricultural endowments, majba tax records, and diaspora branches in Marseille.",
    hasGedcom: true,
    updatedAt: "2026-02-18",
  },
  {
    id: "tree-tn-4",
    title: "Al-Kairowani Lineage & Waqf Beneficiaries",
    creator: "Kairouan Genealogical Circle",
    governorate: "Kairouan",
    generations: 9,
    membersCount: 310,
    description: "Deep ancestral tree from 1650 to present, incorporating Great Mosque scholar nasab chains and waqf charters.",
    hasGedcom: true,
    updatedAt: "2026-02-22",
  },
];

export default function GalleryTrees() {
  const { theme } = useTheme();
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
        if (items.length > 0) {
          setTrees(items);
        } else {
          setTrees(TUNISIAN_INITIAL_TREES);
        }
      } catch {
        setTrees(TUNISIAN_INITIAL_TREES);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const governorates = ["All", "Tunis", "Sfax", "Mahdia", "Kairouan", "Sousse", "Djerba", "Bizerte"];

  const filteredTrees = useMemo(() => {
    return trees.filter((item) => {
      const matchQuery =
        !query ||
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.creator.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase());
      const matchGov = selectedGov === "All" || item.governorate === selectedGov;
      return matchQuery && matchGov;
    });
  }, [trees, query, selectedGov]);

  return (
    <RootsPageShell
      hero={
        <div className="space-y-4 text-center">
          <p className="eyebrow text-[var(--gold)]">
            {t("nav_trees", "Roots Tunisia Pedigrees")}
          </p>
          <h1 className="display-xl text-[var(--foreground)] font-serif">
            {t("family_trees_title", "Family Trees & Pedigrees Gallery")}
          </h1>
          <p className="max-w-3xl mx-auto text-base opacity-90 text-[var(--muted-foreground)]">
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTrees.map((tree) => (
              <div
                key={tree.id}
                className="surface-card frame-gold p-6 rounded-lg shadow-md space-y-4 flex flex-col justify-between hover:-translate-y-1 transition-transform"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-sm text-[0.65rem] font-bold uppercase tracking-wider bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30">
                      {tree.governorate || "Tunisia"}
                    </span>
                    {tree.hasGedcom && (
                      <span className="flex items-center gap-1 text-[0.65rem] font-mono text-[var(--primary)] font-bold">
                        <FileCode className="w-3.5 h-3.5" />
                        GEDCOM Compatible
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-serif font-bold text-[var(--foreground)] leading-snug">
                    {tree.title}
                  </h3>

                  <p className="text-xs text-[var(--foreground)]/80 leading-relaxed line-clamp-3">
                    {tree.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[var(--border)] space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-[var(--background)] p-3 rounded-sm border border-[var(--border)]">
                    <div className="flex items-center gap-1.5 text-[var(--foreground)]">
                      <Layers className="w-3.5 h-3.5 text-[var(--gold)]" />
                      <span><strong>Generations:</strong> {tree.generations}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[var(--foreground)]">
                      <Users className="w-3.5 h-3.5 text-[var(--gold)]" />
                      <span><strong>Individuals:</strong> {tree.membersCount}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[0.65rem] text-[var(--muted-foreground)]">
                    <span>Curated by {tree.creator}</span>
                    <span>Updated {tree.updatedAt}</span>
                  </div>

                  <button
                    onClick={() => setActiveTree(tree)}
                    className="w-full btn-base btn-gold text-xs py-2 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <GitBranch className="w-4 h-4" />
                    <span>{t("explore_tree", "Explore Family Tree")}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tree Details Drawer/Modal */}
        {activeTree && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="surface-card frame-gold p-6 rounded-lg max-w-lg w-full space-y-4 bg-[var(--card)] shadow-2xl">
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                <div>
                  <span className="text-[0.65rem] font-bold uppercase text-[var(--gold)]">{activeTree.governorate} Governorate</span>
                  <h3 className="text-xl font-serif font-bold text-[var(--foreground)]">{activeTree.title}</h3>
                </div>
                <button onClick={() => setActiveTree(null)} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-[var(--foreground)]">
                <p className="leading-relaxed text-sm">{activeTree.description}</p>

                <div className="p-4 rounded-sm bg-[var(--background)] border border-[var(--border)] space-y-2 font-mono text-[0.7rem]">
                  <div><strong>Total Persons Linked:</strong> {activeTree.membersCount}</div>
                  <div><strong>Depth:</strong> {activeTree.generations} Ancestral Generations</div>
                  <div><strong>Source Provenance:</strong> Archives Nationales de Tunisie & Local Sijillat</div>
                  <div><strong>GEDCOM Standard:</strong> 5.5.1 UTF-8 Export Enabled</div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border)]">
                <button onClick={() => setActiveTree(null)} className="btn-base btn-outline-ink text-xs px-4 py-2 cursor-pointer">
                  Close
                </button>
                <a href="/admin/trees" className="btn-base btn-gold text-xs px-5 py-2 flex items-center gap-1.5 cursor-pointer">
                  <GitBranch className="w-3.5 h-3.5" />
                  <span>Open Tree Builder</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </RootsPageShell>
  );
}
