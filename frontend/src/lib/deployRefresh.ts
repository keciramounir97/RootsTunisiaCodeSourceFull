/**
 * After a deploy, hashed assets change. This watcher detects /build-id.json
 * mismatches AND catches Vite lazy-chunk preload errors, clearing stale cache
 * and reloading once automatically so users never need Ctrl+R / Ctrl+Shift+R.
 */
declare const __APP_BUILD_ID__: string;

const STORAGE_KEY = "roots_app_build_id";
const CHUNK_RELOAD_KEY = "roots_chunk_reload_ts";
let reloading = false;

async function fetchRemoteBuildId(): Promise<string | null> {
  try {
    const res = await fetch(`/build-id.json?_=${Date.now()}`, {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { id?: string };
    return typeof data?.id === "string" ? data.id : null;
  } catch {
    return null;
  }
}

function triggerCleanReload(newId?: string) {
  if (reloading) return;
  reloading = true;
  try {
    if (newId) sessionStorage.setItem(STORAGE_KEY, newId);
    localStorage.removeItem("roots-egypt-query-cache");
    localStorage.removeItem("roots-tunisia-query-cache");
    if ("caches" in window) {
      void caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k))));
    }
  } catch {
    // ignore storage errors
  }
  window.location.reload();
}

export function startDeployRefreshWatcher(): void {
  const localId = typeof __APP_BUILD_ID__ !== "undefined" ? __APP_BUILD_ID__ : "";

  const check = async () => {
    if (reloading || (typeof document !== "undefined" && document.hidden)) return;
    const remote = await fetchRemoteBuildId();
    if (!remote) return;

    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) {
      sessionStorage.setItem(STORAGE_KEY, remote);
      if (localId && localId !== remote) {
        triggerCleanReload(remote);
      }
      return;
    }

    if (stored !== remote || (localId && localId !== remote)) {
      triggerCleanReload(remote);
    }
  };

  // Auto-recover if a lazy-loaded JS/CSS chunk 404s after a new deploy
  window.addEventListener("vite:preloadError", (event) => {
    event.preventDefault();
    try {
      const last = Number(sessionStorage.getItem(CHUNK_RELOAD_KEY) || "0");
      if (Date.now() - last > 10_000) {
        sessionStorage.setItem(CHUNK_RELOAD_KEY, String(Date.now()));
        triggerCleanReload();
      }
    } catch {
      triggerCleanReload();
    }
  });

  window.setTimeout(() => {
    void check();
  }, 1000);

  // Periodic background check every 60s when visible
  window.setInterval(() => {
    void check();
  }, 60_000);

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") void check();
  });
  window.addEventListener("focus", () => {
    void check();
  });
}
