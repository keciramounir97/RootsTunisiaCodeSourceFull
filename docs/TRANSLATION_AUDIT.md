# Tunisia translation audit — 1 October 2026

Locales in `frontend/src/locales/`: `en`, `fr`, `ar`, `es`, `it`, `mt`, `eo` (7). `SUPPORTED_LOCALES` matches.

Runtime check: `/about` renders French (default); `/ar/about` renders Arabic hero, pillars, legal footer, and nav. Atlas chrome strings now go through `t("map_atlas_*")`.

Dossier bodies inside `TunisiaGovernoratesMap` (`regionDossiers`) remain bilingual English + `titleAr`. Translating every dossier paragraph into seven languages is a content pass, not a product gap.

No git push.
