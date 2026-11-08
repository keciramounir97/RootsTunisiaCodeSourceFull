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
  MapPin,
  Calendar,
  Sparkles,
  Heart,
  MessageSquare,
} from "lucide-react";
import { api } from "../api/client";
import { useTranslation } from "../context/TranslationContext";
import RootsPageShell from "../components/RootsPageShell";
import { Link, useLocation } from "react-router-dom";
import FamilyCardModal from "../components/FamilyCardModal";
import GalleryCommentsModal from "../components/GalleryCommentsModal";
import {
  getSocialLikes,
  toggleSocialLike,
  getTrackedUploads,
} from "../utils/gallerySocial";

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
  likes?: number;
  isLiked?: boolean;
}

export default function GalleryTrees() {
  const { t, isRtl } = useTranslation();
  const location = useLocation();

  const [trees, setTrees] = useState<TreeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(() => new URLSearchParams(location.search).get("q") || "");
  const [selectedGov, setSelectedGov] = useState("All");
  const [activeTree, setActiveTree] = useState<TreeItem | null>(null);
  const [commentTarget, setCommentTarget] = useState<{
    mediaKey: string;
    title: string;
    subtitle?: string;
    likes: number;
  } | null>(null);

  const loadAllTrees = async () => {
    try {
      setLoading(true);
      let items: any[] = [];
      try {
        const { data } = await api.get("/trees");
        items = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
      } catch {
        // fallback
      }

      const formatted = items.map((tr: any) => {
        const key = `gallery_tree_${tr.id}`;
        const social = getSocialLikes(key, 24);
        return {
          ...tr,
          likes: social.count,
          isLiked: social.isLiked,
        };
      });

      const tracked = getTrackedUploads("trees").map((tr: any) => {
        const key = `gallery_tree_${tr.id}`;
        const social = getSocialLikes(key, 1);
        return {
          ...tr,
          likes: social.count,
          isLiked: social.isLiked,
        };
      });

      setTrees([...tracked, ...formatted]);
    } catch {
      setTrees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const qParam = new URLSearchParams(location.search).get("q");
    if (qParam !== null) {
      setQuery(qParam);
    }
  }, [location.search]);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    loadAllTrees();

    const handleUploadsChanged = (e: any) => {
      if (!e.detail || e.detail.kind === "trees") {
        loadAllTrees();
      }
    };
    window.addEventListener("roots:uploads-changed", handleUploadsChanged);
    return () => window.removeEventListener("roots:uploads-changed", handleUploadsChanged);
  }, []);

  const toggleTreeLike = async (id: number | string) => {
    const key = `gallery_tree_${id}`;
    const target = trees.find((t) => t.id === id);
    const result = await toggleSocialLike(key, target?.likes || 0);
    setTrees((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isLiked: result.isLiked, likes: result.count } : t))
    );
  };

  const governorateOptions = [
    { key: "All", labelKey: "gov_all" },
    { key: "Tunis", labelKey: "gov_tunis" },
    { key: "Sfax", labelKey: "gov_sfax" },
    { key: "Mahdia", labelKey: "gov_mahdia" },
    { key: "Kairouan", labelKey: "gov_kairouan" },
    { key: "Sousse", labelKey: "gov_sousse" },
    { key: "Djerba", labelKey: "gov_djerba" },
    { key: "Bizerte", labelKey: "gov_bizerte" },
  ];

  const fallbackTrees: TreeItem[] = useMemo(
    () => [
      {
        id: "tunis-ben-achour",
        name: `${t("nav_trees")} — ${t("fam_ben_achour")}`,
        creator: t("heritage_research"),
        description: t("gov_notes_tunis"),
        governorate: "Tunis",
        generations: 7,
        membersCount: 84,
      },
      {
        id: "sfax-fourati",
        name: `${t("nav_trees")} — ${t("fam_fourati")}`,
        creator: t("heritage_research"),
        description: t("gov_notes_sfax"),
        governorate: "Sfax",
        generations: 6,
        membersCount: 62,
      },
      {
        id: "kairouan-chabbi",
        name: `${t("nav_trees")} — ${t("fam_chabbi")}`,
        creator: t("heritage_research"),
        description: t("gov_notes_kairouan"),
        governorate: "Kairouan",
        generations: 8,
        membersCount: 96,
      },
    ],
    [t]
  );

  const sourceTrees = trees.length > 0 ? trees : fallbackTrees;

  const filteredTrees = useMemo(() => {
    return sourceTrees.filter((item) => {
      const titleStr = item.name || item.title || `Family Tree #${item.id}`;
      const creatorStr = item.owner?.full_name || item.creator || t("heritage_research");
      const descStr = item.description || item.notes || item.provenance || "";
      const govStr = item.governorate || item.region || "Tunisia";

      const matchQuery =
        !query ||
        titleStr.toLowerCase().includes(query.toLowerCase()) ||
        creatorStr.toLowerCase().includes(query.toLowerCase()) ||
        descStr.toLowerCase().includes(query.toLowerCase()) ||
        govStr.toLowerCase().includes(query.toLowerCase());
      const matchGov = selectedGov === "All" || govStr === selectedGov;
      return matchQuery && matchGov;
    });
  }, [sourceTrees, query, selectedGov, t]);

  return (
    <RootsPageShell
      hero={
        <div className="space-y-4 text-center">
          <p className="eyebrow text-[var(--gold)] text-shadow-gold tracking-widest font-bold">
            {t("nav_trees")}
          </p>
          <h1 className="display-xl text-white font-bold hero-title-shadow text-shadow-glow tracking-wide">
            {t("family_trees_title")}
          </h1>
          <div className="gold-rule mt-4 w-28 mx-auto shadow-lg" />
          <p className="max-w-3xl mx-auto text-base text-slate-100/95 font-medium drop-shadow-md">
            {t("family_trees_desc")}
          </p>
        </div>
      }
    >
      <div className="w-full space-y-8">
        {/* Search & Filters */}
        <div className="surface-card p-4 sm:p-5 rounded-lg border border-[var(--gold)]/35 bg-[var(--card)]/95 shadow-md flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[var(--muted-foreground)] absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={t("search_trees_placeholder")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full ps-9 pe-3 py-2 text-xs rounded-md border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 scrollbar-thin">
            <Filter className="w-4 h-4 text-[var(--gold)] shrink-0" />
            {governorateOptions.map((govOpt) => (
              <button
                key={govOpt.key}
                type="button"
                onClick={() => setSelectedGov(govOpt.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                  selectedGov === govOpt.key
                    ? "bg-[var(--gold)] text-[#1f160f] shadow-sm font-bold"
                    : "bg-[var(--card)] text-[var(--foreground)] border border-[var(--border)] hover:border-[var(--gold)]"
                }`}
              >
                {t(govOpt.labelKey)}
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
              {t("no_trees_yet_title")}
            </h3>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
              {t("no_trees_yet_desc")}
            </p>
            <div className="pt-2">
              <Link to="/admin/trees" className="btn-base btn-gold text-xs py-2.5 px-6 inline-flex items-center gap-2">
                <GitBranch className="w-4 h-4" />
                <span>{t("open_tree_builder")}</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {filteredTrees.map((tree) => {
              const titleStr = tree.name || tree.title || `Family Tree #${tree.id}`;
              const creatorStr = tree.owner?.full_name || tree.creator || t("heritage_research");
              const descStr = tree.description || tree.notes || tree.provenance || "";
              const govStr = tree.governorate || tree.region || "Tunisia";
              const memberCount = tree.people?.length ?? tree.membersCount ?? 0;
              const genCount = tree.generations ?? (memberCount > 0 ? Math.ceil(Math.log2(memberCount + 1)) : 1);

              return (
                <article
                  key={tree.id}
                  className="surface-card frame-gold p-6 rounded-lg shadow-md space-y-4 flex h-full flex-col justify-between hover:-translate-y-1 transition-all text-start"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-sm text-[0.65rem] font-bold uppercase tracking-wider bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[var(--gold)]" />
                        <span>{govStr}</span>
                      </span>
                      <span className="flex items-center gap-1 text-[0.65rem] font-mono text-[var(--gold)] font-bold">
                        <FileCode className="w-3.5 h-3.5" />
                        <span>GEDCOM 5.5.1</span>
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-display font-bold text-[var(--foreground)] leading-snug">
                      {titleStr}
                    </h3>

                    <p className="text-xs text-[var(--foreground)]/80 leading-relaxed line-clamp-3">
                      {descStr}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[var(--border)] space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-[var(--background)] p-3 rounded-md border border-[var(--border)]">
                      <div className="flex items-center gap-1.5 text-[var(--foreground)]">
                        <Layers className="w-3.5 h-3.5 text-[var(--gold)] shrink-0" />
                        <span><strong>{t("generations_label")}:</strong> {genCount}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[var(--foreground)]">
                        <Users className="w-3.5 h-3.5 text-[var(--gold)] shrink-0" />
                        <span><strong>{t("individuals_label")}:</strong> {memberCount}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[0.65rem] text-[var(--muted-foreground)]">
                      <span>{t("by_author")} {creatorStr}</span>
                      <span>{tree.updated_at ? new Date(tree.updated_at).toLocaleDateString() : t("recently_updated")}</span>
                    </div>

                    <div className="pt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveTree(tree)}
                        className="btn-base btn-gold flex-1 text-xs py-2 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{t("explore_family_card")}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleTreeLike(tree.id)}
                        className="btn-base btn-outline text-xs py-2 px-2.5 flex items-center justify-center gap-1 cursor-pointer"
                        title={t("like", "Like")}
                      >
                        <Heart className={`w-3.5 h-3.5 ${tree.isLiked ? "fill-rose-500 text-rose-500" : "text-[var(--gold)]"}`} />
                        <span className="text-[0.65rem]">{tree.likes || 0}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setCommentTarget({
                            mediaKey: `gallery_tree_${tree.id}`,
                            title: titleStr,
                            subtitle: `${govStr} • ${genCount} ${t("generations_label")}`,
                            likes: tree.likes || 0,
                          })
                        }
                        className="btn-base btn-outline text-xs py-2 px-2.5 flex items-center justify-center cursor-pointer"
                        title={t("comments", "Comments")}
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-[var(--gold)]" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* 3D Family Card Inspector Modal */}
      {activeTree && (
        <FamilyCardModal
          tree={activeTree}
          onClose={() => setActiveTree(null)}
        />
      )}

      {commentTarget && (
        <GalleryCommentsModal
          isOpen={Boolean(commentTarget)}
          onClose={() => setCommentTarget(null)}
          mediaKey={commentTarget.mediaKey}
          itemTitle={commentTarget.title}
          itemSubtitle={commentTarget.subtitle}
          defaultLikes={commentTarget.likes}
        />
      )}
    </RootsPageShell>
  );
}
