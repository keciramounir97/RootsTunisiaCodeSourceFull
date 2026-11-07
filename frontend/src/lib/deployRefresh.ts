/**
 * After a deploy, hashed assets change. If a proxy briefly serves a stale HTML
 * shell, this watcher detects /build-id.json mismatch and reloads once —
 * users should not need Ctrl+Shift+R.
 */
declare const __APP_BUILD_ID__: string;

const STORAGE_KEY = "roots_app_build_id";
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

export function startDeployRefreshWatcher(): void {
  const localId = typeof __APP_BUILD_ID__ !== "undefined" ? __APP_BUILD_ID__ : "";

  const check = async () => {
    if (reloading || typeof document !== "undefined" && document.hidden) return;
    const remote = await fetchRemoteBuildId();
    if (!remote) return;

    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) {
      sessionStorage.setItem(STORAGE_KEY, remote);
      return;
    }

    // New deploy published a different build-id (or this tab still runs an old bundle).
    if (stored !== remote || (localId && localId !== remote && stored === localId)) {
      sessionStorage.setItem(STORAGE_KEY, remote);
      reloading = true;
      window.location.reload();
    }
  };

  window.setTimeout(() => {
    void check();
  }, 1200);

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") void check();
  });
  window.addEventListener("focus", () => {
    void check();
  });
}
