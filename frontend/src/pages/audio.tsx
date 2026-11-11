import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Play, Pause, Mic, MapPin, Radio, Clock, Headphones } from "lucide-react";
import { PageHero, Section, SectionHeading } from "../components/site/Primitives";
import djerba from "../assets/djerba.jpg";
import SEO from "../components/SEO";
import { useTranslation } from "../context/TranslationContext";
import { useSiteContent } from "../hooks/useSiteContent";
import SiteCustomBlocks from "../components/cms/SiteCustomBlocks";
import { api } from "../api/client";

interface RecordingItem {
  id: number | string;
  title: string;
  place: string;
  length: string;
  body: string;
  audioSample: string;
}

export default function Audio() {
  const { t, isRtl } = useTranslation();
  const { getText, getImage } = useSiteContent();
  const [recordings, setRecordings] = useState<RecordingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<number | string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeRecording, setActiveRecording] = useState<RecordingItem | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/audios");
        const items = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        const formatted: RecordingItem[] = items.map((a: any) => ({
          id: a.id,
          title: a.title || "Archival Audio",
          place: a.governorate || "Tunisia",
          length: a.duration ? `${Math.floor(a.duration / 60)} min` : "Audio",
          body: a.description || "",
          audioSample: a.audio_path || a.audioPath || "",
        }));
        setRecordings(formatted);
        if (formatted.length > 0) {
          setActiveRecording(formatted[0]);
        }
      } catch {
        setRecordings([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const togglePlay = (rec: RecordingItem) => {
    if (!rec.audioSample) return;
    if (activeRecording?.id === rec.id && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      setPlayingId(null);
    } else {
      setActiveRecording(rec);
      setPlayingId(rec.id);
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.src = rec.audioSample;
        audioRef.current.play().catch(() => {
          // Audio autoplay handled gracefully
        });
      }
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setPlayingId(null);
  };

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="bg-[var(--background)] text-[var(--foreground)] min-h-screen">
      <SEO
        title={t("seo_audio_title")}
        description="Recorded Tunisian oral history: elders on village names, trades, marriages, migration, malouf, tribal poetry and Amazigh memory of Djerba and Matmata."
        keywords={["Tunisian oral history", "Tunisia elders voice", "Malouf Testour heritage"]}
      />

      {/* Hidden real HTML5 audio engine */}
      <audio
        ref={audioRef}
        onEnded={handleAudioEnded}
        onError={() => setIsPlaying(false)}
        preload="none"
      />

      <PageHero
        eyebrow={getText("audio", "hero", "eyebrow") ?? t("oral_histories_eyebrow")}
        title={getText("audio", "hero", "title") ?? t("voices_before_they_disappear")}
        subtitle={getText("audio", "hero", "subtitle") ?? t("access_audio_archives")}
        image={getImage("audio", "hero", "image") ?? djerba}
      >
        <Link to="/subscriptions" className="btn-base btn-gold w-full sm:w-auto min-w-[180px]">
          {t("access_audio_archives")}
        </Link>
        <Link to="/contact" className="btn-base btn-outline-light !text-white hover:!text-white w-full sm:w-auto min-w-[180px]">
          {t("submit_audio", "Submit a Recording")}
        </Link>
      </PageHero>

      {/* Audio Stream Player Banner (shown when a track is active) */}
      {activeRecording && (
        <section className="w-full px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8">
          <div className="mx-auto w-full max-w-[var(--content-max)]">
            <div className="surface-card frame-gold p-4 sm:p-6 rounded-lg bg-[var(--card)]/95 shadow-md flex flex-col md:flex-row items-center justify-between gap-4 text-start">
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--gold)]/15 text-[var(--gold)] ring-1 ring-[var(--gold)]/40 shrink-0">
                  <Radio className={`h-6 w-6 ${isPlaying ? "animate-pulse text-[var(--gold)]" : ""}`} />
                </div>
                <div>
                  <span className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[var(--gold)]">
                    {isPlaying ? t("audio_player_now_playing") : t("audio_select_track_hint")}
                  </span>
                  <h4 className="font-display text-base sm:text-lg font-bold text-[var(--foreground)] truncate max-w-md">
                    {activeRecording.title}
                  </h4>
                  <p className="text-xs text-[var(--muted-foreground)] flex items-center gap-1.5 mt-0.5">
                    <MapPin className="h-3 w-3 text-[var(--gold)]" />
                    <span>{activeRecording.place}</span>
                    <span>• {activeRecording.length}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => togglePlay(activeRecording)}
                  className="btn-base btn-gold text-xs py-2 px-5 flex items-center gap-2 cursor-pointer"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  <span>{isPlaying ? t("close", "Pause") : "Play Testimony"}</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Symmetric Grid / Content Area */}
      <Section>
        <SectionHeading
          center={true}
          eyebrow={t("oral_histories_eyebrow")}
          title={t("voices_before_they_disappear")}
          intro={t("access_audio_archives")}
        />

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : recordings.length === 0 ? (
          <div className="surface-card frame-gold p-12 text-center rounded-lg space-y-4 max-w-xl mx-auto my-8">
            <Headphones className="w-12 h-12 text-[var(--gold)] mx-auto opacity-80" />
            <h3 className="text-xl font-display font-bold text-[var(--foreground)]">
              {t("no_records_found")}
            </h3>
            <p className="text-sm text-[var(--muted-foreground)]">
              {t("no_audios_available", "No audio recordings available yet.")}
            </p>
            <div className="pt-2">
              <Link to="/contact" className="btn-base btn-gold text-xs py-2 px-4 inline-flex items-center gap-2">
                <Mic className="w-4 h-4" />
                <span>{t("submit_audio", "Submit a Recording")}</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-10 sm:mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-2 items-stretch">
            {recordings.map((r) => {
              const isRecPlaying = playingId === r.id;
              return (
                <article
                  key={r.id}
                  className="surface-card frame-gold p-6 sm:p-7 rounded-lg shadow-md flex h-full flex-col justify-between hover:-translate-y-1 transition-all text-start"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 border-b border-[var(--gold)]/20 pb-4">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => togglePlay(r)}
                          aria-label={isRecPlaying ? "Pause audio" : "Play audio"}
                          className={`grid h-11 w-11 place-items-center rounded-full transition-all cursor-pointer ${
                            isRecPlaying
                              ? "bg-[var(--gold)] text-[#1f160f] scale-105 shadow-md"
                              : "bg-[var(--gold)]/15 text-[var(--gold)] hover:bg-[var(--gold)]/25 ring-1 ring-[var(--gold)]/40"
                          }`}
                        >
                          {isRecPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                        </button>
                        <div>
                          <span className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[var(--gold)] flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{r.length}</span>
                          </span>
                          <p className="text-xs text-[var(--muted-foreground)] flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3 w-3 text-[var(--gold)] shrink-0" />
                            <span>{r.place}</span>
                          </p>
                        </div>
                      </div>

                      <span className="text-[0.65rem] font-mono font-bold text-[var(--gold)] bg-[var(--gold)]/10 px-2 py-0.5 rounded border border-[var(--gold)]/30">
                        Oral Archive
                      </span>
                    </div>

                    <h3 className="mt-4 font-display text-lg sm:text-xl font-bold text-[var(--foreground)] leading-snug">
                      {r.title}
                    </h3>

                    <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-[var(--muted-foreground)]">
                      {r.body}
                    </p>
                  </div>

                  <div className="mt-6 pt-3 border-t border-[var(--gold)]/15 flex items-center justify-between">
                    <div className="h-1.5 flex-1 me-3 rounded-full bg-[var(--background)] overflow-hidden border border-[var(--border)]">
                      <div
                        className={`h-full rounded-full bg-[var(--gold)] transition-all duration-500 ${
                          isRecPlaying ? "w-3/4 animate-pulse" : "w-1/5"
                        }`}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => togglePlay(r)}
                      className="text-xs font-bold text-[var(--gold)] hover:underline cursor-pointer"
                    >
                      {isRecPlaying ? "Playing" : "Listen"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </Section>

      <SiteCustomBlocks pageId="audio" />
    </div>
  );
}
