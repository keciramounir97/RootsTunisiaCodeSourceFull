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
  MapPin,
  Radio,
} from "lucide-react";
import { api } from "../api/client";
import { useTranslation } from "../context/TranslationContext";
import { useTheme } from "../context/ThemeContext";
import RootsPageShell from "../components/RootsPageShell";

interface AudioItem {
  id: number | string;
  titleKey?: string;
  title: string;
  descriptionKey?: string;
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

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export default function GalleryAudios() {
  const { theme } = useTheme();
  const { t, isRtl } = useTranslation();
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

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/audios");
        const items = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        const formatted = items.map((a: any) => ({
          id: a.id,
          title: a.title || "Archival Audio",
          description: a.description || "",
          audioPath: a.audio_path || a.audioPath || "",
          duration: a.duration || 300,
          category: a.category || "Oral History",
          governorate: a.governorate || "Tunisia",
          archiveSource: a.archive_source || a.archiveSource || "National Archives",
          likes: a.likes || 0,
          comments: [],
        }));
        setAudios(formatted);
      } catch {
        setAudios([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const categoryOptions = [
    { key: "all", labelKey: "cat_all" },
    { key: "Oral History", labelKey: "cat_oral_history" },
    { key: "Oral History & Music", labelKey: "cat_music_heritage" },
    { key: "Dialect & Culture", labelKey: "cat_dialect_culture" },
  ];

  const filteredAudios = useMemo(() => {
    return audios.filter((a) => {
      const matchQuery =
        !query ||
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        (a.description && a.description.toLowerCase().includes(query.toLowerCase())) ||
        (a.governorate && a.governorate.toLowerCase().includes(query.toLowerCase()));
      const matchCat = categoryFilter === "all" || a.category === categoryFilter;
      return matchQuery && matchCat;
    });
  }, [audios, query, categoryFilter]);

  const playAudio = (item: AudioItem) => {
    if (currentAudio?.id === item.id) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play();
        setIsPlaying(true);
      }
    } else {
      setCurrentAudio(item);
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.src = item.audioPath || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
        audioRef.current.play().catch(() => {});
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
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <RootsPageShell
      hero={
        <div className="space-y-4 text-center">
          <p className="eyebrow text-[var(--gold)] text-shadow-gold tracking-widest font-bold">
            {t("nav_audios")}
          </p>
          <h1 className="display-xl text-white font-bold hero-title-shadow text-shadow-glow tracking-wide">
            {t("voices_before_they_disappear")}
          </h1>
          <div className="gold-rule mt-4 w-28 mx-auto shadow-lg" />
          <p className="max-w-3xl mx-auto text-base text-slate-100/95 font-medium drop-shadow-md">
            {t("access_audio_archives")}
          </p>
        </div>
      }
    >
      <div className="w-full space-y-8">
        {/* Hidden Audio Engine */}
        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
          onError={() => setIsPlaying(false)}
          preload="metadata"
        />

        {/* Global Player Banner */}
        {currentAudio && (
          <div className="surface-card frame-gold p-4 sm:p-5 rounded-lg bg-[var(--card)]/95 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 text-start">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                type="button"
                onClick={() => playAudio(currentAudio)}
                className="grid h-12 w-12 place-items-center rounded-full bg-[var(--gold)] text-[#1f160f] shadow-md hover:scale-105 transition-transform cursor-pointer shrink-0"
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
              </button>
              <div className="min-w-0">
                <span className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--gold)]">
                  {t("audio_player_now_playing")}
                </span>
                <h4 className="font-display text-base font-bold text-[var(--foreground)] truncate max-w-sm">
                  {currentAudio.title}
                </h4>
                <p className="text-xs text-[var(--muted-foreground)] truncate">
                  {currentAudio.governorate} • {formatDuration(currentTime)} / {formatDuration(duration || currentAudio.duration || 0)}
                </p>
              </div>
            </div>

            {/* Scrubber */}
            <div className="w-full md:flex-1 max-w-md px-2 flex items-center gap-3">
              <span className="text-[0.68rem] font-mono text-[var(--muted-foreground)]">
                {formatDuration(currentTime)}
              </span>
              <input
                type="range"
                min="0"
                max={duration || currentAudio.duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-[var(--background)] rounded-lg appearance-none cursor-pointer accent-[var(--gold)]"
              />
              <span className="text-[0.68rem] font-mono text-[var(--muted-foreground)]">
                {formatDuration(duration || currentAudio.duration || 0)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleMute}
                className="p-2 rounded-full hover:bg-[var(--gold)]/15 text-[var(--foreground)] cursor-pointer"
              >
                {isMuted ? <VolumeX className="h-4 w-4 text-rose-400" /> : <Volume2 className="h-4 w-4 text-[var(--gold)]" />}
              </button>
            </div>
          </div>
        )}

        {/* Search & Category Filter */}
        <div className="surface-card p-4 sm:p-5 rounded-lg border border-[var(--gold)]/35 bg-[var(--card)]/95 shadow-md flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[var(--muted-foreground)] absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={t("search_audio_placeholder")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full ps-9 pe-3 py-2 text-xs rounded-md border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 scrollbar-thin">
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

        {/* Audios Grid */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredAudios.length === 0 ? (
          <div className="surface-card frame-gold p-12 text-center rounded-lg space-y-4 max-w-xl mx-auto my-8">
            <Headphones className="w-12 h-12 text-[var(--gold)] mx-auto opacity-80" />
            <h3 className="text-xl font-display font-bold text-[var(--foreground)]">
              {t("no_records_found")}
            </h3>
            <p className="text-sm text-[var(--muted-foreground)]">
              {t("search_audio_placeholder")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 items-stretch">
            {filteredAudios.map((item) => {
              const isThisPlaying = currentAudio?.id === item.id && isPlaying;
              return (
                <article
                  key={item.id}
                  className="surface-card frame-gold p-6 sm:p-7 rounded-lg shadow-md flex h-full flex-col justify-between hover:-translate-y-1 transition-all text-start"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 border-b border-[var(--gold)]/20 pb-4">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => playAudio(item)}
                          className={`grid h-11 w-11 place-items-center rounded-full transition-all cursor-pointer ${
                            isThisPlaying
                              ? "bg-[var(--gold)] text-[#1f160f] scale-105 shadow-md"
                              : "bg-[var(--gold)]/15 text-[var(--gold)] hover:bg-[var(--gold)]/25 ring-1 ring-[var(--gold)]/40"
                          }`}
                        >
                          {isThisPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                        </button>
                        <div>
                          <span className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[var(--gold)] flex items-center gap-1 font-mono">
                            <Clock className="h-3 w-3" />
                            <span>{formatDuration(item.duration || 300)}</span>
                          </span>
                          {item.governorate && (
                            <p className="text-xs text-[var(--muted-foreground)] flex items-center gap-1 mt-0.5">
                              <MapPin className="h-3 w-3 text-[var(--gold)] shrink-0" />
                              <span>{item.governorate}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      <span className="text-[0.65rem] font-bold text-[var(--gold)] bg-[var(--gold)]/10 px-2 py-0.5 rounded border border-[var(--gold)]/30">
                        {item.category}
                      </span>
                    </div>

                    <h3 className="mt-4 font-display text-lg sm:text-xl font-bold text-[var(--foreground)] leading-snug">
                      {item.title}
                    </h3>

                    {item.description && (
                      <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-[var(--muted-foreground)] line-clamp-3">
                        {item.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-6 pt-3 border-t border-[var(--gold)]/15 flex items-center justify-between text-xs">
                    <span className="text-[0.68rem] text-[var(--muted-foreground)] truncate max-w-[200px]">
                      {item.archiveSource}
                    </span>
                    <button
                      type="button"
                      onClick={() => playAudio(item)}
                      className="font-bold text-[var(--gold)] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {isThisPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                      <span>{isThisPlaying ? "Pause" : "Play Recording"}</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </RootsPageShell>
  );
}
