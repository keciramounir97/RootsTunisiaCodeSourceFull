import { useEffect, useMemo, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  BookOpen,
  Search,
  Download,
  Eye,
  Bookmark,
  Filter,
  X,
  FileText,
  Calendar,
  UserCheck,
  ShieldCheck,
  Copy,
  Check,
  ExternalLink,
  Heart,
  MessageSquare,
} from "lucide-react";
import { api } from "../api/client";
import { useTranslation } from "../context/TranslationContext";
import { useTheme } from "../context/ThemeContext";
import { useSiteContent } from "../hooks/useSiteContent";
import RootsPageShell from "../components/RootsPageShell";
import GalleryCommentsModal from "../components/GalleryCommentsModal";
import { useAuth } from "../admin/components/AuthContext";
import {
  getSocialLikes,
  toggleSocialLike,
  getTrackedUploads,
  resolveAnyMediaUrl,
} from "../utils/gallerySocial";
import manuscriptImage from "../assets/family-archive.jpg";

interface BookItem {
  id: number | string;
  titleKey?: string;
  title: string;
  authorKey?: string;
  author: string;
  centuryKey?: string;
  century?: string;
  category: string;
  categoryKey?: string;
  descriptionKey?: string;
  description: string;
  pages?: number;
  pdfUrl?: string;
  coverImage?: string;
  archiveReferenceKey?: string;
  archiveReference?: string;
  isBookmarked?: boolean;
  likes?: number;
  isLiked?: boolean;
}

const fallbackTunisiaBooks: BookItem[] = [
  {
    id: "book-tun-1",
    title: "Ithaf Ahl al-Zaman bi-Akhbar Muluk Tunis wa Ahd al-Aman",
    author: "Ahmad Ibn Abi Diyaf",
    century: "19th Century (1875)",
    category: "Historical Chronicles",
    description: "The seminal 8-volume historical chronicle of the Regency of Tunis, Beylical genealogies, viziers, and the pivotal constitutional reforms of Ahd al-Aman.",
    pages: 450,
    archiveReference: "Archives Nationales de Tunisie (Fonds Histoire & Sijillat)",
    coverImage: "/assets/01_Carthage_Ancient_Ruins_Landscape.jpg",
  },
  {
    id: "book-tun-2",
    title: "Khulāṣat al-Athar fī A'yān al-Qarn al-Hādī 'Ashar (Tunis & Sahel Lineages)",
    author: "Cheikh Al-Muhibbi & Scholars of Zaytouna",
    century: "17th–18th Century",
    category: "Genealogy & Habous",
    description: "Biographical and genealogical compilation of noteworthy scholars, judges, notary-clerks (Adoul), and merchant dynasties across Tunis, Kairouan, and Sfax.",
    pages: 380,
    archiveReference: "Bibliothèque Nationale de Tunisie (Manuscrits Zaytouna)",
    coverImage: "/assets/14_Kairouan_Mosque_Arched_Doorways_Dome.jpg",
  },
  {
    id: "book-tun-3",
    title: "Sijillat al-Habous wa al-Mahakim al-Shariyya bi-Tunis",
    author: "Majlis al-Shara' al-Tunisi",
    century: "18th–20th Century",
    category: "Legal & Court Sijillat",
    description: "Primary notary court registers recording private and charitable pious foundations (Habous Ahli & Khayri), establishing unbroken chains of patronymic filiation.",
    pages: 290,
    archiveReference: "Archives du Premier Ministère & Daftarkhana, La Kasbah",
    coverImage: "/assets/16_Medina_Ornate_Door_Blue_Grille.jpg",
  },
  {
    id: "book-gedcom-std-7",
    title: "The GEDCOM 7.0 Specification: Universal Data Model for Family History & Archival Graphs",
    author: "Family History Information Standards Organisation (FHISO) & FamilySearch Standards Council",
    century: "2021 (Current Standard)",
    category: "GEDCOM & Informatics",
    description: "The definitive reference specification for GEDCOM 7.0: mandatory UTF-8 character encoding, elimination of ambiguous ANSEL charsets, introduction of ZipGED (.gdz) packaging with integrated media manifests, and semantic URI-based extension mechanisms.",
    pages: 194,
    archiveReference: "FHISO Standard Spec. 2021-06 / FamilySearch Engineering Labs",
    coverImage: "/assets/04_El_Jem_Amphitheater_Panorama.jpg",
  },
  {
    id: "book-gedcom-evolution-history",
    title: "From GEDCOM 4.0 to GEDCOM 5.5.1: Three Decades of Computerized Lineage Interoperability",
    author: "FamilySearch Family History Department & LDS Historical Standards Committee",
    century: "1984–2019 (Standards Review)",
    category: "GEDCOM & Informatics",
    description: "Comprehensive technical analysis of the GEnealogical Data COMmunication grammar: line hierarchy grammar, level-0 records (HEAD, INDI, FAM, SOUR, REPO), pointer resolution, and structural divergences between releases 4.0, 5.3, 5.5, and 5.5.1.",
    pages: 248,
    archiveReference: "FamilySearch Digital Library & Open Standards Archives",
    coverImage: "/assets/slider-kairouan.jpg",
  },
  {
    id: "book-gedcomx-familysearch-model",
    title: "The GedcomX Conceptual Model & RESTful Hypermedia Architecture",
    author: "Ryan Heaton & FamilySearch API Architecture Working Group",
    century: "2013–2024",
    category: "GEDCOM & Informatics",
    description: "Formal specification of the GedcomX open data model: hypermedia web APIs, JSON/XML schema representations, evidentiary source linking (SourceDescription, Agent, Coverage), and the mathematical distinction between conclusion trees and archival source records.",
    pages: 312,
    archiveReference: "GedcomX Open Project Repository & FamilySearch Developer Network",
    coverImage: "/assets/slider-carthage.jpg",
  },
  {
    id: "book-genealogical-data-structures",
    title: "Computational Genealogy: Graph Theory, Pedigree Collapse, and Lineage Data Structures",
    author: "Dr. François Marchal & International Society of Genetic and Archival Informatics",
    century: "2022",
    category: "GEDCOM & Informatics",
    description: "Advanced computational treatise modeling kinship networks through directed acyclic graphs (DAGs), consanguineous pedigree collapse loops, ancestral loss coefficients, and patronymic chain traversal algorithms tailored for Mediterranean archives.",
    pages: 385,
    archiveReference: "Computational Humanities Press & Genealogical Science Index",
    coverImage: "/assets/medina-tunis.jpg",
  },
];

export default function GalleryBooks() {
  const { theme } = useTheme();
  const { t, isRtl } = useTranslation();
  const { getText, getImage } = useSiteContent();
  const { user } = useAuth();

  const [books, setBooks] = useState<BookItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [activeBook, setActiveBook] = useState<BookItem | null>(null);
  const [showReaderModal, setShowReaderModal] = useState(false);
  const [copiedCitation, setCopiedCitation] = useState(false);
  const [commentTarget, setCommentTarget] = useState<{
    mediaKey: string;
    title: string;
    subtitle?: string;
    likes: number;
  } | null>(null);

  const loadAllBooks = async () => {
    try {
      setLoading(true);
      let items: any[] = [];
      try {
        const { data } = await api.get("/books");
        items = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
      } catch {
        // fallback
      }

      const formatted = items.map((b: any) => {
        const key = `gallery_book_${b.id}`;
        const social = getSocialLikes(key, 0);
        return {
          id: b.id,
          title: b.title || "Archival Manuscript",
          author: b.author || "Tunisian Scholar",
          century: b.century || "19th Century",
          category: b.category || "Historical Chronicles",
          description: b.description || "",
          pages: b.pages || 180,
          coverImage: resolveAnyMediaUrl(b.cover_image || b.coverImage || b.cover_path, undefined, manuscriptImage),
          archiveReference: b.archive_reference || b.archiveReference || "Archives Nationales de Tunisie",
          likes: social.count,
          isLiked: social.isLiked,
        };
      });

      const tracked = getTrackedUploads("books").map((b: any) => {
        const key = `gallery_book_${b.id}`;
        const social = getSocialLikes(key, 0);
        return {
          id: b.id,
          title: b.title || "Uploaded Manuscript",
          author: b.author || "Contributor",
          century: b.century || "19th Century",
          category: b.category || "Historical Chronicles",
          description: b.description || "",
          pages: b.pages || 140,
          coverImage: resolveAnyMediaUrl(b.cover_image || b.coverImage || b.cover_path, undefined, manuscriptImage),
          archiveReference: b.archiveReference || "National Archives",
          likes: social.count,
          isLiked: social.isLiked,
        };
      });

      const curated = fallbackTunisiaBooks.map((b) => {
        const key = `gallery_book_${b.id}`;
        const social = getSocialLikes(key, 0);
        return {
          ...b,
          likes: social.count,
          isLiked: social.isLiked,
        };
      });

      setBooks([...tracked, ...formatted, ...curated]);
    } catch {
      setBooks(fallbackTunisiaBooks);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    loadAllBooks();

    const handleUploadsChanged = (e: any) => {
      if (!e.detail || e.detail.kind === "books") {
        loadAllBooks();
      }
    };
    window.addEventListener("roots:uploads-changed", handleUploadsChanged);
    return () => window.removeEventListener("roots:uploads-changed", handleUploadsChanged);
  }, []);

  const toggleBookLike = async (id: number | string) => {
    if (!user) {
      alert(t("legacy.login_to_like", "Vous devez être connecté avec un compte pour aimer un manuscrit."));
      return;
    }
    const key = `gallery_book_${id}`;
    const target = books.find((b) => b.id === id);
    const result = await toggleSocialLike(key, target?.likes || 0, undefined, "book", Number(id) || undefined);
    setBooks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isLiked: result.isLiked, likes: result.count } : b))
    );
  };

  const categoryOptions = [
    { key: "All", labelKey: "cat_all" },
    { key: "GEDCOM & Informatics", labelKey: "cat_gedcom_informatics" },
    { key: "Historical Chronicles", labelKey: "cat_chronicles" },
    { key: "Legal & Court Sijillat", labelKey: "cat_sijillat" },
    { key: "Genealogy & Habous", labelKey: "cat_genealogy_habous" },
    { key: "Manuscripts", labelKey: "cat_manuscripts" },
  ];

  const filteredBooks = useMemo(() => {
    return books.filter((item) => {
      const matchQuery =
        !query ||
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.author.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase());
      const matchCat = categoryFilter === "All" || item.category === categoryFilter;
      return matchQuery && matchCat;
    });
  }, [books, query, categoryFilter]);

  const toggleBookmark = (id: number | string) => {
    setBooks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isBookmarked: !b.isBookmarked } : b))
    );
  };

  const handleCopyCitation = (book: BookItem) => {
    const citation = `${book.author}. ${book.title}. ${book.century}. [Archival Preservation: ${book.archiveReference}]. Roots Tunisia Manuscript Repository.`;
    navigator.clipboard.writeText(citation);
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 3000);
  };

  return (
    <RootsPageShell
      heroBackgroundUrl={getImage("library", "hero", "image")}
      hero={
        <div className="space-y-4 text-center">
          <p className="eyebrow text-[var(--gold)] text-shadow-gold tracking-widest font-bold">
            {getText("library", "hero", "eyebrow") ?? t("nav_library")}
          </p>
          <h1 className="display-xl text-white font-bold hero-title-shadow text-shadow-glow tracking-wide">
            {getText("library", "hero", "title") ??
              t("library_title", "Tunisian Manuscripts & Digitized Books")}
          </h1>
          <div className="gold-rule mt-4 w-28 mx-auto shadow-lg" />
          <p className="max-w-3xl mx-auto text-base text-slate-100/95 font-medium drop-shadow-md">
            {getText("library", "hero", "subtitle") ??
              t(
                "library_desc",
                "Access digitized Tunisian manuscripts, Beylical chronicles, Charaïques court registers, and Andalusian family waqf deeds.",
              )}
          </p>
        </div>
      }
    >
      <div className="w-full space-y-8">
        {/* Search & Category Filter */}
        <div className="surface-card p-4 sm:p-5 rounded-lg border border-[var(--gold)]/35 bg-[var(--card)]/95 shadow-md flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[var(--muted-foreground)] absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={t("search_books_placeholder")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full ps-9 pe-3 py-2 text-xs rounded-md border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 scrollbar-thin">
            <Filter className="w-4 h-4 text-[var(--gold)] shrink-0" />
            {categoryOptions.map((catOpt) => (
              <button
                key={catOpt.key}
                type="button"
                onClick={() => setCategoryFilter(catOpt.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                  categoryFilter === catOpt.key
                    ? "bg-[var(--gold)] text-[#1f160f] shadow-sm font-bold"
                    : "bg-[var(--card)] text-[var(--foreground)] border border-[var(--border)] hover:border-[var(--gold)]"
                }`}
              >
                {t(catOpt.labelKey)}
              </button>
            ))}
          </div>
        </div>

        {/* Books Grid */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="surface-card frame-gold p-12 text-center rounded-lg space-y-4 max-w-xl mx-auto my-8">
            <BookOpen className="w-12 h-12 text-[var(--gold)] mx-auto opacity-80" />
            <h3 className="text-xl font-display font-bold text-[var(--foreground)]">
              {t("no_records_found")}
            </h3>
            <p className="text-sm text-[var(--muted-foreground)]">
              {t("search_books_placeholder")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {filteredBooks.map((book) => (
              <article
                key={book.id}
                className="surface-card frame-gold p-6 rounded-lg shadow-md flex h-full flex-col justify-between space-y-4 hover:-translate-y-1 transition-all text-start"
              >
                <div className="space-y-3">
                  <div className="relative h-48 overflow-hidden rounded-md border border-[var(--border)] bg-[var(--background)]">
                    <img
                      src={book.coverImage || manuscriptImage}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => toggleBookmark(book.id)}
                      className="absolute top-2 end-2 p-1.5 rounded-full bg-black/60 text-white hover:text-[var(--gold)] transition-colors cursor-pointer"
                    >
                      <Bookmark className={`w-4 h-4 ${book.isBookmarked ? "fill-[var(--gold)] text-[var(--gold)]" : ""}`} />
                    </button>
                    {book.century && (
                      <span className="absolute bottom-2 start-2 px-2 py-0.5 rounded-sm bg-black/75 text-[0.65rem] font-bold text-[var(--gold)] border border-[var(--gold)]/30 backdrop-blur-sm">
                        {book.century}
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--gold)]">
                      {book.categoryKey ? t(book.categoryKey) : book.category}
                    </span>
                    <h3 className="text-base sm:text-lg font-display font-bold text-[var(--foreground)] line-clamp-2 mt-0.5">
                      {book.title}
                    </h3>
                    <p className="text-xs text-[var(--gold)] font-semibold mt-1">
                      {book.author}
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)] line-clamp-3 mt-2 leading-relaxed">
                      {book.description}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--border)] space-y-3">
                  <div className="flex items-center justify-between text-[0.68rem] text-[var(--muted-foreground)] font-mono">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3 text-[var(--gold)]" />
                      {book.pages ? `${book.pages} ${t("pages_count")}` : t("manuscript_tag")}
                    </span>
                    <span className="truncate max-w-[150px]">{book.archiveReference}</span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveBook(book);
                        setShowReaderModal(true);
                      }}
                      className="btn-base btn-gold flex-1 text-xs py-2 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{t("book_view_folio")}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleBookLike(book.id)}
                      className="btn-base btn-outline text-xs py-2 px-2.5 flex items-center justify-center gap-1 cursor-pointer"
                      title={t("like", "Like")}
                    >
                      <Heart className={`w-3.5 h-3.5 ${book.isLiked ? "fill-rose-500 text-rose-500" : "text-[var(--gold)]"}`} />
                      <span className="text-[0.65rem]">{book.likes || 0}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setCommentTarget({
                          mediaKey: `gallery_book_${book.id}`,
                          title: book.title,
                          subtitle: `${book.author} • ${book.century}`,
                          likes: book.likes || 0,
                        })
                      }
                      className="btn-base btn-outline text-xs py-2 px-2.5 flex items-center justify-center cursor-pointer"
                      title={t("comments", "Comments")}
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[var(--gold)]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopyCitation(book)}
                      className="btn-base btn-outline text-xs py-2 px-2.5 flex items-center justify-center cursor-pointer"
                      title={t("copy_citation_btn")}
                    >
                      <Copy className="w-3.5 h-3.5 text-[var(--gold)]" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Reader / Folio Inspection Modal */}
      {showReaderModal && activeBook && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in"
          onClick={() => setShowReaderModal(false)}
        >
          <div
            className="surface-card frame-gold relative w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-xl bg-[var(--card)] shadow-2xl text-start"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label={t("close")}
              onClick={() => setShowReaderModal(false)}
              className="absolute top-4 end-4 text-[var(--muted-foreground)] hover:text-[var(--foreground)] p-1 rounded-full hover:bg-[var(--gold)]/15 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-[var(--gold)]/25 pb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--gold)]/15 text-[var(--gold)] ring-1 ring-[var(--gold)]/40 shrink-0">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[var(--gold)]">
                  {activeBook.categoryKey ? t(activeBook.categoryKey) : activeBook.category}
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-[var(--foreground)]">
                  {activeBook.title}
                </h3>
                <p className="text-xs text-[var(--gold)] font-bold mt-0.5">
                  {activeBook.author} • {activeBook.century}
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <div className="h-64 sm:h-80 w-full rounded-lg overflow-hidden border border-[var(--gold)]/30 bg-black/40">
                <img
                  src={activeBook.coverImage || manuscriptImage}
                  alt={activeBook.title}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="p-4 rounded-md bg-[var(--background)]/70 border border-[var(--gold)]/20">
                <p className="text-[0.68rem] font-bold uppercase text-[var(--gold)] mb-1">
                  {t("description")}
                </p>
                <p className="text-xs sm:text-sm text-[var(--foreground)] leading-relaxed">
                  {activeBook.description}
                </p>
              </div>

              <div className="p-4 rounded-md bg-[var(--background)]/70 border border-[var(--gold)]/20">
                <p className="text-[0.68rem] font-bold uppercase text-[var(--gold)] mb-1">
                  {t("repository_label")}
                </p>
                <p className="text-xs font-mono text-[var(--muted-foreground)]">
                  {activeBook.archiveReference}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[var(--gold)]/20 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleBookLike(activeBook.id)}
                  className="btn-base btn-outline text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer"
                >
                  <Heart className={`h-4 w-4 ${activeBook.isLiked ? "fill-rose-500 text-rose-500" : "text-[var(--gold)]"}`} />
                  <span>{activeBook.likes || 0}</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setCommentTarget({
                      mediaKey: `gallery_book_${activeBook.id}`,
                      title: activeBook.title,
                      subtitle: `${activeBook.author} • ${activeBook.century}`,
                      likes: activeBook.likes || 0,
                    })
                  }
                  className="btn-base btn-gold text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>{t("comments", "Comments")}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCopyCitation(activeBook)}
                  className="btn-base btn-outline text-xs py-2 px-4 flex items-center gap-2 cursor-pointer"
                >
                  {copiedCitation ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedCitation ? t("book_citation_copied") : t("copy_citation_btn")}</span>
                </button>
                <a
                  href="http://www.bnt.nat.tn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-base btn-outline text-xs py-2 px-4 flex items-center gap-1.5"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-[var(--gold)]" />
                  <span>{t("official_portal_link")}</span>
                </a>
              </div>

              <button
                type="button"
                onClick={() => setShowReaderModal(false)}
                className="btn-base btn-outline text-xs py-2 px-4"
              >
                {t("close")}
              </button>
            </div>
          </div>
        </div>
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
