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
} from "lucide-react";
import { api } from "../api/client";
import { useTranslation } from "../context/TranslationContext";
import { useTheme } from "../context/ThemeContext";
import RootsPageShell from "../components/RootsPageShell";
import manuscriptImage from "../assets/family-archive.jpg";

interface BookItem {
  id: number | string;
  title: string;
  author: string;
  century?: string;
  category: string;
  description: string;
  pages?: number;
  pdfUrl?: string;
  coverImage?: string;
  archiveReference?: string;
  isBookmarked?: boolean;
}

const TUNISIAN_INITIAL_BOOKS: BookItem[] = [
  {
    id: "book-tn-1",
    title: "Ithaf Ahl al-Zaman bi-Akhbar Muluk Tunis wa'l-Ahan (Chronicles of Tunis Beys)",
    author: "Ahmad ibn Abi Diyaf (1804–1874)",
    century: "19th Century",
    category: "Historical Chronicles",
    description: "The primary historical and genealogical chronicle of Husainid Tunisia, documenting royal lineages, administrative decrees, notables, and tribal relations.",
    pages: 420,
    coverImage: manuscriptImage,
    archiveReference: "Bibliothèque Nationale de Tunisie, MSS 14820",
  },
  {
    id: "book-tn-2",
    title: "Sijillat al-Mahkama al-Shara'iyya bi-Tunis (Charaïques Court Registers)",
    author: "Tunis Ottoman Chancery",
    century: "18th–19th Century",
    category: "Legal & Court Sijillat",
    description: "Digitized judicial records of marriages, inheritances, waqf deeds, and property sales in the Medina of Tunis from 1750 to 1881.",
    pages: 310,
    coverImage: manuscriptImage,
    archiveReference: "Archives Nationales de Tunisie, Serie H",
  },
  {
    id: "book-tn-3",
    title: "Nasab & Waqf Records of Kairouan Lineages",
    author: "Al-Kairowani Jurists",
    century: "17th Century",
    category: "Genealogy & Habous",
    description: "Detailed waqf endowments, noble nasab trees, and scholar lineages recorded in Kairouan and Mahdia during the Hafsid and early Ottoman eras.",
    pages: 265,
    coverImage: manuscriptImage,
    archiveReference: "Archives des Habous, Tunis",
  },
];

export default function GalleryBooks() {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const [books, setBooks] = useState<BookItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [activeBook, setActiveBook] = useState<BookItem | null>(null);
  const [showReaderModal, setShowReaderModal] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/books");
        const items = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        if (items.length > 0) {
          setBooks(items);
        } else {
          setBooks(TUNISIAN_INITIAL_BOOKS);
        }
      } catch {
        setBooks(TUNISIAN_INITIAL_BOOKS);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const categories = ["All", "Historical Chronicles", "Legal & Court Sijillat", "Genealogy & Habous", "Manuscripts"];

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

  return (
    <RootsPageShell
      hero={
        <div className="space-y-4 text-center">
          <p className="eyebrow text-[var(--gold)] text-shadow-gold tracking-widest font-bold">
            {t("nav_library", "Roots Tunisia Digital Library")}
          </p>
          <h1 className="display-xl text-white font-bold hero-title-shadow text-shadow-glow tracking-wide">
            {t("library_title", "Manuscripts & Heritage Books")}
          </h1>
          <div className="gold-rule mt-4 w-28 mx-auto shadow-lg" />
          <p className="max-w-3xl mx-auto text-base text-slate-100/95 font-medium drop-shadow-md">
            {t(
              "library_desc",
              "Access digitized Tunisian manuscripts, Beylical chronicles, Charaïques court registers, and Andalusian family waqf deeds.",
            )}
          </p>
        </div>
      }
    >
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Search & Category Filter */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[var(--muted-foreground)] absolute start-3 top-2.5" />
            <input
              type="text"
              placeholder={t("search_books_placeholder", "Search title, author, or archive ref…")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full ps-9 pe-3 py-1.5 text-xs rounded-sm border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
            <Filter className="w-4 h-4 text-[var(--gold)] shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                  categoryFilter === cat
                    ? "bg-[var(--primary)] text-white shadow-sm"
                    : "bg-[var(--card)] text-[var(--foreground)] border border-[var(--border)] hover:border-[var(--gold)]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Books Grid */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="surface-card frame-gold p-5 rounded-lg shadow-md flex flex-col justify-between space-y-4 hover:-translate-y-1 transition-transform"
              >
                <div className="space-y-3">
                  <div className="relative h-48 overflow-hidden rounded-md border border-[var(--border)] bg-[var(--background)]">
                    <img
                      src={book.coverImage || manuscriptImage}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => toggleBookmark(book.id)}
                      className="absolute top-2 end-2 p-1.5 rounded-full bg-black/60 text-white hover:text-[var(--gold)] transition-colors cursor-pointer"
                    >
                      <Bookmark className={`w-4 h-4 ${book.isBookmarked ? "fill-[var(--gold)] text-[var(--gold)]" : ""}`} />
                    </button>
                    {book.century && (
                      <span className="absolute bottom-2 start-2 px-2 py-0.5 rounded-sm bg-black/70 text-[0.65rem] font-bold text-[var(--gold)]">
                        {book.century}
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--gold)]">
                      {book.category}
                    </span>
                    <h3 className="text-base font-serif font-bold text-[var(--foreground)] line-clamp-2 mt-0.5">
                      {book.title}
                    </h3>
                    <p className="text-xs text-[var(--muted-foreground)] font-semibold mt-1">
                      {book.author}
                    </p>
                    <p className="text-xs text-[var(--foreground)]/80 line-clamp-3 mt-2 leading-relaxed">
                      {book.description}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--border)] space-y-2">
                  <div className="flex items-center justify-between text-[0.65rem] text-[var(--muted-foreground)] font-mono">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3 text-[var(--gold)]" />
                      {book.pages ? `${book.pages} pages` : "Manuscript"}
                    </span>
                    <span className="truncate max-w-[150px]">{book.archiveReference}</span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => {
                        setActiveBook(book);
                        setShowReaderModal(true);
                      }}
                      className="flex-1 btn-base btn-gold text-xs py-1.5 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{t("view_manuscript", "Read Register")}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reader Modal */}
        {showReaderModal && activeBook && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="surface-card frame-gold p-6 rounded-lg max-w-2xl w-full space-y-4 bg-[var(--card)] shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                <div>
                  <span className="text-[0.65rem] font-bold uppercase text-[var(--gold)]">{activeBook.category}</span>
                  <h3 className="text-lg font-serif font-bold text-[var(--foreground)]">{activeBook.title}</h3>
                  <p className="text-xs text-[var(--muted-foreground)]">{activeBook.author}</p>
                </div>
                <button onClick={() => setShowReaderModal(false)} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-hidden rounded-md border border-[var(--border)] max-h-80">
                <img src={activeBook.coverImage || manuscriptImage} alt={activeBook.title} className="w-full object-cover" />
              </div>

              <div className="space-y-2 text-xs text-[var(--foreground)]">
                <h4 className="font-bold text-sm text-[var(--gold)]">Archival Summary & Record Note</h4>
                <p className="leading-relaxed">{activeBook.description}</p>
                <div className="p-3 rounded-sm bg-[var(--background)] border border-[var(--border)] font-mono text-[0.7rem] space-y-1">
                  <div><strong>Archive Reference:</strong> {activeBook.archiveReference || "Archives Nationales de Tunisie"}</div>
                  <div><strong>Period:</strong> {activeBook.century || "Beylical Era"}</div>
                  <div><strong>Access Tier:</strong> Full Digital Index Available</div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border)]">
                <button
                  onClick={() => setShowReaderModal(false)}
                  className="btn-base btn-outline-ink text-xs px-4 py-2 cursor-pointer"
                >
                  Close
                </button>
                <a
                  href="/my-download-requests"
                  className="btn-base btn-gold text-xs px-5 py-2 flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Request Full PDF</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </RootsPageShell>
  );
}
