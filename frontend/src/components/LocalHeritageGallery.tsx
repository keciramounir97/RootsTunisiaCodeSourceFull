import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Layers, X } from "lucide-react";
import { api } from "../api/client";
import { getApiRoot } from "../api/helpers";

interface GalleryItem {
  src: string;
  title: string;
  description?: string;
  category: "Gallery";
}

export default function LocalHeritageGallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [brokenSources, setBrokenSources] = useState<string[]>([]);
  const apiRoot = useMemo(() => getApiRoot(), []);

  useEffect(() => {
    api.get("/gallery").then((res) => {
      if (!Array.isArray(res.data)) return;
      setItems(res.data.filter((img: any) => img.file_path || img.image_url).map((img: any) => ({
        src: img.image_url || `${apiRoot}/uploads/gallery/${String(img.file_path).split("/").pop()}`,
        title: img.title || img.name || "Gallery Image",
        description: img.description || "",
        category: "Gallery" as const,
      })));
    }).catch(() => setItems([]));
  }, [apiRoot]);

  const visibleItems = useMemo(
    () => items.filter((item) => !brokenSources.includes(item.src)),
    [items, brokenSources],
  );
  const selected = selectedIndex === null ? null : visibleItems[selectedIndex] || null;
  const close = useCallback(() => setSelectedIndex(null), []);
  const previous = useCallback(() => setSelectedIndex((index) => index === null ? null : (index - 1 + visibleItems.length) % visibleItems.length), [visibleItems.length]);
  const next = useCallback(() => setSelectedIndex((index) => index === null ? null : (index + 1) % visibleItems.length), [visibleItems.length]);

  useEffect(() => {
    if (selectedIndex === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") previous();
      if (event.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedIndex, close, previous, next]);

  return (
    <section className="roots-section mb-16" data-aos="fade-up">
      <div className="roots-section-inner">
        <div className="text-center mb-10">
          <h2 className="roots-heading">Maghrebi Visual Heritage</h2>
          <p className="max-w-3xl mx-auto text-lg opacity-90">Browse the images uploaded to the Roots Tunisia gallery.</p>
        </div>
        <div className="flex justify-center mb-10">
          <span className="px-5 py-2 rounded-full text-sm font-semibold tracking-wider uppercase bg-[var(--brand-gold)] text-white shadow-lg">
            Gallery ({visibleItems.length})
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {visibleItems.map((item, index) => (
            <button key={item.src} type="button" className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer border border-[var(--border-color)] shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1 text-left" onClick={() => setSelectedIndex(index)}>
              <img src={item.src} alt={item.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" onError={() => setBrokenSources((current) => current.includes(item.src) ? current : [...current, item.src])} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white"><p className="text-xs opacity-75">Gallery</p><p className="text-sm font-bold truncate">{item.title}</p></div>
            </button>
          ))}
        </div>
        {!visibleItems.length && <div className="text-center py-16 opacity-60"><Layers className="w-16 h-16 mx-auto mb-4 opacity-30" /><p>No uploaded gallery images found.</p></div>}
      </div>
      {selected && (
        <div className="roots-modal-layer" onClick={close}>
          <button onClick={close} className="roots-modal-close" aria-label="Close"><X /></button>
          <button onClick={(event) => { event.stopPropagation(); previous(); }} className="roots-modal-nav roots-modal-nav-left" aria-label="Previous"><ChevronLeft /></button>
          <button onClick={(event) => { event.stopPropagation(); next(); }} className="roots-modal-nav roots-modal-nav-right" aria-label="Next"><ChevronRight /></button>
          <div className="roots-modal roots-modal-image" onClick={(event) => event.stopPropagation()}>
            <img src={selected.src} alt={selected.title} className="max-h-[76dvh] w-full object-contain rounded-xl" />
            <div className="text-center text-white pt-4"><h3 className="text-xl font-bold">{selected.title}</h3>{selected.description && <p className="opacity-75 text-sm mt-1">{selected.description}</p>}<p className="text-xs uppercase tracking-wider text-[var(--gold-light)] mt-2">Gallery</p></div>
            <div className="text-center text-white/60 text-sm mt-3">{selectedIndex! + 1} / {visibleItems.length}</div>
          </div>
        </div>
      )}
    </section>
  );
}
