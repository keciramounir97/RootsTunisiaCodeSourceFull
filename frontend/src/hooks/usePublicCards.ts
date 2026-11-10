import { useCallback, useEffect, useState } from "react";
import { api } from "../api/client";
import { PUBLIC_CARDS_SEED_FALLBACK } from "../utils/publicCardsFallback";

export type PublicCardKind = "source" | "archive";

export interface PublicCardTranslation {
  title?: string;
  description?: string;
}

export interface PublicCardDto {
  id: number | string;
  kind: PublicCardKind;
  title: string;
  description: string;
  link: string;
  linkUrl?: string;
  translations: Record<string, PublicCardTranslation>;
  titleTranslations?: Record<string, string>;
  descriptionTranslations?: Record<string, string>;
  sortOrder: number;
  isPublished: boolean;
  isActive?: boolean;
}

export type PublicCardRecord = PublicCardDto;

export const CARD_DEFAULT_LOCALE = "fr";

function normalizeCard(raw: any, kind: PublicCardKind): PublicCardDto {
  const link = String(raw?.link || raw?.linkUrl || "").trim();
  const isPublished = raw?.isPublished !== undefined ? Boolean(raw.isPublished) : raw?.isActive !== undefined ? Boolean(raw.isActive) : true;
  
  // Normalize translations
  const translations: Record<string, PublicCardTranslation> = { ...(raw?.translations || {}) };
  if (raw?.titleTranslations || raw?.descriptionTranslations) {
    const titleTr = raw.titleTranslations || {};
    const descTr = raw.descriptionTranslations || {};
    const allKeys = new Set([...Object.keys(titleTr), ...Object.keys(descTr)]);
    for (const loc of allKeys) {
      translations[loc] = {
        title: titleTr[loc] || translations[loc]?.title || "",
        description: descTr[loc] || translations[loc]?.description || "",
      };
    }
  }

  const titleTrMap: Record<string, string> = {};
  const descTrMap: Record<string, string> = {};
  for (const [loc, tr] of Object.entries(translations)) {
    if (tr.title) titleTrMap[loc] = tr.title;
    if (tr.description) descTrMap[loc] = tr.description;
  }

  return {
    id: raw?.id ?? `card-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    kind: (raw?.kind === "archive" ? "archive" : "source") as PublicCardKind,
    title: String(raw?.title || "").trim(),
    description: String(raw?.description || "").trim(),
    link,
    linkUrl: link,
    translations,
    titleTranslations: titleTrMap,
    descriptionTranslations: descTrMap,
    sortOrder: typeof raw?.sortOrder === "number" ? raw.sortOrder : 0,
    isPublished,
    isActive: isPublished,
  };
}

const unwrap = (data: any, kind: PublicCardKind): PublicCardDto[] => {
  const list = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
  return list.map((item: any) => normalizeCard(item, kind));
};

const getSeedForKind = (kind: PublicCardKind): PublicCardDto[] => {
  return PUBLIC_CARDS_SEED_FALLBACK.filter((c) => c.kind === kind).map((c) => normalizeCard(c, kind));
};

const cache = new Map<PublicCardKind, PublicCardDto[]>();
const listeners = new Set<(kind: PublicCardKind) => void>();

async function fetchKind(kind: PublicCardKind): Promise<PublicCardDto[]> {
  try {
    const res = await api.get("/public-cards", { params: { kind } });
    const fetched = unwrap(res.data, kind);
    const valid = fetched.length > 0 ? fetched : getSeedForKind(kind);
    cache.set(kind, valid);
    return valid;
  } catch {
    const seed = getSeedForKind(kind);
    cache.set(kind, seed);
    return seed;
  }
}

/** Call after the admin saved so every mounted public page refreshes immediately. */
export async function refreshPublicCards(kind: PublicCardKind) {
  cache.delete(kind);
  try {
    await fetchKind(kind);
  } catch {
    /* keep seed */
  }
  listeners.forEach((fn) => fn(kind));
}

export function resolveCardText(
  card: Pick<PublicCardDto, "title" | "description" | "translations">,
  locale: string,
): { title: string; description: string } {
  if (!card) return { title: "", description: "" };
  if (locale === CARD_DEFAULT_LOCALE) {
    return { title: card.title || "", description: card.description || "" };
  }
  const tr = card.translations?.[locale];
  const en = card.translations?.en;
  return {
    title: tr?.title || en?.title || card.title || "",
    description: tr?.description || en?.description || card.description || "",
  };
}

export function usePublicCards(kind: PublicCardKind) {
  const initialData = cache.get(kind) ?? getSeedForKind(kind);
  const [cards, setCards] = useState<PublicCardDto[]>(initialData);
  const [loading, setLoading] = useState(!cache.has(kind));
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchKind(kind);
      setCards(data);
    } catch (err: any) {
      setError(err?.message || "Failed to load cards");
      setCards(getSeedForKind(kind));
    } finally {
      setLoading(false);
    }
  }, [kind]);

  useEffect(() => {
    void load();
    const onChange = (changed: PublicCardKind) => {
      if (changed === kind) void load();
    };
    listeners.add(onChange);
    return () => {
      listeners.delete(onChange);
    };
  }, [kind, load]);

  return { cards: cards || [], loading, error, reload: load };
}
