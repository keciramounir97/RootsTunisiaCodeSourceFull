import { useEffect, useMemo, useState, useRef } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Heart,
  MessageCircle,
  Upload,
  Search,
  Music,
  X,
  Clock,
  ListMusic,
  Plus,
  Send,
  Headphones,
} from "lucide-react";
import { api } from "../api/client";
import { useTranslation } from "../context/TranslationContext";
import { useTheme } from "../context/ThemeContext";
import RootsPageShell from "../components/RootsPageShell";

interface AudioItem {
  id: number | string;
  title: string;
  description?: string;
  audioPath?: string;
  duration?: number;
  category?: string;
  governorate?: string;
  archiveSource?: string;
  createdAt?: string;
  likes?: number;
  comments?: { id: string; userName: string; text: string; createdAt: string }[];
  isLiked?: boolean;
}

const TUNISIAN_INITIAL_AUDIOS: AudioItem[] = [
  {
    id: "aud-tn-1",
    title: "Malouf Heritage & Andalusian Pedigree Songs of Testour",
    description: "Oral testimony recorded in 1968 detailing family lineages and Andalusian musical traditions brought to Testour in the 17th century.",
    audioPath: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: 380,
    category: "Oral History & Music",
    governorate: "Béja / Testour",
    archiveSource: "Centre des Musiques Arabes et Méditerranéennes (Ennejma Ezzahra)",
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    likes: 54,
    comments: [
      {
        id: "ac1",
        userName: "Sami Testouri",
        text: "Preserving this oral heritage is vital for Andalusian families in North Tunisia.",
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
    ],
  },
  {
    id: "aud-tn-2",
    title: "Memories of the Beylical Majba & Family Taxes in Sfax (1881)",
    description: "Oral history interview with elders from Sfax sharing generational accounts of Beylical tax registers and coastal maritime trade.",
    audioPath: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: 512,
    category: "Oral History",
    governorate: "Sfax",
    archiveSource: "Société d'Histoire de Sfax & Archives Nationales",
    createdAt: new Date(Date.now() - 86400000 * 18).toISOString(),
    likes: 39,
    comments: [],
  },
  {
    id: "aud-tn-3",
    title: "Djerban Maritime & Caravan Dialect Memories",
    description: "Audio recordings capturing older Djerban Arabic idioms, family waqf terms, and island trade routes across Gabès and Tozeur.",
    audioPath: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    duration: 420,
    category: "Dialect & Culture",
    governorate: "Médenine / Djerba",
    archiveSource: "Djerba Cultural Heritage Archives",
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    likes: 47,
    comments: [],
  },
];

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export default function GalleryAudios() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const audioRef = useRef<HTMLAudioElement>(null);

  const [audios, setAudios] = useState<AudioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentAudio, setCurrentAudio] = useState<AudioItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // New audio form state
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCategory, setNewCategory] = useState("Oral History");
  const [newGov, setNewGov] = useState("Tunis");
  const [newUrl, setNewUrl] = useState("");

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/audios");
        const items = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        if (items.length > 0) {
          setAudios(items);
          setCurrentAudio(items[0]);
        } else {
          setAudios(TUNISIAN_INITIAL_AUDIOS);
          setCurrentAudio(TUNISIAN_INITIAL_AUDIOS[0]);
        }
      } catch {
        setAudios(TUNISIAN_INITIAL_AUDIOS);
        setCurrentAudio(TUNISIAN_INITIAL_AUDIOS[0]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredAudios = useMemo(() => {
    return audios.filter((item) => {
      const matchQuery =
        !query ||
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(query.toLowerCase())) ||
        (item.governorate && item.governorate.toLowerCase().includes(query.toLowerCase()));
      const matchCat = categoryFilter === "all" || item.category === categoryFilter;
      return matchQuery && matchCat;
    });
  }, [audios, query, categoryFilter]);

  const togglePlay = (audio?: AudioItem) => {
    if (audio && currentAudio?.id !== audio.id) {
      setCurrentAudio(audio);
      setIsPlaying(true);
      return;
    }
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleUploadAudio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created: AudioItem = {
      id: Date.now(),
      title: newTitle.trim(),
      description: newDesc.trim(),
      category: newCategory,
      governorate: newGov,
      audioPath: newUrl.trim() || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      duration: 300,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: [],
    };

    setAudios((prev) => [created, ...prev]);
    setCurrentAudio(created);
    setIsPlaying(true);
    setShowUploadModal(false);
    setNewTitle("");
    setNewDesc("");
  };

  return (
    <RootsPageShell
      hero={
        <div className="space-y-4 text-center">
          <p className="eyebrow text-[var(--gold)]">
            {t("audio_gallery_eyebrow", "Roots Tunisia Audio Archives")}
          </p>
          <h1 className="display-xl text-[var(--foreground)] font-serif">
            {t("nav_audios", "Oral Histories & Audio Recordings")}
          </h1>
          <p className="max-w-3xl mx-auto text-base opacity-90 text-[var(--muted-foreground)]">
            {t(
              "audio_gallery_desc",
              "Listen to oral memories, Andalusian Malouf pedigree songs, elders' testimonies, and regional dialect recordings from Tunis to Djerba.",
            )}
          </p>
        </div>
      }
    >
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Active Audio Player Bar */}
        {currentAudio && (
          <div className="surface-card frame-gold p-6 rounded-lg shadow-xl space-y-4">
            <audio
              ref={audioRef}
              src={currentAudio.audioPath}
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => setIsPlaying(false)}
              autoPlay={isPlaying}
            />
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="w-14 h-14 rounded-lg bg-[var(--primary)] text-white flex items-center justify-center shrink-0 shadow-md">
                  <Headphones className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--gold)]">
                    {currentAudio.category} {currentAudio.governorate ? `• ${currentAudio.governorate}` : ""}
                  </span>
                  <h3 className="text-lg font-serif font-bold text-[var(--foreground)] leading-snug">
                    {currentAudio.title}
                  </h3>
                  <p className="text-xs text-[var(--muted-foreground)] line-clamp-1">
                    {currentAudio.description}
                  </p>
                </div>
              </div>

              {/* Player Controls */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => togglePlay()}
                  className="w-12 h-12 rounded-full bg-[var(--gold)] text-[var(--accent-foreground)] font-bold flex items-center justify-center hover:scale-105 transition-transform cursor-pointer shadow-md"
                >
                  {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ms-0.5" />}
                </button>
              </div>
            </div>

            {/* Seek Bar */}
            <div className="space-y-1">
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-[var(--border)] accent-[var(--gold)] rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[0.65rem] text-[var(--muted-foreground)] font-mono">
                <span>{formatDuration(currentTime)}</span>
                <span>{formatDuration(duration || currentAudio.duration || 0)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Filter Controls & Upload Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-[var(--muted-foreground)] absolute start-3 top-2.5" />
              <input
                type="text"
                placeholder={t("search_audio_placeholder", "Search audio, region or topic…")}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full ps-9 pe-3 py-1.5 text-xs rounded-sm border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-sm border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]"
            >
              <option value="all">{t("all_categories", "All Categories")}</option>
              <option value="Oral History">{t("oral_history", "Oral History")}</option>
              <option value="Oral History & Music">{t("music_heritage", "Music Heritage")}</option>
              <option value="Dialect & Culture">{t("dialect_culture", "Dialect & Culture")}</option>
            </select>
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className="btn-base btn-gold text-xs px-4 py-2 flex items-center gap-2 cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>{t("upload_audio", "Contribute Audio Record")}</span>
          </button>
        </div>

        {/* Audio Grid */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAudios.map((item) => (
              <div
                key={item.id}
                className={`surface-card p-5 frame-gold rounded-lg transition-all space-y-3 flex flex-col justify-between ${
                  currentAudio?.id === item.id ? "border-[var(--gold)] ring-1 ring-[var(--gold)]" : ""
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[0.65rem] font-bold text-[var(--gold)] uppercase">
                    <span>{item.category}</span>
                    <span>{item.governorate}</span>
                  </div>
                  <h4 className="text-base font-serif font-bold text-[var(--foreground)] line-clamp-2">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[var(--muted-foreground)] line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between">
                  <span className="text-[0.65rem] text-[var(--muted-foreground)] flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-[var(--gold)]" />
                    {formatDuration(item.duration || 0)}
                  </span>
                  <button
                    onClick={() => togglePlay(item)}
                    className="btn-base btn-red text-xs px-3 py-1.5 flex items-center gap-1.5 cursor-pointer"
                  >
                    {currentAudio?.id === item.id && isPlaying ? (
                      <>
                        <Pause className="w-3.5 h-3.5 fill-current" />
                        <span>{t("pause", "Pause")}</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>{t("listen", "Listen")}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload Audio Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="surface-card frame-gold p-6 rounded-lg max-w-lg w-full space-y-4 bg-[var(--card)] shadow-2xl">
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                <h3 className="text-lg font-serif font-bold text-[var(--foreground)]">
                  {t("upload_audio_title", "Submit Audio Record or Interview")}
                </h3>
                <button onClick={() => setShowUploadModal(false)} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUploadAudio} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold mb-1 text-[var(--foreground)]">
                    {t("audio_title", "Recording Title")}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Oral Testimony of Haj Ahmed from Sousse"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-sm border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold mb-1 text-[var(--foreground)]">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-sm border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]"
                    >
                      <option value="Oral History">Oral History</option>
                      <option value="Oral History & Music">Music Heritage</option>
                      <option value="Dialect & Culture">Dialect & Culture</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1 text-[var(--foreground)]">Governorate</label>
                    <input
                      type="text"
                      placeholder="e.g. Tunis, Kairouan, Sfax"
                      value={newGov}
                      onChange={(e) => setNewGov(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-sm border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 text-[var(--foreground)]">Audio File URL / Path</label>
                  <input
                    type="text"
                    placeholder="https://... or audio file URL"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-sm border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 text-[var(--foreground)]">Description & Context</label>
                  <textarea
                    rows={3}
                    placeholder="Provide details about the speaker, period, or lineage referenced..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-sm border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="btn-base btn-outline-ink text-xs px-4 py-2 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-base btn-gold text-xs px-5 py-2 cursor-pointer">
                    Submit Audio
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </RootsPageShell>
  );
}
