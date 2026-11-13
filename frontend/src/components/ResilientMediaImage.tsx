import { useEffect, useMemo, useState } from "react";
import { galleryImageFallbackCandidates } from "../utils/gallerySocial";

type GalleryLike = {
  id?: string | number | null;
  image_path?: string | null;
  imagePath?: string | null;
  image_url?: string | null;
  imageUrl?: string | null;
  url?: string | null;
  file_path?: string | null;
};

type Props = {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
  item?: GalleryLike | null;
  fallbackSrc?: string;
  onExhausted?: () => void;
};

/**
 * Tries primary src, then path/API fallbacks derived from the gallery item.
 * Avoids hardcoding hostnames or filenames.
 */
export default function ResilientMediaImage({
  src,
  alt,
  className,
  loading = "lazy",
  item = null,
  fallbackSrc = "",
  onExhausted,
}: Props) {
  const candidates = useMemo(
    () => galleryImageFallbackCandidates(src, item, undefined, fallbackSrc),
    [src, item, fallbackSrc],
  );
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [src, item?.id, item?.image_path, item?.imageUrl, item?.image_url]);

  const current = candidates[Math.min(index, Math.max(candidates.length - 1, 0))] || fallbackSrc || src;

  return (
    <img
      src={current}
      alt={alt}
      loading={loading}
      className={className}
      onError={() => {
        setIndex((prev) => {
          const next = prev + 1;
          if (next >= candidates.length) {
            onExhausted?.();
            return prev;
          }
          return next;
        });
      }}
    />
  );
}
