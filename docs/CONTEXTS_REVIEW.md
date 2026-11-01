# Roots Tunisia — language and theme contexts

## Language

**Ground truth:** URL prefix (non-default locale) > `?lang=` > localStorage > default `fr`.

Implemented:
- Path-aware initial state in the site's language provider.
- `LocaleSync` keeps context aligned when the user lands on a prefixed URL.
- Language menu writes both storage and the localized path so crawlers and humans share one URL.

Suggested next (not blocking):
- Split monolithic translation files into per-namespace JSON loaded with `import()` so first paint does not parse unused admin strings.
- Deduplicate Egypt's canonical `LanguageContext` vs leftover `legacy.*` keys once the audit is clean.

## Theme

**Ground truth:** explicit user choice in `localStorage.theme`, else `prefers-color-scheme`.

Implemented:
- Zustand store applies class + `dataset.theme` + `color-scheme`.
- Tunisia / Western Sahara `ThemeContext` now reads system preference and stays synced with the store.
- Inline boot script in `index.html` prevents a light-flash on dark clients.

Do not introduce a third theme source (CSS media query fighting the class).
