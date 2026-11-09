import { useCallback, useEffect, useState } from "react";
import { api } from "../api/client";

/**
 * Public "Archives" / "Sources" cards managed by the super admin
 * (Archives Public Content / Sources Public Content pages).
 *
 * `cards` is `null` while loading or when the API is unreachable so pages can
 * keep their built-in defaults instead of rendering an empty section.
 */

export type PublicCardKind = "source" | "archive";

export interface PublicCardTranslation {
  title?: string;
  description?: string;
}

export interface PublicCardDto {
  id: number;
  kind: PublicCardKind;
  title: string;
  description: string;
  link: string;
  translations: Record<string, PublicCardTranslation>;
  sortOrder: number;
  isPublished: boolean;
}

/** The default text of a card is French (site default locale). */
export const CARD_DEFAULT_LOCALE = "fr";

const unwrap = (data: any): PublicCardDto[] => {
  const list = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
  return list as PublicCardDto[];
};

const cache = new Map<PublicCardKind, PublicCardDto[]>();
const listeners = new Set<(kind: PublicCardKind) => void>();

async function fetchKind(kind: PublicCardKind): Promise<PublicCardDto[]> {
  const res = await api.get("/public-cards", { params: { kind } });
  const cards = unwrap(res.data);
  cache.set(kind, cards);
  return cards;
}

/** Call after the admin saved so every mounted public page refreshes. */
export async function refreshPublicCards(kind: PublicCardKind) {
  cache.delete(kind);
  try {
    await fetchKind(kind);
  } catch {
    /* keep defaults */
  }
  listeners.forEach((fn) => fn(kind));
}

export function resolveCardText(
  card: Pick<PublicCardDto, "title" | "description" | "translations">,
  locale: string,
): { title: string; description: string } {
  if (locale === CARD_DEFAULT_LOCALE) {
    return { title: card.title, description: card.description };
  }
  const tr = card.translations?.[locale];
  const en = card.translations?.en;
  return {
    title: tr?.title || en?.title || card.title,
    description: tr?.description || en?.description || card.description,
  };
}

export function usePublicCards(kind: PublicCardKind) {
  const [cards, setCards] = useState<PublicCardDto[] | null>(cache.get(kind) ?? null);
  const [loading, setLoading] = useState(!cache.has(kind));

  const load = useCallback(async () => {
    try {
      setCards(cache.get(kind) ?? (await fetchKind(kind)));
    } catch {
      setCards(null);
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

  return { cards, loading };
}

