import { useThemeStore } from "../store/theme";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  Scroll,
  Map,
  BookOpen,
  Users,
  Compass,
  FileText,
  Download,
  UserCircle2,
  Eye,
  X,
} from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useTranslation } from "../context/TranslationContext";
import { api } from "../api/client";
import TreesBuilder, { parseGedcom, parseGedcomX } from "../admin/components/TreesBuilder";
import ErrorBoundary from "../components/ErrorBoundary";
import RootsPageShell from "../components/RootsPageShell";

export default function Research() {
  const { theme } = useThemeStore();
  const { t } = useTranslation();

  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<{ trees: any[]; books: any[]; people: any[] }>({ trees: [], books: [], people: [] });
  const [suggestedTrees, setSuggestedTrees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [viewTree, setViewTree] = useState<any>(null);
  const [viewPeople, setViewPeople] = useState<any[]>([]);
  const [viewTreeError, setViewTreeError] = useState("");
  const [viewLoading, setViewLoading] = useState(false);
  const searchTimerRef = useRef<number | null>(null);

  const apiRoot = useMemo(() => {
    const base = String(api.defaults.baseURL || "");
    return base.replace(/\/api\/?$/, "");
  }, []);

  const downloadUrl = useCallback(
    (id: any) => `${apiRoot}/api/books/${id}/download`,
    [apiRoot]
  );

  const handleSearch = useCallback(
    async (queryOverride?: string) => {
      const q = typeof queryOverride === "string" ? queryOverride : searchQuery;
      if (!q.trim()) {
        setSearched(false);
        return;
      }

      setLoading(true);
      setSearched(true);

      try {
        const { data } = await api.get(`/search?q=${encodeURIComponent(q)}`);
        let foundTrees = data.trees || [];
        let foundBooks = data.books || [];
        let foundPeople = data.people || [];

        const isMock = localStorage.getItem("mockupDataActive") === "true";
        if (isMock) {
          const mockTrees = Array.from({ length: 10 }).map((_, idx) => ({
            id: `mock-tree-${idx}`,
            title: `Family Tree of Clan ${idx + 1}`,
            description: "A mock tree with 20 members for testing.",
            owner_name: "kameladmin",
            isPublic: true,
          }));
          const mockBooks = [
            {
              id: "mb1",
              title: "Muqaddimah",
              author: "Ibn Khaldun",
              category: "History",
              isPublic: true,
            },
            {
              id: "mb2",
              title: "Kitab al-Ansab",
              author: "Al-Sam'ani",
              category: "Genealogy",
              isPublic: true,
            },
          ];
          const mockPeople = mockTrees.flatMap((tree, idx) => [
            {
              id: `mp-${idx}-1`,
              name: `Ahmed ${tree.title}`,
              tree_title: tree.title,
              tree_id: tree.id,
              owner_name: tree.owner_name,
              tree_is_public: true,
            },
            {
              id: `mp-${idx}-2`,
              name: `Fatima ${tree.title}`,
              tree_title: tree.title,
              tree_id: tree.id,
              owner_name: tree.owner_name,
              tree_is_public: true,
            },
          ]);
          const filteredTrees = mockTrees.filter((tree) =>
            tree.title.toLowerCase().includes(q.toLowerCase())
          );
          const filteredBooks = mockBooks.filter((book) =>
            book.title.toLowerCase().includes(q.toLowerCase())
          );
          const filteredPeople = mockPeople.filter((person) =>
            person.name.toLowerCase().includes(q.toLowerCase())
          );
          foundTrees = [...foundTrees, ...filteredTrees];
          foundBooks = [...foundBooks, ...filteredBooks];
          foundPeople = [...foundPeople, ...filteredPeople];
        }

        setResults({ trees: foundTrees, books: foundBooks, people: foundPeople });
      } catch (err) {
        // Search error
      } finally {
        setLoading(false);
      }
    },
    [searchQuery]
  );

  useEffect(() => {
    AOS.init({ duration: 900, once: true });

    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) {
      setSearchQuery(q);
    } else {
      (async () => {
        try {
          const isMock = localStorage.getItem("mockupDataActive") === "true";
          if (isMock) {
            const mockTrees = Array.from({ length: 6 }).map((_, idx) => ({
              id: `mock-${idx}`,
              title: `Family Tree of Clan ${idx + 1}`,
              description: "Public mock tree",
              owner_name: "admin",
              isPublic: true,
            }));
            setSuggestedTrees(mockTrees);
            return;
          }
          const { data } = await api.get("/trees");
          setSuggestedTrees(Array.isArray(data) ? data.slice(0, 6) : []);
        } catch {
          // Silently fail
        }
      })();
    }
  }, []);

  useEffect(() => {
    const q = String(searchQuery || "").trim();
    if (!q) {
      setSearched(false);
      return;
    }

    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    searchTimerRef.current = window.setTimeout(() => handleSearch(q), 350);

    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, [searchQuery, handleSearch]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleViewTree = useCallback(async (tree: any) => {
    if (!tree) return;
    setViewTree(tree);
    setViewPeople([]);
    setViewTreeError("");
    setViewLoading(true);

    try {
      if (String(tree.id).startsWith("mock-")) {
        const familyName = tree.title.split(" ").pop() || "Mock";
        const mockPeople = [
          {
            id: "m1",
            names: { en: `Ahmed ${familyName}`, ar: "" },
            gender: "Male",
            birthYear: "1920",
            details: "Patriarch.",
            color: "#f8f5ef",
            children: ["m3", "m4"],
            spouse: "m2",
          },
        ];
        setViewPeople(mockPeople);
      } else {
        const isPublic =
          tree?.isPublic ?? tree?.is_public ?? tree?.tree_is_public ?? true;
        const endpoint = isPublic
          ? `/trees/${tree.id}/gedcom`
          : `/my/trees/${tree.id}/gedcom`;
        const { data } = await api.get(endpoint, { responseType: "text" });
        const raw = typeof data === "string" ? data : (data && data.data != null ? String(data.data) : "");
        const isGedcomX = /^\s*(\{|\<\?xml)/.test(raw);
        const people = isGedcomX ? parseGedcomX(raw) : parseGedcom(raw);
        const list = Array.isArray(people) ? people : [];
        setViewPeople(list);
        if (!list.length) {
          setViewTreeError(t("gedcom_no_people", "No individuals found in GEDCOM."));
        }
      }
    } catch (err: any) {
      setViewPeople([]);
      setViewTreeError(err?.response?.data?.message || err?.message || t("tree_builder_error", "Failed to load tree."));
    } finally {
      setViewLoading(false);
    }
  }, [t]);

  const heroContent = (
    <div className="space-y-5 text-center">
      <p className="text-sm uppercase tracking-[0.4em] text-[#C39637]">
        Research Center
      </p>
      <h1 className="text-5xl font-bold">{t("research_center_title", "Genealogical Research Center")}</h1>
      <p className="max-w-4xl mx-auto text-lg opacity-90">
        Explore archival approaches, document processes, and discovery routes
        tailored to Maghreb genealogy – from Ottoman diwans to colonial civil
        registers.
      </p>
    </div>
  );

  const sectionCard = theme === "dark" ? "bg-[#092C2B]" : "bg-white";
  const sectionBorder =
    theme === "dark" ? "border-[#134E4A]" : "border-[#c8dedd]";

  return (
    <RootsPageShell hero={heroContent}>
      <section className="roots-section" data-aos="fade-up">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold border-l-8 border-[#C39637] pl-4">
            {t("search_research_materials", "Search Research Materials")}
          </h2>
          <div
            className={`flex flex-col md:flex-row gap-4 p-6 rounded-xl border ${sectionBorder} ${sectionCard}`}
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-[#134E4A] opacity-80 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (!e.target.value) setSearched(false);
                }}
                onKeyDown={handleKeyDown}
                placeholder={t(
                  "search_placeholder",
                  "Search ancestors, archives, regions..."
                )}
                className={`w-full pl-10 py-3 rounded-md bg-transparent border ${sectionBorder} outline-none ${theme === "dark" ? "text-white" : "text-[#2c1810]"
                  }`}
              />
            </div>
            <button
              onClick={() => handleSearch()}
              className="interactive-btn px-6 py-3 rounded-full bg-gradient-to-r from-[#134E4A] to-[#C39637] text-[#151110] font-bold shadow-lg hover:opacity-90 transition-colors"
            >
              {t("search_button", "Search")}
            </button>
          </div>

          {searched && (
            <div className="space-y-8">
              {loading ? (
                <div className="text-center opacity-70">{t("searching", "Searching...")}</div>
              ) : (
                <div className="space-y-8">
                  <ResultSection
                    title={t("books_and_documents", "Books & Documents")}
                    count={results.books.length}
                    borderColor={sectionBorder}
                    items={results.books}
                    renderItem={(book, idx) => (
                      <BookResult
                        key={book.id || idx}
                        book={book}
                        downloadUrl={downloadUrl}
                        borderColor={sectionBorder}
                      />
                    )}
                  />
                  <ResultSection
                    title={t("people_label", "People")}
                    count={results.people.length}
                    borderColor={sectionBorder}
                    items={results.people}
                    renderItem={(person, idx) => (
                      <PersonResult
                        key={person.id || idx}
                        person={person}
                        borderColor={sectionBorder}
                        onView={() =>
                          handleViewTree({
                            id: person.tree_id,
                            title: person.tree_title || "Unknown Tree",
                            description: person.tree_description || "",
                            owner_name: person.owner_name || person.owner || "",
                            isPublic: person.tree_is_public,
                          })
                        }
                      />
                    )}
                  />
                  <ResultSection
                    title={t("trees", "Family Trees")}
                    count={results.trees.length}
                    borderColor={sectionBorder}
                    items={results.trees}
                    renderItem={(tree, idx) => (
                      <TreeResult
                        key={tree.id || idx}
                        tree={tree}
                        borderColor={sectionBorder}
                        onView={() => handleViewTree(tree)}
                      />
                    )}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {!searched && suggestedTrees.length > 0 && (
        <section className="roots-section roots-section-alt" data-aos="fade-up">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">
              {t("suggested_public_trees", "Suggested Public Family Trees")}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestedTrees.map((tree, idx) => (
                <div
                  key={tree.id || idx}
                  className={`${sectionCard} p-6 rounded-2xl border ${sectionBorder} shadow-lg`}
                >
                  <div className="w-12 h-12 rounded-full bg-[#134E4A]/10 flex items-center justify-center mb-4 text-[#134E4A]">
                     <Users className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{tree.title}</h3>
                  <p className="text-sm opacity-70 mb-4 line-clamp-3">
                    {tree.description ||
                      t("explore_public_tree_desc", "Explore this public family tree to discover connections.")}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-500/10 mb-4">
                    <span className="text-xs opacity-60">
                      {t("owner", "Owner")}: {tree.owner_name || tree.owner || "Admin"}
                    </span>
                    <span className="text-xs bg-[#C39637]/10 text-[#C39637] px-2 py-1 rounded">
                      {t("public", "Public")}
                    </span>
                  </div>
                  <button
                    onClick={() => handleViewTree(tree)}
                    className="interactive-btn w-full py-2 rounded-full bg-[#134E4A] text-white font-bold hover:opacity-90 transition flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    {t("view_tree", "View Tree")}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="roots-section" data-aos="fade-up">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold border-l-8 border-[#C39637] pl-4">
            {t("research_categories", "Research Categories")}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Scroll,
                title: "Ottoman Archives",
                desc: "Qadi court records, Habous registries, diwans, and Beylik files.",
              },
              {
                icon: FileText,
                title: "Colonial Civil Status",
                desc: "ANOM birth/marriage/death registers, censuses, and military rolls.",
              },
              {
                icon: Users,
                title: "Tribal & Amazigh Genealogy",
                desc: "Oral nasab, clan structures, and migration documentations.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`${sectionCard} p-8 rounded-xl border ${sectionBorder} shadow-lg text-center`}
              >
                <item.icon className="w-12 h-12 mx-auto mb-4 text-[#134E4A]" />
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="opacity-90">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="roots-section roots-section-alt" data-aos="fade-up">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">{t("research_guides_title", "Research Guides & Tutorials")}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: BookOpen,
                title: "Reading Ottoman Documents",
                desc: "Decode scripts, terminology, and rulings.",
              },
              {
                icon: Compass,
                title: "Tracing Lost Lines",
                desc: "Rebuild branches displaced by migrations or reforms.",
              },
              {
                icon: Map,
                title: "Archive Navigation",
                desc: "Algerian APC, Tunisian municipalities, Moroccan provinces.",
              },
              {
                icon: Users,
                title: "Interviewing Elders",
                desc: "Capture oral histories, traditions, and clan lore.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`${sectionCard} p-6 rounded-xl border ${sectionBorder} shadow-lg`}
              >
                <item.icon className="w-10 h-10 mb-4 text-[#C39637]" />
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="opacity-90">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section data-aos="fade-up">
        <h2 className="text-3xl font-bold mb-10 text-center">
          Historical Timeline
        </h2>
        <div className="relative border-l-4 border-[#C39637] ml-6 space-y-8">
          {[
            {
              period: "1516-1830 - Ottoman Rule",
              detail: "Patronymic naming, Qadi rulings, waqf records.",
            },
            {
              period: "1830-1882 - Transition",
              detail: "Military governance, census attempts, tribal mapping.",
            },
            {
              period: "1882-1962 - Colonial Era",
              detail:
                "Surnames fixation, ANOM civil registers, protected archives.",
            },
            {
              period: "1962-Present - Independence",
              detail: "APC civil records, national ID, migration tracking.",
            },
          ].map((item, idx) => (
            <div
              key={item.period}
              className="pl-8"
              data-aos="fade-right"
              data-aos-delay={idx * 120}
            >
              <h3 className="text-xl font-bold">{item.period}</h3>
              <p className="opacity-80 mt-1">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {viewTree && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`${sectionCard} w-full max-w-[90vw] h-[calc(90vh-6rem)] mt-24 rounded-lg shadow-2xl border ${sectionBorder} flex flex-col overflow-hidden relative`}
          >
            <div className="p-4 border-b border-gray-500/20 flex items-center justify-between bg-black/5">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#134E4A]" />
                  {viewTree.title}
                </h2>
                <p className="text-xs opacity-60">{t("viewing_mode_read_only", "Viewing Mode - Read Only")}</p>
              </div>
              <button
                onClick={() => {
                  setViewTree(null);
                  setViewPeople([]);
                  setViewTreeError("");
                }}
                className="p-2 rounded-full hover:bg-black/10 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 relative bg-gray-50/50 dark:bg-black/20 overflow-hidden">
              {viewLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#134E4A]"></div>
                </div>
              ) : viewTreeError ? (
                <div className="absolute inset-0 flex items-center justify-center p-6">
                  <div className="rounded-lg border border-[#e8dfca] bg-white/90 dark:bg-[#2c1810] dark:border-[#134E4A] px-6 py-5 text-sm text-[#134E4A] dark:text-[#e8dfca] shadow-xl text-center max-w-md">
                    <div className="font-semibold">
                      {t("tree_builder_error", "Tree builder failed to load.")}
                    </div>
                    <p className="mt-2 opacity-80">{viewTreeError}</p>
                  </div>
                </div>
              ) : (
                <ErrorBoundary
                  fallback={({ error, reset }) => (
                    <div className="absolute inset-0 flex items-center justify-center p-6">
                      <div className="rounded-lg border border-[#e8dfca] bg-white/90 px-6 py-5 text-sm text-[#134E4A] shadow-xl">
                        <div className="font-semibold">
                          {t("tree_builder_error", "Tree builder failed to load.")}
                        </div>
                        <div className="opacity-70">
                          {error?.message ||
                            t("tree_builder_try_again", "Please try again.")}
                        </div>
                        <button
                          type="button"
                          onClick={reset}
                          className="mt-3 inline-flex items-center rounded-md border border-[#e8dfca] px-3 py-1 text-xs font-semibold uppercase tracking-wide"
                        >
                          {t("retry", "Retry")}
                        </button>
                      </div>
                    </div>
                  )}
                >
                  <TreesBuilder
                    people={viewPeople}
                    setPeople={setViewPeople}
                    readOnly
                  />
                </ErrorBoundary>
              )}
            </div>
          </div>
        </div>
      )}
    </RootsPageShell>
  );
}

interface ResultSectionProps {
  title: string;
  count: number;
  borderColor: string;
  items: any[];
  renderItem: (item: any, idx: number) => React.ReactNode;
}

function ResultSection({ title, count, borderColor, items, renderItem }: ResultSectionProps) {
  if (!items) return null;
  return (
    <div>
      <h3 className="font-bold opacity-80 mb-3 flex items-center gap-2">
        <span className="text-lg">{title}</span>
        <span className="text-xs opacity-70">({count})</span>
      </h3>
      {items.length ? (
        <div className="space-y-3">
          {items.map((item, idx) => renderItem(item, idx))}
        </div>
      ) : (
        <div className="text-sm opacity-60 italic">
          No {title.toLowerCase()} found matching your query.
        </div>
      )}
      <div className={`w-full h-px my-4 ${borderColor}`}></div>
    </div>
  );
}

interface BookResultProps {
  book: any;
  downloadUrl: (id: any) => string;
  borderColor: string;
}

function BookResult({ book, downloadUrl, borderColor }: BookResultProps) {
  return (
    <div
      className={`p-4 rounded-2xl border ${borderColor} flex flex-col sm:flex-row gap-4`}
    >
      <div>
        <div className="font-bold">{book.title}</div>
        <div className="text-sm opacity-60">by {book.author || "Unknown"}</div>
        <div className="text-xs bg-[#134E4A]/10 text-[#134E4A] px-2 py-1 rounded inline-block mt-1">
          {book.category}
        </div>
      </div>
      {!String(book.id || "").startsWith("mb") ? (
        <a
          href={downloadUrl(book.id)}
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2 rounded-full bg-[#C39637]/10 text-[#C39637] hover:bg-[#C39637]/20 font-bold text-sm flex items-center gap-2 self-start sm:self-center"
        >
          <Download className="w-4 h-4" />
          Download
        </a>
      ) : (
        <span className="text-xs opacity-50 italic self-start sm:self-center">
          Mock Entry
        </span>
      )}
    </div>
  );
}

interface PersonResultProps {
  person: any;
  borderColor: string;
  onView: () => void;
}

function PersonResult({ person, borderColor, onView }: PersonResultProps) {
  const { t } = useTranslation();
  const treeTitle = person.tree_title || "Unknown Tree";
  return (
    <div
      className={`interactive-card p-4 rounded-2xl border ${borderColor} hover:border-[#134E4A]/50 transition-colors`}
    >
      <div className="font-bold text-lg">{person.name || "Unknown"}</div>
      <div className="text-sm opacity-70 mb-2">{t("tree_label", "Tree")}: {treeTitle}</div>
      <div className="text-xs opacity-50 flex items-center gap-1">
        <UserCircle2 className="w-3 h-3" />
        {t("owner", "Owner")}: {person.owner_name || person.owner || "Unknown"}
      </div>
      {onView ? (
        <button
          onClick={onView}
          className="interactive-btn mt-3 w-full py-2 rounded-full bg-[#134E4A]/10 text-[#134E4A] hover:bg-[#134E4A]/20 font-bold text-sm flex items-center justify-center gap-2"
        >
          <Eye className="w-4 h-4" />
          {t("view_tree", "View Tree")}
        </button>
      ) : null}
    </div>
  );
}

interface TreeResultProps {
  tree: any;
  borderColor: string;
  onView: () => void;
}

function TreeResult({ tree, borderColor, onView }: TreeResultProps) {
  const { t } = useTranslation();
  return (
    <div
      className={`interactive-card p-4 rounded-2xl border ${borderColor} hover:border-[#134E4A]/50 transition-colors`}
    >
      <div className="font-bold text-lg">{tree.title}</div>
      <div className="text-sm opacity-70 mb-2 line-clamp-2">
        {tree.description || t("no_description_provided", "No description provided.")}
      </div>
      <div className="text-xs opacity-50 flex items-center gap-1">
        <UserCircle2 className="w-3 h-3" />
        {t("owner", "Owner")}: {tree.owner_name || tree.owner || "Unknown"}
      </div>
      <button
        onClick={onView}
        className="interactive-btn mt-3 w-full py-2 rounded-full bg-[#134E4A]/10 text-[#134E4A] hover:bg-[#134E4A]/20 font-bold text-sm flex items-center justify-center gap-2"
      >
        <Eye className="w-4 h-4" />
        {t("view_and_explore", "View & Explore")}
      </button>
    </div>
  );
}
