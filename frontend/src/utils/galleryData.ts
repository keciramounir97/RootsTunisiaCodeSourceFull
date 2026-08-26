export type GalleryComment = {
  id: number | string;
  userId?: string;
  userName?: string;
  text?: string;
  createdAt?: string;
};

export type GalleryDataItem = {
  id: number | string;
  title: string;
  description?: string;
  category?: string;
  imagePath?: string;
  image_path?: string;
  archiveSource?: string;
  archive_source?: string;
  documentCode?: string;
  document_code?: string;
  photographer?: string;
  location?: string;
  year?: string;
  date?: string;
  show_details?: boolean;
  showDetails?: boolean;
  createdAt?: string;
  created_at?: string;
  likes?: number;
  comments?: GalleryComment[];
  isLiked?: boolean;
  isPublic?: boolean;
  is_public?: boolean;
  isLocalAsset?: boolean;
  uploaded_by?: number;
  uploader?: { id: number; full_name?: string; email?: string };
};

export const GALLERY_CHANGED_EVENT = "RootsTunisia:gallery-changed";
const GALLERY_CHANGED_STORAGE_KEY = "RootsTunisia:gallery-changed-at";

const localGalleryModules = import.meta.glob("../assets/*.{png,jpg,jpeg,webp}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const formatFilenameToTitle = (path: string) => {
  const filename = path.split("/").pop() || path;
  const base = filename.replace(/\.(png|jpg|jpeg|webp|svg)$/i, "");
  return base
    .replace(/^(\d+)_/, "")
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

const normalizeBoolean = (value: unknown, fallback: boolean) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "1", "yes"].includes(normalized)) return true;
    if (["false", "0", "no"].includes(normalized)) return false;
  }
  return fallback;
};

export const localGalleryAssets: GalleryDataItem[] = Object.entries(
  localGalleryModules,
)
  .filter(([path]) => !path.includes("logo") && !path.includes("favicon") && !path.includes("opacity"))
  .map(([path, src], index) => {
    const title = formatFilenameToTitle(path);
    const createdAt = new Date(Date.UTC(2026, 0, index + 1)).toISOString();

    return {
      id: `local-gallery-${index + 1}`,
      title,
      description: `Tunisian heritage asset: ${title}`,
      category: "Heritage Archives",
      imagePath: src,
      image_path: src,
      isPublic: true,
      is_public: true,
      showDetails: true,
      show_details: true,
      archiveSource: "Archives Nationales de Tunisie",
      archive_source: "Archives Nationales de Tunisie",
      documentCode: `ANT-TUN-${1000 + index}`,
      document_code: `ANT-TUN-${1000 + index}`,
      location: title.includes("Carthage")
        ? "Carthage"
        : title.includes("Kairouan")
          ? "Kairouan"
          : title.includes("Sidi")
            ? "Sidi Bou Saïd"
            : title.includes("El Jem")
              ? "El Jem"
              : title.includes("Djerba")
                ? "Djerba"
                : "Tunisia",
      year: "Historical Archive",
      photographer: "Heritage Collections",
      createdAt,
      created_at: createdAt,
      likes: 12 + (index % 15),
      comments: [],
      isLiked: false,
      isLocalAsset: true,
    };
  });

export const unwrapGalleryResponse = (payload: unknown): unknown[] => {
  const data = payload as any;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.gallery)) return data.gallery;
  if (Array.isArray(data?.images)) return data.images;
  if (data?.success && Array.isArray(data?.data)) return data.data;
  return [];
};

export const normalizeGalleryItem = (item: any): GalleryDataItem => {
  const imagePath = item?.imagePath ?? item?.image_path ?? "";
  const archiveSource = item?.archiveSource ?? item?.archive_source ?? "";
  const documentCode = item?.documentCode ?? item?.document_code ?? "";
  const isPublic = normalizeBoolean(item?.isPublic ?? item?.is_public, true);
  const showDetails = normalizeBoolean(
    item?.showDetails ?? item?.show_details,
    true,
  );
  const createdAt = item?.createdAt ?? item?.created_at;
  const comments = Array.isArray(item?.comments) ? item.comments : [];

  return {
    ...item,
    id: item?.id ?? `gallery-${imagePath || Date.now()}`,
    title: item?.title ?? "Gallery image",
    description: item?.description ?? "",
    category: item?.category ?? "",
    imagePath,
    image_path: item?.image_path ?? imagePath,
    archiveSource,
    archive_source: item?.archive_source ?? archiveSource,
    documentCode,
    document_code: item?.document_code ?? documentCode,
    isPublic,
    is_public: isPublic,
    showDetails,
    show_details: showDetails,
    createdAt,
    created_at: item?.created_at ?? createdAt,
    date: item?.date ?? item?.year,
    likes: Number(item?.likes ?? 0),
    comments,
    isLiked: Boolean(item?.isLiked),
  };
};

export const withLocalGalleryFallback = (items: GalleryDataItem[]) =>
  items.length ? items : localGalleryAssets.map((item) => ({ ...item }));

export const emitGalleryChanged = (detail?: unknown) => {
  if (typeof window === "undefined") return;

  window.dispatchEvent(new CustomEvent(GALLERY_CHANGED_EVENT, { detail }));
  try {
    window.localStorage.setItem(GALLERY_CHANGED_STORAGE_KEY, String(Date.now()));
  } catch {
    // Storage may be unavailable in private contexts.
  }
};

export const listenForGalleryChanges = (callback: () => void) => {
  if (typeof window === "undefined") return () => {};

  const onChanged = () => callback();
  const onStorage = (event: StorageEvent) => {
    if (event.key === GALLERY_CHANGED_STORAGE_KEY) callback();
  };

  window.addEventListener(GALLERY_CHANGED_EVENT, onChanged);
  window.addEventListener("storage", onStorage);

  return () => {
    window.removeEventListener(GALLERY_CHANGED_EVENT, onChanged);
    window.removeEventListener("storage", onStorage);
  };
};
