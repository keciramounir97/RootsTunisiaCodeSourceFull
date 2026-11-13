import {
  TUNISIAN_TRIBES,
  type EraAdministrativeDivision,
  type HistoricalEraExtended,
  type HistoricalEraFamily,
  type HistoricalEraLeader,
  type HistoricalEraSite,
  type TribalTerritory,
} from "./historicalMapData";
import {
  HISTORICAL_ERAS_ANCIENT_LOCALES,
  type EraDetailsTranslation,
} from "./historicalMapErasAncientLocales";
import { HISTORICAL_ERAS_MODERN_LOCALES } from "./historicalMapErasModernLocales";
import {
  HISTORICAL_TRIBES_LOCALES,
  type TribeLocaleTranslation,
} from "./historicalMapTribesLocales";

function normalizeLocale(locale?: string): string {
  const clean = (locale || "fr").toLowerCase().split("-")[0];
  return ["fr", "en", "ar", "es", "it", "mt"].includes(clean) ? clean : "fr";
}

export function getTribeLocaleTranslation(
  tribeId: string,
  locale = "fr"
): TribeLocaleTranslation | undefined {
  const clean = normalizeLocale(locale);
  if (clean === "fr") return undefined;
  return HISTORICAL_TRIBES_LOCALES[clean]?.[tribeId];
}

export function localizeTribeForLocale(
  tribe: TribalTerritory,
  locale = "fr"
): TribalTerritory {
  const clean = normalizeLocale(locale);
  if (clean === "fr") return tribe;

  const trans = HISTORICAL_TRIBES_LOCALES[clean]?.[tribe.id];
  if (!trans) {
    return {
      ...tribe,
      name: clean === "ar" && tribe.arabicName ? tribe.arabicName : tribe.name,
    };
  }

  return {
    ...tribe,
    name: trans.name,
    caidat1881: trans.caidat1881 ?? tribe.caidat1881,
    capital: trans.capital ?? tribe.capital,
    homelandDescription: trans.homelandDescription,
    fractions: trans.fractions ?? tribe.fractions,
    alliances: trans.alliances ?? tribe.alliances,
    majbaSources: trans.majbaSources ?? tribe.majbaSources,
    archivalCotes: trans.archivalCotes ?? tribe.archivalCotes,
  };
}

export function getLocalizedTribes(locale = "fr"): TribalTerritory[] {
  const clean = normalizeLocale(locale);
  if (clean === "fr") return TUNISIAN_TRIBES;
  return TUNISIAN_TRIBES.map((tribe) => localizeTribeForLocale(tribe, clean));
}

function getEraDetailsTranslation(
  eraId: string,
  cleanLoc: string
): EraDetailsTranslation | undefined {
  return (
    HISTORICAL_ERAS_ANCIENT_LOCALES[cleanLoc]?.[eraId] ||
    HISTORICAL_ERAS_MODERN_LOCALES[cleanLoc]?.[eraId]
  );
}

export function localizeEraDetailsForLocale(
  era: HistoricalEraExtended,
  locale = "fr"
): {
  eraTribes: HistoricalEraExtended["eraTribes"];
  notableLeaders: HistoricalEraLeader[];
  notableFamilies: HistoricalEraFamily[];
  administrativeDivisions: EraAdministrativeDivision[];
  keySites: HistoricalEraSite[];
  archivalSources: string[];
} {
  const cleanLoc = normalizeLocale(locale);
  if (cleanLoc === "fr") {
    return {
      eraTribes: era.eraTribes,
      notableLeaders: era.notableLeaders || [],
      notableFamilies: era.notableFamilies || [],
      administrativeDivisions: era.administrativeDivisions || [],
      keySites: era.keySites || [],
      archivalSources: era.archivalSources || [],
    };
  }

  const details = getEraDetailsTranslation(era.id, cleanLoc);

  const eraTribes = (era.eraTribes || []).map((tribe) =>
    localizeTribeForLocale(tribe, cleanLoc)
  );

  const notableLeaders: HistoricalEraLeader[] = (era.notableLeaders || []).map(
    (leader, idx) => {
      const tr = details?.leaders[idx];
      if (!tr) {
        return {
          ...leader,
          name:
            cleanLoc === "ar" && leader.arabicName
              ? leader.arabicName
              : leader.name,
        };
      }
      return {
        ...leader,
        name: tr.name,
        role: tr.role,
        reignOrDates: tr.reignOrDates,
        achievements: tr.achievements,
      };
    }
  );

  const notableFamilies: HistoricalEraFamily[] = (
    era.notableFamilies || []
  ).map((family, idx) => {
    const tr = details?.families[idx];
    if (!tr) {
      return {
        ...family,
        name:
          cleanLoc === "ar" && family.arabicName
            ? family.arabicName
            : family.name,
      };
    }
    return {
      ...family,
      name: tr.name,
      role: tr.role,
      origin: tr.origin,
      lineageNotes: tr.lineageNotes,
    };
  });

  const administrativeDivisions: EraAdministrativeDivision[] = (
    era.administrativeDivisions || []
  ).map((div) => {
    const tr = details?.divisions[div.id];
    if (!tr) {
      return {
        ...div,
        name: cleanLoc === "ar" && div.arabicName ? div.arabicName : div.name,
      };
    }
    return {
      ...div,
      name: tr.name,
      seat: tr.seat ?? div.seat,
      chefLieu: tr.chefLieu ?? div.chefLieu,
      description: tr.description,
      historicalTribes: tr.historicalTribes ?? div.historicalTribes,
      archivalNotes: tr.archivalNotes ?? div.archivalNotes,
    };
  });

  const keySites: HistoricalEraSite[] = (era.keySites || []).map((site, idx) => {
    const tr = details?.keySites[idx];
    if (!tr) {
      return {
        ...site,
        name: cleanLoc === "ar" && site.arabicName ? site.arabicName : site.name,
      };
    }
    return {
      ...site,
      name: tr.name,
      role: tr.role,
    };
  });

  const archivalSources: string[] =
    details?.archivalSources && details.archivalSources.length > 0
      ? details.archivalSources
      : era.archivalSources || [];

  return {
    eraTribes,
    notableLeaders,
    notableFamilies,
    administrativeDivisions,
    keySites,
    archivalSources,
  };
}

