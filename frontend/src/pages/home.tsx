import { NavLink } from "react-router-dom";
import { useThemeStore } from "../store/theme";
import {
  Archive,
  BookOpen,
  Compass,
  Download,
  Eye,
  Feather,
  FileText,
  Scroll,
  UserCircle2,
  Users,
  X,
  Play,
  Pause,
  Volume2,
  Music,
  Sparkles,
  Sliders,
} from "lucide-react";
import { useTranslation } from "../context/TranslationContext";
import { useState, useEffect, useRef } from "react";
import { api } from "../api/client";
import { getApiRoot, normalizeTree } from "../api/helpers";
import TreesBuilder, { parseGedcom, parseGedcomX } from "../admin/components/TreesBuilder";
import ErrorBoundary from "../components/ErrorBoundary";
import MaghrebTribesMap from "../components/MaghrebTribesMap";
import LocalHeritageGallery from "../components/LocalHeritageGallery";
import PersonLinksPanel from "../components/PersonLinksPanel";
import SEO from "../components/SEO";

interface FeaturedTree {
  id: string | number;
  title: string;
  description?: string;
  owner?: string;
  owner_name?: string;
  isPublic: boolean;
  hasGedcom: boolean;
  archiveSource?: string;
  documentCode?: string;
  createdAt?: string;
  data_format?: string;
}

interface Person {
  id: string;
  names: { en: string; ar: string };
  gender: string;
  birthYear: string;
  details: string;
  color: string;
  children?: string[];
  spouse?: string;
  father?: string;
  mother?: string;
}

export default function Home() {
  // @ts-ignore
  const { theme } = useThemeStore();
  const { t } = useTranslation();

  const [viewTree, setViewTree] = useState<FeaturedTree | null>(null);
  const [viewPeople, setViewPeople] = useState<Person[]>([]);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewTreeError, setViewTreeError] = useState("");
  const [selectedPerson, setSelectedPerson] = useState<any | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [activeHeritageTab, setActiveHeritageTab] = useState<"ben-ayed" | "monastir">("ben-ayed");
  const [selectedHeritageDetail, setSelectedHeritageDetail] = useState<any>(null);

  useEffect(() => {
    if (!viewTree) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setViewTree(null); setSelectedPerson(null); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", onKeyDown); };
  }, [viewTree]);

  // Heritage Lab Tab Selection
  const [activeLabTab, setActiveLabTab] = useState<"seal" | "voices" | "lineages">("seal");

  // Seal Creator Configuration
  const [sealFamilyNameEn, setSealFamilyNameEn] = useState("Ben Ayed");
  const [sealFamilyNameAr, setSealFamilyNameAr] = useState("بن عياد");
  const [sealTheme, setSealTheme] = useState<"sidibousaid" | "terracotta" | "kairouan" | "burgundy">("burgundy");
  const [sealEmblem, setSealEmblem] = useState<"tanit" | "jasmine" | "olive" | "khamsa" | "crescent" | "rose" | "yaz" | "moroccanstar" | "gazelle" | "palm">("tanit");
  const [sealBorder, setSealBorder] = useState<"roman" | "ottoman" | "medina">("roman");

  // Audio soundscape states
  const [activeSoundId, setActiveSoundId] = useState<string | null>(null);
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [soundVolume, setSoundVolume] = useState(70);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [audioInstance] = useState(() => new Audio());

  useEffect(() => {
    audioInstance.volume = soundVolume / 100;
  }, [soundVolume, audioInstance]);

  const getThemeColors = () => {
    switch (sealTheme) {
      case "sidibousaid":
        return { primary: "#007A87", secondary: "#E6F5F7", text: "#004D56", accent: "#007A87" };
      case "terracotta":
        return { primary: "#C85A32", secondary: "#F9EFEA", text: "#5E2713", accent: "#D49B2A" };
      case "kairouan":
        return { primary: "#D49B2A", secondary: "#FAF5E6", text: "#4A3409", accent: "#c1913e" };
      case "burgundy":
      default:
        return { primary: "#c1913e", secondary: "#F7E6EA", text: "#4D0013", accent: "#C39637" };
    }
  };

  const handleDownloadSeal = () => {
    const svgEl = document.getElementById("noble-family-seal");
    if (!svgEl) return;
    const svgString = new XMLSerializer().serializeToString(svgEl);
    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `roots-tunisia-seal-${sealFamilyNameEn.toLowerCase().replace(/\s+/g, "-")}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Advance playback timer
  useEffect(() => {
    let interval: any = null;
    if (isPlayingSound) {
      interval = setInterval(() => {
        setPlaybackTime((prev) => (prev >= 179 ? 0 : prev + 1));
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlayingSound]);

  const soundscapes = [
    {
      id: "malouf",
      title: t("sound_malouf_title", "Andalusian Malouf (Testour)"),
      desc: t("sound_malouf_desc", "Gentle classical lute and violin melodies echoing inside an Andalusian courtyard."),
      poetry: "« يا غصن نقا مكللا بالذهب ... أنت حبيب القلب والروح تعجب »",
      bgClass: "bg-gradient-to-br from-[#c1913e]/20 to-[#e4b75a]/10",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    },
    {
      id: "artisan",
      title: t("sound_artisan_title", "Medina Artisans (Tunis)"),
      desc: t("sound_artisan_desc", "Rhythmic hammer beats on copper and brass in the historic Tunis souks."),
      poetry: "« رنين النحاس في أزقة المدينة ... يحكي قصة أجيال وحرفة أصيلة »",
      bgClass: "bg-gradient-to-br from-[#111111]/30 to-[#c1913e]/10",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    },
    {
      id: "gnawa",
      title: t("sound_gnawa_title", "Gnawa Resonance (Essaouira)"),
      desc: t("sound_gnawa_desc", "Hypnotic guembri basslines and steel qraqeb rhythms by the Atlantic shore."),
      poetry: "« يا رمال الصويرة ناديني ... نغمة الكنبري تشفي أنيني »",
      bgClass: "bg-gradient-to-br from-[#005f73]/20 to-[#0a9396]/10",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    },
    {
      id: "tlemcen",
      title: t("sound_tlemcen_title", "Zianid Andalusi Lute (Tlemcen)"),
      desc: t("sound_tlemcen_desc", "Refined classical oud chords reminiscent of the Zianid dynastic courts."),
      poetry: "« غرناطة الغرب يا تلمسان الحبيبة ... أنغام العود تبرى جروح غريبة »",
      bgClass: "bg-gradient-to-br from-[#9b2226]/20 to-[#ae2012]/10",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    },
    {
      id: "chinguetti",
      title: t("sound_chinguetti_title", "Adrar Manuscript Whisper (Chinguetti)"),
      desc: t("sound_chinguetti_desc", "Slight desert breeze flipping century-old parchment scrolls in traditional libraries."),
      poetry: "« في شنقيط العلم والمنارة ... صفحات التاريخ تروي الحضارة »",
      bgClass: "bg-gradient-to-br from-[#e9d8a6]/20 to-[#ee9b00]/10",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    },
    {
      id: "ghadames",
      title: t("sound_ghadames_title", "Caravan Flute (Ghadamès Oasis)"),
      desc: t("sound_ghadames_desc", "Ethereal desert flute and soft drum rhythm in the white-washed streets of the pearl of the desert."),
      poetry: "« لؤلؤة الصحراء غدامس البعيدة ... نغمات الناي تبعث فينا قصيدة »",
      bgClass: "bg-gradient-to-br from-[#ca6702]/20 to-[#bb3e03]/10",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    },
    {
      id: "sahel",
      title: t("sound_sahel_title", "Sahel Sea Breeze (Monastir Ribat)"),
      desc: t("sound_sahel_desc", "Calming Mediterranean waves hitting the medieval stone walls of the Ribat."),
      poetry: "« يا بحر الساحل الغالي يا هادي الموج ... وراك حكاية الرباط وسور قرطاج »",
      bgClass: "bg-gradient-to-br from-[#007A87]/20 to-[#E6F5F7]/10",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    },
    {
      id: "sahara",
      title: t("sound_sahara_title", "Sahara Oasis Wind (Tozeur)"),
      desc: t("sound_sahara_desc", "Soft desert winds whispering through millions of dates palmeraies in the south."),
      poetry: "« رمال الصحراء الذهبية وواحات النخيل ... تهمس في الليل الطويل بحديث الجيل »",
      bgClass: "bg-gradient-to-br from-[#D49B2A]/20 to-[#FAF5E6]/10",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    }
  ];

  useEffect(() => {
    if (isPlayingSound && activeSoundId) {
      const selected = soundscapes.find(s => s.id === activeSoundId);
      if (selected) {
        if (audioInstance.src !== selected.audioUrl) {
          audioInstance.src = selected.audioUrl;
        }
        audioInstance.play().catch(err => {
          console.log("Audio playback blocked or failed:", err);
        });
      }
    } else {
      audioInstance.pause();
    }
  }, [isPlayingSound, activeSoundId, audioInstance]);

  useEffect(() => {
    const handleEnded = () => {
      setIsPlayingSound(false);
      setPlaybackTime(0);
    };
    audioInstance.addEventListener("ended", handleEnded);
    return () => {
      audioInstance.removeEventListener("ended", handleEnded);
      audioInstance.pause();
    };
  }, [audioInstance]);
  const cardBg = theme === "dark" ? "bg-[#1A1410]" : "bg-white";
  const borderColor =
    theme === "dark" ? "border-[var(--brand-gold)]/30" : "border-[var(--border-color)]";
  const metaPanel =
    theme === "dark"
      ? "bg-white/5 border-white/10"
      : "bg-[var(--brand-teal)]/5 border-[var(--border-color)]";
  const apiRoot = String(api.defaults.baseURL || "").replace(/\/api\/?$/, "");
  const downloadTreeUrl = (id: string | number) => `${apiRoot}/api/trees/${id}/gedcom`;

  const [featuredTrees, setFeaturedTrees] = useState<FeaturedTree[]>([]);
  const [treesError, setTreesError] = useState("");
  const [treesLoading, setTreesLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setTreesLoading(true);
        setTreesError("");
        const isMock = localStorage.getItem("mockupDataActive") === "true";
        if (isMock) {
          const mockTrees: FeaturedTree[] = Array.from({ length: 3 }).map((_, i) => ({
            id: `mock-tree-${i}`,
            title: `Family Tree of Clan ${i + 1}`,
            description: `Featured public tree.`,
            owner_name: "kameladmin",
            isPublic: true,
            hasGedcom: i % 2 === 0,
            archiveSource: "National Archive",
            documentCode: `ALG-${2000 + i}`,
            createdAt: new Date().toISOString(),
          }));
          if (mounted) setFeaturedTrees(mockTrees);
          return;
        }
        const { data } = await api.get("/trees");
        if (mounted && Array.isArray(data)) {
          const apiRootVal = getApiRoot();
          setFeaturedTrees(
            data.slice(0, 3).map((t) => normalizeTree(t, { apiRoot: apiRootVal, isPublic: true }))
          );
        }
      } catch (err: any) {
        if (mounted) {
          setTreesError(err?.response?.data?.message || "Failed to load featured trees");
        }
      } finally {
        if (mounted) setTreesLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleViewTree = async (tree: FeaturedTree) => {
    setViewTree(tree);
    setViewPeople([]);
    setViewTreeError("");
    setViewLoading(true);

    try {
      if (String(tree.id).startsWith("mock-")) {
        const familyName = tree.title.split(" ").pop() || "Mock";
        const mockPeople: Person[] = [
          {
            id: "m1",
            names: { en: `Ahmed ${familyName}`, ar: `أحمد ${familyName}` },
            gender: "Male",
            birthYear: "1920",
            details: "The patriarch.",
            color: "#f8f5ef",
            children: ["m3", "m4"],
            spouse: "m2",
          },
          {
            id: "m2",
            names: { en: `Fatima ${familyName}`, ar: `فاطمة ${familyName}` },
            gender: "Female",
            birthYear: "1925",
            details: "Matriarch.",
            color: "#f8f5ef",
            children: ["m3", "m4"],
            spouse: "m1",
          },
          {
            id: "m3",
            names: { en: `Omar ${familyName}`, ar: `عمر ${familyName}` },
            gender: "Male",
            birthYear: "1950",
            details: "Eldest son.",
            color: "#f8f5ef",
            father: "m1",
            mother: "m2",
            children: ["m5", "m6"],
            spouse: "s1",
          },
          {
            id: "m4",
            names: { en: `Layla ${familyName}`, ar: `ليلى ${familyName}` },
            gender: "Female",
            birthYear: "1955",
            details: "Daughter.",
            color: "#f8f5ef",
            father: "m1",
            mother: "m2",
            children: ["m7"],
            spouse: "s2",
          },
          {
            id: "s1",
            names: { en: "Amina Al-Jazairi", ar: "آمنة الجزائري" },
            gender: "Female",
            birthYear: "1952",
            details: "Wife of Omar.",
            color: "#f8f5ef",
            spouse: "m3",
            children: ["m5", "m6"],
          },
          {
            id: "s2",
            names: { en: "Youssef Al-Tunisi", ar: "يوسف التونسي" },
            gender: "Male",
            birthYear: "1950",
            details: "Husband of Layla.",
            color: "#f8f5ef",
            spouse: "m4",
            children: ["m7"],
          },
          {
            id: "m5",
            names: { en: `Khaled ${familyName}`, ar: `خالد ${familyName}` },
            gender: "Male",
            birthYear: "1980",
            details: "Grandson.",
            color: "#f8f5ef",
            father: "m3",
            mother: "s1",
          },
          {
            id: "m6",
            names: { en: `Zainab ${familyName}`, ar: `زينب ${familyName}` },
            gender: "Female",
            birthYear: "1985",
            details: "Granddaughter.",
            color: "#f8f5ef",
            father: "m3",
            mother: "s1",
          },
          {
            id: "m7",
            names: { en: `Hassan Al-Tunisi`, ar: `حسن التونسي` },
            gender: "Male",
            birthYear: "1982",
            details: "Grandson.",
            color: "#f8f5ef",
            father: "s2",
            mother: "m4",
          },
        ];
        setViewPeople(mockPeople);
        setViewLoading(false);
        return;
      }
      if (!tree.hasGedcom) {
        setViewTreeError(t("no_gedcom_available", "No GEDCOM file available yet."));
        setViewLoading(false);
        return;
      }
      const { data } = await api.get(`/trees/${tree.id}/gedcom`, {
        responseType: "text",
      });
      const raw = typeof data === "string" ? data : (data && (data as any).data != null ? String((data as any).data) : "");
      const isGedcomX = /^\s*(\{|\<\?xml)/.test(raw);
      const people = isGedcomX ? parseGedcomX(raw) : parseGedcom(raw);
      const list = Array.isArray(people) ? people : [];
      setViewPeople(list);
      if (!list.length) {
        setViewTreeError(t("gedcom_no_people", "No individuals found in GEDCOM."));
      }
    } catch (err: any) {
      setViewPeople([]);
      setViewTreeError(err?.response?.data?.message || err?.message || t("tree_builder_error", "Failed to load tree."));
    } finally {
      setViewLoading(false);
    }
  };

  return (
    <div className="heritage-page-root">
      <SEO
        title={t("home", "Home")}
        description="Roots Tunisia is the ultimate platform for Maghrebi family heritage and genealogy. Trace lineages, explore historical documents, build family trees, and view our interactive tribal map."
        keywords={["Maghreb genealogy", "Maghrebi ancestry", "Maghreb family tree", "Maghrebi history", "Ben Ayed family"]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Roots Tunisia",
          "url": "https://www.rootstunisia.com",
          "description": "Discover Maghrebi genealogy, ancestry, lineage, tribes, and family history with Roots Tunisia.",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://www.rootstunisia.com/gallery?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }}
      />
      {/* ================== HERO SECTION ================== */}
      <section className="heritage-hero">
        <div className="absolute inset-0 z-1 opacity-100 pointer-events-auto">
          <MaghrebTribesMap />
        </div>

        <div
          className="relative z-20 text-center space-y-8"
          style={{ pointerEvents: "none" }}
        >
          <h1 className="pointer-events-auto">
            {t("home_hero_title", "Discover Your Maghreb Heritage")}
          </h1>

          <p className="pointer-events-auto">
            Journey through centuries of Maghrebi lineage, culture, and
            civilization. From Carthaginian records to Ottoman registers and
            modern archives.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pointer-events-auto">
            <NavLink
                to="/gallery"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[var(--brand-gold)] to-[var(--gold-light)] text-[#FDFBF7] font-bold font-cinzel text-sm uppercase tracking-[0.2em] shadow-xl shadow-[var(--brand-gold)]/40 hover:shadow-2xl hover:shadow-[var(--brand-gold)]/50 hover:translate-y-[-2px] transition-all"
              >
                {t("start_exploring", "Start Exploring")}
              </NavLink>
              <NavLink
                to="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-[#FDFBF7] text-[#FDFBF7] font-bold font-cinzel text-sm uppercase tracking-[0.2em] hover:bg-[#FDFBF7] hover:text-[var(--brand-teal)] transition-all"
              >
              {t("join_now", "Join Now")}
            </NavLink>
          </div>
        </div>
      </section>

      {/* ================== NEW ANCESTRAL HERITAGE BANNER ================== */}
      <section
        className="heritage-banner-section mb-8 md:mb-12 lg:mb-16 w-[calc(100%-2.5rem)] max-w-[var(--content-max)] mx-auto rounded-2xl border border-[var(--brand-gold)]/30 shadow-[var(--box-shadow)] relative overflow-hidden flex items-center justify-center min-h-[160px] md:min-h-[200px] p-6 md:p-14"
        data-aos="fade-up"
        style={{
          backgroundImage: `url('/newSectionBackground.jpeg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-[#14312d]/75 backdrop-blur-[1px]" />
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <span className="inline-block text-[10px] uppercase tracking-[0.35em] text-[var(--brand-gold)] font-semibold mb-3">
            {t("roots_maghreb_label", "Roots Tunisia")}
          </span>
          <h3 className="text-2xl md:text-4xl font-bold font-cinzel text-white drop-shadow-md mb-3">
            {t("preserve_lineage_title", "Preserve Your Family Lineage")}
          </h3>
          <p className="text-sm md:text-base font-medium text-white/80 max-w-2xl mx-auto drop-shadow-sm">
            {t("preserve_lineage_desc", "Connect with your roots, explore historical records, and build a lasting digital legacy for future generations.")}
          </p>
        </div>
      </section>

      {/* ================== STATS STRIP ================== */}
      <section className="roots-section mb-8 md:mb-12 lg:mb-16">
        <div className="w-full max-w-7xl 2xl:max-w-[1600px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { value: "10,000+", label: t("trees", "Family Trees"), accent: "var(--brand-gold)" },
              { value: "50,000+", label: t("users", "Users"), accent: "var(--teal-light)" },
              { value: "1M+", label: t("records", "Records"), accent: "var(--brand-gold)" },
              { value: "500+", label: t("archives", "Archives"), accent: "var(--teal-light)" },
            ].map((stat, i) => (
              <div
                key={i}
                className="stat-card interactive-card text-center p-6 rounded-xl border border-[var(--border-color)] bg-[var(--paper-color)]"
                data-aos="fade-up"
                data-aos-delay={i * 100}
              >
                <h4 className="text-3xl md:text-4xl font-bold font-cinzel" style={{ color: stat.accent }}>
                  {stat.value}
                </h4>
                <p className="label text-sm uppercase tracking-[0.2em] mt-1 opacity-70" style={{ color: "var(--color-secondary)" }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================== FAMILY TREE SECTION ================== */}
      <section className="roots-section roots-section-alt mb-8 md:mb-12 lg:mb-16">
        <div className="w-full max-w-7xl 2xl:max-w-[1600px] mx-auto space-y-6 md:space-y-10 px-2 sm:px-0">
          <div className="text-center">
            <h2 className="roots-heading">
              {t("family_tree_builder", "Family Tree Builder")}
            </h2>
            <p className="max-w-3xl mx-auto text-base sm:text-lg opacity-90 px-2 sm:px-0">
              Visualize your ancestry with a detailed interactive tree. Add
              generations, connect relatives, store historical documents, dates,
              photos and oral stories. Our builder supports Maghrebi naming
              conventions: Amazigh, Ottoman, Arabic, and modern naming formats.
            </p>
          </div>

          {/* Featured Trees - Loading / Error */}
          {treesLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 xl:gap-8">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`${cardBg} border ${borderColor} rounded-2xl shadow-xl overflow-hidden animate-pulse`}
                >
                  <div className="p-5 border-b border-white/5 space-y-3">
                    <div className="h-3 w-1/3 bg-primary-brown/20 rounded" />
                    <div className="h-6 w-2/3 bg-primary-brown/30 rounded" />
                    <div className="h-3 w-1/4 bg-primary-brown/20 rounded" />
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="h-4 w-full bg-primary-brown/10 rounded" />
                    <div className="h-4 w-3/4 bg-primary-brown/10 rounded" />
                    <div className="flex gap-2 mt-6">
                      <div className="h-10 w-24 bg-primary-brown/20 rounded-md" />
                      <div className="h-10 w-32 bg-primary-brown/30 rounded-md" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {treesError && !treesLoading && (
            <div className="text-center py-8 text-amber-600 dark:text-amber-400 font-medium">
              {treesError}
            </div>
          )}
          {/* Featured Trees Grid - responsive gaps for all viewports */}
          {featuredTrees.length > 0 && !treesLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 xl:gap-8">
              {featuredTrees.map((tree) => {
                const canDownload =
                  Number.isFinite(Number(tree.id)) && tree.hasGedcom;
                return (
                  <div
                    key={tree.id}
                    className={`interactive-card ${cardBg} border ${borderColor} rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-accent-gold/40`}
                    data-aos="fade-up"
                  >
                    <div className="p-4 sm:p-5 border-b border-white/5 bg-gradient-to-r from-primary-brown/10 to-transparent">
                      <div className="flex items-start justify-between gap-3 sm:gap-4">
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] uppercase tracking-[0.3em] text-primary-brown opacity-70">
                            {t("trees", "Family Trees")}
                          </p>
                          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold truncate">
                            {tree.title}
                          </h3>
                          <p className="text-sm opacity-70 flex items-center gap-1">
                            <UserCircle2 className="w-3 h-3" />
                            {tree.owner || tree.owner_name || "Admin"}
                          </p>
                        </div>
                        <span
                          className={`text-[10px] uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${borderColor}`}
                        >
                          {tree.isPublic
                            ? t("public", "Public")
                            : t("private", "Private")}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 sm:p-5 space-y-3 sm:space-y-4">
                      <p className="text-sm opacity-80 line-clamp-3">
                        {tree.description ||
                          "Discover this public family lineage."}
                      </p>

                      <div className="grid sm:grid-cols-2 gap-3">
                        <div
                          className={`${metaPanel} border rounded-xl p-3 flex items-start gap-2`}
                        >
                          <Archive className="w-4 h-4 text-accent-gold mt-0.5" />
                          <div>
                            <p className="text-[10px] uppercase opacity-60">
                              {t("archive_source", "Archive Source")}
                            </p>
                            <p className="text-xs font-semibold break-words">
                              {tree.archiveSource ||
                                t("not_provided", "Not provided")}
                            </p>
                          </div>
                        </div>
                        <div
                          className={`${metaPanel} border rounded-xl p-3 flex items-start gap-2`}
                        >
                          <FileText className="w-4 h-4 text-accent-gold mt-0.5" />
                          <div>
                            <p className="text-[10px] uppercase opacity-60">
                              {t("document_code", "Document Code")}
                            </p>
                            <p className="text-xs font-semibold font-mono break-words">
                              {tree.documentCode ||
                                t("not_provided", "Not provided")}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="text-xs opacity-70 flex items-center gap-2 flex-wrap">
                        <Users className="w-4 h-4" />
                        {tree.hasGedcom
                          ? t("has_file", "Has file")
                          : t("no_file", "No file")}
                        {tree.hasGedcom && tree.data_format === "gedcomx" ? (
                          <span className="px-2 py-0.5 rounded bg-[var(--brand-teal)]/20 text-[var(--brand-teal)] font-medium">
                            {t("saved_with_gedcomx", "Saved with GEDCOM X")}
                          </span>
                        ) : null}
                        {tree.hasGedcom && tree.data_format === "gedcom7" ? (
                          <span className="px-2 py-0.5 rounded bg-[var(--brand-teal)]/20 text-[var(--brand-teal)] font-medium">
                            {t("saved_with_gedcom7", "Saved with GEDCOM 7.0")}
                          </span>
                        ) : null}
                        {tree.hasGedcom && tree.data_format !== "gedcomx" && tree.data_format !== "gedcom7" ? (
                          <span className="px-2 py-0.5 rounded bg-[var(--brand-teal)]/10 text-[var(--brand-teal)]/80 font-medium">
                            {t("saved_with_gedcom551", "Saved with GEDCOM 5.5.1")}
                          </span>
                        ) : null}
                      </div>

                      <div className="flex flex-col sm:flex-row flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleViewTree(tree)}
                          className={`interactive-btn px-4 py-2.5 rounded-md border ${borderColor} hover:opacity-90 inline-flex items-center justify-center gap-2 text-sm sm:text-base`}
                        >
                          <Eye className="w-4 h-4 shrink-0" />
                          {t("view_tree", "View Tree")}
                        </button>
                        {canDownload ? (
                          <a
                            href={downloadTreeUrl(tree.id)}
                            className="interactive-btn px-4 py-2.5 rounded-md text-white font-medium bg-gradient-to-r from-primary-brown to-accent-gold hover:opacity-90 transition inline-flex items-center justify-center gap-2 text-sm sm:text-base"
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Download className="w-4 h-4 shrink-0" />
                            {tree.data_format === "gedcomx"
                              ? t("download_gedcomx", "Download GEDCOM X")
                              : tree.data_format === "gedcom7"
                                ? t("download_gedcom7", "Download GEDCOM 7.0")
                                : t("download_gedcom551", "Download GEDCOM 5.5.1")}
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Feature grid */}
          <div className="roots-grid grid-cols-1 md:grid-cols-3">
            {[
              {
                icon: Users,
                title: "Build Multi-Generational Trees",
                desc: "Connect parents, grandparents, historical ancestors & extended families.",
              },
              {
                icon: Scroll,
                title: "Attach Historical Documents",
                desc: "Upload birth records, marriage papers, ANOM archives, manuscripts & more.",
              },
              {
                icon: Compass,
                title: "Trace Migration Paths",
                desc: "Discover how your lineage moved across the Maghreb: Carthage, Kairouan, Fez, Algiers, Marrakech, Tunis, Tripoli, the Steppes...",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="roots-card interactive-card text-center"
                data-aos="zoom-up"
              >
                <item.icon className="w-12 h-12 mx-auto mb-4 text-primary-brown" />
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="opacity-90">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <NavLink to="/library" className="roots-cta">
              {t("see_more", "See more")}
            </NavLink>
          </div>
        </div>
      </section>

      {/* ================== ANCESTRAL STORIES ================== */}
      <section className="roots-section mb-16">
        <div className="max-w-6xl mx-auto space-y-10 text-center">
          <div>
            <h2 className="roots-heading">
              {t("ancestral_stories", "Ancestral Stories")}
            </h2>
            <p className="max-w-3xl mx-auto text-lg opacity-90">
              Every Maghrebi family carries oral histories, legendary figures,
              migrations and struggles. Preserve your family's unique story
              through structured narrative timelines, memories, recorded
              interviews, and ancestral photo restoration.
            </p>
          </div>

          <div className="roots-grid grid-cols-1 md:grid-cols-3">
            {[
              {
                icon: Feather,
                title: "Record Oral Histories",
                desc: "Interview elders and preserve memories, sayings, poetry & Maghrebi Amazigh traditions.",
              },
              {
                icon: BookOpen,
                title: "Document Family Traditions",
                desc: "Tell the story behind your family's customs, crafts, cuisine, and celebrations.",
              },
              {
                icon: Users,
                title: "Reconstruct Lost Branches",
                desc: "Use Ottoman beylik registers, French Protectorate archives, and tribal memory to rebuild lost links.",
              },
            ].map((item, i) => (
              <div key={i} className="roots-card" data-aos="zoom-in">
                <item.icon className="w-12 h-12 mx-auto mb-4 text-accent-gold" />
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="opacity-90">{item.desc}</p>
              </div>
            ))}
          </div>

          <NavLink to="/library" className="roots-cta">
            {t("see_more", "See more")}
          </NavLink>
        </div>
      </section>

      {/* ================== LIBRARY ================== */}
      <section className="roots-section roots-section-alt mb-16">
        <div
          className="max-w-6xl mx-auto space-y-10 text-center"
          data-aos="fade-up"
        >
          <div>
            <h2 className="roots-heading">
              {t("library_title", "Maghreb Genealogy Library")}
            </h2>
            <p className="max-w-3xl mx-auto text-lg opacity-90">
              Access a curated library of Maghrebi historical books, manuscripts,
              genealogical rolls, colonial civil records, Ottoman diwans, tribal
              documents, and regional archives from across the Maghreb.
            </p>
          </div>

          <div className="roots-grid grid-cols-1 md:grid-cols-3">
            {[
              "Manuscripts & Family Records",
              "Archives Nationales de Tunisie & Maroc",
              "Tribal Genealogy Books (Nasab)",
              "Qadi Court Records of Tunis & Algiers",
              "Maghrebi Oral Heritage Collections",
              "Maghrebi Migration Maps",
            ].map((item, i) => (
              <div
                key={i}
                className="roots-card flex items-center justify-center p-6"
                data-aos="fade-up"
              >
                <p className="font-bold text-lg">{item}</p>
              </div>
            ))}
          </div>

          <NavLink to="/library" className="roots-cta">
            {t("see_more", "See more")}
          </NavLink>
        </div>
      </section>

      {/* ================== ARCHIVES AND SOURCES ================== */}
      <section className="roots-section mb-16">
        <div
          className="max-w-6xl mx-auto space-y-10 text-center"
          data-aos="fade-up"
        >
          <div>
            <h2 className="roots-heading">
              {t("archives_and_sources", "Archives and Sources")}
            </h2>
            <p className="max-w-3xl mx-auto text-lg opacity-90">
              Explore the key historical sources used by Maghrebi genealogists:
              national and regional archives, Ottoman beylik registers, Qadi justice
              books, Habous property registries, colonial civil archives, and census records.
            </p>
          </div>

          <div className="roots-grid grid-cols-1 md:grid-cols-3">
            {[
              "Archives Nationales de Tunisie & Maroc",
              "Qadi Court Records of Tunis & Algiers",
              "Habous Property Registries",
              "Colonial Civil Archives (ANOM)",
              "Ottoman Beylik Registers",
              "Tribal Nasab Documents",
              "Ben Ayed Family Archives (Djerba)",
            ].map((item, i) => (
              <div
                key={i}
                className="roots-card flex items-center justify-center p-6"
                data-aos="flip-up"
              >
                <p className="font-semibold">{item}</p>
              </div>
            ))}
          </div>

          <NavLink to="/archives" className="roots-cta">
            {t("see_more", "See more")}
          </NavLink>
        </div>
      </section>

      {/* TREE VIEWER MODAL — fixed smaller size, click-outside to close, PersonLinksPanel sidebar */}
      {viewTree && (
        <div
          className="roots-modal-layer"
          onClick={() => { setViewTree(null); setSelectedPerson(null); }}
        >
          <div
            ref={modalRef}
            className={`${cardBg} roots-modal roots-tree-modal w-full rounded-2xl shadow-2xl border ${borderColor} flex flex-col overflow-hidden relative`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="roots-tree-modal-header px-5 py-3 border-b border-[var(--brand-gold)]/30 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2 text-[var(--brand-teal)] dark:text-[var(--gold-light)] font-cinzel">
                  <Users className="w-4 h-4" />
                  {viewTree.title}
                </h2>
                <p className="text-[11px] opacity-50">{t("view_tree_read_only", "Viewing Mode — Read Only. Click a person for sources.")}</p>
              </div>
              <button
                onClick={() => { setViewTree(null); setSelectedPerson(null); }}
                className="p-2 rounded-full bg-black/5 hover:bg-[var(--brand-gold)]/10 border border-[var(--border-color)] transition-colors shrink-0 ml-3"
                aria-label={t("close", "Close")}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body: tree canvas + optional person links sidebar */}
            <div className="flex-1 flex overflow-hidden">
              {/* Canvas */}
              <div className="roots-tree-modal-canvas flex-1 relative overflow-hidden">
                {viewLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--brand-gold)]"></div>
                  </div>
                ) : viewTreeError ? (
                  <div className="absolute inset-0 flex items-center justify-center p-6">
                    <div className="rounded-xl border border-[var(--border-color)] bg-white/90 dark:bg-[var(--bg-dark)] px-6 py-5 text-sm text-[var(--brand-teal)] dark:text-[var(--gold-light)] shadow-xl text-center max-w-md">
                      <div className="font-semibold">{t("tree_builder_error", "Tree builder failed to load.")}</div>
                      <p className="mt-2 opacity-80">{viewTreeError}</p>
                    </div>
                  </div>
                ) : (
                  <ErrorBoundary
                    fallback={({ error, reset }) => (
                      <div className="absolute inset-0 flex items-center justify-center p-6">
                        <div className="rounded-xl border border-[var(--border-color)] bg-white/90 dark:bg-[var(--bg-dark)] px-6 py-5 text-sm text-primary-brown shadow-xl">
                          <div className="font-semibold">{t("tree_builder_error", "Tree builder failed to load.")}</div>
                          <div className="opacity-70">{error?.message || t("tree_builder_try_again", "Please try again.")}</div>
                          <button type="button" onClick={reset} className="mt-3 inline-flex items-center rounded-md border border-[var(--border-color)] px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                            {t("retry", "Retry")}
                          </button>
                        </div>
                      </div>
                    )}
                  >
                    <TreesBuilder
                      people={viewPeople}
                      setPeople={setViewPeople}
                      readOnly={true}
                      onPersonClick={(person: any) => {
                        setSelectedPerson(person);
                      }}
                    />
                  </ErrorBoundary>
                )}
              </div>

              {/* Person Links Sidebar */}
              {selectedPerson && (
                <div
                  className={`w-72 shrink-0 border-l ${borderColor} bg-[var(--paper-color)] dark:bg-[var(--bg-dark)] flex flex-col overflow-hidden`}
                  style={{ animation: 'slideInRight 0.25s ease' }}
                >
                  <PersonLinksPanel
                    personId={selectedPerson.id}
                  personName={selectedPerson.names?.en || selectedPerson.name || 'Unknown'}
                    isPublicTree={viewTree.isPublic}
                    isAuthenticated={false}
                  treeSourceLinks={Array.isArray(selectedPerson.sourceLinks) ? selectedPerson.sourceLinks : []}
                  onClose={() => setSelectedPerson(null)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================== VISUAL HERITAGE GALLERY ================== */}
      <LocalHeritageGallery />

      {/* ================== VISUAL HERITAGE HUB (TUNISIAN HERITAGE & IDENTITY LAB) ================== */}
      {false && <section className="roots-section mb-16">
        <div className="max-w-7xl mx-auto space-y-10 px-4" data-aos="fade-up">
          <div className="text-center space-y-3">
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#C39637] font-semibold">
              {t("heritage_lab_subtitle", "Visual & Sensory Heritage Playground")}
            </span>
            <h2 className="text-3xl md:text-5xl font-cinzel font-bold text-[var(--text-color)]">
              {t("heritage_lab_title", "Maghreb Heritage & Identity Lab")}
            </h2>
            <p className="max-w-3xl mx-auto text-base opacity-75">
              {t("heritage_lab_desc", "Experiment with traditional emblems to generate your family crest, or listen to the ambient acoustic soundscapes of historical Maghreb cities.")}
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => {
                setActiveLabTab("seal");
                setIsPlayingSound(false);
              }}
              className={`px-6 py-3 rounded-full font-cinzel text-sm uppercase tracking-wider transition-all border duration-300 ${
                activeLabTab === "seal"
                  ? "bg-[#c1913e] text-white border-[#c1913e] shadow-lg shadow-[#c1913e]/20"
                  : "bg-transparent text-[var(--text-color)] border-[var(--border-color)] hover:bg-[#c1913e]/5"
              }`}
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                {t("noble_seal_creator", "Noble Seal Creator")}
              </span>
            </button>
            <button
              onClick={() => setActiveLabTab("voices")}
              className={`px-6 py-3 rounded-full font-cinzel text-sm uppercase tracking-wider transition-all border duration-300 ${
                activeLabTab === "voices"
                  ? "bg-[#c1913e] text-white border-[#c1913e] shadow-lg shadow-[#c1913e]/20"
                  : "bg-transparent text-[var(--text-color)] border-[var(--border-color)] hover:bg-[#c1913e]/5"
              }`}
            >
              <span className="flex items-center gap-2">
                <Music className="w-4 h-4" />
                {t("voices_of_medina", "Voices of the Medina")}
              </span>
            </button>
            <button
              onClick={() => {
                setActiveLabTab("lineages");
                setIsPlayingSound(false);
              }}
              className={`px-6 py-3 rounded-full font-cinzel text-sm uppercase tracking-wider transition-all border duration-300 ${
                activeLabTab === "lineages"
                  ? "bg-[#c1913e] text-white border-[#c1913e] shadow-lg shadow-[#c1913e]/20"
                  : "bg-transparent text-[var(--text-color)] border-[var(--border-color)] hover:bg-[#c1913e]/5"
              }`}
            >
              <span className="flex items-center gap-2">
                <Scroll className="w-4 h-4" />
                {t("noble_lineages", "Noble Lineages & Epochs")}
              </span>
            </button>
          </div>

          <div className="mt-8">
            {/* TAB 1: NOBLE SEAL CREATOR */}
            {activeLabTab === "seal" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
                {/* Left: SVG Showcase */}
                <div className="lg:col-span-5 flex flex-col items-center space-y-6">
                  <div className="relative w-full aspect-square max-w-[380px] bg-[#1A1410] border border-[#C39637]/40 rounded-2xl p-4 flex items-center justify-center shadow-2xl overflow-hidden group">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(195,150,55,0.08),transparent_70%)] pointer-events-none" />
                    
                    {/* Real Live-rendered SVG Seal */}
                    <svg
                      id="noble-family-seal"
                      viewBox="0 0 400 400"
                      className="w-full h-full drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)]"
                    >
                      <defs>
                        <path id="curve-top" d="M 85,200 A 115,115 0 0,1 315,200" fill="none" />
                        <path id="curve-bottom" d="M 315,200 A 115,115 0 0,1 85,200" fill="none" />
                      </defs>
                      
                      {/* Background canvas circle */}
                      <circle cx="200" cy="200" r="192" fill="#FAF7F2" stroke={getThemeColors().primary} strokeWidth="1.5" />
                      <circle cx="200" cy="200" r="188" fill="none" stroke={getThemeColors().accent} strokeWidth="1" strokeDasharray="4 2" />

                      {/* Frame Border Selectors */}
                      {sealBorder === "roman" && (
                        <>
                          <circle cx="200" cy="200" r="174" fill="none" stroke={getThemeColors().primary} strokeWidth="4.5" strokeDasharray="1 6" strokeLinecap="round" />
                          <circle cx="200" cy="200" r="181" fill="none" stroke={getThemeColors().accent} strokeWidth="1.5" />
                          <circle cx="200" cy="200" r="166" fill="none" stroke={getThemeColors().accent} strokeWidth="1.5" />
                        </>
                      )}

                      {sealBorder === "ottoman" && (
                        <>
                          <path d="M 200,15 L 235,50 L 285,50 L 305,85 L 350,105 L 350,155 L 385,200 L 350,245 L 350,295 L 305,315 L 285,350 L 235,350 L 200,385 L 165,350 L 115,350 L 95,315 L 50,295 L 50,245 L 15,200 L 50,155 L 50,105 L 95,85 L 115,50 L 165,50 Z" fill="none" stroke={getThemeColors().primary} strokeWidth="3" />
                          <circle cx="200" cy="200" r="148" fill="none" stroke={getThemeColors().accent} strokeWidth="2" />
                        </>
                      )}

                      {sealBorder === "medina" && (
                        <>
                          <g stroke={getThemeColors().primary} strokeWidth="3" fill="none">
                            <rect x="52" y="52" width="296" height="296" rx="15" />
                            <rect x="52" y="52" width="296" height="296" rx="15" transform="rotate(45 200 200)" />
                          </g>
                          <circle cx="200" cy="200" r="144" fill="none" stroke={getThemeColors().accent} strokeWidth="1.5" />
                        </>
                      )}

                      {/* Emblem Icons */}
                      {sealEmblem === "tanit" && (
                        <g id="emblem-tanit-group">
                          <path d="M200,140 L235,210 L165,210 Z" fill={getThemeColors().primary} />
                          <line x1="145" y1="165" x2="255" y2="165" stroke={getThemeColors().primary} strokeWidth="8" strokeLinecap="round" />
                          <circle cx="200" cy="142" r="16" fill={getThemeColors().primary} />
                          <circle cx="200" cy="142" r="10" fill={getThemeColors().accent} />
                        </g>
                      )}

                      {sealEmblem === "jasmine" && (
                        <g id="emblem-jasmine-group" fill={getThemeColors().primary}>
                          <path d="M200,200 C200,175 192,155 200,145 C208,155 200,175 200,200 Z" />
                          <path d="M200,200 C220,183 238,183 246,191 C238,199 220,191 200,200 Z" />
                          <path d="M200,200 C212,220 208,238 200,246 C192,238 188,220 200,200 Z" />
                          <path d="M200,200 C188,220 170,220 162,212 C170,204 188,208 200,200 Z" />
                          <path d="M200,200 C180,183 172,165 180,157 C188,165 188,183 200,200 Z" />
                          <circle cx="200" cy="200" r="8" fill={getThemeColors().accent} />
                        </g>
                      )}

                      {sealEmblem === "olive" && (
                        <g id="emblem-olive-group">
                          <path d="M165,225 C145,190 155,145 200,135" fill="none" stroke={getThemeColors().primary} strokeWidth="3" strokeLinecap="round" />
                          <path d="M235,225 C255,190 245,145 200,135" fill="none" stroke={getThemeColors().primary} strokeWidth="3" strokeLinecap="round" />
                          <path d="M152,190 C140,180 145,170 157,175 C169,180 164,190 152,190 Z" fill={getThemeColors().accent} />
                          <path d="M165,160 C155,150 160,140 172,145 C184,150 179,160 165,160 Z" fill={getThemeColors().accent} />
                          <path d="M248,190 C260,180 255,170 243,175 C231,180 236,190 248,190 Z" fill={getThemeColors().accent} />
                          <path d="M235,160 C245,150 240,140 228,145 C216,150 221,160 235,160 Z" fill={getThemeColors().accent} />
                          <circle cx="178" cy="180" r="6" fill={getThemeColors().primary} />
                          <circle cx="222" cy="180" r="6" fill={getThemeColors().primary} />
                        </g>
                      )}

                      {sealEmblem === "khamsa" && (
                        <g id="emblem-khamsa-group">
                          <path d="M200,130 C208,130 213,135 213,145 L213,195 C213,197 215,199 217,198 C222,196 226,187 226,178 L226,170 C226,165 232,165 235,170 C238,175 236,187 231,202 C226,215 215,225 200,225 C185,225 174,215 169,202 C164,187 162,175 165,170 C168,165 174,165 174,170 L174,178 C174,187 178,196 183,198 C185,199 187,197 187,195 L187,145 C187,135 192,130 200,130 Z" fill={getThemeColors().primary} />
                          <circle cx="200" cy="198" r="9" fill="none" stroke={getThemeColors().accent} strokeWidth="2.5" />
                          <circle cx="200" cy="198" r="4" fill={getThemeColors().accent} />
                        </g>
                      )}

                      {sealEmblem === "crescent" && (
                        <g id="emblem-crescent-group">
                          <path d="M225,165 C190,165 165,190 165,220 C165,250 190,275 225,275 C200,265 188,245 188,220 C188,195 200,175 225,165 Z" fill={getThemeColors().primary} />
                          <polygon points="212,207 216,217 226,217 218,223 221,233 212,227 203,233 206,223 198,217 208,217" fill={getThemeColors().accent} />
                        </g>
                      )}

                      {sealEmblem === "rose" && (
                        <g id="emblem-rose-group">
                          <rect x="160" y="160" width="80" height="80" rx="3" fill="none" stroke={getThemeColors().primary} strokeWidth="3" transform="rotate(0 200 200)" />
                          <rect x="160" y="160" width="80" height="80" rx="3" fill="none" stroke={getThemeColors().primary} strokeWidth="3" transform="rotate(45 200 200)" />
                          <circle cx="200" cy="200" r="24" fill={getThemeColors().secondary} stroke={getThemeColors().primary} strokeWidth="2" />
                          <circle cx="200" cy="200" r="10" fill={getThemeColors().accent} />
                          <circle cx="200" cy="200" r="4" fill={getThemeColors().primary} />
                        </g>
                      )}

                      {sealEmblem === "yaz" && (
                        <g id="emblem-yaz-group">
                          <path d="M170,140 C170,140 185,155 185,175 L185,225 C185,245 170,260 170,260 M230,140 C230,140 215,155 215,175 L215,225 C215,245 230,260 230,260 M170,200 L230,200" fill="none" stroke={getThemeColors().primary} strokeWidth="12" strokeLinecap="round" />
                          <circle cx="200" cy="200" r="14" fill={getThemeColors().accent} />
                        </g>
                      )}

                      {sealEmblem === "moroccanstar" && (
                        <g id="emblem-moroccanstar-group">
                          <path d="M200,125 L218,178 L274,178 L228,212 L246,265 L200,232 L154,265 L172,212 L126,178 L182,178 Z" fill="none" stroke={getThemeColors().primary} strokeWidth="6" strokeLinejoin="round" />
                          <circle cx="200" cy="200" r="12" fill={getThemeColors().accent} />
                        </g>
                      )}

                      {sealEmblem === "gazelle" && (
                        <g id="emblem-gazelle-group">
                          <path d="M190,240 C190,200 170,170 170,140 C185,170 195,190 200,210 C205,190 215,170 230,140 C230,170 210,200 210,240" fill="none" stroke={getThemeColors().primary} strokeWidth="5" strokeLinecap="round" />
                          <path d="M185,220 Q200,210 215,220" fill="none" stroke={getThemeColors().accent} strokeWidth="4" />
                          <circle cx="200" cy="235" r="7" fill={getThemeColors().accent} />
                        </g>
                      )}

                      {sealEmblem === "palm" && (
                        <g id="emblem-palm-group">
                          <path d="M200,245 L200,180" stroke={getThemeColors().primary} strokeWidth="8" strokeLinecap="round" />
                          <path d="M200,180 C180,170 155,175 145,195 M200,180 C220,170 245,175 255,195 M200,170 C175,160 160,145 155,125 M200,170 C225,160 240,145 245,125 M200,160 Q200,120 185,105 M200,160 Q200,120 215,105" fill="none" stroke={getThemeColors().accent} strokeWidth="4.5" strokeLinecap="round" />
                        </g>
                      )}

                      {/* Engraved curved family names */}
                      <text font-family="'Cinzel', 'Georgia', serif" font-size="14px" font-weight="700" letter-spacing="3.5px" fill={getThemeColors().text} text-anchor="middle">
                        <textPath href="#curve-top" startOffset="50%">
                          {sealFamilyNameEn.toUpperCase()}
                        </textPath>
                      </text>
                      <text font-family="'Amiri', 'Cairo', serif" font-size="18px" font-weight="700" fill={getThemeColors().text} text-anchor="middle">
                        <textPath href="#curve-bottom" startOffset="50%">
                          {sealFamilyNameAr}
                        </textPath>
                      </text>
                    </svg>
                  </div>

                  <div className="flex gap-4 w-full max-w-[380px]">
                    <button
                      onClick={handleDownloadSeal}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-[#C39637] text-[#C39637] font-cinzel font-bold text-xs uppercase hover:bg-[#C39637] hover:text-white transition-all shadow-md cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      {t("download_seal", "Download Noble Seal (SVG)")}
                    </button>
                  </div>
                </div>

                {/* Right: Customization Controls */}
                <div className={`lg:col-span-7 border ${borderColor} rounded-2xl p-6 ${cardBg} space-y-6 shadow-xl`}>
                  <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
                    <Sliders className="w-5 h-5 text-[#c1913e]" />
                    <h3 className="text-xl font-cinzel font-bold text-[var(--text-color)]">
                      {t("seal_customization", "Seal Customization")}
                    </h3>
                  </div>

                  {/* Name Inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider opacity-70">
                        {t("seal_family_name_en", "Family Name (Latin Script)")}
                      </label>
                      <input
                        type="text"
                        value={sealFamilyNameEn}
                        onChange={(e) => setSealFamilyNameEn(e.target.value.slice(0, 30))}
                        className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-transparent text-[var(--text-color)] focus:border-[#c1913e] focus:ring-1 focus:ring-[#c1913e] outline-none text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider opacity-70">
                        {t("seal_family_name_ar", "Family Name (Arabic Script)")}
                      </label>
                      <input
                        type="text"
                        value={sealFamilyNameAr}
                        onChange={(e) => setSealFamilyNameAr(e.target.value.slice(0, 30))}
                        dir="rtl"
                        className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-transparent text-[var(--text-color)] focus:border-[#c1913e] focus:ring-1 focus:ring-[#c1913e] outline-none text-base"
                      />
                    </div>
                  </div>

                  {/* Themes */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider opacity-70 block">
                      {t("seal_theme", "Emblem Theme Color")}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { id: "burgundy", name: t("theme_burgundy", "Medina Burgundy"), color: "bg-[#c1913e]" },
                        { id: "sidibousaid", name: t("theme_sidibousaid", "Sidi Bou Said Teal"), color: "bg-[#007A87]" },
                        { id: "terracotta", name: t("theme_terracotta", "Terracotta Red"), color: "bg-[#C85A32]" },
                        { id: "kairouan", name: t("theme_kairouan", "Kairouan Amber"), color: "bg-[#D49B2A]" }
                      ].map((themeOpt) => (
                        <button
                          key={themeOpt.id}
                          onClick={() => setSealTheme(themeOpt.id as any)}
                          className={`p-3 rounded-xl border text-left flex items-center gap-2 hover:border-[#c1913e] transition-all text-xs font-semibold cursor-pointer ${
                            sealTheme === themeOpt.id ? "border-[#c1913e] bg-[#c1913e]/5 text-[#c1913e]" : "border-[var(--border-color)]"
                          }`}
                        >
                          <span className={`w-3.5 h-3.5 rounded-full ${themeOpt.color} shrink-0`} />
                          <span className="truncate">{themeOpt.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Emblems */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider opacity-70 block">
                      {t("seal_emblem", "Heritage Emblem Symbol")}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        { id: "tanit", name: t("emblem_tanit", "Tanit Carthage") },
                        { id: "jasmine", name: t("emblem_jasmine", "Jasmine Blossom") },
                        { id: "yaz", name: t("emblem_yaz", "Amazigh Yaz (ⵣ)") },
                        { id: "moroccanstar", name: t("emblem_moroccanstar", "Moroccan Star") },
                        { id: "gazelle", name: t("emblem_gazelle", "Algerian Gazelle") },
                        { id: "palm", name: t("emblem_palm", "Desert Palm") },
                        { id: "olive", name: t("emblem_olive", "Olive Branch") },
                        { id: "khamsa", name: t("emblem_khamsa", "Khamsa Hand") },
                        { id: "crescent", name: t("emblem_crescent", "Beylical Crescent") },
                        { id: "rose", name: t("emblem_rose", "Andalusian Rose") }
                      ].map((emblemOpt) => (
                        <button
                          key={emblemOpt.id}
                          onClick={() => setSealEmblem(emblemOpt.id as any)}
                          className={`p-3 rounded-xl border text-center font-cinzel text-xs uppercase tracking-wider hover:border-[#c1913e] transition-all cursor-pointer ${
                            sealEmblem === emblemOpt.id ? "border-[#c1913e] bg-[#c1913e]/5 font-bold text-[#c1913e]" : "border-[var(--border-color)]"
                          }`}
                        >
                          {emblemOpt.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Borders */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider opacity-70 block">
                      {t("seal_border", "Frame Border Pattern")}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: "roman", name: t("border_roman", "Roman Dot Mosaic") },
                        { id: "ottoman", name: t("border_ottoman", "Ottoman Arabesque") },
                        { id: "medina", name: t("border_medina", "Medina Tile") }
                      ].map((borderOpt) => (
                        <button
                          key={borderOpt.id}
                          onClick={() => setSealBorder(borderOpt.id as any)}
                          className={`p-3 rounded-xl border text-center font-cinzel text-xs uppercase tracking-wider hover:border-[#c1913e] transition-all cursor-pointer ${
                            sealBorder === borderOpt.id ? "border-[#c1913e] bg-[#c1913e]/5 font-bold text-[#c1913e]" : "border-[var(--border-color)]"
                          }`}
                        >
                          {borderOpt.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-[var(--border-color)] pt-4 flex justify-end">
                    <NavLink
                      to="/signup"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#c1913e] text-white font-cinzel text-xs uppercase font-bold tracking-wider hover:scale-105 transition-all shadow-md shadow-[#c1913e]/25"
                    >
                      {t("seal_register_cta", "Claim Ancestry & Register Crest →")}
                    </NavLink>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: VOICES OF THE MEDINA SOUNDSCAPE */}
            {activeLabTab === "voices" && (
              <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
                <style>{`
                  @keyframes pulse-bar {
                    0% { height: 15%; }
                    100% { height: 100%; }
                  }
                `}</style>
                
                <div className="text-center space-y-2">
                  <p className="text-sm opacity-80 max-w-xl mx-auto">
                    {t("medina_soundscape_intro", "Immerse yourself in the acoustic spirit of Maghrebi heritage spaces. Choose a local ambient soundscape below.")}
                  </p>
                </div>

                {/* Tape-Deck / Audio visualizer box */}
                <div className="border border-[#C39637]/30 bg-[#1A1410] rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center gap-8">
                  {/* Gold abstract gradient background */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(195,150,55,0.08),transparent_50%)] pointer-events-none" />

                  {/* Left: spinning tape reel graphic */}
                  <div className="w-36 h-36 rounded-2xl bg-black/40 border border-[var(--border-color)] flex items-center justify-center relative shrink-0">
                    <div className={`w-28 h-28 rounded-full border-4 border-[#C39637]/20 border-t-[#C39637] flex items-center justify-center ${isPlayingSound ? "animate-spin" : ""}`} style={{ animationDuration: "10s" }}>
                      <div className="w-16 h-16 rounded-full bg-black/60 flex items-center justify-center">
                        <Music className={`w-6 h-6 text-[#C39637] ${isPlayingSound ? "animate-pulse" : ""}`} />
                      </div>
                    </div>
                  </div>

                  {/* Right: Controls & Details */}
                  <div className="flex-1 space-y-5 w-full text-center md:text-left">
                    {activeSoundId ? (
                      (() => {
                        const activeSound = soundscapes.find(s => s.id === activeSoundId);
                        return (
                          <div className="space-y-3">
                            <span className="text-[10px] uppercase tracking-widest text-[#C39637] font-bold">
                              {t("medina_sound_playing", "Medina Soundscape")}
                            </span>
                            <h3 className="text-2xl font-cinzel font-bold text-white">
                              {activeSound?.title}
                            </h3>
                            <p className="text-xs opacity-75 text-[#FDFBF7]/80 italic font-medium leading-relaxed max-w-lg">
                              {activeSound?.poetry}
                            </p>
                            <p className="text-xs text-[#C39637]">{activeSound?.desc}</p>
                          </div>
                        );
                      })()
                    ) : (
                      <div className="space-y-2">
                        <h3 className="text-xl font-cinzel font-bold text-white">
                          {t("select_soundscape", "Select a Soundscape")}
                        </h3>
                        <p className="text-xs text-white/50">
                          Choose a location below to begin the acoustic journey.
                        </p>
                      </div>
                    )}

                    {/* Visualizer Waves */}
                    <div className="h-12 flex items-end justify-center md:justify-start gap-1.5 py-1">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((bar) => {
                        const delay = (bar % 5) * 0.15;
                        const duration = 0.5 + (bar % 3) * 0.25;
                        return (
                          <div
                            key={bar}
                            className="w-1 rounded-full transition-all"
                            style={{
                              backgroundColor: activeSoundId ? (soundscapes.find(s => s.id === activeSoundId)?.id === "sahel" ? "#007A87" : "#C39637") : "#C39637",
                              height: isPlayingSound ? "100%" : "15%",
                              animation: isPlayingSound ? `pulse-bar ${duration}s ease-in-out ${delay}s infinite alternate` : "none",
                            }}
                          />
                        );
                      })}
                    </div>

                    {/* Play & Slider Controls */}
                    <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-6 pt-2">
                      {/* Play/Pause Button */}
                      <button
                        onClick={() => {
                          if (!activeSoundId) {
                            setActiveSoundId("malouf");
                          }
                          setIsPlayingSound(!isPlayingSound);
                        }}
                        className="w-14 h-14 rounded-full bg-[#C39637] hover:bg-[#C39637]/90 text-white flex items-center justify-center shadow-lg hover:scale-105 transition-all shrink-0 cursor-pointer"
                      >
                        {isPlayingSound ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                      </button>

                      {/* Progress Time */}
                      <div className="text-xs text-white/50 font-mono">
                        {Math.floor(playbackTime / 60)}:{(playbackTime % 60).toString().padStart(2, "0")} / 3:00
                      </div>

                      {/* Volume Slider */}
                      <div className="flex items-center gap-2 flex-1 w-full max-w-[200px]">
                        <Volume2 className="w-4 h-4 text-[#C39637]" />
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={soundVolume}
                          onChange={(e) => setSoundVolume(Number(e.target.value))}
                          className="w-full accent-[#C39637] bg-white/20 h-1 rounded-lg cursor-pointer outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Grid of Soundscapes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {soundscapes.map((sound) => {
                    const isCurrent = activeSoundId === sound.id;
                    return (
                      <button
                        key={sound.id}
                        onClick={() => {
                          setActiveSoundId(sound.id);
                          setIsPlayingSound(true);
                        }}
                        className={`text-left border p-5 rounded-2xl transition-all duration-300 relative group overflow-hidden block cursor-pointer ${
                          isCurrent
                            ? "border-[#C39637] bg-white/5 text-white"
                            : "border-[var(--border-color)] bg-[var(--paper-color)] hover:border-[#C39637]"
                        }`}
                      >
                        <span className="font-cinzel font-bold text-base block text-[#C39637] mb-1">
                          {sound.title}
                        </span>
                        <p className="text-xs opacity-75 line-clamp-2">{sound.desc}</p>
                        
                        {/* Play indication tag */}
                        <span className="text-[10px] text-[#C39637] mt-3 block font-semibold">
                          {isCurrent && isPlayingSound ? t("pause_sound", "Pause Sound") : t("play_sound", "Play Ambient Sound")}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: NOBLE LINEAGES & EPOCHS */}
            {activeLabTab === "lineages" && (
              <div className="space-y-8 animate-fade-in">
                {/* Tab Selector */}
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setActiveHeritageTab("ben-ayed")}
                    className={`px-6 py-3 rounded-full font-cinzel text-sm uppercase tracking-wider transition-all border duration-300 cursor-pointer ${
                      activeHeritageTab === "ben-ayed"
                        ? "bg-[#c1913e] text-white border-[#c1913e] shadow-lg shadow-[#c1913e]/20"
                        : "bg-transparent text-[var(--text-color)] border-[var(--border-color)] hover:bg-[#c1913e]/5"
                    }`}
                  >
                    {t("ben_ayed_dynasty", "Ben Ayed Dynasty")}
                  </button>
                  <button
                    onClick={() => setActiveHeritageTab("monastir")}
                    className={`px-6 py-3 rounded-full font-cinzel text-sm uppercase tracking-wider transition-all border duration-300 cursor-pointer ${
                      activeHeritageTab === "monastir"
                        ? "bg-[#c1913e] text-white border-[#c1913e] shadow-lg shadow-[#c1913e]/20"
                        : "bg-transparent text-[var(--text-color)] border-[var(--border-color)] hover:bg-[#c1913e]/5"
                    }`}
                  >
                    {t("monastir_governors", "Governors of Monastir (1579)")}
                  </button>
                </div>

                <div className="mt-8">
                  {activeHeritageTab === "ben-ayed" ? (
                    /* SUB-TAB 1: BEN AYED FAMILY TREE NODE MAP */
                    <div className="space-y-8 animate-fade-in">
                      <div className="text-center max-w-2xl mx-auto mb-6">
                        <h3 className="text-2xl font-cinzel font-bold mb-2">Palais Ben Ayed — Djerba</h3>
                        <p className="text-sm opacity-80">
                          {t("ben_ayed_desc", "The Ben Ayed family of Djerba formed a core part of Tunisia's political and commercial aristocracy. Click an ancestor card to view their biography and archival files.")}
                        </p>
                      </div>

                      {/* SVG/HTML Tree Visualizer */}
                      <div className="relative overflow-x-auto py-6 px-4 flex flex-col items-center min-w-[600px] border border-[var(--border-color)] rounded-2xl bg-[var(--paper-color)] backdrop-blur-md">
                        {/* Generation 1 */}
                        <div className="flex justify-center mb-10 relative">
                          <button
                            onClick={() =>
                              setSelectedHeritageDetail({
                                name: "Haj Ali Ben Ayed",
                                period: "1700s",
                                role: t("envoy_title", "General Envoy & Ambassador"),
                                bio: t("haj_ali_bio", "Haj Ali Ben Ayed was a key merchant diplomat who served as Beylical envoy and managed commercial agreements. His diplomatic actions fortified the family's rise in the Djerba Beylic administration."),
                                files: [
                                  { label: t("family_tree_doc", "Simple Family Tree (1700–Present)"), url: "https://share.google/gWwfVZ8twkTnSbqQn" }
                                ]
                              })
                            }
                            className="group border border-[#C39637] bg-[var(--bg-light)] p-4 rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all text-center min-w-[200px] cursor-pointer"
                          >
                            <h4 className="font-bold text-[#c1913e]">Haj Ali Ben Ayed</h4>
                            <p className="text-xs opacity-75">1700s • Patriarch & Envoy</p>
                            <span className="text-[10px] text-[#C39637] opacity-0 group-hover:opacity-100 transition-opacity block mt-1">
                              {t("click_to_view", "Click to explore")}
                            </span>
                          </button>
                          {/* Downward SVG connector */}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 h-10 w-0.5 bg-[#C39637]/40" />
                        </div>

                        {/* Generation 2 */}
                        <div className="flex justify-center mb-10 relative pt-4">
                          <button
                            onClick={() =>
                              setSelectedHeritageDetail({
                                name: "Mahmoud Ben Ayed",
                                period: "1805 – 1880",
                                role: t("minister_title", "Minister of the Navy"),
                                bio: t("mahmoud_bio", "Mahmoud Ben Ayed was a powerful statesman, financier, and Minister of the Navy. He constructed the luxurious Palais Ben Ayed in Djerba, combining Ottoman, Italian, and local architectural crafts. He played a central role in Tunisia's pre-colonial modernizing reforms."),
                                files: [
                                  { label: t("mahmoud_bio_doc", "Mahmoud Ben Ayed Biography"), url: "https://share.google/zNhESTUaAuvabXiRC" },
                                  { label: t("palace_gallery_doc", "Palais Ben Ayed Djerba Gallery"), url: "https://share.google/ZdEvQUrBXeMSewZZ0" },
                                  { label: t("family_tree_doc", "Simple Family Tree (1700–Present)"), url: "https://share.google/gWwfVZ8twkTnSbqQn" }
                                ]
                              })
                            }
                            className="group border-2 border-[#c1913e] bg-[var(--bg-light)] p-5 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all text-center min-w-[220px] cursor-pointer"
                          >
                            <h4 className="font-bold text-[#c1913e] text-lg">Mahmoud Ben Ayed</h4>
                            <p className="text-xs opacity-75">1805 – 1880 • Minister of Navy</p>
                            <span className="text-[10px] text-[#C39637] opacity-0 group-hover:opacity-100 transition-opacity block mt-1">
                              {t("click_to_view", "Click to explore")}
                            </span>
                          </button>
                          {/* Downward SVG connector */}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 h-10 w-0.5 bg-[#C39637]/40" />
                        </div>

                        {/* Generation 3 */}
                        <div className="flex justify-center mb-10 relative pt-4">
                          <button
                            onClick={() =>
                              setSelectedHeritageDetail({
                                name: "Caïd Hedi Ben Ayed",
                                period: "Late 1800s",
                                role: t("caid_title", "Caïd-Gouverneur of Djerba"),
                                bio: t("hedi_bio", "Caïd Hedi Ben Ayed served as governor (Caïd) of Djerba. He maintained regional stability, coordinated tax collections, and documented local family registries during the transition to the late 19th-century administrative structures."),
                                files: [
                                  { label: t("palace_gallery_doc", "Palais Ben Ayed Djerba Gallery"), url: "https://share.google/ZdEvQUrBXeMSewZZ0" },
                                  { label: t("historical_archives_doc", "Ben Ayed Historical Files"), url: "https://share.google/lngy65lxt8VkiNYzU" }
                                ]
                              })
                            }
                            className="group border border-[#C39637] bg-[var(--bg-light)] p-4 rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all text-center min-w-[200px] cursor-pointer"
                          >
                            <h4 className="font-bold text-[#c1913e]">Hedi Ben Ayed</h4>
                            <p className="text-xs opacity-75">Late 1800s • Governor of Djerba</p>
                            <span className="text-[10px] text-[#C39637] opacity-0 group-hover:opacity-100 transition-opacity block mt-1">
                              {t("click_to_view", "Click to explore")}
                            </span>
                          </button>
                          {/* Downward SVG connector */}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 h-10 w-0.5 bg-[#C39637]/40" />
                        </div>

                        {/* Generation 4 */}
                        <div className="flex justify-center pt-4">
                          <button
                            onClick={() =>
                              setSelectedHeritageDetail({
                                name: "Habib Ben Ayed",
                                period: "1900s – Present",
                                role: t("diplomat_title", "Diplomat & Republic Envoy"),
                                bio: t("habib_bio", "Habib Ben Ayed represented independent Tunisia in several consular postings, preserving family records and contributing to modern Tunisian diplomatic archives. His lineage continues the administrative tradition of the family."),
                                files: [
                                  { label: t("historical_archives_doc", "Ben Ayed Historical Files"), url: "https://share.google/lngy65lxt8VkiNYzU" }
                                ]
                              })
                            }
                            className="group border border-[#C39637] bg-[var(--bg-light)] p-4 rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all text-center min-w-[200px] cursor-pointer"
                          >
                            <h4 className="font-bold text-[#c1913e]">Habib Ben Ayed</h4>
                            <p className="text-xs opacity-75">1900s • Consular Diplomat</p>
                            <span className="text-[10px] text-[#C39637] opacity-0 group-hover:opacity-100 transition-opacity block mt-1">
                              {t("click_to_view", "Click to explore")}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* SUB-TAB 2: MONASTIR CAÏDS TIMELINE MAP */
                    <div className="space-y-8 animate-fade-in">
                      <div className="text-center max-w-2xl mx-auto mb-6">
                        <h3 className="text-2xl font-cinzel font-bold mb-2">Les Caïd-Gouverneurs de Monastir (1579)</h3>
                        <p className="text-sm opacity-80">
                          {t("monastir_desc", "Monastir's regional administration was managed by a succession of caïd-gouverneurs since the late 16th century. Click a timeline event to view regional governance records.")}
                        </p>
                      </div>

                      <div className="relative border-l-2 border-[#C39637] ml-6 md:ml-12 space-y-10 py-4">
                        {[
                          {
                            year: "1579",
                            title: t("monastir_1579_title", "Establishment of Caïdat"),
                            role: "Ottoman Administration",
                            desc: t("monastir_1579_desc", "The creation of local administrative registers in Monastir under Ottoman rule, establishing regional tax and defense structures centered in the Monastir Ribat."),
                            details: "Document code: MN-1579-REG"
                          },
                          {
                            year: "1704",
                            title: t("monastir_1704_title", "Husainid Consolidation"),
                            role: "Consolidated Caïdal Lineages",
                            desc: t("monastir_1704_desc", "Local noble families (including the Ben Dhia and Fellah lines) coordinate regional defense and Waqf property endowments, leaving crucial genealogical family papers."),
                            details: "Document code: MN-1704-HYS"
                          },
                          {
                            year: "1850s",
                            title: t("monastir_1850_title", "Modern Administrative Reforms"),
                            role: "Regional Governor Councils",
                            desc: t("monastir_1850_desc", "Monastir is integrated into the pre-colonial reform registers (Mizania) detailing land ownership, taxation, and municipal civil status fixing."),
                            details: "Document code: MN-1850-MIZ"
                          }
                        ].map((epoch, i) => (
                          <div key={i} className="relative pl-8 md:pl-12 group" data-aos="fade-right">
                            {/* Timeline dot */}
                            <div className="absolute left-[-9px] top-1 w-4 h-4 rounded-full bg-[#c1913e] border-2 border-[#FDFBF7] group-hover:scale-125 transition-transform" />
                            <button
                              onClick={() =>
                                setSelectedHeritageDetail({
                                  name: epoch.title,
                                  period: epoch.year,
                                  role: epoch.role,
                                  bio: `${epoch.desc} ${epoch.details}`,
                                  files: [
                                    { label: t("monastir_records_doc", "Monastir Archives Link"), url: "https://share.google/lngy65lxt8VkiNYzU" }
                                  ]
                                })
                              }
                              className="text-left w-full border border-[var(--border-color)] bg-[var(--paper-color)] hover:border-[#c1913e] p-5 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 block cursor-pointer"
                            >
                              <span className="text-[#c1913e] font-cinzel font-bold text-lg block mb-1">
                                {epoch.year} • {epoch.title}
                              </span>
                              <p className="text-xs font-semibold text-[#C39637] mb-2">{epoch.role}</p>
                              <p className="text-sm opacity-80 line-clamp-2">{epoch.desc}</p>
                              <span className="text-[10px] text-[#C39637] mt-3 block font-semibold hover:underline">
                                {t("read_details", "Read historical logs & view archives →")}
                              </span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>}

      {/* DETAIL MODAL FOR HISTORICAL SPOTLIGHT */}
      {selectedHeritageDetail && (
        <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`${cardBg} w-full max-w-xl rounded-2xl shadow-2xl border ${borderColor} overflow-hidden relative p-6 space-y-6`}
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#C39637] font-semibold">
                  {selectedHeritageDetail.period}
                </span>
                <h3 className="text-2xl font-cinzel font-bold text-[#c1913e] mt-1">
                  {selectedHeritageDetail.name}
                </h3>
                <p className="text-xs font-semibold opacity-75">{selectedHeritageDetail.role}</p>
              </div>
              <button
                onClick={() => setSelectedHeritageDetail(null)}
                className="p-1 rounded-full hover:bg-black/10 transition-colors"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Biography */}
            <div className="space-y-2">
              <h4 className="text-sm font-cinzel font-bold uppercase tracking-wider text-[var(--text-color)] opacity-60">
                {t("biographical_profile", "Biographical Profile")}
              </h4>
              <p className="text-sm leading-relaxed opacity-90">{selectedHeritageDetail.bio}</p>
            </div>

            {/* Archival Files */}
            {selectedHeritageDetail.files && selectedHeritageDetail.files.length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="text-sm font-cinzel font-bold uppercase tracking-wider text-[var(--text-color)] opacity-60">
                  {t("archival_documents", "Archival Documents")}
                </h4>
                <div className="flex flex-col gap-2">
                  {selectedHeritageDetail.files.map((file: any, i: number) => (
                    <a
                      key={i}
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-xl border border-[var(--border-color)] bg-[#c1913e]/5 hover:bg-[#c1913e]/10 hover:border-[#c1913e]/30 transition-all text-sm font-medium"
                    >
                      <span className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#c1913e]" />
                        {file.label}
                      </span>
                      <Download className="w-4 h-4 text-[#c1913e] opacity-70" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================== COMMUNITY SECTION ================== */}
      <section className="roots-section roots-section-alt">
        <div
          className="max-w-6xl mx-auto space-y-10 text-center"
          data-aos="zoom-in"
        >
          <h2 className="roots-heading">
            {t("join_our_community", "Join Our Community")}
          </h2>

          <p className="max-w-3xl mx-auto text-lg opacity-90">
            Share your findings, ask for translation help, and connect with
            distant cousins.
          </p>

          <NavLink to="/signup" className="roots-cta">
            {t("join_now", "Join Now")}
          </NavLink>
        </div>
      </section>
    </div>
  );
}
